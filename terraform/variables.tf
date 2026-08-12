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

variable "backend_cognito_user_pool_arn" {
  description = "ARN Cognito User Pool mà backend production quản lý. Để null khi dùng pool do Terraform này tạo; khai báo ARN khi runtime dùng pool đã tạo bên ngoài Terraform."
  type        = string
  default     = null
  nullable    = true

  validation {
    condition = (
      var.backend_cognito_user_pool_arn == null ||
      (
        can(regex(
          "^arn:[^:]+:cognito-idp:[a-z0-9-]+:[0-9]{12}:userpool/[a-z0-9-]+_[A-Za-z0-9]+$",
          var.backend_cognito_user_pool_arn,
        )) &&
        try(
          split(":", var.backend_cognito_user_pool_arn)[3] ==
          split("_", split("/", var.backend_cognito_user_pool_arn)[1])[0],
          false,
        )
      )
    )
    error_message = "backend_cognito_user_pool_arn must be a valid Cognito user-pool ARN whose ARN region matches the user-pool ID prefix, or null."
  }
}

variable "backend_cognito_client_id" {
  description = "App Client ID thuộc đúng Cognito User Pool bên ngoài mà backend xác minh. Phải khai báo cùng backend_cognito_user_pool_arn; để null khi dùng pool/client do Terraform này tạo."
  type        = string
  default     = null
  nullable    = true

  validation {
    condition = (
      var.backend_cognito_client_id == null ||
      can(regex("^[A-Za-z0-9_+]{1,128}$", var.backend_cognito_client_id))
    )
    error_message = "backend_cognito_client_id must be a valid Cognito app-client ID or null."
  }
}
