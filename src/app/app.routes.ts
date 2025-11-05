import { Routes } from '@angular/router';
import {SimpleFormComponent} from "./examples/simple-form/simple-form.component";
import {SimpleAjaxFormComponent} from "./examples/simple-ajax-form/simple-ajax-form.component";
import {FormLayoutsComponent} from "./examples/form-layouts/form-layouts.component";
import {FormInputsComponent} from "./examples/form-inputs/form-inputs.component";
import {ValidationExamplesComponent} from "./examples/validation-examples/validation-examples.component";
import {EditUserFormComponent} from "./examples/edit-user-form/edit-user-form.component";
import {DataSelectExampleComponent} from "./examples/data-select-example/data-select-example.component";
import {CustomCallbacksComponent} from "./examples/custom-callbacks/custom-callbacks.component";
import {HomeComponent} from "./examples/home/home.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
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
  },
  {
    path: 'validation-examples',
    component: ValidationExamplesComponent
  },
  {
    path: 'edit-user-form',
    component: EditUserFormComponent
  },
  {
    path: 'data-select-example',
    component: DataSelectExampleComponent
  },
  {
    path: 'custom-callbacks',
    component: CustomCallbacksComponent
  }
];
