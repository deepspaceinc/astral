import React, { useEffect, useState } from 'react';
import { checkDependencies } from '../utils/dependencies.js';
import { checkInit, initDotAstral, initLanguageFiles, getLanguage } from '../utils/init.js';
import { Spinner, StatusMessage } from '@inkjs/ui';
/**
 * Generates files for first time users.
 * This is done in a non-destructive way, so init can be run
 * against an existing Astral project without overwriting files.
 * @returns {null}
 */
export default function Init() {
    const [files, setFiles] = useState(false);
    const [filesStatus, setFilesStatus] = useState('');
    const [filesDone, setFilesDone] = useState(false);
    const [language, setLanguage] = useState(false);
    const [languageStatus, setLanguageStatus] = useState('');
    const [languageDone, setLanguageDone] = useState(false);
    const [dependencies, setDependencies] = useState(false);
    const [dependenciesStatus, setDependenciesStatus] = useState('');
    const [dependenciesDone, setDependenciesDone] = useState(false);
    // Check .astral files & dependencies. If they don't exist, add 'em!
    useEffect(() => {
        // Main initialization function to coordinate all tasks
        const initializeAll = async () => {
            // 1. Check Astral files
            setFiles(true);
            setFilesStatus('setting up astral...');
            const hasAstralFiles = checkInit();
            if (!hasAstralFiles) {
                initDotAstral();
                setFiles(false);
                setFilesDone(true);
                setFilesStatus('astral files created 💪');
            }
            else {
                setFiles(false);
                setFilesDone(true);
                setFilesStatus('astral already set up');
            }
            // 2. Check language files
            setLanguage(true);
            const language = getLanguage();
            if (!hasAstralFiles && language) {
                setLanguageStatus('setting up language files...');
                initLanguageFiles(language);
                setLanguage(false);
                setLanguageDone(true);
                setLanguageStatus('language files created');
            }
            else {
                setLanguage(false);
                setLanguageDone(true);
                setLanguageStatus('language files already set up');
            }
            // 3. Check dependencies
            setDependencies(true);
            setDependenciesStatus('checking dependencies...');
            // Process dependencies check
            const deps = await checkDependencies();
            const notInstalled = deps.filter((dep) => dep.isInstalled === false);
            if (notInstalled.length > 0) {
                setDependenciesStatus('Installing dependencies...');
                // TODO: Install dependencies
            }
            setDependencies(false);
            setDependenciesDone(true);
            setDependenciesStatus('dependencies installed');
        };
        initializeAll();
    }, []);
    return (React.createElement(React.Fragment, null,
        files ? React.createElement(Spinner, { label: filesStatus }) : null,
        filesDone && React.createElement(StatusMessage, { variant: "success" }, filesStatus),
        language ? React.createElement(Spinner, { label: languageStatus }) : null,
        languageDone && React.createElement(StatusMessage, { variant: "success" }, languageStatus),
        dependencies ? React.createElement(Spinner, { label: dependenciesStatus }) : null,
        dependenciesDone && React.createElement(StatusMessage, { variant: "success" }, dependenciesStatus),
        filesDone && languageDone && dependenciesDone && (React.createElement(React.Fragment, null,
            React.createElement(StatusMessage, { variant: "success" }, 'Astral installed'),
            React.createElement(StatusMessage, { variant: "success" }, 'Check your configuration in astral.deploy.js and run deploy 🎉')))));
}
//# sourceMappingURL=init.js.map