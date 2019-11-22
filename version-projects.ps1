param (
    [Parameter(Mandatory=$true)][string]$projectFilter,
    [Parameter(Mandatory=$true)][string]$version,
    [Parameter(Mandatory=$true)][string]$assemblyVersion,
    [Parameter(Mandatory=$true)][string]$fileVersion,
    [Parameter(Mandatory=$true)][string]$informationalVersion
)

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
Write-Output "Version: $version"
Write-Output "AssemblyVersion: $assemblyVersion"
Write-Output "FileVersion: $fileVersion"
Write-Output "InformationalVersion: $informationalVersion"
Write-Output ""
Write-Output "Searching for projects ($projectFilter) under $sourcesDirectory"
Write-Output ""

# Find any file that matches the filter and update the contents based on the parameters passed in
Get-ChildItem -Path $sourcesDirectory -Filter $projectFilter -Recurse -File | 
    ForEach-Object { 
        
        Write-Output "Found project at $($_.FullName)"

        $projectPath = $_.FullName
        $project = Select-Xml $projectPath -XPath "//Project"
        
        Set-NodeValue $project "Version" $version
        Set-NodeValue $project "AssemblyVersion" $assemblyVersion
        Set-NodeValue $project "FileVersion" $fileVersion
        Set-NodeValue $project "InformationalVersion" $informationalVersion 

        $document = $project.Node.OwnerDocument
        $document.PreserveWhitespace = $true

        $document.Save($projectPath)

        Write-Output ""
    }
