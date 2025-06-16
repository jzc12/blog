# 鏂囦欢鍚?: gitpush.ps1
param([string]$message = "add md files")

git add .
git commit -m $message
git push