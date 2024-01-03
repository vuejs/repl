import '../../Images/Images.js'
import '../startup/startup.js'
import * as e from '../../core/root/root.js'
import '../../core/platform/platform.js'
import '../../core/dom_extension/dom_extension.js'
import * as t from '../../core/common/common.js'
import * as i from '../../core/i18n/i18n.js'
import * as o from '../../core/sdk/sdk.js'
import * as n from '../../models/workspace/workspace.js'
import * as a from '../../ui/legacy/components/object_ui/object_ui.js'
import * as s from '../../ui/legacy/components/quick_open/quick_open.js'
import * as r from '../../ui/legacy/legacy.js'
import * as l from '../../ui/legacy/components/utils/utils.js'
import '../main/main.js'
import * as c from '../../panels/network/forward/forward.js'
import * as g from '../../models/issues_manager/issues_manager.js'
;(self.Root = self.Root || {}),
  (Root = Root || {}),
  (Root.Runtime = e.Runtime.Runtime),
  (Root.Runtime.experiments = e.Runtime.experiments),
  (Root.Runtime.queryParam = e.Runtime.Runtime.queryParam),
  Root.runtime,
  (Root.Runtime.loadResourcePromise = e.Runtime.loadResourcePromise),
  (Root.Runtime.Extension = e.Runtime.Extension),
  (Root.Runtime.Module = e.Runtime.Module)
const d = {
    showSources: 'Show Sources',
    sources: 'Sources',
    showFilesystem: 'Show Filesystem',
    filesystem: 'Filesystem',
    showSnippets: 'Show Snippets',
    snippets: 'Snippets',
    showSearch: 'Show Search',
    search: 'Search',
    showQuickSource: 'Show Quick source',
    quickSource: 'Quick source',
    showThreads: 'Show Threads',
    threads: 'Threads',
    showScope: 'Show Scope',
    scope: 'Scope',
    showWatch: 'Show Watch',
    watch: 'Watch',
    showBreakpoints: 'Show Breakpoints',
    breakpoints: 'Breakpoints',
    pauseScriptExecution: 'Pause script execution',
    resumeScriptExecution: 'Resume script execution',
    stepOverNextFunctionCall: 'Step over next function call',
    stepIntoNextFunctionCall: 'Step into next function call',
    step: 'Step',
    stepOutOfCurrentFunction: 'Step out of current function',
    runSnippet: 'Run snippet',
    deactivateBreakpoints: 'Deactivate breakpoints',
    activateBreakpoints: 'Activate breakpoints',
    addSelectedTextToWatches: 'Add selected text to watches',
    evaluateSelectedTextInConsole: 'Evaluate selected text in console',
    switchFile: 'Switch file',
    rename: 'Rename',
    closeAll: 'Close All',
    jumpToPreviousEditingLocation: 'Jump to previous editing location',
    jumpToNextEditingLocation: 'Jump to next editing location',
    closeTheActiveTab: 'Close the active tab',
    goToLine: 'Go to line',
    goToAFunctionDeclarationruleSet: 'Go to a function declaration/rule set',
    toggleBreakpoint: 'Toggle breakpoint',
    toggleBreakpointEnabled: 'Toggle breakpoint enabled',
    toggleBreakpointInputWindow: 'Toggle breakpoint input window',
    save: 'Save',
    saveAll: 'Save all',
    createNewSnippet: 'Create new snippet',
    addFolderToWorkspace: 'Add folder to workspace',
    previousCallFrame: 'Previous call frame',
    nextCallFrame: 'Next call frame',
    incrementCssUnitBy: 'Increment CSS unit by {PH1}',
    decrementCssUnitBy: 'Decrement CSS unit by {PH1}',
    searchInAnonymousAndContent: 'Search in anonymous and content scripts',
    doNotSearchInAnonymousAndContent:
      'Do not search in anonymous and content scripts',
    automaticallyRevealFilesIn: 'Automatically reveal files in sidebar',
    doNotAutomaticallyRevealFilesIn:
      'Do not automatically reveal files in sidebar',
    enableJavascriptSourceMaps: 'Enable JavaScript source maps',
    disableJavascriptSourceMaps: 'Disable JavaScript source maps',
    enableTabMovesFocus: 'Enable tab moves focus',
    disableTabMovesFocus: 'Disable tab moves focus',
    detectIndentation: 'Detect indentation',
    doNotDetectIndentation: 'Do not detect indentation',
    autocompletion: 'Autocompletion',
    enableAutocompletion: 'Enable autocompletion',
    disableAutocompletion: 'Disable autocompletion',
    bracketMatching: 'Bracket matching',
    enableBracketMatching: 'Enable bracket matching',
    disableBracketMatching: 'Disable bracket matching',
    codeFolding: 'Code folding',
    enableCodeFolding: 'Enable code folding',
    disableCodeFolding: 'Disable code folding',
    showWhitespaceCharacters: 'Show whitespace characters:',
    doNotShowWhitespaceCharacters: 'Do not show whitespace characters',
    none: 'None',
    showAllWhitespaceCharacters: 'Show all whitespace characters',
    all: 'All',
    showTrailingWhitespaceCharacters: 'Show trailing whitespace characters',
    trailing: 'Trailing',
    displayVariableValuesInlineWhile:
      'Display variable values inline while debugging',
    doNotDisplayVariableValuesInline:
      'Do not display variable values inline while debugging',
    enableCssSourceMaps: 'Enable CSS source maps',
    disableCssSourceMaps: 'Disable CSS source maps',
    allowScrollingPastEndOfFile: 'Allow scrolling past end of file',
    disallowScrollingPastEndOfFile: 'Disallow scrolling past end of file',
    goTo: 'Go to',
    line: 'Line',
    symbol: 'Symbol',
    open: 'Open',
    file: 'File',
    disableAutoFocusOnDebuggerPaused:
      'Do not focus Sources panel when triggering a breakpoint',
    enableAutoFocusOnDebuggerPaused:
      'Focus Sources panel when triggering a breakpoint',
  },
  u = i.i18n.registerUIStrings('panels/sources/sources-meta.ts', d),
  p = i.i18n.getLazilyComputedLocalizedString.bind(void 0, u)
