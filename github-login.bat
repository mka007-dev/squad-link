@echo off
cd /d "%~dp0"
set "PATH=%~dp0.tools\bin;%~dp0.tools\mingit\cmd;%~dp0.tools\gh\bin;%PATH%"
echo Clearing old GitHub CLI login...
gh auth logout -h github.com -u mka007-dev
echo.
echo Starting fresh GitHub login for LobbyRush upload...
echo IMPORTANT: When GitHub opens, approve the authorization completely.
echo.
gh auth login --hostname github.com --git-protocol https --web --scopes repo,workflow --insecure-storage
echo.
echo Checking status...
gh auth status
echo.
echo If status shows a green check, come back to Codex and say done.
pause
