import fs from 'fs';
import createJsConfig from '../constants/configs/javascript.js';
import createJsDeploy from '../constants/deploys/javascript.js';
import getProjectName from './project-name.js';

/**
 * Creates the initial files necessary (astral.config.js, astral.deploy.js) to run Astral.
 * @param projectName - The name of the project, from either package.json or the dir name.
 */
export default function jsInit(setUpdates: (message: string) => void) {
	if (fs.existsSync('astral.config.js')) return;

	const projectName = getProjectName('javascript');
	const jsConfig = createJsConfig(projectName);
	fs.writeFile('astral.config.js', jsConfig, err => {
		if (err) setUpdates(`Error writing file: ${err}`);
        setUpdates(`astral.config.js created`);
	});
	fs.writeFile('astral.deploy.js', createJsDeploy, err => {
		if (err) setUpdates(`Error writing file: ${err}`);
        setUpdates(`astral.deploy.js created`);
	});

}
