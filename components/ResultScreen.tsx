import React, { useState } from 'react';
import type { MbtiType, MbtiResult } from '../types';
import { RESULTS } from '../constants';
import RestartIcon from './icons/RestartIcon';
import LoadingIndicator from './LoadingIndicator';
import ShareIcon from './icons/ShareIcon';
import AdBanner from './AdBanner';

interface ResultScreenProps {
  resultType: MbtiType;
  resultData: MbtiResult | null;
  error: string | null;
  onRestart: () => void;
}

// 16가지 MBTI 유형과 대응하는 성경인물들
const ALL_CHARACTERS = Object.keys(RESULTS) as MbtiType[];

const ResultScreen: React.FC<ResultScreenProps> = ({ resultType, resultData, error, onRestart }) => {
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showOtherCharacters, setShowOtherCharacters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');

  // 가짜 통계 데이터 (실제 서비스에서는 DB에서 가져옴)
  const fakeStats = {
    [resultType]: Math.floor(Math.random() * 25) + 10,
    total: 1247,
    others: ALL_CHARACTERS.filter(type => type !== resultType).map(type => ({
      type,
      character: RESULTS[type].character,
      percentage: Math.floor(Math.random() * 15) + 2
    })).sort((a, b) => b.percentage - a.percentage)
  };

  // 가짜 댓글 데이터
  const fakeComments = [
    { id: 1, user: "은혜님", comment: "완전 저네요!! 대박 신기해요 ㅋㅋ", likes: 23 },
    { id: 2, user: "믿음이", comment: "와 진짜 정확하다... 소름", likes: 18 },
    { id: 3, user: "소망♡", comment: "친구들이랑 다 해봤는데 다 맞아요!", likes: 12 },
    { id: 4, user: "평강", comment: `${resultData?.character} 완전 멋져요!! 저도 닮고 싶어요`, likes: 8 }
  ];

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

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleSNSShare = (platform: string) => {
    const shareText = `🙏 성경인물 MBTI 테스트 결과 🙏\n\n저는 '${resultData?.character}(${resultType})' 유형이에요!\n\n${resultData?.description.slice(0, 50)}...\n\n여러분도 테스트해보세요!`;
    const shareUrl = 'https://gowith153.com';
    
    const urls = {
      kakao: `https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      instagram: `https://www.instagram.com/`, // 인스타그램은 직접 공유 불가하므로 앱으로 이동
      copy: 'copy'
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        setShowShareModal(false);
      });
    } else {
      window.open(urls[platform as keyof typeof urls], '_blank');
      setShowShareModal(false);
    }
  };

  const handleSaveAsImage = () => {
    // 임시로 공유 모달 열기 (실제로는 html2canvas 사용)
    alert('📸 이미지 저장 기능은 곧 업데이트됩니다!\n현재는 공유 기능을 이용해 주세요.');
    setShowShareModal(true);
  };

  const handleViewStats = () => {
    setShowStats(true);
  };

  const handleLeaveComment = () => {
    setShowComments(true);
  };

  const handleSubmitComment = () => {
    if (comment.trim()) {
      alert('💬 댓글이 등록되었습니다! (실제 서비스에서는 DB에 저장됩니다)');
      setComment('');
      setShowComments(false);
    }
  };

  const handleViewOtherCharacters = () => {
    setShowOtherCharacters(true);
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
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleViewStats}
            className="bg-white/80 text-gray-600 font-medium py-3 px-3 rounded-2xl hover:bg-white hover:text-gray-800 transition-all duration-200 shadow-sm border border-gray-200/50 text-xs"
          >
            📊 통계
          </button>
          <button
            onClick={handleLeaveComment}
            className="bg-white/80 text-gray-600 font-medium py-3 px-3 rounded-2xl hover:bg-white hover:text-gray-800 transition-all duration-200 shadow-sm border border-gray-200/50 text-xs"
          >
            💬 후기
          </button>
          <button
            onClick={handleViewOtherCharacters}
            className="bg-white/80 text-gray-600 font-medium py-3 px-3 rounded-2xl hover:bg-white hover:text-gray-800 transition-all duration-200 shadow-sm border border-gray-200/50 text-xs"
          >
            👥 다른인물
          </button>
        </div>

        {/* 광고 배너 */}
        <div className="my-6">
          <AdBanner 
            slot="2689008677"
            className="rounded-2xl overflow-hidden"
            style={{ minHeight: '120px' }}
          />
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

      {/* SNS 공유 모달 */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-center mb-4">📤 결과 공유하기</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button onClick={() => handleSNSShare('kakao')} className="flex items-center justify-center p-3 bg-yellow-400 text-gray-800 rounded-2xl font-semibold">
                💬 카카오톡
              </button>
              <button onClick={() => handleSNSShare('instagram')} className="flex items-center justify-center p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold">
                📸 인스타
              </button>
              <button onClick={() => handleSNSShare('facebook')} className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-2xl font-semibold">
                👥 페이스북
              </button>
              <button onClick={() => handleSNSShare('twitter')} className="flex items-center justify-center p-3 bg-sky-400 text-white rounded-2xl font-semibold">
                🐦 트위터
              </button>
            </div>
            <button onClick={() => handleSNSShare('copy')} className="w-full p-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold mb-3">
              📋 링크 복사
            </button>
            <button onClick={() => setShowShareModal(false)} className="w-full p-3 text-gray-500 text-sm">
              취소
            </button>
          </div>
        </div>
      )}

      {/* 통계 보기 모달 */}
      {showStats && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl max-h-96 overflow-y-auto">
            <h3 className="text-lg font-bold text-center mb-4">📊 테스트 통계</h3>
            <div className="mb-4 p-4 bg-gradient-to-r from-violet-100 to-pink-100 rounded-2xl">
              <p className="text-center font-semibold text-gray-800">전체 참여자: {fakeStats.total}명</p>
              <p className="text-center text-sm text-gray-600 mt-1">당신과 같은 유형: {fakeStats[resultType]}%</p>
            </div>
            <div className="space-y-2">
              {fakeStats.others.slice(0, 5).map((item) => (
                <div key={item.type} className="flex justify-between items-center p-2 bg-gray-50 rounded-xl">
                  <span className="text-sm font-medium">{item.character}</span>
                  <span className="text-sm text-gray-600">{item.percentage}%</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowStats(false)} className="w-full mt-4 p-3 text-gray-500 text-sm">
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 후기 남기기 모달 */}
      {showComments && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl max-h-96 overflow-y-auto">
            <h3 className="text-lg font-bold text-center mb-4">💬 후기 남기기</h3>
            <div className="mb-4 space-y-3">
              {fakeComments.map((c) => (
                <div key={c.id} className="p-3 bg-gray-50 rounded-2xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-gray-800">{c.user}</span>
                    <span className="text-xs text-gray-500">❤️ {c.likes}</span>
                  </div>
                  <p className="text-sm text-gray-700">{c.comment}</p>
                </div>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="테스트 결과는 어떠셨나요?"
              className="w-full p-3 border border-gray-200 rounded-2xl text-sm resize-none h-20"
            />
            <div className="flex gap-2 mt-3">
              <button onClick={handleSubmitComment} className="flex-1 p-3 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-2xl font-semibold text-sm">
                등록
              </button>
              <button onClick={() => setShowComments(false)} className="px-4 p-3 text-gray-500 text-sm">
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 다른 성경인물 보기 모달 */}
      {showOtherCharacters && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl max-h-96 overflow-y-auto">
            <h3 className="text-lg font-bold text-center mb-4">👥 다른 성경인물들</h3>
            <div className="grid grid-cols-2 gap-3">
              {ALL_CHARACTERS.filter(type => type !== resultType).slice(0, 8).map((type) => (
                <div key={type} className="p-3 bg-gray-50 rounded-2xl text-center">
                  <div className="text-xs font-semibold text-gray-600 mb-1">{type}</div>
                  <div className="font-bold text-gray-800 text-sm">{RESULTS[type].character}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowOtherCharacters(false)} className="w-full mt-4 p-3 text-gray-500 text-sm">
              닫기
            </button>
          </div>
        </div>
      )}

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