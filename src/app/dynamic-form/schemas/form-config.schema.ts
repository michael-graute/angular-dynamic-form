/**
 * Zod schema for FormConfig
 * Validates complete form configurations
 */

import { z } from 'zod';
import { FormElementSchema } from './form-element.schema';
import { FormButtonSchema } from './form-button.schema';

/**
 * Schema for complete form configuration
 * Validates the entire form structure including elements and buttons
 */
export const FormConfigSchema = z.object({
  elements: z.array(FormElementSchema),
  buttons: z.array(FormButtonSchema),
  submitCallback: z.string().optional(),
  settings: z.any().optional()
}).strict();

export type FormConfigType = z.infer<typeof FormConfigSchema>;

/**
 * Validate a form configuration object
 * @param config - The configuration object to validate
 * @returns Validation result with parsed data or errors
 */
export function validateFormConfig(config: unknown) {
  return FormConfigSchema.safeParse(config);
}
