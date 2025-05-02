import React from 'react';
import { Box, Text } from 'ink';

export default function Status({
	deps,
}: {
	readonly deps: Array<{ name: string; isInstalled: boolean }>;
}) {
	const notInstalled = deps.filter((dep) => !dep.isInstalled);

	return (
		<Box marginLeft={1} marginBottom={2}>
			<Box marginRight={1}>
				<Text color={notInstalled ? 'green' : 'red'}>⏺</Text>
			</Box>
			{notInstalled ? (
				<Text dimColor={!notInstalled} color="cyan">
					Dependencies are installed & running.
				</Text>
			) : (
				<Text dimColor={!notInstalled} color="cyan">
					Run `astral init` to use astral.
				</Text>
			)}
		</Box>
	);
}
