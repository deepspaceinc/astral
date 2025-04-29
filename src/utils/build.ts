const { readFile } = require('node:fs/promises');
const { resolve } = require('node:path');

export async function getDeployConstructs() {
  try {
    const filePath = resolve('./astral.deploy.js');
    const contents = await readFile(filePath, { encoding: 'utf8' });
    console.log(contents);
  } catch (err) {
    console.error(err.message);
  }
}
