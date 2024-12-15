import {Component} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {AbstractInputComponent} from "../abstract-input.component";

@Component({
    selector: 'fg-text-input',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss'
})
export class InputComponent extends AbstractInputComponent {}
