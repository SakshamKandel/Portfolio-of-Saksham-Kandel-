
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
            if ($file.PSIsContainer) { continue }
            Write-Host "Processing: $($file.Name)"
            
            # 1. Backup
            Copy-Item -LiteralPath $file.FullName -Destination $backupDest -Force
            
            try {
                # 2. Optimize
                $img = [System.Drawing.Image]::FromFile($file.FullName)
                
                # Calculate new dimensions (Max width 800 - Sufficient for Grid View)
                $newWidth = $img.Width
                $newHeight = $img.Height
                
                if ($img.Width -gt 800) {
                    $scale = 800 / $img.Width
                    $newWidth = 800
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
                
                # Save as new .jpg to TEMP path first to avoid file lock
                $newName = [System.IO.Path]::ChangeExtension($file.FullName, ".jpg")
                $tempName = $newName + ".tmp"
                $bmp.Save($tempName, $jpegCodec, $encoderParams)
                
                $img.Dispose()
                $bmp.Dispose()
                $graph.Dispose()
                
                # Move temp to final
                Move-Item -LiteralPath $tempName -Destination $newName -Force

                # If original was a different name (e.g. png), delete it
                if ($file.FullName -ne $newName) {
                    Remove-Item -LiteralPath $file.FullName -Force
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
