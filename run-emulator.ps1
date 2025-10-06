# B-MBTI 앱을 에뮬레이터에서 실행하는 스크립트

Write-Host "🚀 B-MBTI 앱 에뮬레이터 실행 스크립트" -ForegroundColor Cyan
Write-Host "=" -repeat 50 -ForegroundColor Cyan

# Android SDK 경로
$ANDROID_HOME = "C:\Android"
$EMULATOR = "$ANDROID_HOME\emulator\emulator.exe"
$ADB = "$ANDROID_HOME\platform-tools\adb.exe"
$AVD_NAME = "Medium_Phone"
$APK_PATH = "b-mbti-debug.apk"

# 1. 기존 에뮬레이터 프로세스 확인
Write-Host "`n📱 에뮬레이터 상태 확인 중..." -ForegroundColor Yellow
$emulatorRunning = Get-Process emulator-x86 -ErrorAction SilentlyContinue

if ($emulatorRunning) {
    Write-Host "✅ 에뮬레이터가 이미 실행 중입니다." -ForegroundColor Green
} else {
    Write-Host "🔄 에뮬레이터 시작 중..." -ForegroundColor Yellow
    Start-Process $EMULATOR -ArgumentList "-avd", $AVD_NAME -WindowStyle Normal
    Write-Host "⏳ 에뮬레이터 부팅 대기 중 (약 60초)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 60
}

# 2. 에뮬레이터 부팅 완료 대기
Write-Host "`n⏳ 에뮬레이터 부팅 완료 대기 중..." -ForegroundColor Yellow
& $ADB wait-for-device

# 부팅 완료 확인 (getprop로 부팅 상태 체크)
$bootComplete = $false
$maxRetries = 30
$retryCount = 0

while (-not $bootComplete -and $retryCount -lt $maxRetries) {
    $bootStatus = & $ADB shell getprop sys.boot_completed 2>$null
    if ($bootStatus -match "1") {
        $bootComplete = $true
    } else {
        Write-Host "⏳ 부팅 진행 중... ($retryCount/$maxRetries)" -ForegroundColor Yellow
        Start-Sleep -Seconds 2
        $retryCount++
    }
}

if (-not $bootComplete) {
    Write-Host "❌ 에뮬레이터 부팅 시간 초과" -ForegroundColor Red
    exit 1
}

Write-Host "✅ 에뮬레이터 부팅 완료!" -ForegroundColor Green

# 3. APK 설치
Write-Host "`n📦 APK 설치 중..." -ForegroundColor Yellow
$installResult = & $ADB install -r $APK_PATH 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ APK 설치 완료!" -ForegroundColor Green
} else {
    Write-Host "❌ APK 설치 실패: $installResult" -ForegroundColor Red
    exit 1
}

# 4. 앱 실행
Write-Host "`n🚀 앱 실행 중..." -ForegroundColor Yellow
& $ADB shell am start -n com.bmbi.test/.MainActivity

Write-Host "`n✅ 앱이 성공적으로 실행되었습니다!" -ForegroundColor Green
Write-Host "`n📱 에뮬레이터에서 B-MBTI 앱을 확인하세요!" -ForegroundColor Cyan
Write-Host "=" -repeat 50 -ForegroundColor Cyan

# 5. 로그 확인 (선택사항)
Write-Host "`n💡 로그를 보려면 다음 명령을 실행하세요:" -ForegroundColor Yellow
Write-Host "   $ADB logcat -s Capacitor" -ForegroundColor Gray
