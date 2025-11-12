import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";

import {AbstractInputComponent} from "../abstract-input.component";

@Component({
    selector: 'fg-textarea',
  imports: [
    ReactiveFormsModule
],
    templateUrl: './textarea.component.html',
    styleUrl: './textarea.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextareaComponent extends AbstractInputComponent {}
