type DeployOptions = {
    verbose?: string | boolean;
    dryrun?: string | boolean;
};
type AppConfig = {
    domain?: string;
    entrypoint?: string;
    serverless?: boolean;
    name?: string;
    port?: number;
    region?: string;
    product?: 'ecs' | 'fargate' | 'lambda' | 'ec2';
    type?: 'web' | 'worker';
    image?: string;
    cpu?: number;
    memory?: number;
    replicas?: number;
};
/**
 * App class for Astral application configuration and deployment
 */
declare class App {
    private readonly config;
    constructor(config: AppConfig);
    /**
     * Validate the provided configuration
     */
    private validateConfig;
    /**
     * Deploy the application with the current configuration
     */
    deploy(options?: DeployOptions, setDeployList?: (messages: string[]) => void): Promise<any>;
    /**
     * Get Pulumi program for ECS deployment
     * This function returns the actual Pulumi program that defines the infrastructure
     */
    private getPulumiProgram;
    /**
     * Deploy using Pulumi Automation API
     */
    private deployECS;
}
export declare const astral: {
    App: typeof App;
};
export {};
