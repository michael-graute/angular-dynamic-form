import { Component } from '@angular/core';
import {AbstractFormElementHostComponent} from "../abstract-form-element-host.component";
import {DynamicFormElementInterface} from "../../../dynamic-form-element.interface";
import {NgIf} from "@angular/common";
import {FormElementHostDirective} from "../../form-element-host.directive";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
    selector: 'fg-card',
    imports: [
        NgIf,
        FormElementHostDirective,
        ReactiveFormsModule
    ],
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss'
})
export class CardComponent extends AbstractFormElementHostComponent<CardComponent> implements DynamicFormElementInterface {

}
