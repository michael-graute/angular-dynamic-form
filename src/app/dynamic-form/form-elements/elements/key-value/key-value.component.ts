import {Component, forwardRef, Input} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor, FormControlName,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR, ReactiveFormsModule,
  ValidationErrors,
  Validator
} from "@angular/forms";
import {AbstractInputComponent} from "../../abstract-input.component";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {KeyValueElementComponent} from "./key-value-element/key-value-element.component";

@Component({
  selector: 'fg-key-value',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    NgForOf,
    KeyValueElementComponent,
    NgIf
  ],
  templateUrl: './key-value.component.html',
  styleUrl: './key-value.component.scss'
})
export class KeyValueComponent extends AbstractInputComponent {}
