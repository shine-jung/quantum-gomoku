import React from "react";
import {
  Waves,
  Circle,
  Eye,
  Zap,
  Link as LinkIcon,
  Move,
  Unlink,
} from "lucide-react";
import Modal from "../ui/modal";

interface HelpModalProps {
  showHelp: boolean;
  setShowHelp: (show: boolean) => void;
  setShowTutorial: (show: boolean) => void;
}

const HelpModal: React.FC<HelpModalProps> = ({
  showHelp,
  setShowHelp,
  setShowTutorial,
}) => {
  return (
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
  );
};

export default HelpModal;
