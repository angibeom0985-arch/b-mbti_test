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
