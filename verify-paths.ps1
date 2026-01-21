# Verify all asset paths referenced in JSON files
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "CHECKING ALL ASSET PATHS IN JSON" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$totalPaths = 0
$missingPaths = @()
$expectedMissing = @()

# Extract all image paths from JSON files
$jsonFiles = @(
    "src/data/story.grade0.trangquynh.json",
    "src/data/story.grade2.trangquynh.json",
    "src/data/story.grade5.trangquynh.json"
)

foreach ($jsonFile in $jsonFiles) {
    Write-Host "Checking: $jsonFile" -ForegroundColor Yellow
    
    $content = Get-Content $jsonFile -Raw
    
    # Find all paths starting with /assets/
    $matches = [regex]::Matches($content, '"/assets/[^"]+\.(png|jpg|jpeg)"')
    
    foreach ($match in $matches) {
        $path = $match.Value.Trim('"')
        $totalPaths++
        
        $fullPath = "public" + $path
        
        if (-not (Test-Path $fullPath)) {
            # Check if it's a background (expected to be missing)
            if ($path -match "backgrounds/bg_") {
                $expectedMissing += $path
            } else {
                $missingPaths += @{
                    File = $jsonFile
                    Path = $path
                }
            }
        }
    }
}

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "RESULTS" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Total paths checked: $totalPaths" -ForegroundColor White
Write-Host "Expected missing (backgrounds): $($expectedMissing.Count)" -ForegroundColor Yellow
Write-Host ""

if ($missingPaths.Count -eq 0) {
    Write-Host "SUCCESS - NO UNEXPECTED ERRORS!" -ForegroundColor Green
    Write-Host "All character, icon, and question images exist!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Expected missing backgrounds:" -ForegroundColor Yellow
    $expectedMissing | Select-Object -Unique | ForEach-Object {
        Write-Host "  - $_" -ForegroundColor Yellow
    }
} else {
    Write-Host "FOUND UNEXPECTED MISSING FILES:" -ForegroundColor Red
    Write-Host ""
    foreach ($missing in $missingPaths) {
        Write-Host "  FILE: $($missing.File)" -ForegroundColor Red
        Write-Host "  MISSING: $($missing.Path)" -ForegroundColor Red
        Write-Host ""
    }
}

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
