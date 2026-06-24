@echo off
REM ============================================================
REM  MANDALA GARDEN KIOSK — OFFLINE асаах script (Windows)
REM  • Локал сервер асааж, Chrome-г kiosk (бүтэн дэлгэц) горимд нээнэ.
REM  • Интернет шаардахгүй — build хийсэн файлууд дээрээ ажиллана.
REM  • Энэ файлыг build хийсэн kiosk folder дотор байрлуул.
REM ============================================================

cd /d "%~dp0"
set PORT=3000
set HOSTNAME=0.0.0.0
set NODE_ENV=production

REM --- Локал серверийг нуугдмал цонхонд асаах ---
REM standalone build бол:  node .next\standalone\server.js
REM энгийн build бол:       npm run start
start "" /min cmd /c "npm run start"

REM --- Сервер бэлэн болтол түр хүлээх ---
timeout /t 5 /nobreak >nul

REM --- Chrome-г kiosk горимд нээх ---
set CHROME="C:\Program Files\Google\Chrome\Application\chrome.exe"
if not exist %CHROME% set CHROME="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"

start "" %CHROME% ^
  --kiosk ^
  --start-fullscreen ^
  --incognito ^
  --noerrdialogs ^
  --disable-pinch ^
  --disable-infobars ^
  --overscroll-history-navigation=0 ^
  --disable-session-crashed-bubble ^
  --disable-features=TranslateUI ^
  --autoplay-policy=no-user-gesture-required ^
  --check-for-update-interval=31536000 ^
  http://localhost:3000

exit
