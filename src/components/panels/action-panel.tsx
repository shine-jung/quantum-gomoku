import React from "react";
import { AlertCircle, X } from "lucide-react";
import ActionButton from "../game/action-button";
import { ACTION_INFO } from "../../constants/game-constants";
import { ActionType } from "../../types/game-types";

interface ActionPanelProps {
  actions?: ActionType[];
  selectedAction?: ActionType | null;
  handleActionClick?: (action: ActionType) => void;
  disabled?: boolean;
  secondCellNeeded?: boolean;
  resetSelection: () => void;
  isMobile?: boolean;
}

const ActionPanel: React.FC<ActionPanelProps> = ({
  actions = [],
  selectedAction = null,
  handleActionClick,
  disabled = false,
  secondCellNeeded = false,
  resetSelection,
  isMobile = false,
}) => {
  // 모바일 레이아웃일 때는 간소화된 패널 보여주기
  if (isMobile) {
    return (
      <div className="w-full bg-gray-800 rounded-xl p-3 shadow-xl border border-gray-700">
        {selectedAction ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center">
              <span className="text-white font-medium mr-2">선택:</span>
              <span className="text-cyan-300 font-bold">
                {ACTION_INFO[selectedAction].name}
              </span>
            </div>
            {secondCellNeeded && (
              <div className="text-yellow-300 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />두 번째 셀 선택
              </div>
            )}
            <button
              className="ml-auto bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 transition-colors"
              onClick={resetSelection}
            >
              <X className="w-4 h-4" />
              취소
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-400 text-sm py-1">
            액션을 선택한 후 보드에서 셀을 클릭하세요
          </div>
        )}
      </div>
    );
  }

  // 데스크톱 레이아웃에서는 전체 패널 보여주기
  return (
    <div className="bg-gray-800 rounded-xl p-4 shadow-xl border border-gray-700">
      <h2 className="text-lg font-bold mb-3 text-white">액션</h2>
      <div className="space-y-2">
        {actions.map((action) => (
          <ActionButton
            key={action}
            type={action}
            onClick={() => handleActionClick && handleActionClick(action)}
            disabled={disabled}
            isActive={selectedAction === action}
          />
        ))}
      </div>
    </div>
  );
};

export default ActionPanel;
