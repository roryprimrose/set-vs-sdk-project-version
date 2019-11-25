FROM mcr.microsoft.com/powershell:alpine-3.8

COPY versionprojects.ps1 /versionprojects.ps1

ENTRYPOINT [ "pwsh", "/versionprojects.ps1" ]