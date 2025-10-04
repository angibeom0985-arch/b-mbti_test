const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

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

// 파비콘 생성 함수
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

// ICO 파일 생성 함수 (수동으로 ICO 포맷 생성)
function createIcoFile(sizes, outputPath) {
  const pngBuffers = sizes.map(size => {
    const canvas = createFavicon(size);
    return canvas.toBuffer('image/png');
  });

  // ICO 파일 헤더 생성
  const iconDir = Buffer.alloc(6);
  iconDir.writeUInt16LE(0, 0); // Reserved
  iconDir.writeUInt16LE(1, 2); // Type (1 = ICO)
  iconDir.writeUInt16LE(sizes.length, 4); // Number of images

  const iconDirEntries = [];
  let imageDataOffset = 6 + (sizes.length * 16);

  sizes.forEach((size, index) => {
    const pngBuffer = pngBuffers[index];
    const entry = Buffer.alloc(16);
    
    entry.writeUInt8(size === 256 ? 0 : size, 0); // Width (0 = 256)
    entry.writeUInt8(size === 256 ? 0 : size, 1); // Height (0 = 256)
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(pngBuffer.length, 8); // Image size
    entry.writeUInt32LE(imageDataOffset, 12); // Image offset
    
    iconDirEntries.push(entry);
    imageDataOffset += pngBuffer.length;
  });

  // 모든 버퍼를 결합
  const icoBuffer = Buffer.concat([
    iconDir,
    ...iconDirEntries,
    ...pngBuffers
  ]);

  fs.writeFileSync(outputPath, icoBuffer);
}

console.log('🎨 파비콘 생성 중...\n');

// PNG 파비콘들 생성
const sizes = [16, 32, 48];
sizes.forEach(size => {
  const favicon = createFavicon(size);
  fs.writeFileSync(`public/favicon-${size}x${size}.png`, favicon.toBuffer('image/png'));
  console.log(`✅ public/favicon-${size}x${size}.png`);
});

// ICO 파일 생성 (16x16, 32x32, 48x48 포함)
try {
  createIcoFile([16, 32, 48], 'public/favicon.ico');
  console.log('✅ public/favicon.ico (멀티 사이즈: 16x16, 32x32, 48x48)');
} catch (error) {
  console.error('❌ ICO 파일 생성 실패:', error.message);
}

// 512x512 앱 아이콘 생성
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

  // 십자가 심볼
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

// 앱 아이콘 512x512
const appIcon = createAppIcon();
fs.writeFileSync('public/icon-512.png', appIcon.toBuffer('image/png'));
console.log('✅ public/icon-512.png');

// Android 아이콘들
const androidSizes = [192, 512];
androidSizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(appIcon, 0, 0, 512, 512, 0, 0, size, size);
  fs.writeFileSync(`public/android-chrome-${size}x${size}.png`, canvas.toBuffer('image/png'));
  console.log(`✅ public/android-chrome-${size}x${size}.png`);
});

// Apple Touch Icon 180x180
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

const appleTouchIcon = createAppleTouchIcon();
fs.writeFileSync('public/apple-touch-icon.png', appleTouchIcon.toBuffer('image/png'));
console.log('✅ public/apple-touch-icon.png');

console.log('\n🎉 모든 아이콘과 파비콘이 생성되었습니다!');
console.log('\n📝 생성된 파일:');
console.log('  - favicon.ico (16x16, 32x32, 48x48 포함)');
console.log('  - favicon-16x16.png, favicon-32x32.png, favicon-48x48.png');
console.log('  - icon-512.png');
console.log('  - android-chrome-192x192.png, android-chrome-512x512.png');
console.log('  - apple-touch-icon.png');
