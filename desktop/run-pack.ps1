$desk = "C:\Users\Administrator\Desktop\DEo\infinite-canvas\infinite-canvas-main\desktop"
Set-Location $desk
$env:ELECTRON_MIRROR = "https://npmmirror.com/mirrors/electron/"
$env:ELECTRON_BUILDER_BINARIES_MIRROR = "https://npmmirror.com/mirrors/electron-builder-binaries/"
$packagerCli = "$desk\node_modules\electron-packager\bin\electron-packager.js"
node $packagerCli . infinite-canvas --platform=win32 --arch=x64 --out=../dist-desktop --overwrite --app-version=1.0.0 --icon=build/icon.ico 2>&1 | Out-File "$desk\pack.log" -Encoding utf8
"EXIT:$LASTEXITCODE" | Out-File "$desk\pack.log" -Append -Encoding utf8
