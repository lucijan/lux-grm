const vscode = require('vscode');

function showPopoup(arg) {
  console.log("lux-grm.createClass");
  if (arg === undefined || arg.path == undefined) return;

  console.log(arg.path);

  vscode.window.showInputBox({ prompt: "Class Name" }).then(
    className => {
      if (className == undefined) return;

      console.log("class name: " + className + " in: " + arg.path);
    }
  );

  console.log("going on");
};

module.exports = {showPopoup};
