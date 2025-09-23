
import React, { useState, useEffect } from 'react';
import { VisitorCounter } from '../utils/visitor';

interface StartScreenProps {
  onStart: () => void;
  onViewStats: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, onViewStats }) => {
  const [visitorCount, setVisitorCount] = useState<number>(0);

  useEffect(() => {
    // 컴포넌트 마운트 시 방문자수 증가
    const count = VisitorCounter.incrementAndGet();
    setVisitorCount(count);
  }, []);
  return (
    <div className="text-center p-8 bg-gradient-to-br from-amber-50 to-orange-100 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-amber-300/50 relative overflow-hidden">
      {/* 장식적 배경 요소 */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"></div>
      
      {/* 방문자수 표시 */}
      <div className="mb-6 bg-white/80 rounded-xl p-3 border border-amber-200 shadow-inner">
        <p className="text-sm font-medium text-amber-800 mb-1">방문자수</p>
        <p className="text-lg font-bold text-amber-900">
          {VisitorCounter.formatCount(visitorCount)}명이 테스트함
        </p>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold font-myeongjo text-amber-900 mb-6 leading-tight">
        <span className="text-orange-800">성경 인물</span>
        <br />
        <span className="text-amber-800">MBTI 테스트</span>
      </h1>
      
      <div className="mb-8 bg-white/60 rounded-lg p-4 border border-amber-200/70">
        <p className="text-stone-700 text-lg leading-relaxed font-medium">
          하나님께서 각자에게 주신 <br />
          <span className="text-amber-800 font-bold">고유한 성품</span>을 발견해보세요
        </p>
        <p className="text-stone-600 text-sm mt-2">
          성경 속 인물들과의 닮은 점을 통해 나를 알아가는 시간
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <button
          onClick={onStart}
          className="bg-gradient-to-r from-amber-700 to-orange-700 text-white font-bold py-4 px-8 rounded-full hover:from-amber-800 hover:to-orange-800 transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-amber-600/30 text-lg"
        >
          ✨ 테스트 시작하기
        </button>
        <button
          onClick={onViewStats}
          className="bg-gradient-to-r from-stone-600 to-stone-700 text-white font-bold py-4 px-8 rounded-full hover:from-stone-700 hover:to-stone-800 transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-stone-500/30 text-lg"
        >
          📊 통계 보기
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
