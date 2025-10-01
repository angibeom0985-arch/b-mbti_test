import React, { useState, useEffect } from 'react';
import type { MbtiType, MbtiResult } from '../types';
import { RESULTS, PERSONALITY_TRAITS } from '../constants';
import RestartIcon from './icons/RestartIcon';
import ShareIcon from './icons/ShareIcon';

// 쿠팡 파트너스 링크 배열
const COUPANG_PARTNERS_URLS = [
  'https://link.coupang.com/a/cTTkqa',
  'https://link.coupang.com/a/cTTkLm',
  'https://link.coupang.com/a/cTTkS7',
  'https://link.coupang.com/a/cTTkWI',
  'https://link.coupang.com/a/cTTk02',
  'https://link.coupang.com/a/cTTk5m',
  'https://link.coupang.com/a/cTTk7h',
  'https://link.coupang.com/a/cTTlcr',
  'https://link.coupang.com/a/cTTldT',
  'https://link.coupang.com/a/cTTlif'
];

// 랜덤 쿠팡 파트너스 링크 선택 함수
const getRandomCoupangUrl = (): string => {
  const randomIndex = Math.floor(Math.random() * COUPANG_PARTNERS_URLS.length);
  return COUPANG_PARTNERS_URLS[randomIndex];
};

interface ResultScreenProps {
  resultType: MbtiType;
  resultData: MbtiResult | null;
  error: string | null;
  onRestart: () => void;
  completedVersion?: number;
  onQuizGame?: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ 
  resultType, 
  resultData, 
  error, 
  onRestart,
  completedVersion,
  onQuizGame
}) => {
  const [copied, setCopied] = useState(false);

  // 이미지를 새 창에서 크게 보기
  const openImageInNewWindow = (imageUrl: string, title: string) => {
    const newWindow = window.open('', '_blank', 'width=600,height=600,resizable=yes,scrollbars=yes');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${title} - 크게보기</title>
            <style>
              body { 
                margin: 0; 
                padding: 20px; 
                background: #f5f5f5; 
                display: flex; 
                justify-content: center; 
                align-items: center;
                min-height: 100vh;
                font-family: system-ui, -apple-system, sans-serif;
              }
              img { 
                max-width: 100%; 
                max-height: 90vh; 
                border-radius: 12px; 
                box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                background: white;
              }
              .container {
                text-align: center;
              }
              h1 {
                color: #333;
                margin-bottom: 20px;
                font-size: 24px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>${title}</h1>
              <img src="${imageUrl}" alt="${title}" />
            </div>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  // 쿠팡파트너스 링크를 먼저 열고, 그 다음에 목적지 URL을 여는 함수
  const openWithCoupangAd = (targetUrl: string, windowOptions?: string) => {
    const coupangPartnersUrl = getRandomCoupangUrl();
    
    // 1. 목적지 URL을 새 탭에서 먼저 열기
    const targetWindow = window.open(targetUrl, '_blank', windowOptions || '');
    
    if (!targetWindow) {
      alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
      return;
    }
    
    // 2. 현재 탭에서 쿠팡파트너스 링크로 이동
    setTimeout(() => {
      window.location.href = coupangPartnersUrl;
    }, 100);
  };

  const handleShare = () => {
    const shareUrl = `https://b-mbti.money-hotissue.com`;
    const shareText = `나는 ${resultData?.character}(${resultType}) 유형이에요! 나와 닮은 성경인물을 찾아보세요!`;
    
    if (navigator.share) {
      navigator.share({
        title: `성경인물 MBTI - ${resultData?.character}`,
        text: shareText,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  if (error) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">오류 발생</h2>
        <p className="text-gray-700 mb-6">{error}</p>
        <button
          onClick={onRestart}
          className="bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-2xl hover:from-violet-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02] shadow-md flex items-center justify-center mx-auto"
        >
          <RestartIcon className="w-5 h-5 mr-2" />
          다시 시도하기
        </button>
      </div>
    );
  }

  if (!resultData) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
        <p className="text-gray-600">결과를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
      <div className="image-capture-area p-6 md:p-8">
        
        {/* 당신의 성경인물 유형 섹션 */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">✨ 당신의 성경인물 유형</h2>
          
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* 왼쪽 - 글 */}
            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {resultData.character}
                </h1>
                <div className="bg-gradient-to-r from-violet-500 to-pink-500 text-white px-4 py-2 rounded-full text-lg font-bold inline-block">
                  {resultType}
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed text-left">
                {resultData.description}
              </p>
            </div>
            
            {/* 오른쪽 - 이미지 (크게보기) */}
            <div className="flex-shrink-0">
              {resultData.image ? (
                <div className="space-y-2">
                  <div 
                    className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
                    onClick={() => openImageInNewWindow(resultData.image!, resultData.character)}
                  >
                    <div className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-2xl p-2 shadow-lg border overflow-hidden">
                      <img 
                        src={resultData.image} 
                        alt={resultData.character} 
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={() => openImageInNewWindow(resultData.image!, resultData.character)}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                  >
                    <span>🔍</span>
                    <span>크게보기</span>
                  </button>
                </div>
              ) : (
                <div className="w-48 h-48 bg-gray-200 rounded-2xl shadow-sm flex items-center justify-center">
                  <p className="text-gray-500 text-sm">이미지 로딩중...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 성격 특성 섹션 - 넘버링 */}
        <div className="mb-6 bg-white/90 rounded-2xl p-5 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🎯</span>
            성격 특성
          </h3>
          <div className="space-y-3">
            {PERSONALITY_TRAITS[resultType]?.map((trait, index) => (
              <div key={index} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-violet-400 to-pink-400 text-white text-sm rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                <p className="text-gray-700 leading-relaxed flex-1">
                  {trait}
                </p>
              </div>
            )) || (
              // Fallback
              resultData.description.split('.').slice(0, 5).map((sentence, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-violet-400 to-pink-400 text-white text-sm rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <p className="text-gray-700 leading-relaxed flex-1">
                    {sentence.trim()}.
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 관련 성경구절 섹션 */}
        <div className="mb-6 bg-gradient-to-r from-violet-100 to-pink-100 p-4 rounded-2xl border-l-4 border-violet-400">
          <h4 className="text-violet-800 font-bold mb-3 flex items-center">
            <span className="mr-2">📖</span>
            관련 성경구절 ({resultData.verse})
          </h4>
          <blockquote className="text-gray-800 font-medium leading-relaxed italic">
            "{resultData.verseText}"
          </blockquote>
        </div>

        {/* 성경인물 맞히기 게임 섹션 */}
        <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border-2 border-indigo-200">
          <div className="text-center">
            <h3 className="font-bold text-indigo-800 mb-2 flex items-center justify-center">
              <span className="mr-2">🖼️</span>
              성경인물 맞히기 게임!
            </h3>
            <p className="text-sm text-indigo-600 mb-3">
              이미지를 보고 누구인지 맞춰보세요 ✨
            </p>
            
            {/* 문제 예시 */}
            <div className="mb-4 p-3 bg-white/70 rounded-xl border border-indigo-100">
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-300 flex-shrink-0">
                    <img 
                      src="/ESTJ 모세.jpg" 
                      alt="문제 예시"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 mb-1">문제 예시:</div>
                    <div className="text-sm font-medium text-gray-800">이 분은 누구일까요?</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-center py-1.5 bg-white rounded text-xs text-gray-600 border">모세</div>
                  <div className="text-center py-1.5 bg-gray-50 rounded text-xs text-gray-500 border">다윗</div>
                  <div className="text-center py-1.5 bg-gray-50 rounded text-xs text-gray-500 border">아브라함</div>
                  <div className="text-center py-1.5 bg-gray-50 rounded text-xs text-gray-500 border">솔로몬</div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => {
                localStorage.setItem('tempResult', JSON.stringify({
                  type: resultType,
                  character: resultData?.character || '',
                  timestamp: Date.now()
                }));
                openWithCoupangAd('/game');
              }}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 px-4 rounded-2xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-[1.02] shadow-sm"
            >
              🖼️ 게임 시작하기
            </button>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="space-y-3">
          <button
            onClick={handleShare}
            className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold py-3 px-4 rounded-2xl hover:from-pink-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-[1.02] shadow-sm flex items-center justify-center space-x-2"
            disabled={copied}
          >
            <ShareIcon className="w-5 h-5" />
            <span>{copied ? '복사됨!' : '공유하기'}</span>
          </button>

          <button
            onClick={() => {
              if (completedVersion) {
                openWithCoupangAd(`https://b-mbti.money-hotissue.com/?version=${completedVersion}`);
              } else {
                onRestart();
              }
            }}
            className="w-full bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-2xl hover:from-violet-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02] shadow-sm flex items-center justify-center space-x-2"
          >
            <RestartIcon className="w-5 h-5" />
            <span>다시 테스트하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;