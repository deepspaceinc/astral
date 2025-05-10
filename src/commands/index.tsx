import React, { useEffect } from 'react';
import { checkDependencies } from '../utils/terminal.js';
import { init } from '../utils/init.js';
import Masthead from '../components/masthead.js';
import Status from '../components/status.js';

// Work around to import enquirer and keep Astral a module in package.json
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Select } = require('enquirer');

type Commands = ['init' | 'dryrun' | 'deploy' | 'destroy'];

export default function Index() {
	const [deps, setDeps] = React.useState<Array<{ name: string; isInstalled: boolean }>>([]);
	const [_, setCommand] = React.useState<Commands | null>(null);
	// Run only once on load.
	useEffect(() => {
		// Attempt to initialize dirs/files. Does nothing if already initialized.
		init();
		// Checks on deps/installs.
		async function checkDeps() {
			const deps = await checkDependencies();
			if (deps) {
				setDeps(deps);
			}
		}

		checkDeps().catch((error) => {
			console.error('Dependency check failed:', error);
		});
		const prompt = new Select({
			name: 'commands',
			message:
				'Astral provides simple deployment constructs for AWS.\nRun `init` first to generate the necessary configuration for your system\nand then edit your deployment file (astral.deploy.js).',
			choices: ['init', 'dryrun', 'deploy', 'destroy'],
		});

		prompt
			.run()
			.then((answer: Commands) => setCommand(answer))
			.catch(console.error);
	}, []);

	return (
		<>
			<Masthead />
			<Status deps={deps} />
		</>
	);
}
