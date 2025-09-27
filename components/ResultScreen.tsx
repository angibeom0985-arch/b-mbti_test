import React, { useState } from 'react';
import type { MbtiType, MbtiResult } from '../types';
import { RESULTS, TEST_VERSIONS } from '../constants';
import RestartIcon from './icons/RestartIcon';
import LoadingIndicator from './LoadingIndicator';
import ShareIcon from './icons/ShareIcon';

interface ResultScreenProps {
  resultType: MbtiType;
  resultData: MbtiResult | null;
  error: string | null;
  onRestart: () => void;
  completedVersion?: number;
  onQuizGame?: () => void;
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

// 호환성 이유 설명
const getCompatibilityReason = (currentType: MbtiType, targetType: MbtiType): string => {
  const reasons: Record<string, string> = {
    'ENFP-INFJ': '서로의 직관과 감정을 깊이 이해하며, 영적 교감이 뛰어납니다',
    'ENFP-INTJ': '창의적 아이디어와 체계적 실행력이 완벽하게 조화를 이룹니다',
    'ENFJ-INFP': '서로의 가치관을 존중하며 따뜻한 관계를 형성합니다',
    'ENTP-INFJ': '혁신적 사고와 깊은 통찰력이 만나 시너지를 창출합니다',
    'ENTJ-INFP': '리더십과 창의성이 만나 균형 잡힌 협력을 보여줍니다',
    'ESFP-ISFJ': '활발함과 배려심이 조화롭게 어우러져 즐거운 관계를 만듭니다',
    'ESFJ-ISFP': '따뜻한 마음과 예술적 감성이 아름답게 융합됩니다',
    'ESTP-ISFJ': '행동력과 세심함이 서로의 부족함을 채워줍니다',
    'ESTJ-ISFP': '체계성과 유연성이 만나 실용적 협력을 이룹니다',
    'INFP-ENFJ': '내면의 가치와 따뜻한 리더십이 서로를 성장시킵니다',
    'INFJ-ENFP': '깊은 통찰력과 밝은 에너지가 완벽한 조화를 이룹니다',
    'INTP-ENFJ': '논리적 사고와 인간적 따뜻함이 균형을 맞춥니다',
    'INTJ-ENFP': '전략적 사고와 창의적 영감이 시너지를 발휘합니다',
    'ISFP-ESFJ': '예술적 감성과 사회적 배려가 아름답게 어우러집니다',
    'ISFJ-ESFP': '안정감과 활력이 서로를 보완하며 조화를 이룹니다',
    'ISTP-ESFJ': '실용적 기술과 따뜻한 배려가 실생활에서 큰 도움이 됩니다',
    'ISTJ-ESFP': '체계적 계획과 즉흥적 활력이 균형잡힌 관계를 만듭니다'
  };
  
  const key = `${currentType}-${targetType}`;
  return reasons[key] || '서로 다른 강점이 조화롭게 어우러져 좋은 관계를 형성합니다';
};

// 어울리지 않는 성격 유형 (충돌하기 쉬운 유형)
const getIncompatibleTypes = (currentType: MbtiType): MbtiType[] => {
  const incompatibilityMap: Record<MbtiType, MbtiType[]> = {
    'ENFP': ['ISTJ', 'ISTP', 'ESTJ', 'ESTP'],
    'ENFJ': ['ISTP', 'INTP', 'ESTP', 'ENTP'],
    'ENTP': ['ISFJ', 'ISTJ', 'ESFJ', 'ESTJ'],
    'ENTJ': ['ISFJ', 'ISFP', 'ESFJ', 'ESFP'],
    'ESFP': ['INTJ', 'INTP', 'ENTJ', 'ENTP'],
    'ESFJ': ['INTP', 'ENTP', 'INTJ', 'ENTJ'],
    'ESTP': ['INFJ', 'INFP', 'ENFJ', 'ENFP'],
    'ESTJ': ['INFP', 'ENFP', 'INFJ', 'ENFJ'],
    'INFP': ['ESTJ', 'ENTJ', 'ESTP', 'ENTP'],
    'INFJ': ['ESTP', 'ESFP', 'ESTJ', 'ESFJ'],
    'INTP': ['ESFJ', 'ESFP', 'ESTJ', 'ESTP'],
    'INTJ': ['ESFP', 'ESTP', 'ESFJ', 'ESTJ'],
    'ISFP': ['ENTJ', 'ENTP', 'ESTJ', 'ESTP'],
    'ISFJ': ['ENTP', 'ENTJ', 'ESTP', 'ESTJ'],
    'ISTP': ['ENFJ', 'ESFJ', 'ENFP', 'ESFP'],
    'ISTJ': ['ENFP', 'ESFP', 'ENTP', 'ESTP']
  };
  
  return incompatibilityMap[currentType] || [];
};

// 비호환성 이유 설명
const getIncompatibilityReason = (currentType: MbtiType, targetType: MbtiType): string => {
  const reasons: Record<string, string> = {
    'ENFP-ISTJ': '자유로운 창의성과 체계적 계획성이 충돌할 수 있어 소통에 노력이 필요합니다',
    'ENFP-ISTP': '감정표현 방식과 실용적 접근의 차이로 오해가 생길 수 있습니다',
    'ENFJ-ISTP': '따뜻한 감정 표현과 차분한 성향의 차이가 거리감을 만들 수 있습니다',
    'ENTP-ISFJ': '혁신적 변화 추구와 안정 선호로 인해 갈등이 생길 수 있습니다',
    'ENTJ-ISFJ': '목표 지향적 추진력과 안정 추구로 인한 충돌 가능성이 있습니다',
    'ESFP-INTJ': '즉흥적 활력과 신중한 계획성이 서로 답답함을 느낄 수 있습니다',
    'ESFJ-INTP': '감정적 배려와 논리적 분석 방식의 차이로 오해가 생길 수 있습니다',
    'ESTP-INFJ': '행동 중심적 성향과 신중한 성찰의 차이가 갈등을 만들 수 있습니다',
    'ESTJ-INFP': '체계적 통제와 개인적 자유 추구로 인한 마찰이 있을 수 있습니다',
    'INFP-ESTJ': '개인적 가치와 객관적 효율성 추구의 차이로 충돌할 수 있습니다',
    'INFJ-ESTP': '깊은 성찰과 즉흥적 행동의 차이가 서로를 이해하기 어렵게 만듭니다',
    'INTP-ESFJ': '논리적 분석과 감정적 배려의 차이로 소통에 어려움이 있을 수 있습니다',
    'INTJ-ESFP': '장기적 계획과 순간적 즐거움 추구의 차이가 갈등을 만들 수 있습니다',
    'ISFP-ENTJ': '개인적 가치와 목표 달성 중심 사고의 차이로 마찰이 생길 수 있습니다',
    'ISFJ-ENTP': '안정 추구와 변화 선호의 차이로 인해 스트레스를 받을 수 있습니다',
    'ISTP-ENFJ': '독립적 성향과 사회적 관계 중시의 차이가 거리감을 만들 수 있습니다',
    'ISTJ-ENFP': '체계적 질서와 자유로운 창의성이 서로 제약으로 느껴질 수 있습니다'
  };
  
  const key = `${currentType}-${targetType}`;
  return reasons[key] || '서로 다른 성향으로 인해 이해하는 데 더 많은 노력이 필요할 수 있습니다';
};

// MBTI 유형별 이미지 파일 매핑 함수
const getMbtiImage = (type: MbtiType): string => {
  const imageMap: Record<MbtiType, string> = {
    'ENFP': '/ENFP 아브라함.jpg',
    'ENFJ': '/ENJS 느헤미야.jpg',
    'ENTJ': '/ENTJ 드보라.jpg',
    'ENTP': '/ENFP 아브라함.jpg', // ENTP 파일이 없어서 임시로 ENFP 사용
    'ESFJ': '/ESFJ 막달라 마리아.jpg',
    'ESFP': '/ESFP 에스더.jpg',
    'ESTJ': '/ESTJ 모세.jpg',
    'ESTP': '/ESTP 베드로.jpg',
    'INFJ': '/INFJ 다니엘.jpg',
    'INFP': '/INFP 마리아.jpg',
    'INTJ': '/INTJ 바울.jpg',
    'INTP': '/INTP 솔로몬.jpg',
    'ISFJ': '/ISFJ 룻.jpg',
    'ISFP': '/ISFP 다윗.jpg',
    'ISTJ': '/ISTJ 요셉.jpg',
    'ISTP': '/ISTP 삼손.jpg'
  };
  
  return imageMap[type] || '/ENFP 아브라함.jpg';
};

const ResultScreen: React.FC<ResultScreenProps> = ({ 
  resultType, 
  resultData, 
  error, 
  onRestart,
  completedVersion = 1,
  onQuizGame
}) => {
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showOtherCharacters, setShowOtherCharacters] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [selectedTestVersion, setSelectedTestVersion] = useState<number | null>(null);
  const [enlargedImage, setEnlargedImage] = useState<{ src: string; character: string } | null>(null);
  
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
      // 이미지로 저장할 부분만 선택
      const captureElement = document.querySelector('.image-capture-area');
      if (!captureElement) {
        alert('결과 화면을 찾을 수 없습니다.');
        return;
      }

