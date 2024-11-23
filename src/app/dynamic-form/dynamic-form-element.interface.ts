//import {MainTab} from "../navigation/interfaces/navigation.interfaces";

import {FormGroup} from "@angular/forms";
import {FormElement} from "./dynamic-form.types";

export interface DynamicFormElementInterface {
  id: string;
  form: FormGroup;
  formGroup?: FormGroup | null;
  children?: any[];
  config?: FormElement
  debug?: boolean;
}
