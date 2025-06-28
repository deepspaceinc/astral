/**
 * Generates Nixpacks, which generates a Dockerfile in the .astral/.nixpacks directory
 * @returns {Promise<string>} Project name if Nixpacks was successful.
 */
export declare function genNixpacks(entrypoint: string): Promise<string>;
