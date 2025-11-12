/**
 * Zod schema for ElementValidator
 * Validates form element validation rules
 */

import { z } from 'zod';

/**
 * Schema for form element validators
 * Supports: required, email, minLength, maxLength, pattern, minItems, maxItems, inArray, asyncBackend
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
    'inArray',
    'asyncBackend'
  ]),
  value: z.any().optional(),
  errorMessage: z.string().optional(),
  async: z.boolean().optional(),
  asyncUrl: z.string().url().optional(),
  asyncTrigger: z.enum(['blur', 'debounce']).optional(),
  asyncDebounceTime: z.number().positive().optional()
}).strict();

export type ElementValidatorType = z.infer<typeof ElementValidatorSchema>;
