const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// 한글 폰트 등록
try {
  registerFont('C:/Windows/Fonts/malgun.ttf', { family: 'Malgun Gothic' });
} catch (e) {
  console.log('⚠️ 맑은 고딕 폰트를 찾을 수 없습니다. 기본 폰트를 사용합니다.');
}

// 1024x500 캔버스 생성
const canvas = createCanvas(1024, 500);
const ctx = canvas.getContext('2d');

// 그라데이션 배경
const bgGradient = ctx.createLinearGradient(0, 0, 1024, 500);
bgGradient.addColorStop(0, '#FEF3C7');
bgGradient.addColorStop(0.5, '#FED7AA');
bgGradient.addColorStop(1, '#FECACA');
ctx.fillStyle = bgGradient;
ctx.fillRect(0, 0, 1024, 500);

// 배경 장식 원들
ctx.globalAlpha = 0.2;
ctx.fillStyle = '#F59E0B';
ctx.beginPath();
ctx.arc(60, 100, 20, 0, Math.PI * 2);
ctx.fill();

ctx.fillStyle = '#EF4444';
ctx.beginPath();
ctx.arc(964, 200, 25, 0, Math.PI * 2);
ctx.fill();

ctx.fillStyle = '#10B981';
ctx.beginPath();
ctx.arc(100, 420, 18, 0, Math.PI * 2);
ctx.fill();

ctx.globalAlpha = 1.0;

// 메인 흰색 카드
ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
ctx.shadowBlur = 20;
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 8;
ctx.fillStyle = 'white';
ctx.beginPath();
ctx.roundRect(80, 40, 864, 420, 25);
ctx.fill();
ctx.shadowBlur = 0;
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 0;

// 타이틀 그라데이션
const titleGradient = ctx.createLinearGradient(0, 0, 1024, 0);
titleGradient.addColorStop(0, '#EA580C');
titleGradient.addColorStop(1, '#DC2626');

// 메인 타이틀
ctx.fillStyle = titleGradient;
ctx.font = 'bold 52px "Malgun Gothic", Arial';
ctx.textAlign = 'center';
ctx.fillText('성경인물 MBTI 테스트', 512, 110);

// 서브타이틀
ctx.fillStyle = '#4B5563';
ctx.font = '600 22px "Malgun Gothic", Arial';
ctx.fillText('성격유형검사 16가지', 512, 145);

// 4가지 특징 박스
const features = [
  { emoji: '🎯', title: '3가지 테스트', desc: '다양한 관점', color: '#EC4899', x: 200, y: 190 },
  { emoji: '🎮', title: '게임 모드', desc: '재미있는 게임', color: '#8B5CF6', x: 520, y: 190 },
  { emoji: '📷', title: '이미지 저장', desc: 'SNS 공유용', color: '#3B82F6', x: 200, y: 280 },
  { emoji: '👥', title: '결과 공유', desc: '어울리는 유형', color: '#F59E0B', x: 520, y: 280 }
];

features.forEach(feature => {
  const boxWidth = 260;
  const boxHeight = 65;
  
  // 박스 배경
  ctx.fillStyle = feature.color + '20';
  ctx.strokeStyle = feature.color + '50';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(feature.x, feature.y, boxWidth, boxHeight, 15);
  ctx.fill();
  ctx.stroke();
  
  // 이모지 원형 배경
  ctx.fillStyle = feature.color;
  ctx.beginPath();
  ctx.arc(feature.x + 30, feature.y + 32, 16, 0, Math.PI * 2);
  ctx.fill();
  
  // 이모지
  ctx.font = '18px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(feature.emoji, feature.x + 30, feature.y + 38);
  
  // 타이틀
  ctx.fillStyle = feature.color;
  ctx.font = 'bold 16px "Malgun Gothic", Arial';
  ctx.fillText(feature.title, feature.x + 145, feature.y + 28);
  
  // 설명
  const descColor = feature.color === '#EC4899' ? '#BE185D' :
                    feature.color === '#8B5CF6' ? '#6D28D9' :
                    feature.color === '#3B82F6' ? '#1D4ED8' : '#D97706';
  ctx.fillStyle = descColor;
  ctx.font = '12px "Malgun Gothic", Arial';
  ctx.fillText(feature.desc, feature.x + 145, feature.y + 48);
});

// 하단 멘트
ctx.fillStyle = '#6B7280';
ctx.font = '500 21px "Malgun Gothic", Arial';
ctx.textAlign = 'center';
ctx.fillText('나와 닮은 성경 속 인물을 찾아보세요', 512, 380);

// CTA 버튼
const btnGradient = ctx.createLinearGradient(0, 0, 1024, 0);
btnGradient.addColorStop(0, '#EA580C');
btnGradient.addColorStop(1, '#DC2626');

ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
ctx.shadowBlur = 8;
ctx.shadowOffsetY = 4;
ctx.fillStyle = btnGradient;
ctx.beginPath();
ctx.roundRect(362, 405, 300, 45, 22);
ctx.fill();
ctx.shadowBlur = 0;
ctx.shadowOffsetY = 0;

// 버튼 텍스트
ctx.fillStyle = 'white';
ctx.font = 'bold 18px "Malgun Gothic", Arial';
ctx.fillText('✨ 무료 테스트 시작 ✨', 512, 433);

// 파일 저장
const buffer = canvas.toBuffer('image/png');
const outputPath = 'b-mbti-feature-graphic-1024x500.png';
fs.writeFileSync(outputPath, buffer);

console.log('✅ 이미지 생성 완료!');
console.log(`📁 경로: ${require('path').resolve(outputPath)}`);
console.log(`📏 크기: 1024x500px`);
console.log(`💾 파일 크기: ${(buffer.length / 1024).toFixed(2)} KB`);
