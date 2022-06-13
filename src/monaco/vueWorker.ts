import { languages, editor, worker, CancellationToken, Position, Range } from 'monaco-editor-core';
import { getLanguageServiceAndDocumentsService } from './services';
import * as code2monaco from './code2monaco';
import * as monaco2code from './monaco2code';
import * as vscode from 'vscode-languageserver-protocol';

export interface ICreateData {
	languageId: string;
}

export interface IVueWorker extends
    languages.HoverProvider,
    languages.DocumentSymbolProvider,
    languages.DocumentHighlightProvider,
    languages.LinkedEditingRangeProvider,
    languages.DefinitionProvider,
    languages.ImplementationProvider,
    languages.TypeDefinitionProvider,
    languages.CodeLensProvider,
    languages.CodeActionProvider,
    Omit<languages.DocumentFormattingEditProvider, 'displayName'>,
    Omit<languages.DocumentRangeFormattingEditProvider, 'displayName'>,
    languages.OnTypeFormattingEditProvider,
    languages.LinkProvider,
    languages.CompletionItemProvider,
    languages.DocumentColorProvider,
    languages.FoldingRangeProvider,
    languages.DeclarationProvider,
    languages.SignatureHelpProvider,
    languages.RenameProvider,
    languages.ReferenceProvider,
    languages.SelectionRangeProvider,
    languages.InlayHintsProvider {

}

export class WorkerTriggerCharacters {
    autoFormatTriggerCharacters = ['}', ';', '\n']
    
    triggerCharacters = '!@#$%^&*()_+-=`~{}|[]\:";\'<>?,./ '.split('')

    signatureHelpTriggerCharacters = ['(', ',']
}

export class VueWorker extends WorkerTriggerCharacters implements IVueWorker {
	private _ls: ReturnType<typeof getLanguageServiceAndDocumentsService>["ls"];
	private _ds: ReturnType<typeof getLanguageServiceAndDocumentsService>["ds"];

    private _completionItems = new WeakMap<languages.CompletionItem, vscode.CompletionItem>();
    private _codeLens = new WeakMap<languages.CodeLens, vscode.CodeLens>();
    private _codeActions = new WeakMap<languages.CodeAction, vscode.CodeAction>();
    private _colorInformations = new WeakMap<languages.IColorInformation, vscode.ColorInformation>();
    private _documents = new WeakMap<editor.ITextModel, vscode.TextDocument>();
    private _diagnostics = new WeakMap<editor.IMarkerData, vscode.Diagnostic>();

    constructor (
        ctx: worker.IWorkerContext,
        createData: ICreateData
    ) {
        super();

        const modelsMap = new Map(ctx.getMirrorModels().map(x => [x.uri.fsPath, x]));
        const { ls, ds } = getLanguageServiceAndDocumentsService(() => modelsMap)
        this._ls = ls;
        this._ds = ds;
    }

    getTextDocument(model: editor.ITextModel) {
        let document = this._documents.get(model);
        if (!document || document.version !== model.getVersionId()) {
            document = vscode.TextDocument.create(
                model.uri.toString(),
                model.getLanguageId(),
                model.getVersionId(),
                model.getValue(),
            );
            this._documents.set(model, document);
        }
        return document;
    }

    async provideDocumentSymbols(model: editor.ITextModel, token: CancellationToken): Promise<languages.DocumentSymbol[] | null | undefined> {
        const document = this.getTextDocument(model);
        if (document) {
            const codeResult = await this._ds.findDocumentSymbols(document);
            if (codeResult) {
                return codeResult.map(code2monaco.asDocumentSymbol);
            }
        }
    }

    async provideDocumentHighlights(model: editor.ITextModel, position: Position, token: CancellationToken): Promise<languages.DocumentHighlight[] | null | undefined> {
        const codeResult = await this._ls.findDocumentHighlights(
            model.uri.toString(),
            monaco2code.asPosition(position),
        );
        if (codeResult) {
            return codeResult.map(code2monaco.asDocumentHighlight);
        }
    }

    async provideLinkedEditingRanges(model: editor.ITextModel, position: Position, token: CancellationToken): Promise<languages.LinkedEditingRanges | null | undefined> {
        const document = this.getTextDocument(model);
        if (document) {
            const codeResult = await this._ds.findLinkedEditingRanges(
                document,
                monaco2code.asPosition(position),
            );
            if (codeResult) {
                return {
                    ranges: codeResult.ranges.map(code2monaco.asRange),
                    wordPattern: codeResult.wordPattern ? new RegExp(codeResult.wordPattern) : undefined,
                };
            }
        }
    }

    async provideDefinition(model: editor.ITextModel, position: Position, token: CancellationToken): Promise<languages.Definition | null | undefined> {
        const codeResult = await this._ls.findDefinition(
            model.uri.toString(),
            monaco2code.asPosition(position),
        );
        // TODO: can't show if only one result from libs
        if (codeResult) {
            return codeResult.map(code2monaco.asLocation);
        }
    }

