import { Share2, Copy } from "lucide-react";
import { useState } from "react";
import { DIFFICULTY_LEVELS, GAME_MODES } from "../../constants/game-constants";
import {
  RESULT_TEMPLATES,
  getSocialShareUrl,
  GameResultType,
} from "../../constants/game-info";
import { Cell as CellType, Difficulty, GameMode } from "../../types/game-types";

// 미니 셀 컴포넌트 - 결과 보드용
const MiniCell: React.FC<{
  state: string;
  entangled: boolean;
  isWinningCell: boolean;
}> = ({ state, entangled, isWinningCell }) => {
  let bgColor = "bg-gradient-to-r from-blue-400 via-purple-500 to-red-400";

  if (state === "wave") {
    bgColor = "bg-gradient-to-r from-blue-500 to-blue-600";
  } else if (state === "particle") {
    bgColor = "bg-gradient-to-r from-red-500 to-red-600";
  }

  return (
    <div
      className={`
        w-4 h-4 rounded-sm
        ${bgColor}
        ${
          isWinningCell
            ? "ring-2 ring-yellow-400 ring-offset-1 ring-offset-gray-900"
            : ""
        }
        flex items-center justify-center
        transition-all duration-200
      `}
    >
      {entangled && (
        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
      )}
    </div>
  );
};

interface VictoryModalProps {
  winner: number | null;
  turn: number;
  gameMode: GameMode;
  difficulty: Difficulty;
  board: CellType[][];
  resetGame: () => void;
  setGameMode: (mode: GameMode | null) => void;
  setShareResultType: (type: GameResultType) => void;
  setShowShareModal: (show: boolean) => void;
}

const VictoryModal: React.FC<VictoryModalProps> = ({
  winner,
  turn,
  gameMode,
  difficulty,
  board,
  resetGame,
  setGameMode,
  setShareResultType,
  setShowShareModal,
}) => {
  const [showBoard, setShowBoard] = useState(true);

  if (winner === null) return null;

  // 승리 타입 결정
  const getResultType = (): GameResultType => {
    if (winner === 0) return "DRAW";
    return winner === 1 ? "WIN_WAVE" : "WIN_PARTICLE";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-10 animate-fadeIn p-4">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full text-center shadow-2xl border border-gray-700 relative">
        <h2 className="text-3xl font-bold mb-2 text-white">
          {winner === 0
            ? "무승부!"
            : `${winner === 1 ? "파동팀" : "입자팀"} 승리!`}
        </h2>

        <div className="mb-6">
          {winner === 0 ? (
            <p className="text-xl text-gray-300">
              모든 셀이 확정되었으나 연속된 5개를 만들지 못했습니다.
            </p>
          ) : (
            <p className="text-xl text-gray-300">
              {winner === 1 ? "파란색" : "빨간색"} 상태로 연속된 5개의 셀을
              만들었습니다!
            </p>
          )}

          {/* 최종 게임 보드 표시 */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-white text-left">
                최종 보드 상태
              </h3>
              <div className="flex space-x-2">
                <button
                  className="p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300"
                  onClick={() => setShowBoard(!showBoard)}
                  title={showBoard ? "보드 숨기기" : "보드 보기"}
                >
                  {showBoard ? "숨기기" : "보기"}
                </button>
              </div>
            </div>

            {showBoard && (
              <div className="bg-gray-900 p-2 rounded-lg shadow-inner">
                <div className="grid grid-cols-9 gap-0.5 mx-auto w-fit">
                  {board.map((row, x) =>
                    row.map((cell, y) => (
                      <MiniCell
                        key={`${x}-${y}`}
                        state={cell.state}
                        entangled={cell.entangled}
                        isWinningCell={cell.isWinningCell || false}
                      />
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 게임 결과 상세 정보 */}
          <div className="mt-4 p-3 bg-gray-900 rounded-lg text-sm text-left">
            <div className="flex justify-between mb-1">
              <span>진행된 턴:</span>
              <span className="text-cyan-300 font-semibold">{turn}턴</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>게임 모드:</span>
              <span className="text-cyan-300 font-semibold">
                {gameMode === GAME_MODES.LOCAL
                  ? "2인 오프라인"
                  : gameMode === GAME_MODES.VS_AI
                  ? "AI 대전"
                  : "튜토리얼"}
              </span>
            </div>
            {gameMode === GAME_MODES.VS_AI && (
              <div className="flex justify-between">
                <span>AI 난이도:</span>
                <span
                  className={`font-semibold ${
                    difficulty === DIFFICULTY_LEVELS.EASY
                      ? "text-green-400"
                      : difficulty === DIFFICULTY_LEVELS.MEDIUM
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {difficulty === DIFFICULTY_LEVELS.EASY
                    ? "쉬움"
                    : difficulty === DIFFICULTY_LEVELS.MEDIUM
                    ? "보통"
                    : "어려움"}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all"
            onClick={resetGame}
          >
            새 게임 시작
          </button>
          <button
            className="bg-gray-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:bg-gray-600 transition-all"
            onClick={() => setGameMode(null)}
          >
            메인 메뉴
          </button>
        </div>

        {/* 게임 결과 공유 섹션 */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <h3 className="text-lg font-semibold mb-3">결과 공유하기</h3>

          <div className="grid grid-cols-4 gap-2">
            <button
              className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              onClick={() => {
                const resultTemplate = getResultType();
                setShareResultType(resultTemplate);
                setShowShareModal(true);
              }}
            >
              <Share2 className="w-5 h-5 mb-1" />
              <span className="text-xs">공유</span>
            </button>

            <a
              href={getSocialShareUrl("x", getResultType())}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-2 rounded-lg bg-black hover:bg-gray-900 transition-colors"
            >
              <span className="text-sm mb-1">𝕏</span>
              <span className="text-xs">X</span>
            </a>

            <a
              href={getSocialShareUrl("facebook", getResultType())}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-2 rounded-lg bg-blue-800 hover:bg-blue-700 transition-colors"
            >
              <span className="text-sm mb-1">f</span>
              <span className="text-xs">Facebook</span>
            </a>

            <button
              className="flex flex-col items-center justify-center p-2 rounded-lg bg-green-700 hover:bg-green-600 transition-colors"
              onClick={() => {
                const resultText =
                  winner === 0
                    ? RESULT_TEMPLATES.DRAW
                    : winner === 1
                    ? RESULT_TEMPLATES.WIN_WAVE
                    : RESULT_TEMPLATES.WIN_PARTICLE;

                navigator.clipboard.writeText(
                  `${resultText} #양자오목 ${window.location.href}`
                );
                alert("결과가 클립보드에 복사되었습니다!");
              }}
            >
              <Copy className="w-5 h-5 mb-1" />
              <span className="text-xs">복사</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VictoryModal;
