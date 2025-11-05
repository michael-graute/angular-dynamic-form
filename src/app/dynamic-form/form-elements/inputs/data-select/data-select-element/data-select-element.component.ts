import {Component, forwardRef, Input, OnInit, ChangeDetectorRef} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from "@angular/forms";
import {CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf} from '@angular/cdk/scrolling';

import {DynamicFormService} from "../../../../dynamic-form.service";

@Component({
  selector: 'fg-data-select-element',
  imports: [
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf
  ],
  templateUrl: './data-select-element.component.html',
  styleUrl: './data-select-element.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DataSelectElementComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => DataSelectElementComponent)
    }
  ]
})
export class DataSelectElementComponent implements OnInit, ControlValueAccessor, Validator {
  @Input() settings: any = {}
  @Input() id: string = ''
  @Input() options: any[] = []

  showDataList: boolean = false;
  loading: boolean = false;
  error: string | null = null;

  value: any = null;
  selectedOption: any = null;

  /**
   * Threshold for enabling virtual scrolling (>100 options)
   */
  readonly VIRTUAL_SCROLL_THRESHOLD = 100;

  /**
   * Item height in pixels for virtual scrolling
   */
  readonly ITEM_HEIGHT = 40;

  /**
   * Viewport height in pixels (shows ~10 items at once)
   */
  readonly VIEWPORT_HEIGHT = this.ITEM_HEIGHT * 10;

  constructor(
    private dynamicFormService: DynamicFormService,
    private cdr: ChangeDetectorRef
  ) {}

  toggleDataList(): void {
    this.showDataList = !this.showDataList;
  }

  optionClicked(dataset: any): void {
    this.showDataList = false;

    // Store the full dataset for display purposes
    this.selectedOption = dataset;

    // Extract value using valueKey if specified, otherwise use full object
    if (this.settings.valueKey) {
      this.value = dataset[this.settings.valueKey];
    } else {
      this.value = dataset;
    }

    this.onChange(this.value);
  }

  /**
   * Gets the display label for the currently selected option
   */
  getDisplayLabel(): string {
    if (!this.selectedOption) {
      return '';
    }

    // Use labelKey if specified, otherwise use valueKey, otherwise stringify
    if (this.settings.labelKey) {
      return this.selectedOption[this.settings.labelKey] ?? '';
    } else if (this.settings.valueKey && typeof this.selectedOption === 'object') {
      return this.selectedOption[this.settings.valueKey] ?? '';
    } else {
      return String(this.selectedOption);
    }
  }

  /**
   * Gets the display label for an option in the dropdown list
   */
  getOptionLabel(dataset: any): string {
    if (this.settings.labelKey) {
      return dataset[this.settings.labelKey] ?? '';
    } else if (this.settings.valueKey) {
      return dataset[this.settings.valueKey] ?? '';
    } else {
      return String(dataset);
    }
  }

  ngOnInit() {
    if(this.settings.asyncURL) {
      this.loading = true;
      this.error = null;

      // Use DynamicFormService for caching and retry logic
      this.dynamicFormService.loadDropdownOptions(this.settings.asyncURL).subscribe({
        next: (data: any) => {
          this.options = data;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err: any) => {
          console.error('Failed to load dropdown options:', err);
          this.error = 'Failed to load options. Please try again.';
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
    }
  }

  onChange = (value: any) => {};

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return null;
  }

  writeValue(obj: any): void {
  }

  /**
   * Determines if virtual scrolling should be enabled
   * Returns true if the number of options exceeds the threshold
   */
  shouldUseVirtualScroll(): boolean {
    return this.options.length > this.VIRTUAL_SCROLL_THRESHOLD;
  }

  /**
   * TrackBy function for option list optimization
   */
  trackByOption(index: number, option: any): any {
    return option[this.settings.valueKey] ?? option ?? index;
  }
}
