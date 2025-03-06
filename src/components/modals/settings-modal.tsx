import React from "react";
import Modal from "../ui/modal";
import { DIFFICULTY_LEVELS, GAME_MODES } from "../../constants/game-constants";
import { Difficulty, GameMode } from "../../types/game-types";

interface SettingsModalProps {
  showSettings: boolean;
  muted: boolean;
  gameMode: GameMode;
  difficulty: Difficulty;
  setMuted: (muted: boolean) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  resetGame: () => void;
  setShowSettings: (show: boolean) => void;
  setGameMode: (mode: GameMode | null) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  showSettings,
  muted,
  gameMode,
  difficulty,
  setMuted,
  setDifficulty,
  resetGame,
  setShowSettings,
  setGameMode,
}) => {
  return (
    <Modal
      isOpen={showSettings}
      onClose={() => setShowSettings(false)}
      title="게임 설정"
    >
      <div className="space-y-4 mb-4">
        <div>
          <h3 className="text-lg font-bold mb-2 text-white">오디오 설정</h3>
          <div className="flex items-center p-2 bg-gray-700 rounded-lg">
            <span className="mr-2">음향 효과:</span>
            <button
              className={`px-4 py-1 rounded-lg font-medium ${
                muted ? "bg-gray-600 text-gray-300" : "bg-green-600 text-white"
              }`}
              onClick={() => setMuted(!muted)}
            >
              {muted ? "꺼짐" : "켜짐"}
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2 text-white">게임 설정</h3>
          <div className="space-y-2">
            {gameMode === GAME_MODES.VS_AI && (
              <div className="p-2 bg-gray-700 rounded-lg">
                <span className="mr-2">AI 난이도:</span>
                <div className="flex mt-2 gap-2">
                  <button
                    className={`flex-1 px-2 py-1 rounded-lg font-medium ${
                      difficulty === DIFFICULTY_LEVELS.EASY
                        ? "bg-green-600 text-white"
                        : "bg-gray-600 text-gray-300"
                    }`}
                    onClick={() => setDifficulty(DIFFICULTY_LEVELS.EASY)}
                  >
                    쉬움
                  </button>
                  <button
                    className={`flex-1 px-2 py-1 rounded-lg font-medium ${
                      difficulty === DIFFICULTY_LEVELS.MEDIUM
                        ? "bg-yellow-600 text-white"
                        : "bg-gray-600 text-gray-300"
                    }`}
                    onClick={() => setDifficulty(DIFFICULTY_LEVELS.MEDIUM)}
                  >
                    보통
                  </button>
                  <button
                    className={`flex-1 px-2 py-1 rounded-lg font-medium ${
                      difficulty === DIFFICULTY_LEVELS.HARD
                        ? "bg-red-600 text-white"
                        : "bg-gray-600 text-gray-300"
                    }`}
                    onClick={() => setDifficulty(DIFFICULTY_LEVELS.HARD)}
                  >
                    어려움
                  </button>
                </div>
              </div>
            )}

            <div className="p-2 bg-gray-700 rounded-lg">
              <button
                className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                onClick={() => {
                  resetGame();
                  setShowSettings(false);
                }}
              >
                새 게임 시작
              </button>
            </div>

            <div className="p-2 bg-gray-700 rounded-lg">
              <button
                className="w-full bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                onClick={() => {
                  setGameMode(null);
                  setShowSettings(false);
                }}
              >
                메인 메뉴로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
