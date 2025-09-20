
import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center p-8 bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200">
      <h1 className="text-4xl md:text-5xl font-bold font-myeongjo text-amber-900 mb-4">
        성경 인물 MBTI 테스트
      </h1>
      <p className="text-stone-600 mb-8 text-lg">
        나는 어떤 성경 인물과 닮았을까요? <br />
        간단한 테스트를 통해 알아보세요!
      </p>
      <button
        onClick={onStart}
        className="bg-amber-800 text-white font-bold py-3 px-8 rounded-full hover:bg-amber-900 transition-colors duration-300 transform hover:scale-105 shadow-md"
      >
        테스트 시작하기
      </button>
    </div>
  );
};

export default StartScreen;
