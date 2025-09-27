
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
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* 프로그레스 바 */}
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <span className="text-2xl font-bold text-rose-600">{currentQuestion}/{totalQuestions}</span>
          </div>
          <ProgressBar current={currentQuestion} total={totalQuestions} />
        </div>

        {/* 질문 영역 */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-lg border border-gray-100">
          <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 leading-relaxed">
            {question.text}
          </h2>
        </div>

        {/* 답변 버튼들 */}
        <div className="space-y-4">
          {question.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => onAnswer(answer.type)}
              className="w-full p-6 bg-white rounded-3xl text-gray-800 font-medium text-lg leading-relaxed hover:bg-gradient-to-r hover:from-rose-400 hover:to-purple-400 hover:text-white transition-all duration-300 ease-out transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-300"
            >
              {answer.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
