// This is a bridge file to properly import Pulumi automation API
// It handles the compatibility between CommonJS and ES Modules

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import using require (CommonJS) and re-export for ES Modules
const automation = require('@pulumi/pulumi/automation');

// Re-export the specific classes and types we need
export const LocalWorkspace = automation.LocalWorkspace;

// Export types for TypeScript
// We need to define InlineProgramArgs both as a value and as a type
export const InlineProgramArgs = automation.InlineProgramArgs;

// Define the type interfaces
export type InlineProgramArgs = {
  stackName: string;
  projectName: string;
  program: () => Promise<any>;
};

export type Stack = any; // This is a simplified type
export type ProjectSettings = any;
export type StackSettings = any;
