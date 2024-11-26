import { Component } from '@angular/core';
import {DynamicFormComponent} from "../../dynamic-form/dynamic-form.component";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'fg-simple-ajax-form',
  imports: [
    DynamicFormComponent
  ],
  templateUrl: './simple-ajax-form.component.html',
  styleUrl: './simple-ajax-form.component.scss'
})
export class SimpleAjaxFormComponent {
  showConfig = false;

  formSubmit(formGroup: FormGroup): void {
    console.log(formGroup.getRawValue());
  }

  toggleFormConfig() {
    this.showConfig = !this.showConfig;
  }

}
