
import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="bg-white/60 rounded-lg p-4 border border-amber-200/70">
      <div className="text-center text-sm font-medium text-amber-800 mb-3">
        질문 {current} / {total}
      </div>
      <div className="w-full bg-amber-200/70 rounded-full h-3 shadow-inner">
        <div 
          className="bg-gradient-to-r from-amber-600 to-orange-600 h-3 rounded-full transition-all duration-500 shadow-sm" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
