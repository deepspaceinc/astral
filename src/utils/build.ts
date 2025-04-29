const aws = {
	ECS: opts => console.log('IN ECS: ', opts),
};

function withImports(func, imports) {
	return function (...args) {
		Object.keys(imports).forEach(i => {
			global[i] = imports[i];
		});

		return func(...args);
	};
}

export async function getDeployConstructs() {
	const rootDir = process.cwd();
	const deploy = await import(`${rootDir}/astral.deploy.js`);
	const infra = withImports(deploy.default.infra, { aws });
	console.log('in getDeployConstructs: ', infra());
}
