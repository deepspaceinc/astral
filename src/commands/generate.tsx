import React, { useEffect } from 'react';
import { Text } from 'ink';
import { getDeployConstructs } from '../utils/build.js';

export default function Generate() {
	useEffect(() => {
		const getDeployConfig = async () => {
			await getDeployConstructs();
		};

		getDeployConfig().then((d) => {
			console.log(d);
		});
	}, []);
	return <Text>generate</Text>;
}
