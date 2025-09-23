import React, { useState, useEffect } from 'react';
import type { MbtiStats } from '../types';
import { getMbtiStats } from '../supabase';

interface StatsScreenProps {
  onBack: () => void;
}

const StatsScreen: React.FC<StatsScreenProps> = ({ onBack }) => {
  const [stats, setStats] = useState<MbtiStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await getMbtiStats();
        setStats(data);
      } catch (err) {
        console.error('통계 로딩 실패:', err);
        setError('통계를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 md:p-10 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-amber-200 w-full text-center">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">통계 로딩 중...</h2>
        <div className="animate-spin w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-10 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-red-200 w-full text-center">
        <h2 className="text-2xl font-bold text-red-700 mb-4">오류</h2>
        <p className="text-stone-600 mb-6">{error}</p>
        <button
          onClick={onBack}
          className="bg-amber-800 text-white font-bold py-3 px-6 rounded-full hover:bg-amber-900 transition-colors duration-300"
        >
          돌아가기
        </button>
      </div>
    );
  }

  const totalTests = stats.reduce((sum, stat) => sum + stat.count, 0);

  return (
    <div className="p-6 md:p-10 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-amber-200 w-full">
      <h2 className="text-3xl font-bold font-myeongjo text-amber-900 text-center mb-6">
        테스트 통계
      </h2>
      
      <div className="mb-6 text-center">
        <p className="text-lg text-stone-700">
          총 <span className="font-bold text-amber-800">{totalTests}</span>명이 테스트를 완료했습니다.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {stats.length > 0 ? (
          stats.map((stat) => (
            <div key={stat.mbti_type} className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-bold text-amber-900">{stat.character}</span>
                  <span className="text-stone-600 ml-2">({stat.mbti_type})</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-amber-800">{stat.count}명</span>
                  <span className="text-stone-600 ml-2">({stat.percentage}%)</span>
                </div>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2">
                <div
                  className="bg-amber-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stat.percentage}%` }}
                ></div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-stone-600">
            아직 테스트 결과가 없습니다.
          </div>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={onBack}
          className="bg-amber-800 text-white font-bold py-3 px-6 rounded-full hover:bg-amber-900 transition-colors duration-300 transform hover:scale-105 shadow-md"
        >
          돌아가기
        </button>
      </div>
    </div>
  );
};

export default StatsScreen;