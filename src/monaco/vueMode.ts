import { WorkerManager } from './workerManager';
import { VueWorker } from './vueWorker';
import { LanguageServiceDefaults } from './monaco.contribution';
import * as code2monaco from './code2monaco';
import * as monaco2code from './monaco2code';
import * as vscode from 'vscode-languageserver-protocol';

import { Uri, editor, Position, CancellationToken, languages, Range, type IDisposable } from 'monaco-editor-core';

export interface WorkerAccessor<T> {
	(...more: Uri[]): Promise<T>;
}


export interface IVueAdaptor extends
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

class WorkerAdapter<T extends VueWorker> implements IVueAdaptor {
	private _completionItems = new WeakMap<languages.CompletionItem, vscode.CompletionItem>();
    private _codeLens = new WeakMap<languages.CodeLens, vscode.CodeLens>();
    private _codeActions = new WeakMap<languages.CodeAction, vscode.CodeAction>();
    private _colorInformations = new WeakMap<languages.IColorInformation, vscode.ColorInformation>();
    private _diagnostics = new WeakMap<editor.IMarkerData, vscode.Diagnostic>();

	constructor(private readonly _worker: WorkerAccessor<T>) { }

	async provideDocumentSymbols(model: editor.ITextModel, token: CancellationToken): Promise<languages.DocumentSymbol[] | null | undefined> {
		const worker = await this._worker(model.uri);
		const codeResult = await worker.findDocumentSymbols(model.uri.toString());
		if (codeResult) {
			return codeResult.map(code2monaco.asDocumentSymbol);
		}
    }

    async provideDocumentHighlights(model: editor.ITextModel, position: Position, token: CancellationToken): Promise<languages.DocumentHighlight[] | null | undefined> {
		const worker = await this._worker(model.uri);
        const codeResult = await worker.findDocumentHighlights(
            model.uri.toString(),
            monaco2code.asPosition(position),
        );
        if (codeResult) {
            return codeResult.map(code2monaco.asDocumentHighlight);
        }
    }

    async provideLinkedEditingRanges(model: editor.ITextModel, position: Position, token: CancellationToken): Promise<languages.LinkedEditingRanges | null | undefined> {
		const worker = await this._worker(model.uri);
        const codeResult = await worker.findLinkedEditingRanges(
			model.uri.toString(),
			monaco2code.asPosition(position),
		);
		if (codeResult) {
			return {
				ranges: codeResult.ranges.map(code2monaco.asRange),
				wordPattern: codeResult.wordPattern ? new RegExp(codeResult.wordPattern) : undefined,
			};
		}
    }

    async provideDefinition(model: editor.ITextModel, position: Position, token: CancellationToken): Promise<languages.Definition | null | undefined> {
		const worker = await this._worker(model.uri);
        const codeResult = await worker.findDefinition(
            model.uri.toString(),
            monaco2code.asPosition(position),
        );
        // TODO: can't show if only one result from libs
        if (codeResult) {
            return codeResult.map(code2monaco.asLocation);
        }
    }

    async provideImplementation(model: editor.ITextModel, position: Position, token: CancellationToken): Promise<languages.Definition | null | undefined> {
		const worker = await this._worker(model.uri);
        const codeResult = await worker.findImplementations(
            model.uri.toString(),
            monaco2code.asPosition(position),
        );
        if (codeResult) {
            return codeResult.map(code2monaco.asLocation);
        }
    }

    async provideTypeDefinition(model: editor.ITextModel, position: Position, token: CancellationToken): Promise<languages.Definition | null | undefined> {
		const worker = await this._worker(model.uri);
        const codeResult = await worker.findTypeDefinition(
            model.uri.toString(),
            monaco2code.asPosition(position),
        );
        if (codeResult) {
            return codeResult.map(code2monaco.asLocation);
        }
    }

