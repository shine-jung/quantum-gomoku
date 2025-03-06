"use client";

import { ActionType } from "../../types/game-types";
import { ACTION_INFO } from "../../constants/game-constants";

interface ActionButtonProps {
  type: ActionType;
  onClick: () => void;
  disabled: boolean;
  isActive: boolean;
  isMobile?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  type,
  onClick,
  disabled,
  isActive,
}) => {
  const actionInfo = ACTION_INFO[type];

  return (
    <div className="relative group">
      <button
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white w-full ${
          isActive
            ? actionInfo.activeColor
            : disabled
            ? actionInfo.disabledColor
            : `${actionInfo.color} ${actionInfo.hoverColor}`
        } ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "shadow-md hover:shadow-lg transition-all"
        }`}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
      >
        <div className="p-1.5 bg-white/10 rounded-full">{actionInfo.icon}</div>
        <span className="text-sm font-medium">{actionInfo.name}</span>
      </button>

      {/* 호버 시 툴팁 표시 */}
      <div className="absolute z-50 right-full top-0 mr-2 w-64 bg-gray-800 text-white text-xs rounded-lg p-3 hidden group-hover:block shadow-xl">
        <div className="font-bold mb-1">{actionInfo.name}</div>
        <div>{actionInfo.description}</div>
      </div>
    </div>
  );
};

export default ActionButton;
