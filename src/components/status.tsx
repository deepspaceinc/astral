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
	const notInstalled = deps.filter((dep) => !dep.isInstalled);

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
