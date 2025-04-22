import { useGame } from "../GameContext";
import { PauseMenu } from "./PauseMenu";

export function GameView() {
  const game = useGame();

  return <>{game.isPaused && <PauseMenu></PauseMenu>}</>;
}
