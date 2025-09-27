import type { Question, MbtiResult, MbtiType } from './types';

// 테스트 선택 옵션 정보
export const TEST_VERSIONS = {
  1: { 
    name: "신앙생활 깊이보기 테스트", 
    description: "예배, 기도, 교제... 일상 속 나만의 신앙 스타일 발견",
    color: "orange"
  },
  2: { 
    name: "내면 성찰하기 테스트", 
    description: "내 마음 깊숙한 곳의 신앙 고민과 성장 여정 탐색",
    color: "purple"
  },
  3: { 
    name: "현실 적용하기 테스트", 
    description: "직장, 가정, 인간관계에서 보여지는 진짜 내 모습",
    color: "blue"
  }
};

// 버전 1: 기본 버전 - 일상적인 신앙 생활
export const QUESTIONS_V1: Question[] = [
  {
    text: "주일 아침, 예배 전 교회에 도착했을 때",
    answers: [
      { text: "먼저 온 성도들과 반갑게 인사하며 담소를 나눈다", type: 'E' },
      { text: "조용히 자리에 앉아 기도하며 마음을 준비한다", type: 'I' },
    ],
  },
  {
    text: "성경을 읽을 때 가장 집중하는 부분은?",
    answers: [
      { text: "말씀의 실제적 적용과 구체적인 실천 방안", type: 'S' },
      { text: "말씀의 영적 의미와 하나님의 깊은 뜻", type: 'N' },
    ],
  },
  {
    text: "교회 내 갈등 상황을 알게 되었을 때",
    answers: [
      { text: "문제의 원인을 분석하고 논리적 해결책을 모색한다", type: 'T' },
      { text: "당사자들의 마음을 헤아리며 화해를 도모한다", type: 'F' },
    ],
  },
  {
    text: "새해 신앙 목표를 세울 때 나는?",
    answers: [
      { text: "구체적인 계획표를 만들어 단계별로 실행한다", type: 'J' },
      { text: "큰 방향만 정하고 상황에 따라 유연하게 조정한다", type: 'P' },
    ],
  },
  {
    text: "선교사님의 간증을 들을 때 가장 감동받는 장면은?",
    answers: [
      { text: "현지인들과 활발하게 소통하며 복음을 전하는 모습", type: 'E' },
      { text: "혼자 기도하며 하나님의 음성을 듣는 깊은 교제의 모습", type: 'I' },
    ],
  },
  {
    text: "성경 공부 모임에서 선호하는 방식은?",
    answers: [
      { text: "성경의 역사적 배경과 고고학적 증거를 통한 학습", type: 'S' },
      { text: "말씀의 상징적 의미와 예언적 해석에 대한 토론", type: 'N' },
    ],
  },
  {
    text: "교회 봉사를 선택할 때 가장 중요한 기준은?",
    answers: [
      { text: "내 능력으로 효율적이고 체계적으로 섬길 수 있는 분야", type: 'T' },
      { text: "성도들에게 위로와 따뜻함을 전할 수 있는 분야", type: 'F' },
    ],
  },
  {
    text: "큐티(개인경건의 시간)를 하는 방식은?",
    answers: [
      { text: "매일 정해진 시간에 정해진 분량으로 규칙적으로", type: 'J' },
      { text: "그때그때 마음이 이끌릴 때 자유롭게 시간을 정해서", type: 'P' },
    ],
  },
  {
    text: "교회 수련회에서 가장 기대하는 시간은?",
    answers: [
      { text: "모든 성도가 함께하는 찬양집회와 교제의 시간", type: 'E' },
      { text: "혼자서 하나님과 깊이 만나는 개인 기도의 시간", type: 'I' },
    ],
  },
  {
    text: "설교 말씀 중 가장 은혜받는 메시지는?",
    answers: [
      { text: "일상생활에서 실천할 수 있는 구체적인 믿음의 지혜", type: 'S' },
      { text: "하나님 나라의 비전과 영적 세계의 신비로운 진리", type: 'N' },
    ],
  },
  {
    text: "성도들 간의 의견 차이가 생겼을 때",
    answers: [
      { text: "성경적 원리에 근거해 논리적으로 토론하여 결론을 낸다", type: 'T' },
      { text: "서로의 입장을 충분히 경청하며 조화로운 합의를 추구한다", type: 'F' },
    ],
  },
  {
    text: "교회 행사 준비는 어떻게 하시나요?",
    answers: [
      { text: "미리미리 체크리스트를 만들어 빠짐없이 준비한다", type: 'J' },
      { text: "대략적인 준비만 하고 그때그때 필요한 것을 해결한다", type: 'P' },
    ],
  },
];

