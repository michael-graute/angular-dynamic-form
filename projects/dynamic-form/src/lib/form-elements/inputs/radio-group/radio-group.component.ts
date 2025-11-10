import { Component } from '@angular/core';
import {AbstractInputComponent} from "../abstract-input.component";

import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'fg-radio-group',
  imports: [
    ReactiveFormsModule
],
  templateUrl: './radio-group.component.html',
  styleUrl: './radio-group.component.scss'
})
export class RadioGroupComponent extends AbstractInputComponent {

}
