@echo off
echo FORMÉ HAUS Full Development Environment
echo ========================================
echo.
echo This script will start:
echo 1. Mock Medusa backend server (port 9000)
echo 2. Vite frontend development server (port 5173)
echo.
echo Please wait for both servers to start...
echo.
echo Starting Mock Medusa backend server...
start "Medusa Backend" cmd /k "node mock-medusa-server.js"
echo.
echo Starting Vite frontend development server...
start "Vite Frontend" cmd /k "npm run dev"
echo.
echo Servers started successfully!
echo.
echo Frontend URL: http://localhost:5173
echo Backend URL: http://localhost:9000
echo.
echo Press any key to exit...
pause >nul