import React, { useState } from 'react';
import type { MbtiType, MbtiResult } from '../types';
import { RESULTS } from '../constants';
import RestartIcon from './icons/RestartIcon';
import LoadingIndicator from './LoadingIndicator';
import ShareIcon from './icons/ShareIcon';

interface ResultScreenProps {
  resultType: MbtiType;
  resultData: MbtiResult | null;
  error: string | null;
  onRestart: () => void;
}

// 16가지 MBTI 유형과 대응하는 성경인물들
const ALL_CHARACTERS = Object.keys(RESULTS) as MbtiType[];

// 어울리는 성격 유형 추천 로직
const getCompatibleTypes = (currentType: MbtiType): MbtiType[] => {
  // 각 유형별로 어울리는 유형들을 정의 (심리학적 호환성 기반)
  const compatibilityMap: Record<MbtiType, MbtiType[]> = {
    'ENFP': ['INFJ', 'INTJ', 'ENFJ', 'INFP'],
    'ENFJ': ['INFP', 'ISFP', 'ENFP', 'INFJ'],
    'ENTP': ['INFJ', 'INTJ', 'ENFJ', 'INFP'],
    'ENTJ': ['INFP', 'ISFP', 'ENFP', 'INFJ'],
    'ESFP': ['ISFJ', 'ISTJ', 'ESFJ', 'ISFP'],
    'ESFJ': ['ISFP', 'ISTP', 'ESFP', 'ISFJ'],
    'ESTP': ['ISFJ', 'ISTJ', 'ESFJ', 'ISFP'],
    'ESTJ': ['ISFP', 'ISTP', 'ESFP', 'ISFJ'],
    'INFP': ['ENFJ', 'ENTJ', 'ENFP', 'INFJ'],
    'INFJ': ['ENFP', 'ENTP', 'ENFJ', 'INFP'],
    'INTP': ['ENFJ', 'ENTJ', 'ENFP', 'INFJ'],
    'INTJ': ['ENFP', 'ENTP', 'ENFJ', 'INFP'],
    'ISFP': ['ESFJ', 'ESTJ', 'ESFP', 'ISFJ'],
    'ISFJ': ['ESFP', 'ESTP', 'ESFJ', 'ISFP'],
    'ISTP': ['ESFJ', 'ESTJ', 'ESFP', 'ISFJ'],
    'ISTJ': ['ESFP', 'ESTP', 'ESFJ', 'ISFP']
  };
  
  return compatibilityMap[currentType] || [];
};

