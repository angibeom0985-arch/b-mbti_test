# AAB 파일 테스트 가이드

## 📦 AAB(Android App Bundle)란?

AAB는 Google Play Store 전용 배포 포맷입니다. 
- 사용자 기기에 최적화된 APK를 자동으로 생성
- 앱 크기 감소 (평균 15-20%)
- **직접 설치 불가** - Play Store를 통해서만 배포

## 🧪 AAB를 에뮬레이터/실제 기기에서 테스트하는 방법

### 방법 1: 자동화 스크립트 사용 ⭐ (추천)

```powershell
# AAB 빌드 + 에뮬레이터 테스트 (한 번에)
.\test-aab.ps1
```

### 방법 2: VS Code Tasks 사용

1. `Ctrl + Shift + P`
2. `Tasks: Run Task` 입력
3. 다음 중 선택:
   - **🧪 Test AAB on Emulator** - 기존 AAB 테스트
   - **🚀 Build AAB and Test** - 빌드 + 테스트 (전체 자동화)

### 방법 3: 수동으로 단계별 실행

#### 1. AAB 빌드
```powershell
cd android
.\gradlew clean bundleRelease
cd ..
```

#### 2. bundletool로 APK 생성
```powershell
# bundletool 다운로드 (최초 1회)
Invoke-WebRequest -Uri "https://github.com/google/bundletool/releases/download/1.17.2/bundletool-all-1.17.2.jar" -OutFile "bundletool.jar"

# AAB → Universal APK 변환
java -jar bundletool.jar build-apks `
  --bundle=android\app\build\outputs\bundle\release\app-release.aab `
  --output=b-mbti-release.apks `
  --mode=universal `
  --ks=C:\b-mbti-keys\b-mbti-release-key.jks `
  --ks-pass=pass:bmbtisecure2025 `
  --ks-key-alias=b-mbti-key `
  --key-pass=pass:bmbtisecure2025
```

#### 3. APKS에서 APK 추출
```powershell
# APKS는 ZIP 파일입니다
Copy-Item b-mbti-release.apks -Destination temp.zip
Expand-Archive temp.zip -DestinationPath temp-apks
Copy-Item temp-apks\universal.apk -Destination b-mbti-release.apk
```

#### 4. 에뮬레이터에 설치
```powershell
# 기존 앱 삭제 (서명 충돌 방지)
adb uninstall com.bmbi.test

# 릴리즈 APK 설치
adb install b-mbti-release.apk

# 앱 실행
adb shell am start -n com.bmbi.test/.MainActivity
```

## 🎯 무엇을 테스트해야 하나?

### ✅ 릴리즈 빌드에서 확인할 것들

1. **광고 표시**
   - 앵커 광고 (하단 고정)
   - 사이드 광고 (좌우)
   - 광고 클릭 동작

2. **성능**
   - 로딩 속도
   - 애니메이션 부드러움
   - 메모리 사용량

3. **기능**
   - 테스트 진행 (1, 2, 3)
   - 결과 페이지
   - 공유 기능
   - Deep Link (/test1-1 등)

4. **난독화/최적화**
   - ProGuard 적용 여부
   - 앱 크기 확인
   - 디버그 로그 제거 확인

## 📊 디버그 APK vs 릴리즈 APK 차이

| 항목 | 디버그 APK | 릴리즈 APK (AAB 변환) |
|------|-----------|---------------------|
| 서명 | 디버그 키 | 릴리즈 키 |
| 난독화 | ❌ 없음 | ✅ ProGuard |
| 크기 | 더 큼 | 최적화됨 |
| 로그 | 모든 로그 | 최소화 |
| 성능 | 느림 | 빠름 |
| Play Store | ❌ 업로드 불가 | ✅ 업로드 가능 |

## 🚀 플레이스토어 출시 전 체크리스트

- [ ] AAB 파일 에뮬레이터에서 테스트 완료
- [ ] 실제 기기에서도 테스트 완료
- [ ] 광고 정상 작동 확인
- [ ] Deep Link 동작 확인
- [ ] 앱 크기 확인 (22MB 이하 권장)
- [ ] 버전 코드/이름 확인
- [ ] 스크린샷 준비 (최소 2개)
- [ ] 스토어 설명 작성
- [ ] 개인정보처리방침 URL 확인

## 💡 팁

### 빠른 테스트 워크플로우

1. 코드 수정
2. `Ctrl + Shift + P` → `🚀 Build AAB and Test`
3. 에뮬레이터에서 확인
4. 통과하면 AAB를 Play Console에 업로드

### 실제 기기에서 테스트

```powershell
# USB 연결 후
adb devices  # 기기 확인
adb install b-mbti-release-universal.apk
```

### 로그 확인

```powershell
# Capacitor 로그
adb logcat -s Capacitor:V

# 전체 로그
adb logcat | Select-String "bmbi"
```

## 📂 생성되는 파일들

- `b-mbti-release.apks` - bundletool 출력 (ZIP)
- `b-mbti-release-universal.apk` - 테스트용 APK
- `android/app/build/outputs/bundle/release/app-release.aab` - Play Store 업로드용

## ❓ 문제 해결

### "INSTALL_FAILED_UPDATE_INCOMPATIBLE"
→ 기존 앱을 먼저 삭제: `adb uninstall com.bmbi.test`

### "device offline"
→ 에뮬레이터 재시작: `adb kill-server && adb start-server`

### "cmd: Can't find service: package"
→ 에뮬레이터가 완전히 부팅되지 않음. 30초 대기 후 재시도

## 🔗 참고 링크

- [bundletool 공식 문서](https://developer.android.com/studio/command-line/bundletool)
- [AAB 포맷 가이드](https://developer.android.com/guide/app-bundle)
- [Google Play Console](https://play.google.com/console)
