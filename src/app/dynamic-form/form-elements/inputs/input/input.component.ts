import {Component} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {AbstractInputComponent} from "../abstract-input.component";

@Component({
    selector: 'fg-text-input',
  imports: [
    ReactiveFormsModule,
    NgIf,
    JsonPipe,
    NgForOf
  ],
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss'
})
export class InputComponent extends AbstractInputComponent {}
