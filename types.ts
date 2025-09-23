export type Dichotomy = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
export type MbtiType = `${'E'|'I'}${'S'|'N'}${'T'|'F'}${'J'|'P'}`;

export interface Question {
  text: string;
  answers: [
    { text: string; type: Dichotomy },
    { text: string; type: Dichotomy }
  ];
}

export interface MbtiResult {
  character: string;
  description: string;
  verse: string;
  verseText: string;
  imagePrompt: string;
  image?: string;
}

// Supabase 데이터베이스 타입 정의
export interface TestResult {
  id?: number;
  mbti_type: MbtiType;
  character: string;
  completed_at: string;
  user_agent?: string;
  session_id?: string;
}

export interface MbtiStats {
  mbti_type: MbtiType;
  character: string;
  count: number;
  percentage: number;
}
