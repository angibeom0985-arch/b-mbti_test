import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import type { MbtiType, MbtiResult } from "../types";
import { RESULTS, TEST_VERSIONS, PERSONALITY_TRAITS } from "../constants";
import RestartIcon from "./icons/RestartIcon";
import LoadingIndicator from "./LoadingIndicator";
import ShareIcon from "./icons/ShareIcon";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { Capacitor } from "@capacitor/core";

// 荑좏뙜 ?뚰듃?덉뒪 留곹겕 諛곗뿴
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

// ?쒕뜡 荑좏뙜 ?뚰듃?덉뒪 留곹겕 ?좏깮 ?⑥닔
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

// 16媛吏 MBTI ?좏삎怨???묓븯???깃꼍?몃Ъ??const ALL_CHARACTERS = Object.keys(RESULTS) as MbtiType[];

// ?명솚???곗씠?곕? 而댄룷?뚰듃 ?몃?濡??대룞 (??踰덈쭔 ?앹꽦)
const COMPATIBILITY_MAP: Record<MbtiType, MbtiType[]> = {
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

const INCOMPATIBILITY_MAP: Record<MbtiType, MbtiType[]> = {
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

// ?댁슱由щ뒗 ?깃꺽 ?좏삎 異붿쿇 濡쒖쭅
const getCompatibleTypes = (currentType: MbtiType): MbtiType[] => {
  return COMPATIBILITY_MAP[currentType] || [];
};

// ?댁슱由ъ? ?딅뒗 ?깃꺽 ?좏삎 (異⑸룎?섍린 ?ъ슫 ?좏삎)
const getIncompatibleTypes = (currentType: MbtiType): MbtiType[] => {
  return INCOMPATIBILITY_MAP[currentType] || [];
};

// ?명솚???댁쑀 ?ㅻ챸
const getCompatibilityReason = (
  currentType: MbtiType,
  targetType: MbtiType
): string => {
  const reasons: Record<string, string> = {
    "ENFP-INFJ":
      "Warm empathy meets depth, creating supportive and meaningful conversations.",
    "ENFP-INTJ":
      "Creativity and vision meet structured planning for balanced growth.",
    "ENFJ-INFP":
      "Shared values and care for people build steady emotional harmony.",
    "ENTP-INFJ":
      "Ideas spark while insight keeps them grounded, forming a thoughtful duo.",
    "ENTJ-INFP":
      "Decisive leadership pairs with empathy, inspiring purpose with compassion.",
    "ESFP-ISFJ":
      "Spontaneity and steady support balance daily life with encouragement.",
    "ESFJ-ISFP":
      "Kindness and sensitivity blend, making a considerate and gentle partnership.",
    "ESTP-ISFJ":
      "Action-oriented energy meets reliability, helping each other stay balanced.",
    "ESTJ-ISFP":
      "Practical structure supports creativity, giving freedom with safety.",
    "INFP-ENFJ":
      "Shared ideals and care create a nurturing, value-driven relationship.",
    "INFJ-ENFP":
      "Insightful reflection meets enthusiasm, bringing out each other's strengths.",
    "INTP-ENFJ":
      "Analysis and encouragement combine for thoughtful growth and learning.",
    "INTJ-ENFP":
      "Strategic vision meets inspiration, motivating each other toward goals.",
    "ISFP-ESFJ":
      "Gentle empathy and attentive care build a warm, supportive bond.",
    "ISFJ-ESFP":
      "Stability and fun blend, making everyday moments enjoyable and secure.",
    "ISTP-ESFJ":
      "Calm problem-solving pairs with sociable warmth, balancing independence.",
    "ISTJ-ESFP":
      "Reliable planning supports lively spontaneity, keeping life steady yet fun.",
  };

  const key = `${currentType}-${targetType}`;
  return (
    reasons[key] ||
    "Practical strengths complement each other, leading to supportive teamwork."
  );
};

const getIncompatibilityReason = (
  currentType: MbtiType,
  targetType: MbtiType
): string => {
  const reasons: Record<string, string> = {
    "ENFP-ISTJ":
      "Different pacing and structure preferences can create friction in plans.",
    "ENFP-ISTP":
      "Spontaneous feelings and reserved pragmatism may struggle to align.",
    "ENFJ-ISTP":
      "Emotion-first decisions versus independent logic can feel conflicting.",
    "ENTP-ISFJ":
      "Constant change can exhaust those who value consistency and calm.",
    "ENTJ-ISFJ":
      "Direct leadership may feel overwhelming to someone seeking steady support.",
    "ESFP-INTJ":
      "Present-focused action and long-term strategy can clash without compromise.",
    "ESFJ-INTP":
      "Structured expectations and analytical detachment may frustrate both sides.",
    "ESTP-INFJ":
      "Fast moves versus reflective processing often lead to misunderstandings.",
    "ESTJ-INFP":
      "Orderly enforcement can feel harsh to values-driven, flexible partners.",
    "INFP-ESTJ":
      "Idealism versus strict structure can create tension over priorities.",
    "INFJ-ESTP":
      "Need for depth and planning can collide with impulsive experimentation.",
    "INTP-ESFJ":
      "Detached analysis and relational focus may feel at odds day-to-day.",
    "INTJ-ESFP":
      "Future-minded strategy versus in-the-moment enjoyment can cause disconnects.",
    "ISFP-ENTJ":
      "Gentle spontaneity may feel pressured by direct, results-first drives.",
    "ISFJ-ENTP":
      "Desire for stability can conflict with constant debate and change.",
    "ISTP-ENFJ":
      "Reserved independence may resist coordinated, people-centered planning.",
    "ISTJ-ENFP":
      "Strict routines can feel limiting to flexible, exploratory partners.",
  };

  const key = `${currentType}-${targetType}`;
  return (
    reasons[key] ||
    "Different priorities and pacing can cause friction; clear communication helps."
  );
};

const getMbtiImage = (type: MbtiType): string => {
  const imageMap: Record<MbtiType, string> = {
    ENFP: "/ENFP ?꾨툕?쇳븿.jpg",
    ENFJ: "/ENJS ?먰뿤誘몄빞.jpg",
    ENTJ: "/ENTJ ?쒕낫??jpg",
    ENTP: "/ENFP ?꾨툕?쇳븿.jpg", // ENTP ?뚯씪???놁뼱???꾩떆濡?ENFP ?ъ슜
    ESFJ: "/ESFJ 留됰떖??留덈━??jpg",
    ESFP: "/ESFP ?먯뒪??jpg",
    ESTJ: "/ESTJ 紐⑥꽭.jpg",
    ESTP: "/ESTP 踰좊뱶濡?jpg",
    INFJ: "/INFJ ?ㅻ땲??jpg",
    INFP: "/INFP 留덈━??jpg",
    INTJ: "/INTJ 諛붿슱.jpg",
    INTP: "/INTP ?붾줈紐?jpg",
    ISFJ: "/ISFJ 猷?jpg",
    ISFP: "/ISFP ?ㅼ쐵.jpg",
    ISTJ: "/ISTJ ?붿뀎.jpg",
    ISTP: "/ISTP ?쇱넀.jpg",
  };

  return imageMap[type] || "/ENFP ?꾨툕?쇳븿.jpg";
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
  const captureRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  // showOtherCharacters ?곹깭 ?쒓굅??  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedTestVersion, setSelectedTestVersion] = useState<number | null>(
    null
  );

  // ?댁쫰 寃뚯엫 ?곹깭
  const [quizCharacter, setQuizCharacter] = useState<string>("");
  const [userGuess, setUserGuess] = useState("");
  const [quizResult, setQuizResult] = useState<"correct" | "wrong" | null>(
    null
  );
  const [currentQuizType, setCurrentQuizType] = useState<string>("");

  // 寃뚯엫 ?먯닔 愿???곹깭
  const [gameScore, setGameScore] = useState(0);
  const [totalGames, setTotalGames] = useState(0);
  const [showScoreShare, setShowScoreShare] = useState(false);

  // 以묐났 諛⑹?瑜??꾪븳 ?ъ슜??罹먮┃??異붿쟻
  const [usedCharacters, setUsedCharacters] = useState<string[]>([]);

  // ?대?吏 紐⑤떖 ?곹깭
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");
  const [modalImageTitle, setModalImageTitle] = useState("");

  // 紐⑤떖 ?대┫ ??body ?ㅽ겕濡?留됯린
  useEffect(() => {
    if (showImageModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showImageModal]);

  // ?쒕뜡 硫섑듃 ?좏깮 (useMemo濡?理쒖쟻??
  const randomPrompt = useMemo(() => {
    const gamePromptMessages = [
      "?? ?? ?? ?? ?? ????? ???? ?? ??!",
      "???? ?? ????. ???? ?? ??? ??????.",
      "?? ???? ?? ??! ?? ??? ??? ??????.",
      "??? ????. ?? ???? ??? ?????!",
      "?? ??? ???? ?? ??? ?????.",
      "??? ??? ?? ?? ??, ?? ? ? ?????",
      "?? ???? ??, ?? ??? ???!",
      "??? ??? ???? ? ?????. ?? ? ?? ?????",
    ];
    return gamePromptMessages[
      Math.floor(Math.random() * gamePromptMessages.length)
    ];
  }, []);

const previewCharacter = useMemo(() => {
    const allTypes = Object.keys(RESULTS) as (keyof typeof RESULTS)[];
    const randomType = allTypes[Math.floor(Math.random() * allTypes.length)];
    return {
      type: randomType,
      character: RESULTS[randomType].character,
      image: getMbtiImage(randomType),
    };
  }, []);

  // Restore quiz mini-game score from localStorage
  useEffect(() => {
    const savedScore = localStorage.getItem("quizGameScore");
    const savedTotal = localStorage.getItem("quizGameTotal");

    if (savedScore && savedTotal) {
      setGameScore(parseInt(savedScore, 10));
      setTotalGames(parseInt(savedTotal, 10));
    }
  }, []);

  // Select a random character for the quiz and reset the pool when all are used
  const getRandomCharacter = useCallback(() => {
    let availableCharacters = ALL_CHARACTERS.filter(
      (type) => !usedCharacters.includes(type)
    );

    if (availableCharacters.length === 0) {
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
  }, [usedCharacters, currentQuizType]);

  // Open the image in a modal (mobile friendly)
  const openImageInModal = useCallback(
    (imageSrc: string, characterName: string) => {
      setModalImageSrc(imageSrc);
      setModalImageTitle(characterName);
      setShowImageModal(true);
    },
    []
  );

  const openImageInNewWindow = useCallback(
    (imageSrc: string, characterName: string) => {
      openImageInModal(imageSrc, characterName);
      return;

      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${characterName} - ?깃꼍?몃Ъ MBTI</title>
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
            <button class="close-button" onclick="window.close()">횞</button>
            <img src="${window.location.origin}${imageSrc}" alt="${characterName}" />
            <h1>${characterName}</h1>
            <button class="back-button" onclick="window.close(); if(window.opener && !window.opener.closed) { window.opener.focus(); }">
              ?룧 寃곌낵 ?섏씠吏濡??뚯븘媛湲?            </button>
          </div>
        </body>
        </html>
      `);
        newWindow.document.close();
      }
    },
    [openImageInModal]
  );

  // Sample social proof comments shown under the result
  const fakeComments = [
    {
      id: 1,
      user: "??",
      comment: "??? ?? ????! ???? ? ???? ???.",
      likes: 23,
    },
    {
      id: 2,
      user: "??",
      comment: "?? ??? ???? ???? ???.",
      likes: 18,
    },
    {
      id: 3,
      user: "??",
      comment: "???? ??? ???? ??? ????.",
      likes: 12,
    },
    {
      id: 4,
      user: "??",
      comment: `${resultData?.character} ???? ? ? ???!`,
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
        <h2 className="text-xl font-semibold text-red-600 mb-4">??? ???? ????</h2>
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

  // 荑좏뙜?뚰듃?덉뒪 留곹겕瑜?癒쇱? ?닿퀬, 洹??ㅼ쓬??紐⑹쟻吏 URL???щ뒗 ?⑥닔 (?섏씡 李쎌텧)
  const openWithCoupangAd = (targetUrl: string, windowOptions?: string) => {
    try {
      // ?쒕뜡?섍쾶 荑좏뙜?뚰듃?덉뒪 留곹겕 ?좏깮
      const coupangPartnersUrl = getRandomCoupangUrl();

      // 1. 紐⑹쟻吏 URL??????뿉??癒쇱? ?닿린 (?ъ슜?먭? ?먰븯???섏씠吏)
      const targetWindow = window.open(
        targetUrl,
        "_blank",
        windowOptions || ""
      );

      if (!targetWindow) {
        alert("?앹뾽??李⑤떒?섏뿀?듬땲?? ?앹뾽 李⑤떒???댁젣?댁＜?몄슂.");
        return;
      }

      // 2. ?꾩옱 ??뿉??荑좏뙜?뚰듃?덉뒪 留곹겕濡??대룞 (?섏씡 李쎌텧)
      setTimeout(() => {
        try {
          window.location.href = coupangPartnersUrl;
        } catch (error) {
          console.error("荑좏뙜?뚰듃?덉뒪 留곹겕 ?대룞 ?ㅻ쪟:", error);
          // ?ㅻ쪟 諛쒖깮 ??湲곕낯 ?섏씠吏濡??대룞
          window.location.href = "https://b-mbti.money-hotissue.com";
        }
      }, 200); // ????씠 ?꾩쟾???대┛ ???꾩옱 ???대룞
    } catch (error) {
      console.error("openWithCoupangAd ?⑥닔 ?ㅻ쪟:", error);
      // ?ㅻ쪟 諛쒖깮 ??湲곕낯?곸쑝濡?????뿉?쒕쭔 ?닿린
      window.open(targetUrl, "_blank", windowOptions || "");
    }
  };

  const handleShare = async () => {
    const shareUrl = `https://b-mbti.money-hotissue.com/?version=${completedVersion}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      alert("??? ???????. ???? ??? ???!");
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();

      try {
        document.execCommand("copy");
        setCopied(true);
        alert("??? ???????. ???? ??? ???!");
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        alert("?? ??? ??????. ?? ??? ???.");
      } finally {
        document.body.removeChild(textArea);
      }
    }

    window.open(getRandomCoupangUrl(), "_blank");
  };

  const handleShareOld = () => {
    openWithCoupangAd("/share");
  };

  const handleSNSShare = (platform: string) => {
    const shareText = `?솋 ?깃꼍?몃Ъ MBTI ?뚯뒪??寃곌낵 ?솋\n\n???'${
      resultData?.character
    }(${resultType})' ?좏삎?댁뿉??\n\n${resultData?.description.slice(
      0,
      50
    )}...\n\n?щ윭遺꾨룄 ?뚯뒪?명빐蹂댁꽭??`;
    const shareUrl = "https://b-mbti.money-hotissue.com";

    if (platform === "copy") {
      navigator.clipboard
        .writeText(`${shareText}\n${shareUrl}`)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          setShowShareModal(false);
          alert("?뱥 留곹겕媛 蹂듭궗?섏뿀?듬땲??");
        })
        .catch(() => {
          alert(
            "?벑 ?ㅼ쓬 ?댁슜???섎룞?쇰줈 蹂듭궗?댁＜?몄슂:\n\n" +
              shareText +
              "\n\n" +
              shareUrl
          );
          setShowShareModal(false);
        });
    }
  };

  // 寃뚯엫 ?먯닔 怨꾩궛 ?⑥닔
  const calculateGameScore = () => {
    if (totalGames === 0) return 0;
    return Math.round((gameScore / totalGames) * 100);
  };

  // 寃뚯엫 ?먯닔 怨듭쑀 ?⑥닔
  const handleGameScoreShare = (platform: string) => {
    const scorePercentage = calculateGameScore();
    const shareText = `?렜 ?깃꼍?몃Ъ 留욏엳湲?寃뚯엫 寃곌낵 ?렜\n\n?뺣떟瑜? ${scorePercentage}% (${gameScore}/${totalGames})\n\n${resultData?.character}(${resultType}) ?좏삎???? 寃⑤쨪蹂댁꽭?? ?뮞\n\n移쒓뎄?ㅻ룄 ?꾩쟾?대낫?몄슂!`;
    const shareUrl = "https://b-mbti.money-hotissue.com/game";

    if (platform === "copy") {
      navigator.clipboard
        .writeText(`${shareText}\n${shareUrl}`)
        .then(() => {
          alert("?렜 寃뚯엫 寃곌낵媛 ?대┰蹂대뱶??蹂듭궗?섏뿀?듬땲??");
          setShowScoreShare(false);
        })
        .catch(() => {
          alert(
            "?벑 ?ㅼ쓬 ?댁슜???섎룞?쇰줈 蹂듭궗?댁＜?몄슂:\n\n" +
              shareText +
              "\n\n" +
              shareUrl
          );
          setShowScoreShare(false);
        });
    }
  };

  const waitForImagesToLoad = useCallback(async (element: HTMLElement) => {
    const images = Array.from(element.querySelectorAll("img"));

    await Promise.all(
      images.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete && img.naturalWidth > 0) {
              resolve();
              return;
            }

            const handleLoad = () => {
              img.removeEventListener("load", handleLoad);
              img.removeEventListener("error", handleLoad);
              resolve();
            };

            img.addEventListener("load", handleLoad);
            img.addEventListener("error", handleLoad);
          })
      )
    );
  }, []);

  const handleSaveAsImage = async () => {
    try {
      const captureElement = captureRef.current;
      if (!captureElement) {
        alert("\uacb0\uacfc \ud654\uba74\uc744 \ucc3e\uc744 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.");
        return;
      }

      const processCapture = async () => {
        try {
          const hiddenElements = Array.from(
            captureElement.querySelectorAll("[data-hide-on-capture]")
          ) as HTMLElement[];
          const previousDisplay = hiddenElements.map(
            (element) => element.style.display
          );

          hiddenElements.forEach((element) => {
            element.style.display = "none";
          });

          let canvas: HTMLCanvasElement | null = null;

          try {
            await waitForImagesToLoad(captureElement);

            const rect = captureElement.getBoundingClientRect();
            const width = Math.ceil(captureElement.scrollWidth || rect.width);
            const height = Math.ceil(
              captureElement.scrollHeight || rect.height
            );
            const currentScrollX = window.scrollX;
            const currentScrollY = window.scrollY;
            const originalBodyOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";

            // @ts-ignore - html2canvas? ?? ??? ???
            canvas = await (window as any).html2canvas(captureElement, {
              backgroundColor: "#ffffff",
              scale: 2,
              useCORS: true,
              allowTaint: false,
              foreignObjectRendering: true,
              logging: false,
              scrollX: -currentScrollX,
              scrollY: -currentScrollY,
              width,
              height,
              windowWidth: width,
              windowHeight: height,
              ignoreElements: (element: HTMLElement) => {
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
          } finally {
            hiddenElements.forEach((element, index) => {
              element.style.display = previousDisplay[index];
            });
            document.body.style.overflow = originalBodyOverflow;
          }

          if (!canvas) {
            throw new Error("\uadf8\ub9bc \uce94\ubc84\uc2a4 \uc0dd\uc131\uc5d0 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4.");
          }

          const dataURL = canvas.toDataURL("image/png", 1.0);
          const fileName = `\uc131\uacbd\uc778\ubb3c-MBTI-${resultType}-${resultData?.character}.png`;

          if (Capacitor.isNativePlatform()) {
            try {
              const base64Data = dataURL.split(",")[1];

              await Share.share({
                title: "\uc131\uacbd\uc778\ubb3c MBTI \uacb0\uacfc",
                text: `\ub2f9\uc2e0\uc758 \uc131\uacbd\uc778\ubb3c\uc740 ${resultData?.character}\uc785\ub2c8\ub2e4`,
                url: dataURL,
                dialogTitle: "\uc774\ubbf8\uc9c0 \uc800\uc7a5 \uc704\uce58 \uc120\ud0dd",
              });

              setTimeout(() => {
                window.open(getRandomCoupangUrl(), "_blank");
              }, 500);
            } catch (shareError) {
              console.error("Share ??, Filesystem ??:", shareError);
              try {
                const base64Data = dataURL.split(",")[1];
                await Filesystem.writeFile({
                  path: fileName,
                  data: base64Data,
                  directory: Directory.Documents,
                });

                alert("\uc774\ubbf8\uc9c0\uac00 \uc800\uc7a5\ub418\uc5c8\uc2b5\ub2c8\ub2e4!\n\uc800\uc7a5\uc704\uce58: \ubb38\uc11c \ud3f4\ub354\n\n\ud30c\uc77c \uad00\ub9ac\uc790\ub85c \ud655\uc778\ud574\ubcf4\uc138\uc694.");

                window.open(getRandomCoupangUrl(), "_blank");
              } catch (fsError) {
                console.error("Filesystem ?? ??:", fsError);
                alert("\uc774\ubbf8\uc9c0 \uc800\uc7a5\uc5d0 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4.\n\uc2a4\ud06c\ub9b0\uc0f7\uc744 \uc774\uc6a9\ud574\uc8fc\uc138\uc694.");
              }
            }
          } else {
            const link = document.createElement("a");
            link.download = fileName;
            link.href = dataURL;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => {
              window.open(getRandomCoupangUrl(), "_blank");
              alert("\uc774\ubbf8\uc9c0\uac00 \uc800\uc7a5\ub418\uc5c8\uc2b5\ub2c8\ub2e4!\n\n\uc800\uc7a5\uc704\uce58:\n- Android: \ub2e4\uc6b4\ub85c\ub4dc \ud3f4\ub354\n- iPhone: \uc0ac\uc9c4 \uc571\n- PC: \ub2e4\uc6b4\ub85c\ub4dc \ud3f4\ub354");
            }, 500);
          }
        } catch (error) {
          console.error("\uc774\ubbf8\uc9c0 \uc800\uc7a5 \uc2e4\ud328:", error);
          alert("\uc774\ubbf8\uc9c0 \uc800\uc7a5\uc5d0 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4. \uc2a4\ud06c\ub9b0\uc0f7\uc744 \uc774\uc6a9\ud574\uc8fc\uc138\uc694.");
        }
      };

      if ((window as any).html2canvas) {
        await processCapture();
      } else {
        alert("\uc774\ubbf8\uc9c0 \ucea1\ucc3d \ub77c\uc774\ube0c\ub7ec\ub9ac\ub97c \ubd88\ub7ec\uc624\uc9c0 \ubabb\ud588\uc2b5\ub2c8\ub2e4. \ud398\uc774\uc9c0\ub97c \uc0c8\ub85c\uace0\uce68\ud574\uc8fc\uc138\uc694.");
      }
    } catch (error) {
      console.error("\uc774\ubbf8\uc9c0 \uc800\uc7a5 \uc624\ub958:", error);
      alert("\uc774\ubbf8\uc9c0 \uc800\uc7a5 \uc911 \uc624\ub958\uac00 \ubc1c\uc0dd\ud588\uc2b5\ub2c8\ub2e4.");
    }
  };

  // handleViewOtherCharacters ?⑥닔 ?쒓굅??
  const handleLeaveComment = () => {
    setShowComments(true);
    // ?볤? ?묒꽦 ?쒖뿉??荑좏뙜 ?뚰듃?덉뒪 ?섏씡 李쎌텧
    setTimeout(() => {
      window.open(getRandomCoupangUrl(), "_blank");
    }, 1000);
  };

  const handleSubmitComment = () => {
    if (comment.trim()) {
      alert("?뮠 ?볤????깅줉?섏뿀?듬땲?? (?ㅼ젣 ?쒕퉬?ㅼ뿉?쒕뒗 DB????λ맗?덈떎)");
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
    if (quizResult !== null) return; // ?대? ?듭븞 ?쒖텧??寃쎌슦 ?좏깮 遺덇?
    setUserGuess(character);
  };

  return (
    <div
      className="result-container p-3 md:p-6 bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-xl border border-white/30 w-full max-w-sm md:max-w-lg mx-auto text-center relative overflow-hidden"
      style={{ paddingBottom: "200px" }}
    >
      {/* ?대?吏 罹≪쿂 ?곸뿭 ?쒖옉 */}
      <div className="image-capture-area" ref={captureRef}>
        {/* 寃곌낵 ?ㅻ뜑 */}
        <div className="bg-white/90 rounded-2xl p-4 mb-6 shadow-sm border border-pink-100/50 backdrop-blur-sm">
          {/* ?깃꼍?몃Ъ ?뺣낫 - ?띿뒪???쇱そ) / ?대?吏(?ㅻⅨ履? 諛곗튂 */}
          <div className="flex items-center space-x-6">
            {/* ?쇱そ: ?띿뒪???뺣낫 */}
            <div className="flex-1">
              {/* ?곷떒: ?뱀떊怨???? ?깃꼍?몃Ъ */}
              <div className="mb-6">
                <div className="bg-blue-100 text-blue-700 rounded-full px-4 py-1 text-sm font-medium inline-block">
                  ?뱀떊怨???? ?깃꼍?몃Ъ
                </div>
              </div>

              {/* 以묎컙: ?대쫫 */}
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center justify-center">
                  <span className="text-xl md:text-2xl mr-2">✨</span>
                  {resultData.character}
                </h1>
              </div>

              {/* ?섎떒: MBTI ?좏삎 */}
              <div>
                <div className="bg-gradient-to-r from-violet-500 to-pink-500 text-white px-6 py-2 rounded-full text-lg font-bold inline-block">
                  {resultType}
                </div>
              </div>
            </div>

            {/* ?ㅻⅨ履? ?대?吏 */}
            <div className="flex-shrink-0">
              {resultData.image ? (
                <div className="space-y-2">
                  <div
                    className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
                  onClick={() => {
                    const versionNum = parseInt(versionKey);
                    if (onStartTest) {
                      onStartTest(versionNum);
                    } else {
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

                  {/* ?ш쾶蹂닿린 踰꾪듉 - ?대?吏 ?섎떒????긽 ?쒖떆 */}
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
                    <span>?뵇</span>
                    <span>?ш쾶蹂닿린</span>
                  </button>
                </div>
              ) : (
                <div className="w-48 h-48 md:w-56 md:h-56 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-sm flex items-center justify-center">
                  <p className="text-gray-500 text-sm">?대?吏 濡쒕뵫以?..</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ?ㅻ챸 ?띿뒪??- 媛?낆꽦 媛쒖꽑 */}
        <div className="bg-white/90 rounded-2xl p-5 mb-6 shadow-sm border border-pink-100/50">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
            <span className="bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent mr-2">
              ??            </span>
            ?깃꺽 ?뱀쭠
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
              // Fallback - 湲곗〈 濡쒖쭅
              (() => {
                const sentences = resultData.description
                  .split(".")
                  .filter((sentence) => sentence.trim());
                const targetSentences = sentences.slice(0, 5);
                while (targetSentences.length < 5 && sentences.length > 0) {
                  const additionalTraits = [
                    "?? ??? ? ??? ???? ???? ??? ????.",
                    "??? ???? ?? ???? ???? ?????.",
                    "??? ?? ??? ?? ?? ???? ???? ???.",
                    "???? ?? ??? ?? ???, ???? ??? ????.",
                    "??? ?? ??? ??? ???? ? ?????.",
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

        {/* ?깃꼍 援ъ젅 - 媛꾩냼?붾맂 ?붿옄??*/}
        <div className="bg-gradient-to-r from-violet-100 to-pink-100 p-4 rounded-2xl border-l-4 border-violet-400 shadow-sm mb-6 text-center">
          <h4 className="text-violet-800 font-bold text-sm mb-2 flex items-center justify-center">
            ?뱰 ????깃꼍援ъ젅 ({resultData.verse})
          </h4>
          <blockquote className="text-gray-800 font-medium text-sm leading-relaxed italic">
            "{resultData.verseText}"
          </blockquote>
        </div>

        {/* ?≪뀡 踰꾪듉??- MZ ?ㅽ???*/}
        <div className="space-y-3">
          {/* 硫붿씤 ?≪뀡 踰꾪듉??- ?몃줈 諛곗튂 */}
          <div className="space-y-3">
            <button
              onClick={handleSaveAsImage}
              className="w-full bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-2xl hover:from-violet-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-[1.02] shadow-sm text-sm"
            >
              ?벝 ?대?吏 ???            </button>
            <button
              onClick={handleShare}
              className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold py-3 px-4 rounded-2xl hover:from-pink-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-[1.02] shadow-sm text-sm disabled:opacity-75"
              disabled={copied}
            >
              {copied ? "?뱥 蹂듭궗??" : "?뵕 怨듭쑀?섍린"}
            </button>
          </div>
        </div>

        {/* ?댁슱由щ뒗/?댁슱由ъ? ?딅뒗 ?깃꺽 ?좏삎 ?뱀뀡 */}
        <div className="mb-6 space-y-4 mt-6">
          {/* ?댁슱由щ뒗 ?깃꺽 ?좏삎 */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-3 md:p-4 shadow-sm border border-green-200">
            {(() => {
              const compatibleType = getCompatibleTypes(resultType)[0];
              if (!compatibleType) return null;
              return (
                <div className="space-y-3 md:space-y-4">
                  {/* 1. ?쒕ぉ怨?MBTI ?좏삎 */}
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    <h3 className="text-xs md:text-sm font-bold text-green-800">
                      ?댁슱由щ뒗 ?깃꺽 ?좏삎 :
                    </h3>
                    <span className="bg-green-500 text-white text-xs md:text-sm font-bold px-2 md:px-3 py-1 rounded-full">
                      {compatibleType}
                    </span>
                    <span className="font-bold text-green-800 text-xs md:text-sm">
                      {RESULTS[compatibleType].character}
                    </span>
                    <span className="text-green-600 text-sm md:text-base">
                      ?뮍
                    </span>
                  </div>

                  {/* 2. ?대?吏 */}
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
                      {/* ?대?吏 ?덉뿉 ?ш쾶蹂닿린 踰꾪듉 - ??긽 ?쒖떆 */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs text-center py-1 rounded-b-lg">
                        ?뵇 ?ш쾶蹂닿린
                      </div>
                    </div>
                  </div>

                  {/* 3. ?ㅻ챸 */}
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-2 md:p-3 border border-green-200">
                    <p className="text-xs md:text-sm text-gray-700 leading-relaxed text-center">
                      {getCompatibilityReason(resultType, compatibleType)}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* ?댁슱由ъ? ?딅뒗 ?깃꺽 ?좏삎 */}
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-3 md:p-4 shadow-sm border border-red-200">
            {(() => {
              const incompatibleType = getIncompatibleTypes(resultType)[0];
              if (!incompatibleType) return null;
              return (
                <div className="space-y-3 md:space-y-4">
                  {/* 1. ?쒕ぉ怨?MBTI ?좏삎 */}
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    <h3 className="text-xs md:text-sm font-bold text-red-800">
                      二쇱쓽?댁빞 ???깃꺽 ?좏삎 :
                    </h3>
                    <span className="bg-red-500 text-white text-xs md:text-sm font-bold px-2 md:px-3 py-1 rounded-full">
                      {incompatibleType}
                    </span>
                    <span className="font-bold text-red-800 text-xs md:text-sm">
                      {RESULTS[incompatibleType].character}
                    </span>
                    <span className="text-red-600 text-sm md:text-base">
                      ?뮅
                    </span>
                  </div>

                  {/* 2. ?대?吏 */}
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
                      {/* ?대?吏 ?덉뿉 ?ш쾶蹂닿린 踰꾪듉 - ??긽 ?쒖떆 */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs text-center py-1 rounded-b-lg">
                        ?뵇 ?ш쾶蹂닿린
                      </div>
                    </div>
                  </div>

                  {/* 3. ?ㅻ챸 */}
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
              ?뮕 MBTI 湲곕컲 沅곹빀 遺꾩꽍 (媛쒖씤李??덉쓬)
            </p>
          </div>
        </div>
      </div>{" "}
      {/* image-capture-area ??*/}
      {/* ?섎㉧吏 ?뚯뒪??異붿쿇 ?뱀뀡 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6 border border-blue-100/50">
        <div className="text-center">
          <h3 className="font-bold text-gray-800 mb-2 flex items-center justify-center">
                <span className="mr-2">??</span>
            ?ㅻⅨ ?뚯뒪?몃룄 ?대낫?ㅻ옒??
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            ???뺥솗??遺꾩꽍???꾪빐 異붽? ?뚯뒪???대낫?몄슂! ?렞
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
                      onStartTest(versionNum);
                    } else {
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
                          "?뮡 ?덈같? 湲곕룄瑜?以묒슂?섍쾶 ?앷컖?섎뒗 遺꾨뱾?먭쾶 異붿쿇"}
                        {parseInt(versionKey) === 2 &&
                          "?쭬 ?좎븰 怨좊???????듭쓣 李얘퀬 ?띠? 遺꾨뱾?먭쾶 異붿쿇"}
                        {parseInt(versionKey) === 3 &&
                          "???ㅼ젣 ?앺솢?먯꽌 ?좎븰???ㅼ쿇?섎뒗 遺꾨뱾?먭쾶 異붿쿇"}
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
                        ?쒖옉!
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      {/* ?≪뀡 踰꾪듉?ㅼ쓣 媛먯떥??而⑦뀒?대꼫 */}
      <div className="space-y-3 md:space-y-4">
        {/* ?깃꼍?몃Ъ 留욏엳湲?寃뚯엫 - 李몄뿬 ?좊룄 臾멸뎄濡?蹂寃?*/}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-3 md:p-4 mb-4 md:mb-6 border-2 border-indigo-200 shadow-md">
          <div className="text-center">
            <h3 className="font-bold text-indigo-800 mb-2 flex items-center justify-center text-sm md:text-base">
              <span className="mr-2">??</span>
              ?깃꼍?몃Ъ 留욏엳湲?寃뚯엫!
            </h3>
            <p className="text-xs md:text-sm text-indigo-600 mb-3">
              ?대?吏瑜?蹂닿퀬 ?꾧뎄?몄? 留욎떠蹂댁꽭????            </p>

            {/* 臾몄젣 ?덉떆 */}
            <div className="mb-4 p-3 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl border border-indigo-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-300 flex-shrink-0">
                  <img
                    src="/default-avatar.jpg"
                    alt="?? ???"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/og-image-new.png";
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-600 mb-1">臾몄젣 ?덉떆:</div>
                  <div className="text-sm font-medium text-gray-800">
                    ???щ엺? ?꾧뎄?쇨퉴??
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="text-center py-1.5 bg-white rounded text-xs text-gray-600 border">
                  ?ㅼ쐵
                </div>
                <div className="text-center py-1.5 bg-white rounded text-xs text-gray-600 border">
                  紐⑥꽭
                </div>
                <div className="text-center py-1.5 bg-white rounded text-xs text-gray-600 border">
                  ?꾨툕?쇳븿
                </div>
                <div className="text-center py-1.5 bg-white rounded text-xs text-gray-600 border">
                  ?붾줈紐?                </div>
              </div>
            </div>

            <button
              onClick={() => {
                // 寃곌낵 ?뺣낫瑜?localStorage???꾩떆 ???(?뚯븘媛湲?湲곕뒫??
                localStorage.setItem(
                  "tempResult",
                  JSON.stringify({
                    type: resultType,
                    character: resultData?.character || "",
                    timestamp: Date.now(),
                  })
                );

                // ???대??먯꽌??onQuizGame 肄쒕갚 ?ъ슜
                if (onQuizGame) {
                  onQuizGame();
                } else {
                  // ?뱀뿉?쒕뒗 湲곗〈 諛⑹떇 ?ъ슜
                  openWithCoupangAd("/game");
                }
              }}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 md:py-4 px-4 md:px-6 rounded-2xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-[1.02] shadow-sm text-sm md:text-base"
            >
              ?뼹截?寃뚯엫 ?쒖옉?섍린
            </button>

            {/* 寃뚯엫 ?먯닔 ?쒖떆 (寃뚯엫????踰덉씠?쇰룄 ?덉쓣 ?뚮쭔 ?쒖떆) */}
            {totalGames > 0 && (
              <div className="mt-3 md:mt-4 p-2 md:p-3 bg-white/80 rounded-xl border border-indigo-200">
                <div className="flex items-center justify-between mb-1 md:mb-2">
                  <span className="text-xs md:text-sm font-semibold text-indigo-800">
                    ?룇 ??寃뚯엫 湲곕줉
                  </span>
                  <button
                    onClick={() => setShowScoreShare(true)}
                    className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full hover:bg-indigo-200 transition-colors"
                  >
                    ?뱾 怨듭쑀
                  </button>
                </div>
                <div className="text-center">
                  <div className="text-base md:text-lg font-bold text-indigo-700">
                    ?뺣떟瑜? {calculateGameScore()}%
                  </div>
                  <div className="text-xs text-gray-600">
                    ({gameScore}/{totalGames} ?뺣떟)
                  </div>
                </div>
              </div>
            )}

            {/* ?쒕뜡 寃뚯엫 李몄뿬 ?좊룄 硫섑듃 */}
            <div className="mt-2 md:mt-3 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100">
              <p className="text-xs text-gray-600 text-center leading-relaxed">
                {randomPrompt}
              </p>
            </div>
          </div>
        </div>

        {/* ?ㅼ떆 ?뚯뒪??踰꾪듉 */}
        <button
          onClick={() => {
            // completedVersion???덉쑝硫??쒖옉 ?섏씠吏濡?踰꾩쟾 ?뺣낫? ?④퍡 ?대룞
            if (completedVersion) {
              openWithCoupangAd(
                `https://b-mbti.money-hotissue.com/?version=${completedVersion}`
              );
            } else {
              onRestart();
              // ?ㅼ떆 ?뚯뒪???쒖뿉??荑좏뙜 ?뚰듃?덉뒪 ?섏씡 李쎌텧
              setTimeout(() => {
                window.open(getRandomCoupangUrl(), "_blank");
              }, 1000);
            }
          }}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium py-2.5 md:py-3 px-3 md:px-4 rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-sm text-sm md:text-base"
        >
          ?봺 ?ㅼ떆 ?뚯뒪?명븯湲?        </button>

        {/* ?꾧린 ?④린湲?*/}
        <button
          onClick={handleLeaveComment}
          className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium py-2.5 md:py-3 px-3 md:px-4 rounded-2xl hover:from-green-600 hover:to-teal-600 transition-all duration-200 shadow-sm text-sm md:text-base"
        >
          ?뮠 ?꾧린 ?④린湲?        </button>
      </div>
      {/* SNS 怨듭쑀 紐⑤떖 */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 md:p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl mx-3">
            <h3 className="text-lg md:text-xl font-bold text-center mb-4 md:mb-6">
              ?뱾 寃곌낵 怨듭쑀?섍린
            </h3>
            <button
              onClick={() => handleSNSShare("copy")}
              className="w-full p-4 md:p-6 bg-gray-100 text-gray-700 rounded-xl md:rounded-2xl font-semibold mb-3 md:mb-4 text-sm md:text-base"
            >
              ?뱥 留곹겕 蹂듭궗
            </button>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full p-3 md:p-4 text-gray-500 text-sm md:text-base"
            >
              痍⑥냼
            </button>
          </div>
        </div>
      )}
      {/* 寃뚯엫 ?먯닔 怨듭쑀 紐⑤떖 */}
      {showScoreShare && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 md:p-4">
          <div className="bg-white rounded-3xl p-4 md:p-6 max-w-xs md:max-w-sm w-full shadow-2xl mx-3">
            <h3 className="text-base md:text-lg font-bold text-center mb-3 md:mb-4">
              ?룇 寃뚯엫 寃곌낵 怨듭쑀?섍린
            </h3>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl md:rounded-2xl p-3 md:p-4 mb-3 md:mb-4 text-center">
              <div className="text-lg md:text-xl font-bold text-indigo-700 mb-1">
                ?뺣떟瑜? {calculateGameScore()}%
              </div>
              <div className="text-xs md:text-sm text-gray-600">
                ({gameScore}/{totalGames} 臾몄젣 ?뺣떟)
              </div>
              <div className="text-xs text-indigo-600 mt-1 md:mt-2">
                移쒓뎄?ㅺ낵 寃쎌웳?대낫?몄슂! ?뮞
              </div>
            </div>
            <button
              onClick={() => handleGameScoreShare("copy")}
              className="w-full p-3 md:p-4 bg-gray-100 text-gray-700 rounded-xl md:rounded-2xl font-semibold mb-2 md:mb-3 text-sm md:text-base"
            >
              ?뱥 寃곌낵 蹂듭궗
            </button>
            <button
              onClick={() => setShowScoreShare(false)}
              className="w-full p-2 md:p-3 text-gray-500 text-xs md:text-sm"
            >
              痍⑥냼
            </button>
          </div>
        </div>
      )}
      {/* ?꾧린 ?④린湲?紐⑤떖 */}
      {showComments && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl max-h-96 overflow-y-auto">
            <h3 className="text-lg font-bold text-center mb-4">
              ?뮠 ?꾧린 ?④린湲?            </h3>
            <div className="mb-4 space-y-3">
              {fakeComments.map((c) => (
                <div key={c.id} className="p-3 bg-gray-50 rounded-2xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-gray-800">
                      {c.user}
                    </span>
                    <span className="text-xs text-gray-500">?ㅿ툘 {c.likes}</span>
                  </div>
                  <p className="text-sm text-gray-700">{c.comment}</p>
                </div>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="?뚯뒪??寃곌낵???대뼚?⑤굹??"
              className="w-full p-3 border border-gray-200 rounded-2xl text-sm resize-none h-20"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleSubmitComment}
                className="flex-1 p-3 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-2xl font-semibold text-sm"
              >
                ?깅줉
              </button>
              <button
                onClick={() => setShowComments(false)}
                className="px-4 p-3 text-gray-500 text-sm"
              >
                痍⑥냼
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ??젣??寃뚯엫 紐⑤떖 ?뱀뀡 - ???댁긽 ?꾩슂 ?놁쓬 */}
      {false && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-center mb-4">
              ?렜 ?깃꼍?몃Ъ 留욏엳湲?寃뚯엫
            </h3>

            <div className="text-center mb-6">
              {/* 罹먮┃???대?吏 */}
              <div className="mb-4 bg-gradient-to-br from-violet-50 to-pink-50 rounded-2xl p-4">
                <div className="w-32 h-32 mx-auto mb-3 bg-white rounded-xl shadow-md flex items-center justify-center overflow-hidden">
                  {currentQuizType && (
                    <img
                      src={`/${
                        currentQuizType === "ENFJ"
                          ? "ENJS ?먰뿤誘몄빞"
                          : currentQuizType === "ENTP"
                          ? "ENFP ?꾨툕?쇳븿"
                          : `${currentQuizType} ${
                              RESULTS[currentQuizType as keyof typeof RESULTS]
                                .character
                            }`
                      }.jpg`}
                      alt="?깃꼍?몃Ъ"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/ENFP ?꾨툕?쇳븿.jpg";
                      }}
                    />
                  )}
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  ???щ엺? ?꾧뎄?쇨퉴?? ?쨺
                </h4>

                {/* ?좏깮???듭븞 ?쒖떆 */}
                {userGuess && quizResult === null && (
                  <div className="mt-3 p-3 bg-blue-100 text-blue-700 rounded-xl">
                    ?좏깮???듭븞: <strong>{userGuess}</strong>
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
                      ? `?럦 ?뺣떟?낅땲?? ${quizCharacter}?섏씠 留욌꽕??`
                      : `?쁾 ?꾩돩?뚯슂! ?뺣떟? ${quizCharacter}?낅땲??`}
                  </div>
                )}
              </div>
            </div>

            {/* 16紐??꾨낫 ?좏깮吏 */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-600 mb-3 text-center">
                ?뮕 ?꾨옒 ?꾨낫 以묒뿉???좏깮?섏꽭??
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

            {/* 寃뚯엫 ?≪뀡 踰꾪듉 */}
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
                  ???듭븞 ?쒖텧
                </button>
              ) : (
                <button
                  onClick={getRandomCharacter}
                  className="flex-1 p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-semibold"
                >
                  ?렜 ?ㅼ떆 ?꾩쟾
                </button>
              )}
              <button
                onClick={() => {}}
                className="px-6 p-3 text-gray-500 text-sm hover:bg-gray-100 rounded-2xl"
              >
                ?リ린
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ?섎떒 ?μ떇 */}
      <div className="mt-2 flex justify-center space-x-1">
        <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-75"></div>
        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-150"></div>
      </div>
      {/* ?명꽣 */}
      <div className="mt-8 pt-6 border-t border-gray-200/50">
        <div className="space-y-2 text-center">
          <p className="text-xs text-gray-500">
            荑좏뙜 ?뚰듃?덉뒪 ?쒕룞???쇳솚?쇰줈, ?댁뿉 ?곕Ⅸ ?쇱젙?≪쓽 ?섏닔猷뚮?
            ?쒓났諛쏆뒿?덈떎.
          </p>
          <p className="text-xs text-gray-400">
            짤 2025 B-MBTI. All rights reserved.
          </p>
        </div>
      </div>
      {/* ?대?吏 ?뺣? 紐⑤떖 */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          style={{ padding: "20px" }}
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="relative bg-white rounded-2xl w-full max-w-2xl"
            style={{
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ?リ린 踰꾪듉 */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all"
            >
              ??            </button>

            {/* ?쒕ぉ */}
            {modalImageTitle && (
              <div className="px-6 pt-6 pb-3">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center">
                  {modalImageTitle}
                </h2>
              </div>
            )}

            {/* ?대?吏 */}
            <div
              className="flex-1 flex items-center justify-center px-6"
              style={{ minHeight: 0 }}
            >
              <img
                src={modalImageSrc}
                alt={modalImageTitle}
                className="w-full h-auto rounded-xl shadow-lg object-contain"
                style={{ maxHeight: "calc(90vh - 180px)" }}
              />
            </div>

            {/* ?リ린 踰꾪듉 (?섎떒) */}
            <div className="px-6 pb-6 pt-4">
              <button
                onClick={() => setShowImageModal(false)}
                className="w-full py-3 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
              >
                ?リ린
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultScreen;
