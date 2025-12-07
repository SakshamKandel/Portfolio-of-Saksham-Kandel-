
# Image Optimization Script
$sourceRoots = @(
    "c:\Users\Acer\Saksham Website Portfolio\Code\assets\Karnali Yaks",
    "c:\Users\Acer\Saksham Website Portfolio\Code\assets\Biratnagar Kings"
)
$backupRoot = "c:\Users\Acer\Saksham Website Portfolio\Code\assets\Originals"

Add-Type -AssemblyName System.Drawing

foreach ($folder in $sourceRoots) {
    if (Test-Path $folder) {
        $folderName = Split-Path $folder -Leaf
        $backupDest = Join-Path $backupRoot $folderName
        
        # Create backup directory
        if (-not (Test-Path $backupDest)) { New-Item -ItemType Directory -Path $backupDest -Force | Out-Null }
        
        $files = Get-ChildItem -Path $folder -Include *.png, *.jpg, *.jpeg -Recurse
        
        foreach ($file in $files) {
            Write-Host "Processing: $($file.Name)"
            
            # 1. Backup
            Copy-Item $file.FullName -Destination $backupDest -Force
            
            try {
                # 2. Optimize
                $img = [System.Drawing.Image]::FromFile($file.FullName)
                
                # Calculate new dimensions (Max width 1920)
                $newWidth = $img.Width
                $newHeight = $img.Height
                
                if ($img.Width -gt 1920) {
                    $scale = 1920 / $img.Width
                    $newWidth = 1920
                    $newHeight = [int]($img.Height * $scale)
                }
                
                $bmp = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
                $graph = [System.Drawing.Graphics]::FromImage($bmp)
                $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $graph.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
                $graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
                
                $graph.DrawImage($img, 0, 0, $newWidth, $newHeight)
                
                # Encoder parameters for JPEG Quality
                $encoder = [System.Drawing.Imaging.Encoder]::Quality
                $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
                $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, 85) # Quality 85
                $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
                
                # Save as new .jpg
                $newName = [System.IO.Path]::ChangeExtension($file.FullName, ".jpg")
                $bmp.Save($newName, $jpegCodec, $encoderParams)
                
                $img.Dispose()
                $bmp.Dispose()
                $graph.Dispose()
                
                # If original was not jpg, or name changed, delete original (it is backed up)
                if ($file.FullName -ne $newName) {
                    Remove-Item $file.FullName -Force
                }
                
                Write-Host "Optimized: $newName"
            }
            catch {
                Write-Error "Failed to optimize $($file.Name): $_"
            }
        }
    }
}
Write-Host "Optimization Complete."
