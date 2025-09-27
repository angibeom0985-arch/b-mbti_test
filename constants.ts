import type { Question, MbtiResult, MbtiType } from './types';

export const QUESTIONS: Question[] = [
  {
    text: "금요일 밤 9시, 갑자기 친구가 '지금 홍대 나와' 라고 메시지를 보냈다.",
    answers: [
      { text: "옷 갈아입고 바로 출발 🚇", type: 'E' },
      { text: "'오늘은 패스.. 내일 보자' 답장 📱", type: 'I' },
    ],
  },
  {
    text: "무한도전 다시보기 vs 요즘 핫한 새 예능",
    answers: [
      { text: "무한도전이 레전드지.. �", type: 'S' },
      { text: "새로운 거 한번 봐볼까? ✨", type: 'N' },
    ],
  },
  {
    text: "친구가 '연애 상담 좀...' 이라고 톡을 보냈다.",
    answers: [
      { text: "'뭔 일인데? 자세히 말해봐' �", type: 'T' },
      { text: "'어머 무슨 일이야ㅠㅠ 괜찮아?' 💗", type: 'F' },
    ],
  },
  {
    text: "내일 부산 가는데 오늘 밤 11시",
    answers: [
      { text: "짐은 이미 다 쌌고, 기차표도 출력 완료 📋", type: 'J' },
      { text: "'아 짐 싸야지...' 하면서 침대에 누워있음 �️", type: 'P' },
    ],
  },
  {
    text: "회사 신입 환영회에서",
    answers: [
      { text: "먼저 가서 자기소개하고 번호도 주고받음 🤝", type: 'E' },
      { text: "조용히 앉아서 분위기 파악하며 적당히 웃어줌 �", type: 'I' },
    ],
  },
  {
    text: "인스타 스토리 올릴 사진 고르는 기준",
    answers: [
      { text: "얼굴 잘 나온 거, 음식 맛있어 보이는 거 �", type: 'S' },
      { text: "분위기 있고, 감성적인 느낌의 사진 🌅", type: 'N' },
    ],
  },
  {
    text: "후배가 '선배.. 실수했어요ㅠㅠ' 라고 카톡 보냄",
    answers: [
      { text: "'뭐 실수했는데? 어떻게 하면 될까' 🤔", type: 'T' },
      { text: "'에휴 괜찮아괜찮아~ 누구나 실수하지' �", type: 'F' },
    ],
  },
  {
    text: "일요일 오후 2시, 할 일이 없을 때",
    answers: [
      { text: "'오늘 뭐하지?' 하면서 계획을 세운다 📝", type: 'J' },
      { text: "'뭐 하고 싶은 게 생기겠지~' 하고 누워있음 💤", type: 'P' },
    ],
  },
  {
    text: "카페에서 혼자 있을 때 주로",
    answers: [
      { text: "주변 사람들 관찰하며 상상의 나래를 펼침 👀", type: 'E' },
      { text: "유튜브 보거나 웹툰 보며 내 세계에 빠짐 📱", type: 'I' },
    ],
  },
  {
    text: "유튜브 알고리즘이 추천해준 영상",
    answers: [
      { text: "'꿀팁', '리뷰', '비교' 이런 키워드의 영상들 �", type: 'S' },
      { text: "'만약에', '상상해봤는데', '썰' 이런 영상들 🎭", type: 'N' },
    ],
  },
  {
    text: "단톡방에서 친구가 '이별했어...' 라고 올림",
    answers: [
      { text: "'어? 갑자기 왜? 무슨 일 있었어?' 🤨", type: 'T' },
      { text: "'헐 진짜? 괜찮아ㅠㅠ 많이 속상하지?' �", type: 'F' },
    ],
  },
  {
    text: "내 방 상태를 가장 솔직하게 표현하면",
    answers: [
      { text: "옷은 옷장에, 책상은 깔끔, 침대 정리까지 완벽 ✨", type: 'J' },
      { text: "편한 게 최고~ 옷은 의자 위, 물건은 아무데나 🪑", type: 'P' },
    ],
  },
];

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