#!/bin/bash

test1=$(docker run --rm -it --name=phantom -v $PWD:/scripts/ cmfatih/phantomjs /usr/bin/phantomjs /scripts/netlog.js $1 1024)

test2=$(docker run --rm -it --name=phantom -v $PWD:/scripts/ cmfatih/phantomjs /usr/bin/phantomjs /scripts/netlog.js $1 1024)

node ./process.js "$test1" "$test2"

#docker run --rm -it --name=phantom -v $PWD:/scripts/ cmfatih/phantomjs /usr/bin/phantomjs /scripts/netlog.js $1 600

#docker run --rm -it --name=phantom -v $PWD:/scripts/ cmfatih/phantomjs /usr/bin/phantomjs /scripts/netlog.js $1 400
