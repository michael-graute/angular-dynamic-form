import { Component } from '@angular/core';
import {AbstractInputComponent} from "../abstract-input.component";
import {JsonPipe, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DataRelationElementComponent} from "./data-relation-element/data-relation-element.component";

@Component({
  selector: 'fg-data-relation',
  imports: [
    NgIf,
    ReactiveFormsModule,
    DataRelationElementComponent,
    FormsModule,
    JsonPipe
  ],
  templateUrl: './data-relation.component.html',
  styleUrl: './data-relation.component.scss'
})
export class DataRelationComponent extends AbstractInputComponent {
}
