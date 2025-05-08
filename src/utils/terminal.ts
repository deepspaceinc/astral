import os from 'node:os';
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import find from 'find-process';
import { getProjectName, getNameSlug } from '../utils/build.js';

/**
 * Checks the users OS.
 * https://nodejs.org/api/os.html#osplatform
 * @returns {enum} 'aix', 'darwin', 'freebsd','linux', 'openbsd', 'sunos', and 'win32'.
 */
export function checkOs() {
	return os.platform();
}

/**
 * Checks if Docker is installed and running.
 * If Docker is not installed or not running, an error will be thrown.
 * This function is useful for ensuring that the environment is set up correctly
 * before running any Docker-related commands.
 * @returns {boolean} True if Docker is installed and running, false otherwise.
 */
export async function checkDocker(): Promise<boolean> {
	try {
		return await find('name', 'Docker').then((processes) => processes.length > 0);
	} catch {
		return false;
	}
}

/**
 * Checks if Pulumi is installed by checking the version number.
 * @returns {Boolean} True if Pulumi is installed and the version is valid, false otherwise.
 * @throws {Error} If Pulumi is not installed or the version is not valid.
 */
export async function checkPulumi(): Promise<boolean> {
	try {
		const pulumiVersion: string = execSync('pulumi version', { encoding: 'utf8' });
		return pulumiVersion.trim().includes('v3');
	} catch {
		return false;
	}
}

/**
 * Checks if Nixpacks is installed by checking the version number.
 * @returns {Boolean} True if Nixpacks is installed and the version is valid, false otherwise.
 * @throws {Error} If Nixpacks is not installed or the version is not valid.
 */
export async function checkNixpacks(): Promise<boolean> {
	try {
		const nixpacksVersion: string = execSync('nixpacks --version', { encoding: 'utf8' });
		return nixpacksVersion.trim().includes('nixpacks 1.');
	} catch {
		return false;
	}
}

/**
 * Checks if the user has the required dependencies installed.
 *  NOTE: checkNixpacks and checkPulumi are not really async functions, but checkDocker is.
 *  This is a workaround to make the function async.
 * @returns {Promise<boolean>} True if all dependencies are installed, false otherwise.
 */
export async function checkDependencies(): Promise<Array<{ name: string; isInstalled: boolean }>> {
	const dependencies = [
		{
			name: 'Docker',
			check: checkDocker,
		},
		{
			name: 'Pulumi',
			check: checkPulumi,
		},
		{
			name: 'Nixpacks',
			check: checkNixpacks,
		},
	];

	const returnMessages = [];

	for (const dependency of dependencies) {
		const isInstalled = await dependency.check();
		returnMessages.push({
			name: dependency.name,
			isInstalled,
		});
	}

	return returnMessages;
}


function copyDockerfiles(project: string): void {
	if (!fs.existsSync(`${project}/.nixpacks/`)) {
		execSync(`mkdir -p ${project}/.nixpacks/`);
	}
	execSync(`cp ./.astral/.nixpacks/Dockerfile ${project}/`);
	execSync(`cp ./.astral/.nixpacks/* ${project}/.nixpacks/`);
}


/**
 * Run Nixpacks. Generate a Dockerfile in the .astral dir
 * @returns {String} Project name if Nixpacks was successful.
 */
export function genNixpacks(entrypoint: string = './app'): string {
	try {
		const name = `${getProjectName()}-${getNameSlug()}`;
		let project = entrypoint.replace('./', '');
		project = `${process.cwd()}/${project}`;
		const [major] = process.versions.node.split('.').map(Number);
		process.env['NIXPACKS_NODE_VERSION'] = `${major}`;//TODO: check that we have a valid version
		process.env['NIXPACKS_NO_CACHE'] = '1';
		execSync(`nixpacks build ${project} --name ${name} -o ./.astral --env PORT=80,NIXPACKS_PATH=${project}`, { encoding: 'utf8' });
		copyDockerfiles(project);
		return name;
	} catch {
		return '';
	}
}