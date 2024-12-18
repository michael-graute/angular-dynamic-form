import {Component} from '@angular/core';
import {
  ReactiveFormsModule,
} from "@angular/forms";
import {AbstractInputComponent} from "../abstract-input.component";
import {NgForOf, NgIf} from "@angular/common";
import {KeyValueElementComponent} from "./key-value-element/key-value-element.component";

@Component({
    selector: 'fg-key-value',
  imports: [
    ReactiveFormsModule,
    KeyValueElementComponent,
    NgIf,
    NgForOf
  ],
    templateUrl: './key-value.component.html',
    styleUrl: './key-value.component.scss'
})
export class KeyValueComponent extends AbstractInputComponent {}