// 버전 2: 심화 버전 - 신앙 고민과 성장에 초점
export const QUESTIONS_V2: Question[] = [
  {
    text: "신앙생활이 어려울 때 당신의 반응은?",
    answers: [
      { text: "동료 믿음의 형제자매들과 고민을 나누고 위로를 구한다", type: 'E' },
      { text: "조용한 곳에서 혼자 깊이 묵상하며 답을 찾는다", type: 'I' },
    ],
  },
  {
    text: "하나님의 뜻을 구할 때 중요하게 여기는 것은?",
    answers: [
      { text: "성경의 명확한 말씀과 구체적인 상황적 인도", type: 'S' },
      { text: "성령의 감동과 내적 확신, 영적 직관", type: 'N' },
    ],
  },
  {
    text: "교회 내 어려운 결정을 내려야 할 때",
    answers: [
      { text: "성경적 원리와 객관적 기준에 따라 판단한다", type: 'T' },
      { text: "관련된 모든 사람들의 마음과 상황을 고려한다", type: 'F' },
    ],
  },
  {
    text: "영성 훈련을 어떻게 계획하시나요?",
    answers: [
      { text: "체계적인 계획을 세워 단계적으로 꾸준히 실행", type: 'J' },
      { text: "그때그때 영적 필요에 따라 유연하게 조정", type: 'P' },
    ],
  },
  {
    text: "믿음의 성장을 위해 선호하는 방식은?",
    answers: [
      { text: "성도들과의 활발한 교제와 공동체 활동을 통해", type: 'E' },
      { text: "개인적인 묵상과 기도를 통한 깊은 영적 체험", type: 'I' },
    ],
  },
  {
    text: "성경 해석에서 가장 신뢰하는 방법은?",
    answers: [
      { text: "주석서와 역사적 맥락을 통한 철저한 연구", type: 'S' },
      { text: "성령의 조명을 구하며 영적 의미를 깨닫기", type: 'N' },
    ],
  },
  {
    text: "교회에서 갈등이 생겼을 때의 접근법은?",
    answers: [
      { text: "문제의 핵심을 파악하고 합리적 해결방안 모색", type: 'T' },
      { text: "관계 회복을 우선으로 하는 화해 중심의 접근", type: 'F' },
    ],
  },
  {
    text: "신앙 서적을 읽을 때 선호하는 스타일은?",
    answers: [
      { text: "정해진 시간에 체계적으로 노트정리하며 읽기", type: 'J' },
      { text: "마음에 와닿는 부분을 자유롭게 골라 읽기", type: 'P' },
    ],
  },
  {
    text: "하나님과의 관계에서 가장 중요하게 여기는 것은?",
    answers: [
      { text: "교제와 소통, 함께하는 관계의 친밀감", type: 'E' },
      { text: "깊은 내적 만남과 개인적인 영적 체험", type: 'I' },
    ],
  },
  {
    text: "믿음의 확신을 얻는 주된 방법은?",
    answers: [
      { text: "성경 말씀의 객관적 약속과 구체적 경험", type: 'S' },
      { text: "내적 평안과 영적 직관, 하나님의 음성", type: 'N' },
    ],
  },
  {
    text: "신앙적 조언을 할 때 중점을 두는 것은?",
    answers: [
      { text: "성경적 원리에 근거한 명확하고 실질적 조언", type: 'T' },
      { text: "상대방의 마음을 공감하며 위로와 격려 전달", type: 'F' },
    ],
  },
  {
    text: "영적 성장 과정을 어떻게 관리하나요?",
    answers: [
      { text: "목표를 정하고 진척 상황을 점검하며 체계적 관리", type: 'J' },
      { text: "자연스러운 흐름에 맡기며 순간순간의 은혜에 집중", type: 'P' },
    ],
  },
];

