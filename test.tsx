import path from 'node:path';
import process from 'node:process';
import test from 'ava';
import getProjectName from './source/utils/project-name.js';

test('returns current directory name for python projects', t => {
	const expected = path.basename(process.cwd());
	const actual = getProjectName('python');
	t.is(actual, expected);
});
