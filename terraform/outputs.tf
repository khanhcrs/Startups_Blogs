output "frontend_cloudfront_url" {
  description = "Đường dẫn CloudFront HTTPS của Frontend Web App"
  value       = "https://${aws_cloudfront_distribution.cdn.domain_name}"
}

output "api_gateway_url" {
  description = "Đường dẫn API Gateway HTTPS cho Backend"
  value       = aws_apigatewayv2_stage.default.invoke_url
}

output "ec2_public_ip" {
  description = "Địa chỉ IP Public của máy chủ EC2"
  value       = aws_instance.backend.public_ip
}

output "rds_endpoint" {
  description = "Endpoint kết nối của RDS PostgreSQL"
  value       = aws_db_instance.postgres.endpoint
}

output "cognito_user_pool_id" {
  description = "ID của Cognito User Pool"
  value       = aws_cognito_user_pool.user_pool.id
}

output "cognito_client_id" {
  description = "Client ID của Cognito App Client do Terraform này tạo (không dùng output này với external User Pool)"
  value       = aws_cognito_user_pool_client.client.id
}

output "backend_cognito_user_pool_arn" {
  description = "Cognito User Pool ARN mà IAM role của backend được phép quản lý group ADMIN"
  value       = local.backend_cognito_user_pool_arn
}

output "backend_cognito_user_pool_id" {
  description = "Giá trị COGNITO_USER_POOL_ID cho backend runtime"
  value       = local.backend_cognito_user_pool_id
}

output "backend_cognito_region" {
  description = "Giá trị COGNITO_REGION cho backend runtime, suy ra từ ARN của pool"
  value       = local.backend_cognito_region
}

output "backend_cognito_client_id" {
  description = "Giá trị COGNITO_CLIENT_ID khớp với backend_cognito_user_pool_id"
  value       = local.backend_cognito_client_id
}
