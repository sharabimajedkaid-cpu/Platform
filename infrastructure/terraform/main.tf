terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
    kubernetes = { source = "hashicorp/kubernetes", version = "~> 2.25" }
    helm = { source = "hashicorp/helm", version = "~> 2.12" }
  }
  backend "s3" {
    bucket = "britishce44-terraform-state"
    key    = "production/terraform.tfstate"
    region = "eu-west-1"
  }
}

provider "aws" {
  region = var.aws_region
}

provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    command     = "aws"
    args        = ["eks", "get-token", "--cluster-name", module.eks.cluster_name]
  }
}

provider "helm" {
  kubernetes {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
    exec {
      api_version = "client.authentication.k8s.io/v1beta1"
      command     = "aws"
      args        = ["eks", "get-token", "--cluster-name", module.eks.cluster_name]
    }
  }
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "britishce44-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["${var.aws_region}a", "${var.aws_region}b", "${var.aws_region}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway   = true
  enable_dns_hostnames = true
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = "britishce44-cluster"
  cluster_version = "1.28"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    main = {
      desired_size = 3
      min_size     = 3
      max_size     = 10
      instance_types = ["t3.medium", "t3.large"]
    }
    media = {
      desired_size    = 2
      min_size        = 2
      max_size        = 8
      instance_types  = ["c5.large", "c5.xlarge"]
      labels = { role = "media" }
    }
  }
}

resource "aws_db_instance" "postgres" {
  identifier        = "britishce44-postgres"
  engine            = "postgres"
  engine_version    = "16.3"
  instance_class    = "db.t3.medium"
  allocated_storage = 100
  db_name           = "britishce44"
  username          = "postgres"
  password          = var.db_password
  skip_final_snapshot = false
  backup_retention_period = 30
  multi_az          = true
  vpc_security_group_ids = [aws_security_group.database.id]
  db_subnet_group_name = aws_db_subnet_group.main.name
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "britishce44-redis"
  engine               = "redis"
  node_type            = "cache.t3.medium"
  num_cache_nodes      = 2
  parameter_group_name = "default.redis7"
  subnet_group_name    = aws_elasticache_subnet_group.main.name
}

resource "aws_s3_bucket" "storage" {
  bucket = "britishce44-storage"
  acl    = "private"
  versioning { enabled = true }
  lifecycle_rule {
    enabled = true
    expiration { days = 365 }
  }
}

resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = aws_s3_bucket.storage.bucket_regional_domain_name
    origin_id   = "britishce44-storage"
  }
  enabled             = true
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "britishce44-storage"
    viewer_protocol_policy = "redirect-to-https"
  }
  price_class = "PriceClass_100"
  restrictions { geo_restriction { restriction_type = "none" } }
  viewer_certificate { cloudfront_default_certificate = true }
}

resource "aws_security_group" "database" {
  name   = "britishce44-database-sg"
  vpc_id = module.vpc.vpc_id
  ingress {
    from_port = 5432
    to_port   = 5432
    protocol  = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }
}

resource "aws_db_subnet_group" "main" {
  name       = "britishce44-db-subnet"
  subnet_ids = module.vpc.private_subnets
}

resource "aws_elasticache_subnet_group" "main" {
  name       = "britishce44-redis-subnet"
  subnet_ids = module.vpc.private_subnets
}

variable "aws_region" {
  description = "AWS region"
  default     = "eu-west-1"
}

variable "db_password" {
  description = "PostgreSQL password"
  sensitive   = true
}

output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "postgres_endpoint" {
  value = aws_db_instance.postgres.endpoint
}

output "redis_endpoint" {
  value = aws_elasticache_cluster.redis.cache_nodes[0].address
}

output "cloudfront_domain" {
  value = aws_cloudfront_distribution.cdn.domain_name
}
