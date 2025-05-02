import os from 'node:os';
import find from 'find-process';
import { execSync } from 'child_process';

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
		return await find('name', 'Docker').then(processes => processes.length > 0);
	} catch {
		return false;
	}
}


/**
 * Checks if Pulumi is installed by checking the version number.
 * @returns {Boolean} True if Pulumi is installed and the version is valid, false otherwise.
 * @throws {Error} If Pulumi is not installed or the version is not valid.
 */
export function checkPulumi(): boolean {
	try {
		const pulumiVersion: string = execSync('pulumi version', { encoding: 'utf-8' });
		const validVersion = pulumiVersion.trim().includes('v3');
		if (!validVersion) {
			// TODO: Update the return so we can control the error message to the terminal.
			console.error('Pulumi version is not valid. Please install Pulumi v3 or higher.');
			return false;
		}
		return true;
	} catch {
		return false;
	}
}

/**
 * Checks if Nixpacks is installed by checking the version number.
 * @returns {Boolean} True if Nixpacks is installed and the version is valid, false otherwise.
 * @throws {Error} If Nixpacks is not installed or the version is not valid.
 */
export function checkNixpacks(): boolean {
	try {
		const nixpacksVersion: string = execSync('nixpacks --version', { encoding: 'utf-8' });
		const validVersion = nixpacksVersion.trim().includes('nixpacks 1.');
		if (!validVersion) {
			// TODO: Update the return so we can control the error message to the terminal.
			console.error('Nixpacks version is not valid. Please install Nixpacks v3 or higher.');
			return false;
		}
		return true;
	} catch {
		return false;
	}
}


/**
 * Checks if the user has the required dependencies installed.
 * @returns {boolean} True if all dependencies are installed, false otherwise.
 */
export async function checkDependencies(): Promise<boolean> {
	const dependencies = [
		{
			name: 'Docker',
			check: checkDocker,
		},
		{
			name: 'Pulumi',
			check: checkPulumi,
		},
	];

	for (const dependency of dependencies) {
		const isInstalled = await dependency.check();
		if (!isInstalled) {
			console.error(`${dependency.name} is not installed or not running.`);
			return false;
		}
	}

	return true;
}
