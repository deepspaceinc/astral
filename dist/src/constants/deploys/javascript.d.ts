/**
 * Compiles the comments for the JS Deploy file.
 * This is the file users need to populate with their deployment code.
 * @returns {String} A docstring containing the config object.
 */
declare const createJsDeploy = "/**\n* All infrastructure definitions belong in this file.\n* See examples of common deployments here: https://tryastral.com/api/javascript\n*/\nexport default {\n\tasync infra() {\n\t\treturn new astral.App({\n\t\t\tentrypoint: './',\n\t\t});\n\t},\n};";
export default createJsDeploy;
