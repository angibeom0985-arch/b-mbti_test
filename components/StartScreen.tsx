
import React, { useState, useEffect } from 'react';
import { VisitorCounter } from '../utils/visitor';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [animatedCount, setAnimatedCount] = useState<number>(0);

  useEffect(() => {
    // 컴포넌트 마운트 시 방문자수 증가
    const count = VisitorCounter.incrementAndGet();
    setVisitorCount(count);
    
    // 카운터 애니메이션
    let start = 0;
    const duration = 2000; // 2초 동안 애니메이션
    const increment = count / (duration / 16); // 60fps 기준
    
    const animate = () => {
      start += increment;
      if (start < count) {
        setAnimatedCount(Math.floor(start));
        requestAnimationFrame(animate);
      } else {
        setAnimatedCount(count);
      }
    };
    
    // 약간의 지연 후 애니메이션 시작
    setTimeout(() => {
      animate();
    }, 500);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto text-center">
        
        {/* 1. 지금까지 참여한 사람들 */}
        <div className="mb-6 bg-white/80 rounded-3xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-xl animate-bounce">👥</span>
            <p className="text-sm font-medium text-gray-600">지금까지 참여한 사람들</p>
          </div>
          <p className="text-xl font-bold text-orange-600 tabular-nums">
            <span className="inline-block">
              {VisitorCounter.formatCount(animatedCount)}명 참여
            </span>
          </p>
        </div>

        {/* 2. 사이트 제목 */}
        <div className="mb-6">
          <div className="mb-4 text-center">
            <span className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              ✨ 성경인물 MBTI 테스트 ✨
            </span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 leading-tight">
            <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">나와 닮은 성경인물은?</span>
          </h1>
        </div>

        {/* 3. 나의 성경인물 찾기 버튼 */}
        <button
          onClick={onStart}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-6 px-8 rounded-3xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-[1.02] shadow-xl text-xl mb-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 transform skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <span className="relative">🚀 나의 성경인물 찾기</span>
        </button>

        {/* 4. 사이트 소개 */}
        <div className="text-gray-600 text-base leading-relaxed mb-6 px-4">
          📖 성경 속 위대한 인물들과 당신의 성격을 비교해보세요!<br />
          <span className="font-bold text-orange-600">12가지 질문</span>으로 알아보는<br />
          나만의 성경인물 매칭 테스트 💫
        </div>
        
        {/* 5. 특징 미리보기 - 호환성 분석, 이미지 저장, 결과 공유, 후기 시스템 */}
        <div className="grid grid-cols-2 gap-3 mb-6 px-2">
          <div className="bg-white/90 rounded-2xl p-3 shadow-sm border border-orange-100/50">
            <div className="text-xl mb-1">👥</div>
            <div className="text-xs font-semibold text-gray-700">호환성 분석</div>
            <div className="text-xs text-gray-500">어울리는 유형</div>
          </div>
          <div className="bg-white/90 rounded-2xl p-3 shadow-sm border border-purple-100/50">
            <div className="text-xl mb-1">📊</div>
            <div className="text-xs font-semibold text-gray-700">실시간 통계</div>
            <div className="text-xs text-gray-500">다른 사람들 결과</div>
          </div>
          <div className="bg-white/90 rounded-2xl p-3 shadow-sm border border-blue-100/50">
            <div className="text-xl mb-1">📸</div>
            <div className="text-xs font-semibold text-gray-700">이미지 저장</div>
            <div className="text-xs text-gray-500">SNS 공유용</div>
          </div>
          <div className="bg-white/90 rounded-2xl p-3 shadow-sm border border-pink-100/50">
            <div className="text-xl mb-1">💬</div>
            <div className="text-xs font-semibold text-gray-700">후기 시스템</div>
            <div className="text-xs text-gray-500">사용자 리뷰</div>
          </div>
        </div>

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
