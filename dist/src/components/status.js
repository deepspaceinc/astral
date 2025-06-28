import React from 'react';
import { Box, Text, Transform } from 'ink';
import terminalLink from 'terminal-link';
export default function Status({ deps, files, }) {
    // Determine whether every dependency is installed
    const allInstalled = deps.every((dep) => dep.isInstalled);
    return (React.createElement(Box, { flexDirection: "column", gap: 1 },
        React.createElement(Text, null, `©ASTRAL ${new Date().getFullYear()}. MIT License`),
        React.createElement(Transform, { transform: (link) => terminalLink(link, 'https://github.com/deepspaceinc/astral', { fallback: true }) },
            React.createElement(Text, null, 'ASTRAL is open source. Contributions welcome!')),
        React.createElement(Box, { marginLeft: 1 },
            React.createElement(Box, { marginRight: 1 },
                React.createElement(Text, { color: allInstalled ? 'green' : 'red' }, "\u23FA")),
            allInstalled ? (React.createElement(Text, { dimColor: !allInstalled, color: "cyan" }, "Dependencies are installed & running.")) : (React.createElement(Text, { dimColor: !allInstalled, color: "cyan" }, "Run `astral init` to use astral."))),
        files && (React.createElement(Box, { marginLeft: 1, marginBottom: 1 },
            React.createElement(Box, { marginRight: 1 },
                React.createElement(Text, { color: files ? 'green' : 'red' }, "\u23FA")),
            React.createElement(Text, { dimColor: !files, color: "cyan" }, "Files have been initialized. Astral is ready.")))));
}
//# sourceMappingURL=status.js.map