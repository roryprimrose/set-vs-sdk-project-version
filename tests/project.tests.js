const Project = require('../src/project.js');

describe('setVersion', () => {
    test('setVersion throws exception with undefined data', async () => {
        let options = {};
    
        const sut = new Project();   
        
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
    
        const sut = new Project();   
        
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
    
        const sut = new Project();   
        
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
    
        const sut = new Project();   
        
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
        let options = {
            version: '',
            assemblyVersion: '',
            fileVersion: '',
            informationalVersion: ''   
        };

        const sut = new Project();   
        
        try {
            await sut.setVersion(data, options);

            throw 'This test failed in an unexpected way'
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
                    { 
                        TargetFramework: "netstandard2.0"
                    }
                ]
            }
        };
        const readXmlMock = jest.fn();
        const applyVersionMock = jest.fn();
        const writeXmlMock = jest.fn();

        readXmlMock.mockReturnValue(xml);

        const sut = new Project();

        sut.readXml = readXmlMock;
        sut.applyVersion = applyVersionMock;
        sut.writeXml = writeXmlMock;

        await sut.setVersion(data, options);

        expect(applyVersionMock).toHaveBeenCalledWith(xml, 'Version', options.version);
        expect(applyVersionMock).toHaveBeenCalledWith(xml, 'AssemblyVersion', options.assemblyVersion);
        expect(applyVersionMock).toHaveBeenCalledWith(xml, 'FileVersion', options.fileVersion);
        expect(applyVersionMock).toHaveBeenCalledWith(xml, 'InformationalVersion', options.informationalVersion);
    });

    test('setVersion applies version to Version element', async () => {
        const data = 
`<Project Sdk=\"Microsoft.NET.Sdk\">
    <PropertyGroup>
        <TargetFramework>netstandard2.0</TargetFramework>
    </PropertyGroup>
</Project>`;
        const options = {
            version: '0.1.0-feature-c0016',
            assemblyVersion: '',
            fileVersion: '',
            informationalVersion: ''    
        };
        const xml = {
            Project: {
                PropertyGroup: [
                    { 
                        TargetFramework: "netstandard2.0"
                    }
                ]
            }
        };
        const readXmlMock = jest.fn();
        const applyVersionMock = jest.fn();
        const writeXmlMock = jest.fn();

        readXmlMock.mockReturnValue(xml);

        const sut = new Project();

        sut.readXml = readXmlMock;
        sut.applyVersion = applyVersionMock;
        sut.writeXml = writeXmlMock;

        await sut.setVersion(data, options);

        expect(applyVersionMock).toHaveBeenCalledWith(xml, 'Version', options.version);
        expect(applyVersionMock).not.toHaveBeenCalledWith(xml, 'AssemblyVersion', options.assemblyVersion);
        expect(applyVersionMock).not.toHaveBeenCalledWith(xml, 'FileVersion', options.fileVersion);
        expect(applyVersionMock).not.toHaveBeenCalledWith(xml, 'InformationalVersion', options.informationalVersion);
    });

    test('setVersion applies version to AssemblyVersion element', async () => {
        const data = 
`<Project Sdk=\"Microsoft.NET.Sdk\">
    <PropertyGroup>
        <TargetFramework>netstandard2.0</TargetFramework>
    </PropertyGroup>
</Project>`;
        const options = {
            version: '',
            assemblyVersion: '0.1.0.0',
            fileVersion: '',
            informationalVersion: ''    
        };
        const xml = {
            Project: {
                PropertyGroup: [
                    { 
                        TargetFramework: "netstandard2.0"
                    }
                ]
            }
        };
        const readXmlMock = jest.fn();
        const applyVersionMock = jest.fn();
        const writeXmlMock = jest.fn();

        readXmlMock.mockReturnValue(xml);

        const sut = new Project();

        sut.readXml = readXmlMock;
        sut.applyVersion = applyVersionMock;
        sut.writeXml = writeXmlMock;

        await sut.setVersion(data, options);

        expect(applyVersionMock).not.toHaveBeenCalledWith(xml, 'Version', options.version);
        expect(applyVersionMock).toHaveBeenCalledWith(xml, 'AssemblyVersion', options.assemblyVersion);
        expect(applyVersionMock).not.toHaveBeenCalledWith(xml, 'FileVersion', options.fileVersion);
        expect(applyVersionMock).not.toHaveBeenCalledWith(xml, 'InformationalVersion', options.informationalVersion);
    });

    test('setVersion applies version to FileVersion element', async () => {
        const data = 
`<Project Sdk=\"Microsoft.NET.Sdk\">
    <PropertyGroup>
        <TargetFramework>netstandard2.0</TargetFramework>
    </PropertyGroup>
</Project>`;
        const options = {
            version: '',
            assemblyVersion: '',
            fileVersion: '0.1.0',
            informationalVersion: ''    
        };
        const xml = {
            Project: {
                PropertyGroup: [
                    { 
                        TargetFramework: "netstandard2.0"
                    }
                ]
            }
        };
        const readXmlMock = jest.fn();
        const applyVersionMock = jest.fn();
        const writeXmlMock = jest.fn();

        readXmlMock.mockReturnValue(xml);

        const sut = new Project();

        sut.readXml = readXmlMock;
        sut.applyVersion = applyVersionMock;
        sut.writeXml = writeXmlMock;

        await sut.setVersion(data, options);

        expect(applyVersionMock).not.toHaveBeenCalledWith(xml, 'Version', options.version);
        expect(applyVersionMock).not.toHaveBeenCalledWith(xml, 'AssemblyVersion', options.assemblyVersion);
        expect(applyVersionMock).toHaveBeenCalledWith(xml, 'FileVersion', options.fileVersion);
        expect(applyVersionMock).not.toHaveBeenCalledWith(xml, 'InformationalVersion', options.informationalVersion);
    });

    test('setVersion applies version to InformationalVersion element', async () => {
        const data = 
`<Project Sdk=\"Microsoft.NET.Sdk\">
    <PropertyGroup>
        <TargetFramework>netstandard2.0</TargetFramework>
    </PropertyGroup>
</Project>`;
        const options = {
            version: '',
            assemblyVersion: '',
            fileVersion: '',
            informationalVersion: '0.1.0-feature-CreateAction.16+Branch.feature-CreateAction.Sha.3a2139d11710900ea10c95b825600560f6388c64'    
        };
        const xml = {
            Project: {
                PropertyGroup: [
                    { 
                        TargetFramework: "netstandard2.0"
                    }
                ]
            }
        };
        const readXmlMock = jest.fn();
        const applyVersionMock = jest.fn();
        const writeXmlMock = jest.fn();

        readXmlMock.mockReturnValue(xml);

        const sut = new Project();

        sut.readXml = readXmlMock;
        sut.applyVersion = applyVersionMock;
        sut.writeXml = writeXmlMock;

        await sut.setVersion(data, options);

        expect(applyVersionMock).not.toHaveBeenCalledWith(xml, 'Version', options.version);
        expect(applyVersionMock).not.toHaveBeenCalledWith(xml, 'AssemblyVersion', options.assemblyVersion);
        expect(applyVersionMock).not.toHaveBeenCalledWith(xml, 'FileVersion', options.fileVersion);
        expect(applyVersionMock).toHaveBeenCalledWith(xml, 'InformationalVersion', options.informationalVersion);
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
                    { 
                        TargetFramework: "netstandard2.0"
                    }
                ]
            }
        };
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

        const sut = new Project();

        sut.readXml = readXmlMock;
        sut.applyXml = applyXmlMock;
        sut.writeXml = writeXmlMock;

        let actual = await sut.setVersion(data, options);

        expect(actual).toBe(expected);
    });
});

