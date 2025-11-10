import {Component, Input} from '@angular/core';
import {FormConfig} from "dynamic-form";
import {prettyPrintJson} from "pretty-print-json";

@Component({
  selector: 'fg-config-display',
  imports: [],
  templateUrl: './config-display.component.html',
  styleUrl: './config-display.component.scss'
})
export class ConfigDisplayComponent {
  @Input() formConfig: FormConfig | undefined;

  showConfig = false;
  formConfigPretty: string = '';

  toggleFormConfig() {
    this.showConfig = !this.showConfig;
    if (this.showConfig) {
      this.formConfigPretty = this.formConfigPretty = prettyPrintJson.toHtml(this.formConfig, {lineNumbers: false});
    }
  }
}
