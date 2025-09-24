
import React from 'react';
import type { Question, Dichotomy } from '../types';
import ProgressBar from './ProgressBar';

interface QuizScreenProps {
  question: Question;
  onAnswer: (type: Dichotomy) => void;
  currentQuestion: number;
  totalQuestions: number;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ question, onAnswer, currentQuestion, totalQuestions }) => {
  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 w-full max-w-lg mx-auto">
      <ProgressBar current={currentQuestion} total={totalQuestions} />
      
      {/* 질문 영역 - 폰트 크기 줄임 */}
      <div className="bg-white/80 rounded-2xl p-4 my-6 shadow-sm border border-pink-100/50 backdrop-blur-sm">
        <h2 className="text-lg md:text-xl font-semibold text-center text-gray-800 min-h-[4rem] flex items-center justify-center leading-relaxed">
          {question.text}
        </h2>
      </div>
      
      {/* 답변 버튼들 - MZ 친화적 디자인 */}
      <div className="flex flex-col space-y-3">
        {question.answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => onAnswer(answer.type)}
            className="group w-full text-left p-4 bg-white/90 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-violet-500 hover:to-pink-500 hover:text-white transition-all duration-300 ease-out transform hover:scale-[1.02] shadow-md hover:shadow-lg border border-gray-100/50 backdrop-blur-sm active:scale-[0.98]"
          >
            <span className="font-medium text-base leading-relaxed group-hover:font-semibold transition-all duration-200">{answer.text}</span>
            <div className="w-0 group-hover:w-4 h-0.5 bg-white rounded-full transition-all duration-300 mt-2"></div>
          </button>
        ))}
      </div>
      
      {/* MZ 느낌의 하단 장식 */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalQuestions }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i < currentQuestion 
                ? 'bg-gradient-to-r from-violet-400 to-pink-400 scale-110' 
                : i === currentQuestion - 1
                ? 'bg-gradient-to-r from-orange-400 to-pink-400 scale-125 shadow-sm'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default QuizScreen;
