$Root = Split-Path -Parent $PSScriptRoot
$PgBin = Join-Path $Root "tools\postgresql\pgsql\bin"
$Data = Join-Path $Root "database\pgdata"

& (Join-Path $PgBin "pg_ctl.exe") -D $Data stop
