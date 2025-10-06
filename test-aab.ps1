# AAB 파일을 에뮬레이터에서 테스트하는 스크립트

Write-Host "🎯 AAB 파일 에뮬레이터 테스트 스크립트" -ForegroundColor Cyan
Write-Host "=" -repeat 50 -ForegroundColor Cyan

# 경로 설정
$ANDROID_HOME = "C:\Android"
$ADB = "$ANDROID_HOME\platform-tools\adb.exe"
$AAB_FILE = "android\app\build\outputs\bundle\release\app-release.aab"
$KEYSTORE_PATH = "C:\b-mbti-keys\b-mbti-release-key.jks"
$KEYSTORE_PASS = "bmbtisecure2025"
$KEY_ALIAS = "b-mbti-key"
$KEY_PASS = "bmbtisecure2025"
$PACKAGE_NAME = "com.bmbi.test"

# 1. bundletool 확인
Write-Host "`n📋 bundletool 확인 중..." -ForegroundColor Yellow
if (-not (Test-Path "bundletool.jar")) {
    Write-Host "📥 bundletool 다운로드 중..." -ForegroundColor Yellow
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri "https://github.com/google/bundletool/releases/download/1.17.2/bundletool-all-1.17.2.jar" -OutFile "bundletool.jar" -UseBasicParsing
    Write-Host "✅ bundletool 다운로드 완료" -ForegroundColor Green
} else {
    Write-Host "✅ bundletool 존재" -ForegroundColor Green
}

# 2. AAB 파일 확인
Write-Host "`n📦 AAB 파일 확인 중..." -ForegroundColor Yellow
if (-not (Test-Path $AAB_FILE)) {
    Write-Host "❌ AAB 파일을 찾을 수 없습니다: $AAB_FILE" -ForegroundColor Red
    Write-Host "💡 먼저 AAB를 빌드하세요: cd android && .\gradlew bundleRelease" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ AAB 파일 확인: $AAB_FILE" -ForegroundColor Green

# 3. AAB에서 Universal APK 생성
Write-Host "`n🔄 AAB에서 APK 생성 중..." -ForegroundColor Yellow
$apksFile = "b-mbti-release.apks"
$apkFile = "b-mbti-release-universal.apk"

java -jar bundletool.jar build-apks `
    --bundle=$AAB_FILE `
    --output=$apksFile `
    --mode=universal `
    --ks=$KEYSTORE_PATH `
    --ks-pass=pass:$KEYSTORE_PASS `
    --ks-key-alias=$KEY_ALIAS `
    --key-pass=pass:$KEY_PASS

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ APK 생성 실패" -ForegroundColor Red
    exit 1
}
Write-Host "✅ APKS 파일 생성 완료" -ForegroundColor Green

# 4. APKS에서 APK 추출
Write-Host "`n📂 APK 추출 중..." -ForegroundColor Yellow
Copy-Item $apksFile -Destination "temp-bundle.zip" -Force
Expand-Archive -Path "temp-bundle.zip" -DestinationPath "temp-apks" -Force
Copy-Item "temp-apks\universal.apk" -Destination $apkFile -Force
Remove-Item "temp-apks" -Recurse -Force
Remove-Item "temp-bundle.zip" -Force
Write-Host "✅ APK 추출 완료: $apkFile" -ForegroundColor Green

# 5. 에뮬레이터 확인
Write-Host "`n📱 에뮬레이터 상태 확인 중..." -ForegroundColor Yellow
$devices = & $ADB devices | Select-String "device$"
if ($devices.Count -eq 0) {
    Write-Host "❌ 실행 중인 에뮬레이터가 없습니다." -ForegroundColor Red
    Write-Host "💡 에뮬레이터를 먼저 시작하세요: .\run-emulator.ps1" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ 에뮬레이터 연결됨" -ForegroundColor Green

# 6. 기존 앱 삭제 (서명 충돌 방지)
Write-Host "`n🗑️ 기존 앱 삭제 중..." -ForegroundColor Yellow
$uninstallResult = & $ADB uninstall $PACKAGE_NAME 2>&1
if ($uninstallResult -match "Success") {
    Write-Host "✅ 기존 앱 삭제 완료" -ForegroundColor Green
} else {
    Write-Host "⚠️ 기존 앱 없음 (정상)" -ForegroundColor Gray
}

# 7. APK 설치
Write-Host "`n📲 릴리즈 APK 설치 중..." -ForegroundColor Yellow
$installResult = & $ADB install $apkFile 2>&1
if ($installResult -match "Success") {
    Write-Host "✅ 설치 완료!" -ForegroundColor Green
} else {
    Write-Host "❌ 설치 실패: $installResult" -ForegroundColor Red
    exit 1
}

# 8. 앱 실행
Write-Host "`n🚀 앱 실행 중..." -ForegroundColor Yellow
& $ADB shell am start -n "$PACKAGE_NAME/.MainActivity"

Write-Host "`n" -NoNewline
Write-Host "=" -repeat 50 -ForegroundColor Cyan
Write-Host "✅ AAB 파일 테스트 완료!" -ForegroundColor Green
Write-Host "=" -repeat 50 -ForegroundColor Cyan
Write-Host "`n📱 에뮬레이터에서 릴리즈 버전 앱을 확인하세요!" -ForegroundColor Cyan
Write-Host "`n💡 팁:" -ForegroundColor Yellow
Write-Host "   - 이 APK는 플레이스토어 릴리즈 버전과 동일한 서명을 사용합니다" -ForegroundColor Gray
Write-Host "   - 광고, Deep Link 등 모든 기능을 테스트할 수 있습니다" -ForegroundColor Gray
Write-Host "   - 생성된 파일: $apkFile" -ForegroundColor Gray
