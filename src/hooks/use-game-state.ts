"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  ActionType,
  Cell,
  CellPosition,
  Difficulty,
  GameMode,
  PlayerTeam,
} from "../types/game-types";
import {
  BOARD_SIZE,
  DIFFICULTY_LEVELS,
  GAME_MODES,
  QUANTUM_STATES,
  SOUND_EFFECTS,
} from "../constants/game-constants";
import { createInitialBoard, checkWin } from "../utils/game-utils";
import { executeAction } from "../utils/game-actions";
import { selectAIAction } from "../utils/ai-logic";

export const useGameState = () => {
  // 스케일 조정을 위한 설정
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // 게임 상태
  const [board, setBoard] = useState<Cell[][]>(createInitialBoard());
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [secondCellNeeded, setSecondCellNeeded] = useState<boolean>(false);
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
  const [activePlayer, setActivePlayer] = useState<PlayerTeam>(1); // 1: 파동팀, 2: 입자팀
  const [turn, setTurn] = useState<number>(1);
  const [gameLog, setGameLog] = useState<string[]>([]);
  const [winner, setWinner] = useState<PlayerTeam | null | 0>(null); // 0은 무승부
  const [gameMode, setGameMode] = useState<GameMode | null>(null); // 초기에는 모드 선택 화면
  const [difficulty, setDifficulty] = useState<Difficulty>(
    DIFFICULTY_LEVELS.MEDIUM
  );
  const [isThinking, setIsThinking] = useState<boolean>(false); // AI 생각 중 상태
  const [highlightedCells, setHighlightedCells] = useState<CellPosition[]>([]);
  const [muted, setMuted] = useState<boolean>(false);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [tutorialStep, setTutorialStep] = useState<number>(0);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [actionHint, setActionHint] = useState<string | null>(null);
  const [isFirstGame, setIsFirstGame] = useState<boolean>(true);
  const [showLog, setShowLog] = useState<boolean>(false);

  // 로그 참조
  const logContainerRef = useRef<HTMLDivElement>(null);

  // 사용 가능한 액션
  const actions: ActionType[] = [
    "measure",
    "interfere",
    "entangle",
    "quantum-leap",
    "break-entanglement",
  ];

  // 환경 설정 (뷰포트 높이, 모바일 감지)
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 모바일 감지
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };

      // 초기 체크
      checkIfMobile();

      // 리사이즈 이벤트 핸들러
      const handleResize = () => {
        checkIfMobile();
      };

      window.addEventListener("resize", handleResize);

      // 클린업 함수
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // 오디오 효과 재생
  const playSound = useCallback(
    (soundName: string): void => {
      if (muted) return;
      // 실제 구현 시에는 여기에 오디오 재생 코드 추가
      console.log(`Playing sound: ${soundName}`);
    },
    [muted]
  );

  // 로그 추가
  const addLog = useCallback((message: string): void => {
    // 로그 최대 개수 제한
    setGameLog((prev) => {
      const newLog = [...prev, message];
      // 최대 30개만 유지
      if (newLog.length > 30) {
        return newLog.slice(newLog.length - 30);
      }
      return newLog;
    });
  }, []);

  // 보드 초기화
  const resetGame = useCallback(() => {
    setBoard(createInitialBoard());
    setSelectedCell(null);
    setSecondCellNeeded(false);
    setSelectedAction(null);
    setActivePlayer(1); // 항상 파동팀(플레이어)부터 시작
    setTurn(1);
    setGameLog([]);
    setWinner(null);
    setHighlightedCells([]);
    setActionHint(null);
    setIsThinking(false); // AI 생각 중 상태 초기화 추가

    // 게임 시작 로그 메시지 추가
    const startMessage =
      gameMode === GAME_MODES.VS_AI
        ? `게임을 시작합니다. AI 난이도: ${difficulty}. 플레이어(파동팀)의 턴입니다.`
        : "게임을 시작합니다. 플레이어 1(파동팀)의 턴입니다.";

    addLog(startMessage);
    setIsFirstGame(false);
  }, [gameMode, difficulty, addLog]);

  // 게임 모드 변경 처리
  const handleGameModeSelect = useCallback(
    (mode: GameMode): void => {
      setGameMode(mode);

      // 튜토리얼 모드인 경우 튜토리얼 시작
      if (mode === GAME_MODES.TUTORIAL) {
        setShowTutorial(true);
        setTutorialStep(0);
      }

      resetGame();
    },
    [resetGame]
  );

  // 승리 조건 감지
  useEffect(() => {
    // 이미 승리자가 결정된 경우 체크하지 않음
    if (winner !== null) return;

    const checkResult = checkWin(board);
    if (checkResult) {
      const winningTeam = checkResult.winningTeam;
      const winningCells = checkResult.winningCells;

      // 승리 셀 표시
      const newBoard: Cell[][] = JSON.parse(JSON.stringify(board));
      winningCells.forEach(({ x, y }) => {
        newBoard[x][y].isWinningCell = true;
      });
      setBoard(newBoard);

      playSound(SOUND_EFFECTS.WIN);
      setWinner(winningTeam);
      addLog(`게임 종료! ${winningTeam === 1 ? "파동팀" : "입자팀"} 승리!`);
    }
  }, [board, winner, playSound, addLog]);

  // 선택 초기화
  const resetSelection = useCallback((): void => {
    setSelectedAction(null);
    setSelectedCell(null);
    setSecondCellNeeded(false);
    setHighlightedCells([]);
  }, []);

  // 턴 종료
  const endTurn = useCallback((): void => {
    // 선택 상태 초기화
    resetSelection();

    // 게임이 이미 끝났으면 더 이상 진행하지 않음
    if (winner !== null) return;

    // 일반 턴 진행
    setTurn((prev) => prev + 1);
    const nextPlayer = activePlayer === 1 ? 2 : 1;
    setActivePlayer(nextPlayer);

    // 게임이 끝나지 않았을 때만 턴 종료 메시지 표시
    if (winner === null) {
      addLog(`턴 ${turn} 종료. ${nextPlayer === 1 ? "파동" : "입자"}팀 턴`);
    }
  }, [activePlayer, turn, winner, resetSelection, addLog]);

  // 액션에 따라 가능한 셀 하이라이트
  const highlightPossibleCells = useCallback(
    (action: ActionType): void => {
      const highlighted: CellPosition[] = [];
      const teamColor =
        activePlayer === 1 ? QUANTUM_STATES.WAVE : QUANTUM_STATES.PARTICLE;

      for (let x = 0; x < BOARD_SIZE; x++) {
        for (let y = 0; y < BOARD_SIZE; y++) {
          const cell = board[x][y];

          switch (action) {
            case "measure":
              // 중첩 상태 셀만 측정 가능
              if (cell.state === QUANTUM_STATES.SUPERPOSITION) {
                highlighted.push({ x, y });
              }
              break;
            case "interfere":
              // 모든 셀에 간섭 가능 (단, 최근 간섭한 셀 제외)
              if (cell.interferenceCreatedAt !== turn - 1) {
                highlighted.push({ x, y });
              }
              break;
            case "entangle":
              // 확정 상태이면서 얽힘 상태가 아닌 셀만 얽힘 생성 가능
              if (
                cell.state !== QUANTUM_STATES.SUPERPOSITION &&
                !cell.entangled
              ) {
                highlighted.push({ x, y });
              }
              break;
            case "quantum-leap":
              // 자신의 팀 색상 셀만 도약 가능
              if (cell.state === teamColor) {
                highlighted.push({ x, y });
              }
              break;
            case "break-entanglement":
              // 얽힘 상태이면서 최근 1턴 내에 얽힌 셀이 아닌 경우만 얽힘 파괴 가능
              if (cell.entangled && cell.entanglementCreatedAt !== turn - 1) {
                highlighted.push({ x, y });
              }
              break;
          }
        }
      }

      setHighlightedCells(highlighted);
    },
    [board, activePlayer, turn]
  );

  // 액션 카드 클릭 처리
  const handleActionClick = useCallback(
    (action: ActionType): void => {
      playSound(SOUND_EFFECTS.CLICK);

      if (winner !== null) return; // 게임이 끝났으면 더 이상 액션 불가
      if (gameMode === GAME_MODES.VS_AI && activePlayer === 2) return; // AI 턴일 때는 플레이어 액션 불가

      setSelectedAction(action);
      setSelectedCell(null);
      setSecondCellNeeded(false);
      setHighlightedCells([]);

      const actionNames: Record<ActionType, string> = {
        measure: "측정하기",
        interfere: "간섭하기",
        entangle: "얽힘 생성",
        "quantum-leap": "양자 도약",
        "break-entanglement": "얽힘 파괴",
      };

      addLog(`'${actionNames[action]}' 액션을 선택했습니다.`);

      // 액션에 따른 가능한 셀 하이라이트
      highlightPossibleCells(action);
    },
    [winner, gameMode, activePlayer, playSound, addLog, highlightPossibleCells]
  );

  // 로그 스크롤 자동 이동
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [gameLog]);

  // 액션 실행 함수
  const processAction = useCallback(
    (
      x: number,
      y: number,
      secondX: number | null = null,
      secondY: number | null = null,
      actionOverride: ActionType | null = null
    ): void => {
      const actionToExecute = actionOverride || selectedAction;

      const { newBoard, logMessage, actionSuccessful } = executeAction(
        board,
        x,
        y,
        secondX,
        secondY,
        actionToExecute,
        activePlayer,
        turn,
        playSound
      );

      addLog(logMessage);

      if (actionSuccessful) {
        setBoard(newBoard);
        endTurn();
      } else {
        resetSelection();
      }
    },
    [
      board,
      selectedAction,
      activePlayer,
      turn,
      playSound,
      addLog,
      endTurn,
      resetSelection,
    ]
  );

  // 셀 클릭 처리
  const handleCellClick = useCallback(
    (x: number, y: number): void => {
      playSound(SOUND_EFFECTS.CLICK);

      if (winner !== null) return; // 게임이 끝났으면 더 이상 액션 불가
      if (gameMode === GAME_MODES.VS_AI && activePlayer === 2) return; // AI 턴일 때는 플레이어 액션 불가

      if (selectedAction) {
        if (!selectedCell) {
          setSelectedCell({ x, y });
          addLog(`(${x},${y}) 좌표의 셀을 선택했습니다.`);

          // 이 액션이 두 번째 셀을 필요로 하는지 확인
          if (
            selectedAction === "entangle" ||
            selectedAction === "quantum-leap"
          ) {
            // 얽힘 생성은 확정된 셀만 선택 가능
            if (
              selectedAction === "entangle" &&
              board[x][y].state === QUANTUM_STATES.SUPERPOSITION
            ) {
              addLog("확정된 셀만 얽힘 생성이 가능합니다.");
              setSelectedCell(null);
              return;
            }

            // 양자 도약은 자신의 팀 색상 셀만 선택 가능
            if (selectedAction === "quantum-leap") {
              const teamColor =
                activePlayer === 1
                  ? QUANTUM_STATES.WAVE
                  : QUANTUM_STATES.PARTICLE;
              if (board[x][y].state !== teamColor) {
                addLog("자신의 팀 색상 셀만 도약이 가능합니다.");
                setSelectedCell(null);
                return;
              }
            }

            setSecondCellNeeded(true);
            addLog("두 번째 셀을 선택하세요.");
          } else {
            processAction(x, y);
          }
        } else if (secondCellNeeded) {
          // 두 번째 셀 선택
          if (x !== selectedCell.x || y !== selectedCell.y) {
            processAction(selectedCell.x, selectedCell.y, x, y);
          }
        }
      }
    },
    [
      selectedAction,
      selectedCell,
      secondCellNeeded,
      board,
      activePlayer,
      winner,
      gameMode,
      playSound,
      processAction,
      addLog,
    ]
  );

  // AI 액션 실행
  const executeAIAction = useCallback((): void => {
    // 조건 검사 - 게임 모드와 현재 플레이어 확인
    if (gameMode !== GAME_MODES.VS_AI || activePlayer !== 2) {
      return; // AI 모드가 아니거나 AI 턴이 아니면 실행하지 않음
    }

    // 게임 종료 상태 체크
    if (winner !== null) return;

    setIsThinking(true);

    // AI 생각 중 메시지
    addLog("AI가 다음 행동을 계산 중입니다...");

    // 난이도에 따른 AI 알고리즘 선택 및 지연 시간 조정
    const thinkingTime =
      difficulty === DIFFICULTY_LEVELS.EASY
        ? 1000
        : difficulty === DIFFICULTY_LEVELS.MEDIUM
        ? 1500
        : 2000;

    setTimeout(() => {
      // 실행 전 한번 더 확인 (상태가 변경되었을 수 있음)
      if (gameMode !== GAME_MODES.VS_AI || activePlayer !== 2) {
        setIsThinking(false);
        return;
      }

      // AI의 행동 선택
      const aiAction = selectAIAction(board, turn, difficulty);

      if (aiAction) {
        // 선택된 액션 정보 표시
        const actionNames: Record<ActionType, string> = {
          measure: "측정하기",
          interfere: "간섭하기",
          entangle: "얽힘 생성",
          "quantum-leap": "양자 도약",
          "break-entanglement": "얽힘 파괴",
        };

        addLog(`AI가 '${actionNames[aiAction.action]}' 액션을 선택했습니다.`);

        // 액션 실행
        if (aiAction.secondCell) {
          addLog(
            `AI가 (${aiAction.cell.x},${aiAction.cell.y}) 셀과 (${aiAction.secondCell.x},${aiAction.secondCell.y}) 셀을 선택했습니다.`
          );
          processAction(
            aiAction.cell.x,
            aiAction.cell.y,
            aiAction.secondCell.x,
            aiAction.secondCell.y,
            aiAction.action
          );
        } else {
          addLog(
            `AI가 (${aiAction.cell.x},${aiAction.cell.y}) 셀을 선택했습니다.`
          );
          processAction(
            aiAction.cell.x,
            aiAction.cell.y,
            null,
            null,
            aiAction.action
          );
        }
      } else {
        // 가능한 액션이 없는 경우 (거의 발생하지 않음)
        addLog("AI가 수행할 수 있는 액션이 없습니다. 턴을 넘깁니다.");
        endTurn();
      }

      setIsThinking(false);
    }, thinkingTime);
  }, [
    gameMode,
    activePlayer,
    winner,
    difficulty,
    board,
    turn,
    processAction,
    addLog,
    endTurn,
  ]);

  // AI 턴 관리
  useEffect(() => {
    // 상태가 업데이트된 후 AI 턴인지 확인
    if (gameMode === GAME_MODES.VS_AI && activePlayer === 2 && !isThinking) {
      // 승리 여부 확인
      if (winner !== null) return;

      // AI 턴 타이머 설정
      const timer = setTimeout(() => {
        executeAIAction();
      }, 1000);

      // 컴포넌트 언마운트나 의존성 변경 시 타이머 정리
      return () => clearTimeout(timer);
    }
  }, [gameMode, activePlayer, winner, isThinking, executeAIAction]);

  return {
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
    playSound,
    addLog,
    resetGame,
    handleGameModeSelect,
    resetSelection,
    endTurn,
    handleActionClick,
    handleCellClick,
    executeAIAction,

    // 설정 변경
    setDifficulty,
    setMuted,
    setShowTutorial,
    setTutorialStep,
    setShowHelp,
    setShowSettings,
    setActionHint,
    setIsFirstGame,
    setShowLog,
    setGameMode,
  };
};

export default useGameState;
