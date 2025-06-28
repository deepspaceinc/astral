export declare function parseDryrun(input: string): Record<string, string>;
export declare function mapResourceOutputs(resources: Array<{
    type: string;
    outputs?: {
        name?: string;
    };
}>): any[];
