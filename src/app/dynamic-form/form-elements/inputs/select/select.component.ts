import { Component } from '@angular/core';
import {AbstractInputComponent} from "../abstract-input.component";
import {ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

@Component({
    selector: 'fg-select-input',
    imports: [
        ReactiveFormsModule,
        NgForOf,
        NgIf
    ],
    templateUrl: './select.component.html',
    styleUrl: './select.component.scss'
})
export class SelectComponent extends AbstractInputComponent {}
