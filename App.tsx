import React from 'react';
import MbtiTestApp from './MbtiTestApp';
import ApiKeyGuidePage from './pages/ApiKeyGuidePage';

const App: React.FC = () => {
  const isApiGuide = window.location.pathname === '/guide/api-key';
  const isAdmin = window.location.pathname === '/admin';
  
  if (isApiGuide) {
    return <ApiKeyGuidePage />;
  }
  
  if (isAdmin) {
    // Admin 페이지는 다음 단계에서 구현
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">관리자 페이지</h1>
          <p className="text-gray-600">다음 단계에서 구현 예정입니다.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-4 bg-gradient-to-r from-violet-500 to-pink-500 text-white px-6 py-2 rounded-xl"
          >
            메인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }
  
  return <MbtiTestApp />;
};

export default App;