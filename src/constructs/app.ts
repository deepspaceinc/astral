import { InlineProgramArgs, LocalWorkspace } from '../utils/pulumi-automation.js';
import yoctoSpinner from 'yocto-spinner';
import { getProjectName, getNameSlug } from '../utils/build.js';
import { genNixpacks } from '../utils/terminal.js';
import { parseDryrun, mapResourceOutputs } from '../utils/parse.js';

// Define a deploy options interface to avoid circular references
type DeployOptions = {
	verbose?: string | boolean;
	dryrun?: string | boolean;
};

// Define the configuration interface
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
class App {
	private readonly config: AppConfig;

	constructor(config: AppConfig) {
		// Set defaults and merge with provided config
		this.config = {
			serverless: false, // Will be true soon-- we should default to Lambda if the bundle is small enough, otherwise Fargate.
			name: `${getProjectName()}-${getNameSlug()}`,
			port: 80,
			region: 'us-east-1', // Us-east-1 is reasonable for now, should be configurable to support other regions
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
	async deploy(options?: DeployOptions): Promise<any> {
		// Handle deployment based on product type
		switch (this.config.product) {
			case 'ecs': {
				return this.deployECS(options);
			}

			default: {
				return this.deployECS(options);
			}
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
			const loadbalancer = new awsx.lb.ApplicationLoadBalancer(`${this.config.name}-lb`, {
				listener: { port: this.config.port || 80 },
			});

			// Create the ECR repository to store our container image
			const repo = new awsx.ecr.Repository(`${this.config.name}-repo`, {
				forceDelete: true,
			});

			// Build and publish our application's container image
			const image = new awsx.ecr.Image(`${this.config.name}-image`, {
				repositoryUrl: repo.url,
				context: './app', // This might need to be configured based on your app structure
				platform: 'linux/amd64',
				// Dockerfile: '.astral/.nixpacks/Dockerfile',
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
				serviceArn: service.taskDefinition.apply((td) => td?.arn),
				url: frontendURL,
				clusterName: cluster.name,
			};
		};
	}

	/**
	 * Deploy using Pulumi Automation API
	 */
	private async deployECS(options?: DeployOptions): Promise<Record<string, any>> {
		try {
			// Enable verbose logging if requested
			const verbose = options?.verbose === true || options?.verbose === 'true';
			if (verbose) {
				yoctoSpinner({ text: `verbose logging enabled` }).start().success();
			}

			// Create Dockerfile
			const dockerSpinner = yoctoSpinner({ text: `creating Dockerfile...` }).start();
			const docker = genNixpacks(this.config.entrypoint);
			if (!docker) {
				dockerSpinner.error('issue generating Dockerfile, try again');
			}

			dockerSpinner.success('Dockerfile created');

			// Create AWS stack
			const stackSpinner = yoctoSpinner({ text: `initializing stack...` }).start();
			const args: InlineProgramArgs = {
				stackName: this.config.name || `astral-app-stack-${getNameSlug()}`,
				projectName: this.config.name || `astral-app-${getNameSlug()}`,
				program: this.getPulumiProgram(),
			};

			const stack = await LocalWorkspace.createOrSelectStack(args);
			stackSpinner.success('stack initialized');
			// Install plugins
			const pluginSpinner = yoctoSpinner({ text: `initializing plugins...` }).start();
			await stack.workspace.installPlugin('aws', 'v4.0.0');
			pluginSpinner.success('plugins initialized');

			// Set configuration
			const configSpinner = yoctoSpinner({ text: `initializing configuration...` }).start();
			await stack.setConfig('aws:region', { value: this.config.region || 'us-east-1' });
			configSpinner.success('configuration initialized');

			// Update the stack
			const updateSpinner = yoctoSpinner({ text: `provisioning stack...` }).start();
			if (options?.dryrun) {
				// TODO fix this to match the non-dry run thing
				const preview = await stack.preview({});
				updateSpinner.success('dryrun complete 🎉');
				return parseDryrun(preview.stdout as string);
			}

			// Console.log everything if verbose is passed
			const options_ = options?.verbose
				? {
						onOutput: console.log,
				  }
				: {};
			await stack.up({
				onOutput: console.log,
		  });
			updateSpinner.success('deploy complete 🎉');
			// My pulumi org, TODO: Need to fix this to be dynamic
			const state = await stack.exportStack(`joelachance/${this.config.name}/${this.config.name}`);
			return mapResourceOutputs(state.deployment?.resources);
		} catch (error) {
			console.error('Deployment failed:', error);
			throw error;
		}
	}
}

// Export the App class as part of the astral namespace
export const astral = {
	App,
};
