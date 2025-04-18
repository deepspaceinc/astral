import fs from 'node:fs';
import React, {useEffect} from 'react';
import {Text, Box} from 'ink';
import jsInit from '../utils/js-init.js';
import pyInit from '../utils/py-init.js';
import Masthead from './masthead.js';
import '../utils/terminal/docker.js';
import Link from 'ink-link';
import checkDocker from '../utils/terminal/docker.js';
import initFolders from '../utils/terminal/init-folders.js';

type LanguageIdentifiers = Record<
	string,
	{
		identifiers: string[];
		init: () => void;
	}
>;

const checkLanguage = (files: string[]) => {
	const languageIdentifiers: LanguageIdentifiers = {
		javascript: {
			identifiers: ['package.json'],
			init: jsInit,
		},
		python: {
			identifiers: ['requirements.txt'],
			init: pyInit,
		},
	};

	for (const lang of Object.keys(languageIdentifiers)) {
		const langFound = files.some(file => {
			return languageIdentifiers[lang]?.identifiers.includes(file);
		});

		if (langFound) {
			languageIdentifiers[lang]?.init();
		}
	}
};

export default function Index() {
	const [docker, setDocker] = React.useState(false);
	// Run only once on load.
	useEffect(() => {
		initFolders();
		const files = fs.readdirSync('./');
		checkLanguage(files);
		const dockerIsRunning = checkDocker();
		if (dockerIsRunning) setDocker(true);
	}, []);

	const opts = {
		color: docker ? 'green' : 'red',
		text: docker
			? '   Docker is running'
			: `   Launch Docker or ${(
					<Link url="https://docs.docker.com/get-started/get-docker/">
						install Docker
					</Link>
			  )} to use Astral.`,
	};

	return (
		<>
			<Masthead />
			<Box marginLeft={1} marginBottom={2}>
				<Box marginRight={1}>
					<Text color={docker ? 'green' : 'red'}>⏺</Text>
				</Box>
				{docker ? (
					<Text color="cyan" dimColor>Docker is running</Text>
				) : (
					<>
						<Text color="cyan" dimColor>
							Launch Docker or
						</Text>
						<Link url="https://docs.docker.com/get-started/get-docker/">
							<Text color="cyan" dimColor>
								{' '}
								install Docker
							</Text>
						</Link>
						<Text color="cyan" dimColor>
							{' '}
							to use astral.
						</Text>
					</>
				)}
			</Box>
		</>
	);
}

// `Either start Docker or ` + `${<Link url="https://google.com">install Docker</Link>} to use Astral.`;
