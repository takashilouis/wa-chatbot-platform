@echo off
setlocal
rem Resolve existing Node without changing machine/user PATH.
set "WACHATBOT_NODE="
if defined NODE_EXE if exist "%NODE_EXE%" set "WACHATBOT_NODE=%NODE_EXE%"
if not defined WACHATBOT_NODE for /f "delims=" %%N in ('where node.exe 2^>nul') do if not defined WACHATBOT_NODE set "WACHATBOT_NODE=%%N"
if not defined WACHATBOT_NODE if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" set "WACHATBOT_NODE=%LOCALAPPDATA%\Programs\nodejs\node.exe"
if not defined WACHATBOT_NODE if exist "%ProgramFiles%\nodejs\node.exe" set "WACHATBOT_NODE=%ProgramFiles%\nodejs\node.exe"
if not defined WACHATBOT_NODE if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" set "WACHATBOT_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not defined WACHATBOT_NODE (
  echo Node.js 24 is unavailable. Set NODE_EXE to an approved node.exe installation.
  exit /b 1
)
for %%N in ("%WACHATBOT_NODE%") do set "PATH=%%~dpN;%PATH%"
pushd "%~dp0"
if not exist "node_modules\pnpm\bin\pnpm.cjs" (
  echo Dependencies are missing. Install with pnpm 10.32.1 first; see frontend\README.md.
  popd
  exit /b 1
)
set "WACHATBOT_COMMAND=dev:frontend"
if /i "%~1"=="check" set "WACHATBOT_COMMAND=check:frontend"
if /i "%~1"=="build" set "WACHATBOT_COMMAND=build:frontend"
if /i "%~1"=="start" set "WACHATBOT_COMMAND=start:frontend"
if /i "%~1"=="test" set "WACHATBOT_COMMAND=test:frontend"
if /i "%~1"=="setup" set "WACHATBOT_COMMAND=setup"
if /i "%~1"=="install" set "WACHATBOT_COMMAND=install"
if "%WACHATBOT_COMMAND%"=="install" (
  "%WACHATBOT_NODE%" node_modules\pnpm\bin\pnpm.cjs install --frozen-lockfile
) else (
  "%WACHATBOT_NODE%" node_modules\pnpm\bin\pnpm.cjs %WACHATBOT_COMMAND%
)
set "WACHATBOT_RESULT=%ERRORLEVEL%"
popd
exit /b %WACHATBOT_RESULT%
