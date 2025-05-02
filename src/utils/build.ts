import { aws } from '../constructs/aws.js';

function withImports(func: (...args: any[]) => void, imports: Record<string, any>) {
	return function (...args: any[]) {
		for (const i of Object.keys(imports)) {
			(global as any)[i] = imports[i];
		}

		func(...args);
	};
}

export async function getDeployConstructs() {
	const rootDir = process.cwd();
	const deploy = await import(`${rootDir}/astral.deploy.js`);
	return withImports(deploy.default.infra, { aws });
}

export async function generateInfra() {
	await getDeployConstructs();
}
