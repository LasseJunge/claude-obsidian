@echo off
REM Double-click launcher for an on-demand ImmoScout24 scan (headful browser).
REM Opens a real Chrome window; solve the "Ich bin kein Roboter" challenge if shown.
cd /d "%~dp0"
echo Starte ImmoScout24-Suche (ein Browserfenster oeffnet sich gleich)...
echo Loese ggf. das "Ich bin kein Roboter"-Raetsel im Fenster.
echo.
node src\index.mjs run --is24
echo.
echo ====================================================
echo Fertig. Ergebnisse stehen im Dashboard (Desktop-Verknuepfung).
echo Dieses Fenster kann geschlossen werden.
echo ====================================================
pause
