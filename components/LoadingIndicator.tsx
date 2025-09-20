import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="p-10 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-amber-200 w-full text-center flex flex-col items-center justify-center min-h-[500px]">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-700 mb-6"></div>
      <h2 className="text-2xl font-bold font-myeongjo text-amber-900 mb-2">
        결과를 생성하는 중...
      </h2>
      <p className="text-stone-600">
        당신을 닮은 성경 인물의 모습을 그리고 있습니다.
        <br/>
        잠시만 기다려주세요.
      </p>
    </div>
  );
};

export default LoadingIndicator;
