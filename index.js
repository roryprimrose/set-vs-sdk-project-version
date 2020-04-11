const core = require('@actions/core');
const exec = require('@actions/exec');

function run() {
    try {
        const projectFilter = core.getInput('projectFilter');
        const version = core.getInput('version');
        const assemblyVersion = core.getInput('assemblyVersion');
        const fileVersion = core.getInput('fileVersion');
        const informationalVersion = core.getInput('informationalVersion');

        exec.exec('pwsh', ['version-projects.ps1', projectFilter, version, assemblyVersion, fileVersion, informationalVersion]);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run()