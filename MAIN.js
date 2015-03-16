global.MAIN = METHOD({

	run : function() {
		'use strict';
		
		var
		//IMPORT: gui
		gui = require('nw.gui'),
		
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
					boxShadow : 'inset 0 -10px 10px -10px #000'
				},
				c : [A({
					c : IMG({
						style : {
							width : 40,
							height : 40
						},
						src : 'icon/open.png'
					})
				}), A({
					style : {
						marginLeft : 5
					},
					c : IMG({
						style : {
							width : 40,
							height : 40
						},
						src : 'icon/save.png'
					})
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
							gui.Shell.openExternal('https://github.com/Hanul/Markers');
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
		
		preview.getEl().setAttribute('class', 'markdown-body');
		
		aceEditor = ace.edit(editor.getEl());
	    aceEditor.setTheme("ace/theme/twilight");
	    aceEditor.getSession().setMode("ace/mode/markdown");
	    aceEditor.getSession().on('change', function() {
	    	
			if (keydownTimeout !== undefined) {
				clearTimeout(keydownTimeout);
			}
			
			keydownTimeout = setTimeout(function() {
				
				var
				// content
				content = aceEditor.getValue();
				
				if (beforeContent !== content) {
					preview.getEl().innerHTML = marked(content);
					beforeContent = content;
				}
				
				keydownTimeout = undefined;
				
			}, 500);
		});
	}
});
