$Root = Split-Path -Parent $PSScriptRoot
$Maven = Join-Path $Root "tools\apache-maven-3.9.9\bin\mvn.cmd"

& (Join-Path $PSScriptRoot "start-postgres.ps1")
Push-Location (Join-Path $Root "backend")
& $Maven -q -DskipTests package
Pop-Location
& (Join-Path $PSScriptRoot "start-backend.ps1")
& (Join-Path $PSScriptRoot "start-frontend.ps1")

Write-Host "Backend:  http://localhost:8080"
Write-Host "Frontend: http://127.0.0.1:5173"
