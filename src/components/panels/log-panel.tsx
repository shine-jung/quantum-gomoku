import React from "react";

interface LogPanelProps {
  gameLog: string[];
  logContainerRef?: React.RefObject<HTMLDivElement | null>;
  isMobile: boolean;
}

const LogPanel: React.FC<LogPanelProps> = ({
  gameLog,
  logContainerRef,
  isMobile,
}) => {
  // 모바일 레이아웃
  if (isMobile) {
    return (
      <div className="fixed bottom-16 right-4 w-64 max-h-48 bg-gray-800 rounded-xl p-3 shadow-xl overflow-auto">
        <h3 className="font-bold text-sm mb-2">게임 로그</h3>
        <div className="text-xs text-gray-300 space-y-1 max-h-36 overflow-y-auto">
          {gameLog.map((log, index) => (
            <div key={index} className="border-l-2 border-gray-700 pl-2 py-0.5">
              {log}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 데스크톱 레이아웃
  return (
    <div className="bg-gray-800 rounded-xl p-4 flex-1 shadow-xl border border-gray-700 flex flex-col">
      <h2 className="text-lg font-bold mb-2 text-white">게임 로그</h2>
      <div
        ref={logContainerRef}
        className="flex-1 text-sm text-gray-300 font-mono space-y-1 overflow-y-auto rounded-lg bg-gray-900 p-3 shadow-inner"
        style={{ maxHeight: "300px", overflowY: "auto" }}
      >
        {gameLog.length === 0 ? (
          <div className="text-center text-gray-500 py-2">
            게임 로그가 여기에 표시됩니다.
          </div>
        ) : (
          gameLog.map((log, index) => (
            <div
              key={index}
              className="border-l-2 border-gray-700 pl-2 py-1 hover:bg-gray-800 transition-colors"
            >
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LogPanel;
