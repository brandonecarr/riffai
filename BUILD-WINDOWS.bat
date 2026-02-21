@echo off
:: ─────────────────────────────────────────────────────────────
::  RiffAI — Windows Builder
::  Double-click this file to build the Windows installer.
::  A setup .exe will appear in the dist\ folder when done.
:: ─────────────────────────────────────────────────────────────

title RiffAI Windows Builder

:: Navigate to the folder containing this script
cd /d "%~dp0"

echo.
echo  ╔══════════════════════════════════════╗
echo  ║       RiffAI — Windows Builder       ║
echo  ╚══════════════════════════════════════╝
echo.

:: ── 1. Check for Node.js ──────────────────────────────────────
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo  [ERROR] Node.js is not installed.
    echo.
    echo   Please download and install Node.js from:
    echo   https://nodejs.org  (choose the LTS version)
    echo.
    echo   Then double-click this script again.
    echo.
    echo   Opening the Node.js download page...
    start https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node --version') do set NODE_VER=%%v
echo  [OK] Node.js %NODE_VER% found

:: ── 2. Install / refresh dependencies ─────────────────────────
echo.
echo  Step 1/2 - Installing dependencies...
echo.
call npm install --legacy-peer-deps

if %ERRORLEVEL% neq 0 (
    echo.
    echo  [ERROR] npm install failed. See errors above.
    pause
    exit /b 1
)
echo  [OK] Dependencies ready

:: ── 3. Build Windows installer ────────────────────────────────
echo.
echo  Step 2/2 - Building Windows installer (this takes 1-3 min)...
echo.

call npm run build:win

if %ERRORLEVEL% neq 0 (
    echo.
    echo  [ERROR] Build failed. See errors above.
    echo.
    echo  Common fixes:
    echo    - Make sure you have at least 1 GB of free disk space
    echo    - Try deleting node_modules\ and running again
    echo    - Check that you have internet access (downloads Electron)
    echo.
    pause
    exit /b 1
)

echo.
echo  ╔══════════════════════════════════════╗
echo  ║          Build Complete!             ║
echo  ╚══════════════════════════════════════╝
echo.
echo   Your installer is in:  dist\RiffAI-Setup-1.0.0.exe
echo.
echo   Next steps:
echo     1. Run RiffAI-Setup-1.0.0.exe
echo     2. Follow the installer wizard
echo     3. Launch RiffAI from the Start Menu or Desktop shortcut
echo.
echo   Note: Windows may show a SmartScreen warning on first run.
echo   Click "More info" then "Run anyway" to proceed.
echo.

:: Open dist folder in Explorer
start "" "%~dp0dist\"

pause
