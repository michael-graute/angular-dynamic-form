import {Component, Input, OnInit} from '@angular/core';
import {JsonPipe} from "@angular/common";
import {FormConfig} from "../../../../dynamic-form.types";
import {DataRelationElementComponent} from "../../data-relation/data-relation-element/data-relation-element.component";

@Component({
  selector: 'fg-repeater-element',
  imports: [
    JsonPipe,
    DataRelationElementComponent
  ],
  templateUrl: './repeater-element.component.html',
  styleUrl: './repeater-element.component.scss'
})
export class RepeaterElementComponent implements OnInit {

  @Input() config: any

  value: any[] = [
    {
      repeaterTextInput: null
    }
  ]

  formConfig: FormConfig = {
    elements: [],
    buttons: []
  }

  ngOnInit() {
    this.formConfig.elements = this.config
  }
}
