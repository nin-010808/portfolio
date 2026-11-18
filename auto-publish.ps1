param(
    [int]$IntervalSeconds = 3
)

$ErrorActionPreference = "Stop"
$repo = Split-Path -Parent $MyInvocation.MyCommand.Path
$git = "C:\Program Files\Git\cmd\git.exe"
$source = Join-Path $repo "Main interface.html"
$entry = Join-Path $repo "index.html"
$log = Join-Path $repo "auto-publish.log"

Set-Location $repo

function Write-PublishLog {
    param([string]$Message)
    $line = "{0:u} {1}" -f (Get-Date), $Message
    Add-Content -LiteralPath $log -Value $line
    Write-Host $line
}

Write-PublishLog "Portfolio auto-publish watcher started"

while ($true) {
    try {
        Copy-Item -LiteralPath $source -Destination $entry -Force

        & $git add --all
        if ($LASTEXITCODE -ne 0) {
            throw "git add failed"
        }

        & $git diff --cached --quiet
        if ($LASTEXITCODE -ne 0) {
            $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            & $git -c "user.name=nin-010808" -c "user.email=nin-010808@users.noreply.github.com" commit -m "Update portfolio $timestamp"
            if ($LASTEXITCODE -ne 0) {
                throw "git commit failed"
            }

            & $git push
            if ($LASTEXITCODE -ne 0) {
                throw "git push failed"
            }

            Write-PublishLog "Published latest portfolio changes"
        }
    }
    catch {
        Write-PublishLog "Publish failed: $($_.Exception.Message)"
    }

    Start-Sleep -Seconds $IntervalSeconds
}
