"use client";

import Cell from "./cell";
import { Cell as CellType, CellPosition } from "../../types/game-types";
import { AlertCircle, Info, X } from "lucide-react";

interface BoardProps {
  board: CellType[][];
  selectedCell: CellPosition | null;
  highlightedCells: CellPosition[];
  handleCellClick: (x: number, y: number) => void;
  selectedAction: string | null;
  secondCellNeeded: boolean;
  actionHint: string | null;
  resetSelection: () => void;
  isMobile: boolean;
}

const Board: React.FC<BoardProps> = ({
  board,
  selectedCell,
  highlightedCells,
  handleCellClick,
  selectedAction,
  secondCellNeeded,
  actionHint,
  resetSelection,
  isMobile,
}) => {
  return (
    <div
      className={`
        ${isMobile ? "flex-col" : "flex-1"}
        bg-gray-800 rounded-xl p-4
        flex flex-col justify-center items-center
        shadow-xl border border-gray-700`}
    >
      <div
        className={`
          grid grid-cols-9 gap-${isMobile ? "0.5" : "1"}
          bg-gray-700 p-${isMobile ? "1" : "4"} rounded-lg shadow-inner`}
      >
        {board.map((row, x) =>
          row.map((cell, y) => (
            <Cell
              key={`${x}-${y}`}
              state={cell.state}
              entangled={cell.entangled}
              interfered={cell.interfered}
              interferencePlayer={cell.interferencePlayer}
              x={x}
              y={y}
              onClick={handleCellClick}
              isSelected={
                !!(selectedCell && selectedCell.x === x && selectedCell.y === y)
              }
              isHighlighted={highlightedCells.some(
                (cell) => cell.x === x && cell.y === y
              )}
              isWinningCell={cell.isWinningCell}
            />
          ))
        )}
      </div>

      {/* 항상 같은 높이를 유지하는 액션 정보 영역 */}
      {!isMobile && (
        <div className="mt-4 w-full h-14 flex items-center">
          {selectedAction ? (
            <div className="w-full bg-gray-700 p-3 rounded-lg flex items-center shadow-md">
              <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-md shadow-inner">
                <span className="text-white text-sm font-medium">
                  선택된 액션:
                </span>
                <span className="text-cyan-300 text-sm font-bold">
                  {selectedAction}
                </span>
              </div>

              {secondCellNeeded && (
                <div className="ml-3 text-yellow-300 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />두 번째 셀을
                  선택하세요
                </div>
              )}

              <button
                className="ml-auto bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1 transition-colors shadow-sm"
                onClick={resetSelection}
              >
                <X className="w-4 h-4" />
                취소
              </button>
            </div>
          ) : (
            // 선택된 액션이 없을 때는 빈 공간이지만 같은 높이 유지
            <div className="w-full h-14 flex items-center justify-center">
              {actionHint && (
                <div className="text-gray-300 text-sm flex items-center bg-gray-700 p-3 rounded-lg">
                  <Info className="w-4 h-4 mr-2" />
                  {actionHint}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Board;
