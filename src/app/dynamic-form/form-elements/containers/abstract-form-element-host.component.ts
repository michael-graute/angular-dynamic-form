import {Component, ComponentRef, HostBinding, Input, OnInit, ViewChild} from '@angular/core';
import {DynamicFormElementInterface} from "../../dynamic-form-element.interface";
import {FormElement} from "../../dynamic-form.types";
import {FormElementHostDirective} from "../form-element-host.directive";
import {FormElementMap} from "../../form-elements.map";
import {FormGroup} from "@angular/forms";
import {DynamicFormService, ElementAddedPayload} from "../../dynamic-form.service";

@Component({standalone: true, template: ``})
export abstract class AbstractFormElementHostComponent<T> implements OnInit {
  @Input() form = new FormGroup({})
  @Input() debug = false;

  @ViewChild(FormElementHostDirective, {static: true}) formElementHost!: FormElementHostDirective;

  @HostBinding('class') className = '';

  constructor(protected dynamicFormService: DynamicFormService) {
  }

  children: FormElement[] = [];
  id: string = '';
  config: FormElement | undefined;

  ngOnInit(): void {
    if(this.config?.class) this.className = this.className + ' ' + this.config?.class

    this.children.forEach(element => {
      this.addFormElement(element);
    })

    this.dynamicFormService.elementAdded.subscribe((payload: ElementAddedPayload) => {
      if(payload.targetContainerId === this.id) {
        this.addFormElement(payload.element)
      }
    })
  }

  addFormElement(formElement: FormElement): ComponentRef<any> {
    // @ts-ignore
    const componentRef: ComponentRef<DynamicFormElementInterface> = this.formElementHost.viewContainerRef.createComponent<DynamicFormElementInterface>(FormElementMap[formElement.type])
    componentRef.instance.id = formElement.key
    componentRef.instance.children = formElement.children
    componentRef.instance.form = this.form
    componentRef.instance.config = formElement
    componentRef.instance.debug = this.debug
    this.dynamicFormService.addComponentRef(componentRef, formElement.key)
    return componentRef;
  }
}
