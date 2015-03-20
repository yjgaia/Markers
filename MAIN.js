global.MAIN = METHOD({

	run : function() {
		'use strict';
		
		var
		//IMPORT: gui
		gui = require('nw.gui'),
		
		// markdown generate worker
		markdownGenerateWorker = new Worker('js/markdown-generate-worker.js'),
		
		// origin title
		originTitle = 'Markers :: Markdown Editor',
		
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
		
		// before content
		beforeContent,
		
		// preview
		preview,
		
		// get file name from path.
		getFileNameFromPath = function(path) {
			
			var
			// a
			a = path.lastIndexOf('\\'),
			
			// b
			b = path.lastIndexOf('/');
			
			if (a === -1 && b === -1) {
				return path;
			} else if (b === -1) {
				return path.substring(a + 1);
			} else if (a === -1) {
				return path.substring(b + 1);
			} else if (a > b) {
				return path.substring(a + 1);
			} else {
				return path.substring(b + 1);
			}
		},
		
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
			TITLE(getFileNameFromPath(nowFilePath));
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
							TITLE(getFileNameFromPath(nowFilePath));
							
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
								TITLE(originTitle);
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
			} else {
				TITLE(originTitle);
			}
			
		}, false);
		
		// set extention md.
		saveFileInput.getEl().setAttribute('nwsaveas', '*.md');
		
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
			
			if (beforeContent !== content) {
				markdownGenerateWorker.postMessage(content);
				beforeContent = content;
			}
		});
		
		// open with draw and drop.
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
				
			if ((navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) === true) {
				
				// ctrl + s to save
				if (e.keyCode === 83) {
					save();
					e.preventDefault();
					return false;
			    }
			    
			    // ctrl + w to close
				else if (e.keyCode === 87) {
					gui.Window.get().close();
					e.preventDefault();
					return false;
			    }
			}
		};
		
		// not close when not saved.
		gui.Window.get().on('close', function() {
			if (aceEditor.getValue() === originContent ? true : confirmNotSaved() === true) {
				this.close(true);
			}
		});
		
		// when open with argument
		if (gui.App.argv[0] !== undefined) {
			
			nowFilePath = gui.App.argv[0];
			TITLE(getFileNameFromPath(nowFilePath));
			
			nodeGlobal.READ_FILE(nowFilePath, function(buffer) {
				originContent = buffer.toString();
				aceEditor.setValue(originContent, 1);
			});
		}
	}
});
