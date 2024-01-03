import * as e from "../../third_party/i18n/i18n.js";
import * as t from "../platform/platform.js";
import * as o from "../root/root.js";
let n = null;
class r {
    locale;
    lookupClosestDevToolsLocale;
    constructor(e) {
        this.lookupClosestDevToolsLocale = e.lookupClosestDevToolsLocale, "browserLanguage" === e.settingLanguage ? this.locale = e.navigatorLanguage || "en-US" : this.locale = e.settingLanguage, this.locale = this.lookupClosestDevToolsLocale(this.locale)
    }
    static instance(e = {
        create: !1
    }) {
        if (!n && !e.create) throw new Error("No LanguageSelector instance exists yet.");
        return e.create && (n = new r(e.data)), n
    }
    forceFallbackLocale() {
        this.locale = "en-US"
    }
    languageIsSupportedByDevTools(e) {
        return i(e, this.lookupClosestDevToolsLocale(e))
    }
}

function i(e, t) {
    const o = new Intl.Locale(e),
        n = new Intl.Locale(t);
    return o.language === n.language
}
var s = Object.freeze({
    __proto__: null,
    DevToolsLocale: r,
    localeLanguagesMatch: i
});
const a = new e.I18n.I18n,
    l = new Set(["en-US", "en-XL", "zh"]);

function c(e, t, o = {}) {
    return e.getLocalizedStringSetFor(r.instance().locale).getLocalizedString(t, o)
}

function u(e, t) {
    return a.registerFileStrings(e, t)
}

function g(e, o) {
    const n = {
        s: e => e
    };
    return t.StringUtilities.format(e, o, n, document.createElement("span"), (function (e, t) {
        return t && e.appendChild("string" == typeof t ? document.createTextNode(t) : t), e
    })).formattedResult
}
var f = Object.freeze({
    __proto__: null,
    lookupClosestSupportedDevToolsLocale: function (e) {
        return a.lookupClosestSupportedLocale(e)
    },
    getAllSupportedDevToolsLocales: function () {
        return [...a.supportedLocales]
    },
    fetchAndRegisterLocaleData: async function (e) {
        const tx = o.Runtime.getRemoteBase();
        const t = tx && tx.base && !l.has(e) ? o.Runtime.loadResourcePromise(`${t.base}core/i18n/locales/${e}.json`) : (
            import(`../../core/i18n/locales/${e}.json?raw`).then(m=>m.default)
        )
        const n = new Promise(((e, t) => setTimeout((() => t(new Error("timed out fetching locale"))), 5e3))),
            r = await Promise.race([n, t]),
            i = JSON.parse(r);
        a.registerLocaleData(e, i)
    },
    getLazilyComputedLocalizedString: function (e, t, o = {}) {
        return () => c(e, t, o)
    },
    getLocalizedString: c,
    registerUIStrings: u,
    getFormatLocalizedString: function (e, t, o) {
        const n = e.getLocalizedStringSetFor(r.instance().locale).getMessageFormatterFor(t).getAst(),
            i = [];
        let s = "";
        for (const e of n) {
            if (1 === e.type) {
                const t = o[e.value];
                t && (i.push(t), e.value = "%s")
            }
            "value" in e && (s += e.value)
        }
        return g(s, i)
    },
    formatLocalized: g,
    serializeUIString: function (e, t = {}) {
        const o = {
            string: e,
            values: t
        };
        return JSON.stringify(o)
    },
    deserializeUIString: function (e) {
        return e ? JSON.parse(e) : {
            string: "",
            values: {}
        }
    },
    lockedString: function (e) {
        return e
    },
    lockedLazyString: function (e) {
        return () => e
    },
    getLocalizedLanguageRegion: function (e, t) {
        const o = new Intl.Locale(e),
            n = o.language || "en",
            r = o.baseName || "en-US",
            i = n === new Intl.Locale(t.locale).language ? "en" : r,
            s = new Intl.DisplayNames([t.locale], {
                type: "language"
            }).of(n),
            a = new Intl.DisplayNames([i], {
                type: "language"
            }).of(n);
        let l = "",
            c = "";
        if (o.region) {
            l = ` (${new Intl.DisplayNames([t.locale],{type:"region",style:"short"}).of(o.region)})`, c = ` (${new Intl.DisplayNames([i],{type:"region",style:"short"}).of(o.region)})`
        }
        return `${s}${l} - ${a}${c}`
    }
});
const m = {
        fmms: "{PH1} μs",
        fms: "{PH1} ms",
        fs: "{PH1} s",
        fmin: "{PH1} min",
        fhrs: "{PH1} hrs",
        fdays: "{PH1} days"
    },
    p = u("core/i18n/time-utilities.ts", m),
    d = c.bind(void 0, p),
    L = function (e, t) {
        if (!isFinite(e)) return "-";
        if (0 === e) return "0";
        if (t && e < .1) return d(m.fmms, {
            PH1: (1e3 * e).toFixed(0)
        });
        if (t && e < 1e3) return d(m.fms, {
            PH1: e.toFixed(2)
        });
        if (e < 1e3) return d(m.fms, {
            PH1: e.toFixed(0)
        });
        const o = e / 1e3;
        if (o < 60) return d(m.fs, {
            PH1: o.toFixed(2)
        });
        const n = o / 60;
        if (n < 60) return d(m.fmin, {
            PH1: n.toFixed(1)
        });
        const r = n / 60;
        if (r < 24) return d(m.fhrs, {
            PH1: r.toFixed(1)
        });
        return d(m.fdays, {
            PH1: (r / 24).toFixed(1)
        })
    };
var S = Object.freeze({
    __proto__: null,
    preciseMillisToString: function (e, t) {
        return t = t || 0, d(m.fms, {
            PH1: e.toFixed(t)
        })
    },
    millisToString: L,
    secondsToString: function (e, t) {
        return isFinite(e) ? L(1e3 * e, t) : "-"
    }
});
export {
    s as DevToolsLocale, S as TimeUtilities, f as i18n
};