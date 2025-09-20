resource "aws_db_subnet_group" "main" {
  name       = "${var.name_prefix}-db-subnet-group"
  subnet_ids = var.private_subnet_ids
  
  tags = merge(var.tags, {
    Name = "${var.name_prefix}-db-subnet-group"
  })
}

resource "random_password" "db_password" {
  length  = 16
  special = true
}

resource "aws_secretsmanager_secret" "db_credentials" {
  name                    = "${var.name_prefix}-db-credentials"
  description            = "Database credentials"
  recovery_window_in_days = 7
  
  tags = var.tags
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    username = var.db_username
    password = random_password.db_password.result
  })
}

resource "aws_rds_cluster_parameter_group" "main" {
  family = "aurora-postgresql15"
  name   = "${var.name_prefix}-cluster-pg"
  
  parameter {
    name  = "log_statement"
    value = "all"
  }
  
  parameter {
    name  = "log_min_duration_statement"
    value = "1000"
  }
  
  tags = var.tags
}

resource "aws_rds_cluster" "main" {
  cluster_identifier              = "${var.name_prefix}-aurora-cluster"
  engine                         = "aurora-postgresql"
  engine_mode                    = "provisioned"
  engine_version                 = "15.4"
  database_name                  = var.db_name
  master_username                = var.db_username
  manage_master_user_password    = false
  master_password                = random_password.db_password.result
  
  backup_retention_period        = 7
  preferred_backup_window       = "07:00-09:00"
  preferred_maintenance_window  = "sun:09:00-sun:10:00"
  
  db_cluster_parameter_group_name = aws_rds_cluster_parameter_group.main.name
  db_subnet_group_name           = aws_db_subnet_group.main.name
  vpc_security_group_ids         = [var.database_security_group_id]
  
  storage_encrypted              = true
  deletion_protection           = var.environment == "prod" ? true : false
  skip_final_snapshot           = var.environment == "prod" ? false : true
  final_snapshot_identifier     = var.environment == "prod" ? "${var.name_prefix}-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}" : null
  
  serverlessv2_scaling_configuration {
    max_capacity = var.environment == "prod" ? 16 : 2
    min_capacity = 0.5
  }
  
  enabled_cloudwatch_logs_exports = ["postgresql"]
  
  tags = merge(var.tags, {
    Name = "${var.name_prefix}-aurora-cluster"
  })
  
  depends_on = [aws_secretsmanager_secret_version.db_credentials]
}

resource "aws_rds_cluster_instance" "main" {
  count = 2
  
  identifier                   = "${var.name_prefix}-aurora-instance-${count.index + 1}"
  cluster_identifier          = aws_rds_cluster.main.id
  instance_class              = "db.serverless"
  engine                      = aws_rds_cluster.main.engine
  engine_version              = aws_rds_cluster.main.engine_version
  
  publicly_accessible        = false
  auto_minor_version_upgrade  = true
  
  performance_insights_enabled = true
  monitoring_interval         = 60
  monitoring_role_arn        = aws_iam_role.rds_enhanced_monitoring.arn
  
  tags = merge(var.tags, {
    Name = "${var.name_prefix}-aurora-instance-${count.index + 1}"
  })
}

resource "aws_iam_role" "rds_enhanced_monitoring" {
  name = "${var.name_prefix}-rds-monitoring-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "monitoring.rds.amazonaws.com"
        }
      },
    ]
  })

  tags = var.tags
}

resource "aws_iam_role_policy_attachment" "rds_enhanced_monitoring" {
  role       = aws_iam_role.rds_enhanced_monitoring.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}