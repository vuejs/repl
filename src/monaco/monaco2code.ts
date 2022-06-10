import * as monaco from 'monaco-editor';
import * as vscode from 'vscode-languageserver-protocol';

export function asPosition(position: monaco.Position): vscode.Position {
    return vscode.Position.create(
        position.lineNumber - 1, position.column - 1,
    );
}

export function asRange(range: monaco.IRange): vscode.Range {
    return vscode.Range.create(
        range.startLineNumber - 1,
        range.startColumn - 1,
        range.endLineNumber - 1,
        range.endColumn - 1,
    );
}

export function asCompletionContext(context: monaco.languages.CompletionContext): vscode.CompletionContext {
    return {
        triggerKind: asTriggerKind(context.triggerKind),
        triggerCharacter: context.triggerCharacter,
    };
}

export function asTriggerKind(kind: monaco.languages.CompletionTriggerKind): vscode.CompletionTriggerKind {
    switch (kind) {
        case monaco.languages.CompletionTriggerKind.Invoke:
            return vscode.CompletionTriggerKind.Invoked;
        case monaco.languages.CompletionTriggerKind.TriggerCharacter:
            return vscode.CompletionTriggerKind.TriggerCharacter;
        case monaco.languages.CompletionTriggerKind.TriggerForIncompleteCompletions:
            return vscode.CompletionTriggerKind.TriggerForIncompleteCompletions;
    }
}

export function asFormattingOptions(options: monaco.languages.FormattingOptions): vscode.FormattingOptions {
    return {
        tabSize: options.tabSize,
        insertSpaces: options.insertSpaces,
    };
}
