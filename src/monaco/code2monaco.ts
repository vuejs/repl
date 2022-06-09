import * as monaco from 'monaco-editor';
import * as vscode from 'vscode-languageserver-protocol';

export function asCompletionList(list: vscode.CompletionList): monaco.languages.CompletionList {
    return {
        incomplete: list.isIncomplete,
        suggestions: list.items.map(asCompletionItem),
    };
}

export function asCompletionItemKind(kind: vscode.CompletionItemKind | undefined): monaco.languages.CompletionItemKind {
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

export function asCompletionItem(item: vscode.CompletionItem): monaco.languages.CompletionItem {
    return {
        label: item.label,
        kind: asCompletionItemKind(item.kind),
        tags: item.tags,
        detail: item.detail,
        documentation: item.documentation,
        sortText: item.sortText,
        filterText: item.filterText,
        preselect: item.preselect,
        insertText: item.textEdit?.newText ?? item.insertText ?? item.label,
        range: asCompletionItemRange(item.textEdit),
        commitCharacters: item.commitCharacters,
        additionalTextEdits: item.additionalTextEdits?.map(asTextEdit),
        command: item.command ? asCommand(item.command) : undefined,
    };
}

export function asCommand(command: vscode.Command): monaco.languages.Command {
    return {
        id: command.command,
        title: command.title,
        arguments: command.arguments,
    };
}

export function asTextEdit(edit: vscode.TextEdit): monaco.languages.TextEdit {
    return {
        range: asRange(edit.range),
        text: edit.newText,
    };
}

export function asCompletionItemRange(textEdit: vscode.CompletionItem['textEdit']): monaco.languages.CompletionItem['range'] {
    if (textEdit && 'insert' in textEdit && 'replace' in textEdit) {
        const result: monaco.languages.CompletionItemRanges = {
            insert: asRange(textEdit.insert),
            replace: asRange(textEdit.replace),
        };
        return result;
    }
    else if (textEdit) {
        return asRange(textEdit.range);
    }
    // @ts-expect-error
    return undefined;
}

export function asRange(range: vscode.Range): monaco.IRange {
    return {
        startLineNumber: range.start.line + 1,
        startColumn: range.start.character + 1,
        endLineNumber: range.end.line + 1,
        endColumn: range.end.character + 1,
    };
}

export function asHover(hover: vscode.Hover): monaco.languages.Hover {
    return {
        contents: asMarkdownString(hover.contents),
        range: hover.range ? asRange(hover.range) : undefined,
    };
}

export function asMarkdownString(markdownString: vscode.Hover['contents']): monaco.IMarkdownString[] {
    if (typeof markdownString === 'string') {
        return [{ value: markdownString }]
    }
    else if (Array.isArray(markdownString)) {
        return markdownString.map(asMarkdownString).flat();
    }
    else {
        return [markdownString];
    }
}

export function asLocation(definition: vscode.LocationLink): monaco.languages.Location {
    return {
        uri: asUri(definition.targetUri),
        range: asRange(definition.targetRange),
    };
}

export function asUri(uri: vscode.URI): monaco.Uri {
    return monaco.Uri.parse(uri);
}

export function asSignatureHelp(signatureHelp: vscode.SignatureHelp): monaco.languages.SignatureHelp {
    return {
        signatures: signatureHelp.signatures.map(asSignatureInformation),
        activeSignature: signatureHelp.activeSignature ?? 0,
        activeParameter: signatureHelp.activeParameter ?? 0,
    };
}

export function asSignatureInformation(signatureInformation: vscode.SignatureInformation): monaco.languages.SignatureInformation {
    return {
        label: signatureInformation.label,
        documentation: signatureInformation.documentation,
        parameters: signatureInformation.parameters ? signatureInformation.parameters.map(asParameterInformation) : [],
        activeParameter: signatureInformation.activeParameter,
    };
}

export function asParameterInformation(parameterInformation: vscode.ParameterInformation): monaco.languages.ParameterInformation {
    return {
        label: parameterInformation.label,
        documentation: parameterInformation.documentation,
    };
}
