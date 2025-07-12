import { useGame } from "../GameContext";
import { HUD } from "./HUD";
import { PauseMenu } from "./PauseMenu";
import { TargetView } from "./TargetView";

export function GameView() {
  const game = useGame();

  return (
    <>
      {game.isPaused && <PauseMenu />}
      {!game.isPaused && <HUD />}
      {!game.isPaused && <TargetView />}
    </>
  );
}
