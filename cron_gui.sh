#!/bin/bash
source $HOME/camview/.conf

frontend_status=$(ss -tulpn | grep :$REACT_PORT)
middleware_status=$(ss -tulpn | grep :$API_PORT)

sleep 120
if [[ -z $frontend_status ]] || [[ -z $middleware_status ]] || [[ ! -z $1 ]];
then 
	# Restarting Frontend
	cd $HOME/camview/reactapp
	PATH=$PATH:$HOME/.nvm/versions/node/v18.9.1/bin
	rm -r build
 	npm run build
	$HOME/.nvm/versions/node/v18.9.1/lib/node_modules/pm2/bin/pm2 delete reactapp
	$HOME/.nvm/versions/node/v18.9.1/lib/node_modules/pm2/bin/pm2 --name "reactapp" serve --spa build $REACT_PORT
	$HOME/.nvm/versions/node/v18.9.1/lib/node_modules/pm2/bin/pm2 save
	echo "React Frontend running on http://0.0.0.0:$REACT_PORT"

	# Restarting Middleware
	cd $HOME/camview/middleware
	source env/bin/activate
	kill -9 $(lsof -t -i:$API_PORT)
	gunicorn -k uvicorn.workers.UvicornWorker app:app -b 0.0.0.0:8000 --timeout 80 --daemon
	echo "FastAPI middleware running on http://0.0.0.0:$API_PORT\n\n"
else
	echo "passing off\n\n"
fi
