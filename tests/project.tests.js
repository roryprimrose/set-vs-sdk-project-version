const Project = require('../src/project.js');

describe('setVersion', () => {
    test('setVersion throws exception with undefined data', async () => {
        let options = {};
    
        let sut = new Project();   
        
        try {
            await sut.setVersion(undefined, options);
        }
        catch (e) {
            expect(e).toEqual({
                message: 'No data has been provided.'
              });
        }
    });

    test('setVersion throws exception with null data', async () => {
        let options = {};
    
        let sut = new Project();   
        
        try {
            await sut.setVersion(null, options);
        }
        catch (e) {
            expect(e).toEqual({
                message: 'No data has been provided.'
              });
        }
    });

    test('setVersion throws exception with undefined options', async () => {
        let data = '<Project Sdk="Microsoft.NET.Sdk"></Project>';
    
        let sut = new Project();   
        
        try {
            await sut.setVersion(data, undefined);
        }
        catch (e) {
            expect(e).toEqual({
                message: 'No options have been provided.'
              });
        }
    });

    test('setVersion throws exception with null options', async () => {
        let data = '<Project Sdk="Microsoft.NET.Sdk"></Project>';
    
        let sut = new Project();   
        
        try {
            await sut.setVersion(data, null);
        }
        catch (e) {
            expect(e).toEqual({
                message: 'No options have been provided.'
              });
        }
    });

    test('setVersion throws exception with empty options', async () => {
        let data = '<Project Sdk="Microsoft.NET.Sdk"></Project>';
        let options = {};

        let sut = new Project();   
        
        try {
            await sut.setVersion(data, options);
        }
        catch (e) {
            expect(e).toEqual({
                message: 'At least one version value must be supplied. Add an input parameter for either version, assemblyVersion, fileVersion or informationalVersion.'
              });
        }
    });

    test('setVersion applies version to all elements', async () => {
        const data = 
`<Project Sdk=\"Microsoft.NET.Sdk\">
    <PropertyGroup>
        <TargetFramework>netstandard2.0</TargetFramework>
    </PropertyGroup>
</Project>`;
        const options = {
            version: '0.1.0-feature-c0016',
            assemblyVersion: '0.1.0.0',
            fileVersion: '0.1.0',
            informationalVersion: '0.1.0-feature-CreateAction.16+Branch.feature-CreateAction.Sha.3a2139d11710900ea10c95b825600560f6388c64'    
        };
        const xml = {
            Project: {
                PropertyGroup: [
                    { TargetFramework: "netstandard2.0"}
                ]
            }
        }
        const readXmlMock = jest.fn();
        const applyXmlMock = jest.fn();
        const writeXmlMock = jest.fn();

        readXmlMock.mockReturnValue(xml);

        let sut = new Project();

        sut.readXml = readXmlMock;
        sut.applyXml = applyXmlMock;
        sut.writeXml = writeXmlMock;

        await sut.setVersion(data, options);

        expect(applyXmlMock).toHaveBeenCalledWith(xml, 'Version', options.version);
        expect(applyXmlMock).toHaveBeenCalledWith(xml, 'AssemblyVersion', options.assemblyVersion);
        expect(applyXmlMock).toHaveBeenCalledWith(xml, 'FileVersion', options.fileVersion);
        expect(applyXmlMock).toHaveBeenCalledWith(xml, 'InformationalVersion', options.informationalVersion);
    });

    test('setVersion returns data from writeXml', async () => {
        const data = 
`<Project Sdk=\"Microsoft.NET.Sdk\">
    <PropertyGroup>
        <TargetFramework>netstandard2.0</TargetFramework>
    </PropertyGroup>
</Project>`;
        const options = {
            version: '0.1.0-feature-c0016',
            assemblyVersion: '0.1.0.0',
            fileVersion: '0.1.0',
            informationalVersion: '0.1.0-feature-CreateAction.16+Branch.feature-CreateAction.Sha.3a2139d11710900ea10c95b825600560f6388c64'    
        };
        const xml = {
            Project: {
                PropertyGroup: [
                    { TargetFramework: "netstandard2.0"}
                ]
            }
        }
        const expected = 
`<Project Sdk=\"Microsoft.NET.Sdk\">
    <PropertyGroup>
        <TargetFramework>netstandard2.0</TargetFramework>
        <Version>0.1.0-feature-c0016</Version>
        <AssemblyVersion>0.1.0.0</AssemblyVersion>
        <FileVersion>0.1.0</FileVersion>
        <InformationalVersion>0.1.0</InformationalVersion>
    </PropertyGroup>
</Project>`;
        const readXmlMock = jest.fn();
        const applyXmlMock = jest.fn();
        const writeXmlMock = jest.fn();

        readXmlMock.mockReturnValue(xml);
        writeXmlMock.mockReturnValue(expected);

        let sut = new Project();

        sut.readXml = readXmlMock;
        sut.applyXml = applyXmlMock;
        sut.writeXml = writeXmlMock;

        let actual = await sut.setVersion(data, options);

        expect(actual).toBe(expected);
    });

    test('setVersion returns project with updated values', async () => {
        const data = 
`<Project Sdk=\"Microsoft.NET.Sdk\">
    <PropertyGroup>
        <TargetFramework>netstandard2.0</TargetFramework>
    </PropertyGroup>
</Project>`;
        const xml = {
            Project: {
                PropertyGroup: [
                    { TargetFramework: "netstandard2.0"}
                ]
            }
        }
        const options = {
            version: '0.1.0-feature-c0016',
            assemblyVersion: '0.1.0.0',
            fileVersion: '0.1.0',
            informationalVersion: '0.1.0-feature-CreateAction.16+Branch.feature-CreateAction.Sha.3a2139d11710900ea10c95b825600560f6388c64'    
        };
        const expected = 
`<Project Sdk=\"Microsoft.NET.Sdk\">
  <PropertyGroup>
    <TargetFramework>netstandard2.0</TargetFramework>
    <Version>${options.version}</Version>
    <AssemblyVersion>${options.assemblyVersion}</AssemblyVersion>
    <FileVersion>${options.fileVersion}</FileVersion>
    <InformationalVersion>${options.informationalVersion}</InformationalVersion>
  </PropertyGroup>
</Project>`
        let sut = new Project();

        let actual = await sut.setVersion(data, options);

        expect(actual).toBe(expected);
    });
});