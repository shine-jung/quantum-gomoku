import { BOARD_SIZE, QUANTUM_STATES } from "../constants/game-constants";
import { Cell, CellPosition, CellState, WinResult } from "../types/game-types";

// 초기 게임 보드 생성
export const createInitialBoard = (): Cell[][] => {
  const board: Cell[][] = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    const row: Cell[] = [];
    for (let j = 0; j < BOARD_SIZE; j++) {
      row.push({
        state: QUANTUM_STATES.SUPERPOSITION,
        entangled: false,
        interfered: false,
        linkedWith: null,
        entanglementCreatedAt: null,
        interferenceCreatedAt: null,
        interferencePlayer: null,
        isWinningCell: false,
      });
    }
    board.push(row);
  }
  return board;
};

// 승리 조건 체크 (연속된 5개)
export const checkWin = (board: Cell[][]): WinResult | null => {
  const directions = [
    { dx: 1, dy: 0 }, // 가로
    { dx: 0, dy: 1 }, // 세로
    { dx: 1, dy: 1 }, // 대각선 우하향
    { dx: 1, dy: -1 }, // 대각선 우상향
  ];

  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      const cell = board[x][y];
      if (
        cell.state !== QUANTUM_STATES.WAVE &&
        cell.state !== QUANTUM_STATES.PARTICLE
      )
        continue;

      for (const { dx, dy } of directions) {
        let count = 1;
        const winningCells: CellPosition[] = [{ x, y }];

        // 한쪽 방향으로 연속 체크
        for (let i = 1; i < 5; i++) {
          const nx = x + dx * i;
          const ny = y + dy * i;

          if (nx < 0 || nx >= BOARD_SIZE || ny < 0 || ny >= BOARD_SIZE) break;
          if (board[nx][ny].state !== cell.state) break;

          count++;
          winningCells.push({ x: nx, y: ny });
        }

        // 5개 연속이면 승리
        if (count >= 5) {
          const winningTeam = cell.state === QUANTUM_STATES.WAVE ? 1 : 2;
          return { winningTeam, winningCells };
        }
      }
    }
  }

  return null; // 승자 없음
};

// 특정 방향으로 같은 상태의 셀 개수를 세는 함수
export const countConsecutiveCells = (
  board: Cell[][],
  x: number,
  y: number,
  dx: number,
  dy: number,
  state: CellState,
  maxCount: number = 5
): number => {
  let count = 0;
  let currX = x;
  let currY = y;

  for (let i = 0; i < maxCount; i++) {
    currX += dx;
    currY += dy;

    // 보드 범위 체크
    if (currX < 0 || currX >= BOARD_SIZE || currY < 0 || currY >= BOARD_SIZE) {
      break;
    }

    // 같은 상태인지 확인
    if (board[currX][currY].state === state) {
      count++;
    } else {
      break;
    }
  }

  return count;
};

// 특정 위치에서 모든 방향으로 연속된 셀 검사
export const getMaxLineCount = (
  board: Cell[][],
  x: number,
  y: number,
  state: CellState
): number => {
  const directions = [
    [1, 0], // 가로
    [0, 1], // 세로
    [1, 1], // 대각선 (우하)
    [1, -1], // 대각선 (우상)
  ];

  let maxCount = 1; // 자기 자신 포함

  for (const [dx, dy] of directions) {
    // 양쪽 방향으로 검사
    const count1 = countConsecutiveCells(board, x, y, dx, dy, state);
    const count2 = countConsecutiveCells(board, x, y, -dx, -dy, state);
    const totalCount = count1 + count2 + 1; // 자기 자신 포함

    maxCount = Math.max(maxCount, totalCount);
  }

  return maxCount;
};

// 연속된 라인이나 잠재적 라인의 가치 평가
export const evaluateLine = (
  board: Cell[][],
  x: number,
  y: number,
  dx: number,
  dy: number,
  aiState: CellState,
  opponentState: CellState
): number => {
  // 확인할 셀들
  const cells = [];

  // 양쪽으로 4칸씩 확인 (중심 포함 총 9칸)
  for (let i = -4; i <= 4; i++) {
    const nx = x + i * dx;
    const ny = y + i * dy;

    // 보드 범위 체크
    if (nx < 0 || nx >= BOARD_SIZE || ny < 0 || ny >= BOARD_SIZE) {
      continue;
    }

    cells.push({
      x: nx,
      y: ny,
      state: board[nx][ny].state,
    });
  }

  // 연속된 5개 윈도우를 슬라이딩하며 확인
  for (let i = 0; i <= cells.length - 5; i++) {
    const window = cells.slice(i, i + 5);

    // 윈도우 내 상태 카운트
    const aiCells = window.filter((cell) => cell.state === aiState).length;
    const opponentCells = window.filter(
      (cell) => cell.state === opponentState
    ).length;

    // 상대방이 없고 AI 셀만 있는 경우 - 승리 가능성
    if (opponentCells === 0) {
      // AI 셀 개수에 따른 점수
      if (aiCells === 4) return 1000; // 승리 임박
      if (aiCells === 3) return 500; // 매우 유리
      if (aiCells === 2) return 100; // 좋은 상황
      if (aiCells === 1) return 10; // 약간 유리
    }

    // 방어: AI 셀이 없고 상대방 셀이 있는 경우
    if (aiCells === 0) {
      // 상대방 셀 개수에 따른 점수
      if (opponentCells === 4) return 900; // 방어 필수
      if (opponentCells === 3) return 400; // 적극 방어
      if (opponentCells === 2) return 50; // 방어 고려
    }
  }

  return 0;
};

// 특정 위치의 전략적 가치 평가
export const evaluatePosition = (
  board: Cell[][],
  x: number,
  y: number,
  forAI: boolean = true,
  aiColor: CellState,
  opponentColor: CellState
): number => {
  const targetState = forAI ? aiColor : opponentColor;
  const otherState = forAI ? opponentColor : aiColor;

  const directions = [
    [1, 0], // 가로
    [0, 1], // 세로
    [1, 1], // 대각선 (우하)
    [1, -1], // 대각선 (우상)
  ];

  let maxScore = 0;

  for (const [dx, dy] of directions) {
    const score = evaluateLine(board, x, y, dx, dy, targetState, otherState);
    maxScore = Math.max(maxScore, score);
  }

  // 중앙에 가까울수록 추가 점수
  const distanceToCenter = Math.sqrt(
    Math.pow(x - Math.floor(BOARD_SIZE / 2), 2) +
      Math.pow(y - Math.floor(BOARD_SIZE / 2), 2)
  );
  const centerBonus = Math.max(0, 15 - distanceToCenter * 3);

  return maxScore + centerBonus;
};