// 버전 3: 실생활 버전 - 현실적인 상황과 선택을 중심으로
export const QUESTIONS_V3: Question[] = [
  {
    text: "직장에서 스트레스받을 때 당신의 해결법은?",
    answers: [
      { text: "동료들과 이야기하며 함께 해결책을 찾는다", type: 'E' },
      { text: "혼자 시간을 갖고 조용히 생각을 정리한다", type: 'I' },
    ],
  },
  {
    text: "가정 예배나 기도회를 인도할 때",
    answers: [
      { text: "실생활에 적용할 수 있는 구체적인 말씀을 나눈다", type: 'S' },
      { text: "영적 비전과 하나님 나라의 소망을 전한다", type: 'N' },
    ],
  },
  {
    text: "가족 간 의견 충돌이 있을 때",
    answers: [
      { text: "합리적 근거를 제시하며 논리적으로 설득한다", type: 'T' },
      { text: "각자의 마음을 이해하고 조화로운 해결책을 찾는다", type: 'F' },
    ],
  },
  {
    text: "가정의 재정 관리는 어떻게 하시나요?",
    answers: [
      { text: "예산을 세우고 계획적으로 관리한다", type: 'J' },
      { text: "상황에 따라 유연하게 조정하며 관리한다", type: 'P' },
    ],
  },
  {
    text: "이웃과의 관계에서 중요하게 여기는 것은?",
    answers: [
      { text: "활발한 교류와 서로 도움이 되는 관계", type: 'E' },
      { text: "적절한 거리를 유지하며 서로 존중하는 관계", type: 'I' },
    ],
  },
  {
    text: "십일조와 헌금에 대한 당신의 접근법은?",
    answers: [
      { text: "수입에 따른 정확한 계산으로 규칙적인 헌금", type: 'S' },
      { text: "마음의 감동에 따른 자발적이고 영적인 헌금", type: 'N' },
    ],
  },
  {
    text: "자녀 교육에서 가장 중시하는 가치는?",
    answers: [
      { text: "실력과 성과, 객관적 성취를 통한 성장", type: 'T' },
      { text: "인격과 관계, 정서적 안정을 통한 성장", type: 'F' },
    ],
  },
  {
    text: "주말 시간을 어떻게 계획하시나요?",
    answers: [
      { text: "미리 계획을 세워 알차게 보낸다", type: 'J' },
      { text: "그때그때 기분과 상황에 따라 자유롭게 보낸다", type: 'P' },
    ],
  },
  {
    text: "직장에서 복음을 전할 기회가 생겼을 때",
    answers: [
      { text: "적극적으로 나서서 자연스럽게 대화를 이끈다", type: 'E' },
      { text: "상대방이 먼저 관심을 보일 때까지 기다린다", type: 'I' },
    ],
  },
  {
    text: "교회 건축헌금이나 특별헌금 요청이 있을 때",
    answers: [
      { text: "구체적인 계획과 사용 용도를 확인한 후 결정", type: 'S' },
      { text: "하나님의 일이라는 믿음으로 마음에 감동받는 대로", type: 'N' },
    ],
  },
  {
    text: "직장 동료나 친구와의 갈등 해결법은?",
    answers: [
      { text: "문제의 원인을 분석하고 명확한 해결책 제시", type: 'T' },
      { text: "상대방의 입장을 이해하고 먼저 화해의 손길", type: 'F' },
    ],
  },
  {
    text: "새로운 교회를 선택할 때 가장 중요한 기준은?",
    answers: [
      { text: "체계적인 시스템과 안정적인 교회 운영", type: 'J' },
      { text: "자유로운 분위기와 다양성을 인정하는 개방성", type: 'P' },
    ],
  },
];

// 기존 QUESTIONS를 QUESTIONS_V1으로 대체
export const QUESTIONS = QUESTIONS_V1;

// 버전별 질문 매핑
export const QUESTIONS_BY_VERSION = {
  1: QUESTIONS_V1,
  2: QUESTIONS_V2,
  3: QUESTIONS_V3,
};

