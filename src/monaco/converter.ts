import * as monaco from 'monaco-editor';
import * as vscode from 'vscode-languageserver-types';

function vscodeCompletionItemKindToMonaco(
    kind: vscode.CompletionItemKind | undefined,
): monaco.languages.CompletionItemKind {
    switch (kind) {
        case vscode.CompletionItemKind.Method:
            return monaco.languages.CompletionItemKind.Method;
        case vscode.CompletionItemKind.Function:
            return monaco.languages.CompletionItemKind.Function;
        case vscode.CompletionItemKind.Constructor:
            return monaco.languages.CompletionItemKind.Constructor;
        case vscode.CompletionItemKind.Field:
            return monaco.languages.CompletionItemKind.Field;
        case vscode.CompletionItemKind.Variable:
            return monaco.languages.CompletionItemKind.Variable;
        case vscode.CompletionItemKind.Class:
            return monaco.languages.CompletionItemKind.Class;
        case vscode.CompletionItemKind.Interface:
            return monaco.languages.CompletionItemKind.Interface;
        case vscode.CompletionItemKind.Module:
            return monaco.languages.CompletionItemKind.Module;
        case vscode.CompletionItemKind.Property:
            return monaco.languages.CompletionItemKind.Property;
        case vscode.CompletionItemKind.Unit:
            return monaco.languages.CompletionItemKind.Unit;
        case vscode.CompletionItemKind.Value:
            return monaco.languages.CompletionItemKind.Value;
        case vscode.CompletionItemKind.Enum:
            return monaco.languages.CompletionItemKind.Enum;
        case vscode.CompletionItemKind.Keyword:
            return monaco.languages.CompletionItemKind.Keyword;
        case vscode.CompletionItemKind.Snippet:
            return monaco.languages.CompletionItemKind.Snippet;
        case vscode.CompletionItemKind.Text:
            return monaco.languages.CompletionItemKind.Text;
        case vscode.CompletionItemKind.Color:
            return monaco.languages.CompletionItemKind.Color;
        case vscode.CompletionItemKind.File:
            return monaco.languages.CompletionItemKind.File;
        case vscode.CompletionItemKind.Reference:
            return monaco.languages.CompletionItemKind.Reference;
        case vscode.CompletionItemKind.Folder:
            return monaco.languages.CompletionItemKind.Folder;
        case vscode.CompletionItemKind.EnumMember:
            return monaco.languages.CompletionItemKind.EnumMember;
        case vscode.CompletionItemKind.Constant:
            return monaco.languages.CompletionItemKind.Constant;
        case vscode.CompletionItemKind.Struct:
            return monaco.languages.CompletionItemKind.Struct;
        case vscode.CompletionItemKind.Event:
            return monaco.languages.CompletionItemKind.Event;
        case vscode.CompletionItemKind.Operator:
            return monaco.languages.CompletionItemKind.Operator;
        case vscode.CompletionItemKind.TypeParameter:
            return monaco.languages.CompletionItemKind.TypeParameter;
        default:
            return monaco.languages.CompletionItemKind.Text;
    }
}

export function vscodeCompletionItemToMonaco(item: vscode.CompletionItem): monaco.languages.CompletionItem {
    return {
        label: item.label,
        insertText: item.insertText ?? item.label,
        kind: vscodeCompletionItemKindToMonaco(item.kind),
        sortText: item.sortText,
        range: undefined!,
    };
}
