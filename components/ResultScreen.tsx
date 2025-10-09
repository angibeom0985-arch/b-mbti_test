import React, { useState, useEffect } from "react";
import type { MbtiType, MbtiResult } from "../types";
import { RESULTS, TEST_VERSIONS, PERSONALITY_TRAITS } from "../constants";
import RestartIcon from "./icons/RestartIcon";
import LoadingIndicator from "./LoadingIndicator";
import ShareIcon from "./icons/ShareIcon";

// 쿠팡 파트너스 링크 배열
const COUPANG_PARTNERS_URLS = [
  "https://link.coupang.com/a/cTTkqa",
  "https://link.coupang.com/a/cTTkLm",
  "https://link.coupang.com/a/cTTkS7",
  "https://link.coupang.com/a/cTTkWI",
  "https://link.coupang.com/a/cTTk02",
  "https://link.coupang.com/a/cTTk5m",
  "https://link.coupang.com/a/cTTk7h",
  "https://link.coupang.com/a/cTTlcr",
  "https://link.coupang.com/a/cTTldT",
  "https://link.coupang.com/a/cTTlif",
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
  onStartTest?: (version: number) => void;
}

// 16가지 MBTI 유형과 대응하는 성경인물들
const ALL_CHARACTERS = Object.keys(RESULTS) as MbtiType[];

// 어울리는 성격 유형 추천 로직
const getCompatibleTypes = (currentType: MbtiType): MbtiType[] => {
  // 각 유형별로 어울리는 유형들을 정의 (심리학적 호환성 기반)
  const compatibilityMap: Record<MbtiType, MbtiType[]> = {
    ENFP: ["INFJ", "INTJ", "ENFJ", "INFP"],
    ENFJ: ["INFP", "ISFP", "ENFP", "INFJ"],
    ENTP: ["INFJ", "INTJ", "ENFJ", "INFP"],
    ENTJ: ["INFP", "ISFP", "ENFP", "INFJ"],
    ESFP: ["ISFJ", "ISTJ", "ESFJ", "ISFP"],
    ESFJ: ["ISFP", "ISTP", "ESFP", "ISFJ"],
    ESTP: ["ISFJ", "ISTJ", "ESFJ", "ISFP"],
    ESTJ: ["ISFP", "ISTP", "ESFP", "ISFJ"],
    INFP: ["ENFJ", "ENTJ", "ENFP", "INFJ"],
    INFJ: ["ENFP", "ENTP", "ENFJ", "INFP"],
    INTP: ["ENFJ", "ENTJ", "ENFP", "INFJ"],
    INTJ: ["ENFP", "ENTP", "ENFJ", "INFP"],
    ISFP: ["ESFJ", "ESTJ", "ESFP", "ISFJ"],
    ISFJ: ["ESFP", "ESTP", "ESFJ", "ISFP"],
    ISTP: ["ESFJ", "ESTJ", "ESFP", "ISFJ"],
    ISTJ: ["ESFP", "ESTP", "ESFJ", "ISFP"],
  };

  return compatibilityMap[currentType] || [];
};

// 호환성 이유 설명
const getCompatibilityReason = (
  currentType: MbtiType,
  targetType: MbtiType
): string => {
  const reasons: Record<string, string> = {
    "ENFP-INFJ": "서로의 직관과 감정을 깊이 이해하며, 영적 교감이 뛰어납니다",
    "ENFP-INTJ": "창의적 아이디어와 체계적 실행력이 완벽하게 조화를 이룹니다",
    "ENFJ-INFP": "서로의 가치관을 존중하며 따뜻한 관계를 형성합니다",
    "ENTP-INFJ": "혁신적 사고와 깊은 통찰력이 만나 시너지를 창출합니다",
    "ENTJ-INFP": "리더십과 창의성이 만나 균형 잡힌 협력을 보여줍니다",
    "ESFP-ISFJ": "활발함과 배려심이 조화롭게 어우러져 즐거운 관계를 만듭니다",
    "ESFJ-ISFP": "따뜻한 마음과 예술적 감성이 아름답게 융합됩니다",
    "ESTP-ISFJ": "행동력과 세심함이 서로의 부족함을 채워줍니다",
    "ESTJ-ISFP": "체계성과 유연성이 만나 실용적 협력을 이룹니다",
    "INFP-ENFJ": "내면의 가치와 따뜻한 리더십이 서로를 성장시킵니다",
    "INFJ-ENFP": "깊은 통찰력과 밝은 에너지가 완벽한 조화를 이룹니다",
    "INTP-ENFJ": "논리적 사고와 인간적 따뜻함이 균형을 맞춥니다",
    "INTJ-ENFP": "전략적 사고와 창의적 영감이 시너지를 발휘합니다",
    "ISFP-ESFJ": "예술적 감성과 사회적 배려가 아름답게 어우러집니다",
    "ISFJ-ESFP": "안정감과 활력이 서로를 보완하며 조화를 이룹니다",
    "ISTP-ESFJ": "실용적 기술과 따뜻한 배려가 실생활에서 큰 도움이 됩니다",
    "ISTJ-ESFP": "체계적 계획과 즉흥적 활력이 균형잡힌 관계를 만듭니다",
  };

  const key = `${currentType}-${targetType}`;
  return (
    reasons[key] || "서로 다른 강점이 조화롭게 어우러져 좋은 관계를 형성합니다"
  );
};

// 어울리지 않는 성격 유형 (충돌하기 쉬운 유형)
const getIncompatibleTypes = (currentType: MbtiType): MbtiType[] => {
  const incompatibilityMap: Record<MbtiType, MbtiType[]> = {
    ENFP: ["ISTJ", "ISTP", "ESTJ", "ESTP"],
    ENFJ: ["ISTP", "INTP", "ESTP", "ENTP"],
    ENTP: ["ISFJ", "ISTJ", "ESFJ", "ESTJ"],
    ENTJ: ["ISFJ", "ISFP", "ESFJ", "ESFP"],
    ESFP: ["INTJ", "INTP", "ENTJ", "ENTP"],
    ESFJ: ["INTP", "ENTP", "INTJ", "ENTJ"],
    ESTP: ["INFJ", "INFP", "ENFJ", "ENFP"],
    ESTJ: ["INFP", "ENFP", "INFJ", "ENFJ"],
    INFP: ["ESTJ", "ENTJ", "ESTP", "ENTP"],
    INFJ: ["ESTP", "ESFP", "ESTJ", "ESFJ"],
    INTP: ["ESFJ", "ESFP", "ESTJ", "ESTP"],
    INTJ: ["ESFP", "ESTP", "ESFJ", "ESTJ"],
    ISFP: ["ENTJ", "ENTP", "ESTJ", "ESTP"],
    ISFJ: ["ENTP", "ENTJ", "ESTP", "ESTJ"],
    ISTP: ["ENFJ", "ESFJ", "ENFP", "ESFP"],
    ISTJ: ["ENFP", "ESFP", "ENTP", "ESTP"],
  };

  return incompatibilityMap[currentType] || [];
};

