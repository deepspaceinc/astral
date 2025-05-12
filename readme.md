<p align="center">
    <img alt="Astral logo" src="https://raw.githubusercontent.com/deepspaceinc/astral/refs/heads/main/static/astral_logo.svg" width="300" />
</p>

---

![Discord](https://img.shields.io/discord/1364346935875735706)
[![build](https://github.com/deepspaceinc/astral/actions/workflows/build.yml/badge.svg)](https://github.com/deepspaceinc/astral/actions/workflows/build.yml)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)

Astral provides simple AWS constructs for Javascript and Python.
It uses sensible defaults to create basic deployments using ECS, Fargate, and Lambda.

## 🚀 Installation

Install Astral globally using npm, yarn, or bun:

```bash
npm install -g astral
# or
yarn global add astral
# or
bun install -g astral
```

Or install locally in your project:

```bash
npm install --save-dev astral
# or
yarn add --dev astral
# or
bun add --dev astral
```

## 🌟 Quick Start

### Initializing a Project

In your project directory, run:

```bash
astral init
```

This will:
- Create a `.astral` directory with necessary configuration files
- Initialize language-specific deployment files based on your project
- Check and install dependencies if needed

### Deploying an Application

Once your project is initialized, deploy with:

```bash
astral deploy
```

### The App Construct

The core of Astral is the `App` construct, which provides a high-level abstraction for deploying applications to AWS:

```javascript
// JavaScript example
const { astral } = require('astral');

const app = new astral.App({
  name: 'my-awesome-app',
  port: 3000,
  product: 'fargate',   // 'ecs', 'fargate', 'lambda', or 'ec2'
  region: 'us-west-2'
});

app.deploy();
```

P


## ⚙️ Configuration

The `App` construct accepts the following configuration options:

| Option      | Type    | Default              | Description                                      |
|-------------|---------|----------------------|--------------------------------------------------|
| `name`      | string  | project-name-random  | Name of your application                         |
| `domain`    | string  | undefined            | Custom domain for your app                       |
| `entrypoint`| string  | undefined            | Entry point file for your application           |
| `serverless`| boolean | false                | Whether to use serverless deployment             |
| `port`      | number  | 80                   | Port your application listens on                |
| `region`    | string  | 'us-east-1'          | AWS region to deploy to                         |
| `product`   | string  | 'ecs'                | AWS product: 'ecs', 'fargate', 'lambda', 'ec2'   |
| `type`      | string  | 'web'                | Application type: 'web' or 'worker'             |
| `image`     | string  | undefined            | Custom container image                          |
| `cpu`       | number  | 256                  | CPU units (1024 = 1 vCPU)                       |
| `memory`    | number  | 512                  | Memory in MB                                    |
| `replicas`  | number  | 1                    | Number of container instances                   |

## 🏗️ Infrastructure

Astral automatically provisions the following AWS resources based on your configuration:

- **For ECS/Fargate deployments**:
  - ECS Cluster
  - Application Load Balancer
  - ECR Repository
  - Task Definition
  - Fargate/ECS Service
  - Networking resources (VPC, subnets, security groups)

- **For Lambda deployments** (coming soon):
  - Lambda Function
  - API Gateway
  - IAM Roles and Policies

## 🔍 CLI Commands

```
astral init      # Initialize Astral in your project
astral deploy    # Deploy your application
astral resources # List deployed resources
```

## 🌐 Environment Variables

Astral reads environment variables from your project and makes them available in your deployed application. You can define them in a `.env` file or in your deployment configuration.

## 🧩 Working with Pulumi

Astral uses Pulumi under the hood to provision AWS resources. For advanced users who want more control, Astral exposes the Pulumi automation API.

### Understanding Output Types

When working with Pulumi in Astral, you'll encounter values wrapped in `Output<T>` types. These represent values that will be determined during deployment. To safely access properties on these outputs:

```typescript
// Incorrect - May cause runtime errors
const url = output.url;

// Correct - Use the apply method
output.apply(value => {
  const url = value?.url; // Safe property access with null/undefined checking
  // Use url here
});
```

### Custom Pulumi Programs

For advanced deployments, you can create custom Pulumi programs in your `astral.deploy.js` file:

```javascript
// astral.deploy.js
module.exports = () => {
  const { astral } = require('astral');
  
  const app = new astral.App({
    name: 'custom-app',
    // other configuration
  });
  
  // You can add custom Pulumi resources here
  // or customize the deployment process
  
  return app;
};
```

## 📊 Monitoring and Logging

Astral automatically configures CloudWatch logging for your applications. You can access logs through the AWS Console or using the AWS CLI:

```bash
aws logs get-log-events --log-group-name "/aws/ecs/your-app-name"
```

For more advanced monitoring, consider integrating with:  
- Amazon CloudWatch Metrics
- AWS X-Ray
- Third-party monitoring solutions

## 🛠️ Troubleshooting

### Common Issues

1. **Deployment fails with credential errors**
   - Ensure your AWS credentials are properly configured using `aws configure`

2. **Container fails to start**
   - Check your application logs in CloudWatch
   - Verify your application is properly configured to listen on the specified port

3. **Resources don't appear**
   - Run `astral resources` to view deployed resources
   - Check your AWS console in the configured region

### Debugging

For detailed debug logs, run Astral with the `DEBUG` environment variable:

```bash
DEBUG=astral:* astral deploy
```

## 💎 Best Practices

### Project Structure

For optimal experience with Astral, organize your project like this:

```
my-app/
├── src/               # Application source code
├── .astral/           # Astral configuration (generated)
│   ├── logs/          # Deployment logs
├── astral.config.js   # Astral configuration
├── astral.deploy.js   # Deployment definition
└── package.json       # Dependencies
```

### Deployment Patterns

#### Blue-Green Deployments

To implement blue-green deployments with Astral:

```javascript
// In astral.deploy.js
module.exports = () => {
  const { astral } = require('astral');
  
  const app = new astral.App({
    name: `my-app-${process.env.ENVIRONMENT || 'blue'}`,
    // other configuration
  });
  
  return app;
};
```

#### Multi-Region Deployments

For applications requiring high availability across regions:

```javascript
// Deploy to multiple regions
async function deployMultiRegion() {
  const regions = ['us-east-1', 'us-west-2', 'eu-west-1'];
  
  for (const region of regions) {
    const app = new astral.App({
      name: 'global-app',
      region: region
    });
    
    await app.deploy();
  }
}
```

### Security Recommendations

1. **Use IAM Roles** - Avoid hardcoding AWS credentials
2. **Encrypt Sensitive Data** - Use AWS Secrets Manager for sensitive information
3. **Implement Least Privilege** - Customize IAM policies in your Pulumi code
4. **Enable VPC** - For production workloads, ensure your services run in a VPC

## 📓 Additional Resources

- [Astral Documentation](https://github.com/deepspaceinc/astral/wiki) - Full API reference
- [Pulumi Documentation](https://www.pulumi.com/docs/) - Learn more about Pulumi
- [AWS Best Practices](https://aws.amazon.com/architecture/well-architected/) - AWS Well-Architected Framework

## 👤 Contributing

We welcome contributions to Astral! Here's how to get started:

### Development Setup

Use `npm` or `bun`:

```bash
bun install
```

To develop locally:

```bash
bun link
bun run dev
```

And in another repo to run Astral against:

```bash
bun link astral
```

Or add it in dependencies in your package.json file:

```bash
bun link astral --save
```

### Contribution Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔖 License

MIT
