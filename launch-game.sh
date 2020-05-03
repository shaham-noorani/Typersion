#!/bin/bash

python -m http.server
open -a "/Applications/Google Chrome.app" "http://0.0.0.0:8000/"