$files = git ls-files --modified --others --exclude-standard
foreach ($file in $files) {
    if ([string]::IsNullOrWhiteSpace($file)) { continue }
    Write-Host "Adding $file"
    git add $file
    $commitMsg = "Update $file to align with project startup vision"
    git commit -m $commitMsg
    Write-Host "Pushing $file"
    git push origin main
}
