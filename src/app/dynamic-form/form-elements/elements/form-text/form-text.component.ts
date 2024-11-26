import {Component, Input} from '@angular/core';

@Component({
  selector: 'fg-form-text',
  imports: [],
  templateUrl: './form-text.component.html',
  styleUrl: './form-text.component.scss'
})
export class FormTextComponent {
  @Input() config: any;
}
