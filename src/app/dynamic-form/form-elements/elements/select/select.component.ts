import { Component } from '@angular/core';
import {AbstractInputComponent} from "../../abstract-input.component";
import {ReactiveFormsModule} from "@angular/forms";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";

@Component({
    selector: 'fg-select-input',
    imports: [
        ReactiveFormsModule,
        NgForOf,
        NgIf,
        JsonPipe
    ],
    templateUrl: './select.component.html',
    styleUrl: './select.component.scss'
})
export class SelectComponent extends AbstractInputComponent {}
