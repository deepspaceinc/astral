import React from 'react';
import figlet from 'figlet';
import { Text, Box } from 'ink';

export default function Masthead() {
	const masthead = figlet.textSync('Astral', { font: 'Slant' });
	return (
		<Box
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			height="100%"
			width="100%"
		>
			<Text color="cyan">{masthead}</Text>
		</Box>
	);
}
