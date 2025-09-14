# MongoDB Installation Script for SurakshaSetu
# Run this script as Administrator

Write-Host "Installing MongoDB Community Server for SurakshaSetu..." -ForegroundColor Green
Write-Host ""

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "This script requires Administrator privileges. Please run PowerShell as Administrator." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Install Chocolatey if not installed
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Chocolatey package manager..." -ForegroundColor Yellow
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
}

# Install MongoDB using Chocolatey
Write-Host "Installing MongoDB Community Server..." -ForegroundColor Yellow
choco install mongodb -y

# Start MongoDB service
Write-Host "Starting MongoDB service..." -ForegroundColor Yellow
Start-Service MongoDB

# Set MongoDB to start automatically
Set-Service -Name MongoDB -StartupType Automatic

Write-Host ""
Write-Host "MongoDB installation completed!" -ForegroundColor Green
Write-Host "MongoDB service is running on localhost:27017" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. cd backend" -ForegroundColor White
Write-Host "2. npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Your SurakshaSetu backend should now connect to MongoDB successfully!" -ForegroundColor Green

Read-Host "Press Enter to exit"