    async provideCodeLenses(model: editor.ITextModel, token: CancellationToken): Promise<languages.CodeLensList | null | undefined> {
		const worker = await this._worker(model.uri);
        const codeResult = await worker.doCodeLens(
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

		const worker = await this._worker(model.uri);
        const codeResult = await worker.doCodeActions(
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

    autoFormatTriggerCharacters = ['}', ';', '\n']

    async provideDocumentFormattingEdits(model: editor.ITextModel, options: languages.FormattingOptions, token: CancellationToken): Promise<languages.TextEdit[] | null | undefined> {
        const worker = await this._worker(model.uri);
		const codeResult = await worker.format(
			model.uri.toString(),
			monaco2code.asFormattingOptions(options),
		);
		if (codeResult) {
			return codeResult.map(code2monaco.asTextEdit);
		}
    }

    async provideDocumentRangeFormattingEdits(model: editor.ITextModel, range: Range, options: languages.FormattingOptions, token: CancellationToken): Promise<languages.TextEdit[] | null | undefined> {
        const worker = await this._worker(model.uri);
        const codeResult = await worker.format(
			model.uri.toString(),
			monaco2code.asFormattingOptions(options),
			monaco2code.asRange(range),
		);
		if (codeResult) {
			return codeResult.map(code2monaco.asTextEdit);
		}
    }

    async provideOnTypeFormattingEdits(model: editor.ITextModel, position: Position, ch: string, options: languages.FormattingOptions, token: CancellationToken): Promise<languages.TextEdit[] | null | undefined> {
        const worker = await this._worker(model.uri);
        const codeResult = await worker.format(
			model.uri.toString(),
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

    async provideLinks(model: editor.ITextModel, token: CancellationToken): Promise<languages.ILinksList | null | undefined> {
        const worker = await this._worker(model.uri);
        const codeResult = await worker.findDocumentLinks(
            model.uri.toString(),
        );
        if (codeResult) {
            return {
                links: codeResult.map(code2monaco.asLink),
            };
        }
    }

    triggerCharacters = '!@#$%^&*()_+-=`~{}|[]\:";\'<>?,./ '.split('')


    async provideCompletionItems(model: editor.ITextModel, position: Position, context: languages.CompletionContext, token: CancellationToken): Promise<languages.CompletionList | null | undefined> {
        const worker = await this._worker(model.uri);
        const codeResult = await worker.doComplete(
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

    async provideDocumentColors(model: editor.ITextModel, token: CancellationToken): Promise<languages.IColorInformation[] | null | undefined> {
        const worker = await this._worker(model.uri);
        const codeResult = await worker.findDocumentColors(model.uri.toString());
		if (codeResult) {
			return codeResult.map(code2monaco.asColorInformation);
		}
    }

    async provideColorPresentations (model: editor.ITextModel, monacoResult: languages.IColorInformation) {
        const worker = await this._worker(model.uri);
        const codeResult = this._colorInformations.get(monacoResult);
        if (codeResult) {
			
            const codeColors = await worker.getColorPresentations(
                model.uri.toString(),
                codeResult.color,
                {
                    start: monaco2code.asPosition(model.getPositionAt(0)),
                    end: monaco2code.asPosition(model.getPositionAt(model.getValueLength())),
                },
            );
            if (codeColors) {
                return codeColors.map(code2monaco.asColorPresentation);
            }
        }
    }

    async provideFoldingRanges(model: editor.ITextModel, context: languages.FoldingContext, token: CancellationToken): Promise<languages.FoldingRange[] | null | undefined> {
        const worker = await this._worker(model.uri);
        const codeResult = await worker.getFoldingRanges(model.uri.toString());
		if (codeResult) {
			return codeResult.map(code2monaco.asFoldingRange);
		}
    }

    async provideDeclaration(model: editor.ITextModel, position: Position, token: CancellationToken): Promise<languages.Definition | null | undefined> {
        const worker = await this._worker(model.uri);
        const codeResult = await worker.findDefinition(
            model.uri.toString(),
            monaco2code.asPosition(position),
        );
        if (codeResult) {
            return codeResult.map(code2monaco.asLocation);
        }
    }

    async provideSelectionRanges(model: editor.ITextModel, positions: Position[], token: CancellationToken): Promise<languages.SelectionRange[][] | null | undefined> {
        const worker = await this._worker(model.uri);
		const codeResults = await Promise.all(positions.map(position => worker.getSelectionRanges(
			model.uri.toString(),
			[monaco2code.asPosition(position)],
		)));
		return codeResults.map(codeResult => codeResult?.map(code2monaco.asSelectionRange) ?? []);

    }

    signatureHelpTriggerCharacters = ['(', ',']

    async provideSignatureHelp(model: editor.ITextModel, position: Position, token: CancellationToken, context: languages.SignatureHelpContext): Promise<languages.SignatureHelpResult | null | undefined> {
        const worker = await this._worker(model.uri);
        const codeResult = await worker.getSignatureHelp(
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
        const worker = await this._worker(model.uri);
        const codeResult = await worker.doRename(
            model.uri.toString(),
            monaco2code.asPosition(position),
            newName,
        );
        if (codeResult) {
            return code2monaco.asWorkspaceEdit(codeResult);
        }
    }

    async provideReferences(model: editor.ITextModel, position: Position, context: languages.ReferenceContext, token: CancellationToken): Promise<languages.Location[] | null | undefined> {
        const worker = await this._worker(model.uri);
        const codeResult = await worker.findReferences(
            model.uri.toString(),
            monaco2code.asPosition(position),
        );
        // TODO: can't show if only one result from libs
        if (codeResult) {
            return codeResult.map(code2monaco.asLocation);
        }
    }

    async provideInlayHints(model: editor.ITextModel, range: Range, token: CancellationToken): Promise<languages.InlayHintList | null | undefined> {
        const worker = await this._worker(model.uri);
        const codeResult = await worker.getInlayHints(
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
        const worker = await this._worker(model.uri);
        const codeResult = await worker.doHover(
            model.uri.toString(),
            monaco2code.asPosition(position),
        );
        console.log(codeResult);
        if (codeResult) {
            return code2monaco.asHover(codeResult);
        }    
    }
}

export function setupMode(defaults: LanguageServiceDefaults): IDisposable {
	const disposables: IDisposable[] = [];
	const providers: IDisposable[] = [];

	const client = new WorkerManager(defaults);
	disposables.push(client);

	const worker: WorkerAccessor<VueWorker> = (
		...uris: Uri[]
	): Promise<VueWorker> => {
		return client.getLanguageServiceWorker(...uris);
	};

	function registerProviders(): void {
		const { languageId } = defaults;

		disposeAll(providers);

		const adapter = new WorkerAdapter(worker);

		providers.push(
			languages.registerHoverProvider(languageId, adapter),
			languages.registerReferenceProvider(languageId, adapter),
			languages.registerRenameProvider(languageId, adapter),
			languages.registerSignatureHelpProvider(languageId, adapter),
			languages.registerDocumentSymbolProvider(languageId, adapter),
			languages.registerDocumentHighlightProvider(languageId, adapter),
			languages.registerLinkedEditingRangeProvider(languageId, adapter),
			languages.registerDefinitionProvider(languageId, adapter),
			languages.registerImplementationProvider(languageId, adapter),
			languages.registerTypeDefinitionProvider(languageId, adapter),
			languages.registerCodeLensProvider(languageId, adapter),
			languages.registerCodeActionProvider(languageId, adapter),
			languages.registerDocumentFormattingEditProvider(languageId, adapter),
			languages.registerDocumentRangeFormattingEditProvider(languageId, adapter),
			languages.registerOnTypeFormattingEditProvider(languageId, adapter),
			languages.registerLinkProvider(languageId, adapter),
			languages.registerCompletionItemProvider(languageId, adapter),
			languages.registerColorProvider(languageId, adapter),
			languages.registerFoldingRangeProvider(languageId, adapter),
			languages.registerDeclarationProvider(languageId, adapter),
			languages.registerSelectionRangeProvider(languageId, adapter),
			languages.registerInlayHintsProvider(languageId, adapter),
		);
	}

	registerProviders();

	let modeConfiguration = defaults.modeConfiguration;
	defaults.onDidChange((newDefaults) => {
		if (newDefaults.modeConfiguration !== modeConfiguration) {
			modeConfiguration = newDefaults.modeConfiguration;
			registerProviders();
		}
	});

	disposables.push(asDisposable(providers));

	return asDisposable(disposables);
}

function asDisposable(disposables: IDisposable[]): IDisposable {
	return { dispose: () => disposeAll(disposables) };
}

function disposeAll(disposables: IDisposable[]) {
	while (disposables.length) {
		disposables.pop()!.dispose();
	}
}
