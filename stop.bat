@echo off
cd /d "%~dp0"
title Hanwha Defense Server Stopper

echo =========================================================================
echo  [Hanwha Defense] Stopping Server Processes...
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

%PY_CMD% backend\stop_servers.py

echo.
pause
