import { languages, IRange, IMarkdownString, Uri, editor, MarkerTag, MarkerSeverity, Position } from 'monaco-editor-core';
import * as vscode from 'vscode-languageserver-protocol';

export function asCompletionList(list: vscode.CompletionList): languages.CompletionList {
    return {
        incomplete: list.isIncomplete,
        suggestions: list.items.map(asCompletionItem),
    };
}

export function asCompletionItemKind(kind: vscode.CompletionItemKind | undefined): languages.CompletionItemKind {
    switch (kind) {
        case vscode.CompletionItemKind.Method:
            return languages.CompletionItemKind.Method;
        case vscode.CompletionItemKind.Function:
            return languages.CompletionItemKind.Function;
        case vscode.CompletionItemKind.Constructor:
            return languages.CompletionItemKind.Constructor;
        case vscode.CompletionItemKind.Field:
            return languages.CompletionItemKind.Field;
        case vscode.CompletionItemKind.Variable:
            return languages.CompletionItemKind.Variable;
        case vscode.CompletionItemKind.Class:
            return languages.CompletionItemKind.Class;
        case vscode.CompletionItemKind.Interface:
            return languages.CompletionItemKind.Interface;
        case vscode.CompletionItemKind.Module:
            return languages.CompletionItemKind.Module;
        case vscode.CompletionItemKind.Property:
            return languages.CompletionItemKind.Property;
        case vscode.CompletionItemKind.Unit:
            return languages.CompletionItemKind.Unit;
        case vscode.CompletionItemKind.Value:
            return languages.CompletionItemKind.Value;
        case vscode.CompletionItemKind.Enum:
            return languages.CompletionItemKind.Enum;
        case vscode.CompletionItemKind.Keyword:
            return languages.CompletionItemKind.Keyword;
        case vscode.CompletionItemKind.Snippet:
            return languages.CompletionItemKind.Snippet;
        case vscode.CompletionItemKind.Text:
            return languages.CompletionItemKind.Text;
        case vscode.CompletionItemKind.Color:
            return languages.CompletionItemKind.Color;
        case vscode.CompletionItemKind.File:
            return languages.CompletionItemKind.File;
        case vscode.CompletionItemKind.Reference:
            return languages.CompletionItemKind.Reference;
        case vscode.CompletionItemKind.Folder:
            return languages.CompletionItemKind.Folder;
        case vscode.CompletionItemKind.EnumMember:
            return languages.CompletionItemKind.EnumMember;
        case vscode.CompletionItemKind.Constant:
            return languages.CompletionItemKind.Constant;
        case vscode.CompletionItemKind.Struct:
            return languages.CompletionItemKind.Struct;
        case vscode.CompletionItemKind.Event:
            return languages.CompletionItemKind.Event;
        case vscode.CompletionItemKind.Operator:
            return languages.CompletionItemKind.Operator;
        case vscode.CompletionItemKind.TypeParameter:
            return languages.CompletionItemKind.TypeParameter;
        default:
            return languages.CompletionItemKind.Text;
    }
}

