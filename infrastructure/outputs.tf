output "vpc_id" {
  description = "VPC ID"
  value       = module.networking.vpc_id
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = module.networking.public_subnet_ids
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = module.networking.private_subnet_ids
}

output "alb_dns_name" {
  description = "Application Load Balancer DNS name"
  value       = module.load_balancer.alb_dns_name
}

output "alb_zone_id" {
  description = "Application Load Balancer zone ID"
  value       = module.load_balancer.alb_zone_id
}

output "api_endpoint" {
  description = "API endpoint URL"
  value       = "https://${module.load_balancer.alb_dns_name}/api"
}

output "frontend_domain" {
  description = "Frontend CloudFront domain"
  value       = module.frontend.cloudfront_domain_name
}

output "s3_bucket_name" {
  description = "S3 bucket for frontend assets"
  value       = module.frontend.s3_bucket_name
}

output "ecr_repository_url" {
  description = "ECR repository URL"
  value       = module.api_service.ecr_repository_url
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = module.ecs.cluster_name
}

output "ecs_service_name" {
  description = "ECS service name"
  value       = module.api_service.service_name
}

output "database_endpoint" {
  description = "Database cluster endpoint"
  value       = module.database.cluster_endpoint
  sensitive   = true
}