import { Component } from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {DataSelectElementComponent} from "./data-select-element/data-select-element.component";
import {ReactiveFormsModule} from "@angular/forms";
import {AbstractInputComponent} from "../abstract-input.component";

@Component({
  selector: 'fg-data-select',
  imports: [
    NgForOf,
    NgIf,
    DataSelectElementComponent,
    ReactiveFormsModule
  ],
  templateUrl: './data-select.component.html',
  styleUrl: './data-select.component.scss'
})
export class DataSelectComponent extends AbstractInputComponent {

}