// 비호환성 이유 설명
const getIncompatibilityReason = (
  currentType: MbtiType,
  targetType: MbtiType
): string => {
  const reasons: Record<string, string> = {
    "ENFP-ISTJ":
      "자유로운 창의성과 체계적 계획성이 충돌할 수 있어 소통에 노력이 필요합니다",
    "ENFP-ISTP": "감정표현 방식과 실용적 접근의 차이로 오해가 생길 수 있습니다",
    "ENFJ-ISTP":
      "따뜻한 감정 표현과 차분한 성향의 차이가 거리감을 만들 수 있습니다",
    "ENTP-ISFJ": "혁신적 변화 추구와 안정 선호로 인해 갈등이 생길 수 있습니다",
    "ENTJ-ISFJ": "목표 지향적 추진력과 안정 추구로 인한 충돌 가능성이 있습니다",
    "ESFP-INTJ": "즉흥적 활력과 신중한 계획성이 서로 답답함을 느낄 수 있습니다",
    "ESFJ-INTP":
      "감정적 배려와 논리적 분석 방식의 차이로 오해가 생길 수 있습니다",
    "ESTP-INFJ":
      "행동 중심적 성향과 신중한 성찰의 차이가 갈등을 만들 수 있습니다",
    "ESTJ-INFP":
      "체계적 통제와 개인적 자유 추구로 인한 마찰이 있을 수 있습니다",
    "INFP-ESTJ": "개인적 가치와 객관적 효율성 추구의 차이로 충돌할 수 있습니다",
    "INFJ-ESTP":
      "깊은 성찰과 즉흥적 행동의 차이가 서로를 이해하기 어렵게 만듭니다",
    "INTP-ESFJ":
      "논리적 분석과 감정적 배려의 차이로 소통에 어려움이 있을 수 있습니다",
    "INTJ-ESFP":
      "장기적 계획과 순간적 즐거움 추구의 차이가 갈등을 만들 수 있습니다",
    "ISFP-ENTJ":
      "개인적 가치와 목표 달성 중심 사고의 차이로 마찰이 생길 수 있습니다",
    "ISFJ-ENTP":
      "안정 추구와 변화 선호의 차이로 인해 스트레스를 받을 수 있습니다",
    "ISTP-ENFJ":
      "독립적 성향과 사회적 관계 중시의 차이가 거리감을 만들 수 있습니다",
    "ISTJ-ENFP":
      "체계적 질서와 자유로운 창의성이 서로 제약으로 느껴질 수 있습니다",
  };

  const key = `${currentType}-${targetType}`;
  return (
    reasons[key] ||
    "서로 다른 성향으로 인해 이해하는 데 더 많은 노력이 필요할 수 있습니다"
  );
};

// MBTI 유형별 이미지 파일 매핑 함수
const getMbtiImage = (type: MbtiType): string => {
  const imageMap: Record<MbtiType, string> = {
    ENFP: "/ENFP 아브라함.jpg",
    ENFJ: "/ENJS 느헤미야.jpg",
    ENTJ: "/ENTJ 드보라.jpg",
    ENTP: "/ENFP 아브라함.jpg", // ENTP 파일이 없어서 임시로 ENFP 사용
    ESFJ: "/ESFJ 막달라 마리아.jpg",
    ESFP: "/ESFP 에스더.jpg",
    ESTJ: "/ESTJ 모세.jpg",
    ESTP: "/ESTP 베드로.jpg",
    INFJ: "/INFJ 다니엘.jpg",
    INFP: "/INFP 마리아.jpg",
    INTJ: "/INTJ 바울.jpg",
    INTP: "/INTP 솔로몬.jpg",
    ISFJ: "/ISFJ 룻.jpg",
    ISFP: "/ISFP 다윗.jpg",
    ISTJ: "/ISTJ 요셉.jpg",
    ISTP: "/ISTP 삼손.jpg",
  };

  return imageMap[type] || "/ENFP 아브라함.jpg";
};

