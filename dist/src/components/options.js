import React from 'react';
import { Box, Text } from 'ink';
export default function Options() {
    return (React.createElement(Box, { marginLeft: 1, marginBottom: 2 },
        React.createElement(Box, { marginRight: 1 },
            React.createElement(Text, { color: true ? 'green' : 'red' }, "\u23FA")),
        true ? (React.createElement(Text, { dimColor: !true, color: "cyan" }, "Dependencies are installed & running.")) : (React.createElement(Text, { dimColor: !true, color: "cyan" }, "Run `astral init` to use astral."))));
}
//# sourceMappingURL=options.js.map