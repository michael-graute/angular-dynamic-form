import {Component, HostBinding, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {AbstractFormElementHostComponent} from "../../abstract-form-element-host.component";
import {DynamicFormElementInterface} from "../../../../dynamic-form-element.interface";
import {FormElementHostDirective} from "../../../form-element-host.directive";

@Component({
    selector: 'fg-col',
    imports: [
        FormElementHostDirective
    ],
    templateUrl: './col.component.html',
    styleUrl: './col.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColComponent extends AbstractFormElementHostComponent<ColComponent> implements DynamicFormElementInterface, OnInit {
  @HostBinding('class') override className = 'col ';
}
