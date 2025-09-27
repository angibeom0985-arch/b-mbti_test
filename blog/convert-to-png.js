const fs = require('fs');
const path = require('path');

// SVG 파일들을 PNG로 변환하는 간단한 HTML 파일 생성
const svgFiles = [
  'main-intro.svg',
  'test-process.svg', 
  'result-example.svg'
];

svgFiles.forEach(svgFile => {
  const svgPath = path.join(__dirname, svgFile);
  const svgContent = fs.readFileSync(svgPath, 'utf8');
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>SVG to PNG Converter</title>
</head>
<body>
    <div id="svg-container">
        ${svgContent}
    </div>
    
    <script>
        // SVG를 Canvas로 변환하여 PNG 다운로드
        const svg = document.querySelector('svg');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // SVG 크기 설정
        canvas.width = svg.viewBox.baseVal.width;
        canvas.height = svg.viewBox.baseVal.height;
        
        // SVG를 이미지로 변환
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        const url = URL.createObjectURL(svgBlob);
        
        const img = new Image();
        img.onload = function() {
            ctx.drawImage(img, 0, 0);
            
            // PNG로 다운로드
            canvas.toBlob(function(blob) {
                const link = document.createElement('a');
                link.download = '${svgFile.replace('.svg', '.png')}';
                link.href = URL.createObjectURL(blob);
                link.click();
            }, 'image/png', 1.0);
        };
        img.src = url;
    </script>
</body>
</html>
  `;
  
  const htmlPath = path.join(__dirname, svgFile.replace('.svg', '.html'));
  fs.writeFileSync(htmlPath, htmlContent);
});

console.log('HTML converter files created. Open them in browser to download PNG files.');