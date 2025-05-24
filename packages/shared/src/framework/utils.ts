export function isObject(obj: unknown): obj is object {
  if (obj === undefined) return false;
  if (obj === null) return false;
  if (typeof obj !== "object") return false;
  return true;
}

export function isObjectWithPropertOfType<T>(
  obj: unknown,
  property: string | symbol | number,
  type: string
): obj is T {
  if (!isObject(obj)) return false;
  if (!(property in obj)) return false;
  if (typeof (obj as any)[property] !== type) return false;
  return true;
}
