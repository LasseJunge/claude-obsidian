@echo off
REM On-demand ImmoScout24 scan by ATTACHING to a real Chrome (genuine
REM fingerprint -> IS24 treats it as you, not a bot).
REM
REM Step 1 launches Chrome with a debugging port + a dedicated profile.
REM Step 2 (after you press a key) attaches the agent and reads the results.
cd /d "%~dp0"

set "CHROME="
for %%P in (
  "%ProgramFiles%\Google\Chrome\Application\chrome.exe"
  "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
  "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
) do if exist %%~P set "CHROME=%%~P"

if not defined CHROME (
  echo [Fehler] Google Chrome wurde nicht gefunden.
  echo Bitte Chrome installieren oder den Pfad in dieser Datei anpassen.
  pause
  exit /b 1
)

echo Starte Chrome mit Debugging-Port...
start "" "%CHROME%" --remote-debugging-port=9222 --user-data-dir="%LOCALAPPDATA%\immo-is24-chrome" "https://www.immobilienscout24.de/Suche/de/hamburg/hamburg/wohnung-kaufen?price=-400000"

echo.
echo ====================================================
echo  1) Im Chrome-Fenster ggf. den Cookie-Banner akzeptieren.
echo  2) Warten, bis die Wohnungs-Ergebnisse sichtbar sind.
echo  3) DANN hier eine beliebige Taste druecken.
echo ====================================================
pause

echo.
echo Lese Ergebnisse aus dem Browser...
node src\index.mjs run --is24

echo.
echo ====================================================
echo  Fertig. Ergebnisse stehen im Dashboard (Desktop-Verknuepfung).
echo  Chrome und dieses Fenster koennen geschlossen werden.
echo ====================================================
pause
