import React, { useState } from 'react';
import type { MbtiType, MbtiResult } from '../types';
import RestartIcon from './icons/RestartIcon';
import LoadingIndicator from './LoadingIndicator';
import ShareIcon from './icons/ShareIcon';

interface ResultScreenProps {
  resultType: MbtiType;
  resultData: MbtiResult | null;
  isGenerating: boolean;
  error: string | null;
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ resultType, resultData, isGenerating, error, onRestart }) => {
  const [copied, setCopied] = useState(false);

  if (isGenerating || !resultData) {
    // Show loading indicator while generating the image or if data is not yet available
    // This handles the main loading state and transient states between screens.
    return <LoadingIndicator />;
  }
  
  if (error && !resultData?.image) {
    return (
      <div className="p-6 md:p-10 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-red-200 w-full text-center">
        <h2 className="text-2xl font-bold text-red-700 mb-4">오류 발생</h2>
        <p className="text-stone-600 mb-6">{error}</p>
        <button
          onClick={onRestart}
          className="mt-8 bg-amber-800 text-white font-bold py-3 px-6 rounded-full hover:bg-amber-900 transition-colors duration-300 transform hover:scale-105 shadow-md flex items-center justify-center mx-auto"
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
    <div className="p-6 md:p-10 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-amber-200 w-full text-center">
      <p className="text-amber-700 font-semibold">당신의 유형은</p>
      <h1 className="text-5xl md:text-6xl font-bold font-myeongjo text-amber-900 mt-2 mb-4">
        {resultData.character}
      </h1>
      <p className="text-2xl font-bold text-stone-600 mb-6">({resultType})</p>

      {resultData.image ? (
        <img src={resultData.image} alt={resultData.character} className="w-full h-auto max-h-[400px] object-contain rounded-lg shadow-lg mb-6 bg-stone-100"/>
      ) : (
        <div className="w-full h-64 bg-stone-200 rounded-lg shadow-lg mb-6 flex items-center justify-center">
          <p className="text-stone-500">이미지를 불러오는 데 실패했습니다.</p>
        </div>
      )}

      <p className="text-stone-700 text-left leading-relaxed mb-6 whitespace-pre-wrap">
        {resultData.description}
      </p>

      <div className="bg-amber-100/70 p-4 rounded-lg border-l-4 border-amber-600 text-left">
        <p className="text-stone-800 font-myeongjo text-lg">
          "{resultData.verseText}"
        </p>
        <p className="text-right text-amber-800 font-semibold mt-2">
          - {resultData.verse}
        </p>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onRestart}
          className="bg-amber-800 text-white font-bold py-3 px-6 rounded-full hover:bg-amber-900 transition-colors duration-300 transform hover:scale-105 shadow-md flex items-center justify-center w-full sm:w-auto"
        >
          <RestartIcon className="w-5 h-5 mr-2" />
          Test Again
        </button>
        <button
          onClick={handleShare}
          className="bg-stone-600 text-white font-bold py-3 px-6 rounded-full hover:bg-stone-700 transition-colors duration-300 transform hover:scale-105 shadow-md flex items-center justify-center w-full sm:w-auto disabled:opacity-75"
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