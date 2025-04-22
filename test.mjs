import test from 'ava';
import { checkOs } from './src/utils/terminal.ts';

test('returns operating system name', t => {
	const actual = checkOs();
	t.is(actual, 'darwin' || 'linux' || 'win32');
});
