$ErrorActionPreference = "Continue"
$start = Get-Date
$projectDir = "C:\Users\bdademo\.qclaw\workspace\decision-models-app"

Write-Host "Starting Vercel production deployment..."
Write-Host "Time: $start"

Push-Location $projectDir
try {
    $output = & npx vercel --prod --force 2>&1
    $exitCode = $LASTEXITCODE
    Write-Host "Exit code: $exitCode"
    Write-Host "Output:"
    $output | ForEach-Object { Write-Host $_ }
} finally {
    Pop-Location
}

$elapsed = (Get-Date) - $start
Write-Host "Duration: $($elapsed.TotalSeconds) seconds"
