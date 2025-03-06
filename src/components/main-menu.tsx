import {
  Users,
  Cpu,
  HelpCircle,
  Github,
  MessageSquare,
  Share2,
} from "lucide-react";
import { DIFFICULTY_LEVELS, GAME_MODES } from "../constants/game-constants";
import { GAME_VERSION, EXTERNAL_LINKS } from "../constants/game-info";
import { GameResultType } from "../constants/game-info";
import ShareModal from "./modals/share-modal";
import { Difficulty, GameMode } from "../types/game-types";

interface MainMenuProps {
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
  handleGameModeSelect: (mode: GameMode) => void;
  showShareModal: boolean;
  setShowShareModal: (show: boolean) => void;
  shareResultType: GameResultType;
  setShareResultType: (type: GameResultType) => void;
  turn: number;
}

const MainMenu: React.FC<MainMenuProps> = ({
  difficulty,
  setDifficulty,
  handleGameModeSelect,
  showShareModal,
  setShowShareModal,
  shareResultType,
  setShareResultType,
  turn,
}) => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4 text-white">
      <h1 className="text-4xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-red-400">
        Quantum Gomoku
      </h1>
      <h2 className="text-xl text-gray-300 mb-8 text-center">
        양자 역학의 원리를 활용한 전략 게임
      </h2>

      <div className="max-w-md w-full space-y-6">
        <div className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-center">게임 모드 선택</h3>

          <div className="space-y-4">
            <button
              className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 transition-all flex items-center justify-between shadow-md"
              onClick={() => handleGameModeSelect(GAME_MODES.LOCAL)}
            >
              <span className="font-medium">2인 오프라인 대전</span>
              <Users className="w-5 h-5" />
            </button>

            <div>
              <button
                className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 transition-all flex items-center justify-between shadow-md mb-2"
                onClick={() => handleGameModeSelect(GAME_MODES.VS_AI)}
              >
                <span className="font-medium">AI 대전</span>
                <Cpu className="w-5 h-5" />
              </button>

              <div className="flex justify-between px-2">
                <button
                  className={`px-3 py-1 rounded-md text-sm ${
                    difficulty === DIFFICULTY_LEVELS.EASY
                      ? "bg-green-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  onClick={() => setDifficulty(DIFFICULTY_LEVELS.EASY)}
                >
                  쉬움
                </button>
                <button
                  className={`px-3 py-1 rounded-md text-sm ${
                    difficulty === DIFFICULTY_LEVELS.MEDIUM
                      ? "bg-yellow-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  onClick={() => setDifficulty(DIFFICULTY_LEVELS.MEDIUM)}
                >
                  보통
                </button>
                <button
                  className={`px-3 py-1 rounded-md text-sm ${
                    difficulty === DIFFICULTY_LEVELS.HARD
                      ? "bg-red-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  onClick={() => setDifficulty(DIFFICULTY_LEVELS.HARD)}
                >
                  어려움
                </button>
              </div>
            </div>

            <button
              className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 transition-all flex items-center justify-between shadow-md"
              onClick={() => handleGameModeSelect(GAME_MODES.TUTORIAL)}
            >
              <span className="font-medium">튜토리얼</span>
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 링크 및 버튼 섹션 추가 - 상수화된 링크 사용 */}
        <div className="bg-gray-800 rounded-xl p-4 shadow-xl border border-gray-700">
          <div className="grid grid-cols-2 gap-3">
            <a
              href={EXTERNAL_LINKS.GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all flex items-center justify-center shadow-md"
            >
              <Github className="w-5 h-5 mr-2" />
              <span className="font-medium">GitHub</span>
            </a>

            <a
              href={EXTERNAL_LINKS.FEEDBACK}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all flex items-center justify-center shadow-md"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              <span className="font-medium">피드백</span>
            </a>

            <button
              onClick={() => setShowShareModal(true)}
              className="py-3 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all flex items-center justify-center shadow-md col-span-2"
            >
              <Share2 className="w-5 h-5 mr-2" />
              <span className="font-medium">공유하기</span>
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-400">
          <p>
            양자 물리학의 원리(중첩, 측정, 얽힘, 간섭)를 활용한 전략 보드 게임
          </p>
          <p className="mt-1">Version {GAME_VERSION.VERSION}</p>
        </div>
      </div>

      <ShareModal
        showShareModal={showShareModal}
        shareResultType={shareResultType}
        setShowShareModal={setShowShareModal}
        setShareResultType={setShareResultType}
        turn={turn}
        gameMode={null}
        difficulty={difficulty}
      />
    </div>
  );
};

export default MainMenu;
