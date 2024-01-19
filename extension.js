// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let disposable = vscode.commands.registerCommand('lux-grm.insertDebugInclude', function () {
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;

		const document = editor.document;
		var text = document.getText();

		var insertLineIndex = -1;

		for(var lineIndex = document.lineCount - 1; lineIndex != 0; lineIndex--) {
			const line = document.lineAt(lineIndex);
			if (line.text.startsWith("#include")) {
				insertLineIndex = lineIndex + 1;
				break;
			}
		}

		if (insertLineIndex == -1) {
			vscode.window.showWarningMessage('No includes found!');
			return;
		}

		console.log(text);
		editor.edit(editBuilder => {
			const pos = new vscode.Position(insertLineIndex, 0);

			if (document.fileName.includes("juce_grm")) {
				editBuilder.insert(pos, "\n#include \"debug.h\"\n");
			} else {
				editBuilder.insert(pos, "\n#include \"juce_grm/debug.h\"\n");
			}
		});
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
