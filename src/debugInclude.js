const vscode = require('vscode');

function addInclude() {
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
}

module.exports = {addInclude};
