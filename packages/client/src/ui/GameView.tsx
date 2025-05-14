import { useGame } from "../GameContext";
import { PauseMenu } from "./PauseMenu";
import { TargetView } from "./TargetView";

export function GameView() {
  const game = useGame();

  return (
    <>
      {game.isPaused && <PauseMenu></PauseMenu>}
      <TargetView />
    </>
  );
}
