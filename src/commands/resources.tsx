import React, { useEffect } from 'react';

/**
 * Lists current Astral resources as they would exist in AWS.
 * @returns {null}
 */
export default function Resources() {
	useEffect(() => {
		console.log('List current Astral resources');
	}, []);
	return <>resources</>;
}