export function asCompletionItem(item: vscode.CompletionItem): languages.CompletionItem {
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

export function asCommand(command: vscode.Command): languages.Command {
    return {
        id: command.command,
        title: command.title,
        arguments: command.arguments,
    };
}

export function asTextEdit(edit: vscode.TextEdit): languages.TextEdit {
    return {
        range: asRange(edit.range),
        text: edit.newText,
    };
}

export function asCompletionItemRange(textEdit: vscode.CompletionItem['textEdit']): languages.CompletionItem['range'] {
    if (textEdit && vscode.InsertReplaceEdit.is(textEdit)) {
        const result: languages.CompletionItemRanges = {
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

export function asRange(range: vscode.Range): IRange {
    return {
        startLineNumber: range.start.line + 1,
        startColumn: range.start.character + 1,
        endLineNumber: range.end.line + 1,
        endColumn: range.end.character + 1,
    };
}

export function asHover(hover: vscode.Hover): languages.Hover {
    return {
        contents: asMarkdownString(hover.contents),
        range: hover.range ? asRange(hover.range) : undefined,
    };
}

export function asMarkdownString(markdownString: vscode.Hover['contents']): IMarkdownString[] {
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

export function asLocation(definition: vscode.LocationLink | vscode.Location): languages.Location {
    if (vscode.LocationLink.is(definition)) {
        return {
            uri: asUri(definition.targetUri),
            range: asRange(definition.targetSelectionRange),
        };
    }
    else {
        return {
            uri: asUri(definition.uri),
            range: asRange(definition.range),
        };
    }
}

export function asUri(uri: vscode.URI): Uri {
    return Uri.parse(uri);
}

export function asSignatureHelp(signatureHelp: vscode.SignatureHelp): languages.SignatureHelp {
    return {
        signatures: signatureHelp.signatures.map(asSignatureInformation),
        activeSignature: signatureHelp.activeSignature ?? 0,
        activeParameter: signatureHelp.activeParameter ?? 0,
    };
}

export function asSignatureInformation(signatureInformation: vscode.SignatureInformation): languages.SignatureInformation {
    return {
        label: signatureInformation.label,
        documentation: signatureInformation.documentation,
        parameters: signatureInformation.parameters ? signatureInformation.parameters.map(asParameterInformation) : [],
        activeParameter: signatureInformation.activeParameter,
    };
}

export function asParameterInformation(parameterInformation: vscode.ParameterInformation): languages.ParameterInformation {
    return {
        label: parameterInformation.label,
        documentation: parameterInformation.documentation,
    };
}

export function asMarkerData(diagnostic: vscode.Diagnostic): editor.IMarkerData {
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

export function asMarkerTag(tag: vscode.DiagnosticTag): MarkerTag {
    switch (tag) {
        case vscode.DiagnosticTag.Unnecessary:
            return MarkerTag.Unnecessary;
        case vscode.DiagnosticTag.Deprecated:
            return MarkerTag.Deprecated;
    }
}

export function asRelatedInformation(relatedInformation: vscode.DiagnosticRelatedInformation): editor.IRelatedInformation {
    return {
        resource: asUri(relatedInformation.location.uri),
        message: relatedInformation.message,
        ...asRange(relatedInformation.location.range),
    };
}

export function asMarkerSeverity(severity: vscode.DiagnosticSeverity | undefined): MarkerSeverity {
    switch (severity) {
        case vscode.DiagnosticSeverity.Error:
            return MarkerSeverity.Error;
        case vscode.DiagnosticSeverity.Warning:
            return MarkerSeverity.Warning;
        case vscode.DiagnosticSeverity.Information:
            return MarkerSeverity.Info;
        case vscode.DiagnosticSeverity.Hint:
            return MarkerSeverity.Hint;
        default:
            return MarkerSeverity.Info;
    }
}

export function asWorkspaceEdit(workspaceEdit: vscode.WorkspaceEdit): languages.WorkspaceEdit {
    const result: languages.WorkspaceEdit = {
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

export function asDocumentSymbol(symbol: vscode.SymbolInformation): languages.DocumentSymbol {
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

export function asSymbolTag(tag: vscode.SymbolTag): languages.SymbolTag {
    switch (tag) {
        case vscode.SymbolTag.Deprecated:
            return languages.SymbolTag.Deprecated;
    }
}

export function asSymbolKind(kind: vscode.SymbolKind): languages.SymbolKind {
    switch (kind) {
        case vscode.SymbolKind.File:
            return languages.SymbolKind.File;
        case vscode.SymbolKind.Module:
            return languages.SymbolKind.Module;
        case vscode.SymbolKind.Namespace:
            return languages.SymbolKind.Namespace;
        case vscode.SymbolKind.Package:
            return languages.SymbolKind.Package;
        case vscode.SymbolKind.Class:
            return languages.SymbolKind.Class;
        case vscode.SymbolKind.Method:
            return languages.SymbolKind.Method;
        case vscode.SymbolKind.Property:
            return languages.SymbolKind.Property;
        case vscode.SymbolKind.Field:
            return languages.SymbolKind.Field;
        case vscode.SymbolKind.Constructor:
            return languages.SymbolKind.Constructor;
        case vscode.SymbolKind.Enum:
            return languages.SymbolKind.Enum;
        case vscode.SymbolKind.Interface:
            return languages.SymbolKind.Interface;
        case vscode.SymbolKind.Function:
            return languages.SymbolKind.Function;
        case vscode.SymbolKind.Variable:
            return languages.SymbolKind.Variable;
        case vscode.SymbolKind.Constant:
            return languages.SymbolKind.Constant;
        case vscode.SymbolKind.String:
            return languages.SymbolKind.String;
        case vscode.SymbolKind.Number:
            return languages.SymbolKind.Number;
        case vscode.SymbolKind.Boolean:
            return languages.SymbolKind.Boolean;
        case vscode.SymbolKind.Array:
            return languages.SymbolKind.Array;
        case vscode.SymbolKind.Object:
            return languages.SymbolKind.Object;
        case vscode.SymbolKind.Key:
            return languages.SymbolKind.Key;
        case vscode.SymbolKind.Null:
            return languages.SymbolKind.Null;
        case vscode.SymbolKind.EnumMember:
            return languages.SymbolKind.EnumMember;
        case vscode.SymbolKind.Struct:
            return languages.SymbolKind.Struct;
        case vscode.SymbolKind.Event:
            return languages.SymbolKind.Event;
        case vscode.SymbolKind.Operator:
            return languages.SymbolKind.Operator;
        case vscode.SymbolKind.TypeParameter:
            return languages.SymbolKind.TypeParameter;
        default:
            return languages.SymbolKind.File;
    }
}

export function asDocumentHighlight(highlight: vscode.DocumentHighlight): languages.DocumentHighlight {
    return {
        range: asRange(highlight.range),
        kind: asDocumentHighlightKind(highlight.kind),
    };
}

export function asDocumentHighlightKind(kind: vscode.DocumentHighlightKind | undefined): languages.DocumentHighlightKind {
    switch (kind) {
        case vscode.DocumentHighlightKind.Text:
            return languages.DocumentHighlightKind.Text;
        case vscode.DocumentHighlightKind.Read:
            return languages.DocumentHighlightKind.Read;
        case vscode.DocumentHighlightKind.Write:
            return languages.DocumentHighlightKind.Write;
        default:
            return languages.DocumentHighlightKind.Text;
    }
}

export function asCodeLens(item: vscode.CodeLens): languages.CodeLens {
    return {
        range: asRange(item.range),
        command: item.command ? asCommand(item.command) : undefined,
    };
}

export function asCodeAction(item: vscode.CodeAction): languages.CodeAction {
    return {
        title: item.title,
        command: item.command ? asCommand(item.command) : undefined,
        edit: item.edit ? asWorkspaceEdit(item.edit) : undefined,
        diagnostics: item.diagnostics ? item.diagnostics.map(asMarkerData) : undefined,
        kind: item.kind,
        isPreferred: item.isPreferred,
        disabled: item.disabled?.reason,
    };
}

export function asLink(item: vscode.DocumentLink): languages.ILink {
    return {
        range: asRange(item.range),
        url: item.target,
        tooltip: item.tooltip,
    };
}

export function asColorInformation(item: vscode.ColorInformation): languages.IColorInformation {
    return {
        range: asRange(item.range),
        color: item.color,
    };
}

export function asColorPresentation(item: vscode.ColorPresentation): languages.IColorPresentation {
    return {
        label: item.label,
        textEdit: item.textEdit ? asTextEdit(item.textEdit) : undefined,
        additionalTextEdits: item.additionalTextEdits ? item.additionalTextEdits.map(asTextEdit) : undefined,
    };
}

export function asFoldingRange(item: vscode.FoldingRange): languages.FoldingRange {
    return {
        start: item.startLine,
        end: item.endLine,
        kind: {
            value: item.kind ?? '',
        },
    };
}

export function asSelectionRange(item: vscode.SelectionRange): languages.SelectionRange {
    return {
        range: asRange(item.range),
    };
}

export function asInlayHint(item: vscode.InlayHint): languages.InlayHint {
    return {
        label: asInlayHintLabel(item.label),
        tooltip: item.tooltip,
        command: undefined,
        position: asPosition(item.position),
        kind: item.kind ? asInlayHintKind(item.kind) : undefined,
        paddingLeft: item.paddingLeft,
        paddingRight: item.paddingRight,
    };
}

export function asInlayHintKind(kind: vscode.InlayHintKind): languages.InlayHintKind {
    switch (kind) {
        case vscode.InlayHintKind.Parameter:
            return languages.InlayHintKind.Parameter;
        case vscode.InlayHintKind.Type:
            return languages.InlayHintKind.Type;
    }
}

export function asInlayHintLabel(label: vscode.InlayHint['label']): languages.InlayHint['label'] {
    if (typeof label === 'string') {
        return label;
    }
    else {
        return label.map(asInlayHintLabelPart);
    }
}

export function asInlayHintLabelPart(part: vscode.InlayHintLabelPart): languages.InlayHintLabelPart {
    return {
        label: part.value,
        tooltip: part.tooltip,
        command: part.command ? asCommand(part.command) : undefined,
        location: part.location ? asLocation(part.location) : undefined,
    };
}

export function asPosition(position: vscode.Position): Position {
    return {
        lineNumber: position.line + 1,
        column: position.character + 1,
    } as unknown as Position;
}
