/**
 * Zod schema for FormElement (recursive)
 * Validates form element configurations with nested children support
 */

import { z } from 'zod';
import { ElementValidatorSchema } from './element-validator.schema';

/**
 * Schema for form element options (for select, radio, checkbox)
 * Value can be string, number, boolean, or null (for placeholder options)
 */
export const FormElementOptionSchema = z.object({
  value: z.union([z.string(), z.number(), z.boolean(), z.null()]).optional(),
  label: z.string().optional()
}).strict();

/**
 * Base schema for FormElement with all non-recursive properties
 * This is defined first to avoid circular dependency issues
 */
const BaseFormElementSchema = z.object({
  key: z.string(),
  value: z.any().optional(),
  label: z.string().optional(),
  floatingLabel: z.boolean().optional(),
  required: z.boolean().optional(),
  validators: z.array(ElementValidatorSchema).optional(),
  order: z.number().optional(),
  controlType: z.enum([
    'text',
    'number',
    'email',
    'password',
    'date',
    'datetime-local',
    'time',
    'week',
    'month',
    'search',
    'tel',
    'phone',
    'url'
  ]).optional(),
  type: z.string().optional(),
  options: z.array(FormElementOptionSchema).optional(),
  class: z.string().optional(),
  settings: z.any().optional(),
  errorMessages: z.array(z.any()).optional(),
  helpText: z.string().optional(),
  onChange: z.any().optional(),
  multiple: z.boolean().optional(),
  multipleLabel: z.string().optional()
});

/**
 * Recursive FormElement schema
 * FormElement can have children which are also FormElements
 */
export type FormElementType = z.infer<typeof BaseFormElementSchema> & {
  children?: FormElementType[];
};

export const FormElementSchema: z.ZodType<FormElementType> = BaseFormElementSchema.extend({
  children: z.lazy(() => z.array(FormElementSchema).optional())
});
