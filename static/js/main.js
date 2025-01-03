/*!
 * Bowser - a browser detector
 * https://github.com/ded/bowser
 * MIT License | (c) Dustin Diaz 2014
 */
;
function prettyDate(e) {
    var t = new Date((e || "").replace(/-/g, "/").replace(/[TZ]/g, " ")),
    n = new Date,
    r = (n.getTime() + n.getTimezoneOffset() * 6e4 - t.getTime()) / 1e3,
    i = Math.floor(r / 86400);
    if (isNaN(i) || i < 0 || i >= 31)
        return;
    return i == 0 && (r < 60 && "just now" || r < 120 && "1 minute ago" || r < 3600 && Math.floor(r / 60) + " minutes ago" || r < 7200 && "1 hour ago" || r < 86400 && Math.floor(r / 3600) + " hours ago") || i == 1 && "Yesterday" || i < 7 && i + " days ago" || 0
}
function getTimeUnitAndDuration(e) {
    var t = e - Date.now(),
    n = 36e5,
    r = 6e4,
    i = "minute",
    s = t / r;
    return t >= 2 * n && (i = "hour", s = t / n),
    s = Math.max(1, Math.round(s)), {
        unit: i,
        duration: s
    }
}
function formatRelativeTime(e, t) {
    var n = window.navigator.languages;
    t && (n = [t].concat(n));
    if (typeof Intl.RelativeTimeFormat != "undefined") {
        var r = new Intl.RelativeTimeFormat(n, {
            localeMatcher: "best fit",
            numeric: "always",
            style: "long"
        }),
        i = getTimeUnitAndDuration(e);
        return r.format(i.duration, i.unit)
    }
    return typeof jQuery != "undefined" && typeof jQuery.timeago != "undefined" ? (jQuery.timeago.settings.allowFuture = !0, jQuery.timeago(e)) : ""
}
jQuery.migrateMute === void 0 && (jQuery.migrateMute = !0), function (e, t, n) {
    function r(n) {
        var r = t.console;
        s[n] || (s[n] = !0, e.migrateWarnings.push(n), r && r.warn && !e.migrateMute && (r.warn("JQMIGRATE: " + n), e.migrateTrace && r.trace && r.trace()))
    }
    function i(t, i, s, o) {
        if (Object.defineProperty)
            try {
                return Object.defineProperty(t, i, {
                    configurable: !0,
                    enumerable: !0,
                    get: function () {
                        return r(o),
                        s
                    },
                    set: function (e) {
                        r(o),
                        s = e
                    }
                }),
                n
            } catch (u) {}
        e._definePropertyBroken = !0,
        t[i] = s
    }
    var s = {};
    e.migrateWarnings = [],
    !e.migrateMute && t.console && t.console.log && t.console.log("JQMIGRATE: Logging is active"),
    e.migrateTrace === n && (e.migrateTrace = !0),
    e.migrateReset = function () {
        s = {},
        e.migrateWarnings.length = 0
    },
    "BackCompat" === document.compatMode && r("jQuery is not compatible with Quirks Mode");
    var o = e("<input/>", {
        size: 1
    }).attr("size") && e.attrFn,
    u = e.attr,
    a = e.attrHooks.value && e.attrHooks.value.get || function () {
        return null
    },
    f = e.attrHooks.value && e.attrHooks.value.set || function () {
        return n
    },
    l = /^(?:input|button)$/i,
    c = /^[238]$/,
    h = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
    p = /^(?:checked|selected)$/i;
    i(e, "attrFn", o || {}, "jQuery.attrFn is deprecated"),
    e.attr = function (t, i, s, a) {
        var f = i.toLowerCase(),
        d = t && t.nodeType;
        return a && (4 > u.length && r("jQuery.fn.attr( props, pass ) is deprecated"), t && !c.test(d) && (o ? i in o : e.isFunction(e.fn[i]))) ? e(t)[i](s) : ("type" === i && s !== n && l.test(t.nodeName) && t.parentNode && r("Can't change the 'type' of an input or button in IE 6/7/8"), !e.attrHooks[f] && h.test(f) && (e.attrHooks[f] = {
                    get: function (t, r) {
                        var i,
                        s = e.prop(t, r);
                        return s === !0 || "boolean" != typeof s && (i = t.getAttributeNode(r)) && i.nodeValue !== !1 ? r.toLowerCase() : n
                    },
                    set: function (t, n, r) {
                        var i;
                        return n === !1 ? e.removeAttr(t, r) : (i = e.propFix[r] || r, i in t && (t[i] = !0), t.setAttribute(r, r.toLowerCase())),
                        r
                    }
                }, p.test(f) && r("jQuery.fn.attr('" + f + "') may use property instead of attribute")), u.call(e, t, i, s))
    },
    e.attrHooks.value = {
        get: function (e, t) {
            var n = (e.nodeName || "").toLowerCase();
            return "button" === n ? a.apply(this, arguments) : ("input" !== n && "option" !== n && r("jQuery.fn.attr('value') no longer gets properties"), t in e ? e.value : null)
        },
        set: function (e, t) {
            var i = (e.nodeName || "").toLowerCase();
            return "button" === i ? f.apply(this, arguments) : ("input" !== i && "option" !== i && r("jQuery.fn.attr('value', val) no longer sets properties"), e.value = t, n)
        }
    };
    var d,
    v,
    m = e.fn.init,
    g = e.parseJSON,
    y = /^([^<]*)(<[\w\W]+>)([^>]*)$/;
    e.fn.init = function (t, n, i) {
        var s;
        return t && "string" == typeof t && !e.isPlainObject(n) && (s = y.exec(e.trim(t))) && s[0] && ("<" !== t.charAt(0) && r("$(html) HTML strings must start with '<' character"), s[3] && r("$(html) HTML text after last tag is ignored"), "#" === s[0].charAt(0) && (r("HTML string cannot start with a '#' character"), e.error("JQMIGRATE: Invalid selector string (XSS)")), n && n.context && (n = n.context), e.parseHTML) ? m.call(this, e.parseHTML(s[2], n, !0), n, i) : m.apply(this, arguments)
    },
    e.fn.init.prototype = e.fn,
    e.parseJSON = function (e) {
        return e || null === e ? g.apply(this, arguments) : (r("jQuery.parseJSON requires a valid JSON string"), null)
    },
    e.uaMatch = function (e) {
        e = e.toLowerCase();
        var t = /(chrome)[ \/]([\w.]+)/.exec(e) || /(webkit)[ \/]([\w.]+)/.exec(e) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e) || /(msie) ([\w.]+)/.exec(e) || 0 > e.indexOf("compatible") && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e) || [];
        return {
            browser: t[1] || "",
            version: t[2] || "0"
        }
    },
    e.browser || (d = e.uaMatch(navigator.userAgent), v = {}, d.browser && (v[d.browser] = !0, v.version = d.version), v.chrome ? v.webkit = !0 : v.webkit && (v.safari = !0), e.browser = v),
    i(e, "browser", e.browser, "jQuery.browser is deprecated"),
    e.sub = function () {
        function t(e, n) {
            return new t.fn.init(e, n)
        }
        e.extend(!0, t, this),
        t.superclass = this,
        t.fn = t.prototype = this(),
        t.fn.constructor = t,
        t.sub = this.sub,
        t.fn.init = function (r, i) {
            return i && i instanceof e && !(i instanceof t) && (i = t(i)),
            e.fn.init.call(this, r, i, n)
        },
        t.fn.init.prototype = t.fn;
        var n = t(document);
        return r("jQuery.sub() is deprecated"),
        t
    },
    e.ajaxSetup({
        converters: {
            "text json": e.parseJSON
        }
    });
    var b = e.fn.data;
    e.fn.data = function (t) {
        var i,
        s,
        o = this[0];
        return !o || "events" !== t || 1 !== arguments.length || (i = e.data(o, t), s = e._data(o, t), i !== n && i !== s || s === n) ? b.apply(this, arguments) : (r("Use of jQuery.fn.data('events') is deprecated"), s)
    };
    var w = /\/(java|ecma)script/i,
    E = e.fn.andSelf || e.fn.addBack;
    e.fn.andSelf = function () {
        return r("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()"),
        E.apply(this, arguments)
    },
    e.clean || (e.clean = function (t, i, s, o) {
        i = i || document,
        i = !i.nodeType && i[0] || i,
        i = i.ownerDocument || i,
        r("jQuery.clean() is deprecated");
        var u,
        a,
        f,
        l,
        c = [];
        if (e.merge(c, e.buildFragment(t, i).childNodes), s)
            for (f = function (e) {
                return !e.type || w.test(e.type) ? o ? o.push(e.parentNode ? e.parentNode.removeChild(e) : e) : s.appendChild(e) : n
            }, u = 0; null != (a = c[u]); u++)
                e.nodeName(a, "script") && f(a) || (s.appendChild(a), a.getElementsByTagName !== n && (l = e.grep(e.merge([], a.getElementsByTagName("script")), f), c.splice.apply(c, [u + 1, 0].concat(l)), u += l.length));
        return c
    });
    var S = e.event.add,
    x = e.event.remove,
    T = e.event.trigger,
    N = e.fn.toggle,
    C = e.fn.live,
    k = e.fn.die,
    L = "ajaxStart|ajaxStop|ajaxSend|ajaxComplete|ajaxError|ajaxSuccess",
    A = RegExp("\\b(?:" + L + ")\\b"),
    O = /(?:^|\s)hover(\.\S+|)\b/,
    M = function (t) {
        return "string" != typeof t || e.event.special.hover ? t : (O.test(t) && r("'hover' pseudo-event is deprecated, use 'mouseenter mouseleave'"), t && t.replace(O, "mouseenter$1 mouseleave$1"))
    };
    e.event.props && "attrChange" !== e.event.props[0] && e.event.props.unshift("attrChange", "attrName", "relatedNode", "srcElement"),
    e.event.dispatch && i(e.event, "handle", e.event.dispatch, "jQuery.event.handle is undocumented and deprecated"),
    e.event.add = function (e, t, n, i, s) {
        e !== document && A.test(t) && r("AJAX events should be attached to document: " + t),
        S.call(this, e, M(t || ""), n, i, s)
    },
    e.event.remove = function (e, t, n, r, i) {
        x.call(this, e, M(t) || "", n, r, i)
    },
    e.fn.error = function () {
        var e = Array.prototype.slice.call(arguments, 0);
        return r("jQuery.fn.error() is deprecated"),
        e.splice(0, 0, "error"),
        arguments.length ? this.bind.apply(this, e) : (this.triggerHandler.apply(this, e), this)
    },
    e.fn.toggle = function (t, n) {
        if (!e.isFunction(t) || !e.isFunction(n))
            return N.apply(this, arguments);
        r("jQuery.fn.toggle(handler, handler...) is deprecated");
        var i = arguments,
        s = t.guid || e.guid++,
        o = 0,
        u = function (n) {
            var r = (e._data(this, "lastToggle" + t.guid) || 0) % o;
            return e._data(this, "lastToggle" + t.guid, r + 1),
            n.preventDefault(),
            i[r].apply(this, arguments) || !1
        };
        for (u.guid = s; i.length > o; )
            i[o++].guid = s;
        return this.click(u)
    },
    e.fn.live = function (t, n, i) {
        return r("jQuery.fn.live() is deprecated"),
        C ? C.apply(this, arguments) : (e(this.context).on(t, this.selector, n, i), this)
    },
    e.fn.die = function (t, n) {
        return r("jQuery.fn.die() is deprecated"),
        k ? k.apply(this, arguments) : (e(this.context).off(t, this.selector || "**", n), this)
    },
    e.event.trigger = function (e, t, n, i) {
        return n || A.test(e) || r("Global events are undocumented and deprecated"),
        T.call(this, e, t, n || document, i)
    },
    e.each(L.split("|"), function (t, n) {
        e.event.special[n] = {
            setup: function () {
                var t = this;
                return t !== document && (e.event.add(document, n + "." + e.guid, function () {
                        e.event.trigger(n, null, t, !0)
                    }), e._data(this, n, e.guid++)),
                !1
            },
            teardown: function () {
                return this !== document && e.event.remove(document, n + "." + e._data(this, n)),
                !1
            }
        }
    })
}
(jQuery, window), window.JSON || (window.JSON = {}), function () {
    "use strict";
    function f(e) {
        return e < 10 ? "0" + e : e
    }
    function quote(e) {
        return escapable.lastIndex = 0,
        escapable.test(e) ? '"' + e.replace(escapable, function (e) {
            var t = meta[e];
            return typeof t == "string" ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + e + '"'
    }
    function str(e, t) {
        var n,
        r,
        i,
        s,
        o = gap,
        u,
        a = t[e];
        a && typeof a == "object" && typeof a.toJSON == "function" && (a = a.toJSON(e)),
        typeof rep == "function" && (a = rep.call(t, e, a));
        switch (typeof a) {
        case "string":
            return quote(a);
        case "number":
            return isFinite(a) ? String(a) : "null";
        case "boolean":
        case "null":
            return String(a);
        case "object":
            if (!a)
                return "null";
            gap += indent,
            u = [];
            if (Object.prototype.toString.apply(a) === "[object Array]") {
                s = a.length;
                for (n = 0; n < s; n += 1)
                    u[n] = str(n, a) || "null";
                return i = u.length === 0 ? "[]" : gap ? "[\n" + gap + u.join(",\n" + gap) + "\n" + o + "]" : "[" + u.join(",") + "]",
                gap = o,
                i
            }
            if (rep && typeof rep == "object") {
                s = rep.length;
                for (n = 0; n < s; n += 1)
                    r = rep[n], typeof r == "string" && (i = str(r, a), i && u.push(quote(r) + (gap ? ": " : ":") + i))
            } else
                for (r in a)
                    Object.hasOwnProperty.call(a, r) && (i = str(r, a), i && u.push(quote(r) + (gap ? ": " : ":") + i));
            return i = u.length === 0 ? "{}" : gap ? "{\n" + gap + u.join(",\n" + gap) + "\n" + o + "}" : "{" + u.join(",") + "}",
            gap = o,
            i
        }
    }
    typeof Date.prototype.toJSON != "function" && (Date.prototype.toJSON = function (e) {
        return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
    }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (e) {
        return this.valueOf()
    });
    var JSON = window.JSON,
    cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    gap,
    indent,
    meta = {
        "\b": "\\b",
        "	": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
    },
    rep;
    typeof JSON.stringify != "function" && (JSON.stringify = function (e, t, n) {
        var r;
        gap = "",
        indent = "";
        if (typeof n == "number")
            for (r = 0; r < n; r += 1)
                indent += " ";
        else
            typeof n == "string" && (indent = n);
        rep = t;
        if (!t || typeof t == "function" || typeof t == "object" && typeof t.length == "number")
            return str("", {
                "": e
            });
        throw new Error("JSON.stringify")
    }),
    typeof JSON.parse != "function" && (JSON.parse = function (text, reviver) {
        function walk(e, t) {
            var n,
            r,
            i = e[t];
            if (i && typeof i == "object")
                for (n in i)
                    Object.hasOwnProperty.call(i, n) && (r = walk(i, n), r !== undefined ? i[n] = r : delete i[n]);
            return reviver.call(e, t, i)
        }
        var j;
        text = String(text),
        cx.lastIndex = 0,
        cx.test(text) && (text = text.replace(cx, function (e) {
                return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
            }));
        if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, "")))
            return j = eval("(" + text + ")"), typeof reviver == "function" ? walk({
                "": j
            }, "") : j;
        throw new SyntaxError("JSON.parse")
    })
}
(), function () {
    var e = this,
    t = e.Backbone,
    n = Array.prototype.slice,
    r = Array.prototype.splice,
    i;
    i = "undefined" != typeof exports ? exports : e.Backbone = {},
    i.VERSION = "0.9.2";
    var s = e._;
    !s && "undefined" != typeof require && (s = require("underscore"));
    var o = e.jQuery || e.Zepto || e.ender;
    i.setDomLibrary = function (e) {
        o = e
    },
    i.noConflict = function () {
        return e.Backbone = t,
        this
    },
    i.emulateHTTP = !1,
    i.emulateJSON = !1;
    var u = /\s+/,
    a = i.Events = {
        on: function (e, t, n) {
            var r,
            i,
            s,
            o,
            a;
            if (!t)
                return this;
            e = e.split(u);
            for (r = this._callbacks || (this._callbacks = {}); i = e.shift(); )
                s = (a = r[i]) ? a.tail : {},
            s.next = o = {},
            s.context = n,
            s.callback = t,
            r[i] = {
                tail: o,
                next: a ? a.next : s
            };
            return this
        },
        off: function (e, t, n) {
            var r,
            i,
            o,
            a,
            f,
            l;
            if (i = this._callbacks) {
                if (!e && !t && !n)
                    return delete this._callbacks, this;
                for (e = e ? e.split(u) : s.keys(i); r = e.shift(); )
                    if (o = i[r], delete i[r], o && (t || n))
                        for (a = o.tail; (o = o.next) !== a; )
                            (f = o.callback, l = o.context, t && f !== t || n && l !== n) && this.on(r, f, l);
                return this
            }
        },
        trigger: function (e) {
            var t,
            r,
            i,
            s,
            o,
            a;
            if (!(i = this._callbacks))
                return this;
            o = i.all,
            e =
                e.split(u);
            for (a = n.call(arguments, 1); t = e.shift(); ) {
                if (r = i[t])
                    for (s = r.tail; (r = r.next) !== s; )
                        r.callback.apply(r.context || this, a);
                if (r = o) {
                    s = r.tail;
                    for (t = [t].concat(a); (r = r.next) !== s; )
                        r.callback.apply(r.context || this, t)
                }
            }
            return this
        }
    };
    a.bind = a.on,
    a.unbind = a.off;
    var f = i.Model = function (e, t) {
        var n;
        e || (e = {}),
        t && t.parse && (e = this.parse(e));
        if (n = T(this, "defaults"))
            e = s.extend({}, n, e);
        t && t.collection && (this.collection = t.collection),
        this.attributes = {},
        this._escapedAttributes = {},
        this.cid = s.uniqueId("c"),
        this.changed = {},
        this._silent = {},
        this._pending = {},
        this.set(e, {
            silent: !0
        }),
        this.changed = {},
        this._silent = {},
        this._pending = {},
        this._previousAttributes = s.clone(this.attributes),
        this.initialize.apply(this, arguments)
    };
    s.extend(f.prototype, a, {
        changed: null,
        _silent: null,
        _pending: null,
        idAttribute: "id",
        initialize: function () {},
        toJSON: function () {
            return s.clone(this.attributes)
        },
        get: function (e) {
            return this.attributes[e]
        },
        escape: function (e) {
            var t;
            return (t = this._escapedAttributes[e]) ? t : (t = this.get(e), this._escapedAttributes[e] = s.escape(null == t ? "" : "" + t))
        },
        has: function (e) {
            return null != this.get(e)
        },
        set: function (e, t, n) {
            var r,
            i;
            s.isObject(e) || null == e ? (r = e, n = t) : (r = {}, r[e] = t),
            n || (n = {});
            if (!r)
                return this;
            r instanceof f && (r = r.attributes);
            if (n.unset)
                for (i in r)
                    r[i] = void 0;
            if (!this._validate(r, n))
                return !1;
            this.idAttribute in r && (this.id = r[this.idAttribute]);
            var t = n.changes = {},
            o = this.attributes,
            u = this._escapedAttributes,
            a = this._previousAttributes || {};
            for (i in r) {
                e = r[i];
                if (!s.isEqual(o[i], e) || n.unset && s.has(o, i))
                    delete u[i], (n.silent ? this._silent : t)[i] = !0;
                n.unset ? delete o[i] : o[i] = e,
                !s.isEqual(a[i], e) || s.has(o, i) != s.has(a, i) ? (this.changed[i] = e, n.silent || (this._pending[i] = !0)) : (delete this.changed[i], delete this._pending[i])
            }
            return n.silent || this.change(n),
            this
        },
        unset: function (e, t) {
            return (t || (t = {})).unset = !0,
            this.set(e, null, t)
        },
        clear: function (e) {
            return (e || (e = {})).unset = !0,
            this.set(s.clone(this.attributes), e)
        },
        fetch: function (e) {
            var e = e ? s.clone(e) : {},
            t = this,
            n = e.success;
            return e.success = function (r, i, s) {
                if (!t.set(t.parse(r, s), e))
                    return !1;
                n && n(t, r)
            },
            e.error = i.wrapError(e.error, t, e),
            (this.sync || i.sync).call(this, "read", this, e)
        },
        save: function (e, t, n) {
            var r,
            o;
            s.isObject(e) || null == e ? (r = e, n = t) : (r = {}, r[e] = t),
            n = n ? s.clone(n) : {};
            if (n.wait) {
                if (!this._validate(r, n))
                    return !1;
                o = s.clone(this.attributes)
            }
            e = s.extend({}, n, {
                silent: !0
            });
            if (r && !this.set(r, n.wait ? e : n))
                return !1;
            var u = this,
            a = n.success;
            return n.success = function (e, t, i) {
                t = u.parse(e, i),
                n.wait && (delete n.wait, t = s.extend(r || {}, t));
                if (!u.set(t, n))
                    return !1;
                a ? a(u, e) : u.trigger("sync", u, e, n)
            },
            n.error = i.wrapError(n.error, u, n),
            t = this.isNew() ? "create" : "update",
            t = (this.sync || i.sync).call(this, t, this, n),
            n.wait && this.set(o, e),
            t
        },
        destroy: function (e) {
            var e = e ? s.clone(e) : {},
            t = this,
            n = e.success,
            r = function () {
                t.trigger("destroy", t, t.collection, e)
            };
            if (this.isNew())
                return r(), !1;
            e.success = function (i) {
                e.wait && r(),
                n ? n(t, i) : t.trigger("sync", t, i, e)
            },
            e.error = i.wrapError(e.error, t, e);
            var o = (this.sync || i.sync).call(this, "delete", this, e);
            return e.wait || r(),
            o
        },
        url: function () {
            var e = T(this, "urlRoot") || T(this.collection, "url") || N();
            return this.isNew() ? e : e + (Scratch.ROOT_URL == e.charAt(e.length - 1) ? "" : Scratch.ROOT_URL) + encodeURIComponent(this.id)
        },
        parse: function (e) {
            return e
        },
        clone: function () {
            return new this.constructor(this.attributes)
        },
        isNew: function () {
            return null == this.id
        },
        change: function (e) {
            e || (e = {});
            var t = this._changing;
            this._changing = !0;
            for (var n in this._silent)
                this._pending[n] = !0;
            var r = s.extend({}, e.changes, this._silent);
            this._silent = {};
            for (n in r)
                this.trigger("change:" + n, this, this.get(n), e);
            if (t)
                return this;
            for (; !s.isEmpty(this._pending); ) {
                this._pending = {},
                this.trigger("change", this, e);
                for (n in this.changed)
                    !this._pending[n] && !this._silent[n] && delete this.changed[n];
                this._previousAttributes = s.clone(this.attributes)
            }
            return this._changing = !1,
            this
        },
        hasChanged: function (e) {
            return arguments.length ? s.has(this.changed, e) : !s.isEmpty(this.changed)
        },
        changedAttributes: function (e) {
            if (!e)
                return this.hasChanged() ? s.clone(this.changed) : !1;
            var t,
            n = !1,
            r = this._previousAttributes,
            i;
            for (i in e)
                s.isEqual(r[i], t = e[i]) || ((n || (n = {}))[i] = t);
            return n
        },
        previous: function (e) {
            return !arguments.length || !this._previousAttributes ? null : this._previousAttributes[e]
        },
        previousAttributes: function () {
            return s.clone(this._previousAttributes)
        },
        isValid: function () {
            return !this.validate(this.attributes)
        },
        _validate: function (e, t) {
            if (t.silent || !this.validate)
                return !0;
            var e = s.extend({}, this.attributes, e),
            n = this.validate(e, t);
            return n ? (t && t.error ? t.error(this, n, t) : this.trigger("error", this, n, t), !1) : !0
        }
    });
    var l = i.Collection = function (e, t) {
        t || (t = {}),
        t.model && (this.model = t.model),
        t.comparator && (this.comparator = t.comparator),
        this._reset(),
        this.initialize.apply(this, arguments),
        e && this.reset(e, {
            silent: !0,
            parse: t.parse
        })
    };
    s.extend(l.prototype, a, {
        model: f,
        initialize: function () {},
        toJSON: function (e) {
            return this.map(function (t) {
                return t.toJSON(e)
            })
        },
        add: function (e, t) {
            var n,
            i,
            o,
            u,
            a,
            f = {},
            l = {},
            c = [];
            t || (t = {}),
            e = s.isArray(e) ? e.slice() : [e],
            n = 0;
            for (i = e.length; n < i; n++) {
                if (!(o = e[n] = this._prepareModel(e[n], t)))
                    throw Error("Can't add an invalid model to a collection");
                u = o.cid,
                a = o.id,
                f[u] || this._byCid[u] || null != a && (l[a] || this._byId[a]) ? c.push(n) : f[u] = l[a] = o
            }
            for (n = c.length; n--; )
                e.splice(c[n], 1);
            n = 0;
            for (i = e.length; n < i; n++)
                (o = e[n]).on("all", this._onModelEvent, this), this._byCid[o.cid] = o, null != o.id && (this._byId[o.id] = o);
            this.length += i,
            r.apply(this.models, [null != t.at ? t.at : this.models.length, 0].concat(e)),
            this.comparator && this.sort({
                silent: !0
            });
            if (t.silent)
                return this;
            n = 0;
            for (i = this.models.length; n < i; n++)
                f[(o = this.models[n]).cid] && (t.index = n, o.trigger("add", o, this, t));
            return this
        },
        remove: function (e, t) {
            var n,
            r,
            i,
            o;
            t || (t = {}),
            e = s.isArray(e) ? e.slice() : [e],
            n = 0;
            for (r = e.length; n < r; n++)
                if (o = this.getByCid(e[n]) || this.get(e[n]))
                    delete this._byId[o.id], delete this._byCid[o.cid], i = this.indexOf(o), this.models.splice(i, 1), this.length--, t.silent || (t.index = i, o.trigger("remove", o, this, t)), this._removeReference(o);
            return this
        },
        push: function (e, t) {
            return e = this._prepareModel(e, t),
            this.add(e, t),
            e
        },
        pop: function (e) {
            var t = this.at(this.length - 1);
            return this.remove(t,
                e),
            t
        },
        unshift: function (e, t) {
            return e = this._prepareModel(e, t),
            this.add(e, s.extend({
                    at: 0
                }, t)),
            e
        },
        shift: function (e) {
            var t = this.at(0);
            return this.remove(t, e),
            t
        },
        get: function (e) {
            return null == e ? void 0 : this._byId[null != e.id ? e.id : e]
        },
        getByCid: function (e) {
            return e && this._byCid[e.cid || e]
        },
        at: function (e) {
            return this.models[e]
        },
        where: function (e) {
            return s.isEmpty(e) ? [] : this.filter(function (t) {
                for (var n in e)
                    if (e[n] !== t.get(n))
                        return !1;
                return !0
            })
        },
        sort: function (e) {
            e || (e = {});
            if (!this.comparator)
                throw Error("Cannot sort a set without a comparator");
            var t = s.bind(this.comparator, this);
            return 1 == this.comparator.length ? this.models = this.sortBy(t) : this.models.sort(t),
            e.silent || this.trigger("reset", this, e),
            this
        },
        pluck: function (e) {
            return s.map(this.models, function (t) {
                return t.get(e)
            })
        },
        reset: function (e, t) {
            e || (e = []),
            t || (t = {});
            for (var n = 0, r = this.models.length; n < r; n++)
                this._removeReference(this.models[n]);
            return this._reset(),
            this.add(e, s.extend({
                    silent: !0
                }, t)),
            t.silent || this.trigger("reset", this, t),
            this
        },
        fetch: function (e) {
            e = e ? s.clone(e) : {},
            void 0 === e.parse && (e.parse = !0);
            var t = this,
            n = e.success;
            return e.success = function (r, i, s) {
                t[e.add ? "add" : "reset"](t.parse(r, s), e),
                n && n(t, r)
            },
            e.error = i.wrapError(e.error, t, e),
            (this.sync || i.sync).call(this, "read", this, e)
        },
        create: function (e, t) {
            var n = this,
            t = t ? s.clone(t) : {},
            e = this._prepareModel(e, t);
            if (!e)
                return !1;
            t.wait || n.add(e, t);
            var r = t.success;
            return t.success = function (i, s) {
                t.wait && n.add(i, t),
                r ? r(i, s) : i.trigger("sync", e, s, t)
            },
            e.save(null, t),
            e
        },
        parse: function (e) {
            return e
        },
        chain: function () {
            return s(this.models).chain()
        },
        _reset: function () {
            this.length = 0,
            this.models = [],
            this._byId = {},
            this._byCid = {}
        },
        _prepareModel: function (e, t) {
            return t || (t = {}),
            e instanceof f ? e.collection || (e.collection = this) : (t.collection = this, e = new this.model(e, t), e._validate(e.attributes, t) || (e = !1)),
            e
        },
        _removeReference: function (e) {
            this == e.collection && delete e.collection,
            e.off("all", this._onModelEvent, this)
        },
        _onModelEvent: function (e, t, n, r) {
            ("add" == e || "remove" == e) && n != this || ("destroy" == e && this.remove(t, r), t && e === "change:" + t.idAttribute && (delete this._byId[t.previous(t.idAttribute)], this._byId[t.id] = t), this.trigger.apply(this, arguments))
        }
    }),
    s.each("forEach,each,map,reduce,reduceRight,find,detect,filter,select,reject,every,all,some,any,include,contains,invoke,max,min,sortBy,sortedIndex,toArray,size,first,initial,rest,last,without,indexOf,shuffle,lastIndexOf,isEmpty,groupBy".split(","), function (e) {
        l.prototype[e] = function () {
            return s[e].apply(s, [this.models].concat(s.toArray(arguments)))
        }
    });
    var c = i.Router = function (e) {
        e || (e = {}),
        e.routes && (this.routes = e.routes),
        this._bindRoutes(),
        this.initialize.apply(this, arguments)
    },
    h = /:\w+/g,
    p = /\*\w+/g,
    d = /[-[\]{}()+?.,\\^$|#\s]/g;
    s.extend(c.prototype, a, {
        initialize: function () {},
        route: function (e, t, n) {
            return i.history || (i.history = new v),
            s.isRegExp(e) || (e = this._routeToRegExp(e)),
            n || (n = this[t]),
            i.history.route(e, s.bind(function (r) {
                    r = this._extractParameters(e, r),
                    n && n.apply(this, r),
                    this.trigger.apply(this, ["route:" + t].concat(r)),
                    i.history.trigger("route", this, t, r)
                }, this)),
            this
        },
        navigate: function (e, t) {
            i.history.navigate(e, t)
        },
        _bindRoutes: function () {
            if (this.routes) {
                var e = [],
                t;
                for (t in this.routes)
                    e.unshift([t, this.routes[t]]);
                t = 0;
                for (var n = e.length; t < n; t++)
                    this.route(e[t][0], e[t][1], this[e[t][1]])
            }
        },
        _routeToRegExp: function (e) {
            return e = e.replace(d, "\\$&").replace(h, "([^/]+)").replace(p, "(.*?)"),
            RegExp("^" + e + "$")
        },
        _extractParameters: function (e, t) {
            return e.exec(t).slice(1)
        }
    });
    var v = i.History = function () {
        this.handlers = [],
        s.bindAll(this, "checkUrl")
    },
    m = /^[#\/]/,
    g = /msie [\w.]+/;
    v.started = !1,
    s.extend(v.prototype, a, {
        interval: 50,
        getHash: function (e) {
            return (e = (e ? e.location : window.location).href.match(/#(.*)$/)) ? e[1] : ""
        },
        getFragment: function (e, t) {
            if (null == e)
                if (this._hasPushState || t) {
                    var e = window.location.pathname,
                    n = window.location.search;
                    n && (e += n)
                } else
                    e = this.getHash();
            return e.indexOf(this.options.root) || (e = e.substr(this.options.root.length)),
            e.replace(m, "")
        },
        start: function (e) {
            if (v.started)
                throw Error("Backbone.history has already been started");
            v.started = !0,
            this.options = s.extend({}, {
                root: Scratch.ROOT_URL
            }, this.options, e),
            this._wantsHashChange = !1 !== this.options.hashChange,
            this._wantsPushState = !!this.options.pushState,
            this._hasPushState = !(!this.options.pushState || !window.history || !window.history.pushState);
            var e = this.getFragment(),
            t = document.documentMode;
            if (t = g.exec(navigator.userAgent.toLowerCase()) && (!t || 7 >= t))
                this.iframe = o('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow, this.navigate(e);
            this._hasPushState ? o(window).bind("popstate", this.checkUrl) : this._wantsHashChange && "onhashchange" in window && !t ? o(window).bind("hashchange", this.checkUrl) : this._wantsHashChange && (this._checkUrlInterval = setInterval(this.checkUrl, this.interval)),
            this.fragment = e,
            e = window.location,
            t = e.pathname == this.options.root;
            if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !t)
                return this.fragment = this.getFragment(null, !0), window.location.replace(this.options.root + "#" + this.fragment), !0;
            this._wantsPushState && this._hasPushState && t && e.hash && (this.fragment = this.getHash().replace(m, ""), window.history.replaceState({}, document.title, e.protocol + Scratch.ROOT_URL + e.host + this.options.root + this.fragment));
            if (!this.options.silent)
                return this.loadUrl()
        },
        stop: function () {
            o(window).unbind("popstate", this.checkUrl).unbind("hashchange", this.checkUrl),
            clearInterval(this._checkUrlInterval),
            v.started = !1
        },
        route: function (e, t) {
            this.handlers.unshift({
                route: e,
                callback: t
            })
        },
        checkUrl: function () {
            var e = this.getFragment();
            e == this.fragment && this.iframe && (e = this.getFragment(this.getHash(this.iframe)));
            if (e == this.fragment)
                return !1;
            this.iframe && this.navigate(e),
            this.loadUrl() || this.loadUrl(this.getHash())
        },
        loadUrl: function (e) {
            var t = this.fragment = this.getFragment(e);
            return s.any(this.handlers, function (e) {
                if (e.route.test(t))
                    return e.callback(t), !0
            })
        },
        navigate: function (e, t) {
            if (!v.started)
                return !1;
            if (!t || !0 === t)
                t = {
                    trigger: t
                };
            var n = (e || "").replace(m, "");
            this.fragment != n && (this._hasPushState ? (0 != n.indexOf(this.options.root) && (n = this.options.root + n), this.fragment =
                        n, window.history[t.replace ? "replaceState" : "pushState"]({}, document.title, n)) : this._wantsHashChange ? (this.fragment = n, this._updateHash(window.location, n, t.replace), this.iframe && n != this.getFragment(this.getHash(this.iframe)) && (t.replace || this.iframe.document.open().close(), this._updateHash(this.iframe.location, n, t.replace))) : window.location.assign(this.options.root + e), t.trigger && this.loadUrl(e))
        },
        _updateHash: function (e, t, n) {
            n ? e.replace(e.toString().replace(/(javascript:|#).*$/, "") + "#" + t) : e.hash = t
        }
    });
    var y = i.View = function (e) {
        this.cid = s.uniqueId("view"),
        this._configure(e || {}),
        this._ensureElement(),
        this.initialize.apply(this, arguments),
        this.delegateEvents()
    },
    b = /^(\S+)\s*(.*)$/,
    w = "model,collection,el,id,attributes,className,tagName".split(",");
    s.extend(y.prototype, a, {
        tagName: "div",
        $: function (e) {
            return this.$el.find(e)
        },
        initialize: function () {},
        render: function () {
            return this
        },
        remove: function () {
            return this.$el.remove(),
            this
        },
        make: function (e, t, n) {
            return e = document.createElement(e),
            t && o(e).attr(t),
            n && o(e).html(n),
            e
        },
        setElement: function (e, t) {
            return this.$el && this.undelegateEvents(),
            this.$el = e instanceof o ? e : o(e),
            this.el = this.$el[0],
            !1 !== t && this.delegateEvents(),
            this
        },
        delegateEvents: function (e) {
            if (e || (e = T(this, "events"))) {
                this.undelegateEvents();
                for (var t in e) {
                    var n = e[t];
                    s.isFunction(n) || (n = this[e[t]]);
                    if (!n)
                        throw Error('Method "' + e[t] + '" does not exist');
                    var r = t.match(b),
                    i = r[1],
                    r = r[2],
                    n = s.bind(n, this),
                    i = i + (".delegateEvents" + this.cid);
                    "" === r ? this.$el.bind(i, n) : this.$el.delegate(r, i, n)
                }
            }
        },
        undelegateEvents: function () {
            this.$el.unbind(".delegateEvents" + this.cid)
        },
        _configure: function (e) {
            this.options && (e = s.extend({}, this.options, e));
            for (var t = 0, n = w.length; t < n; t++) {
                var r = w[t];
                e[r] && (this[r] = e[r])
            }
            this.options = e
        },
        _ensureElement: function () {
            if (this.el)
                this.setElement(this.el, !1);
            else {
                var e = T(this, "attributes") || {};
                this.id && (e.id = this.id),
                this.className && (e["class"] = this.className),
                this.setElement(this.make(this.tagName, e), !1)
            }
        }
    }),
    f.extend = l.extend = c.extend = y.extend = function (e, t) {
        var n = x(this, e, t);
        return n.extend = this.extend,
        n
    };
    var E = {
        create: "POST",
        update: "PUT",
        "delete": "DELETE",
        read: "GET"
    };
    i.sync = function (e, t, n) {
        var r = E[e];
        n || (n = {});
        var u = {
            type: r,
            dataType: "json"
        };
        return n.url || (u.url = T(t, "url") || N()),
        !n.data && t && ("create" == e || "update" == e) && (u.contentType = "application/json", u.data = JSON.stringify(t.toJSON())),
        i.emulateJSON && (u.contentType = "application/x-www-form-urlencoded", u.data = u.data ? {
                model: u.data
            }
             : {}),
        i.emulateHTTP && ("PUT" === r || "DELETE" === r) && (i.emulateJSON && (u.data._method = r), u.type = "POST", u.beforeSend = function (e) {
            e.setRequestHeader("X-HTTP-Method-Override", r)
        }),
        "GET" !== u.type && !i.emulateJSON && (u.processData = !1),
        o.ajax(s.extend(u, n))
    },
    i.wrapError = function (e, t, n) {
        return function (r, i) {
            i = r === t ? i : r,
            e ? e(t, i, n) : t.trigger("error", t, i, n)
        }
    };
    var S = function () {},
    x = function (e, t, n) {
        var r;
        return r = t && t.hasOwnProperty("constructor") ? t.constructor : function () {
            e.apply(this, arguments)
        },
        s.extend(r, e),
        S.prototype = e.prototype,
        r.prototype = new S,
        t && s.extend(r.prototype, t),
        n && s.extend(r, n),
        r.prototype.constructor = r,
        r.__super__ = e.prototype,
        r
    },
    T = function (e, t) {
        return !e || !e[t] ? null : s.isFunction(e[t]) ? e[t]() : e[t]
    },
    N = function () {
        throw Error('A "url" property or function must be specified')
    }
}
.call(this), function (e) {
    var t = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    n = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    r = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    i = [];
    i.Jan = "01",
    i.Feb = "02",
    i.Mar = "03",
    i.Apr = "04",
    i.May = "05",
    i.Jun = "06",
    i.Jul = "07",
    i.Aug = "08",
    i.Sep = "09",
    i.Oct = "10",
    i.Nov = "11",
    i.Dec = "12",
    e.format = function () {
        function e(e) {
            return t[parseInt(e, 10)] || e
        }
        function s(e) {
            var t = parseInt(e, 10) - 1;
            return n[t] || e
        }
        function o(e) {
            var t = parseInt(e, 10) - 1;
            return r[t] || e
        }
        var u = function (e) {
            return i[e] || e
        },
        a = function (e) {
            var t = e,
            n = "";
            if (t.indexOf(".") !== -1) {
                var r = t.split(".");
                t = r[0],
                n = r[1]
            }
            var i = t.split(":");
            return i.length === 3 ? (hour = i[0], minute = i[1], second = i[2], {
                time: t,
                hour: hour,
                minute: minute,
                second: second,
                millis: n
            }) : {
                time: "",
                hour: "",
                minute: "",
                second: "",
                millis: ""
            }
        };
        return {
            date: function (t, n) {
                try {
                    var r = null,
                    i = null,
                    f = null,
                    l = null,
                    c = null,
                    h = null;
                    if (typeof t == "number")
                        return this.date(new Date(t), n);
                    if (typeof t.getFullYear == "function")
                        i = t.getFullYear(), f = t.getMonth() + 1, l = t.getDate(), c = t.getDay(), h = a(t.toTimeString());
                    else if (t.search(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.?\d{0,3}[-+]?\d{2}:?\d{2}/) != -1) {
                        var p = t.split(/[T\+-]/);
                        i = p[0],
                        f = p[1],
                        l = p[2],
                        h = a(p[3].split(".")[0]),
                        r = new Date(i, f - 1, l),
                        c = r.getDay()
                    } else {
                        var p = t.split(" ");
                        switch (p.length) {
                        case 6:
                            i = p[5],
                            f = u(p[1]),
                            l = p[2],
                            h = a(p[3]),
                            r = new Date(i, f - 1, l),
                            c = r.getDay();
                            break;
                        case 2:
                            var d = p[0].split("-");
                            i = d[0],
                            f = d[1],
                            l = d[2],
                            h = a(p[1]),
                            r = new Date(i, f - 1, l),
                            c = r.getDay();
                            break;
                        case 7:
                        case 9:
                        case 10:
                            i = p[3],
                            f = u(p[1]),
                            l = p[2],
                            h = a(p[4]),
                            r = new Date(i, f - 1, l),
                            c = r.getDay();
                            break;
                        case 1:
                            var d = p[0].split("");
                            i = d[0] + d[1] + d[2] + d[3],
                            f = d[5] + d[6],
                            l = d[8] + d[9],
                            h = a(d[13] + d[14] + d[15] + d[16] + d[17] + d[18] + d[19] + d[20]),
                            r = new Date(i, f - 1, l),
                            c = r.getDay();
                            break;
                        default:
                            return t
                        }
                    }
                    var v = "",
                    m = "",
                    g = "";
                    for (var y = 0; y < n.length; y++) {
                        var b = n.charAt(y);
                        v += b,
                        g = "";
                        switch (v) {
                        case "ddd":
                            m += e(c),
                            v = "";
                            break;
                        case "dd":
                            if (n.charAt(y + 1) == "d")
                                break;
                            String(l).length === 1 && (l = "0" + l),
                            m += l,
                            v = "";
                            break;
                        case "d":
                            if (n.charAt(y + 1) == "d")
                                break;
                            m += parseInt(l, 10),
                            v = "";
                            break;
                        case "MMMM":
                            m += o(f),
                            v = "";
                            break;
                        case "MMM":
                            if (n.charAt(y + 1) === "M")
                                break;
                            m += s(f),
                            v = "";
                            break;
                        case "MM":
                            if (n.charAt(y + 1) == "M")
                                break;
                            String(f).length === 1 && (f = "0" + f),
                            m += f,
                            v = "";
                            break;
                        case "M":
                            if (n.charAt(y + 1) == "M")
                                break;
                            m += parseInt(f, 10),
                            v = "";
                            break;
                        case "yyyy":
                            m += i,
                            v = "";
                            break;
                        case "yy":
                            if (n.charAt(y + 1) == "y" && n.charAt(y + 2) == "y")
                                break;
                            m += String(i).slice(-2),
                            v = "";
                            break;
                        case "HH":
                            m += h.hour,
                            v = "";
                            break;
                        case "hh":
                            var w = h.hour == 0 ? 12 : h.hour < 13 ? h.hour : h.hour - 12;
                            w = String(w).length == 1 ? "0" + w : w,
                            m += w,
                            v = "";
                            break;
                        case "h":
                            if (n.charAt(y + 1) == "h")
                                break;
                            var w = h.hour == 0 ? 12 : h.hour < 13 ? h.hour : h.hour - 12;
                            m += parseInt(w, 10),
                            v = "";
                            break;
                        case "mm":
                            m += h.minute,
                            v = "";
                            break;
                        case "ss":
                            m += h.second.substring(0, 2),
                            v = "";
                            break;
                        case "SSS":
                            m += h.millis.substring
                            (0, 3),
                            v = "";
                            break;
                        case "a":
                            m += h.hour >= 12 ? "PM" : "AM",
                            v = "";
                            break;
                        case " ":
                            m += b,
                            v = "";
                            break;
                        case Scratch.ROOT_URL:
                            m += b,
                            v = "";
                            break;
                        case ":":
                            m += b,
                            v = "";
                            break;
                        default:
                            v.length === 2 && v.indexOf("y") !== 0 && v != "SS" ? (m += v.substring(0, 1), v = v.substring(1, 2)) : v.length === 3 && v.indexOf("yyy") === -1 ? v = "" : g = v
                        }
                    }
                    return m += g,
                    m
                } catch (E) {
                    return console.log(E),
                    t
                }
            }
        }
    }
    ()
}
(jQuery), jQuery.format.date.defaultShortDateFormat = "dd/MM/yyyy", jQuery.format.date.defaultLongDateFormat = "dd/MM/yyyy hh:mm:ss", jQuery(document).ready(function () {
    jQuery(".shortDateFormat").each(function (e, t) {
        jQuery(t).is(":input") ? jQuery(t).val(jQuery.format.date(jQuery(t).val(), jQuery.format.date.defaultShortDateFormat)) : jQuery(t).text(jQuery.format.date(jQuery(t).text(), jQuery.format.date.defaultShortDateFormat))
    }),
    jQuery(".longDateFormat").each(function (e, t) {
        jQuery(t).is(":input") ? jQuery(t).val(jQuery.format.date(jQuery(t).val(), jQuery.format.date.defaultLongDateFormat)) : jQuery(t).text(jQuery.format.date(jQuery(t).text(), jQuery.format.date.defaultLongDateFormat))
    })
}), typeof jQuery != "undefined" && (jQuery.fn.prettyDate = function () {
    return this.each(function () {
        var e = prettyDate(this.title);
        e && jQuery(this).text(e)
    })
}),
/*! jQuery Migrate v1.2.1 | (c) 2005, 2013 jQuery Foundation, Inc. and other contributors | jquery.org/license */
function (e) {
    var t = function () {
        "use strict";
        var e = "s",
        n = function (e) {
            var t = -e.getTimezoneOffset();
            return t !== null ? t : 0
        },
        r = function (e, t, n) {
            var r = new Date;
            return e !== undefined && r.setFullYear(e),
            r.setDate(n),
            r.setMonth(t),
            r
        },
        i = function (e) {
            return n(r(e, 0, 2))
        },
        s = function (e) {
            return n(r(e, 5, 2))
        },
        o = function (e) {
            var t = e.getMonth() > 7 ? s(e.getFullYear()) : i(e.getFullYear()),
            r = n(e);
            return t - r !== 0
        },
        u = function () {
            var t = i(),
            n = s(),
            r = i() - s();
            return r < 0 ? t + ",1" : r > 0 ? n + ",1," + e : t + ",0"
        },
        a = function () {
            var e = u();
            return new t.TimeZone(t.olson.timezones[e])
        },
        f = function (e) {
            var t = new Date(2010, 6, 15, 1, 0, 0, 0),
            n = {
                "America/Denver": new Date(2011, 2, 13, 3, 0, 0, 0),
                "America/Mazatlan": new Date(2011, 3, 3, 3, 0, 0, 0),
                "America/Chicago": new Date(2011, 2, 13, 3, 0, 0, 0),
                "America/Mexico_City": new Date(2011, 3, 3, 3, 0, 0, 0),
                "America/Asuncion": new Date(2012, 9, 7, 3, 0, 0, 0),
                "America/Santiago": new Date(2012, 9, 3, 3, 0, 0, 0),
                "America/Campo_Grande": new Date(2012, 9, 21, 5, 0, 0, 0),
                "America/Montevideo": new Date(2011, 9, 2, 3, 0, 0, 0),
                "America/Sao_Paulo": new Date(2011, 9, 16, 5, 0, 0, 0),
                "America/Los_Angeles": new Date(2011, 2, 13, 8, 0, 0, 0),
                "America/Santa_Isabel": new Date(2011, 3, 5, 8, 0, 0, 0),
                "America/Havana": new Date(2012, 2, 10, 2, 0, 0, 0),
                "America/New_York": new Date(2012, 2, 10, 7, 0, 0, 0),
                "Asia/Beirut": new Date(2011, 2, 27, 1, 0, 0, 0),
                "Europe/Helsinki": new Date(2011, 2, 27, 4, 0, 0, 0),
                "Europe/Istanbul": new Date(2011, 2, 28, 5, 0, 0, 0),
                "Asia/Damascus": new Date(2011, 3, 1, 2, 0, 0, 0),
                "Asia/Jerusalem": new Date(2011, 3, 1, 6, 0, 0, 0),
                "Asia/Gaza": new Date(2009, 2, 28, 0, 30, 0, 0),
                "Africa/Cairo": new Date(2009, 3, 25, 0, 30, 0, 0),
                "Pacific/Auckland": new Date(2011, 8, 26, 7, 0, 0, 0),
                "Pacific/Fiji": new Date(2010, 11, 29, 23, 0, 0, 0),
                "America/Halifax": new Date(2011, 2, 13, 6, 0, 0, 0),
                "America/Goose_Bay": new Date(2011, 2, 13, 2, 1, 0, 0),
                "America/Miquelon": new Date(2011, 2, 13, 5, 0, 0, 0),
                "America/Godthab": new Date(2011, 2, 27, 1, 0, 0, 0),
                "Europe/Moscow": t,
                "Asia/Yekaterinburg": t,
                "Asia/Omsk": t,
                "Asia/Krasnoyarsk": t,
                "Asia/Irkutsk": t,
                "Asia/Yakutsk": t,
                "Asia/Vladivostok": t,
                "Asia/Kamchatka": t,
                "Europe/Minsk": t,
                "Australia/Perth": new Date(2008, 10, 1, 1, 0, 0, 0)
            };
            return n[e]
        };
        return {
            determine: a,
            date_is_dst: o,
            dst_start_for: f
        }
    }
    ();
    t.TimeZone = function (e) {
        "use strict";
        var n = {
            "America/Denver": ["America/Denver", "America/Mazatlan"],
            "America/Chicago": ["America/Chicago", "America/Mexico_City"],
            "America/Santiago": ["America/Santiago", "America/Asuncion", "America/Campo_Grande"],
            "America/Montevideo": ["America/Montevideo", "America/Sao_Paulo"],
            "Asia/Beirut": ["Asia/Beirut", "Europe/Helsinki", "Europe/Istanbul", "Asia/Damascus", "Asia/Jerusalem", "Asia/Gaza"],
            "Pacific/Auckland": ["Pacific/Auckland", "Pacific/Fiji"],
            "America/Los_Angeles": ["America/Los_Angeles", "America/Santa_Isabel"],
            "America/New_York": ["America/Havana", "America/New_York"],
            "America/Halifax": ["America/Goose_Bay", "America/Halifax"],
            "America/Godthab": ["America/Miquelon", "America/Godthab"],
            "Asia/Dubai": ["Europe/Moscow"],
            "Asia/Dhaka": ["Asia/Yekaterinburg"],
            "Asia/Jakarta": ["Asia/Omsk"],
            "Asia/Shanghai": ["Asia/Krasnoyarsk", "Australia/Perth"],
            "Asia/Tokyo": ["Asia/Irkutsk"],
            "Australia/Brisbane": ["Asia/Yakutsk"],
            "Pacific/Noumea": ["Asia/Vladivostok"],
            "Pacific/Tarawa": ["Asia/Kamchatka"],
            "Africa/Johannesburg": ["Asia/Gaza", "Africa/Cairo"],
            "Asia/Baghdad": ["Europe/Minsk"]
        },
        r = e,
        i = function () {
            var e = n[r],
            i = e.length,
            s = 0,
            o = e[0];
            for (; s < i; s += 1) {
                o = e[s];
                if (t.date_is_dst(t.dst_start_for(o))) {
                    r = o;
                    return
                }
            }
        },
        s = function () {
            return typeof n[r] != "undefined"
        };
        return s() && i(), {
            name: function () {
                return r
            }
        }
    },
    t.olson = {},
    t.olson.timezones = {
        "-720,0": "Etc/GMT+12",
        "-660,0": "Pacific/Pago_Pago",
        "-600,1": "America/Adak",
        "-600,0": "Pacific/Honolulu",
        "-570,0": "Pacific/Marquesas",
        "-540,0": "Pacific/Gambier",
        "-540,1": "America/Anchorage",
        "-480,1": "America/Los_Angeles",
        "-480,0": "Pacific/Pitcairn",
        "-420,0": "America/Phoenix",
        "-420,1": "America/Denver",
        "-360,0": "America/Guatemala",
        "-360,1": "America/Chicago",
        "-360,1,s": "Pacific/Easter",
        "-300,0": "America/Bogota",
        "-300,1": "America/New_York",
        "-270,0": "America/Caracas",
        "-240,1": "America/Halifax",
        "-240,0": "America/Santo_Domingo",
        "-240,1,s": "America/Santiago",
        "-210,1": "America/St_Johns",
        "-180,1": "America/Godthab",
        "-180,0": "America/Argentina/Buenos_Aires",
        "-180,1,s": "America/Montevideo",
        "-120,0": "Etc/GMT+2",
        "-120,1": "Etc/GMT+2",
        "-60,1": "Atlantic/Azores",
        "-60,0": "Atlantic/Cape_Verde",
        "0,0": "Etc/UTC",
        "0,1": "Europe/London",
        "60,1": "Europe/Berlin",
        "60,0": "Africa/Lagos",
        "60,1,s": "Africa/Windhoek",
        "120,1": "Asia/Beirut",
        "120,0": "Africa/Johannesburg",
        "180,0": "Asia/Baghdad",
        "180,1": "Europe/Moscow",
        "210,1": "Asia/Tehran",
        "240,0": "Asia/Dubai",
        "240,1": "Asia/Baku",
        "270,0": "Asia/Kabul",
        "300,1": "Asia/Yekaterinburg",
        "300,0": "Asia/Karachi",
        "330,0": "Asia/Kolkata",
        "345,0": "Asia/Kathmandu",
        "360,0": "Asia/Dhaka",
        "360,1": "Asia/Omsk",
        "390,0": "Asia/Rangoon",
        "420,1": "Asia/Krasnoyarsk",
        "420,0": "Asia/Jakarta",
        "480,0": "Asia/Shanghai",
        "480,1": "Asia/Irkutsk",
        "525,0": "Australia/Eucla",
        "525,1,s": "Australia/Eucla",
        "540,1": "Asia/Yakutsk",
        "540,0": "Asia/Tokyo",
        "570,0": "Australia/Darwin",
        "570,1,s": "Australia/Adelaide",
        "600,0": "Australia/Brisbane",
        "600,1": "Asia/Vladivostok",
        "600,1,s": "Australia/Sydney",
        "630,1,s": "Australia/Lord_Howe",
        "660,1": "Asia/Kamchatka",
        "660,0": "Pacific/Noumea",
        "690,0": "Pacific/Norfolk",
        "720,1,s": "Pacific/Auckland",
        "720,0": "Pacific/Tarawa",
        "765,1,s": "Pacific/Chatham",
        "780,0": "Pacific/Tongatapu",
        "780,1,s": "Pacific/Apia",
        "840,0": "Pacific/Kiritimati"
    },
    typeof exports != "undefined" ? exports.jstz = t : e.jstz = t
}
(this), function (e) {
    e.fn.limit = function (t, n) {
        return this.each(function () {
            var r = e(this),
            i = e(n),
            s = this.oninput === undefined ? "keyup mouseup" : "input";
            r.on(s, function (e) {
                var n = r.val(),
                s = t - n.length;
                s < 1 ? (r.val(n.substring(0, t)), i.addClass("limit-warning").text(0)) : i.removeClass("limit-warning").text(s)
            })
        })
    }
}
(jQuery), !function (e) {
    "use strict";
    function n() {
        var t = this,
        n = setTimeout(function () {
            t.$element.off(e.support.transition.end),
            r.call(t)
        }, 500);
        this.$element.one(e.support.transition.end, function () {
            clearTimeout(n),
            r.call(t)
        })
    }
    function r(e) {
        this.$element.hide().trigger("hidden"),
        i.call(this)
    }
    function i(t) {
        var n = this,
        r = this.$element.hasClass("fade") ? "fade" : "";
        if (this.isShown && this.options.backdrop) {
            var i = e.support.transition && r;
            this.$backdrop = e('<div class="modal-backdrop ' + r + '" />').appendTo(document.body),
            this.options.backdrop != "static" && this.$backdrop.click(e.proxy(this.hide, this)),
            i && this.$backdrop[0].offsetWidth,
            this.$backdrop.addClass("in"),
            i ? this.$backdrop.one(e.support.transition.end, t) : t()
        } else !this.isShown && this.$backdrop ? (this.$backdrop.removeClass("in"), e.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one(e.support.transition.end, e.proxy(s, this)) : s.call(this)) : t && t()
    }
    function s() {
        this.$backdrop.remove(),
        this.$backdrop = null
    }
    function o() {
        var t = this;
        this.isShown && this.options.keyboard ? e(document).on("keyup.dismiss.modal", function (e) {
            e.which == 27 && t.hide()
        }) : this.isShown || e(document).off("keyup.dismiss.modal")
    }
    var t = function (t, n) {
        this.options = n,
        this.$element = e(t).delegate('[data-dismiss="modal"]', "click.dismiss.modal", e.proxy(this.hide, this))
    };
    t.prototype = {
        constructor: t,
        toggle: function () {
            return this[this.isShown ? "hide" : "show"]()
        },
        show: function () {
            var t = this,
            n = e.Event("show");
            this.$element.trigger(n);
            if (this.isShown || n.isDefaultPrevented())
                return;
            e("body").addClass("modal-open"),
            this.isShown = !0,
            o.call(this),
            i.call(this, function () {
                var n = e.support.transition && t.$element.hasClass("fade");
                t.$element.parent().length || t.$element.appendTo(document.body),
                t.$element.show(),
                n && t.$element[0].offsetWidth,
                t.$element.addClass("in"),
                n ? t.$element.one(e.support.transition.end, function () {
                    t.$element.trigger("shown")
                }) : t.$element.trigger("shown")
            })
        },
        hide: function (t) {
            t && t.preventDefault();
            var i = this;
            t = e.Event("hide"),
            this.$element.trigger(t);
            if (!this.isShown || t.isDefaultPrevented())
                return;
            this.isShown = !1,
            e("body").removeClass("modal-open"),
            o.call(this),
            this.$element.removeClass("in"),
            e.support.transition && this.$element.hasClass("fade") ? n.call(this) : r.call(this)
        }
    },
    e.fn.modal = function (n) {
        return this.each(function () {
            var r = e(this),
            i = r.data("modal"),
            s = e.extend({}, e.fn.modal.defaults, r.data(), typeof n == "object" && n);
            i || r.data("modal", i = new t(this, s)),
            typeof n == "string" ? i[n]() : s.show && i.show()
        })
    },
    e.fn.modal.defaults = {
        backdrop: !0,
        keyboard: !0,
        show: !0
    },
    e.fn.modal.Constructor = t,
    e(function () {
        e("body").on("click.modal.data-api", '[data-toggle="modal"]', function (t) {
            var n = e(this),
            r,
            i = e(n.attr("data-target") || (r = n.attr("href")) && r.replace(/.*(?=#[^\s]+$)/, "")),
            s = i.data("modal") ? "toggle" : e.extend({}, i.data(), n.data());
            t.preventDefault(),
            i.modal(s)
        })
    })
}
(window.jQuery), !function (e) {
    e(function () {
        "use strict";
        e.support.transition = function () {
            var e = function () {
                var e = document.createElement("bootstrap"),
                t = {
                    WebkitTransition: "webkitTransitionEnd",
                    MozTransition: "transitionend",
                    OTransition: "oTransitionEnd otransitionend",
                    transition: "transitionend"
                },
                n;
                for (n in t)
                    if (e.style[n] !== undefined)
                        return t[n]
            }
            ();
            return e && {
                end: e
            }
        }
        ()
    })
}
(window.jQuery), !function (e) {
    "use strict";
    var t = function (t, n) {
        this.$element = e(t),
        this.options = e.extend({}, e.fn.collapse.defaults, n),
        this.options.parent && (this.$parent = e(this.options.parent)),
        this.options.toggle && this.toggle()
    };
    t.prototype = {
        constructor: t,
        dimension: function () {
            var e = this.$element.hasClass("width");
            return e ? "width" : "height"
        },
        show: function () {
            var t,
            n,
            r,
            i;
            if (this.transitioning)
                return;
            t = this.dimension(),
            n = e.camelCase(["scroll", t].join("-")),
            r = this.$parent && this.$parent.find("> .accordion-group > .in");
            if (r && r.length) {
                i = r.data("collapse");
                if (i && i.transitioning)
                    return;
                r.collapse("hide"),
                i || r.data("collapse", null)
            }
            this.$element[t](0),
            this.transition("addClass", e.Event("show"), "shown"),
            e.support.transition && this.$element[t](this.$element[0][n])
        },
        hide: function () {
            var t;
            if (this.transitioning)
                return;
            t = this.dimension(),
            this.reset(this.$element[t]()),
            this.transition("removeClass", e.Event("hide"), "hidden"),
            this.$element[t](0)
        },
        reset: function (e) {
            var t = this.dimension();
            return this.$element.removeClass("collapse")[t](e || "auto")[0].offsetWidth,
            this.$element[e !== null ? "addClass" : "removeClass"]("collapse"),
            this
        },
        transition: function (t, n, r) {
            var i = this,
            s = function () {
                n.type == "show" && i.reset(),
                i.transitioning = 0,
                i.$element.trigger(r)
            };
            this.$element.trigger(n);
            if (n.isDefaultPrevented())
                return;
            this.transitioning = 1,
            this.$element[t]("in"),
            e.support.transition && this.$element.hasClass("collapse") ? this.$element.one(e.support.transition.end, s) : s()
        },
        toggle: function () {
            this[this.$element.hasClass("in") ? "hide" : "show"]()
        }
    },
    e.fn.collapse = function (n) {
        return this.each(function () {
            var r = e(this),
            i = r.data("collapse"),
            s = typeof n == "object" && n;
            i || r.data("collapse", i = new t(this, s)),
            typeof n == "string" && i[n]()
        })
    },
    e.fn.collapse.defaults = {
        toggle: !0
    },
    e.fn.collapse.Constructor = t,
    e(function () {
        e("body").on("click.collapse.data-api", "[data-toggle=collapse]", function (t) {
            var n = e(this),
            r,
            i = n.attr("data-target") || t.preventDefault() || (r = n.attr("href")) && r.replace(/.*(?=#[^\s]+$)/, ""),
            s = e(i).data("collapse") ? "toggle" : n.data();
            n[e(i).hasClass("in") ? "addClass" : "removeClass"]("collapsed"),
            e(i).collapse(s)
        })
    })
}
(window.jQuery), !function (e) {
    "use strict";
    function r() {
        e(t).parent().removeClass("open")
    }
    var t = '[data-toggle="dropdown"]',
    n = function (t) {
        var n = e(t).on("click.dropdown.data-api", this.toggle);
        e("html").on("click.dropdown.data-api", function () {
            n.parent().removeClass("open")
        })
    };
    n.prototype = {
        constructor: n,
        toggle: function (t) {
            var n = e(this),
            i = n.attr("data-target"),
            s,
            o;
            return i || (i = n.attr("href"), i = i && i.replace(/.*(?=#[^\s]*$)/, "")),
            s = e(i),
            s.length || (s = n.parent()),
            o = s.hasClass("open"),
            r(),
            !o && s.toggleClass("open"),
            o || s.find("input:first").focus(),
            !1
        }
    },
    e.fn.dropdown = function (t) {
        return this.each(function () {
            var r = e(this),
            i = r.data("dropdown");
            i || r.data("dropdown", i = new n(this)),
            typeof t == "string" && i[t].call(r)
        })
    },
    e.fn.dropdown.Constructor = n,
    e(function () {
        e("html").on("click.dropdown.data-api", r),
        e("body").on("click.dropdown.data-api", t, n.prototype.toggle)
    })
}
(window.jQuery),
/*! jstz - v1.0.4 - 2012-12-18 */
function (e) {
    function r(t) {
        var n = t || window.event,
        r = [].slice.call(arguments, 1),
        i = 0,
        s = !0,
        o = 0,
        u = 0;
        return t = e.event.fix(n),
        t.type = "mousewheel",
        n.wheelDelta && (i = n.wheelDelta / 120),
        n.detail && (i = -n.detail / 3),
        u = i,
        n.axis !== undefined && n.axis === n.HORIZONTAL_AXIS && (u = 0, o = -1 * i),
        n.wheelDeltaY !== undefined && (u = n.wheelDeltaY / 120),
        n.wheelDeltaX !== undefined && (o = -1 * n.wheelDeltaX / 120),
        r.unshift(t, i, o, u),
        (e.event.dispatch || e.event.handle).apply(this, r)
    }
    var t = ["DOMMouseScroll", "mousewheel"];
    if (e.event.fixHooks)
        for (var n = t.length; n; )
            e.event.fixHooks[t[--n]] = e.event.mouseHooks;
    e.event.special.mousewheel = {
        setup: function () {
            if (this.addEventListener)
                for (var e = t.length; e; )
                    this.addEventListener(t[--e], r, !1);
            else
                this.onmousewheel = r
        },
        teardown: function () {
            if (this.removeEventListener)
                for (var e = t.length; e; )
                    this.removeEventListener(t[--e], r, !1);
            else
                this.onmousewheel = null
        }
    },
    e.fn.extend({
        mousewheel: function (e) {
            return e ? this.bind("mousewheel", e) : this.trigger("mousewheel")
        },
        unmousewheel: function (e) {
            return this.unbind("mousewheel", e)
        }
    })
}
(jQuery), function (e) {
    function t(t, n) {
        function y() {
            return r.update(),
            w(),
            r
        }
        function b() {
            var e = h.toLowerCase();
            f.obj.css(c, p / u.ratio),
            o.obj.css(c, -p),
            m.start = f.obj.offset()[c],
            u.obj.css(e, a[n.axis]),
            a.obj.css(e, a[n.axis]),
            f.obj.css(e, f[n.axis])
        }
        function w() {
            g ? s.obj[0].ontouchstart = function (e) {
                1 === e.touches.length && (E(e.touches[0]), e.stopPropagation())
            }
             : (f.obj.bind("mousedown", E), a.obj.bind("mouseup", x)),
            n.scroll && s.obj.mousewheel(S)
        }
        function E(t) {
            var n = parseInt(f.obj.css(c), 10);
            m.start = l ? t.pageX : t.pageY,
            v.start = n == "auto" ? 0 : n,
            g ? (document.ontouchmove = function (e) {
                e.preventDefault(),
                x(e.touches[0])
            }, document.ontouchend = T) : (e(document).bind("mousemove", x), e(document).bind("mouseup", T), f.obj.bind("mouseup", T))
        }
        function S(e, t, r, i) {
            if (n.axis === "x" && r === 0 || n.axis === "y" && i === 0)
                return;
            if (o.ratio < 1) {
                var a = e,
                l = t;
                d = p,
                p -= l * n.wheel,
                p = Math.min(o[n.axis] - s[n.axis], Math.max(0, p)),
                f.obj.css(c, p / u.ratio),
                o.obj.css(c, -p),
                n.lockscroll && d !== p && (a.preventDefault(), n.endCallback())
            }
        }
        function x(e) {
            o.ratio < 1 && (g ? v.now = Math.min(a[n.axis] - f[n.axis], Math.max(0, v.start + (m.start - (l ? e.pageX : e.pageY)))) : v.now = Math.min(a[n.axis] - f[n.axis], Math.max(0, v.start + ((l ? e.pageX : e.pageY) - m.start))), p = v.now * u.ratio, o.obj.css(c, -p), f.obj.css(c, v.now))
        }
        function T() {
            e(document).unbind("mousemove", x),
            e(document).unbind("mouseup", T),
            f.obj.unbind("mouseup", T),
            document.ontouchmove = document.ontouchend = null,
            n.endCallback()
        }
        var r = this,
        i = t,
        s = {
            obj: e(".viewport", t)
        },
        o = {
            obj: e(".scroll-content", t)
        },
        u = {
            obj: e(".scrollbar", t)
        },
        a = {
            obj: e(".track", u.obj)
        },
        f = {
            obj: e(".handle", u.obj)
        },
        l = n.axis === "x",
        c = l ? "left" : "top",
        h = l ? "Width" : "Height",
        p = 0,
        d,
        v = {
            start: 0,
            now: 0
        },
        m = {},
        g = "ontouchstart" in document.documentElement ? !0 : !1;
        return this.update = function (e) {
            s[n.axis] = s.obj[0]["offset" + h],
            o[n.axis] = o.obj[0]["scroll" + h],
            o.ratio = s[n.axis] / o[n.axis],
            u.obj.toggleClass("disable", o.ratio >= 1),
            a[n.axis] = n.size === "auto" ? s[n.axis] : n.size,
            f[n.axis] = Math.min(a[n.axis], Math.max(0, n.sizethumb === "auto" ? a[n.axis] * o.ratio : n.sizethumb)),
            u.ratio = n.sizethumb === "auto" ? o[n.axis] / a[n.axis] : (o[n.axis] - s[n.axis]) / (a[n.axis] - f[n.axis]),
            p = e === "relative" && o.ratio <= 1 ? Math.min(o[n.axis] - s[n.axis], Math.max(0, p)) : 0,
            p = e === "bottom" && o.ratio <= 1 ? o[n.axis] - s[n.axis] : isNaN(parseInt(e, 10)) ? p : parseInt(e, 10),
            b()
        },
        y()
    }
    e.tiny180 = e.tiny180 || {},
    e.tiny180.scrollbar = {
        options: {
            axis: "y",
            wheel: 40,
            scroll: !0,
            lockscroll: !0,
            size: "auto",
            sizethumb: "auto",
            endCallback: function () {}
        }
    },
    e.fn.tinyscrollbar180 = function (n) {
        var r = e.extend({}, e.tiny180.scrollbar.options, n);
        return this.each(function () {
            e(this).data("tsb", new t(e(this), r))
        }),
        this
    },
    e.fn.tinyscrollbar180_update = function (t) {
        return e(this).data("tsb").update(t)
    }
}
(jQuery), function (e) {
    function t(t, n) {
        function g() {
            return r.update(),
            b(),
            r
        }
        function y() {
            var e = h.toLowerCase();
            f.obj.css(c, p / u.ratio),
            o.obj.css(c, -p),
            v.start = f.obj.offset()[c],
            u.obj.css(e, a[n.axis]),
            a.obj.css(e, a[n.axis]),
            f.obj.css(e, f[n.axis])
        }
        function b() {
            m ? s.obj[0].ontouchstart = function (e) {
                1 === e.touches.length && (w(e.touches[0]), e.stopPropagation())
            }
             : (f.obj.bind("mousedown", w), a.obj.bind("mouseup", S)),
            n.scroll && window.addEventListener ? (i[0].addEventListener("DOMMouseScroll", E, !1), i[0].addEventListener("mousewheel", E, !1)) : n.scroll && (i[0].onmousewheel = E)
        }
        function w(t) {
            e("body").addClass("noSelect");
            var n = parseInt(f.obj.css(c), 10);
            v.start = l ? t.pageX : t.pageY,
            d.start = n == "auto" ? 0 : n,
            m ? (document.ontouchmove = function (e) {
                e.preventDefault(),
                S(e.touches[0])
            }, document.ontouchend = x) : (e(document).bind("mousemove", S), e(document).bind("mouseup", x), f.obj.bind("mouseup", x))
        }
        function E(t) {
            if (o.ratio < 1) {
                var r = t || window.event,
                i = r.wheelDelta ? r.wheelDelta / 120 : -r.detail / 3;
                p -= i * n.wheel,
                p = Math.min(o[n.axis] - s[n.axis], Math.max(0, p)),
                f.obj.css(c, p / u.ratio),
                o.obj.css(c, -p);
                if (n.lockscroll || p !== o[n.axis] - s[n.axis] && p !== 0)
                    r = e.event.fix(r), r.preventDefault()
            }
        }
        function S(e) {
            o.ratio < 1 && (n.invertscroll && m ? d.now = Math.min(a[n.axis] - f[n.axis], Math.max(0, d.start + (v.start - (l ? e.pageX : e.pageY)))) : d.now = Math.min(a[n.axis] - f[n.axis], Math.max(0, d.start + ((l ? e.pageX : e.pageY) - v.start))), p = d.now * u.ratio, o.obj.css(c, -p), f.obj.css(c, d.now))
        }
        function x() {
            e("body").removeClass("noSelect"),
            e(document).unbind("mousemove", S),
            e(document).unbind("mouseup", x),
            f.obj.unbind("mouseup", x),
            document.ontouchmove = document.ontouchend = null
        }
        var r = this,
        i = t,
        s = {
            obj: e(".viewport", t)
        },
        o = {
            obj: e(".overview", t)
        },
        u = {
            obj: e(".scrollbar", t)
        },
        a = {
            obj: e(".track", u.obj)
        },
        f = {
            obj: e(".thumb", u.obj)
        },
        l = n.axis === "x",
        c = l ? "left" : "top",
        h = l ? "Width" : "Height",
        p = 0,
        d = {
            start: 0,
            now: 0
        },
        v = {},
        m = "ontouchstart" in document.documentElement;
        return this.update = function (e) {
            s[n.axis] = s.obj[0]["offset" + h],
            o[n.axis] = o.obj[0]["scroll" + h],
            o.ratio = s[n.axis] / o[n.axis],
            u.obj.toggleClass("disable", o.ratio >= 1),
            a[n.axis] = n.size === "auto" ? s[n.axis] : n.size,
            f[n.axis] = Math.min(a[n.axis], Math.max(0, n.sizethumb === "auto" ? a[n.axis] * o.ratio : n.sizethumb)),
            u.ratio = n.sizethumb === "auto" ? o[n.axis] / a[n.axis] : (o[n.axis] - s[n.axis]) / (a[n.axis] - f[n.axis]),
            p = e === "relative" && o.ratio <= 1 ? Math.min(o[n.axis] - s[n.axis], Math.max(0, p)) : 0,
            p = e === "bottom" && o.ratio <= 1 ? o[n.axis] - s[n.axis] : isNaN(parseInt(e, 10)) ? p : parseInt(e, 10),
            y()
        },
        g()
    }
    e.tiny = e.tiny || {},
    e.tiny.scrollbar = {
        options: {
            axis: "y",
            wheel: 40,
            scroll: !0,
            lockscroll: !0,
            size: "auto",
            sizethumb: "auto",
            invertscroll: !1
        }
    },
    e.fn.tinyscrollbar = function (n) {
        var r = e.extend({}, e.tiny.scrollbar.options, n);
        return this.each(function () {
            e(this).data("tsb", new t(e(this), r))
        }),
        this
    },
    e.fn.tinyscrollbar_update = function (t) {
        return e(this).data("tsb").update(t)
    }
}
(jQuery), $.fn.verticalTinyScrollbar = function () {
    return this.each(function () {
        var e = $(this),
        t = e.children();
        if (t.length !== 1 || !$(t[0]).hasClass("viewport"))
            throw 'scrollbar container must contain only one child, and it must have class "viewport"';
        if ($.browser.webkit || e.find(".overview").height() < t.height())
            return t.css({
                overflow: "auto"
            });
        var n = $('<div class="scrollbar"><div class="track"><div class="thumb"><div class="end"></div></div></div></div>');
        e.prepend(n),
        e.tinyscrollbar()
    })
}, function (e) {
    e.fn.sliderCarousel = function (n) {
        if (t[n])
            return t[n].apply(this, Array.prototype.slice.call(arguments, 1));
        if (typeof n == "object" || !n)
            return t.init.apply(this, arguments);
        e.error("Method " + n + " does not exist on jQuery.sliderCarousel")
    };
    var t = {
        init: function (t) {
            var n = {
                vertical: {
                    len: "height",
                    pos: "top"
                },
                horizontal: {
                    len: "width",
                    pos: "left"
                }
            },
            r = {
                carouselEnabled: !0,
                sliderEnabled: !0,
                viewportClass: ".viewport",
                scrollContentClass: ".scroll-content",
                scrollBarHTML: '<div class="scrollbar"><div class="track"><div class="handle"><div class="end"></div></div></div></div>',
                leftArrowHTML: '<a class="slider-carousel-control left arrow-left off" href="#" >&#8249;</a>',
                rightArrowHTML: '<a class="slider-carousel-control right arrow-right on" href="#">&#8250;</a>',
                upArrowHTML: '<a class="slider-carousel-control up arrow-up off" href="#">&#x25B2;</a>',
                downArrowHTML: '<a class="slider-carousel-control down arrow-down on" href="#">&#x25BC;</a>',
                easing: "swing",
                duration: 800
            };
            return this.each(function () {
                var i = e.data(this);
                if (i.$el == undefined)
                    var s = this, o = e.extend({}, r, t), u = e(s), a = u.hasClass("vertical") ? "vertical" : "horizontal", f = u.find(o.scrollContentClass), l = u.find(o.viewportClass), c = l[n[a].len](), i = e.data(this, e.extend({
                                $el: u,
                                orientation: a,
                                $viewport: l,
                                $scrollContent: f,
                                lengthName: n[a].len,
                                posName: n[a].pos,
                                $lesserArrow: e(a == "vertical" ? o.upArrowHTML : o.leftArrowHTML),
                                $greaterArrow: e(a == "vertical" ? o.downArrowHTML : o.rightArrowHTML),
                                contentOffset: 0,
                                initialOffset: 0
                            }, o));
                i.$el.sliderCarousel("setScrollContentSize"),
                i.scrollingContentPxSize > i.viewportPxSize && (i.$el.addClass("sliderCarousel"), i.sliderEnabled && i.$el.sliderCarousel("initTinyScrollbar"), i.carouselEnabled && i.$el.sliderCarousel("initTinyCarousel"))
            })
        },
        setScrollContentSize: function () {
            return this.each(function () {
                var t = e.data(this);
                t.scrollingContentPxSize = 0,
                t.maxItemHeight = 0,
                t.maxItemWidth = 0;
                var n = t.$scrollContent.children(".item").each(function () {
                    var n = e(this),
                    r = n.outerHeight(!0),
                    i = n.outerWidth(!0);
                    t.orientation == "vertical" ? (t.maxItemWidth < i && (t.maxItemWidth = i), t.scrollingContentPxSize += r) : (t.maxItemHeight < r && (t.maxItemHeight = r), t.scrollingContentPxSize += i)
                });
                t.viewportPxSize = t.$viewport[t.lengthName](),
                t.scrollMax = t.scrollingContentPxSize - t.viewportPxSize,
                t.$scrollContent[t.lengthName](t.scrollingContentPxSize)
            })
        },
        updateArrows: function () {
            var t = this;
            return this.each(function () {
                var t = e.data(this),
                n = parseInt(t.$scrollContent.css(t.posName));
                t.$lesserArrow.addClass("off"),
                t.$greaterArrow.addClass("off"),
                n < t.initialOffset ? t.$lesserArrow.removeClass("off") : console.log("minimum reached"),
                n > -t.scrollMax ? t.$greaterArrow.removeClass("off") : (t.$el.trigger("carousel-end"), console.log("maximum reached"))
            })
        },
        doubleItems: function () {
            return this.each(function () {
                var t = e.data(this);
                t.$scrollContent.children(".item").each(function () {
                    t.$scrollContent.append(e(this).clone())
                })
            })
        },
        updateAll: function (t) {
            return this.each(function () {
                var t = e.data(this);
                t.$el.sliderCarousel("setScrollContentSize"),
                t.$el.tinyscrollbar180_update(Math.abs(parseInt(t.$scrollContent.css(t.posName)))),
                t.$el.sliderCarousel("updateArrows")
            })
        },
        initTinyScrollbar: function (t) {
            return this.each(function () {
                var t = e.data(this),
                n = {
                    endCallback: function () {
                        return t.$el.sliderCarousel("updateArrows")
                    }
                };
                t.$viewport.css("overflow", "hidden"),
                t.$scrollContent.css("overflow", "hidden"),
                t.$scrollBar = e(t.scrollBarHTML),
                t.$el.append(t.$scrollBar),
                t.orientation == "vertical" ? (t.$viewport.width(t.maxItemWidth), t.$el.width(t.maxItemWidth + t.$scrollBar.outerWidth())) : (n.axis = "x", t.$viewport.height(t.maxItemHeight), t.$el.height(t.maxItemHeight + t.$scrollBar.outerHeight())),
                t.scrollBarInitialized = !0,
                t.$el.tinyscrollbar180(n)
            })
        },
        initTinyCarousel: function (t) {
            return this.each(function () {
                var t = e.data(this);
                t.carouselInitialized || (t.carouselInitialized = !0, t.orientation == "vertical" ? t.$viewport.before(t.$lesserArrow).after(t.$greaterArrow) : t.$viewport.after(t.$lesserArrow, t.$greaterArrow), t.$lesserArrow.add(t.$greaterArrow).on("click", function (n) {
                        n.preventDefault(),
                        n.stopPropagation();
                        var r = e(this);
                        r.removeClass("on").addClass("off");
                        if (r.hasClass("right") || r.hasClass("down")) {
                            var i = parseInt(t.$scrollContent.css(t.posName)) - t.viewportPxSize;
                            t.contentOffset = i < -t.scrollMax ? -t.scrollMax : i
                        } else {
                            var i =
                                parseInt(t.$scrollContent.css(t.posName)) + t.viewportPxSize;
                            t.contentOffset = i > t.initialOffset ? t.initialOffset : i
                        }
                        var s = {},
                        o = {
                            duration: t.duration,
                            easing: t.easing,
                            complete: function () {
                                t.$el.sliderCarousel("updateArrows")
                            },
                            step: function (e, n) {
                                t.$el.tinyscrollbar180_update(Math.abs(parseInt(t.$scrollContent.css(t.posName))))
                            }
                        };
                        s[t.posName] = t.contentOffset,
                        t.$scrollContent.animate(s, o)
                    }))
            })
        }
    }
}
(jQuery), function (e, t) {
    e.fn.confetti = function (t) {
        function o(t, r, i, s, o, u) {
            for (var a = 0; a < i; a++) {
                var f = e('<div class="' + o + a + '"></div>');
                e(n).append(f),
                f.data({
                    x: t,
                    y: r,
                    left: Math.random() * s * 2 - s,
                    top: Math.random() * s * 2 - s,
                    bgColor: u()
                }).css({
                    left: t + "px",
                    top: r + "px"
                })
            }
        }
        function u(t, n, r, i, s) {
            e("[class*=" + i + "]").each(function (i, o) {
                e(this).css({
                    background: e(this).data("bgColor")
                }),
                a(e(this), e(this).data("left"), e(this).data("top"), t, n, r, s)
            })
        }
        function a(t, o, u, a, f, l, h) {
            var p = setInterval(function () {
                var l = t.position().left,
                d = t.position().top;
                o *= a,
                u = u * a + f,
                t.css({
                    left: l + o + "px",
                    top: d + u + "px"
                });
                if (e(n).height() < d + u || window.innerWidth + t.data("x") < l + o || 0 > l + o)
                    i++, t.remove(), clearTimeout(p);
                i === r.num && h && !s && (h(), s = !0)
            }, l)
        }
        var n = this,
        r = e.extend({
            x: n.offset().left + n.width() / 2,
            y: n.offset().top + n.height() / 2,
            className: "confetti",
            num: 20,
            speedRange: 10,
            airResistanceNum: .95,
            gravityNum: .45,
            intervalSpeed: 30,
            complate: !1,
            colorFn: function () {
                return "#" + Math.floor(Math.random() * 16777215).toString(16)
            }
        }, t),
        i = 0,
        s = !1;
        o(r.x, r.y, r.num, r.speedRange, r.className, r.colorFn),
        u(r.airResistanceNum, r.gravityNum, r.intervalSpeed, r.className, r.complate)
    }
}
(jQuery, this), function (e) {
    var t = function (t, n) {
        this.options = n,
        this.$element = e(t).on("clear", e.proxy(this.dismiss, this)),
        this.$countValue = e(t).find(".notificationsCount"),
        this.count = 0,
        this.messagePollTimer = 12e4,
        this.load(),
        setTimeout(this.pollForMessages.bind(this), this.messagePollTimer)
    };
    t.prototype = {
        constructor: t,
        load: function () {
            scratch.notifications.loadUnRead(e.proxy(this.onLoad, this))
        },
        pollForMessages: function () {
            this.load(),
            this.messagePollTimer < 192e4 && (this.messagePollTimer *= 2, setTimeout(this.pollForMessages.bind(this), this.messagePollTimer))
        },
        onLoad: function (e, t) {
            e.msg_count && e.msg_count != this.count ? (this.$countValue.offset({
                    top: "-30"
                }), this.$countValue.text(e.msg_count), this.$countValue.animate({
                    top: "4"
                }, 200), this.count = e.msg_count) : e.msg_count || this.dismiss()
        },
        dismiss: function () {
            this.$countValue.stop(),
            this.$countValue.offset({
                top: "-30"
            })
        }
    },
    e.fn.notificationsAlert = function (n) {
        return this.each(function () {
            var r = e(this),
            i = r.data("notifications"),
            s = e.extend({}, e.fn.notificationsAlert.defaults, r.data(), typeof n == "object" && n);
            i || r.data("notifications", i = new t(this, s))
        })
    },
    e.fn.notificationsAlert.defaults = {
        notificationsing: !1,
        type: "user"
    },
    e.fn.notificationsAlert.Constructor = t
}
(window.jQuery);
var scratch = scratch || {}
scratch.users = scratch.users || {}
scratch.projects = scratch.projects || {}
scratch.comments = scratch.comments || {}
scratch.notifications = scratch.notifications || {}


scratch.users.URLS = {
    'edit': Scratch.ROOT_URL + '/users/ajax/edit/user/',

    'add_favorite': Scratch.ROOT_URL + '/users/ajax/<id>/add_to/favorites/',
    'add_following': Scratch.ROOT_URL + '/users/ajax/<id>/add_to/following/',

    'list_followers': Scratch.ROOT_URL + '/users/ajax/<username>/followers/',
    'list_following': Scratch.ROOT_URL + '/users/ajax/<username>/following/',
    'list_curators': Scratch.ROOT_URL + '/users/ajax/<galleryId>/curators/',
}

scratch.projects.URLS = {
    'edit': Scratch.ROOT_URL + '/projects/ajax/edit/<id>/',
    'create': Scratch.ROOT_URL + '/projects/ajax/create/',

    'add_love': Scratch.ROOT_URL + '/projects/ajax/add_to/<id>/loves/',
    'action': Scratch.ROOT_URL + '/projects/ajax/action/',

    'list_projects': Scratch.ROOT_URL + '/projects/ajax/<id>/all/',
    'list_shared': Scratch.ROOT_URL + '/projects/ajax/<id>/public/',
    'list_favorites': Scratch.ROOT_URL + '/projects/ajax/<id>/favorites/',
    'list_loves': Scratch.ROOT_URL + '/projects/ajax/<id>/loves/',

    'list_notshared': Scratch.ROOT_URL + '/projects/ajax/<id>/private/',
    'list_trashed': Scratch.ROOT_URL + '/projects/ajax/<id>/trashed/',

    'list_remixes': Scratch.ROOT_URL + '/projects/ajax/<id>/remixes/',
    'list_in_gallery': Scratch.ROOT_URL + '/projects/ajax/in-gallery/<id>/',

    'list_recent': Scratch.ROOT_URL + '/projects/ajax/recent/',
}

scratch.comments.URLS = {
    'create_project_comment': Scratch.ROOT_URL + '/comments/ajax/project/<parentId>/create/',
    'create_user_comment': Scratch.ROOT_URL + '/comments/ajax/user/<parentId>/create/',

    'delete_project_comment': Scratch.ROOT_URL + '/comments/ajax/project/delete/',
    'flag_project_comment': Scratch.ROOT_URL + '/comments/ajax/project/flag/',

    'list_project': Scratch.ROOT_URL + '/comments/ajax/project/<id>/',
    'list_user': Scratch.ROOT_URL + '/comments/ajax/user/<id>/',
}
scratch.notifications.URLS = {
    'list': Scratch.ROOT_URL + '/messages/ajax/messages-list/',
    'unread': Scratch.ROOT_URL + '/messages/ajax/get-message-count/',
    'clear': Scratch.ROOT_URL + '/messages/ajax/messages-clear/',
    'delete': Scratch.ROOT_URL + '/messages/ajax/messages-delete/',

    'activity': Scratch.ROOT_URL + '/messages/ajax/user-activity/',
    'friends-activity': Scratch.ROOT_URL + '/messages/ajax/friends-activity/',
}

// USER SERVER CALLS

scratch.users.loadUsers = function (username, filter, template, order) {
};

scratch.users.loadCurators = function ($el, galleryId, template, order, callback) {
    var loadurl = scratch.users.URLS.list_curators.replace(/<galleryId>/, galleryId);
    $el.load(url, callback);
};

scratch.users.favorite = function (data, id, favorite, callback) {
    var loadUrl = scratch.users.URLS['add_favorite'].replace(/<id>/, id),
    data = {
        remove: !favorite,
        favorites: data,
    };
    $.ajax({
        type: "POST",
        data: JSON.stringify(data),
        url: loadUrl,
        success: callback
    });
};

scratch.users.follow = function (data, id, follow, callback) {
    var loadUrl = scratch.users.URLS['add_following'].replace(/<id>/, id),
    data = {
        remove: !follow,
        friends: data,
    };
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        url: loadUrl,
        success: callback
    })
};

scratch.users.editProfile = function (data, callback) {
    var loadUrl = scratch.users.URLS['edit'];
    $.ajax({
        type: 'POST',
        url: loadUrl,
        data: JSON.stringify(data),
        success: callback
    })
};

// PROJECT SERVER CALLS
scratch.projects.loadProjects = function ($el, data, callback) {
    var url = scratch.projects.URLS["list_" + data.filter].replace(/<id>/, data.id) + "?ordering=" + data.order + "&feature=" + data.feature + "&page=" + data.page;
    $el.load(url, callback)
};

scratch.projects.loadRemixes = function (e, t, n) {
};

scratch.projects.loadGalleryProjects = function ($el, galleryId, feature, order, callback) {
    var url = scratch.projects.URLS['list_in_gallery'].replace(/<galleryId>/, galleryId) + "?ordering=" + order + "&feature=" + feature;
    $el.load(url, callback)
};

scratch.projects.loadRecentProjects = function ($el, order, items, feature, callback) {
    var url = scratch.projects.URLS['list_recent'] + "?ordering=" + order + "&items=" + items + "&feature=" + feature;
    $el.load(url, callback)
};

scratch.projects.love = function (data, love, callback) {
    var loadUrl = scratch.projects.URLS['add_love'].replace(/<id>/, data.id);
    var data = {
        'remove': !love
    };
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        url: loadUrl,
    })
};

scratch.projects.editProject = function (id, data, callback) {
    var loadUrl = scratch.projects.URLS['edit'].replace(/<id>/, id);
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        url: loadUrl,
        success: callback,
    })
};

scratch.projects.createProject = function (data, callback) {
    var loadUrl = scratch.projects.URLS['create'];
    $.ajax
    ({
        type: 'POST',
        data: JSON.stringify(data),
        url: loadUrl,
        success: callback,
    })
};

scratch.projects.updateProjectStatus = function (projectIds, action, callback) {
    var loadUrl = scratch.projects.URLS['action'];
    var data = {
        'project_list': projectIds,
        'action': action,
    }
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        url: loadUrl,
        success: callback,
    })
};

// COMMENT SERVER CALLS
scratch.comments.createComment = function (type, parentId, content, replyTo, threadId, callback) {
    var loadUrl = scratch.comments.URLS["create_" + type + "_comment"].replace(/<parentId>/, parentId);
    var data = {
        'content': content,
        'commentee': replyTo,
        'parent': threadId,
    };
    return $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        url: loadUrl
    })
};

scratch.comments.deleteComment = function (commentId, callback) {
    var loadUrl = scratch.comments.URLS['delete_project_comment'].replace(/<commentId>/, commentId);
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        url: loadUrl,
        success: callback,
    })
};

scratch.comments.loadComments = function ($el, type, typeId, page, callback) {
    var loadUrl = scratch.comments.URLS["list_" + type].replace(/<id>/, typeId) + "?page=" + page;
    $el.load(loadUrl, callback);
};

// NOTIFICATIONS

scratch.notifications.load = function (page, callback) {
    var loadUrl = scratch.notifications.URLS['list'];
    $.ajax({
        url: loadUrl,
        cache: false, // ensure that comments stay deleted after refreshing page in IE
        dataType: 'json',
        success: callback
    });
};

scratch.notifications.loadUnRead = function (callback) {
    $.ajax({
        dataType: 'json',
        url: scratch.notifications.URLS['unread'],
        success: callback,
        error:function(){
            console.log("unread messages not loaded");
        }
    });
};

scratch.notifications.clearUnRead = function (callback) {
    var url = scratch.notifications.URLS['clear'];
    $.ajax({
        type: 'POST',
        url: url,
        success: callback,
    });
};

scratch.notifications.remove = function (data, callback) {
    var url = scratch.notifications.URLS["delete"];
    $.ajax({
        data: JSON.stringify(data),
        type: 'POST',
        url: url,
        success: callback,
    });
};

scratch.notifications.loadActivity = function ($el, data, callback) {
    var loadUrl = "";
    if (data.friends) {
		loadUrl = scratch.notifications.URLS["friends-activity"] + "?max=" + data.max;
	} else {
		loadUrl = scratch.notifications.URLS['activity'] + "?user=" + data.actor + "&max=" + data.max;
	}
    $el.load(loadUrl, callback)
};

!function (e) {
    "use strict";
    var t = function (t) {
        this.element = e(t)
    };
    t.prototype = {
        constructor: t,
        show: function () {
            var t = this.element,
            n = t.closest("ul:not(.dropdown-menu)"),
            r = t.attr("data-target"),
            i,
            s;
            r || (r = t.attr("href"), r = r && r.replace(/.*(?=#[^\s]*$)/, ""));
            if (t.parent("li").hasClass("active"))
                return;
            i = n.find(".active a").last()[0],
            t.trigger({
                type: "show",
                relatedTarget: i
            }),
            s = e(r),
            this.activate(t.parent("li"), n),
            this.activate(s, s.parent(), function () {
                t.trigger({
                    type: "shown",
                    relatedTarget: i
                })
            })
        },
        activate: function (t, n, r) {
            function o() {
                i.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),
                t.addClass("active"),
                s ? (t[0].offsetWidth, t.addClass("in")) : t.removeClass("fade"),
                t.parent(".dropdown-menu") && t.closest("li.dropdown").addClass("active"),
                r && r()
            }
            var i = n.find("> .active"),
            s = r && e.support.transition && i.hasClass("fade");
            s ? i.one(e.support.transition.end, o) : o(),
            i.removeClass("in")
        }
    },
    e.fn.tab = function (n) {
        return this.each(function () {
            var r = e(this),
            i = r.data("tab");
            i || r.data("tab", i = new t(this)),
            typeof n == "string" && i[n]()
        })
    },
    e.fn.tab.Constructor = t,
    e(function () {
        e("body").on("click.tab.data-api", '[data-toggle="tab"], [data-toggle="pill"]', function (t) {
            t.preventDefault(),
            e(this).tab("show")
        })
    })
}
(window.jQuery), function (e) {
    typeof define == "function" && define.amd ? define(["jquery"], e) : e(jQuery)
}
(function (e) {
    function r() {
        var n = i(this),
        r = t.settings;
        return isNaN(n.datetime) || (r.cutoff == 0 || Math.abs(o(n.datetime)) < r.cutoff) && e(this).text(s(n.datetime)),
        this
    }
    function i(n) {
        n = e(n);
        if (!n.data("timeago")) {
            n.data("timeago", {
                datetime: t.datetime(n)
            });
            var r = e.trim(n.text());
            t.settings.localeTitle ? n.attr("title", n.data("timeago").datetime.toLocaleString()) : r.length > 0 && (!t.isTime(n) || !n.attr("title")) && n.attr("title", r)
        }
        return n.data("timeago")
    }
    function s(e) {
        return t.inWords(o(e))
    }
    function o(e) {
        return (new Date).getTime() - e.getTime()
    }
    e.timeago = function (t) {
        return t instanceof Date ? s(t) : typeof t == "string" ? s(e.timeago.parse(t)) : typeof t == "number" ? s(new Date(t)) : s(e.timeago.datetime(t))
    };
    var t = e.timeago;
    e.extend(e.timeago, {
        settings: {
            refreshMillis: 6e4,
            allowPast: !0,
            allowFuture: !1,
            localeTitle: !1,
            cutoff: 0,
            strings: {
                prefixAgo: null,
                prefixFromNow: null,
                suffixAgo: "ago",
                suffixFromNow: "from now",
                inPast: "any moment now",
                seconds: "less than a minute",
                minute: "about a minute",
                minutes: "%d minutes",
                hour: "about an hour",
                hours: "about %d hours",
                day: "a day",
                days: "%d days",
                month: "about a month",
                months: "%d months",
                year: "about a year",
                years: "%d years",
                wordSeparator: " ",
                numbers: []
            }
        },
        inWords: function (t) {
            function l(r, i) {
                var s = e.isFunction(r) ? r(i, t) : r,
                o = n.numbers && n.numbers[i] || i;
                return s.replace(/%d/i, o)
            }
            if (!this.settings.allowPast && !this.settings.allowFuture)
                throw "timeago allowPast and allowFuture settings can not both be set to false.";
            var n = this.settings.strings,
            r = n.prefixAgo,
            i = n.suffixAgo;
            this.settings.allowFuture && t < 0 && (r = n.prefixFromNow, i = n.suffixFromNow);
            if (!this.settings.allowPast && t >= 0)
                return this.settings.strings.inPast;
            var s = Math.abs(t) / 1e3,
            o = s / 60,
            u = o / 60,
            a = u / 24,
            f = a / 365,
            c = s < 45 && l(n.seconds, Math.round(s)) || s < 90 && l(n.minute, 1) || o < 45 && l(n.minutes, Math.round(o)) || o < 90 && l(n.hour, 1) || u < 24 && l(n.hours, Math.round(u)) || u < 42 && l(n.day, 1) || a < 30 && l(n.days, Math.round(a)) || a < 45 && l(n.month, 1) || a < 365 && l(n.months, Math.round(a / 30)) || f < 1.5 && l(n.year, 1) || l(n.years, Math.round(f)),
            h = n.wordSeparator || "";
            return n.wordSeparator === undefined && (h = " "),
            e.trim([r, c, i].join(h))
        },
        parse: function (t) {
            var n = e.trim(t);
            return n = n.replace(/\.\d+/, ""),
            n = n.replace(/-/, "/").replace(/-/, "/"),
            n = n.replace(/T/, " ").replace(/Z/, " UTC"),
            n = n.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"),
            n = n.replace(/([\+\-]\d\d)$/, " $100"),
            new Date(n)
        },
        datetime: function (n) {
            var r = t.isTime(n) ? e(n).attr("datetime") : e(n).attr("title");
            return t.parse(r)
        },
        isTime: function (t) {
            return e(t).get(0).tagName.toLowerCase() === "time"
        }
    });
    var n = {
        init: function () {
            var n = e.proxy(r, this);
            n();
            var i = t.settings;
            i.refreshMillis > 0 && (this._timeagoInterval = setInterval(n, i.refreshMillis))
        },
        update: function (n) {
            var i = t.parse(n);
            e(this).data("timeago", {
                datetime: i
            }),
            t.settings.localeTitle && e(this).attr("title", i.toLocaleString()),
            r.apply(this)
        },
        updateFromDOM: function () {
            e(this).data("timeago", {
                datetime: t.parse(t.isTime(this) ? e(this).attr("datetime") : e(this).attr("title"))
            }),
            r.apply(this)
        },
        dispose: function () {
            this._timeagoInterval && (window.clearInterval(this._timeagoInterval), this._timeagoInterval = null)
        }
    };
    e.fn.timeago = function (e, t) {
        var r = e ? n[e] : n.init;
        if (!r)
            throw new Error("Unknown function name '" + e + "' for timeago");
        return this.each(function () {
            r.call(this, t)
        }),
        this
    },
    document.createElement("abbr"),
    document.createElement("time")
}), $(function () {
    $.extend($.ui.dialog.prototype.options, {
        resizable: !1,
        modal: !0,
        dialogClass: "jqui-modal",
        closeText: "x",
        create: function (e, t) {
            $(this).parent().append('<iframe class="iframeshim" frameborder="0" scrolling="no"></iframe>')
        }
    })
}),
/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 *
 * Requires: 1.2.2+
 */
!function (e, t) {
    typeof module != "undefined" && module.exports ? module.exports.browser = t() : typeof define == "function" && define.amd ? define(t) : this[e] = t()
}
("bowser", function () {
    function e(e) {
        function n(t) {
            var n = e.match(t);
            return n && n.length > 1 && n[1] || ""
        }
        var r = n(/(ipod|iphone|ipad)/i).toLowerCase(),
        i = /like android/i.test(e),
        s = !i && /android/i.test(e),
        o = n(/version\/(\d+(\.\d+)?)/i),
        u = /tablet/i.test(e),
        a = !u && /[^-]mobi/i.test(e),
        f;
        /opera|opr/i.test(e) ? f = {
            name: "Opera",
            opera: t,
            version: o || n(/(?:opera|opr)[\s\/](\d+(\.\d+)?)/i)
        }
         : /windows phone/i.test(e) ? f = {
            name: "Windows Phone",
            windowsphone: t,
            msie: t,
            version: n(/iemobile\/(\d+(\.\d+)?)/i)
        }
         : /msie|trident/i.test(e) ? f = {
            name: "Internet Explorer",
            msie: t,
            version: n(/(?:msie |rv:)(\d+(\.\d+)?)/i)
        }
         : /chrome|crios|crmo/i.test(e) ? f = {
            name: "Chrome",
            chrome: t,
            version: n(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
        }
         : r ? (f = {
                name: r == "iphone" ? "iPhone" : r == "ipad" ? "iPad" : "iPod"
            }, o && (f.version = o)) : /sailfish/i.test(e) ? f = {
            name: "Sailfish",
            sailfish: t,
            version: n(/sailfish\s?browser\/(\d+(\.\d+)?)/i)
        }
         : /seamonkey\//i.test(e) ? f = {
            name: "SeaMonkey",
            seamonkey: t,
            version: n(/seamonkey\/(\d+(\.\d+)?)/i)
        }
         : /firefox|iceweasel/i.test(e) ? (f = {
                name: "Firefox",
                firefox: t,
                version: n(/(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i)
            }, /\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(e) && (f.firefoxos = t)) : /silk/i.test(e) ? f = {
            name: "Amazon Silk",
            silk: t,
            version: n(/silk\/(\d+(\.\d+)?)/i)
        }
         : s ? f = {
            name: "Android",
            version: o
        }
         : /phantom/i.test(e) ? f = {
            name: "PhantomJS",
            phantom: t,
            version: n(/phantomjs\/(\d+(\.\d+)?)/i)
        }
         : /blackberry|\bbb\d+/i.test(e) || /rim\stablet/i.test(e) ? f = {
            name: "BlackBerry",
            blackberry: t,
            version: o || n(/blackberry[\d]+\/(\d+(\.\d+)?)/i)
        }
         : /(web|hpw)os/i.test(e) ? (f = {
                name: "WebOS",
                webos: t,
                version: o || n(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)
            }, /touchpad\//i.test(e) && (f.touchpad = t)) : /bada/i.test(e) ? f = {
            name: "Bada",
            bada: t,
            version: n(/dolfin\/(\d+(\.\d+)?)/i)
        }
         : /tizen/i.test(e) ? f = {
            name: "Tizen",
            tizen: t,
            version: n(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || o
        }
         : /safari/i.test(e) ? f = {
            name: "Safari",
            safari: t,
            version: o
        }
         : f = {},
        /(apple)?webkit/i.test(e) ? (f.name = f.name || "Webkit", f.webkit = t, !f.version && o && (f.version = o)) : !f.opera && /gecko\//i.test(e) && (f.name = f.name || "Gecko", f.gecko = t, f.version = f.version || n(/gecko\/(\d+(\.\d+)?)/i)),
        s || f.silk ? f.android = t : r && (f[r] = t, f.ios = t);
        var l = "";
        r ? (l = n(/os (\d+([_\s]\d+)*) like mac os x/i), l = l.replace(/[_\s]/g, ".")) : s ? l = n(/android[ \/-](\d+(\.\d+)*)/i) : f.windowsphone ? l = n(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i) : f.webos ? l = n(/(?:web|hpw)os\/(\d+(\.\d+)*)/i) : f.blackberry ? l = n(/rim\stablet\sos\s(\d+(\.\d+)*)/i) : f.bada ? l = n(/bada\/(\d+(\.\d+)*)/i) : f.tizen && (l = n(/tizen[\/\s](\d+(\.\d+)*)/i)),
        l && (f.osversion = l);
        var c = l.split(".")[0];
        if (u || r == "ipad" || s && (c == 3 || c == 4 && !a) || f.silk)
            f.tablet = t;
        else if (a || r == "iphone" || r == "ipod" || s || f.blackberry || f.webos || f.bada)
            f.mobile = t;
        return f.msie && f.version >= 10 || f.chrome && f.version >= 20 || f.firefox && f.version >= 20 || f.safari && f.version >= 6 || f.opera && f.version >= 10 || f.ios && f.osversion && f.osversion.split(".")[0] >= 6 || f.blackberry && f.version >= 10.1 ? f.a = t : f.msie && f.version < 10 || f.chrome && f.version < 20 || f.firefox && f.version < 20 || f.safari && f.version < 6 || f.opera && f.version < 10 || f.ios && f.osversion && f.osversion.split(".")[0] < 6 ? f.c = t : f.x = t,
        f
    }
    var t = !0,
    n = e(typeof navigator != "undefined" ? navigator.userAgent : "");
    return n._detect = e,
    n
}), typeof jQuery != "undefined" && (jQuery.fn.formatRelativeTime = function (e, t) {
    return formatRelativeTime(e, t)
});