export const RESULTS: Record<MbtiType, Omit<MbtiResult, 'image'>> = {
  ISTJ: {
    character: '요셉',
    description: '책임감이 강하고 성실하며, 어떤 상황에서도 원칙을 지키는 당신은 요셉과 닮았습니다. 어려운 환경 속에서도 묵묵히 자신의 역할을 다하며 현실적인 문제 해결 능력을 보여주었습니다. 꿈을 통해 미래를 보았지만, 그 해석을 현실에 적용하고 인내하며 기다리는 신중함을 가졌습니다. 당신의 성실함과 인내는 결국 큰 성공과 인정을 가져올 것입니다.',
    verse: '창세기 39:23',
    verseText: '간수장은 그의 손에 맡긴 것을 무엇이든지 살펴보지 아니하였으니 이는 여호와께서 요셉과 함께 하심이라 여호와께서 그를 범사에 형통하게 하셨더라',
    imagePrompt: 'A handsome young Hebrew man with integrity and wisdom in his eyes, wearing colorful royal Egyptian linen robes. He is in an ancient Egyptian palace setting. The style is a detailed, realistic oil painting with dramatic lighting.',
  },
  ISFJ: {
    character: '룻',
    description: '따뜻한 마음과 헌신적인 성품을 가진 당신은 룻과 같습니다. 주변 사람들을 세심하게 챙기며, 사랑하는 이들을 위해 자신을 희생할 줄 아는 아름다운 마음을 가졌습니다. 안정적인 관계를 소중히 여기고, 자신의 의무를 끝까지 다하는 모습은 많은 이들에게 깊은 감동을 줍니다. 당신의 충성심과 따뜻함은 주변을 밝게 만듭니다.',
    verse: '룻기 1:16',
    verseText: '룻이 이르되 내게 어머니를 떠나며 어머니를 따르지 말고 돌아가라 강권하지 마옵소서 어머니께서 가시는 곳에 나도 가고 어머니께서 머무시는 곳에서 나도 머물리이다',
    imagePrompt: 'A gentle and loyal Moabite woman gleaning wheat in a field at sunset. She has a kind and devoted expression. Her clothing is simple, rustic, and she is working diligently. The style is a warm, soft-focused, realistic painting.',
  },
  INFJ: {
    character: '다니엘',
    description: '깊은 통찰력과 강한 신념을 가진 당신은 다니엘을 닮았습니다. 이상을 추구하며, 불의와 타협하지 않는 곧은 성품으로 주변에 긍정적인 영향을 미칩니다. 복잡한 문제 속에서도 본질을 꿰뚫어 보는 지혜를 가졌으며, 자신의 가치관을 지키기 위해 어떤 위협에도 굴하지 않는 용기를 보여주었습니다.',
    verse: '다니엘 6:10',
    verseText: '다니엘이 이 조서에 왕의 도장이 찍힌 것을 알고도 자기 집에 돌아가서는 윗방에 올라가 예루살렘으로 향한 창문을 열고 전에 하던 대로 하루 세 번씩 무릎을 꿇고 기도하며 그의 하나님께 감사하였더라',
    imagePrompt: 'A wise and noble Hebrew man in his youth, with a discerning and calm expression, standing in the opulent court of Babylon. He is praying peacefully despite the surrounding pressure. The style is a classic, reverent, and realistic portrait.',
  },
  INTJ: {
    character: '바울',
    description: '뛰어난 전략가이자 비전가인 당신은 사도 바울과 같습니다. 명확한 목표를 향해 끊임없이 나아가며, 복잡한 문제도 논리적으로 해결하는 능력을 가졌습니다. 자신의 지식과 신념을 체계적으로 정리하고, 이를 바탕으로 다른 사람들을 설득하고 이끄는 데 탁월한 재능을 보입니다. 당신의 지성과 추진력은 세상을 변화시킬 힘이 있습니다.',
    verse: '디모데후서 4:7',
    verseText: '나는 선한 싸움을 싸우고 나의 달려갈 길을 마치고 믿음을 지켰으니',
    imagePrompt: 'An intelligent, intense, and determined middle-aged Jewish man with a scholarly look, writing a letter on a scroll with a quill pen by candlelight. He is focused and deep in thought. The background is a simple, ancient room. The style is a realistic, high-contrast painting like Caravaggio.',
  },
  ISTP: {
    character: '삼손',
    description: '상황 판단이 빠르고 위기 대처 능력이 뛰어난 당신은 삼손과 닮았습니다. 조용하지만 필요할 때 과감한 행동력을 보여주며, 손재주가 좋고 도구를 잘 다룹니다. 때로는 충동적인 선택을 하기도 하지만, 이는 세상을 직접 경험하고 부딪히며 배우려는 당신의 성향 때문입니다. 위기의 순간, 당신의 임기응변 능력은 빛을 발합니다.',
    verse: '사사기 16:28',
    verseText: '삼손이 여호와께 부르짖어 이르되 주 여호와여 구하옵나니 나를 생각하옵소서 하나님이여 구하옵나니 이번만 나를 강하게 하사',
    imagePrompt: 'A physically powerful Hebrew man with long, flowing hair, showing immense strength. He is pushing apart two massive pillars in a Philistine temple. His face is a mix of desperation and power. The style is a dynamic, dramatic, classical painting.',
  },
  ISFP: {
    character: '다윗',
    description: '겸손하고 따뜻한 마음을 가진 예술가 유형인 당신은 다윗과 같습니다. 섬세한 감수성으로 아름다운 시와 노래를 만들었으며, 주변 사람들과 깊은 관계를 맺습니다. 현재의 순간을 소중히 여기며, 자연과 예술 속에서 평화와 기쁨을 찾습니다. 당신의 온화함과 예술적 감성은 주변 사람들에게 위로와 영감을 줍니다.',
    verse: '시편 23:1',
    verseText: '여호와는 나의 목자시니 내게 부족함이 없으리로다',
    imagePrompt: 'A young, handsome shepherd boy with a ruddy complexion and beautiful eyes, playing a harp (lyre) on a hillside overlooking his flock of sheep. The atmosphere is peaceful and filled with sunlight. The style is an idyllic and realistic painting.',
  },
  INFP: {
    character: '예레미야',
    // FIX: Escaped single quotes within the string to prevent a syntax error.
    description: '자신의 신념과 가치를 중요하게 여기며, 이상적인 세상을 꿈꾸는 당신은 예레미야를 닮았습니다. 깊은 공감 능력으로 다른 이들의 아픔에 함께 아파할 줄 아는 선한 마음을 가졌습니다. \'눈물의 선지자\'로 불릴 만큼 감정이 풍부하지만, 그 이면에는 자신의 소명을 끝까지 완수하려는 강한 의지가 숨어있습니다.',
    verse: '예레미야 1:5',
    verseText: '내가 너를 모태에 짓기 전에 너를 알았고 네가 배에서 나오기 전에 너를 성별하였고 너를 여러 나라의 선지자로 세웠노라 하시기로',
    imagePrompt: 'A compassionate and sorrowful prophet, often called the "weeping prophet." He looks over the city of Jerusalem with tears in his eyes, his face full of empathy and anguish for his people. The style is an emotional, realistic portrait.',
  },
  INTP: {
    character: '솔로몬',
    description: '지혜롭고 논리적인 탐구가인 당신은 솔로몬과 같습니다. 뛰어난 통찰력으로 문제의 본질을 꿰뚫어보며, 지식을 쌓고 새로운 것을 배우는 데에서 큰 기쁨을 느낍니다. 복잡한 재판을 명쾌하게 해결하는 모습에서 당신의 분석적이고 공정한 사고방식이 드러납니다. 당신의 지혜는 주변 사람들에게 명확한 방향을 제시합니다.',
    verse: '열왕기상 3:9',
    verseText: '누가 주의 이 많은 백성을 재판할 수 있사오리이까 듣는 마음을 종에게 주사 주의 백성을 재판하여 선악을 분별하게 하옵소서',
    imagePrompt: 'A wise and discerning king sitting on an ornate throne in a grand hall, listening intently to a complex dispute. He has a thoughtful, intelligent expression, embodying immense wisdom. The style is a rich, detailed, classical painting.',
  },
  ESTP: {
    character: '베드로',
    description: '에너지가 넘치고 행동력이 강한 당신은 베드로와 닮았습니다. 현실적인 문제 해결에 능하며, 사람들과 어울리는 것을 즐깁니다. 때로는 성급하게 행동하기도 하지만, 그만큼 열정적이고 자신의 감정에 솔직합니다. 당신의 뜨거운 열정과 리더십은 주변 사람들에게 강한 동기를 부여합니다.',
    verse: '마태복음 16:16',
    verseText: '시몬 베드로가 대답하여 이르되 주는 그리스도시요 살아 계신 하나님의 아들이시니이다',
    imagePrompt: 'A rugged, impulsive, and charismatic middle-aged Galilean fisherman with a powerful build and a passionate expression. He is standing by the Sea of Galilee at sunrise. The style should be a dramatic, realistic painting with strong light and shadow.',
  },
  ESFP: {
    character: '에스더',
    description: '사교적이고 친절하며, 사람들의 주목을 받는 것을 즐기는 당신은 에스더와 같습니다. 뛰어난 순발력과 매력으로 주변을 즐겁게 만들고, 위기의 순간에 백성을 위해 목숨을 걸고 왕 앞에 나아가는 용기를 발휘합니다. 당신의 긍정적인 에너지와 용기는 공동체에 큰 힘이 됩니다.',
    verse: '에스더 4:16',
    verseText: '죽으면 죽으리이다 하니라',
    imagePrompt: 'A beautiful and courageous young Jewish queen in a royal Persian court. She wears elegant, ornate robes and a crown, her expression filled with grace, determination, and bravery. The setting is a lavish, ancient Persian throne room. The style is a rich, detailed, realistic painting.',
  },
  ENFP: {
    character: '아브라함',
    description: '열정적이고 창의적인 당신은 믿음의 조상 아브라함과 같습니다. 새로운 가능성을 찾아 미지의 땅으로 떠나는 도전을 두려워하지 않으며, 따뜻한 마음으로 사람들을 이끕니다. 미래에 대한 긍정적인 비전을 가지고 있으며, 그 비전을 다른 사람들과 나누는 것을 즐깁니다. 당신의 믿음과 개척 정신은 새로운 길을 열어갑니다.',
    verse: '창세기 12:1',
    verseText: '여호와께서 아브람에게 이르시되 너는 너의 고향과 친척과 아버지의 집을 떠나 내가 네게 보여 줄 땅으로 가라',
    imagePrompt: 'An old, wise patriarch with a long white beard, looking up at a sky full of stars with a hopeful and faithful expression. He is wearing simple, ancient traveler\'s robes in a desert landscape at night. The style is an epic, realistic painting with a sense of wonder.',
  },
  ENTP: {
    character: '야곱',
    description: '지적 호기심이 왕성하고, 끊임없이 새로운 아이디어를 탐구하는 당신은 야곱과 닮았습니다. 뛰어난 언변과 재치로 어려운 상황을 슬기롭게 헤쳐나가며, 자신의 목표를 이루기 위해 적극적으로 노력합니다. 때로는 논쟁을 즐기기도 하지만, 이는 더 나은 해결책을 찾기 위한 과정입니다. 당신의 지략과 끈기는 불가능해 보이는 일도 가능하게 만듭니다.',
    verse: '창세기 32:28',
    verseText: '그가 이르되 네 이름을 다시는 야곱이라 부를 것이 아니요 이스라엘이라 부를 것이니 이는 네가 하나님과 및 사람들과 겨루어 이겼음이니라',
    imagePrompt: 'A cunning and tenacious young man wrestling with a divine being (angel) by a river at night. His face shows immense struggle, determination, and awe. The scene is dynamic and powerfully lit. The style is inspired by the Baroque painter Caravaggio, using dramatic chiaroscuro (strong contrasts between light and dark) to emphasize the tension and movement of the struggle.',
  },
  ESTJ: {
    character: '모세',
    description: '현실적이고 추진력이 강한 리더인 당신은 모세와 같습니다. 체계적인 계획과 뛰어난 조직력으로 큰 공동체를 이끌며, 정해진 목표를 반드시 달성해냅니다. 때로는 엄격해 보일 수 있지만, 그 안에는 공동체에 대한 깊은 책임감과 애정이 있습니다. 당신의 리더십은 혼란 속에서 질서를 바로잡습니다.',
    verse: '출애굽기 3:10',
    verseText: '이제 내가 너를 바로에게 보내어 너에게 내 백성 이스라엘 자손을 애굽에서 인도하여 내게 하리라',
    imagePrompt: 'A powerful and authoritative leader, an old man with a long grey beard and staff, standing on a mountain peak with tablets of stone in his arms. He looks resolute and divinely inspired. The sky is dramatic behind him. The style is a majestic, realistic painting in the grand style.',
  },
  ESFJ: {
    character: '마리아',
    description: '친절하고 사교적인 당신은 예수님의 어머니 마리아와 같습니다. 주변 사람들에게 깊은 관심과 애정을 쏟으며, 공동체의 화합을 중요하게 생각합니다. 다른 사람의 필요를 민감하게 알아차리고 돕는 데에서 큰 기쁨을 느끼며, 당신의 따뜻한 마음과 헌신은 주변 사람들에게 안정감을 줍니다.',
    verse: '누가복음 1:38',
    verseText: '마리아가 이르되 주의 여종이오니 말씀대로 내게 이루어지이다 하매 천사가 떠나가니라',
    imagePrompt: 'A young, serene, and humble Nazarene woman with a gentle and loving expression, holding her infant son, Jesus. She is glowing with maternal love and grace. The setting is simple, perhaps in a stable. The style is a soft, reverent, and realistic painting reminiscent of Raphael.',
  },
  ENFJ: {
    character: '느헤미야',
    description: '사람들을 이끄는 카리스마와 깊은 공감 능력을 가진 당신은 느헤미야와 같습니다. 공동체의 성장을 위해 헌신하며, 사람들에게 영감을 주어 함께 목표를 이루어내는 뛰어난 지도자입니다. 무너진 성벽을 재건하겠다는 비전을 제시하고, 사람들의 마음을 하나로 모아 어려움을 극복했습니다. 당신의 열정과 비전은 사람들을 움직입니다.',
    verse: '느헤미야 2:18',
    verseText: '또 그들에게 하나님의 선한 손이 나를 도우신 일과 왕이 내게 이른 말씀을 전하였더니 그들의 말이 일어나 건축하자 하고 모두 힘을 내어 이 선한 일을 하려 하매',
    imagePrompt: 'A charismatic and determined leader, dressed as a high-ranking Persian official, inspecting a ruined wall of Jerusalem with a look of sorrow and resolve. He inspires others to rebuild. The style is a narrative, realistic historical painting.',
  },
  ENTJ: {
    character: '드보라',
    description: '대담하고 결단력 있는 지도자인 당신은 드보라와 같습니다. 비전을 제시하고 사람들을 이끌어 목표를 성취하는 데 능하며, 어려운 상황에서도 흔들리지 않는 강한 의지를 가졌습니다. 사사로서 지혜롭게 백성을 재판하고, 전쟁에서는 군대를 이끌어 승리를 쟁취했습니다. 당신의 통솔력과 전략적인 사고는 위기를 기회로 만듭니다.',
    verse: '사사기 4:9',
    verseText: '이르되 내가 반드시 너와 함께 가리라 그러나 네가 이번에 가는 길에서는 영광을 얻지 못하리니 이는 여호와께서 시스라를 여인의 손에 파실 것임이니라 하고 드보라가 일어나 바락과 함께 게데스로 가니라',
    imagePrompt: 'A confident and wise female prophetess and judge, sitting under a palm tree in ancient Israel, dispensing judgment with authority and insight. She has a commanding presence and intelligent eyes. The style is a strong, realistic historical portrait.',
  },
};

// 모든 MBTI 타입 배열
export const ALL_CHARACTERS: MbtiType[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP', 
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];