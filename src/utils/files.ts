import fs from 'node:fs';
import createJsConfig from '../constants/configs/javascript.js';
import createJsDeploy from '../constants/deploys/javascript.js';
import createPyConfig from '../constants/configs/python.js';
import createPyDeploy from '../constants/deploys/python.js';
import {getProjectName} from './init.js';

const folders = ['./.astral', './.astral/logs'];

/**
 * Initializes the necessary folders for the application.
 * It checks if the folders already exist, and if not, creates them.
 */
export function initDotAstral() {
	for (const folder of folders) {
		if (!fs.existsSync(folder)) {
			fs.mkdir(folder, {recursive: true}, error => {
				if (error) {
					console.error(
						'An error occurred creating the necessary folders. Run `astral init` again.',
					);
				}
			});
		}
	}
}

/**
 * Creates the initial files necessary (astral.config.js, astral.deploy.js) to run Astral.
 * @param projectName - The name of the project, from either package.json or the dir name.
 */
export function jsInit(): void {
	if (fs.existsSync('astral.config.js')) return;

	const projectName: string = getProjectName('javascript');
	const jsConfig: string = createJsConfig(projectName);
	if (!fs.existsSync('astral.config.js')) {
		fs.writeFile('astral.config.js', jsConfig, error => {
			if (error) console.log('Error writing file');
		});
	}

	if (!fs.existsSync('astral.deploy.js')) {
		fs.writeFile('astral.deploy.js', createJsDeploy, error => {
			if (error) console.log('Error writing file');
		});
	}
}

/**
 * Creates the initial files necessary (astral.config.js, astral.deploy.js) to run Astral.
 * @param projectName - The name of the project, from either package.json or the dir name.
 */
export function pyInit(): void {
	if (fs.existsSync('astral.py')) return;

	const projectName: string = getProjectName('python');
	const pyConfig: string = createPyConfig(projectName);
	if (!fs.existsSync('astral.py')) {
		fs.writeFile('astral.py', pyConfig, error => {
			if (error) console.log('Error writing file');
		});
	}

	if (!fs.existsSync('deploy.py')) {
		fs.writeFile('deploy.py', createPyDeploy, error => {
			if (error) console.log('Error writing file');
		});
	}
}
