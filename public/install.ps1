# OpenAdapt installer — https://openadapt.ai
#
#   powershell -c "irm https://openadapt.ai/install.ps1 | iex"
#
# Installs uv (a fast Python toolchain) if you don't have it, then installs
# OpenAdapt as a persistent `openadapt` command. Safe to re-run: it upgrades
# in place. Read the script first if you like — it's served in the clear.
$ErrorActionPreference = 'Stop'

function Info($msg) { Write-Host "==> $msg" -ForegroundColor Cyan }

if (-not (Get-Command uv -ErrorAction SilentlyContinue)) {
    Info "Installing uv (fast Python package manager)…"
    powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
    # uv installs to %USERPROFILE%\.local\bin by default.
    $env:Path = "$env:USERPROFILE\.local\bin;$env:Path"
}

if (-not (Get-Command uv -ErrorAction SilentlyContinue)) {
    Write-Host "Error: uv was installed but isn't on your PATH yet." -ForegroundColor Red
    Write-Host "Open a new PowerShell window and re-run this command." -ForegroundColor Red
    exit 1
}

Info "Installing OpenAdapt…"
uv tool install --upgrade openadapt
uv tool update-shell | Out-Null

Info "OpenAdapt is installed. Launch it with:  openadapt"
Info "If PowerShell can't find it yet, open a new window first."
