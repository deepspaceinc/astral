import { useEffect } from 'react';
import yoctoSpinner from 'yocto-spinner';
import { checkDependencies } from '../utils/terminal.js';
import { checkInit, initDotAstral, initLanguageFiles, getLanguage } from '../utils/init.js';

/**
 * Generates files for first time users.
 * This is done in a non-destructive way, so init can be run
 * against an existing Astral project without overwriting files.
 * @returns {null}
 */
export default function Init() {
	useEffect(() => {
		// Check .astral files. If they don't exist, add them
		const spinner = yoctoSpinner({ text: 'checking astral install...' }).start();
		setTimeout(() => {
			const hasAstralFiles = checkInit();
			if (!hasAstralFiles) {
				spinner.error('astral not found, installing astral...');
				initDotAstral();
				const language = getLanguage();
				if (language) {
					spinner.text = 'initializing language files...';
					initLanguageFiles(language);
				}
			}

			spinner.success('astral installed');
		}, 200);

		// Check dependencies
		(async function checkDeps() {
			// Check Pulumi Installation. If not installed, install.
			const spinner = yoctoSpinner({ text: 'checking dependencies...' }).start();
			setTimeout(async () => {
				const deps = await checkDependencies();
				const notInstalled = deps.filter((dep) => dep.isInstalled);
				if (notInstalled.length > 0) {
					spinner.text = 'Installing dependencies...';
					// TODO: Install dependencies
				}

				spinner.success('dependencies checked');
			}, 200);
		})();
	}, []);
	return null;
}
