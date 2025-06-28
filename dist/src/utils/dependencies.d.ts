/**
 * Checks the users OS.
 * https://nodejs.org/api/os.html#osplatform
 * @returns {enum} 'aix', 'darwin', 'freebsd','linux', 'openbsd', 'sunos', and 'win32'.
 */
export declare function checkOs(): NodeJS.Platform;
/**
 * Checks if Docker is installed and running.
 * If Docker is not installed or not running, an error will be thrown.
 * This function is useful for ensuring that the environment is set up correctly
 * before running any Docker-related commands.
 * @returns {boolean} True if Docker is installed and running, false otherwise.
 */
export declare function checkDocker(): Promise<boolean>;
/**
 * Checks if Pulumi is installed by checking the version number.
 * @returns {Boolean} True if Pulumi is installed and the version is valid, false otherwise.
 * @throws {Error} If Pulumi is not installed or the version is not valid.
 */
export declare function checkPulumi(): Promise<boolean>;
/**
 * Checks if Nixpacks is installed by checking the version number.
 * @returns {Boolean} True if Nixpacks is installed and the version is valid, false otherwise.
 * @throws {Error} If Nixpacks is not installed or the version is not valid.
 */
export declare function checkNixpacks(): Promise<boolean>;
/**
 * Checks if the user has the required dependencies installed.
 *  NOTE: checkNixpacks and checkPulumi are not really async functions, but checkDocker is.
 *  This is a workaround to make the function async.
 * @returns {Promise<boolean>} True if all dependencies are installed, false otherwise.
 */
export declare function checkDependencies(): Promise<Array<{
    name: string;
    isInstalled: boolean;
}>>;
