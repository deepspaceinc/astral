import React, { useEffect } from 'react';
import { Text, Box, useApp, useInput } from 'ink';
import { withFullScreen } from 'fullscreen-ink';
import { checkInit } from '../utils/init.js';
import Masthead from '../components/masthead.js';
import Status from '../components/status.js';
import { checkDependencies } from '../utils/dependencies.js';
import { Select } from '@inkjs/ui';
import Init from '../commands/init.js';
import Deploy from '../commands/deploy.js';
import zod from 'zod';

const options = zod.object({
	verbose: zod.boolean().optional().describe('Verbose logging'),
	dryrun: zod.boolean().optional().describe('Dry run'),
});

export type Props = {
	readonly options: zod.infer<typeof options>;
};

function IndexComponent({ options }: Props) {
	const [deps, setDeps] = React.useState<Array<{ name: string; isInstalled: boolean }>>([]);
	const [files, setFiles] = React.useState<boolean>(false);
	const [renderApp, setRenderApp] = React.useState<boolean>(false);
	const [runInit, setRunInit] = React.useState<boolean>(false);
	const [runDeploy, setRunDeploy] = React.useState<boolean>(false);

	// EXIT THE APP
	const { exit } = useApp();
	useInput((input, key) => {
		if (input === 'q' || key.escape) {
			exit();
		}
	});

	// Run only once on load.
	useEffect(() => {
		// Checks on deps/installs.
		(async () => {
			setDeps(await checkDependencies());
			setFiles(checkInit());
		})().catch((error) => {
			console.error('Dependency check failed:', error);
		});

		// Show the app after the logo screen displays for a 2sec
		setTimeout(() => setRenderApp(true), 100);
	}, []);

	return (
		<>
			{renderApp ? (
				<Box flexDirection="column" gap={1} height="100%" width="100%">
					<Status deps={deps} files={files} />
					<Box height="100%" width="100%" flexDirection="column">
						<Box height="20%">
							<Select
								options={[
									{
										label: 'init',
										value: 'init',
									},
									{
										label: 'deploy',
										value: 'deploy',
									},
								]}
								onChange={(action) => {
									if (action === 'init') {
										setRunInit(true);
										setRunDeploy(false);
									}
									if (action === 'deploy') {
										setRunDeploy(true);
										setRunInit(false);
									}
								}}
							/>
						</Box>
						{runInit && !runDeploy && (
							<Box
								borderStyle="round"
								borderColor="cyan"
								borderDimColor
								flexDirection="column"
								height="80%"
								width="100%"
								paddingBottom={1}
								overflow="hidden"
							>
								<Init />
							</Box>
						)}
						{runDeploy && !runInit && (
							<Box
								borderStyle="round"
								borderColor="cyan"
								borderDimColor
								flexDirection="column"
								height="80%"
								width="100%"
								paddingBottom={1}
								overflow="hidden"
							>
								<Deploy options={options} />
							</Box>
						)}
						{!runInit && !runDeploy && (
							// Placeholder for the height so elements dont shift around
							<Box height="80%" width="100%"></Box>
						)}
					</Box>
					{/* Footer */}
					<Box borderStyle="round" borderColor="cyan" borderDimColor paddingBottom={1}>
						<Text dimColor color="cyan">
							{'quit: q or <esc>'}
						</Text>
					</Box>
				</Box>
			) : (
				<Masthead />
			)}
		</>
	);
}

// Component wrapper for full screen.
export default function Index({ options }: Props) {
	useEffect(() => {
		const renderApp = async () =>
			await withFullScreen(<IndexComponent options={options} />).start();
		renderApp();
	}, []);
	return null;
}
