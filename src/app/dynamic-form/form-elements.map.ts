import {InputComponent} from "./form-elements/elements/input/input.component";
import {FieldsetComponent} from "./form-elements/containers/fieldset/fieldset.component";
import {TabContainerComponent} from "./form-elements/containers/tab-container/tab-container.component";
import {TabPaneComponent} from "./form-elements/containers/tab-container/tab-pane/tab-pane.component";
import {SelectComponent} from "./form-elements/elements/select/select.component";
import {RowComponent} from "./form-elements/containers/row/row.component";
import {ColComponent} from "./form-elements/containers/row/col/col.component";
import {CardComponent} from "./form-elements/containers/card/card.component";
import {KeyValueComponent} from "./form-elements/elements/key-value/key-value.component";

export const FormElementMap = {
  'fieldset': FieldsetComponent,
  'tabContainer': TabContainerComponent,
  'tabPane': TabPaneComponent,
  'row': RowComponent,
  'col': ColComponent,
  'card': CardComponent,

  'input': InputComponent,
  'select': SelectComponent,
  'key-value': KeyValueComponent,
}
