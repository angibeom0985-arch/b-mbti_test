import { createClient } from '@supabase/supabase-js';
import type { TestResult, MbtiStats, MbtiType } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 테스트 결과 저장
export const saveTestResult = async (mbtiType: MbtiType, character: string): Promise<TestResult | null> => {
  try {
    const { data, error } = await supabase
      .from('test_results')
      .insert([
        {
          mbti_type: mbtiType,
          character: character,
          completed_at: new Date().toISOString(),
          user_agent: navigator.userAgent,
          session_id: generateSessionId()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('테스트 결과 저장 오류:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('테스트 결과 저장 중 예외 발생:', error);
    return null;
  }
};

// MBTI 유형별 통계 조회
export const getMbtiStats = async (): Promise<MbtiStats[]> => {
  try {
    const { data, error } = await supabase
      .from('test_results')
      .select('mbti_type, character')
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('통계 조회 오류:', error);
      return [];
    }

    // 통계 계산
    const statsMap = new Map<MbtiType, { character: string; count: number }>();
    
    data.forEach((result) => {
      const current = statsMap.get(result.mbti_type) || { character: result.character, count: 0 };
      current.count += 1;
      statsMap.set(result.mbti_type, current);
    });

    const totalCount = data.length;
    const stats: MbtiStats[] = Array.from(statsMap.entries()).map(([mbtiType, { character, count }]) => ({
      mbti_type: mbtiType,
      character: character,
      count: count,
      percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
    }));

    return stats.sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('통계 조회 중 예외 발생:', error);
    return [];
  }
};

// 세션 ID 생성 (간단한 랜덤 문자열)
const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Supabase 연결 상태 확인
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('test_results')
      .select('count')
      .limit(1);
    
    return !error;
  } catch (error) {
    console.error('Supabase 연결 확인 실패:', error);
    return false;
  }
};