export namespace SetTransform {
  export const Type = "set-transform";

  export type Message = {
    x: number;
    y: number;
    z: number;
  };
}
