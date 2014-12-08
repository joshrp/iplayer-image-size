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
	size: 0
    }

    page.onResourceReceived = function (res) {
	if (res.url.match(/^http:\/\/ichef\.bbci\.co\.uk\/images/gi) && res.stage === 'start') {
		total.size += res.bodySize;
		total.count++;
        	//console.log('received: ',res.bodySize,'-',res.url);
	}
    };

    page.open(address, function (status) {
        if (status !== 'success') {
            console.log('FAIL to load the address');
        } 
	
	setTimeout(function() {
		console.log(total.count,'requests for ichef images totaling',total.size/1024 + 'kB at',page.viewportSize.width+'x'+page.viewportSize.height);
		phantom.exit();
    	}, 2000);
    });
}
