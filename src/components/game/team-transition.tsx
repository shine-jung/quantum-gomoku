"use client";

import { useEffect, useRef, useState } from "react";
import { Waves, Circle } from "lucide-react";
import { PlayerTeam } from "../../types/game-types";

interface TeamTransitionProps {
  activePlayer: PlayerTeam;
  winner: PlayerTeam | null | 0;
}

const TeamTransition: React.FC<TeamTransitionProps> = ({
  activePlayer,
  winner,
}) => {
  const [show, setShow] = useState(false);
  const prevPlayerRef = useRef(activePlayer);

  useEffect(() => {
    // 게임이 끝났으면 팀 전환 애니메이션 표시하지 않음
    if (winner !== null) {
      setShow(false);
      return;
    }

    if (prevPlayerRef.current !== activePlayer) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 1200);
      prevPlayerRef.current = activePlayer;
      return () => clearTimeout(timer);
    }
  }, [activePlayer, winner]);

  if (!show || winner !== null) return null;

  return (
    <div className="fixed top-16 right-4 z-40 pointer-events-none animate-scaleIn">
      <div className="bg-gray-900/80 p-2 rounded-lg shadow-lg">
        <div className="text-sm sm:text-base font-medium text-center flex items-center gap-2">
          {activePlayer === 1 ? (
            <>
              <Waves className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400">파동팀 턴</span>
            </>
          ) : (
            <>
              <Circle className="w-4 h-4 text-red-400" />
              <span className="text-red-400">입자팀 턴</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamTransition;
