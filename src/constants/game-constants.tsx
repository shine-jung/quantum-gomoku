import { Eye, Zap, Link as LinkIcon, Unlink, Move } from "lucide-react";
import {
  ActionInfo,
  ActionType,
  CellState,
  Difficulty,
  GameMode,
} from "../types/game-types";

export const BOARD_SIZE = 9;

export const QUANTUM_STATES: Record<string, CellState> = {
  WAVE: "wave",
  PARTICLE: "particle",
  SUPERPOSITION: "superposition",
};

export const GAME_MODES: Record<string, GameMode> = {
  LOCAL: "local",
  VS_AI: "vs-ai",
  TUTORIAL: "tutorial",
};

export const DIFFICULTY_LEVELS: Record<string, Difficulty> = {
  EASY: "쉬움",
  MEDIUM: "보통",
  HARD: "어려움",
};

export const SOUND_EFFECTS: Record<string, string> = {
  MEASURE: "measure.mp3",
  INTERFERE: "interfere.mp3",
  ENTANGLE: "entangle.mp3",
  QUANTUM_LEAP: "quantum-leap.mp3",
  BREAK_ENTANGLEMENT: "break-entanglement.mp3",
  WIN: "win.mp3",
  CLICK: "click.mp3",
};

export const ACTION_INFO: Record<ActionType, ActionInfo> = {
  measure: {
    name: "측정하기",
    icon: <Eye className="w-5 h-5" />,
    color: "bg-emerald-600",
    activeColor: "bg-emerald-500",
    hoverColor: "hover:bg-emerald-500",
    disabledColor: "bg-emerald-800",
    description:
      "중첩 상태의 셀을 측정합니다. 자신의 팀 색상이 나올 확률은 60%입니다.",
    shortDescription: "중첩 상태 측정",
  },
  interfere: {
    name: "간섭하기",
    icon: <Zap className="w-5 h-5" />,
    color: "bg-cyan-600",
    activeColor: "bg-cyan-500",
    hoverColor: "hover:bg-cyan-500",
    disabledColor: "bg-cyan-800",
    description:
      "확정 상태 셀을 65% 확률로 반전시키거나, 중첩 상태 셀의 측정 확률을 70%로 변경합니다.",
    shortDescription: "상태 반전/영향",
  },
  entangle: {
    name: "얽힘 생성",
    icon: <LinkIcon className="w-5 h-5" />,
    color: "bg-amber-600",
    activeColor: "bg-amber-500",
    hoverColor: "hover:bg-amber-500",
    disabledColor: "bg-amber-800",
    description:
      "두 확정 셀을 얽힘 상태로 만듭니다. 한 셀의 상태 변화가 다른 셀에도 같이 적용됩니다.",
    shortDescription: "두 셀 연결",
  },
  "quantum-leap": {
    name: "양자 도약",
    icon: <Move className="w-5 h-5" />,
    color: "bg-orange-600",
    activeColor: "bg-orange-500",
    hoverColor: "hover:bg-orange-500",
    disabledColor: "bg-orange-800",
    description:
      "자신의 팀 색상 셀을 다른 위치로 이동합니다. 얽힘 관계도 함께 이동합니다.",
    shortDescription: "셀 이동",
  },
  "break-entanglement": {
    name: "얽힘 파괴",
    icon: <Unlink className="w-5 h-5" />,
    color: "bg-rose-600",
    activeColor: "bg-rose-500",
    hoverColor: "hover:bg-rose-500",
    disabledColor: "bg-rose-800",
    description:
      "얽힘 상태를 해제합니다. 최근 1턴 내에 생성된 얽힘은 해제할 수 없습니다.",
    shortDescription: "얽힘 해제",
  },
};
