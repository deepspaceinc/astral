import { createRequire } from 'node:module';
import React, { useEffect, useState } from 'react';
import zod from 'zod';
import { Box, Text } from 'ink';
import { getDeployConstructs } from '../utils/build.js';
import { astral } from '../constructs/app.js';
import Masthead from '../components/masthead.js';
import Status from '../components/status.js';
import { checkDependencies } from '../utils/terminal.js';

// Cli-table init
const require = createRequire(import.meta.url);
const Table = require('cli-table');

const table = new Table();

export const options = zod.object({
	verbose: zod.boolean().optional().describe('Verbose logging'),
	dryrun: zod.boolean().optional().describe('Dry run'),
});

type Props = {
	readonly options: zod.infer<typeof options>;
};

export default function Deploy({ options }: Props) {
	const [deps, setDeps] = useState<
		{ name: string; isInstalled: boolean }[]
	>([] as { name: string; isInstalled: boolean }[]);
	const [outputs, setOutputs] = useState<any[]>([]);
	// Run only once on load.
	useEffect(() => {
		// Checks on deps/installs.
		async function checkDeps() {
			const dependencies = await checkDependencies();
			if (dependencies) {
				setDeps(dependencies);
			}
		}

		checkDeps().catch((error) => {
			console.error('Dependency check failed:', error);
		});
	}, []);
	useEffect(() => {
		const getDeployConfig = async () => {
			return getDeployConstructs();
		};

		getDeployConfig().then(async (infra) => {
			// Execute the infra function which should return an App instance
			const result: any = await infra();

			// Check if result is an App instance or create a new one if needed
			const astralApp = result instanceof astral.App ? result : new astral.App({});
			// Now call deploy on the app instance
			const outputs = await astralApp.deploy(options);
			// Clears the top of the masthead.
			console.clear();
			if (options?.dryrun) {
				// For dry run, outputs are directly accessible
				Object.keys(outputs).forEach(key => {
					table.push([key, outputs[key]]);
				});
			} else {
				// For regular deployments, outputs might be an array of objects
				if (Array.isArray(outputs)) {
					outputs.forEach(output => {
						Object.entries(output).forEach(([key, value]) => {
							table.push([key, String(value)]);
						});
					});
				} else {
					// Handle regular object outputs
					Object.entries(outputs).forEach(([key, value]) => {
						table.push([key, String(value)]);
					});
				}
			}
			setOutputs(table);
		});
	}, []);
	return (
		<>
			{outputs.length > 0 ? (
				<>
					<Text>{outputs.toString()}</Text>
					<Box padding={1} flexDirection="column" alignItems="flex-start" borderStyle="single">
						<Text>Your deployment is now complete.</Text>
						<Text>
							See resources above that were created in AWS. Note you will be billed for these
							resources.
						</Text>
					</Box>
				</>
			) : (
				<>
					<Masthead />
					<Status deps={deps} />
					<Box padding={1} flexDirection="column" alignItems="flex-start" borderStyle="single">
						<Text>This action is currently provisioning resources on AWS.</Text>
						<Text>
							Once this action is complete, you will be able to review your resources in the
							terminal.
						</Text>
					</Box>
				</>
			)}
		</>
	);
}
