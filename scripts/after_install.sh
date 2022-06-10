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

export RECJOON_RDS_MASTER_HOST=$(aws ssm get-parameters --region ap-northeast-2 --names RECJOON_RDS_MASTER_HOST --query Parameters[0].Value | sed 's/"//g')

#!/bin/bash
DOCKER_APP_NAME=server

EXIST_BLUE=$(docker-compose -p ${DOCKER_APP_NAME}-blue -f docker-compose.blue.yml ps | grep Up)

if [ -z "$EXIST_BLUE" ]; then
    docker-compose -p ${DOCKER_APP_NAME}-blue -f docker-compose.blue.yml pull
    docker-compose -p ${DOCKER_APP_NAME}-blue -f docker-compose.blue.yml up -d

    sleep 10

    docker-compose -p ${DOCKER_APP_NAME}-green -f docker-compose.green.yml down
    docker image prune -af
else
    docker-compose -p ${DOCKER_APP_NAME}-green -f docker-compose.green.yml pull
    docker-compose -p ${DOCKER_APP_NAME}-green -f docker-compose.green.yml up -d

    sleep 10

    docker-compose -p ${DOCKER_APP_NAME}-blue -f docker-compose.blue.yml down
    docker image prune -af
fi

EXIST_PROXY=$(docker-compose -p proxy -f docker-compose.nginx.yml ps | grep Up)

if [ -z "$EXIST_PROXY" ]; then
    docker-compose -p proxy -f docker-compose.nginx.yml up -d
fi