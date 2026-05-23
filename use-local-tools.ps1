$Workspace = Split-Path -Parent $MyInvocation.MyCommand.Path
$ToolsBin = Join-Path $Workspace ".tools\bin"
$GitCmd = Join-Path $Workspace ".tools\mingit\cmd"
$GhBin = Join-Path $Workspace ".tools\gh\bin"

$env:Path = "$ToolsBin;$GitCmd;$GhBin;$env:Path"

Write-Host "Local Git and GitHub CLI are active for this PowerShell window."
git --version
gh --version
