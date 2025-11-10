//import {MainTab} from "../navigation/interfaces/navigation.interfaces";

import {FormGroup} from "@angular/forms";
import {FormElement} from "./dynamic-form.types";

export interface DynamicFormElementInterface {
  id: string;
  key: string;
  form: FormGroup;
  children?: any[];
  config?: FormElement
  debug?: boolean;
}