      // 동적으로 html2canvas 라이브러리 로드
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
      document.head.appendChild(script);

      script.onload = async () => {
        try {
          // @ts-ignore - html2canvas는 전역 변수로 로드됨
          const canvas = await html2canvas(captureElement, {
            backgroundColor: '#ffffff',
            scale: 3, // 고화질을 위해 scale 증가
            useCORS: true,
            allowTaint: true,
            foreignObjectRendering: false,
            logging: false,
            width: captureElement.scrollWidth,
            height: captureElement.scrollHeight,
            windowWidth: captureElement.scrollWidth,
            windowHeight: captureElement.scrollHeight
          });

          // 캔버스를 이미지로 변환
          const dataURL = canvas.toDataURL('image/png', 1.0);
          
          // 다운로드 링크 생성
          const link = document.createElement('a');
          link.download = `성경인물-MBTI-${resultType}-${resultData?.character}.png`;
          link.href = dataURL;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // 이미지 저장 완료 후 쿠팡 링크 열기
          setTimeout(() => {
            const characterName = resultData?.character || '';
            const coupangUrl = `https://www.coupang.com/np/search?component=&q=${encodeURIComponent(characterName)}&traceId=mg2blw6m&channel=user`;
            window.open(coupangUrl, '_blank');
          }, 500);
          
        } catch (error) {
          console.error('이미지 저장 실패:', error);
          alert('이미지 저장에 실패했습니다. 스크린샷을 이용해주세요.');
        }
      };

