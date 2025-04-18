import fs from 'fs';

const folders = ['./.astral', './.astral/logs'];

/**
 * Initializes the necessary folders for the application.
 * It checks if the folders already exist, and if not, creates them.
 */
export default function initFolders() {
	folders.forEach(folder => {
		if (!fs.existsSync(folder)) {
			fs.mkdir(folder, {recursive: true}, err => {
				if (err) {
					console.error(
						'An error occurred creating the necessary folders. Run `astral init` again.',
					);
				}
			});
		}
	});
}
