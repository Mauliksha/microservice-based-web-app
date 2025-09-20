terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    # Configure your S3 backend here
    # bucket = "your-terraform-state-bucket"
    # key    = "infrastructure/terraform.tfstate"
    # region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
      CreatedAt   = timestamp()
    }
  }
}

locals {
  name_prefix = "${var.project_name}-${var.environment}"
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

# Networking Module
module "networking" {
  source = "./modules/networking"

  name_prefix        = local.name_prefix
  vpc_cidr           = var.vpc_cidr
  availability_zones = slice(data.aws_availability_zones.available.names, 0, var.az_count)

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

# Security Module
module "security" {
  source = "./modules/security"

  name_prefix = local.name_prefix
  vpc_id      = module.networking.vpc_id

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

# Database Module
module "database" {
  source = "./modules/database"

  name_prefix                = local.name_prefix
  vpc_id                     = module.networking.vpc_id
  private_subnet_ids         = module.networking.private_subnet_ids
  database_security_group_id = module.security.database_security_group_id

  db_name     = var.db_name
  db_username = var.db_username

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

# ECS Cluster Module
module "ecs" {
  source = "./modules/ecs"

  name_prefix = local.name_prefix

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

# Load Balancer Module
module "load_balancer" {
  source = "./modules/load_balancer"

  name_prefix           = local.name_prefix
  vpc_id                = module.networking.vpc_id
  public_subnet_ids     = module.networking.public_subnet_ids
  alb_security_group_id = module.security.alb_security_group_id

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

# API Service Module
module "api_service" {
  source = "./modules/api_service"

  name_prefix           = local.name_prefix
  ecs_cluster_id        = module.ecs.cluster_id
  vpc_id                = module.networking.vpc_id
  private_subnet_ids    = module.networking.private_subnet_ids
  api_security_group_id = module.security.api_security_group_id
  target_group_arn      = module.load_balancer.api_target_group_arn

  # Database connection
  db_host       = module.database.cluster_endpoint
  db_port       = module.database.cluster_port
  db_name       = var.db_name
  db_username   = var.db_username
  db_secret_arn = module.database.secret_arn

  # Container settings
  container_image = var.api_image
  container_port  = var.api_port

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

# Frontend Module (CloudFront + S3)
module "frontend" {
  source = "./modules/frontend"

  name_prefix     = local.name_prefix
  api_domain_name = module.load_balancer.alb_dns_name

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}

# Monitoring Module
module "monitoring" {
  source = "./modules/monitoring"

  name_prefix      = local.name_prefix
  ecs_cluster_name = module.ecs.cluster_name

  tags = {
    Environment = var.environment
    Project     = var.project_name
  }
}