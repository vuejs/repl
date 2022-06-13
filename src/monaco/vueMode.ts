import { WorkerManager } from './workerManager';
import { type IVueWorker, VueWorker, WorkerTriggerCharacters } from './vueWorker';
import { LanguageServiceDefaults } from './monaco.contribution';

import { Uri, editor, Position, CancellationToken, languages, Range, type IDisposable } from 'monaco-editor-core';

export interface WorkerAccessor<T> {
	(...more: Uri[]): Promise<T>;
}
class WorkerAdapter<T extends IVueWorker> extends WorkerTriggerCharacters implements IVueWorker {
	constructor(private readonly _worker: WorkerAccessor<T>) {
		super();
	}

	provideHover(model: editor.ITextModel, position: Position, token: CancellationToken): languages.ProviderResult<languages.Hover> {
		return this._worker(model.uri).then(worker => worker.provideHover(model, position, token));
	}
	provideDocumentSymbols(model: editor.ITextModel, token: CancellationToken): languages.ProviderResult<languages.DocumentSymbol[]> {
		return this._worker(model.uri).then(worker => worker.provideDocumentSymbols(model, token));
	}
	provideDocumentHighlights(model: editor.ITextModel, position: Position, token: CancellationToken): languages.ProviderResult<languages.DocumentHighlight[]> {
		return this._worker(model.uri).then(worker => worker.provideDocumentHighlights(model, position, token));
	}
	provideLinkedEditingRanges(model: editor.ITextModel, position: Position, token: CancellationToken): languages.ProviderResult<languages.LinkedEditingRanges> {
		return this._worker(model.uri).then(worker => worker.provideLinkedEditingRanges(model, position, token));
	}
	provideDefinition(model: editor.ITextModel, position: Position, token: CancellationToken): languages.ProviderResult<languages.Definition> {
		return this._worker(model.uri).then(worker => worker.provideDefinition(model, position, token));
	}
	provideImplementation(model: editor.ITextModel, position: Position, token: CancellationToken): languages.ProviderResult<languages.Definition> {
		return this._worker(model.uri).then(worker => worker.provideImplementation(model, position, token));
	}
	provideTypeDefinition(model: editor.ITextModel, position: Position, token: CancellationToken): languages.ProviderResult<languages.Definition> {
		return this._worker(model.uri).then(worker => worker.provideTypeDefinition(model, position, token));
	}
	provideCodeLenses(model: editor.ITextModel, token: CancellationToken): languages.ProviderResult<languages.CodeLensList> {
		return this._worker(model.uri).then(worker => worker.provideCodeLenses(model, token));
	}
	provideCodeActions(model: editor.ITextModel, range: Range, context: languages.CodeActionContext, token: CancellationToken): languages.ProviderResult<languages.CodeActionList> {
		return this._worker(model.uri).then(worker => worker.provideCodeActions(model, range, context, token));
	}
	provideDocumentFormattingEdits(model: editor.ITextModel, options: languages.FormattingOptions, token: CancellationToken): languages.ProviderResult<languages.TextEdit[]> {
		return this._worker(model.uri).then(worker => worker.provideDocumentFormattingEdits(model, options, token));
	}
	provideDocumentRangeFormattingEdits(model: editor.ITextModel, range: Range, options: languages.FormattingOptions, token: CancellationToken): languages.ProviderResult<languages.TextEdit[]> {
		return this._worker(model.uri).then(worker => worker.provideDocumentRangeFormattingEdits(model, range, options, token));
	}
	provideOnTypeFormattingEdits(model: editor.ITextModel, position: Position, ch: string, options: languages.FormattingOptions, token: CancellationToken): languages.ProviderResult<languages.TextEdit[]> {
		return this._worker(model.uri).then(worker => worker.provideOnTypeFormattingEdits(model, position, ch, options, token));
	}
	provideLinks(model: editor.ITextModel, token: CancellationToken): languages.ProviderResult<languages.ILinksList> {
		return this._worker(model.uri).then(worker => worker.provideLinks(model, token));
	}
	provideCompletionItems(model: editor.ITextModel, position: Position, context: languages.CompletionContext, token: CancellationToken): languages.ProviderResult<languages.CompletionList> {
		return this._worker(model.uri).then(worker => worker.provideCompletionItems(model, position, context, token));
	}
	provideDocumentColors(model: editor.ITextModel, token: CancellationToken): languages.ProviderResult<languages.IColorInformation[]> {
		return this._worker(model.uri).then(worker => worker.provideDocumentColors(model, token));
	}
	provideColorPresentations(model: editor.ITextModel, colorInfo: languages.IColorInformation, token: CancellationToken): languages.ProviderResult<languages.IColorPresentation[]> {
		return this._worker(model.uri).then(worker => worker.provideColorPresentations(model, colorInfo, token));
	}
	provideFoldingRanges(model: editor.ITextModel, context: languages.FoldingContext, token: CancellationToken): languages.ProviderResult<languages.FoldingRange[]> {
		return this._worker(model.uri).then(worker => worker.provideFoldingRanges(model, context, token));
	}
	provideDeclaration(model: editor.ITextModel, position: Position, token: CancellationToken): languages.ProviderResult<languages.Definition> {
		return this._worker(model.uri).then(worker => worker.provideDeclaration(model, position, token));
	}
	provideSignatureHelp(model: editor.ITextModel, position: Position, token: CancellationToken, context: languages.SignatureHelpContext): languages.ProviderResult<languages.SignatureHelpResult> {
		return this._worker(model.uri).then(worker => worker.provideSignatureHelp(model, position, token, context));
	}
	provideRenameEdits(model: editor.ITextModel, position: Position, newName: string, token: CancellationToken): languages.ProviderResult<languages.WorkspaceEdit & languages.Rejection> {
		return this._worker(model.uri).then(worker => worker.provideRenameEdits(model, position, newName, token));
	}
	provideReferences(model: editor.ITextModel, position: Position, context: languages.ReferenceContext, token: CancellationToken): languages.ProviderResult<languages.Location[]> {
		return this._worker(model.uri).then(worker => worker.provideReferences(model, position, context, token));
	}
	provideSelectionRanges(model: editor.ITextModel, positions: Position[], token: CancellationToken): languages.ProviderResult<languages.SelectionRange[][]> {
		return this._worker(model.uri).then(worker => worker.provideSelectionRanges(model, positions, token));
	}
	provideInlayHints(model: editor.ITextModel, range: Range, token: CancellationToken): languages.ProviderResult<languages.InlayHintList> {
		return this._worker(model.uri).then(worker => worker.provideInlayHints(model, range, token));
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

export { WorkerManager } from './workerManager';
export { create } from './vueWorker'