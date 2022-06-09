/* eslint-disable sonarjs/no-duplicate-string */
import * as monaco from 'monaco-editor';
import type * as vscode from 'vscode-languageserver-protocol';
import * as ts from 'typescript/lib/tsserverlibrary';
import { createLanguageService, type LanguageService, type LanguageServiceHost } from '@volar/vue-language-service';
import type { Ref } from 'vue';
import { onBeforeUnmount, ref } from 'vue';
import * as code2monaco from './code2monaco';
import * as monaco2code from './monaco2code';
import libEs5Content from 'typescript/lib/lib.es5.d.ts?raw';
import libDomContent from 'typescript/lib/lib.dom.d.ts?raw';
import libDtsContent from 'typescript/lib/lib.d.ts?raw';
import libPromiseContent from 'typescript/lib/lib.es2015.promise.d.ts?raw';
import vueContent from 'vue/dist/vue.d.ts?raw';
import vueRuntimeCoreContent from '@vue/runtime-core/dist/runtime-core.d.ts?raw';
import vueRuntimeDomContent from '@vue/runtime-dom/dist/runtime-dom.d.ts?raw';
import vueReactivityContent from '@vue/reactivity/dist/reactivity.d.ts?raw';
import vueSharedContent from '@vue/shared/dist/shared.d.ts?raw';

const lang = 'vue';

export function getOrCreateModel(uri: monaco.Uri, lang: string, value: string) {
    const model = monaco.editor.getModel(uri);
    if (model) {
        model.setValue(value);
        return model;
    }
    return monaco.editor.createModel(value, lang, uri);
}

const disposables = ref<monaco.IDisposable[]>([]);
onBeforeUnmount(() => {
    disposables.value.forEach((x) => {
        x.dispose();
    });
});

