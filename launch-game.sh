#!/bin/bash

sudo npm install http-server -g
dir=$(find . -name Typersion/ -type d 2>/dev/null | head -1)

cd $dir
open -a "/Applications/Google Chrome.app" "http://127.0.0.1:8080"

http-server