let S
async function m() {
  return S || (S = await import('../../panels/sources/sources.js')), S
}
function y(e) {
  return void 0 === S ? [] : e(S)
}
r.ViewManager.registerViewExtension({
  location: 'panel',
  id: 'sources',
  commandPrompt: p(d.showSources),
  title: p(d.sources),
  order: 30,
  loadView: async () => (await m()).SourcesPanel.SourcesPanel.instance(),
}),
  globalThis.chii ||
    r.ViewManager.registerViewExtension({
      location: 'navigator-view',
      id: 'navigator-files',
      commandPrompt: p(d.showFilesystem),
      title: p(d.filesystem),
      order: 3,
      persistence: 'permanent',
      loadView: async () =>
        (await m()).SourcesNavigator.FilesNavigatorView.instance(),
    }),
  r.ViewManager.registerViewExtension({
    location: 'navigator-view',
    id: 'navigator-snippets',
    commandPrompt: p(d.showSnippets),
    title: p(d.snippets),
    order: 6,
    persistence: 'permanent',
    loadView: async () =>
      (await m()).SourcesNavigator.SnippetsNavigatorView.instance(),
  }),
  r.ViewManager.registerViewExtension({
    location: 'drawer-view',
    id: 'sources.search-sources-tab',
    commandPrompt: p(d.showSearch),
    title: p(d.search),
    order: 7,
    persistence: 'closeable',
    loadView: async () =>
      (await m()).SearchSourcesView.SearchSourcesView.instance(),
  }),
  r.ViewManager.registerViewExtension({
    location: 'drawer-view',
    id: 'sources.quick',
    commandPrompt: p(d.showQuickSource),
    title: p(d.quickSource),
    persistence: 'closeable',
    order: 1e3,
    loadView: async () => (await m()).SourcesPanel.WrapperView.instance(),
  }),
  r.ViewManager.registerViewExtension({
    id: 'sources.threads',
    commandPrompt: p(d.showThreads),
    title: p(d.threads),
    persistence: 'permanent',
    condition: e.Runtime.ConditionName.NOT_SOURCES_HIDE_ADD_FOLDER,
    loadView: async () =>
      (await m()).ThreadsSidebarPane.ThreadsSidebarPane.instance(),
  }),
  r.ViewManager.registerViewExtension({
    id: 'sources.scopeChain',
    commandPrompt: p(d.showScope),
    title: p(d.scope),
    persistence: 'permanent',
    loadView: async () =>
      (await m()).ScopeChainSidebarPane.ScopeChainSidebarPane.instance(),
  }),
  r.ViewManager.registerViewExtension({
    id: 'sources.watch',
    commandPrompt: p(d.showWatch),
    title: p(d.watch),
    persistence: 'permanent',
    loadView: async () =>
      (
        await m()
      ).WatchExpressionsSidebarPane.WatchExpressionsSidebarPane.instance(),
    hasToolbar: !0,
  }),
  r.ViewManager.registerViewExtension({
    id: 'sources.jsBreakpoints',
    commandPrompt: p(d.showBreakpoints),
    title: p(d.breakpoints),
    persistence: 'permanent',
    loadView: async () =>
      (
        await m()
      ).JavaScriptBreakpointsSidebarPane.JavaScriptBreakpointsSidebarPane.instance(),
  }),
  r.ActionRegistration.registerActionExtension({
    category: r.ActionRegistration.ActionCategory.DEBUGGER,
    actionId: 'debugger.toggle-pause',
    iconClass: 'largeicon-pause',
    toggleable: !0,
    toggledIconClass: 'largeicon-resume',
    loadActionDelegate: async () =>
      (await m()).SourcesPanel.RevealingActionDelegate.instance(),
    contextTypes: () =>
      y((e) => [
        e.SourcesView.SourcesView,
        r.ShortcutRegistry.ForwardedShortcut,
      ]),
    options: [
      { value: !0, title: p(d.pauseScriptExecution) },
      { value: !1, title: p(d.resumeScriptExecution) },
    ],
    bindings: [
      { shortcut: 'F8', keybindSets: ['devToolsDefault'] },
      { platform: 'windows,linux', shortcut: 'Ctrl+\\' },
      { shortcut: 'F5', keybindSets: ['vsCode'] },
      { shortcut: 'Shift+F5', keybindSets: ['vsCode'] },
      { platform: 'mac', shortcut: 'Meta+\\' },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    category: r.ActionRegistration.ActionCategory.DEBUGGER,
    actionId: 'debugger.step-over',
    loadActionDelegate: async () =>
      (await m()).SourcesPanel.DebuggingActionDelegate.instance(),
    title: p(d.stepOverNextFunctionCall),
    iconClass: 'largeicon-step-over',
    contextTypes: () => [o.DebuggerModel.DebuggerPausedDetails],
    bindings: [
      { shortcut: 'F10', keybindSets: ['devToolsDefault', 'vsCode'] },
      { platform: 'windows,linux', shortcut: "Ctrl+'" },
      { platform: 'mac', shortcut: "Meta+'" },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    category: r.ActionRegistration.ActionCategory.DEBUGGER,
    actionId: 'debugger.step-into',
    loadActionDelegate: async () =>
      (await m()).SourcesPanel.DebuggingActionDelegate.instance(),
    title: p(d.stepIntoNextFunctionCall),
    iconClass: 'largeicon-step-into',
    contextTypes: () => [o.DebuggerModel.DebuggerPausedDetails],
    bindings: [
      { shortcut: 'F11', keybindSets: ['devToolsDefault', 'vsCode'] },
      { platform: 'windows,linux', shortcut: 'Ctrl+;' },
      { platform: 'mac', shortcut: 'Meta+;' },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    category: r.ActionRegistration.ActionCategory.DEBUGGER,
    actionId: 'debugger.step',
    loadActionDelegate: async () =>
      (await m()).SourcesPanel.DebuggingActionDelegate.instance(),
    title: p(d.step),
    iconClass: 'largeicon-step',
    contextTypes: () => [o.DebuggerModel.DebuggerPausedDetails],
    bindings: [{ shortcut: 'F9', keybindSets: ['devToolsDefault'] }],
  }),
  r.ActionRegistration.registerActionExtension({
    category: r.ActionRegistration.ActionCategory.DEBUGGER,
    actionId: 'debugger.step-out',
    loadActionDelegate: async () =>
      (await m()).SourcesPanel.DebuggingActionDelegate.instance(),
    title: p(d.stepOutOfCurrentFunction),
    iconClass: 'largeicon-step-out',
    contextTypes: () => [o.DebuggerModel.DebuggerPausedDetails],
    bindings: [
      { shortcut: 'Shift+F11', keybindSets: ['devToolsDefault', 'vsCode'] },
      { platform: 'windows,linux', shortcut: 'Shift+Ctrl+;' },
      { platform: 'mac', shortcut: 'Shift+Meta+;' },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'debugger.run-snippet',
    category: r.ActionRegistration.ActionCategory.DEBUGGER,
    loadActionDelegate: async () =>
      (await m()).SourcesPanel.DebuggingActionDelegate.instance(),
    title: p(d.runSnippet),
    iconClass: 'largeicon-play',
    contextTypes: () => y((e) => [e.SourcesView.SourcesView]),
    bindings: [
      { platform: 'windows,linux', shortcut: 'Ctrl+Enter' },
      { platform: 'mac', shortcut: 'Meta+Enter' },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    category: r.ActionRegistration.ActionCategory.DEBUGGER,
    actionId: 'debugger.toggle-breakpoints-active',
    iconClass: 'largeicon-deactivate-breakpoints',
    toggleable: !0,
    loadActionDelegate: async () =>
      (await m()).SourcesPanel.DebuggingActionDelegate.instance(),
    contextTypes: () => y((e) => [e.SourcesView.SourcesView]),
    options: [
      { value: !0, title: p(d.deactivateBreakpoints) },
      { value: !1, title: p(d.activateBreakpoints) },
    ],
    bindings: [
      { platform: 'windows,linux', shortcut: 'Ctrl+F8' },
      { platform: 'mac', shortcut: 'Meta+F8' },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'sources.add-to-watch',
    loadActionDelegate: async () =>
      (
        await m()
      ).WatchExpressionsSidebarPane.WatchExpressionsSidebarPane.instance(),
    category: r.ActionRegistration.ActionCategory.DEBUGGER,
    title: p(d.addSelectedTextToWatches),
    contextTypes: () => y((e) => [e.UISourceCodeFrame.UISourceCodeFrame]),
    bindings: [
      { platform: 'windows,linux', shortcut: 'Ctrl+Shift+A' },
      { platform: 'mac', shortcut: 'Meta+Shift+A' },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'debugger.evaluate-selection',
    category: r.ActionRegistration.ActionCategory.DEBUGGER,
    loadActionDelegate: async () =>
      (await m()).SourcesPanel.DebuggingActionDelegate.instance(),
    title: p(d.evaluateSelectedTextInConsole),
    contextTypes: () => y((e) => [e.UISourceCodeFrame.UISourceCodeFrame]),
    bindings: [
      { platform: 'windows,linux', shortcut: 'Ctrl+Shift+E' },
      { platform: 'mac', shortcut: 'Meta+Shift+E' },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'sources.switch-file',
    category: r.ActionRegistration.ActionCategory.SOURCES,
    title: p(d.switchFile),
    loadActionDelegate: async () =>
      (await m()).SourcesView.SwitchFileActionDelegate.instance(),
    contextTypes: () => y((e) => [e.SourcesView.SourcesView]),
    bindings: [{ shortcut: 'Alt+O' }],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'sources.rename',
    category: r.ActionRegistration.ActionCategory.SOURCES,
    title: p(d.rename),
    bindings: [
      { platform: 'windows,linux', shortcut: 'F2' },
      { platform: 'mac', shortcut: 'Enter' },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    category: r.ActionRegistration.ActionCategory.SOURCES,
    actionId: 'sources.close-all',
    loadActionDelegate: async () =>
      (await m()).SourcesView.ActionDelegate.instance(),
    title: p(d.closeAll),
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'sources.jump-to-previous-location',
    category: r.ActionRegistration.ActionCategory.SOURCES,
    title: p(d.jumpToPreviousEditingLocation),
    loadActionDelegate: async () =>
      (await m()).SourcesView.ActionDelegate.instance(),
    contextTypes: () => y((e) => [e.SourcesView.SourcesView]),
    bindings: [{ shortcut: 'Alt+Minus' }],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'sources.jump-to-next-location',
    category: r.ActionRegistration.ActionCategory.SOURCES,
    title: p(d.jumpToNextEditingLocation),
    loadActionDelegate: async () =>
      (await m()).SourcesView.ActionDelegate.instance(),
    contextTypes: () => y((e) => [e.SourcesView.SourcesView]),
    bindings: [{ shortcut: 'Alt+Plus' }],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'sources.close-editor-tab',
    category: r.ActionRegistration.ActionCategory.SOURCES,
    title: p(d.closeTheActiveTab),
    loadActionDelegate: async () =>
      (await m()).SourcesView.ActionDelegate.instance(),
    contextTypes: () => y((e) => [e.SourcesView.SourcesView]),
    bindings: [
      { shortcut: 'Alt+w' },
      { shortcut: 'Ctrl+W', keybindSets: ['vsCode'] },
      { platform: 'windows', shortcut: 'Ctrl+F4', keybindSets: ['vsCode'] },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'sources.go-to-line',
    category: r.ActionRegistration.ActionCategory.SOURCES,
    title: p(d.goToLine),
    loadActionDelegate: async () =>
      (await m()).SourcesView.ActionDelegate.instance(),
    contextTypes: () => y((e) => [e.SourcesView.SourcesView]),
    bindings: [
      { shortcut: 'Ctrl+g', keybindSets: ['devToolsDefault', 'vsCode'] },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'sources.go-to-member',
    category: r.ActionRegistration.ActionCategory.SOURCES,
    title: p(d.goToAFunctionDeclarationruleSet),
    loadActionDelegate: async () =>
      (await m()).SourcesView.ActionDelegate.instance(),
    contextTypes: () => y((e) => [e.SourcesView.SourcesView]),
    bindings: [
      {
        platform: 'windows,linux',
        shortcut: 'Ctrl+Shift+o',
        keybindSets: ['devToolsDefault', 'vsCode'],
      },
      {
        platform: 'mac',
        shortcut: 'Meta+Shift+o',
        keybindSets: ['devToolsDefault', 'vsCode'],
      },
      { platform: 'mac', shortcut: 'Meta+T', keybindSets: ['vsCode'] },
      {
        platform: 'windows,linux',
        shortcut: 'Ctrl+T',
        keybindSets: ['vsCode'],
      },
      { shortcut: 'F12', keybindSets: ['vsCode'] },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'debugger.toggle-breakpoint',
    category: r.ActionRegistration.ActionCategory.DEBUGGER,
    title: p(d.toggleBreakpoint),
    bindings: [
      { platform: 'windows,linux', shortcut: 'Ctrl+b' },
      { platform: 'mac', shortcut: 'Meta+b' },
      { shortcut: 'F9', keybindSets: ['vsCode'] },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'debugger.toggle-breakpoint-enabled',
    category: r.ActionRegistration.ActionCategory.DEBUGGER,
    title: p(d.toggleBreakpointEnabled),
    bindings: [
      { platform: 'windows,linux', shortcut: 'Ctrl+Shift+b' },
      { platform: 'mac', shortcut: 'Meta+Shift+b' },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'debugger.breakpoint-input-window',
    category: r.ActionRegistration.ActionCategory.DEBUGGER,
    title: p(d.toggleBreakpointInputWindow),
    bindings: [
      { platform: 'windows,linux', shortcut: 'Ctrl+Alt+b' },
      { platform: 'mac', shortcut: 'Meta+Alt+b' },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'sources.save',
    category: r.ActionRegistration.ActionCategory.SOURCES,
    title: p(d.save),
    loadActionDelegate: async () =>
      (await m()).SourcesView.ActionDelegate.instance(),
    contextTypes: () => y((e) => [e.SourcesView.SourcesView]),
    bindings: [
      {
        platform: 'windows,linux',
        shortcut: 'Ctrl+s',
        keybindSets: ['devToolsDefault', 'vsCode'],
      },
      {
        platform: 'mac',
        shortcut: 'Meta+s',
        keybindSets: ['devToolsDefault', 'vsCode'],
      },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'sources.save-all',
    category: r.ActionRegistration.ActionCategory.SOURCES,
    title: p(d.saveAll),
    loadActionDelegate: async () =>
      (await m()).SourcesView.ActionDelegate.instance(),
    contextTypes: () => y((e) => [e.SourcesView.SourcesView]),
    bindings: [
      { platform: 'windows,linux', shortcut: 'Ctrl+Shift+s' },
      { platform: 'mac', shortcut: 'Meta+Alt+s' },
      {
        platform: 'windows,linux',
        shortcut: 'Ctrl+K S',
        keybindSets: ['vsCode'],
      },
      { platform: 'mac', shortcut: 'Meta+Alt+S', keybindSets: ['vsCode'] },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    category: r.ActionRegistration.ActionCategory.SOURCES,
    actionId: 'sources.create-snippet',
    loadActionDelegate: async () =>
      (await m()).SourcesNavigator.ActionDelegate.instance(),
    title: p(d.createNewSnippet),
  }),
  r.ActionRegistration.registerActionExtension({
    category: r.ActionRegistration.ActionCategory.SOURCES,
    actionId: 'sources.add-folder-to-workspace',
    loadActionDelegate: async () =>
      (await m()).SourcesNavigator.ActionDelegate.instance(),
    iconClass: 'largeicon-add',
    title: p(d.addFolderToWorkspace),
    condition: e.Runtime.ConditionName.NOT_SOURCES_HIDE_ADD_FOLDER,
  }),
  r.ActionRegistration.registerActionExtension({
    category: r.ActionRegistration.ActionCategory.DEBUGGER,
    actionId: 'debugger.previous-call-frame',
    loadActionDelegate: async () =>
      (await m()).CallStackSidebarPane.ActionDelegate.instance(),
    title: p(d.previousCallFrame),
    contextTypes: () => [o.DebuggerModel.DebuggerPausedDetails],
    bindings: [{ shortcut: 'Ctrl+,' }],
  }),
  r.ActionRegistration.registerActionExtension({
    category: r.ActionRegistration.ActionCategory.DEBUGGER,
    actionId: 'debugger.next-call-frame',
    loadActionDelegate: async () =>
      (await m()).CallStackSidebarPane.ActionDelegate.instance(),
    title: p(d.nextCallFrame),
    contextTypes: () => [o.DebuggerModel.DebuggerPausedDetails],
    bindings: [{ shortcut: 'Ctrl+.' }],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'sources.search',
    title: p(d.search),
    loadActionDelegate: async () =>
      (await m()).SearchSourcesView.ActionDelegate.instance(),
    category: r.ActionRegistration.ActionCategory.SOURCES,
    bindings: [
      {
        platform: 'mac',
        shortcut: 'Meta+Alt+F',
        keybindSets: ['devToolsDefault'],
      },
      {
        platform: 'windows,linux',
        shortcut: 'Ctrl+Shift+F',
        keybindSets: ['devToolsDefault', 'vsCode'],
      },
      {
        platform: 'windows,linux',
        shortcut: 'Ctrl+Shift+J',
        keybindSets: ['vsCode'],
      },
      { platform: 'mac', shortcut: 'Meta+Shift+F', keybindSets: ['vsCode'] },
      { platform: 'mac', shortcut: 'Meta+Shift+J', keybindSets: ['vsCode'] },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'sources.increment-css',
    category: r.ActionRegistration.ActionCategory.SOURCES,
    title: p(d.incrementCssUnitBy, { PH1: 1 }),
    bindings: [{ shortcut: 'Alt+Up' }],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'sources.increment-css-by-ten',
    title: p(d.incrementCssUnitBy, { PH1: 10 }),
    category: r.ActionRegistration.ActionCategory.SOURCES,
    bindings: [{ shortcut: 'Alt+PageUp' }],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'sources.decrement-css',
    category: r.ActionRegistration.ActionCategory.SOURCES,
    title: p(d.decrementCssUnitBy, { PH1: 1 }),
    bindings: [{ shortcut: 'Alt+Down' }],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'sources.decrement-css-by-ten',
    category: r.ActionRegistration.ActionCategory.SOURCES,
    title: p(d.decrementCssUnitBy, { PH1: 10 }),
    bindings: [{ shortcut: 'Alt+PageDown' }],
  }),
  t.Settings.registerSettingExtension({
    settingName: 'navigatorGroupByFolder',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !0,
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.SOURCES,
    storageType: t.Settings.SettingStorageType.Synced,
    title: p(d.searchInAnonymousAndContent),
    settingName: 'searchInAnonymousAndContentScripts',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !1,
    options: [
      { value: !0, title: p(d.searchInAnonymousAndContent) },
      { value: !1, title: p(d.doNotSearchInAnonymousAndContent) },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.SOURCES,
    storageType: t.Settings.SettingStorageType.Synced,
    title: p(d.automaticallyRevealFilesIn),
    settingName: 'autoRevealInNavigator',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !1,
    options: [
      { value: !0, title: p(d.automaticallyRevealFilesIn) },
      { value: !1, title: p(d.doNotAutomaticallyRevealFilesIn) },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.SOURCES,
    storageType: t.Settings.SettingStorageType.Synced,
    title: p(d.enableJavascriptSourceMaps),
    settingName: 'jsSourceMapsEnabled',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !0,
    options: [
      { value: !0, title: p(d.enableJavascriptSourceMaps) },
      { value: !1, title: p(d.disableJavascriptSourceMaps) },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.SOURCES,
    storageType: t.Settings.SettingStorageType.Synced,
    title: p(d.enableTabMovesFocus),
    settingName: 'textEditorTabMovesFocus',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !1,
    options: [
      { value: !0, title: p(d.enableTabMovesFocus) },
      { value: !1, title: p(d.disableTabMovesFocus) },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.SOURCES,
    storageType: t.Settings.SettingStorageType.Synced,
    title: p(d.detectIndentation),
    settingName: 'textEditorAutoDetectIndent',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !0,
    options: [
      { value: !0, title: p(d.detectIndentation) },
      { value: !1, title: p(d.doNotDetectIndentation) },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.SOURCES,
    storageType: t.Settings.SettingStorageType.Synced,
    title: p(d.autocompletion),
    settingName: 'textEditorAutocompletion',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !0,
    options: [
      { value: !0, title: p(d.enableAutocompletion) },
      { value: !1, title: p(d.disableAutocompletion) },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.SOURCES,
    title: p(d.bracketMatching),
    settingName: 'textEditorBracketMatching',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !0,
    options: [
      { value: !0, title: p(d.enableBracketMatching) },
      { value: !1, title: p(d.disableBracketMatching) },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.SOURCES,
    storageType: t.Settings.SettingStorageType.Synced,
    title: p(d.codeFolding),
    settingName: 'textEditorCodeFolding',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !1,
    options: [
      { value: !0, title: p(d.enableCodeFolding) },
      { value: !1, title: p(d.disableCodeFolding) },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.SOURCES,
    storageType: t.Settings.SettingStorageType.Synced,
    title: p(d.showWhitespaceCharacters),
    settingName: 'showWhitespacesInEditor',
    settingType: t.Settings.SettingType.ENUM,
    defaultValue: 'original',
    options: [
      {
        title: p(d.doNotShowWhitespaceCharacters),
        text: p(d.none),
        value: 'none',
      },
      { title: p(d.showAllWhitespaceCharacters), text: p(d.all), value: 'all' },
      {
        title: p(d.showTrailingWhitespaceCharacters),
        text: p(d.trailing),
        value: 'trailing',
      },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.SOURCES,
    storageType: t.Settings.SettingStorageType.Synced,
    title: p(d.displayVariableValuesInlineWhile),
    settingName: 'inlineVariableValues',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !0,
    options: [
      { value: !0, title: p(d.displayVariableValuesInlineWhile) },
      { value: !1, title: p(d.doNotDisplayVariableValuesInline) },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.SOURCES,
    storageType: t.Settings.SettingStorageType.Synced,
    title: p(d.enableAutoFocusOnDebuggerPaused),
    settingName: 'autoFocusOnDebuggerPausedEnabled',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !0,
    options: [
      { value: !0, title: p(d.enableAutoFocusOnDebuggerPaused) },
      { value: !1, title: p(d.disableAutoFocusOnDebuggerPaused) },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.SOURCES,
    storageType: t.Settings.SettingStorageType.Synced,
    title: p(d.enableCssSourceMaps),
    settingName: 'cssSourceMapsEnabled',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !0,
    options: [
      { value: !0, title: p(d.enableCssSourceMaps) },
      { value: !1, title: p(d.disableCssSourceMaps) },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.SOURCES,
    storageType: t.Settings.SettingStorageType.Synced,
    title: p(d.allowScrollingPastEndOfFile),
    settingName: 'allowScrollPastEof',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !0,
    options: [
      { value: !0, title: p(d.allowScrollingPastEndOfFile) },
      { value: !1, title: p(d.disallowScrollingPastEndOfFile) },
    ],
  }),
  r.ViewManager.registerLocationResolver({
    name: 'navigator-view',
    category: r.ViewManager.ViewLocationCategoryValues.SOURCES,
    loadResolver: async () => (await m()).SourcesPanel.SourcesPanel.instance(),
  }),
  r.ViewManager.registerLocationResolver({
    name: 'sources.sidebar-top',
    category: r.ViewManager.ViewLocationCategoryValues.SOURCES,
    loadResolver: async () => (await m()).SourcesPanel.SourcesPanel.instance(),
  }),
  r.ViewManager.registerLocationResolver({
    name: 'sources.sidebar-bottom',
    category: r.ViewManager.ViewLocationCategoryValues.SOURCES,
    loadResolver: async () => (await m()).SourcesPanel.SourcesPanel.instance(),
  }),
  r.ViewManager.registerLocationResolver({
    name: 'sources.sidebar-tabs',
    category: r.ViewManager.ViewLocationCategoryValues.SOURCES,
    loadResolver: async () => (await m()).SourcesPanel.SourcesPanel.instance(),
  }),
  r.ContextMenu.registerProvider({
    contextTypes: () => [
      n.UISourceCode.UISourceCode,
      n.UISourceCode.UILocation,
      o.RemoteObject.RemoteObject,
      o.NetworkRequest.NetworkRequest,
      ...y((e) => [e.UISourceCodeFrame.UISourceCodeFrame]),
    ],
    loadProvider: async () => (await m()).SourcesPanel.SourcesPanel.instance(),
    experiment: void 0,
  }),
  r.ContextMenu.registerProvider({
    loadProvider: async () =>
      (
        await m()
      ).WatchExpressionsSidebarPane.WatchExpressionsSidebarPane.instance(),
    contextTypes: () => [a.ObjectPropertiesSection.ObjectPropertyTreeElement],
    experiment: void 0,
  }),
  r.ContextMenu.registerProvider({
    contextTypes: () => y((e) => [e.UISourceCodeFrame.UISourceCodeFrame]),
    loadProvider: async () =>
      (
        await m()
      ).WatchExpressionsSidebarPane.WatchExpressionsSidebarPane.instance(),
    experiment: void 0,
  }),
  r.ContextMenu.registerProvider({
    loadProvider: async () =>
      (await m()).ScopeChainSidebarPane.OpenLinearMemoryInspector.instance(),
    experiment: void 0,
    contextTypes: () => [a.ObjectPropertiesSection.ObjectPropertyTreeElement],
  }),
  t.Revealer.registerRevealer({
    contextTypes: () => [n.UISourceCode.UILocation],
    destination: t.Revealer.RevealerDestination.SOURCES_PANEL,
    loadRevealer: async () =>
      (await m()).SourcesPanel.UILocationRevealer.instance(),
  }),
  t.Revealer.registerRevealer({
    contextTypes: () => [o.DebuggerModel.Location],
    destination: t.Revealer.RevealerDestination.SOURCES_PANEL,
    loadRevealer: async () =>
      (await m()).SourcesPanel.DebuggerLocationRevealer.instance(),
  }),
  t.Revealer.registerRevealer({
    contextTypes: () => [n.UISourceCode.UISourceCode],
    destination: t.Revealer.RevealerDestination.SOURCES_PANEL,
    loadRevealer: async () =>
      (await m()).SourcesPanel.UISourceCodeRevealer.instance(),
  }),
  t.Revealer.registerRevealer({
    contextTypes: () => [o.DebuggerModel.DebuggerPausedDetails],
    destination: t.Revealer.RevealerDestination.SOURCES_PANEL,
    loadRevealer: async () =>
      (await m()).SourcesPanel.DebuggerPausedDetailsRevealer.instance(),
  }),
  r.Toolbar.registerToolbarItem({
    actionId: 'sources.add-folder-to-workspace',
    location: r.Toolbar.ToolbarItemLocation.FILES_NAVIGATION_TOOLBAR,
    showLabel: !0,
    condition: e.Runtime.ConditionName.NOT_SOURCES_HIDE_ADD_FOLDER,
    loadItem: void 0,
    order: void 0,
    separator: void 0,
  }),
  r.Context.registerListener({
    contextTypes: () => [o.DebuggerModel.DebuggerPausedDetails],
    loadListener: async () =>
      (
        await m()
      ).JavaScriptBreakpointsSidebarPane.JavaScriptBreakpointsSidebarPane.instance(),
  }),
  r.Context.registerListener({
    contextTypes: () => [o.DebuggerModel.DebuggerPausedDetails],
    loadListener: async () =>
      (
        await m()
      ).JavaScriptBreakpointsSidebarPane.JavaScriptBreakpointsSidebarPane.instance(),
  }),
  r.Context.registerListener({
    contextTypes: () => [o.DebuggerModel.DebuggerPausedDetails],
    loadListener: async () =>
      (await m()).CallStackSidebarPane.CallStackSidebarPane.instance(),
  }),
  r.Context.registerListener({
    contextTypes: () => [o.DebuggerModel.CallFrame],
    loadListener: async () =>
      (await m()).ScopeChainSidebarPane.ScopeChainSidebarPane.instance(),
  }),
  r.ContextMenu.registerItem({
    location: r.ContextMenu.ItemLocation.NAVIGATOR_MENU_DEFAULT,
    actionId: 'quickOpen.show',
    order: void 0,
  }),
  r.ContextMenu.registerItem({
    location: r.ContextMenu.ItemLocation.MAIN_MENU_DEFAULT,
    actionId: 'sources.search',
    order: void 0,
  }),
  s.FilteredListWidget.registerProvider({
    prefix: '@',
    iconName: 'ic_command_go_to_symbol',
    provider: async () =>
      (await m()).OutlineQuickOpen.OutlineQuickOpen.instance(),
    titlePrefix: p(d.goTo),
    titleSuggestion: p(d.symbol),
  }),
  s.FilteredListWidget.registerProvider({
    prefix: ':',
    iconName: 'ic_command_go_to_line',
    provider: async () =>
      (await m()).GoToLineQuickOpen.GoToLineQuickOpen.instance(),
    titlePrefix: p(d.goTo),
    titleSuggestion: p(d.line),
  }),
  s.FilteredListWidget.registerProvider({
    prefix: '',
    iconName: 'ic_command_open_file',
    provider: async () =>
      (await m()).OpenFileQuickOpen.OpenFileQuickOpen.instance(),
    titlePrefix: p(d.open),
    titleSuggestion: p(d.file),
  })
const w = {
    console: 'Console',
    showConsole: 'Show Console',
    clearConsole: 'Clear console',
    clearConsoleHistory: 'Clear console history',
    createLiveExpression: 'Create live expression',
    hideNetworkMessages: 'Hide network messages',
    showNetworkMessages: 'Show network messages',
    selectedContextOnly: 'Selected context only',
    onlyShowMessagesFromTheCurrent:
      'Only show messages from the current context (`top`, `iframe`, `worker`, extension)',
    showMessagesFromAllContexts: 'Show messages from all contexts',
    logXmlhttprequests: 'Log XMLHttpRequests',
    showTimestamps: 'Show timestamps',
    hideTimestamps: 'Hide timestamps',
    autocompleteFromHistory: 'Autocomplete from history',
    doNotAutocompleteFromHistory: 'Do not autocomplete from history',
    groupSimilarMessagesInConsole: 'Group similar messages in console',
    doNotGroupSimilarMessagesIn: 'Do not group similar messages in console',
    showCorsErrorsInConsole: 'Show `CORS` errors in console',
    doNotShowCorsErrorsIn: 'Do not show `CORS` errors in console',
    eagerEvaluation: 'Eager evaluation',
    eagerlyEvaluateConsolePromptText: 'Eagerly evaluate console prompt text',
    doNotEagerlyEvaluateConsole: 'Do not eagerly evaluate console prompt text',
    evaluateTriggersUserActivation: 'Evaluate triggers user activation',
    treatEvaluationAsUserActivation: 'Treat evaluation as user activation',
    doNotTreatEvaluationAsUser: 'Do not treat evaluation as user activation',
  },
  h = i.i18n.registerUIStrings('panels/console/console-meta.ts', w),
  A = i.i18n.getLazilyComputedLocalizedString.bind(void 0, h)
let E
async function v() {
  return E || (E = await import('../../panels/console/console.js')), E
}
r.ViewManager.registerViewExtension({
  location: 'panel',
  id: 'console',
  title: A(w.console),
  commandPrompt: A(w.showConsole),
  order: 20,
  loadView: async () => (await v()).ConsolePanel.ConsolePanel.instance(),
}),
  r.ViewManager.registerViewExtension({
    location: 'drawer-view',
    id: 'console-view',
    title: A(w.console),
    commandPrompt: A(w.showConsole),
    persistence: 'permanent',
    order: 0,
    loadView: async () => (await v()).ConsolePanel.WrapperView.instance(),
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'console.show',
    category: r.ActionRegistration.ActionCategory.CONSOLE,
    title: A(w.showConsole),
    loadActionDelegate: async () =>
      (await v()).ConsoleView.ActionDelegate.instance(),
    bindings: [
      { shortcut: 'Ctrl+`', keybindSets: ['devToolsDefault', 'vsCode'] },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'console.clear',
    category: r.ActionRegistration.ActionCategory.CONSOLE,
    title: A(w.clearConsole),
    iconClass: 'largeicon-clear',
    loadActionDelegate: async () =>
      (await v()).ConsoleView.ActionDelegate.instance(),
    contextTypes: () =>
      void 0 === E ? [] : ((e) => [e.ConsoleView.ConsoleView])(E),
    bindings: [{ shortcut: 'Ctrl+L' }, { shortcut: 'Meta+K', platform: 'mac' }],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'console.clear.history',
    category: r.ActionRegistration.ActionCategory.CONSOLE,
    title: A(w.clearConsoleHistory),
    loadActionDelegate: async () =>
      (await v()).ConsoleView.ActionDelegate.instance(),
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'console.create-pin',
    category: r.ActionRegistration.ActionCategory.CONSOLE,
    title: A(w.createLiveExpression),
    iconClass: 'largeicon-visibility',
    loadActionDelegate: async () =>
      (await v()).ConsoleView.ActionDelegate.instance(),
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.CONSOLE,
    storageType: t.Settings.SettingStorageType.Synced,
    title: A(w.hideNetworkMessages),
    settingName: 'hideNetworkMessages',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !1,
    options: [
      { value: !0, title: A(w.hideNetworkMessages) },
      { value: !1, title: A(w.showNetworkMessages) },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.CONSOLE,
    storageType: t.Settings.SettingStorageType.Synced,
    title: A(w.selectedContextOnly),
    settingName: 'selectedContextFilterEnabled',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !1,
    options: [
      { value: !0, title: A(w.onlyShowMessagesFromTheCurrent) },
      { value: !1, title: A(w.showMessagesFromAllContexts) },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.CONSOLE,
    storageType: t.Settings.SettingStorageType.Synced,
    title: A(w.logXmlhttprequests),
    settingName: 'monitoringXHREnabled',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !1,
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.CONSOLE,
    storageType: t.Settings.SettingStorageType.Synced,
    title: A(w.showTimestamps),
    settingName: 'consoleTimestampsEnabled',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !1,
    options: [
      { value: !0, title: A(w.showTimestamps) },
      { value: !1, title: A(w.hideTimestamps) },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.CONSOLE,
    title: A(w.autocompleteFromHistory),
    settingName: 'consoleHistoryAutocomplete',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !0,
    options: [
      { value: !0, title: A(w.autocompleteFromHistory) },
      { value: !1, title: A(w.doNotAutocompleteFromHistory) },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.CONSOLE,
    storageType: t.Settings.SettingStorageType.Synced,
    title: A(w.groupSimilarMessagesInConsole),
    settingName: 'consoleGroupSimilar',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !0,
    options: [
      { value: !0, title: A(w.groupSimilarMessagesInConsole) },
      { value: !1, title: A(w.doNotGroupSimilarMessagesIn) },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.CONSOLE,
    title: A(w.showCorsErrorsInConsole),
    settingName: 'consoleShowsCorsErrors',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !0,
    options: [
      { value: !0, title: A(w.showCorsErrorsInConsole) },
      { value: !1, title: A(w.doNotShowCorsErrorsIn) },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.CONSOLE,
    storageType: t.Settings.SettingStorageType.Synced,
    title: A(w.eagerEvaluation),
    settingName: 'consoleEagerEval',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !0,
    options: [
      { value: !0, title: A(w.eagerlyEvaluateConsolePromptText) },
      { value: !1, title: A(w.doNotEagerlyEvaluateConsole) },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.CONSOLE,
    storageType: t.Settings.SettingStorageType.Synced,
    title: A(w.evaluateTriggersUserActivation),
    settingName: 'consoleUserActivationEval',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !0,
    options: [
      { value: !0, title: A(w.treatEvaluationAsUserActivation) },
      { value: !1, title: A(w.doNotTreatEvaluationAsUser) },
    ],
  }),
  t.Revealer.registerRevealer({
    contextTypes: () => [t.Console.Console],
    loadRevealer: async () =>
      (await v()).ConsolePanel.ConsoleRevealer.instance(),
    destination: void 0,
  })
const T = {
    inputs: 'Inputs',
    pause: 'Pause',
    resume: 'Resume',
    showInputs: 'Show Inputs',
    startRecording: 'Start recording',
    startReplaying: 'Start replaying',
    stopRecording: 'Stop recording',
  },
  C = i.i18n.registerUIStrings('panels/input//input-meta.ts', T),
  b = i.i18n.getLazilyComputedLocalizedString.bind(void 0, C)
let R
async function N() {
  return R || (R = await import('../../panels/input/input.js')), R
}
r.ViewManager.registerViewExtension({
  location: 'drawer-view',
  id: 'Inputs',
  title: b(T.inputs),
  commandPrompt: b(T.showInputs),
  persistence: 'closeable',
  order: 7,
  loadView: async () => (await N()).InputTimeline.InputTimeline.instance(),
  experiment: e.Runtime.ExperimentName.TIMELINE_REPLAY_EVENT,
}),
  r.ActionRegistration.registerActionExtension({
    actionId: 'input.toggle-recording',
    iconClass: 'largeicon-start-recording',
    toggleable: !0,
    toggledIconClass: 'largeicon-stop-recording',
    toggleWithRedColor: !0,
    loadActionDelegate: async () =>
      (await N()).InputTimeline.ActionDelegate.instance(),
    category: r.ActionRegistration.ActionCategory.INPUTS,
    experiment: e.Runtime.ExperimentName.TIMELINE_REPLAY_EVENT,
    options: [
      { value: !0, title: b(T.startRecording) },
      { value: !1, title: b(T.stopRecording) },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'input.start-replaying',
    iconClass: 'largeicon-play',
    toggleable: !1,
    loadActionDelegate: async () =>
      (await N()).InputTimeline.ActionDelegate.instance(),
    category: r.ActionRegistration.ActionCategory.INPUTS,
    experiment: e.Runtime.ExperimentName.TIMELINE_REPLAY_EVENT,
    options: [{ value: !0, title: b(T.startReplaying) }],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'input.toggle-pause',
    iconClass: 'largeicon-pause',
    toggleable: !0,
    toggledIconClass: 'largeicon-resume',
    loadActionDelegate: async () =>
      (await N()).InputTimeline.ActionDelegate.instance(),
    category: r.ActionRegistration.ActionCategory.INPUTS,
    experiment: e.Runtime.ExperimentName.TIMELINE_REPLAY_EVENT,
    options: [
      { value: !0, title: b(T.pause) },
      { value: !1, title: b(T.resume) },
    ],
  })
const x = { devices: 'Devices', showDevices: 'Show Devices' },
  f = i.i18n.registerUIStrings(
    'panels/settings/emulation/emulation-meta.ts',
    x
  ),
  D = i.i18n.getLazilyComputedLocalizedString.bind(void 0, f)
let L
r.ViewManager.registerViewExtension({
  location: 'settings-view',
  commandPrompt: D(x.showDevices),
  title: D(x.devices),
  order: 30,
  loadView: async () =>
    (
      await (async function () {
        return (
          L ||
            (L = await import('../../panels/settings/emulation/emulation.js')),
          L
        )
      })()
    ).DevicesSettingsTab.DevicesSettingsTab.instance(),
  id: 'devices',
  settings: ['standardEmulatedDeviceList', 'customEmulatedDeviceList'],
})
const P = {
    shortcuts: 'Shortcuts',
    preferences: 'Preferences',
    experiments: 'Experiments',
    ignoreList: 'Ignore List',
    showShortcuts: 'Show Shortcuts',
    showPreferences: 'Show Preferences',
    showExperiments: 'Show Experiments',
    showIgnoreList: 'Show Ignore List',
    settings: 'Settings',
    documentation: 'Documentation',
  },
  I = i.i18n.registerUIStrings('panels/settings/settings-meta.ts', P),
  k = i.i18n.getLazilyComputedLocalizedString.bind(void 0, I)
let O
async function M() {
  return O || (O = await import('../../panels/settings/settings.js')), O
}
r.ViewManager.registerViewExtension({
  location: 'settings-view',
  id: 'preferences',
  title: k(P.preferences),
  commandPrompt: k(P.showPreferences),
  order: 0,
  loadView: async () =>
    (await M()).SettingsScreen.GenericSettingsTab.instance(),
}),
  r.ViewManager.registerViewExtension({
    location: 'settings-view',
    id: 'experiments',
    title: k(P.experiments),
    commandPrompt: k(P.showExperiments),
    order: 3,
    experiment: e.Runtime.ExperimentName.ALL,
    loadView: async () =>
      (await M()).SettingsScreen.ExperimentsSettingsTab.instance(),
  }),
  r.ViewManager.registerViewExtension({
    location: 'settings-view',
    id: 'blackbox',
    title: k(P.ignoreList),
    commandPrompt: k(P.showIgnoreList),
    order: 4,
    loadView: async () =>
      (
        await M()
      ).FrameworkIgnoreListSettingsTab.FrameworkIgnoreListSettingsTab.instance(),
  }),
  r.ViewManager.registerViewExtension({
    location: 'settings-view',
    id: 'keybinds',
    title: k(P.shortcuts),
    commandPrompt: k(P.showShortcuts),
    order: 100,
    loadView: async () =>
      (await M()).KeybindsSettingsTab.KeybindsSettingsTab.instance(),
  }),
  r.ActionRegistration.registerActionExtension({
    category: r.ActionRegistration.ActionCategory.SETTINGS,
    actionId: 'settings.show',
    title: k(P.settings),
    loadActionDelegate: async () =>
      (await M()).SettingsScreen.ActionDelegate.instance(),
    iconClass: 'largeicon-settings-gear',
    bindings: [
      { shortcut: 'F1', keybindSets: ['devToolsDefault'] },
      { shortcut: 'Shift+?' },
      {
        platform: 'windows,linux',
        shortcut: 'Ctrl+,',
        keybindSets: ['vsCode'],
      },
      { platform: 'mac', shortcut: 'Meta+,', keybindSets: ['vsCode'] },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    category: r.ActionRegistration.ActionCategory.SETTINGS,
    actionId: 'settings.documentation',
    title: k(P.documentation),
    loadActionDelegate: async () =>
      (await M()).SettingsScreen.ActionDelegate.instance(),
  }),
  r.ActionRegistration.registerActionExtension({
    category: r.ActionRegistration.ActionCategory.SETTINGS,
    actionId: 'settings.shortcuts',
    title: k(P.shortcuts),
    loadActionDelegate: async () =>
      (await M()).SettingsScreen.ActionDelegate.instance(),
    bindings: [
      {
        platform: 'windows,linux',
        shortcut: 'Ctrl+K Ctrl+S',
        keybindSets: ['vsCode'],
      },
      { platform: 'mac', shortcut: 'Meta+K Meta+S', keybindSets: ['vsCode'] },
    ],
  }),
  r.ViewManager.registerLocationResolver({
    name: 'settings-view',
    category: r.ViewManager.ViewLocationCategoryValues.SETTINGS,
    loadResolver: async () =>
      (await M()).SettingsScreen.SettingsScreen.instance(),
  }),
  t.Revealer.registerRevealer({
    contextTypes: () => [t.Settings.Setting],
    loadRevealer: async () => (await M()).SettingsScreen.Revealer.instance(),
    destination: void 0,
  }),
  r.ContextMenu.registerItem({
    location: r.ContextMenu.ItemLocation.MAIN_MENU_FOOTER,
    actionId: 'settings.shortcuts',
    order: void 0,
  }),
  r.ContextMenu.registerItem({
    location: r.ContextMenu.ItemLocation.MAIN_MENU_HELP_DEFAULT,
    actionId: 'settings.documentation',
    order: void 0,
  })
const V = {
    protocolMonitor: 'Protocol monitor',
    showProtocolMonitor: 'Show Protocol monitor',
  },
  B = i.i18n.registerUIStrings(
    'panels/protocol_monitor/protocol_monitor-meta.ts',
    V
  ),
  F = i.i18n.getLazilyComputedLocalizedString.bind(void 0, B)
let U
r.ViewManager.registerViewExtension({
  location: 'drawer-view',
  id: 'protocol-monitor',
  title: F(V.protocolMonitor),
  commandPrompt: F(V.showProtocolMonitor),
  order: 100,
  persistence: 'closeable',
  loadView: async () =>
    (
      await (async function () {
        return (
          U ||
            (U = await import(
              '../../panels/protocol_monitor/protocol_monitor.js'
            )),
          U
        )
      })()
    ).ProtocolMonitor.ProtocolMonitorImpl.instance(),
  experiment: e.Runtime.ExperimentName.PROTOCOL_MONITOR,
})
const _ = {
    workspace: 'Workspace',
    showWorkspace: 'Show Workspace',
    enableLocalOverrides: 'Enable Local Overrides',
    interception: 'interception',
    override: 'override',
    network: 'network',
    rewrite: 'rewrite',
    request: 'request',
    enableOverrideNetworkRequests: 'Enable override network requests',
    disableOverrideNetworkRequests: 'Disable override network requests',
  },
  G = i.i18n.registerUIStrings('models/persistence/persistence-meta.ts', _),
  W = i.i18n.getLazilyComputedLocalizedString.bind(void 0, G)
let H
async function z() {
  return H || (H = await import('../../models/persistence/persistence.js')), H
}
r.ViewManager.registerViewExtension({
  location: 'settings-view',
  id: 'workspace',
  title: W(_.workspace),
  commandPrompt: W(_.showWorkspace),
  order: 1,
  loadView: async () =>
    (await z()).WorkspaceSettingsTab.WorkspaceSettingsTab.instance(),
}),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.PERSISTENCE,
    title: W(_.enableLocalOverrides),
    settingName: 'persistenceNetworkOverridesEnabled',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !1,
    tags: [
      W(_.interception),
      W(_.override),
      W(_.network),
      W(_.rewrite),
      W(_.request),
    ],
    options: [
      { value: !0, title: W(_.enableOverrideNetworkRequests) },
      { value: !1, title: W(_.disableOverrideNetworkRequests) },
    ],
  }),
  r.ContextMenu.registerProvider({
    contextTypes: () => [
      n.UISourceCode.UISourceCode,
      o.Resource.Resource,
      o.NetworkRequest.NetworkRequest,
    ],
    loadProvider: async () =>
      (await z()).PersistenceActions.ContextMenuProvider.instance(),
    experiment: void 0,
  })
const q = {
    preserveLog: 'Preserve log',
    preserve: 'preserve',
    clear: 'clear',
    reset: 'reset',
    preserveLogOnPageReload: 'Preserve log on page reload / navigation',
    doNotPreserveLogOnPageReload:
      'Do not preserve log on page reload / navigation',
    recordNetworkLog: 'Record network log',
  },
  j = i.i18n.registerUIStrings('models/logs/logs-meta.ts', q),
  K = i.i18n.getLazilyComputedLocalizedString.bind(void 0, j)
t.Settings.registerSettingExtension({
  category: t.Settings.SettingCategory.NETWORK,
  title: K(q.preserveLog),
  settingName: 'network_log.preserve-log',
  settingType: t.Settings.SettingType.BOOLEAN,
  defaultValue: !1,
  tags: [K(q.preserve), K(q.clear), K(q.reset)],
  options: [
    { value: !0, title: K(q.preserveLogOnPageReload) },
    { value: !1, title: K(q.doNotPreserveLogOnPageReload) },
  ],
}),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.NETWORK,
    title: K(q.recordNetworkLog),
    settingName: 'network_log.record-log',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !0,
    storageType: t.Settings.SettingStorageType.Session,
  })
const J = {
    focusDebuggee: 'Focus debuggee',
    toggleDrawer: 'Toggle drawer',
    nextPanel: 'Next panel',
    previousPanel: 'Previous panel',
    reloadDevtools: 'Reload DevTools',
    restoreLastDockPosition: 'Restore last dock position',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    resetZoomLevel: 'Reset zoom level',
    searchInPanel: 'Search in panel',
    cancelSearch: 'Cancel search',
    findNextResult: 'Find next result',
    findPreviousResult: 'Find previous result',
    theme: 'Theme:',
    switchToSystemPreferredColor: 'Switch to system preferred color theme',
    systemPreference: 'System preference',
    switchToLightTheme: 'Switch to light theme',
    lightCapital: 'Light',
    switchToDarkTheme: 'Switch to dark theme',
    darkCapital: 'Dark',
    darkLower: 'dark',
    lightLower: 'light',
    panelLayout: 'Panel layout:',
    useHorizontalPanelLayout: 'Use horizontal panel layout',
    horizontal: 'horizontal',
    useVerticalPanelLayout: 'Use vertical panel layout',
    vertical: 'vertical',
    useAutomaticPanelLayout: 'Use automatic panel layout',
    auto: 'auto',
    colorFormat: 'Color format:',
    setColorFormatAsAuthored: 'Set color format as authored',
    asAuthored: 'As authored',
    setColorFormatToHex: 'Set color format to HEX',
    setColorFormatToRgb: 'Set color format to RGB',
    setColorFormatToHsl: 'Set color format to HSL',
    enableCtrlShortcutToSwitchPanels:
      'Enable Ctrl + 1-9 shortcut to switch panels',
    enableShortcutToSwitchPanels: 'Enable ⌘ + 1-9 shortcut to switch panels',
    right: 'Right',
    dockToRight: 'Dock to right',
    bottom: 'Bottom',
    dockToBottom: 'Dock to bottom',
    left: 'Left',
    dockToLeft: 'Dock to left',
    undocked: 'Undocked',
    undockIntoSeparateWindow: 'Undock into separate window',
    devtoolsDefault: 'DevTools (Default)',
    language: 'Language:',
    browserLanguage: 'Browser UI language',
    enableSync: 'Enable settings sync',
  },
  Y = i.i18n.registerUIStrings('entrypoints/main/main-meta.ts', J),
  X = i.i18n.getLazilyComputedLocalizedString.bind(void 0, Y)
let Q, Z
async function $() {
  return Q || (Q = await import('../main/main.js')), Q
}
function ee(e) {
  return () =>
    i.i18n.getLocalizedLanguageRegion(
      e,
      i.DevToolsLocale.DevToolsLocale.instance()
    )
}
r.ActionRegistration.registerActionExtension({
  category: r.ActionRegistration.ActionCategory.DRAWER,
  actionId: 'inspector_main.focus-debuggee',
  loadActionDelegate: async () =>
    (
      await (async function () {
        return Z || (Z = await import('../inspector_main/inspector_main.js')), Z
      })()
    ).InspectorMain.FocusDebuggeeActionDelegate.instance(),
  order: 100,
  title: X(J.focusDebuggee),
}),
  r.ActionRegistration.registerActionExtension({
    category: r.ActionRegistration.ActionCategory.DRAWER,
    actionId: 'main.toggle-drawer',
    loadActionDelegate: async () => r.InspectorView.ActionDelegate.instance(),
    order: 101,
    title: X(J.toggleDrawer),
    bindings: [{ shortcut: 'Esc' }],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'main.next-tab',
    category: r.ActionRegistration.ActionCategory.GLOBAL,
    title: X(J.nextPanel),
    loadActionDelegate: async () => r.InspectorView.ActionDelegate.instance(),
    bindings: [
      { platform: 'windows,linux', shortcut: 'Ctrl+]' },
      { platform: 'mac', shortcut: 'Meta+]' },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'main.previous-tab',
    category: r.ActionRegistration.ActionCategory.GLOBAL,
    title: X(J.previousPanel),
    loadActionDelegate: async () => r.InspectorView.ActionDelegate.instance(),
    bindings: [
      { platform: 'windows,linux', shortcut: 'Ctrl+[' },
      { platform: 'mac', shortcut: 'Meta+[' },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'main.debug-reload',
    category: r.ActionRegistration.ActionCategory.GLOBAL,
    title: X(J.reloadDevtools),
    loadActionDelegate: async () =>
      (await $()).MainImpl.ReloadActionDelegate.instance(),
    bindings: [{ shortcut: 'Alt+R' }],
  }),
  r.ActionRegistration.registerActionExtension({
    category: r.ActionRegistration.ActionCategory.GLOBAL,
    title: X(J.restoreLastDockPosition),
    actionId: 'main.toggle-dock',
    loadActionDelegate: async () =>
      r.DockController.ToggleDockActionDelegate.instance(),
    bindings: [
      { platform: 'windows,linux', shortcut: 'Ctrl+Shift+D' },
      { platform: 'mac', shortcut: 'Meta+Shift+D' },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'main.zoom-in',
    category: r.ActionRegistration.ActionCategory.GLOBAL,
    title: X(J.zoomIn),
    loadActionDelegate: async () =>
      (await $()).MainImpl.ZoomActionDelegate.instance(),
    bindings: [
      {
        platform: 'windows,linux',
        shortcut: 'Ctrl+Plus',
        keybindSets: ['devToolsDefault', 'vsCode'],
      },
      { platform: 'windows,linux', shortcut: 'Ctrl+Shift+Plus' },
      { platform: 'windows,linux', shortcut: 'Ctrl+NumpadPlus' },
      { platform: 'windows,linux', shortcut: 'Ctrl+Shift+NumpadPlus' },
      {
        platform: 'mac',
        shortcut: 'Meta+Plus',
        keybindSets: ['devToolsDefault', 'vsCode'],
      },
      { platform: 'mac', shortcut: 'Meta+Shift+Plus' },
      { platform: 'mac', shortcut: 'Meta+NumpadPlus' },
      { platform: 'mac', shortcut: 'Meta+Shift+NumpadPlus' },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'main.zoom-out',
    category: r.ActionRegistration.ActionCategory.GLOBAL,
    title: X(J.zoomOut),
    loadActionDelegate: async () =>
      (await $()).MainImpl.ZoomActionDelegate.instance(),
    bindings: [
      {
        platform: 'windows,linux',
        shortcut: 'Ctrl+Minus',
        keybindSets: ['devToolsDefault', 'vsCode'],
      },
      { platform: 'windows,linux', shortcut: 'Ctrl+Shift+Minus' },
      { platform: 'windows,linux', shortcut: 'Ctrl+NumpadMinus' },
      { platform: 'windows,linux', shortcut: 'Ctrl+Shift+NumpadMinus' },
      {
        platform: 'mac',
        shortcut: 'Meta+Minus',
        keybindSets: ['devToolsDefault', 'vsCode'],
      },
      { platform: 'mac', shortcut: 'Meta+Shift+Minus' },
      { platform: 'mac', shortcut: 'Meta+NumpadMinus' },
      { platform: 'mac', shortcut: 'Meta+Shift+NumpadMinus' },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'main.zoom-reset',
    category: r.ActionRegistration.ActionCategory.GLOBAL,
    title: X(J.resetZoomLevel),
    loadActionDelegate: async () =>
      (await $()).MainImpl.ZoomActionDelegate.instance(),
    bindings: [
      { platform: 'windows,linux', shortcut: 'Ctrl+0' },
      { platform: 'windows,linux', shortcut: 'Ctrl+Numpad0' },
      { platform: 'mac', shortcut: 'Meta+Numpad0' },
      { platform: 'mac', shortcut: 'Meta+0' },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'main.search-in-panel.find',
    category: r.ActionRegistration.ActionCategory.GLOBAL,
    title: X(J.searchInPanel),
    loadActionDelegate: async () =>
      (await $()).MainImpl.SearchActionDelegate.instance(),
    bindings: [
      {
        platform: 'windows,linux',
        shortcut: 'Ctrl+F',
        keybindSets: ['devToolsDefault', 'vsCode'],
      },
      {
        platform: 'mac',
        shortcut: 'Meta+F',
        keybindSets: ['devToolsDefault', 'vsCode'],
      },
      { platform: 'mac', shortcut: 'F3' },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'main.search-in-panel.cancel',
    category: r.ActionRegistration.ActionCategory.GLOBAL,
    title: X(J.cancelSearch),
    loadActionDelegate: async () =>
      (await $()).MainImpl.SearchActionDelegate.instance(),
    order: 10,
    bindings: [{ shortcut: 'Esc' }],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'main.search-in-panel.find-next',
    category: r.ActionRegistration.ActionCategory.GLOBAL,
    title: X(J.findNextResult),
    loadActionDelegate: async () =>
      (await $()).MainImpl.SearchActionDelegate.instance(),
    bindings: [
      {
        platform: 'mac',
        shortcut: 'Meta+G',
        keybindSets: ['devToolsDefault', 'vsCode'],
      },
      { platform: 'windows,linux', shortcut: 'Ctrl+G' },
      {
        platform: 'windows,linux',
        shortcut: 'F3',
        keybindSets: ['devToolsDefault', 'vsCode'],
      },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'main.search-in-panel.find-previous',
    category: r.ActionRegistration.ActionCategory.GLOBAL,
    title: X(J.findPreviousResult),
    loadActionDelegate: async () =>
      (await $()).MainImpl.SearchActionDelegate.instance(),
    bindings: [
      {
        platform: 'mac',
        shortcut: 'Meta+Shift+G',
        keybindSets: ['devToolsDefault', 'vsCode'],
      },
      { platform: 'windows,linux', shortcut: 'Ctrl+Shift+G' },
      {
        platform: 'windows,linux',
        shortcut: 'Shift+F3',
        keybindSets: ['devToolsDefault', 'vsCode'],
      },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.APPEARANCE,
    storageType: t.Settings.SettingStorageType.Synced,
    title: X(J.theme),
    settingName: 'uiTheme',
    settingType: t.Settings.SettingType.ENUM,
    defaultValue: 'systemPreferred',
    reloadRequired: !0,
    options: [
      {
        title: X(J.switchToSystemPreferredColor),
        text: X(J.systemPreference),
        value: 'systemPreferred',
      },
      {
        title: X(J.switchToLightTheme),
        text: X(J.lightCapital),
        value: 'default',
      },
      { title: X(J.switchToDarkTheme), text: X(J.darkCapital), value: 'dark' },
    ],
    tags: [X(J.darkLower), X(J.lightLower)],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.APPEARANCE,
    storageType: t.Settings.SettingStorageType.Synced,
    title: X(J.panelLayout),
    settingName: 'sidebarPosition',
    settingType: t.Settings.SettingType.ENUM,
    defaultValue: 'auto',
    options: [
      {
        title: X(J.useHorizontalPanelLayout),
        text: X(J.horizontal),
        value: 'bottom',
      },
      {
        title: X(J.useVerticalPanelLayout),
        text: X(J.vertical),
        value: 'right',
      },
      { title: X(J.useAutomaticPanelLayout), text: X(J.auto), value: 'auto' },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.APPEARANCE,
    storageType: t.Settings.SettingStorageType.Synced,
    title: X(J.colorFormat),
    settingName: 'colorFormat',
    settingType: t.Settings.SettingType.ENUM,
    defaultValue: 'original',
    options: [
      {
        title: X(J.setColorFormatAsAuthored),
        text: X(J.asAuthored),
        value: 'original',
      },
      {
        title: X(J.setColorFormatToHex),
        text: 'HEX: #dac0de',
        value: 'hex',
        raw: !0,
      },
      {
        title: X(J.setColorFormatToRgb),
        text: 'RGB: rgb(128 255 255)',
        value: 'rgb',
        raw: !0,
      },
      {
        title: X(J.setColorFormatToHsl),
        text: 'HSL: hsl(300deg 80% 90%)',
        value: 'hsl',
        raw: !0,
      },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.APPEARANCE,
    storageType: t.Settings.SettingStorageType.Synced,
    title: X(J.enableCtrlShortcutToSwitchPanels),
    titleMac: X(J.enableShortcutToSwitchPanels),
    settingName: 'shortcutPanelSwitch',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !1,
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.GLOBAL,
    settingName: 'currentDockState',
    settingType: t.Settings.SettingType.ENUM,
    defaultValue: 'right',
    options: [
      { value: 'right', text: X(J.right), title: X(J.dockToRight) },
      { value: 'bottom', text: X(J.bottom), title: X(J.dockToBottom) },
      { value: 'left', text: X(J.left), title: X(J.dockToLeft) },
      {
        value: 'undocked',
        text: X(J.undocked),
        title: X(J.undockIntoSeparateWindow),
      },
    ],
  }),
  t.Settings.registerSettingExtension({
    storageType: t.Settings.SettingStorageType.Synced,
    settingName: 'activeKeybindSet',
    settingType: t.Settings.SettingType.ENUM,
    defaultValue: 'devToolsDefault',
    options: [
      {
        value: 'devToolsDefault',
        title: X(J.devtoolsDefault),
        text: X(J.devtoolsDefault),
      },
      {
        value: 'vsCode',
        title: i.i18n.lockedLazyString('Visual Studio Code'),
        text: i.i18n.lockedLazyString('Visual Studio Code'),
      },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.APPEARANCE,
    storageType: t.Settings.SettingStorageType.Synced,
    settingName: 'language',
    settingType: t.Settings.SettingType.ENUM,
    title: X(J.language),
    defaultValue: 'en-US',
    options: [
      {
        value: 'browserLanguage',
        title: X(J.browserLanguage),
        text: X(J.browserLanguage),
      },
      ...i.i18n
        .getAllSupportedDevToolsLocales()
        .filter((e) => 'en-XL' !== e)
        .map((e) => {
          return { value: (t = e), title: ee(t), text: ee(t) }
          var t
        }),
    ],
    reloadRequired: !0,
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.SYNC,
    settingName: 'sync_preferences',
    settingType: t.Settings.SettingType.BOOLEAN,
    title: X(J.enableSync),
    defaultValue: !1,
    reloadRequired: !0,
    experiment: e.Runtime.ExperimentName.SYNC_SETTINGS,
  }),
  t.Settings.registerSettingExtension({
    storageType: t.Settings.SettingStorageType.Synced,
    settingName: 'userShortcuts',
    settingType: t.Settings.SettingType.ARRAY,
    defaultValue: [],
  }),
  r.ViewManager.registerLocationResolver({
    name: 'drawer-view',
    category: r.ViewManager.ViewLocationCategoryValues.DRAWER,
    loadResolver: async () => r.InspectorView.InspectorView.instance(),
  }),
  r.ViewManager.registerLocationResolver({
    name: 'drawer-sidebar',
    category: r.ViewManager.ViewLocationCategoryValues.DRAWER_SIDEBAR,
    loadResolver: async () => r.InspectorView.InspectorView.instance(),
  }),
  r.ViewManager.registerLocationResolver({
    name: 'panel',
    category: r.ViewManager.ViewLocationCategoryValues.PANEL,
    loadResolver: async () => r.InspectorView.InspectorView.instance(),
  }),
  r.ContextMenu.registerProvider({
    contextTypes: () => [
      n.UISourceCode.UISourceCode,
      o.Resource.Resource,
      o.NetworkRequest.NetworkRequest,
    ],
    loadProvider: async () =>
      l.Linkifier.ContentProviderContextMenuProvider.instance(),
    experiment: void 0,
  }),
  r.ContextMenu.registerProvider({
    contextTypes: () => [Node],
    loadProvider: async () => r.XLink.ContextMenuProvider.instance(),
    experiment: void 0,
  }),
  r.ContextMenu.registerProvider({
    contextTypes: () => [Node],
    loadProvider: async () => l.Linkifier.LinkContextMenuProvider.instance(),
    experiment: void 0,
  }),
  r.Toolbar.registerToolbarItem({
    separator: !0,
    location: r.Toolbar.ToolbarItemLocation.MAIN_TOOLBAR_LEFT,
    order: 100,
    showLabel: void 0,
    actionId: void 0,
    condition: void 0,
    loadItem: void 0,
  }),
  r.Toolbar.registerToolbarItem({
    separator: !0,
    order: 97,
    location: r.Toolbar.ToolbarItemLocation.MAIN_TOOLBAR_RIGHT,
    showLabel: void 0,
    actionId: void 0,
    condition: void 0,
    loadItem: void 0,
  }),
  r.Toolbar.registerToolbarItem({
    loadItem: async () =>
      (await $()).MainImpl.SettingsButtonProvider.instance(),
    order: 98,
    location: r.Toolbar.ToolbarItemLocation.MAIN_TOOLBAR_RIGHT,
    showLabel: void 0,
    condition: void 0,
    separator: void 0,
    actionId: void 0,
  }),
  r.Toolbar.registerToolbarItem({
    loadItem: async () => (await $()).MainImpl.MainMenuItem.instance(),
    order: 99,
    location: r.Toolbar.ToolbarItemLocation.MAIN_TOOLBAR_RIGHT,
    showLabel: void 0,
    condition: void 0,
    separator: void 0,
    actionId: void 0,
  }),
  r.Toolbar.registerToolbarItem({
    loadItem: async () => r.DockController.CloseButtonProvider.instance(),
    order: 100,
    location: r.Toolbar.ToolbarItemLocation.MAIN_TOOLBAR_RIGHT,
    showLabel: void 0,
    condition: void 0,
    separator: void 0,
    actionId: void 0,
  }),
  t.AppProvider.registerAppProvider({
    loadAppProvider: async () =>
      (await $()).SimpleApp.SimpleAppProvider.instance(),
    order: 10,
    condition: void 0,
  })
const te = {
    flamechartMouseWheelAction: 'Flamechart mouse wheel action:',
    scroll: 'Scroll',
    zoom: 'Zoom',
    liveMemoryAllocationAnnotations: 'Live memory allocation annotations',
    showLiveMemoryAllocation: 'Show live memory allocation annotations',
    hideLiveMemoryAllocation: 'Hide live memory allocation annotations',
    collectGarbage: 'Collect garbage',
  },
  ie = i.i18n.registerUIStrings(
    'ui/legacy/components/perf_ui/perf_ui-meta.ts',
    te
  ),
  oe = i.i18n.getLazilyComputedLocalizedString.bind(void 0, ie)
let ne
r.ActionRegistration.registerActionExtension({
  actionId: 'components.collect-garbage',
  category: r.ActionRegistration.ActionCategory.PERFORMANCE,
  title: oe(te.collectGarbage),
  iconClass: 'largeicon-trash-bin',
  loadActionDelegate: async () =>
    (
      await (async function () {
        return (
          ne ||
            (ne = await import(
              '../../ui/legacy/components/perf_ui/perf_ui.js'
            )),
          ne
        )
      })()
    ).GCActionDelegate.GCActionDelegate.instance(),
}),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.PERFORMANCE,
    storageType: t.Settings.SettingStorageType.Synced,
    title: oe(te.flamechartMouseWheelAction),
    settingName: 'flamechartMouseWheelAction',
    settingType: t.Settings.SettingType.ENUM,
    defaultValue: 'zoom',
    options: [
      { title: oe(te.scroll), text: oe(te.scroll), value: 'scroll' },
      { title: oe(te.zoom), text: oe(te.zoom), value: 'zoom' },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.MEMORY,
    experiment: e.Runtime.ExperimentName.LIVE_HEAP_PROFILE,
    title: oe(te.liveMemoryAllocationAnnotations),
    settingName: 'memoryLiveHeapProfile',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !1,
    options: [
      { value: !0, title: oe(te.showLiveMemoryAllocation) },
      { value: !1, title: oe(te.hideLiveMemoryAllocation) },
    ],
  })
const ae = { openFile: 'Open file', runCommand: 'Run command' },
  se = i.i18n.registerUIStrings(
    'ui/legacy/components/quick_open/quick_open-meta.ts',
    ae
  ),
  re = i.i18n.getLazilyComputedLocalizedString.bind(void 0, se)
let le
async function ce() {
  return (
    le ||
      (le = await import(
        '../../ui/legacy/components/quick_open/quick_open.js'
      )),
    le
  )
}
r.ActionRegistration.registerActionExtension({
  actionId: 'commandMenu.show',
  category: r.ActionRegistration.ActionCategory.GLOBAL,
  title: re(ae.runCommand),
  loadActionDelegate: async () =>
    (await ce()).CommandMenu.ShowActionDelegate.instance(),
  bindings: [
    {
      platform: 'windows,linux',
      shortcut: 'Ctrl+Shift+P',
      keybindSets: ['devToolsDefault', 'vsCode'],
    },
    {
      platform: 'mac',
      shortcut: 'Meta+Shift+P',
      keybindSets: ['devToolsDefault', 'vsCode'],
    },
    { shortcut: 'F1', keybindSets: ['vsCode'] },
  ],
}),
  r.ActionRegistration.registerActionExtension({
    actionId: 'quickOpen.show',
    category: r.ActionRegistration.ActionCategory.GLOBAL,
    title: re(ae.openFile),
    loadActionDelegate: async () =>
      (await ce()).QuickOpen.ShowActionDelegate.instance(),
    order: 100,
    bindings: [
      {
        platform: 'mac',
        shortcut: 'Meta+P',
        keybindSets: ['devToolsDefault', 'vsCode'],
      },
      {
        platform: 'mac',
        shortcut: 'Meta+O',
        keybindSets: ['devToolsDefault', 'vsCode'],
      },
      {
        platform: 'windows,linux',
        shortcut: 'Ctrl+P',
        keybindSets: ['devToolsDefault', 'vsCode'],
      },
      {
        platform: 'windows,linux',
        shortcut: 'Ctrl+O',
        keybindSets: ['devToolsDefault', 'vsCode'],
      },
    ],
  }),
  r.ContextMenu.registerItem({
    location: r.ContextMenu.ItemLocation.MAIN_MENU_DEFAULT,
    actionId: 'commandMenu.show',
    order: void 0,
  }),
  r.ContextMenu.registerItem({
    location: r.ContextMenu.ItemLocation.MAIN_MENU_DEFAULT,
    actionId: 'quickOpen.show',
    order: void 0,
  })
const ge = {
    preserveLogUponNavigation: 'Preserve log upon navigation',
    doNotPreserveLogUponNavigation: 'Do not preserve log upon navigation',
    pauseOnExceptions: 'Pause on exceptions',
    doNotPauseOnExceptions: 'Do not pause on exceptions',
    disableJavascript: 'Disable JavaScript',
    enableJavascript: 'Enable JavaScript',
    disableAsyncStackTraces: 'Disable async stack traces',
    doNotCaptureAsyncStackTraces: 'Do not capture async stack traces',
    captureAsyncStackTraces: 'Capture async stack traces',
    showRulersOnHover: 'Show rulers on hover',
    doNotShowRulersOnHover: 'Do not show rulers on hover',
    showAreaNames: 'Show area names',
    showGridNamedAreas: 'Show grid named areas',
    doNotShowGridNamedAreas: 'Do not show grid named areas',
    showTrackSizes: 'Show track sizes',
    showGridTrackSizes: 'Show grid track sizes',
    doNotShowGridTrackSizes: 'Do not show grid track sizes',
    extendGridLines: 'Extend grid lines',
    doNotExtendGridLines: 'Do not extend grid lines',
    showLineLabels: 'Show line labels',
    hideLineLabels: 'Hide line labels',
    showLineNumbers: 'Show line numbers',
    showLineNames: 'Show line names',
    showPaintFlashingRectangles: 'Show paint flashing rectangles',
    hidePaintFlashingRectangles: 'Hide paint flashing rectangles',
    showLayoutShiftRegions: 'Show layout shift regions',
    hideLayoutShiftRegions: 'Hide layout shift regions',
    highlightAdFrames: 'Highlight ad frames',
    doNotHighlightAdFrames: 'Do not highlight ad frames',
    showLayerBorders: 'Show layer borders',
    hideLayerBorders: 'Hide layer borders',
    showCoreWebVitalsOverlay: 'Show Core Web Vitals overlay',
    hideCoreWebVitalsOverlay: 'Hide Core Web Vitals overlay',
    showFramesPerSecondFpsMeter: 'Show frames per second (FPS) meter',
    hideFramesPerSecondFpsMeter: 'Hide frames per second (FPS) meter',
    showScrollPerformanceBottlenecks: 'Show scroll performance bottlenecks',
    hideScrollPerformanceBottlenecks: 'Hide scroll performance bottlenecks',
    emulateAFocusedPage: 'Emulate a focused page',
    doNotEmulateAFocusedPage: 'Do not emulate a focused page',
    doNotEmulateCssMediaType: 'Do not emulate CSS media type',
    noEmulation: 'No emulation',
    emulateCssPrintMediaType: 'Emulate CSS print media type',
    print: 'print',
    emulateCssScreenMediaType: 'Emulate CSS screen media type',
    screen: 'screen',
    query: 'query',
    emulateCssMediaType: 'Emulate CSS media type',
    doNotEmulateCss: 'Do not emulate CSS {PH1}',
    emulateCss: 'Emulate CSS {PH1}',
    emulateCssMediaFeature: 'Emulate CSS media feature {PH1}',
    doNotEmulateAnyVisionDeficiency: 'Do not emulate any vision deficiency',
    emulateBlurredVision: 'Emulate blurred vision',
    blurredVision: 'Blurred vision',
    emulateProtanopia: 'Emulate protanopia',
    protanopia: 'Protanopia',
    emulateDeuteranopia: 'Emulate deuteranopia',
    deuteranopia: 'Deuteranopia',
    emulateTritanopia: 'Emulate tritanopia',
    tritanopia: 'Tritanopia',
    emulateAchromatopsia: 'Emulate achromatopsia',
    achromatopsia: 'Achromatopsia',
    emulateVisionDeficiencies: 'Emulate vision deficiencies',
    disableLocalFonts: 'Disable local fonts',
    enableLocalFonts: 'Enable local fonts',
    disableAvifFormat: 'Disable `AVIF` format',
    enableAvifFormat: 'Enable `AVIF` format',
    disableJpegXlFormat: 'Disable `JPEG XL` format',
    enableJpegXlFormat: 'Enable `JPEG XL` format',
    disableWebpFormat: 'Disable `WebP` format',
    enableWebpFormat: 'Enable `WebP` format',
    enableCustomFormatters: 'Enable custom formatters',
    enableNetworkRequestBlocking: 'Enable network request blocking',
    disableNetworkRequestBlocking: 'Disable network request blocking',
    enableCache: 'Enable cache',
    disableCache: 'Disable cache (while DevTools is open)',
    emulateAutoDarkMode: 'Emulate auto dark mode',
    enableEmulateAutoDarkMode: 'Enable auto dark mode',
    enabledDarkMode: 'Enable',
    disableEmulateAutoDarkMode: 'Disable auto dark mode',
    disabledDarkMode: 'Disable',
    doNotEmulateDarkMode: 'Do not emulate auto dark mode',
  },
  de = i.i18n.registerUIStrings('core/sdk/sdk-meta.ts', ge),
  ue = i.i18n.getLazilyComputedLocalizedString.bind(void 0, de)
t.Settings.registerSettingExtension({
  storageType: t.Settings.SettingStorageType.Synced,
  settingName: 'skipStackFramesPattern',
  settingType: t.Settings.SettingType.REGEX,
  defaultValue: '',
}),
  t.Settings.registerSettingExtension({
    storageType: t.Settings.SettingStorageType.Synced,
    settingName: 'skipContentScripts',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !1,
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.CONSOLE,
    storageType: t.Settings.SettingStorageType.Synced,
    title: ue(ge.preserveLogUponNavigation),
    settingName: 'preserveConsoleLog',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !1,
    options: [
      { value: !0, title: ue(ge.preserveLogUponNavigation) },
      { value: !1, title: ue(ge.doNotPreserveLogUponNavigation) },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.DEBUGGER,
    settingName: 'pauseOnExceptionEnabled',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !1,
    options: [
      { value: !0, title: ue(ge.pauseOnExceptions) },
      { value: !1, title: ue(ge.doNotPauseOnExceptions) },
    ],
  }),
  t.Settings.registerSettingExtension({
    settingName: 'pauseOnCaughtException',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !1,
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.DEBUGGER,
    title: ue(ge.disableJavascript),
    settingName: 'javaScriptDisabled',
    settingType: t.Settings.SettingType.BOOLEAN,
    storageType: t.Settings.SettingStorageType.Session,
    order: 1,
    defaultValue: !1,
    options: [
      { value: !0, title: ue(ge.disableJavascript) },
      { value: !1, title: ue(ge.enableJavascript) },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.DEBUGGER,
    title: ue(ge.disableAsyncStackTraces),
    settingName: 'disableAsyncStackTraces',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !1,
    order: 2,
    options: [
      { value: !0, title: ue(ge.doNotCaptureAsyncStackTraces) },
      { value: !1, title: ue(ge.captureAsyncStackTraces) },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.DEBUGGER,
    settingName: 'breakpointsActive',
    settingType: t.Settings.SettingType.BOOLEAN,
    storageType: t.Settings.SettingStorageType.Session,
    defaultValue: !0,
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.ELEMENTS,
    storageType: t.Settings.SettingStorageType.Synced,
    title: ue(ge.showRulersOnHover),
    settingName: 'showMetricsRulers',
    settingType: t.Settings.SettingType.BOOLEAN,
    options: [
      { value: !0, title: ue(ge.showRulersOnHover) },
      { value: !1, title: ue(ge.doNotShowRulersOnHover) },
    ],
    defaultValue: !1,
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.GRID,
    storageType: t.Settings.SettingStorageType.Synced,
    title: ue(ge.showAreaNames),
    settingName: 'showGridAreas',
    settingType: t.Settings.SettingType.BOOLEAN,
    options: [
      { value: !0, title: ue(ge.showGridNamedAreas) },
      { value: !1, title: ue(ge.doNotShowGridNamedAreas) },
    ],
    defaultValue: !1,
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.GRID,
    storageType: t.Settings.SettingStorageType.Synced,
    title: ue(ge.showTrackSizes),
    settingName: 'showGridTrackSizes',
    settingType: t.Settings.SettingType.BOOLEAN,
    options: [
      { value: !0, title: ue(ge.showGridTrackSizes) },
      { value: !1, title: ue(ge.doNotShowGridTrackSizes) },
    ],
    defaultValue: !1,
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.GRID,
    storageType: t.Settings.SettingStorageType.Synced,
    title: ue(ge.extendGridLines),
    settingName: 'extendGridLines',
    settingType: t.Settings.SettingType.BOOLEAN,
    options: [
      { value: !0, title: ue(ge.extendGridLines) },
      { value: !1, title: ue(ge.doNotExtendGridLines) },
    ],
    defaultValue: !1,
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.GRID,
    storageType: t.Settings.SettingStorageType.Synced,
    title: ue(ge.showLineLabels),
    settingName: 'showGridLineLabels',
    settingType: t.Settings.SettingType.ENUM,
    options: [
      {
        title: ue(ge.hideLineLabels),
        text: ue(ge.hideLineLabels),
        value: 'none',
      },
      {
        title: ue(ge.showLineNumbers),
        text: ue(ge.showLineNumbers),
        value: 'lineNumbers',
      },
      {
        title: ue(ge.showLineNames),
        text: ue(ge.showLineNames),
        value: 'lineNames',
      },
    ],
    defaultValue: 'lineNumbers',
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.RENDERING,
    settingName: 'showPaintRects',
    settingType: t.Settings.SettingType.BOOLEAN,
    storageType: t.Settings.SettingStorageType.Session,
    options: [
      { value: !0, title: ue(ge.showPaintFlashingRectangles) },
      { value: !1, title: ue(ge.hidePaintFlashingRectangles) },
    ],
    defaultValue: !1,
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.RENDERING,
    settingName: 'showLayoutShiftRegions',
    settingType: t.Settings.SettingType.BOOLEAN,
    storageType: t.Settings.SettingStorageType.Session,
    options: [
      { value: !0, title: ue(ge.showLayoutShiftRegions) },
      { value: !1, title: ue(ge.hideLayoutShiftRegions) },
    ],
    defaultValue: !1,
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.RENDERING,
    settingName: 'showAdHighlights',
    settingType: t.Settings.SettingType.BOOLEAN,
    storageType: t.Settings.SettingStorageType.Session,
    options: [
      { value: !0, title: ue(ge.highlightAdFrames) },
      { value: !1, title: ue(ge.doNotHighlightAdFrames) },
    ],
    defaultValue: !1,
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.RENDERING,
    settingName: 'showDebugBorders',
    settingType: t.Settings.SettingType.BOOLEAN,
    storageType: t.Settings.SettingStorageType.Session,
    options: [
      { value: !0, title: ue(ge.showLayerBorders) },
      { value: !1, title: ue(ge.hideLayerBorders) },
    ],
    defaultValue: !1,
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.RENDERING,
    settingName: 'showWebVitals',
    settingType: t.Settings.SettingType.BOOLEAN,
    storageType: t.Settings.SettingStorageType.Session,
    options: [
      { value: !0, title: ue(ge.showCoreWebVitalsOverlay) },
      { value: !1, title: ue(ge.hideCoreWebVitalsOverlay) },
    ],
    defaultValue: !1,
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.RENDERING,
    settingName: 'showFPSCounter',
    settingType: t.Settings.SettingType.BOOLEAN,
    storageType: t.Settings.SettingStorageType.Session,
    options: [
      { value: !0, title: ue(ge.showFramesPerSecondFpsMeter) },
      { value: !1, title: ue(ge.hideFramesPerSecondFpsMeter) },
    ],
    defaultValue: !1,
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.RENDERING,
    settingName: 'showScrollBottleneckRects',
    settingType: t.Settings.SettingType.BOOLEAN,
    storageType: t.Settings.SettingStorageType.Session,
    options: [
      { value: !0, title: ue(ge.showScrollPerformanceBottlenecks) },
      { value: !1, title: ue(ge.hideScrollPerformanceBottlenecks) },
    ],
    defaultValue: !1,
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.RENDERING,
    title: ue(ge.emulateAFocusedPage),
    settingName: 'emulatePageFocus',
    settingType: t.Settings.SettingType.BOOLEAN,
    storageType: t.Settings.SettingStorageType.Session,
    defaultValue: !1,
    options: [
      { value: !0, title: ue(ge.emulateAFocusedPage) },
      { value: !1, title: ue(ge.doNotEmulateAFocusedPage) },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.RENDERING,
    settingName: 'emulatedCSSMedia',
    settingType: t.Settings.SettingType.ENUM,
    storageType: t.Settings.SettingStorageType.Session,
    defaultValue: '',
    options: [
      {
        title: ue(ge.doNotEmulateCssMediaType),
        text: ue(ge.noEmulation),
        value: '',
      },
      {
        title: ue(ge.emulateCssPrintMediaType),
        text: ue(ge.print),
        value: 'print',
      },
      {
        title: ue(ge.emulateCssScreenMediaType),
        text: ue(ge.screen),
        value: 'screen',
      },
    ],
    tags: [ue(ge.query)],
    title: ue(ge.emulateCssMediaType),
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.RENDERING,
    settingName: 'emulatedCSSMediaFeaturePrefersColorScheme',
    settingType: t.Settings.SettingType.ENUM,
    storageType: t.Settings.SettingStorageType.Session,
    defaultValue: '',
    options: [
      {
        title: ue(ge.doNotEmulateCss, { PH1: 'prefers-color-scheme' }),
        text: ue(ge.noEmulation),
        value: '',
      },
      {
        title: ue(ge.emulateCss, { PH1: 'prefers-color-scheme: light' }),
        text: i.i18n.lockedLazyString('prefers-color-scheme: light'),
        value: 'light',
      },
      {
        title: ue(ge.emulateCss, { PH1: 'prefers-color-scheme: dark' }),
        text: i.i18n.lockedLazyString('prefers-color-scheme: dark'),
        value: 'dark',
      },
    ],
    tags: [ue(ge.query)],
    title: ue(ge.emulateCssMediaFeature, { PH1: 'prefers-color-scheme' }),
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.RENDERING,
    settingName: 'emulatedCSSMediaFeatureForcedColors',
    settingType: t.Settings.SettingType.ENUM,
    storageType: t.Settings.SettingStorageType.Session,
    defaultValue: '',
    options: [
      {
        title: ue(ge.doNotEmulateCss, { PH1: 'forced-colors' }),
        text: ue(ge.noEmulation),
        value: '',
      },
      {
        title: ue(ge.emulateCss, { PH1: 'forced-colors: active' }),
        text: i.i18n.lockedLazyString('forced-colors: active'),
        value: 'active',
      },
      {
        title: ue(ge.emulateCss, { PH1: 'forced-colors: none' }),
        text: i.i18n.lockedLazyString('forced-colors: none'),
        value: 'none',
      },
    ],
    tags: [ue(ge.query)],
    title: ue(ge.emulateCssMediaFeature, { PH1: 'forced-colors' }),
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.RENDERING,
    settingName: 'emulatedCSSMediaFeaturePrefersReducedMotion',
    settingType: t.Settings.SettingType.ENUM,
    storageType: t.Settings.SettingStorageType.Session,
    defaultValue: '',
    options: [
      {
        title: ue(ge.doNotEmulateCss, { PH1: 'prefers-reduced-motion' }),
        text: ue(ge.noEmulation),
        value: '',
      },
      {
        title: ue(ge.emulateCss, { PH1: 'prefers-reduced-motion: reduce' }),
        text: i.i18n.lockedLazyString('prefers-reduced-motion: reduce'),
        value: 'reduce',
      },
    ],
    tags: [ue(ge.query)],
    title: ue(ge.emulateCssMediaFeature, { PH1: 'prefers-reduced-motion' }),
  }),
  t.Settings.registerSettingExtension({
    settingName: 'emulatedCSSMediaFeaturePrefersContrast',
    settingType: t.Settings.SettingType.ENUM,
    storageType: t.Settings.SettingStorageType.Session,
    defaultValue: '',
    options: [
      {
        title: ue(ge.doNotEmulateCss, { PH1: 'prefers-contrast' }),
        text: ue(ge.noEmulation),
        value: '',
      },
      {
        title: ue(ge.emulateCss, { PH1: 'prefers-contrast: more' }),
        text: i.i18n.lockedLazyString('prefers-contrast: more'),
        value: 'more',
      },
      {
        title: ue(ge.emulateCss, { PH1: 'prefers-contrast: less' }),
        text: i.i18n.lockedLazyString('prefers-contrast: less'),
        value: 'less',
      },
      {
        title: ue(ge.emulateCss, { PH1: 'prefers-contrast: custom' }),
        text: i.i18n.lockedLazyString('prefers-contrast: custom'),
        value: 'custom',
      },
    ],
    tags: [ue(ge.query)],
    title: ue(ge.emulateCssMediaFeature, { PH1: 'prefers-contrast' }),
  }),
  t.Settings.registerSettingExtension({
    settingName: 'emulatedCSSMediaFeaturePrefersReducedData',
    settingType: t.Settings.SettingType.ENUM,
    storageType: t.Settings.SettingStorageType.Session,
    defaultValue: '',
    options: [
      {
        title: ue(ge.doNotEmulateCss, { PH1: 'prefers-reduced-data' }),
        text: ue(ge.noEmulation),
        value: '',
      },
      {
        title: ue(ge.emulateCss, { PH1: 'prefers-reduced-data: reduce' }),
        text: i.i18n.lockedLazyString('prefers-reduced-data: reduce'),
        value: 'reduce',
      },
    ],
    title: ue(ge.emulateCssMediaFeature, { PH1: 'prefers-reduced-data' }),
  }),
  t.Settings.registerSettingExtension({
    settingName: 'emulatedCSSMediaFeatureColorGamut',
    settingType: t.Settings.SettingType.ENUM,
    storageType: t.Settings.SettingStorageType.Session,
    defaultValue: '',
    options: [
      {
        title: ue(ge.doNotEmulateCss, { PH1: 'color-gamut' }),
        text: ue(ge.noEmulation),
        value: '',
      },
      {
        title: ue(ge.emulateCss, { PH1: 'color-gamut: srgb' }),
        text: i.i18n.lockedLazyString('color-gamut: srgb'),
        value: 'srgb',
      },
      {
        title: ue(ge.emulateCss, { PH1: 'color-gamut: p3' }),
        text: i.i18n.lockedLazyString('color-gamut: p3'),
        value: 'p3',
      },
      {
        title: ue(ge.emulateCss, { PH1: 'color-gamut: rec2020' }),
        text: i.i18n.lockedLazyString('color-gamut: rec2020'),
        value: 'rec2020',
      },
    ],
    title: ue(ge.emulateCssMediaFeature, { PH1: 'color-gamut' }),
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.RENDERING,
    settingName: 'emulatedVisionDeficiency',
    settingType: t.Settings.SettingType.ENUM,
    storageType: t.Settings.SettingStorageType.Session,
    defaultValue: 'none',
    options: [
      {
        title: ue(ge.doNotEmulateAnyVisionDeficiency),
        text: ue(ge.noEmulation),
        value: 'none',
      },
      {
        title: ue(ge.emulateBlurredVision),
        text: ue(ge.blurredVision),
        value: 'blurredVision',
      },
      {
        title: ue(ge.emulateProtanopia),
        text: ue(ge.protanopia),
        value: 'protanopia',
      },
      {
        title: ue(ge.emulateDeuteranopia),
        text: ue(ge.deuteranopia),
        value: 'deuteranopia',
      },
      {
        title: ue(ge.emulateTritanopia),
        text: ue(ge.tritanopia),
        value: 'tritanopia',
      },
      {
        title: ue(ge.emulateAchromatopsia),
        text: ue(ge.achromatopsia),
        value: 'achromatopsia',
      },
    ],
    tags: [ue(ge.query)],
    title: ue(ge.emulateVisionDeficiencies),
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.RENDERING,
    settingName: 'localFontsDisabled',
    settingType: t.Settings.SettingType.BOOLEAN,
    storageType: t.Settings.SettingStorageType.Session,
    options: [
      { value: !0, title: ue(ge.disableLocalFonts) },
      { value: !1, title: ue(ge.enableLocalFonts) },
    ],
    defaultValue: !1,
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.RENDERING,
    settingName: 'avifFormatDisabled',
    settingType: t.Settings.SettingType.BOOLEAN,
    storageType: t.Settings.SettingStorageType.Session,
    options: [
      { value: !0, title: ue(ge.disableAvifFormat) },
      { value: !1, title: ue(ge.enableAvifFormat) },
    ],
    defaultValue: !1,
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.RENDERING,
    settingName: 'jpegXlFormatDisabled',
    settingType: t.Settings.SettingType.BOOLEAN,
    storageType: t.Settings.SettingStorageType.Session,
    options: [
      { value: !0, title: ue(ge.disableJpegXlFormat) },
      { value: !1, title: ue(ge.enableJpegXlFormat) },
    ],
    defaultValue: !1,
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.RENDERING,
    settingName: 'webpFormatDisabled',
    settingType: t.Settings.SettingType.BOOLEAN,
    storageType: t.Settings.SettingStorageType.Session,
    options: [
      { value: !0, title: ue(ge.disableWebpFormat) },
      { value: !1, title: ue(ge.enableWebpFormat) },
    ],
    defaultValue: !1,
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.CONSOLE,
    title: ue(ge.enableCustomFormatters),
    settingName: 'customFormatters',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !1,
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.NETWORK,
    title: ue(ge.enableNetworkRequestBlocking),
    settingName: 'requestBlockingEnabled',
    settingType: t.Settings.SettingType.BOOLEAN,
    storageType: t.Settings.SettingStorageType.Session,
    defaultValue: !1,
    options: [
      { value: !0, title: ue(ge.enableNetworkRequestBlocking) },
      { value: !1, title: ue(ge.disableNetworkRequestBlocking) },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.NETWORK,
    title: ue(ge.disableCache),
    settingName: 'cacheDisabled',
    settingType: t.Settings.SettingType.BOOLEAN,
    order: 0,
    defaultValue: !1,
    userActionCondition: 'hasOtherClients',
    options: [
      { value: !0, title: ue(ge.disableCache) },
      { value: !1, title: ue(ge.enableCache) },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.RENDERING,
    title: ue(ge.emulateAutoDarkMode),
    settingName: 'emulateAutoDarkMode',
    settingType: t.Settings.SettingType.ENUM,
    storageType: t.Settings.SettingStorageType.Session,
    defaultValue: 'default',
    options: [
      {
        title: ue(ge.doNotEmulateDarkMode),
        text: ue(ge.noEmulation),
        value: 'default',
      },
      {
        title: ue(ge.enableEmulateAutoDarkMode),
        text: ue(ge.enabledDarkMode),
        value: 'enabled',
      },
      {
        title: ue(ge.disableEmulateAutoDarkMode),
        text: ue(ge.disabledDarkMode),
        value: 'disabled',
      },
    ],
  })
const pe = {
    defaultIndentation: 'Default indentation:',
    setIndentationToSpaces: 'Set indentation to 2 spaces',
    Spaces: '2 spaces',
    setIndentationToFSpaces: 'Set indentation to 4 spaces',
    fSpaces: '4 spaces',
    setIndentationToESpaces: 'Set indentation to 8 spaces',
    eSpaces: '8 spaces',
    setIndentationToTabCharacter: 'Set indentation to tab character',
    tabCharacter: 'Tab character',
  },
  Se = i.i18n.registerUIStrings(
    'ui/legacy/components/source_frame/source_frame-meta.ts',
    pe
  ),
  me = i.i18n.getLazilyComputedLocalizedString.bind(void 0, Se)
let ye, we
t.Settings.registerSettingExtension({
  category: t.Settings.SettingCategory.SOURCES,
  storageType: t.Settings.SettingStorageType.Synced,
  title: me(pe.defaultIndentation),
  settingName: 'textEditorIndent',
  settingType: t.Settings.SettingType.ENUM,
  defaultValue: '    ',
  options: [
    { title: me(pe.setIndentationToSpaces), text: me(pe.Spaces), value: '  ' },
    {
      title: me(pe.setIndentationToFSpaces),
      text: me(pe.fSpaces),
      value: '    ',
    },
    {
      title: me(pe.setIndentationToESpaces),
      text: me(pe.eSpaces),
      value: '        ',
    },
    {
      title: me(pe.setIndentationToTabCharacter),
      text: me(pe.tabCharacter),
      value: '\t',
    },
  ],
}),
  r.Toolbar.registerToolbarItem({
    loadItem: async () =>
      (
        await (async function () {
          return (
            ye ||
              (ye = await import(
                '../../panels/console_counters/console_counters.js'
              )),
            ye
          )
        })()
      ).WarningErrorCounter.WarningErrorCounter.instance(),
    order: 1,
    location: r.Toolbar.ToolbarItemLocation.MAIN_TOOLBAR_RIGHT,
    showLabel: void 0,
    condition: void 0,
    separator: void 0,
    actionId: void 0,
  }),
  r.UIUtils.registerRenderer({
    contextTypes: () => [o.RemoteObject.RemoteObject],
    loadRenderer: async () =>
      (
        await (async function () {
          return (
            we ||
              (we = await import(
                '../../ui/legacy/components/object_ui/object_ui.js'
              )),
            we
          )
        })()
      ).ObjectPropertiesSection.Renderer.instance(),
  })
const he = {
    showElements: 'Show Elements',
    elements: 'Elements',
    showEventListeners: 'Show Event Listeners',
    eventListeners: 'Event Listeners',
    showProperties: 'Show Properties',
    properties: 'Properties',
    showStackTrace: 'Show Stack Trace',
    stackTrace: 'Stack Trace',
    showLayout: 'Show Layout',
    layout: 'Layout',
    hideElement: 'Hide element',
    editAsHtml: 'Edit as HTML',
    duplicateElement: 'Duplicate element',
    undo: 'Undo',
    redo: 'Redo',
    captureAreaScreenshot: 'Capture area screenshot',
    selectAnElementInThePageTo: 'Select an element in the page to inspect it',
    wordWrap: 'Word wrap',
    enableDomWordWrap: 'Enable `DOM` word wrap',
    disableDomWordWrap: 'Disable `DOM` word wrap',
    showHtmlComments: 'Show `HTML` comments',
    hideHtmlComments: 'Hide `HTML` comments',
    revealDomNodeOnHover: 'Reveal `DOM` node on hover',
    showDetailedInspectTooltip: 'Show detailed inspect tooltip',
    copyStyles: 'Copy styles',
    showUserAgentShadowDOM: 'Show user agent shadow `DOM`',
  },
  Ae = i.i18n.registerUIStrings('panels/elements/elements-meta.ts', he),
  Ee = i.i18n.getLazilyComputedLocalizedString.bind(void 0, Ae)
let ve
async function Te() {
  return ve || (ve = await import('../../panels/elements/elements.js')), ve
}
function Ce(e) {
  return void 0 === ve ? [] : e(ve)
}
r.ViewManager.registerViewExtension({
  location: 'panel',
  id: 'elements',
  commandPrompt: Ee(he.showElements),
  title: Ee(he.elements),
  order: 10,
  persistence: 'permanent',
  hasToolbar: !1,
  loadView: async () => (await Te()).ElementsPanel.ElementsPanel.instance(),
}),
  r.ViewManager.registerViewExtension({
    location: 'elements-sidebar',
    id: 'elements.eventListeners',
    commandPrompt: Ee(he.showEventListeners),
    title: Ee(he.eventListeners),
    order: 5,
    hasToolbar: !0,
    persistence: 'permanent',
    loadView: async () =>
      (await Te()).EventListenersWidget.EventListenersWidget.instance(),
  }),
  r.ViewManager.registerViewExtension({
    location: 'elements-sidebar',
    id: 'elements.domProperties',
    commandPrompt: Ee(he.showProperties),
    title: Ee(he.properties),
    order: 7,
    persistence: 'permanent',
    loadView: async () =>
      (await Te()).PropertiesWidget.PropertiesWidget.instance(),
  }),
  r.ViewManager.registerViewExtension({
    experiment: e.Runtime.ExperimentName.CAPTURE_NODE_CREATION_STACKS,
    location: 'elements-sidebar',
    id: 'elements.domCreation',
    commandPrompt: Ee(he.showStackTrace),
    title: Ee(he.stackTrace),
    order: 10,
    persistence: 'permanent',
    loadView: async () =>
      (await Te()).NodeStackTraceWidget.NodeStackTraceWidget.instance(),
  }),
  r.ViewManager.registerViewExtension({
    location: 'elements-sidebar',
    id: 'elements.layout',
    commandPrompt: Ee(he.showLayout),
    title: Ee(he.layout),
    order: 4,
    persistence: 'permanent',
    loadView: async () =>
      (await Te()).LayoutSidebarPane.LayoutSidebarPane.instance(),
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'elements.hide-element',
    category: r.ActionRegistration.ActionCategory.ELEMENTS,
    title: Ee(he.hideElement),
    loadActionDelegate: async () =>
      (await Te()).ElementsPanel.ElementsActionDelegate.instance(),
    contextTypes: () => Ce((e) => [e.ElementsPanel.ElementsPanel]),
    bindings: [{ shortcut: 'H' }],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'elements.edit-as-html',
    category: r.ActionRegistration.ActionCategory.ELEMENTS,
    title: Ee(he.editAsHtml),
    loadActionDelegate: async () =>
      (await Te()).ElementsPanel.ElementsActionDelegate.instance(),
    contextTypes: () => Ce((e) => [e.ElementsPanel.ElementsPanel]),
    bindings: [{ shortcut: 'F2' }],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'elements.duplicate-element',
    category: r.ActionRegistration.ActionCategory.ELEMENTS,
    title: Ee(he.duplicateElement),
    loadActionDelegate: async () =>
      (await Te()).ElementsPanel.ElementsActionDelegate.instance(),
    contextTypes: () => Ce((e) => [e.ElementsPanel.ElementsPanel]),
    bindings: [{ shortcut: 'Shift+Alt+Down' }],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'elements.copy-styles',
    category: r.ActionRegistration.ActionCategory.ELEMENTS,
    title: Ee(he.copyStyles),
    loadActionDelegate: async () =>
      (await Te()).ElementsPanel.ElementsActionDelegate.instance(),
    contextTypes: () => Ce((e) => [e.ElementsPanel.ElementsPanel]),
    bindings: [
      { shortcut: 'Ctrl+Alt+C', platform: 'windows,linux' },
      { shortcut: 'Meta+Alt+C', platform: 'mac' },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'elements.undo',
    category: r.ActionRegistration.ActionCategory.ELEMENTS,
    title: Ee(he.undo),
    loadActionDelegate: async () =>
      (await Te()).ElementsPanel.ElementsActionDelegate.instance(),
    contextTypes: () => Ce((e) => [e.ElementsPanel.ElementsPanel]),
    bindings: [
      { shortcut: 'Ctrl+Z', platform: 'windows,linux' },
      { shortcut: 'Meta+Z', platform: 'mac' },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'elements.redo',
    category: r.ActionRegistration.ActionCategory.ELEMENTS,
    title: Ee(he.redo),
    loadActionDelegate: async () =>
      (await Te()).ElementsPanel.ElementsActionDelegate.instance(),
    contextTypes: () => Ce((e) => [e.ElementsPanel.ElementsPanel]),
    bindings: [
      { shortcut: 'Ctrl+Y', platform: 'windows,linux' },
      { shortcut: 'Meta+Shift+Z', platform: 'mac' },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'elements.capture-area-screenshot',
    loadActionDelegate: async () =>
      (
        await Te()
      ).InspectElementModeController.ToggleSearchActionDelegate.instance(),
    condition: e.Runtime.ConditionName.CAN_DOCK,
    title: Ee(he.captureAreaScreenshot),
    category: r.ActionRegistration.ActionCategory.SCREENSHOT,
  }),
  r.ActionRegistration.registerActionExtension({
    category: r.ActionRegistration.ActionCategory.ELEMENTS,
    actionId: 'elements.toggle-element-search',
    toggleable: !0,
    loadActionDelegate: async () =>
      (
        await Te()
      ).InspectElementModeController.ToggleSearchActionDelegate.instance(),
    title: Ee(he.selectAnElementInThePageTo),
    iconClass: 'largeicon-node-search',
    bindings: [
      { shortcut: 'Ctrl+Shift+C', platform: 'windows,linux' },
      { shortcut: 'Meta+Shift+C', platform: 'mac' },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.ELEMENTS,
    storageType: t.Settings.SettingStorageType.Synced,
    order: 1,
    title: Ee(he.showUserAgentShadowDOM),
    settingName: 'showUAShadowDOM',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !1,
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.ELEMENTS,
    storageType: t.Settings.SettingStorageType.Synced,
    order: 2,
    title: Ee(he.wordWrap),
    settingName: 'domWordWrap',
    settingType: t.Settings.SettingType.BOOLEAN,
    options: [
      { value: !0, title: Ee(he.enableDomWordWrap) },
      { value: !1, title: Ee(he.disableDomWordWrap) },
    ],
    defaultValue: !0,
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.ELEMENTS,
    storageType: t.Settings.SettingStorageType.Synced,
    order: 3,
    title: Ee(he.showHtmlComments),
    settingName: 'showHTMLComments',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !0,
    options: [
      { value: !0, title: Ee(he.showHtmlComments) },
      { value: !1, title: Ee(he.hideHtmlComments) },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.ELEMENTS,
    storageType: t.Settings.SettingStorageType.Synced,
    order: 4,
    title: Ee(he.revealDomNodeOnHover),
    settingName: 'highlightNodeOnHoverInOverlay',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !0,
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.ELEMENTS,
    storageType: t.Settings.SettingStorageType.Synced,
    order: 5,
    title: Ee(he.showDetailedInspectTooltip),
    settingName: 'showDetailedInspectTooltip',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !0,
  }),
  t.Settings.registerSettingExtension({
    settingName: 'showEventListenersForAncestors',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !0,
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.ADORNER,
    storageType: t.Settings.SettingStorageType.Synced,
    settingName: 'adornerSettings',
    settingType: t.Settings.SettingType.ARRAY,
    defaultValue: [],
  }),
  r.ContextMenu.registerProvider({
    contextTypes: () => [
      o.RemoteObject.RemoteObject,
      o.DOMModel.DOMNode,
      o.DOMModel.DeferredDOMNode,
    ],
    loadProvider: async () =>
      (await Te()).ElementsPanel.ContextMenuProvider.instance(),
    experiment: void 0,
  }),
  r.ViewManager.registerLocationResolver({
    name: 'elements-sidebar',
    category: r.ViewManager.ViewLocationCategoryValues.ELEMENTS,
    loadResolver: async () =>
      (await Te()).ElementsPanel.ElementsPanel.instance(),
  }),
  t.Revealer.registerRevealer({
    contextTypes: () => [
      o.DOMModel.DOMNode,
      o.DOMModel.DeferredDOMNode,
      o.RemoteObject.RemoteObject,
    ],
    destination: t.Revealer.RevealerDestination.ELEMENTS_PANEL,
    loadRevealer: async () =>
      (await Te()).ElementsPanel.DOMNodeRevealer.instance(),
  }),
  t.Revealer.registerRevealer({
    contextTypes: () => [o.CSSProperty.CSSProperty],
    destination: t.Revealer.RevealerDestination.STYLES_SIDEBAR,
    loadRevealer: async () =>
      (await Te()).ElementsPanel.CSSPropertyRevealer.instance(),
  }),
  r.Toolbar.registerToolbarItem({
    loadItem: async () =>
      (await Te()).ElementStatePaneWidget.ButtonProvider.instance(),
    order: 1,
    location: r.Toolbar.ToolbarItemLocation.STYLES_SIDEBARPANE_TOOLBAR,
    showLabel: void 0,
    condition: void 0,
    separator: void 0,
    actionId: void 0,
  }),
  r.Toolbar.registerToolbarItem({
    loadItem: async () =>
      (await Te()).ClassesPaneWidget.ButtonProvider.instance(),
    order: 2,
    location: r.Toolbar.ToolbarItemLocation.STYLES_SIDEBARPANE_TOOLBAR,
    showLabel: void 0,
    condition: void 0,
    separator: void 0,
    actionId: void 0,
  }),
  r.Toolbar.registerToolbarItem({
    loadItem: async () =>
      (await Te()).StylesSidebarPane.ButtonProvider.instance(),
    order: 100,
    location: r.Toolbar.ToolbarItemLocation.STYLES_SIDEBARPANE_TOOLBAR,
    showLabel: void 0,
    condition: void 0,
    separator: void 0,
    actionId: void 0,
  }),
  r.Toolbar.registerToolbarItem({
    actionId: 'elements.toggle-element-search',
    location: r.Toolbar.ToolbarItemLocation.MAIN_TOOLBAR_LEFT,
    order: 0,
    showLabel: void 0,
    condition: void 0,
    separator: void 0,
    loadItem: void 0,
  }),
  r.UIUtils.registerRenderer({
    contextTypes: () => [o.DOMModel.DOMNode, o.DOMModel.DeferredDOMNode],
    loadRenderer: async () =>
      (await Te()).ElementsTreeOutline.Renderer.instance(),
  }),
  t.Linkifier.registerLinkifier({
    contextTypes: () => [o.DOMModel.DOMNode, o.DOMModel.DeferredDOMNode],
    loadLinkifier: async () => (await Te()).DOMLinkifier.Linkifier.instance(),
  })
const be = {
    showEventListenerBreakpoints: 'Show Event Listener Breakpoints',
    eventListenerBreakpoints: 'Event Listener Breakpoints',
    showCspViolationBreakpoints: 'Show CSP Violation Breakpoints',
    cspViolationBreakpoints: 'CSP Violation Breakpoints',
    showXhrfetchBreakpoints: 'Show XHR/fetch Breakpoints',
    xhrfetchBreakpoints: 'XHR/fetch Breakpoints',
    showDomBreakpoints: 'Show DOM Breakpoints',
    domBreakpoints: 'DOM Breakpoints',
    showGlobalListeners: 'Show Global Listeners',
    globalListeners: 'Global Listeners',
    page: 'Page',
    showPage: 'Show Page',
    overrides: 'Overrides',
    showOverrides: 'Show Overrides',
    contentScripts: 'Content scripts',
    showContentScripts: 'Show Content scripts',
  },
  Re = i.i18n.registerUIStrings(
    'panels/browser_debugger/browser_debugger-meta.ts',
    be
  ),
  Ne = i.i18n.getLazilyComputedLocalizedString.bind(void 0, Re)
let xe, fe
async function De() {
  return (
    xe ||
      (xe = await import('../../panels/browser_debugger/browser_debugger.js')),
    xe
  )
}
async function Le() {
  return fe || (fe = await import('../../panels/sources/sources.js')), fe
}
r.ViewManager.registerViewExtension({
  loadView: async () =>
    (
      await De()
    ).EventListenerBreakpointsSidebarPane.EventListenerBreakpointsSidebarPane.instance(),
  id: 'sources.eventListenerBreakpoints',
  location: 'sources.sidebar-bottom',
  commandPrompt: Ne(be.showEventListenerBreakpoints),
  title: Ne(be.eventListenerBreakpoints),
  order: 9,
  persistence: 'permanent',
}),
  r.ViewManager.registerViewExtension({
    loadView: async () =>
      (
        await De()
      ).CSPViolationBreakpointsSidebarPane.CSPViolationBreakpointsSidebarPane.instance(),
    id: 'sources.cspViolationBreakpoints',
    location: 'sources.sidebar-bottom',
    commandPrompt: Ne(be.showCspViolationBreakpoints),
    title: Ne(be.cspViolationBreakpoints),
    order: 10,
    persistence: 'permanent',
  }),
  r.ViewManager.registerViewExtension({
    loadView: async () =>
      (
        await De()
      ).XHRBreakpointsSidebarPane.XHRBreakpointsSidebarPane.instance(),
    id: 'sources.xhrBreakpoints',
    location: 'sources.sidebar-bottom',
    commandPrompt: Ne(be.showXhrfetchBreakpoints),
    title: Ne(be.xhrfetchBreakpoints),
    order: 5,
    persistence: 'permanent',
    hasToolbar: !0,
  }),
  r.ViewManager.registerViewExtension({
    loadView: async () =>
      (
        await De()
      ).DOMBreakpointsSidebarPane.DOMBreakpointsSidebarPane.instance(),
    id: 'sources.domBreakpoints',
    location: 'sources.sidebar-bottom',
    commandPrompt: Ne(be.showDomBreakpoints),
    title: Ne(be.domBreakpoints),
    order: 7,
    persistence: 'permanent',
  }),
  r.ViewManager.registerViewExtension({
    loadView: async () =>
      (
        await De()
      ).ObjectEventListenersSidebarPane.ObjectEventListenersSidebarPane.instance(),
    id: 'sources.globalListeners',
    location: 'sources.sidebar-bottom',
    commandPrompt: Ne(be.showGlobalListeners),
    title: Ne(be.globalListeners),
    order: 8,
    persistence: 'permanent',
    hasToolbar: !0,
  }),
  r.ViewManager.registerViewExtension({
    loadView: async () =>
      (
        await De()
      ).DOMBreakpointsSidebarPane.DOMBreakpointsSidebarPane.instance(),
    id: 'elements.domBreakpoints',
    location: 'elements-sidebar',
    commandPrompt: Ne(be.showDomBreakpoints),
    title: Ne(be.domBreakpoints),
    order: 6,
    persistence: 'permanent',
  }),
  r.ViewManager.registerViewExtension({
    location: 'navigator-view',
    id: 'navigator-network',
    title: Ne(be.page),
    commandPrompt: Ne(be.showPage),
    order: 2,
    persistence: 'permanent',
    loadView: async () =>
      (await Le()).SourcesNavigator.NetworkNavigatorView.instance(),
  }),
  r.ViewManager.registerViewExtension({
    location: 'navigator-view',
    id: 'navigator-overrides',
    title: Ne(be.overrides),
    commandPrompt: Ne(be.showOverrides),
    order: 4,
    persistence: 'permanent',
    loadView: async () =>
      (await Le()).SourcesNavigator.OverridesNavigatorView.instance(),
  }),
  r.ViewManager.registerViewExtension({
    location: 'navigator-view',
    id: 'navigator-contentScripts',
    title: Ne(be.contentScripts),
    commandPrompt: Ne(be.showContentScripts),
    order: 5,
    persistence: 'permanent',
    loadView: async () =>
      (await Le()).SourcesNavigator.ContentScriptsNavigatorView.instance(),
  }),
  r.ContextMenu.registerProvider({
    contextTypes: () => [o.DOMModel.DOMNode],
    loadProvider: async () =>
      (await De()).DOMBreakpointsSidebarPane.ContextMenuProvider.instance(),
    experiment: void 0,
  }),
  r.Context.registerListener({
    contextTypes: () => [o.DebuggerModel.DebuggerPausedDetails],
    loadListener: async () =>
      (
        await De()
      ).XHRBreakpointsSidebarPane.XHRBreakpointsSidebarPane.instance(),
  }),
  r.Context.registerListener({
    contextTypes: () => [o.DebuggerModel.DebuggerPausedDetails],
    loadListener: async () =>
      (
        await De()
      ).DOMBreakpointsSidebarPane.DOMBreakpointsSidebarPane.instance(),
  })
const Pe = {
    showNetwork: 'Show Network',
    network: 'Network',
    showNetworkRequestBlocking: 'Show Network request blocking',
    networkRequestBlocking: 'Network request blocking',
    showNetworkConditions: 'Show Network conditions',
    networkConditions: 'Network conditions',
    diskCache: 'disk cache',
    networkThrottling: 'network throttling',
    showSearch: 'Show Search',
    search: 'Search',
    recordNetworkLog: 'Record network log',
    stopRecordingNetworkLog: 'Stop recording network log',
    hideRequestDetails: 'Hide request details',
    colorcodeResourceTypes: 'Color-code resource types',
    colorCode: 'color code',
    resourceType: 'resource type',
    colorCodeByResourceType: 'Color code by resource type',
    useDefaultColors: 'Use default colors',
    groupNetworkLogByFrame: 'Group network log by frame',
    netWork: 'network',
    frame: 'frame',
    group: 'group',
    groupNetworkLogItemsByFrame: 'Group network log items by frame',
    dontGroupNetworkLogItemsByFrame: "Don't group network log items by frame",
  },
  Ie = i.i18n.registerUIStrings('panels/network/network-meta.ts', Pe),
  ke = i.i18n.getLazilyComputedLocalizedString.bind(void 0, Ie)
let Oe
async function Me() {
  return Oe || (Oe = await import('../../panels/network/network.js')), Oe
}
function Ve(e) {
  return void 0 === Oe ? [] : e(Oe)
}
r.ViewManager.registerViewExtension({
  location: 'panel',
  id: 'network',
  commandPrompt: ke(Pe.showNetwork),
  title: ke(Pe.network),
  order: 40,
  loadView: async () => (await Me()).NetworkPanel.NetworkPanel.instance(),
}),
  globalThis.chii ||
    (r.ViewManager.registerViewExtension({
      location: 'drawer-view',
      id: 'network.blocked-urls',
      commandPrompt: ke(Pe.showNetworkRequestBlocking),
      title: ke(Pe.networkRequestBlocking),
      persistence: 'closeable',
      order: 60,
      loadView: async () =>
        (await Me()).BlockedURLsPane.BlockedURLsPane.instance(),
    }),
    r.ViewManager.registerViewExtension({
      location: 'drawer-view',
      id: 'network.config',
      commandPrompt: ke(Pe.showNetworkConditions),
      title: ke(Pe.networkConditions),
      persistence: 'closeable',
      order: 40,
      tags: [
        ke(Pe.diskCache),
        ke(Pe.networkThrottling),
        i.i18n.lockedLazyString('useragent'),
        i.i18n.lockedLazyString('user agent'),
        i.i18n.lockedLazyString('user-agent'),
      ],
      loadView: async () =>
        (await Me()).NetworkConfigView.NetworkConfigView.instance(),
    })),
  r.ViewManager.registerViewExtension({
    location: 'network-sidebar',
    id: 'network.search-network-tab',
    commandPrompt: ke(Pe.showSearch),
    title: ke(Pe.search),
    persistence: 'permanent',
    loadView: async () =>
      (await Me()).NetworkPanel.SearchNetworkView.instance(),
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'network.toggle-recording',
    category: r.ActionRegistration.ActionCategory.NETWORK,
    iconClass: 'largeicon-start-recording',
    toggleable: !0,
    toggledIconClass: 'largeicon-stop-recording',
    toggleWithRedColor: !0,
    contextTypes: () => Ve((e) => [e.NetworkPanel.NetworkPanel]),
    loadActionDelegate: async () =>
      (await Me()).NetworkPanel.ActionDelegate.instance(),
    options: [
      { value: !0, title: ke(Pe.recordNetworkLog) },
      { value: !1, title: ke(Pe.stopRecordingNetworkLog) },
    ],
    bindings: [
      { shortcut: 'Ctrl+E', platform: 'windows,linux' },
      { shortcut: 'Meta+E', platform: 'mac' },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'network.hide-request-details',
    category: r.ActionRegistration.ActionCategory.NETWORK,
    title: ke(Pe.hideRequestDetails),
    contextTypes: () => Ve((e) => [e.NetworkPanel.NetworkPanel]),
    loadActionDelegate: async () =>
      (await Me()).NetworkPanel.ActionDelegate.instance(),
    bindings: [{ shortcut: 'Esc' }],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'network.search',
    category: r.ActionRegistration.ActionCategory.NETWORK,
    title: ke(Pe.search),
    contextTypes: () => Ve((e) => [e.NetworkPanel.NetworkPanel]),
    loadActionDelegate: async () =>
      (await Me()).NetworkPanel.ActionDelegate.instance(),
    bindings: [
      {
        platform: 'mac',
        shortcut: 'Meta+F',
        keybindSets: ['devToolsDefault', 'vsCode'],
      },
      {
        platform: 'windows,linux',
        shortcut: 'Ctrl+F',
        keybindSets: ['devToolsDefault', 'vsCode'],
      },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.NETWORK,
    storageType: t.Settings.SettingStorageType.Synced,
    title: ke(Pe.colorcodeResourceTypes),
    settingName: 'networkColorCodeResourceTypes',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !1,
    tags: [ke(Pe.colorCode), ke(Pe.resourceType)],
    options: [
      { value: !0, title: ke(Pe.colorCodeByResourceType) },
      { value: !1, title: ke(Pe.useDefaultColors) },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.NETWORK,
    storageType: t.Settings.SettingStorageType.Synced,
    title: ke(Pe.groupNetworkLogByFrame),
    settingName: 'network.group-by-frame',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !1,
    tags: [ke(Pe.netWork), ke(Pe.frame), ke(Pe.group)],
    options: [
      { value: !0, title: ke(Pe.groupNetworkLogItemsByFrame) },
      { value: !1, title: ke(Pe.dontGroupNetworkLogItemsByFrame) },
    ],
  }),
  r.ViewManager.registerLocationResolver({
    name: 'network-sidebar',
    category: r.ViewManager.ViewLocationCategoryValues.NETWORK,
    loadResolver: async () => (await Me()).NetworkPanel.NetworkPanel.instance(),
  }),
  r.ContextMenu.registerProvider({
    contextTypes: () => [
      o.NetworkRequest.NetworkRequest,
      o.Resource.Resource,
      n.UISourceCode.UISourceCode,
    ],
    loadProvider: async () =>
      (await Me()).NetworkPanel.ContextMenuProvider.instance(),
    experiment: void 0,
  }),
  t.Revealer.registerRevealer({
    contextTypes: () => [o.NetworkRequest.NetworkRequest],
    destination: t.Revealer.RevealerDestination.NETWORK_PANEL,
    loadRevealer: async () =>
      (await Me()).NetworkPanel.RequestRevealer.instance(),
  }),
  t.Revealer.registerRevealer({
    contextTypes: () => [c.UIRequestLocation.UIRequestLocation],
    loadRevealer: async () =>
      (await Me()).NetworkPanel.RequestLocationRevealer.instance(),
    destination: void 0,
  }),
  t.Revealer.registerRevealer({
    contextTypes: () => [c.NetworkRequestId.NetworkRequestId],
    destination: t.Revealer.RevealerDestination.NETWORK_PANEL,
    loadRevealer: async () =>
      (await Me()).NetworkPanel.RequestIdRevealer.instance(),
  }),
  t.Revealer.registerRevealer({
    contextTypes: () => [c.UIFilter.UIRequestFilter],
    destination: t.Revealer.RevealerDestination.NETWORK_PANEL,
    loadRevealer: async () =>
      (await Me()).NetworkPanel.NetworkLogWithFilterRevealer.instance(),
  })
const Be = {
    toggleDeviceToolbar: 'Toggle device toolbar',
    captureScreenshot: 'Capture screenshot',
    captureFullSizeScreenshot: 'Capture full size screenshot',
    captureNodeScreenshot: 'Capture node screenshot',
    showMediaQueries: 'Show media queries',
    device: 'device',
    hideMediaQueries: 'Hide media queries',
    showRulers: 'Show rulers in the Device Mode toolbar',
    hideRulers: 'Hide rulers in the Device Mode toolbar',
    showDeviceFrame: 'Show device frame',
    hideDeviceFrame: 'Hide device frame',
  },
  Fe = i.i18n.registerUIStrings('panels/emulation/emulation-meta.ts', Be),
  Ue = i.i18n.getLazilyComputedLocalizedString.bind(void 0, Fe)
let _e
async function Ge() {
  return _e || (_e = await import('../../panels/emulation/emulation.js')), _e
}
r.ActionRegistration.registerActionExtension({
  category: r.ActionRegistration.ActionCategory.MOBILE,
  actionId: 'emulation.toggle-device-mode',
  toggleable: !0,
  loadActionDelegate: async () =>
    (await Ge()).DeviceModeWrapper.ActionDelegate.instance(),
  condition: e.Runtime.ConditionName.CAN_DOCK,
  title: Ue(Be.toggleDeviceToolbar),
  iconClass: 'largeicon-phone',
  bindings: [
    { platform: 'windows,linux', shortcut: 'Shift+Ctrl+M' },
    { platform: 'mac', shortcut: 'Shift+Meta+M' },
  ],
}),
  r.ActionRegistration.registerActionExtension({
    actionId: 'emulation.capture-screenshot',
    category: r.ActionRegistration.ActionCategory.SCREENSHOT,
    loadActionDelegate: async () =>
      (await Ge()).DeviceModeWrapper.ActionDelegate.instance(),
    condition: e.Runtime.ConditionName.CAN_DOCK,
    title: Ue(Be.captureScreenshot),
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'emulation.capture-full-height-screenshot',
    category: r.ActionRegistration.ActionCategory.SCREENSHOT,
    loadActionDelegate: async () =>
      (await Ge()).DeviceModeWrapper.ActionDelegate.instance(),
    condition: e.Runtime.ConditionName.CAN_DOCK,
    title: Ue(Be.captureFullSizeScreenshot),
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'emulation.capture-node-screenshot',
    category: r.ActionRegistration.ActionCategory.SCREENSHOT,
    loadActionDelegate: async () =>
      (await Ge()).DeviceModeWrapper.ActionDelegate.instance(),
    condition: e.Runtime.ConditionName.CAN_DOCK,
    title: Ue(Be.captureNodeScreenshot),
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.MOBILE,
    settingName: 'showMediaQueryInspector',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !1,
    options: [
      { value: !0, title: Ue(Be.showMediaQueries) },
      { value: !1, title: Ue(Be.hideMediaQueries) },
    ],
    tags: [Ue(Be.device)],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.MOBILE,
    settingName: 'emulation.showRulers',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !1,
    options: [
      { value: !0, title: Ue(Be.showRulers) },
      { value: !1, title: Ue(Be.hideRulers) },
    ],
    tags: [Ue(Be.device)],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.MOBILE,
    settingName: 'emulation.showDeviceOutline',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !1,
    options: [
      { value: !0, title: Ue(Be.showDeviceFrame) },
      { value: !1, title: Ue(Be.hideDeviceFrame) },
    ],
    tags: [Ue(Be.device)],
  }),
  r.Toolbar.registerToolbarItem({
    actionId: 'emulation.toggle-device-mode',
    condition: e.Runtime.ConditionName.CAN_DOCK,
    location: r.Toolbar.ToolbarItemLocation.MAIN_TOOLBAR_LEFT,
    order: 1,
    showLabel: void 0,
    loadItem: void 0,
    separator: void 0,
  }),
  t.AppProvider.registerAppProvider({
    loadAppProvider: async () =>
      (await Ge()).AdvancedApp.AdvancedAppProvider.instance(),
    condition: e.Runtime.ConditionName.CAN_DOCK,
    order: 0,
  }),
  r.ContextMenu.registerItem({
    location: r.ContextMenu.ItemLocation.DEVICE_MODE_MENU_SAVE,
    order: 12,
    actionId: 'emulation.capture-screenshot',
  }),
  r.ContextMenu.registerItem({
    location: r.ContextMenu.ItemLocation.DEVICE_MODE_MENU_SAVE,
    order: 13,
    actionId: 'emulation.capture-full-height-screenshot',
  })
const We = {
    sensors: 'Sensors',
    geolocation: 'geolocation',
    timezones: 'timezones',
    locale: 'locale',
    locales: 'locales',
    accelerometer: 'accelerometer',
    deviceOrientation: 'device orientation',
    locations: 'Locations',
    touch: 'Touch',
    devicebased: 'Device-based',
    forceEnabled: 'Force enabled',
    emulateIdleDetectorState: 'Emulate Idle Detector state',
    noIdleEmulation: 'No idle emulation',
    userActiveScreenUnlocked: 'User active, screen unlocked',
    userActiveScreenLocked: 'User active, screen locked',
    userIdleScreenUnlocked: 'User idle, screen unlocked',
    userIdleScreenLocked: 'User idle, screen locked',
    showSensors: 'Show Sensors',
    showLocations: 'Show Locations',
  },
  He = i.i18n.registerUIStrings('panels/sensors/sensors-meta.ts', We),
  ze = i.i18n.getLazilyComputedLocalizedString.bind(void 0, He)
let qe, je
async function Ke() {
  return qe || (qe = await import('../../panels/sensors/sensors.js')), qe
}
r.ViewManager.registerViewExtension({
  location: 'drawer-view',
  commandPrompt: ze(We.showSensors),
  title: ze(We.sensors),
  id: 'sensors',
  persistence: 'closeable',
  order: 100,
  loadView: async () => (await Ke()).SensorsView.SensorsView.instance(),
  tags: [
    ze(We.geolocation),
    ze(We.timezones),
    ze(We.locale),
    ze(We.locales),
    ze(We.accelerometer),
    ze(We.deviceOrientation),
  ],
}),
  r.ViewManager.registerViewExtension({
    location: 'settings-view',
    id: 'emulation-locations',
    commandPrompt: ze(We.showLocations),
    title: ze(We.locations),
    order: 40,
    loadView: async () =>
      (await Ke()).LocationsSettingsTab.LocationsSettingsTab.instance(),
    settings: ['emulation.locations'],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'emulation.show-sensors',
    category: r.ActionRegistration.ActionCategory.SENSORS,
    loadActionDelegate: async () =>
      (await Ke()).SensorsView.ShowActionDelegate.instance(),
    title: ze(We.sensors),
  }),
  t.Settings.registerSettingExtension({
    storageType: t.Settings.SettingStorageType.Synced,
    settingName: 'emulation.locations',
    settingType: t.Settings.SettingType.ARRAY,
    defaultValue: [
      {
        title: 'Berlin',
        lat: 52.520007,
        long: 13.404954,
        timezoneId: 'Europe/Berlin',
        locale: 'de-DE',
      },
      {
        title: 'London',
        lat: 51.507351,
        long: -0.127758,
        timezoneId: 'Europe/London',
        locale: 'en-GB',
      },
      {
        title: 'Moscow',
        lat: 55.755826,
        long: 37.6173,
        timezoneId: 'Europe/Moscow',
        locale: 'ru-RU',
      },
      {
        title: 'Mountain View',
        lat: 37.386052,
        long: -122.083851,
        timezoneId: 'US/Pacific',
        locale: 'en-US',
      },
      {
        title: 'Mumbai',
        lat: 19.075984,
        long: 72.877656,
        timezoneId: 'Asia/Kolkata',
        locale: 'mr-IN',
      },
      {
        title: 'San Francisco',
        lat: 37.774929,
        long: -122.419416,
        timezoneId: 'US/Pacific',
        locale: 'en-US',
      },
      {
        title: 'Shanghai',
        lat: 31.230416,
        long: 121.473701,
        timezoneId: 'Asia/Shanghai',
        locale: 'zh-Hans-CN',
      },
      {
        title: 'São Paulo',
        lat: -23.55052,
        long: -46.633309,
        timezoneId: 'America/Sao_Paulo',
        locale: 'pt-BR',
      },
      {
        title: 'Tokyo',
        lat: 35.689487,
        long: 139.691706,
        timezoneId: 'Asia/Tokyo',
        locale: 'ja-JP',
      },
    ],
  }),
  t.Settings.registerSettingExtension({
    title: ze(We.touch),
    reloadRequired: !0,
    settingName: 'emulation.touch',
    settingType: t.Settings.SettingType.ENUM,
    defaultValue: 'none',
    options: [
      { value: 'none', title: ze(We.devicebased), text: ze(We.devicebased) },
      { value: 'force', title: ze(We.forceEnabled), text: ze(We.forceEnabled) },
    ],
  }),
  t.Settings.registerSettingExtension({
    title: ze(We.emulateIdleDetectorState),
    settingName: 'emulation.idleDetection',
    settingType: t.Settings.SettingType.ENUM,
    defaultValue: 'none',
    options: [
      {
        value: 'none',
        title: ze(We.noIdleEmulation),
        text: ze(We.noIdleEmulation),
      },
      {
        value: '{"isUserActive":true,"isScreenUnlocked":true}',
        title: ze(We.userActiveScreenUnlocked),
        text: ze(We.userActiveScreenUnlocked),
      },
      {
        value: '{"isUserActive":true,"isScreenUnlocked":false}',
        title: ze(We.userActiveScreenLocked),
        text: ze(We.userActiveScreenLocked),
      },
      {
        value: '{"isUserActive":false,"isScreenUnlocked":true}',
        title: ze(We.userIdleScreenUnlocked),
        text: ze(We.userIdleScreenUnlocked),
      },
      {
        value: '{"isUserActive":false,"isScreenUnlocked":false}',
        title: ze(We.userIdleScreenLocked),
        text: ze(We.userIdleScreenLocked),
      },
    ],
  })
const Je = {
    accessibility: 'Accessibility',
    shoAccessibility: 'Show Accessibility',
  },
  Ye = i.i18n.registerUIStrings(
    'panels/accessibility/accessibility-meta.ts',
    Je
  ),
  Xe = i.i18n.getLazilyComputedLocalizedString.bind(void 0, Ye)
r.ViewManager.registerViewExtension({
  location: 'elements-sidebar',
  id: 'accessibility.view',
  title: Xe(Je.accessibility),
  commandPrompt: Xe(Je.shoAccessibility),
  order: 10,
  persistence: 'permanent',
  loadView: async () =>
    (
      await (async function () {
        return (
          je ||
            (je = await import('../../panels/accessibility/accessibility.js')),
          je
        )
      })()
    ).AccessibilitySidebarView.AccessibilitySidebarView.instance(),
})
const Qe = {
    developerResources: 'Developer Resources',
    showDeveloperResources: 'Show Developer Resources',
  },
  Ze = i.i18n.registerUIStrings(
    'panels/developer_resources/developer_resources-meta.ts',
    Qe
  ),
  $e = i.i18n.getLazilyComputedLocalizedString.bind(void 0, Ze)
let et
r.ViewManager.registerViewExtension({
  location: 'drawer-view',
  id: 'resource-loading-pane',
  title: $e(Qe.developerResources),
  commandPrompt: $e(Qe.showDeveloperResources),
  order: 100,
  persistence: 'closeable',
  experiment: e.Runtime.ExperimentName.DEVELOPER_RESOURCES_VIEW,
  loadView: async () =>
    (
      await (async function () {
        return (
          et ||
            (et = await import(
              '../../panels/developer_resources/developer_resources.js'
            )),
          et
        )
      })()
    ).DeveloperResourcesView.DeveloperResourcesView.instance(),
})
const tt = {
    rendering: 'Rendering',
    showRendering: 'Show Rendering',
    paint: 'paint',
    layout: 'layout',
    fps: 'fps',
    cssMediaType: 'CSS media type',
    cssMediaFeature: 'CSS media feature',
    visionDeficiency: 'vision deficiency',
    colorVisionDeficiency: 'color vision deficiency',
    reloadPage: 'Reload page',
    hardReloadPage: 'Hard reload page',
    forceAdBlocking: 'Force ad blocking on this site',
    blockAds: 'Block ads on this site',
    showAds: 'Show ads on this site, if allowed',
    autoOpenDevTools: 'Auto-open DevTools for popups',
    doNotAutoOpen: 'Do not auto-open DevTools for popups',
    disablePaused: 'Disable paused state overlay',
  },
  it = i.i18n.registerUIStrings(
    'entrypoints/inspector_main/inspector_main-meta.ts',
    tt
  ),
  ot = i.i18n.getLazilyComputedLocalizedString.bind(void 0, it)
let nt
async function at() {
  return nt || (nt = await import('../inspector_main/inspector_main.js')), nt
}
r.ViewManager.registerViewExtension({
  location: 'drawer-view',
  id: 'rendering',
  title: ot(tt.rendering),
  commandPrompt: ot(tt.showRendering),
  persistence: 'closeable',
  order: 50,
  loadView: async () =>
    (await at()).RenderingOptions.RenderingOptionsView.instance(),
  tags: [
    ot(tt.paint),
    ot(tt.layout),
    ot(tt.fps),
    ot(tt.cssMediaType),
    ot(tt.cssMediaFeature),
    ot(tt.visionDeficiency),
    ot(tt.colorVisionDeficiency),
  ],
}),
  r.ActionRegistration.registerActionExtension({
    category: r.ActionRegistration.ActionCategory.NAVIGATION,
    actionId: 'inspector_main.reload',
    loadActionDelegate: async () =>
      (await at()).InspectorMain.ReloadActionDelegate.instance(),
    iconClass: 'largeicon-refresh',
    title: ot(tt.reloadPage),
    bindings: [
      { platform: 'windows,linux', shortcut: 'Ctrl+R' },
      { platform: 'windows,linux', shortcut: 'F5' },
      { platform: 'mac', shortcut: 'Meta+R' },
    ],
  }),
  r.ActionRegistration.registerActionExtension({
    category: r.ActionRegistration.ActionCategory.NAVIGATION,
    actionId: 'inspector_main.hard-reload',
    loadActionDelegate: async () =>
      (await at()).InspectorMain.ReloadActionDelegate.instance(),
    title: ot(tt.hardReloadPage),
    bindings: [
      { platform: 'windows,linux', shortcut: 'Shift+Ctrl+R' },
      { platform: 'windows,linux', shortcut: 'Shift+F5' },
      { platform: 'windows,linux', shortcut: 'Ctrl+F5' },
      { platform: 'windows,linux', shortcut: 'Ctrl+Shift+F5' },
      { platform: 'mac', shortcut: 'Shift+Meta+R' },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.NETWORK,
    title: ot(tt.forceAdBlocking),
    settingName: 'network.adBlockingEnabled',
    settingType: t.Settings.SettingType.BOOLEAN,
    storageType: t.Settings.SettingStorageType.Session,
    defaultValue: !1,
    options: [
      { value: !0, title: ot(tt.blockAds) },
      { value: !1, title: ot(tt.showAds) },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.GLOBAL,
    storageType: t.Settings.SettingStorageType.Synced,
    title: ot(tt.autoOpenDevTools),
    settingName: 'autoAttachToCreatedPages',
    settingType: t.Settings.SettingType.BOOLEAN,
    order: 2,
    defaultValue: !1,
    options: [
      { value: !0, title: ot(tt.autoOpenDevTools) },
      { value: !1, title: ot(tt.doNotAutoOpen) },
    ],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.APPEARANCE,
    storageType: t.Settings.SettingStorageType.Synced,
    title: ot(tt.disablePaused),
    settingName: 'disablePausedStateOverlay',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !1,
  }),
  r.Toolbar.registerToolbarItem({
    loadItem: async () => (await at()).InspectorMain.NodeIndicator.instance(),
    order: 2,
    location: r.Toolbar.ToolbarItemLocation.MAIN_TOOLBAR_LEFT,
    showLabel: void 0,
    condition: void 0,
    separator: void 0,
    actionId: void 0,
  })
const st = {
    application: 'Application',
    showApplication: 'Show Application',
    pwa: 'pwa',
    clearSiteData: 'Clear site data',
    clearSiteDataIncludingThirdparty:
      'Clear site data (including third-party cookies)',
    startRecordingEvents: 'Start recording events',
    stopRecordingEvents: 'Stop recording events',
  },
  rt = i.i18n.registerUIStrings('panels/application/application-meta.ts', st),
  lt = i.i18n.getLazilyComputedLocalizedString.bind(void 0, rt)
let ct
async function gt() {
  return (
    ct || (ct = await import('../../panels/application/application.js')), ct
  )
}
r.ViewManager.registerViewExtension({
  location: 'panel',
  id: 'resources',
  title: lt(st.application),
  commandPrompt: lt(st.showApplication),
  order: 70,
  loadView: async () => (await gt()).ResourcesPanel.ResourcesPanel.instance(),
  tags: [lt(st.pwa)],
}),
  r.ActionRegistration.registerActionExtension({
    category: r.ActionRegistration.ActionCategory.RESOURCES,
    actionId: 'resources.clear',
    title: lt(st.clearSiteData),
    loadActionDelegate: async () =>
      (await gt()).StorageView.ActionDelegate.instance(),
  }),
  r.ActionRegistration.registerActionExtension({
    category: r.ActionRegistration.ActionCategory.RESOURCES,
    actionId: 'resources.clear-incl-third-party-cookies',
    title: lt(st.clearSiteDataIncludingThirdparty),
    loadActionDelegate: async () =>
      (await gt()).StorageView.ActionDelegate.instance(),
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'background-service.toggle-recording',
    iconClass: 'largeicon-start-recording',
    toggleable: !0,
    toggledIconClass: 'largeicon-stop-recording',
    toggleWithRedColor: !0,
    contextTypes: () =>
      void 0 === ct
        ? []
        : ((e) => [e.BackgroundServiceView.BackgroundServiceView])(ct),
    loadActionDelegate: async () =>
      (await gt()).BackgroundServiceView.ActionDelegate.instance(),
    category: r.ActionRegistration.ActionCategory.BACKGROUND_SERVICES,
    options: [
      { value: !0, title: lt(st.startRecordingEvents) },
      { value: !1, title: lt(st.stopRecordingEvents) },
    ],
    bindings: [
      { platform: 'windows,linux', shortcut: 'Ctrl+E' },
      { platform: 'mac', shortcut: 'Meta+E' },
    ],
  }),
  t.Revealer.registerRevealer({
    contextTypes: () => [o.Resource.Resource],
    destination: t.Revealer.RevealerDestination.APPLICATION_PANEL,
    loadRevealer: async () =>
      (await gt()).ResourcesPanel.ResourceRevealer.instance(),
  }),
  t.Revealer.registerRevealer({
    contextTypes: () => [o.Cookie.CookieReference],
    destination: t.Revealer.RevealerDestination.APPLICATION_PANEL,
    loadRevealer: async () =>
      (await gt()).ResourcesPanel.CookieReferenceRevealer.instance(),
  }),
  t.Revealer.registerRevealer({
    contextTypes: () => [o.ResourceTreeModel.ResourceTreeFrame],
    destination: t.Revealer.RevealerDestination.APPLICATION_PANEL,
    loadRevealer: async () =>
      (await gt()).ResourcesPanel.FrameDetailsRevealer.instance(),
  })
const dt = {
    issues: 'Issues',
    showIssues: 'Show Issues',
    cspViolations: 'CSP Violations',
    showCspViolations: 'Show CSP Violations',
  },
  ut = i.i18n.registerUIStrings('panels/issues/issues-meta.ts', dt),
  pt = i.i18n.getLazilyComputedLocalizedString.bind(void 0, ut)
let St
async function mt() {
  return St || (St = await import('../../panels/issues/issues.js')), St
}
r.ViewManager.registerViewExtension({
  location: 'drawer-view',
  id: 'issues-pane',
  title: pt(dt.issues),
  commandPrompt: pt(dt.showIssues),
  order: 100,
  persistence: 'closeable',
  loadView: async () => (await mt()).IssuesPane.IssuesPane.instance(),
}),
  r.ViewManager.registerViewExtension({
    location: 'drawer-view',
    id: 'csp-violations-pane',
    title: pt(dt.cspViolations),
    commandPrompt: pt(dt.showCspViolations),
    order: 100,
    persistence: 'closeable',
    loadView: async () =>
      (await mt()).CSPViolationsView.CSPViolationsView.instance(),
    experiment: e.Runtime.ExperimentName.CSP_VIOLATIONS_VIEW,
  }),
  t.Revealer.registerRevealer({
    contextTypes: () => [g.Issue.Issue],
    destination: t.Revealer.RevealerDestination.ISSUES_VIEW,
    loadRevealer: async () =>
      (await mt()).IssueRevealer.IssueRevealer.instance(),
  })
const yt = {
    whatsNew: "What's New",
    showWhatsNew: "Show What's New",
    releaseNotes: 'Release notes',
    reportADevtoolsIssue: 'Report a DevTools issue',
    reportTranslationIssue: 'Report a translation issue',
    bug: 'bug',
    showWhatsNewAfterEachUpdate: "Show What's New after each update",
    doNotShowWhatsNewAfterEachUpdate:
      "Do not show What's New after each update",
  },
  wt = i.i18n.registerUIStrings('panels/help/help-meta.ts', yt),
  ht = i.i18n.getLazilyComputedLocalizedString.bind(void 0, wt)
let At
async function Et() {
  return At || (At = await import('../../panels/help/help.js')), At
}
r.ViewManager.registerViewExtension({
  location: 'drawer-view',
  id: 'release-note',
  title: ht(yt.whatsNew),
  commandPrompt: ht(yt.showWhatsNew),
  persistence: 'closeable',
  order: 1,
  loadView: async () => (await Et()).ReleaseNoteView.ReleaseNoteView.instance(),
}),
  r.ActionRegistration.registerActionExtension({
    category: r.ActionRegistration.ActionCategory.HELP,
    actionId: 'help.release-notes',
    title: ht(yt.releaseNotes),
    loadActionDelegate: async () =>
      (await Et()).Help.ReleaseNotesActionDelegate.instance(),
  }),
  r.ActionRegistration.registerActionExtension({
    category: r.ActionRegistration.ActionCategory.HELP,
    actionId: 'help.report-issue',
    title: ht(yt.reportADevtoolsIssue),
    loadActionDelegate: async () =>
      (await Et()).Help.ReportIssueActionDelegate.instance(),
    tags: [ht(yt.bug)],
  }),
  r.ActionRegistration.registerActionExtension({
    category: r.ActionRegistration.ActionCategory.HELP,
    actionId: 'help.report-translation-issue',
    title: ht(yt.reportTranslationIssue),
    loadActionDelegate: async () =>
      (await Et()).Help.ReportTranslationIssueActionDelegate.instance(),
    tags: [ht(yt.bug)],
  }),
  t.Settings.registerSettingExtension({
    category: t.Settings.SettingCategory.APPEARANCE,
    storageType: t.Settings.SettingStorageType.Synced,
    title: ht(yt.showWhatsNewAfterEachUpdate),
    settingName: 'help.show-release-note',
    settingType: t.Settings.SettingType.BOOLEAN,
    defaultValue: !0,
    options: [
      { value: !0, title: ht(yt.showWhatsNewAfterEachUpdate) },
      { value: !1, title: ht(yt.doNotShowWhatsNewAfterEachUpdate) },
    ],
  }),
  r.ContextMenu.registerItem({
    location: r.ContextMenu.ItemLocation.MAIN_MENU_HELP_DEFAULT,
    actionId: 'help.release-notes',
    order: 10,
  }),
  r.ContextMenu.registerItem({
    location: r.ContextMenu.ItemLocation.MAIN_MENU_HELP_DEFAULT,
    actionId: 'help.report-issue',
    order: 11,
  }),
  r.ContextMenu.registerItem({
    location: r.ContextMenu.ItemLocation.MAIN_MENU_HELP_DEFAULT,
    actionId: 'help.report-translation-issue',
    order: 12,
  }),
  t.Runnable.registerLateInitializationRunnable({
    id: 'whats-new',
    loadRunnable: async () =>
      (await Et()).Help.HelpLateInitialization.instance(),
  })
const vt = {
    throttling: 'Throttling',
    showThrottling: 'Show Throttling',
    goOffline: 'Go offline',
    device: 'device',
    throttlingTag: 'throttling',
    enableSlowGThrottling: 'Enable slow `3G` throttling',
    enableFastGThrottling: 'Enable fast `3G` throttling',
    goOnline: 'Go online',
  },
  Tt = i.i18n.registerUIStrings(
    'panels/mobile_throttling/mobile_throttling-meta.ts',
    vt
  ),
  Ct = i.i18n.getLazilyComputedLocalizedString.bind(void 0, Tt)
let bt
async function Rt() {
  return (
    bt ||
      (bt = await import(
        '../../panels/mobile_throttling/mobile_throttling.js'
      )),
    bt
  )
}
r.ViewManager.registerViewExtension({
  location: 'settings-view',
  id: 'throttling-conditions',
  title: Ct(vt.throttling),
  commandPrompt: Ct(vt.showThrottling),
  order: 35,
  loadView: async () =>
    (await Rt()).ThrottlingSettingsTab.ThrottlingSettingsTab.instance(),
  settings: ['customNetworkConditions'],
}),
  r.ActionRegistration.registerActionExtension({
    actionId: 'network-conditions.network-offline',
    category: r.ActionRegistration.ActionCategory.NETWORK,
    title: Ct(vt.goOffline),
    loadActionDelegate: async () =>
      (await Rt()).ThrottlingManager.ActionDelegate.instance(),
    tags: [Ct(vt.device), Ct(vt.throttlingTag)],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'network-conditions.network-low-end-mobile',
    category: r.ActionRegistration.ActionCategory.NETWORK,
    title: Ct(vt.enableSlowGThrottling),
    loadActionDelegate: async () =>
      (await Rt()).ThrottlingManager.ActionDelegate.instance(),
    tags: [Ct(vt.device), Ct(vt.throttlingTag)],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'network-conditions.network-mid-tier-mobile',
    category: r.ActionRegistration.ActionCategory.NETWORK,
    title: Ct(vt.enableFastGThrottling),
    loadActionDelegate: async () =>
      (await Rt()).ThrottlingManager.ActionDelegate.instance(),
    tags: [Ct(vt.device), Ct(vt.throttlingTag)],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'network-conditions.network-online',
    category: r.ActionRegistration.ActionCategory.NETWORK,
    title: Ct(vt.goOnline),
    loadActionDelegate: async () =>
      (await Rt()).ThrottlingManager.ActionDelegate.instance(),
    tags: [Ct(vt.device), Ct(vt.throttlingTag)],
  }),
  t.Settings.registerSettingExtension({
    storageType: t.Settings.SettingStorageType.Synced,
    settingName: 'customNetworkConditions',
    settingType: t.Settings.SettingType.ARRAY,
    defaultValue: [],
  })
const Nt = {
    resetView: 'Reset view',
    switchToPanMode: 'Switch to pan mode',
    switchToRotateMode: 'Switch to rotate mode',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    panOrRotateUp: 'Pan or rotate up',
    panOrRotateDown: 'Pan or rotate down',
    panOrRotateLeft: 'Pan or rotate left',
    panOrRotateRight: 'Pan or rotate right',
  },
  xt = i.i18n.registerUIStrings('panels/layer_viewer/layer_viewer-meta.ts', Nt),
  ft = i.i18n.getLazilyComputedLocalizedString.bind(void 0, xt)
r.ActionRegistration.registerActionExtension({
  actionId: 'layers.reset-view',
  category: r.ActionRegistration.ActionCategory.LAYERS,
  title: ft(Nt.resetView),
  bindings: [{ shortcut: '0' }],
}),
  r.ActionRegistration.registerActionExtension({
    actionId: 'layers.pan-mode',
    category: r.ActionRegistration.ActionCategory.LAYERS,
    title: ft(Nt.switchToPanMode),
    bindings: [{ shortcut: 'x' }],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'layers.rotate-mode',
    category: r.ActionRegistration.ActionCategory.LAYERS,
    title: ft(Nt.switchToRotateMode),
    bindings: [{ shortcut: 'v' }],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'layers.zoom-in',
    category: r.ActionRegistration.ActionCategory.LAYERS,
    title: ft(Nt.zoomIn),
    bindings: [{ shortcut: 'Shift+Plus' }, { shortcut: 'NumpadPlus' }],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'layers.zoom-out',
    category: r.ActionRegistration.ActionCategory.LAYERS,
    title: ft(Nt.zoomOut),
    bindings: [{ shortcut: 'Shift+Minus' }, { shortcut: 'NumpadMinus' }],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'layers.up',
    category: r.ActionRegistration.ActionCategory.LAYERS,
    title: ft(Nt.panOrRotateUp),
    bindings: [{ shortcut: 'Up' }, { shortcut: 'w' }],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'layers.down',
    category: r.ActionRegistration.ActionCategory.LAYERS,
    title: ft(Nt.panOrRotateDown),
    bindings: [{ shortcut: 'Down' }, { shortcut: 's' }],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'layers.left',
    category: r.ActionRegistration.ActionCategory.LAYERS,
    title: ft(Nt.panOrRotateLeft),
    bindings: [{ shortcut: 'Left' }, { shortcut: 'a' }],
  }),
  r.ActionRegistration.registerActionExtension({
    actionId: 'layers.right',
    category: r.ActionRegistration.ActionCategory.LAYERS,
    title: ft(Nt.panOrRotateRight),
    bindings: [{ shortcut: 'Right' }, { shortcut: 'd' }],
  })
