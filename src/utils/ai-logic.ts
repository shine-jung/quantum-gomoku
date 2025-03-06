import { QUANTUM_STATES, DIFFICULTY_LEVELS } from "../constants/game-constants";
import {
  ActionType,
  Cell,
  CellPosition,
  CellState,
  Difficulty,
} from "../types/game-types";
import {
  countConsecutiveCells,
  evaluatePosition,
  getMaxLineCount,
} from "./game-utils";

type AIAction = {
  action: ActionType;
  cell: CellPosition;
  secondCell?: CellPosition;
  score: number;
  strategy?: string;
};

export const selectAIAction = (
  board: Cell[][],
  turn: number,
  difficulty: Difficulty
): AIAction | null => {
  // 가능한 모든 액션 수집
  const possibleActions: AIAction[] = [];

  // AI의 색상과 상대의 색상
  const aiColor = QUANTUM_STATES.PARTICLE;
  const opponentColor = QUANTUM_STATES.WAVE;

  // 즉각적인 승리 확인
  const immediateWin = checkForImmediateWin(board, aiColor);
  if (immediateWin) {
    // 즉시 승리 가능한 액션 반환
    return {
      ...immediateWin,
      score: 10000,
      strategy: "즉시 승리",
    };
  }

  const immediateThreat = checkForImmediateThreat(
    board,
    turn,
    aiColor,
    opponentColor
  );
  if (immediateThreat) {
    // 즉시 위협 방어 액션 반환
    return {
      ...immediateThreat,
      score: 9000,
      strategy: "위협 방어",
    };
  }

  // 1. 측정 액션 탐색 - 고도화된 평가
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[x].length; y++) {
      if (board[x][y].state === QUANTUM_STATES.SUPERPOSITION) {
        let score = 50;

        // 기존 로직: 간섭 상태 및 중앙 거리 보너스
        if (board[x][y].interfered) {
          if (board[x][y].interferencePlayer === 2) {
            score += 40; // 자신이 간섭한 셀
          } else {
            score -= 20; // 상대가 간섭한 셀
          }
        }

        // 향상된 전략 평가
        const positionValue = evaluatePosition(
          board,
          x,
          y,
          true,
          aiColor,
          opponentColor
        );
        score += positionValue * 2;

        // 주변에 자신의 색상이 있는지 확인 (패턴 형성)
        const adjacentAICount = [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
        ].filter(([dx, dy]) => {
          const nx = x + dx;
          const ny = y + dy;
          return (
            nx >= 0 &&
            nx < board.length &&
            ny >= 0 &&
            ny < board[0].length &&
            board[nx][ny].state === aiColor
          );
        }).length;

        score += adjacentAICount * 15;

        // 난이도 무작위성 추가
        score += difficultyRandomFactor(difficulty);

        possibleActions.push({
          action: "measure",
          cell: { x, y },
          score,
          strategy: `측정: 위치가치=${positionValue}, 인접AI=${adjacentAICount}`,
        });
      }
    }
  }

  // 2. 간섭 액션 탐색 - 고도화
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[x].length; y++) {
      // 최근에 간섭된 셀은 제외
      if (board[x][y].interferenceCreatedAt === turn - 1) {
        continue;
      }

      let score = 30;
      let strategyReason = "";

      // 상태별 점수 부여
      if (board[x][y].state === opponentColor) {
        // 상대 색상에 간섭 - 전략적 평가
        const lineValue = evaluatePosition(
          board,
          x,
          y,
          false,
          aiColor,
          opponentColor
        );
        score += lineValue * 1.5;
        strategyReason += `상대 라인(${lineValue})`;

        // 얽힘 상태면 추가 점수 (체인 효과)
        if (board[x][y].entangled) {
          score += 100;
          strategyReason += ", 얽힘효과";
        }
      } else if (board[x][y].state === QUANTUM_STATES.SUPERPOSITION) {
        // 중첩 상태에 간섭
        const posValue = evaluatePosition(
          board,
          x,
          y,
          true,
          aiColor,
          opponentColor
        );
        score += posValue;
        strategyReason += `중첩(${posValue})`;
      } else {
        // 자신의 셀에 간섭은 가치가 낮음
        score -= 20;
      }

      // 난이도에 따른 무작위성
      score += difficultyRandomFactor(difficulty);

      possibleActions.push({
        action: "interfere",
        cell: { x, y },
        score,
        strategy: `간섭: ${strategyReason}`,
      });
    }
  }

  // 3. 얽힘 생성 액션 - 고도화
  // 자신의 팀 색상 셀들 찾기
  const ownCells: CellPosition[] = [];
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[x].length; y++) {
      if (board[x][y].state === aiColor && !board[x][y].entangled) {
        ownCells.push({ x, y });
      }
    }
  }

  // 얽힘 가능한 셀 쌍 평가
  for (let i = 0; i < ownCells.length; i++) {
    for (let j = i + 1; j < ownCells.length; j++) {
      const cell1 = ownCells[i];
      const cell2 = ownCells[j];

      // 기본 점수
      let score = 60;

      // 거리가 먼 셀일수록 더 가치 있음 (넓은 영향력)
      const distance = Math.sqrt(
        Math.pow(cell1.x - cell2.x, 2) + Math.pow(cell1.y - cell2.y, 2)
      );
      score += distance * 5;

      // 두 셀 모두 전략적으로 중요한지 평가
      const pos1Value = evaluatePosition(
        board,
        cell1.x,
        cell1.y,
        true,
        aiColor,
        opponentColor
      );
      const pos2Value = evaluatePosition(
        board,
        cell2.x,
        cell2.y,
        true,
        aiColor,
        opponentColor
      );
      score += Math.max(pos1Value, pos2Value);

      // 다른 방향에 있는 셀 연결이 더 가치 있음
      if (
        (Math.abs(cell1.x - cell2.x) > 2 && Math.abs(cell1.y - cell2.y) > 2) ||
        (cell1.x !== cell2.x && cell1.y !== cell2.y)
      ) {
        score += 40;
      }

      // 난이도 무작위성
      score += difficultyRandomFactor(difficulty);

      possibleActions.push({
        action: "entangle",
        cell: cell1,
        secondCell: cell2,
        score,
        strategy: `얽힘: 거리=${Math.round(distance)}, 가치=${Math.round(
          (pos1Value + pos2Value) / 2
        )}`,
      });
    }
  }

  // 4. 양자 도약 액션 - 고도화
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[x].length; y++) {
      if (board[x][y].state === aiColor) {
        // 현재 셀의 전략적 가치
        const currentValue = evaluatePosition(
          board,
          x,
          y,
          true,
          aiColor,
          opponentColor
        );

        // 더 높은 가치의 위치로만 이동 고려
        for (let tx = 0; tx < board.length; tx++) {
          for (let ty = 0; ty < board[0].length; ty++) {
            if (tx === x && ty === y) continue;

            // 목적지 셀의 현재 상태가 중첩이거나 상대방 색상이면 가치 평가
            if (board[tx][ty].state !== aiColor) {
              const targetValue = evaluatePosition(
                board,
                tx,
                ty,
                true,
                aiColor,
                opponentColor
              );

              // 기본 점수
              let score = 40;

              // 현재보다 더 가치 있는 위치로만 이동
              if (targetValue > currentValue) {
                // 얼마나 더 가치있는지에 비례
                score += (targetValue - currentValue) * 2;

                // 전략적 영역 근처로 이동하는 경우 추가 점수
                if (targetValue > 100) {
                  score += 50;
                }

                // 얽힘 관계 이동의 가치
                if (board[x][y].entangled) {
                  score += 60;
                }

                // 난이도 무작위성
                score += difficultyRandomFactor(difficulty);

                possibleActions.push({
                  action: "quantum-leap",
                  cell: { x, y },
                  secondCell: { x: tx, y: ty },
                  score,
                  strategy: `도약: 현재=${Math.round(
                    currentValue
                  )} → 목표=${Math.round(targetValue)}`,
                });
              }
            }
          }
        }
      }
    }
  }

  // 5. 얽힘 파괴 액션 - 고도화
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[x].length; y++) {
      // 얽힘 상태이고 최근 1턴 내에 생성된 것이 아닌 경우
      if (
        board[x][y].entangled &&
        board[x][y].entanglementCreatedAt !== turn - 1
      ) {
        let score = 35;
        let strategyReason = "";

        // 1. 상대방의 얽힘 우선 파괴
        if (board[x][y].state === opponentColor) {
          // 연결된 셀 찾기
          const linkedCell = board[x][y].linkedWith;
          if (!linkedCell) continue;

          // 두 셀의 전략적 가치 평가
          const pos1Value = evaluatePosition(
            board,
            x,
            y,
            false,
            aiColor,
            opponentColor
          );
          const pos2Value = evaluatePosition(
            board,
            linkedCell.lx,
            linkedCell.ly,
            false,
            aiColor,
            opponentColor
          );
          const totalValue = pos1Value + pos2Value;

          score += totalValue;
          strategyReason = `상대얽힘(${Math.round(totalValue)})`;
        }
        // 2. 자신의 얽힘은 전략적으로 불필요한 경우만 해제
        else if (board[x][y].state === aiColor) {
          // 자신의 얽힘 파괴는 낮은 점수
          score -= 20;

          // 예외: 더 좋은 얽힘을 위해 기존 얽힘 해제
          const ownEntangledCells = ownCells.length;
          if (ownEntangledCells <= 2) {
            score -= 50; // 얽힘이 적을 때는 유지하는 것이 더 좋음
          }

          strategyReason = "자체얽힘해제";
        }

        // 난이도 무작위성
        score += difficultyRandomFactor(difficulty);

        possibleActions.push({
          action: "break-entanglement",
          cell: { x, y },
          score,
          strategy: `얽힘파괴: ${strategyReason}`,
        });
      }
    }
  }

  // 가능한 액션이 없는 경우
  if (possibleActions.length === 0) {
    return null;
  }

  // 점수에 따라 정렬
  possibleActions.sort((a, b) => b.score - a.score);

  // 난이도별 선택 방식
  if (difficulty === DIFFICULTY_LEVELS.EASY) {
    // 쉬움: 상위 30% 중에서 무작위 선택 (+ 최고 점수 액션 20% 확률로 선택)
    if (Math.random() < 0.2) {
      return possibleActions[0];
    }

    const cutoff = Math.floor(possibleActions.length * 0.3);
    const randomIndex = Math.floor(Math.random() * Math.max(1, cutoff));
    return possibleActions[randomIndex];
  } else if (difficulty === DIFFICULTY_LEVELS.MEDIUM) {
    // 보통: 상위 10% 중에서 무작위 선택 (+ 최고 점수 액션 40% 확률로 선택)
    if (Math.random() < 0.4) {
      return possibleActions[0];
    }

    const cutoff = Math.floor(possibleActions.length * 0.1);
    const randomIndex = Math.floor(Math.random() * Math.max(1, cutoff));
    return possibleActions[randomIndex];
  } else {
    // 어려움: 항상 최고 점수 액션 선택 (100% 확률)
    const topActions = possibleActions.slice(
      0,
      Math.min(2, possibleActions.length)
    );

    return topActions[0];
  }
};

