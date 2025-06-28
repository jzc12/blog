#  gitpush.ps1
param([string]$message = "add dark theme")

git add .
git commit -m $message
git push