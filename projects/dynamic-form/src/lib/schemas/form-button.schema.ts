/**
 * Zod schema for FormButton
 * Validates form button configurations
 */

import { z } from 'zod';

/**
 * Schema for form button callbacks
 * Params can be either an array or an object for flexibility
 */
export const FormButtonCallbackSchema = z.object({
  function: z.string(),
  params: z.union([z.array(z.any()), z.object({}).passthrough()]).optional()
}).strict();

/**
 * Schema for form buttons
 * Supports: submit, reset, button types
 */
export const FormButtonSchema = z.object({
  key: z.string(),
  type: z.enum(['submit', 'reset', 'button']),
  callback: FormButtonCallbackSchema,
  class: z.string().optional(),
  label: z.string().optional(),
  icon: z.string().optional(),
  settings: z.any().optional()
}).strict();

export type FormButtonType = z.infer<typeof FormButtonSchema>;
export type FormButtonCallbackType = z.infer<typeof FormButtonCallbackSchema>;
