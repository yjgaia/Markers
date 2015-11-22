// load UPPERCASE.JS.
require('./UPPERCASE.JS-COMMON.js');
require('./UPPERCASE.JS-NODE.js');

RUN(function() {
	'use strict';

	var
	// port
	port = 8914;

	INIT_OBJECTS();

	// don't resource caching.
	CONFIG.isDevMode = true;

	RESOURCE_SERVER({
		port : port,
		rootPath : __dirname
	}, function(requestInfo) {
		if (requestInfo.uri === '') {
			requestInfo.uri = 'web/index.html';
		}
	});

	console.log('Markers running. - http://localhost:' + port);
});
