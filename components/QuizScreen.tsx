
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
    <div className="p-6 md:p-10 bg-gradient-to-br from-amber-50 to-orange-100 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-amber-300/50 w-full relative overflow-hidden">
      {/* 장식적 배경 요소 */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"></div>
      
      <ProgressBar current={currentQuestion} total={totalQuestions} />
      
      <div className="bg-white/70 rounded-xl p-6 my-8 border border-amber-200/70 shadow-inner">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-amber-900 min-h-[6rem] md:min-h-[4rem] flex items-center justify-center leading-relaxed font-myeongjo">
          {question.text}
        </h2>
      </div>
      
      <div className="flex flex-col space-y-4">
        {question.answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => onAnswer(answer.type)}
            className="w-full text-left p-5 bg-gradient-to-r from-white to-amber-50 rounded-xl text-stone-700 hover:from-amber-600 hover:to-orange-600 hover:text-white transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg hover:shadow-xl border-2 border-amber-200 hover:border-amber-500"
          >
            <span className="font-semibold text-lg leading-relaxed">{answer.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizScreen;
