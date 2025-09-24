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

  return (
    <div className="p-6 md:p-10 bg-gradient-to-br from-amber-50 to-orange-100 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-amber-300/50 w-full text-center relative overflow-hidden">
      {/* 장식적 배경 요소 */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"></div>
      
      <div className="bg-white/70 rounded-xl p-4 mb-6 border border-amber-200/70">
        <p className="text-amber-800 font-semibold text-lg">당신의 성경 인물 유형은</p>
        <h1 className="text-4xl md:text-5xl font-bold font-myeongjo text-amber-900 mt-2 mb-2 leading-tight">
          {resultData.character}
        </h1>
        <p className="text-xl font-bold text-orange-700 bg-white/80 rounded-lg px-4 py-2 inline-block border border-amber-200">
          {resultType}
        </p>
      </div>

      {resultData.image ? (
        <div className="mb-6 bg-white/60 rounded-xl p-4 border border-amber-200/70">
          <img 
            src={resultData.image} 
            alt={resultData.character} 
            className="w-full h-auto max-h-[400px] object-contain rounded-xl shadow-lg bg-white/90 border-2 border-amber-200"
          />
        </div>
      ) : (
        <div className="w-full h-64 bg-amber-100 rounded-xl shadow-lg mb-6 flex items-center justify-center border-2 border-amber-200">
          <p className="text-amber-700">이미지를 불러오는 데 실패했습니다.</p>
        </div>
      )}

      <div className="bg-white/70 rounded-xl p-5 mb-6 border border-amber-200/70 shadow-inner">
        <p className="text-stone-700 text-left leading-relaxed whitespace-pre-wrap font-medium">
          {resultData.description}
        </p>
      </div>

      <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-5 rounded-xl border-l-4 border-amber-600 text-left shadow-inner mb-8">
        <p className="text-stone-800 font-myeongjo text-lg italic leading-relaxed">
          "{resultData.verseText}"
        </p>
        <p className="text-right text-amber-800 font-bold mt-3 text-sm">
          - {resultData.verse}
        </p>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onRestart}
          className="bg-gradient-to-r from-amber-700 to-orange-700 text-white font-bold py-4 px-8 rounded-full hover:from-amber-800 hover:to-orange-800 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center w-full sm:w-auto border-2 border-amber-600/30"
        >
          <RestartIcon className="w-5 h-5 mr-2" />
          다시 테스트하기
        </button>
        <button
          onClick={handleShare}
          className="bg-gradient-to-r from-stone-600 to-stone-700 text-white font-bold py-4 px-8 rounded-full hover:from-stone-700 hover:to-stone-800 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center w-full sm:w-auto disabled:opacity-75 border-2 border-stone-500/30"
          disabled={copied}
        >
          <ShareIcon className="w-5 h-5 mr-2" />
          {copied ? '복사되었어요!' : '결과 공유하기'}
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;