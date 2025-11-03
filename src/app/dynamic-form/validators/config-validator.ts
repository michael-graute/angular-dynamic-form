/**
 * Configuration validator for form configurations
 * Provides runtime validation using Zod schemas and detailed error reporting
 */

import { FormConfigSchema } from '../schemas/form-config.schema';
import { FormConfig } from '../dynamic-form.types';
import { ZodError } from 'zod';

export interface ValidationResult {
  valid: boolean;
  data?: FormConfig;
  errors?: ValidationError[];
}

export interface ValidationError {
  path: string;
  message: string;
  code: string;
}

/**
 * Validates a form configuration object against the Zod schema
 *
 * @param config - The configuration object to validate
 * @returns ValidationResult with parsed data if valid, or detailed errors if invalid
 *
 * @example
 * ```typescript
 * const result = validateFormConfig(jsonConfig);
 * if (result.valid) {
 *   console.log('Valid config:', result.data);
 * } else {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export function validateFormConfig(config: unknown): ValidationResult {
  const result = FormConfigSchema.safeParse(config);

  if (result.success) {
    return {
      valid: true,
      data: result.data as FormConfig
    };
  }

  return {
    valid: false,
    errors: formatZodErrors(result.error)
  };
}

/**
 * Formats Zod validation errors into a more readable format
 *
 * @param error - The ZodError object
 * @returns Array of formatted validation errors
 */
function formatZodErrors(error: ZodError<any>): ValidationError[] {
  return error.issues.map((err: any) => ({
    path: err.path.join('.'),
    message: err.message,
    code: err.code
  }));
}

/**
 * Validates form configuration and throws an error if invalid
 * Useful for cases where you want to fail fast on invalid configurations
 *
 * @param config - The configuration object to validate
 * @returns The validated form configuration
 * @throws Error if validation fails
 *
 * @example
 * ```typescript
 * try {
 *   const validConfig = validateFormConfigOrThrow(jsonConfig);
 *   // Use validConfig
 * } catch (error) {
 *   console.error('Invalid config:', error.message);
 * }
 * ```
 */
export function validateFormConfigOrThrow(config: unknown): FormConfig {
  const result = validateFormConfig(config);

  if (!result.valid) {
    const errorMessages = result.errors!.map(e => `${e.path}: ${e.message}`).join('\n');
    throw new Error(`Form configuration validation failed:\n${errorMessages}`);
  }

  return result.data!;
}

/**
 * Checks if a configuration object is valid without throwing errors
 *
 * @param config - The configuration object to check
 * @returns True if valid, false otherwise
 */
export function isValidFormConfig(config: unknown): boolean {
  return validateFormConfig(config).valid;
}
