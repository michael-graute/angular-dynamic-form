import { Component, ChangeDetectionStrategy } from '@angular/core';
import {AbstractFormElementHostComponent} from "../abstract-form-element-host.component";
import {DynamicFormElementInterface} from "../../../dynamic-form-element.interface";

import {FormElementHostDirective} from "../../form-element-host.directive";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
    selector: 'fg-card',
    imports: [
    FormElementHostDirective,
    ReactiveFormsModule
],
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent extends AbstractFormElementHostComponent<CardComponent> implements DynamicFormElementInterface {

}
