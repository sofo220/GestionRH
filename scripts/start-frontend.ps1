$Root = Split-Path -Parent $PSScriptRoot
$Frontend = Join-Path $Root "frontend"

Start-Process -FilePath "npm.cmd" `
  -ArgumentList "run", "dev", "--", "--host", "127.0.0.1" `
  -WorkingDirectory $Frontend `
  -RedirectStandardOutput (Join-Path $Root "frontend.log") `
  -RedirectStandardError (Join-Path $Root "frontend-error.log") `
  -WindowStyle Hidden