      script.onerror = () => {
        alert('이미지 저장 라이브러리 로드에 실패했습니다.');
      };

    } catch (error) {
      console.error('이미지 저장 중 오류:', error);
      alert('이미지 저장 중 오류가 발생했습니다.');
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
    if (!userGuess || userGuess.trim() === '') return;
    
    const isCorrect = userGuess.toLowerCase().trim() === quizCharacter.toLowerCase().trim();
    setQuizResult(isCorrect ? 'correct' : 'wrong');
  };
  
  const selectCharacterFromCandidates = (character: string) => {
    if (quizResult !== null) return; // 이미 답안 제출된 경우 선택 불가
    setUserGuess(character);
  };

  return (
    <div className="result-container p-6 bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 w-full max-w-lg mx-auto text-center relative overflow-hidden">
      
      {/* 이미지 캡처 영역 시작 */}
      <div className="image-capture-area">
      
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
        
        {/* 완료한 버전 정보 */}
        <div className="mt-3 pt-3 border-t border-gray-200/50">
          <div className="inline-flex items-center bg-white/90 rounded-full px-3 py-1 text-sm">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              completedVersion === 1 ? 'bg-orange-400' :
              completedVersion === 2 ? 'bg-purple-400' :
              'bg-blue-400'
            }`}></div>
            <span className="text-gray-700 font-medium">
              {TEST_VERSIONS[completedVersion as keyof typeof TEST_VERSIONS]?.name || '기본 테스트'} 완료
            </span>
            <span className="ml-2">✓</span>
          </div>
        </div>
      </div>

      {resultData.image ? (
        <div className="mb-6 flex justify-center">
          <div className="w-48 h-48 bg-white/80 rounded-2xl p-3 shadow-sm border border-pink-100/50 overflow-hidden">
            <img 
              src={resultData.image} 
              alt={resultData.character} 
              className="w-full h-full object-cover rounded-xl shadow-md"
              style={{
                imageRendering: 'crisp-edges'
              }}
            />
          </div>
        </div>
      ) : (
        <div className="mb-6 flex justify-center">
          <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-sm flex items-center justify-center">
            <p className="text-gray-500 text-sm">이미지 로딩중...</p>
          </div>
        </div>
      )}

      {/* 설명 텍스트 - 가독성 개선 */}
      <div className="bg-white/90 rounded-2xl p-5 mb-6 shadow-sm border border-pink-100/50">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <span className="bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent mr-2">✨</span>
          성격 특징
        </h3>
        <div className="space-y-3">
          {(() => {
            // 설명을 5개 문장으로 분할
            const sentences = resultData.description.split('.').filter(sentence => sentence.trim());
            const targetSentences = sentences.slice(0, 5); // 최대 5개까지만
            while (targetSentences.length < 5 && sentences.length > 0) {
              // 문장이 5개 미만이면 기본 특성 추가
              const additionalTraits = [
                '깊은 사색과 성찰을 통해 지혜를 얻습니다',
                '다른 사람들에게 선한 영향력을 끼칩니다',
                '어려운 상황에서도 희망을 잃지 않습니다',
                '진실한 마음으로 관계를 맺습니다',
                '하나님의 뜻을 구하며 살아갑니다'
              ];
              const additionalIndex = targetSentences.length;
              if (additionalIndex < additionalTraits.length) {
                targetSentences.push(additionalTraits[additionalIndex]);
              } else {
                break;
              }
            }
            
            return targetSentences.map((sentence, index) => (
              <div key={index} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-violet-400 to-pink-400 text-white text-xs rounded-full flex items-center justify-center font-semibold mt-0.5">
                  {index + 1}
                </span>
                <p className="text-gray-700 text-sm leading-relaxed text-left">
                  {sentence.trim()}{sentence.includes('.') ? '' : '.'}
                </p>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* 성경 구절 - 간소화된 디자인 */}
      <div className="bg-gradient-to-r from-violet-100 to-pink-100 p-4 rounded-2xl border-l-4 border-violet-400 shadow-sm mb-6 text-center">
        <h4 className="text-violet-800 font-bold text-sm mb-2 flex items-center justify-center">
          📖 대표 성경구절 ({resultData.verse})
        </h4>
        <blockquote className="text-gray-800 font-medium text-sm leading-relaxed italic">
          "{resultData.verseText}"
        </blockquote>
      </div>

      {/* 액션 버튼들 - MZ 스타일 */}
      <div className="space-y-3">
        {/* 메인 액션 버튼들 - 세로 배치 */}
        <div className="space-y-3">
          <button
            onClick={handleSaveAsImage}
            className="w-full bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-2xl hover:from-violet-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02] shadow-sm text-sm"
          >
            📸 이미지 저장
          </button>
          <button
            onClick={handleShare}
            className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold py-3 px-4 rounded-2xl hover:from-pink-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-[1.02] shadow-sm text-sm disabled:opacity-75"
            disabled={copied}
          >
            {copied ? '📋 복사됨!' : '🔗 공유하기'}
          </button>
        </div>
      </div>

      {/* 어울리는/어울리지 않는 성격 유형 섹션 */}
      <div className="mb-6 space-y-4 mt-6">
          {/* 어울리는 성격 유형 */}
          <div className="bg-white/80 rounded-2xl p-4 shadow-sm border border-green-100/50">
            <div className="flex items-center justify-center mb-4">
              <span className="text-xl mr-2">💝</span>
              <h3 className="text-lg font-bold text-green-800">어울리는 성격 유형</h3>
            </div>
            {(() => {
              const compatibleType = getCompatibleTypes(resultType)[0];
              if (!compatibleType) return null;
              return (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100/50">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 flex-shrink-0 relative cursor-pointer group">
                      <img 
                        src={getMbtiImage(compatibleType)} 
                        alt={RESULTS[compatibleType].character}
                        className="w-full h-full object-cover rounded-lg shadow-sm transition-transform group-hover:scale-105"
                        onClick={() => setEnlargedImage({
                          src: getMbtiImage(compatibleType),
                          character: RESULTS[compatibleType].character
                        })}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs text-center py-0.5 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        크게보기
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full mr-2">
                          {compatibleType}
                        </span>
                        <span className="font-bold text-green-800 text-lg">
                          {RESULTS[compatibleType].character}
                        </span>
                        <span className="text-green-600 text-lg ml-2">💚</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed text-left">
                        {getCompatibilityReason(resultType, compatibleType)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* 어울리지 않는 성격 유형 */}
          <div className="bg-white/80 rounded-2xl p-4 shadow-sm border border-red-100/50">
            <div className="flex items-center justify-center mb-4">
              <span className="text-xl mr-2">⚠️</span>
              <h3 className="text-lg font-bold text-red-800">주의해야 할 성격 유형</h3>
            </div>
            {(() => {
              const incompatibleType = getIncompatibleTypes(resultType)[0];
              if (!incompatibleType) return null;
              return (
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border border-red-100/50">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 flex-shrink-0 relative cursor-pointer group">
                      <img 
                        src={getMbtiImage(incompatibleType)} 
                        alt={RESULTS[incompatibleType].character}
                        className="w-full h-full object-cover rounded-lg shadow-sm transition-transform group-hover:scale-105"
                        onClick={() => setEnlargedImage({
                          src: getMbtiImage(incompatibleType),
                          character: RESULTS[incompatibleType].character
                        })}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs text-center py-0.5 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        크게보기
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full mr-2">
                          {incompatibleType}
                        </span>
                        <span className="font-bold text-red-800 text-lg">
                          {RESULTS[incompatibleType].character}
                        </span>
                        <span className="text-red-600 text-lg ml-2">💔</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed text-left">
                        {getIncompatibilityReason(resultType, incompatibleType)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
          
          <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
            <p className="text-xs text-gray-600 text-center">
              💡 MBTI 심리학을 바탕으로 선정된 궁합 정보입니다. 개인차가 있을 수 있어요!
            </p>
          </div>
        </div>
        
        </div> {/* image-capture-area 끝 */}

        {/* 나머지 테스트 추천 섹션 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6 border border-blue-100/50">
          <div className="text-center">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center justify-center">
              <span className="mr-2">🔥</span>
              다른 테스트도 도전해볼까?
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              더 정확한 분석을 위해 추가 테스트 해보세요! 🎯
            </p>
            
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(TEST_VERSIONS)
                .filter(([versionKey]) => parseInt(versionKey) !== completedVersion)
                .map(([versionKey, version]) => (
                  <div 
                    key={versionKey} 
                    className={`bg-gradient-to-r ${
                      version.color === 'orange' ? 'from-orange-50 to-amber-50 border-orange-200' :
                      version.color === 'purple' ? 'from-purple-50 to-pink-50 border-purple-200' :
                      'from-blue-50 to-cyan-50 border-blue-200'
                    } rounded-xl p-4 border hover:shadow-md transition-all duration-200 cursor-pointer transform hover:scale-[1.02]`}
                    onClick={() => {
                      const testUrls = {
                        1: 'https://b-mbti.money-hotissue.com/test1',
                        2: 'https://b-mbti.money-hotissue.com/test2',
                        3: 'https://b-mbti.money-hotissue.com/test3'
                      };
                      window.location.href = testUrls[parseInt(versionKey) as keyof typeof testUrls];
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <div className={`w-4 h-4 rounded-full mr-3 ${
                          version.color === 'orange' ? 'bg-orange-400' :
                          version.color === 'purple' ? 'bg-purple-400' :
                          'bg-blue-400'
                        }`}></div>
                        <div className="text-left flex-1">
                          <div className="font-bold text-gray-800 text-base mb-1">{version.name}</div>
                          <div className="text-sm text-gray-600 mb-2">{version.description}</div>
                          <div className={`text-xs ${
                            version.color === 'orange' ? 'text-orange-700' :
                            version.color === 'purple' ? 'text-purple-700' :
                            'text-blue-700'
                          }`}>
                            {parseInt(versionKey) === 1 && "💭 예배와 기도를 중요하게 생각하는 분들에게 추천"}
                            {parseInt(versionKey) === 2 && "🧠 신앙 고민에 대한 답을 찾고 싶은 분들에게 추천"}
                            {parseInt(versionKey) === 3 && "⚡ 실제 생활에서 신앙을 실천하는 분들에게 추천"}
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <span className={`px-3 py-1 rounded-full font-semibold text-sm ${
                          version.color === 'orange' ? 'bg-orange-500 text-white' :
                          version.color === 'purple' ? 'bg-purple-500 text-white' :
                          'bg-blue-500 text-white'
                        }`}>
                          시작!
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* 액션 버튼들을 감싸는 컨테이너 */}
        <div className="space-y-4">
          {/* 이미지 맞추기 게임 - 참여 유도 문구로 변경 */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 mb-6 border border-purple-100/50">
            <div className="text-center">
              <h3 className="font-bold text-gray-800 mb-2 flex items-center justify-center">
                <span className="mr-2">🖼️</span>
                이미지 맞추기 게임에 도전해보세요!
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                성경인물 이미지를 보고 누구인지 맞춰보세요! ✨
              </p>
              <button
                onClick={onQuizGame || (() => { window.location.href = 'https://b-mbti.money-hotissue.com/quizgame'; })}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02] shadow-sm"
              >
                🖼️ 게임 시작하기
              </button>
            </div>
          </div>

          {/* 다시 테스트 버튼 */}
          <button
            onClick={() => {
              // completedVersion이 있으면 시작 페이지로 버전 정보와 함께 이동
              if (completedVersion) {
                window.location.href = `https://b-mbti.money-hotissue.com/?version=${completedVersion}`;
              } else {
                onRestart();
              }
            }}
            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold py-4 px-6 rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-[1.02] shadow-sm flex items-center justify-center"
          >
            🔁 다시 테스트하기
          </button>

          {/* 후기 남기기 */}
          <button
            onClick={handleLeaveComment}
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium py-3 px-4 rounded-2xl hover:from-green-600 hover:to-teal-600 transition-all duration-200 shadow-sm"
          >
            💬 후기 남기기
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

      {/* 성경인물 이미지 맞추기 게임 모달 */}
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
                
                {/* 선택된 답안 표시 */}
                {userGuess && quizResult === null && (
                  <div className="mt-3 p-3 bg-blue-100 text-blue-700 rounded-xl">
                    선택한 답안: <strong>{userGuess}</strong>
                  </div>
                )}
                
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
                💡 아래 후보 중에서 선택하세요!
              </h4>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {ALL_CHARACTERS.map((type) => (
                  <button
                    key={type}
                    onClick={() => selectCharacterFromCandidates(RESULTS[type].character)}
                    disabled={quizResult !== null}
                    className={`p-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                      userGuess === RESULTS[type].character && quizResult === null
                        ? 'bg-blue-200 text-blue-800 border-2 border-blue-400'
                        : quizResult !== null && RESULTS[type].character === quizCharacter
                        ? 'bg-green-200 text-green-800 border-2 border-green-400'
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
                  disabled={!userGuess || userGuess.trim() === ''}
                  className={`flex-1 p-3 rounded-2xl font-semibold transition-all duration-200 ${
                    userGuess && userGuess.trim() !== ''
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
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

      {/* 이미지 확대 모달 */}
      {enlargedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setEnlargedImage(null)}>
          <div className="relative max-w-lg w-full">
            <img 
              src={enlargedImage.src} 
              alt={enlargedImage.character}
              className="w-full h-auto rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {enlargedImage.character}
            </div>
            <button 
              onClick={() => setEnlargedImage(null)}
              className="absolute top-4 right-4 bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/90 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 하단 장식 */}
      <div className="mt-2 flex justify-center space-x-1">
        <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-75"></div>
        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-150"></div>
      </div>
    </div>
  );
};

export default ResultScreen;