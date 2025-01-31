import {ComponentRef, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, Subject, throwError} from "rxjs";
import {FormElement} from "./dynamic-form.types";


export type ElementAddedPayload = {
  element: FormElement;
  targetContainerId: string;
}

export type ElementRemovedPayload = {
  elementId: string;
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

  constructor(private http: HttpClient) {}

  loadForm(url: string): Observable<any> {
    return this.http.get(url)
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
}
