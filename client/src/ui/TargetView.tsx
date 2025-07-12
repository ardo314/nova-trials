import { Snackbar } from "@mui/material";
import { useGame } from "../GameContext";

export function TargetView() {
  const game = useGame();

  return (
    <Snackbar
      open={game.hasTarget}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      message="Interact"
    />
  );
}
