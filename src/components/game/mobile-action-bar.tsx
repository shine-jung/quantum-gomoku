"use client";

import { ActionType } from "../../types/game-types";
import { ACTION_INFO } from "../../constants/game-constants";

interface MobileActionBarProps {
  actions: ActionType[];
  selectedAction: ActionType | null;
  onSelectAction: (action: ActionType) => void;
  disabled: boolean;
}

const MobileActionBar: React.FC<MobileActionBarProps> = ({
  actions,
  selectedAction,
  onSelectAction,
  disabled,
}) => {
  return (
    <div className="w-full bg-gray-800 rounded-xl p-3 shadow-xl border border-gray-700">
      <div className="flex justify-around">
        {actions.map((action) => (
          <button
            key={action}
            className={`p-2 rounded-full flex flex-col justify-center items-center aspect-square ${
              selectedAction === action
                ? ACTION_INFO[action].activeColor
                : disabled
                ? ACTION_INFO[action].disabledColor
                : ACTION_INFO[action].color
            } transition-colors shadow-md ${!disabled && "hover:shadow-lg"}`}
            onClick={() => !disabled && onSelectAction(action)}
            disabled={disabled}
          >
            {ACTION_INFO[action].icon}
            <span className="text-white text-xs mt-1 font-medium">
              {ACTION_INFO[action].name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileActionBar;
