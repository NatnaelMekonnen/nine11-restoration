export function filterUndefined<T>(obj: Record<string, T>): Record<string, T> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, T>);
}