    async provideImplementation(model: editor.ITextModel, position: Position, token: CancellationToken): Promise<languages.Definition | null | undefined> {
        const codeResult = await this._ls.findImplementations(
            model.uri.toString(),
            monaco2code.asPosition(position),
        );
        if (codeResult) {
            return codeResult.map(code2monaco.asLocation);
        }
    }

    async provideTypeDefinition(model: editor.ITextModel, position: Position, token: CancellationToken): Promise<languages.Definition | null | undefined> {
        const codeResult = await this._ls.findTypeDefinition(
            model.uri.toString(),
            monaco2code.asPosition(position),
        );
        if (codeResult) {
            return codeResult.map(code2monaco.asLocation);
        }
    }

    async provideCodeLenses(model: editor.ITextModel, token: CancellationToken): Promise<languages.CodeLensList | null | undefined> {
        const codeResult = await this._ls.doCodeLens(
            model.uri.toString(),
        );
        if (codeResult) {
            const monacoResult = codeResult.map(code2monaco.asCodeLens);
            for (let i = 0; i < monacoResult.length; i++) {
                this._codeLens.set(monacoResult[i], codeResult[i]);
            }
            return {
                lenses: monacoResult,
                dispose: () => { },
            };
        }
    }

    async provideCodeActions(model: editor.ITextModel, range: Range, context: languages.CodeActionContext, token: CancellationToken): Promise<languages.CodeActionList | null | undefined> {
        const diagnostics: vscode.Diagnostic[] = [];
        for (const marker of context.markers) {
            const diagnostic = this._diagnostics.get(marker);
            if (diagnostic) {
                diagnostics.push(diagnostic);
            }
        }
        const codeResult = await this._ls.doCodeActions(
            model.uri.toString(),
            monaco2code.asRange(range),
            {
                diagnostics: diagnostics,
                only: context.only ? [context.only] : undefined,
            },
        );
        if (codeResult) {
            const monacoResult = codeResult.map(code2monaco.asCodeAction);
            for (let i = 0; i < monacoResult.length; i++) {
                this._codeActions.set(monacoResult[i], codeResult[i]);
            }
            return {
                actions: monacoResult,
                dispose: () => { },
            };
        }
    }

    async resolveCodeAction (moncaoResult: languages.CodeAction): Promise<languages.CodeAction> {
        let codeResult = this._codeActions.get(moncaoResult);
        if (codeResult) {
            codeResult = await this._ls.doCodeActionResolve(codeResult);
            if (codeResult) {
                moncaoResult = code2monaco.asCodeAction(codeResult);
                this._codeActions.set(moncaoResult, codeResult);
            }
        }
        return moncaoResult;
    }

    async provideDocumentFormattingEdits(model: editor.ITextModel, options: languages.FormattingOptions, token: CancellationToken): Promise<languages.TextEdit[] | null | undefined> {
        const document = this.getTextDocument(model);
        if (document) {
            const codeResult = await this._ds.format(
                document,
                monaco2code.asFormattingOptions(options),
            );
            if (codeResult) {
                return codeResult.map(code2monaco.asTextEdit);
            }
        }
    }

    async provideDocumentRangeFormattingEdits(model: editor.ITextModel, range: Range, options: languages.FormattingOptions, token: CancellationToken): Promise<languages.TextEdit[] | null | undefined> {
        const document = this.getTextDocument(model);
        if (document) {
            const codeResult = await this._ds.format(
                document,
                monaco2code.asFormattingOptions(options),
                monaco2code.asRange(range),
            );
            if (codeResult) {
                return codeResult.map(code2monaco.asTextEdit);
            }
        }
    }

    async provideOnTypeFormattingEdits(model: editor.ITextModel, position: Position, ch: string, options: languages.FormattingOptions, token: CancellationToken): Promise<languages.TextEdit[] | null | undefined> {
        const document = this.getTextDocument(model);
        if (document) {
            const codeResult = await this._ds.format(
                document,
                monaco2code.asFormattingOptions(options),
                undefined,
                {
                    ch: ch,
                    position: monaco2code.asPosition(position),
                },
            );
            if (codeResult) {
                return codeResult.map(code2monaco.asTextEdit);
            }
        }
        return [];
    }

    async provideLinks(model: editor.ITextModel, token: CancellationToken): Promise<languages.ILinksList | null | undefined> {
        const codeResult = await this._ls.findDocumentLinks(
            model.uri.toString(),
        );
        if (codeResult) {
            return {
                links: codeResult.map(code2monaco.asLink),
            };
        }
    }

    async provideCompletionItems(model: editor.ITextModel, position: Position, context: languages.CompletionContext, token: CancellationToken): Promise<languages.CompletionList | null | undefined> {
        const codeResult = await this._ls.doComplete(
            model.uri.toString(),
            monaco2code.asPosition(position),
            monaco2code.asCompletionContext(context),
        );
        const monacoResult = code2monaco.asCompletionList(codeResult);
        for (let i = 0; i < codeResult.items.length; i++) {
            this._completionItems.set(monacoResult.suggestions[i], codeResult.items[i]);
        }
        return monacoResult;
    }

