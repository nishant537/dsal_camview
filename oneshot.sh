#!/bin/bash
source $HOME/common_files/.env

# installing python middleware
# cd ..
cd $HOME/react-GUI/reactapp
cp $REACT_APP_LOGO_PATH /root/react-GUI/reactapp/public/deepsight_logo.png
cp $REACT_APP_BACKGROUND_PATH /root/react-GUI/reactapp/public/background.jpg
npm install --force
npm install pm2 -g
npm run build
pm2 startup
sudo env PATH=$PATH:$HOME/.nvm/versions/node/v18.9.1/bin $HOME/.nvm/versions/node/v18.9.1/lib/node_modules/pm2/bin/pm2 >pm2 delete reactapp
pm2 --name "reactapp" serve --spa build 3000
pm2 save
echo "React-GUI Dashboard running on http://0.0.0.0:3000"

cd $HOME/react-GUI/middleware
sudo apt-get install -y python3-venv
python3.7 -m venv env
source env/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn

# kill any service running on port 8000 so it can be used by uvicorn
sudo apt-get install -y lsof
kill -9 $(lsof -t -i:8000)
gunicorn -k uvicorn.workers.UvicornWorker app:app -b 0.0.0.0:8000 --workers 17 --daemon
echo "FastAPI middleware running on http://0.0.0.0:8000"

# SET CRONTAB FOR 2AM everyday.
echo "*/2 * * * * /bin/bash /root/react-GUI/cron_gui.sh" >> mycron
#install new cron file
crontab mycron
rm mycron
echo "Crontab is set to restart dashboard at 2:00AM everyday"
