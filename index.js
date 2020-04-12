const core = require('@actions/core');
const glob = require('@actions/glob');
const fs = require('fs').promises;
const promisify = require('util').promisify;
const xml2js = require('xml2js');

async function run() {
    try {
        const projectFilter = core.getInput('projectFilter', { required: true });

        let options = {
            version: core.getInput('version'),
            assemblyVersion: core.getInput('assemblyVersion'),
            fileVersion: core.getInput('fileVersion'),
            informationalVersion: core.getInput('informationalVersion')
        };

        core.info(`Finding projects matching ${projectFilter}`);

        const globber = await glob.create(projectFilter)

        for await (const file of globber.globGenerator()) {
            processFile(file, options);
        }       
    } catch (error) {
        core.setFailed(error.message);
    }
}

async function processFile(filepath, options) {
    core.info(`Processing file ${filepath}`);

    let xml = await fs.readFile(filepath);

    const parser = new xml2js.Parser();

    const parseString = promisify(parser.parseString);

    let result = await parseString(xml);

    writeVersionData(result, options);

    const builder = new xml2js.Builder({headless: true});

    var updatedXml = await builder.buildObject(result);

    await fs.writeFile(filepath, updatedXml);

    core.info(JSON.stringify(result));
}

function writeVersionData(xml, options) {
    if (options.version) {
        applyVersion(xml, 'Version', options.version);
    }

    if (options.assemblyVersion) {
        applyVersion(xml, 'AssemblyVersion', options.assemblyVersion);
    }

    if (options.fileVersion) {
        applyVersion(xml, 'FileVersion', options.fileVersion);
    }

    if (options.informationalVersion) {
        applyVersion(xml, 'informationalVersion', options.informationalVersion);
    }
}

function applyVersion(xml, elementName, value) {
    let matchingElement;
    
    for (let propertyGroupIndex = 0; propertyGroupIndex < xml.Project.PropertyGroup.length; propertyGroupIndex++) {
        let propertyGroup = xml.Project.PropertyGroup[propertyGroupIndex];

        matchingElement = propertyGroup[elementName];

        if (matchingElement) {
            break;
        }
    }

    if (matchingElement) {
        core.info(`Updating PropertyGroup element ${elementName} with the value ${value}`);

        matchingElement[0] = value;
    }
    else {
        // There isn't an xml element with the expected name
        core.info(`PropertyGroup element ${elementName} does not exist, adding it with the value ${value}`);

        xml.Project.PropertyGroup[0][elementName] = value;
    }
}

run()