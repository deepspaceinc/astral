/**
 * Compiles the users javascript config file for deployments.
 * @param projectName - The name of the project, from either package.json or the dir name.
 * @returns {String} A docstring containing the config object.
 */
export default function createJsConfig(projectName) {
    return `/**
 * Astral config.
 * For most projects, you will not need to change this file.
 * To make changes, see the API here: https://tryastral.com/api/javascript
 */
export default _config({
    name: "${projectName}",
    region: "us-east-1",
});`;
}
//# sourceMappingURL=javascript.js.map