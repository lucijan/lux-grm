const vscode = require('vscode');
const path = require('node:path');
const liquid = require('liquid');
const fs = require("fs");
const cp = require('child_process');

const grmNamespace = ['libgrm', 'juce_grm', 'common'];

function findRoot(cwd) {
  if (fs.existsSync(path.join(cwd, ".git"))) return cwd;

  var parent = path.parse(cwd).dir;
  if (parent == "/") throw "not found!";

  return findRoot(parent);
}

function camelToSnakeCase(str) {
  return str.split(/(?=[A-Z])/).join('_').toLowerCase();
}

async function parseTargets(cmakeFile) {
  if (!fs.existsSync(cmakeFile)) return [];

  const fh = await fs.promises.open(cmakeFile);
  var lineNo = 0;
  var targets = new Array();
  var currentTarget = undefined;

  for await (const line of fh.readLines()) {
    const tokens = line.trim().split(/[ \(]/);
    if (tokens.length >= 2 &&
      (tokens[0] == 'target_sources' || tokens[0] == 'add_library')) {
      // don't attempt to append to empty add_library
      if (!tokens[1].endsWith(')')) currentTarget = {name: tokens[1]};
    }

    if (currentTarget && tokens[0] == ')') {
      currentTarget['lastLine'] = lineNo;
      targets.push(currentTarget);
      currentTarget = undefined;
    }

    lineNo++;
  }

  return targets;
}

async function renderTemplate(templatePath, fields) {
  const template = String(fs.readFileSync(templatePath));
  const engine = new liquid.Engine();
  return await engine.parseAndRender(template, fields);
}

async function showPopoup(context, arg) {
  console.log("lux-grm.createClass");
  if (arg === undefined || arg.path == undefined) return;

  const targets = await parseTargets(path.join(arg.path, "CMakeLists.txt"));
  if (targets.length < 1) {
    vscode.window.showErrorMessage('No suitable targets found!');
    return;
  }

  var className = await vscode.window.showInputBox({
    placeHolder: "ClassName",
    prompt: "Add .h to generate header only",
  });
  if (className == undefined) return;

  console.log("class name: " + className + " in: " + arg.path);
  let targetDir = path.parse(arg.path);
  var generateCpp = true;
  if (className.endsWith('.h')) {
    generateCpp = false;
    className = className.replace('.h', '');
  }

  var root = findRoot(String(arg.path));
  let fileName = camelToSnakeCase(className);

  let fields = {
    namespace: grmNamespace.includes(targetDir.name) ? 'grm' : targetDir.name,
    className: className,
    fileName: fileName,
    name: String(cp.execSync("git config --get user.name", { cwd: root })).trim(),
    email: String(cp.execSync("git config --get user.email", { cwd: root })).trim()
  };

  const header = await renderTemplate(context.asAbsolutePath("create-class/template.h.liquid"), fields);
  console.warn(header);
  // fs.writeFileSync(path.join(arg.path, fileName + ".h"), header);
}

module.exports = { showPopoup };
