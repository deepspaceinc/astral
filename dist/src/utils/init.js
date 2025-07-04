import fs from 'node:fs';
import createJsConfig from '../constants/configs/javascript.js';
import createJsDeploy from '../constants/deploys/javascript.js';
import createPyConfig from '../constants/configs/python.js';
import createPyDeploy from '../constants/deploys/python.js';
import { getProjectName } from './build.js';
const LANG_IDS = {
    javascript: {
        identifiers: ['package.json'],
        init: jsInit,
        check: jsCheck,
    },
    python: {
        identifiers: ['requirements.txt'],
        init: pyInit,
        check: pyCheck,
    },
};
const FOLDERS = ['./.astral', './.astral/logs'];
// Utils
export const getLanguage = () => {
    const files = fs.readdirSync('./');
    for (const lang of Object.keys(LANG_IDS)) {
        if (files.some((file) => LANG_IDS[lang].identifiers.includes(file))) {
            return lang;
        }
    }
    // Default to JS
    return 'javascript';
};
// Init checks
export const checkInitDotAstral = () => {
    for (const folder of FOLDERS) {
        if (!fs.existsSync(folder)) {
            return false;
        }
    }
    return true;
};
export const checkLanguageFiles = (language) => {
    if (language && language in LANG_IDS) {
        return LANG_IDS[language]?.check();
    }
    return false;
};
export const checkInit = () => {
    let initIsGood = true;
    const language = getLanguage();
    initIsGood = checkInitDotAstral();
    if (language) {
        initIsGood = initIsGood && checkLanguageFiles(language);
    }
    return initIsGood;
};
function jsCheck() {
    const hasConfig = fs.existsSync('astral.config.js');
    const hasDeploy = fs.existsSync('astral.deploy.js');
    return hasConfig && hasDeploy;
}
function pyCheck() {
    const hasConfig = fs.existsSync('astral.py');
    const hasDeploy = fs.existsSync('deploy.py');
    return hasConfig && hasDeploy;
}
// Inits
export const initLanguageFiles = (language) => {
    if (language && language in LANG_IDS) {
        LANG_IDS[language]?.init();
    }
};
export const init = () => {
    const language = getLanguage();
    initDotAstral();
    if (language) {
        initLanguageFiles(language);
    }
};
/**
 * Initializes the necessary folders for the application.
 * It checks if the folders already exist, and if not, creates them.
 */
export function initDotAstral() {
    for (const folder of FOLDERS) {
        // Does same check as checkInitDotAstral
        if (!fs.existsSync(folder)) {
            fs.mkdir(folder, { recursive: true }, (error) => {
                if (error) {
                    console.error('An error occurred creating the necessary folders. Run `astral init` again.');
                }
            });
        }
    }
}
/**
 * Creates the initial files necessary (astral.config.js, astral.deploy.js) to run Astral.
 * @param projectName - The name of the project, from either package.json or the dir name.
 */
export function jsInit() {
    if (fs.existsSync('astral.config.js'))
        return;
    const projectName = getProjectName('javascript');
    const jsConfig = createJsConfig(projectName);
    if (!fs.existsSync('astral.config.js')) {
        fs.writeFile('astral.config.js', jsConfig, (error) => {
            if (error)
                console.log('Error writing file');
        });
    }
    if (!fs.existsSync('astral.deploy.js')) {
        fs.writeFile('astral.deploy.js', createJsDeploy, (error) => {
            if (error)
                console.log('Error writing file');
        });
    }
}
/**
 * Creates the initial files necessary (astral.config.js, astral.deploy.js) to run Astral.
 * @param projectName - The name of the project, from either package.json or the dir name.
 */
export function pyInit() {
    if (fs.existsSync('astral.py'))
        return;
    const projectName = getProjectName('python');
    const pyConfig = createPyConfig(projectName);
    if (!fs.existsSync('astral.py')) {
        fs.writeFile('astral.py', pyConfig, (error) => {
            if (error)
                console.log('Error writing file');
        });
    }
    if (!fs.existsSync('deploy.py')) {
        fs.writeFile('deploy.py', createPyDeploy, (error) => {
            if (error)
                console.log('Error writing file');
        });
    }
}
//# sourceMappingURL=init.js.map