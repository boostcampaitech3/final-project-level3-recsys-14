#!/bin/bash
SERVER_REPOSITORY=/home/ubuntu/server/
cd $SERVER_REPOSITORY

export RECJOON_RDS_HOST=$(aws ssm get-parameters --region ap-northeast-2 --names RECJOON_RDS_HOST --query Parameters[0].Value | sed 's/"//g')
export RECJOON_RDS_PORT=$(aws ssm get-parameters --region ap-northeast-2 --names RECJOON_RDS_PORT --query Parameters[0].Value | sed 's/"//g')
export RECJOON_RDS_USERNAME=$(aws ssm get-parameters --region ap-northeast-2 --names RECJOON_RDS_USERNAME --query Parameters[0].Value | sed 's/"//g')
export RECJOON_RDS_PASSWORD=$(aws ssm get-parameters --region ap-northeast-2 --names RECJOON_RDS_PASSWORD --query Parameters[0].Value | sed 's/"//g')
export RECJOON_RDS_DATABASE=$(aws ssm get-parameters --region ap-northeast-2 --names RECJOON_RDS_DATABASE --query Parameters[0].Value | sed 's/"//g')

export RECJOON_SERVER_HOST=$(aws ssm get-parameters --region ap-northeast-2 --names RECJOON_SERVER_HOST --query Parameters[0].Value | sed 's/"//g')
export RECJOON_SERVER_PORT=$(aws ssm get-parameters --region ap-northeast-2 --names RECJOON_SERVER_PORT --query Parameters[0].Value | sed 's/"//g')

sudo docker-compose down --rmi all
sudo docker-compose up -d --build