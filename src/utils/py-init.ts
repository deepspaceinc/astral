import fs from 'node:fs';
import createPyConfig from '../constants/configs/python.js';
import createPyDeploy from '../constants/deploys/python.js';
import getProjectName from './project-name.js';

/**
 * Creates the initial files necessary (astral.config.js, astral.deploy.js) to run Astral.
 * @param projectName - The name of the project, from either package.json or the dir name.
 */
export default function pyInit(): void {
	if (fs.existsSync('astral.py')) return;

	const projectName: string = getProjectName('python');
	const pyConfig: string = createPyConfig(projectName);
	fs.writeFile('astral.py', pyConfig, error => {
		if (error) console.log('Error writing file');
	});
	fs.writeFile('deploy.py', createPyDeploy, error => {
		if (error) console.log('Error writing file');
	});
}
