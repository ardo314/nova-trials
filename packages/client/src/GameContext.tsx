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
  hasTarget: boolean;
  setIsPaused: (value: boolean) => void;
  toggleInspector: () => void;
};

const Context = createContext<ReactGameWrapper | undefined>(undefined);

export function GameProvider({ canvas, children }: ProviderProps) {
  const game = useMemo<Game>(() => new Game(window, canvas), [canvas]);
  const [isPaused, setIsPaused] = useState(game.isPaused);
  const [hasTarget, setHasTarget] = useState(false);

  useEffect(() => {
    const observers = [
      game.onIsPausedChanged.add(() => {
        setIsPaused(game.isPaused);
      }),
      game.onLocalCharacterTargetChanged.add(() => {
        setHasTarget(game.localCharacter?.target.value !== null);
      }),
    ];

    game.start();

    return () => {
      for (const observer of observers) {
        observer.remove();
      }
      game.dispose();
    };
  }, []);

  return (
    <Context.Provider
      value={{
        isPaused,
        hasTarget,
        setIsPaused(value: boolean) {
          game.isPaused = value;
        },
        toggleInspector: () => {
          game.toggleInspector(document.getElementById("root")!);
        },
      }}
    >
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
