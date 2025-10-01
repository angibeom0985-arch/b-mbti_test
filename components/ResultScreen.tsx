import React, { useState, useEffect } from 'react';
import { MbtiType, MbtiResult } from '../types';
import { RESULTS } from '../constants';
import LoadingIndicator from './LoadingIndicator';

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

// 16가지 MBTI 유형과 대응하는 성경인물들
const ALL_CHARACTERS = Object.keys(RESULTS) as MbtiType[];

// 어울리는 성격 유형 추천 로직
const getCompatibleTypes = (currentType: MbtiType): MbtiType[] => {
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
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [selectedTestVersion, setSelectedTestVersion] = useState<number | null>(null);
  
  // 퀴즈 게임 상태
  const [quizCharacter, setQuizCharacter] = useState<string>('');
  const [userGuess, setUserGuess] = useState('');
  const [quizResult, setQuizResult] = useState<'correct' | 'wrong' | null>(null);
  const [currentQuizType, setCurrentQuizType] = useState<string>('');

  // 게임 점수 관련 상태
  const [gameScore, setGameScore] = useState(0);
  const [totalGames, setTotalGames] = useState(0);
  const [showScoreShare, setShowScoreShare] = useState(false);

  // 중복 방지를 위한 사용된 캐릭터 추적
  const [usedCharacters, setUsedCharacters] = useState<string[]>([]);

  // 게임 참여 유도 멘트 배열
  const gamePromptMessages = [
    "🎮 친구들보다 더 많이 맞출 자신 있나요? 도전해보세요!",
    "🎨 귀여운 일러스트를 좋아한다면 이 게임이 딱이에요!",
    "🏆 다른 사람들은 못 맞추는 문제도 당신은 맞출 수 있을 거예요",
    "💡 눈썰미가 좋은 당신에게 딱 맞는 재미있는 도전!",
    "⚡ 순간 판단력이 뛰어난 분들이 좋아하는 이미지 게임이에요",
    "😊 스트레스 해소용으로도 최고! 귀여운 캐릭터들이 기다려요",
    "🎯 친구들과 점수 경쟁하면 더 재밌어요!",
    "🌟 귀여운 일러스트와 함께하는 힐링 타임!"
  ];

  // 랜덤 멘트 선택 (컴포넌트 마운트 시 한 번만 선택)
  const [randomPrompt] = useState(() => {
    return gamePromptMessages[Math.floor(Math.random() * gamePromptMessages.length)];
  });

  // 미리보기용 랜덤 캐릭터 선택 (컴포넌트 마운트 시 한 번만 선택)
  const [previewCharacter] = useState(() => {
    const allTypes = Object.keys(RESULTS) as (keyof typeof RESULTS)[];
    const randomType = allTypes[Math.floor(Math.random() * allTypes.length)];
    
    // 이미지 경로 매핑
    const getImagePath = (type: string) => {
      const imageMap: Record<string, string> = {
        'ISTJ': '/ISTJ 요셉.jpg',
        'ISFJ': '/ISFJ 룻.jpg', 
        'INFJ': '/INFJ 다니엘.jpg',
        'INTJ': '/INTJ 바울.jpg',
        'ISTP': '/ISTP 삼손.jpg',
        'ISFP': '/ISFP 다윗.jpg',
        'INFP': '/INFP 마리아.jpg',
        'INTP': '/INTP 솔로몬.jpg',
        'ESTP': '/ESTP 베드로.jpg',
        'ESFP': '/ESFP 에스더.jpg',
        'ENFP': '/ENFP 아브라함.jpg',
        'ENTP': '/ENJS 느헤미야.jpg',
        'ESTJ': '/ESTJ 모세.jpg',
        'ESFJ': '/ESFJ 막달라 마리아.jpg',
        'ENFJ': '/ENFJ 예수님.jpg',
        'ENTJ': '/ENTJ 드보라.jpg'
      };
      return imageMap[type] || '/ENFP 아브라함.jpg';
    };
    
    return {
      type: randomType,
      character: RESULTS[randomType].character,
      image: getImagePath(randomType)
    };
  });

  // 컴포넌트 마운트 시 게임 점수 불러오기
  useEffect(() => {
    const savedScore = localStorage.getItem('quizGameScore');
    const savedTotal = localStorage.getItem('quizGameTotal');
    
    if (savedScore && savedTotal) {
      setGameScore(parseInt(savedScore, 10));
      setTotalGames(parseInt(savedTotal, 10));
    }
  }, []);

  // 퀴즈를 위한 랜덤 캐릭터 선택 (중복 방지)
  const getRandomCharacter = () => {
    // 모든 캐릭터를 사용했다면 목록을 초기화
    let availableCharacters = ALL_CHARACTERS.filter(type => !usedCharacters.includes(type));
    
    if (availableCharacters.length === 0) {
      // 모든 캐릭터를 사용했으면 초기화하고 현재 캐릭터만 제외
      setUsedCharacters([]);
      availableCharacters = ALL_CHARACTERS.filter(type => type !== currentQuizType);
    }
    
    const randomType = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
    setCurrentQuizType(randomType);
    setQuizCharacter(RESULTS[randomType].character);
    setUsedCharacters(prev => [...prev, randomType]);
    setUserGuess('');
    setQuizResult(null);
  };

  // 모바일 최적화된 새창 이미지 보기 함수
  const openImageInNewWindow = (imageSrc: string, characterName: string) => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${characterName} - 성경인물 MBTI</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              margin: 0;
              padding: 10px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              font-family: system-ui, -apple-system, sans-serif;
            }
            .container {
              text-align: center;
              background: white;
              padding: 20px;
              border-radius: 20px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              position: relative;
              width: 95vw;
              max-width: 600px;
            }
            img {
              width: 90vw;
              max-width: 500px;
              height: auto;
              border-radius: 15px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }
            h1 {
              margin-top: 20px;
              color: #333;
              font-size: clamp(24px, 5vw, 32px);
            }
            .back-button {
              margin-top: 20px;
              padding: 16px 32px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border: none;
              border-radius: 25px;
              font-size: clamp(16px, 4vw, 20px);
              font-weight: bold;
              cursor: pointer;
              width: 100%;
              max-width: 300px;
              transition: all 0.3s ease;
              box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            }
            .back-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            }
            .close-button {
              position: absolute;
              top: 15px;
              right: 15px;
              background: rgba(0,0,0,0.5);
              color: white;
              border: none;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              cursor: pointer;
              font-size: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .close-button:hover {
              background: rgba(0,0,0,0.7);
            }
            @media (max-width: 768px) {
              body {
                padding: 5px;
              }
              .container {
                width: 98vw;
                padding: 15px;
              }
              img {
                width: 95vw;
              }
              h1 {
                font-size: 28px;
              }
              .back-button {
                font-size: 18px;
                padding: 18px 36px;
              }
              .close-button {
                width: 45px;
                height: 45px;
                font-size: 22px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <button class="close-button" onclick="window.close()">×</button>
            <img src="${window.location.origin}${imageSrc}" alt="${characterName}" />
            <h1>${characterName}</h1>
            <button class="back-button" onclick="window.close(); if(window.opener && !window.opener.closed) { window.opener.focus(); }">
              🏠 결과 페이지로 돌아가기
            </button>
          </div>
        </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  // 가짜 댓글 데이터
  const fakeComments = [
    { id: 1, user: "은혜님", comment: "완전 저네요!! 대박 신기해요 ㅋㅋ", likes: 23 },
    { id: 2, user: "믿음이", comment: "와 진짜 정확하다... 소름", likes: 18 },
    { id: 3, user: "소망♡", comment: "친구들이랑 다 해봤는데 다 맞아요!", likes: 12 },
    { id: 4, user: "평강", comment: `${resultData?.character} 완전 멋져요!! 저도 닮고 싶어요`, likes: 8 }
  ];

  if (!resultData) {
    return <LoadingIndicator />;
  }
  
  if (error && !resultData?.image) {
    return (
      <div className="p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-red-100 w-full max-w-md mx-auto text-center">
        <div className="text-red-500 mb-4">오류가 발생했습니다</div>
        <button
          onClick={onRestart}
          className="w-full p-3 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          다시 시작하기
        </button>
      </div>
    );
  }

  // 쿠팡파트너스 링크를 먼저 열고, 그 다음에 목적지 URL을 여는 함수 (수익 창출)
  const openWithCoupangAd = (targetUrl: string, windowOptions?: string) => {
    const coupangPartnersUrl = getRandomCoupangUrl();
    
    const targetWindow = window.open(targetUrl, '_blank', windowOptions || '');
    
    if (!targetWindow) {
      alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
      return;
    }
    
    setTimeout(() => {
      window.location.href = coupangPartnersUrl;
    }, 100);
  };

  const handleShare = () => {
    localStorage.setItem('tempResult', JSON.stringify({
      type: resultType,
      character: resultData?.character || '',
      timestamp: Date.now()
    }));
    
    const shareUrl = `/share?type=${encodeURIComponent(resultType)}&character=${encodeURIComponent(resultData?.character || '')}`;
    
    openWithCoupangAd(shareUrl, 'width=450,height=650,scrollbars=yes,resizable=yes');
  };

  // 간단한 클립보드 공유 함수
  const handleSNSShare = (platform: string) => {
    const shareText = `🙏 성경인물 MBTI 테스트 결과 🙏\n\n저는 '${resultData?.character}(${resultType})' 유형이에요!\n\n${resultData?.description.slice(0, 50)}...\n\n여러분도 테스트해보세요!`;
    const shareUrl = 'https://b-mbti.money-hotissue.com';

    if (platform === 'copy') {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        setShowShareModal(false);
      });
    }
  };

  // 게임 점수 계산 함수
  const calculateGameScore = () => {
    if (totalGames === 0) return 0;
    return Math.round((gameScore / totalGames) * 100);
  };

  // 게임 점수 공유 함수 (클립보드만)
  const handleGameScoreShare = (platform: string) => {
    const scorePercentage = calculateGameScore();
    const shareText = `🎮 성경인물 맞히기 게임 결과 🎮\n\n정답률: ${scorePercentage}% (${gameScore}/${totalGames})\n\n${resultData?.character}(${resultType}) 유형인 저와 겨뤄보세요! 💪\n\n친구들도 도전해보세요!`;
    const shareUrl = 'https://b-mbti.money-hotissue.com/quizgame';
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).then(() => {
        alert('🎮 게임 결과가 클립보드에 복사되었습니다!\n원하는 곳에 붙여넣기 해주세요. 📋');
        setShowScoreShare(false);
      });
    }
  };

  const handleSaveAsImage = async () => {
    try {
      const captureElement = document.querySelector('.image-capture-area');
      if (!captureElement) {
        alert('결과 화면을 찾을 수 없습니다.');
        return;
      }

      const processCapture = async () => {
        try {
          const canvas = await (window as any).html2canvas(captureElement, {
            allowTaint: true,
            useCORS: true,
            scrollX: 0,
            scrollY: 0,
            backgroundColor: '#ffffff'
          });

          canvas.toBlob((blob: Blob | null) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `성경인물-MBTI-${resultType}-${resultData?.character}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }
          }, 'image/png');
        } catch (error) {
          console.error('캡처 실패:', error);
          alert('이미지 저장에 실패했습니다.');
        }
      };

      if ((window as any).html2canvas) {
        await processCapture();
      } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);

        script.onload = async () => {
          await processCapture();
        };

        script.onerror = () => {
          alert('이미지 저장 라이브러리 로드에 실패했습니다.');
        };
      }

    } catch (error) {
      console.error('이미지 저장 중 오류:', error);
      alert('이미지 저장 중 오류가 발생했습니다.');
    }
  };
  
  const handleLeaveComment = () => {
    setShowComments(true);
    setTimeout(() => {
      window.open(getRandomCoupangUrl(), '_blank');
    }, 1000);
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
    if (quizResult !== null) return;
    setUserGuess(character);
  };

  return (
    <div className="result-container p-3 md:p-6 bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-xl border border-white/30 w-full max-w-sm md:max-w-lg mx-auto text-center relative overflow-hidden">
      
      {/* 이미지 캡처 영역 시작 */}
      <div className="image-capture-area">
      
      {/* 결과 헤더 */}
      <div className="bg-white/90 rounded-2xl p-4 mb-6 shadow-sm border border-pink-100/50 backdrop-blur-sm">
        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-pink-600 to-orange-500 mb-2 leading-tight">
          🙏 당신의 성경인물 유형 🙏
        </h1>
        <div className="text-center mb-4">
          <div className="text-4xl md:text-5xl font-black text-violet-700 mb-2 tracking-wider">
            {resultType}
          </div>
          <div className="text-2xl md:text-3xl font-bold text-pink-600 mb-4">
            {resultData.character}
          </div>
        </div>
        
        <div 
          className="relative cursor-pointer group mx-auto mb-4 w-full max-w-xs hover:scale-105 transition-transform duration-300"
          onClick={() => openImageInNewWindow(getMbtiImage(resultType), resultData.character)}
        >
          <img
            src={getMbtiImage(resultType)}
            alt={`${resultData.character} - ${resultType}`}
            className="w-full h-auto rounded-2xl shadow-lg border-4 border-white/50 group-hover:shadow-2xl transition-all duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 bg-white/90 px-3 py-2 rounded-lg text-sm font-semibold text-gray-800 transform scale-95 group-hover:scale-100 transition-all duration-300">
              📱 크게 보기
            </div>
          </div>
        </div>
      </div>

      {/* 성격 특성 */}
      <div className="bg-white/90 rounded-2xl p-5 mb-6 shadow-sm border border-pink-100/50">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
          ✨ 성격 특성 ✨
        </h2>
        <div className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
          {resultData.description}
        </div>
        

      </div>

      {/* 성경구절 */}
      <div className="bg-gradient-to-r from-violet-100 to-pink-100 p-4 rounded-2xl border-l-4 border-violet-400 shadow-sm mb-6 text-center">
        <div className="text-violet-700 font-semibold text-sm mb-2">📖 관련 성경구절</div>
        <div className="text-gray-800 font-medium text-base italic leading-relaxed">
          "{resultData.verse}"
        </div>
        <div className="text-violet-600 text-sm mt-2 font-semibold">- 성경구절 -</div>
      </div>

      {/* 액션 버튼들 */}
      <div className="space-y-3">
        {/* 공유하기 버튼 */}
        <button
          onClick={() => setShowShareModal(true)}
          className="w-full p-4 bg-gradient-to-r from-pink-500 via-violet-500 to-orange-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span className="text-xl">📤</span>
          친구들에게 공유하기
        </button>
      </div>

      {/* 인물 호환성 분석 */}
      <div className="mb-6 space-y-4 mt-6">
          {/* 어울리는 유형 */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border-l-4 border-green-400 shadow-sm">
            <h3 className="text-lg font-bold text-green-700 mb-3 flex items-center gap-2">
              💚 잘 어울리는 성경인물들
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {getCompatibleTypes(resultType).map((type) => (
                <div key={type} className="bg-white/70 p-3 rounded-xl shadow-sm border border-green-100">
                  <div className="font-bold text-green-800 text-sm mb-1">
                    {type} - {RESULTS[type].character}
                  </div>
                  <div className="text-xs text-green-600 leading-relaxed">
                    {getCompatibilityReason(resultType, type)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 조심해야 할 유형 */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4 border-l-4 border-orange-400 shadow-sm">
            <h3 className="text-lg font-bold text-orange-700 mb-3 flex items-center gap-2">
              ⚠️ 소통에 노력이 필요한 유형들
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {getIncompatibleTypes(resultType).map((type) => (
                <div key={type} className="bg-white/70 p-3 rounded-xl shadow-sm border border-orange-100">
                  <div className="font-bold text-orange-800 text-sm mb-1">
                    {type} - {RESULTS[type].character}
                  </div>
                  <div className="text-xs text-orange-600 leading-relaxed">
                    {getIncompatibilityReason(resultType, type)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
        
        </div> {/* image-capture-area 끝 */}

        {/* 나머지 테스트 추천 섹션 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6 border border-blue-100/50">
          <div className="text-center">
            <h3 className="text-xl font-bold text-blue-700 mb-3">
              🎮 다른 테스트도 해보세요!
            </h3>
            <p className="text-blue-600 text-sm mb-4">
              각각 다른 관점에서 당신을 분석해드려요
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  setSelectedTestVersion(1);
                  setTimeout(() => {
                    window.location.href = '/test1';
                  }, 100);
                }}
                className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>📝</span>
                테스트 1 - 직관형 분석
              </button>
              
              <button
                onClick={() => {
                  setSelectedTestVersion(2);
                  setTimeout(() => {
                    window.location.href = '/test2';
                  }, 100);
                }}
                className="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>🎯</span>
                테스트 2 - 행동형 분석
              </button>
              
              <button
                onClick={() => {
                  setSelectedTestVersion(3);
                  setTimeout(() => {
                    window.location.href = '/test3';
                  }, 100);
                }}
                className="w-full p-3 bg-gradient-to-r from-pink-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>💖</span>
                테스트 3 - 감정형 분석
              </button>
            </div>
          </div>
        </div>

        {/* 액션 버튼들을 감싸는 컨테이너 */}
        <div className="space-y-3 md:space-y-4">
          {/* 퀴즈게임 버튼 */}
          <button
            onClick={() => {
              if (onQuizGame) {
                onQuizGame();
              } else {
                window.location.href = '/quizgame';
              }
            }}
            className="w-full p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🎮</span>
                <span>성경인물 맞히기 게임</span>
                <span className="text-xl">🏆</span>
              </div>
              <div className="text-xs opacity-90 font-medium">
                {randomPrompt}
              </div>
            </div>
          </button>

          {totalGames > 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-200">
              <div className="text-center">
                <div className="text-amber-700 font-semibold text-sm mb-1">
                  🏆 내 게임 기록
                </div>
                <div className="text-amber-800 text-lg font-bold">
                  정답률: {calculateGameScore()}% ({gameScore}/{totalGames})
                </div>
                <button
                  onClick={() => setShowScoreShare(true)}
                  className="mt-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors"
                >
                  게임 결과 공유하기
                </button>
              </div>
            </div>
          )}

          {/* 기타 버튼들 */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleSaveAsImage}
              className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
            >
              <span>📷</span>
              이미지 저장
            </button>
            
            <button
              onClick={onRestart}
              className="p-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
            >
              <span>🔄</span>
              다시하기
            </button>
          </div>
        </div>

      {/* SNS 공유 모달 */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 md:p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold text-center mb-4">📤 공유하기</h3>
            <button
              onClick={() => handleSNSShare('copy')}
              className="w-full p-4 mb-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>🔗</span>
              링크 복사하기
            </button>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full p-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 게임 점수 공유 모달 */}
      {showScoreShare && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 md:p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold text-center mb-4">🎮 게임 결과 공유</h3>
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-amber-600">
                정답률: {calculateGameScore()}%
              </div>
              <div className="text-gray-600">
                ({gameScore}/{totalGames})
              </div>
            </div>
            <button
              onClick={() => handleGameScoreShare('copy')}
              className="w-full p-4 mb-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>🔗</span>
              결과 복사하기
            </button>
            <button
              onClick={() => setShowScoreShare(false)}
              className="w-full p-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 후기 남기기 모달 */}
      {showComments && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-96 overflow-y-auto">
            <h3 className="text-xl font-bold text-center mb-4">💬 후기 남기기</h3>
            
            <div className="mb-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="테스트 결과가 어떠셨나요? 후기를 남겨주세요!"
                className="w-full p-3 border border-gray-300 rounded-xl resize-none h-24"
                maxLength={200}
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleSubmitComment}
                className="flex-1 p-3 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                후기 등록
              </button>
              <button
                onClick={() => setShowComments(false)}
                className="flex-1 p-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                닫기
              </button>
            </div>
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