export async function setupLs(modelsMap: Ref<Map<string, monaco.editor.ITextModel>>): Promise<LanguageService> {
    const libEs5Url = monaco.Uri.parse('file:///lib.es5.d.ts');
    const libDomUrl = monaco.Uri.parse('file:///lib.dom.d.ts');
    const libDtsUrl = monaco.Uri.parse('file:///lib.d.ts');
    const libPromiseUrl = monaco.Uri.parse('file:///lib.es2015.promise.d.ts');

    const libEs5Model = getOrCreateModel(libEs5Url, 'typescript', libEs5Content);
    const libDomModel = getOrCreateModel(libDomUrl, 'typescript', libDomContent);
    const libDtsModel = getOrCreateModel(libDtsUrl, 'typescript', libDtsContent);
    const libPromiseModel = getOrCreateModel(libPromiseUrl, 'typescript', libPromiseContent);

    const vueUrl = monaco.Uri.parse('file:///node_modules/vue/index.d.ts');
    const vueRuntimeDomUrl = monaco.Uri.parse('file:///node_modules/%40vue/runtime-dom/index.d.ts');
    const vueRuntimeCoreUrl = monaco.Uri.parse('file:///node_modules/%40vue/runtime-core/index.d.ts');
    const vueSharedUrl = monaco.Uri.parse('file:///node_modules/%40vue/shared/index.d.ts');
    const vueReactivityUrl = monaco.Uri.parse('file:///node_modules/%40vue/reactivity/index.d.ts');

    const vueModel = getOrCreateModel(vueUrl, 'typescript', vueContent);
    const vueRuntimeDomModel = getOrCreateModel(vueRuntimeDomUrl, 'typescript', vueRuntimeDomContent);
    const vueRuntimeCoreModel = getOrCreateModel(vueRuntimeCoreUrl, 'typescript', vueRuntimeCoreContent);
    const vueSharedModel = getOrCreateModel(vueSharedUrl, 'typescript', vueSharedContent);
    const vueReactivityModel = getOrCreateModel(vueReactivityUrl, 'typescript', vueReactivityContent);

    const localMap = new Map<string, monaco.editor.ITextModel>();
    localMap.set(libEs5Url.fsPath, libEs5Model);
    localMap.set(libDomUrl.fsPath, libDomModel);
    localMap.set(libPromiseUrl.fsPath, libPromiseModel);
    localMap.set(libDtsUrl.fsPath, libDtsModel);

    const nodeModulesMap = new Map<string, monaco.editor.ITextModel>();
    nodeModulesMap.set(vueUrl.fsPath, vueModel);
    nodeModulesMap.set(vueRuntimeDomUrl.fsPath, vueRuntimeDomModel);
    nodeModulesMap.set(vueRuntimeCoreUrl.fsPath, vueRuntimeCoreModel);
    nodeModulesMap.set(vueSharedUrl.fsPath, vueSharedModel);
    nodeModulesMap.set(vueReactivityUrl.fsPath, vueReactivityModel);

    monaco.languages.typescript.typescriptDefaults.addExtraLib(libEs5Model.getValue(), libEs5Url.toString());
    monaco.languages.typescript.typescriptDefaults.addExtraLib(libDomModel.getValue(), libDomUrl.toString());
    monaco.languages.typescript.typescriptDefaults.addExtraLib(libPromiseModel.getValue(), libPromiseUrl.toString());
    monaco.languages.typescript.typescriptDefaults.addExtraLib(libDtsModel.getValue(), libDtsUrl.toString());

    const scriptSnapshots = new Map<string, ts.IScriptSnapshot>();

    const host: LanguageServiceHost = {
        readFile(fileName) {
            return modelsMap.value.get(fileName)?.getValue()
                ?? localMap.get(fileName)?.getValue()
                ?? nodeModulesMap.get(fileName)?.getValue();
        },
        fileExists(fileName) {
            return modelsMap.value.has(fileName)
                || localMap.has(fileName)
                || nodeModulesMap.has(fileName);
        },
        getCompilationSettings(): ts.CompilerOptions {
            console.log('getCompilationSettings');
            return {
                ...ts.getDefaultCompilerOptions(),
                allowJs: true,
                jsx: ts.JsxEmit.Preserve,
                module: ts.ModuleKind.ESNext,
                moduleResolution: ts.ModuleResolutionKind.NodeJs,
                lib: [...localMap.keys(), ...nodeModulesMap.keys()],
            };
        },
        getVueCompilationSettings() {
            return {};
        },
        getScriptFileNames(): string[] {
            console.log('getScriptFileNames');
            return [...Array.from(modelsMap.value.keys())];
        },
        getScriptVersion(fileName: string): string {
            if (localMap.has(fileName)) {
                return localMap.get(fileName)!.getVersionId().toString();
            }
            if (nodeModulesMap.has(fileName)) {
                return nodeModulesMap.get(fileName)!.getVersionId().toString();
            }

            return modelsMap.value.get(fileName)?.getVersionId().toString() ?? 'unknown version';
        },
        getScriptSnapshot(fileName: string): ts.IScriptSnapshot | undefined {
            console.log('getScriptSnapshot', fileName);
            let scriptSnapshot = scriptSnapshots.get(fileName);
            if (!scriptSnapshot || scriptSnapshot.getText(0, scriptSnapshot.getLength()) !== this.readFile(fileName)) {
                const fileContent = this.readFile(fileName);
                if (fileContent !== undefined) {
                    scriptSnapshot = ts.ScriptSnapshot.fromString(fileContent);
                    scriptSnapshots.set(fileName, scriptSnapshot);
                }
            }
            return scriptSnapshot;
        },
        getCurrentDirectory(): string {
            console.log('getCurrentDirectory');
            return '/';
        },
        getDefaultLibFileName(options: ts.CompilerOptions): string {
            console.log('getDefaultLibFileName', ts.getDefaultLibFileName(options));

            return ts.getDefaultLibFileName(options);
        },
    };
    const sys: ts.System = {
        args: [],
        newLine: '\n',
        useCaseSensitiveFileNames: false,
        write(s: string): void {
            throw new Error('Function not implemented.');
        },
        readFile(path: string, encoding?: string): string | undefined {
            throw new Error('Function not implemented.');
        },
        writeFile(path: string, data: string, writeByteOrderMark?: boolean): void {
            throw new Error('Function not implemented.');
        },
        resolvePath(path: string): string {
            throw new Error('Function not implemented.');
        },
        fileExists(path: string): boolean {
            throw new Error('Function not implemented.');
        },
        directoryExists(path: string): boolean {
            throw new Error('Function not implemented.');
        },
        createDirectory(path: string): void {
            throw new Error('Function not implemented.');
        },
        getExecutingFilePath(): string {
            throw new Error('Function not implemented.');
        },
        getCurrentDirectory(): string {
            throw new Error('Function not implemented.');
        },
        getDirectories(path: string): string[] {
            throw new Error('Function not implemented.');
        },
        readDirectory(
            path: string,
            extensions?: readonly string[],
            exclude?: readonly string[],
            include?: readonly string[],
            depth?: number,
        ): string[] {
            throw new Error('Function not implemented.');
        },
        exit(exitCode?: number): void {
            throw new Error('Function not implemented.');
        },
    };
    const tsWithAny = ts as any;
    tsWithAny.setSys(sys);

    const ls = createLanguageService({ typescript: ts }, host, undefined, undefined, undefined, []);
    disposables.value.push(ls);

    const completionItems = new WeakMap<monaco.languages.CompletionItem, vscode.CompletionItem>();

    disposables.value.push(
        monaco.languages.registerCompletionItemProvider(lang, {
            // https://github.com/johnsoncodehk/volar/blob/2f786182250d27e99cc3714fbfc7d209616e2289/packages/vue-language-server/src/registers/registerlanguageFeatures.ts#L57
            triggerCharacters: '!@#$%^&*()_+-=`~{}|[]\:";\'<>?,./ '.split(''),
            provideCompletionItems: async (model, position, context) => {
                const codeResult = await ls.doComplete(
                    model.uri.toString(),
                    monaco2code.asPosition(position),
                    monaco2code.asCompletionContext(context),
                );
                const monacoResult = code2monaco.asCompletionList(codeResult);
                for (let i = 0; i < codeResult.items.length; i++) {
                    const codeItem = codeResult.items[i];
                    const monacoItem = monacoResult.suggestions[i];
                    completionItems.set(monacoItem, codeItem);
                }
                return monacoResult;
            },
            resolveCompletionItem: async (monacoItem, token) => {
                let codeItem = completionItems.get(monacoItem);
                if (codeItem) {
                    codeItem = await ls.doCompletionResolve(codeItem);
                    monacoItem = code2monaco.asCompletionItem(codeItem);
                    completionItems.set(monacoItem, codeItem);
                }
                return monacoItem;
            },
        }),
        monaco.languages.registerHoverProvider(lang, {
            provideHover: async (model, position) => {
                const codeResult = await ls.doHover(
                    model.uri.toString(),
                    monaco2code.asPosition(position),
                );
                if (codeResult) {
                    return code2monaco.asHover(codeResult);
                }
            },
        }),
        monaco.languages.registerDefinitionProvider(lang, {
            provideDefinition: async (model, position) => {
                const codeResult = await ls.findDefinition(
                    model.uri.toString(),
                    monaco2code.asPosition(position),
                );
                // TODO: can't show if only one result from libs
                if (codeResult) {
                    return codeResult.map(code2monaco.asLocation);
                }
            },
        }),
        monaco.languages.registerSignatureHelpProvider(lang, {
            signatureHelpTriggerCharacters: ['(', ','],
            provideSignatureHelp: async (model, position) => {
                const codeResult = await ls.getSignatureHelp(
                    model.uri.toString(),
                    monaco2code.asPosition(position),
                );
                if (codeResult) {
                    return {
                        value: code2monaco.asSignatureHelp(codeResult),
                        dispose: () => { },
                    };
                }
            },
        }),
    );

    return ls;
}

export function setupValidate(editor: monaco.editor.IStandaloneCodeEditor, ls: LanguageService) {
    const worker = async () => {
        const model = editor.getModel();
        if (!model) {
            throw new Error('No model');
        }

        const diagnostics = await ls.doValidation(model.uri.toString());
        monaco.editor.setModelMarkers(
            model,
            lang,
            diagnostics.map((diagnostic) => {
                return {
                    severity: diagnostic.severity === 1 ? monaco.MarkerSeverity.Error : monaco.MarkerSeverity.Warning,
                    startLineNumber: diagnostic.range.start.line + 1,
                    startColumn: diagnostic.range.start.character + 1,
                    endLineNumber: diagnostic.range.end.line + 1,
                    endColumn: diagnostic.range.end.character + 1,
                    message: diagnostic.message,
                };
            }),
        );
    };

    disposables.value.push(
        editor.onDidChangeModelContent(() => {
            worker();
        }),
    );
    disposables.value.push(
        editor.onDidChangeModel(() => {
            worker();
        }),
    );
}
