
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
    <div className="p-6 md:p-10 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 w-full">
      <ProgressBar current={currentQuestion} total={totalQuestions} />
      <h2 className="text-2xl md:text-3xl font-bold text-center text-stone-800 my-8 min-h-[6rem] md:min-h-[4rem] flex items-center justify-center">
        {question.text}
      </h2>
      <div className="flex flex-col space-y-4">
        {question.answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => onAnswer(answer.type)}
            className="w-full text-left p-4 bg-amber-100 rounded-lg text-stone-700 hover:bg-amber-600 hover:text-white transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-sm hover:shadow-lg"
          >
            <span className="font-semibold text-lg">{answer.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizScreen;
