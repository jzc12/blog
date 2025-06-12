# ÎÄ¼şÃû: gitpush.ps1
param([string]$message = "update")

git add .
git commit -S -m $message
git push