import React, { useEffect } from 'react';
// Import { Text, Box } from 'ink';
import { checkDependencies } from '../utils/terminal.js';
import { init } from '../utils/init.js';
import Masthead from '../components/masthead.js';
import Status from '../components/status.js';

export default function Index() {
	const [deps, setDeps] = React.useState<Array<{ name: string; isInstalled: boolean }>>([]);
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
	}, []);

	return (
		<>
			<Masthead />
			<Status deps={deps} />
		</>
	);
}
