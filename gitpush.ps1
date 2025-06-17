#  gitpush.ps1
param([string]$message = "modify md files")

git add .
git commit -m $message
git push