variable "aws_region" {
  description = "AWS Region cho hạ tầng"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Tên dự án"
  type        = string
  default     = "startups-blogs"
}

variable "environment" {
  description = "Môi trường (dev, prod, staging)"
  type        = string
  default     = "production"
}

variable "db_password" {
  description = "Mật khẩu Master cho RDS PostgreSQL"
  type        = string
  default     = "secretpassworddd"
  sensitive   = true
}

variable "alert_email" {
  description = "Email nhận cảnh báo từ CloudWatch & SNS"
  type        = string
  default     = "admin@startups.vn"
}
