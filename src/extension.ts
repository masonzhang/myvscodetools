'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as _ from "lodash";
const clipboardy = require('clipboardy');

function countOfDigits(str: string) {
    return (str.match(/\d/g) || []).length;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "a51" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.a51SelectIn', () => {
        // The code you place here will be executed every time your command is executed

        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        let selection = editor.selection;
        let range = new vscode.Range(editor.document.positionAt(0), editor.document.positionAt(editor.document.getText().length - 1));
        if(selection !== null && selection.end > selection.end) {
            range = new vscode.Range(selection.start, selection.end);
        }
        let text = editor.document.getText(range);

        let lines = text.split('\n');
        lines = _.map(lines, line => {
            line = line.replace(/\s/g, "");
            line = line.replace(/\n|\r\n|\r/g, "");
            return line;
        });

        lines = _.filter(lines, line => {
            return line.length > 0;
        });

        if(countOfDigits(lines[0]) < 4 && _.filter(_.drop(lines), line => countOfDigits(line) < 4).length === 0) {
            // 第一行看起来不像单号，后面都看起来像单号
            let field = lines[0];
            lines = _.map(_.drop(lines), line => "'" + line + "'");
            text = field + " in (" + _.join(lines, ",") + ")";
        }
        else {
            lines = _.map(lines, line => "'" + line + "'");
            text = "(" + _.join(lines, ",") + ")";
        }

        editor.edit(builder => {
            builder.replace(range, text);
        });
        clipboardy.write(text);
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}