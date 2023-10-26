# Quick Cards

Firefox extension that replaces the shortcuts page with more customizable page.

## Vue 3 project Setup/Run/Build

### Requirements
 + Node.js (version 18.0 or newer)

### Setup and run of the application (extension)
1. install packages by `npm install`
2. npm run dev  
    + if the address cannot be accessed from brower there is need to remove the `--host 0.0.0.0 --port 8080` from package.json in the scripts dev option (the options are for use from docker container)
3. Now the extension should run in browser (there may be error as the 'browser' object is not recognized thanks to the Vite host)

### Building of the application (extension)
1. install packages by `npm install`
2. npm run build
3. now all the files can be seen in the `dist` folder  