/**
 * Strip HTML tags from user input and trim whitespace.
 * Used on all user-submitted text before inserting into the database.
 */
export function sanitizeString(input: string, maxLength = 5000): string {
  return input
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/&[a-z]+;/gi, " ") // replace HTML entities
    .trim()
    .slice(0, maxLength);
}

/**
 * Sanitize an object's string values.
 * Useful for sanitizing entire form payloads at once.
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T
): T {
  const result = { ...obj };
  for (const key in result) {
    if (typeof result[key] === "string") {
      result[key] = sanitizeString(result[key] as string) as unknown as T[typeof key];
    }
  }
  return result;
}
