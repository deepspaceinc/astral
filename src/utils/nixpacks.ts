import * as fs from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { getProjectName, getNameSlug } from '../utils/build.js';

/**
 * Reads the file at `filePath`, replaces all occurrences of
 * `.nixpacks/` with `.astral/.nixpacks/`, and overwrites the file.
 * @returns {Promise<boolean>} True if the file was successfully updated, false otherwise.
 */
async function updateNixpacksDockerfile(): Promise<boolean> {
  try {
    const filePath = `${process.cwd()}/.astral/.nixpacks/Dockerfile`;
    const content = await fs.readFile(filePath, 'utf8');

    const updated = content.replace(/\.nixpacks\//g, '.astral/.nixpacks/');
    await fs.writeFile(filePath, updated, 'utf8');
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Generates Nixpacks, which generates a Dockerfile in the .astral/.nixpacks directory
 * @returns {Promise<string>} Project name if Nixpacks was successful.
 */
export async function genNixpacks(entrypoint: string): Promise<string> {
    try {
        const name = `${getProjectName()}-${getNameSlug()}`;
        let project = entrypoint == './' ? '' : entrypoint.replace('./', '/');
        console.log(project)
        project = `${process.cwd()}${project}`;
        const [major] = process.versions.node.split('.').map(Number);
        process.env['NIXPACKS_NODE_VERSION'] = `${major}`; // TODO: check that we have a valid version
        process.env['NIXPACKS_NO_CACHE'] = '1';
        execSync(
            `nixpacks build . --name ${name} -o ./.astral --env PORT=80,NIXPACKS_PATH=${project}`,
            { encoding: 'utf8' },
        );
        await updateNixpacksDockerfile();
        return name;
    } catch {
        return '';
    }
}
