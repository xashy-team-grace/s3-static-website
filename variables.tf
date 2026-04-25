variable "region" {
    description = "primary region to deploy resources"
    type = string
}


variable "bucket_name" {
    description = "name of s3 bucket"
    type = string
    default = "xashy_team_gracebucket"
  
}


variable "enviroment" {
    description = "deployment environment (dev,staging,prod)"
    type = string
    default = "dev"
  
}

variable "owner" {
    description = "Owner of the resources"
    type = string
  
}