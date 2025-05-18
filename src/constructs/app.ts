// Top-level pulumi import not needed as we're importing it dynamically in the methods
import { InlineProgramArgs, LocalWorkspace } from '../utils/pulumi-automation.js';
// import yoctoSpinner from 'yocto-spinner';
import { getProjectName, getNameSlug } from '../utils/build.js';
import { genNixpacks } from '../utils/nixpacks.js';
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
	async deploy(
		options?: DeployOptions,
		setDeployList?: (messages: string[]) => void,
	): Promise<any> {
		// Handle deployment based on product type
		switch (this.config.product) {
			case 'ecs': {
				return this.deployECS(options, setDeployList);
			}

			default: {
				return this.deployECS(options, setDeployList);
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

			// Create the ECR repository to store our container image
			const repo = new awsx.ecr.Repository(`${this.config.name}-repo`, {
				forceDelete: true,
			});
			
			// Build and publish our application's container image
			const image = new awsx.ecr.Image(`${this.config.name}-image`, {
				repositoryUrl: repo.url,
				platform: 'linux/amd64',
				dockerfile: `${this.config.entrypoint || ''}.astral/.nixpacks/Dockerfile`,
			});
			
			// Create an S3 bucket for ALB access logs
			// 1. Use specific ACL and policy settings for ALB logs
			const logBucket = new aws.s3.Bucket(`${this.config.name}-logs`, {
				forceDestroy: true,
			});
			
			// Get current AWS region and account ID for the policy
			const region = aws.getRegion().then(region => region.name);
			const accountId = aws.getCallerIdentity().then(id => id.accountId);
			
			// Create a bucket policy with the exact format needed for ELB logs
			// This follows AWS documentation for ELB access logs permissions
			const bucketPolicy = new aws.s3.BucketPolicy("logBucketPolicy", {
				bucket: logBucket.id,
				policy: pulumiLib.all([logBucket.arn, region, accountId]).apply(([bucketArn, region, accountId]) =>
					JSON.stringify({
						Version: "2012-10-17",
						Statement: [
							{
								Effect: "Allow",
								Principal: {
									AWS: `arn:aws:iam::${region === "us-east-1" ? "127311923021" : 
										region === "us-east-2" ? "033677994240" :
										region === "us-west-1" ? "027434742980" :
										region === "us-west-2" ? "797873946194" :
										region === "eu-west-1" ? "156460612806" : "127311923021"}:root`
								},
								Action: "s3:PutObject",
								// Include accountId in the resource path
								Resource: `${bucketArn}/lb-logs/AWSLogs/${accountId}/*`,
							},
							{
								Effect: "Allow",
								Principal: {
									Service: "delivery.logs.amazonaws.com"
								},
								Action: "s3:PutObject",
								// Make sure this matches the prefix in the load balancer config
								Resource: `${bucketArn}/lb-logs/AWSLogs/${accountId}/*`,
								Condition: {
									StringEquals: {
										"s3:x-amz-acl": "bucket-owner-full-control"
									}
								}
							},
							{
								Effect: "Allow",
								Principal: {
									Service: "delivery.logs.amazonaws.com"
								},
								Action: "s3:GetBucketAcl",
								Resource: bucketArn
							}
						]
					})
				)
			});
			
			// Create a load balancer with access logs enabled
			// Make sure it depends on the bucket policy being properly set up first
			const loadbalancer = new awsx.lb.ApplicationLoadBalancer(`${this.config.name}-lb`, {
				listener: { port: this.config.port || 80 },
				// HTTP access logs - use the bucket with our properly configured policy
				accessLogs: {
					// Use bucket ID (name) directly - important for S3 path resolution
					bucket: logBucket.id,
					// Keep prefix simple
					prefix: "lb-logs",
					enabled: true
				},
			}, { dependsOn: bucketPolicy }); // Explicitly depend on the bucket policy

			// stdout logs
			const logGroup = new aws.cloudwatch.LogGroup(`${this.config.name}-logGroup`, {
				retentionInDays: 7,
			});

			// stdout logs
			const executionRole = new aws.iam.Role(`${this.config.name}-taskExecRole`, {
				assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
					Service: 'ecs-tasks.amazonaws.com',
				}),
			});

			// 3) stdout logs
			// We don't need a variable, but we need the resource to be created
			new aws.iam.RolePolicyAttachment(`${this.config.name}-taskExecPolicy`, {
				role: executionRole.name,
				policyArn: 'arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy',
			});

			const service = new awsx.ecs.FargateService('service', {
				cluster: cluster.arn,
				assignPublicIp: true,
				taskDefinitionArgs: {
					// stdout logs
					// Use the role's ARN for the execution role
					executionRole: {
						roleArn: executionRole.arn,
					},
					container: {
						name: this.config.name || 'app',
						image: image.imageUri,
						cpu: this.config.cpu || 128,
						memory: this.config.memory || 512,
						essential: true,
						// stdout logs
						logConfiguration: {
							logDriver: 'awslogs',
							options: {
								'awslogs-group': logGroup.name,
								'awslogs-region': this.config.region,
								'awslogs-stream-prefix': 'web',
							},
						},
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
	private async deployECS(
		options?: DeployOptions,
		setDeployList?: (messages: string[]) => void,
	): Promise<Record<string, any>> {
		try {
			// Enable verbose logging if requested
			const verbose = options?.verbose === true || options?.verbose === 'true';
			if (verbose) {
				// yoctoSpinner({ text: `verbose logging enabled` }).start().success();
			}

			// Create Dockerfile
			// const dockerSpinner = yoctoSpinner({ text: `creating Dockerfile...` }).start();
			const docker = genNixpacks(this.config.entrypoint || './');
			if (!docker) {
				// dockerSpinner.error('issue generating Dockerfile, try again');
			}

			// dockerSpinner.success('Dockerfile created');

			// Create AWS stack
			// const stackSpinner = yoctoSpinner({ text: `initializing stack...` }).start();
			const args: InlineProgramArgs = {
				stackName: this.config.name || `astral-app-stack-${getNameSlug()}`,
				projectName: this.config.name || `astral-app-${getNameSlug()}`,
				program: await this.getPulumiProgram(),
			};

			const stack = await LocalWorkspace.createOrSelectStack(args);
			// stackSpinner.success('stack initialized');
			// Install plugins
			// const pluginSpinner = yoctoSpinner({ text: `initializing plugins...` }).start();
			await stack.workspace.installPlugin('aws', 'v4.0.0');
			// pluginSpinner.success('plugins initialized');

			// Set configuration
			// const configSpinner = yoctoSpinner({ text: `initializing configuration...` }).start();
			await stack.setConfig('aws:region', { value: this.config.region || 'us-east-1' });
			// configSpinner.success('configuration initialized');

			// Update the stack
			// const updateSpinner = yoctoSpinner({ text: `provisioning stack...` }).start();
			if (options?.dryrun) {
				// TODO fix this to match the non-dry run thing
				const preview = await stack.preview({});
				// updateSpinner.success('dryrun complete 🎉');
				return parseDryrun(preview.stdout as string);
			}

			// Maintain a collection of messages
			const messages: string[] = [];

			const options_ = {
				onOutput: (message: string) => {
					// Add message to our collection
					messages.push(message);

					// If we have a setDeployList function, call it with the updated messages
					if (setDeployList) {
						setDeployList([...messages]);
					}
				},
			};
			await stack.up(options_);
			// updateSpinner.success('deploy complete 🎉');
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
