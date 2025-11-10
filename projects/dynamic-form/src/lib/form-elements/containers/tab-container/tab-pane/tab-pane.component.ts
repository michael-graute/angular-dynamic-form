import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {AbstractFormElementHostComponent} from "../../abstract-form-element-host.component";
import {DynamicFormElementInterface} from "../../../../dynamic-form-element.interface";
import {FormElementHostDirective} from "../../../form-element-host.directive";
import {TabService} from "../tab.service";
import {DynamicFormService} from "../../../../dynamic-form.service";

@Component({
    selector: 'fg-tab-pane',
    imports: [
        FormElementHostDirective
    ],
    templateUrl: './tab-pane.component.html',
    styleUrl: './tab-pane.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabPaneComponent extends AbstractFormElementHostComponent<TabPaneComponent> implements DynamicFormElementInterface, OnInit {
  active: boolean = false;

  constructor(
    protected override dynamicFormService: DynamicFormService,
    private tabService: TabService,
    private cdr: ChangeDetectorRef
  ) {
    super(dynamicFormService);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.tabService.tabClicked.subscribe(tab => {
      this.active = this.key === tab;
      this.cdr.markForCheck();
    })
  }
}