// 난이도에 따른 무작위 요소 함수
function difficultyRandomFactor(difficulty: Difficulty): number {
  return difficulty === DIFFICULTY_LEVELS.EASY
    ? Math.random() * 10
    : difficulty === DIFFICULTY_LEVELS.MEDIUM
    ? Math.random() * 5
    : 0;
}

// 즉각적인 승리 확인
function checkForImmediateWin(
  board: Cell[][],
  aiColor: CellState
): {
  action: ActionType;
  cell: CellPosition;
  secondCell?: CellPosition;
} | null {
  // 1. 측정으로 승리 가능한지 확인
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[x].length; y++) {
      if (board[x][y].state === QUANTUM_STATES.SUPERPOSITION) {
        // 이 위치가 AI 색상이라고 가정하고 승리 확인
        const tempBoard = JSON.parse(JSON.stringify(board));
        tempBoard[x][y].state = aiColor;

        // 이 위치에 기존 AI 셀까지 포함하여 5개 연속이 있는지 확인
        if (getMaxLineCount(tempBoard, x, y, aiColor) >= 5) {
          return {
            action: "measure",
            cell: { x, y },
          };
        }
      }
    }
  }

  // 2. 간섭으로 승리 가능한지 확인
  const opponentColor =
    aiColor === QUANTUM_STATES.WAVE
      ? QUANTUM_STATES.PARTICLE
      : QUANTUM_STATES.WAVE;

  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[x].length; y++) {
      if (board[x][y].state === opponentColor) {
        // 이 위치가 AI 색상으로 바뀐다고 가정하고 승리 확인
        const tempBoard = JSON.parse(JSON.stringify(board));
        tempBoard[x][y].state = aiColor;

        if (getMaxLineCount(tempBoard, x, y, aiColor) >= 5) {
          return {
            action: "interfere",
            cell: { x, y },
          };
        }
      }
    }
  }

  // 3. 양자 도약으로 승리 가능한지 확인
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[x].length; y++) {
      if (board[x][y].state === aiColor) {
        // 모든 가능한 도착 위치 확인
        for (let tx = 0; tx < board.length; tx++) {
          for (let ty = 0; ty < board[0].length; ty++) {
            if (tx === x && ty === y) continue;

            // 이 위치로 도약했다고 가정하고 승리 확인
            const tempBoard = JSON.parse(JSON.stringify(board));
            tempBoard[tx][ty].state = aiColor;

            if (getMaxLineCount(tempBoard, tx, ty, aiColor) >= 5) {
              return {
                action: "quantum-leap",
                cell: { x, y },
                secondCell: { x: tx, y: ty },
              };
            }
          }
        }
      }
    }
  }

  return null;
}

