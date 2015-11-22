global.MAIN = METHOD({

	run : function() {
		'use strict';
		
		var
		// markdown generate worker
		markdownGenerateWorker = new Worker('js/markdown-generate-worker.js'),
		
		// origin title
		originTitle = 'Markers for Web',
		
		// editor
		editor,
		
		// ace editor
		aceEditor,
		
		// keydown timeout
		keydownTimeout,
		
		// before content
		beforeContent,
		
		// preview
		preview;
		
		DIV({
			c : [
			// menu
			DIV({
				style : {
					position : 'fixed',
					left : 0,
					top : 0,
					padding : 5,
					width : '100%',
					height : 40,
					backgroundColor : '#AB1A2D',
					boxShadow : 'inset 0 -10px 10px -10px #000',
					zIndex : 999
				},
				c : [A({
					c : IMG({
						style : {
							width : 40,
							height : 40
						},
						src : 'icon/new.png'
					}),
					on : {
						tap : function() {
							open(location.href);
						}
					}
				}), A({
					style : {
						position : 'fixed',
						right : 0,
						top : 0
					},
					c : IMG({
						style : {
							width : 50,
							height : 50
						},
						src : 'icon/github.png'
					}),
					on : {
						tap : function() {
							window.open('https://github.com/Hanul/Markers');
						}
					}
				})]
			}),
			
			// editor
			editor = DIV({
				style : {
					position : 'fixed',
					left : 0,
					top : 50,
					width : '50%',
					onDisplayResize : function(width, height) {
						return {
							height : height - 50
						};
					}
				}
			}),
			
			// preview
			DIV({
				style : {
					paddingTop : 50,
					paddingBottom : 300,
					flt : 'right',
					width : '50%'
				},
				c : preview = DIV({
					style : {
						padding : 10,
						fontSize : 14
					}
				})
			}), CLEAR_BOTH()]
		}).appendTo(BODY);
		
		// change preview.
		markdownGenerateWorker.addEventListener('message', function(e) {
			
			var
			// title el
			titleEl;
			
			// set preview.
			preview.getEl().innerHTML = e.data;
			
			titleEl = preview.getEl().getElementsByTagName('h1')[0];
			
			// set title.
			if (titleEl !== undefined) {
				TITLE(titleEl.innerText);
			}
			
		}, false);
		
		// set style.
		preview.getEl().setAttribute('class', 'markdown-body');
		
		// create ace editor.
		aceEditor = ace.edit(editor.getEl());
		aceEditor.setTheme('ace/theme/twilight');
		aceEditor.getSession().setMode('ace/mode/markdown');
		aceEditor.getSession().setUseWrapMode(true);
		aceEditor.renderer.setScrollMargin(0, 300);
		aceEditor.getSession().on('change', function() {
				
			var
			// content
			content = aceEditor.getValue();
			
			if (keydownTimeout !== undefined) {
				clearTimeout(keydownTimeout);
			}
			
			keydownTimeout = setTimeout(function() {
				
				if (beforeContent !== content) {
					markdownGenerateWorker.postMessage(content);
					beforeContent = content;
				}
				
				keydownTimeout = undefined;
				
			}, 500);
		});
		aceEditor.commands.addCommand({
			name : 'replace2',
			bindKey : {
				win : 'Ctrl-R',
				mac : 'Command-Option-F'
			},
			exec : function(editor) {
				
				require('ace/config').loadModule('ace/ext/searchbox', function(e) {
					 
					 e.Search(editor, true);
					 
					 // take care of keybinding inside searchbox		   
					 // this is too hacky :(	 
					 
					 var
					 // kb
					 kb = editor.searchBox.$searchBarKb,
					 
					 // command
					 command = kb.commands['Ctrl-f|Command-f|Ctrl-H|Command-Option-F'];
					 
					 if (command.bindKey.indexOf('Ctrl-R') === -1) {
						 command.bindKey += '|Ctrl-R';
						 kb.addCommand(command);
					 }
				 });
			}
		});
		
		aceEditor.focus();
	}
});
