import {
  Circle,
  Eye,
  Link as LinkIcon,
  Move,
  Unlink,
  Waves,
  Zap,
} from "lucide-react";
import { TutorialStep } from "../types/game-types";

export const tutorialContent: TutorialStep[] = [
  {
    title: "양자 오목에 오신 것을 환영합니다!",
    content: (
      <p>
        양자 오목은 전통적인 오목 게임에 양자 물리학의 개념을 결합한 전략
        게임입니다. 이 튜토리얼을 통해 기본 규칙과 액션을 배워봅시다.
      </p>
    ),
  },
  {
    title: "게임 목표",
    content: (
      <p>
        연속된 5개의 셀을 자신의 팀 색상으로 만들면 승리합니다. 파동팀은 파란색,
        입자팀은 빨간색을 사용합니다.
      </p>
    ),
  },
  {
    title: "양자 상태",
    content: (
      <div>
        <p>게임에는 세 가지 셀 상태가 있습니다:</p>
        <div className="grid grid-cols-2 gap-2 mt-2">
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
          <div className="flex items-center p-2 bg-gray-700 rounded-lg col-span-2">
            <div className="w-8 h-8 mr-2 bg-gradient-to-r from-blue-400 via-purple-500 to-red-400 rounded-md flex items-center justify-center">
              <div className="relative">
                <Waves className="w-4 h-4 text-white opacity-50 absolute" />
                <Circle className="w-4 h-4 text-white opacity-50" />
              </div>
            </div>
            <div>
              <div className="font-semibold">중첩 상태</div>
              <div className="text-xs text-gray-300">
                아직 결정되지 않은 상태로, 파동 또는 입자가 될 가능성이 있는
                상태입니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "액션 1: 측정하기",
    content: (
      <div>
        <div className="flex items-center mb-2">
          <Eye className="w-5 h-5 text-green-400 mr-2" />
          <span className="font-semibold">측정하기</span>
        </div>
        <p>
          중첩 상태의 셀을 측정하여 확정된 상태로 바꿀 수 있습니다. 측정 결과,
          60% 확률로 자신의 팀 색상이 됩니다. 나머지 40% 확률로 상대 팀의 색상이
          될 수도 있습니다.
        </p>
      </div>
    ),
  },
  {
    title: "액션 2: 간섭하기",
    content: (
      <div>
        <div className="flex items-center mb-2">
          <Zap className="w-5 h-5 text-cyan-400 mr-2" />
          <span className="font-semibold">간섭하기</span>
        </div>
        <p>
          간섭하기는 확정된 셀을 65% 확률로 반전시키거나, 중첩 상태 셀의 측정
          확률을 70%로 변경하는 액션입니다.
        </p>
      </div>
    ),
  },
  {
    title: "액션 3: 얽힘 생성",
    content: (
      <div>
        <div className="flex items-center mb-2">
          <LinkIcon className="w-5 h-5 text-yellow-400 mr-2" />
          <span className="font-semibold">얽힘 생성</span>
        </div>
        <p>
          두 개의 확정된 셀을 얽힘 상태로 만들어, 한 셀이 변화하면 다른 셀도
          자동으로 같은 변화가 적용되도록 합니다.
        </p>
      </div>
    ),
  },
  {
    title: "액션 4: 양자 도약",
    content: (
      <div>
        <div className="flex items-center mb-2">
          <Move className="w-5 h-5 text-orange-400 mr-2" />
          <span className="font-semibold">양자 도약</span>
        </div>
        <p>
          자신의 팀 색상 셀을 다른 위치로 이동시킬 수 있습니다. 이동한 후, 원래
          셀은 중첩 상태가 됩니다.
        </p>
      </div>
    ),
  },
  {
    title: "액션 5: 얽힘 파괴",
    content: (
      <div>
        <div className="flex items-center mb-2">
          <Unlink className="w-5 h-5 text-red-400 mr-2" />
          <span className="font-semibold">얽힘 파괴</span>
        </div>
        <p>얽힘 상태의 셀을 분리하여 독립적인 셀로 만듭니다.</p>
      </div>
    ),
  },
  {
    title: "게임 흐름",
    content: (
      <div>
        <p>
          각 플레이어는 턴마다 하나의 액션을 선택하여 수행합니다. 어느 팀이든
          연속된 5개의 셀을 만들면 즉시 게임이 종료됩니다.
        </p>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="flex items-center p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
            <Waves className="w-5 h-5 text-white mr-2" />
            <div className="font-semibold text-white">파동팀 (선공)</div>
          </div>
          <div className="flex items-center p-2 bg-gradient-to-r from-red-600 to-red-700 rounded-lg">
            <Circle className="w-5 h-5 text-white mr-2" />
            <div className="font-semibold text-white">입자팀 (후공)</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "준비 완료!",
    content: (
      <div>
        <p>
          이제 양자 오목의 기본 규칙을 이해하셨습니다. 게임을 시작해 양자
          물리학의 세계를 탐험해보세요!
        </p>
      </div>
    ),
  },
];
