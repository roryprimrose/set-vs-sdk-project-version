[![Actions Status](https://github.com/roryprimrose/set-vs-sdk-project-version/workflows/CI/badge.svg)](https://github.com/roryprimrose/set-vs-sdk-project-version/actions)

# roryprimrose/set-vs-sdk-project-version

This GitHub action sets version information in Visual Studio SDK projects

# Usage

See [action.yml](action.yml)

Apply all version values to all SDK projects found:
```yaml
- name: Update project version
  uses: roryprimrose/set-vs-sdk-project-version@v1
  with:
    version: ${{ MyVersion }}
    assemblyVersion: ${{ MyAssemblySemVer }}
    fileVersion: ${{ MyMajorMinorPatch }}
    informationalVersion: ${{ MyInformationalVersion }} 
```

Only defining the Version value:
```yaml
- name: Update project version
  uses: roryprimrose/set-vs-sdk-project-version@v1
  with:
    version: ${{ MyVersion }}
```

Filtering particular projects
```yaml
- name: Update project version
  uses: roryprimrose/set-vs-sdk-project-version@v1
  with:
    projectFilter: '*.csproj'
    version: ${{ MyVersion }}
    assemblyVersion: ${{ MyAssemblySemVer }}
    fileVersion: ${{ MyMajorMinorPatch }}
    informationalVersion: ${{ MyInformationalVersion }} 
```

# Example

```yaml
steps:
- name: Checkout
  uses: actions/checkout@v1

- name: Fetch tags and master for GitVersion
  run: |
    git fetch --tags
    git branch --create-reflog master origin/master
    
- name: GitVersion
  id: gitversion  # step id used as reference for output values
  uses: roryprimrose/rungitversion@v1

- name: Update project version
  uses: roryprimrose/set-vs-sdk-project-version@v1
  with:
    version: ${{ steps.gitversion.outputs.NuGetVersionV2 }}
    assemblyVersion: ${{ steps.gitversion.outputs.AssemblySemVer }}
    fileVersion: ${{ steps.gitversion.outputs.MajorMinorPatch }}
    informationalVersion: ${{ steps.gitversion.outputs.InformationalVersion }}
    
- name: Setup dotnet
    uses: actions/setup-dotnet@v1
    with:
    dotnet-version: '3.0.100' # SDK Version to use.
```

# Changelog

## v1.0.3
- Updated to use JavaScript to run the action

## v1.0.2
- Updated to use Dockerfile to run the action

## v1.0.0
- Initial release

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

# Local testing
Clone this repo
```
git clone https://github.com/roryprimrose/set-vs-sdk-project-version.git
```

Run the action
```
npm run action
```
