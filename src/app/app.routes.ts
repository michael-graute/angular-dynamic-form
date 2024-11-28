import { Routes } from '@angular/router';
import {SimpleFormComponent} from "./examples/simple-form/simple-form.component";
import {SimpleAjaxFormComponent} from "./examples/simple-ajax-form/simple-ajax-form.component";
import {FormLayoutsComponent} from "./examples/form-layouts/form-layouts.component";
import {FormInputsComponent} from "./examples/form-inputs/form-inputs.component";

export const routes: Routes = [
  {
    path: 'simple-form',
    component: SimpleFormComponent
  },
  {
    path: 'simple-ajax-form',
    component: SimpleAjaxFormComponent
  },
  {
    path: 'form-layouts',
    component: FormLayoutsComponent
  },
  {
    path: 'form-inputs',
    component: FormInputsComponent
  }
];
