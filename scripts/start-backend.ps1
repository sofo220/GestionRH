$Root = Split-Path -Parent $PSScriptRoot
$Backend = Join-Path $Root "backend"
$Jar = Join-Path $Backend "target\gestion-rh-0.0.1-SNAPSHOT.jar"

Start-Process -FilePath "java" `
  -ArgumentList "-jar", $Jar `
  -WorkingDirectory $Backend `
  -RedirectStandardOutput (Join-Path $Root "backend.log") `
  -RedirectStandardError (Join-Path $Root "backend-error.log") `
  -WindowStyle Hidden
