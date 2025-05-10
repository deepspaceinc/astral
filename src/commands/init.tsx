import React, { useEffect } from 'react';

/**
 * Generates files for first time users.
 * This is done in a non-destructive way, so init can be run
 * against an existing Astral project without overwriting files.
 * @returns {null}
 */
export default function Init() {
	useEffect(() => {
		// Check Pulumi Installation. If not installed, install.

		// Check Docker installation. If not installed, install.

		// Check .astral files. If they don't exist, add them
		console.log('Checking .astral files');
	}, []);
	return <>init</>;
}
