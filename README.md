# Epicollect5 Data Editor - using React and Redux 
Forked from https://github.com/Aiky30/react-webpack-boilerplate

## Install
```
npm install (--legacy-peer-deps helps here)
```

## Run the development server
```
npm start
```

Navigate in the browser to: http://0.0.0.0:3001/project/{project_slug}/add-entry

## Create distribution files
```
npm run build
```

### Custom config
add `.env` file with
```
REACT_APP_MAPBOX_API_TOKEN=xxxxxxxxxxxxxxx
PRODUCTION_SERVER_URL=https://five.epicollect.net
DEVELOPMENT_SERVER_URL=http://localhost/whatever
```
###

if any cors error 'local' see -> https://stackoverflow.com/questions/66534759/cors-error-on-request-to-localhost-dev-server-from-remote-site

moreover, add a CORS plugin to avoid any errors
https://webextension.org/listing/access-control.html?version=0.3.8&type=install


## Forking

We provide this software as is, under MIT license, for the benefit and use of the community, however we are unable to
provide support for its use or modification.

You are not granted rights or licenses to the trademarks of the CGPS or any party, including without limitation the
Epicollect5 name or logo.
If you fork the project and publish it, please choose another name.