output "ecr_repository_url" {
  description = "ECR repository URL"
  value       = aws_ecr_repository.api.repository_url
}

output "service_name" {
  description = "ECS service name"
  value       = aws_ecs_service.api.name
}

output "service_arn" {
  description = "ECS service ARN"
  value       = aws_ecs_service.api.id
}

output "task_definition_arn" {
  description = "ECS task definition ARN"
  value       = aws_ecs_task_definition.api.arn
}

output "log_group_name" {
  description = "CloudWatch log group name"
  value       = aws_cloudwatch_log_group.api.name
}