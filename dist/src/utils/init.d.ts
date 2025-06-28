type Language = 'javascript' | 'python';
type LangIds = Record<Language, {
    identifiers: string[];
    init: () => void;
    check: () => boolean;
}>;
export declare const getLanguage: () => keyof LangIds | "";
export declare const checkInitDotAstral: () => boolean;
export declare const checkLanguageFiles: (language: Language) => boolean;
export declare const checkInit: () => boolean;
export declare const initLanguageFiles: (language: Language) => void;
export declare const init: () => void;
/**
 * Initializes the necessary folders for the application.
 * It checks if the folders already exist, and if not, creates them.
 */
export declare function initDotAstral(): void;
/**
 * Creates the initial files necessary (astral.config.js, astral.deploy.js) to run Astral.
 * @param projectName - The name of the project, from either package.json or the dir name.
 */
export declare function jsInit(): void;
/**
 * Creates the initial files necessary (astral.config.js, astral.deploy.js) to run Astral.
 * @param projectName - The name of the project, from either package.json or the dir name.
 */
export declare function pyInit(): void;
export {};
