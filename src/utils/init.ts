import fs from 'node:fs';
import process from 'node:process';
import {initDotAstral, jsInit, pyInit} from './files.js';

/**
 * Identifies the project name from the cwd.
 * For Javascript, it looks for package.json and uses the directory name.
 * @returns {String} The name of the project.
 */
export function getProjectName(lang: string): string {
	const cwd = process.cwd();

	if (lang === 'javascript') {
		const dependencyFile = `${cwd}/package.json`;
		const data = JSON.parse(fs.readFileSync(dependencyFile, 'utf8')) as {
			name?: string;
		};
		if (data?.name) {
			return data.name;
		}
	}

	// Fallback for JS, default for Python
	return cwd.split('/').pop() ?? 'none';
}

type LanguageIdentifiers = Record<
	string,
	{
		identifiers: string[];
		init: () => void;
	}
>;

export const getLanguageAndInit = (files: string[]) => {
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

export const init = () => {
	// Non-destructive, only creates folders if they don't exist
	initDotAstral();
	// Ids the language based on the files in the current directory
	const files = fs.readdirSync('./');
	getLanguageAndInit(files);
};
