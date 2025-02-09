import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  IPhysicsEnginePluginV2,
} from "@babylonjs/core";

export async function loadRedLightGreenLightScene(
  engine: Engine,
  physics: IPhysicsEnginePluginV2
): Promise<Scene> {
  console.log("[Nova Trials]", "Loading Red Light Green Light scene");

  const scene = new Scene(engine);

  const camera = new ArcRotateCamera(
    "camera",
    -Math.PI / 2,
    Math.PI / 2.5,
    3,
    new Vector3(0, 0, 0),
    scene
  );
  camera.attachControl(engine.getRenderingCanvas(), true);

  new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  MeshBuilder.CreateBox(
    "box",
    {
      height: 1,
      width: 100,
      depth: 100,
    },
    scene
  );

  scene.enablePhysics(new Vector3(0, -9.8, 0), physics);

  return Promise.resolve(scene);
}
