@echo off
echo FORMÉ HAUS - Real Medusa Setup
echo =============================
echo.
echo This script will attempt to start the real Medusa backend.
echo Please ensure you have:
echo 1. Node.js installed (version 20 or higher)
echo 2. SQLite3 in your PATH
echo.
pause
echo.
echo Starting Medusa backend server...
echo.
cd medusa-storefront
npx @medusajs/medusa-cli@latest develop --port 9000
echo.
echo Press any key to exit...
pause >nul