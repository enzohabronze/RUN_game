Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$custom = Join-Path $root "assets\custom"

function Ensure-Dir($path) {
  if (-not (Test-Path -LiteralPath $path)) {
    New-Item -ItemType Directory -Force -Path $path | Out-Null
  }
}

function Save-Png($path, $draw) {
  if (Test-Path -LiteralPath $path) {
    return
  }

  Ensure-Dir (Split-Path -Parent $path)
  $bitmap = New-Object System.Drawing.Bitmap 128, 128
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.Clear([System.Drawing.Color]::Transparent)
  & $draw $graphics
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $bitmap.Dispose()
}

function Brush($hex) {
  return New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml($hex))
}

function Pen($hex, $width = 4) {
  $pen = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml($hex)), $width
  $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  return $pen
}

function Draw-Player($graphics, $damage, $state, $frame) {
  $outline = Pen "#151514" 4
  $skin = Brush "#f0c15a"
  $shirt = Brush "#57c7a2"
  $cart = Brush "#a26b3d"
  $boxColors = @("#d3a15d", "#c28a4a", "#ad7341", "#895838")
  $box = Brush $boxColors[$damage]
  $wheel = Brush "#2d3330"
  $crackPen = Pen "#4b3024" (3 + [Math]::Min($damage, 2))

  $bob = @(2, -2, 3, -1)[$frame % 4]
  $lean = 0
  if ($state -eq "turn-left") { $lean = -8 }
  if ($state -eq "turn-right") { $lean = 8 }
  if ($state -eq "hit") { $lean = @(10, -10)[$frame % 2] }

  $graphics.TranslateTransform(64, 66 + $bob)
  $graphics.RotateTransform($lean)
  $graphics.TranslateTransform(-64, -66)

  $graphics.FillRectangle($cart, 31, 56, 66, 42)
  $graphics.DrawRectangle($outline, 31, 56, 66, 42)
  $graphics.FillPolygon($box, @(
    [System.Drawing.Point]::new(39, 58),
    [System.Drawing.Point]::new(87, 58),
    [System.Drawing.Point]::new(76, 78),
    [System.Drawing.Point]::new(48, 78)
  ))
  $graphics.DrawPolygon($outline, @(
    [System.Drawing.Point]::new(39, 58),
    [System.Drawing.Point]::new(87, 58),
    [System.Drawing.Point]::new(76, 78),
    [System.Drawing.Point]::new(48, 78)
  ))

  if ($damage -ge 1) { $graphics.DrawLine($crackPen, 47, 66, 63, 69) }
  if ($damage -ge 2) { $graphics.DrawLine($crackPen, 66, 80, 82, 88) }
  if ($damage -ge 3) {
    $graphics.DrawLine($crackPen, 43, 88, 66, 94)
    $graphics.DrawLine($crackPen, 82, 62, 91, 75)
  }

  $graphics.FillEllipse($wheel, 35, 98, 18, 18)
  $graphics.FillEllipse($wheel, 76, 98, 18, 18)
  $graphics.FillEllipse($skin, 49, 16, 30, 30)
  $graphics.DrawEllipse($outline, 49, 16, 30, 30)
  $graphics.FillRectangle($shirt, 48, 42, 32, 24)
  $graphics.DrawRectangle($outline, 48, 42, 32, 24)

  $armPen = Pen "#151514" 5
  if ($state -eq "turn-left") {
    $graphics.DrawLine($armPen, 42, 64, 18, 54)
    $graphics.DrawLine($armPen, 86, 64, 96, 42)
  } elseif ($state -eq "turn-right") {
    $graphics.DrawLine($armPen, 42, 64, 32, 42)
    $graphics.DrawLine($armPen, 86, 64, 110, 54)
  } else {
    $graphics.DrawLine($armPen, 42, 64, 25, 47)
    $graphics.DrawLine($armPen, 86, 64, 103, 47)
  }

  if ($state -eq "hit") {
    $hitPen = Pen "#e85d56" 5
    $graphics.DrawLine($hitPen, 20, 18, 32, 30)
    $graphics.DrawLine($hitPen, 32, 18, 20, 30)
    $graphics.DrawLine($hitPen, 96, 18, 108, 30)
    $graphics.DrawLine($hitPen, 108, 18, 96, 30)
    $hitPen.Dispose()
  }

  $graphics.ResetTransform()
  $outline.Dispose(); $skin.Dispose(); $shirt.Dispose(); $cart.Dispose(); $box.Dispose(); $wheel.Dispose(); $crackPen.Dispose(); $armPen.Dispose()
}

