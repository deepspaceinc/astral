/**
 * Compiles the comments for the JS Deploy file.
 * This is the file users need to populate with their deployment code.
 * @returns {String} A docstring containing the config object.
 */
const createJsDeploy = `/**
* All infrastructure definitions belong in this file.
* See examples of common deployments here: https://tryastral.com/api/javascript
*/
export default {
	async infra() {
		return new astral.App({
			entrypoint: './',
		});
	},
};`;
export default createJsDeploy;
//# sourceMappingURL=javascript.js.map