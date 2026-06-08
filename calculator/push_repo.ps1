# Push script for calculator app to CSC426 repository
$repoDir = "C:\Users\HP USER\.gemini\antigravity-ide\scratch\calculator"

if ((Get-Location).Path -ne $repoDir) {
    Set-Location $repoDir
}

# 1. Initialize git if it's not already
if (!(Test-Path ".git")) {
    git init
    Write-Host "Initialized local Git repository."
}

# Configure default branch name to main
git config user.name "Israel18417"
# We won't set email unless required, git might prompt, but let's try standard commit first.
# If no global user.email is set, let's configure a placeholder so it doesn't fail.
$hasEmail = git config --global user.email
if (!$hasEmail) {
    git config user.email "israel18417@users.noreply.github.com"
}

# 2. Add files
git add index.html index.css index.js

# 3. Commit
git commit -m "Initial commit: CSC426 Premium Calculator"

# 4. Set Branch to main
git branch -M main

# 5. Handle remote origin
$remotes = git remote
if ($remotes -contains "origin") {
    git remote remove origin
}
git remote add origin "https://github.com/Israel18417/CSC426.git"
Write-Host "Configured remote origin to: https://github.com/Israel18417/CSC426.git"

# 6. Push
Write-Host "Pushing code to GitHub main branch..."
Write-Host "Note: If Git Credential Manager prompts you, please authenticate in the popup window."
git push -u origin main
