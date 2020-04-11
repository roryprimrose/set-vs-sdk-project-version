const core = require('@actions/core');
const exec = require('@actions/exec');

async function run() {
    try {
        const projectFilter = core.getInput('projectFilter');
        const version = core.getInput('version');
        const assemblyVersion = core.getInput('assemblyVersion');
        const fileVersion = core.getInput('fileVersion');
        const informationalVersion = core.getInput('informationalVersion');

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

        var result = await exec.exec('pwsh', ['-File', 'version-projects.ps1', projectFilter, version, assemblyVersion, fileVersion, informationalVersion], options);

        core.info(myOutput);

        if (result !== 0) {
            core.error(myError);
        }
        
    } catch (error) {
        core.setFailed(error.message);
    }
}

run()