import { useEffect, useRef, useState } from "react";
import { Game } from "./game/game";
import { Inspector } from "@babylonjs/inspector";
import { PauseMenu } from "./ui/PauseMenu";

export function GameView() {
  const gameRef = useRef<Game | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    gameRef.current = new Game(window, canvasRef.current);
    gameRef.current.isPaused.add((paused) => {
      setIsPaused(true);
    });
    gameRef.current.start();

    return () => {
      gameRef.current?.dispose();
    };
  }, []);

  function onResumeClick() {
    setIsPaused(false);
  }

  function onOptionsClick() {}

  function onToggleInspectorClick() {
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
        {isPaused && (
          <PauseMenu
            onResumeClick={onResumeClick}
            onOptionsClick={onOptionsClick}
            onToggleInspectorClick={onToggleInspectorClick}
          />
        )}
      </div>
    </div>
  );
}
