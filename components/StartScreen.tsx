
import React, { useState, useEffect } from 'react';
import { VisitorCounter } from '../utils/visitor';
import { TEST_VERSIONS } from '../constants';

interface StartScreenProps {
  onStart: (version: number) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [animatedCount, setAnimatedCount] = useState<number>(0);
  const [selectedVersion, setSelectedVersion] = useState<number>(1);

  useEffect(() => {
    // 컴포넌트 마운트 시 방문자수 증가
    const count = VisitorCounter.incrementAndGet();
    setVisitorCount(count);
    
    // URL 파라미터에서 버전 정보 확인
    const urlParams = new URLSearchParams(window.location.search);
    const versionParam = urlParams.get('version');
    if (versionParam) {
      const version = parseInt(versionParam);
      if (version >= 1 && version <= 3) {
        setSelectedVersion(version);
      }
    }
    
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
        
        {/* 1. 지금까지 참여한 사람들 - 조화로운 색상으로 수정 */}
        <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-4 shadow-lg border border-orange-100">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-xl animate-bounce">👥</span>
            <p className="text-sm font-medium text-orange-700">지금까지 참여한 사람들</p>
          </div>
          <p className="text-xl font-bold text-orange-600 tabular-nums">
            <span className="inline-block">
              {VisitorCounter.formatCount(animatedCount)}명 참여
            </span>
          </p>
        </div>

        {/* 3. 테스트 선택 - 더블클릭으로 시작 */}
        <div className="mb-6 space-y-4">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            🎯 나에게 딱 맞는 테스트를 선택해보세요!
          </h3>
          <div className="space-y-3">
            {Object.entries(TEST_VERSIONS).map(([versionKey, version]) => {
              const versionNumber = parseInt(versionKey);
              const isSelected = selectedVersion === versionNumber;
              
              return (
                <button
                  key={versionNumber}
                  onClick={() => {
                    if (selectedVersion === versionNumber) {
                      // 이미 선택된 버전을 다시 클릭하면 해당 테스트 페이지로 이동
                      const testUrls = {
                        1: 'https://b-mbti.money-hotissue.com/test1',
                        2: 'https://b-mbti.money-hotissue.com/test2',
                        3: 'https://b-mbti.money-hotissue.com/test3'
                      };
                      window.location.href = testUrls[versionNumber as keyof typeof testUrls];
                    } else {
                      // 다른 버전 선택
                      setSelectedVersion(versionNumber);
                    }
                  }}
                  className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left transform hover:scale-[1.01] ${
                    isSelected
                      ? `border-${version.color}-400 bg-gradient-to-r ${
                          version.color === 'orange' 
                            ? 'from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200' 
                            : version.color === 'purple'
                            ? 'from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200'
                            : 'from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200'
                        }`
                      : `bg-gradient-to-r ${
                          version.color === 'orange' 
                            ? 'from-orange-50 to-amber-50 border-orange-200 hover:border-orange-300' 
                            : version.color === 'purple'
                            ? 'from-purple-50 to-pink-50 border-purple-200 hover:border-purple-300'
                            : 'from-blue-50 to-cyan-50 border-blue-200 hover:border-blue-300'
                        } hover:shadow-md`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className={`text-lg font-bold mb-2 ${
                        isSelected ? 'text-white' : 'text-gray-800'
                      }`}>
                        {version.name}
                      </h4>
                      <p className={`text-sm mb-2 ${
                        isSelected ? 'text-white/90' : 'text-gray-600'
                      }`}>
                        {version.description}
                      </p>
                      
                      {/* 각 테스트별 추가 특징 */}
                      <div className={`text-xs ${
                        isSelected ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        {versionNumber === 1 && "💝 공동체 속 관계를 중요하게 생각하는 분들에게 추천"}
                        {versionNumber === 2 && "⚡ 사명과 비전을 품고 있는 분들에게 추천"}
                        {versionNumber === 3 && "🔥 인생의 시련을 겪고 계신 분들에게 추천"}
                      </div>
                      
                      {isSelected && (
                        <div className="mt-3 flex items-center justify-center">
                          <span className="text-white/90 text-sm mr-2">👆 한번 더 클릭하면</span>
                          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                            🚀 시작!
                          </span>
                        </div>
                      )}
                    </div>
                    <div className={`ml-4 w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-white/50 bg-white/20'
                        : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-700 text-center">
              <span className="font-semibold">💡 팁:</span> 각각 다른 관점에서 분석하여 더 정확한 결과를 얻어요!
            </p>
          </div>
        </div>

        
        {/* 특징 미리보기 - 색상 조화롭게 조정 */}
        <div className="grid grid-cols-2 gap-3 mb-6 px-2">
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-3 shadow-sm border border-pink-200">
            <div className="text-xl mb-1">🎯</div>
            <div className="text-xs font-semibold text-pink-800">3가지 테스트</div>
            <div className="text-xs text-pink-600">다양한 관점</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-3 shadow-sm border border-purple-200">
            <div className="text-xl mb-1">🎮</div>
            <div className="text-xs font-semibold text-purple-800">이미지 맞추기 게임</div>
            <div className="text-xs text-purple-600">재미있는 게임</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-3 shadow-sm border border-blue-200">
            <div className="text-xl mb-1">📸</div>
            <div className="text-xs font-semibold text-blue-800">이미지 저장</div>
            <div className="text-xs text-blue-600">SNS 공유용</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-3 shadow-sm border border-orange-200">
            <div className="text-xl mb-1">👥</div>
            <div className="text-xs font-semibold text-orange-800">테스트 결과 공유</div>
            <div className="text-xs text-orange-600">어울리는 유형</div>
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
