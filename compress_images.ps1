Add-Type -AssemblyName System.Drawing

function Compress-Image {
    param (
        [string]$sourcePath,
        [int]$quality = 70,
        [int]$maxWidth = 1920
    )

    if (-Not (Test-Path $sourcePath)) {
        Write-Host "File not found: $sourcePath"
        return
    }

    $image = [System.Drawing.Image]::FromFile($sourcePath)
    
    $width = $image.Width
    $height = $image.Height

    if ($width -gt $maxWidth) {
        $ratio = $maxWidth / $width
        $width = $maxWidth
        $height = [int]($height * $ratio)
    }

    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $graph = [System.Drawing.Graphics]::FromImage($bmp)
    
    $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graph.DrawImage($image, 0, 0, $width, $height)
    
    $image.Dispose()
    $graph.Dispose()

    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageDecoders() | Where-Object { $_.FormatID -eq [System.Drawing.Imaging.ImageFormat]::Jpeg.Guid }
    
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $quality)

    $tempPath = $sourcePath + ".tmp.jpg"
    $bmp.Save($tempPath, $codec, $encoderParams)
    $bmp.Dispose()
    
    Remove-Item $sourcePath -Force
    Rename-Item $tempPath $sourcePath -Force

    Write-Host "Compressed: $sourcePath"
}

Compress-Image -sourcePath "$pwd\public\og-image.png"
Compress-Image -sourcePath "$pwd\public\twitter-card.png"
Compress-Image -sourcePath "$pwd\public\Assets\Blogs_2.png" -maxWidth 1200
Compress-Image -sourcePath "$pwd\public\Assets\F1.jpg" -maxWidth 1200
Compress-Image -sourcePath "$pwd\public\Assets\Shahood.png" -maxWidth 800
Compress-Image -sourcePath "$pwd\public\Assets\Ruhan.png" -maxWidth 800
Compress-Image -sourcePath "$pwd\public\Assets\Ruhan_Bk.png" -maxWidth 800
