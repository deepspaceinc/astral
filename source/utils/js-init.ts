import fs from 'node:fs';
import createJsConfig from '../constants/configs/javascript.js';
import createJsDeploy from '../constants/deploys/javascript.js';
import getProjectName from './project-name.js';

/**
 * Creates the initial files necessary (astral.config.js, astral.deploy.js) to run Astral.
 * @param projectName - The name of the project, from either package.json or the dir name.
 */
export default function jsInit(setUpdates: (message: string) => void): void {
	if (fs.existsSync('astral.config.js')) return;

	const projectName: string = getProjectName('javascript');
	const jsConfig: string = createJsConfig(projectName);
	fs.writeFile('astral.config.js', jsConfig, error => {
		if (error) setUpdates('Error writing file');
		setUpdates(`astral.config.js created`);
	});
	fs.writeFile('astral.deploy.js', createJsDeploy, error => {
		if (error) setUpdates('Error writing file');
		setUpdates(`astral.deploy.js created`);
	});
}
