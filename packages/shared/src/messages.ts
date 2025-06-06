export namespace SetTransform {
  export const Type = "set-transform";

  export type Message = {
    x: number;
    y: number;
    z: number;
    pitch: number;
    yaw: number;
  };
}

export namespace SetReady {
  export const Type = "set-ready";

  export type Message = {};
}
