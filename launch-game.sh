#!/bin/bash

dir=$(find . -name Typersion/ -type d 2>/dev/null | head -1)

cd $dir
open -a "/Applications/Google Chrome.app" "http://0.0.0.0:8000/"
python3 -m http.server