    async resolveCompletionItem(monacoItem: languages.CompletionItem, token: CancellationToken) {
        let codeItem = this._completionItems.get(monacoItem);
        if (codeItem) {
            codeItem = await this._ls.doCompletionResolve(codeItem);
            monacoItem = code2monaco.asCompletionItem(codeItem);
            this._completionItems.set(monacoItem, codeItem);
        }
        return monacoItem;
    }

    async provideDocumentColors(model: editor.ITextModel, token: CancellationToken): Promise<languages.IColorInformation[] | null | undefined> {
        const document = this.getTextDocument(model);
        if (document) {
            const codeResult = await this._ds.findDocumentColors(document);
            if (codeResult) {
                return codeResult.map(code2monaco.asColorInformation);
            }
        }
    }

    async provideColorPresentations (model: editor.ITextModel, monacoResult: languages.IColorInformation) {
        const document = this.getTextDocument(model);
        const codeResult = this._colorInformations.get(monacoResult);
        if (document && codeResult) {
            const codeColors = await this._ds.getColorPresentations(
                document,
                codeResult.color,
                {
                    start: document.positionAt(0),
                    end: document.positionAt(document.getText().length),
                },
            );
            if (codeColors) {
                return codeColors.map(code2monaco.asColorPresentation);
            }
        }
    }

    async provideFoldingRanges(model: editor.ITextModel, context: languages.FoldingContext, token: CancellationToken): Promise<languages.FoldingRange[] | null | undefined> {
        const document = this.getTextDocument(model);
        if (document) {
            const codeResult = await this._ds.getFoldingRanges(document);
            if (codeResult) {
                return codeResult.map(code2monaco.asFoldingRange);
            }
        }
    }

    async provideDeclaration(model: editor.ITextModel, position: Position, token: CancellationToken): Promise<languages.Definition | null | undefined> {
        const codeResult = await this._ls.findDefinition(
            model.uri.toString(),
            monaco2code.asPosition(position),
        );
        if (codeResult) {
            return codeResult.map(code2monaco.asLocation);
        }
    }

    async provideSelectionRanges(model: editor.ITextModel, positions: Position[], token: CancellationToken): Promise<languages.SelectionRange[][] | null | undefined> {
        const document = this.getTextDocument(model);
        if (document) {
            const codeResults = await Promise.all(positions.map(position => this._ds.getSelectionRanges(
                document,
                [monaco2code.asPosition(position)],
            )));
            return codeResults.map(codeResult => codeResult?.map(code2monaco.asSelectionRange) ?? []);
        }
    }

    async provideSignatureHelp(model: editor.ITextModel, position: Position, token: CancellationToken, context: languages.SignatureHelpContext): Promise<languages.SignatureHelpResult | null | undefined> {
        const codeResult = await this._ls.getSignatureHelp(
            model.uri.toString(),
            monaco2code.asPosition(position),
        );
        if (codeResult) {
            return {
                value: code2monaco.asSignatureHelp(codeResult),
                dispose: () => { },
            };
        }
    }

    async provideRenameEdits(model: editor.ITextModel, position: Position, newName: string, token: CancellationToken): Promise<(languages.WorkspaceEdit & languages.Rejection) | null | undefined> {
        const codeResult = await this._ls.doRename(
            model.uri.toString(),
            monaco2code.asPosition(position),
            newName,
        );
        if (codeResult) {
            return code2monaco.asWorkspaceEdit(codeResult);
        }
    }

    async provideReferences(model: editor.ITextModel, position: Position, context: languages.ReferenceContext, token: CancellationToken): Promise<languages.Location[] | null | undefined> {
        const codeResult = await this._ls.findReferences(
            model.uri.toString(),
            monaco2code.asPosition(position),
        );
        // TODO: can't show if only one result from libs
        if (codeResult) {
            return codeResult.map(code2monaco.asLocation);
        }
    }

    async provideInlayHints(model: editor.ITextModel, range: Range, token: CancellationToken): Promise<languages.InlayHintList | null | undefined> {
        const codeResult = await this._ls.getInlayHints(
            model.uri.toString(),
            monaco2code.asRange(range),
        );
        if (codeResult) {
            return {
                hints: codeResult.map(code2monaco.asInlayHint),
                dispose: () => { },
            };
        }
    }
    
    async provideHover(model: editor.ITextModel, position: Position, token: CancellationToken): Promise<languages.Hover | null | undefined> {
        const codeResult = await this._ls.doHover(
            model.uri.toString(),
            monaco2code.asPosition(position),
        );
        if (codeResult) {
            return code2monaco.asHover(codeResult);
        }    
    }
}

export function create(ctx: worker.IWorkerContext, createData: ICreateData): IVueWorker {
    return new VueWorker(ctx, createData)
}
