@echo off
echo Deploying AI Shorts Generator to Vercel...
cd /d "%~dp0"
vercel --prod
pause
