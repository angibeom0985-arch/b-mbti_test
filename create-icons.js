const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');

// 한글 폰트 등록
try {
  registerFont('C:/Windows/Fonts/malgunbd.ttf', { family: 'Malgun Gothic', weight: 'bold' });
} catch (e) {
  try {
    registerFont('C:/Windows/Fonts/malgun.ttf', { family: 'Malgun Gothic' });
  } catch (e2) {
    console.log('⚠️ 맑은 고딕 폰트를 찾을 수 없습니다.');
  }
}

// 1. 512x512 앱 아이콘 생성
function createAppIcon() {
  const size = 512;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // 그라데이션 배경
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // 둥근 배경 (약간 투명한 흰색)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.4, 0, Math.PI * 2);
  ctx.fill();

  // 십자가 심볼 (간단하게)
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 25;
  ctx.lineCap = 'round';
  
  // 세로선
  ctx.beginPath();
  ctx.moveTo(size / 2, size * 0.25);
  ctx.lineTo(size / 2, size * 0.55);
  ctx.stroke();
  
  // 가로선
  ctx.beginPath();
  ctx.moveTo(size * 0.35, size * 0.35);
  ctx.lineTo(size * 0.65, size * 0.35);
  ctx.stroke();

  // "B-MBTI" 텍스트
  ctx.fillStyle = 'white';
  ctx.font = 'bold 85px "Malgun Gothic", Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('B-MBTI', size / 2, size * 0.72);

  // 작은 설명 텍스트
  ctx.font = '28px "Malgun Gothic", Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillText('성경인물 테스트', size / 2, size * 0.85);

  return canvas;
}

// 2. 파비콘 생성 (16x16, 32x32, 48x48)
function createFavicon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // 그라데이션 배경
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  if (size >= 32) {
    // 십자가 (32x32 이상에서만)
    ctx.strokeStyle = 'white';
    ctx.lineWidth = Math.max(2, size / 16);
    ctx.lineCap = 'round';
    
    // 세로선
    ctx.beginPath();
    ctx.moveTo(size / 2, size * 0.25);
    ctx.lineTo(size / 2, size * 0.55);
    ctx.stroke();
    
    // 가로선
    ctx.beginPath();
    ctx.moveTo(size * 0.35, size * 0.35);
    ctx.lineTo(size * 0.65, size * 0.35);
    ctx.stroke();

    // "B" 텍스트
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size * 0.35}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('B', size / 2, size * 0.75);
  } else {
    // 16x16은 매우 심플하게 "B"만
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('B', size / 2, size / 2);
  }

  return canvas;
}

// 3. Apple Touch Icon (180x180)
function createAppleTouchIcon() {
  const size = 180;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // 그라데이션 배경
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // 십자가
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  
  ctx.beginPath();
  ctx.moveTo(size / 2, size * 0.25);
  ctx.lineTo(size / 2, size * 0.55);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(size * 0.35, size * 0.35);
  ctx.lineTo(size * 0.65, size * 0.35);
  ctx.stroke();

  // "B-MBTI" 텍스트
  ctx.fillStyle = 'white';
  ctx.font = 'bold 30px "Malgun Gothic", Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('B-MBTI', size / 2, size * 0.72);

  ctx.font = '12px "Malgun Gothic", Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillText('성경인물', size / 2, size * 0.85);

  return canvas;
}

// 파일 저장
console.log('🎨 아이콘 생성 중...\n');

// 앱 아이콘 (512x512)
const appIcon = createAppIcon();
fs.writeFileSync('public/icon-512.png', appIcon.toBuffer('image/png'));
console.log('✅ public/icon-512.png (앱 아이콘)');

// Android 아이콘들도 생성
const androidSizes = [192, 512];
androidSizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(appIcon, 0, 0, 512, 512, 0, 0, size, size);
  fs.writeFileSync(`public/android-chrome-${size}x${size}.png`, canvas.toBuffer('image/png'));
  console.log(`✅ public/android-chrome-${size}x${size}.png`);
});

// 파비콘 (여러 사이즈)
[16, 32, 48].forEach(size => {
  const favicon = createFavicon(size);
  fs.writeFileSync(`public/favicon-${size}x${size}.png`, favicon.toBuffer('image/png'));
  console.log(`✅ public/favicon-${size}x${size}.png`);
});

// Apple Touch Icon
const appleTouchIcon = createAppleTouchIcon();
fs.writeFileSync('public/apple-touch-icon.png', appleTouchIcon.toBuffer('image/png'));
console.log('✅ public/apple-touch-icon.png');

// favicon.ico용 32x32 복사
const favicon32 = createFavicon(32);
fs.writeFileSync('public/favicon.png', favicon32.toBuffer('image/png'));
console.log('✅ public/favicon.png');

console.log('\n🎉 모든 아이콘이 생성되었습니다!');
console.log('\n📝 다음 단계:');
console.log('1. index.html에 아이콘 링크 추가');
console.log('2. manifest.json 생성 (PWA용)');
console.log('3. npm run build 후 배포');
