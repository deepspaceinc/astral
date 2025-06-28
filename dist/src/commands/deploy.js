import React, { useEffect, useState } from 'react';
import { Text } from 'ink';
import { getDeployConstructs } from '../utils/build.js';
import { astral } from '../constructs/app.js';
export default function Deploy({ options }) {
    // const [resources, setResources] = useState<any[]>([]);
    const [deployList, setDeployList] = useState([]);
    useEffect(() => {
        // Pulls the constructs from astral.deploy.js / deploy.py
        const getDeployConfig = async () => {
            return getDeployConstructs();
        };
        getDeployConfig().then(async (infra) => {
            const result = await infra();
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
    return (React.createElement(React.Fragment, null, deployList.length > 0 ? (React.createElement(React.Fragment, null, deployList.slice(-5).map((message, index) => (React.createElement(Text, { key: index }, message))))) : null));
}
//# sourceMappingURL=deploy.js.map