import { Component } from '@angular/core';
import {AbstractInputComponent} from "../abstract-input.component";
import {ReactiveFormsModule} from "@angular/forms";
import {FormConfig} from "../../../dynamic-form.types";
import {RepeaterElementComponent} from "./repeater-element/repeater-element.component";

@Component({
  selector: 'fg-repeater',
  imports: [
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
