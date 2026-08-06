# Exécuter depuis la racine de mra-app.
$ErrorActionPreference = "Stop"

$files = @(
  "app/(app)/users/form.tsx",
  "app/(app)/users/index.tsx",
  "app/(app)/users/user-create.tsx"
)

foreach ($file in $files) {
  if (-not (Test-Path $file)) {
    throw "Fichier introuvable : $file"
  }
}

# Supprime l'option Logistique dans les formulaires.
$formFiles = @(
  "app/(app)/users/form.tsx",
  "app/(app)/users/user-create.tsx"
)

foreach ($file in $formFiles) {
  $content = Get-Content $file -Raw

  $content = $content -replace '(?ms)\s*\{\s*label:\s*"Logistique",\s*value:\s*"logistique",\s*\},', ''

  Set-Content -Path $file -Value $content -Encoding utf8
}

# Supprime le libellé Logistique dans la liste.
$indexFile = "app/(app)/users/index.tsx"
$content = Get-Content $indexFile -Raw
$content = $content -replace '(?m)^\s*logistique:\s*"Logistique",\s*\r?\n', ''
Set-Content -Path $indexFile -Value $content -Encoding utf8

Write-Host "Rôle Logistique supprimé des écrans utilisateurs." -ForegroundColor Green
