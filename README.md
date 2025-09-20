# Microservice Web Application

A modern, scalable web application built with microservices architecture on AWS.

## Architecture Overview

This application demonstrates a production-ready microservices deployment with:

- **Frontend**: React application with Vite, served via CloudFront + S3
- **API**: Node.js Express API running on ECS Fargate
- **Database**: Aurora Serverless v2 PostgreSQL with multi-AZ deployment
- **Infrastructure**: Fully managed with Terraform (Infrastructure as Code)
- **CI/CD**: Automated build, test, and deployment pipeline with GitHub Actions

## AWS Services Used

### Compute & Containers
- **ECS Fargate**: Serverless container orchestration for the API
- **Application Load Balancer**: Distributes traffic and handles SSL termination
- **Auto Scaling**: Automatic scaling based on CPU utilization

### Database & Storage
- **Aurora Serverless v2**: Cost-effective, auto-scaling PostgreSQL database
- **S3**: Static website hosting for the frontend
- **ECR**: Container image registry

### Networking & Security
- **VPC**: Isolated network with public/private subnets across multiple AZs
- **Security Groups**: Firewall rules for each component
- **WAF**: Web Application Firewall for CloudFront
- **Secrets Manager**: Secure storage of database credentials

### Edge & CDN
- **CloudFront**: Global CDN for fast content delivery
- **Route 53**: DNS management (optional)

### Monitoring & Logging
- **CloudWatch**: Comprehensive monitoring and logging
- **CloudWatch Dashboards**: Visual monitoring interface

## Repository Structure

```
├── infrastructure/           # Terraform Infrastructure as Code
│   ├── modules/             # Reusable Terraform modules
│   │   ├── networking/      # VPC, subnets, NAT gateways
│   │   ├── security/        # Security groups, WAF
│   │   ├── database/        # Aurora cluster and related resources
│   │   ├── ecs/             # ECS cluster configuration
│   │   ├── load_balancer/   # Application Load Balancer
│   │   ├── api_service/     # ECS service for API
│   │   ├── frontend/        # S3 + CloudFront for frontend
│   │   └── monitoring/      # CloudWatch dashboards and alarms
│   ├── environments/        # Environment-specific variables
│   ├── main.tf             # Main Terraform configuration
│   ├── variables.tf        # Input variables
│   └── outputs.tf          # Output values
├── api/                    # Node.js API microservice
│   ├── server.js          # Main API server
│   ├── package.json       # Dependencies and scripts
│   ├── Dockerfile         # Container configuration
│   └── tests/             # API tests
├── frontend/              # React frontend application
│   ├── src/              # Source code
│   ├── public/           # Static assets
│   ├── package.json      # Dependencies and scripts
│   └── dist/             # Built application (generated)
├── .github/workflows/    # CI/CD pipeline configuration
└── README.md            # This file
```

## Quick Start

### Prerequisites

1. AWS account with appropriate permissions
2. Terraform >= 1.6.0
3. Node.js >= 18.0.0
4. Docker (for building container images)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd microservice-app
   ```

2. **Start the API locally**
   ```bash
   cd api
   npm install
   npm run dev
   ```

3. **Start the frontend locally**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Deployment

1. **Configure AWS credentials**
   ```bash
   export AWS_ACCESS_KEY_ID=your-access-key
   export AWS_SECRET_ACCESS_KEY=your-secret-key
   export AWS_DEFAULT_REGION=us-east-1
   ```

2. **Initialize Terraform**
   ```bash
   cd infrastructure
   terraform init
   ```

3. **Plan and apply infrastructure**
   ```bash
   # For development environment
   terraform plan -var-file="environments/dev.tfvars"
   terraform apply -var-file="environments/dev.tfvars"
   
   # For production environment
   terraform plan -var-file="environments/prod.tfvars"
   terraform apply -var-file="environments/prod.tfvars"
   ```

### CI/CD Pipeline

The application includes a comprehensive CI/CD pipeline that:

1. **Runs tests** for both API and frontend
2. **Performs security scanning** with Trivy
3. **Deploys infrastructure** using Terraform
4. **Builds and deploys API** to ECS Fargate
5. **Builds and deploys frontend** to S3/CloudFront
6. **Includes rollback capability** on deployment failures

## Key Features

### Infrastructure as Code
- **Modular Design**: Reusable Terraform modules for different components
- **Multi-Environment**: Separate configurations for dev, staging, and production
- **Idempotent Deployments**: Safe to run multiple times
- **Comprehensive Tagging**: All resources properly tagged for cost allocation

### High Availability
- **Multi-AZ Deployment**: Resources distributed across multiple availability zones
- **Auto Scaling**: Automatic scaling based on demand
- **Health Checks**: Comprehensive health monitoring at all levels
- **Circuit Breaker**: ECS deployment circuit breaker for safe deployments

### Security
- **Network Isolation**: Private subnets for backend services
- **Security Groups**: Least-privilege network access
- **Secrets Management**: Secure credential storage and rotation
- **WAF Protection**: Web application firewall for frontend
- **Container Security**: Regular vulnerability scanning

### Cost Optimization
- **Serverless Architecture**: Aurora Serverless v2 scales to zero
- **Fargate**: Pay only for compute resources used
- **CloudFront**: Reduced bandwidth costs with edge caching
- **Resource Optimization**: Right-sized instances and auto-scaling

### Monitoring & Observability
- **CloudWatch Integration**: Comprehensive logging and metrics
- **Custom Dashboards**: Visual monitoring of key metrics
- **Alerting**: Proactive alerts for issues
- **Performance Insights**: Database performance monitoring

## Environment Variables

### API
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 3000)
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_NAME`: Database name
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password (from Secrets Manager)

