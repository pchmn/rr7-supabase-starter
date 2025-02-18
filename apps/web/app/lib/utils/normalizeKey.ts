export function normalizeKey(key?: string) {
  return key as unknown as TemplateStringsArray;
}

/**
 * Get a template string array for specific keys. Fallback to a generic error key.
 *
 * @param keys the keys to be used
 * @returns a template string array
 */
export function getErrorKey(...keys: string[]) {
  return [...keys, 'error.unknownError'] as unknown as TemplateStringsArray[];
}