// 즉각적인 패배 방지 확인
function checkForImmediateThreat(
  board: Cell[][],
  turn: number,
  aiColor: CellState,
  opponentColor: CellState
): {
  action: ActionType;
  cell: CellPosition;
  secondCell?: CellPosition;
} | null {
  // 1. 상대방이 다음 턴에 측정으로 승리할 수 있는지 확인
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[x].length; y++) {
      if (board[x][y].state === QUANTUM_STATES.SUPERPOSITION) {
        // 이 위치가 상대 색상이라고 가정
        const tempBoard = JSON.parse(JSON.stringify(board));
        tempBoard[x][y].state = opponentColor;

        // 승리 확인
        if (getMaxLineCount(tempBoard, x, y, opponentColor) >= 5) {
          // 위협 감지: 간섭 사용 또는 직접 측정
          if (!board[x][y].interfered || board[x][y].interferencePlayer !== 2) {
            return {
              action: "interfere",
              cell: { x, y },
            };
          } else {
            return {
              action: "measure",
              cell: { x, y },
            };
          }
        }
      }
    }
  }

  // 2. 상대방의 4개 연속된 라인에 간섭
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[x].length; y++) {
      if (
        board[x][y].state === opponentColor &&
        board[x][y].interferenceCreatedAt !== turn - 1
      ) {
        const directions = [
          [1, 0],
          [0, 1],
          [1, 1],
          [1, -1],
        ];

        for (const [dx, dy] of directions) {
          const count1 = countConsecutiveCells(
            board,
            x,
            y,
            dx,
            dy,
            opponentColor
          );
          const count2 = countConsecutiveCells(
            board,
            x,
            y,
            -dx,
            -dy,
            opponentColor
          );

          if (count1 + count2 + 1 >= 4) {
            return {
              action: "interfere",
              cell: { x, y },
            };
          }
        }
      }
    }
  }

  // 3. 상대방의 얽힘 해제 (특히 여러 라인이 얽혀 있는 경우)
  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[x].length; y++) {
      if (
        board[x][y].state === opponentColor &&
        board[x][y].entangled &&
        board[x][y].entanglementCreatedAt !== turn - 1
      ) {
        const linkedCell = board[x][y].linkedWith;
        if (!linkedCell) continue;

        // 이 얽힘이 전략적으로 중요한지 확인
        const position1Value = evaluatePosition(
          board,
          x,
          y,
          false,
          aiColor,
          opponentColor
        );
        const position2Value = evaluatePosition(
          board,
          linkedCell.lx,
          linkedCell.ly,
          false,
          aiColor,
          opponentColor
        );

        if (position1Value > 300 || position2Value > 300) {
          return {
            action: "break-entanglement",
            cell: { x, y },
          };
        }
      }
    }
  }

  return null;
}
