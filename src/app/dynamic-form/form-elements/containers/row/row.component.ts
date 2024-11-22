import {Component, OnInit} from '@angular/core';
import {AbstractFormElementHostComponent} from "../abstract-form-element-host.component";
import {DynamicFormElementInterface} from "../../../dynamic-form-element.interface";
import {FormElement} from "../../../dynamic-form.types";
import {FormElementHostDirective} from "../../form-element-host.directive";

@Component({
    selector: 'fg-row',
    imports: [
        FormElementHostDirective
    ],
    templateUrl: './row.component.html',
    styleUrl: './row.component.scss',
    host: {
        'class': 'row'
    }
})
export class RowComponent extends AbstractFormElementHostComponent<RowComponent> implements DynamicFormElementInterface, OnInit {}
