import React from 'react';
import figlet from 'figlet';
import {Text} from 'ink';

export default function Masthead() {
	const masthead = figlet.textSync('Astral', {font: 'Slant'});
	return <Text color="green">{masthead}</Text>;
}
