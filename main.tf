resource "aws_s3_bucket" "main" {
  bucket = "xashy_team_gracebucket"
}

resource "aws_s3_bucket_versioning" "main"{
bucket = aws_s3_bucket.main.id

versioning_configuration {
  status = "Enabled"

  
}

}