import find from 'find-process';
import os from 'node:os';


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
		return find('name', "Docker").then(processes => processes.length > 0);
	} catch {
		return new Promise(() => false);
	}
}
