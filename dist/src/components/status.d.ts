import React from 'react';
export default function Status({ deps, files, }: {
    readonly deps: Array<{
        name: string;
        isInstalled: boolean;
    }>;
    readonly files: boolean;
}): React.JSX.Element;
