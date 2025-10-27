@echo off
echo Starting Medusa Backend Server
echo =============================
echo.
cd /d "c:\Users\futte\Desktop\we are close\medusa-storefront"
echo Current directory: %CD%
echo.
echo Installing dependencies if needed...
npm install
echo.
echo Starting Medusa development server on port 9000...
npx @medusajs/medusa-cli@latest develop --port 9000
echo.
echo Press any key to exit...
pause >nul