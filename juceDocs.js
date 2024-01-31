const vscode = require('vscode');
const fs = require("fs");

function getPickList(context) {
  let path = context.asAbsolutePath("juce-docs/index.json");
  return JSON.parse(fs.readFileSync(path));
}

function showQuickPick(context) {
  console.log(context);
  const quickPick = vscode.window.createQuickPick();
  quickPick.items = getPickList(context);
  quickPick.onDidChangeSelection(selection => {
    if (selection[0]) {
      vscode.env.openExternal(vscode.Uri.parse(selection[0].url));
      quickPick.dispose();
    }
  });
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
}

module.exports = {showQuickPick};
