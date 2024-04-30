#! /usr/bin/bash

ROOT=`pwd`

source .env

yarn

yarn build

cp package.json dist
cp .npmrc dist

cd $ROOT/dist
yarn link