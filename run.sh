#!/bin/bash

sudo docker run --rm -it --name=phantom -v $PWD:/scripts/ cmfatih/phantomjs /usr/bin/phantomjs /scripts/netlog.js http://bbc.co.uk$1 1024

sudo docker run --rm -it --name=phantom -v $PWD:/scripts/ cmfatih/phantomjs /usr/bin/phantomjs /scripts/netlog.js http://bbc.co.uk$1 600

sudo docker run --rm -it --name=phantom -v $PWD:/scripts/ cmfatih/phantomjs /usr/bin/phantomjs /scripts/netlog.js http://bbc.co.uk$1 400
