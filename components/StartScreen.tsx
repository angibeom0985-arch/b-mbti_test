import React, { useState, useEffect } from "react";
import { VisitorCounter } from "../utils/visitor";
import { TEST_VERSIONS } from "../constants";

interface StartScreenProps {
  onStart: (version: number) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [animatedCount, setAnimatedCount] = useState<number>(0);
  const [selectedVersion, setSelectedVersion] = useState<number>(1);
  const [mostPopularVersion, setMostPopularVersion] = useState<number>(1);

  useEffect(() => {
    // 컴포넌트 마운트 시 방문자수 증가
    const count = VisitorCounter.incrementAndGet();
    setVisitorCount(count);

    // 가장 인기 있는 테스트 버전 조회
    const popularVersion = VisitorCounter.getMostPopularVersion();
    setMostPopularVersion(popularVersion);

    // URL 파라미터에서 버전 정보 확인
    const urlParams = new URLSearchParams(window.location.search);
    const versionParam = urlParams.get("version");
    if (versionParam) {
      const version = parseInt(versionParam);
      if (version >= 1 && version <= 3) {
        setSelectedVersion(version);
      }
    }

    // 카운터 애니메이션
    let start = 0;
    const duration = 1000; // 1초 동안 애니메이션
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
    <div
      className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4"
      style={{ paddingBottom: "200px" }}
    >
      <div className="w-full max-w-md mx-auto text-center">
        {/* 1. 사이트 제목과 지금까지 참여한 사람들 */}
        <div className="mb-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-3xl p-4 shadow-lg border border-green-200">
          {/* 사이트 제목 */}
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            성경인물 MBTI 테스트
          </h1>

          {/* 참여자 수 */}
          <div className="flex items-center justify-center space-x-1">
            <span className="text-lg animate-bounce">👥</span>
            <p className="text-sm font-medium text-green-700">
              지금까지 참여한 사람들
              <span className="font-bold text-green-600 tabular-nums ml-1">
                {VisitorCounter.formatCount(animatedCount)}명 참여
              </span>
            </p>
          </div>
        </div>

        {/* 3. 테스트 선택 - 클릭으로 바로 시작 */}
        <div className="mb-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
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
                    // 클릭 시 바로 해당 테스트 시작
                    // 테스트 시작 통계 업데이트
                    VisitorCounter.incrementVersionUsage(versionNumber);

                    // 앱 내에서 상태 변경으로 테스트 시작
                    onStart(versionNumber);
                  }}
                  className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left transform hover:scale-[1.01] bg-gradient-to-r ${
                    version.color === "orange"
                      ? "from-orange-50 to-amber-50 border-orange-200 hover:border-orange-300"
                      : version.color === "purple"
                      ? "from-purple-50 to-pink-50 border-purple-200 hover:border-purple-300"
                      : "from-blue-50 to-cyan-50 border-blue-200 hover:border-blue-300"
                  } hover:shadow-md`}
                >
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-full">
                      <h4 className="text-lg font-bold mb-2 flex items-center justify-center text-gray-800">
                        <span>
                          {versionNumber === 1 && "💝 "}
                          {versionNumber === 2 && "⚡ "}
                          {versionNumber === 3 && "🔥 "}
                          {version.name}
                        </span>
                        {versionNumber === 1 && (
                          <span className="ml-2 px-2 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
                            BEST
                          </span>
                        )}
                      </h4>
                      <p className="text-sm mb-2 text-center text-gray-600">
                        {version.description}
                      </p>

                      {/* 각 테스트별 추가 특징 */}
                      <div className="text-xs text-center text-gray-500 mb-3">
                        {versionNumber === 1 &&
                          "공동체 속 관계를 중요하게 생각하는 분들에게 추천"}
                        {versionNumber === 2 &&
                          "사명과 비전을 품고 있는 분들에게 추천"}
                        {versionNumber === 3 &&
                          "인생의 시련을 겪고 계신 분들에게 추천"}
                      </div>

                      {/* 시작 버튼 */}
                      <div className="w-full">
                        <span
                          className={`w-full block px-4 py-2 rounded-full text-sm font-semibold text-white text-center ${
                            version.color === "orange"
                              ? "bg-orange-500"
                              : version.color === "purple"
                              ? "bg-purple-500"
                              : "bg-blue-500"
                          }`}
                        >
                          시작
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-700 text-center">
              <span className="font-semibold">💡 팁:</span> 다른 관점에서 분석해
              정확한 결과를 얻어요!
            </p>
          </div>
        </div>

        {/* 특징 섹션 */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
            ✨ 특징
          </h3>
          <div className="grid grid-cols-2 gap-3 px-2">
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-3 shadow-sm border border-pink-200">
              <div className="text-xl mb-1">🎯</div>
              <div className="text-xs font-semibold text-pink-800">
                3가지 테스트
              </div>
              <div className="text-xs text-pink-600">다양한 관점</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-3 shadow-sm border border-purple-200">
              <div className="text-xl mb-1">🎮</div>
              <div className="text-xs font-semibold text-purple-800">
                이미지 맞추기 게임
              </div>
              <div className="text-xs text-purple-600">재미있는 게임</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-3 shadow-sm border border-blue-200">
              <div className="text-xl mb-1">📸</div>
              <div className="text-xs font-semibold text-blue-800">
                이미지 저장
              </div>
              <div className="text-xs text-blue-600">SNS 공유용</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-3 shadow-sm border border-orange-200">
              <div className="text-xl mb-1">👥</div>
              <div className="text-xs font-semibold text-orange-800">
                테스트 결과 공유
              </div>
              <div className="text-xs text-orange-600">어울리는 유형</div>
            </div>
          </div>
        </div>

        {/* 소개 */}
        <div className="mb-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-3xl p-4 shadow-lg border border-green-200">
          <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
            📖 소개
          </h3>
          <p className="text-sm text-green-700 text-center leading-relaxed">
            MBTI 성격유형검사와 성경 속 인물들을 결합한 의미있는 테스트입니다.
            16가지 MBTI 유형을 바탕으로 당신과 가장 닮은 성경 인물을
            찾아드립니다.
          </p>
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
