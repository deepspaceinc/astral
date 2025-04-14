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

type LanguageIdentifiers = {
    [key: string]: {
        identifiers: string[];
        init: (setUpdates: (message: string) => void) => void;
    };
};

const checkLanguage = (files: string[], setUpdates: (message: string) => void) => {
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

    Object.keys(languageIdentifiers).forEach(lang => {
        const langFound = files.some(file => {
            return languageIdentifiers[lang]?.identifiers.includes(file);
        });

        if (langFound) {
            languageIdentifiers[lang]?.init((message: string) => setUpdates(message));
        }
    });
}

// {options}: Props
export default function Index() {
	const [updates, setUpdates] = useState('');

	// Run only once on load.
	useEffect(() => {
		const files = fs.readdirSync('./');
        checkLanguage(files, setUpdates);

	}, []);
	return (
		<>
			<Text color="cyan">{updates}</Text>
		</>
	);
}
