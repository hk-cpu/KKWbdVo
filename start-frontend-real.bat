@echo off
echo FORMÉ HAUS - Frontend with Real Medusa
echo =====================================
echo.
echo This script will start the frontend connected to the real Medusa backend.
echo Make sure the Medusa backend is running on port 9000 first.
echo.
pause
echo.
echo Starting Vite development server...
echo.
npm run dev
echo.
echo Press any key to exit...
pause >nul