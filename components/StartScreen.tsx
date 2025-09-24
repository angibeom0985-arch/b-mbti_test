
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
    <div className="text-center p-6 bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 relative overflow-hidden max-w-md mx-auto">
      {/* MZ 트렌디한 방문자수 표시 */}
      <div className="mb-6 bg-white/90 rounded-2xl p-4 shadow-sm border border-pink-100/50 backdrop-blur-sm">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="text-2xl">👥</span>
          <p className="text-sm font-medium text-gray-600">현재까지</p>
        </div>
        <p className="text-xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
          {VisitorCounter.formatCount(visitorCount)}명 참여
        </p>
      </div>

      {/* 메인 타이틀 - 더 모던하게 */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 leading-tight">
          <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">성경인물</span>
          <br />
          <span className="text-2xl md:text-3xl text-gray-700">MBTI 테스트</span>
        </h1>
        
        <div className="w-16 h-1 bg-gradient-to-r from-violet-400 to-pink-400 rounded-full mx-auto mb-4"></div>
      </div>
      
      {/* 설명 텍스트 - 심플하게 */}
      <div className="mb-8 bg-white/80 rounded-2xl p-4 shadow-sm border border-pink-100/50">
        <p className="text-gray-600 text-base leading-relaxed">
          <span className="text-lg">✨</span> 나와 닮은 성경 속 인물은?<br />
          <span className="text-violet-600 font-semibold text-sm">12개 질문으로 알아보는 나의 성품</span>
        </p>
      </div>

      {/* 시작 버튼 - MZ 스타일 */}
      <div className="space-y-4">
        <button
          onClick={onStart}
          className="w-full bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold py-4 px-8 rounded-2xl hover:from-violet-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg text-lg"
        >
          ✨ 테스트 시작하기
        </button>
        
        <button
          onClick={onViewStats}
          className="w-full bg-white/80 text-gray-600 font-medium py-3 px-6 rounded-2xl hover:bg-white hover:text-gray-800 transition-all duration-200 shadow-sm border border-gray-200/50 text-base backdrop-blur-sm"
        >
          📊 결과 통계 보기
        </button>
      </div>
      
      {/* 하단 장식 */}
      <div className="mt-6 flex justify-center space-x-1">
        <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-75"></div>
        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-150"></div>
      </div>
    </div>
  );
};

export default StartScreen;
