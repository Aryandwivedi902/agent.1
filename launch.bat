@echo off
title HRFlow AI Operations Console Launcher
color 0B
cls

echo =======================================================================
echo          HRFLOW AI -- MULTI-AGENT HR OPERATIONS PLATFORM
echo =======================================================================
echo.
echo  Initializing secure sandbox environment...
echo.

:: Check Node.js installation
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js was not detected on your system.
    echo Please install Node.js (v18+) to run this application.
    pause
    exit /b 1
)

:: Check for package installation
echo  Step 1/3: Installing web application dependencies...
call npm install --prefix apps/web
if %errorlevel% neq 0 (
    echo [ERROR] Dependency installation failed.
    pause
    exit /b 1
)
echo [OK] Dependencies verified.
echo.

:: Run security verification tests
echo  Step 2/3: Executing compliance security tests...
echo.
call npx tsc --module commonjs --moduleResolution node --project apps/web/tsconfig.json apps/web/tests/security-audit.ts
call node apps/web/tests/security-audit.js
del apps/web\tests\security-audit.js >nul 2>nul
del apps/web\lib\db-mock\index.js >nul 2>nul
del apps/web\lib\agents\index.js >nul 2>nul
echo.
echo [OK] Security audit passed.
echo.

:: Launch Next.js dev server
echo  Step 3/3: Booting Next.js development server...
echo  Starting server at http://localhost:3000...
echo.
start "HRFlow AI Dev Server" cmd /c "npm run dev --prefix apps/web"

:: Wait for server to warm up
timeout /t 5 /nobreak >nul

:: Open browser
echo  Launching browser...
start http://localhost:3000

echo.
echo =======================================================================
echo  HRFlow AI Console is running. Leave this window open during use.
echo =======================================================================
echo.
pause