describe('readXml', () => {

    test('readXml returns parsed object', async () => {
        const data = 
`<Project Sdk=\"Microsoft.NET.Sdk\">
    <PropertyGroup>
        <TargetFramework>netstandard2.0</TargetFramework>
    </PropertyGroup>
</Project>`;

        const sut = new Project();

        const actual = await sut.readXml(data);

        expect(actual.Project.PropertyGroup[0].TargetFramework[0]).toEqual('netstandard2.0');
    });
});

describe('writeXml', () => {

    test('writeXml returns xml data', async () => {
        const xml = {
            Project: {
                $: {
                    Sdk: 'Microsoft.NET.Sdk'
                },
                PropertyGroup: [
                    { 
                        TargetFramework: "netstandard2.0",
                        Version: '0.1.0-feature-c0016',
                        AssemblyVersion: '0.1.0.0',
                        FileVersion: '0.1.0',
                        InformationalVersion: '0.1.0-feature-CreateAction.16+Branch.feature-CreateAction.Sha.3a2139d11710900ea10c95b825600560f6388c64'   
                    }
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
        <InformationalVersion>0.1.0-feature-CreateAction.16+Branch.feature-CreateAction.Sha.3a2139d11710900ea10c95b825600560f6388c64</InformationalVersion>
    </PropertyGroup>
</Project>`;

        const sut = new Project();

        const actual = await sut.writeXml(xml);

        expect(actual).toEqual(expected);
    });
});

describe('applyVersion', () => {
    test('applyVersion adds missing element to first PropertyGroup', () => {
        let xml = {
            Project: {
                $: {
                    Sdk: 'Microsoft.NET.Sdk'
                },
                PropertyGroup: [
                    { 
                        TargetFramework: "netstandard2.0"
                    }
                ]
            }
        }

        const sut = new Project();

        sut.applyVersion(xml, 'MyElement', 'SomeValue');

        expect(xml.Project.PropertyGroup[0].MyElement).toEqual('SomeValue');
    });
    
    test('applyVersion updates existing element in first PropertyGroup', () => {
        let xml = {
            Project: {
                $: {
                    Sdk: 'Microsoft.NET.Sdk'
                },
                PropertyGroup: [
                    { 
                        TargetFramework: "netstandard2.0",
                        MyElement: 'old value here'
                    }
                ]
            }
        }

        const sut = new Project();

        sut.applyVersion(xml, 'MyElement', 'SomeValue');

        expect(xml.Project.PropertyGroup[0].MyElement).toEqual('SomeValue');
    });
    
    test('applyVersion updates existing element in second PropertyGroup', () => {
        let xml = {
            Project: {
                $: {
                    Sdk: 'Microsoft.NET.Sdk'
                },
                PropertyGroup: [
                    { 
                        TargetFramework: "netstandard2.0"
                    },
                    { 
                        MyElement: 'old value here'
                    }
                ]
            }
        }

        const sut = new Project();

        sut.applyVersion(xml, 'MyElement', 'SomeValue');

        expect(xml.Project.PropertyGroup[1].MyElement).toEqual('SomeValue');
    });
});

describe('Integration Test', () => {

    test('setVersion returns project with updated values', async () => {
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
        const sut = new Project();

        let actual = await sut.setVersion(data, options);

        expect(actual).toBe(expected);
    });
});