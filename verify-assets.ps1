# Asset Verification Script
# Kiểm tra tất cả assets đã được refactor đúng chưa

Write-Host "================================" -ForegroundColor Cyan
Write-Host "🔍 ASSET VERIFICATION SCRIPT" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$errors = 0
$warnings = 0

# 1. Check folder structure
Write-Host "📁 Checking folder structure..." -ForegroundColor Yellow

$requiredFolders = @(
    "public/assets/grades/preschool/counting-animals/characters",
    "public/assets/grades/preschool/counting-animals/questions",
    "public/assets/grades/grade1/number-adventure/characters",
    "public/assets/grades/grade2/trangquynh/characters",
    "public/assets/grades/grade2/trangquynh/icons",
    "public/assets/grades/grade2/trangquynh/questions",
    "public/assets/grades/grade2/trangquynh/backgrounds",
    "public/assets/grades/grade3/fraction-quest/characters",
    "public/assets/grades/grade3/fraction-quest/questions",
    "public/assets/grades/grade5/math-champion/characters",
    "public/assets/grades/grade5/math-champion/backgrounds",
    "public/assets/common/icons",
    "public/assets/common/questions"
)

foreach ($folder in $requiredFolders) {
    if (Test-Path $folder) {
        Write-Host "   ✅ $folder" -ForegroundColor Green
    } else {
        Write-Host "   ❌ MISSING: $folder" -ForegroundColor Red
        $errors++
    }
}

Write-Host ""

# 2. Check assetPaths.ts exists
Write-Host "📝 Checking assetPaths.ts..." -ForegroundColor Yellow

if (Test-Path "src/utils/assetPaths.ts") {
    $lines = (Get-Content "src/utils/assetPaths.ts").Count
    Write-Host "   ✅ assetPaths.ts exists ($lines lines)" -ForegroundColor Green
} else {
    Write-Host "   ❌ assetPaths.ts NOT FOUND!" -ForegroundColor Red
    $errors++
}

Write-Host ""

# 3. Count files in new structure
Write-Host "📊 Counting files..." -ForegroundColor Yellow

$gradesFiles = (Get-ChildItem "public/assets/grades" -Recurse -File).Count
$commonFiles = (Get-ChildItem "public/assets/common" -Recurse -File).Count
$totalNew = $gradesFiles + $commonFiles

Write-Host "   📂 Grades: $gradesFiles files" -ForegroundColor Cyan
Write-Host "   📂 Common: $commonFiles files" -ForegroundColor Cyan
Write-Host "   📦 Total: $totalNew files" -ForegroundColor Green

Write-Host ""

# 4. Check for old paths in JSON
Write-Host "🔍 Checking for old paths in JSON..." -ForegroundColor Yellow

$oldPaths = Select-String -Path "src/data/*.json" -Pattern '"assets/user/' | Where-Object { $_.Line -notmatch "legalNote" }

if ($oldPaths.Count -eq 0) {
    Write-Host "   ✅ No old paths found (except legalNote)" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Found $($oldPaths.Count) old paths:" -ForegroundColor Yellow
    $oldPaths | ForEach-Object { Write-Host "      - $($_.Filename):$($_.LineNumber)" -ForegroundColor Yellow }
    $warnings++
}

Write-Host ""

# 5. Check for missing backgrounds
Write-Host "🖼️  Checking backgrounds..." -ForegroundColor Yellow

$missingBgs = @(
    "public/assets/grades/grade2/trangquynh/backgrounds/bg_village.png",
    "public/assets/grades/grade2/trangquynh/backgrounds/bg_market.png",
    "public/assets/grades/grade5/math-champion/backgrounds/bg_camp.png"
)

$missingCount = 0
foreach ($bg in $missingBgs) {
    if (-not (Test-Path $bg)) {
        $missingCount++
    }
}

if ($missingCount -gt 0) {
    Write-Host "   ⚠️  $missingCount backgrounds missing (expected - chờ design team)" -ForegroundColor Yellow
    $warnings++
} else {
    Write-Host "   ✅ All backgrounds ready!" -ForegroundColor Green
}

Write-Host ""

# 6. Summary
Write-Host "================================" -ForegroundColor Cyan
Write-Host "📊 VERIFICATION SUMMARY" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Files in new structure: $totalNew" -ForegroundColor Cyan
Write-Host "   Errors: $errors" -ForegroundColor $(if ($errors -eq 0) { "Green" } else { "Red" })
Write-Host "   Warnings: $warnings" -ForegroundColor $(if ($warnings -eq 0) { "Green" } else { "Yellow" })
Write-Host ""

if ($errors -eq 0 -and $warnings -le 2) {
    Write-Host "✅ VERIFICATION PASSED!" -ForegroundColor Green
    Write-Host "   Cấu trúc assets đã sẵn sàng!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Run 'npm run dev' để test" -ForegroundColor White
    Write-Host "   2. Gửi background READMEs cho design team" -ForegroundColor White
    Write-Host "   3. Test từng game level" -ForegroundColor White
} else {
    Write-Host "⚠️  VERIFICATION HAS ISSUES!" -ForegroundColor Yellow
    Write-Host "   Check errors above and fix" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 Full report: REFACTOR-FINAL-REPORT.md" -ForegroundColor Cyan
Write-Host ""
