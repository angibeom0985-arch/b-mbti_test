import React, { useState, useCallback, useMemo } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import type { Dichotomy, MbtiType, MbtiResult } from './types';
import { QUESTIONS, RESULTS } from './constants';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';

type GameState = 'start' | 'quiz' | 'result';

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<Dichotomy, number>>({
    E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0,
  });
  const [resultType, setResultType] = useState<MbtiType | null>(null);
  const [generatedResult, setGeneratedResult] = useState<MbtiResult | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = useCallback(() => {
    setGameState('quiz');
  }, []);

  const handleRestart = useCallback(() => {
    setGameState('start');
    setCurrentQuestionIndex(0);
    setScores({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
    setResultType(null);
    setGeneratedResult(null);
    setIsGenerating(false);
    setError(null);
  }, []);
  
  const calculateResult = useCallback((finalScores: Record<Dichotomy, number>): MbtiType => {
      const e_i = finalScores['E'] >= finalScores['I'] ? 'E' : 'I';
      const s_n = finalScores['S'] >= finalScores['N'] ? 'S' : 'N';
      const t_f = finalScores['T'] >= finalScores['F'] ? 'T' : 'F';
      const j_p = finalScores['J'] >= finalScores['P'] ? 'J' : 'P';
      return `${e_i}${s_n}${t_f}${j_p}` as MbtiType;
  }, []);

  const generateImage = useCallback(async (resultData: Omit<MbtiResult, 'image'>) => {
    setIsGenerating(true);
    setError(null);
    setGeneratedResult(null); // Clear previous result
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
          parts: [
            { text: resultData.imagePrompt },
          ],
        },
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
      });
      
      const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
      if (imagePart && imagePart.inlineData) {
        const base64ImageBytes = imagePart.inlineData.data;
        const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${base64ImageBytes}`;
        setGeneratedResult({ ...resultData, image: imageUrl });
      } else {
        throw new Error('이미지를 생성하지 못했습니다. 응답에 이미지 데이터가 없습니다.');
      }
    } catch (e) {
      console.error(e);
      setError('이미지 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setGeneratedResult(resultData as MbtiResult);
    } finally {
      setIsGenerating(false);
    }
  }, []);


  const handleAnswerSelect = useCallback((type: Dichotomy) => {
    const newScores = { ...scores, [type]: scores[type] + 1 };
    setScores(newScores);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const finalResultType = calculateResult(newScores);
      setResultType(finalResultType);
      const resultData = RESULTS[finalResultType];
      setGameState('result');
      generateImage(resultData);
    }
  }, [scores, currentQuestionIndex, calculateResult, generateImage]);
  
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
            isGenerating={isGenerating}
            error={error}
            onRestart={handleRestart}
          />
        );
      case 'start':
      default:
        return <StartScreen onStart={handleStart} />;
    }
  }, [gameState, currentQuestionIndex, handleAnswerSelect, resultType, generatedResult, isGenerating, error, handleRestart, handleStart]);

  return (
    <div className="min-h-screen bg-amber-50 text-stone-800 flex items-center justify-center p-4 transition-all duration-500">
      <main className="w-full max-w-2xl mx-auto">
        {currentView}
      </main>
    </div>
  );
}

export default App;