function Draw-Obstacle($graphics, $kind) {
  $outline = Pen "#151514" 4
  if ($kind -eq "cone") {
    $graphics.FillPolygon((Brush "#e85d56"), @([System.Drawing.Point]::new(64,18),[System.Drawing.Point]::new(94,100),[System.Drawing.Point]::new(34,100)))
  } elseif ($kind -eq "crate") {
    $graphics.FillRectangle((Brush "#9b6338"), 34, 34, 60, 60)
  } elseif ($kind -eq "pothole") {
    $graphics.FillEllipse((Brush "#171818"), 24, 42, 82, 42)
  } elseif ($kind -eq "barrier") {
    $graphics.FillRectangle((Brush "#f0c15a"), 18, 48, 92, 30)
    $graphics.DrawLine((Pen "#e85d56" 7), 28, 78, 54, 48)
    $graphics.DrawLine((Pen "#e85d56" 7), 66, 78, 94, 48)
  } else {
    $graphics.FillEllipse((Brush "#111818"), 28, 38, 72, 54)
  }
  $graphics.DrawEllipse($outline, 18, 18, 92, 92)
  $outline.Dispose()
}

function Draw-Pickup($graphics, $kind) {
  $outline = Pen "#151514" 4
  if ($kind -eq "package") {
    $graphics.FillRectangle((Brush "#d3a15d"), 36, 36, 58, 58)
    $graphics.DrawRectangle($outline, 36, 36, 58, 58)
    $graphics.DrawLine($outline, 36, 58, 94, 58)
    $graphics.DrawLine($outline, 64, 36, 64, 94)
  } else {
    $graphics.FillEllipse((Brush "#57c7a2"), 32, 32, 64, 64)
    $plus = Pen "#f4f1e8" 9
    $graphics.DrawLine($plus, 64, 44, 64, 84)
    $graphics.DrawLine($plus, 44, 64, 84, 64)
    $plus.Dispose()
  }
  $outline.Dispose()
}

$states = @{
  "run" = 4
  "turn-left" = 2
  "turn-right" = 2
  "hit" = 2
}

foreach ($stateName in $states.Keys) {
  for ($damage = 0; $damage -le 3; $damage++) {
    for ($frame = 0; $frame -lt $states[$stateName]; $frame++) {
      $file = Join-Path $custom "player\$stateName\damage-$damage\frame-$frame.png"
      Save-Png $file { param($g) Draw-Player $g $damage $stateName $frame }
    }
  }
}

Save-Png (Join-Path $custom "player\player.png") { param($g) Draw-Player $g 0 "run" 0 }
Save-Png (Join-Path $custom "player\base.png") { param($g) Draw-Player $g 0 "run" 0 }

foreach ($kind in @("cone", "crate", "pothole", "barrier", "oil")) {
  Save-Png (Join-Path $custom "obstacles\$kind.png") { param($g) Draw-Obstacle $g $kind }
}

foreach ($kind in @("package", "repair")) {
  Save-Png (Join-Path $custom "pickups\$kind.png") { param($g) Draw-Pickup $g $kind }
}

function Draw-Background($graphics, $top, $bottom, $road, $accent) {
  $rect = [System.Drawing.Rectangle]::new(0, 0, 720, 1280)
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, ([System.Drawing.ColorTranslator]::FromHtml($top)), ([System.Drawing.ColorTranslator]::FromHtml($bottom)), 90
  $graphics.FillRectangle($brush, $rect)
  $brush.Dispose()

  $roadBrush = Brush $road
  $graphics.FillRectangle($roadBrush, 210, 0, 300, 1280)
  $roadBrush.Dispose()

  $linePen = Pen "#f4f1e8" 7
  $linePen.DashPattern = @(18, 18)
  $graphics.DrawLine($linePen, 320, 0, 320, 1280)
  $graphics.DrawLine($linePen, 400, 0, 400, 1280)
  $linePen.Dispose()

  $accentBrush = Brush $accent
  for ($i = 0; $i -lt 20; $i++) {
    $x = if ($i % 2 -eq 0) { 45 } else { 575 }
    $y = $i * 72
    $graphics.FillEllipse($accentBrush, $x, $y, 95, 55)
  }
  $accentBrush.Dispose()
}

