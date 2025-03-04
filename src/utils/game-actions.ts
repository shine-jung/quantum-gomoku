import { QUANTUM_STATES, SOUND_EFFECTS } from "../constants/game-constants";
import { ActionType, Cell, PlayerTeam } from "../types/game-types";

export const executeAction = (
  board: Cell[][],
  x: number,
  y: number,
  secondX: number | null = null,
  secondY: number | null = null,
  actionType: ActionType | null,
  activePlayer: PlayerTeam,
  turn: number,
  playSound: (soundName: string) => void
): {
  newBoard: Cell[][];
  logMessage: string;
  actionSuccessful: boolean;
} => {
  if (!actionType) {
    return {
      newBoard: board,
      logMessage: "알 수 없는 액션입니다.",
      actionSuccessful: false,
    };
  }

  const newBoard: Cell[][] = JSON.parse(JSON.stringify(board));
  const teamColor =
    activePlayer === 1 ? QUANTUM_STATES.WAVE : QUANTUM_STATES.PARTICLE;
  const oppositeColor =
    activePlayer === 1 ? QUANTUM_STATES.PARTICLE : QUANTUM_STATES.WAVE;

  switch (actionType) {
    case "measure":
      // 중첩 상태 측정
      if (newBoard[x][y].state === QUANTUM_STATES.SUPERPOSITION) {
        playSound(SOUND_EFFECTS.MEASURE);

        let resultState;
        let probabilityMessage;

        // 간섭 중인 셀인 경우
        if (
          newBoard[x][y].interfered &&
          newBoard[x][y].interferencePlayer !== null
        ) {
          const interferenceTeam = newBoard[x][y].interferencePlayer;
          const interferenceColor =
            interferenceTeam === 1
              ? QUANTUM_STATES.WAVE
              : QUANTUM_STATES.PARTICLE;
          const oppositeInterferenceColor =
            interferenceTeam === 1
              ? QUANTUM_STATES.PARTICLE
              : QUANTUM_STATES.WAVE;

          // 70% 확률로 간섭 플레이어의 색상
          const rand = Math.random() * 100;
          resultState =
            rand < 70 ? interferenceColor : oppositeInterferenceColor;

          probabilityMessage = `간섭 효과가 측정에 영향을 줍니다. ${
            interferenceTeam === 1 ? "파동" : "입자"
          } 상태가 70% 확률로 나타납니다`;
        }
        // 일반 측정인 경우
        else {
          const successRate = activePlayer === 1 ? 60 : 65; // 파동팀: 60%, 입자팀: 65%
          const rand = Math.random() * 100;
          resultState = rand < successRate ? teamColor : oppositeColor;

          probabilityMessage = `${successRate}% 확률`;
        }

        // 결과 적용
        newBoard[x][y].state = resultState;
        newBoard[x][y].interfered = false;
        newBoard[x][y].interferenceCreatedAt = null;
        newBoard[x][y].interferencePlayer = null;

        return {
          newBoard,
          logMessage: `(${x},${y}) 셀을 측정했습니다. ${probabilityMessage}. 결과: ${
            resultState === QUANTUM_STATES.WAVE ? "파동" : "입자"
          }`,
          actionSuccessful: true,
        };
      } else {
        return {
          newBoard: board,
          logMessage: "중첩 상태가 아닌 셀은 측정할 수 없습니다.",
          actionSuccessful: false,
        };
      }

    case "interfere":
      // 간섭 액션 - 최근 1턴 내에 간섭된 셀인지 확인
      if (newBoard[x][y].interferenceCreatedAt === turn - 1) {
        return {
          newBoard: board,
          logMessage: "최근 1턴 내에 간섭된 셀은 다시 간섭할 수 없습니다.",
          actionSuccessful: false,
        };
      }

      playSound(SOUND_EFFECTS.INTERFERE);

      if (newBoard[x][y].state === QUANTUM_STATES.SUPERPOSITION) {
        // 중첩 상태에 간섭 시 70% 확률로 자신의 팀 색상 선호
        newBoard[x][y].interfered = true;
        newBoard[x][y].interferenceCreatedAt = turn; // 현재 턴 기록
        newBoard[x][y].interferencePlayer = activePlayer; // 간섭한 플레이어 저장

        return {
          newBoard,
          logMessage: `(${x},${y}) 셀에 간섭했습니다. 다음 측정 시 ${
            teamColor === QUANTUM_STATES.WAVE ? "파동" : "입자"
          } 상태가 70% 확률로 나타납니다.`,
          actionSuccessful: true,
        };
      } else {
        // 확정 상태에 간섭 시 65% 확률로 상태 반전
        const rand = Math.random() * 100;
        if (rand < 65) {
          const newState =
            newBoard[x][y].state === QUANTUM_STATES.WAVE
              ? QUANTUM_STATES.PARTICLE
              : QUANTUM_STATES.WAVE;
          newBoard[x][y].state = newState;
          newBoard[x][y].interferenceCreatedAt = turn; // 현재 턴 기록

          // 얽힘 상태인 경우 연결된 셀도 함께 변경
          if (newBoard[x][y].entangled && newBoard[x][y].linkedWith) {
            const { lx, ly } = newBoard[x][y].linkedWith;
            newBoard[lx][ly].state = newState;
            newBoard[lx][ly].interferenceCreatedAt = turn; // 얽힌 셀도 간섭 턴 기록

            return {
              newBoard,
              logMessage: `간섭 성공! (${x},${y}) 셀이 ${
                newState === QUANTUM_STATES.WAVE ? "파동" : "입자"
              }으로 변경되었습니다. 얽힘 효과로 (${lx},${ly}) 셀도 함께 변경되었습니다.`,
              actionSuccessful: true,
            };
          } else {
            return {
              newBoard,
              logMessage: `간섭 성공! (${x},${y}) 셀이 ${
                newState === QUANTUM_STATES.WAVE ? "파동" : "입자"
              }으로 변경되었습니다.`,
              actionSuccessful: true,
            };
          }
        } else {
          // 간섭 시도 기록 (실패해도 다음 턴에 간섭 불가)
          newBoard[x][y].interferenceCreatedAt = turn;

          return {
            newBoard,
            logMessage: `간섭 실패! (${x},${y}) 셀의 상태가 변하지 않았습니다.`,
            actionSuccessful: true,
          };
        }
      }

    case "entangle":
      // 얽힘 생성
      if (secondX !== null && secondY !== null) {
        // 두 셀 모두 확정 상태여야 함
        if (
          newBoard[x][y].state === QUANTUM_STATES.SUPERPOSITION ||
          newBoard[secondX][secondY].state === QUANTUM_STATES.SUPERPOSITION
        ) {
          return {
            newBoard: board,
            logMessage: "중첩 상태인 셀은 얽힘 생성이 불가능합니다.",
            actionSuccessful: false,
          };
        }

        // 이미 얽힘 상태인 셀 확인
        if (newBoard[x][y].entangled || newBoard[secondX][secondY].entangled) {
          return {
            newBoard: board,
            logMessage: "이미 얽힘 상태인 셀이 포함되어 있습니다.",
            actionSuccessful: false,
          };
        }

        playSound(SOUND_EFFECTS.ENTANGLE);

        // 얽힘 관계 생성
        newBoard[x][y].entangled = true;
        newBoard[secondX][secondY].entangled = true;
        newBoard[x][y].linkedWith = { lx: secondX, ly: secondY };
        newBoard[secondX][secondY].linkedWith = { lx: x, ly: y };

        // 얽힘 생성 턴 기록 (1턴 보호를 위함)
        const currentTurn = turn;
        newBoard[x][y].entanglementCreatedAt = currentTurn;
        newBoard[secondX][secondY].entanglementCreatedAt = currentTurn;

        return {
          newBoard,
          logMessage: `(${x},${y})와 (${secondX},${secondY}) 셀을 얽힘 상태로 만들었습니다.`,
          actionSuccessful: true,
        };
      }
      return {
        newBoard: board,
        logMessage: "두 번째 셀을 선택해야 합니다.",
        actionSuccessful: false,
      };

    case "quantum-leap":
      // 양자 도약
      if (secondX !== null && secondY !== null) {
        // 첫 번째 셀은 자신의 팀 색상이어야 함
        if (newBoard[x][y].state !== teamColor) {
          return {
            newBoard: board,
            logMessage: "자신의 팀 색상 셀만 도약이 가능합니다.",
            actionSuccessful: false,
          };
        }

        playSound(SOUND_EFFECTS.QUANTUM_LEAP);

        // 도약 실행
        const originalState = newBoard[x][y].state;
        const wasEntangled = newBoard[x][y].entangled;
        const linkedCell = wasEntangled ? newBoard[x][y].linkedWith : null;
        const interferenceCreatedAt = newBoard[x][y].interferenceCreatedAt; // 간섭 생성 턴 정보 유지

        // 두 번째 셀에 상태 복사 및 얽힘 관계 이동
        newBoard[secondX][secondY].state = originalState;
        newBoard[secondX][secondY].interferenceCreatedAt =
          interferenceCreatedAt; // 간섭 생성 턴 정보 이동

        let resultMessage = `(${x},${y}) 셀이 (${secondX},${secondY})로 도약했습니다.`;

        // 얽힘 관계 이동
        if (wasEntangled && linkedCell) {
          const { lx, ly } = linkedCell;

          // 원래 셀의 얽힘 관계 해제
          newBoard[x][y].entangled = false;
          newBoard[x][y].linkedWith = null;
          newBoard[x][y].entanglementCreatedAt = null;

          // 얽힘 관계 업데이트
          newBoard[lx][ly].linkedWith = { lx: secondX, ly: secondY };
          newBoard[secondX][secondY].entangled = true;
          newBoard[secondX][secondY].linkedWith = { lx: lx, ly: ly };
          newBoard[secondX][secondY].entanglementCreatedAt =
            newBoard[lx][ly].entanglementCreatedAt;

          resultMessage = `(${x},${y}) 셀이 (${secondX},${secondY})로 도약했습니다. 얽힘 관계도 함께 이동했습니다.`;
        }

        // 원래 셀은 중첩 상태로
        newBoard[x][y].state = QUANTUM_STATES.SUPERPOSITION;
        newBoard[x][y].interfered = false;
        newBoard[x][y].interferenceCreatedAt = null;

        return {
          newBoard,
          logMessage: resultMessage,
          actionSuccessful: true,
        };
      }
      return {
        newBoard: board,
        logMessage: "두 번째 셀을 선택해야 합니다.",
        actionSuccessful: false,
      };

    case "break-entanglement":
      // 얽힘 파괴
      if (!newBoard[x][y].entangled) {
        return {
          newBoard: board,
          logMessage: "선택한 셀은 얽힘 상태가 아닙니다.",
          actionSuccessful: false,
        };
      }

      // 1턴 보호 확인
      if (newBoard[x][y].entanglementCreatedAt === turn - 1) {
        return {
          newBoard: board,
          logMessage: "최근 1턴 내에 생성된 얽힘은 파괴할 수 없습니다.",
          actionSuccessful: false,
        };
      }

      playSound(SOUND_EFFECTS.BREAK_ENTANGLEMENT);

      // 얽힘 관계 해제
      if (newBoard[x][y].linkedWith) {
        const { lx, ly } = newBoard[x][y].linkedWith;

        newBoard[x][y].entangled = false;
        newBoard[x][y].linkedWith = null;
        newBoard[x][y].entanglementCreatedAt = null;

        newBoard[lx][ly].entangled = false;
        newBoard[lx][ly].linkedWith = null;
        newBoard[lx][ly].entanglementCreatedAt = null;

        return {
          newBoard,
          logMessage: `(${x},${y})와 (${lx},${ly}) 셀의 얽힘 관계를 해제했습니다.`,
          actionSuccessful: true,
        };
      }
      return {
        newBoard,
        logMessage: "얽힘 관계 정보가 없습니다.",
        actionSuccessful: false,
      };

    default:
      return {
        newBoard: board,
        logMessage: "알 수 없는 액션입니다.",
        actionSuccessful: false,
      };
  }
};
