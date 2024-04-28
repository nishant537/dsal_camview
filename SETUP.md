
# Setup for general dashboard

The RPI dashboard is a config controlled dashboard i.e features to be added, features to be displayed, user management access, dashboard metadata (logos/images) is configurable from settings file.

1. Change the whitelabel logo / Background image.
```
- upload logo as /react-GUI/reactapp/public/deepsight_logo.png to change dashboard's logo
- upload background image as /react-GUI/reactapp/public/background.jpg to change dashboard's background image on login screen
```

2. Add/Remove Camera Provisioning Fields.
```
In react-GUI/reactapp/.env - alter the JSON value for 
**REACT_APP_PROVISIONING_FIELDS** to add/remove input fields 
to be used to provision a camera (Eg - Camera Name, RTSP Link, SIA Suffix...etc)

- Copy value for REACT_APP_PROVISIONING_FIELDS, use https://jsonlint.com/ to prettify the json
- the keys of dictionary represent the provisioning fields, the value corresponds to name shown for that field - if the field is required or not - default value for field etc.
- To add a new field, copy the existing key value pair and change name for the key along with values, use https://www.text-utils.com/remove-extra-spaces/ to minify the prettified json and paste the minified version in .env
```

3. Add/Remove AI feature to be provisioned from the dashboard.
```
In react-GUI/reactapp/.env - alter the JSON value for 
**REACT_APP_FEATURE_JSON** to add/remove AI features that can be provisioned.

- Copy value for REACT_APP_FEATURE_JSON, use https://jsonlint.com/ to prettify the json
- The keys of dictionary represent the feature name, the value corresponds to name shown for that feature - provisioning parameters for the feature inside an array - further the parameter json has configurable values for the parameter like the default value/user alterable or not etc.
- To add a new field, copy the existing key value pair and change name for the key along with values, use https://www.text-utils.com/remove-extra-spaces/ to minify the prettified json and paste the minified version in .env
```

4. Alter the alter display for any particular feature that is added to dashboard for provisioning
```
In react-GUI/reactapp/.env - alter the JSON value for 
**REACT_APP_ALERT_JSON** to enable/disable AI feature cards 
in AI dashboard and alter table columns to show when clicked on that feature card.

- Copy value for REACT_APP_FEATURE_ALERTS, use https://jsonlint.com/ to prettify the json
- The keys of dictionary represent the feature card to be shown on alert dashboard, the value corresponds to table columns when clicked on a particular feature. To add a new field, copy the existing key value pair and change name for the key along with values.
- To add a new card use https://www.text-utils.com/remove-extra-spaces/ to minify the prettified json and paste the minified version in .env
```

5. Enable/Disable Video Show feature for an alert.
```
In react-GUI/reactapp/.env - set the **REACT_APP_ALERT_VIDEO** 
variable as false to hide the video toggle button from alert dashboard.

- To disable the video toggle option from alert dashboard set REACT_APP_ALERT_VIDEO as "false".
![image](https://github.com/DeepSightAILabs/react-GUI/assets/56720822/79c840c7-74ab-4557-9cff-4350883f74b8)
```
