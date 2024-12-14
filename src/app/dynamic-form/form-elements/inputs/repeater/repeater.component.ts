import { Component } from '@angular/core';
import {DynamicFormComponent} from "../../../dynamic-form.component";
import {AbstractInputComponent} from "../abstract-input.component";
import {ReactiveFormsModule} from "@angular/forms";
import {FormConfig} from "../../../dynamic-form.types";
import {config} from "rxjs";
import {RepeaterElementComponent} from "./repeater-element/repeater-element.component";

@Component({
  selector: 'fg-repeater',
  imports: [
    DynamicFormComponent,
    ReactiveFormsModule,
    RepeaterElementComponent
  ],
  templateUrl: './repeater.component.html',
  styleUrl: './repeater.component.scss'
})
export class RepeaterComponent extends AbstractInputComponent {

  formConfig: FormConfig = {
    elements: [],
    buttons: []
  }
  constructor() {
    super();
    this.formConfig.elements = this.config?.children ?? []
  }

}
