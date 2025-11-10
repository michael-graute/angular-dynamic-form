/*
 * Public API Surface of dynamic-form
 */

// Main component
export * from './lib/dynamic-form.component';

// Service
export * from './lib/dynamic-form.service';

// Types and interfaces
export * from './lib/dynamic-form.types';
export * from './lib/dynamic-form-element.interface';
export * from './lib/types/loading-state';

// Validators
export * from './lib/dynamic-form-validators';
export * from './lib/validators/config-validator';

// Default configurations
export * from './lib/default-error-messages';

// Form elements map (for custom elements)
export * from './lib/form-elements.map';

// Directives
export * from './lib/form-elements/form-element-host.directive';

// Schemas (for validation)
export * from './lib/schemas/form-config.schema';
export * from './lib/schemas/form-element.schema';
export * from './lib/schemas/form-button.schema';
export * from './lib/schemas/element-validator.schema';

// Type guards
export * from './lib/type-guards/form-type-guards';

// Services
export * from './lib/services/performance-monitor.service';

// Components (for custom usage)
export * from './lib/components/loading-spinner/loading-spinner.component';

// Abstract classes for extending
export * from './lib/form-elements/inputs/abstract-input.component';
export * from './lib/form-elements/containers/abstract-form-element-host.component';

// All form element components (for custom registration)
export * from './lib/form-elements/inputs/input/input.component';
export * from './lib/form-elements/inputs/select/select.component';
export * from './lib/form-elements/inputs/checkbox/checkbox.component';
export * from './lib/form-elements/inputs/radio-group/radio-group.component';
export * from './lib/form-elements/inputs/key-value/key-value.component';
export * from './lib/form-elements/inputs/data-select/data-select.component';
export * from './lib/form-elements/inputs/data-relation/data-relation.component';
export * from './lib/form-elements/inputs/repeater/repeater.component';

// Container components
export * from './lib/form-elements/containers/row/row.component';
export * from './lib/form-elements/containers/card/card.component';
export * from './lib/form-elements/containers/fieldset/fieldset.component';
export * from './lib/form-elements/containers/form-group/form-group.component';
export * from './lib/form-elements/containers/tab-container/tab-container.component';

// Element components
export * from './lib/form-elements/elements/form-text/form-text.component';
