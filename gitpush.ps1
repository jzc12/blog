#  gitpush.ps1
param([string]$message = "modify view")

git add .
git commit -m $message
git push