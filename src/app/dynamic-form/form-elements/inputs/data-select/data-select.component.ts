import { Component } from '@angular/core';

import {DataSelectElementComponent} from "./data-select-element/data-select-element.component";
import {ReactiveFormsModule} from "@angular/forms";
import {AbstractInputComponent} from "../abstract-input.component";

@Component({
  selector: 'fg-data-select',
  imports: [
    DataSelectElementComponent,
    ReactiveFormsModule
],
  templateUrl: './data-select.component.html',
  styleUrl: './data-select.component.scss'
})
export class DataSelectComponent extends AbstractInputComponent {

}
