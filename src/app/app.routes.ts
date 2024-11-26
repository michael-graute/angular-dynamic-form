import { Routes } from '@angular/router';
import {SimpleFormComponent} from "./examples/simple-form/simple-form.component";
import {SimpleAjaxFormComponent} from "./examples/simple-ajax-form/simple-ajax-form.component";

export const routes: Routes = [
  {
    path: 'simple-form',
    component: SimpleFormComponent
  },
  {
    path: 'simple-ajax-form',
    component: SimpleAjaxFormComponent
  }
];
