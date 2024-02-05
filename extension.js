// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const juceDocs = require('./src/juceDocs');
const debugInclude = require('./src/debugInclude');
const createClass = require('./src/createClass');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	context.subscriptions.push(vscode.commands.registerCommand('lux-grm.insertDebugInclude',
		debugInclude.addInclude));

	context.subscriptions.push(vscode.commands.registerCommand('lux-grm.browseJuceDocs',
		function () { juceDocs.showQuickPick(context); }));

	context.subscriptions.push(vscode.commands.registerCommand('lux-grm.createClass',
		function (arg) { createClass.showPopoup(context, arg);	}));
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
