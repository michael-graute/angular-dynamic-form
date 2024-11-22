import {Component} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {JsonPipe, NgIf} from "@angular/common";
import {AbstractInputComponent} from "../../abstract-input.component";

@Component({
    selector: 'fg-text-input',
    imports: [
        ReactiveFormsModule,
        NgIf,
        JsonPipe
    ],
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss'
})
export class InputComponent extends AbstractInputComponent {}
