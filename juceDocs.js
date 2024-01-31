const vscode = require('vscode');
const fs = require("fs");

function getPickList(context) {
  let path = context.asAbsolutePath("juce-docs/index.json");
  return JSON.parse(fs.readFileSync(path));
}

module.exports = {getPickList};
