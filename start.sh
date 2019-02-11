#!/usr/bin/env bash

# production/development mode
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

# package
electronBuild() { 
    if [ $1 = 'windows' ]; then
        rm -rf "dist/$(getProductName)-win32-x64"
        electron-packager . $(getProductName) \
        --icon res/icon.ico \
        --prune true \
        --ignore screenshots \
        --platform win32 \
        --arch x64 \
        --out dist
    elif [ $1 = 'mac' ]; then
        rm -rf "dist/$(getProductName)-darwin-x64"
        electron-packager . $(getProductName) \
        --icon res/icon.icns \
        --prune true \
        --ignore screenshots \
        --platform darwin \
        --arch x64 \
        --out dist
    elif [ $1 = 'ubuntu' ]; then
        rm -rf "dist/$(getProductName)-linux-x64"
        electron-packager . $(getProductName) \
        --icon res/icon.ico \
        --prune true \
        --ignore screenshots \
        --platform linux \
        --arch x64 \
        --out dist
    fi
 }

# create Squirrel installer
 electronSetup() {
     if [ $1 = 'windows' ]; then
        electron-installer-windows \
        --src "dist/$(getProductName)-win32-x64"  \
        --config setup.json
     elif [ $1 = 'mac' ]; then
        electron-installer-dmg "./dist/$(getProductName)-darwin-x64/$(getProductName).app" $(getProductName) \
        --out="dist/setup" \
        --icon=res/icon.ico \
        --overwrite \
        --background=res/dmg.png
     elif [ $1 = 'ubuntu' ]; then
        electron-installer-debian \
        --src "dist/$(getProductName)-linux-x64" \
        --arch amd64 \
        --config setup.json
     fi
 }

 getProductName() {
     local pkgname=$(sed '/\"productName\"/!d;s/[\"|,|\ ]//g;s/.*://g' package.json)
     [ "x${pkgname}" = "x" ] && pkgname="Noname"

     echo $pkgname
 }

 # main 
case "$1" in 
    "--dev") start development;;
    "--electron-build-windows") electronBuild windows;;
    "--electron-build-mac") electronBuild mac;;
    "--electron-build-ubuntu") electronBuild ubuntu;;
    "--electron-setup-windows") electronSetup windows;;
    "--electron-setup-mac") electronSetup mac;;
    "--electron-setup-ubuntu") electronSetup ubuntu;;
    "--build-windows") [ -d build ] || build
                           electronBuild windows && \
                           electronSetup windows ;;
    "--build-mac") [ -d build ] || build
                           electronBuild mac && \
                           electronSetup mac ;;
    "--build-ubuntu") [ -d build ] || build
                           electronBuild ubuntu && \
                           electronSetup ubuntu ;;
    *) [ -d build ] || build; start production;;
esac