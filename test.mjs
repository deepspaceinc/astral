import test from 'ava';
import { checkOs } from './src/utils/terminal.js';

test('returns operating system name', (t) => {
	const actual = checkOs();
	const expected = actual === 'darwin' ? 'darwin' : 'linux';
	t.is(actual, expected);
});
