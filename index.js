const core = require('@actions/core');
const exec = require('@actions/exec');
const glob = require('@actions/glob');

async function run() {
    try {
        const projectFilter = core.getInput('projectFilter');
        const version = core.getInput('version');
        const assemblyVersion = core.getInput('assemblyVersion');
        const fileVersion = core.getInput('fileVersion');
        const informationalVersion = core.getInput('informationalVersion');

        const globber = await glob.create('**')
        
        for await (const file of globber.globGenerator()) {
          console.log(file)
        }

        var myError = '';
        var myOutput = '';

        const options = {};
        options.listeners = {
          stdout: (data) => {
            myOutput += data.toString();
          },
          stderr: (data) => {
            myError += data.toString();
          }
        };

        var result = await exec.exec('pwsh', ['-File', '../version-projects.ps1', projectFilter, version, assemblyVersion, fileVersion, informationalVersion], options);

        core.info(myOutput);

        if (result !== 0) {
            core.error(myError);
        }
        
    } catch (error) {
        core.setFailed(error.message);
    }
}

run()