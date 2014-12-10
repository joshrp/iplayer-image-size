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
    total = {
        count: 0,
        size: 0,
        pids: []
    };

    page.onResourceReceived = function (res) {
        var matcher = /^http:\/\/ichef\.bbci\.co\.uk\/images\/ic\/(\d+x(?:\d+|n))\/(.*?).jpg/gi;
    if (res.url.match(/^http:\/\/ichef\.bbci\.co\.uk\/images/gi) && res.stage === 'start') {
        var regexer = matcher.exec(res.url);
        total.size += res.bodySize;
        total.count++;
        info = {};
        for (i in res.headers) {
            if (res.headers[i].name === 'Last-Modified') {
                info.modified = res.headers[i].value;    
            }
            // if (res.headers[i].name === 'Server') {
            //     info.server = res.headers[i].value;
            // }
        }
        info.pid = regexer[2];
        info.size = res.bodySize;
        
        total.pids.push(info);
        // console.log(res.url, res.bodySize);

    }
    };

    page.open(address, function (status) {
        if (status !== 'success') {
            console.log('FAIL to load the address');
        } 
    
    setTimeout(function() {
        // console.log(total.count, 'requests for ichef images totaling',total.size/1024 + 'kB at',page.viewportSize.width+'x'+page.viewportSize.height);
  //       console.log(total.pids.sort().join('\n'), );
            console.log(JSON.stringify(total.pids));
            phantom.exit();
        }, 2000);
    });
}
