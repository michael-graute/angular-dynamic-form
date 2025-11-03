import { Component } from '@angular/core';
import {AbstractInputComponent} from "../abstract-input.component";
import {ReactiveFormsModule} from "@angular/forms";


@Component({
  selector: 'fg-checkbox',
  imports: [
    ReactiveFormsModule
],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss'
})
export class CheckboxComponent extends AbstractInputComponent {

}
