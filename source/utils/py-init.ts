import fs from 'fs';
import createPyConfig from '../constants/configs/python.js';
import createPyDeploy from '../constants/deploys/python.js';
import getProjectName from './project-name.js';

/**
 * Creates the initial files necessary (astral.config.js, astral.deploy.js) to run Astral.
 * @param projectName - The name of the project, from either package.json or the dir name.
 */
export default function pyInit(setUpdates: (message: string) => void) {
	if (fs.existsSync('astral.py')) return;

	const projectName = getProjectName('python');
	const pyConfig = createPyConfig(projectName);
	fs.writeFile('astral.py', pyConfig, err => {
		if (err) setUpdates(`Error writing file: ${err}`);
		setUpdates(`astral.py created`);
	});
	fs.writeFile('deploy.py', createPyDeploy, err => {
		if (err) setUpdates(`Error writing file: ${err}`);
		setUpdates(`deploy.py created`);
	});
}
