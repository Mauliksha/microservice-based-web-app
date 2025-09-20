variable "name_prefix" {
  description = "Name prefix for resources"
  type        = string
}

variable "api_domain_name" {
  description = "API domain name"
  type        = string
}

variable "waf_web_acl_id" {
  description = "WAF Web ACL ID"
  type        = string
  default     = null
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}