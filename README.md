:lipstick: skyway-sample :lipstick:
===============

## Overview

skyway sample

## Tools

* ES6
* gulp
* browserify

## Getting Started

set up the necessary files.

    npm i
    bower i
    
and

run a gulp

    npm run local
    
if you want to release build.

    npm run product

## Port 4567 is unavailable error.

Port 4567 is unavailable.

    lsof -i -P | grep 4567

    kill -9 <pid>

## Directory Structure

    ├── build
    │   └── build files
    ├── gulp
    │   └── tasks
    ├── node_modules
    └── source
        ├── images
        ├── javascripts
        └── stylesheets

## Author

[hisasann](https://github.com/hisasann)

:arrow_up: enjoy! :arrow_up:
