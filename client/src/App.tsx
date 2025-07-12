import { useCallback, useState } from "react";
import { GameProvider } from "./GameContext";
import { GameView } from "./ui/GameView";

export function App() {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  const canvasCallback = useCallback((node: HTMLCanvasElement | null) => {
    setCanvas(node);
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas ref={canvasCallback} style={{ width: "100%", height: "100%" }} />
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
        {canvas && (
          <GameProvider canvas={canvas}>
            <GameView />
          </GameProvider>
        )}
      </div>
    </div>
  );
}
