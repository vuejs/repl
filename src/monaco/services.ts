import type { worker } from 'monaco-editor-core';
// import { prepareServiceVirtualFiles } from './prepare';
import * as ts from 'typescript/lib/tsserverlibrary';
import {
    createLanguageService,
    getDocumentService,
    // executePluginCommand,
    type LanguageServiceHost,
    // type ExecutePluginCommandArgs,
    type ConfigurationHost
} from '@volar/vue-language-service';

export function getLanguageServiceAndDocumentsService(
    getModels: () => worker.IMirrorModel[],
    getExtraLibs: () => Record<string, string>
) {
    const scriptSnapshots = new Map<string, ts.IScriptSnapshot>();

    const findInModels = (fileName: string) => {
        return getModels().find(x => {
            return x.uri.toString() === fileName || x.uri.fsPath === fileName
        });
    }

    const findInExtraLibs = (fileName: string): string | undefined => {
        return getExtraLibs()[fileName];
    }

    const host: LanguageServiceHost = {
        readFile(fileName) {
            const model = findInModels(fileName);
            if (model) {
                return model.getValue()
            }

            const extraLibs = findInExtraLibs(fileName);
            return extraLibs
        },
        fileExists(fileName) {
            return !!(findInModels(fileName) || findInExtraLibs(fileName))
        },
        getCompilationSettings(): ts.CompilerOptions {
            return {
                ...ts.getDefaultCompilerOptions(),
                allowJs: true,
                jsx: ts.JsxEmit.Preserve,
                module: ts.ModuleKind.ESNext,
                moduleResolution: ts.ModuleResolutionKind.NodeJs,
            };
        },
        getVueCompilationSettings() {
            return {};
        },
        getScriptFileNames(): string[] {
            const modelNames = getModels().map(x => x.uri.fsPath);
            const extraLibNames = Object.keys(getExtraLibs());
            const fileNames = [...modelNames, ...extraLibNames];
            return fileNames;
        },
        getScriptVersion(fileName: string): string {
            const model = findInModels(fileName);
            if (model) {
                return `${model.version}`
            }

            const extraLibs = findInExtraLibs(fileName);
            if (extraLibs) {
                return '1'
            }

            return 'unknown version';
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
        readFile: host.readFile,
        fileExists: host.fileExists,
        write(s: string): void {
            throw new Error('Function not implemented.');
        },
        writeFile(path: string, data: string, writeByteOrderMark?: boolean): void {
            throw new Error('Function not implemented.');
        },
        resolvePath(path: string): string {
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
    // @ts-expect-error
    ts.setSys(sys);

    const configurationHost: ConfigurationHost = {
        getConfiguration<T>(seation: string): T {
            // disabled because it these required for doExecuteCommand implementation
            if (seation === 'volar.codeLens.pugTools' || seation === 'volar.codeLens.scriptSetupTools') {
                return false as any;
            }
            return undefined as any;
        },
        onDidChangeConfiguration() { },
        rootUris: ['/'],
    };
    const ls = createLanguageService({ typescript: ts }, host, undefined, undefined, configurationHost, []);
    const ds = getDocumentService({ typescript: ts }, configurationHost, undefined, []);

    return {
        ls,
        ds
    }
}