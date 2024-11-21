import {Component, OnInit} from '@angular/core';
import {AbstractFormElementHostComponent} from "../abstract-form-element-host.component";
import {DynamicFormElementInterface} from "../../../dynamic-form-element.interface";
import {FormElement} from "../../../dynamic-form.types";
import {FormElementHostDirective} from "../../form-element-host.directive";
import {NgForOf, NgIf} from "@angular/common";
import {TabService} from "./tab.service";
import {DynamicFormService, ElementAddedPayload, ElementRemovedPayload} from "../../../dynamic-form.service";

@Component({
  selector: 'fg-tab-container',
  standalone: true,
  imports: [
    FormElementHostDirective,
    NgForOf,
    NgIf
  ],
  templateUrl: './tab-container.component.html',
  styleUrl: './tab-container.component.scss'
})
export class TabContainerComponent extends AbstractFormElementHostComponent<TabContainerComponent> implements DynamicFormElementInterface, OnInit {
  activeTab: number = 0;

  constructor(protected override dynamicFormService: DynamicFormService, private tabService: TabService) {
    super(dynamicFormService);
  }
  override ngOnInit(): void {
    this.children.forEach((element: FormElement, index) => {
      this.addFormElement(element);
      if(index === 0) {
        setTimeout(() => {
          this.tabClicked(element.key, index);
        }, 100)
      }
    })
    this.dynamicFormService.elementAdded.subscribe((payload: ElementAddedPayload) => {
      if(payload.targetContainerId === this.id) {
        this.children.push(payload.element);
        this.addFormElement(payload.element)
        setTimeout(() => {
          this.tabClicked(payload.element.key, this.children.length - 1);
        }, 100)
      }
    })
    this.dynamicFormService.elementRemoved.subscribe((payload: ElementRemovedPayload) => {
      const tabIndex = this.children.findIndex((child) => child.key === payload.elementId);
      if(tabIndex > -1) {
        this.children.splice(tabIndex, 1);
        if(tabIndex > 0) {
          this.tabClicked(this.children[tabIndex-1].key, tabIndex - 1);
        }
      }
    })
  }

  tabClicked(tabId: string | undefined, index: number): void {
    this.tabService.clickTab(tabId ?? '');
    this.activeTab = index
  }
}
