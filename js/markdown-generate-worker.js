window = self;

importScripts('marked.js');
importScripts('highlight.js');

// Synchronous highlighting with highlight.js
marked.setOptions({
	highlight : function (code) {
		return hljs.highlightAuto(code).value;
	}
});

self.addEventListener('message', function(e) {
	self.postMessage(marked(e.data));
}, false);