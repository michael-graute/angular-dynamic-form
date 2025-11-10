import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";

import {AbstractInputComponent} from "../abstract-input.component";

@Component({
    selector: 'fg-input',
  imports: [
    ReactiveFormsModule
],
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent extends AbstractInputComponent {}
