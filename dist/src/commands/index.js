import React, { useEffect } from 'react';
import { Text, Box, useApp, useInput } from 'ink';
import { withFullScreen } from 'fullscreen-ink';
import { checkInit } from '../utils/init.js';
import Masthead from '../components/masthead.js';
import Status from '../components/status.js';
import { checkDependencies } from '../utils/dependencies.js';
import { Select } from '@inkjs/ui';
import Init from '../commands/init.js';
import Deploy from '../commands/deploy.js';
import zod from 'zod';
const options = zod.object({
    verbose: zod.boolean().optional().describe('Verbose logging'),
    dryrun: zod.boolean().optional().describe('Dry run'),
});
function IndexComponent({ options }) {
    const [deps, setDeps] = React.useState([]);
    const [files, setFiles] = React.useState(false);
    const [renderApp, setRenderApp] = React.useState(false);
    const [runInit, setRunInit] = React.useState(false);
    const [runDeploy, setRunDeploy] = React.useState(false);
    // EXIT THE APP
    const { exit } = useApp();
    useInput((input, key) => {
        if (input === 'q' || key.escape) {
            exit();
        }
    });
    // Run only once on load.
    useEffect(() => {
        // Checks on deps/installs.
        (async () => {
            setDeps(await checkDependencies());
            setFiles(checkInit());
        })().catch((error) => {
            console.error('Dependency check failed:', error);
        });
        // Show the app after the logo screen displays for a 2sec
        setTimeout(() => setRenderApp(true), 100);
    }, []);
    return (React.createElement(React.Fragment, null, renderApp ? (React.createElement(Box, { flexDirection: "column", gap: 1, height: "100%", width: "100%" },
        React.createElement(Status, { deps: deps, files: files }),
        React.createElement(Box, { height: "100%", width: "100%", flexDirection: "column" },
            React.createElement(Box, { height: "20%" },
                React.createElement(Select, { options: [
                        {
                            label: 'init',
                            value: 'init',
                        },
                        {
                            label: 'deploy',
                            value: 'deploy',
                        },
                    ], onChange: (action) => {
                        if (action === 'init') {
                            setRunInit(true);
                            setRunDeploy(false);
                        }
                        if (action === 'deploy') {
                            setRunDeploy(true);
                            setRunInit(false);
                        }
                    } })),
            runInit && !runDeploy && (React.createElement(Box, { borderStyle: "round", borderColor: "cyan", borderDimColor: true, flexDirection: "column", height: "80%", width: "100%", paddingBottom: 1, overflow: "hidden" },
                React.createElement(Init, null))),
            runDeploy && !runInit && (React.createElement(Box, { borderStyle: "round", borderColor: "cyan", borderDimColor: true, flexDirection: "column", height: "80%", width: "100%", paddingBottom: 1, overflow: "hidden" },
                React.createElement(Deploy, { options: options }))),
            !runInit && !runDeploy && (
            // Placeholder for the height so elements don’t shift around.
            React.createElement(Box, { height: "80%", width: "100%" }))),
        React.createElement(Box, { borderStyle: "round", borderColor: "cyan", borderDimColor: true, paddingBottom: 1 },
            React.createElement(Text, { dimColor: true, color: "cyan" }, 'quit: q or <esc>')))) : (React.createElement(Masthead, null))));
}
// Component wrapper for full screen.
export default function Index({ options }) {
    useEffect(() => {
        const renderApp = async () => await withFullScreen(React.createElement(IndexComponent, { options: options })).start();
        renderApp();
    }, []);
    return null;
}
//# sourceMappingURL=index.js.map