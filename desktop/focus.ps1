Add-Type @"
using System;
using System.Runtime.InteropServices;
using System.Text;
public class Win {
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
  [DllImport("user32.dll")] public static extern bool GetWindowText(IntPtr hWnd, StringBuilder text, int max);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr hWnd);
}
"@
$procs = Get-Process | Where-Object { $_.ProcessName -like "*infinite*" }
$out = @()
foreach ($p in $procs) {
  $h = $p.MainWindowHandle
  $sb = New-Object System.Text.StringBuilder 256
  [Win]::GetWindowText($h, $sb, 256) | Out-Null
  $vis = [Win]::IsWindowVisible($h)
  $out += "pid=$($p.Id) hwnd=$h title='$($sb.ToString())' visible=$vis"
  if ($h -ne [IntPtr]::Zero -and $sb.ToString().Length -gt 0) {
    [Win]::ShowWindow($h, 9) | Out-Null  # SW_RESTORE
    [Win]::SetForegroundWindow($h) | Out-Null
    $out += "  -> brought to front"
  }
}
$out | Out-File "$env:TEMP\ic_win.txt" -Encoding utf8
Start-Sleep 2
"--- after focus ---" | Out-File "$env:TEMP\ic_win.txt" -Append -Encoding utf8
Get-Content "$env:TEMP\ic_win.txt"
