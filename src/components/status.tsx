import React from 'react';
import { Box, Text, Transform } from 'ink';
import terminalLink from 'terminal-link';

export default function Status({
	deps,
	files,
}: {
	readonly deps: Array<{ name: string; isInstalled: boolean }>;
	readonly files: boolean;
}) {
	// Determine whether every dependency is installed
	const allInstalled = deps.every((dep) => dep.isInstalled);

	return (
		<Box flexDirection="column" gap={1}>
			<Text>{`©ASTRAL ${new Date().getFullYear()}. MIT License`}</Text>
			<Transform
				transform={(link) =>
					terminalLink(link, 'https://github.com/deepspaceinc/astral', { fallback: true })
				}
			>
				<Text>{'ASTRAL is open source. Contributions welcome!'}</Text>
			</Transform>
			<Box marginLeft={1}>
				<Box marginRight={1}>
					<Text color={allInstalled ? 'green' : 'red'}>⏺</Text>
				</Box>
				{allInstalled ? (
					<Text dimColor={!allInstalled} color="cyan">
						Dependencies are installed & running.
					</Text>
				) : (
					<Text dimColor={!allInstalled} color="cyan">
						Run `astral init` to use astral.
					</Text>
				)}
			</Box>
			{files && (
				<Box marginLeft={1} marginBottom={1}>
					<Box marginRight={1}>
						<Text color={files ? 'green' : 'red'}>⏺</Text>
					</Box>
					<Text dimColor={!files} color="cyan">
						Files have been initialized. Astral is ready.
					</Text>
				</Box>
			)}
		</Box>
	);
}
