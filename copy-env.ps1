# PowerShell script to copy .env file from types directory to root as .env.local
$sourceFile = ".\types\.env"
$destinationFile = ".\.env.local"

# Check if source file exists
if (Test-Path $sourceFile) {
    # Copy the file
    Copy-Item -Path $sourceFile -Destination $destinationFile -Force
    Write-Host "Successfully copied $sourceFile to $destinationFile"
} else {
    Write-Host "Error: Source file $sourceFile not found."
}
