
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto">
        {/* 프로그레스 헤더 */}
        <div className="text-center mb-8">
          <div className="text-sm text-gray-500 mb-2 font-medium">
            READYCALL과 함께하는<br />크리스천 성격유형테스트
          </div>
          <div className="text-4xl font-bold text-gray-800 mb-4">
            {String(currentQuestion).padStart(2, '0')}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1 mb-6">
            <div 
              className="bg-gradient-to-r from-orange-400 to-red-400 h-1 rounded-full transition-all duration-700 ease-out" 
              style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* 질문 카드 */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-lg border border-gray-100 relative">
          {/* 작은 아이콘 */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-4">
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
                key={index}
                onClick={() => onAnswer(answer.type)}
                className="w-full p-5 text-left bg-gray-50 hover:bg-amber-50 rounded-2xl text-gray-800 font-medium text-lg leading-relaxed transition-all duration-300 ease-out transform hover:scale-[1.01] active:scale-[0.99] border border-gray-200 hover:border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                {answer.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
