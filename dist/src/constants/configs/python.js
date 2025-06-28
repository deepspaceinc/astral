/**
 * Compiles the users Python config file for deployments.
 * @param projectName - The name of the project, from either package.json or the dir name.
 * @returns {String} A docstring containing the config object.
 */
export default function createPyConfig(projectName) {
    return `class AstralConfig:
    """Astral config.
    For most projects, you will not need to change this file.
    To make changes, see the API here: https://tryastral.com/api/python
    """
    name="${projectName}"
    region="us-east-1"`;
}
//# sourceMappingURL=python.js.map