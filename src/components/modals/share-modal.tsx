import { Copy, Github, MessageSquare } from "lucide-react";
import Modal from "../ui/modal";
import {
  RESULT_TEMPLATES,
  EXTERNAL_LINKS,
  GameResultType,
  getSocialShareUrl,
} from "../../constants/game-info";
import { DIFFICULTY_LEVELS, GAME_MODES } from "../../constants/game-constants";
import { Difficulty, GameMode } from "../../types/game-types";

interface ShareModalProps {
  showShareModal: boolean;
  shareResultType: GameResultType;
  setShowShareModal: (show: boolean) => void;
  setShareResultType: (type: GameResultType) => void;
  turn: number;
  gameMode: GameMode | null;
  difficulty: Difficulty;
}

const ShareModal: React.FC<ShareModalProps> = ({
  showShareModal,
  shareResultType,
  setShowShareModal,
  setShareResultType,
  turn,
  gameMode,
  difficulty,
}) => {
  // 클립보드에 URL 복사 함수
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("URL이 클립보드에 복사되었습니다!");
  };

  return (
    <Modal
      isOpen={showShareModal}
      onClose={() => {
        setShowShareModal(false);
        setShareResultType(null);
      }}
      title="양자 오목 공유하기"
    >
      <div className="space-y-4">
        {shareResultType ? (
          <>
            <div className="bg-gray-900 p-4 rounded-lg mb-4">
              <h3 className="font-bold text-lg mb-2 text-white">게임 결과</h3>
              <p className="text-cyan-300 font-medium">
                {RESULT_TEMPLATES[shareResultType]}
              </p>

              <div className="mt-3 text-sm text-gray-300 border-t border-gray-700 pt-3">
                <div className="flex justify-between mb-1">
                  <span>진행된 턴:</span>
                  <span>{turn}턴</span>
                </div>
                <div className="flex justify-between">
                  <span>게임 모드:</span>
                  <span>
                    {gameMode === GAME_MODES.LOCAL
                      ? "2인 오프라인"
                      : gameMode === GAME_MODES.VS_AI
                      ? "AI 대전"
                      : gameMode === GAME_MODES.TUTORIAL
                      ? "튜토리얼"
                      : "메인 메뉴"}
                    {gameMode === GAME_MODES.VS_AI &&
                      ` (${
                        difficulty === DIFFICULTY_LEVELS.EASY
                          ? "쉬움"
                          : difficulty === DIFFICULTY_LEVELS.MEDIUM
                          ? "보통"
                          : "어려움"
                      })`}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-300">
              게임 결과를 친구나 동료에게 공유해보세요:
            </p>
          </>
        ) : (
          <p className="text-gray-300">
            친구나 동료에게 양자 오목을 공유해보세요:
          </p>
        )}

        <div className="flex items-center bg-gray-700 rounded-lg p-2">
          <input
            type="text"
            value={window.location.href}
            readOnly
            className="bg-transparent flex-1 outline-none text-gray-300 px-2"
          />
          <button
            onClick={copyToClipboard}
            className="ml-2 p-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors"
            title="URL 복사하기"
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <a
            href={getSocialShareUrl("x", shareResultType)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-black hover:bg-gray-900 transition-colors flex items-center justify-center"
          >
            𝕏
          </a>
          <a
            href={getSocialShareUrl("facebook", shareResultType)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-blue-800 hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            Facebook
          </a>
          <a
            href={getSocialShareUrl("linkedin", shareResultType)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-[#0A66C2] hover:bg-[#004182] transition-colors flex items-center justify-center"
          >
            LinkedIn
          </a>
        </div>

        {shareResultType && (
          <div className="mt-4 p-3 bg-gray-700 rounded-lg text-center">
            <button
              className="flex items-center justify-center mx-auto text-sm"
              onClick={() => {
                const resultText = RESULT_TEMPLATES[shareResultType];
                navigator.clipboard.writeText(
                  `${resultText} #양자오목 ${window.location.href}`
                );
                alert("결과가 클립보드에 복사되었습니다!");
              }}
            >
              <Copy className="w-4 h-4 mr-1" />
              결과 텍스트 복사하기
            </button>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-700">
          <p className="text-gray-300 mb-3">이 프로젝트에 대해 더 알아보기:</p>
          <div className="space-y-2">
            <a
              href={EXTERNAL_LINKS.GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center w-full p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <Github className="w-5 h-5 mr-3" />
              <span className="font-medium">GitHub 저장소 방문하기</span>
            </a>

            <a
              href={EXTERNAL_LINKS.FEEDBACK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center w-full p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <MessageSquare className="w-5 h-5 mr-3" />
              <span className="font-medium">피드백 보내기</span>
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
