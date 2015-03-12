global.MAIN = METHOD({

	run : function() {
		'use strict';
		
		var
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
			c : [editor = DIV({
				style : {
					position : 'fixed',
					left : 0,
					top : 0,
					width : '50%',
					height : '100%'
				}
			}), DIV({
				style : {
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
