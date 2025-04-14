/**
 * Compiles the users javascript config file for deployments.
 * @param projectName - The name of the project, from either package.json or the dir name.
 * @returns {String} A docstring containing the config object.
 */
export default function createPyConfig(projectName: string) {
	return (
`class AstralConfig:
    """Astral config.
    For most projects, you will not need to change this file.
    To make changes, see the API here: https://tryastral.com/api/python
    """
    name="${projectName}"
    provider="aws"
    region="us-east-1"`
    );
}

