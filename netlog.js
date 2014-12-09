var page = require('webpage').create(),
    system = require('system'),
    address;

if (system.args.length === 1) {
    console.log('Usage: netlog.js <some URL>');
    phantom.exit(1);
} else {
    address = system.args[1];

    page.viewportSize = {
        width: system.args[2],
        height: 800
    };
    results = {
        count: 0,
        size: 0,
        pids: [],
        url: address,
        viewportSize: page.viewportSize
    };

    page.onResourceReceived = function (res) {
        var matcher = /^http:\/\/ichef\.bbci\.co\.uk\/images\/ic\/(\d+x(?:\d+|n))\/(.*?).jpg/gi;
        if (res.url.match(/^http:\/\/ichef\.bbci\.co\.uk\/images/gi) && res.stage === 'start') {
            info = {};
            for (i in res.headers) {
                if (res.headers[i].name === 'Last-Modified') {
                    info.modified = res.headers[i].value;
                }
            }
            var regexer = matcher.exec(res.url);
            info.pid = regexer[2];
            info.dimen = regexer[1];
            info.size = parseInt(res.bodySize, 10);
            results.size += info.size;
            results.count++;

            results.pids.push(info);
        }
    };

    page.open(address, function (status) {
        if (status !== 'success') {
            console.log('FAIL to load the address');
        }

    setTimeout(function() {
            page.render('/scripts/'+ system.args[3] + '.png');
            console.log('results:' + JSON.stringify(results));
            phantom.exit();
        }, 4000);
    });
}
