
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto text-center">
        {/* 메인 타이틀 */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
            <span className="text-orange-600">크리스천</span>
            <br />
            <span className="text-red-500 text-3xl md:text-4xl">성격유형테스트</span>
          </h1>
          
          <div className="text-gray-600 text-base leading-relaxed mb-6 px-4">
            10월 3일 목요일, 개천절에 열리는<br />
            국내 최대의 다음세대 크리스천 페스티벌<br />
            <span className="font-bold text-orange-600">READYCALL (레디컬)</span> 과 함께하는<br />
            나와 어울리는 성경 속 인물 찾기 테스트!
          </div>
        </div>

        {/* 방문자 수 */}
        <div className="mb-8 bg-white/80 rounded-3xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-2xl">👥</span>
            <p className="text-sm font-medium text-gray-600">누구와 페어지를 만들었나요?</p>
          </div>
          <p className="text-lg font-bold text-orange-600">
            {VisitorCounter.formatCount(visitorCount)}명 참여
          </p>
        </div>

        {/* 시작 버튼 */}
        <button
          onClick={onStart}
          className="w-full bg-white text-gray-800 font-bold py-6 px-8 rounded-3xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] shadow-xl text-xl mb-4 border border-gray-200"
        >
          테스트 시작하기
        </button>

        {/* 광고 배너 */}
        <div className="mb-6">
          <AdBanner 
            slot="2689008677"
            className="rounded-3xl overflow-hidden"
            style={{ minHeight: '120px' }}
          />
        </div>

        {/* 통계 보기 버튼 */}
        <button
          onClick={onViewStats}
          className="w-full bg-orange-500 text-white font-semibold py-4 px-6 rounded-3xl hover:bg-orange-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg text-lg"
        >
          📊 결과 통계 보기
        </button>

        {/* 하단 식물 장식 힌트 */}
        <div className="mt-8 flex justify-center space-x-4 text-2xl opacity-60">
          <span>🌿</span>
          <span>🍃</span>
          <span>🌱</span>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
