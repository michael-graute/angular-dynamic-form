import {Component, ComponentRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {FormElementHostDirective} from "./form-elements/form-element-host.directive";
import {DynamicFormElementInterface} from "./dynamic-form-element.interface";
import {FormElementMap} from "./form-elements.map";
import {FormButtonCallback, FormConfig, FormElement} from "./dynamic-form.types";
import {NgForOf, NgIf} from "@angular/common";
import {DynamicFormService, ElementAddedPayload} from "./dynamic-form.service";

export type CustomButtonCallBackPayload = {
  form: FormGroup,
  callBack: FormButtonCallback
}

@Component({
  selector: 'fg-dynamic-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormElementHostDirective,
    NgForOf,
    NgIf
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent implements OnInit {
  @Input() id: string = '';
  @Input() formConfig: FormConfig = {buttons:[], elements: []};
  @Input() form = new FormGroup({})
  @Input() debug = false;
  @Input() asyncUrl: string | null = null;

  @Output() onCustomCallBack = new EventEmitter<CustomButtonCallBackPayload>();
  @Output() onFormSubmit = new EventEmitter<FormGroup>();
  @Output() onFormCancel = new EventEmitter<FormGroup>();
  @Output() onFormReset = new EventEmitter<FormGroup>();

  @ViewChild(FormElementHostDirective, {static: true}) formElementHost!: FormElementHostDirective;

  constructor(private dynamicFormService: DynamicFormService) {
  }

  addFormElement(formElement: FormElement) {
    // @ts-ignore
    const componentRef: ComponentRef<DynamicFormElementInterface> = this.formElementHost.viewContainerRef.createComponent<DynamicFormElementInterface>(FormElementMap[formElement.type])
    componentRef.instance.id = formElement.key
    componentRef.instance.children = formElement.children
    componentRef.instance.form = this.form
    componentRef.instance.config = formElement
    componentRef.instance.debug = this.debug
    this.dynamicFormService.addComponentRef(componentRef, formElement.key)
  }


  ngOnInit() {
    if(this.asyncUrl != null){
      this.dynamicFormService.loadForm(this.asyncUrl).subscribe((formConfig: FormConfig) => {
        this.formConfig = formConfig;
        this.formConfig.elements.forEach(element => {
          this.addFormElement(element);
        })
      })
    } else {
      this.formConfig.elements.forEach(element => {
        this.addFormElement(element);
      })
    }
    this.dynamicFormService.elementAdded.subscribe((payload: ElementAddedPayload) => {
      if(payload.targetContainerId === this.id) {
        this.addFormElement(payload.element)
      }
    })
  }
  formSubmit(context: DynamicFormComponent) {
    context.onFormSubmit.emit(context.form);
  }

  formCancel(context: DynamicFormComponent) {
    context.onFormCancel.emit(context.form);
  }

  formReset(context: DynamicFormComponent) {
    context.onFormReset.emit(context.form);
  }

  buttonClick(callback: FormButtonCallback) {
    const finalParameters = [this].concat(callback.params ?? []);
    if(callback) {
      //@ts-ignore
      if (typeof this[callback.function] === 'function') {
        //@ts-ignore
        const fn: Function = this[callback.function];
        fn.apply(null, finalParameters);
      } else {
        this.onCustomCallBack.emit({form: this.form, callBack: callback});
      }
    }
  }
}
