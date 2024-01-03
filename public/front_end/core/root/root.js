const e = console,
  t = console.assert,
  s = new URLSearchParams(location.search || location.hash.replace(/^#/, ''))
let n,
  r,
  i = ''
const o = new Map([
  ['panels/animation', 'animation'],
  ['panels/browser_debugger', 'browser_debugger'],
  ['panels/changes', 'changes'],
  ['panels/console', 'console'],
  ['panels/elements', 'elements'],
  ['panels/emulation', 'emulation'],
  ['panels/mobile_throttling', 'mobile_throttling'],
  ['panels/network', 'network'],
  ['panels/profiler', 'profiler'],
  ['panels/application', 'resources'],
  ['panels/search', 'search'],
  ['panels/sources', 'sources'],
  ['panels/snippets', 'snippets'],
  ['panels/settings', 'settings'],
  ['panels/timeline', 'timeline'],
  ['panels/web_audio', 'web_audio'],
  ['models/persistence', 'persistence'],
  ['models/workspace_diff', 'workspace_diff'],
  ['entrypoints/main', 'main'],
  ['third_party/diff', 'diff'],
  ['ui/legacy/components/inline_editor', 'inline_editor'],
  ['ui/legacy/components/data_grid', 'data_grid'],
  ['ui/legacy/components/perf_ui', 'perf_ui'],
  ['ui/legacy/components/source_frame', 'source_frame'],
  ['ui/legacy/components/color_picker', 'color_picker'],
  ['ui/legacy/components/cookie_table', 'cookie_table'],
  ['ui/legacy/components/quick_open', 'quick_open'],
  ['ui/legacy/components/utils', 'components'],
])
class a {
  #e
  modulesMap
  #t
  constructor(e) {
    ;(this.#e = []), (this.modulesMap = {}), (this.#t = {})
    for (const t of e) this.registerModule(t)
  }
  static instance(e = { forceNew: null, moduleDescriptors: null }) {
    const { forceNew: t, moduleDescriptors: s } = e
    if (!r || t) {
      if (!s)
        throw new Error(
          `Unable to create runtime: moduleDescriptors must be provided: ${
            new Error().stack
          }`
        )
      r = new a(s)
    }
    return r
  }
  static removeInstance() {
    r = void 0
  }
  static normalizePath(e) {
    if (-1 === e.indexOf('..') && -1 === e.indexOf('.')) return e
    const t = [],
      s = e.split('/')
    for (const e of s) '.' !== e && ('..' === e ? t.pop() : e && t.push(e))
    let n = t.join('/')
    return (
      '/' === n[n.length - 1] ||
        ('/' === e[0] && n && (n = '/' + n),
        ('/' !== e[e.length - 1] &&
          '.' !== s[s.length - 1] &&
          '..' !== s[s.length - 1]) ||
          (n += '/')),
      n
    )
  }
  static queryParam(e) {
    return s.get(e)
  }
  static experimentsSetting() {
    try {
      return JSON.parse(
        self.localStorage && self.localStorage.experiments
          ? self.localStorage.experiments
          : '{}'
      )
    } catch (e) {
      return console.error("Failed to parse localStorage['experiments']"), {}
    }
  }
  static assert(s, n) {
    s || t.call(e, s, n + ' ' + new Error().stack)
  }
  static setPlatform(e) {
    i = e
  }
  static platform() {
    return i
  }
  static isDescriptorEnabled(e) {
    const t = e.experiment
    if ('*' === t) return !0
    if (t && t.startsWith('!') && m.isEnabled(t.substring(1))) return !1
    if (t && !t.startsWith('!') && !m.isEnabled(t)) return !1
    const s = e.condition
    return (
      !(s && !s.startsWith('!') && !a.queryParam(s)) &&
      !(s && s.startsWith('!') && a.queryParam(s.substring(1)))
    )
  }
  static resolveSourceURL(e) {
    let t = self.location.href
    return (
      self.location.search && (t = t.replace(self.location.search, '')),
      (t = t.substring(0, t.lastIndexOf('/') + 1) + e),
      '\n/*# sourceURL=' + t + ' */'
    )
  }
  module(e) {
    return this.modulesMap[e]
  }
  registerModule(e) {
    const t = new l(this, e)
    this.#e.push(t), (this.modulesMap[e.name] = t)
    const s = o.get(e.name)
    void 0 !== s && (this.modulesMap[s] = t)
  }
  loadModulePromise(e) {
    return this.modulesMap[e].loadPromise()
  }
  loadAutoStartModules(e) {
    const t = []
    for (const s of e) t.push(this.loadModulePromise(s))
    return Promise.all(t)
  }
  getModulesMap() {
    return this.modulesMap
  }
  loadLegacyModule(e) {
    return import(`../../${e}`)
  }
}
class l {
  #s
  descriptor
  #n
  #r
  #i
  constructor(e, t) {
    ;(this.#s = e), (this.descriptor = t), (this.#n = t.name), (this.#r = !1)
  }
  name() {
    return this.#n
  }
  enabled() {
    return a.isDescriptorEnabled(this.descriptor)
  }
  resource(e) {
    const t = this.#n + '/' + e,
      s = u.get(t)
    if (!s) throw new Error(t + ' not preloaded. Check module.json')
    return s
  }
  loadPromise() {
    if (!this.enabled())
      return Promise.reject(new Error('Module ' + this.#n + ' is not enabled'))
    if (this.#i) return this.#i
    const e = this.descriptor.dependencies,
      t = []
    for (let s = 0; e && s < e.length; ++s)
      t.push(this.#s.getModulesMap()[e[s]].loadPromise())
    return (
      (this.#i = Promise.all(t)
        .then(this.loadModules.bind(this))
        .then(() => ((this.#r = !0), this.#r))),
      this.#i
    )
  }
  async loadModules() {
    const e = (t = this.#n).includes('/')
      ? t.substring(t.lastIndexOf('/') + 1, t.length)
      : t
    var t
    const s = `${e}_module.js`,
      n = `${e}.js`
    this.descriptor.modules &&
      this.descriptor.modules.includes(s) &&
      (await import(`../../${this.#n}/${s}`)),
      await import(`../../${this.#n}/${n}`)
  }
  modularizeURL(e) {
    return a.normalizePath(this.#n + '/' + e)
  }
  fetchResource(e) {
    return p(
      (function (e, t) {
        const s = (t || n) + e,
          r = s.indexOf('://') + 3
        let i = s.indexOf('/', r)
        ;-1 === i && (i = s.length)
        return s.substring(0, i) + a.normalizePath(s.substring(i))
      })(this.modularizeURL(e))
    )
  }
}
class c {
  #o
  #a
  #l
  #c
  #d
  constructor() {
    ;(this.#o = []),
      (this.#a = new Set()),
      (this.#l = new Set()),
      (this.#c = new Set()),
      (this.#d = new Set())
  }
  allConfigurableExperiments() {
    const e = []
    for (const t of this.#o) this.#l.has(t.name) || e.push(t)
    return e
  }
  enabledExperiments() {
    return this.#o.filter((e) => e.isEnabled())
  }
  setExperimentsSetting(e) {
    self.localStorage && (self.localStorage.experiments = JSON.stringify(e))
  }
  register(e, t, s, n) {
    a.assert(!this.#a.has(e), 'Duplicate registration of experiment ' + e),
      this.#a.add(e),
      this.#o.push(new d(this, e, t, Boolean(s), n ?? ''))
  }
  isEnabled(e) {
    return (
      this.checkExperiment(e),
      !1 !== a.experimentsSetting()[e] &&
        (!(!this.#l.has(e) && !this.#c.has(e)) ||
          !!this.#d.has(e) ||
          Boolean(a.experimentsSetting()[e]))
    )
  }
  setEnabled(e, t) {
    this.checkExperiment(e)
    const s = a.experimentsSetting()
    ;(s[e] = t), this.setExperimentsSetting(s)
  }
  enableExperimentsTransiently(e) {
    for (const t of e) this.checkExperiment(t), this.#l.add(t)
  }
  enableExperimentsByDefault(e) {
    for (const t of e) this.checkExperiment(t), this.#c.add(t)
  }
  setServerEnabledExperiments(e) {
    for (const t of e) this.checkExperiment(t), this.#d.add(t)
  }
  enableForTest(e) {
    this.checkExperiment(e), this.#l.add(e)
  }
  clearForTest() {
    ;(this.#o = []),
      this.#a.clear(),
      this.#l.clear(),
      this.#c.clear(),
      this.#d.clear()
  }
  cleanUpStaleExperiments() {
    const e = a.experimentsSetting(),
      t = {}
    for (const { name: s } of this.#o)
      if (e.hasOwnProperty(s)) {
        const n = e[s]
        ;(n || this.#c.has(s)) && (t[s] = n)
      }
    this.setExperimentsSetting(t)
  }
  checkExperiment(e) {
    a.assert(this.#a.has(e), 'Unknown experiment ' + e)
  }
}
class d {
  name
  title
  unstable
  docLink
  #o
  constructor(e, t, s, n, r) {
    ;(this.name = t),
      (this.title = s),
      (this.unstable = n),
      (this.docLink = r),
      (this.#o = e)
  }
  isEnabled() {
    return this.#o.isEnabled(this.name)
  }
  setEnabled(e) {
    this.#o.setEnabled(this.name, e)
  }
}
function p(e) {
  return new Promise(function (t, s) {
    const n = new XMLHttpRequest()
    n.open('GET', e, !0),
      (n.onreadystatechange = function (r) {
        if (n.readyState !== XMLHttpRequest.DONE) return
        const i = this.response,
          o = /^HTTP\/1.1 404/.test(i) ? 404 : n.status
        ;-1 === [0, 200, 304].indexOf(o)
          ? s(
              new Error(
                'While loading from url ' +
                  e +
                  ' server responded with a status of ' +
                  o
              )
            )
          : t(i)
      }),
      n.send(null)
  })
}
!(function () {
  const e = self.location ? self.location.origin + self.location.pathname : ''
  n = e.substring(0, e.lastIndexOf('/') + 1)
})()
const m = new c(),
  u = new Map()
let h
globalThis.EXPORTED_CACHED_RESOURCES_ONLY_FOR_LIGHTHOUSE = u
const f = new Promise((e) => {
  h = e
})
var g, E
!(function (e) {
  ;(e.CAPTURE_NODE_CREATION_STACKS = 'captureNodeCreationStacks'),
    (e.CSS_OVERVIEW = 'cssOverview'),
    (e.LIVE_HEAP_PROFILE = 'liveHeapProfile'),
    (e.DEVELOPER_RESOURCES_VIEW = 'developerResourcesView'),
    (e.TIMELINE_REPLAY_EVENT = 'timelineReplayEvent'),
    (e.CSP_VIOLATIONS_VIEW = 'cspViolationsView'),
    (e.WASM_DWARF_DEBUGGING = 'wasmDWARFDebugging'),
    (e.ALL = '*'),
    (e.PROTOCOL_MONITOR = 'protocolMonitor'),
    (e.WEBAUTHN_PANE = 'webauthnPane'),
    (e.SYNC_SETTINGS = 'syncSettings')
})(g || (g = {})),
  (function (e) {
    ;(e.CAN_DOCK = 'can_dock'),
      (e.NOT_SOURCES_HIDE_ADD_FOLDER = '!sources.hide_add_folder')
  })(E || (E = {}))
var b = Object.freeze({
  __proto__: null,
  getRemoteBase: function (e = self.location.toString()) {
    const t = new URL(e),
      s = t.searchParams.get('remoteBase')
    if (!s) return null
    const n = /\/serve_file\/(@[0-9a-zA-Z]+)\/?$/.exec(s)
    return n
      ? { base: `${t.origin}/remote/serve_file/${n[1]}/`, version: n[1] }
      : null
  },
  mappingForLayoutTests: o,
  Runtime: a,
  ModuleDescriptor: class {
    name
    dependencies
    modules
    resources
    condition
    experiment
    constructor() {}
  },
  Module: l,
  ExperimentsSupport: c,
  Experiment: d,
  loadResourcePromise: p,
  experiments: m,
  cachedResources: u,
  get appStartedPromiseCallback() {
    return h
  },
  appStarted: f,
  get ExperimentName() {
    return g
  },
  get ConditionName() {
    return E
  },
})
export { b as Runtime }