function Save-Bg($path, $top, $bottom, $road, $accent) {
  if (Test-Path -LiteralPath $path) {
    return
  }

  Ensure-Dir (Split-Path -Parent $path)
  $bitmap = New-Object System.Drawing.Bitmap 720, 1280
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  Draw-Background $graphics $top $bottom $road $accent
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $bitmap.Dispose()
}

Save-Bg (Join-Path $custom "backgrounds\menu.png") "#244436" "#07100d" "#3f3d39" "#315c3f"
Save-Bg (Join-Path $custom "backgrounds\pause.png") "#1c2730" "#07090b" "#30363c" "#35596b"
Save-Bg (Join-Path $custom "backgrounds\game-over.png") "#3b1f23" "#090707" "#342b2c" "#6b2c2f"
Save-Bg (Join-Path $custom "backgrounds\level-complete.png") "#27351f" "#090d07" "#35432e" "#5f7a36"
Save-Bg (Join-Path $custom "backgrounds\levels\level-1.png") "#213c33" "#101716" "#3f3d39" "#254531"
Save-Bg (Join-Path $custom "backgrounds\levels\level-2.png") "#394b33" "#151914" "#45413a" "#31472e"
Save-Bg (Join-Path $custom "backgrounds\levels\level-3.png") "#2b4653" "#10181c" "#46484a" "#263943"
Save-Bg (Join-Path $custom "backgrounds\levels\level-4.png") "#245052" "#0f1717" "#3b403f" "#263837"

function Save-Road($path) {
  if (Test-Path -LiteralPath $path) { return }
  Ensure-Dir (Split-Path -Parent $path)
  $bitmap = New-Object System.Drawing.Bitmap 405, 720
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $edge = Brush "#56534b"
  $road = Brush "#3f3d39"
  $graphics.FillRectangle($edge, 54, 0, 297, 720)
  $graphics.FillRectangle($road, 68, 0, 269, 720)
  $pen = Pen "#f4f1e8" 4
  $pen.DashPattern = @(12, 14)
  $graphics.DrawLine($pen, 147, 0, 147, 720)
  $graphics.DrawLine($pen, 258, 0, 258, 720)
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose(); $bitmap.Dispose(); $edge.Dispose(); $road.Dispose(); $pen.Dispose()
}

function Save-Button($path, $fill, $edge) {
  if (Test-Path -LiteralPath $path) { return }
  Ensure-Dir (Split-Path -Parent $path)
  $bitmap = New-Object System.Drawing.Bitmap 640, 128
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $brush = Brush $fill
  $pen = Pen $edge 4
  $rect = [System.Drawing.Rectangle]::new(8, 8, 624, 112)
  $graphics.FillRectangle($brush, $rect)
  $graphics.DrawRectangle($pen, $rect)
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose(); $bitmap.Dispose(); $brush.Dispose(); $pen.Dispose()
}

