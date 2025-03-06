import { createRoot } from "react-dom/client";
import "./index.css";
import { GameView } from "./GameView.tsx";

createRoot(document.getElementById("root")!).render(<GameView />);
