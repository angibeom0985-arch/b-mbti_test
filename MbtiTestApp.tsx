import React, { useState, useCallback, useMemo, useEffect } from "react";
import type { Dichotomy, MbtiType, MbtiResult } from "./types";
import { QUESTIONS_BY_VERSION, RESULTS } from "./constants";
import StartScreen from "./components/StartScreen";
import QuizScreen from "./components/QuizScreen";
import ResultScreen from "./components/ResultScreen";
import QuizGame from "./components/QuizGame";
import FloatingAd from "./components/FloatingAd";
import SideAd from "./components/SideAd";
import AdBlockDetector from "./components/AdBlockDetector";

type GameState = "start" | "quiz" | "result" | "quizgame";

// MBTI 유형별 이미지 파일 매핑
const getMbtiImage = (type: MbtiType): string => {
  const imageMap: Record<MbtiType, string> = {
    ENFP: "/ENFP 아브라함.jpg",
    ENFJ: "/ENJS 느헤미야.jpg", // 파일명이 ENJS로 되어있음
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

  return imageMap[type] || "/ENFP 아브라함.jpg"; // 기본값
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>("start");
  const [selectedVersion, setSelectedVersion] = useState<number>(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<Dichotomy, number>>({
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  });
  const [answerHistory, setAnswerHistory] = useState<Dichotomy[]>([]);
  const [resultType, setResultType] = useState<MbtiType | null>(null);
  const [generatedResult, setGeneratedResult] = useState<MbtiResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  // Pull to refresh state
  const [isPulling, setIsPulling] = useState(false);
  const [pullStartY, setPullStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);

  // Pull to refresh handlers
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        setPullStartY(e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (pullStartY > 0) {
        const currentY = e.touches[0].clientY;
        const distance = currentY - pullStartY;
        
        if (distance > 0 && window.scrollY === 0) {
          setIsPulling(true);
          setPullDistance(Math.min(distance, 150));
          if (distance > 20) {
            e.preventDefault();
          }
        }
      }
    };

    const handleTouchEnd = () => {
      if (pullDistance > 80) {
        window.location.reload();
      }
      setIsPulling(false);
      setPullStartY(0);
      setPullDistance(0);
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [pullStartY, pullDistance]);

  // 자동 시작 버전 체크 및 URL 파라미터 처리
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const versionParam = urlParams.get("version");
    const questionParam = urlParams.get("question");

    // URL 파라미터가 있으면 해당 버전과 질문으로 바로 이동
    if (versionParam && questionParam) {
      const version = parseInt(versionParam, 10);
      const questionNumber = parseInt(questionParam, 10);

      if (
        version >= 1 &&
        version <= 3 &&
        questionNumber >= 1 &&
        questionNumber <= 12
      ) {
        setSelectedVersion(version);
        setCurrentQuestionIndex(questionNumber - 1); // 0-based index
        setGameState("quiz");

        // URL을 깔끔하게 변경 (파라미터 제거)
        window.history.replaceState({}, "", window.location.pathname);
        return;
      }
    }

    const autoStartVersion = (window as any).autoStartVersion;
    if (autoStartVersion && autoStartVersion >= 1 && autoStartVersion <= 3) {
      handleStart(autoStartVersion);
    }

    const showResult = (window as any).showResult;
    if (showResult) {
      // sessionStorage에서 저장된 결과 불러오기
      const savedResult = sessionStorage.getItem("mbtiTestResult");
      if (savedResult) {
        try {
          const parsedResult = JSON.parse(savedResult);
          setResultType(parsedResult.resultType);
          setGeneratedResult(parsedResult.resultData);
          setSelectedVersion(parsedResult.completedVersion || 1);
          setGameState("result");
        } catch (error) {
          console.error("결과 파싱 오류:", error);
          // 오류 시 샘플 데이터로 폴백
          const sampleType: MbtiType = "ENFP";
          const sampleResult = {
            ...RESULTS[sampleType],
            image: getMbtiImage(sampleType),
          };
          setResultType(sampleType);
          setGeneratedResult(sampleResult);
          setGameState("result");
        }
      } else {
        // 저장된 결과가 없으면 샘플 데이터 표시
        const sampleType: MbtiType = "ENFP";
        const sampleResult = {
          ...RESULTS[sampleType],
          image: getMbtiImage(sampleType),
        };
        setResultType(sampleType);
        setGeneratedResult(sampleResult);
        setGameState("result");
      }
    }
  }, []);

  // 퀴즈 진행 중 URL 업데이트
  useEffect(() => {
    if (gameState === "quiz" && selectedVersion && currentQuestionIndex >= 0) {
      const questionNumber = currentQuestionIndex + 1;
      const newPath = `/test${selectedVersion}-${questionNumber}`;

      // 현재 URL과 다른 경우에만 업데이트
      if (window.location.pathname !== newPath) {
        window.history.replaceState({}, "", newPath);
      }
    }
  }, [gameState, selectedVersion, currentQuestionIndex]);

  // 선택된 버전의 질문 가져오기
  const currentQuestions = useMemo(() => {
    return (
      QUESTIONS_BY_VERSION[
        selectedVersion as keyof typeof QUESTIONS_BY_VERSION
      ] || QUESTIONS_BY_VERSION[1]
    );
  }, [selectedVersion]);

  const handleStart = useCallback((version: number) => {
    setSelectedVersion(version);
    setCurrentQuestionIndex(0);
    setScores({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
    setAnswerHistory([]);
    setResultType(null);
    setGeneratedResult(null);
    setError(null);
    setGameState("quiz");
  }, []);

  const handleBackToStart = useCallback(() => {
    setGameState("start");
  }, []);

  const handleRestart = useCallback(() => {
    setGameState("start");
    setCurrentQuestionIndex(0);
    setScores({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
    setAnswerHistory([]);
    setResultType(null);
    setGeneratedResult(null);
    setError(null);
  }, []);

  const handleQuizGame = useCallback(() => {
    setGameState("quizgame");
  }, []);

  const handleBackToResult = useCallback(() => {
    setGameState("result");
  }, []);

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);

      // 마지막 답변을 취소하고 점수에서 제거
      if (answerHistory.length > 0) {
        const lastAnswer = answerHistory[answerHistory.length - 1];
        setScores((prevScores) => ({
          ...prevScores,
          [lastAnswer]: prevScores[lastAnswer] - 1,
        }));
        setAnswerHistory((prev) => prev.slice(0, -1));
      }
    }
  }, [currentQuestionIndex, answerHistory]);

  const calculateResult = useCallback(
    (finalScores: Record<Dichotomy, number>): MbtiType => {
      const e_i = finalScores["E"] >= finalScores["I"] ? "E" : "I";
      const s_n = finalScores["S"] >= finalScores["N"] ? "S" : "N";
      const t_f = finalScores["T"] >= finalScores["F"] ? "T" : "F";
      const j_p = finalScores["J"] >= finalScores["P"] ? "J" : "P";
      return `${e_i}${s_n}${t_f}${j_p}` as MbtiType;
    },
    []
  );

  const handleAnswerSelect = useCallback(
    async (type: Dichotomy) => {
      const newScores = { ...scores, [type]: scores[type] + 1 };
      const newAnswerHistory = [...answerHistory, type];

      setScores(newScores);
      setAnswerHistory(newAnswerHistory);

      if (currentQuestionIndex < currentQuestions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        const finalResultType = calculateResult(newScores);
        setResultType(finalResultType);
        const resultData = RESULTS[finalResultType];

        // 준비된 이미지를 사용하여 결과 설정
        const imageUrl = getMbtiImage(finalResultType);
        setGeneratedResult({ ...resultData, image: imageUrl });

        // 결과를 sessionStorage에 저장
        const resultToSave = {
          resultType: finalResultType,
          resultData: { ...resultData, image: imageUrl },
          completedVersion: selectedVersion,
          timestamp: Date.now(),
        };
        sessionStorage.setItem("mbtiTestResult", JSON.stringify(resultToSave));

        // 앱 내에서 결과 페이지로 상태 변경
        setGameState("result");
      }
    },
    [
      scores,
      currentQuestionIndex,
      calculateResult,
      currentQuestions.length,
      selectedVersion,
      answerHistory,
    ]
  );

  const currentView = useMemo(() => {
    switch (gameState) {
      case "quiz":
        return (
          <QuizScreen
            question={currentQuestions[currentQuestionIndex]}
            onAnswer={handleAnswerSelect}
            onPrevious={handlePreviousQuestion}
            onHome={() => setGameState("start")}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={currentQuestions.length}
          />
        );
      case "result":
        return (
          <ResultScreen
            resultType={resultType!}
            resultData={generatedResult}
            error={error}
            onRestart={handleRestart}
            completedVersion={selectedVersion}
            onQuizGame={handleQuizGame}
            onStartTest={(version) => {
              setSelectedVersion(version);
              setGameState("quiz");
              setCurrentQuestionIndex(0);
              setAnswerHistory([]);
              setScores({
                E: 0,
                I: 0,
                S: 0,
                N: 0,
                T: 0,
                F: 0,
                J: 0,
                P: 0,
              });
            }}
          />
        );
      case "quizgame":
        return <QuizGame onBack={handleBackToResult} />;
      case "start":
      default:
        return <StartScreen onStart={handleStart} />;
    }
  }, [
    gameState,
    currentQuestionIndex,
    handleAnswerSelect,
    resultType,
    generatedResult,
    error,
    handleRestart,
    handleStart,
    currentQuestions,
    selectedVersion,
    handleQuizGame,
    handleBackToResult,
  ]);

  return (
    <>
      {/* Pull to refresh indicator */}
      {isPulling && (
        <div
          style={{
            position: "fixed",
            top: `${pullDistance / 2}px`,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10000,
            fontSize: "24px",
            opacity: Math.min(pullDistance / 80, 1),
            transition: "opacity 0.2s",
          }}
        >
          {pullDistance > 80 ? "🔄" : "⬇️"}
        </div>
      )}

      {/* 애드블록 감지 */}
      <AdBlockDetector />

      {/* 좌측 사이드 광고 (데스크톱만) */}
      <SideAd
        adClient="ca-pub-2686975437928535"
        adSlot="8015079861"
        position="left"
      />

      {/* 우측 사이드 광고 (데스크톱만) */}
      <SideAd
        adClient="ca-pub-2686975437928535"
        adSlot="8015079861"
        position="right"
      />

      <div
        className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-800 flex flex-col transition-all duration-500"
        style={{
          paddingLeft: window.innerWidth > 768 ? "180px" : "0",
          paddingRight: window.innerWidth > 768 ? "180px" : "0",
          paddingBottom: "20px", // 여유 공간만
        }}
      >
        {/* MZ 스타일 배경 장식 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-violet-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-orange-200/20 rounded-full blur-2xl"></div>
        </div>

        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-lg mx-auto relative z-10">
            {currentView}
          </div>
        </main>

        {/* 쿠팡 파트너스 활동 문구 - 결과 페이지에서만 표시 */}
        {gameState === "result" && (
          <footer className="relative z-10 bg-white/80 backdrop-blur-sm border-t border-gray-200/50 py-0.5 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-xs text-gray-500 py-1">
                "쿠팡파트너스 활동을 통해 일정액의 수수료를 받을 수 있습니다."
                <br />
                <span className="text-gray-400">
                  © 2025 성경인물 MBTI 테스트. 모든 권리 보유.
                </span>
              </p>
            </div>
          </footer>
        )}
      </div>

      {/* 플로팅 하단 광고 */}
      <FloatingAd
        key={`${gameState}-${currentQuestionIndex}`}
        adClient="ca-pub-2686975437928535"
        adSlot="2689008677"
      />
    </>
  );
};

export default App;
