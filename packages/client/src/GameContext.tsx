import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Game } from "./game/game";

type ProviderProps = PropsWithChildren<{
  canvas: HTMLCanvasElement;
}>;

type ReactGameWrapper = {
  isPaused: boolean;
  setIsPaused: (value: boolean) => void;
};

const Context = createContext<ReactGameWrapper | undefined>(undefined);

export function GameProvider({ canvas, children }: ProviderProps) {
  const game = useMemo<Game>(() => new Game(window, canvas), [canvas]);
  const isPaused = useIsPaused(game);

  useEffect(() => {
    game.start();

    return () => game.dispose();
  }, []);

  function setIsPaused(value: boolean) {
    game.isPaused = value;
  }

  return (
    <Context.Provider value={{ isPaused, setIsPaused }}>
      {children}
    </Context.Provider>
  );
}

export function useGame() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}

function useIsPaused(game: Game) {
  const [isPaused, setIsPaused] = useState(game.isPaused);

  useEffect(() => {
    const observer = game.onIsPausedChanged.add(() => {
      setIsPaused(game.isPaused);
    });

    return () => observer.remove();
  }, []);

  return isPaused;
}
