import {InputComponent} from "./form-elements/inputs/input/input.component";
import {FieldsetComponent} from "./form-elements/containers/fieldset/fieldset.component";
import {TabContainerComponent} from "./form-elements/containers/tab-container/tab-container.component";
import {TabPaneComponent} from "./form-elements/containers/tab-container/tab-pane/tab-pane.component";
import {SelectComponent} from "./form-elements/inputs/select/select.component";
import {RowComponent} from "./form-elements/containers/row/row.component";
import {ColComponent} from "./form-elements/containers/row/col/col.component";
import {CardComponent} from "./form-elements/containers/card/card.component";
import {KeyValueComponent} from "./form-elements/inputs/key-value/key-value.component";
import {FormGroupComponent} from "./form-elements/containers/form-group/form-group.component";
import {DataRelationComponent} from "./form-elements/inputs/data-relation/data-relation.component";
import {FormTextComponent} from "./form-elements/elements/form-text/form-text.component";
import {RepeaterComponent} from "./form-elements/inputs/repeater/repeater.component";
import {CheckboxComponent} from "./form-elements/inputs/checkbox/checkbox.component";
import {RadioGroupComponent} from "./form-elements/inputs/radio-group/radio-group.component";

export const FormElementMap = {
  'fieldset': FieldsetComponent,
  'tabContainer': TabContainerComponent,
  'tabPane': TabPaneComponent,
  'row': RowComponent,
  'col': ColComponent,
  'card': CardComponent,
  'formGroup': FormGroupComponent,

  'form-text': FormTextComponent,

  'input': InputComponent,
  'select': SelectComponent,
  'checkbox': CheckboxComponent,
  'radio-group': RadioGroupComponent,
  'key-value': KeyValueComponent,
  'data-relation': DataRelationComponent,
  'repeater': RepeaterComponent
}
