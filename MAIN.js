global.MAIN = METHOD({

	run : function() {
		'use strict';
		
		var
		//IMPORT: gui
		gui = require('nw.gui'),
		
		// origin content
		originContent = '',
		
		// now file path
		nowFilePath,
		
		// load file input
		loadFileInput,
		
		// save file input
		saveFileInput,
		
		// editor
		editor,
		
		// ace editor
		aceEditor,
		
		// keydown timeout
		keydownTimeout,
		
		// before content
		beforeContent,
		
		// preview
		preview,
		
		// confirm not saved.
		confirmNotSaved = function() {
			
			return confirm(MSG({
				en : 'Unsaved document will be erased. Do you want to continue?',
				ko : '저장하지 않은 문서는 지워집니다. 계속하시겠습니까?'
			}));
		},
		
		// load file.
		loadFile = function(file) {
			
			var
			// reader
			reader = new FileReader();
			
			reader.onload = function() {
				originContent = reader.result;
				aceEditor.setValue(originContent, 1);
			};
			
			reader.readAsText(file);
			
			nowFilePath = file.path;
		},
		
		// save.
		save = function() {
			
			if (nowFilePath === undefined) {
				saveFileInput.select();
			} else {
				
				originContent = aceEditor.getValue();
				
				nodeGlobal.WRITE_FILE({
					path : nowFilePath,
					content : originContent
				});
			}
		};
		
		DIV({
			c : [
			// load file input
			loadFileInput = INPUT({
				style : {
					display : 'none'
				},
				type : 'file',
				on : {
					change : function() {
						
						if (loadFileInput.getValue() !== '') {
						
							loadFile(loadFileInput.getEl().files[0]);
							
							loadFileInput.setValue('');
						}
					}
				}
			}),
			
			// save file input
			saveFileInput = INPUT({
				style : {
					display : 'none'
				},
				type : 'file',
				on : {
					change : function() {
						
						if (saveFileInput.getValue() !== '') {
						
							nowFilePath = saveFileInput.getValue();
							
							originContent = aceEditor.getValue();
							
							nodeGlobal.WRITE_FILE({
								path : nowFilePath,
								content : originContent
							});
							
							saveFileInput.setValue('');
						}
					}
				}
			}),
			
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
							if (aceEditor.getValue() === originContent ? true : confirmNotSaved() === true) {
								originContent = '';
								nowFilePath = undefined;
								aceEditor.setValue('', 1);
							}
						}
					}
				}), A({
					c : IMG({
						style : {
							width : 40,
							height : 40
						},
						src : 'icon/open.png'
					}),
					on : {
						tap : function() {
							if (aceEditor.getValue() === originContent ? true : confirmNotSaved() === true) {
								loadFileInput.select();
							}
						}
					}
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
					}),
					on : {
						tap : function() {
							save();
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
		
		saveFileInput.getEl().setAttribute('nwsaveas', '*.md');
		
		preview.getEl().setAttribute('class', 'markdown-body');
		
		aceEditor = ace.edit(editor.getEl());
	    aceEditor.setTheme('ace/theme/twilight');
	    aceEditor.getSession().setMode('ace/mode/markdown');
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
		
		global.ondragover = function(e) {
			
			e.preventDefault();
			
			return false;
		};
		
		global.ondrop = function(e) {
			
			if (aceEditor.getValue() === originContent ? true : confirmNotSaved() === true) {
				loadFile(e.dataTransfer.files[0]);
			}
			
			e.preventDefault();
			
			return false;
		};
		
		global.onkeydown = function(e) {
				
			if (e.keyCode === 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) === true) {
				
				save();
			
				e.preventDefault();
				
			    return false;
			}
		};
		
		if (gui.App.argv[0] !== undefined) {
			
			nowFilePath = gui.App.argv[0];
			
			nodeGlobal.READ_FILE(nowFilePath, function(buffer) {
				originContent = buffer.toString();
				aceEditor.setValue(originContent, 1);
			});
		}
	}
});
