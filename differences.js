#!/usr/bin/env node
var Dockerode = require('dockerode'),
    Q = require('q'),
    docker = new Dockerode({socketPath: '/var/run/docker.sock'});

// docker.run(run --rm -it --name=phantom -v $PWD:/scripts/ cmfatih/phantomjs /usr/bin/phantomjs /scripts/netlog.js $1 1024
var resultSets = {
    1024: Q.defer(),
    900: Q.defer(),
    500: Q.defer(),
    320: Q.defer()
}

for (var i in resultSets) {
    (function (i) {
        docker.createContainer(
            {
                Image: 'cmfatih/phantomjs',
                Cmd: ['/usr/bin/phantomjs', '/scripts/netlog.js', process.argv[2], "1024", ""+i],
                Volumes: {"/scripts": {}},
            }, function (err, container) {
                container.attach({stream: true, logs: true, stdout: true, stderr: true}, function (err, stream) {
                    var result = null;

                    container.start({
                        Binds: ["/home/josh/workspace/iplayer-image-size:/scripts"]
                    }, function (err, data) {
                            console.log('Container Started', i)
                        }
                    )

                    // stream.pipe(process.stdout)
                    stream.setEncoding('utf-8')

                    stream.on('data', function (data) {
                        result = data;
                        // console.log('got data from',i)
                    });

                    stream.on('end', function () {
                        // console.log('resolving',i)
                        resultSets[i].resolve(result);
                    });
                })
            }
        );
    })(i)
}

Q.all([resultSets[1024].promise, resultSets[900].promise, resultSets[500].promise, resultSets[320].promise]).done(function (data) {
    var pids = {}

    for (i in data) {
        resultLoc = data[i].indexOf('results:');

        parsed = JSON.parse(data[i].substr(resultLoc + 8))

        console.log('Total size for',parsed.viewportSize.width + ':', (parsed.size / 1024) + 'kb')
        parsed.pids.forEach(function (info, j) {
            if (pids[info.pid] === undefined) {
                pids[info.pid] = {};
            }
            pids[info.pid][i] = info
        })
    }

    for (i in pids) {
        different = false;
        size = pids[i]["0"].size;
        for (j in pids[i]) {
            if (size !== pids[i][j].size) {
                different = true;
            }
        }
        if (different) {
            console.log(i,'is different!',JSON.stringify(pids[i], null, 4));
        }
    }
})

// var test1 = process.argv[2];
// var test2 = process.argv[3];

// var testing1 = JSON.parse(test1);
// var testing2 = JSON.parse(test2);

// console.log(testing1)
