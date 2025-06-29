#  gitpush.ps1
param([string]$message = "add files")

git add .
git commit -m $message
git push