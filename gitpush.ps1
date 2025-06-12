# 鏂囦欢鍚?: gitpush.ps1
param([string]$message = "modify img css")

git add .
git commit -S -m $message
git push