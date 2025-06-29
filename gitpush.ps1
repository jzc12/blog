#  gitpush.ps1
param([string]$message = "add sidebar info")

git add .
git commit -m $message
git push