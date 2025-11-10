/**
 * Zod schema for ElementValidator
 * Validates form element validation rules
 */

import { z } from 'zod';

/**
 * Schema for form element validators
 * Supports: required, email, minLength, maxLength, pattern, minItems, maxItems, inArray
 */
export const ElementValidatorSchema = z.object({
  name: z.enum([
    'required',
    'email',
    'minLength',
    'maxLength',
    'pattern',
    'minItems',
    'maxItems',
    'inArray'
  ]),
  value: z.any().optional(),
  errorMessage: z.string().optional()
}).strict();

export type ElementValidatorType = z.infer<typeof ElementValidatorSchema>;
