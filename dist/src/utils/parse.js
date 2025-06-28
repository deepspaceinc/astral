export function parseDryrun(input) {
    // Extract the Outputs section from preview results
    const outputs = {};
    const outputsSection = /Outputs:\s*([\s\S]*?)\s*Resources:/.exec(input);
    if (outputsSection && outputsSection[1]) {
        // We use the first capture group which contains just the content between Outputs: and Resources:
        const outputText = outputsSection[1];
        // Split into lines and process each line
        const lines = outputText
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean); // Remove empty lines
        // Process each line to extract key-value pairs
        for (const line of lines) {
            // Find first colon that separates key from value
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.slice(0, Math.max(0, colonIndex)).trim();
                let value = line.slice(Math.max(0, colonIndex + 1)).trim();
                // Remove surrounding quotes if present
                value = value.replace(/^["']|["']$/g, '');
                // Add to outputs object
                outputs[key] = value;
            }
        }
    }
    else {
        // If no outputs section found, add a default message
        outputs['message'] = 'No resources would be deployed in dry run';
    }
    return outputs;
}
export function mapResourceOutputs(resources) {
    try {
        // Safely transform the data with proper null/undefined checks
        return resources.map((i) => {
            // Get the name safely with optional chaining
            const name = i.outputs?.name || i.type;
            return { [i.type]: name };
        });
    }
    catch (error) {
        // Handle errors gracefully
        return [{ error: error instanceof Error ? error.message : 'Unknown error' }];
    }
}
//# sourceMappingURL=parse.js.map