import React, { useState } from 'react';
import type { MbtiType, MbtiResult } from '../types';
import RestartIcon from './icons/RestartIcon';
import LoadingIndicator from './LoadingIndicator';
import ShareIcon from './icons/ShareIcon';

interface ResultScreenProps {
  resultType: MbtiType;
  resultData: MbtiResult | null;
  error: string | null;
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ resultType, resultData, error, onRestart }) => {
  const [copied, setCopied] = useState(false);

  if (!resultData) {
    // Show loading indicator if data is not yet available
    return <LoadingIndicator />;
  }
  
  if (error && !resultData?.image) {
    return (
      <div className="p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-red-100 w-full max-w-md mx-auto text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-4">오류 발생</h2>
        <p className="text-gray-600 mb-6 text-sm">{error}</p>
        <button
          onClick={onRestart}
          className="mt-6 bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-2xl hover:from-violet-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02] shadow-md flex items-center justify-center mx-auto"
        >
          <RestartIcon className="w-5 h-5 mr-2" />
          Test Again
        </button>
      </div>
    );
  }

  const handleShare = async () => {
    const shareText = `저는 성경 인물 MBTI 테스트에서 '${resultData.character}(${resultType})' 유형이 나왔어요! 여러분도 한번 해보세요!`;
    const shareUrl = 'https://b-mbti.com';

    if (navigator.share) {
      try {
        await navigator.share({
          title: '성경 인물 MBTI 테스트 결과',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Share action was cancelled or failed.', err);
      }
    } else {
      // Fallback for desktop or unsupported browsers
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      } catch (err) {
        console.error('Failed to copy text: ', err);
        alert('결과를 복사하는 데 실패했습니다.');
      }
    }
  };

  const handleSaveAsImage = async () => {
    // HTML2Canvas를 사용하여 결과를 이미지로 저장하는 기능
    // 여기서는 간단히 공유 기능으로 대체
    handleShare();
  };

  const handleViewStats = () => {
    // 다른 사람들의 결과 통계 보기
    alert('📊 통계 기능은 곧 업데이트 예정입니다!');
  };

  const handleLeaveComment = () => {
    // 댓글/후기 남기기
    alert('💬 후기 기능은 곧 업데이트 예정입니다!');
  };

  return (
    <div className="p-6 bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 w-full max-w-lg mx-auto text-center relative overflow-hidden">
      {/* 결과 헤더 */}
      <div className="bg-white/90 rounded-2xl p-4 mb-6 shadow-sm border border-pink-100/50 backdrop-blur-sm">
        <div className="flex items-center justify-center mb-2">
          <span className="text-2xl mr-2">✨</span>
          <p className="text-gray-600 font-medium">당신과 닮은 성경 인물</p>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 leading-tight">
          {resultData.character}
        </h1>
        <div className="inline-flex items-center bg-gradient-to-r from-violet-500 to-pink-500 text-white px-4 py-2 rounded-full text-lg font-semibold">
          {resultType}
        </div>
      </div>

      {resultData.image ? (
        <div className="mb-6 bg-white/80 rounded-2xl p-3 shadow-sm border border-pink-100/50">
          <img 
            src={resultData.image} 
            alt={resultData.character} 
            className="w-full h-auto max-h-[300px] object-contain rounded-xl shadow-md"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-sm mb-6 flex items-center justify-center">
          <p className="text-gray-500">이미지를 불러오는 중...</p>
        </div>
      )}

      {/* 설명 텍스트 */}
      <div className="bg-white/80 rounded-2xl p-4 mb-6 shadow-sm border border-pink-100/50 text-left">
        <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
          {resultData.description}
        </p>
      </div>

      {/* 성경 구절 */}
      <div className="bg-gradient-to-r from-violet-100 to-pink-100 p-4 rounded-2xl border-l-4 border-violet-400 text-left shadow-sm mb-6">
        <p className="text-gray-800 font-medium text-sm italic leading-relaxed mb-2">
          "{resultData.verseText}"
        </p>
        <p className="text-right text-violet-600 font-semibold text-xs">
          - {resultData.verse}
        </p>
      </div>

      {/* 액션 버튼들 - MZ 스타일 */}
      <div className="space-y-3">
        {/* 메인 액션 버튼들 */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleSaveAsImage}
            className="bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-2xl hover:from-violet-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02] shadow-sm text-sm"
          >
            📸 이미지 저장
          </button>
          <button
            onClick={handleShare}
            className="bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold py-3 px-4 rounded-2xl hover:from-pink-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-[1.02] shadow-sm text-sm disabled:opacity-75"
            disabled={copied}
          >
            {copied ? '📋 복사됨!' : '🔗 공유하기'}
          </button>
        </div>

        {/* 서브 액션 버튼들 */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleViewStats}
            className="bg-white/80 text-gray-600 font-medium py-3 px-4 rounded-2xl hover:bg-white hover:text-gray-800 transition-all duration-200 shadow-sm border border-gray-200/50 text-sm"
          >
            📊 통계 보기
          </button>
          <button
            onClick={handleLeaveComment}
            className="bg-white/80 text-gray-600 font-medium py-3 px-4 rounded-2xl hover:bg-white hover:text-gray-800 transition-all duration-200 shadow-sm border border-gray-200/50 text-sm"
          >
            💬 후기 남기기
          </button>
        </div>

        {/* 다시 테스트 버튼 */}
        <button
          onClick={onRestart}
          className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold py-4 px-6 rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-[1.02] shadow-sm flex items-center justify-center"
        >
          <RestartIcon className="w-4 h-4 mr-2" />
          🔄 다시 테스트하기
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

export default ResultScreen;