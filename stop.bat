@echo off
cd /d "%~dp0"
title Hanwha Defense Server Stopper

echo =========================================================================
echo  [Hanwha Defense] Stopping Server Processes...
echo =========================================================================
echo.

py_runtime\python.exe backend\stop_servers.py

echo.
pause
