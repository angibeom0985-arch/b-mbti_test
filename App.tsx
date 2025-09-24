import React, { useState, useCallback, useMemo } from 'react';
import type { Dichotomy, MbtiType, MbtiResult } from './types';
import { QUESTIONS, RESULTS } from './constants';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';

type GameState = 'start' | 'quiz' | 'result' | 'stats';

// MBTI 유형별 이미지 파일 매핑
const getMbtiImage = (type: MbtiType): string => {
  const imageMap: Record<MbtiType, string> = {
    'ENFP': '/ENFP 아브라함.jpg',
    'ENFJ': '/ENJS 느헤미야.jpg', // 파일명이 ENJS로 되어있음
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
  
  return imageMap[type] || '/ENFP 아브라함.jpg'; // 기본값
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<Dichotomy, number>>({
    E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0,
  });
  const [resultType, setResultType] = useState<MbtiType | null>(null);
  const [generatedResult, setGeneratedResult] = useState<MbtiResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStart = useCallback(() => {
    setGameState('quiz');
  }, []);

  const handleViewStats = useCallback(() => {
    // 통계 기능은 현재 비활성화됨
    console.log('통계 기능은 추후 구현 예정입니다.');
  }, []);

  const handleBackToStart = useCallback(() => {
    setGameState('start');
  }, []);

  const handleRestart = useCallback(() => {
    setGameState('start');
    setCurrentQuestionIndex(0);
    setScores({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
    setResultType(null);
    setGeneratedResult(null);
    setError(null);
  }, []);
  
  const calculateResult = useCallback((finalScores: Record<Dichotomy, number>): MbtiType => {
      const e_i = finalScores['E'] >= finalScores['I'] ? 'E' : 'I';
      const s_n = finalScores['S'] >= finalScores['N'] ? 'S' : 'N';
      const t_f = finalScores['T'] >= finalScores['F'] ? 'T' : 'F';
      const j_p = finalScores['J'] >= finalScores['P'] ? 'J' : 'P';
      return `${e_i}${s_n}${t_f}${j_p}` as MbtiType;
  }, []);

  const handleAnswerSelect = useCallback(async (type: Dichotomy) => {
    const newScores = { ...scores, [type]: scores[type] + 1 };
    setScores(newScores);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const finalResultType = calculateResult(newScores);
      setResultType(finalResultType);
      const resultData = RESULTS[finalResultType];
      
      // 준비된 이미지를 사용하여 결과 설정
      const imageUrl = getMbtiImage(finalResultType);
      setGeneratedResult({ ...resultData, image: imageUrl });
      setGameState('result');
    }
  }, [scores, currentQuestionIndex, calculateResult]);
  
  const currentView = useMemo(() => {
    switch(gameState) {
      case 'quiz':
        return (
          <QuizScreen 
            question={QUESTIONS[currentQuestionIndex]}
            onAnswer={handleAnswerSelect}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={QUESTIONS.length}
          />
        );
      case 'result':
        return (
          <ResultScreen 
            resultType={resultType!}
            resultData={generatedResult}
            error={error}
            onRestart={handleRestart}
          />
        );
      case 'start':
      default:
        return <StartScreen onStart={handleStart} onViewStats={handleViewStats} />;
    }
  }, [gameState, currentQuestionIndex, handleAnswerSelect, resultType, generatedResult, error, handleRestart, handleStart, handleViewStats, handleBackToStart]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-800 flex items-center justify-center p-4 transition-all duration-500">
      {/* MZ 스타일 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-violet-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-orange-200/20 rounded-full blur-2xl"></div>
      </div>
      
      <main className="w-full max-w-lg mx-auto relative z-10">
        {currentView}
      </main>
    </div>
  );
}

export default App;
