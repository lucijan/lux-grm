const vscode = require('vscode');

function insertDbgExpr() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const selection = editor.selection;

  if (selection.isEmpty) {
    // Insert DBG_EXPR() at the cursor
    editor.edit(editBuilder => {
      editBuilder.insert(selection.start, 'DBG_EXPR()');
    }).then(() => {
      // Move the cursor between the parentheses
      const newPosition = selection.start.translate(0, 9); // 9 = length of 'DBG_EXPR('
      editor.selection = new vscode.Selection(newPosition, newPosition);
    });
  } else {
    // Wrap selected text
    const selectedText = editor.document.getText(selection);
    editor.edit(editBuilder => {
      editBuilder.replace(selection, `DBG_EXPR(${selectedText})`);
    });
  }

}

module.exports = { insertDbgExpr };
