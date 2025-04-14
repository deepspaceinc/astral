import fs from 'fs';

/**
 * Identifies the project name from the cwd.
 * For Javascript, it looks for package.json and uses the directory name.
 * @returns {String} The name of the project.
 */
export default function getProjectName(lang: string) {
    const cwd = process.cwd();

    if (lang === 'javascript') {
        let dependencyFile = `${cwd}/package.json`
        const data = JSON.parse(fs.readFileSync(dependencyFile, 'utf8'));
        if (data && data.name) {
            return data.name;
        }
    }
    
    // Fallback for JS, default for Python
    return cwd.split('/').pop() || 'name-not-found';
}