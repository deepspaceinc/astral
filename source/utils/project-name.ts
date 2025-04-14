import fs from 'node:fs';
import process from 'node:process';

/**
 * Identifies the project name from the cwd.
 * For Javascript, it looks for package.json and uses the directory name.
 * @returns {String} The name of the project.
 */
export default function getProjectName(lang: string): string {
	const cwd = process.cwd();

	if (lang === 'javascript') {
		const dependencyFile = `${cwd}/package.json`;
		const data = JSON.parse(fs.readFileSync(dependencyFile, 'utf8')) as {
			name?: string;
		};
		if (data?.name) {
			return data.name;
		}
	}

	// Fallback for JS, default for Python
	return cwd.split('/').pop() ?? 'none';
}
