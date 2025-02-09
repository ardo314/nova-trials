"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameView = GameView;
const react_1 = require("react");
const game_1 = require("./game");
const inspector_1 = require("@babylonjs/inspector");
function GameView() {
    const gameRef = (0, react_1.useRef)(null);
    const canvasRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (!canvasRef.current) {
            return;
        }
        gameRef.current = new game_1.Game(window, canvasRef.current);
        gameRef.current.start();
        return () => {
            var _a;
            (_a = gameRef.current) === null || _a === void 0 ? void 0 : _a.dispose();
        };
    }, []);
    function toggleInspector() {
        var _a;
        if (!gameRef.current || !gameRef.current.scene) {
            return;
        }
        if (!inspector_1.Inspector.IsVisible) {
            inspector_1.Inspector.Show((_a = gameRef.current) === null || _a === void 0 ? void 0 : _a.scene, {
                globalRoot: document.getElementById("root"),
            });
        }
        else {
            inspector_1.Inspector.Hide();
        }
    }
    return (<div style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }}/>
      <div style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            pointerEvents: "none",
        }}>
        <button style={{ pointerEvents: "auto" }} onClick={toggleInspector}>
          Toggle Inspector
        </button>
      </div>
    </div>);
}
