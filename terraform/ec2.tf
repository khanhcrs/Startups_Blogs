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
