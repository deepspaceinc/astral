import React from 'react';
import { Box, Text } from 'ink';

export default function Options() {
	return (
		<Box marginLeft={1} marginBottom={2}>
			<Box marginRight={1}>
				<Text color={true ? 'green' : 'red'}>⏺</Text>
			</Box>
			{true ? (
				<Text dimColor={!true} color="cyan">
					Dependencies are installed & running.
				</Text>
			) : (
				<Text dimColor={!true} color="cyan">
					Run `astral init` to use astral.
				</Text>
			)}
		</Box>
	);
}
