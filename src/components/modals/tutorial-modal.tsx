import React from "react";
import Modal from "../ui/modal";
import { tutorialContent } from "../../constants/tutorial-content";

interface TutorialModalProps {
  showTutorial: boolean;
  tutorialStep: number;
  setShowTutorial: (show: boolean) => void;
  setTutorialStep: (step: number) => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({
  showTutorial,
  tutorialStep,
  setShowTutorial,
  setTutorialStep,
}) => {
  return (
    <Modal
      isOpen={showTutorial}
      onClose={() => setShowTutorial(false)}
      title={`튜토리얼 ${tutorialStep + 1}/${tutorialContent.length}: ${
        tutorialContent[tutorialStep].title
      }`}
    >
      <div className="mb-6">{tutorialContent[tutorialStep].content}</div>
      <div className="flex justify-between">
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-gray-600 transition-all"
          onClick={() => {
            if (tutorialStep > 0) {
              setTutorialStep(tutorialStep - 1);
            } else {
              setShowTutorial(false);
            }
          }}
        >
          {tutorialStep > 0 ? "이전" : "닫기"}
        </button>
        <button
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all"
          onClick={() => {
            if (tutorialStep < tutorialContent.length - 1) {
              setTutorialStep(tutorialStep + 1);
            } else {
              setShowTutorial(false);
            }
          }}
        >
          {tutorialStep < tutorialContent.length - 1 ? "다음" : "완료"}
        </button>
      </div>
    </Modal>
  );
};

export default TutorialModal;
