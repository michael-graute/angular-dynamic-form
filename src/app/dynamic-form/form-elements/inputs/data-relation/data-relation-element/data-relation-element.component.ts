import {Component, ComponentRef, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor, FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from "@angular/forms";
import {FormConfig, FormElement} from "../../../../dynamic-form.types";
import {DynamicFormService} from "../../../../dynamic-form.service";
import {FormElementHostDirective} from "../../../form-element-host.directive";
import {DynamicFormElementInterface} from "../../../../dynamic-form-element.interface";
import {FormElementMap} from "../../../../form-elements.map";

@Component({
  selector: 'fg-data-relation-element',
  imports: [
    FormElementHostDirective,
  ],
  templateUrl: './data-relation-element.component.html',
  styleUrl: './data-relation-element.component.scss',
  providers: [
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DataRelationElementComponent),
    multi: true
  },
  {
    provide: NG_VALIDATORS,
    multi: true,
    useExisting: forwardRef(() => DataRelationElementComponent)
  }
]
})
export class DataRelationElementComponent implements ControlValueAccessor, Validator, OnInit  {
  @ViewChild(FormElementHostDirective, {static: true}) formElementHost!: FormElementHostDirective;
  @Input() id: string = '';
  @Input() settings: any | undefined;
  @Input() debug = false;
  @Input() value: any = {}
  @Input() formConfig: FormConfig | undefined;
  @Input() form = new FormGroup({})

  constructor(private dynamicFormService: DynamicFormService) {
  }

  addFormElement(formElement: FormElement) {
    // @ts-ignore
    const componentRef: ComponentRef<DynamicFormElementInterface> = this.formElementHost.viewContainerRef.createComponent<DynamicFormElementInterface>(FormElementMap[formElement.type])
    componentRef.instance.id = this.id + formElement.key
    componentRef.instance.key = formElement.key
    componentRef.instance.children = formElement.children
    componentRef.instance.form = this.form
    componentRef.instance.config = formElement
    componentRef.instance.debug = this.debug
    this.dynamicFormService.addComponentRef(componentRef)
  }

  ngOnInit() {
    if(!this.formConfig) {
      this.dynamicFormService.loadForm(this.settings.asyncUrl).subscribe((data: FormConfig) => {
        data.elements.forEach((element: FormElement) => {
          this.addFormElement(element);
        })
      })
    } else {
      this.formConfig.elements.forEach((element: FormElement) => {
        this.addFormElement(element);
      })
    }
    this.form.valueChanges.subscribe((value) => {
      this.value = value
      this.onChange(this.value)
    })
  }

  onChange = (value: any) => {};

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
  }

  registerOnValidatorChange(fn: () => void): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if(!this.form.valid) {
      return {'subform': true}
    }
    return null
  }

  writeValue(obj: any): void {
    this.value = obj
    this.form.patchValue(obj)
  }

}
