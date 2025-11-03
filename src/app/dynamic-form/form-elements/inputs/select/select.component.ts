import { Component } from '@angular/core';
import {AbstractInputComponent} from "../abstract-input.component";
import {ReactiveFormsModule} from "@angular/forms";


@Component({
    selector: 'fg-select-input',
    imports: [
    ReactiveFormsModule
],
    templateUrl: './select.component.html',
    styleUrl: './select.component.scss'
})
export class SelectComponent extends AbstractInputComponent {}
