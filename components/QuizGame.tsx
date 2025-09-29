import React, { useState, useEffect } from 'react';
import type { MbtiType } from '../types';
import { RESULTS } from '../constants';

interface QuizGameProps {
  onBack: () => void;
}

// 16가지 MBTI 유형과 대응하는 성경인물들
const ALL_CHARACTERS = Object.keys(RESULTS) as MbtiType[];

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

const QuizGame: React.FC<QuizGameProps> = ({ onBack }) => {
  const [currentQuizType, setCurrentQuizType] = useState<MbtiType>('ENFP');
  const [quizCharacter, setQuizCharacter] = useState<string>('');
  const [userGuess, setUserGuess] = useState('');
  const [quizResult, setQuizResult] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [totalGames, setTotalGames] = useState(0);

  // 퀴즈를 위한 랜덤 캐릭터 선택
  const getRandomCharacter = () => {
    const randomType = ALL_CHARACTERS[Math.floor(Math.random() * ALL_CHARACTERS.length)];
    setCurrentQuizType(randomType);
    setQuizCharacter(RESULTS[randomType].character);
    setUserGuess('');
    setQuizResult(null);
  };

  const selectCharacterFromCandidates = (character: string) => {
    if (quizResult !== null) return; // 이미 답안 제출된 경우 선택 불가
    setUserGuess(character);
  };

  const checkQuizAnswer = () => {
    if (!userGuess || userGuess.trim() === '') return;
    
    const isCorrect = userGuess.toLowerCase().trim() === quizCharacter.toLowerCase().trim();
    setQuizResult(isCorrect ? 'correct' : 'wrong');
    setTotalGames(prev => prev + 1);
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  useEffect(() => {
    getRandomCharacter();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 text-gray-800 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          {/* 헤더 */}
          <div className="bg-white/90 rounded-3xl p-6 mb-6 shadow-xl border border-white/30 text-center">
            <h1 className="text-lg font-bold text-gray-800 mb-2">🎮 성경인물 맞히기</h1>
            <div className="flex justify-center items-center space-x-4 text-sm">
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                정답: {score}개
              </div>
              <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                총 {totalGames}문제
              </div>
              {totalGames > 0 && (
                <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                  정답률: {Math.round((score / totalGames) * 100)}%
                </div>
              )}
            </div>
          </div>

          {/* 게임 영역 */}
          <div className="bg-white/90 rounded-3xl p-6 shadow-xl border border-white/30">
            <div className="text-center mb-6">

              
              {/* 캐릭터 이미지 */}
              <div className="mb-4 bg-gradient-to-br from-violet-50 to-pink-50 rounded-2xl p-4">
                <div className="w-32 h-32 mx-auto mb-3 bg-white rounded-xl shadow-md flex items-center justify-center overflow-hidden">
                  <img 
                    src={getMbtiImage(currentQuizType)}
                    alt="성경인물"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/ENFP 아브라함.jpg';
                    }}
                  />
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
                  🎮 다음 문제
                </button>
              )}
              <button 
                onClick={onBack}
                className="px-6 p-3 bg-gray-500 text-white text-sm hover:bg-gray-600 rounded-2xl font-semibold"
              >
                ← 이전
              </button>
            </div>
          </div>

          {/* 하단 장식 */}
          <div className="mt-6 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizGame;