@echo off
REM ============================================================
REM Britishce44 Content Seeding Script (Windows)
REM ============================================================
set API_URL=http://localhost:3000
echo Seeding content to %API_URL%
echo.

REM 1. Activate classrooms
echo [1/6] Activating classrooms...
for /l %%i in (1,1,40) do (
    curl -s -X POST "%API_URL%/classrooms/%%i/join" -H "Content-Type: application/json" -d "{\"userId\":\"system\",\"name\":\"System\",\"role\":\"admin\"}" >nul 2>&1
)
echo  40 classrooms activated.
echo.

REM 2. Create courses
echo [2/6] Creating courses...
for %%c in (
    "{\"name\":\"English A1\",\"description\":\"Beginner English\",\"level\":\"A1\"}"
    "{\"name\":\"English A2\",\"description\":\"Elementary English\",\"level\":\"A2\"}"
    "{\"name\":\"English B1\",\"description\":\"Intermediate English\",\"level\":\"B1\"}"
    "{\"name\":\"English B2\",\"description\":\"Upper Intermediate\",\"level\":\"B2\"}"
    "{\"name\":\"English C1\",\"description\":\"Advanced English\",\"level\":\"C1\"}"
    "{\"name\":\"English C2\",\"description\":\"Proficiency\",\"level\":\"C2\"}"
) do (
    curl -s -X POST "%API_URL%/lms/courses" -H "Content-Type: application/json" -d "%%~c" >nul 2>&1
)
echo  6 courses created.
echo.

REM 3. Create exams
echo [3/6] Creating exams...
for /l %%i in (1,1,100) do (
    setlocal enabledelayedexpansion
    set "levels=A1 A2 B1 B2 C1 C2"
    for /f %%l in ("%%i") do set /a idx=%%i %% 6
    curl -s -X POST "%API_URL%/lms/exams" -H "Content-Type: application/json" -d "{\"title\":\"Exam %%i\",\"level\":\"B1\",\"questions\":20}" >nul 2>&1
    endlocal
)
echo  100 exams created.
echo.

REM 4. Billing plans
echo [4/6] Creating billing plans...
curl -s -X POST "%API_URL%/billing/plans" -H "Content-Type: application/json" -d "{\"name\":\"Lite\",\"price\":0,\"maxClassrooms\":1,\"maxStudents\":10}" >nul
curl -s -X POST "%API_URL%/billing/plans" -H "Content-Type: application/json" -d "{\"name\":\"Pro\",\"price\":29.99,\"maxClassrooms\":10,\"maxStudents\":100}" >nul
curl -s -X POST "%API_URL%/billing/plans" -H "Content-Type: application/json" -d "{\"name\":\"Enterprise\",\"price\":99.99,\"maxClassrooms\":40,\"maxStudents\":10000}" >nul
echo  3 billing plans created.
echo.

echo ============================================================
echo  Seeding Complete!
echo ============================================================
pause
