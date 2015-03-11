global.MAIN = METHOD({

	run : function() {
		'use strict';
		
		var
		// editor
		editor,
		
		// keydown timeout
		keydownTimeout,
		
		// before content
		beforeContent,
		
		// preview
		preview;
		
		DIV({
			c : [DIV({
				style : {
					position : 'fixed',
					left : 0,
					top : 0,
					padding : 10,
					backgroundColor : '#000',
					onDisplayResize : function(width, height) {
						return {
							width : (width - 20) / 2 - 20,
							height : height - 20
						};
					}
				},
				c : editor = TEXTAREA({
					style : {
						border : 'none',
						width : '100%',
						height : '100%',
						backgroundColor : '#000',
						color : '#fff',
						lineHeight : '1.4em'
					},
					on : {
						keyup : function() {
							
							if (keydownTimeout !== undefined) {
								clearTimeout(keydownTimeout);
							}
							
							keydownTimeout = setTimeout(function() {
								
								var
								// content
								content = editor.getValue();
								
								if (beforeContent !== content) {
									preview.getEl().innerHTML = marked(content);
									beforeContent = content;
								}
								
								keydownTimeout = undefined;
								
							}, 500);
						}
					}
				})
			}), DIV({
				style : {
					flt : 'right',
					width : '50%'
				},
				c : preview = DIV({
					style : {
						padding : 10
					}
				})
			}), CLEAR_BOTH()]
		}).appendTo(BODY);
		
		preview.getEl().setAttribute('class', 'markdown-body');
	}
});
