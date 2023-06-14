// @ts-ignore
import * as worker from 'monaco-editor-core/esm/vs/editor/editor.worker';
import type * as monaco from 'monaco-editor-core';
import * as ts from 'typescript';
import { Config, resolveConfig } from '@vue/language-service';
import { createLanguageService } from '@volar/monaco/worker';
import createTypeScriptService from 'volar-service-typescript';

self.onmessage = () => {
  worker.initialize((ctx: monaco.worker.IWorkerContext) => {

    const compilerOptions: ts.CompilerOptions = {
      ...ts.getDefaultCompilerOptions(),
      allowJs: true,
      jsx: ts.JsxEmit.Preserve,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
    };
    const baseConfig: Config = {
      services: {
        typescript: createTypeScriptService({ dtsHost: ctx.host }),
      },
    };

    return createLanguageService({
      workerContext: ctx,
      config: resolveConfig(baseConfig, compilerOptions, {}, ts as any),
      typescript: {
        module: ts as any,
        compilerOptions,
      },
    });
  });
};
