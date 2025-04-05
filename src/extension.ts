'use strict';

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    console.log('vscode-base64 is now active');

    const commands = [
        { id: 'extension.base64Encode', handler: base64Encode },
        { id: 'extension.base64Decode', handler: base64Decode }
    ];

    context.subscriptions.push(
        ...commands.map(cmd =>
            vscode.commands.registerCommand(cmd.id, () => {
                const editor = vscode.window.activeTextEditor;
                if (!editor) {
                    vscode.window.showErrorMessage('No active text editor');
                    return;
                }
                cmd.handler(editor);
            })
        )
    );
}

async function base64Encode(editor: vscode.TextEditor): Promise<void> {

    try {
        await editor.edit(builder => {
            editor.selections.forEach(selection => {
                const text = editor.document.getText(selection);
                const encoded = Buffer.from(text).toString('base64');
                builder.replace(selection, encoded);
            });
        });
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to encode: ${error.message}`);
    }
}

async function base64Decode(editor: vscode.TextEditor): Promise<void> {

    try {
        await editor.edit(builder => {
            editor.selections.forEach(selection => {
                const text = editor.document.getText(selection);
                const decoded = Buffer.from(text, 'base64').toString();
                builder.replace(selection, decoded);
            });
        });
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to decode: ${error.message}`);
    }
}

export function deactivate() { }
