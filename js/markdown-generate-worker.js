importScripts('marked.js');

self.addEventListener('message', function(e) {
	self.postMessage(marked(e.data));
}, false);