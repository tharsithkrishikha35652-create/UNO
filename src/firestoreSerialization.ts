/** Remove undefined object properties before passing client data to Firestore. */
export function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => item === undefined ? null : stripUndefined(item)) as T;
  }
  if (value === null || typeof value !== 'object') return value;

  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) return value;

  const clean: Record<string, unknown> = {};
  for (const [key, nestedValue] of Object.entries(value as Record<string, unknown>)) {
    if (nestedValue !== undefined) clean[key] = stripUndefined(nestedValue);
  }
  return clean as T;
}
