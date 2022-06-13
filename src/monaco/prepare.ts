import { Uri, languages } from 'monaco-editor-core';

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

    const libEs5Model = getOrCreateModel(libEs5Url, undefined, libEs5Content);
    const libDomModel = getOrCreateModel(libDomUrl, undefined, libDomContent);
    const libDtsModel = getOrCreateModel(libDtsUrl, undefined, libDtsContent);
    const libPromiseModel = getOrCreateModel(libPromiseUrl, undefined, libPromiseContent);

    const vueUrl = Uri.parse('file:///node_modules/vue/index.d.ts');
    const vueRuntimeDomUrl = Uri.parse('file:///node_modules/%40vue/runtime-dom/index.d.ts');
    const vueRuntimeCoreUrl = Uri.parse('file:///node_modules/%40vue/runtime-core/index.d.ts');
    const vueSharedUrl = Uri.parse('file:///node_modules/%40vue/shared/index.d.ts');
    const vueReactivityUrl = Uri.parse('file:///node_modules/%40vue/reactivity/index.d.ts');

    const vueModel = getOrCreateModel(vueUrl, undefined, vueContent);
    const vueRuntimeDomModel = getOrCreateModel(vueRuntimeDomUrl, undefined, vueRuntimeDomContent);
    const vueRuntimeCoreModel = getOrCreateModel(vueRuntimeCoreUrl, undefined, vueRuntimeCoreContent);
    const vueSharedModel = getOrCreateModel(vueSharedUrl, undefined, vueSharedContent);
    const vueReactivityModel = getOrCreateModel(vueReactivityUrl, undefined, vueReactivityContent);

    languages.vue.vueDefaults.addExtraLib(libEs5Model.uri.fsPath, libEs5Model.getValue());
    languages.vue.vueDefaults.addExtraLib(libDomModel.uri.fsPath, libDomModel.getValue());
    languages.vue.vueDefaults.addExtraLib(libPromiseModel.uri.fsPath, libPromiseModel.getValue());
    languages.vue.vueDefaults.addExtraLib(libDtsModel.uri.fsPath, libDtsModel.getValue());

    languages.vue.vueDefaults.addExtraLib(vueModel.uri.fsPath, vueModel.getValue());
    languages.vue.vueDefaults.addExtraLib(vueRuntimeDomModel.uri.fsPath, vueRuntimeDomModel.getValue());
    languages.vue.vueDefaults.addExtraLib(vueRuntimeCoreModel.uri.fsPath, vueRuntimeCoreModel.getValue());
    languages.vue.vueDefaults.addExtraLib(vueSharedModel.uri.fsPath, vueSharedModel.getValue());
    languages.vue.vueDefaults.addExtraLib(vueReactivityModel.uri.fsPath, vueReactivityModel.getValue());
}