const ResultScreen: React.FC<ResultScreenProps> = ({
  resultType,
  resultData,
  error,
  onRestart,
  completedVersion = 1,
  onQuizGame,
  onStartTest,
}) => {
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  // showOtherCharacters 상태 제거됨
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedTestVersion, setSelectedTestVersion] = useState<number | null>(
    null
  );

  // 퀴즈 게임 상태
  const [quizCharacter, setQuizCharacter] = useState<string>("");
  const [userGuess, setUserGuess] = useState("");
  const [quizResult, setQuizResult] = useState<"correct" | "wrong" | null>(
    null
  );
  const [currentQuizType, setCurrentQuizType] = useState<string>("");

  // 게임 점수 관련 상태
  const [gameScore, setGameScore] = useState(0);
  const [totalGames, setTotalGames] = useState(0);
  const [showScoreShare, setShowScoreShare] = useState(false);

  // 중복 방지를 위한 사용된 캐릭터 추적
  const [usedCharacters, setUsedCharacters] = useState<string[]>([]);

  // 이미지 모달 상태
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");
  const [modalImageTitle, setModalImageTitle] = useState("");

  // 게임 참여 유도 멘트 배열
  const gamePromptMessages = [
    "🎮 친구들보다 더 많이 맞출 자신 있나요? 도전해보세요!",
    "🎨 귀여운 일러스트를 좋아한다면 이 게임이 딱이에요!",
    "🏆 다른 사람들은 못 맞추는 문제도 당신은 맞출 수 있을 거예요",
    "💡 눈썰미가 좋은 당신에게 딱 맞는 재미있는 도전!",
    "⚡ 순간 판단력이 뛰어난 분들이 좋아하는 이미지 게임이에요",
    "😊 스트레스 해소용으로도 최고! 귀여운 캐릭터들이 기다려요",
    "🎯 친구들과 점수 경쟁하면 더 재밌어요!",
    "🌟 귀여운 일러스트와 함께하는 힐링 타임!",
  ];

  // 랜덤 멘트 선택 (컴포넌트 마운트 시 한 번만 선택)
  const [randomPrompt] = useState(() => {
    return gamePromptMessages[
      Math.floor(Math.random() * gamePromptMessages.length)
    ];
  });

  // 미리보기용 랜덤 캐릭터 선택 (컴포넌트 마운트 시 한 번만 선택)
  const [previewCharacter] = useState(() => {
    const allTypes = Object.keys(RESULTS) as (keyof typeof RESULTS)[];
    const randomType = allTypes[Math.floor(Math.random() * allTypes.length)];

    // 이미지 경로 매핑
    const getImagePath = (type: string) => {
      const imageMap: Record<string, string> = {
        ISTJ: "/ISTJ 요셉.jpg",
        ISFJ: "/ISFJ 룻.jpg",
        INFJ: "/INFJ 다니엘.jpg",
        INTJ: "/INTJ 바울.jpg",
        ISTP: "/ISTP 삼손.jpg",
        ISFP: "/ISFP 다윗.jpg",
        INFP: "/INFP 마리아.jpg",
        INTP: "/INTP 솔로몬.jpg",
        ESTP: "/ESTP 베드로.jpg",
        ESFP: "/ESFP 에스더.jpg",
        ENFP: "/ENFP 아브라함.jpg",
        ENTP: "/ENJS 느헤미야.jpg",
        ESTJ: "/ESTJ 모세.jpg",
        ESFJ: "/ESFJ 막달라 마리아.jpg",
        ENFJ: "/ENFJ 예수님.jpg",
        ENTJ: "/ENTJ 드보라.jpg",
      };
      return imageMap[type] || "/ENFP 아브라함.jpg";
    };

    return {
      type: randomType,
      character: RESULTS[randomType].character,
      image: getImagePath(randomType),
    };
  });

  // 컴포넌트 마운트 시 게임 점수 불러오기
  useEffect(() => {
    const savedScore = localStorage.getItem("quizGameScore");
    const savedTotal = localStorage.getItem("quizGameTotal");

    if (savedScore && savedTotal) {
      setGameScore(parseInt(savedScore, 10));
      setTotalGames(parseInt(savedTotal, 10));
    }
  }, []);

  // 퀴즈를 위한 랜덤 캐릭터 선택 (중복 방지)
  const getRandomCharacter = () => {
    // 모든 캐릭터를 사용했다면 목록을 초기화
    let availableCharacters = ALL_CHARACTERS.filter(
      (type) => !usedCharacters.includes(type)
    );

    if (availableCharacters.length === 0) {
      // 모든 캐릭터를 사용했으면 초기화하고 현재 캐릭터만 제외
      setUsedCharacters([]);
      availableCharacters = ALL_CHARACTERS.filter(
        (type) => type !== currentQuizType
      );
    }

    const randomType =
      availableCharacters[
        Math.floor(Math.random() * availableCharacters.length)
      ];
    setCurrentQuizType(randomType);
    setQuizCharacter(RESULTS[randomType].character);
    setUsedCharacters((prev) => [...prev, randomType]);
    setUserGuess("");
    setQuizResult(null);
  };

  // 모달로 이미지 크게 보기 함수
  const openImageInModal = (imageSrc: string, characterName: string) => {
    setModalImageSrc(imageSrc);
    setModalImageTitle(characterName);
    setShowImageModal(true);
  };

  // 모바일 최적화된 새창 이미지 보기 함수 (호환성 유지)
  const openImageInNewWindow = (imageSrc: string, characterName: string) => {
    openImageInModal(imageSrc, characterName);
    return;

    const newWindow = window.open("", "_blank");
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
    {
      id: 1,
      user: "은혜님",
      comment: "완전 저네요!! 대박 신기해요 ㅋㅋ",
      likes: 23,
    },
    { id: 2, user: "믿음이", comment: "와 진짜 정확하다... 소름", likes: 18 },
    {
      id: 3,
      user: "소망♡",
      comment: "친구들이랑 다 해봤는데 다 맞아요!",
      likes: 12,
    },
    {
      id: 4,
      user: "평강",
      comment: `${resultData?.character} 완전 멋져요!! 저도 닮고 싶어요`,
      likes: 8,
    },
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

  // 쿠팡파트너스 링크를 먼저 열고, 그 다음에 목적지 URL을 여는 함수 (수익 창출)
  const openWithCoupangAd = (targetUrl: string, windowOptions?: string) => {
    try {
      // 랜덤하게 쿠팡파트너스 링크 선택
      const coupangPartnersUrl = getRandomCoupangUrl();

      // 1. 목적지 URL을 새 탭에서 먼저 열기 (사용자가 원하는 페이지)
      const targetWindow = window.open(
        targetUrl,
        "_blank",
        windowOptions || ""
      );

      if (!targetWindow) {
        alert("팝업이 차단되었습니다. 팝업 차단을 해제해주세요.");
        return;
      }

      // 2. 현재 탭에서 쿠팡파트너스 링크로 이동 (수익 창출)
      setTimeout(() => {
        try {
          window.location.href = coupangPartnersUrl;
        } catch (error) {
          console.error("쿠팡파트너스 링크 이동 오류:", error);
          // 오류 발생 시 기본 페이지로 이동
          window.location.href = "https://b-mbti.money-hotissue.com";
        }
      }, 200); // 새 탭이 완전히 열린 후 현재 탭 이동
    } catch (error) {
      console.error("openWithCoupangAd 함수 오류:", error);
      // 오류 발생 시 기본적으로 새 탭에서만 열기
      window.open(targetUrl, "_blank", windowOptions || "");
    }
  };

  const handleShare = async () => {
    // 공유 URL 생성
    const shareUrl = `https://b-mbti.money-hotissue.com/?version=${completedVersion}`;

    // 링크 복사
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);

      // 복사 안내 표시
      alert("링크가 복사되었습니다! 친구들과 공유해보세요 😊");

      // 3초 후 복사 상태 초기화
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      // clipboard API 실패 시 대체 방법
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        alert("링크가 복사되었습니다! 친구들과 공유해보세요 😊");
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        alert("링크 복사에 실패했습니다.");
      }
      document.body.removeChild(textArea);
    }

    // 쿠팡 링크 열기
    window.open(getRandomCoupangUrl(), "_blank");
  };

  const handleShareOld = () => {
    // 새창에서 공유 옵션을 보여주는 함수
    const shareText = `🙏 성경인물 MBTI 테스트 결과 🙏\n\n저는 '${
      resultData?.character
    }(${resultType})' 유형이에요!\n\n${resultData?.description.slice(
      0,
      50
    )}...\n\n여러분도 테스트해보세요!`;
    const shareUrl = "https://gowith153.com";

    const newWindow = window.open(
      "",
      "_blank",
      "width=500,height=600,scrollbars=yes,resizable=yes"
    );
    if (newWindow) {
      newWindow.document.write(`
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>공유하기</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            body { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: #333; 
              padding: 20px; 
              min-height: 100vh; 
              display: flex; 
              flex-direction: column; 
              align-items: center; 
              justify-content: center; 
            }
            .container { 
              background: white; 
              border-radius: 16px; 
              padding: 24px; 
              box-shadow: 0 10px 25px rgba(0,0,0,0.1); 
              max-width: 400px; 
              width: 100%; 
            }
            h1 { 
              text-align: center; 
              margin-bottom: 24px; 
              color: #333; 
              font-size: 24px; 
            }
            .share-button { 
              display: block; 
              width: 100%; 
              padding: 16px; 
              margin: 12px 0; 
              border: none; 
              border-radius: 12px; 
              font-size: 16px; 
              font-weight: 600; 
              cursor: pointer; 
              transition: all 0.3s ease; 
              text-decoration: none; 
              text-align: center; 
            }
            .copy { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
            .copy:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3); }
            .back-button { 
              background: linear-gradient(135deg, #f093fb, #f5576c); 
              color: white; 
              padding: 12px 20px; 
              border: none; 
              border-radius: 8px; 
              margin-top: 20px; 
              cursor: pointer; 
              font-size: 14px; 
              width: 100%; 
            }
            .back-button:hover { transform: translateY(-2px); }
            @media (max-width: 480px) {
              body { padding: 16px; }
              .container { padding: 20px; }
              h1 { font-size: 20px; }
              .share-button { padding: 14px; font-size: 15px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>📤 공유하기</h1>
            
            <button class="share-button copy" onclick="copyLink()">
              🔗 링크 복사
            </button>
            
            <button class="back-button" onclick="window.close(); if(window.opener && !window.opener.closed) { window.opener.focus(); }">
              🏠 결과 페이지로 돌아가기
            </button>
          </div>
          
          <script>
            function copyLink() {
              const fullText = \`${shareText}\\n${shareUrl}\`;
              navigator.clipboard.writeText(fullText).then(() => {
                alert('📋 링크가 복사되었습니다!');
              }).catch(() => {
                // 복사 실패 시 대체 방법
                const textArea = document.createElement('textarea');
                textArea.value = fullText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('📋 링크가 복사되었습니다!');
              });
            }
          </script>
        </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const handleSNSShare = (platform: string) => {
    const shareText = `🙏 성경인물 MBTI 테스트 결과 🙏\n\n저는 '${
      resultData?.character
    }(${resultType})' 유형이에요!\n\n${resultData?.description.slice(
      0,
      50
    )}...\n\n여러분도 테스트해보세요!`;
    const shareUrl = "https://b-mbti.money-hotissue.com";

    if (platform === "copy") {
      navigator.clipboard
        .writeText(`${shareText}\n${shareUrl}`)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          setShowShareModal(false);
          alert("📋 링크가 복사되었습니다!");
        })
        .catch(() => {
          alert(
            "📱 다음 내용을 수동으로 복사해주세요:\n\n" +
              shareText +
              "\n\n" +
              shareUrl
          );
          setShowShareModal(false);
        });
    }
  };

  // 게임 점수 계산 함수
  const calculateGameScore = () => {
    if (totalGames === 0) return 0;
    return Math.round((gameScore / totalGames) * 100);
  };

  // 게임 점수 공유 함수
  const handleGameScoreShare = (platform: string) => {
    const scorePercentage = calculateGameScore();
    const shareText = `🎮 성경인물 맞히기 게임 결과 🎮\n\n정답률: ${scorePercentage}% (${gameScore}/${totalGames})\n\n${resultData?.character}(${resultType}) 유형인 저와 겨뤄보세요! 💪\n\n친구들도 도전해보세요!`;
    const shareUrl = "https://b-mbti.money-hotissue.com/game";

    if (platform === "copy") {
      navigator.clipboard
        .writeText(`${shareText}\n${shareUrl}`)
        .then(() => {
          alert("🎮 게임 결과가 클립보드에 복사되었습니다!");
          setShowScoreShare(false);
        })
        .catch(() => {
          alert(
            "📱 다음 내용을 수동으로 복사해주세요:\n\n" +
              shareText +
              "\n\n" +
              shareUrl
          );
          setShowScoreShare(false);
        });
    }
  };

  const handleSaveAsImage = async () => {
    try {
      // 이미지로 저장할 부분만 선택
      const captureElement = document.querySelector(".image-capture-area");
      if (!captureElement) {
        alert("결과 화면을 찾을 수 없습니다.");
        return;
      }

      // 이미지 캡처 처리 함수
      const processCapture = async () => {
        try {
          // @ts-ignore - html2canvas는 전역 변수로 로드됨
          const canvas = await (window as any).html2canvas(captureElement, {
            backgroundColor: "#ffffff",
            scale: 2, // scale을 낮춰서 안정성 향상
            useCORS: false, // CORS 비활성화
            allowTaint: false, // Taint 비활성화
            foreignObjectRendering: true, // SVG 등 외부 객체 렌더링 허용
            logging: false,
            ignoreElements: (element: HTMLElement) => {
              // 외부 이미지나 문제가 될 수 있는 요소 제외
              return (
                element.tagName === "IFRAME" ||
                element.classList.contains("ad-banner") ||
                (element.tagName === "IMG" &&
                  (element as HTMLImageElement).src &&
                  !(element as HTMLImageElement).src.startsWith(
                    window.location.origin
                  ))
              );
            },
          });

          // 캔버스를 이미지로 변환
          const dataURL = canvas.toDataURL("image/png", 1.0);

          // 다운로드 링크 생성
          const link = document.createElement("a");
          link.download = `성경인물-MBTI-${resultType}-${resultData?.character}.png`;
          link.href = dataURL;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // 이미지 저장 완료 후 쿠팡파트너스 링크 열기 및 사용자 안내
          setTimeout(() => {
            const coupangPartnersUrl = "https://link.coupang.com/a/cTTkqa";
            window.open(coupangPartnersUrl, "_blank");

            // 사용자에게 다운로드 위치 안내
            alert(
              "📸 이미지가 저장되었습니다!\n\n💡 저장 위치 확인:\n- Android: 다운로드 폴더 또는 갤러리\n- iPhone: 사진 앱의 다운로드 폴더\n- PC: 다운로드 폴더"
            );
          }, 500);
        } catch (error) {
          console.error("이미지 저장 실패:", error);
          alert("이미지 저장에 실패했습니다. 스크린샷을 이용해주세요.");
        }
      };

      // html2canvas가 이미 로드되었는지 확인
      if ((window as any).html2canvas) {
        await processCapture();
      } else {
        // 동적으로 html2canvas 라이브러리 로드
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
        script.crossOrigin = "anonymous"; // CORS 설정 추가
        document.head.appendChild(script);

        script.onload = async () => {
          await processCapture();
        };

        script.onerror = () => {
          alert("이미지 저장 라이브러리 로드에 실패했습니다.");
        };
      }
    } catch (error) {
      console.error("이미지 저장 중 오류:", error);
      alert("이미지 저장 중 오류가 발생했습니다.");
    }
  };

  // handleViewOtherCharacters 함수 제거됨

  const handleLeaveComment = () => {
    setShowComments(true);
    // 댓글 작성 시에도 쿠팡 파트너스 수익 창출
    setTimeout(() => {
      window.open(getRandomCoupangUrl(), "_blank");
    }, 1000);
  };

  const handleSubmitComment = () => {
    if (comment.trim()) {
      alert("💬 댓글이 등록되었습니다! (실제 서비스에서는 DB에 저장됩니다)");
      setComment("");
      setShowComments(false);
    }
  };

  const checkQuizAnswer = () => {
    if (!userGuess || userGuess.trim() === "") return;

    const isCorrect =
      userGuess.toLowerCase().trim() === quizCharacter.toLowerCase().trim();
    setQuizResult(isCorrect ? "correct" : "wrong");
  };

  const selectCharacterFromCandidates = (character: string) => {
    if (quizResult !== null) return; // 이미 답안 제출된 경우 선택 불가
    setUserGuess(character);
  };

  return (
    <div
      className="result-container p-3 md:p-6 bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-xl border border-white/30 w-full max-w-sm md:max-w-lg mx-auto text-center relative overflow-hidden"
      style={{ paddingBottom: "200px" }}
    >
      {/* 이미지 캡처 영역 시작 */}
      <div className="image-capture-area">
        {/* 결과 헤더 */}
        <div className="bg-white/90 rounded-2xl p-4 mb-6 shadow-sm border border-pink-100/50 backdrop-blur-sm">
          {/* 성경인물 정보 - 텍스트(왼쪽) / 이미지(오른쪽) 배치 */}
          <div className="flex items-center space-x-6">
            {/* 왼쪽: 텍스트 정보 */}
            <div className="flex-1">
              {/* 상단: 당신과 닮은 성경인물 */}
              <div className="mb-6">
                <div className="bg-blue-100 text-blue-700 rounded-full px-4 py-1 text-sm font-medium inline-block">
                  당신과 닮은 성경인물
                </div>
              </div>

              {/* 중간: 이름 */}
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center justify-center">
                  <span className="text-xl md:text-2xl mr-2">✨</span>
                  {resultData.character}
                </h1>
              </div>

              {/* 하단: MBTI 유형 */}
              <div>
                <div className="bg-gradient-to-r from-violet-500 to-pink-500 text-white px-6 py-2 rounded-full text-lg font-bold inline-block">
                  {resultType}
                </div>
              </div>
            </div>

            {/* 오른쪽: 이미지 */}
            <div className="flex-shrink-0">
              {resultData.image ? (
                <div className="space-y-2">
                  <div
                    className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
                    onClick={() => {
                      if (resultData.image) {
                        openImageInNewWindow(
                          resultData.image,
                          resultData.character
                        );
                      }
                    }}
                  >
                    <div className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 bg-white/80 rounded-2xl p-2 md:p-3 shadow-lg border border-pink-100/50 overflow-hidden relative">
                      <img
                        src={resultData.image}
                        alt={resultData.character}
                        className="w-full h-full object-cover rounded-xl shadow-md"
                        style={{
                          imageRendering: "crisp-edges",
                        }}
                      />
                    </div>
                  </div>

                  {/* 크게보기 버튼 - 이미지 하단에 항상 표시 */}
                  <button
                    onClick={() => {
                      if (resultData.image) {
                        openImageInNewWindow(
                          resultData.image,
                          resultData.character
                        );
                      }
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                  >
                    <span>🔍</span>
                    <span>크게보기</span>
                  </button>
                </div>
              ) : (
                <div className="w-48 h-48 md:w-56 md:h-56 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-sm flex items-center justify-center">
                  <p className="text-gray-500 text-sm">이미지 로딩중...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 설명 텍스트 - 가독성 개선 */}
        <div className="bg-white/90 rounded-2xl p-5 mb-6 shadow-sm border border-pink-100/50">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
            <span className="bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent mr-2">
              ✨
            </span>
            성격 특징
          </h3>
          <div className="space-y-3">
            {PERSONALITY_TRAITS[resultType]?.map((trait, index) => (
              <div key={index} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-violet-400 to-pink-400 text-white text-xs rounded-full flex items-center justify-center font-semibold mt-0.5">
                  {index + 1}
                </span>
                <p className="text-gray-700 text-sm leading-relaxed text-left">
                  {trait}
                </p>
              </div>
            )) ||
              // Fallback - 기존 로직
              (() => {
                const sentences = resultData.description
                  .split(".")
                  .filter((sentence) => sentence.trim());
                const targetSentences = sentences.slice(0, 5);
                while (targetSentences.length < 5 && sentences.length > 0) {
                  const additionalTraits = [
                    "깊은 사색과 성찰을 통해 지혜를 얻습니다",
                    "다른 사람들에게 선한 영향력을 끼칩니다",
                    "어려운 상황에서도 희망을 잃지 않습니다",
                    "진실한 마음으로 관계를 맺습니다",
                    "하나님의 뜻을 구하며 살아갑니다",
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
                      {sentence.trim()}
                      {sentence.includes(".") ? "" : "."}
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
              {copied ? "📋 복사됨!" : "🔗 공유하기"}
            </button>
          </div>
        </div>

        {/* 어울리는/어울리지 않는 성격 유형 섹션 */}
        <div className="mb-6 space-y-4 mt-6">
          {/* 어울리는 성격 유형 */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-3 md:p-4 shadow-sm border border-green-200">
            {(() => {
              const compatibleType = getCompatibleTypes(resultType)[0];
              if (!compatibleType) return null;
              return (
                <div className="space-y-3 md:space-y-4">
                  {/* 1. 제목과 MBTI 유형 */}
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    <h3 className="text-xs md:text-sm font-bold text-green-800">
                      어울리는 성격 유형 :
                    </h3>
                    <span className="bg-green-500 text-white text-xs md:text-sm font-bold px-2 md:px-3 py-1 rounded-full">
                      {compatibleType}
                    </span>
                    <span className="font-bold text-green-800 text-xs md:text-sm">
                      {RESULTS[compatibleType].character}
                    </span>
                    <span className="text-green-600 text-sm md:text-base">
                      💚
                    </span>
                  </div>

                  {/* 2. 이미지 */}
                  <div className="flex justify-center">
                    <div className="w-24 h-24 md:w-32 md:h-32 relative cursor-pointer">
                      <img
                        src={getMbtiImage(compatibleType)}
                        alt={RESULTS[compatibleType].character}
                        className="w-full h-full object-cover rounded-lg shadow-md transition-transform hover:scale-105"
                        onClick={() => {
                          openImageInNewWindow(
                            getMbtiImage(compatibleType),
                            RESULTS[compatibleType].character
                          );
                        }}
                      />
                      {/* 이미지 안에 크게보기 버튼 - 항상 표시 */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs text-center py-1 rounded-b-lg">
                        🔍 크게보기
                      </div>
                    </div>
                  </div>

                  {/* 3. 설명 */}
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-2 md:p-3 border border-green-200">
                    <p className="text-xs md:text-sm text-gray-700 leading-relaxed text-center">
                      {getCompatibilityReason(resultType, compatibleType)}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* 어울리지 않는 성격 유형 */}
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-3 md:p-4 shadow-sm border border-red-200">
            {(() => {
              const incompatibleType = getIncompatibleTypes(resultType)[0];
              if (!incompatibleType) return null;
              return (
                <div className="space-y-3 md:space-y-4">
                  {/* 1. 제목과 MBTI 유형 */}
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    <h3 className="text-xs md:text-sm font-bold text-red-800">
                      주의해야 할 성격 유형 :
                    </h3>
                    <span className="bg-red-500 text-white text-xs md:text-sm font-bold px-2 md:px-3 py-1 rounded-full">
                      {incompatibleType}
                    </span>
                    <span className="font-bold text-red-800 text-xs md:text-sm">
                      {RESULTS[incompatibleType].character}
                    </span>
                    <span className="text-red-600 text-sm md:text-base">
                      💔
                    </span>
                  </div>

                  {/* 2. 이미지 */}
                  <div className="flex justify-center">
                    <div className="w-24 h-24 md:w-32 md:h-32 relative cursor-pointer">
                      <img
                        src={getMbtiImage(incompatibleType)}
                        alt={RESULTS[incompatibleType].character}
                        className="w-full h-full object-cover rounded-lg shadow-md transition-transform hover:scale-105"
                        onClick={() => {
                          openImageInNewWindow(
                            getMbtiImage(incompatibleType),
                            RESULTS[incompatibleType].character
                          );
                        }}
                      />
                      {/* 이미지 안에 크게보기 버튼 - 항상 표시 */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs text-center py-1 rounded-b-lg">
                        🔍 크게보기
                      </div>
                    </div>
                  </div>

                  {/* 3. 설명 */}
                  <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-xl p-2 md:p-3 border border-red-200">
                    <p className="text-xs md:text-sm text-gray-700 leading-relaxed text-center">
                      {getIncompatibilityReason(resultType, incompatibleType)}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
            <p className="text-xs text-gray-600 text-center">
              💡 MBTI 기반 궁합 분석 (개인차 있음)
            </p>
          </div>
        </div>
      </div>{" "}
      {/* image-capture-area 끝 */}
      {/* 나머지 테스트 추천 섹션 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6 border border-blue-100/50">
        <div className="text-center">
          <h3 className="font-bold text-gray-800 mb-2 flex items-center justify-center">
            <span className="mr-2">🔥</span>
            다른 테스트도 해보실래요?
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            더 정확한 분석을 위해 추가 테스트 해보세요! 🎯
          </p>

          <div className="grid grid-cols-1 gap-3">
            {Object.entries(TEST_VERSIONS)
              .filter(
                ([versionKey]) => parseInt(versionKey) !== completedVersion
              )
              .map(([versionKey, version]) => (
                <div
                  key={versionKey}
                  className={`bg-gradient-to-r ${
                    version.color === "orange"
                      ? "from-orange-50 to-amber-50 border-orange-200"
                      : version.color === "purple"
                      ? "from-purple-50 to-pink-50 border-purple-200"
                      : "from-blue-50 to-cyan-50 border-blue-200"
                  } rounded-xl p-4 border hover:shadow-md transition-all duration-200 cursor-pointer transform hover:scale-[1.02]`}
                  onClick={() => {
                    const versionNum = parseInt(versionKey);
                    if (onStartTest) {
                      // 앱 내부에서 상태 변경
                      onStartTest(versionNum);
                    } else {
                      // 웹에서는 URL 변경
                      const testUrls = {
                        1: "https://b-mbti.money-hotissue.com/test1",
                        2: "https://b-mbti.money-hotissue.com/test2",
                        3: "https://b-mbti.money-hotissue.com/test3",
                      };
                      window.location.href =
                        testUrls[versionNum as keyof typeof testUrls];
                    }
                  }}
                >
                  <div className="text-center">
                    <div className="text-left mb-3">
                      <div className="font-bold text-gray-800 text-base mb-1">
                        {version.name}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {version.description}
                      </div>
                      <div
                        className={`text-xs ${
                          version.color === "orange"
                            ? "text-orange-700"
                            : version.color === "purple"
                            ? "text-purple-700"
                            : "text-blue-700"
                        }`}
                      >
                        {parseInt(versionKey) === 1 &&
                          "💭 예배와 기도를 중요하게 생각하는 분들에게 추천"}
                        {parseInt(versionKey) === 2 &&
                          "🧠 신앙 고민에 대한 답을 찾고 싶은 분들에게 추천"}
                        {parseInt(versionKey) === 3 &&
                          "⚡ 실제 생활에서 신앙을 실천하는 분들에게 추천"}
                      </div>
                    </div>
                    <div className="w-full">
                      <span
                        className={`w-full block px-4 py-3 rounded-xl font-semibold text-sm text-center ${
                          version.color === "orange"
                            ? "bg-orange-500 text-white"
                            : version.color === "purple"
                            ? "bg-purple-500 text-white"
                            : "bg-blue-500 text-white"
                        }`}
                      >
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
      <div className="space-y-3 md:space-y-4">
        {/* 성경인물 맞히기 게임 - 참여 유도 문구로 변경 */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-3 md:p-4 mb-4 md:mb-6 border-2 border-indigo-200 shadow-md">
          <div className="text-center">
            <h3 className="font-bold text-indigo-800 mb-2 flex items-center justify-center text-sm md:text-base">
              <span className="mr-2">🖼️</span>
              성경인물 맞히기 게임!
            </h3>
            <p className="text-xs md:text-sm text-indigo-600 mb-3">
              이미지를 보고 누구인지 맞춰보세요 ✨
            </p>

            {/* 문제 예시 */}
            <div className="mb-4 p-3 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl border border-indigo-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-300 flex-shrink-0">
                  <img
                    src="/ISFP 다윗.jpg"
                    alt="다윗"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/ENFP 아브라함.jpg"; // 기본 이미지로 대체
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-600 mb-1">문제 예시:</div>
                  <div className="text-sm font-medium text-gray-800">
                    이 사람은 누구일까요?
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="text-center py-1.5 bg-white rounded text-xs text-gray-600 border">
                  다윗
                </div>
                <div className="text-center py-1.5 bg-white rounded text-xs text-gray-600 border">
                  모세
                </div>
                <div className="text-center py-1.5 bg-white rounded text-xs text-gray-600 border">
                  아브라함
                </div>
                <div className="text-center py-1.5 bg-white rounded text-xs text-gray-600 border">
                  솔로몬
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                // 결과 정보를 localStorage에 임시 저장 (돌아가기 기능용)
                localStorage.setItem(
                  "tempResult",
                  JSON.stringify({
                    type: resultType,
                    character: resultData?.character || "",
                    timestamp: Date.now(),
                  })
                );

                // 앱 내부에서는 onQuizGame 콜백 사용
                if (onQuizGame) {
                  onQuizGame();
                } else {
                  // 웹에서는 기존 방식 사용
                  openWithCoupangAd("/game");
                }
              }}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 md:py-4 px-4 md:px-6 rounded-2xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-[1.02] shadow-sm text-sm md:text-base"
            >
              🖼️ 게임 시작하기
            </button>

            {/* 게임 점수 표시 (게임을 한 번이라도 했을 때만 표시) */}
            {totalGames > 0 && (
              <div className="mt-3 md:mt-4 p-2 md:p-3 bg-white/80 rounded-xl border border-indigo-200">
                <div className="flex items-center justify-between mb-1 md:mb-2">
                  <span className="text-xs md:text-sm font-semibold text-indigo-800">
                    🏆 내 게임 기록
                  </span>
                  <button
                    onClick={() => setShowScoreShare(true)}
                    className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full hover:bg-indigo-200 transition-colors"
                  >
                    📤 공유
                  </button>
                </div>
                <div className="text-center">
                  <div className="text-base md:text-lg font-bold text-indigo-700">
                    정답률: {calculateGameScore()}%
                  </div>
                  <div className="text-xs text-gray-600">
                    ({gameScore}/{totalGames} 정답)
                  </div>
                </div>
              </div>
            )}

            {/* 랜덤 게임 참여 유도 멘트 */}
            <div className="mt-2 md:mt-3 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100">
              <p className="text-xs text-gray-600 text-center leading-relaxed">
                {randomPrompt}
              </p>
            </div>
          </div>
        </div>

        {/* 다시 테스트 버튼 */}
        <button
          onClick={() => {
            // completedVersion이 있으면 시작 페이지로 버전 정보와 함께 이동
            if (completedVersion) {
              openWithCoupangAd(
                `https://b-mbti.money-hotissue.com/?version=${completedVersion}`
              );
            } else {
              onRestart();
              // 다시 테스트 시에도 쿠팡 파트너스 수익 창출
              setTimeout(() => {
                window.open(getRandomCoupangUrl(), "_blank");
              }, 1000);
            }
          }}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium py-2.5 md:py-3 px-3 md:px-4 rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-sm text-sm md:text-base"
        >
          🔁 다시 테스트하기
        </button>

        {/* 후기 남기기 */}
        <button
          onClick={handleLeaveComment}
          className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium py-2.5 md:py-3 px-3 md:px-4 rounded-2xl hover:from-green-600 hover:to-teal-600 transition-all duration-200 shadow-sm text-sm md:text-base"
        >
          💬 후기 남기기
        </button>
      </div>
      {/* SNS 공유 모달 */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 md:p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl mx-3">
            <h3 className="text-lg md:text-xl font-bold text-center mb-4 md:mb-6">
              📤 결과 공유하기
            </h3>
            <button
              onClick={() => handleSNSShare("copy")}
              className="w-full p-4 md:p-6 bg-gray-100 text-gray-700 rounded-xl md:rounded-2xl font-semibold mb-3 md:mb-4 text-sm md:text-base"
            >
              📋 링크 복사
            </button>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full p-3 md:p-4 text-gray-500 text-sm md:text-base"
            >
              취소
            </button>
          </div>
        </div>
      )}
      {/* 게임 점수 공유 모달 */}
      {showScoreShare && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 md:p-4">
          <div className="bg-white rounded-3xl p-4 md:p-6 max-w-xs md:max-w-sm w-full shadow-2xl mx-3">
            <h3 className="text-base md:text-lg font-bold text-center mb-3 md:mb-4">
              🏆 게임 결과 공유하기
            </h3>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl md:rounded-2xl p-3 md:p-4 mb-3 md:mb-4 text-center">
              <div className="text-lg md:text-xl font-bold text-indigo-700 mb-1">
                정답률: {calculateGameScore()}%
              </div>
              <div className="text-xs md:text-sm text-gray-600">
                ({gameScore}/{totalGames} 문제 정답)
              </div>
              <div className="text-xs text-indigo-600 mt-1 md:mt-2">
                친구들과 경쟁해보세요! 💪
              </div>
            </div>
            <button
              onClick={() => handleGameScoreShare("copy")}
              className="w-full p-3 md:p-4 bg-gray-100 text-gray-700 rounded-xl md:rounded-2xl font-semibold mb-2 md:mb-3 text-sm md:text-base"
            >
              📋 결과 복사
            </button>
            <button
              onClick={() => setShowScoreShare(false)}
              className="w-full p-2 md:p-3 text-gray-500 text-xs md:text-sm"
            >
              취소
            </button>
          </div>
        </div>
      )}
      {/* 후기 남기기 모달 */}
      {showComments && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl max-h-96 overflow-y-auto">
            <h3 className="text-lg font-bold text-center mb-4">
              💬 후기 남기기
            </h3>
            <div className="mb-4 space-y-3">
              {fakeComments.map((c) => (
                <div key={c.id} className="p-3 bg-gray-50 rounded-2xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-gray-800">
                      {c.user}
                    </span>
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
              <button
                onClick={handleSubmitComment}
                className="flex-1 p-3 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-2xl font-semibold text-sm"
              >
                등록
              </button>
              <button
                onClick={() => setShowComments(false)}
                className="px-4 p-3 text-gray-500 text-sm"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 삭제된 게임 모달 섹션 - 더 이상 필요 없음 */}
      {false && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-center mb-4">
              🎮 성경인물 맞히기 게임
            </h3>

            <div className="text-center mb-6">
              {/* 캐릭터 이미지 */}
              <div className="mb-4 bg-gradient-to-br from-violet-50 to-pink-50 rounded-2xl p-4">
                <div className="w-32 h-32 mx-auto mb-3 bg-white rounded-xl shadow-md flex items-center justify-center overflow-hidden">
                  {currentQuizType && (
                    <img
                      src={`/${
                        currentQuizType === "ENFJ"
                          ? "ENJS 느헤미야"
                          : currentQuizType === "ENTP"
                          ? "ENFP 아브라함"
                          : `${currentQuizType} ${
                              RESULTS[currentQuizType as keyof typeof RESULTS]
                                .character
                            }`
                      }.jpg`}
                      alt="성경인물"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/ENFP 아브라함.jpg";
                      }}
                    />
                  )}
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  이 사람은 누구일까요? 🤔
                </h4>

                {/* 선택된 답안 표시 */}
                {userGuess && quizResult === null && (
                  <div className="mt-3 p-3 bg-blue-100 text-blue-700 rounded-xl">
                    선택한 답안: <strong>{userGuess}</strong>
                  </div>
                )}

                {quizResult && (
                  <div
                    className={`mt-3 p-3 rounded-xl ${
                      quizResult === "correct"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {quizResult === "correct"
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
                    onClick={() =>
                      selectCharacterFromCandidates(RESULTS[type].character)
                    }
                    disabled={quizResult !== null}
                    className={`p-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                      userGuess === RESULTS[type].character &&
                      quizResult === null
                        ? "bg-blue-200 text-blue-800 border-2 border-blue-400"
                        : quizResult !== null &&
                          RESULTS[type].character === quizCharacter
                        ? "bg-green-200 text-green-800 border-2 border-green-400"
                        : quizResult === null
                        ? "bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700"
                        : "bg-gray-50 text-gray-400"
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
                  disabled={!userGuess || userGuess.trim() === ""}
                  className={`flex-1 p-3 rounded-2xl font-semibold transition-all duration-200 ${
                    userGuess && userGuess.trim() !== ""
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
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
                onClick={() => {}}
                className="px-6 p-3 text-gray-500 text-sm hover:bg-gray-100 rounded-2xl"
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
      {/* 푸터 */}
      <div className="mt-8 pt-6 border-t border-gray-200/50">
        <div className="space-y-2 text-center">
          <p className="text-xs text-gray-500">
            쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를
            제공받습니다.
          </p>
          <p className="text-xs text-gray-400">
            © 2025 B-MBTI. All rights reserved.
          </p>
        </div>
      </div>
      {/* 이미지 확대 모달 */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="relative bg-white rounded-2xl p-4 max-w-2xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all"
            >
              ✕
            </button>

            {/* 제목 */}
            {modalImageTitle && (
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center">
                {modalImageTitle}
              </h2>
            )}

            {/* 이미지 */}
            <img
              src={modalImageSrc}
              alt={modalImageTitle}
              className="w-full h-auto rounded-xl shadow-lg"
            />

            {/* 닫기 버튼 (하단) */}
            <button
              onClick={() => setShowImageModal(false)}
              className="mt-4 w-full py-3 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultScreen;
