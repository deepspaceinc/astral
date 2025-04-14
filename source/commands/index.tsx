import React from 'react';
import figlet from 'figlet';
import {Text} from 'ink';
import {object, string, type infer as zodInfer} from 'zod';

export const options = object({
	name: string().default('Stranger').describe('Name'),
});

type Props = {
	readonly options: zodInfer<typeof options>;
};

export default function Index({options}: Props) {
	const {name} = options;
	const masthead = figlet.textSync('Astral', {font: 'Slant'});
	return (
		<Text color="green">
			{masthead}: {name}
		</Text>
	);
}
