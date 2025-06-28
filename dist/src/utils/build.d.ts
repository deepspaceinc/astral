export declare function getDeployConstructs(): Promise<() => void>;
export declare function getNameSlug(): string;
/**
 * Get the name from package.json
 * @returns The name from package.json or a fallback name if not found
 */
export declare function getProjectName(lang?: string): string;
