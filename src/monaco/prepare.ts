import { Uri, editor, languages } from 'monaco-editor-core';

import libEs5Content from 'typescript/lib/lib.es5.d.ts?raw';
import libDomContent from 'typescript/lib/lib.dom.d.ts?raw';
import libDtsContent from 'typescript/lib/lib.d.ts?raw';
import libPromiseContent from 'typescript/lib/lib.es2015.promise.d.ts?raw';
import vueContent from 'vue/dist/vue.d.ts?raw';
import vueRuntimeCoreContent from '@vue/runtime-core/dist/runtime-core.d.ts?raw';
import vueRuntimeDomContent from '@vue/runtime-dom/dist/runtime-dom.d.ts?raw';
import vueReactivityContent from '@vue/reactivity/dist/reactivity.d.ts?raw';
import vueSharedContent from '@vue/shared/dist/shared.d.ts?raw';
import { getOrCreateModel } from './utils';

export function prepareServiceVirtualFiles() {
    const libEs5Url = Uri.parse('file:///lib.es5.d.ts');
    const libDomUrl = Uri.parse('file:///lib.dom.d.ts');
    const libDtsUrl = Uri.parse('file:///lib.d.ts');
    const libPromiseUrl = Uri.parse('file:///lib.es2015.promise.d.ts');

    const libEs5Model = getOrCreateModel(libEs5Url, 'typescript', libEs5Content);
    const libDomModel = getOrCreateModel(libDomUrl, 'typescript', libDomContent);
    const libDtsModel = getOrCreateModel(libDtsUrl, 'typescript', libDtsContent);
    const libPromiseModel = getOrCreateModel(libPromiseUrl, 'typescript', libPromiseContent);

    const vueUrl = Uri.parse('file:///node_modules/vue/index.d.ts');
    const vueRuntimeDomUrl = Uri.parse('file:///node_modules/%40vue/runtime-dom/index.d.ts');
    const vueRuntimeCoreUrl = Uri.parse('file:///node_modules/%40vue/runtime-core/index.d.ts');
    const vueSharedUrl = Uri.parse('file:///node_modules/%40vue/shared/index.d.ts');
    const vueReactivityUrl = Uri.parse('file:///node_modules/%40vue/reactivity/index.d.ts');

    const vueModel = getOrCreateModel(vueUrl, 'typescript', vueContent);
    const vueRuntimeDomModel = getOrCreateModel(vueRuntimeDomUrl, 'typescript', vueRuntimeDomContent);
    const vueRuntimeCoreModel = getOrCreateModel(vueRuntimeCoreUrl, 'typescript', vueRuntimeCoreContent);
    const vueSharedModel = getOrCreateModel(vueSharedUrl, 'typescript', vueSharedContent);
    const vueReactivityModel = getOrCreateModel(vueReactivityUrl, 'typescript', vueReactivityContent);

    const localMap = new Map<string, editor.ITextModel>();
    localMap.set(libEs5Url.fsPath, libEs5Model);
    localMap.set(libDomUrl.fsPath, libDomModel);
    localMap.set(libPromiseUrl.fsPath, libPromiseModel);
    localMap.set(libDtsUrl.fsPath, libDtsModel);

    const nodeModulesMap = new Map<string, editor.ITextModel>();
    nodeModulesMap.set(vueUrl.fsPath, vueModel);
    nodeModulesMap.set(vueRuntimeDomUrl.fsPath, vueRuntimeDomModel);
    nodeModulesMap.set(vueRuntimeCoreUrl.fsPath, vueRuntimeCoreModel);
    nodeModulesMap.set(vueSharedUrl.fsPath, vueSharedModel);
    nodeModulesMap.set(vueReactivityUrl.fsPath, vueReactivityModel);

    languages.typescript.typescriptDefaults.addExtraLib(libEs5Model.getValue(), libEs5Url.toString());
    languages.typescript.typescriptDefaults.addExtraLib(libDomModel.getValue(), libDomUrl.toString());
    languages.typescript.typescriptDefaults.addExtraLib(libPromiseModel.getValue(), libPromiseUrl.toString());
    languages.typescript.typescriptDefaults.addExtraLib(libDtsModel.getValue(), libDtsUrl.toString());

    return {
        localMap,
        nodeModulesMap
    }
}