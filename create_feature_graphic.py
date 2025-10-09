from PIL import Image, ImageDraw, ImageFont
import os

# 1024x500 이미지 생성
width, height = 1024, 500
image = Image.new('RGB', (width, height), color='white')
draw = ImageDraw.Draw(image)

# 그라데이션 배경 생성
for y in range(height):
    # 보라색 그라데이션 (상단: #667eea, 하단: #764ba2)
    r = int(102 + (118 - 102) * (y / height))
    g = int(126 + (75 - 126) * (y / height))
    b = int(234 + (162 - 234) * (y / height))
    draw.rectangle([(0, y), (width, y + 1)], fill=(r, g, b))

# 장식 원들 (반투명 흰색)
draw.ellipse([100-150, 400-150, 100+150, 400+150], fill=(255, 255, 255, 30))
draw.ellipse([900-200, 100-200, 900+200, 100+200], fill=(255, 255, 255, 30))

# 십자가 그리기 (왼쪽)
cross_x, cross_y = 180, 250
cross_size = 60
line_width = 8

# 원형 배경
draw.ellipse([cross_x-80, cross_y-80, cross_x+80, cross_y+80], fill=(255, 255, 255, 50))

# 세로선
draw.line([(cross_x, cross_y - cross_size), (cross_x, cross_y + cross_size)], 
          fill='white', width=line_width)
# 가로선
draw.line([(cross_x - int(cross_size * 0.7), cross_y - int(cross_size * 0.3)), 
           (cross_x + int(cross_size * 0.7), cross_y - int(cross_size * 0.3))], 
          fill='white', width=line_width)

# 텍스트 추가 (기본 폰트 사용)
try:
    # Windows 한글 폰트 시도
    font_large = ImageFont.truetype("malgun.ttf", 70)
    font_medium = ImageFont.truetype("malgun.ttf", 35)
    font_small = ImageFont.truetype("malgun.ttf", 24)
    font_tiny = ImageFont.truetype("malgun.ttf", 18)
    font_box = ImageFont.truetype("arial.ttf", 16)
except:
    try:
        font_large = ImageFont.truetype("C:/Windows/Fonts/malgun.ttf", 70)
        font_medium = ImageFont.truetype("C:/Windows/Fonts/malgun.ttf", 35)
        font_small = ImageFont.truetype("C:/Windows/Fonts/malgun.ttf", 24)
        font_tiny = ImageFont.truetype("C:/Windows/Fonts/malgun.ttf", 18)
        font_box = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 16)
    except:
        # 폰트를 찾을 수 없는 경우 기본 폰트 사용
        font_large = ImageFont.load_default()
        font_medium = ImageFont.load_default()
        font_small = ImageFont.load_default()
        font_tiny = ImageFont.load_default()
        font_box = ImageFont.load_default()

# 메인 텍스트
draw.text((300, 200), "B-MBTI", fill='white', font=font_large)

# 서브 텍스트
draw.text((300, 260), "성경인물 성격유형 테스트", fill='white', font=font_medium)

# 설명 텍스트
draw.text((300, 310), "나와 닮은 성경 속 인물을 찾아보세요", fill=(255, 255, 255, 230), font=font_small)

# MBTI 타입 박스들
types = ['ENFP', 'INFJ', 'ESTJ', 'ISTP']
start_x, start_y = 720, 360
box_size, gap = 60, 10

for i, mbti_type in enumerate(types):
    x = start_x + (i * (box_size + gap))
    # 박스 배경
    draw.rectangle([x, start_y, x + box_size, start_y + box_size], 
                   fill=(255, 255, 255, 60))
    # 텍스트
    bbox = draw.textbbox((0, 0), mbti_type, font=font_box)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    text_x = x + (box_size - text_width) // 2
    text_y = start_y + (box_size - text_height) // 2
    draw.text((text_x, text_y), mbti_type, fill='white', font=font_box)

# 하단 텍스트
draw.text((1000, 460), "16가지 성경인물과 매칭 • 무료", fill=(255, 255, 255, 200), 
          font=font_tiny, anchor="rt")

# 파일 저장
output_path = "b-mbti-feature-graphic-1024x500.png"
image.save(output_path, 'PNG')
print(f"✅ 이미지 생성 완료: {os.path.abspath(output_path)}")
print(f"📏 크기: {width}x{height}px")
print(f"💾 파일 크기: {os.path.getsize(output_path) / 1024:.2f} KB")
