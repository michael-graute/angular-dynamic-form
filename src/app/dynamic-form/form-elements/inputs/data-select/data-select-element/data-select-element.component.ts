import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {DataSelectElementService} from "./data-select-element.service";

@Component({
  selector: 'fg-data-select-element',
  imports: [
    NgIf,
    NgForOf
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

  value: any = null;

  constructor(private dataService: DataSelectElementService) {}

  toggleDataList(): void {
    this.showDataList = !this.showDataList;
  }

  optionClicked(dataset: any): void {
    this.showDataList = false;
    this.value = dataset;
    this.onChange(this.value);
  }

  ngOnInit() {
    if(this.settings.asyncURL) {
      this.dataService.loadData(this.settings.asyncURL).subscribe((data: any) => {
        this.options = data;
      })
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
}
