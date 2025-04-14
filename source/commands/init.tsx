import fs from 'fs';
import React, {useEffect, useState} from 'react';
import { Text } from 'ink';
import jsInit from '../utils/js-init.js';
import pyInit from '../utils/py-init.js';
// import { set } from 'zod';
// import zod from 'zod';

// export const options = zod.object({
//     name: zod.string().default('Joe').describe('Name'),
// });

// type Props = {
//     options: zod.infer<typeof options>;
// };

// {options}: Props
export default function Index() {
	const [updates, setUpdates] = useState('');

	// Run only once on load.
	useEffect(() => {
		const files = fs.readdirSync('./');
		const languageIdentifiers = {
			javascript: ['package.json'],
			python: ['requirements.txt'],
		};

		const isJavascript = files.some(file =>
			languageIdentifiers.javascript.includes(file),
		);
		if (isJavascript) {
            jsInit(setUpdates);
        }

		const isPython = files.some(file =>
			languageIdentifiers.python.includes(file),
		);

        if (isPython) {
            pyInit(setUpdates);
        }

	}, []);
	return (
		<>
			<Text color="cyan">{updates}</Text>
		</>
	);
}
