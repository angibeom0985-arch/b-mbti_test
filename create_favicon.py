import base64
from PIL import Image, ImageDraw
import io

# 32x32 파비콘 이미지 생성
def create_favicon():
    # 32x32 이미지 생성
    img = Image.new('RGBA', (32, 32), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    # 배경 원 그리기 (보라색)
    draw.ellipse([1, 1, 30, 30], fill=(79, 70, 229, 255), outline=(99, 102, 241, 255))
    
    # 성경책 그리기 (흰색 배경)
    draw.rectangle([8, 9, 23, 20], fill=(255, 255, 255, 255))
    draw.rectangle([9, 10, 22, 19], fill=(248, 249, 250, 255))
    
    # 성경책 페이지 선들
    for y in [12, 14, 16, 18]:
        draw.line([(10, y), (22, y)], fill=(229, 231, 235, 255))
    
    # 중앙 세로 선 (성경책 접힌 부분)
    draw.line([(16, 9), (16, 20)], fill=(209, 213, 219, 255))
    
    # MBTI 심볼 (4개 작은 원)
    colors = [
        (245, 158, 11, 255),  # 노란색
        (239, 68, 68, 255),   # 빨간색
        (16, 185, 129, 255),  # 초록색
        (139, 92, 246, 255)   # 보라색
    ]
    
    x_positions = [12, 15, 17, 20]
    for i, (x, color) in enumerate(zip(x_positions, colors)):
        draw.ellipse([x-1, 23, x+1, 25], fill=color)
    
    return img

# ICO 파일 생성
def create_ico_file():
    img = create_favicon()
    
    # 메모리 버퍼에 ICO 형식으로 저장
    ico_buffer = io.BytesIO()
    img.save(ico_buffer, format='ICO', sizes=[(32, 32)])
    ico_data = ico_buffer.getvalue()
    
    # 파일로 저장
    with open('favicon_new.ico', 'wb') as f:
        f.write(ico_data)
    
    print(f"새로운 favicon.ico 파일이 생성되었습니다! 크기: {len(ico_data)} bytes")
    return ico_data

if __name__ == "__main__":
    create_ico_file()