function Save-Icon($path, $fill, $kind) {
  if (Test-Path -LiteralPath $path) { return }
  Ensure-Dir (Split-Path -Parent $path)
  $bitmap = New-Object System.Drawing.Bitmap 128, 128
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $brush = Brush $fill
  $pen = Pen "#111111" 5
  if ($kind -eq "pause") {
    $graphics.FillRectangle($brush, 38, 28, 16, 72)
    $graphics.FillRectangle($brush, 74, 28, 16, 72)
  } elseif ($kind -eq "star-empty") {
    $graphics.DrawPolygon($pen, @([System.Drawing.Point]::new(64,12),[System.Drawing.Point]::new(78,48),[System.Drawing.Point]::new(116,48),[System.Drawing.Point]::new(84,70),[System.Drawing.Point]::new(96,108),[System.Drawing.Point]::new(64,84),[System.Drawing.Point]::new(32,108),[System.Drawing.Point]::new(44,70),[System.Drawing.Point]::new(12,48),[System.Drawing.Point]::new(50,48)))
  } elseif ($kind -eq "star-full") {
    $graphics.FillPolygon($brush, @([System.Drawing.Point]::new(64,12),[System.Drawing.Point]::new(78,48),[System.Drawing.Point]::new(116,48),[System.Drawing.Point]::new(84,70),[System.Drawing.Point]::new(96,108),[System.Drawing.Point]::new(64,84),[System.Drawing.Point]::new(32,108),[System.Drawing.Point]::new(44,70),[System.Drawing.Point]::new(12,48),[System.Drawing.Point]::new(50,48)))
  } else {
    $graphics.FillEllipse($brush, 22, 22, 84, 84)
    $graphics.DrawEllipse($pen, 22, 22, 84, 84)
  }
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose(); $bitmap.Dispose(); $brush.Dispose(); $pen.Dispose()
}

Save-Road (Join-Path $custom "road\road.png")
Save-Button (Join-Path $custom "ui\buttons\primary-normal.png") "#f0c15a" "#7a5b1d"
Save-Button (Join-Path $custom "ui\buttons\primary-hover.png") "#ffd878" "#8b6928"
Save-Button (Join-Path $custom "ui\buttons\primary-active.png") "#d9a83e" "#5f4616"
Save-Button (Join-Path $custom "ui\buttons\secondary-normal.png") "#24302e" "#6d817b"
Save-Button (Join-Path $custom "ui\buttons\secondary-hover.png") "#31403d" "#8ca39c"
Save-Button (Join-Path $custom "ui\buttons\secondary-active.png") "#1b2422" "#52645f"
Save-Icon (Join-Path $custom "ui\icons\cargo.png") "#f0c15a" "cargo"
Save-Icon (Join-Path $custom "ui\icons\items.png") "#57c7a2" "items"
Save-Icon (Join-Path $custom "ui\icons\route.png") "#78a9ff" "route"
Save-Icon (Join-Path $custom "ui\icons\level.png") "#d889ff" "level"
Save-Icon (Join-Path $custom "ui\icons\pause.png") "#f4f1e8" "pause"
Save-Icon (Join-Path $custom "ui\stars\star-full.png") "#f0c15a" "star-full"
Save-Icon (Join-Path $custom "ui\stars\star-empty.png") "#50483a" "star-empty"

function Save-Decor($path, $fill, $kind) {
  if (Test-Path -LiteralPath $path) { return }
  Ensure-Dir (Split-Path -Parent $path)
  $bitmap = New-Object System.Drawing.Bitmap 256, 256
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $brush = Brush $fill
  $dark = Brush "#182018"
  $pen = Pen "#111111" 4
  if ($kind -eq "grass") {
    $graphics.FillEllipse($brush, 42, 70, 172, 118)
    $graphics.FillEllipse($dark, 76, 44, 86, 90)
  } elseif ($kind -eq "stone") {
    $graphics.FillEllipse($brush, 52, 78, 154, 94)
    $graphics.DrawEllipse($pen, 52, 78, 154, 94)
  } else {
    $graphics.FillRectangle($brush, 72, 50, 92, 150)
    $graphics.DrawRectangle($pen, 72, 50, 92, 150)
  }
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose(); $bitmap.Dispose(); $brush.Dispose(); $dark.Dispose(); $pen.Dispose()
}

Save-Decor (Join-Path $custom "decor\left-1.png") "#2f6f3d" "grass"
Save-Decor (Join-Path $custom "decor\left-2.png") "#6d6b62" "stone"
Save-Decor (Join-Path $custom "decor\left-3.png") "#8b6a3f" "post"
Save-Decor (Join-Path $custom "decor\right-1.png") "#2f6f3d" "grass"
Save-Decor (Join-Path $custom "decor\right-2.png") "#6d6b62" "stone"
Save-Decor (Join-Path $custom "decor\right-3.png") "#8b6a3f" "post"
