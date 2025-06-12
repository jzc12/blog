# 鏂囦欢鍚?: gitpush.ps1
param([string]$message = "test img path")

git add .
git commit -S -m $message
git push