#!/bin/bash
source $HOME/react-GUI/.conf

while true; do
	read -p "Please enter private or public : " network
    if [[ $network == "public" ]]
	then 
		PRIVATE_IP=$(curl http://icanhazip.com)
		break
	elif [[ $network == "private" ]]
	then
		PRIVATE_IP=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1 | head -n 1')
		break
	else
		echo "Only input private or public."
		continue
	fi
done

# for restarting gui
if [[ -z $1 ]];
then
	cd reactapp
	printf "REACT_APP_PRIVATE_IP=$PRIVATE_IP\nREACT_APP_PORT = 8000\n\nREACT_APP_FEED_SHOW = 'true'\nREACT_APP_FEED_FRAME = 5000\n\nREACT_APP_SUFFIX_SHOW = 'true'\n\nREACT_APP_PROVISIONING_DASHBOARD = 'false'\nREACT_APP_ALERT_DASHBOARD = 'true'" > .env
	pm2 delete reactapp
	pm2 save
	rm -r build
	npm run build
	pm2 --name "reactapp" serve --spa build $REACT_PORT
	pm2 save

	# for restarting middleware
	kill -9 $(lsof -t -i:$API_PORT)
	cd $HOME/react-GUI/middleware
	gunicorn -w 4 -k uvicorn.workers.UvicornWorker app:app -b 0.0.0.0:$API_PORT --daemon
else
	echo $PRIVATE_IP
fi