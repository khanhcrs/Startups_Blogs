# 1. IAM Role cho EC2 truy cập S3 mà không cần Hardcode Key
resource "aws_iam_role" "ec2_s3_role" {
  name = "EC2-S3-Upload-Role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

# 2. Gắn AmazonS3FullAccess Policy vào Role
resource "aws_iam_role_policy_attachment" "s3_policy_attach" {
  role       = aws_iam_role.ec2_s3_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

locals {
  backend_cognito_user_pool_arn = coalesce(
    var.backend_cognito_user_pool_arn,
    aws_cognito_user_pool.user_pool.arn,
  )
  backend_cognito_region       = split(":", local.backend_cognito_user_pool_arn)[3]
  backend_cognito_user_pool_id = split("/", local.backend_cognito_user_pool_arn)[1]
  backend_cognito_client_id = coalesce(
    var.backend_cognito_client_id,
    aws_cognito_user_pool_client.client.id,
  )
}

# Backend chỉ cần các thao tác này để xác minh và đồng bộ role ADMIN.
# GetUser được ủy quyền bằng access token của user và không dùng IAM policy.
resource "aws_iam_role_policy" "ec2_cognito_admin_group_management" {
  name = "${var.project_name}-cognito-admin-group-management"
  role = aws_iam_role.ec2_s3_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "ManageAdminAuthorization"
        Effect = "Allow"
        Action = [
          "cognito-idp:AdminAddUserToGroup",
          "cognito-idp:AdminListGroupsForUser",
          "cognito-idp:AdminRemoveUserFromGroup",
          "cognito-idp:AdminUserGlobalSignOut",
        ]
        Resource = local.backend_cognito_user_pool_arn
      }
    ]
  })

  lifecycle {
    precondition {
      condition = (
        (var.backend_cognito_user_pool_arn == null) ==
        (var.backend_cognito_client_id == null)
      )
      error_message = "backend_cognito_user_pool_arn and backend_cognito_client_id must both be set for an external Cognito pool, or both be null for the Terraform-managed pool."
    }
  }
}

# 3. IAM Instance Profile
resource "aws_iam_instance_profile" "ec2_profile" {
  name = "EC2-S3-Instance-Profile"
  role = aws_iam_role.ec2_s3_role.name
}

# 4. SSH Key Pair (Nếu cần)
resource "aws_key_pair" "deployer" {
  key_name   = "startups-key"
  public_key = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIExamplePublicKeyContentChangeIfNeeded"
  lifecycle {
    ignore_changes = [public_key]
  }
}

# 5. EC2 Ubuntu Server
resource "aws_instance" "backend" {
  ami                    = "ami-04e5276ebb8451442" # Ubuntu 24.04 LTS N.Virginia
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.public_1.id
  vpc_security_group_ids = [aws_security_group.ec2.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name
  key_name               = aws_key_pair.deployer.key_name

  root_block_device {
    volume_size           = 8
    volume_type           = "gp2"
    delete_on_termination = true
  }

  tags = {
    Name = "${var.project_name}-backend"
  }
}
