import {ComponentRef, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, delay, map, Observable, of, retry, Subject, throwError, timer} from "rxjs";
import {FormElement, FormConfig} from "./dynamic-form.types";
import {validateFormConfig} from "./validators/config-validator";
import {LoadingState, LoadingStateHelper} from "./types/loading-state";


export type ElementAddedPayload = {
  element: FormElement;
  targetContainerId: string;
}

export type ElementRemovedPayload = {
  elementId: string;
}

/**
 * Cache entry for storing cached data with TTL
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {

  componentRefs: {[key: string]: ComponentRef<any>} = {};

  elementAdded = new Subject<ElementAddedPayload>();
  elementRemoved = new Subject<ElementRemovedPayload>();
  onShowLoadingIndicator = new Subject<null>();
  onHideLoadingIndicator = new Subject<null>();
  onPopulateFormData = new Subject<any>();

  /**
   * Loading state management for form configurations
   */
  public loadingState$ = new BehaviorSubject<LoadingState<FormConfig>>(LoadingStateHelper.idle());

  /**
   * Cache for form configurations (5-min TTL)
   */
  private formConfigCache = new Map<string, CacheEntry<FormConfig>>();

  /**
   * Cache for dropdown options (10-min TTL)
   */
  private dropdownCache = new Map<string, CacheEntry<any>>();

  /**
   * TTL constants (in milliseconds)
   */
  private readonly FORM_CONFIG_TTL = 5 * 60 * 1000;  // 5 minutes
  private readonly DROPDOWN_TTL = 10 * 60 * 1000;    // 10 minutes

  /**
   * Retry configuration
   */
  private readonly MAX_RETRIES = 3;
  private readonly INITIAL_RETRY_DELAY = 1000;  // 1 second

  constructor(private http: HttpClient) {}

  /**
   * Loads and validates a form configuration from a remote URL with caching and retry logic
   *
   * @param url - The URL to fetch the form configuration from
   * @param bypassCache - If true, ignores cache and fetches fresh data
   * @returns Observable of the validated form configuration
   * @throws Error if validation fails
   */
  loadForm(url: string, bypassCache: boolean = false): Observable<FormConfig> {
    // Check cache first
    if (!bypassCache) {
      const cached = this.getFromCache(this.formConfigCache, url);
      if (cached) {
        this.loadingState$.next(LoadingStateHelper.success(cached));
        return of(cached);
      }
    }

    // Update loading state
    this.loadingState$.next(LoadingStateHelper.loading());
    const startTime = Date.now();

    return this.http.get(url).pipe(
      // Retry with exponential backoff
      this.retryWithBackoff(this.MAX_RETRIES, this.INITIAL_RETRY_DELAY),

      // Validate configuration
      map((config: any) => {
        const validationResult = validateFormConfig(config);

        if (!validationResult.valid) {
          const errorMessages = validationResult.errors!
            .map(e => `${e.path}: ${e.message}`)
            .join(', ');
          throw new Error(`Invalid form configuration: ${errorMessages}`);
        }

        const validatedConfig = validationResult.data!;

        // Cache the validated configuration
        this.addToCache(this.formConfigCache, url, validatedConfig, this.FORM_CONFIG_TTL);

        // Update loading state
        this.loadingState$.next(LoadingStateHelper.success(validatedConfig, startTime));

        return validatedConfig;
      }),

      catchError((error) => {
        console.error('Form configuration load/validation failed:', error);

        // Update loading state with error
        this.loadingState$.next(LoadingStateHelper.error({
          message: error.message || 'Failed to load form configuration',
          statusCode: error.status,
          originalError: error
        }, startTime));

        return throwError(() => error);
      })
    );
  }

  /**
   * Loads dropdown options from a remote URL with caching
   *
   * @param url - The URL to fetch dropdown options from
   * @param bypassCache - If true, ignores cache and fetches fresh data
   * @returns Observable of dropdown options
   */
  loadDropdownOptions(url: string, bypassCache: boolean = false): Observable<any[]> {
    // Check cache first
    if (!bypassCache) {
      const cached = this.getFromCache(this.dropdownCache, url);
      if (cached) {
        return of(cached);
      }
    }

    return this.http.get<any[]>(url).pipe(
      // Retry with exponential backoff
      retry({
        count: this.MAX_RETRIES,
        delay: (error, retryCount) => {
          const delayTime = this.INITIAL_RETRY_DELAY * Math.pow(2, retryCount - 1);
          console.log(`Dropdown retry attempt ${retryCount} after ${delayTime}ms delay`, error);
          return timer(delayTime);
        }
      }),

      map((options: any[]) => {
        // Cache the options
        this.addToCache(this.dropdownCache, url, options, this.DROPDOWN_TTL);
        return options;
      }),

      catchError((error) => {
        console.error('Dropdown options load failed:', error);
        return throwError(() => error);
      })
    );
  }

  addElement(element: FormElement, targetId: string): void {
    this.elementAdded.next({element: element, targetContainerId: targetId})
  }

  removeElement(elementId: string): void {
    this.elementRemoved.next({elementId: elementId})
    this.removeComponentRef(elementId)
  }

  addComponentRef(componentRef: ComponentRef<any>): void {
    this.componentRefs[componentRef.instance.key] = componentRef
  }

  removeComponentRef(id: string): void {
    this.componentRefs[id].destroy()
  }

  populateFormData(data: any) {
    this.onPopulateFormData.next(data)
  }

  loadFormData(url: string): void {
    this.showLoadingIndicator()
    this.http.get(url).pipe(
      catchError((err) => {
        console.log(err)
        this.hideLoadingIndicator()
        return throwError(() => new Error('Oops! Something went wrong. Please try again later.'));
      })
    ).subscribe((data: any) => {
      this.onPopulateFormData.next(data)
      this.hideLoadingIndicator()
    })
  }

  showLoadingIndicator(): void {
    this.onShowLoadingIndicator.next(null)
  }

  hideLoadingIndicator(): void {
    this.onHideLoadingIndicator.next(null)
  }

  /**
   * Adds data to cache with TTL
   */
  private addToCache<T>(cache: Map<string, CacheEntry<T>>, key: string, data: T, ttl: number): void {
    cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Gets data from cache if not expired
   */
  private getFromCache<T>(cache: Map<string, CacheEntry<T>>, key: string): T | null {
    const entry = cache.get(key);

    if (!entry) {
      return null;
    }

    const age = Date.now() - entry.timestamp;

    if (age > entry.ttl) {
      // Cache expired, remove it
      cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Clears all caches
   */
  clearAllCaches(): void {
    this.formConfigCache.clear();
    this.dropdownCache.clear();
  }

  /**
   * Clears form configuration cache
   */
  clearFormConfigCache(): void {
    this.formConfigCache.clear();
  }

  /**
   * Clears dropdown options cache
   */
  clearDropdownCache(): void {
    this.dropdownCache.clear();
  }

  /**
   * Retry operator with exponential backoff
   * Retries failed HTTP requests with increasing delays
   */
  private retryWithBackoff(maxRetries: number, initialDelay: number) {
    return retry({
      count: maxRetries,
      delay: (error, retryCount) => {
        // Calculate exponential backoff delay: initialDelay * 2^retryCount
        const delayTime = initialDelay * Math.pow(2, retryCount - 1);

        console.log(`Retry attempt ${retryCount} after ${delayTime}ms delay`, error);

        return timer(delayTime);
      }
    });
  }
}
