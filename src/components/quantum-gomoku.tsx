import { useState } from "react";
import {
  Home,
  HelpCircle,
  Settings,
  Volume2,
  VolumeX,
  Share2,
  Info,
} from "lucide-react";
import { Waves, Circle } from "lucide-react";

// 컴포넌트 임포트
import Board from "./game/board";
import MobileActionBar from "./game/mobile-action-bar";
import TeamTransition from "./game/team-transition";
import ActionPanel from "./panels/action-panel";
import LogPanel from "./panels/log-panel";

// 모달 컴포넌트 임포트
import HelpModal from "./modals/help-modal";
import TutorialModal from "./modals/tutorial-modal";
import SettingsModal from "./modals/settings-modal";
import ShareModal from "./modals/share-modal";
import FirstGameModal from "./modals/first-game-modal";
import VictoryModal from "./modals/victory-modal";

// 상수 및 커스텀 훅 임포트
import useGameState from "../hooks/use-game-state";
import { GAME_MODES } from "../constants/game-constants";
import { ACTION_INFO } from "../constants/game-constants";
import { GameResultType } from "../constants/game-info";

// 메인 메뉴 컴포넌트 임포트
import MainMenu from "./main-menu";

// 메인 게임 컴포넌트
const QuantumGomoku: React.FC = () => {
  const gameState = useGameState();
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
    isMobile,

    // 액션
    actions,
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
  } = gameState;

  // 공유 모달 상태
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  // 게임 결과 공유 타입 상태
  const [shareResultType, setShareResultType] = useState<GameResultType>(null);

  // 모드 선택 화면
  if (gameMode === null) {
    return (
      <MainMenu
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        handleGameModeSelect={handleGameModeSelect}
        showShareModal={showShareModal}
        setShowShareModal={setShowShareModal}
        shareResultType={shareResultType}
        setShareResultType={setShareResultType}
        turn={turn}
      />
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col p-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
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
            {/* 모바일이 아닐 때는 헤더에 공유 버튼 추가 */}
            <button
              className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
              onClick={() => setShowShareModal(true)}
              title="공유하기"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 - 모바일/데스크톱 레이아웃 분리 */}
      {isMobile ? (
        // 모바일 레이아웃
        <>
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
              isMobile
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

            {/* 액션 정보 및 힌트 표시 */}
            <ActionPanel
              selectedAction={selectedAction}
              secondCellNeeded={secondCellNeeded}
              resetSelection={resetSelection}
              isMobile
            />

            {/* 게임 로그 토글 버튼 그룹화 */}
            <div className="fixed bottom-4 right-4 flex flex-col gap-2">
              {/* 모바일에서 공유 버튼 추가 */}
              <button
                className="p-3 rounded-full bg-gray-700 shadow-lg"
                onClick={() => setShowShareModal(true)}
                title="공유하기"
              >
                <Share2 className="w-5 h-5 text-white" />
              </button>

              <button
                className="p-3 rounded-full bg-gray-700 shadow-lg"
                onClick={() => setShowLog(!showLog)}
                title="로그 보기"
              >
                <Info className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* 조건부 렌더링된 로그 패널 */}
          {showLog && <LogPanel gameLog={gameLog} isMobile={true} />}
        </>
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
            {/* 액션 버튼 패널 */}
            <ActionPanel
              actions={actions}
              selectedAction={selectedAction}
              handleActionClick={handleActionClick}
              disabled={
                !!selectedAction ||
                winner !== null ||
                (gameMode === GAME_MODES.VS_AI && activePlayer === 2)
              }
              secondCellNeeded={secondCellNeeded}
              resetSelection={resetSelection}
              isMobile={false}
            />

            {/* 게임 로그 패널 */}
            <LogPanel
              gameLog={gameLog}
              logContainerRef={logContainerRef}
              isMobile={false}
            />
          </div>
        </div>
      )}

      {/* 게임 결과 모달 */}
      <VictoryModal
        winner={winner}
        turn={turn}
        gameMode={gameMode}
        difficulty={difficulty}
        board={board}
        resetGame={resetGame}
        setGameMode={setGameMode}
        setShareResultType={setShareResultType}
        setShowShareModal={setShowShareModal}
      />

      {/* 첫 게임 시작 모달 */}
      <FirstGameModal
        isFirstGame={isFirstGame}
        gameMode={gameMode}
        setIsFirstGame={setIsFirstGame}
      />

      {/* 튜토리얼 모달 */}
      <TutorialModal
        showTutorial={showTutorial}
        tutorialStep={tutorialStep}
        setShowTutorial={setShowTutorial}
        setTutorialStep={setTutorialStep}
      />

      {/* 도움말 모달 */}
      <HelpModal
        showHelp={showHelp}
        setShowHelp={setShowHelp}
        setShowTutorial={setShowTutorial}
      />

      {/* 설정 모달 */}
      <SettingsModal
        showSettings={showSettings}
        muted={muted}
        gameMode={gameMode}
        difficulty={difficulty}
        setMuted={setMuted}
        setDifficulty={setDifficulty}
        resetGame={resetGame}
        setShowSettings={setShowSettings}
        setGameMode={setGameMode}
      />

      {/* 공유 모달 */}
      <ShareModal
        showShareModal={showShareModal}
        shareResultType={shareResultType}
        setShowShareModal={setShowShareModal}
        setShareResultType={setShareResultType}
        turn={turn}
        gameMode={gameMode}
        difficulty={difficulty}
      />
    </div>
  );
};

export default QuantumGomoku;
