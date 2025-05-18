import React, { useEffect, useState } from 'react';
import { Text } from 'ink';
import { getDeployConstructs } from '../utils/build.js';
import { astral } from '../constructs/app.js';
import { Props } from '../commands/index.js';


export default function Deploy({ options }: Props) {
	// const [resources, setResources] = useState<any[]>([]);
	const [deployList, setDeployList] = useState<string[]>([]);

	useEffect(() => {
		// Pulls the constructs from astral.deploy.js / deploy.py
		const getDeployConfig = async () => {
			return getDeployConstructs();
		};

		getDeployConfig().then(async (infra) => {
			const result: any = await infra();
			const astralApp = result instanceof astral.App ? result : new astral.App({});
			// const outputs =
			await astralApp.deploy(options, setDeployList);

			// // For regular deployments, outputs might be an array of objects
			// if (Array.isArray(outputs)) {
			// 	setResources(outputs.map((output) => {
			// 		// Convert any Pulumi Output values to strings
			// 		const processedOutput: Record<string, string> = {};
			// 		Object.entries(output).forEach(([key, value]) => {
			// 			processedOutput[key] = String(value);
			// 		});
			// 		return processedOutput;
			// 	}));
			// }
		});
	}, []);
	return (
		<>
			{deployList.length > 0 ? (
				<>
					{/* Display only the last 6 entries from deployList */}
					{deployList.slice(-5).map((message, index) => (
						<Text key={index}>{message}</Text>
					))}
				</>
			) : null}
		</>
	);
}