const ResultScreen: React.FC<ResultScreenProps> = ({ resultType, resultData, error, onRestart }) => {
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showOtherCharacters, setShowOtherCharacters] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  
  // 퀴즈 게임 상태
  const [quizCharacter, setQuizCharacter] = useState<string>('');
  const [userGuess, setUserGuess] = useState('');
  const [quizResult, setQuizResult] = useState<'correct' | 'wrong' | null>(null);
  const [currentQuizType, setCurrentQuizType] = useState<string>('');

  // 퀴즈를 위한 랜덤 캐릭터 선택
  const getRandomCharacter = () => {
    const randomType = ALL_CHARACTERS[Math.floor(Math.random() * ALL_CHARACTERS.length)];
    setCurrentQuizType(randomType);
    setQuizCharacter(RESULTS[randomType].character);
    setUserGuess('');
    setQuizResult(null);
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

  const handleSaveAsImage = async () => {
    try {
      const element = document.querySelector('.result-container') as HTMLElement;
      if (!element) {
        alert('🚨 이미지를 생성할 수 없습니다.');
        return;
      }

      // 동적으로 html2canvas 로드
      const html2canvas = await import('html2canvas');
      const canvas = await html2canvas.default(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: element.offsetWidth,
        height: element.offsetHeight
      });

      // 이미지 다운로드
      const link = document.createElement('a');
      link.download = `성경인물-MBTI-${resultType}-${resultData?.character}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert('📸 이미지가 저장되었습니다!');
    } catch (error) {
      console.error('이미지 저장 실패:', error);
      alert('📸 이미지 저장에 실패했습니다. 공유 기능을 이용해 주세요.');
      setShowShareModal(true);
    }
  };

  const handleViewOtherCharacters = () => {
    getRandomCharacter();
    setShowOtherCharacters(true);
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
  
  const checkQuizAnswer = () => {
    if (userGuess.trim() === '') return;
    
    const isCorrect = userGuess.toLowerCase().trim() === quizCharacter.toLowerCase().trim();
    setQuizResult(isCorrect ? 'correct' : 'wrong');
  };
  
  const selectCharacterFromCandidates = (character: string) => {
    setUserGuess(character);
    const isCorrect = character.toLowerCase().trim() === quizCharacter.toLowerCase().trim();
    setQuizResult(isCorrect ? 'correct' : 'wrong');
  };

  return (
    <div className="result-container p-6 bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 w-full max-w-lg mx-auto text-center relative overflow-hidden">
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
            onClick={handleLeaveComment}
            className="bg-white/80 text-gray-600 font-medium py-3 px-3 rounded-2xl hover:bg-white hover:text-gray-800 transition-all duration-200 shadow-sm border border-gray-200/50 text-sm"
          >
            💬 후기 남기기
          </button>
          <button
            onClick={handleViewOtherCharacters}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-3 px-3 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-sm text-sm"
          >
            🎮 인물 퀴즈
          </button>
        </div>

        {/* 어울리는 성격 유형 섹션 */}
        <div className="mb-6 bg-white/80 rounded-2xl p-4 shadow-sm border border-orange-100/50">
          <div className="flex items-center justify-center mb-4">
            <span className="text-xl mr-2">💝</span>
            <h3 className="text-lg font-bold text-gray-800">어울리는 성격 유형</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {getCompatibleTypes(resultType).map((compatibleType) => (
              <div 
                key={compatibleType}
                className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl p-3 border border-pink-100/50 hover:shadow-md transition-all duration-200"
              >
                <div className="text-center">
                  <div className="text-xs font-semibold text-pink-600 mb-1">{compatibleType}</div>
                  <div className="font-bold text-gray-800 text-sm mb-2">{RESULTS[compatibleType].character}</div>
                  <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-pink-200 to-orange-200 rounded-full flex items-center justify-center">
                    <span className="text-lg">👥</span>
                  </div>
                  <div className="text-xs text-gray-600 leading-tight">
                    {RESULTS[compatibleType].character}와 잘 맞아요!
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-gradient-to-r from-pink-100 to-orange-100 rounded-xl">
            <p className="text-xs text-gray-600 text-center">
              💡 MBTI 심리학을 바탕으로 선정된 호환성 높은 성격 유형들입니다
            </p>
          </div>
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

      {/* 성경인물 퀴즈 게임 모달 */}
      {showOtherCharacters && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-center mb-4">🎮 성경인물 맞히기 게임</h3>
            
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 mb-4">
                <p className="text-sm text-gray-700 mb-2">
                  🔥 <strong>도전!</strong> 이미지를 보고 성경인물을 맞춰보세요!
                </p>
                <p className="text-xs text-gray-500">
                  정답을 모르겠다면 아래 후보 중에서 선택해보세요 ⬇️
                </p>
              </div>
              
              {/* 캐릭터 이미지 */}
              <div className="mb-4 bg-gradient-to-br from-violet-50 to-pink-50 rounded-2xl p-4">
                <div className="w-32 h-32 mx-auto mb-3 bg-white rounded-xl shadow-md flex items-center justify-center overflow-hidden">
                  {currentQuizType && (
                    <img 
                      src={`/${currentQuizType === 'ENFJ' ? 'ENJS 느헤미야' : 
                           currentQuizType === 'ENTP' ? 'ENFP 아브라함' : 
                           `${currentQuizType} ${RESULTS[currentQuizType as keyof typeof RESULTS].character}`}.jpg`}
                      alt="성경인물"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/ENFP 아브라함.jpg';
                      }}
                    />
                  )}
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">이 분은 누구일까요? 🤔</h4>
                
                {/* 주관식 입력 */}
                <input
                  type="text"
                  value={userGuess}
                  onChange={(e) => setUserGuess(e.target.value)}
                  placeholder="성경인물 이름을 입력하세요"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl text-center font-medium focus:border-purple-400 focus:outline-none"
                  disabled={quizResult !== null}
                />
                
                {quizResult && (
                  <div className={`mt-3 p-3 rounded-xl ${quizResult === 'correct' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'}`}>
                    {quizResult === 'correct' 
                      ? `🎉 정답입니다! ${quizCharacter}님이 맞네요!` 
                      : `😅 아쉬워요! 정답은 ${quizCharacter}입니다.`}
                  </div>
                )}
              </div>
            </div>

            {/* 16명 후보 선택지 */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-600 mb-3 text-center">
                💡 힌트: 아래 후보 중에서 선택하세요!
              </h4>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {ALL_CHARACTERS.map((type) => (
                  <button
                    key={type}
                    onClick={() => selectCharacterFromCandidates(RESULTS[type].character)}
                    disabled={quizResult !== null}
                    className={`p-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                      quizResult !== null && RESULTS[type].character === quizCharacter
                        ? 'bg-green-200 text-green-800'
                        : quizResult === null
                        ? 'bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700'
                        : 'bg-gray-50 text-gray-400'
                    }`}
                  >
                    <div className="font-bold">{RESULTS[type].character}</div>
                    <div className="text-xs opacity-70">{type}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 게임 액션 버튼 */}
            <div className="flex gap-2">
              {quizResult === null ? (
                <button 
                  onClick={checkQuizAnswer}
                  className="flex-1 p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold"
                >
                  ✅ 답안 제출
                </button>
              ) : (
                <button 
                  onClick={getRandomCharacter}
                  className="flex-1 p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-semibold"
                >
                  🎮 다시 도전
                </button>
              )}
              <button 
                onClick={() => setShowOtherCharacters(false)} 
                className="px-6 p-3 text-gray-500 text-sm hover:bg-gray-100 rounded-2xl"
              >
                닫기
              </button>
            </div>
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