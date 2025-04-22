import React, {useEffect} from 'react';
import {Text, Box} from 'ink';
import {checkDocker} from '../utils/terminal.js';
import {init} from '../utils/init.js';
import Masthead from '../components/masthead.js';


export default function Index() {
	const [docker, setDocker] = React.useState(false);
	// Run only once on load.
	useEffect(() => {
		// attempt to initialize. Does nothing if already initialized.
		init();

		async function isDockerRunning() {
			const dockerIsRunning = await checkDocker();
			if (dockerIsRunning) setDocker(true);
		}
		isDockerRunning();
	}, []);

	return (
		<>
			<Masthead />
			<Box marginLeft={1} marginBottom={2}>
				<Box marginRight={1}>
					<Text color={docker ? 'green' : 'red'}>⏺</Text>
				</Box>
				{docker ? (
					<Text dimColor={!docker} color="cyan">
						{'Docker is running'}
					</Text>
				) : (
					<Text dimColor={!docker} color="cyan">
						{
							'Launch Docker or install Docker to use astral. (https://docs.docker.com/get-started/get-docker/)'
						}
					</Text>
				)}
			</Box>
		</>
	);
}
