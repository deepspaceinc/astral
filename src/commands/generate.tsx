import React, { useEffect } from 'react';
import { Text } from 'ink';
import { getDeployConstructs } from '../utils/build.js';
import { astral } from '../constructs/app.js';

export default function Generate() {
	useEffect(() => {
		const getDeployConfig = async () => {
			return await getDeployConstructs();
		};

		getDeployConfig().then(async (infra) => {
			// Execute the infra function which should return an App instance
			const result: any = await infra();

			// Check if result is an App instance or create a new one if needed
			const astralApp = result instanceof astral.App ? result : new astral.App({});

			// Now call deploy on the app instance
			await astralApp.deploy();
		});
	}, []);
	return <Text>generate</Text>;
}
