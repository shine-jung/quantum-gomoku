import React from "react";
import { X } from "lucide-react";
import { GAME_MODES } from "../../constants/game-constants";
import { GameMode } from "../../types/game-types";

interface FirstGameModalProps {
  isFirstGame: boolean;
  gameMode: GameMode;
  setIsFirstGame: (isFirstGame: boolean) => void;
}

const FirstGameModal: React.FC<FirstGameModalProps> = ({
  isFirstGame,
  gameMode,
  setIsFirstGame,
}) => {
  if (!isFirstGame || gameMode === GAME_MODES.TUTORIAL) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fadeIn p-4">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">게임 시작!</h2>
          <button
            onClick={() => setIsFirstGame(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="text-gray-200 space-y-3">
          <p>
            양자 오목에 오신 것을 환영합니다! 연속된 5개의 셀을 자신의 팀
            색상으로 만들면 승리합니다.
          </p>
          <p>
            각 턴마다 액션을 선택한 후 보드에서 셀을 클릭하세요. 액션에 따라
            셀의 상태가 변경됩니다.
          </p>
          <p>
            액션 버튼에 마우스를 올리면 상세 설명을 볼 수 있습니다. 게임 중
            도움이 필요하면 우측 상단의 도움말 버튼을 클릭하세요.
          </p>
          <div className="flex justify-end mt-4">
            <button
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:from-blue-500 hover:to-purple-500 transition-all"
              onClick={() => setIsFirstGame(false)}
            >
              게임 시작
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstGameModal;
