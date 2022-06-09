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
    if (textEdit && vscode.InsertReplaceEdit.is(textEdit)) {
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

export function asLocation(definition: vscode.LocationLink | vscode.Location): monaco.languages.Location {
    if (vscode.LocationLink.is(definition)) {
        return {
            uri: asUri(definition.targetUri),
            range: asRange(definition.targetRange),
        };
    }
    else {
        return {
            uri: asUri(definition.uri),
            range: asRange(definition.range),
        };
    }
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

export function asMarkerData(diagnostic: vscode.Diagnostic): monaco.editor.IMarkerData {
    return {
        code: diagnostic.code?.toString(),
        severity: asMarkerSeverity(diagnostic.severity),
        message: diagnostic.message,
        source: diagnostic.source,
        ...asRange(diagnostic.range),
        relatedInformation: diagnostic.relatedInformation?.map(asRelatedInformation),
        tags: diagnostic.tags?.map(asMarkerTag),
    };
}

export function asMarkerTag(tag: vscode.DiagnosticTag): monaco.MarkerTag {
    switch (tag) {
        case vscode.DiagnosticTag.Unnecessary:
            return monaco.MarkerTag.Unnecessary;
        case vscode.DiagnosticTag.Deprecated:
            return monaco.MarkerTag.Deprecated;
    }
}

export function asRelatedInformation(relatedInformation: vscode.DiagnosticRelatedInformation): monaco.editor.IRelatedInformation {
    return {
        resource: asUri(relatedInformation.location.uri),
        message: relatedInformation.message,
        ...asRange(relatedInformation.location.range),
    };
}

export function asMarkerSeverity(severity: vscode.DiagnosticSeverity | undefined): monaco.MarkerSeverity {
    switch (severity) {
        case vscode.DiagnosticSeverity.Error:
            return monaco.MarkerSeverity.Error;
        case vscode.DiagnosticSeverity.Warning:
            return monaco.MarkerSeverity.Warning;
        case vscode.DiagnosticSeverity.Information:
            return monaco.MarkerSeverity.Info;
        case vscode.DiagnosticSeverity.Hint:
            return monaco.MarkerSeverity.Hint;
        default:
            return monaco.MarkerSeverity.Info;
    }
}

export function asWorkspaceEdit(workspaceEdit: vscode.WorkspaceEdit): monaco.languages.WorkspaceEdit {
    const result: monaco.languages.WorkspaceEdit = {
        edits: [],
    };
    if (workspaceEdit.changes) {
        for (const uri in workspaceEdit.changes) {
            const edits = workspaceEdit.changes[uri];
            for (const edit of edits) {
                result.edits.push({
                    resource: asUri(uri),
                    edit: asTextEdit(edit),
                });
            }
        }
    }
    if (workspaceEdit.documentChanges) {
        for (const documentChange of workspaceEdit.documentChanges) {
            if (vscode.TextDocumentEdit.is(documentChange)) {
                for (const edit of documentChange.edits) {
                    result.edits.push({
                        resource: asUri(documentChange.textDocument.uri),
                        edit: asTextEdit(edit),
                    });
                }
            }
            else if (vscode.CreateFile.is(documentChange)) {
                result.edits.push({
                    newUri: asUri(documentChange.uri),
                    options: {
                        overwrite: documentChange.options?.overwrite ?? false,
                        ignoreIfExists: documentChange.options?.ignoreIfExists ?? false,
                    },
                });
            }
            else if (vscode.RenameFile.is(documentChange)) {
                result.edits.push({
                    oldUri: asUri(documentChange.oldUri),
                    newUri: asUri(documentChange.newUri),
                    options: {
                        overwrite: documentChange.options?.overwrite ?? false,
                        ignoreIfExists: documentChange.options?.ignoreIfExists ?? false,
                    },
                });
            }
            else if (vscode.DeleteFile.is(documentChange)) {
                result.edits.push({
                    oldUri: asUri(documentChange.uri),
                    options: {
                        recursive: documentChange.options?.recursive ?? false,
                        ignoreIfNotExists: documentChange.options?.ignoreIfNotExists ?? false,
                    },
                });
            }
        }
    }
    return result;
}

export function asDocumentSymbol(symbol: vscode.SymbolInformation): monaco.languages.DocumentSymbol {
    return {
        name: symbol.name,
        detail: '',
        kind: asSymbolKind(symbol.kind),
        tags: symbol.tags?.map(asSymbolTag) ?? [],
        containerName: symbol.containerName,
        range: asRange(symbol.location.range),
        selectionRange: asRange(symbol.location.range),
        children: [],
    };
}

export function asSymbolTag(tag: vscode.SymbolTag): monaco.languages.SymbolTag {
    switch (tag) {
        case vscode.SymbolTag.Deprecated:
            return monaco.languages.SymbolTag.Deprecated;
    }
}

export function asSymbolKind(kind: vscode.SymbolKind): monaco.languages.SymbolKind {
    switch (kind) {
        case vscode.SymbolKind.File:
            return monaco.languages.SymbolKind.File;
        case vscode.SymbolKind.Module:
            return monaco.languages.SymbolKind.Module;
        case vscode.SymbolKind.Namespace:
            return monaco.languages.SymbolKind.Namespace;
        case vscode.SymbolKind.Package:
            return monaco.languages.SymbolKind.Package;
        case vscode.SymbolKind.Class:
            return monaco.languages.SymbolKind.Class;
        case vscode.SymbolKind.Method:
            return monaco.languages.SymbolKind.Method;
        case vscode.SymbolKind.Property:
            return monaco.languages.SymbolKind.Property;
        case vscode.SymbolKind.Field:
            return monaco.languages.SymbolKind.Field;
        case vscode.SymbolKind.Constructor:
            return monaco.languages.SymbolKind.Constructor;
        case vscode.SymbolKind.Enum:
            return monaco.languages.SymbolKind.Enum;
        case vscode.SymbolKind.Interface:
            return monaco.languages.SymbolKind.Interface;
        case vscode.SymbolKind.Function:
            return monaco.languages.SymbolKind.Function;
        case vscode.SymbolKind.Variable:
            return monaco.languages.SymbolKind.Variable;
        case vscode.SymbolKind.Constant:
            return monaco.languages.SymbolKind.Constant;
        case vscode.SymbolKind.String:
            return monaco.languages.SymbolKind.String;
        case vscode.SymbolKind.Number:
            return monaco.languages.SymbolKind.Number;
        case vscode.SymbolKind.Boolean:
            return monaco.languages.SymbolKind.Boolean;
        case vscode.SymbolKind.Array:
            return monaco.languages.SymbolKind.Array;
        case vscode.SymbolKind.Object:
            return monaco.languages.SymbolKind.Object;
        case vscode.SymbolKind.Key:
            return monaco.languages.SymbolKind.Key;
        case vscode.SymbolKind.Null:
            return monaco.languages.SymbolKind.Null;
        case vscode.SymbolKind.EnumMember:
            return monaco.languages.SymbolKind.EnumMember;
        case vscode.SymbolKind.Struct:
            return monaco.languages.SymbolKind.Struct;
        case vscode.SymbolKind.Event:
            return monaco.languages.SymbolKind.Event;
        case vscode.SymbolKind.Operator:
            return monaco.languages.SymbolKind.Operator;
        case vscode.SymbolKind.TypeParameter:
            return monaco.languages.SymbolKind.TypeParameter;
        default:
            return monaco.languages.SymbolKind.File;
    }
}

export function asDocumentHighlight(highlight: vscode.DocumentHighlight): monaco.languages.DocumentHighlight {
    return {
        range: asRange(highlight.range),
        kind: asDocumentHighlightKind(highlight.kind),
    };
}

export function asDocumentHighlightKind(kind: vscode.DocumentHighlightKind | undefined): monaco.languages.DocumentHighlightKind {
    switch (kind) {
        case vscode.DocumentHighlightKind.Text:
            return monaco.languages.DocumentHighlightKind.Text;
        case vscode.DocumentHighlightKind.Read:
            return monaco.languages.DocumentHighlightKind.Read;
        case vscode.DocumentHighlightKind.Write:
            return monaco.languages.DocumentHighlightKind.Write;
        default:
            return monaco.languages.DocumentHighlightKind.Text;
    }
}
