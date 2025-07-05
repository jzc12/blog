# gitpush.ps1
param([string]$message = "add files")

try {
    Write-Host "Starting git operations..."
    
    # Check if there are any changes
    $status = git status --porcelain
    if (-not $status) {
        Write-Host "No changes to commit."
        exit 0
    }

    Write-Host "Adding files..."
    git add .
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to add files"
    }

    Write-Host "Committing with message: $message"
    git commit -m $message
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to commit"
    }

    Write-Host "Pushing changes..."
    git push
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to push"
    }

    Write-Host "Git operations completed successfully!"
    exit 0
} catch {
    Write-Error "Error occurred: $_"
    exit 1
}