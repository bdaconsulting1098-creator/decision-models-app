$body = @{scenario="今天有什么重要新闻？"; history=@()} | ConvertTo-Json -Compress
$headers = @{ "Content-Type" = "application/json" }
try {
    $r = Invoke-WebRequest -Uri "https://decision-models-app.vercel.app/api/decide" -Method POST -Headers $headers -Body ([Text.Encoding]::UTF8.GetBytes($body)) -TimeoutSec 30
    Write-Host "Status: $($r.StatusCode)"
    Write-Host "Content: $($r.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
