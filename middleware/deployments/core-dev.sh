#! /bin/bash
sudo rm -rf /var/www/core
cd /var/www && git clone git@gitlab.com:edgevana/portal/core.git && cd core
mv ~/.secure_files/.env.dev .env
git checkout main
docker cp . core_core_svc_1:/app
docker-compose up --build -d
rm -rf ~/.secure_files
