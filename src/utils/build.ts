import * as fs from 'node:fs';
import * as path from 'node:path';
import { generateSlug } from 'random-word-slugs';
import { astral } from '../constructs/app.js';

function withImports(func: () => void, imports: Record<string, any>) {
	return function () {
		for (const i of Object.keys(imports)) {
			(global as any)[i] = imports[i];
		}

		func();
	};
}

export async function getDeployConstructs() {
	const rootDir = process.cwd();
	const deploy = await import(`${rootDir}/astral.deploy.js`);
	return withImports(deploy.default.infra, { astral });
}

export function getNameSlug(): string {
	return generateSlug(1, { format: 'kebab' });
}

/**
 * Get the name from package.json
 * @returns The name from package.json or a fallback name if not found
 */
export function getProjectName(lang = 'javascript'): string {
	const defaultAppName = `app-${getNameSlug()}`;
	if (lang === 'javascript') {
		try {
			// Try to find package.json in the current working directory
			const packageJsonPath = path.resolve(process.cwd(), 'package.json');
			if (fs.existsSync(packageJsonPath)) {
				const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
				return packageJson.name || defaultAppName;
			}
		} catch (error) {
			console.warn('Could not read package.json:', error);
		}
	}

	return defaultAppName;
}
