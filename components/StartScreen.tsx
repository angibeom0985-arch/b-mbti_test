
import React, { useState, useEffect } from 'react';
import { VisitorCounter } from '../utils/visitor';
import AdBanner from './AdBanner';

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
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto text-center">
        {/* 방문자 수 */}
        <div className="mb-8 bg-white/90 rounded-3xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-2xl">👥</span>
            <p className="text-sm font-medium text-gray-600">현재까지</p>
          </div>
          <p className="text-xl font-bold text-rose-600">
            {VisitorCounter.formatCount(visitorCount)}명 참여
          </p>
        </div>

        {/* 메인 타이틀 */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            <span className="text-rose-600">성경인물</span>
            <br />
            <span className="text-3xl md:text-4xl text-gray-700">MBTI 테스트</span>
          </h1>
          
          <div className="w-20 h-1 bg-gradient-to-r from-rose-400 to-purple-400 rounded-full mx-auto mb-6"></div>
          
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            나와 닮은 성경 속 인물을 찾아보세요<br />
            <span className="text-rose-600 font-semibold">12개 질문으로 알아보는 나의 성품</span>
          </p>
        </div>

        {/* 광고 배너 */}
        <div className="mb-8">
          <AdBanner 
            slot="2689008677"
            className="rounded-3xl overflow-hidden"
            style={{ minHeight: '120px' }}
          />
        </div>

        {/* 버튼들 */}
        <div className="space-y-4">
          <button
            onClick={onStart}
            className="w-full bg-gradient-to-r from-rose-500 to-purple-500 text-white font-bold py-6 px-8 rounded-3xl hover:from-rose-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl text-xl"
          >
            ✨ 테스트 시작하기
          </button>
          
          <button
            onClick={onViewStats}
            className="w-full bg-white text-gray-600 font-medium py-4 px-6 rounded-3xl hover:bg-gray-50 hover:text-gray-800 transition-all duration-200 shadow-lg border border-gray-200 text-lg"
          >
            📊 결과 통계 보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