### Frontend
- `VITE_API_URL`: API endpoint URL

## Monitoring & Maintenance

### Health Checks
- API health endpoint: `/health`
- Load balancer health checks
- ECS task health monitoring
- Database connection monitoring

### Logs
- Application logs: CloudWatch Logs
- Access logs: S3 (ALB access logs)
- Container logs: ECS/CloudWatch integration

### Scaling
- **API**: Automatic scaling based on CPU utilization (70% threshold)
- **Database**: Aurora Serverless v2 automatic scaling
- **Frontend**: CloudFront global edge locations

## Cost Estimation

### Development Environment (Monthly)
- ECS Fargate (1 task): ~$15
- Aurora Serverless v2: ~$20-50 (depending on usage)
- Load Balancer: ~$20
- CloudFront: ~$5-10
- Other services: ~$10
- **Total: ~$70-105/month**

### Production Environment (Monthly)
- ECS Fargate (2+ tasks): ~$30-100
- Aurora Serverless v2: ~$50-200 (depending on usage)
- Load Balancer: ~$20
- CloudFront: ~$20-50
- Other services: ~$20
- **Total: ~$140-390/month**

## Troubleshooting

### Common Issues

1. **Deployment Failures**
   - Check CloudWatch logs for error details
   - Verify security group configurations
   - Ensure proper IAM permissions

2. **Database Connection Issues**
   - Verify security group allows traffic from ECS tasks
   - Check secrets manager for correct credentials
   - Ensure database is in available state

3. **Frontend Not Loading**
   - Check CloudFront distribution status
   - Verify S3 bucket policies
   - Check build artifacts are deployed correctly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run the test suite
6. Submit a pull request

## Security Considerations

- All secrets stored in AWS Secrets Manager
- Network isolation with private subnets
- Regular security updates via CI/CD
- Container vulnerability scanning
- WAF rules for common attacks
- Encryption at rest and in transit

## Compliance & Best Practices

- AWS Well-Architected Framework principles
- Infrastructure as Code for auditability
- Comprehensive logging for compliance
- Regular backups and disaster recovery
- Cost optimization strategies
- Security best practices

This architecture provides a solid foundation for a production microservices application with enterprise-grade security, scalability, and maintainability.

# Architecture Overview:

# Public Web:
React frontend with CloudFront + S3 for global distribution
# Admin API: 
Containerized Node.js API on ECS Fargate for automatic scaling
# Database: 
Aurora Serverless v2 PostgreSQL for cost optimization and multi-AZ
# Network: 
VPC with public/private subnets across multiple AZs
# Security: 
WAF, SSL certificates, and proper IAM roles

# AWS Services Justification:

# ECS Fargate: 
Serverless containers, no EC2 management, automatic scaling
# Aurora Serverless v2: 
Scales to zero when not in use, perfect for variable workloads
# CloudFront: 
Global edge locations for performance and cost optimization
# Application Load Balancer: 
Layer 7 routing, health checks, and SSL termination
# AWS Secrets Manager: 
Automatic rotation, encryption at rest and in transit

# Architecture Highlights:

# Frontend: 
React application with Vite, distributed globally via CloudFront + S3
# Backend: 
Node.js Express API running on ECS Fargate with auto-scaling
# Database: 
Aurora Serverless v2 PostgreSQL for cost optimization and multi-AZ availability
# Infrastructure: 
Modular Terraform configuration with environment separation
# Security: 
WAF, VPC isolation, security groups, and secrets management
# Monitoring: 
CloudWatch dashboards, alarms, and comprehensive logging

# Key Design Decisions & Justifications:

# ECS Fargate over EC2: 
Serverless containers eliminate infrastructure management and provide automatic scaling without capacity planning.

# Aurora Serverless v2: 
Scales to zero when not in use, perfect for variable workloads, and provides automatic multi-AZ failover.

# CloudFront + S3: 
Global edge distribution reduces latency and bandwidth costs while providing high availability.

# Modular Terraform: 
Each component is separated into reusable modules, making the infrastructure maintainable and testable.

# GitHub Actions CI/CD: 
Comprehensive pipeline with testing, security scanning, infrastructure deployment, and rollback capabilities.

# Cost-Aware Features:

Aurora Serverless v2 scales to zero during low usage
Fargate charges only for running containers
CloudFront reduces origin requests through caching
Spot instances available for non-critical workloads
Resource tagging for cost allocation and optimization

# Security & Compliance:

Multi-layer security with WAF, security groups, and VPC isolation
Secrets stored in AWS Secrets Manager with automatic rotation
Container vulnerability scanning in CI/CD pipeline
Comprehensive logging for audit compliance
Least-privilege IAM policies throughout
The solution is production-ready with enterprise-grade security, scalability, and maintainability. The modular design allows for easy extension and customization for specific business requirements.