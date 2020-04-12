const core = require('@actions/core');
const glob = require('@actions/glob');
const fs = require('fs').promises;
const Project = require('./project.js')

async function run() {
    try {
        let options = {
            projectFilter: core.getInput('projectFilter', { required: true }),
            version: core.getInput('version'),
            assemblyVersion: core.getInput('assemblyVersion'),
            fileVersion: core.getInput('fileVersion'),
            informationalVersion: core.getInput('informationalVersion')
        };

        core.info('Updating project files with the following version information');

        if (options.version !== "") {            
            core.info(`Version: ${options.version}`);
        }

        if (options.assemblyVersion !== "") {            
            core.info(`AssemblyVersion: ${options.assemblyVersion}`);
        }

        if (options.fileVersion !== "") {            
            core.info(`FileVersion: ${options.fileVersion}`);
        }

        if (options.informationalVersion !== "") {            
            core.info(`InformationalVersion: ${options.informationalVersion}`);
        }

        core.info('')
        core.info(`Finding projects matching ${options.projectFilter}`);

        const globber = await glob.create(options.projectFilter)

        const project = new Project();

        for await (const file of globber.globGenerator()) {
            core.info('')
            core.info(`Found project at ${file}`);

            let originalProject = await fs.readFile(file);
        
            let updatedProject = await project.setVersion(originalProject, options);

            await fs.writeFile(file, updatedProject);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run()