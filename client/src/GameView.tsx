import { useEffect, useRef } from "react";
import { Game } from "./game";
import { Inspector } from "@babylonjs/inspector";

export function GameView() {
  const gameRef = useRef<Game | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    gameRef.current = new Game(window, canvasRef.current);
    gameRef.current.start();

    return () => {
      gameRef.current?.dispose();
    };
  }, []);

  function toggleInspector() {
    if (!gameRef.current || !gameRef.current.scene) {
      return;
    }

    if (!Inspector.IsVisible) {
      Inspector.Show(gameRef.current?.scene, {
        globalRoot: document.getElementById("root")!,
      });
    } else {
      Inspector.Hide();
    }
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          pointerEvents: "none",
        }}
      >
        <button style={{ pointerEvents: "auto" }} onClick={toggleInspector}>
          Toggle Inspector
        </button>
      </div>
    </div>
  );
}
