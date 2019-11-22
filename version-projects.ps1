param (
    [Parameter(Mandatory=$true)][string]$projectFilter,
    [Parameter(Mandatory=$false)][string]$version,
    [Parameter(Mandatory=$false)][string]$assemblyVersion,
    [Parameter(Mandatory=$false)][string]$fileVersion,
    [Parameter(Mandatory=$false)][string]$informationalVersion
)

# Check that we have a project filter
if ([string]::IsNullOrWhiteSpace($projectFilter))
{
    throw "At least one version value must be supplied. Add an input parameter for either version, assemblyVersion, fileVersion or informationalVersion."
}

# Check that we have at least one version variable
if ([string]::IsNullOrWhiteSpace($version) -and [string]::IsNullOrWhiteSpace($assemblyVersion) -and [string]::IsNullOrWhiteSpace($fileVersion) -and [string]::IsNullOrWhiteSpace($informationalVersion))
{
    throw "At least one version value must be supplied. Add an input parameter for either version, assemblyVersion, fileVersion or informationalVersion."
}

$sourcesDirectory = $PSScriptRoot

Function Set-NodeValue($rootNode, [string]$nodeName, [string]$value)
{   
    $nodePath = "PropertyGroup/$($nodeName)"
    
    $node = $rootNode.Node.SelectSingleNode($nodePath)

    if ($null -eq $node) {
        Write-Output "Adding $($nodeName) element to existing PropertyGroup"

        $group = $rootNode.Node.SelectSingleNode("PropertyGroup")
        $node = $group.OwnerDocument.CreateElement($nodeName)
        $group.AppendChild($node) | Out-Null
    }

    $node.InnerText = $value

    Write-Output "Set $($nodeName) to $($value)"
}

Write-Output "Updating project files with the following version information"

if (-not [string]::IsNullOrWhiteSpace($version))
{
    Write-Output "Version: $version"
}

if (-not [string]::IsNullOrWhiteSpace($assemblyVersion))
{
    Write-Output "AssemblyVersion: $assemblyVersion"
}

if (-not [string]::IsNullOrWhiteSpace($fileVersion))
{
    Write-Output "FileVersion: $fileVersion"
}

if (-not [string]::IsNullOrWhiteSpace($informationalVersion))
{
    Write-Output "InformationalVersion: $informationalVersion"
}

Write-Output ""
Write-Output "Searching for projects ($projectFilter) under $sourcesDirectory"
Write-Output ""

# Find any file that matches the filter and update the contents based on the parameters passed in
Get-ChildItem -Path $sourcesDirectory -Filter $projectFilter -Recurse -File | 
    ForEach-Object { 
        
        Write-Output "Found project at $($_.FullName)"

        $projectPath = $_.FullName
        $project = Select-Xml $projectPath -XPath "//Project"
        
        if (-not [string]::IsNullOrWhiteSpace($version))
        {
            Set-NodeValue $project "Version" $version
        }

        if (-not [string]::IsNullOrWhiteSpace($assemblyVersion))
        {
            Set-NodeValue $project "AssemblyVersion" $assemblyVersion
        }

        if (-not [string]::IsNullOrWhiteSpace($fileVersion))
        {
            Set-NodeValue $project "FileVersion" $fileVersion
        }

        if (-not [string]::IsNullOrWhiteSpace($informationalVersion))
        {
            Set-NodeValue $project "InformationalVersion" $informationalVersion
        }

        $document = $project.Node.OwnerDocument
        $document.PreserveWhitespace = $true

        $document.Save($projectPath)

        Write-Output ""
    }
