$root = Split-Path -Parent $PSScriptRoot
$port = 8080
$batchPath = Join-Path $PSScriptRoot "Lancer_Borne_Serveur.bat"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Serveur demarre sur http://localhost:$port"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $path = $context.Request.Url.LocalPath

    # Endpoint de mise a jour
    if ($path -eq "/api/update") {
        Write-Host "Mise a jour demandee..."
        $context.Response.ContentType = "text/plain"
        $response = [System.Text.Encoding]::UTF8.GetBytes("OK")
        $context.Response.ContentLength64 = $response.Length
        $context.Response.OutputStream.Write($response, 0, $response.Length)
        $context.Response.Close()

        # Attendre 2 secondes puis relancer
        Start-Sleep -Seconds 2

        # Fermer Chrome
        Stop-Process -Name "chrome" -Force -ErrorAction SilentlyContinue

        # Git pull
        Set-Location $root
        git pull origin main

        # Arreter ce serveur et relancer le batch
        $listener.Stop()
        Start-Process -FilePath $batchPath
        exit
    }

    if ($path -eq "/") { $path = "/kiosk/index.html" }
    $file = Join-Path $root $path

    if (Test-Path $file -PathType Leaf) {
        $content = [System.IO.File]::ReadAllBytes($file)
        $ext = [System.IO.Path]::GetExtension($file)
        $mime = switch ($ext) {
            ".html" { "text/html" }
            ".js" { "application/javascript" }
            ".css" { "text/css" }
            ".png" { "image/png" }
            ".jpg" { "image/jpeg" }
            ".gif" { "image/gif" }
            ".mp4" { "video/mp4" }
            default { "application/octet-stream" }
        }
        $context.Response.ContentType = $mime
        $context.Response.ContentLength64 = $content.Length
        $context.Response.OutputStream.Write($content, 0, $content.Length)
    } else {
        $context.Response.StatusCode = 404
    }
    $context.Response.Close()
}
