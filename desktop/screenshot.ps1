Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
$screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$bmp = New-Object System.Drawing.Bitmap $screen.Width, $screen.Height
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size)
$out = "C:\Users\Administrator\Desktop\DEo\infinite-canvas\infinite-canvas-main\desktop\.smoke.png"
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
$screenshot_dir = "C:\Users\Administrator\Desktop\DEo\infinite-canvas\infinite-canvas-main\desktop"
"SAVED:$out" | Out-File "$env:TEMP\ic_shot.txt" -Encoding utf8
