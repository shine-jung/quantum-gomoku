"use client";

import {
  AlertCircle,
  Home,
  HelpCircle,
  Settings,
  Volume2,
  VolumeX,
  Info,
  X,
  Waves,
  Circle,
  Users,
  Cpu,
  Eye,
  Zap,
  Link as LinkIcon,
  Move,
  Unlink,
} from "lucide-react";
import Board from "./game/board";
import ActionButton from "./game/action-button";
import MobileActionBar from "./game/mobile-action-bar";
import TeamTransition from "./game/team-transition";
import Modal from "./ui/modal";
import useGameState from "../hooks/use-game-state";
import { tutorialContent } from "../constants/tutorial-content";
import { DIFFICULTY_LEVELS, GAME_MODES } from "../constants/game-constants";
import { ACTION_INFO } from "../constants/game-constants";

// 메인 게임 컴포넌트
const QuantumGomoku: React.FC = () => {
  const {
    // 게임 상태
    board,
    selectedCell,
    secondCellNeeded,
    selectedAction,
    activePlayer,
    turn,
    gameLog,
    logContainerRef,
    winner,
    gameMode,
    difficulty,
    isThinking,
    highlightedCells,
    muted,
    showTutorial,
    tutorialStep,
    showHelp,
    showSettings,
    actionHint,
    isFirstGame,
    showLog,
    viewportHeight,
    isMobile,

    // 액션
    actions,
    playSound,
    resetGame,
    handleGameModeSelect,
    resetSelection,
    handleActionClick,
    handleCellClick,

    // 설정 변경
    setDifficulty,
    setMuted,
    setShowTutorial,
    setTutorialStep,
    setShowHelp,
    setShowSettings,
    setIsFirstGame,
    setShowLog,
    setGameMode,
  } = useGameState();

  // 스크롤 없는 레이아웃을 위한 스케일 조정
  const containerStyle = isMobile
    ? {
        transform: `scale(${Math.min(1, viewportHeight / 700)})`,
        transformOrigin: "top center",
        height: "100%",
        maxHeight: "100vh",
        overflow: "hidden",
      }
    : {};

  // 모드 선택 화면
  if (gameMode === null) {
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
            <h3 className="text-xl font-bold mb-4 text-center">
              게임 모드 선택
            </h3>

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

          <div className="text-center text-sm text-gray-400">
            <p>
              양자 물리학의 원리(중첩, 측정, 얽힘, 간섭)를 활용한 전략 보드 게임
            </p>
            <p className="mt-1">Version 2.1.0</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen flex flex-col p-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white"
      style={containerStyle}
    >
      {/* 팀 전환 애니메이션 */}
      <TeamTransition activePlayer={activePlayer} winner={winner} />

      {/* 상단 헤더 - 모바일/데스크톱 레이아웃 분리 */}
      {isMobile ? (
        // 모바일 레이아웃: 두 줄로 분리
        <div className="flex flex-col mb-4 space-y-2">
          {/* 첫 번째 줄: 제목과 버튼들 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold mr-2">Q. Gomoku</h1>
              <button
                className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
                onClick={() => setGameMode(null)}
                title="메인 메뉴"
              >
                <Home className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
                onClick={() => setShowHelp(true)}
                title="도움말"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              <button
                className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
                onClick={() => setShowSettings(true)}
                title="설정"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
                onClick={() => setMuted(!muted)}
                title={muted ? "음소거 해제" : "음소거"}
              >
                {muted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* 두 번째 줄: 팀 정보와 턴 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div
                className={`px-3 py-1 rounded-md ${
                  activePlayer === 1
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 shadow-md"
                    : "bg-blue-900 text-blue-300"
                } text-white text-sm font-medium flex items-center gap-1 transition-all`}
              >
                <Waves className="w-4 h-4" />
                <span>파동팀</span>
                {gameMode === GAME_MODES.VS_AI && (
                  <span className="text-xs bg-blue-800 px-1 py-0.5 rounded-full">
                    P
                  </span>
                )}
              </div>
              <div
                className={`px-3 py-1 rounded-md ${
                  activePlayer === 2
                    ? "bg-gradient-to-r from-red-600 to-red-700 shadow-md"
                    : "bg-red-900 text-red-300"
                } text-white text-sm font-medium flex items-center gap-1 transition-all`}
              >
                <Circle className="w-4 h-4" />
                <span>입자팀</span>
                {gameMode === GAME_MODES.VS_AI && (
                  <span className="text-xs bg-red-800 px-1 py-0.5 rounded-full">
                    AI
                  </span>
                )}
              </div>
              <div className="px-2 py-1 rounded-md bg-gray-800 text-white text-sm font-medium">
                {turn}턴
              </div>
            </div>

            {isThinking && (
              <div className="px-2 py-1 rounded-md bg-purple-600 text-white text-sm flex items-center">
                <div className="mr-1">AI 생각중</div>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 rounded-full bg-white animate-pulse"></div>
                  <div
                    className="w-1 h-1 rounded-full bg-white animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-1 h-1 rounded-full bg-white animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // 데스크톱 레이아웃: 한 줄로 모든 요소 배치
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold mr-4">Quantum Gomoku</h1>
            <button
              className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
              onClick={() => setGameMode(null)}
              title="메인 메뉴"
            >
              <Home className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`px-3 py-1 rounded-md ${
                activePlayer === 1
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 shadow-md"
                  : "bg-blue-900 text-blue-300"
              } text-white text-sm font-medium flex items-center gap-1 transition-all`}
            >
              <Waves className="w-4 h-4" />
              <span className="inline">파동팀</span>
              {gameMode === GAME_MODES.VS_AI && (
                <span className="text-xs bg-blue-800 px-1 py-0.5 rounded-full">
                  P
                </span>
              )}
            </div>
            <div
              className={`px-3 py-1 rounded-md ${
                activePlayer === 2
                  ? "bg-gradient-to-r from-red-600 to-red-700 shadow-md"
                  : "bg-red-900 text-red-300"
              } text-white text-sm font-medium flex items-center gap-1 transition-all`}
            >
              <Circle className="w-4 h-4" />
              <span className="inline">입자팀</span>
              {gameMode === GAME_MODES.VS_AI && (
                <span className="text-xs bg-red-800 px-1 py-0.5 rounded-full">
                  AI
                </span>
              )}
            </div>
            <div className="px-2 py-1 rounded-md bg-gray-800 text-white text-sm font-medium">
              {turn}턴
            </div>
            <div
              className={`px-2 py-1 rounded-md bg-purple-600 text-white text-xs sm:text-sm flex items-center
    transition-opacity duration-300 ${
      isThinking ? "opacity-100" : "opacity-0"
    }`}
            >
              <div className="mr-1">AI 생각중</div>
              <div className="flex space-x-1">
                <div className="w-1 h-1 rounded-full bg-white animate-pulse"></div>
                <div
                  className="w-1 h-1 rounded-full bg-white animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-1 h-1 rounded-full bg-white animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
              onClick={() => setShowHelp(true)}
              title="도움말"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button
              className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
              onClick={() => setShowSettings(true)}
              title="설정"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
              onClick={() => setMuted(!muted)}
              title={muted ? "음소거 해제" : "음소거"}
            >
              {muted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 - 모바일/데스크톱 레이아웃 분리 */}
      {isMobile ? (
        // 모바일 레이아웃
        <div className="flex flex-col space-y-4">
          {/* 게임 보드 */}
          <Board
            board={board}
            selectedCell={selectedCell}
            highlightedCells={highlightedCells}
            handleCellClick={handleCellClick}
            selectedAction={
              selectedAction ? ACTION_INFO[selectedAction].name : null
            }
            secondCellNeeded={secondCellNeeded}
            actionHint={actionHint}
            resetSelection={resetSelection}
            isMobile={isMobile}
          />

          {/* 모바일용 액션 바 */}
          <MobileActionBar
            actions={actions}
            selectedAction={selectedAction}
            onSelectAction={handleActionClick}
            disabled={
              !!selectedAction ||
              winner !== null ||
              (gameMode === GAME_MODES.VS_AI && activePlayer === 2)
            }
          />

          {/* 액션 정보 및 힌트 */}
          <div className="w-full bg-gray-800 rounded-xl p-3 shadow-xl border border-gray-700">
            {selectedAction ? (
              <div className="flex items-center justify-between">
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

          {/* 게임 로그 토글 */}
          <button
            className="fixed bottom-4 right-4 p-3 rounded-full bg-gray-700 shadow-lg"
            onClick={() => setShowLog(!showLog)}
          >
            <Info className="w-5 h-5 text-white" />
          </button>

          {/* 조건부 렌더링된 로그 패널 */}
          {showLog && (
            <div className="fixed bottom-16 right-4 w-64 max-h-48 bg-gray-800 rounded-xl p-3 shadow-xl overflow-auto">
              <h3 className="font-bold text-sm mb-2">게임 로그</h3>
              <div className="text-xs text-gray-300 space-y-1 max-h-36 overflow-y-auto">
                {gameLog.map((log, index) => (
                  <div
                    key={index}
                    className="border-l-2 border-gray-700 pl-2 py-0.5"
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        // 데스크톱 레이아웃
        <div className="flex flex-grow gap-4">
          {/* 왼쪽: 게임 보드 */}
          <Board
            board={board}
            selectedCell={selectedCell}
            highlightedCells={highlightedCells}
            handleCellClick={handleCellClick}
            selectedAction={
              selectedAction ? ACTION_INFO[selectedAction].name : null
            }
            secondCellNeeded={secondCellNeeded}
            actionHint={actionHint}
            resetSelection={resetSelection}
            isMobile={isMobile}
          />

          {/* 오른쪽: 컨트롤 패널 */}
          <div className="w-80 flex flex-col gap-4">
            {/* 액션 버튼 */}
            <div className="bg-gray-800 rounded-xl p-4 shadow-xl border border-gray-700">
              <h2 className="text-lg font-bold mb-3 text-white">액션</h2>
              <div className="space-y-2">
                {actions.map((action) => (
                  <ActionButton
                    key={action}
                    type={action}
                    onClick={() => handleActionClick(action)}
                    disabled={
                      !!selectedAction ||
                      winner !== null ||
                      (gameMode === GAME_MODES.VS_AI && activePlayer === 2)
                    }
                    isActive={selectedAction === action}
                  />
                ))}
              </div>
            </div>

            {/* 게임 로그 */}
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
          </div>
        </div>
      )}

      {/* 승리 오버레이 */}
      {winner !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-10 animate-fadeIn p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md text-center shadow-2xl border border-gray-700">
            <h2 className="text-3xl font-bold mb-4 text-white">
              {winner === 0
                ? "무승부!"
                : `${winner === 1 ? "파동팀" : "입자팀"} 승리!`}
            </h2>
            <div className="mb-6">
              {winner === 0 ? (
                <p className="text-xl text-gray-300">
                  모든 셀이 확정되었으나 연속된 5개를 만들지 못했습니다.
                </p>
              ) : (
                <p className="text-xl text-gray-300">
                  {winner === 1 ? "파란색" : "빨간색"} 상태로 연속된 5개의 셀을
                  만들었습니다!
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all"
                onClick={resetGame}
              >
                새 게임 시작
              </button>
              <button
                className="bg-gray-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:bg-gray-600 transition-all"
                onClick={() => setGameMode(null)}
              >
                메인 메뉴
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 첫 게임 시작 시 도움말 팝업 */}
      {isFirstGame && gameMode !== GAME_MODES.TUTORIAL && (
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
      )}

      {/* 튜토리얼 모달 */}
      <Modal
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        title={`튜토리얼 ${tutorialStep + 1}/${tutorialContent.length}: ${
          tutorialContent[tutorialStep].title
        }`}
      >
        <div className="mb-6">{tutorialContent[tutorialStep].content}</div>
        <div className="flex justify-between">
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-gray-600 transition-all"
            onClick={() => {
              if (tutorialStep > 0) {
                setTutorialStep(tutorialStep - 1);
              } else {
                setShowTutorial(false);
              }
            }}
          >
            {tutorialStep > 0 ? "이전" : "닫기"}
          </button>
          <button
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all"
            onClick={() => {
              if (tutorialStep < tutorialContent.length - 1) {
                setTutorialStep(tutorialStep + 1);
              } else {
                setShowTutorial(false);
              }
            }}
          >
            {tutorialStep < tutorialContent.length - 1 ? "다음" : "완료"}
          </button>
        </div>
      </Modal>

      {/* 도움말 모달 */}
      <Modal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        title="게임 도움말"
      >
        <div className="space-y-4 mb-4">
          <div>
            <h3 className="text-lg font-bold mb-2 text-white">상태 설명</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center p-2 bg-gray-700 rounded-lg">
                <div className="w-8 h-8 mr-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-md flex items-center justify-center">
                  <Waves className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold">파동 상태</div>
                  <div className="text-xs text-gray-300">파동팀의 색상</div>
                </div>
              </div>
              <div className="flex items-center p-2 bg-gray-700 rounded-lg">
                <div className="w-8 h-8 mr-2 bg-gradient-to-r from-red-500 to-red-600 rounded-md flex items-center justify-center">
                  <Circle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold">입자 상태</div>
                  <div className="text-xs text-gray-300">입자팀의 색상</div>
                </div>
              </div>
              <div className="flex items-center p-2 bg-gray-700 rounded-lg">
                <div className="w-8 h-8 mr-2 bg-gradient-to-r from-blue-400 via-purple-500 to-red-400 rounded-md flex items-center justify-center">
                  <div className="relative">
                    <Waves className="w-4 h-4 text-white opacity-50 absolute" />
                    <Circle className="w-4 h-4 text-white opacity-50" />
                  </div>
                </div>
                <div>
                  <div className="font-semibold">중첩 상태</div>
                  <div className="text-xs text-gray-300">측정 전 기본 상태</div>
                </div>
              </div>
              <div className="flex items-center p-2 bg-gray-700 rounded-lg">
                <div className="w-8 h-8 mr-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-md flex items-center justify-center relative">
                  <Waves className="w-4 h-4 text-white" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center">
                    <LinkIcon className="w-2 h-2 text-yellow-800" />
                  </div>
                </div>
                <div>
                  <div className="font-semibold">얽힘 상태</div>
                  <div className="text-xs text-gray-300">
                    한 셀의 변화가 다른 셀에 영향
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2 text-white">액션 설명</h3>
            <div className="space-y-2">
              <div className="p-2 bg-gray-700 rounded-lg">
                <div className="flex items-center mb-1">
                  <Eye className="w-4 h-4 text-green-400 mr-2" />
                  <span className="font-semibold">측정하기</span>
                </div>
                <p className="text-sm text-gray-300">
                  중첩 상태의 셀을 측정합니다. 자신의 팀 색상이 나올 확률은
                  60%입니다.
                </p>
              </div>

              <div className="p-2 bg-gray-700 rounded-lg">
                <div className="flex items-center mb-1">
                  <Zap className="w-4 h-4 text-cyan-400 mr-2" />
                  <span className="font-semibold">간섭하기</span>
                </div>
                <p className="text-sm text-gray-300">
                  확정 상태 셀을 65% 확률로 반전시키거나, 중첩 상태 셀의 측정
                  확률을 70%로 변경합니다.
                </p>
              </div>

              <div className="p-2 bg-gray-700 rounded-lg">
                <div className="flex items-center mb-1">
                  <LinkIcon className="w-4 h-4 text-yellow-400 mr-2" />
                  <span className="font-semibold">얽힘 생성</span>
                </div>
                <p className="text-sm text-gray-300">
                  두 확정 셀을 얽힘 상태로 만듭니다. 한 셀의 상태 변화가 다른
                  셀에도 같이 적용됩니다.
                </p>
              </div>

              <div className="p-2 bg-gray-700 rounded-lg">
                <div className="flex items-center mb-1">
                  <Move className="w-4 h-4 text-orange-400 mr-2" />
                  <span className="font-semibold">양자 도약</span>
                </div>
                <p className="text-sm text-gray-300">
                  자신의 팀 색상 셀을 다른 위치로 이동합니다. 얽힘 관계도 함께
                  이동합니다.
                </p>
              </div>

              <div className="p-2 bg-gray-700 rounded-lg">
                <div className="flex items-center mb-1">
                  <Unlink className="w-4 h-4 text-red-400 mr-2" />
                  <span className="font-semibold">얽힘 파괴</span>
                </div>
                <p className="text-sm text-gray-300">
                  얽힘 상태를 해제합니다. 최근 1턴 내에 생성된 얽힘은 파괴할 수
                  없습니다.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2 text-white">게임 규칙</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
              <li>
                연속된 5개의 셀을 자신의 팀 색상으로 만들면 즉시 승리합니다.
              </li>
              <li>파동팀(파란색)이 선공, 입자팀(빨간색)이 후공입니다.</li>
              <li>
                모든 셀이 확정 상태가 되었는데 승리 조건을 달성한 팀이 없으면
                무승부입니다.
              </li>
            </ul>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => {
              setShowHelp(false); // 도움말 모달 닫기
              setShowTutorial(true); // 튜토리얼 모달 열기
            }}
            className="mr-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:from-teal-500 hover:to-teal-600 transition-all"
          >
            튜토리얼 보기
          </button>
          <button
            onClick={() => setShowHelp(false)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-gray-600 transition-all"
          >
            닫기
          </button>
        </div>
      </Modal>

      {/* 설정 모달 */}
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
                  muted
                    ? "bg-gray-600 text-gray-300"
                    : "bg-green-600 text-white"
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
    </div>
  );
};

export default QuantumGomoku;
