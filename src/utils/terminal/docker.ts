import {execSync} from 'child_process';

/**
 * Checks if Docker is installed and running.
 * If Docker is not installed or not running, an error will be thrown.
 * This function is useful for ensuring that the environment is set up correctly
 * before running any Docker-related commands.
 * @returns {boolean} True if Docker is installed and running, false otherwise.
 */
export default function checkDocker() {
	try {
		execSync(
			'{ docker ps -a | tee .astral/logs/stdout.log; } &> .astral/logs/stderr_stdout.log',
			{encoding: 'utf-8'},
		);
		return true;
	} catch (error) {
		return false;
	}
}
