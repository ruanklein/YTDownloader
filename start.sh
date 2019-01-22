#!/usr/bin/env bash

# for production/development mode
start() {
    ELECTRON_DISABLE_SECURITY_WARNINGS=true
    NODE_ENV="$1"
    BROWSER=none

    export ELECTRON_DISABLE_SECURITY_WARNINGS NODE_ENV BROWSER

    node node_modules/react-scripts/scripts/start.js &>react.log &
    trap "kill -9 $!" EXIT

    sleep 5
    electron .
}

# compile react scripts to static javascript
build() { 
    rm -rf build
    react-scripts build
}

# package to windows
electronBuild() { 
    rm -rf dist
    local pkgname=$(sed '/\"pkgname\"/!d;s/[\"|,|\ ]//g;s/.*://g' package.json)

    [ "x${pkgname}" = "x" ] && pkgname="Noname"

    electron-packager . ${pkgname} \
    --icon res/icon.ico \
    --asar \
    --platform win32 \
    --arch x64 \
    --out dist
 }

# create Squirrel installer
 electronSetup() {
     electron-installer-windows --config setup.json
 }

 # main 
case "$1" in 
    "--dev") start development;;
    "--build") build;;
    "--electron-build") electronBuild;;
    "--electron-setup") electronSetup;;
    "--build-all") build && electronBuild && electronSetup ;;
    *) start production;;
esac