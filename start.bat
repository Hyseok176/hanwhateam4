@echo off
cd /d "%~dp0"
title Hanwha Defense Intelligence Portal

echo =========================================================================
echo  [Hanwha Defense] Global Trend Intelligence Portal
echo =========================================================================
echo.

set "PY_CMD=python"
if exist "py_runtime\python.exe" (
    set "PY_CMD=py_runtime\python.exe"
) else if exist "%USERPROFILE%\tlf\lg-backend-course\.venv\Scripts\python.exe" (
    set "PY_CMD=%USERPROFILE%\tlf\lg-backend-course\.venv\Scripts\python.exe"
) else if exist "%USERPROFILE%\PycharmProjects\SystemTrading\venv\Scripts\python.exe" (
    set "PY_CMD=%USERPROFILE%\PycharmProjects\SystemTrading\venv\Scripts\python.exe"
)

%PY_CMD% backend\cleanup.py

echo Starting server on http://localhost:8000 ...
echo.

start http://localhost:8000
%PY_CMD% -m uvicorn backend.main:app --host 127.0.0.1 --port 8000

pause
