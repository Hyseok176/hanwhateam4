@echo off
cd /d "%~dp0"
title Hanwha Defense Intelligence Portal

echo =========================================================================
echo  [Hanwha Defense] Global Trend Intelligence Portal
echo =========================================================================
echo.

py_runtime\python.exe backend\cleanup.py

echo Starting server on http://localhost:8000 ...
echo.

start http://localhost:8000
py_runtime\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000

pause
