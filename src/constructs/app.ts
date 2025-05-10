import { getProjectName, getNameSlug } from '../utils/build.js';
import { genNixpacks } from '../utils/terminal.js';
// @ts-ignore - Skip TypeScript checking for this import
import { InlineProgramArgs, LocalWorkspace } from "@pulumi/pulumi/automation";

// Define the configuration interface
interface AppConfig {
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
}

/**
 * App class for Astral application configuration and deployment
 */
class App {
	private config: AppConfig;

	constructor(config: AppConfig) {
		// Set defaults and merge with provided config
		this.config = {
			serverless: false, //will be true soon-- we should default to Lambda if the bundle is small enough, otherwise Fargate.
			name: `${getProjectName()}-${getNameSlug()}`,
			port: 80,
			region: 'us-east-1', // us-east-1 is reasonable for now, should be configurable to support other regions
			product: 'ecs',
			type: 'web',
			cpu: 256,
			memory: 512,
			replicas: 1,
			...config,
		};

		// Validate the configuration
		this.validateConfig();
	}

	/**
	 * Validate the provided configuration
	 */
	private validateConfig(): void {
		if (this.config.product && !['ecs', 'fargate', 'lambda', 'ec2'].includes(this.config.product)) {
			throw new Error('Invalid product type. Must be one of: ecs, fargate, lambda, ec2');
		}

		if (this.config.type && !['web', 'worker'].includes(this.config.type)) {
			throw new Error('Invalid app type. Must be one of: web, worker');
		}

		// More validation as needed...
	}

	/**
	 * Deploy the application with the current configuration
	 */
	async deploy(): Promise<void> {
		console.log(`Deploying ${this.config.name} to ${this.config.region} as ${this.config.product}`);
		
		// Handle deployment based on product type
		switch (this.config.product) {
			case 'ecs':
				await this.deployECS();
				break;
			default:
				await this.deployECS();
		}
	}

	/**
	 * Get Pulumi program for ECS deployment
	 * This function returns the actual Pulumi program that defines the infrastructure
	 */
	private getPulumiProgram() {
		return async () => {
			// Dynamically import Pulumi packages when needed
			const aws = await import('@pulumi/aws');
			const awsx = await import('@pulumi/awsx');
			const pulumiLib = await import('@pulumi/pulumi');
			
			// Create an ECS cluster to deploy into
			const cluster = new aws.ecs.Cluster(`${this.config.name}-cluster`, {});
			
			// Create a load balancer to listen for requests and route them to the container
			const loadbalancer = new awsx.lb.ApplicationLoadBalancer(`${this.config.name}-lb`, { listener: { port: this.config.port || 80 } });
			
			// Create the ECR repository to store our container image
			const repo = new awsx.ecr.Repository(`${this.config.name}-repo`, {
				forceDelete: true,
			});
			
			// Build and publish our application's container image
			const image = new awsx.ecr.Image(`${this.config.name}-image`, {
				repositoryUrl: repo.url,
				context: './app', // This might need to be configured based on your app structure
				platform: 'linux/amd64',
				// dockerfile: '.astral/.nixpacks/Dockerfile',
			});
			
			const service = new awsx.ecs.FargateService('service', {
				cluster: cluster.arn,
				assignPublicIp: true,
				taskDefinitionArgs: {
					container: {
						name: this.config.name || 'app',
						image: image.imageUri,
						cpu: this.config.cpu || 128,
						memory: this.config.memory || 512,
						essential: true,
						portMappings: [
							{
								containerPort: this.config.port || 80,
								targetGroup: loadbalancer.defaultTargetGroup,
							},
						],
					},
				},
			});
			
			// Create the URL
			const frontendURL = pulumiLib.interpolate`http://${loadbalancer.loadBalancer.dnsName}`;
			
			// Return outputs
			return {
				serviceArn: service.taskDefinition.apply(td => td?.arn),
				url: frontendURL,
				clusterName: cluster.name,
			};
		};
	}
	
	/**
	 * Deploy using Pulumi Automation API
	 */
	private async deployECS(): Promise<void> {
		console.log(`Deploying ${this.config.name} with Pulumi Automation API...`);

		try {
			// Create Dockerfile
			console.log('Creating Dockerfile...')
			const docker = genNixpacks(this.config.entrypoint);
			if (!docker) {
				throw new Error('Failed to generate Dockerfile');
			}
			// Create or select stack
			// Create stack args
			const args: InlineProgramArgs = {
				stackName: this.config.name || `astral-app-stack-${getNameSlug()}`,
				projectName: this.config.name || `astral-app-${getNameSlug()}`,
				program: this.getPulumiProgram()
			};
			const stack = await LocalWorkspace.createOrSelectStack(args);
			
			console.log("Initializing stack...");
			
			// Install plugins
			await stack.workspace.installPlugin("aws", "v4.0.0");
			
			// Set configuration
			await stack.setConfig("aws:region", { value: this.config.region || "us-east-1" });
			
			// // Refresh the stack
			// console.log("Refreshing stack...");
			// await stack.refresh({ onOutput: console.log });
			
			// Update the stack
			console.log("Updating stack...");
			const upRes = await stack.up({ onOutput: console.log });
			
			// Log results
			console.log(`Update summary: \n${JSON.stringify(upRes.summary.resourceChanges, null, 4)}`);
			if (upRes.outputs.url) {
				console.log(`Application URL: ${upRes.outputs.url.value}`);
			}
		} catch (error) {
			console.error("Deployment failed:", error);
			throw error;
		}
	}
}

// Export the App class as part of the astral namespace
export const astral = {
	App,
};
