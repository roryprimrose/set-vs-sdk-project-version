const core = require('@actions/core');
const promisify = require('util').promisify;
const xml2js = require('xml2js');

class Project {
    async setVersion(data, options) {

        if (!data) {
            throw { message: 'No data has been provided.' };
        }
        
        if (!options) {
            throw { message: 'No options have been provided.' };
        }
        else if (options.version === '' 
            && options.assemblyVersion === '' 
            && options.fileVersion === '' 
            && options.informationalVersion === '')
        {
            throw { message: 'At least one version value must be supplied. Add an input parameter for either version, assemblyVersion, fileVersion or informationalVersion.' };
        }
        
        let xml = await this.readXml(data);

        if (options.version) {
            this.applyVersion(xml, 'Version', options.version);
        }

        if (options.assemblyVersion) {
            this.applyVersion(xml, 'AssemblyVersion', options.assemblyVersion);
        }

        if (options.fileVersion) {
            this.applyVersion(xml, 'FileVersion', options.fileVersion);
        }

        if (options.informationalVersion) {
            this.applyVersion(xml, 'InformationalVersion', options.informationalVersion);
        }

        const updatedXml = this.writeXml(xml);
        
        return updatedXml;
    }

    async readXml(data) {       
        const parser = new xml2js.Parser();

        const parseString = promisify(parser.parseString);

        let result = await parseString(data);

        return result;
    }

    async writeXml(xml) {
        const builder = new xml2js.Builder(
        {
            headless: true,
            renderOpts: {
                'pretty': true, 
                'indent': '    '
            }
        });

        var updatedXml = await builder.buildObject(xml);
    
        return updatedXml;
    }

    applyVersion(xml, elementName, value) {
        let parentElement;
        
        for (let propertyGroupIndex = 0; propertyGroupIndex < xml.Project.PropertyGroup.length; propertyGroupIndex++) {
            let propertyGroup = xml.Project.PropertyGroup[propertyGroupIndex];

            if (elementName in propertyGroup) {
                parentElement = propertyGroup;
            }

            if (parentElement) {
                break;
            }
        }

        if (parentElement) {
            core.info(`Updating ${elementName} with the value ${value}`);

            parentElement[elementName] = value;
        }
        else {
            // There isn't an xml element with the expected name
            core.info(`${elementName} does not exist, adding it with the value ${value}`);

            xml.Project.PropertyGroup[0][elementName] = value;
        }
    }
}

module.exports = Project;