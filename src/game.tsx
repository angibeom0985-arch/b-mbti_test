import React from 'react';
import ReactDOM from 'react-dom/client';
import QuizGame from '../components/QuizGame';
import './index.css';

const GameApp: React.FC = () => {
  const handleBack = () => {
    if (window.opener && !window.opener.closed) {
      window.close();
      window.opener.focus();
    } else {
      // localStorage에서 최근 결과 정보 가져오기
      const tempResult = localStorage.getItem('tempResult');
      const savedResult = localStorage.getItem('mbtiResult');
      
      if (tempResult) {
        const result = JSON.parse(tempResult);
        // 결과 페이지로 이동 (결과 유지)
        window.location.href = `https://b-mbti.money-hotissue.com/result.html?type=${result.type}&character=${encodeURIComponent(result.character)}`;
      } else if (savedResult) {
        const result = JSON.parse(savedResult);
        window.location.href = `https://b-mbti.money-hotissue.com/result.html?type=${result.type}&character=${encodeURIComponent(result.character)}`;
      } else {
        // 결과 정보가 없으면 메인 페이지로
        window.location.href = 'https://b-mbti.money-hotissue.com';
      }
    }
  };

  return <QuizGame onBack={handleBack} />;
};

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<GameApp />);
}