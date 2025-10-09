import React, { useState } from "react";
import type { Question, Dichotomy } from "../types";
import ProgressBar from "./ProgressBar";

interface QuizScreenProps {
  question: Question;
  onAnswer: (type: Dichotomy) => void;
  onPrevious?: () => void;
  onHome?: () => void;
  currentQuestion: number;
  totalQuestions: number;
}

const QuizScreen: React.FC<QuizScreenProps> = ({
  question,
  onAnswer,
  onPrevious,
  onHome,
  currentQuestion,
  totalQuestions,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleAnswer = (type: Dichotomy, index: number) => {
    setSelectedAnswer(index);
    // 약간의 지연을 주어 사용자가 선택을 확인할 수 있도록 함
    setTimeout(() => {
      onAnswer(type);
      setSelectedAnswer(null); // 다음 질문을 위해 초기화
    }, 200);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 flex items-start justify-center pt-8 px-4">
      <div className="w-full max-w-lg mx-auto">
        {/* 프로그레스 헤더 - 여백 줄임 */}
        <div className="text-center mb-4">
          <div className="text-sm text-gray-500 mb-2 font-medium">
            성경인물 MBTI 테스트 성격유형검사 16가지
          </div>
          <div className="text-4xl font-bold text-gray-800 mb-3">
            {String(currentQuestion).padStart(2, "0")}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1 mb-4">
            <div
              className="bg-gradient-to-r from-orange-400 to-red-400 h-1 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* 질문 카드 - 여백 줄임 */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg border border-gray-100 relative">
          {/* 작은 아이콘 */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-3">
              <span className="text-2xl">🌿</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed">
              {question.text}
            </h2>
          </div>

          {/* 답변 선택지들 */}
          <div className="space-y-4">
            {question.answers.map((answer, index) => (
              <button
                key={`${currentQuestion}-${index}`} // 각 질문마다 고유한 키 생성
                onClick={() => handleAnswer(answer.type, index)}
                className={`w-full p-5 text-left rounded-2xl text-gray-800 font-medium text-lg leading-relaxed transition-all duration-300 ease-out transform focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                  selectedAnswer === index
                    ? "bg-amber-100 border-amber-300 scale-[1.01] shadow-md"
                    : "bg-gray-50 hover:bg-amber-50 border-gray-200 hover:border-amber-200 hover:scale-[1.01] active:scale-[0.99]"
                } border`}
              >
                {answer.text}
              </button>
            ))}
          </div>
        </div>

        {/* 이전 질문 버튼과 홈으로 돌아가기 버튼 */}
        <div className="flex justify-between items-center">
          {/* 이전 버튼 */}
          {currentQuestion > 1 && onPrevious ? (
            <button
              onClick={onPrevious}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-white hover:bg-gray-50 rounded-lg border border-gray-300 hover:border-gray-400 transition-all duration-200 shadow-sm"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              이전
            </button>
          ) : (
            <div></div>
          )}

          {/* 홈으로 돌아가기 버튼 - 첫 번째 질문에만 표시 */}
          {currentQuestion === 1 && onHome && (
            <button
              onClick={onHome}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              홈으로 돌아가기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
