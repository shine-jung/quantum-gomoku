import { JSX } from "react";

export type CellPosition = {
  x: number;
  y: number;
};

export type LinkedCell = {
  lx: number;
  ly: number;
};

export type CellState = "wave" | "particle" | "superposition";

export type ActionType =
  | "measure"
  | "interfere"
  | "entangle"
  | "quantum-leap"
  | "break-entanglement";

export type GameMode = "local" | "vs-ai" | "tutorial";

export type Difficulty = "쉬움" | "보통" | "어려움";

export type PlayerTeam = 1 | 2; // 1: 파동팀, 2: 입자팀

export interface Cell {
  state: CellState;
  entangled: boolean;
  interfered: boolean;
  linkedWith: LinkedCell | null;
  entanglementCreatedAt: number | null;
  interferenceCreatedAt: number | null;
  interferencePlayer: PlayerTeam | null;
  isWinningCell: boolean;
}

export interface ActionInfo {
  name: string;
  icon: JSX.Element;
  color: string;
  activeColor: string;
  hoverColor: string;
  disabledColor: string;
  description: string;
  shortDescription: string;
}

export interface WinResult {
  winningTeam: PlayerTeam;
  winningCells: CellPosition[];
}

export interface TutorialStep {
  title: string;
  content: JSX.Element;
}
