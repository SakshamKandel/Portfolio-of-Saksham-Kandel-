@echo off
echo Starting Local Server...
echo Open your browser to: http://localhost:8000

REM Try using the standard Windows Python launcher 'py'
py -m http.server 8000
if %errorlevel% neq 0 (
    echo 'py' command failed. Trying 'python'...
    python -m http.server 8000
)

pause
