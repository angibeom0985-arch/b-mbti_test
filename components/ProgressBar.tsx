
import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div>
      <div className="text-center text-sm text-stone-600 mb-2">
        {current} / {total}
      </div>
      <div className="w-full bg-amber-200 rounded-full h-2.5">
        <div 
          className="bg-amber-700 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
