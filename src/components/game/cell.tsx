"use client";

import { memo } from "react";
import { Waves, Circle, Sparkles } from "lucide-react";
import { Link as LinkIcon } from "lucide-react";
import { CellState, PlayerTeam } from "../../types/game-types";
import { QUANTUM_STATES } from "../../constants/game-constants";

interface CellProps {
  state: CellState;
  entangled: boolean;
  interfered: boolean;
  interferencePlayer: PlayerTeam | null;
  x: number;
  y: number;
  onClick: (x: number, y: number) => void;
  isSelected: boolean;
  isHighlighted: boolean;
  isWinningCell: boolean;
}

const Cell = memo<CellProps>(
  ({
    state,
    entangled,
    interfered,
    interferencePlayer,
    x,
    y,
    onClick,
    isSelected,
    isHighlighted,
    isWinningCell,
  }) => {
    // 셀 상태에 따른 스타일 계산
    const getCellStyle = (): string => {
      let baseClasses =
        "w-9 h-9 sm:w-12 sm:h-12 md:w-9 md:h-9 lg:w-12 lg:h-12 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-200 relative shadow-md";

      // 선택된 셀에 하이라이트 추가
      if (isSelected) {
        baseClasses += " ring-2 ring-white shadow-lg scale-105 z-10";
      }

      // 하이라이트된 셀 표시
      if (isHighlighted) {
        baseClasses += " ring-2 ring-yellow-400";
      }

      // 승리 조건을 만족하는 셀 표시
      if (isWinningCell) {
        baseClasses += " ring-4 ring-purple-500 z-10";
      }

      // 상태에 따른 색상 적용
      switch (state) {
        case QUANTUM_STATES.WAVE:
          return `${baseClasses} bg-gradient-to-br from-blue-500 to-blue-700 border-blue-800 hover:shadow-blue-500/20 hover:shadow-lg`;
        case QUANTUM_STATES.PARTICLE:
          return `${baseClasses} bg-gradient-to-br from-red-500 to-red-700 border-red-800 hover:shadow-red-500/20 hover:shadow-lg`;
        case QUANTUM_STATES.SUPERPOSITION:
          return `${baseClasses} bg-gradient-to-r from-blue-400 via-purple-500 to-red-400 border-purple-800 hover:shadow-purple-500/20 hover:shadow-lg`;
        default:
          return `${baseClasses} bg-gray-300 border-gray-500 hover:bg-gray-200`;
      }
    };

    // 상태에 따른 아이콘 렌더링
    const getIcon = () => {
      switch (state) {
        case QUANTUM_STATES.WAVE:
          return (
            <div className="absolute inset-0 flex items-center justify-center">
              <Waves className="w-6 h-6 text-white drop-shadow-md" />
            </div>
          );
        case QUANTUM_STATES.PARTICLE:
          return (
            <div className="absolute inset-0 flex items-center justify-center">
              <Circle className="w-6 h-6 text-white drop-shadow-md" />
            </div>
          );
        case QUANTUM_STATES.SUPERPOSITION:
          return (
            <div className="absolute inset-0 flex items-center justify-center">
              <Waves
                className="w-6 h-6 text-white opacity-60 absolute"
                strokeWidth={1.5}
              />
              <Circle
                className="w-6 h-6 text-white opacity-60"
                strokeWidth={1.5}
              />
              <Sparkles
                className="w-6 h-6 text-white opacity-40 absolute"
                strokeWidth={1}
              />
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div
        className={getCellStyle()}
        onClick={() => onClick(x, y)}
        title={`셀 위치: (${x}, ${y})`}
      >
        {getIcon()}

        {/* 얽힘 상태 표시 */}
        {entangled && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center shadow-md shadow-yellow-400/50">
            <LinkIcon className="w-2 h-2 text-yellow-800" />
          </div>
        )}

        {/* 간섭 상태 표시 (플레이어 색상으로 표시) */}
        {interfered && (
          <div
            className={`absolute inset-0 rounded-lg border-4 opacity-70 z-0 ${
              interferencePlayer === 1
                ? "border-blue-400 bg-blue-400/10"
                : "border-red-400 bg-red-400/10"
            }`}
          />
        )}
      </div>
    );
  }
);

Cell.displayName = "Cell";

export default Cell;
