import React from 'react';
import figlet from 'figlet';
import { Text } from 'ink';
import zod from 'zod';

export const options = zod.object({
	name: zod.string().default('Stranger').describe('Name'),
});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Index({options}: Props) {
	const {name} = options;
	const masthead = figlet.textSync('Astral', {font: 'Slant'});
	return <Text color="green">{masthead}: {name}</Text>;
}
