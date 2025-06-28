import zod from 'zod';
declare const options: zod.ZodObject<{
    verbose: zod.ZodOptional<zod.ZodBoolean>;
    dryrun: zod.ZodOptional<zod.ZodBoolean>;
}, "strip", zod.ZodTypeAny, {
    verbose?: boolean | undefined;
    dryrun?: boolean | undefined;
}, {
    verbose?: boolean | undefined;
    dryrun?: boolean | undefined;
}>;
export type Props = {
    readonly options: zod.infer<typeof options>;
};
export default function Index({ options }: Props): null;
export {};
