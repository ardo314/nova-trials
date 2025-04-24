export type Interactable = {
  readonly isInteractable: boolean;
};

export function isInteractable(obj: unknown): obj is Interactable {
  if (obj === undefined) return false;
  if (obj === null) return false;
  if (typeof obj !== "object") return false;
  if (!("isInteractable" in obj)) return false;
  if (typeof obj.isInteractable !== "boolean") return false;
  if (obj.isInteractable !== true) return false;

  return true;
}
