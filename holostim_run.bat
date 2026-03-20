@echo off
REM holostim_run.bat — запуск Holostim

REM Переходим в папку, где лежит этот BAT и все .py
cd /d "%~dp0"

REM Можно явно указать нужную версию Python, если их несколько
REM Например:
REM   set PYTHON_EXE=python
REM или полный путь:
REM   set PYTHON_EXE="C:\Users\THUNDEROBOT\AppData\Local\Programs\Python\Python312\python.exe"

set PYTHON_EXE=python

echo ==============================================
echo  Запуск Holostim (holostim_main.py)
echo ==============================================
echo.

%PYTHON_EXE% "holostim_main.py"

echo.
echo ==============================================
echo  Программа Holostim завершена.
echo  Нажмите любую клавишу для выхода...
echo ==============================================
pause >nul
