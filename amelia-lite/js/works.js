function replaceAll(t, e, n) {
    return t.replace(new RegExp(e, "g"), n)
}

function retrieveWindowVariables(t) {
    var e = "",
        n = "if (typeof " + t + " !== 'undefined') localStorage.setItem('" + t + "', JSON.stringify(" + t + ")) \n",
        i = document.createElement("script");
    return i.id = "tmpScript", i.appendChild(document.createTextNode(n)), (document.body || document.head || document.documentElement).appendChild(i), e = JSON.parse(localStorage.getItem(t)), localStorage.removeItem(t), e
}

function save_tag() {
    if (owner_data = 0, likes_data = 0, comments_data = 0, 0 == $("#owner").is(":checked") && 0 == $("#likes").is(":checked") && 0 == $("#comments").is(":checked")) return void alert("Please select at least one");
    $("#owner").is(":checked") && (owner_data = 1), $("#likes").is(":checked") && (likes_data = 1), $("#comments").is(":checked") && (comments_data = 1), message = {
        option: "add_tag_job",
        button: $("#tag_button").attr("id"),
        tag: $("#tag_button").attr("data-tag"),
        action: $("#tag_button").attr("data-action"),
        owner: owner_data,
        likes: likes_data,
        comments: comments_data,
        user: user
    }, chrome.runtime.sendMessage(message), $("#tag_modal").modal("hide")
}

function save_location() {
    if (owner_data = 0, likes_data = 0, comments_data = 0, 0 == $("#owner_l").is(":checked") && 0 == $("#likes_l").is(":checked") && 0 == $("#comments_l").is(":checked")) return void alert("Please select at least one");
    $("#owner_l").is(":checked") && (owner_data = 1), $("#likes_l").is(":checked") && (likes_data = 1), $("#comments_l").is(":checked") && (comments_data = 1), page_info = retrieveWindowVariables(["window._sharedData"]), message = {
        option: "add_location_job",
        button: $("#location_button").attr("id"),
        location_id: $("#location_button").attr("data-location"),
        location_name: page_info.entry_data.LocationsPage[0].graphql.location.name,
        action: $("#location_button").attr("data-action"),
        owner: owner_data,
        likes: likes_data,
        comments: comments_data,
        user: user
    }, chrome.runtime.sendMessage(message), $("#location_modal").modal("hide")
}

function save_commenters() {
    if (likes_data = 0, comments_data = 0, 0 == $("#likes_c").is(":checked") && 0 == $("#comments_c").is(":checked")) return void alert("Please select at least one");
    $("#likes_c").is(":checked") && (likes_data = 1), $("#comments_c").is(":checked") && (comments_data = 1), page_info = retrieveWindowVariables(["window._sharedData"]), message = {
        option: "add_user_job",
        button: $("#commenters_btn").attr("id"),
        qi_exact: $("#commenters_btn").attr("data-user"),
        action: $("#commenters_btn").attr("data-action"),
        user: user,
        likes: likes_data,
        comments: comments_data
    }, chrome.runtime.sendMessage(message), $("#commenters_modal").modal("hide")
}

function save_followers_type() {
    $("#followers_all").is(":checked") ? followers_tipi = "ilk" : followers_tipi = "son", page_info = retrieveWindowVariables(["window._sharedData"]), message = {
        option: "add_user_job",
        button: $("#followers_btn").attr("id"),
        qi_exact: $("#followers_btn").attr("data-user"),
        action: $("#followers_btn").attr("data-action"),
        user: user,
        followers_tipi: followers_tipi
    }, chrome.runtime.sendMessage(message), $("#followers_modal").modal("hide")
}

function qi_status_check(t) {
    if ("add" == t.attr("data-action")) return void $("#tag_modal").modal();
    message = {
        option: "add_tag_job",
        button: t.attr("id"),
        tag: t.attr("data-tag"),
        action: t.attr("data-action"),
        user: user
    }, chrome.runtime.sendMessage(message)
}

function qi_status_check2(t) {
    if ("add" == t.attr("data-action")) return void $("#location_modal").modal();
    message = {
        option: "add_location_job",
        button: t.attr("id"),
        location: t.attr("data-location"),
        action: t.attr("data-action"),
        user: user
    }, chrome.runtime.sendMessage(message)
}

function qi_status_check3(t) {
    if ("add" == t.attr("data-action")) return void $("#commenters_modal").modal();
    message = {
        option: "add_user_job",
        button: t.attr("id"),
        qi_exact: t.attr("data-user"),
        action: t.attr("data-action"),
        user: user
    }, chrome.runtime.sendMessage(message)
}

function qi_status_check4(t) {
    if ("add" == t.attr("data-action")) return $("#followers_modal").modal(), !1;
    message = {
        option: "add_user_job",
        button: t.attr("id"),
        qi_exact: t.attr("data-user"),
        action: t.attr("data-action"),
        user: user
    }, chrome.runtime.sendMessage(message)
}

function check_location_page() {
    if (document.URL.indexOf("/explore/locations/") == -1) return void $("#location_button").hide("slow");
    if (page_info = retrieveWindowVariables(["window._sharedData"]), !page_info.entry_data.hasOwnProperty("LocationsPage")) return void(window.location = window.location);
    arr1 = document.URL.split("/explore/locations/"), arr2 = arr1[1].split("/");
    var t = arr2[0];
    if (page_info.entry_data.LocationsPage[0].graphql.location.id != t) return void(window.location = window.location);
    $("#location_button").attr("data-location") != t ? chrome.runtime.sendMessage({
        option: "get_location_button",
        user: user,
        location: t
    }) : 0 == $("#location_button").is(":visible") && $("#location_button").show("slow")
}

function check_tag_page() {
    if (document.URL.indexOf("/explore/tags/") == -1) return $("#tag_button").hide("slow"), void $("#likes_button").hide("slow");
    if (page_info = retrieveWindowVariables(["window._sharedData"]), !page_info.entry_data.hasOwnProperty("TagPage")) return void(window.location = window.location);
    arr1 = document.URL.split("/explore/tags/"), arr2 = arr1[1].split("/");
    var t = arr2[0],
        e = decodeURIComponent(t);
    if (page_info.entry_data.TagPage[0].graphql.hashtag.name != e) return void(window.location = window.location);
    $("#tag_button").attr("data-tag") != t ? chrome.runtime.sendMessage({
        option: "get_tag_button",
        user: user,
        tag: t
    }) : 0 == $("#tag_button").is(":visible") && $("#tag_button").show("slow"), $("#likes_button").attr("data-tag") != t ? chrome.runtime.sendMessage({
        option: "get_likes_button",
        user: user,
        tag: t
    }) : 0 == $("#likes_button").is(":visible") && $("#likes_button").show("slow")
}

/*function check_profil_page() {
    return profil = $('a[href$="/followers/"]'), 0 == profil.length ? void $("#user_buttons").hide("slow") : (page_info = retrieveWindowVariables(["window._sharedData"]), page_info.entry_data.hasOwnProperty("ProfilePage") ? (qi_exact_screen_name = profil.attr("href").split("/")[1], page_info.entry_data.ProfilePage[0].graphql.user.username != qi_exact_screen_name ? void(window.location = window.location) : (qi_exact = '{"screen_name":"' + qi_exact_screen_name + '","user_id":"' + page_info.entry_data.ProfilePage[0].graphql.user.id + '"}', void($("#commenters_btn").attr("data-user") != qi_exact ? chrome.runtime.sendMessage({
        option: "get_user_buttons",
        user: user,
        qi_exact: qi_exact
    }) : 0 == $("#user_buttons").is(":visible") && $("#user_buttons").show("slow")))) : void(window.location = window.location))
}*/

function check_profil_page() {
    //console.log(page_info);
    return profil = $('a[href$="/followers/"]'), 0 == profil.length ? void $("#user_buttons").hide("slow") : (page_info = retrieveWindowVariables(["window._sharedData"]), page_info.entry_data.hasOwnProperty("ProfilePage") ? (qi_exact_screen_name = profil.attr("href").split("/")[1], 
    /*
    page_info.entry_data.ProfilePage[0].graphql.user.id.length ? (qi_exact = '{"screen_name":"' + qi_exact_screen_name + '","user_id":"' + page_info.config.viewer.id + '"}', */
    
    //page_info.entry_data.ProfilePage[0].graphql.user.length ? void(
      page_info.entry_data.ProfilePage[0].graphql.user.username != qi_exact_screen_name ? void(window.location = window.location) : (qi_exact = '{"screen_name":"' + qi_exact_screen_name + '","user_id":"' + page_info.entry_data.ProfilePage[0].graphql.user.id + '"}',
      
      void($("#commenters_btn").attr("data-user") != qi_exact ? chrome.runtime.sendMessage({
          option: "get_user_buttons",
          user: user,
          qi_exact: qi_exact
      }) : 0 == $("#user_buttons").is(":visible") && $("#user_buttons").show("slow"))) 
      /*:void( console.log('asd1'))*/ 
    //) : void(
      //console.log("")
    //)
    
    
    ) : void( console.log('asd2') ))
}

/*
function do_jobs() {
    page_info = retrieveWindowVariables(["window._sharedData"]), null != page_info.config.viewer && (user = page_info.config, check_profil_page(), check_tag_page(), check_location_page())
}*/

function do_jobs(){
    page_info=retrieveWindowVariables(["window._sharedData"]);
    null==page_info.config.viewer||(user=page_info.config,check_profil_page(),check_tag_page(),check_location_page())
}

function extract(t, e, n) {
    let i = t.indexOf(e);
    if (i === -1) return null;
    i += e.length;
    let o = t.indexOf(n, i);
    return o === -1 ? null : t.substring(i, o)
}

function extractData(t) {
    try {
        let e = '<script type="text/javascript">window._sharedData =';
        return JSON.parse(extract(t, e, ";</script>"))
    } catch (t) {
        return null
    }
}
function get_from_medias(t, e, n) {
    var i = {
        option: "add_to_white_list"
    };
    if (0 != t.length) {
        var o = t[0].node || t[0],
            r = o.code || o.shortcode;
        $.ajax({
            url: "https://www.instagram.com/p/" + r + "/?__a=1",
            method: "GET"
        }).done(function(o) {
            1 == n.comments && o.graphql.shortcode_media.edge_media_to_parent_comment.edges.forEach(function(t) {
                i.add_user = t.node.owner, i.user = user, chrome.runtime.sendMessage(i)
            }), 1 == n.likes && o.graphql.shortcode_media.edge_media_preview_like.edges.forEach(function(t) {
                i.add_user = t.node, i.user = user, chrome.runtime.sendMessage(i)
            }), t.shift(), get_from_medias(t, e, n)
        })
    }
}

function look_up_user(t, e) {
    if (0 == Object.keys(t).length) return !1;
    id = Object.keys(t)[0], username = t[id], delete t[id], $.ajax({
        url: "https://www.instagram.com/" + username + "/",
        method: "GET"
    }).done(function(e) {
        e = extractData(e);
        var n = {};
        n.user_follow = e.entry_data.ProfilePage[0].graphql.user, n.user = user, n.option = "follow_filter", chrome.runtime.sendMessage(n), look_up_user(t)
    }).fail(function(n, i, o) {
        var r = {};
        r.option = "queryError", chrome.runtime.sendMessage(r), setTimeout(function() {
            look_up_user(t)
        }, e)
    })

}

function qi_unfollow_check(t, e, n) {
    if (0 == t.length) return e.veri = n, void chrome.runtime.sendMessage(e);
    $.ajax({
        url: "https://www.instagram.com/" + t[0].node.username + "/",
        method: "GET"
    }).done(function(i) {
        i = extractData(i), n.push(i.entry_data.ProfilePage[0].graphql.user), t.shift(), qi_unfollow_check(t, e, n)
    }).fail(function(i, o, r) {
        t.shift(), qi_unfollow_check(t, e, n)
    })
}
if (function(t, e) {
        "object" == typeof module && "object" == typeof module.exports ? module.exports = t.document ? e(t, !0) : function(t) {
            if (!t.document) throw new Error("jQuery requires a window with a document");
            return e(t)
        } : e(t)
    }("undefined" != typeof window ? window : this, function(t, e) {
        function n(t) {
            var e = !!t && "length" in t && t.length,
                n = ft.type(t);
            return "function" !== n && !ft.isWindow(t) && ("array" === n || 0 === e || "number" == typeof e && e > 0 && e - 1 in t)
        }

        function i(t, e, n) {
            if (ft.isFunction(e)) return ft.grep(t, function(t, i) {
                return !!e.call(t, i, t) !== n
            });
            if (e.nodeType) return ft.grep(t, function(t) {
                return t === e !== n
            });
            if ("string" == typeof e) {
                if (bt.test(e)) return ft.filter(e, t, n);
                e = ft.filter(e, t)
            }
            return ft.grep(t, function(t) {
                return ft.inArray(t, e) > -1 !== n
            })
        }

        function o(t, e) {
            do t = t[e]; while (t && 1 !== t.nodeType) return t
        }

        function r(t) {
            var e = {};
            return ft.each(t.match(Tt) || [], function(t, n) {
                e[n] = !0
            }), e
        }

        function s() {
            it.addEventListener ? (it.removeEventListener("DOMContentLoaded", a), t.removeEventListener("load", a)) : (it.detachEvent("onreadystatechange", a), t.detachEvent("onload", a))
        }

        function a() {
            (it.addEventListener || "load" === t.event.type || "complete" === it.readyState) && (s(), ft.ready())
        }

        function l(t, e, n) {
            if (void 0 === n && 1 === t.nodeType) {
                var i = "data-" + e.replace(Nt, "-$1").toLowerCase();
                if ("string" == typeof(n = t.getAttribute(i))) {
                    try {
                        n = "true" === n || "false" !== n && ("null" === n ? null : +n + "" === n ? +n : St.test(n) ? ft.parseJSON(n) : n)
                    } catch (t) {}
                    ft.data(t, e, n)
                } else n = void 0
            }
            return n
        }

        function c(t) {
            var e;
            for (e in t)
                if (("data" !== e || !ft.isEmptyObject(t[e])) && "toJSON" !== e) return !1;
            return !0
        }

        function u(t, e, n, i) {
            if (Et(t)) {
                var o, r, s = ft.expando,
                    a = t.nodeType,
                    l = a ? ft.cache : t,
                    c = a ? t[s] : t[s] && s;
                if (c && l[c] && (i || l[c].data) || void 0 !== n || "string" != typeof e) return c || (c = a ? t[s] = nt.pop() || ft.guid++ : s), l[c] || (l[c] = a ? {} : {
                    toJSON: ft.noop
                }), "object" != typeof e && "function" != typeof e || (i ? l[c] = ft.extend(l[c], e) : l[c].data = ft.extend(l[c].data, e)), r = l[c], i || (r.data || (r.data = {}), r = r.data), void 0 !== n && (r[ft.camelCase(e)] = n), "string" == typeof e ? null == (o = r[e]) && (o = r[ft.camelCase(e)]) : o = r, o
            }
        }

        function d(t, e, n) {
            if (Et(t)) {
                var i, o, r = t.nodeType,
                    s = r ? ft.cache : t,
                    a = r ? t[ft.expando] : ft.expando;
                if (s[a]) {
                    if (e && (i = n ? s[a] : s[a].data)) {
                        ft.isArray(e) ? e = e.concat(ft.map(e, ft.camelCase)) : e in i ? e = [e] : (e = ft.camelCase(e), e = e in i ? [e] : e.split(" ")), o = e.length;
                        for (; o--;) delete i[e[o]];
                        if (n ? !c(i) : !ft.isEmptyObject(i)) return
                    }(n || (delete s[a].data, c(s[a]))) && (r ? ft.cleanData([t], !0) : dt.deleteExpando || s != s.window ? delete s[a] : s[a] = void 0)
                }
            }
        }

        function f(t, e, n, i) {
            var o, r = 1,
                s = 20,
                a = i ? function() {
                    return i.cur()
                } : function() {
                    return ft.css(t, e, "")
                },
                l = a(),
                c = n && n[3] || (ft.cssNumber[e] ? "" : "px"),
                u = (ft.cssNumber[e] || "px" !== c && +l) && jt.exec(ft.css(t, e));
            if (u && u[3] !== c) {
                c = c || u[3], n = n || [], u = +l || 1;
                do r = r || ".5", u /= r, ft.style(t, e, u + c); while (r !== (r = a() / l) && 1 !== r && --s)
            }
            return n && (u = +u || +l || 0, o = n[1] ? u + (n[1] + 1) * n[2] : +n[2], i && (i.unit = c, i.start = u, i.end = o)), o
        }

        function p(t) {
            var e = Ht.split("|"),
                n = t.createDocumentFragment();
            if (n.createElement)
                for (; e.length;) n.createElement(e.pop());
            return n
        }

        function h(t, e) {
            var n, i, o = 0,
                r = void 0 !== t.getElementsByTagName ? t.getElementsByTagName(e || "*") : void 0 !== t.querySelectorAll ? t.querySelectorAll(e || "*") : void 0;
            if (!r)
                for (r = [], n = t.childNodes || t; null != (i = n[o]); o++) !e || ft.nodeName(i, e) ? r.push(i) : ft.merge(r, h(i, e));
            return void 0 === e || e && ft.nodeName(t, e) ? ft.merge([t], r) : r
        }

        function m(t, e) {
            for (var n, i = 0; null != (n = t[i]); i++) ft._data(n, "globalEval", !e || ft._data(e[i], "globalEval"))
        }

        function g(t) {
            qt.test(t.type) && (t.defaultChecked = t.checked)
        }

        function v(t, e, n, i, o) {
            for (var r, s, a, l, c, u, d, f = t.length, v = p(e), y = [], b = 0; b < f; b++)
                if ((s = t[b]) || 0 === s)
                    if ("object" === ft.type(s)) ft.merge(y, s.nodeType ? [s] : s);
                    else if (Ft.test(s)) {
                for (l = l || v.appendChild(e.createElement("div")), c = (It.exec(s) || ["", ""])[1].toLowerCase(), d = Pt[c] || Pt._default, l.innerHTML = d[1] + ft.htmlPrefilter(s) + d[2], r = d[0]; r--;) l = l.lastChild;
                if (!dt.leadingWhitespace && Rt.test(s) && y.push(e.createTextNode(Rt.exec(s)[0])), !dt.tbody)
                    for (s = "table" !== c || Wt.test(s) ? "<table>" !== d[1] || Wt.test(s) ? 0 : l : l.firstChild, r = s && s.childNodes.length; r--;) ft.nodeName(u = s.childNodes[r], "tbody") && !u.childNodes.length && s.removeChild(u);
                for (ft.merge(y, l.childNodes), l.textContent = ""; l.firstChild;) l.removeChild(l.firstChild);
                l = v.lastChild
            } else y.push(e.createTextNode(s));
            for (l && v.removeChild(l), dt.appendChecked || ft.grep(h(y, "input"), g), b = 0; s = y[b++];)
                if (i && ft.inArray(s, i) > -1) o && o.push(s);
                else if (a = ft.contains(s.ownerDocument, s), l = h(v.appendChild(s), "script"), a && m(l), n)
                for (r = 0; s = l[r++];) Mt.test(s.type || "") && n.push(s);
            return l = null, v
        }

        function y() {
            return !0
        }

        function b() {
            return !1
        }

        function w() {
            try {
                return it.activeElement
            } catch (t) {}
        }

        function x(t, e, n, i, o, r) {
            var s, a;
            if ("object" == typeof e) {
                "string" != typeof n && (i = i || n, n = void 0);
                for (a in e) x(t, a, n, i, e[a], r);
                return t
            }
            if (null == i && null == o ? (o = n, i = n = void 0) : null == o && ("string" == typeof n ? (o = i, i = void 0) : (o = i, i = n, n = void 0)), o === !1) o = b;
            else if (!o) return t;
            return 1 === r && (s = o, o = function(t) {
                return ft().off(t), s.apply(this, arguments)
            }, o.guid = s.guid || (s.guid = ft.guid++)), t.each(function() {
                ft.event.add(this, e, o, i, n)
            })
        }

        function _(t, e) {
            return ft.nodeName(t, "table") && ft.nodeName(11 !== e.nodeType ? e : e.firstChild, "tr") ? t.getElementsByTagName("tbody")[0] || t.appendChild(t.ownerDocument.createElement("tbody")) : t
        }

        function k(t) {
            return t.type = (null !== ft.find.attr(t, "type")) + "/" + t.type, t
        }

        function T(t) {
            var e = Yt.exec(t.type);
            return e ? t.type = e[1] : t.removeAttribute("type"), t
        }

        function $(t, e) {
            if (1 === e.nodeType && ft.hasData(t)) {
                var n, i, o, r = ft._data(t),
                    s = ft._data(e, r),
                    a = r.events;
                if (a) {
                    delete s.handle, s.events = {};
                    for (n in a)
                        for (i = 0, o = a[n].length; i < o; i++) ft.event.add(e, n, a[n][i])
                }
                s.data && (s.data = ft.extend({}, s.data))
            }
        }

        function C(t, e) {
            var n, i, o;
            if (1 === e.nodeType) {
                if (n = e.nodeName.toLowerCase(), !dt.noCloneEvent && e[ft.expando]) {
                    o = ft._data(e);
                    for (i in o.events) ft.removeEvent(e, i, o.handle);
                    e.removeAttribute(ft.expando)
                }
                "script" === n && e.text !== t.text ? (k(e).text = t.text, T(e)) : "object" === n ? (e.parentNode && (e.outerHTML = t.outerHTML), dt.html5Clone && t.innerHTML && !ft.trim(e.innerHTML) && (e.innerHTML = t.innerHTML)) : "input" === n && qt.test(t.type) ? (e.defaultChecked = e.checked = t.checked, e.value !== t.value && (e.value = t.value)) : "option" === n ? e.defaultSelected = e.selected = t.defaultSelected : "input" !== n && "textarea" !== n || (e.defaultValue = t.defaultValue)
            }
        }

        function E(t, e, n, i) {
            e = rt.apply([], e);
            var o, r, s, a, l, c, u = 0,
                d = t.length,
                f = d - 1,
                p = e[0],
                m = ft.isFunction(p);
            if (m || d > 1 && "string" == typeof p && !dt.checkClone && Jt.test(p)) return t.each(function(o) {
                var r = t.eq(o);
                m && (e[0] = p.call(this, o, r.html())), E(r, e, n, i)
            });
            if (d && (c = v(e, t[0].ownerDocument, !1, t, i), o = c.firstChild, 1 === c.childNodes.length && (c = o), o || i)) {
                for (a = ft.map(h(c, "script"), k), s = a.length; u < d; u++) r = c, u !== f && (r = ft.clone(r, !0, !0), s && ft.merge(a, h(r, "script"))), n.call(t[u], r, u);
                if (s)
                    for (l = a[a.length - 1].ownerDocument, ft.map(a, T), u = 0; u < s; u++) r = a[u], Mt.test(r.type || "") && !ft._data(r, "globalEval") && ft.contains(l, r) && (r.src ? ft._evalUrl && ft._evalUrl(r.src) : ft.globalEval((r.text || r.textContent || r.innerHTML || "").replace(Kt, "")));
                c = o = null
            }
            return t
        }

        function S(t, e, n) {
            for (var i, o = e ? ft.filter(e, t) : t, r = 0; null != (i = o[r]); r++) n || 1 !== i.nodeType || ft.cleanData(h(i)), i.parentNode && (n && ft.contains(i.ownerDocument, i) && m(h(i, "script")), i.parentNode.removeChild(i));
            return t
        }

        function N(t, e) {
            var n = ft(e.createElement(t)).appendTo(e.body),
                i = ft.css(n[0], "display");
            return n.detach(), i
        }

        function D(t) {
            var e = it,
                n = ne[t];
            return n || (n = N(t, e), "none" !== n && n || (ee = (ee || ft("<iframe frameborder='0' width='0' height='0'/>")).appendTo(e.documentElement), e = (ee[0].contentWindow || ee[0].contentDocument).document, e.write(), e.close(), n = N(t, e), ee.detach()), ne[t] = n), n
        }

        function j(t, e) {
            return {
                get: function() {
                    return t() ? void delete this.get : (this.get = e).apply(this, arguments)
                }
            }
        }

        function A(t) {
            if (t in ve) return t;
            for (var e = t.charAt(0).toUpperCase() + t.slice(1), n = ge.length; n--;)
                if ((t = ge[n] + e) in ve) return t
        }

        function L(t, e) {
            for (var n, i, o, r = [], s = 0, a = t.length; s < a; s++) i = t[s], i.style && (r[s] = ft._data(i, "olddisplay"), n = i.style.display, e ? (r[s] || "none" !== n || (i.style.display = ""), "" === i.style.display && Lt(i) && (r[s] = ft._data(i, "olddisplay", D(i.nodeName)))) : (o = Lt(i), (n && "none" !== n || !o) && ft._data(i, "olddisplay", o ? n : ft.css(i, "display"))));
            for (s = 0; s < a; s++) i = t[s], i.style && (e && "none" !== i.style.display && "" !== i.style.display || (i.style.display = e ? r[s] || "" : "none"));
            return t
        }

        function O(t, e, n) {
            var i = pe.exec(e);
            return i ? Math.max(0, i[1] - (n || 0)) + (i[2] || "px") : e
        }

        function q(t, e, n, i, o) {
            for (var r = n === (i ? "border" : "content") ? 4 : "width" === e ? 1 : 0, s = 0; r < 4; r += 2) "margin" === n && (s += ft.css(t, n + At[r], !0, o)), i ? ("content" === n && (s -= ft.css(t, "padding" + At[r], !0, o)), "margin" !== n && (s -= ft.css(t, "border" + At[r] + "Width", !0, o))) : (s += ft.css(t, "padding" + At[r], !0, o), "padding" !== n && (s += ft.css(t, "border" + At[r] + "Width", !0, o)));
            return s
        }

        function I(e, n, i) {
            var o = !0,
                r = "width" === n ? e.offsetWidth : e.offsetHeight,
                s = ae(e),
                a = dt.boxSizing && "border-box" === ft.css(e, "boxSizing", !1, s);
            if (it.msFullscreenElement && t.top !== t && e.getClientRects().length && (r = Math.round(100 * e.getBoundingClientRect()[n])), r <= 0 || null == r) {
                if (r = le(e, n, s), (r < 0 || null == r) && (r = e.style[n]), oe.test(r)) return r;
                o = a && (dt.boxSizingReliable() || r === e.style[n]), r = parseFloat(r) || 0
            }
            return r + q(e, n, i || (a ? "border" : "content"), o, s) + "px"
        }

        function M(t, e, n, i, o) {
            return new M.prototype.init(t, e, n, i, o)
        }

        function R() {
            return t.setTimeout(function() {
                ye = void 0
            }), ye = ft.now()
        }

        function H(t, e) {
            var n, i = {
                    height: t
                },
                o = 0;
            for (e = e ? 1 : 0; o < 4; o += 2 - e) n = At[o], i["margin" + n] = i["padding" + n] = t;
            return e && (i.opacity = i.width = t), i
        }

        function P(t, e, n) {
            for (var i, o = (B.tweeners[e] || []).concat(B.tweeners["*"]), r = 0, s = o.length; r < s; r++)
                if (i = o[r].call(n, e, t)) return i
        }

        function F(t, e, n) {
            var i, o, r, s, a, l, c, u = this,
                d = {},
                f = t.style,
                p = t.nodeType && Lt(t),
                h = ft._data(t, "fxshow");
            n.queue || (a = ft._queueHooks(t, "fx"), null == a.unqueued && (a.unqueued = 0, l = a.empty.fire, a.empty.fire = function() {
                a.unqueued || l()
            }), a.unqueued++, u.always(function() {
                u.always(function() {
                    a.unqueued--, ft.queue(t, "fx").length || a.empty.fire()
                })
            })), 1 === t.nodeType && ("height" in e || "width" in e) && (n.overflow = [f.overflow, f.overflowX, f.overflowY], c = ft.css(t, "display"), "inline" === ("none" === c ? ft._data(t, "olddisplay") || D(t.nodeName) : c) && "none" === ft.css(t, "float") && (dt.inlineBlockNeedsLayout && "inline" !== D(t.nodeName) ? f.zoom = 1 : f.display = "inline-block")), n.overflow && (f.overflow = "hidden", dt.shrinkWrapBlocks() || u.always(function() {
                f.overflow = n.overflow[0], f.overflowX = n.overflow[1], f.overflowY = n.overflow[2]
            }));
            for (i in e)
                if (o = e[i], we.exec(o)) {
                    if (delete e[i], r = r || "toggle" === o, o === (p ? "hide" : "show")) {
                        if ("show" !== o || !h || void 0 === h[i]) continue;
                        p = !0
                    }
                    d[i] = h && h[i] || ft.style(t, i)
                } else c = void 0;
            if (ft.isEmptyObject(d)) "inline" === ("none" === c ? D(t.nodeName) : c) && (f.display = c);
            else {
                h ? "hidden" in h && (p = h.hidden) : h = ft._data(t, "fxshow", {}), r && (h.hidden = !p), p ? ft(t).show() : u.done(function() {
                    ft(t).hide()
                }), u.done(function() {
                    var e;
                    ft._removeData(t, "fxshow");
                    for (e in d) ft.style(t, e, d[e])
                });
                for (i in d) s = P(p ? h[i] : 0, i, u), i in h || (h[i] = s.start, p && (s.end = s.start, s.start = "width" === i || "height" === i ? 1 : 0))
            }
        }

        function W(t, e) {
            var n, i, o, r, s;
            for (n in t)
                if (i = ft.camelCase(n), o = e[i], r = t[n], ft.isArray(r) && (o = r[1], r = t[n] = r[0]), n !== i && (t[i] = r, delete t[n]), (s = ft.cssHooks[i]) && "expand" in s) {
                    r = s.expand(r), delete t[i];
                    for (n in r) n in t || (t[n] = r[n], e[n] = o)
                } else e[i] = o
        }

        function B(t, e, n) {
            var i, o, r = 0,
                s = B.prefilters.length,
                a = ft.Deferred().always(function() {
                    delete l.elem
                }),
                l = function() {
                    if (o) return !1;
                    for (var e = ye || R(), n = Math.max(0, c.startTime + c.duration - e), i = n / c.duration || 0, r = 1 - i, s = 0, l = c.tweens.length; s < l; s++) c.tweens[s].run(r);
                    return a.notifyWith(t, [c, r, n]), r < 1 && l ? n : (a.resolveWith(t, [c]), !1)
                },
                c = a.promise({
                    elem: t,
                    props: ft.extend({}, e),
                    opts: ft.extend(!0, {
                        specialEasing: {},
                        easing: ft.easing._default
                    }, n),
                    originalProperties: e,
                    originalOptions: n,
                    startTime: ye || R(),
                    duration: n.duration,
                    tweens: [],
                    createTween: function(e, n) {
                        var i = ft.Tween(t, c.opts, e, n, c.opts.specialEasing[e] || c.opts.easing);
                        return c.tweens.push(i), i
                    },
                    stop: function(e) {
                        var n = 0,
                            i = e ? c.tweens.length : 0;
                        if (o) return this;
                        for (o = !0; n < i; n++) c.tweens[n].run(1);
                        return e ? (a.notifyWith(t, [c, 1, 0]), a.resolveWith(t, [c, e])) : a.rejectWith(t, [c, e]), this
                    }
                }),
                u = c.props;
            for (W(u, c.opts.specialEasing); r < s; r++)
                if (i = B.prefilters[r].call(c, t, u, c.opts)) return ft.isFunction(i.stop) && (ft._queueHooks(c.elem, c.opts.queue).stop = ft.proxy(i.stop, i)), i;
            return ft.map(u, P, c), ft.isFunction(c.opts.start) && c.opts.start.call(t, c), ft.fx.timer(ft.extend(l, {
                elem: t,
                anim: c,
                queue: c.opts.queue
            })), c.progress(c.opts.progress).done(c.opts.done, c.opts.complete).fail(c.opts.fail).always(c.opts.always)
        }

        function U(t) {
            return ft.attr(t, "class") || ""
        }

        function z(t) {
            return function(e, n) {
                "string" != typeof e && (n = e, e = "*");
                var i, o = 0,
                    r = e.toLowerCase().match(Tt) || [];
                if (ft.isFunction(n))
                    for (; i = r[o++];) "+" === i.charAt(0) ? (i = i.slice(1) || "*", (t[i] = t[i] || []).unshift(n)) : (t[i] = t[i] || []).push(n)
            }
        }

        function V(t, e, n, i) {
            function o(a) {
                var l;
                return r[a] = !0, ft.each(t[a] || [], function(t, a) {
                    var c = a(e, n, i);
                    return "string" != typeof c || s || r[c] ? s ? !(l = c) : void 0 : (e.dataTypes.unshift(c), o(c), !1)
                }), l
            }
            var r = {},
                s = t === He;
            return o(e.dataTypes[0]) || !r["*"] && o("*")
        }

        function X(t, e) {
            var n, i, o = ft.ajaxSettings.flatOptions || {};
            for (i in e) void 0 !== e[i] && ((o[i] ? t : n || (n = {}))[i] = e[i]);
            return n && ft.extend(!0, t, n), t
        }

        function Q(t, e, n) {
            for (var i, o, r, s, a = t.contents, l = t.dataTypes;
                "*" === l[0];) l.shift(), void 0 === o && (o = t.mimeType || e.getResponseHeader("Content-Type"));
            if (o)
                for (s in a)
                    if (a[s] && a[s].test(o)) {
                        l.unshift(s);
                        break
                    }
            if (l[0] in n) r = l[0];
            else {
                for (s in n) {
                    if (!l[0] || t.converters[s + " " + l[0]]) {
                        r = s;
                        break
                    }
                    i || (i = s)
                }
                r = r || i
            }
            if (r) return r !== l[0] && l.unshift(r), n[r]
        }

        function G(t, e, n, i) {
            var o, r, s, a, l, c = {},
                u = t.dataTypes.slice();
            if (u[1])
                for (s in t.converters) c[s.toLowerCase()] = t.converters[s];
            for (r = u.shift(); r;)
                if (t.responseFields[r] && (n[t.responseFields[r]] = e), !l && i && t.dataFilter && (e = t.dataFilter(e, t.dataType)), l = r, r = u.shift())
                    if ("*" === r) r = l;
                    else if ("*" !== l && l !== r) {
                if (!(s = c[l + " " + r] || c["* " + r]))
                    for (o in c)
                        if (a = o.split(" "), a[1] === r && (s = c[l + " " + a[0]] || c["* " + a[0]])) {
                            s === !0 ? s = c[o] : c[o] !== !0 && (r = a[0], u.unshift(a[1]));
                            break
                        }
                if (s !== !0)
                    if (s && t.throws) e = s(e);
                    else try {
                        e = s(e)
                    } catch (t) {
                        return {
                            state: "parsererror",
                            error: s ? t : "No conversion from " + l + " to " + r
                        }
                    }
            }
            return {
                state: "success",
                data: e
            }
        }

        function J(t) {
            return t.style && t.style.display || ft.css(t, "display")
        }

        function Y(t) {
            for (; t && 1 === t.nodeType;) {
                if ("none" === J(t) || "hidden" === t.type) return !0;
                t = t.parentNode
            }
            return !1
        }

        function K(t, e, n, i) {
            var o;
            if (ft.isArray(e)) ft.each(e, function(e, o) {
                n || Be.test(t) ? i(t, o) : K(t + "[" + ("object" == typeof o && null != o ? e : "") + "]", o, n, i)
            });
            else if (n || "object" !== ft.type(e)) i(t, e);
            else
                for (o in e) K(t + "[" + o + "]", e[o], n, i)
        }

        function Z() {
            try {
                return new t.XMLHttpRequest
            } catch (t) {}
        }

        function tt() {
            try {
                return new t.ActiveXObject("Microsoft.XMLHTTP")
            } catch (t) {}
        }

        function et(t) {
            return ft.isWindow(t) ? t : 9 === t.nodeType && (t.defaultView || t.parentWindow)
        }
        var nt = [],
            it = t.document,
            ot = nt.slice,
            rt = nt.concat,
            st = nt.push,
            at = nt.indexOf,
            lt = {},
            ct = lt.toString,
            ut = lt.hasOwnProperty,
            dt = {},
            ft = function(t, e) {
                return new ft.fn.init(t, e)
            },
            pt = function(t, e) {
                return e.toUpperCase()
            };
        ft.fn = ft.prototype = {
            jquery: "1.12.2",
            constructor: ft,
            selector: "",
            length: 0,
            toArray: function() {
                return ot.call(this)
            },
            get: function(t) {
                return null != t ? t < 0 ? this[t + this.length] : this[t] : ot.call(this)
            },
            pushStack: function(t) {
                var e = ft.merge(this.constructor(), t);
                return e.prevObject = this, e.context = this.context, e
            },
            each: function(t) {
                return ft.each(this, t)
            },
            map: function(t) {
                return this.pushStack(ft.map(this, function(e, n) {
                    return t.call(e, n, e)
                }))
            },
            slice: function() {
                return this.pushStack(ot.apply(this, arguments))
            },
            first: function() {
                return this.eq(0)
            },
            last: function() {
                return this.eq(-1)
            },
            eq: function(t) {
                var e = this.length,
                    n = +t + (t < 0 ? e : 0);
                return this.pushStack(n >= 0 && n < e ? [this[n]] : [])
            },
            end: function() {
                return this.prevObject || this.constructor()
            },
            push: st,
            sort: nt.sort,
            splice: nt.splice
        }, ft.extend = ft.fn.extend = function() {
            var t, e, n, i, o, r, s = arguments[0] || {},
                a = 1,
                l = arguments.length,
                c = !1;
            for ("boolean" == typeof s && (c = s, s = arguments[a] || {}, a++), "object" == typeof s || ft.isFunction(s) || (s = {}), a === l && (s = this, a--); a < l; a++)
                if (null != (o = arguments[a]))
                    for (i in o) t = s[i], n = o[i], s !== n && (c && n && (ft.isPlainObject(n) || (e = ft.isArray(n))) ? (e ? (e = !1, r = t && ft.isArray(t) ? t : []) : r = t && ft.isPlainObject(t) ? t : {}, s[i] = ft.extend(c, r, n)) : void 0 !== n && (s[i] = n));
            return s
        }, ft.extend({
            expando: "jQuery" + ("1.12.2" + Math.random()).replace(/\D/g, ""),
            isReady: !0,
            error: function(t) {
                throw new Error(t)
            },
            noop: function() {},
            isFunction: function(t) {
                return "function" === ft.type(t)
            },
            isArray: Array.isArray || function(t) {
                return "array" === ft.type(t)
            },
            isWindow: function(t) {
                return null != t && t == t.window
            },
            isNumeric: function(t) {
                var e = t && t.toString();
                return !ft.isArray(t) && e - parseFloat(e) + 1 >= 0
            },
            isEmptyObject: function(t) {
                var e;
                for (e in t) return !1;
                return !0
            },
            isPlainObject: function(t) {
                var e;
                if (!t || "object" !== ft.type(t) || t.nodeType || ft.isWindow(t)) return !1;
                try {
                    if (t.constructor && !ut.call(t, "constructor") && !ut.call(t.constructor.prototype, "isPrototypeOf")) return !1
                } catch (t) {
                    return !1
                }
                if (!dt.ownFirst)
                    for (e in t) return ut.call(t, e);
                for (e in t);
                return void 0 === e || ut.call(t, e)
            },
            type: function(t) {
                return null == t ? t + "" : "object" == typeof t || "function" == typeof t ? lt[ct.call(t)] || "object" : typeof t
            },
            globalEval: function(e) {
                e && ft.trim(e) && (t.execScript || function(e) {
                    t.eval.call(t, e)
                })(e)
            },
            camelCase: function(t) {
                return t.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, pt)
            },
            nodeName: function(t, e) {
                return t.nodeName && t.nodeName.toLowerCase() === e.toLowerCase()
            },
            each: function(t, e) {
                var i, o = 0;
                if (n(t))
                    for (i = t.length; o < i && e.call(t[o], o, t[o]) !== !1; o++);
                else
                    for (o in t)
                        if (e.call(t[o], o, t[o]) === !1) break; return t
            },
            trim: function(t) {
                return null == t ? "" : (t + "").replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
            },
            makeArray: function(t, e) {
                var i = e || [];
                return null != t && (n(Object(t)) ? ft.merge(i, "string" == typeof t ? [t] : t) : st.call(i, t)), i
            },
            inArray: function(t, e, n) {
                var i;
                if (e) {
                    if (at) return at.call(e, t, n);
                    for (i = e.length, n = n ? n < 0 ? Math.max(0, i + n) : n : 0; n < i; n++)
                        if (n in e && e[n] === t) return n
                }
                return -1
            },
            merge: function(t, e) {
                for (var n = +e.length, i = 0, o = t.length; i < n;) t[o++] = e[i++];
                if (n !== n)
                    for (; void 0 !== e[i];) t[o++] = e[i++];
                return t.length = o, t
            },
            grep: function(t, e, n) {
                for (var i = [], o = 0, r = t.length, s = !n; o < r; o++) !e(t[o], o) !== s && i.push(t[o]);
                return i
            },
            map: function(t, e, i) {
                var o, r, s = 0,
                    a = [];
                if (n(t))
                    for (o = t.length; s < o; s++) null != (r = e(t[s], s, i)) && a.push(r);
                else
                    for (s in t) null != (r = e(t[s], s, i)) && a.push(r);
                return rt.apply([], a)
            },
            guid: 1,
            proxy: function(t, e) {
                var n, i, o;
                if ("string" == typeof e && (o = t[e], e = t, t = o), ft.isFunction(t)) return n = ot.call(arguments, 2), i = function() {
                    return t.apply(e || this, n.concat(ot.call(arguments)))
                }, i.guid = t.guid = t.guid || ft.guid++, i
            },
            now: function() {
                return +new Date
            },
            support: dt
        }), "function" == typeof Symbol && (ft.fn[Symbol.iterator] = nt[Symbol.iterator]), ft.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(t, e) {
            lt["[object " + e + "]"] = e.toLowerCase()
        });
        var ht = function(t) {
            function e(t, e, n, i) {
                var o, r, s, a, c, d, f, p, h = e && e.ownerDocument,
                    m = e ? e.nodeType : 9;
                if (n = n || [], "string" != typeof t || !t || 1 !== m && 9 !== m && 11 !== m) return n;
                if (!i && ((e ? e.ownerDocument || e : R) !== D && N(e), e = e || D, A)) {
                    if (11 !== m && (d = mt.exec(t)))
                        if (o = d[1]) {
                            if (9 === m) {
                                if (!(s = e.getElementById(o))) return n;
                                if (s.id === o) return n.push(s), n
                            } else if (h && (s = h.getElementById(o)) && I(e, s) && s.id === o) return n.push(s), n
                        } else {
                            if (d[2]) return J.apply(n, e.getElementsByTagName(t)), n;
                            if ((o = d[3]) && b.getElementsByClassName && e.getElementsByClassName) return J.apply(n, e.getElementsByClassName(o)), n
                        }
                    if (b.qsa && !B[t + " "] && (!L || !L.test(t))) {
                        if (1 !== m) h = e, p = t;
                        else if ("object" !== e.nodeName.toLowerCase()) {
                            for ((a = e.getAttribute("id")) ? a = a.replace(vt, "\\$&") : e.setAttribute("id", a = M), f = k(t), r = f.length, c = ut.test(a) ? "#" + a : "[id='" + a + "']"; r--;) f[r] = c + " " + u(f[r]);
                            p = f.join(","), h = gt.test(t) && l(e.parentNode) || e
                        }
                        if (p) try {
                            return J.apply(n, h.querySelectorAll(p)), n
                        } catch (t) {} finally {
                            a === M && e.removeAttribute("id")
                        }
                    }
                }
                return $(t.replace(rt, "$1"), e, n, i)
            }

            function n() {
                function t(n, i) {
                    return e.push(n + " ") > w.cacheLength && delete t[e.shift()], t[n + " "] = i
                }
                var e = [];
                return t
            }

            function i(t) {
                return t[M] = !0, t
            }

            function o(t) {
                var e = D.createElement("div");
                try {
                    return !!t(e)
                } catch (t) {
                    return !1
                } finally {
                    e.parentNode && e.parentNode.removeChild(e), e = null
                }
            }

            function r(t, e) {
                for (var n = t.split("|"), i = n.length; i--;) w.attrHandle[n[i]] = e
            }

            function s(t, e) {
                var n = e && t,
                    i = n && 1 === t.nodeType && 1 === e.nodeType && (~e.sourceIndex || z) - (~t.sourceIndex || z);
                if (i) return i;
                if (n)
                    for (; n = n.nextSibling;)
                        if (n === e) return -1;
                return t ? 1 : -1
            }

            function a(t) {
                return i(function(e) {
                    return e = +e, i(function(n, i) {
                        for (var o, r = t([], n.length, e), s = r.length; s--;) n[o = r[s]] && (n[o] = !(i[o] = n[o]))
                    })
                })
            }

            function l(t) {
                return t && void 0 !== t.getElementsByTagName && t
            }

            function c() {}

            function u(t) {
                for (var e = 0, n = t.length, i = ""; e < n; e++) i += t[e].value;
                return i
            }

            function d(t, e, n) {
                var i = e.dir,
                    o = n && "parentNode" === i,
                    r = P++;
                return e.first ? function(e, n, r) {
                    for (; e = e[i];)
                        if (1 === e.nodeType || o) return t(e, n, r)
                } : function(e, n, s) {
                    var a, l, c, u = [H, r];
                    if (s) {
                        for (; e = e[i];)
                            if ((1 === e.nodeType || o) && t(e, n, s)) return !0
                    } else
                        for (; e = e[i];)
                            if (1 === e.nodeType || o) {
                                if (c = e[M] || (e[M] = {}), l = c[e.uniqueID] || (c[e.uniqueID] = {}), (a = l[i]) && a[0] === H && a[1] === r) return u[2] = a[2];
                                if (l[i] = u, u[2] = t(e, n, s)) return !0
                            }
                }
            }

            function f(t) {
                return t.length > 1 ? function(e, n, i) {
                    for (var o = t.length; o--;)
                        if (!t[o](e, n, i)) return !1;
                    return !0
                } : t[0]
            }

            function p(t, n, i) {
                for (var o = 0, r = n.length; o < r; o++) e(t, n[o], i);
                return i
            }

            function h(t, e, n, i, o) {
                for (var r, s = [], a = 0, l = t.length, c = null != e; a < l; a++)(r = t[a]) && (n && !n(r, i, o) || (s.push(r), c && e.push(a)));
                return s
            }

            function m(t, e, n, o, r, s) {
                return o && !o[M] && (o = m(o)), r && !r[M] && (r = m(r, s)), i(function(i, s, a, l) {
                    var c, u, d, f = [],
                        m = [],
                        g = s.length,
                        v = i || p(e || "*", a.nodeType ? [a] : a, []),
                        y = !t || !i && e ? v : h(v, f, t, a, l),
                        b = n ? r || (i ? t : g || o) ? [] : s : y;
                    if (n && n(y, b, a, l), o)
                        for (c = h(b, m), o(c, [], a, l), u = c.length; u--;)(d = c[u]) && (b[m[u]] = !(y[m[u]] = d));
                    if (i) {
                        if (r || t) {
                            if (r) {
                                for (c = [], u = b.length; u--;)(d = b[u]) && c.push(y[u] = d);
                                r(null, b = [], c, l)
                            }
                            for (u = b.length; u--;)(d = b[u]) && (c = r ? K(i, d) : f[u]) > -1 && (i[c] = !(s[c] = d))
                        }
                    } else b = h(b === s ? b.splice(g, b.length) : b), r ? r(null, s, b, l) : J.apply(s, b)
                })
            }

            function g(t) {
                for (var e, n, i, o = t.length, r = w.relative[t[0].type], s = r || w.relative[" "], a = r ? 1 : 0, l = d(function(t) {
                        return t === e
                    }, s, !0), c = d(function(t) {
                        return K(e, t) > -1
                    }, s, !0), p = [function(t, n, i) {
                        var o = !r && (i || n !== C) || ((e = n).nodeType ? l(t, n, i) : c(t, n, i));
                        return e = null, o
                    }]; a < o; a++)
                    if (n = w.relative[t[a].type]) p = [d(f(p), n)];
                    else {
                        if (n = w.filter[t[a].type].apply(null, t[a].matches), n[M]) {
                            for (i = ++a; i < o && !w.relative[t[i].type]; i++);
                            return m(a > 1 && f(p), a > 1 && u(t.slice(0, a - 1).concat({
                                value: " " === t[a - 2].type ? "*" : ""
                            })).replace(rt, "$1"), n, a < i && g(t.slice(a, i)), i < o && g(t = t.slice(i)), i < o && u(t))
                        }
                        p.push(n)
                    }
                return f(p)
            }

            function v(t, n) {
                var o = n.length > 0,
                    r = t.length > 0,
                    s = function(i, s, a, l, c) {
                        var u, d, f, p = 0,
                            m = "0",
                            g = i && [],
                            v = [],
                            y = C,
                            b = i || r && w.find.TAG("*", c),
                            x = H += null == y ? 1 : Math.random() || .1,
                            _ = b.length;
                        for (c && (C = s === D || s || c); m !== _ && null != (u = b[m]); m++) {
                            if (r && u) {
                                for (d = 0, s || u.ownerDocument === D || (N(u), a = !A); f = t[d++];)
                                    if (f(u, s || D, a)) {
                                        l.push(u);
                                        break
                                    }
                                c && (H = x)
                            }
                            o && ((u = !f && u) && p--, i && g.push(u))
                        }
                        if (p += m, o && m !== p) {
                            for (d = 0; f = n[d++];) f(g, v, s, a);
                            if (i) {
                                if (p > 0)
                                    for (; m--;) g[m] || v[m] || (v[m] = Q.call(l));
                                v = h(v)
                            }
                            J.apply(l, v), c && !i && v.length > 0 && p + n.length > 1 && e.uniqueSort(l)
                        }
                        return c && (H = x, C = y), g
                    };
                return o ? i(s) : s
            }
            var y, b, w, x, _, k, T, $, C, E, S, N, D, j, A, L, O, q, I, M = "sizzle" + 1 * new Date,
                R = t.document,
                H = 0,
                P = 0,
                F = n(),
                W = n(),
                B = n(),
                U = function(t, e) {
                    return t === e && (S = !0), 0
                },
                z = 1 << 31,
                V = {}.hasOwnProperty,
                X = [],
                Q = X.pop,
                G = X.push,
                J = X.push,
                Y = X.slice,
                K = function(t, e) {
                    for (var n = 0, i = t.length; n < i; n++)
                        if (t[n] === e) return n;
                    return -1
                },
                Z = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
                tt = "[\\x20\\t\\r\\n\\f]",
                et = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
                nt = "\\[" + tt + "*(" + et + ")(?:" + tt + "*([*^$|!~]?=)" + tt + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + et + "))|)" + tt + "*\\]",
                it = ":(" + et + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + nt + ")*)|.*)\\)|)",
                ot = new RegExp(tt + "+", "g"),
                rt = new RegExp("^" + tt + "+|((?:^|[^\\\\])(?:\\\\.)*)" + tt + "+$", "g"),
                st = new RegExp("^" + tt + "*," + tt + "*"),
                at = new RegExp("^" + tt + "*([>+~]|" + tt + ")" + tt + "*"),
                lt = new RegExp("=" + tt + "*([^\\]'\"]*?)" + tt + "*\\]", "g"),
                ct = new RegExp(it),
                ut = new RegExp("^" + et + "$"),
                dt = {
                    ID: new RegExp("^#(" + et + ")"),
                    CLASS: new RegExp("^\\.(" + et + ")"),
                    TAG: new RegExp("^(" + et + "|[*])"),
                    ATTR: new RegExp("^" + nt),
                    PSEUDO: new RegExp("^" + it),
                    CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + tt + "*(even|odd|(([+-]|)(\\d*)n|)" + tt + "*(?:([+-]|)" + tt + "*(\\d+)|))" + tt + "*\\)|)", "i"),
                    bool: new RegExp("^(?:" + Z + ")$", "i"),
                    needsContext: new RegExp("^" + tt + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + tt + "*((?:-\\d)?\\d*)" + tt + "*\\)|)(?=[^-]|$)", "i")
                },
                ft = /^(?:input|select|textarea|button)$/i,
                pt = /^h\d$/i,
                ht = /^[^{]+\{\s*\[native \w/,
                mt = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                gt = /[+~]/,
                vt = /'|\\/g,
                yt = new RegExp("\\\\([\\da-f]{1,6}" + tt + "?|(" + tt + ")|.)", "ig"),
                bt = function(t, e, n) {
                    var i = "0x" + e - 65536;
                    return i !== i || n ? e : i < 0 ? String.fromCharCode(i + 65536) : String.fromCharCode(i >> 10 | 55296, 1023 & i | 56320)
                },
                wt = function() {
                    N()
                };
            try {
                J.apply(X = Y.call(R.childNodes), R.childNodes), X[R.childNodes.length].nodeType
            } catch (t) {
                J = {
                    apply: X.length ? function(t, e) {
                        G.apply(t, Y.call(e))
                    } : function(t, e) {
                        for (var n = t.length, i = 0; t[n++] = e[i++];);
                        t.length = n - 1
                    }
                }
            }
            b = e.support = {}, _ = e.isXML = function(t) {
                var e = t && (t.ownerDocument || t).documentElement;
                return !!e && "HTML" !== e.nodeName
            }, N = e.setDocument = function(t) {
                var e, n, i = t ? t.ownerDocument || t : R;
                return i !== D && 9 === i.nodeType && i.documentElement ? (D = i, j = D.documentElement, A = !_(D), (n = D.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener("unload", wt, !1) : n.attachEvent && n.attachEvent("onunload", wt)), b.attributes = o(function(t) {
                    return t.className = "i", !t.getAttribute("className")
                }), b.getElementsByTagName = o(function(t) {
                    return t.appendChild(D.createComment("")), !t.getElementsByTagName("*").length
                }), b.getElementsByClassName = ht.test(D.getElementsByClassName), b.getById = o(function(t) {
                    return j.appendChild(t).id = M, !D.getElementsByName || !D.getElementsByName(M).length
                }), b.getById ? (w.find.ID = function(t, e) {
                    if (void 0 !== e.getElementById && A) {
                        var n = e.getElementById(t);
                        return n ? [n] : []
                    }
                }, w.filter.ID = function(t) {
                    var e = t.replace(yt, bt);
                    return function(t) {
                        return t.getAttribute("id") === e
                    }
                }) : (delete w.find.ID, w.filter.ID = function(t) {
                    var e = t.replace(yt, bt);
                    return function(t) {
                        var n = void 0 !== t.getAttributeNode && t.getAttributeNode("id");
                        return n && n.value === e
                    }
                }), w.find.TAG = b.getElementsByTagName ? function(t, e) {
                    return void 0 !== e.getElementsByTagName ? e.getElementsByTagName(t) : b.qsa ? e.querySelectorAll(t) : void 0
                } : function(t, e) {
                    var n, i = [],
                        o = 0,
                        r = e.getElementsByTagName(t);
                    if ("*" === t) {
                        for (; n = r[o++];) 1 === n.nodeType && i.push(n);
                        return i
                    }
                    return r
                }, w.find.CLASS = b.getElementsByClassName && function(t, e) {
                    if (void 0 !== e.getElementsByClassName && A) return e.getElementsByClassName(t)
                }, O = [], L = [], (b.qsa = ht.test(D.querySelectorAll)) && (o(function(t) {
                    j.appendChild(t).innerHTML = "<a id='" + M + "'></a><select id='" + M + "-\r\\' msallowcapture=''><option selected=''></option></select>", t.querySelectorAll("[msallowcapture^='']").length && L.push("[*^$]=" + tt + "*(?:''|\"\")"), t.querySelectorAll("[selected]").length || L.push("\\[" + tt + "*(?:value|" + Z + ")"), t.querySelectorAll("[id~=" + M + "-]").length || L.push("~="), t.querySelectorAll(":checked").length || L.push(":checked"), t.querySelectorAll("a#" + M + "+*").length || L.push(".#.+[+~]")
                }), o(function(t) {
                    var e = D.createElement("input");
                    e.setAttribute("type", "hidden"), t.appendChild(e).setAttribute("name", "D"), t.querySelectorAll("[name=d]").length && L.push("name" + tt + "*[*^$|!~]?="), t.querySelectorAll(":enabled").length || L.push(":enabled", ":disabled"), t.querySelectorAll("*,:x"), L.push(",.*:")
                })), (b.matchesSelector = ht.test(q = j.matches || j.webkitMatchesSelector || j.mozMatchesSelector || j.oMatchesSelector || j.msMatchesSelector)) && o(function(t) {
                    b.disconnectedMatch = q.call(t, "div"), q.call(t, "[s!='']:x"), O.push("!=", it)
                }), L = L.length && new RegExp(L.join("|")), O = O.length && new RegExp(O.join("|")), e = ht.test(j.compareDocumentPosition), I = e || ht.test(j.contains) ? function(t, e) {
                    var n = 9 === t.nodeType ? t.documentElement : t,
                        i = e && e.parentNode;
                    return t === i || !(!i || 1 !== i.nodeType || !(n.contains ? n.contains(i) : t.compareDocumentPosition && 16 & t.compareDocumentPosition(i)))
                } : function(t, e) {
                    if (e)
                        for (; e = e.parentNode;)
                            if (e === t) return !0;
                    return !1
                }, U = e ? function(t, e) {
                    if (t === e) return S = !0, 0;
                    var n = !t.compareDocumentPosition - !e.compareDocumentPosition;
                    return n ? n : (n = (t.ownerDocument || t) === (e.ownerDocument || e) ? t.compareDocumentPosition(e) : 1, 1 & n || !b.sortDetached && e.compareDocumentPosition(t) === n ? t === D || t.ownerDocument === R && I(R, t) ? -1 : e === D || e.ownerDocument === R && I(R, e) ? 1 : E ? K(E, t) - K(E, e) : 0 : 4 & n ? -1 : 1)
                } : function(t, e) {
                    if (t === e) return S = !0, 0;
                    var n, i = 0,
                        o = t.parentNode,
                        r = e.parentNode,
                        a = [t],
                        l = [e];
                    if (!o || !r) return t === D ? -1 : e === D ? 1 : o ? -1 : r ? 1 : E ? K(E, t) - K(E, e) : 0;
                    if (o === r) return s(t, e);
                    for (n = t; n = n.parentNode;) a.unshift(n);
                    for (n = e; n = n.parentNode;) l.unshift(n);
                    for (; a[i] === l[i];) i++;
                    return i ? s(a[i], l[i]) : a[i] === R ? -1 : l[i] === R ? 1 : 0
                }, D) : D
            }, e.matches = function(t, n) {
                return e(t, null, null, n)
            }, e.matchesSelector = function(t, n) {
                if ((t.ownerDocument || t) !== D && N(t), n = n.replace(lt, "='$1']"), b.matchesSelector && A && !B[n + " "] && (!O || !O.test(n)) && (!L || !L.test(n))) try {
                    var i = q.call(t, n);
                    if (i || b.disconnectedMatch || t.document && 11 !== t.document.nodeType) return i
                } catch (t) {}
                return e(n, D, null, [t]).length > 0
            }, e.contains = function(t, e) {
                return (t.ownerDocument || t) !== D && N(t), I(t, e)
            }, e.attr = function(t, e) {
                (t.ownerDocument || t) !== D && N(t);
                var n = w.attrHandle[e.toLowerCase()],
                    i = n && V.call(w.attrHandle, e.toLowerCase()) ? n(t, e, !A) : void 0;
                return void 0 !== i ? i : b.attributes || !A ? t.getAttribute(e) : (i = t.getAttributeNode(e)) && i.specified ? i.value : null
            }, e.error = function(t) {
                throw new Error("Syntax error, unrecognized expression: " + t)
            }, e.uniqueSort = function(t) {
                var e, n = [],
                    i = 0,
                    o = 0;
                if (S = !b.detectDuplicates, E = !b.sortStable && t.slice(0), t.sort(U), S) {
                    for (; e = t[o++];) e === t[o] && (i = n.push(o));
                    for (; i--;) t.splice(n[i], 1)
                }
                return E = null, t
            }, x = e.getText = function(t) {
                var e, n = "",
                    i = 0,
                    o = t.nodeType;
                if (o) {
                    if (1 === o || 9 === o || 11 === o) {
                        if ("string" == typeof t.textContent) return t.textContent;
                        for (t = t.firstChild; t; t = t.nextSibling) n += x(t)
                    } else if (3 === o || 4 === o) return t.nodeValue
                } else
                    for (; e = t[i++];) n += x(e);
                return n
            }, w = e.selectors = {
                cacheLength: 50,
                createPseudo: i,
                match: dt,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function(t) {
                        return t[1] = t[1].replace(yt, bt), t[3] = (t[3] || t[4] || t[5] || "").replace(yt, bt), "~=" === t[2] && (t[3] = " " + t[3] + " "), t.slice(0, 4)
                    },
                    CHILD: function(t) {
                        return t[1] = t[1].toLowerCase(), "nth" === t[1].slice(0, 3) ? (t[3] || e.error(t[0]), t[4] = +(t[4] ? t[5] + (t[6] || 1) : 2 * ("even" === t[3] || "odd" === t[3])), t[5] = +(t[7] + t[8] || "odd" === t[3])) : t[3] && e.error(t[0]), t
                    },
                    PSEUDO: function(t) {
                        var e, n = !t[6] && t[2];
                        return dt.CHILD.test(t[0]) ? null : (t[3] ? t[2] = t[4] || t[5] || "" : n && ct.test(n) && (e = k(n, !0)) && (e = n.indexOf(")", n.length - e) - n.length) && (t[0] = t[0].slice(0, e), t[2] = n.slice(0, e)), t.slice(0, 3))
                    }
                },
                filter: {
                    TAG: function(t) {
                        var e = t.replace(yt, bt).toLowerCase();
                        return "*" === t ? function() {
                            return !0
                        } : function(t) {
                            return t.nodeName && t.nodeName.toLowerCase() === e
                        }
                    },
                    CLASS: function(t) {
                        var e = F[t + " "];
                        return e || (e = new RegExp("(^|" + tt + ")" + t + "(" + tt + "|$)")) && F(t, function(t) {
                            return e.test("string" == typeof t.className && t.className || void 0 !== t.getAttribute && t.getAttribute("class") || "")
                        })
                    },
                    ATTR: function(t, n, i) {
                        return function(o) {
                            var r = e.attr(o, t);
                            return null == r ? "!=" === n : !n || (r += "", "=" === n ? r === i : "!=" === n ? r !== i : "^=" === n ? i && 0 === r.indexOf(i) : "*=" === n ? i && r.indexOf(i) > -1 : "$=" === n ? i && r.slice(-i.length) === i : "~=" === n ? (" " + r.replace(ot, " ") + " ").indexOf(i) > -1 : "|=" === n && (r === i || r.slice(0, i.length + 1) === i + "-"))
                        }
                    },
                    CHILD: function(t, e, n, i, o) {
                        var r = "nth" !== t.slice(0, 3),
                            s = "last" !== t.slice(-4),
                            a = "of-type" === e;
                        return 1 === i && 0 === o ? function(t) {
                            return !!t.parentNode
                        } : function(e, n, l) {
                            var c, u, d, f, p, h, m = r !== s ? "nextSibling" : "previousSibling",
                                g = e.parentNode,
                                v = a && e.nodeName.toLowerCase(),
                                y = !l && !a,
                                b = !1;
                            if (g) {
                                if (r) {
                                    for (; m;) {
                                        for (f = e; f = f[m];)
                                            if (a ? f.nodeName.toLowerCase() === v : 1 === f.nodeType) return !1;
                                        h = m = "only" === t && !h && "nextSibling"
                                    }
                                    return !0
                                }
                                if (h = [s ? g.firstChild : g.lastChild], s && y) {
                                    for (f = g, d = f[M] || (f[M] = {}), u = d[f.uniqueID] || (d[f.uniqueID] = {}), c = u[t] || [], p = c[0] === H && c[1], b = p && c[2], f = p && g.childNodes[p]; f = ++p && f && f[m] || (b = p = 0) || h.pop();)
                                        if (1 === f.nodeType && ++b && f === e) {
                                            u[t] = [H, p, b];
                                            break
                                        }
                                } else if (y && (f = e, d = f[M] || (f[M] = {}), u = d[f.uniqueID] || (d[f.uniqueID] = {}), c = u[t] || [], p = c[0] === H && c[1], b = p), b === !1)
                                    for (;
                                        (f = ++p && f && f[m] || (b = p = 0) || h.pop()) && ((a ? f.nodeName.toLowerCase() !== v : 1 !== f.nodeType) || !++b || (y && (d = f[M] || (f[M] = {}), u = d[f.uniqueID] || (d[f.uniqueID] = {}), u[t] = [H, b]), f !== e)););
                                return (b -= o) === i || b % i == 0 && b / i >= 0
                            }
                        }
                    },
                    PSEUDO: function(t, n) {
                        var o, r = w.pseudos[t] || w.setFilters[t.toLowerCase()] || e.error("unsupported pseudo: " + t);
                        return r[M] ? r(n) : r.length > 1 ? (o = [t, t, "", n], w.setFilters.hasOwnProperty(t.toLowerCase()) ? i(function(t, e) {
                            for (var i, o = r(t, n), s = o.length; s--;) i = K(t, o[s]), t[i] = !(e[i] = o[s])
                        }) : function(t) {
                            return r(t, 0, o)
                        }) : r
                    }
                },
                pseudos: {
                    not: i(function(t) {
                        var e = [],
                            n = [],
                            o = T(t.replace(rt, "$1"));
                        return o[M] ? i(function(t, e, n, i) {
                            for (var r, s = o(t, null, i, []), a = t.length; a--;)(r = s[a]) && (t[a] = !(e[a] = r))
                        }) : function(t, i, r) {
                            return e[0] = t, o(e, null, r, n), e[0] = null, !n.pop()
                        }
                    }),
                    has: i(function(t) {
                        return function(n) {
                            return e(t, n).length > 0
                        }
                    }),
                    contains: i(function(t) {
                        return t = t.replace(yt, bt),
                            function(e) {
                                return (e.textContent || e.innerText || x(e)).indexOf(t) > -1
                            }
                    }),
                    lang: i(function(t) {
                        return ut.test(t || "") || e.error("unsupported lang: " + t), t = t.replace(yt, bt).toLowerCase(),
                            function(e) {
                                var n;
                                do
                                    if (n = A ? e.lang : e.getAttribute("xml:lang") || e.getAttribute("lang")) return (n = n.toLowerCase()) === t || 0 === n.indexOf(t + "-");
                                while ((e = e.parentNode) && 1 === e.nodeType) return !1
                            }
                    }),
                    target: function(e) {
                        var n = t.location && t.location.hash;
                        return n && n.slice(1) === e.id
                    },
                    root: function(t) {
                        return t === j
                    },
                    focus: function(t) {
                        return t === D.activeElement && (!D.hasFocus || D.hasFocus()) && !!(t.type || t.href || ~t.tabIndex)
                    },
                    enabled: function(t) {
                        return t.disabled === !1
                    },
                    disabled: function(t) {
                        return t.disabled === !0
                    },
                    checked: function(t) {
                        var e = t.nodeName.toLowerCase();
                        return "input" === e && !!t.checked || "option" === e && !!t.selected
                    },
                    selected: function(t) {
                        return t.parentNode && t.parentNode.selectedIndex, t.selected === !0
                    },
                    empty: function(t) {
                        for (t = t.firstChild; t; t = t.nextSibling)
                            if (t.nodeType < 6) return !1;
                        return !0
                    },
                    parent: function(t) {
                        return !w.pseudos.empty(t)
                    },
                    header: function(t) {
                        return pt.test(t.nodeName)
                    },
                    input: function(t) {
                        return ft.test(t.nodeName)
                    },
                    button: function(t) {
                        var e = t.nodeName.toLowerCase();
                        return "input" === e && "button" === t.type || "button" === e
                    },
                    text: function(t) {
                        var e;
                        return "input" === t.nodeName.toLowerCase() && "text" === t.type && (null == (e = t.getAttribute("type")) || "text" === e.toLowerCase())
                    },
                    first: a(function() {
                        return [0]
                    }),
                    last: a(function(t, e) {
                        return [e - 1]
                    }),
                    eq: a(function(t, e, n) {
                        return [n < 0 ? n + e : n]
                    }),
                    even: a(function(t, e) {
                        for (var n = 0; n < e; n += 2) t.push(n);
                        return t
                    }),
                    odd: a(function(t, e) {
                        for (var n = 1; n < e; n += 2) t.push(n);
                        return t
                    }),
                    lt: a(function(t, e, n) {
                        for (var i = n < 0 ? n + e : n; --i >= 0;) t.push(i);
                        return t
                    }),
                    gt: a(function(t, e, n) {
                        for (var i = n < 0 ? n + e : n; ++i < e;) t.push(i);
                        return t
                    })
                }
            }, w.pseudos.nth = w.pseudos.eq;
            for (y in {
                    radio: !0,
                    checkbox: !0,
                    file: !0,
                    password: !0,
                    image: !0
                }) w.pseudos[y] = function(t) {
                return function(e) {
                    return "input" === e.nodeName.toLowerCase() && e.type === t
                }
            }(y);
            for (y in {
                    submit: !0,
                    reset: !0
                }) w.pseudos[y] = function(t) {
                return function(e) {
                    var n = e.nodeName.toLowerCase();
                    return ("input" === n || "button" === n) && e.type === t
                }
            }(y);
            return c.prototype = w.filters = w.pseudos, w.setFilters = new c, k = e.tokenize = function(t, n) {
                var i, o, r, s, a, l, c, u = W[t + " "];
                if (u) return n ? 0 : u.slice(0);
                for (a = t, l = [], c = w.preFilter; a;) {
                    i && !(o = st.exec(a)) || (o && (a = a.slice(o[0].length) || a), l.push(r = [])), i = !1, (o = at.exec(a)) && (i = o.shift(), r.push({
                        value: i,
                        type: o[0].replace(rt, " ")
                    }), a = a.slice(i.length));
                    for (s in w.filter) !(o = dt[s].exec(a)) || c[s] && !(o = c[s](o)) || (i = o.shift(), r.push({
                        value: i,
                        type: s,
                        matches: o
                    }), a = a.slice(i.length));
                    if (!i) break
                }
                return n ? a.length : a ? e.error(t) : W(t, l).slice(0)
            }, T = e.compile = function(t, e) {
                var n, i = [],
                    o = [],
                    r = B[t + " "];
                if (!r) {
                    for (e || (e = k(t)), n = e.length; n--;) r = g(e[n]), r[M] ? i.push(r) : o.push(r);
                    r = B(t, v(o, i)), r.selector = t
                }
                return r
            }, $ = e.select = function(t, e, n, i) {
                var o, r, s, a, c, d = "function" == typeof t && t,
                    f = !i && k(t = d.selector || t);
                if (n = n || [], 1 === f.length) {
                    if (r = f[0] = f[0].slice(0), r.length > 2 && "ID" === (s = r[0]).type && b.getById && 9 === e.nodeType && A && w.relative[r[1].type]) {
                        if (!(e = (w.find.ID(s.matches[0].replace(yt, bt), e) || [])[0])) return n;
                        d && (e = e.parentNode), t = t.slice(r.shift().value.length)
                    }
                    for (o = dt.needsContext.test(t) ? 0 : r.length; o-- && (s = r[o], !w.relative[a = s.type]);)
                        if ((c = w.find[a]) && (i = c(s.matches[0].replace(yt, bt), gt.test(r[0].type) && l(e.parentNode) || e))) {
                            if (r.splice(o, 1), !(t = i.length && u(r))) return J.apply(n, i), n;
                            break
                        }
                }
                return (d || T(t, f))(i, e, !A, n, !e || gt.test(t) && l(e.parentNode) || e), n
            }, b.sortStable = M.split("").sort(U).join("") === M, b.detectDuplicates = !!S, N(), b.sortDetached = o(function(t) {
                return 1 & t.compareDocumentPosition(D.createElement("div"))
            }), o(function(t) {
                return t.innerHTML = "<a href='#'></a>", "#" === t.firstChild.getAttribute("href")
            }) || r("type|href|height|width", function(t, e, n) {
                if (!n) return t.getAttribute(e, "type" === e.toLowerCase() ? 1 : 2)
            }), b.attributes && o(function(t) {
                return t.innerHTML = "<input/>", t.firstChild.setAttribute("value", ""), "" === t.firstChild.getAttribute("value")
            }) || r("value", function(t, e, n) {
                if (!n && "input" === t.nodeName.toLowerCase()) return t.defaultValue
            }), o(function(t) {
                return null == t.getAttribute("disabled")
            }) || r(Z, function(t, e, n) {
                var i;
                if (!n) return t[e] === !0 ? e.toLowerCase() : (i = t.getAttributeNode(e)) && i.specified ? i.value : null
            }), e
        }(t);
        ft.find = ht, ft.expr = ht.selectors, ft.expr[":"] = ft.expr.pseudos, ft.uniqueSort = ft.unique = ht.uniqueSort, ft.text = ht.getText, ft.isXMLDoc = ht.isXML, ft.contains = ht.contains;
        var mt = function(t, e, n) {
                for (var i = [], o = void 0 !== n;
                    (t = t[e]) && 9 !== t.nodeType;)
                    if (1 === t.nodeType) {
                        if (o && ft(t).is(n)) break;
                        i.push(t)
                    }
                return i
            },
            gt = function(t, e) {
                for (var n = []; t; t = t.nextSibling) 1 === t.nodeType && t !== e && n.push(t);
                return n
            },
            vt = ft.expr.match.needsContext,
            yt = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,
            bt = /^.[^:#\[\.,]*$/;
        ft.filter = function(t, e, n) {
            var i = e[0];
            return n && (t = ":not(" + t + ")"), 1 === e.length && 1 === i.nodeType ? ft.find.matchesSelector(i, t) ? [i] : [] : ft.find.matches(t, ft.grep(e, function(t) {
                return 1 === t.nodeType
            }))
        }, ft.fn.extend({
            find: function(t) {
                var e, n = [],
                    i = this,
                    o = i.length;
                if ("string" != typeof t) return this.pushStack(ft(t).filter(function() {
                    for (e = 0; e < o; e++)
                        if (ft.contains(i[e], this)) return !0
                }));
                for (e = 0; e < o; e++) ft.find(t, i[e], n);
                return n = this.pushStack(o > 1 ? ft.unique(n) : n), n.selector = this.selector ? this.selector + " " + t : t, n
            },
            filter: function(t) {
                return this.pushStack(i(this, t || [], !1))
            },
            not: function(t) {
                return this.pushStack(i(this, t || [], !0))
            },
            is: function(t) {
                return !!i(this, "string" == typeof t && vt.test(t) ? ft(t) : t || [], !1).length
            }
        });
        var wt, xt = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
        (ft.fn.init = function(t, e, n) {
            var i, o;
            if (!t) return this;
            if (n = n || wt, "string" == typeof t) {
                if (!(i = "<" === t.charAt(0) && ">" === t.charAt(t.length - 1) && t.length >= 3 ? [null, t, null] : xt.exec(t)) || !i[1] && e) return !e || e.jquery ? (e || n).find(t) : this.constructor(e).find(t);
                if (i[1]) {
                    if (e = e instanceof ft ? e[0] : e, ft.merge(this, ft.parseHTML(i[1], e && e.nodeType ? e.ownerDocument || e : it, !0)), yt.test(i[1]) && ft.isPlainObject(e))
                        for (i in e) ft.isFunction(this[i]) ? this[i](e[i]) : this.attr(i, e[i]);
                    return this
                }
                if ((o = it.getElementById(i[2])) && o.parentNode) {
                    if (o.id !== i[2]) return wt.find(t);
                    this.length = 1, this[0] = o
                }
                return this.context = it, this.selector = t, this
            }
            return t.nodeType ? (this.context = this[0] = t, this.length = 1, this) : ft.isFunction(t) ? void 0 !== n.ready ? n.ready(t) : t(ft) : (void 0 !== t.selector && (this.selector = t.selector, this.context = t.context), ft.makeArray(t, this))
        }).prototype = ft.fn, wt = ft(it);
        var _t = /^(?:parents|prev(?:Until|All))/,
            kt = {
                children: !0,
                contents: !0,
                next: !0,
                prev: !0
            };
        ft.fn.extend({
            has: function(t) {
                var e, n = ft(t, this),
                    i = n.length;
                return this.filter(function() {
                    for (e = 0; e < i; e++)
                        if (ft.contains(this, n[e])) return !0
                })
            },
            closest: function(t, e) {
                for (var n, i = 0, o = this.length, r = [], s = vt.test(t) || "string" != typeof t ? ft(t, e || this.context) : 0; i < o; i++)
                    for (n = this[i]; n && n !== e; n = n.parentNode)
                        if (n.nodeType < 11 && (s ? s.index(n) > -1 : 1 === n.nodeType && ft.find.matchesSelector(n, t))) {
                            r.push(n);
                            break
                        }
                return this.pushStack(r.length > 1 ? ft.uniqueSort(r) : r)
            },
            index: function(t) {
                return t ? "string" == typeof t ? ft.inArray(this[0], ft(t)) : ft.inArray(t.jquery ? t[0] : t, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
            },
            add: function(t, e) {
                return this.pushStack(ft.uniqueSort(ft.merge(this.get(), ft(t, e))))
            },
            addBack: function(t) {
                return this.add(null == t ? this.prevObject : this.prevObject.filter(t))
            }
        }), ft.each({
            parent: function(t) {
                var e = t.parentNode;
                return e && 11 !== e.nodeType ? e : null
            },
            parents: function(t) {
                return mt(t, "parentNode")
            },
            parentsUntil: function(t, e, n) {
                return mt(t, "parentNode", n)
            },
            next: function(t) {
                return o(t, "nextSibling")
            },
            prev: function(t) {
                return o(t, "previousSibling")
            },
            nextAll: function(t) {
                return mt(t, "nextSibling")
            },
            prevAll: function(t) {
                return mt(t, "previousSibling")
            },
            nextUntil: function(t, e, n) {
                return mt(t, "nextSibling", n)
            },
            prevUntil: function(t, e, n) {
                return mt(t, "previousSibling", n)
            },
            siblings: function(t) {
                return gt((t.parentNode || {}).firstChild, t)
            },
            children: function(t) {
                return gt(t.firstChild)
            },
            contents: function(t) {
                return ft.nodeName(t, "iframe") ? t.contentDocument || t.contentWindow.document : ft.merge([], t.childNodes)
            }
        }, function(t, e) {
            ft.fn[t] = function(n, i) {
                var o = ft.map(this, e, n);
                return "Until" !== t.slice(-5) && (i = n), i && "string" == typeof i && (o = ft.filter(i, o)), this.length > 1 && (kt[t] || (o = ft.uniqueSort(o)), _t.test(t) && (o = o.reverse())), this.pushStack(o)
            }
        });
        var Tt = /\S+/g;
        ft.Callbacks = function(t) {
            t = "string" == typeof t ? r(t) : ft.extend({}, t);
            var e, n, i, o, s = [],
                a = [],
                l = -1,
                c = function() {
                    for (o = t.once, i = e = !0; a.length; l = -1)
                        for (n = a.shift(); ++l < s.length;) s[l].apply(n[0], n[1]) === !1 && t.stopOnFalse && (l = s.length, n = !1);
                    t.memory || (n = !1), e = !1, o && (s = n ? [] : "")
                },
                u = {
                    add: function() {
                        return s && (n && !e && (l = s.length - 1, a.push(n)), function e(n) {
                            ft.each(n, function(n, i) {
                                ft.isFunction(i) ? t.unique && u.has(i) || s.push(i) : i && i.length && "string" !== ft.type(i) && e(i)
                            })
                        }(arguments), n && !e && c()), this
                    },
                    remove: function() {
                        return ft.each(arguments, function(t, e) {
                            for (var n;
                                (n = ft.inArray(e, s, n)) > -1;) s.splice(n, 1), n <= l && l--
                        }), this
                    },
                    has: function(t) {
                        return t ? ft.inArray(t, s) > -1 : s.length > 0
                    },
                    empty: function() {
                        return s && (s = []), this
                    },
                    disable: function() {
                        return o = a = [], s = n = "", this
                    },
                    disabled: function() {
                        return !s
                    },
                    lock: function() {
                        return o = !0, n || u.disable(), this
                    },
                    locked: function() {
                        return !!o
                    },
                    fireWith: function(t, n) {
                        return o || (n = n || [], n = [t, n.slice ? n.slice() : n], a.push(n), e || c()), this
                    },
                    fire: function() {
                        return u.fireWith(this, arguments), this
                    },
                    fired: function() {
                        return !!i
                    }
                };
            return u
        }, ft.extend({
            Deferred: function(t) {
                var e = [
                        ["resolve", "done", ft.Callbacks("once memory"), "resolved"],
                        ["reject", "fail", ft.Callbacks("once memory"), "rejected"],
                        ["notify", "progress", ft.Callbacks("memory")]
                    ],
                    n = "pending",
                    i = {
                        state: function() {
                            return n
                        },
                        always: function() {
                            return o.done(arguments).fail(arguments), this
                        },
                        then: function() {
                            var t = arguments;
                            return ft.Deferred(function(n) {
                                ft.each(e, function(e, r) {
                                    var s = ft.isFunction(t[e]) && t[e];
                                    o[r[1]](function() {
                                        var t = s && s.apply(this, arguments);
                                        t && ft.isFunction(t.promise) ? t.promise().progress(n.notify).done(n.resolve).fail(n.reject) : n[r[0] + "With"](this === i ? n.promise() : this, s ? [t] : arguments)
                                    })
                                }), t = null
                            }).promise()
                        },
                        promise: function(t) {
                            return null != t ? ft.extend(t, i) : i
                        }
                    },
                    o = {};
                return i.pipe = i.then, ft.each(e, function(t, r) {
                    var s = r[2],
                        a = r[3];
                    i[r[1]] = s.add, a && s.add(function() {
                        n = a
                    }, e[1 ^ t][2].disable, e[2][2].lock), o[r[0]] = function() {
                        return o[r[0] + "With"](this === o ? i : this, arguments), this
                    }, o[r[0] + "With"] = s.fireWith
                }), i.promise(o), t && t.call(o, o), o
            },
            when: function(t) {
                var e, n, i, o = 0,
                    r = ot.call(arguments),
                    s = r.length,
                    a = 1 !== s || t && ft.isFunction(t.promise) ? s : 0,
                    l = 1 === a ? t : ft.Deferred(),
                    c = function(t, n, i) {
                        return function(o) {
                            n[t] = this, i[t] = arguments.length > 1 ? ot.call(arguments) : o, i === e ? l.notifyWith(n, i) : --a || l.resolveWith(n, i)
                        }
                    };
                if (s > 1)
                    for (e = new Array(s), n = new Array(s), i = new Array(s); o < s; o++) r[o] && ft.isFunction(r[o].promise) ? r[o].promise().progress(c(o, n, e)).done(c(o, i, r)).fail(l.reject) : --a;
                return a || l.resolveWith(i, r), l.promise()
            }
        });
        var $t;
        ft.fn.ready = function(t) {
            return ft.ready.promise().done(t), this
        }, ft.extend({
            isReady: !1,
            readyWait: 1,
            holdReady: function(t) {
                t ? ft.readyWait++ : ft.ready(!0)
            },
            ready: function(t) {
                (t === !0 ? --ft.readyWait : ft.isReady) || (ft.isReady = !0, t !== !0 && --ft.readyWait > 0 || ($t.resolveWith(it, [ft]), ft.fn.triggerHandler && (ft(it).triggerHandler("ready"), ft(it).off("ready"))))
            }
        }), ft.ready.promise = function(e) {
            if (!$t)
                if ($t = ft.Deferred(), "complete" === it.readyState || "loading" !== it.readyState && !it.documentElement.doScroll) t.setTimeout(ft.ready);
                else if (it.addEventListener) it.addEventListener("DOMContentLoaded", a), t.addEventListener("load", a);
            else {
                it.attachEvent("onreadystatechange", a), t.attachEvent("onload", a);
                var n = !1;
                try {
                    n = null == t.frameElement && it.documentElement
                } catch (t) {}
                n && n.doScroll && function e() {
                    if (!ft.isReady) {
                        try {
                            n.doScroll("left")
                        } catch (n) {
                            return t.setTimeout(e, 50)
                        }
                        s(), ft.ready()
                    }
                }()
            }
            return $t.promise(e)
        }, ft.ready.promise();
        var Ct;
        for (Ct in ft(dt)) break;
        dt.ownFirst = "0" === Ct, dt.inlineBlockNeedsLayout = !1, ft(function() {
                var t, e, n, i;
                (n = it.getElementsByTagName("body")[0]) && n.style && (e = it.createElement("div"), i = it.createElement("div"), i.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(i).appendChild(e), void 0 !== e.style.zoom && (e.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", dt.inlineBlockNeedsLayout = t = 3 === e.offsetWidth, t && (n.style.zoom = 1)), n.removeChild(i))
            }),
            function() {
                var t = it.createElement("div");
                dt.deleteExpando = !0;
                try {
                    delete t.test
                } catch (t) {
                    dt.deleteExpando = !1
                }
                t = null
            }();
        var Et = function(t) {
                var e = ft.noData[(t.nodeName + " ").toLowerCase()],
                    n = +t.nodeType || 1;
                return (1 === n || 9 === n) && (!e || e !== !0 && t.getAttribute("classid") === e)
            },
            St = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
            Nt = /([A-Z])/g;
        ft.extend({
                cache: {},
                noData: {
                    "applet ": !0,
                    "embed ": !0,
                    "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
                },
                hasData: function(t) {
                    return !!(t = t.nodeType ? ft.cache[t[ft.expando]] : t[ft.expando]) && !c(t)
                },
                data: function(t, e, n) {
                    return u(t, e, n)
                },
                removeData: function(t, e) {
                    return d(t, e)
                },
                _data: function(t, e, n) {
                    return u(t, e, n, !0)
                },
                _removeData: function(t, e) {
                    return d(t, e, !0)
                }
            }), ft.fn.extend({
                data: function(t, e) {
                    var n, i, o, r = this[0],
                        s = r && r.attributes;
                    if (void 0 === t) {
                        if (this.length && (o = ft.data(r), 1 === r.nodeType && !ft._data(r, "parsedAttrs"))) {
                            for (n = s.length; n--;) s[n] && (i = s[n].name, 0 === i.indexOf("data-") && (i = ft.camelCase(i.slice(5)), l(r, i, o[i])));
                            ft._data(r, "parsedAttrs", !0)
                        }
                        return o
                    }
                    return "object" == typeof t ? this.each(function() {
                        ft.data(this, t)
                    }) : arguments.length > 1 ? this.each(function() {
                        ft.data(this, t, e)
                    }) : r ? l(r, t, ft.data(r, t)) : void 0
                },
                removeData: function(t) {
                    return this.each(function() {
                        ft.removeData(this, t)
                    })
                }
            }), ft.extend({
                queue: function(t, e, n) {
                    var i;
                    if (t) return e = (e || "fx") + "queue", i = ft._data(t, e), n && (!i || ft.isArray(n) ? i = ft._data(t, e, ft.makeArray(n)) : i.push(n)), i || []
                },
                dequeue: function(t, e) {
                    e = e || "fx";
                    var n = ft.queue(t, e),
                        i = n.length,
                        o = n.shift(),
                        r = ft._queueHooks(t, e),
                        s = function() {
                            ft.dequeue(t, e)
                        };
                    "inprogress" === o && (o = n.shift(), i--), o && ("fx" === e && n.unshift("inprogress"), delete r.stop, o.call(t, s, r)), !i && r && r.empty.fire()
                },
                _queueHooks: function(t, e) {
                    var n = e + "queueHooks";
                    return ft._data(t, n) || ft._data(t, n, {
                        empty: ft.Callbacks("once memory").add(function() {
                            ft._removeData(t, e + "queue"), ft._removeData(t, n)
                        })
                    })
                }
            }), ft.fn.extend({
                queue: function(t, e) {
                    var n = 2;
                    return "string" != typeof t && (e = t, t = "fx", n--), arguments.length < n ? ft.queue(this[0], t) : void 0 === e ? this : this.each(function() {
                        var n = ft.queue(this, t, e);
                        ft._queueHooks(this, t), "fx" === t && "inprogress" !== n[0] && ft.dequeue(this, t)
                    })
                },
                dequeue: function(t) {
                    return this.each(function() {
                        ft.dequeue(this, t)
                    })
                },
                clearQueue: function(t) {
                    return this.queue(t || "fx", [])
                },
                promise: function(t, e) {
                    var n, i = 1,
                        o = ft.Deferred(),
                        r = this,
                        s = this.length,
                        a = function() {
                            --i || o.resolveWith(r, [r])
                        };
                    for ("string" != typeof t && (e = t, t = void 0), t = t || "fx"; s--;)(n = ft._data(r[s], t + "queueHooks")) && n.empty && (i++, n.empty.add(a));
                    return a(), o.promise(e)
                }
            }),
            function() {
                var t;
                dt.shrinkWrapBlocks = function() {
                    if (null != t) return t;
                    t = !1;
                    var e, n, i;
                    return (n = it.getElementsByTagName("body")[0]) && n.style ? (e = it.createElement("div"), i = it.createElement("div"), i.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(i).appendChild(e), void 0 !== e.style.zoom && (e.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", e.appendChild(it.createElement("div")).style.width = "5px", t = 3 !== e.offsetWidth), n.removeChild(i), t) : void 0
                }
            }();
        var Dt = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
            jt = new RegExp("^(?:([+-])=|)(" + Dt + ")([a-z%]*)$", "i"),
            At = ["Top", "Right", "Bottom", "Left"],
            Lt = function(t, e) {
                return t = e || t, "none" === ft.css(t, "display") || !ft.contains(t.ownerDocument, t)
            },
            Ot = function(t, e, n, i, o, r, s) {
                var a = 0,
                    l = t.length,
                    c = null == n;
                if ("object" === ft.type(n)) {
                    o = !0;
                    for (a in n) Ot(t, e, a, n[a], !0, r, s)
                } else if (void 0 !== i && (o = !0, ft.isFunction(i) || (s = !0), c && (s ? (e.call(t, i), e = null) : (c = e, e = function(t, e, n) {
                        return c.call(ft(t), n)
                    })), e))
                    for (; a < l; a++) e(t[a], n, s ? i : i.call(t[a], a, e(t[a], n)));
                return o ? t : c ? e.call(t) : l ? e(t[0], n) : r
            },
            qt = /^(?:checkbox|radio)$/i,
            It = /<([\w:-]+)/,
            Mt = /^$|\/(?:java|ecma)script/i,
            Rt = /^\s+/,
            Ht = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|dialog|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|picture|progress|section|summary|template|time|video";
        ! function() {
            var t = it.createElement("div"),
                e = it.createDocumentFragment(),
                n = it.createElement("input");
            t.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", dt.leadingWhitespace = 3 === t.firstChild.nodeType, dt.tbody = !t.getElementsByTagName("tbody").length, dt.htmlSerialize = !!t.getElementsByTagName("link").length, dt.html5Clone = "<:nav></:nav>" !== it.createElement("nav").cloneNode(!0).outerHTML, n.type = "checkbox", n.checked = !0, e.appendChild(n), dt.appendChecked = n.checked, t.innerHTML = "<textarea>x</textarea>", dt.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue, e.appendChild(t), n = it.createElement("input"), n.setAttribute("type", "radio"), n.setAttribute("checked", "checked"), n.setAttribute("name", "t"), t.appendChild(n), dt.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked, dt.noCloneEvent = !!t.addEventListener, t[ft.expando] = 1, dt.attributes = !t.getAttribute(ft.expando)
        }();
        var Pt = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            area: [1, "<map>", "</map>"],
            param: [1, "<object>", "</object>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: dt.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
        };
        Pt.optgroup = Pt.option, Pt.tbody = Pt.tfoot = Pt.colgroup = Pt.caption = Pt.thead, Pt.th = Pt.td;
        var Ft = /<|&#?\w+;/,
            Wt = /<tbody/i;
        ! function() {
            var e, n, i = it.createElement("div");
            for (e in {
                    submit: !0,
                    change: !0,
                    focusin: !0
                }) n = "on" + e, (dt[e] = n in t) || (i.setAttribute(n, "t"), dt[e] = i.attributes[n].expando === !1);
            i = null
        }();
        var Bt = /^(?:input|select|textarea)$/i,
            Ut = /^key/,
            zt = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
            Vt = /^(?:focusinfocus|focusoutblur)$/,
            Xt = /^([^.]*)(?:\.(.+)|)/;
        ft.event = {
            global: {},
            add: function(t, e, n, i, o) {
                var r, s, a, l, c, u, d, f, p, h, m, g = ft._data(t);
                if (g) {
                    for (n.handler && (l = n, n = l.handler, o = l.selector), n.guid || (n.guid = ft.guid++), (s = g.events) || (s = g.events = {}), (u = g.handle) || (u = g.handle = function(t) {
                            return void 0 === ft || t && ft.event.triggered === t.type ? void 0 : ft.event.dispatch.apply(u.elem, arguments)
                        }, u.elem = t), e = (e || "").match(Tt) || [""], a = e.length; a--;) r = Xt.exec(e[a]) || [], p = m = r[1], h = (r[2] || "").split(".").sort(), p && (c = ft.event.special[p] || {}, p = (o ? c.delegateType : c.bindType) || p, c = ft.event.special[p] || {}, d = ft.extend({
                        type: p,
                        origType: m,
                        data: i,
                        handler: n,
                        guid: n.guid,
                        selector: o,
                        needsContext: o && ft.expr.match.needsContext.test(o),
                        namespace: h.join(".")
                    }, l), (f = s[p]) || (f = s[p] = [], f.delegateCount = 0, c.setup && c.setup.call(t, i, h, u) !== !1 || (t.addEventListener ? t.addEventListener(p, u, !1) : t.attachEvent && t.attachEvent("on" + p, u))), c.add && (c.add.call(t, d), d.handler.guid || (d.handler.guid = n.guid)), o ? f.splice(f.delegateCount++, 0, d) : f.push(d), ft.event.global[p] = !0);
                    t = null
                }
            },
            remove: function(t, e, n, i, o) {
                var r, s, a, l, c, u, d, f, p, h, m, g = ft.hasData(t) && ft._data(t);
                if (g && (u = g.events)) {
                    for (e = (e || "").match(Tt) || [""], c = e.length; c--;)
                        if (a = Xt.exec(e[c]) || [], p = m = a[1], h = (a[2] || "").split(".").sort(), p) {
                            for (d = ft.event.special[p] || {}, p = (i ? d.delegateType : d.bindType) || p, f = u[p] || [], a = a[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"), l = r = f.length; r--;) s = f[r], !o && m !== s.origType || n && n.guid !== s.guid || a && !a.test(s.namespace) || i && i !== s.selector && ("**" !== i || !s.selector) || (f.splice(r, 1), s.selector && f.delegateCount--, d.remove && d.remove.call(t, s));
                            l && !f.length && (d.teardown && d.teardown.call(t, h, g.handle) !== !1 || ft.removeEvent(t, p, g.handle), delete u[p])
                        } else
                            for (p in u) ft.event.remove(t, p + e[c], n, i, !0);
                    ft.isEmptyObject(u) && (delete g.handle, ft._removeData(t, "events"))
                }
            },
            trigger: function(e, n, i, o) {
                var r, s, a, l, c, u, d, f = [i || it],
                    p = ut.call(e, "type") ? e.type : e,
                    h = ut.call(e, "namespace") ? e.namespace.split(".") : [];
                if (a = u = i = i || it, 3 !== i.nodeType && 8 !== i.nodeType && !Vt.test(p + ft.event.triggered) && (p.indexOf(".") > -1 && (h = p.split("."), p = h.shift(), h.sort()), s = p.indexOf(":") < 0 && "on" + p, e = e[ft.expando] ? e : new ft.Event(p, "object" == typeof e && e), e.isTrigger = o ? 2 : 3, e.namespace = h.join("."), e.rnamespace = e.namespace ? new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, e.result = void 0, e.target || (e.target = i), n = null == n ? [e] : ft.makeArray(n, [e]), c = ft.event.special[p] || {}, o || !c.trigger || c.trigger.apply(i, n) !== !1)) {
                    if (!o && !c.noBubble && !ft.isWindow(i)) {
                        for (l = c.delegateType || p, Vt.test(l + p) || (a = a.parentNode); a; a = a.parentNode) f.push(a), u = a;
                        u === (i.ownerDocument || it) && f.push(u.defaultView || u.parentWindow || t)
                    }
                    for (d = 0;
                        (a = f[d++]) && !e.isPropagationStopped();) e.type = d > 1 ? l : c.bindType || p, r = (ft._data(a, "events") || {})[e.type] && ft._data(a, "handle"), r && r.apply(a, n), (r = s && a[s]) && r.apply && Et(a) && (e.result = r.apply(a, n), e.result === !1 && e.preventDefault());
                    if (e.type = p, !o && !e.isDefaultPrevented() && (!c._default || c._default.apply(f.pop(), n) === !1) && Et(i) && s && i[p] && !ft.isWindow(i)) {
                        u = i[s], u && (i[s] = null), ft.event.triggered = p;
                        try {
                            i[p]()
                        } catch (t) {}
                        ft.event.triggered = void 0, u && (i[s] = u)
                    }
                    return e.result
                }
            },
            dispatch: function(t) {
                t = ft.event.fix(t);
                var e, n, i, o, r, s = [],
                    a = ot.call(arguments),
                    l = (ft._data(this, "events") || {})[t.type] || [],
                    c = ft.event.special[t.type] || {};
                if (a[0] = t, t.delegateTarget = this, !c.preDispatch || c.preDispatch.call(this, t) !== !1) {
                    for (s = ft.event.handlers.call(this, t, l), e = 0;
                        (o = s[e++]) && !t.isPropagationStopped();)
                        for (t.currentTarget = o.elem, n = 0;
                            (r = o.handlers[n++]) && !t.isImmediatePropagationStopped();) t.rnamespace && !t.rnamespace.test(r.namespace) || (t.handleObj = r, t.data = r.data, void 0 !== (i = ((ft.event.special[r.origType] || {}).handle || r.handler).apply(o.elem, a)) && (t.result = i) === !1 && (t.preventDefault(), t.stopPropagation()));
                    return c.postDispatch && c.postDispatch.call(this, t), t.result
                }
            },
            handlers: function(t, e) {
                var n, i, o, r, s = [],
                    a = e.delegateCount,
                    l = t.target;
                if (a && l.nodeType && ("click" !== t.type || isNaN(t.button) || t.button < 1))
                    for (; l != this; l = l.parentNode || this)
                        if (1 === l.nodeType && (l.disabled !== !0 || "click" !== t.type)) {
                            for (i = [], n = 0; n < a; n++) r = e[n], o = r.selector + " ", void 0 === i[o] && (i[o] = r.needsContext ? ft(o, this).index(l) > -1 : ft.find(o, this, null, [l]).length), i[o] && i.push(r);
                            i.length && s.push({
                                elem: l,
                                handlers: i
                            })
                        }
                return a < e.length && s.push({
                    elem: this,
                    handlers: e.slice(a)
                }), s
            },
            fix: function(t) {
                if (t[ft.expando]) return t;
                var e, n, i, o = t.type,
                    r = t,
                    s = this.fixHooks[o];
                for (s || (this.fixHooks[o] = s = zt.test(o) ? this.mouseHooks : Ut.test(o) ? this.keyHooks : {}), i = s.props ? this.props.concat(s.props) : this.props, t = new ft.Event(r), e = i.length; e--;) n = i[e], t[n] = r[n];
                return t.target || (t.target = r.srcElement || it), 3 === t.target.nodeType && (t.target = t.target.parentNode), t.metaKey = !!t.metaKey, s.filter ? s.filter(t, r) : t
            },
            props: "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
            fixHooks: {},
            keyHooks: {
                props: "char charCode key keyCode".split(" "),
                filter: function(t, e) {
                    return null == t.which && (t.which = null != e.charCode ? e.charCode : e.keyCode), t
                }
            },
            mouseHooks: {
                props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                filter: function(t, e) {
                    var n, i, o, r = e.button,
                        s = e.fromElement;
                    return null == t.pageX && null != e.clientX && (i = t.target.ownerDocument || it, o = i.documentElement, n = i.body, t.pageX = e.clientX + (o && o.scrollLeft || n && n.scrollLeft || 0) - (o && o.clientLeft || n && n.clientLeft || 0), t.pageY = e.clientY + (o && o.scrollTop || n && n.scrollTop || 0) - (o && o.clientTop || n && n.clientTop || 0)), !t.relatedTarget && s && (t.relatedTarget = s === t.target ? e.toElement : s), t.which || void 0 === r || (t.which = 1 & r ? 1 : 2 & r ? 3 : 4 & r ? 2 : 0), t
                }
            },
            special: {
                load: {
                    noBubble: !0
                },
                focus: {
                    trigger: function() {
                        if (this !== w() && this.focus) try {
                            return this.focus(), !1
                        } catch (t) {}
                    },
                    delegateType: "focusin"
                },
                blur: {
                    trigger: function() {
                        if (this === w() && this.blur) return this.blur(), !1
                    },
                    delegateType: "focusout"
                },
                click: {
                    trigger: function() {
                        if (ft.nodeName(this, "input") && "checkbox" === this.type && this.click) return this.click(), !1
                    },
                    _default: function(t) {
                        return ft.nodeName(t.target, "a")
                    }
                },
                beforeunload: {
                    postDispatch: function(t) {
                        void 0 !== t.result && t.originalEvent && (t.originalEvent.returnValue = t.result)
                    }
                }
            },
            simulate: function(t, e, n) {
                var i = ft.extend(new ft.Event, n, {
                    type: t,
                    isSimulated: !0
                });
                ft.event.trigger(i, null, e), i.isDefaultPrevented() && n.preventDefault()
            }
        }, ft.removeEvent = it.removeEventListener ? function(t, e, n) {
            t.removeEventListener && t.removeEventListener(e, n)
        } : function(t, e, n) {
            var i = "on" + e;
            t.detachEvent && (void 0 === t[i] && (t[i] = null), t.detachEvent(i, n))
        }, ft.Event = function(t, e) {
            if (!(this instanceof ft.Event)) return new ft.Event(t, e);
            t && t.type ? (this.originalEvent = t, this.type = t.type, this.isDefaultPrevented = t.defaultPrevented || void 0 === t.defaultPrevented && t.returnValue === !1 ? y : b) : this.type = t, e && ft.extend(this, e), this.timeStamp = t && t.timeStamp || ft.now(), this[ft.expando] = !0
        }, ft.Event.prototype = {
            constructor: ft.Event,
            isDefaultPrevented: b,
            isPropagationStopped: b,
            isImmediatePropagationStopped: b,
            preventDefault: function() {
                var t = this.originalEvent;
                this.isDefaultPrevented = y, t && (t.preventDefault ? t.preventDefault() : t.returnValue = !1)
            },
            stopPropagation: function() {
                var t = this.originalEvent;
                this.isPropagationStopped = y, t && !this.isSimulated && (t.stopPropagation && t.stopPropagation(), t.cancelBubble = !0)
            },
            stopImmediatePropagation: function() {
                var t = this.originalEvent;
                this.isImmediatePropagationStopped = y, t && t.stopImmediatePropagation && t.stopImmediatePropagation(), this.stopPropagation()
            }
        }, ft.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout",
            pointerenter: "pointerover",
            pointerleave: "pointerout"
        }, function(t, e) {
            ft.event.special[t] = {
                delegateType: e,
                bindType: e,
                handle: function(t) {
                    var n, i = this,
                        o = t.relatedTarget,
                        r = t.handleObj;
                    return o && (o === i || ft.contains(i, o)) || (t.type = r.origType, n = r.handler.apply(this, arguments), t.type = e), n
                }
            }
        }), dt.submit || (ft.event.special.submit = {
            setup: function() {
                if (ft.nodeName(this, "form")) return !1;
                ft.event.add(this, "click._submit keypress._submit", function(t) {
                    var e = t.target,
                        n = ft.nodeName(e, "input") || ft.nodeName(e, "button") ? ft.prop(e, "form") : void 0;
                    n && !ft._data(n, "submit") && (ft.event.add(n, "submit._submit", function(t) {
                        t._submitBubble = !0
                    }), ft._data(n, "submit", !0))
                })
            },
            postDispatch: function(t) {
                t._submitBubble && (delete t._submitBubble, this.parentNode && !t.isTrigger && ft.event.simulate("submit", this.parentNode, t))
            },
            teardown: function() {
                if (ft.nodeName(this, "form")) return !1;
                ft.event.remove(this, "._submit")
            }
        }), dt.change || (ft.event.special.change = {
            setup: function() {
                if (Bt.test(this.nodeName)) return "checkbox" !== this.type && "radio" !== this.type || (ft.event.add(this, "propertychange._change", function(t) {
                    "checked" === t.originalEvent.propertyName && (this._justChanged = !0)
                }), ft.event.add(this, "click._change", function(t) {
                    this._justChanged && !t.isTrigger && (this._justChanged = !1), ft.event.simulate("change", this, t)
                })), !1;
                ft.event.add(this, "beforeactivate._change", function(t) {
                    var e = t.target;
                    Bt.test(e.nodeName) && !ft._data(e, "change") && (ft.event.add(e, "change._change", function(t) {
                        !this.parentNode || t.isSimulated || t.isTrigger || ft.event.simulate("change", this.parentNode, t)
                    }), ft._data(e, "change", !0))
                })
            },
            handle: function(t) {
                var e = t.target;
                if (this !== e || t.isSimulated || t.isTrigger || "radio" !== e.type && "checkbox" !== e.type) return t.handleObj.handler.apply(this, arguments)
            },
            teardown: function() {
                return ft.event.remove(this, "._change"), !Bt.test(this.nodeName)
            }
        }), dt.focusin || ft.each({
            focus: "focusin",
            blur: "focusout"
        }, function(t, e) {
            var n = function(t) {
                ft.event.simulate(e, t.target, ft.event.fix(t))
            };
            ft.event.special[e] = {
                setup: function() {
                    var i = this.ownerDocument || this,
                        o = ft._data(i, e);
                    o || i.addEventListener(t, n, !0), ft._data(i, e, (o || 0) + 1)
                },
                teardown: function() {
                    var i = this.ownerDocument || this,
                        o = ft._data(i, e) - 1;
                    o ? ft._data(i, e, o) : (i.removeEventListener(t, n, !0), ft._removeData(i, e))
                }
            }
        }), ft.fn.extend({
            on: function(t, e, n, i) {
                return x(this, t, e, n, i)
            },
            one: function(t, e, n, i) {
                return x(this, t, e, n, i, 1)
            },
            off: function(t, e, n) {
                var i, o;
                if (t && t.preventDefault && t.handleObj) return i = t.handleObj, ft(t.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
                if ("object" == typeof t) {
                    for (o in t) this.off(o, e, t[o]);
                    return this
                }
                return e !== !1 && "function" != typeof e || (n = e, e = void 0), n === !1 && (n = b), this.each(function() {
                    ft.event.remove(this, t, n, e)
                })
            },
            trigger: function(t, e) {
                return this.each(function() {
                    ft.event.trigger(t, e, this)
                })
            },
            triggerHandler: function(t, e) {
                var n = this[0];
                if (n) return ft.event.trigger(t, e, n, !0)
            }
        });
        var Qt = new RegExp("<(?:" + Ht + ")[\\s/>]", "i"),
            Gt = /<script|<style|<link/i,
            Jt = /checked\s*(?:[^=]|=\s*.checked.)/i,
            Yt = /^true\/(.*)/,
            Kt = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
            Zt = p(it),
            te = Zt.appendChild(it.createElement("div"));
        ft.extend({
            htmlPrefilter: function(t) {
                return t.replace(/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi, "<$1></$2>")
            },
            clone: function(t, e, n) {
                var i, o, r, s, a, l = ft.contains(t.ownerDocument, t);
                if (dt.html5Clone || ft.isXMLDoc(t) || !Qt.test("<" + t.nodeName + ">") ? r = t.cloneNode(!0) : (te.innerHTML = t.outerHTML, te.removeChild(r = te.firstChild)), !(dt.noCloneEvent && dt.noCloneChecked || 1 !== t.nodeType && 11 !== t.nodeType || ft.isXMLDoc(t)))
                    for (i = h(r), a = h(t), s = 0; null != (o = a[s]); ++s) i[s] && C(o, i[s]);
                if (e)
                    if (n)
                        for (a = a || h(t), i = i || h(r), s = 0; null != (o = a[s]); s++) $(o, i[s]);
                    else $(t, r);
                return i = h(r, "script"), i.length > 0 && m(i, !l && h(t, "script")), i = a = o = null, r
            },
            cleanData: function(t, e) {
                for (var n, i, o, r, s = 0, a = ft.expando, l = ft.cache, c = dt.attributes, u = ft.event.special; null != (n = t[s]); s++)
                    if ((e || Et(n)) && (o = n[a], r = o && l[o])) {
                        if (r.events)
                            for (i in r.events) u[i] ? ft.event.remove(n, i) : ft.removeEvent(n, i, r.handle);
                        l[o] && (delete l[o], c || void 0 === n.removeAttribute ? n[a] = void 0 : n.removeAttribute(a), nt.push(o))
                    }
            }
        }), ft.fn.extend({
            domManip: E,
            detach: function(t) {
                return S(this, t, !0)
            },
            remove: function(t) {
                return S(this, t)
            },
            text: function(t) {
                return Ot(this, function(t) {
                    return void 0 === t ? ft.text(this) : this.empty().append((this[0] && this[0].ownerDocument || it).createTextNode(t))
                }, null, t, arguments.length)
            },
            append: function() {
                return E(this, arguments, function(t) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        _(this, t).appendChild(t)
                    }
                })
            },
            prepend: function() {
                return E(this, arguments, function(t) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var e = _(this, t);
                        e.insertBefore(t, e.firstChild)
                    }
                })
            },
            before: function() {
                return E(this, arguments, function(t) {
                    this.parentNode && this.parentNode.insertBefore(t, this)
                })
            },
            after: function() {
                return E(this, arguments, function(t) {
                    this.parentNode && this.parentNode.insertBefore(t, this.nextSibling)
                })
            },
            empty: function() {
                for (var t, e = 0; null != (t = this[e]); e++) {
                    for (1 === t.nodeType && ft.cleanData(h(t, !1)); t.firstChild;) t.removeChild(t.firstChild);
                    t.options && ft.nodeName(t, "select") && (t.options.length = 0)
                }
                return this
            },
            clone: function(t, e) {
                return t = null != t && t, e = null == e ? t : e, this.map(function() {
                    return ft.clone(this, t, e)
                })
            },
            html: function(t) {
                return Ot(this, function(t) {
                    var e = this[0] || {},
                        n = 0,
                        i = this.length;
                    if (void 0 === t) return 1 === e.nodeType ? e.innerHTML.replace(/ jQuery\d+="(?:null|\d+)"/g, "") : void 0;
                    if ("string" == typeof t && !Gt.test(t) && (dt.htmlSerialize || !Qt.test(t)) && (dt.leadingWhitespace || !Rt.test(t)) && !Pt[(It.exec(t) || ["", ""])[1].toLowerCase()]) {
                        t = ft.htmlPrefilter(t);
                        try {
                            for (; n < i; n++) e = this[n] || {}, 1 === e.nodeType && (ft.cleanData(h(e, !1)), e.innerHTML = t);
                            e = 0
                        } catch (t) {}
                    }
                    e && this.empty().append(t)
                }, null, t, arguments.length)
            },
            replaceWith: function() {
                var t = [];
                return E(this, arguments, function(e) {
                    var n = this.parentNode;
                    ft.inArray(this, t) < 0 && (ft.cleanData(h(this)), n && n.replaceChild(e, this))
                }, t)
            }
        }), ft.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, function(t, e) {
            ft.fn[t] = function(t) {
                for (var n, i = 0, o = [], r = ft(t), s = r.length - 1; i <= s; i++) n = i === s ? this : this.clone(!0), ft(r[i])[e](n), st.apply(o, n.get());
                return this.pushStack(o)
            }
        });
        var ee, ne = {
                HTML: "block",
                BODY: "block"
            },
            ie = /^margin/,
            oe = new RegExp("^(" + Dt + ")(?!px)[a-z%]+$", "i"),
            re = function(t, e, n, i) {
                var o, r, s = {};
                for (r in e) s[r] = t.style[r], t.style[r] = e[r];
                o = n.apply(t, i || []);
                for (r in e) t.style[r] = s[r];
                return o
            },
            se = it.documentElement;
        ! function() {
            function e() {
                var e, u, d = it.documentElement;
                d.appendChild(l), c.style.cssText = "-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%", n = o = a = !1, i = s = !0, t.getComputedStyle && (u = t.getComputedStyle(c), n = "1%" !== (u || {}).top, a = "2px" === (u || {}).marginLeft, o = "4px" === (u || {
                    width: "4px"
                }).width, c.style.marginRight = "50%", i = "4px" === (u || {
                    marginRight: "4px"
                }).marginRight, e = c.appendChild(it.createElement("div")), e.style.cssText = c.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", e.style.marginRight = e.style.width = "0", c.style.width = "1px", s = !parseFloat((t.getComputedStyle(e) || {}).marginRight), c.removeChild(e)), c.style.display = "none", r = 0 === c.getClientRects().length, r && (c.style.display = "", c.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", e = c.getElementsByTagName("td"), e[0].style.cssText = "margin:0;border:0;padding:0;display:none", (r = 0 === e[0].offsetHeight) && (e[0].style.display = "", e[1].style.display = "none", r = 0 === e[0].offsetHeight)), d.removeChild(l)
            }
            var n, i, o, r, s, a, l = it.createElement("div"),
                c = it.createElement("div");
            c.style && (c.style.cssText = "float:left;opacity:.5", dt.opacity = "0.5" === c.style.opacity, dt.cssFloat = !!c.style.cssFloat, c.style.backgroundClip = "content-box", c.cloneNode(!0).style.backgroundClip = "", dt.clearCloneStyle = "content-box" === c.style.backgroundClip, l = it.createElement("div"), l.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute", c.innerHTML = "", l.appendChild(c), dt.boxSizing = "" === c.style.boxSizing || "" === c.style.MozBoxSizing || "" === c.style.WebkitBoxSizing, ft.extend(dt, {
                reliableHiddenOffsets: function() {
                    return null == n && e(), r
                },
                boxSizingReliable: function() {
                    return null == n && e(), o
                },
                pixelMarginRight: function() {
                    return null == n && e(), i
                },
                pixelPosition: function() {
                    return null == n && e(), n
                },
                reliableMarginRight: function() {
                    return null == n && e(), s
                },
                reliableMarginLeft: function() {
                    return null == n && e(), a
                }
            }))
        }();
        var ae, le, ce = /^(top|right|bottom|left)$/;
        t.getComputedStyle ? (ae = function(e) {
            var n = e.ownerDocument.defaultView;
            return n && n.opener || (n = t), n.getComputedStyle(e)
        }, le = function(t, e, n) {
            var i, o, r, s, a = t.style;
            return n = n || ae(t), s = n ? n.getPropertyValue(e) || n[e] : void 0, "" !== s && void 0 !== s || ft.contains(t.ownerDocument, t) || (s = ft.style(t, e)), n && !dt.pixelMarginRight() && oe.test(s) && ie.test(e) && (i = a.width, o = a.minWidth, r = a.maxWidth, a.minWidth = a.maxWidth = a.width = s, s = n.width, a.width = i, a.minWidth = o, a.maxWidth = r), void 0 === s ? s : s + ""
        }) : se.currentStyle && (ae = function(t) {
            return t.currentStyle
        }, le = function(t, e, n) {
            var i, o, r, s, a = t.style;
            return n = n || ae(t), s = n ? n[e] : void 0, null == s && a && a[e] && (s = a[e]), oe.test(s) && !ce.test(e) && (i = a.left, o = t.runtimeStyle, r = o && o.left, r && (o.left = t.currentStyle.left), a.left = "fontSize" === e ? "1em" : s, s = a.pixelLeft + "px", a.left = i, r && (o.left = r)), void 0 === s ? s : s + "" || "auto"
        });
        var ue = /alpha\([^)]*\)/i,
            de = /opacity\s*=\s*([^)]*)/i,
            fe = /^(none|table(?!-c[ea]).+)/,
            pe = new RegExp("^(" + Dt + ")(.*)$", "i"),
            he = {
                position: "absolute",
                visibility: "hidden",
                display: "block"
            },
            me = {
                letterSpacing: "0",
                fontWeight: "400"
            },
            ge = ["Webkit", "O", "Moz", "ms"],
            ve = it.createElement("div").style;
        ft.extend({
            cssHooks: {
                opacity: {
                    get: function(t, e) {
                        if (e) {
                            var n = le(t, "opacity");
                            return "" === n ? "1" : n
                        }
                    }
                }
            },
            cssNumber: {
                animationIterationCount: !0,
                columnCount: !0,
                fillOpacity: !0,
                flexGrow: !0,
                flexShrink: !0,
                fontWeight: !0,
                lineHeight: !0,
                opacity: !0,
                order: !0,
                orphans: !0,
                widows: !0,
                zIndex: !0,
                zoom: !0
            },
            cssProps: {
                float: dt.cssFloat ? "cssFloat" : "styleFloat"
            },
            style: function(t, e, n, i) {
                if (t && 3 !== t.nodeType && 8 !== t.nodeType && t.style) {
                    var o, r, s, a = ft.camelCase(e),
                        l = t.style;
                    if (e = ft.cssProps[a] || (ft.cssProps[a] = A(a) || a), s = ft.cssHooks[e] || ft.cssHooks[a], void 0 === n) return s && "get" in s && void 0 !== (o = s.get(t, !1, i)) ? o : l[e];
                    if (r = typeof n, "string" === r && (o = jt.exec(n)) && o[1] && (n = f(t, e, o), r = "number"), null != n && n === n && ("number" === r && (n += o && o[3] || (ft.cssNumber[a] ? "" : "px")), dt.clearCloneStyle || "" !== n || 0 !== e.indexOf("background") || (l[e] = "inherit"), !(s && "set" in s && void 0 === (n = s.set(t, n, i))))) try {
                        l[e] = n
                    } catch (t) {}
                }
            },
            css: function(t, e, n, i) {
                var o, r, s, a = ft.camelCase(e);
                return e = ft.cssProps[a] || (ft.cssProps[a] = A(a) || a), s = ft.cssHooks[e] || ft.cssHooks[a], s && "get" in s && (r = s.get(t, !0, n)), void 0 === r && (r = le(t, e, i)), "normal" === r && e in me && (r = me[e]), "" === n || n ? (o = parseFloat(r), n === !0 || isFinite(o) ? o || 0 : r) : r
            }
        }), ft.each(["height", "width"], function(t, e) {
            ft.cssHooks[e] = {
                get: function(t, n, i) {
                    if (n) return fe.test(ft.css(t, "display")) && 0 === t.offsetWidth ? re(t, he, function() {
                        return I(t, e, i)
                    }) : I(t, e, i)
                },
                set: function(t, n, i) {
                    var o = i && ae(t);
                    return O(t, n, i ? q(t, e, i, dt.boxSizing && "border-box" === ft.css(t, "boxSizing", !1, o), o) : 0)
                }
            }
        }), dt.opacity || (ft.cssHooks.opacity = {
            get: function(t, e) {
                return de.test((e && t.currentStyle ? t.currentStyle.filter : t.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : e ? "1" : ""
            },
            set: function(t, e) {
                var n = t.style,
                    i = t.currentStyle,
                    o = ft.isNumeric(e) ? "alpha(opacity=" + 100 * e + ")" : "",
                    r = i && i.filter || n.filter || "";
                n.zoom = 1, (e >= 1 || "" === e) && "" === ft.trim(r.replace(ue, "")) && n.removeAttribute && (n.removeAttribute("filter"), "" === e || i && !i.filter) || (n.filter = ue.test(r) ? r.replace(ue, o) : r + " " + o)
            }
        }), ft.cssHooks.marginRight = j(dt.reliableMarginRight, function(t, e) {
            if (e) return re(t, {
                display: "inline-block"
            }, le, [t, "marginRight"])
        }), ft.cssHooks.marginLeft = j(dt.reliableMarginLeft, function(t, e) {
            if (e) return (parseFloat(le(t, "marginLeft")) || (ft.contains(t.ownerDocument, t) ? t.getBoundingClientRect().left - re(t, {
                marginLeft: 0
            }, function() {
                return t.getBoundingClientRect().left
            }) : 0)) + "px"
        }), ft.each({
            margin: "",
            padding: "",
            border: "Width"
        }, function(t, e) {
            ft.cssHooks[t + e] = {
                expand: function(n) {
                    for (var i = 0, o = {}, r = "string" == typeof n ? n.split(" ") : [n]; i < 4; i++) o[t + At[i] + e] = r[i] || r[i - 2] || r[0];
                    return o
                }
            }, ie.test(t) || (ft.cssHooks[t + e].set = O)
        }), ft.fn.extend({
            css: function(t, e) {
                return Ot(this, function(t, e, n) {
                    var i, o, r = {},
                        s = 0;
                    if (ft.isArray(e)) {
                        for (i = ae(t), o = e.length; s < o; s++) r[e[s]] = ft.css(t, e[s], !1, i);
                        return r
                    }
                    return void 0 !== n ? ft.style(t, e, n) : ft.css(t, e)
                }, t, e, arguments.length > 1)
            },
            show: function() {
                return L(this, !0)
            },
            hide: function() {
                return L(this)
            },
            toggle: function(t) {
                return "boolean" == typeof t ? t ? this.show() : this.hide() : this.each(function() {
                    Lt(this) ? ft(this).show() : ft(this).hide()
                })
            }
        }), ft.Tween = M, M.prototype = {
            constructor: M,
            init: function(t, e, n, i, o, r) {
                this.elem = t, this.prop = n, this.easing = o || ft.easing._default, this.options = e, this.start = this.now = this.cur(), this.end = i, this.unit = r || (ft.cssNumber[n] ? "" : "px")
            },
            cur: function() {
                var t = M.propHooks[this.prop];
                return t && t.get ? t.get(this) : M.propHooks._default.get(this)
            },
            run: function(t) {
                var e, n = M.propHooks[this.prop];
                return this.options.duration ? this.pos = e = ft.easing[this.easing](t, this.options.duration * t, 0, 1, this.options.duration) : this.pos = e = t, this.now = (this.end - this.start) * e + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : M.propHooks._default.set(this), this
            }
        }, M.prototype.init.prototype = M.prototype, M.propHooks = {
            _default: {
                get: function(t) {
                    var e;
                    return 1 !== t.elem.nodeType || null != t.elem[t.prop] && null == t.elem.style[t.prop] ? t.elem[t.prop] : (e = ft.css(t.elem, t.prop, ""), e && "auto" !== e ? e : 0)
                },
                set: function(t) {
                    ft.fx.step[t.prop] ? ft.fx.step[t.prop](t) : 1 !== t.elem.nodeType || null == t.elem.style[ft.cssProps[t.prop]] && !ft.cssHooks[t.prop] ? t.elem[t.prop] = t.now : ft.style(t.elem, t.prop, t.now + t.unit)
                }
            }
        }, M.propHooks.scrollTop = M.propHooks.scrollLeft = {
            set: function(t) {
                t.elem.nodeType && t.elem.parentNode && (t.elem[t.prop] = t.now)
            }
        }, ft.easing = {
            linear: function(t) {
                return t
            },
            swing: function(t) {
                return .5 - Math.cos(t * Math.PI) / 2
            },
            _default: "swing"
        }, ft.fx = M.prototype.init, ft.fx.step = {};
        var ye, be, we = /^(?:toggle|show|hide)$/,
            xe = /queueHooks$/;
        ft.Animation = ft.extend(B, {
                tweeners: {
                    "*": [function(t, e) {
                        var n = this.createTween(t, e);
                        return f(n.elem, t, jt.exec(e), n), n
                    }]
                },
                tweener: function(t, e) {
                    ft.isFunction(t) ? (e = t, t = ["*"]) : t = t.match(Tt);
                    for (var n, i = 0, o = t.length; i < o; i++) n = t[i], B.tweeners[n] = B.tweeners[n] || [], B.tweeners[n].unshift(e)
                },
                prefilters: [F],
                prefilter: function(t, e) {
                    e ? B.prefilters.unshift(t) : B.prefilters.push(t)
                }
            }), ft.speed = function(t, e, n) {
                var i = t && "object" == typeof t ? ft.extend({}, t) : {
                    complete: n || !n && e || ft.isFunction(t) && t,
                    duration: t,
                    easing: n && e || e && !ft.isFunction(e) && e
                };
                return i.duration = ft.fx.off ? 0 : "number" == typeof i.duration ? i.duration : i.duration in ft.fx.speeds ? ft.fx.speeds[i.duration] : ft.fx.speeds._default, null != i.queue && i.queue !== !0 || (i.queue = "fx"), i.old = i.complete, i.complete = function() {
                    ft.isFunction(i.old) && i.old.call(this), i.queue && ft.dequeue(this, i.queue)
                }, i
            }, ft.fn.extend({
                fadeTo: function(t, e, n, i) {
                    return this.filter(Lt).css("opacity", 0).show().end().animate({
                        opacity: e
                    }, t, n, i)
                },
                animate: function(t, e, n, i) {
                    var o = ft.isEmptyObject(t),
                        r = ft.speed(e, n, i),
                        s = function() {
                            var e = B(this, ft.extend({}, t), r);
                            (o || ft._data(this, "finish")) && e.stop(!0)
                        };
                    return s.finish = s, o || r.queue === !1 ? this.each(s) : this.queue(r.queue, s)
                },
                stop: function(t, e, n) {
                    var i = function(t) {
                        var e = t.stop;
                        delete t.stop, e(n)
                    };
                    return "string" != typeof t && (n = e, e = t, t = void 0), e && t !== !1 && this.queue(t || "fx", []), this.each(function() {
                        var e = !0,
                            o = null != t && t + "queueHooks",
                            r = ft.timers,
                            s = ft._data(this);
                        if (o) s[o] && s[o].stop && i(s[o]);
                        else
                            for (o in s) s[o] && s[o].stop && xe.test(o) && i(s[o]);
                        for (o = r.length; o--;) r[o].elem !== this || null != t && r[o].queue !== t || (r[o].anim.stop(n), e = !1, r.splice(o, 1));
                        !e && n || ft.dequeue(this, t)
                    })
                },
                finish: function(t) {
                    return t !== !1 && (t = t || "fx"), this.each(function() {
                        var e, n = ft._data(this),
                            i = n[t + "queue"],
                            o = n[t + "queueHooks"],
                            r = ft.timers,
                            s = i ? i.length : 0;
                        for (n.finish = !0, ft.queue(this, t, []), o && o.stop && o.stop.call(this, !0), e = r.length; e--;) r[e].elem === this && r[e].queue === t && (r[e].anim.stop(!0), r.splice(e, 1));
                        for (e = 0; e < s; e++) i[e] && i[e].finish && i[e].finish.call(this);
                        delete n.finish
                    })
                }
            }), ft.each(["toggle", "show", "hide"], function(t, e) {
                var n = ft.fn[e];
                ft.fn[e] = function(t, i, o) {
                    return null == t || "boolean" == typeof t ? n.apply(this, arguments) : this.animate(H(e, !0), t, i, o)
                }
            }), ft.each({
                slideDown: H("show"),
                slideUp: H("hide"),
                slideToggle: H("toggle"),
                fadeIn: {
                    opacity: "show"
                },
                fadeOut: {
                    opacity: "hide"
                },
                fadeToggle: {
                    opacity: "toggle"
                }
            }, function(t, e) {
                ft.fn[t] = function(t, n, i) {
                    return this.animate(e, t, n, i)
                }
            }), ft.timers = [], ft.fx.tick = function() {
                var t, e = ft.timers,
                    n = 0;
                for (ye = ft.now(); n < e.length; n++)(t = e[n])() || e[n] !== t || e.splice(n--, 1);
                e.length || ft.fx.stop(), ye = void 0
            }, ft.fx.timer = function(t) {
                ft.timers.push(t), t() ? ft.fx.start() : ft.timers.pop()
            }, ft.fx.interval = 13, ft.fx.start = function() {
                be || (be = t.setInterval(ft.fx.tick, ft.fx.interval))
            }, ft.fx.stop = function() {
                t.clearInterval(be), be = null
            }, ft.fx.speeds = {
                slow: 600,
                fast: 200,
                _default: 400
            }, ft.fn.delay = function(e, n) {
                return e = ft.fx ? ft.fx.speeds[e] || e : e, n = n || "fx", this.queue(n, function(n, i) {
                    var o = t.setTimeout(n, e);
                    i.stop = function() {
                        t.clearTimeout(o)
                    }
                })
            },
            function() {
                var t, e = it.createElement("input"),
                    n = it.createElement("div"),
                    i = it.createElement("select"),
                    o = i.appendChild(it.createElement("option"));
                n = it.createElement("div"), n.setAttribute("className", "t"), n.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", t = n.getElementsByTagName("a")[0], e.setAttribute("type", "checkbox"), n.appendChild(e), t = n.getElementsByTagName("a")[0], t.style.cssText = "top:1px", dt.getSetAttribute = "t" !== n.className, dt.style = /top/.test(t.getAttribute("style")), dt.hrefNormalized = "/a" === t.getAttribute("href"), dt.checkOn = !!e.value, dt.optSelected = o.selected, dt.enctype = !!it.createElement("form").enctype, i.disabled = !0, dt.optDisabled = !o.disabled, e = it.createElement("input"), e.setAttribute("value", ""), dt.input = "" === e.getAttribute("value"), e.value = "t", e.setAttribute("type", "radio"), dt.radioValue = "t" === e.value
            }();
        ft.fn.extend({
            val: function(t) {
                var e, n, i, o = this[0];
                if (arguments.length) return i = ft.isFunction(t), this.each(function(n) {
                    var o;
                    1 === this.nodeType && (o = i ? t.call(this, n, ft(this).val()) : t, null == o ? o = "" : "number" == typeof o ? o += "" : ft.isArray(o) && (o = ft.map(o, function(t) {
                        return null == t ? "" : t + ""
                    })), (e = ft.valHooks[this.type] || ft.valHooks[this.nodeName.toLowerCase()]) && "set" in e && void 0 !== e.set(this, o, "value") || (this.value = o))
                });
                if (o) return (e = ft.valHooks[o.type] || ft.valHooks[o.nodeName.toLowerCase()]) && "get" in e && void 0 !== (n = e.get(o, "value")) ? n : (n = o.value, "string" == typeof n ? n.replace(/\r/g, "") : null == n ? "" : n)
            }
        }), ft.extend({
            valHooks: {
                option: {
                    get: function(t) {
                        var e = ft.find.attr(t, "value");
                        return null != e ? e : ft.trim(ft.text(t)).replace(/[\x20\t\r\n\f]+/g, " ")
                    }
                },
                select: {
                    get: function(t) {
                        for (var e, n, i = t.options, o = t.selectedIndex, r = "select-one" === t.type || o < 0, s = r ? null : [], a = r ? o + 1 : i.length, l = o < 0 ? a : r ? o : 0; l < a; l++)
                            if (n = i[l], (n.selected || l === o) && (dt.optDisabled ? !n.disabled : null === n.getAttribute("disabled")) && (!n.parentNode.disabled || !ft.nodeName(n.parentNode, "optgroup"))) {
                                if (e = ft(n).val(), r) return e;
                                s.push(e)
                            }
                        return s
                    },
                    set: function(t, e) {
                        for (var n, i, o = t.options, r = ft.makeArray(e), s = o.length; s--;)
                            if (i = o[s], ft.inArray(ft.valHooks.option.get(i), r) > -1) try {
                                i.selected = n = !0
                            } catch (t) {
                                i.scrollHeight
                            } else i.selected = !1;
                        return n || (t.selectedIndex = -1), o
                    }
                }
            }
        }), ft.each(["radio", "checkbox"], function() {
            ft.valHooks[this] = {
                set: function(t, e) {
                    if (ft.isArray(e)) return t.checked = ft.inArray(ft(t).val(), e) > -1
                }
            }, dt.checkOn || (ft.valHooks[this].get = function(t) {
                return null === t.getAttribute("value") ? "on" : t.value
            })
        });
        var _e, ke, Te = ft.expr.attrHandle,
            $e = /^(?:checked|selected)$/i,
            Ce = dt.getSetAttribute,
            Ee = dt.input;
        ft.fn.extend({
            attr: function(t, e) {
                return Ot(this, ft.attr, t, e, arguments.length > 1)
            },
            removeAttr: function(t) {
                return this.each(function() {
                    ft.removeAttr(this, t)
                })
            }
        }), ft.extend({
            attr: function(t, e, n) {
                var i, o, r = t.nodeType;
                if (3 !== r && 8 !== r && 2 !== r) return void 0 === t.getAttribute ? ft.prop(t, e, n) : (1 === r && ft.isXMLDoc(t) || (e = e.toLowerCase(), o = ft.attrHooks[e] || (ft.expr.match.bool.test(e) ? ke : _e)), void 0 !== n ? null === n ? void ft.removeAttr(t, e) : o && "set" in o && void 0 !== (i = o.set(t, n, e)) ? i : (t.setAttribute(e, n + ""), n) : o && "get" in o && null !== (i = o.get(t, e)) ? i : (i = ft.find.attr(t, e), null == i ? void 0 : i))
            },
            attrHooks: {
                type: {
                    set: function(t, e) {
                        if (!dt.radioValue && "radio" === e && ft.nodeName(t, "input")) {
                            var n = t.value;
                            return t.setAttribute("type", e), n && (t.value = n), e
                        }
                    }
                }
            },
            removeAttr: function(t, e) {
                var n, i, o = 0,
                    r = e && e.match(Tt);
                if (r && 1 === t.nodeType)
                    for (; n = r[o++];) i = ft.propFix[n] || n, ft.expr.match.bool.test(n) ? Ee && Ce || !$e.test(n) ? t[i] = !1 : t[ft.camelCase("default-" + n)] = t[i] = !1 : ft.attr(t, n, ""), t.removeAttribute(Ce ? n : i)
            }
        }), ke = {
            set: function(t, e, n) {
                return e === !1 ? ft.removeAttr(t, n) : Ee && Ce || !$e.test(n) ? t.setAttribute(!Ce && ft.propFix[n] || n, n) : t[ft.camelCase("default-" + n)] = t[n] = !0, n
            }
        }, ft.each(ft.expr.match.bool.source.match(/\w+/g), function(t, e) {
            var n = Te[e] || ft.find.attr;
            Ee && Ce || !$e.test(e) ? Te[e] = function(t, e, i) {
                var o, r;
                return i || (r = Te[e], Te[e] = o, o = null != n(t, e, i) ? e.toLowerCase() : null, Te[e] = r), o
            } : Te[e] = function(t, e, n) {
                if (!n) return t[ft.camelCase("default-" + e)] ? e.toLowerCase() : null
            }
        }), Ee && Ce || (ft.attrHooks.value = {
            set: function(t, e, n) {
                if (!ft.nodeName(t, "input")) return _e && _e.set(t, e, n);
                t.defaultValue = e
            }
        }), Ce || (_e = {
            set: function(t, e, n) {
                var i = t.getAttributeNode(n);
                if (i || t.setAttributeNode(i = t.ownerDocument.createAttribute(n)), i.value = e += "", "value" === n || e === t.getAttribute(n)) return e
            }
        }, Te.id = Te.name = Te.coords = function(t, e, n) {
            var i;
            if (!n) return (i = t.getAttributeNode(e)) && "" !== i.value ? i.value : null
        }, ft.valHooks.button = {
            get: function(t, e) {
                var n = t.getAttributeNode(e);
                if (n && n.specified) return n.value
            },
            set: _e.set
        }, ft.attrHooks.contenteditable = {
            set: function(t, e, n) {
                _e.set(t, "" !== e && e, n)
            }
        }, ft.each(["width", "height"], function(t, e) {
            ft.attrHooks[e] = {
                set: function(t, n) {
                    if ("" === n) return t.setAttribute(e, "auto"), n
                }
            }
        })), dt.style || (ft.attrHooks.style = {
            get: function(t) {
                return t.style.cssText || void 0
            },
            set: function(t, e) {
                return t.style.cssText = e + ""
            }
        });
        var Se = /^(?:input|select|textarea|button|object)$/i,
            Ne = /^(?:a|area)$/i;
        ft.fn.extend({
            prop: function(t, e) {
                return Ot(this, ft.prop, t, e, arguments.length > 1)
            },
            removeProp: function(t) {
                return t = ft.propFix[t] || t, this.each(function() {
                    try {
                        this[t] = void 0, delete this[t]
                    } catch (t) {}
                })
            }
        }), ft.extend({
            prop: function(t, e, n) {
                var i, o, r = t.nodeType;
                if (3 !== r && 8 !== r && 2 !== r) return 1 === r && ft.isXMLDoc(t) || (e = ft.propFix[e] || e, o = ft.propHooks[e]), void 0 !== n ? o && "set" in o && void 0 !== (i = o.set(t, n, e)) ? i : t[e] = n : o && "get" in o && null !== (i = o.get(t, e)) ? i : t[e]
            },
            propHooks: {
                tabIndex: {
                    get: function(t) {
                        var e = ft.find.attr(t, "tabindex");
                        return e ? parseInt(e, 10) : Se.test(t.nodeName) || Ne.test(t.nodeName) && t.href ? 0 : -1
                    }
                }
            },
            propFix: {
                for: "htmlFor",
                class: "className"
            }
        }), dt.hrefNormalized || ft.each(["href", "src"], function(t, e) {
            ft.propHooks[e] = {
                get: function(t) {
                    return t.getAttribute(e, 4)
                }
            }
        }), dt.optSelected || (ft.propHooks.selected = {
            get: function(t) {
                var e = t.parentNode;
                return e && (e.selectedIndex, e.parentNode && e.parentNode.selectedIndex), null
            },
            set: function(t) {
                var e = t.parentNode;
                e && (e.selectedIndex, e.parentNode && e.parentNode.selectedIndex)
            }
        }), ft.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
            ft.propFix[this.toLowerCase()] = this
        }), dt.enctype || (ft.propFix.enctype = "encoding");
        ft.fn.extend({
            addClass: function(t) {
                var e, n, i, o, r, s, a, l = 0;
                if (ft.isFunction(t)) return this.each(function(e) {
                    ft(this).addClass(t.call(this, e, U(this)))
                });
                if ("string" == typeof t && t)
                    for (e = t.match(Tt) || []; n = this[l++];)
                        if (o = U(n), i = 1 === n.nodeType && (" " + o + " ").replace(/[\t\r\n\f]/g, " ")) {
                            for (s = 0; r = e[s++];) i.indexOf(" " + r + " ") < 0 && (i += r + " ");
                            a = ft.trim(i), o !== a && ft.attr(n, "class", a)
                        }
                return this
            },
            removeClass: function(t) {
                var e, n, i, o, r, s, a, l = 0;
                if (ft.isFunction(t)) return this.each(function(e) {
                    ft(this).removeClass(t.call(this, e, U(this)))
                });
                if (!arguments.length) return this.attr("class", "");
                if ("string" == typeof t && t)
                    for (e = t.match(Tt) || []; n = this[l++];)
                        if (o = U(n), i = 1 === n.nodeType && (" " + o + " ").replace(/[\t\r\n\f]/g, " ")) {
                            for (s = 0; r = e[s++];)
                                for (; i.indexOf(" " + r + " ") > -1;) i = i.replace(" " + r + " ", " ");
                            a = ft.trim(i), o !== a && ft.attr(n, "class", a)
                        }
                return this
            },
            toggleClass: function(t, e) {
                var n = typeof t;
                return "boolean" == typeof e && "string" === n ? e ? this.addClass(t) : this.removeClass(t) : ft.isFunction(t) ? this.each(function(n) {
                    ft(this).toggleClass(t.call(this, n, U(this), e), e)
                }) : this.each(function() {
                    var e, i, o, r;
                    if ("string" === n)
                        for (i = 0, o = ft(this), r = t.match(Tt) || []; e = r[i++];) o.hasClass(e) ? o.removeClass(e) : o.addClass(e);
                    else void 0 !== t && "boolean" !== n || (e = U(this), e && ft._data(this, "__className__", e), ft.attr(this, "class", e || t === !1 ? "" : ft._data(this, "__className__") || ""))
                })
            },
            hasClass: function(t) {
                var e, n, i = 0;
                for (e = " " + t + " "; n = this[i++];)
                    if (1 === n.nodeType && (" " + U(n) + " ").replace(/[\t\r\n\f]/g, " ").indexOf(e) > -1) return !0;
                return !1
            }
        }), ft.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(t, e) {
            ft.fn[e] = function(t, n) {
                return arguments.length > 0 ? this.on(e, null, t, n) : this.trigger(e)
            }
        }), ft.fn.extend({
            hover: function(t, e) {
                return this.mouseenter(t).mouseleave(e || t)
            }
        });
        var De = t.location,
            je = ft.now(),
            Ae = /\?/;
        ft.parseJSON = function(e) {
            if (t.JSON && t.JSON.parse) return t.JSON.parse(e + "");
            var n, i = null,
                o = ft.trim(e + "");
            return o && !ft.trim(o.replace(/(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g, function(t, e, o, r) {
                return n && e && (i = 0), 0 === i ? t : (n = o || e, i += !r - !o, "")
            })) ? Function("return " + o)() : ft.error("Invalid JSON: " + e)
        }, ft.parseXML = function(e) {
            var n, i;
            if (!e || "string" != typeof e) return null;
            try {
                t.DOMParser ? (i = new t.DOMParser, n = i.parseFromString(e, "text/xml")) : (n = new t.ActiveXObject("Microsoft.XMLDOM"), n.async = "false", n.loadXML(e))
            } catch (t) {
                n = void 0
            }
            return n && n.documentElement && !n.getElementsByTagName("parsererror").length || ft.error("Invalid XML: " + e), n
        };
        var Le = /([?&])_=[^&]*/,
            Oe = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
            qe = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
            Ie = /^(?:GET|HEAD)$/,
            Me = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
            Re = {},
            He = {},
            Pe = "*/".concat("*"),
            Fe = De.href,
            We = Me.exec(Fe.toLowerCase()) || [];
        ft.extend({
            active: 0,
            lastModified: {},
            etag: {},
            ajaxSettings: {
                url: Fe,
                type: "GET",
                isLocal: qe.test(We[1]),
                global: !0,
                processData: !0,
                async: !0,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                accepts: {
                    "*": Pe,
                    text: "text/plain",
                    html: "text/html",
                    xml: "application/xml, text/xml",
                    json: "application/json, text/javascript"
                },
                contents: {
                    xml: /\bxml\b/,
                    html: /\bhtml/,
                    json: /\bjson\b/
                },
                responseFields: {
                    xml: "responseXML",
                    text: "responseText",
                    json: "responseJSON"
                },
                converters: {
                    "* text": String,
                    "text html": !0,
                    "text json": ft.parseJSON,
                    "text xml": ft.parseXML
                },
                flatOptions: {
                    url: !0,
                    context: !0
                }
            },
            ajaxSetup: function(t, e) {
                return e ? X(X(t, ft.ajaxSettings), e) : X(ft.ajaxSettings, t)
            },
            ajaxPrefilter: z(Re),
            ajaxTransport: z(He),
            ajax: function(e, n) {
                function i(e, n, i, o) {
                    var r, d, y, b, x, k = n;
                    2 !== w && (w = 2, l && t.clearTimeout(l), u = void 0, a = o || "", _.readyState = e > 0 ? 4 : 0, r = e >= 200 && e < 300 || 304 === e, i && (b = Q(f, _, i)), b = G(f, b, _, r), r ? (f.ifModified && (x = _.getResponseHeader("Last-Modified"), x && (ft.lastModified[s] = x), (x = _.getResponseHeader("etag")) && (ft.etag[s] = x)), 204 === e || "HEAD" === f.type ? k = "nocontent" : 304 === e ? k = "notmodified" : (k = b.state, d = b.data, y = b.error, r = !y)) : (y = k, !e && k || (k = "error", e < 0 && (e = 0))), _.status = e, _.statusText = (n || k) + "", r ? m.resolveWith(p, [d, k, _]) : m.rejectWith(p, [_, k, y]), _.statusCode(v), v = void 0, c && h.trigger(r ? "ajaxSuccess" : "ajaxError", [_, f, r ? d : y]), g.fireWith(p, [_, k]), c && (h.trigger("ajaxComplete", [_, f]), --ft.active || ft.event.trigger("ajaxStop")))
                }
                "object" == typeof e && (n = e, e = void 0), n = n || {};
                var o, r, s, a, l, c, u, d, f = ft.ajaxSetup({}, n),
                    p = f.context || f,
                    h = f.context && (p.nodeType || p.jquery) ? ft(p) : ft.event,
                    m = ft.Deferred(),
                    g = ft.Callbacks("once memory"),
                    v = f.statusCode || {},
                    y = {},
                    b = {},
                    w = 0,
                    x = "canceled",
                    _ = {
                        readyState: 0,
                        getResponseHeader: function(t) {
                            var e;
                            if (2 === w) {
                                if (!d)
                                    for (d = {}; e = Oe.exec(a);) d[e[1].toLowerCase()] = e[2];
                                e = d[t.toLowerCase()]
                            }
                            return null == e ? null : e
                        },
                        getAllResponseHeaders: function() {
                            return 2 === w ? a : null
                        },
                        setRequestHeader: function(t, e) {
                            var n = t.toLowerCase();
                            return w || (t = b[n] = b[n] || t, y[t] = e), this
                        },
                        overrideMimeType: function(t) {
                            return w || (f.mimeType = t), this
                        },
                        statusCode: function(t) {
                            var e;
                            if (t)
                                if (w < 2)
                                    for (e in t) v[e] = [v[e], t[e]];
                                else _.always(t[_.status]);
                            return this
                        },
                        abort: function(t) {
                            var e = t || x;
                            return u && u.abort(e), i(0, e), this
                        }
                    };
                if (m.promise(_).complete = g.add, _.success = _.done, _.error = _.fail, f.url = ((e || f.url || Fe) + "").replace(/#.*$/, "").replace(/^\/\//, We[1] + "//"), f.type = n.method || n.type || f.method || f.type, f.dataTypes = ft.trim(f.dataType || "*").toLowerCase().match(Tt) || [""], null == f.crossDomain && (o = Me.exec(f.url.toLowerCase()), f.crossDomain = !(!o || o[1] === We[1] && o[2] === We[2] && (o[3] || ("http:" === o[1] ? "80" : "443")) === (We[3] || ("http:" === We[1] ? "80" : "443")))), f.data && f.processData && "string" != typeof f.data && (f.data = ft.param(f.data, f.traditional)), V(Re, f, n, _), 2 === w) return _;
                c = ft.event && f.global, c && 0 == ft.active++ && ft.event.trigger("ajaxStart"), f.type = f.type.toUpperCase(), f.hasContent = !Ie.test(f.type), s = f.url, f.hasContent || (f.data && (s = f.url += (Ae.test(s) ? "&" : "?") + f.data, delete f.data), f.cache === !1 && (f.url = Le.test(s) ? s.replace(Le, "$1_=" + je++) : s + (Ae.test(s) ? "&" : "?") + "_=" + je++)), f.ifModified && (ft.lastModified[s] && _.setRequestHeader("If-Modified-Since", ft.lastModified[s]), ft.etag[s] && _.setRequestHeader("If-None-Match", ft.etag[s])), (f.data && f.hasContent && f.contentType !== !1 || n.contentType) && _.setRequestHeader("Content-Type", f.contentType), _.setRequestHeader("Accept", f.dataTypes[0] && f.accepts[f.dataTypes[0]] ? f.accepts[f.dataTypes[0]] + ("*" !== f.dataTypes[0] ? ", " + Pe + "; q=0.01" : "") : f.accepts["*"]);
                for (r in f.headers) _.setRequestHeader(r, f.headers[r]);
                if (f.beforeSend && (f.beforeSend.call(p, _, f) === !1 || 2 === w)) return _.abort();
                x = "abort";
                for (r in {
                        success: 1,
                        error: 1,
                        complete: 1
                    }) _[r](f[r]);
                if (u = V(He, f, n, _)) {
                    if (_.readyState = 1, c && h.trigger("ajaxSend", [_, f]), 2 === w) return _;
                    f.async && f.timeout > 0 && (l = t.setTimeout(function() {
                        _.abort("timeout")
                    }, f.timeout));
                    try {
                        w = 1, u.send(y, i)
                    } catch (t) {
                        if (!(w < 2)) throw t;
                        i(-1, t)
                    }
                } else i(-1, "No Transport");
                return _
            },
            getJSON: function(t, e, n) {
                return ft.get(t, e, n, "json")
            },
            getScript: function(t, e) {
                return ft.get(t, void 0, e, "script")
            }
        }), ft.each(["get", "post"], function(t, e) {
            ft[e] = function(t, n, i, o) {
                return ft.isFunction(n) && (o = o || i, i = n, n = void 0), ft.ajax(ft.extend({
                    url: t,
                    type: e,
                    dataType: o,
                    data: n,
                    success: i
                }, ft.isPlainObject(t) && t))
            }
        }), ft._evalUrl = function(t) {
            return ft.ajax({
                url: t,
                type: "GET",
                dataType: "script",
                cache: !0,
                async: !1,
                global: !1,
                throws: !0
            })
        }, ft.fn.extend({
            wrapAll: function(t) {
                if (ft.isFunction(t)) return this.each(function(e) {
                    ft(this).wrapAll(t.call(this, e))
                });
                if (this[0]) {
                    var e = ft(t, this[0].ownerDocument).eq(0).clone(!0);
                    this[0].parentNode && e.insertBefore(this[0]), e.map(function() {
                        for (var t = this; t.firstChild && 1 === t.firstChild.nodeType;) t = t.firstChild;
                        return t
                    }).append(this)
                }
                return this
            },
            wrapInner: function(t) {
                return ft.isFunction(t) ? this.each(function(e) {
                    ft(this).wrapInner(t.call(this, e))
                }) : this.each(function() {
                    var e = ft(this),
                        n = e.contents();
                    n.length ? n.wrapAll(t) : e.append(t)
                })
            },
            wrap: function(t) {
                var e = ft.isFunction(t);
                return this.each(function(n) {
                    ft(this).wrapAll(e ? t.call(this, n) : t)
                })
            },
            unwrap: function() {
                return this.parent().each(function() {
                    ft.nodeName(this, "body") || ft(this).replaceWith(this.childNodes)
                }).end()
            }
        }), ft.expr.filters.hidden = function(t) {
            return dt.reliableHiddenOffsets() ? t.offsetWidth <= 0 && t.offsetHeight <= 0 && !t.getClientRects().length : Y(t)
        }, ft.expr.filters.visible = function(t) {
            return !ft.expr.filters.hidden(t)
        };
        var Be = /\[\]$/,
            Ue = /^(?:submit|button|image|reset|file)$/i,
            ze = /^(?:input|select|textarea|keygen)/i;
        ft.param = function(t, e) {
            var n, i = [],
                o = function(t, e) {
                    e = ft.isFunction(e) ? e() : null == e ? "" : e, i[i.length] = encodeURIComponent(t) + "=" + encodeURIComponent(e)
                };
            if (void 0 === e && (e = ft.ajaxSettings && ft.ajaxSettings.traditional), ft.isArray(t) || t.jquery && !ft.isPlainObject(t)) ft.each(t, function() {
                o(this.name, this.value)
            });
            else
                for (n in t) K(n, t[n], e, o);
            return i.join("&").replace(/%20/g, "+")
        }, ft.fn.extend({
            serialize: function() {
                return ft.param(this.serializeArray())
            },
            serializeArray: function() {
                return this.map(function() {
                    var t = ft.prop(this, "elements");
                    return t ? ft.makeArray(t) : this
                }).filter(function() {
                    var t = this.type;
                    return this.name && !ft(this).is(":disabled") && ze.test(this.nodeName) && !Ue.test(t) && (this.checked || !qt.test(t))
                }).map(function(t, e) {
                    var n = ft(this).val();
                    return null == n ? null : ft.isArray(n) ? ft.map(n, function(t) {
                        return {
                            name: e.name,
                            value: t.replace(/\r?\n/g, "\r\n")
                        }
                    }) : {
                        name: e.name,
                        value: n.replace(/\r?\n/g, "\r\n")
                    }
                }).get()
            }
        }), ft.ajaxSettings.xhr = void 0 !== t.ActiveXObject ? function() {
            return this.isLocal ? tt() : it.documentMode > 8 ? Z() : /^(get|post|head|put|delete|options)$/i.test(this.type) && Z() || tt()
        } : Z;
        var Ve = 0,
            Xe = {},
            Qe = ft.ajaxSettings.xhr();
        t.attachEvent && t.attachEvent("onunload", function() {
            for (var t in Xe) Xe[t](void 0, !0)
        }), dt.cors = !!Qe && "withCredentials" in Qe, Qe = dt.ajax = !!Qe, Qe && ft.ajaxTransport(function(e) {
            if (!e.crossDomain || dt.cors) {
                var n;
                return {
                    send: function(i, o) {
                        var r, s = e.xhr(),
                            a = ++Ve;
                        if (s.open(e.type, e.url, e.async, e.username, e.password), e.xhrFields)
                            for (r in e.xhrFields) s[r] = e.xhrFields[r];
                        e.mimeType && s.overrideMimeType && s.overrideMimeType(e.mimeType), e.crossDomain || i["X-Requested-With"] || (i["X-Requested-With"] = "XMLHttpRequest");
                        for (r in i) void 0 !== i[r] && s.setRequestHeader(r, i[r] + "");
                        s.send(e.hasContent && e.data || null), n = function(t, i) {
                            var r, l, c;
                            if (n && (i || 4 === s.readyState))
                                if (delete Xe[a], n = void 0, s.onreadystatechange = ft.noop, i) 4 !== s.readyState && s.abort();
                                else {
                                    c = {}, r = s.status, "string" == typeof s.responseText && (c.text = s.responseText);
                                    try {
                                        l = s.statusText
                                    } catch (t) {
                                        l = ""
                                    }
                                    r || !e.isLocal || e.crossDomain ? 1223 === r && (r = 204) : r = c.text ? 200 : 404
                                }
                            c && o(r, l, c, s.getAllResponseHeaders())
                        }, e.async ? 4 === s.readyState ? t.setTimeout(n) : s.onreadystatechange = Xe[a] = n : n()
                    },
                    abort: function() {
                        n && n(void 0, !0)
                    }
                }
            }
        }), ft.ajaxPrefilter(function(t) {
            t.crossDomain && (t.contents.script = !1)
        }), ft.ajaxSetup({
            accepts: {
                script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
            },
            contents: {
                script: /\b(?:java|ecma)script\b/
            },
            converters: {
                "text script": function(t) {
                    return ft.globalEval(t), t
                }
            }
        }), ft.ajaxPrefilter("script", function(t) {
            void 0 === t.cache && (t.cache = !1), t.crossDomain && (t.type = "GET", t.global = !1)
        }), ft.ajaxTransport("script", function(t) {
            if (t.crossDomain) {
                var e, n = it.head || ft("head")[0] || it.documentElement;
                return {
                    send: function(i, o) {
                        e = it.createElement("script"), e.async = !0, t.scriptCharset && (e.charset = t.scriptCharset), e.src = t.url, e.onload = e.onreadystatechange = function(t, n) {
                            (n || !e.readyState || /loaded|complete/.test(e.readyState)) && (e.onload = e.onreadystatechange = null, e.parentNode && e.parentNode.removeChild(e), e = null, n || o(200, "success"))
                        }, n.insertBefore(e, n.firstChild)
                    },
                    abort: function() {
                        e && e.onload(void 0, !0)
                    }
                }
            }
        });
        var Ge = [],
            Je = /(=)\?(?=&|$)|\?\?/;
        ft.ajaxSetup({
            jsonp: "callback",
            jsonpCallback: function() {
                var t = Ge.pop() || ft.expando + "_" + je++;
                return this[t] = !0, t
            }
        }), ft.ajaxPrefilter("json jsonp", function(e, n, i) {
            var o, r, s, a = e.jsonp !== !1 && (Je.test(e.url) ? "url" : "string" == typeof e.data && 0 === (e.contentType || "").indexOf("application/x-www-form-urlencoded") && Je.test(e.data) && "data");
            if (a || "jsonp" === e.dataTypes[0]) return o = e.jsonpCallback = ft.isFunction(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback, a ? e[a] = e[a].replace(Je, "$1" + o) : e.jsonp !== !1 && (e.url += (Ae.test(e.url) ? "&" : "?") + e.jsonp + "=" + o), e.converters["script json"] = function() {
                return s || ft.error(o + " was not called"), s[0]
            }, e.dataTypes[0] = "json", r = t[o], t[o] = function() {
                s = arguments
            }, i.always(function() {
                void 0 === r ? ft(t).removeProp(o) : t[o] = r, e[o] && (e.jsonpCallback = n.jsonpCallback, Ge.push(o)), s && ft.isFunction(r) && r(s[0]), s = r = void 0
            }), "script"
        }), ft.parseHTML = function(t, e, n) {
            if (!t || "string" != typeof t) return null;
            "boolean" == typeof e && (n = e, e = !1), e = e || it;
            var i = yt.exec(t),
                o = !n && [];
            return i ? [e.createElement(i[1])] : (i = v([t], e, o), o && o.length && ft(o).remove(), ft.merge([], i.childNodes))
        };
        var Ye = ft.fn.load;
        ft.fn.load = function(t, e, n) {
            if ("string" != typeof t && Ye) return Ye.apply(this, arguments);
            var i, o, r, s = this,
                a = t.indexOf(" ");
            return a > -1 && (i = ft.trim(t.slice(a, t.length)), t = t.slice(0, a)), ft.isFunction(e) ? (n = e, e = void 0) : e && "object" == typeof e && (o = "POST"), s.length > 0 && ft.ajax({
                url: t,
                type: o || "GET",
                dataType: "html",
                data: e
            }).done(function(t) {
                r = arguments, s.html(i ? ft("<div>").append(ft.parseHTML(t)).find(i) : t)
            }).always(n && function(t, e) {
                s.each(function() {
                    n.apply(s, r || [t.responseText, e, t])
                })
            }), this
        }, ft.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(t, e) {
            ft.fn[e] = function(t) {
                return this.on(e, t)
            }
        }), ft.expr.filters.animated = function(t) {
            return ft.grep(ft.timers, function(e) {
                return t === e.elem
            }).length
        }, ft.offset = {
            setOffset: function(t, e, n) {
                var i, o, r, s, a, l, c, u = ft.css(t, "position"),
                    d = ft(t),
                    f = {};
                "static" === u && (t.style.position = "relative"), a = d.offset(), r = ft.css(t, "top"), l = ft.css(t, "left"), c = ("absolute" === u || "fixed" === u) && ft.inArray("auto", [r, l]) > -1, c ? (i = d.position(), s = i.top, o = i.left) : (s = parseFloat(r) || 0, o = parseFloat(l) || 0), ft.isFunction(e) && (e = e.call(t, n, ft.extend({}, a))), null != e.top && (f.top = e.top - a.top + s), null != e.left && (f.left = e.left - a.left + o), "using" in e ? e.using.call(t, f) : d.css(f)
            }
        }, ft.fn.extend({
            offset: function(t) {
                if (arguments.length) return void 0 === t ? this : this.each(function(e) {
                    ft.offset.setOffset(this, t, e)
                });
                var e, n, i = {
                        top: 0,
                        left: 0
                    },
                    o = this[0],
                    r = o && o.ownerDocument;
                if (r) return e = r.documentElement, ft.contains(e, o) ? (void 0 !== o.getBoundingClientRect && (i = o.getBoundingClientRect()), n = et(r), {
                    top: i.top + (n.pageYOffset || e.scrollTop) - (e.clientTop || 0),
                    left: i.left + (n.pageXOffset || e.scrollLeft) - (e.clientLeft || 0)
                }) : i
            },
            position: function() {
                if (this[0]) {
                    var t, e, n = {
                            top: 0,
                            left: 0
                        },
                        i = this[0];
                    return "fixed" === ft.css(i, "position") ? e = i.getBoundingClientRect() : (t = this.offsetParent(), e = this.offset(), ft.nodeName(t[0], "html") || (n = t.offset()), n.top += ft.css(t[0], "borderTopWidth", !0), n.left += ft.css(t[0], "borderLeftWidth", !0)), {
                        top: e.top - n.top - ft.css(i, "marginTop", !0),
                        left: e.left - n.left - ft.css(i, "marginLeft", !0)
                    }
                }
            },
            offsetParent: function() {
                return this.map(function() {
                    for (var t = this.offsetParent; t && !ft.nodeName(t, "html") && "static" === ft.css(t, "position");) t = t.offsetParent;
                    return t || se
                })
            }
        }), ft.each({
            scrollLeft: "pageXOffset",
            scrollTop: "pageYOffset"
        }, function(t, e) {
            var n = /Y/.test(e);
            ft.fn[t] = function(i) {
                return Ot(this, function(t, i, o) {
                    var r = et(t);
                    if (void 0 === o) return r ? e in r ? r[e] : r.document.documentElement[i] : t[i];
                    r ? r.scrollTo(n ? ft(r).scrollLeft() : o, n ? o : ft(r).scrollTop()) : t[i] = o
                }, t, i, arguments.length, null)
            }
        }), ft.each(["top", "left"], function(t, e) {
            ft.cssHooks[e] = j(dt.pixelPosition, function(t, n) {
                if (n) return n = le(t, e), oe.test(n) ? ft(t).position()[e] + "px" : n
            })
        }), ft.each({
            Height: "height",
            Width: "width"
        }, function(t, e) {
            ft.each({
                padding: "inner" + t,
                content: e,
                "": "outer" + t
            }, function(n, i) {
                ft.fn[i] = function(i, o) {
                    var r = arguments.length && (n || "boolean" != typeof i),
                        s = n || (i === !0 || o === !0 ? "margin" : "border");
                    return Ot(this, function(e, n, i) {
                        var o;
                        return ft.isWindow(e) ? e.document.documentElement["client" + t] : 9 === e.nodeType ? (o = e.documentElement, Math.max(e.body["scroll" + t], o["scroll" + t], e.body["offset" + t], o["offset" + t], o["client" + t])) : void 0 === i ? ft.css(e, n, s) : ft.style(e, n, i, s)
                    }, e, r ? i : void 0, r, null)
                }
            })
        }), ft.fn.extend({
            bind: function(t, e, n) {
                return this.on(t, null, e, n)
            },
            unbind: function(t, e) {
                return this.off(t, null, e)
            },
            delegate: function(t, e, n, i) {
                return this.on(e, t, n, i)
            },
            undelegate: function(t, e, n) {
                return 1 === arguments.length ? this.off(t, "**") : this.off(e, t || "**", n)
            }
        }), ft.fn.size = function() {
            return this.length
        }, ft.fn.andSelf = ft.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function() {
            return ft
        });
        var Ke = t.jQuery,
            Ze = t.$;
        return ft.noConflict = function(e) {
            return t.$ === ft && (t.$ = Ze), e && t.jQuery === ft && (t.jQuery = Ke), ft
        }, e || (t.jQuery = t.$ = ft), ft
    }), function() {
        var t, e;
        jQuery.uaMatch = function(t) {
            t = t.toLowerCase();
            var e = /(chrome)[ \/]([\w.]+)/.exec(t) || /(webkit)[ \/]([\w.]+)/.exec(t) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(t) || /(msie) ([\w.]+)/.exec(t) || t.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(t) || [];
            return {
                browser: e[1] || "",
                version: e[2] || "0"
            }
        }, t = jQuery.uaMatch(navigator.userAgent), e = {}, t.browser && (e[t.browser] = !0, e.version = t.version), e.chrome ? e.webkit = !0 : e.webkit && (e.safari = !0), jQuery.browser = e, jQuery.sub = function() {
            function t(e, n) {
                return new t.fn.init(e, n)
            }
            jQuery.extend(!0, t, this), t.superclass = this, t.fn = t.prototype = this(), t.fn.constructor = t, t.sub = this.sub, t.fn.init = function(n, i) {
                return i && i instanceof jQuery && !(i instanceof t) && (i = t(i)), jQuery.fn.init.call(this, n, i, e)
            }, t.fn.init.prototype = t.fn;
            var e = t(document);
            return t
        }
    }(), "undefined" == typeof jQuery) throw new Error("Bootstrap's JavaScript requires jQuery"); + function(t) {
    "use strict";
    var e = t.fn.jquery.split(" ")[0].split(".");
    if (e[0] < 2 && e[1] < 9 || 1 == e[0] && 9 == e[1] && e[2] < 1 || e[0] > 2) throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 3")
}(jQuery),
function(t) {
    "use strict";

    function e() {
        var t = document.createElement("bootstrap"),
            e = {
                WebkitTransition: "webkitTransitionEnd",
                MozTransition: "transitionend",
                OTransition: "oTransitionEnd otransitionend",
                transition: "transitionend"
            };
        for (var n in e)
            if (void 0 !== t.style[n]) return {
                end: e[n]
            };
        return !1
    }
    t.fn.emulateTransitionEnd = function(e) {
        var n = !1,
            i = this;
        t(this).one("bsTransitionEnd", function() {
            n = !0
        });
        var o = function() {
            n || t(i).trigger(t.support.transition.end)
        };
        return setTimeout(o, e), this
    }, t(function() {
        t.support.transition = e(), t.support.transition && (t.event.special.bsTransitionEnd = {
            bindType: t.support.transition.end,
            delegateType: t.support.transition.end,
            handle: function(e) {
                if (t(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
            }
        })
    })
}(jQuery),
function(t) {
    "use strict";

    function e(e) {
        return this.each(function() {
            var n = t(this),
                o = n.data("bs.alert");
            o || n.data("bs.alert", o = new i(this)), "string" == typeof e && o[e].call(n)
        })
    }
    var n = '[data-dismiss="alert"]',
        i = function(e) {
            t(e).on("click", n, this.close)
        };
    i.VERSION = "3.3.6", i.TRANSITION_DURATION = 150, i.prototype.close = function(e) {
        function n() {
            s.detach().trigger("closed.bs.alert").remove()
        }
        var o = t(this),
            r = o.attr("data-target");
        r || (r = o.attr("href"), r = r && r.replace(/.*(?=#[^\s]*$)/, ""));
        var s = t(r);
        e && e.preventDefault(), s.length || (s = o.closest(".alert")), s.trigger(e = t.Event("close.bs.alert")), e.isDefaultPrevented() || (s.removeClass("in"), t.support.transition && s.hasClass("fade") ? s.one("bsTransitionEnd", n).emulateTransitionEnd(i.TRANSITION_DURATION) : n())
    };
    var o = t.fn.alert;
    t.fn.alert = e, t.fn.alert.Constructor = i, t.fn.alert.noConflict = function() {
        return t.fn.alert = o, this
    }, t(document).on("click.bs.alert.data-api", n, i.prototype.close)
}(jQuery),
function(t) {
    "use strict";

    function e(e) {
        return this.each(function() {
            var i = t(this),
                o = i.data("bs.button"),
                r = "object" == typeof e && e;
            o || i.data("bs.button", o = new n(this, r)), "toggle" == e ? o.toggle() : e && o.setState(e)
        })
    }
    var n = function(e, i) {
        this.$element = t(e), this.options = t.extend({}, n.DEFAULTS, i), this.isLoading = !1
    };
    n.VERSION = "3.3.6", n.DEFAULTS = {
        loadingText: "loading..."
    }, n.prototype.setState = function(e) {
        var n = "disabled",
            i = this.$element,
            o = i.is("input") ? "val" : "html",
            r = i.data();
        e += "Text", null == r.resetText && i.data("resetText", i[o]()), setTimeout(t.proxy(function() {
            i[o](null == r[e] ? this.options[e] : r[e]), "loadingText" == e ? (this.isLoading = !0, i.addClass(n).attr(n, n)) : this.isLoading && (this.isLoading = !1, i.removeClass(n).removeAttr(n))
        }, this), 0)
    }, n.prototype.toggle = function() {
        var t = !0,
            e = this.$element.closest('[data-toggle="buttons"]');
        if (e.length) {
            var n = this.$element.find("input");
            "radio" == n.prop("type") ? (n.prop("checked") && (t = !1), e.find(".active").removeClass("active"), this.$element.addClass("active")) : "checkbox" == n.prop("type") && (n.prop("checked") !== this.$element.hasClass("active") && (t = !1), this.$element.toggleClass("active")), n.prop("checked", this.$element.hasClass("active")), t && n.trigger("change")
        } else this.$element.attr("aria-pressed", !this.$element.hasClass("active")), this.$element.toggleClass("active")
    };
    var i = t.fn.button;
    t.fn.button = e, t.fn.button.Constructor = n, t.fn.button.noConflict = function() {
        return t.fn.button = i, this
    }, t(document).on("click.bs.button.data-api", '[data-toggle^="button"]', function(n) {
        var i = t(n.target);
        i.hasClass("btn") || (i = i.closest(".btn")), e.call(i, "toggle"), t(n.target).is('input[type="radio"]') || t(n.target).is('input[type="checkbox"]') || n.preventDefault()
    }).on("focus.bs.button.data-api blur.bs.button.data-api", '[data-toggle^="button"]', function(e) {
        t(e.target).closest(".btn").toggleClass("focus", /^focus(in)?$/.test(e.type))
    })
}(jQuery),
function(t) {
    "use strict";

    function e(e) {
        return this.each(function() {
            var i = t(this),
                o = i.data("bs.carousel"),
                r = t.extend({}, n.DEFAULTS, i.data(), "object" == typeof e && e),
                s = "string" == typeof e ? e : r.slide;
            o || i.data("bs.carousel", o = new n(this, r)), "number" == typeof e ? o.to(e) : s ? o[s]() : r.interval && o.pause().cycle()
        })
    }
    var n = function(e, n) {
        this.$element = t(e), this.$indicators = this.$element.find(".carousel-indicators"), this.options = n, this.paused = null, this.sliding = null, this.interval = null, this.$active = null, this.$items = null, this.options.keyboard && this.$element.on("keydown.bs.carousel", t.proxy(this.keydown, this)), "hover" == this.options.pause && !("ontouchstart" in document.documentElement) && this.$element.on("mouseenter.bs.carousel", t.proxy(this.pause, this)).on("mouseleave.bs.carousel", t.proxy(this.cycle, this))
    };
    n.VERSION = "3.3.6", n.TRANSITION_DURATION = 600, n.DEFAULTS = {
        interval: 5e3,
        pause: "hover",
        wrap: !0,
        keyboard: !0
    }, n.prototype.keydown = function(t) {
        if (!/input|textarea/i.test(t.target.tagName)) {
            switch (t.which) {
                case 37:
                    this.prev();
                    break;
                case 39:
                    this.next();
                    break;
                default:
                    return
            }
            t.preventDefault()
        }
    }, n.prototype.cycle = function(e) {
        return e || (this.paused = !1), this.interval && clearInterval(this.interval), this.options.interval && !this.paused && (this.interval = setInterval(t.proxy(this.next, this), this.options.interval)), this
    }, n.prototype.getItemIndex = function(t) {
        return this.$items = t.parent().children(".item"), this.$items.index(t || this.$active)
    }, n.prototype.getItemForDirection = function(t, e) {
        var n = this.getItemIndex(e);
        if (("prev" == t && 0 === n || "next" == t && n == this.$items.length - 1) && !this.options.wrap) return e;
        var i = "prev" == t ? -1 : 1,
            o = (n + i) % this.$items.length;
        return this.$items.eq(o)
    }, n.prototype.to = function(t) {
        var e = this,
            n = this.getItemIndex(this.$active = this.$element.find(".item.active"));
        if (!(t > this.$items.length - 1 || t < 0)) return this.sliding ? this.$element.one("slid.bs.carousel", function() {
            e.to(t)
        }) : n == t ? this.pause().cycle() : this.slide(t > n ? "next" : "prev", this.$items.eq(t))
    }, n.prototype.pause = function(e) {
        return e || (this.paused = !0), this.$element.find(".next, .prev").length && t.support.transition && (this.$element.trigger(t.support.transition.end), this.cycle(!0)), this.interval = clearInterval(this.interval), this
    }, n.prototype.next = function() {
        if (!this.sliding) return this.slide("next")
    }, n.prototype.prev = function() {
        if (!this.sliding) return this.slide("prev")
    }, n.prototype.slide = function(e, i) {
        var o = this.$element.find(".item.active"),
            r = i || this.getItemForDirection(e, o),
            s = this.interval,
            a = "next" == e ? "left" : "right",
            l = this;
        if (r.hasClass("active")) return this.sliding = !1;
        var c = r[0],
            u = t.Event("slide.bs.carousel", {
                relatedTarget: c,
                direction: a
            });
        if (this.$element.trigger(u), !u.isDefaultPrevented()) {
            if (this.sliding = !0, s && this.pause(), this.$indicators.length) {
                this.$indicators.find(".active").removeClass("active");
                var d = t(this.$indicators.children()[this.getItemIndex(r)]);
                d && d.addClass("active")
            }
            var f = t.Event("slid.bs.carousel", {
                relatedTarget: c,
                direction: a
            });
            return t.support.transition && this.$element.hasClass("slide") ? (r.addClass(e), r[0].offsetWidth, o.addClass(a), r.addClass(a), o.one("bsTransitionEnd", function() {
                r.removeClass([e, a].join(" ")).addClass("active"), o.removeClass(["active", a].join(" ")), l.sliding = !1, setTimeout(function() {
                    l.$element.trigger(f)
                }, 0)
            }).emulateTransitionEnd(n.TRANSITION_DURATION)) : (o.removeClass("active"), r.addClass("active"), this.sliding = !1, this.$element.trigger(f)), s && this.cycle(), this
        }
    };
    var i = t.fn.carousel;
    t.fn.carousel = e, t.fn.carousel.Constructor = n, t.fn.carousel.noConflict = function() {
        return t.fn.carousel = i, this
    };
    var o = function(n) {
        var i, o = t(this),
            r = t(o.attr("data-target") || (i = o.attr("href")) && i.replace(/.*(?=#[^\s]+$)/, ""));
        if (r.hasClass("carousel")) {
            var s = t.extend({}, r.data(), o.data()),
                a = o.attr("data-slide-to");
            a && (s.interval = !1), e.call(r, s), a && r.data("bs.carousel").to(a), n.preventDefault()
        }
    };
    t(document).on("click.bs.carousel.data-api", "[data-slide]", o).on("click.bs.carousel.data-api", "[data-slide-to]", o), t(window).on("load", function() {
        t('[data-ride="carousel"]').each(function() {
            var n = t(this);
            e.call(n, n.data())
        })
    })
}(jQuery),
function(t) {
    "use strict";

    function e(e) {
        var n;
        return t(e.attr("data-target") || (n = e.attr("href")) && n.replace(/.*(?=#[^\s]+$)/, ""))
    }

    function n(e) {
        return this.each(function() {
            var n = t(this),
                o = n.data("bs.collapse"),
                r = t.extend({}, i.DEFAULTS, n.data(), "object" == typeof e && e);
            !o && r.toggle && /show|hide/.test(e) && (r.toggle = !1), o || n.data("bs.collapse", o = new i(this, r)), "string" == typeof e && o[e]()
        })
    }
    var i = function(e, n) {
        this.$element = t(e), this.options = t.extend({}, i.DEFAULTS, n), this.$trigger = t('[data-toggle="collapse"][href="#' + e.id + '"],[data-toggle="collapse"][data-target="#' + e.id + '"]'), this.transitioning = null, this.options.parent ? this.$parent = this.getParent() : this.addAriaAndCollapsedClass(this.$element, this.$trigger), this.options.toggle && this.toggle()
    };
    i.VERSION = "3.3.6", i.TRANSITION_DURATION = 350, i.DEFAULTS = {
        toggle: !0
    }, i.prototype.dimension = function() {
        return this.$element.hasClass("width") ? "width" : "height"
    }, i.prototype.show = function() {
        if (!this.transitioning && !this.$element.hasClass("in")) {
            var e, o = this.$parent && this.$parent.children(".panel").children(".in, .collapsing");
            if (!(o && o.length && (e = o.data("bs.collapse")) && e.transitioning)) {
                var r = t.Event("show.bs.collapse");
                if (this.$element.trigger(r), !r.isDefaultPrevented()) {
                    o && o.length && (n.call(o, "hide"), e || o.data("bs.collapse", null));
                    var s = this.dimension();
                    this.$element.removeClass("collapse").addClass("collapsing")[s](0).attr("aria-expanded", !0), this.$trigger.removeClass("collapsed").attr("aria-expanded", !0), this.transitioning = 1;
                    var a = function() {
                        this.$element.removeClass("collapsing").addClass("collapse in")[s](""), this.transitioning = 0, this.$element.trigger("shown.bs.collapse")
                    };
                    if (!t.support.transition) return a.call(this);
                    var l = t.camelCase(["scroll", s].join("-"));
                    this.$element.one("bsTransitionEnd", t.proxy(a, this)).emulateTransitionEnd(i.TRANSITION_DURATION)[s](this.$element[0][l])
                }
            }
        }
    }, i.prototype.hide = function() {
        if (!this.transitioning && this.$element.hasClass("in")) {
            var e = t.Event("hide.bs.collapse");
            if (this.$element.trigger(e), !e.isDefaultPrevented()) {
                var n = this.dimension();
                this.$element[n](this.$element[n]())[0].offsetHeight, this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded", !1), this.$trigger.addClass("collapsed").attr("aria-expanded", !1), this.transitioning = 1;
                var o = function() {
                    this.transitioning = 0, this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")
                };
                if (!t.support.transition) return o.call(this);
                this.$element[n](0).one("bsTransitionEnd", t.proxy(o, this)).emulateTransitionEnd(i.TRANSITION_DURATION)
            }
        }
    }, i.prototype.toggle = function() {
        this[this.$element.hasClass("in") ? "hide" : "show"]()
    }, i.prototype.getParent = function() {
        return t(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each(t.proxy(function(n, i) {
            var o = t(i);
            this.addAriaAndCollapsedClass(e(o), o)
        }, this)).end()
    }, i.prototype.addAriaAndCollapsedClass = function(t, e) {
        var n = t.hasClass("in");
        t.attr("aria-expanded", n), e.toggleClass("collapsed", !n).attr("aria-expanded", n)
    };
    var o = t.fn.collapse;
    t.fn.collapse = n, t.fn.collapse.Constructor = i, t.fn.collapse.noConflict = function() {
        return t.fn.collapse = o, this
    }, t(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function(i) {
        var o = t(this);
        o.attr("data-target") || i.preventDefault();
        var r = e(o),
            s = r.data("bs.collapse"),
            a = s ? "toggle" : o.data();
        n.call(r, a)
    })
}(jQuery),
function(t) {
    "use strict";

    function e(e) {
        var n = e.attr("data-target");
        n || (n = e.attr("href"), n = n && /#[A-Za-z]/.test(n) && n.replace(/.*(?=#[^\s]*$)/, ""));
        var i = n && t(n);
        return i && i.length ? i : e.parent()
    }

    function n(n) {
        n && 3 === n.which || (t(o).remove(), t(r).each(function() {
            var i = t(this),
                o = e(i),
                r = {
                    relatedTarget: this
                };
            o.hasClass("open") && (n && "click" == n.type && /input|textarea/i.test(n.target.tagName) && t.contains(o[0], n.target) || (o.trigger(n = t.Event("hide.bs.dropdown", r)), n.isDefaultPrevented() || (i.attr("aria-expanded", "false"), o.removeClass("open").trigger(t.Event("hidden.bs.dropdown", r)))))
        }))
    }

    function i(e) {
        return this.each(function() {
            var n = t(this),
                i = n.data("bs.dropdown");
            i || n.data("bs.dropdown", i = new s(this)), "string" == typeof e && i[e].call(n)
        })
    }
    var o = ".dropdown-backdrop",
        r = '[data-toggle="dropdown"]',
        s = function(e) {
            t(e).on("click.bs.dropdown", this.toggle)
        };
    s.VERSION = "3.3.6", s.prototype.toggle = function(i) {
        var o = t(this);
        if (!o.is(".disabled, :disabled")) {
            var r = e(o),
                s = r.hasClass("open");
            if (n(), !s) {
                "ontouchstart" in document.documentElement && !r.closest(".navbar-nav").length && t(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(t(this)).on("click", n);
                var a = {
                    relatedTarget: this
                };
                if (r.trigger(i = t.Event("show.bs.dropdown", a)), i.isDefaultPrevented()) return;
                o.trigger("focus").attr("aria-expanded", "true"), r.toggleClass("open").trigger(t.Event("shown.bs.dropdown", a))
            }
            return !1
        }
    }, s.prototype.keydown = function(n) {
        if (/(38|40|27|32)/.test(n.which) && !/input|textarea/i.test(n.target.tagName)) {
            var i = t(this);
            if (n.preventDefault(), n.stopPropagation(), !i.is(".disabled, :disabled")) {
                var o = e(i),
                    s = o.hasClass("open");
                if (!s && 27 != n.which || s && 27 == n.which) return 27 == n.which && o.find(r).trigger("focus"), i.trigger("click");
                var a = o.find(".dropdown-menu li:not(.disabled):visible a");
                if (a.length) {
                    var l = a.index(n.target);
                    38 == n.which && l > 0 && l--, 40 == n.which && l < a.length - 1 && l++, ~l || (l = 0), a.eq(l).trigger("focus")
                }
            }
        }
    };
    var a = t.fn.dropdown;
    t.fn.dropdown = i, t.fn.dropdown.Constructor = s, t.fn.dropdown.noConflict = function() {
        return t.fn.dropdown = a, this
    }, t(document).on("click.bs.dropdown.data-api", n).on("click.bs.dropdown.data-api", ".dropdown form", function(t) {
        t.stopPropagation()
    }).on("click.bs.dropdown.data-api", r, s.prototype.toggle).on("keydown.bs.dropdown.data-api", r, s.prototype.keydown).on("keydown.bs.dropdown.data-api", ".dropdown-menu", s.prototype.keydown)
}(jQuery),
function(t) {
    "use strict";

    function e(e, i) {
        return this.each(function() {
            var o = t(this),
                r = o.data("bs.modal"),
                s = t.extend({}, n.DEFAULTS, o.data(), "object" == typeof e && e);
            r || o.data("bs.modal", r = new n(this, s)), "string" == typeof e ? r[e](i) : s.show && r.show(i)
        })
    }
    var n = function(e, n) {
        this.options = n, this.$body = t(document.body), this.$element = t(e), this.$dialog = this.$element.find(".modal-dialog"), this.$backdrop = null, this.isShown = null, this.originalBodyPad = null, this.scrollbarWidth = 0, this.ignoreBackdropClick = !1, this.options.remote && this.$element.find(".modal-content").load(this.options.remote, t.proxy(function() {
            this.$element.trigger("loaded.bs.modal")
        }, this))
    };
    n.VERSION = "3.3.6", n.TRANSITION_DURATION = 300, n.BACKDROP_TRANSITION_DURATION = 150, n.DEFAULTS = {
        backdrop: !0,
        keyboard: !0,
        show: !0
    }, n.prototype.toggle = function(t) {
        return this.isShown ? this.hide() : this.show(t)
    }, n.prototype.show = function(e) {
        var i = this,
            o = t.Event("show.bs.modal", {
                relatedTarget: e
            });
        this.$element.trigger(o), this.isShown || o.isDefaultPrevented() || (this.isShown = !0, this.checkScrollbar(), this.setScrollbar(), this.$body.addClass("modal-open"), this.escape(), this.resize(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', t.proxy(this.hide, this)), this.$dialog.on("mousedown.dismiss.bs.modal", function() {
            i.$element.one("mouseup.dismiss.bs.modal", function(e) {
                t(e.target).is(i.$element) && (i.ignoreBackdropClick = !0)
            })
        }), this.backdrop(function() {
            var o = t.support.transition && i.$element.hasClass("fade");
            i.$element.parent().length || i.$element.appendTo(i.$body), i.$element.show().scrollTop(0), i.adjustDialog(), o && i.$element[0].offsetWidth, i.$element.addClass("in"), i.enforceFocus();
            var r = t.Event("shown.bs.modal", {
                relatedTarget: e
            });
            o ? i.$dialog.one("bsTransitionEnd", function() {
                i.$element.trigger("focus").trigger(r)
            }).emulateTransitionEnd(n.TRANSITION_DURATION) : i.$element.trigger("focus").trigger(r)
        }))
    }, n.prototype.hide = function(e) {
        e && e.preventDefault(), e = t.Event("hide.bs.modal"), this.$element.trigger(e), this.isShown && !e.isDefaultPrevented() && (this.isShown = !1, this.escape(), this.resize(), t(document).off("focusin.bs.modal"), this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"), this.$dialog.off("mousedown.dismiss.bs.modal"), t.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", t.proxy(this.hideModal, this)).emulateTransitionEnd(n.TRANSITION_DURATION) : this.hideModal())
    }, n.prototype.enforceFocus = function() {
        t(document).off("focusin.bs.modal").on("focusin.bs.modal", t.proxy(function(t) {
            this.$element[0] === t.target || this.$element.has(t.target).length || this.$element.trigger("focus")
        }, this))
    }, n.prototype.escape = function() {
        this.isShown && this.options.keyboard ? this.$element.on("keydown.dismiss.bs.modal", t.proxy(function(t) {
            27 == t.which && this.hide()
        }, this)) : this.isShown || this.$element.off("keydown.dismiss.bs.modal")
    }, n.prototype.resize = function() {
        this.isShown ? t(window).on("resize.bs.modal", t.proxy(this.handleUpdate, this)) : t(window).off("resize.bs.modal")
    }, n.prototype.hideModal = function() {
        var t = this;
        this.$element.hide(), this.backdrop(function() {
            t.$body.removeClass("modal-open"), t.resetAdjustments(), t.resetScrollbar(), t.$element.trigger("hidden.bs.modal")
        })
    }, n.prototype.removeBackdrop = function() {
        this.$backdrop && this.$backdrop.remove(), this.$backdrop = null
    }, n.prototype.backdrop = function(e) {
        var i = this,
            o = this.$element.hasClass("fade") ? "fade" : "";
        if (this.isShown && this.options.backdrop) {
            var r = t.support.transition && o;
            if (this.$backdrop = t(document.createElement("div")).addClass("modal-backdrop " + o).appendTo(this.$body), this.$element.on("click.dismiss.bs.modal", t.proxy(function(t) {
                    if (this.ignoreBackdropClick) return void(this.ignoreBackdropClick = !1);
                    t.target === t.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus() : this.hide())
                }, this)), r && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !e) return;
            r ? this.$backdrop.one("bsTransitionEnd", e).emulateTransitionEnd(n.BACKDROP_TRANSITION_DURATION) : e()
        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass("in");
            var s = function() {
                i.removeBackdrop(), e && e()
            };
            t.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", s).emulateTransitionEnd(n.BACKDROP_TRANSITION_DURATION) : s()
        } else e && e()
    }, n.prototype.handleUpdate = function() {
        this.adjustDialog()
    }, n.prototype.adjustDialog = function() {
        var t = this.$element[0].scrollHeight > document.documentElement.clientHeight;
        this.$element.css({
            paddingLeft: !this.bodyIsOverflowing && t ? this.scrollbarWidth : "",
            paddingRight: this.bodyIsOverflowing && !t ? this.scrollbarWidth : ""
        })
    }, n.prototype.resetAdjustments = function() {
        this.$element.css({
            paddingLeft: "",
            paddingRight: ""
        })
    }, n.prototype.checkScrollbar = function() {
        var t = window.innerWidth;
        if (!t) {
            var e = document.documentElement.getBoundingClientRect();
            t = e.right - Math.abs(e.left)
        }
        this.bodyIsOverflowing = document.body.clientWidth < t, this.scrollbarWidth = this.measureScrollbar()
    }, n.prototype.setScrollbar = function() {
        var t = parseInt(this.$body.css("padding-right") || 0, 10);
        this.originalBodyPad = document.body.style.paddingRight || "", this.bodyIsOverflowing && this.$body.css("padding-right", t + this.scrollbarWidth)
    }, n.prototype.resetScrollbar = function() {
        this.$body.css("padding-right", this.originalBodyPad)
    }, n.prototype.measureScrollbar = function() {
        var t = document.createElement("div");
        t.className = "modal-scrollbar-measure", this.$body.append(t);
        var e = t.offsetWidth - t.clientWidth;
        return this.$body[0].removeChild(t), e
    };
    var i = t.fn.modal;
    t.fn.modal = e, t.fn.modal.Constructor = n, t.fn.modal.noConflict = function() {
        return t.fn.modal = i, this
    }, t(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function(n) {
        var i = t(this),
            o = i.attr("href"),
            r = t(i.attr("data-target") || o && o.replace(/.*(?=#[^\s]+$)/, "")),
            s = r.data("bs.modal") ? "toggle" : t.extend({
                remote: !/#/.test(o) && o
            }, r.data(), i.data());
        i.is("a") && n.preventDefault(), r.one("show.bs.modal", function(t) {
            t.isDefaultPrevented() || r.one("hidden.bs.modal", function() {
                i.is(":visible") && i.trigger("focus")
            })
        }), e.call(r, s, this)
    })
}(jQuery),
function(t) {
    "use strict";

    function e(e) {
        return this.each(function() {
            var i = t(this),
                o = i.data("bs.tooltip"),
                r = "object" == typeof e && e;
            !o && /destroy|hide/.test(e) || (o || i.data("bs.tooltip", o = new n(this, r)), "string" == typeof e && o[e]())
        })
    }
    var n = function(t, e) {
        this.type = null, this.options = null, this.enabled = null, this.timeout = null, this.hoverState = null, this.$element = null, this.inState = null, this.init("tooltip", t, e)
    };
    n.VERSION = "3.3.6", n.TRANSITION_DURATION = 150, n.DEFAULTS = {
        animation: !0,
        placement: "top",
        selector: !1,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: !1,
        container: !1,
        viewport: {
            selector: "body",
            padding: 0
        }
    }, n.prototype.init = function(e, n, i) {
        if (this.enabled = !0, this.type = e, this.$element = t(n), this.options = this.getOptions(i), this.$viewport = this.options.viewport && t(t.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : this.options.viewport.selector || this.options.viewport), this.inState = {
                click: !1,
                hover: !1,
                focus: !1
            }, this.$element[0] instanceof document.constructor && !this.options.selector) throw new Error("`selector` option must be specified when initializing " + this.type + " on the window.document object!");
        for (var o = this.options.trigger.split(" "), r = o.length; r--;) {
            var s = o[r];
            if ("click" == s) this.$element.on("click." + this.type, this.options.selector, t.proxy(this.toggle, this));
            else if ("manual" != s) {
                var a = "hover" == s ? "mouseenter" : "focusin",
                    l = "hover" == s ? "mouseleave" : "focusout";
                this.$element.on(a + "." + this.type, this.options.selector, t.proxy(this.enter, this)), this.$element.on(l + "." + this.type, this.options.selector, t.proxy(this.leave, this))
            }
        }
        this.options.selector ? this._options = t.extend({}, this.options, {
            trigger: "manual",
            selector: ""
        }) : this.fixTitle()
    }, n.prototype.getDefaults = function() {
        return n.DEFAULTS
    }, n.prototype.getOptions = function(e) {
        return e = t.extend({}, this.getDefaults(), this.$element.data(), e), e.delay && "number" == typeof e.delay && (e.delay = {
            show: e.delay,
            hide: e.delay
        }), e
    }, n.prototype.getDelegateOptions = function() {
        var e = {},
            n = this.getDefaults();
        return this._options && t.each(this._options, function(t, i) {
            n[t] != i && (e[t] = i)
        }), e
    }, n.prototype.enter = function(e) {
        var n = e instanceof this.constructor ? e : t(e.currentTarget).data("bs." + this.type);
        return n || (n = new this.constructor(e.currentTarget, this.getDelegateOptions()), t(e.currentTarget).data("bs." + this.type, n)), e instanceof t.Event && (n.inState["focusin" == e.type ? "focus" : "hover"] = !0), n.tip().hasClass("in") || "in" == n.hoverState ? void(n.hoverState = "in") : (clearTimeout(n.timeout), n.hoverState = "in", n.options.delay && n.options.delay.show ? void(n.timeout = setTimeout(function() {
            "in" == n.hoverState && n.show()
        }, n.options.delay.show)) : n.show())
    }, n.prototype.isInStateTrue = function() {
        for (var t in this.inState)
            if (this.inState[t]) return !0;
        return !1
    }, n.prototype.leave = function(e) {
        var n = e instanceof this.constructor ? e : t(e.currentTarget).data("bs." + this.type);
        if (n || (n = new this.constructor(e.currentTarget, this.getDelegateOptions()), t(e.currentTarget).data("bs." + this.type, n)), e instanceof t.Event && (n.inState["focusout" == e.type ? "focus" : "hover"] = !1), !n.isInStateTrue()) {
            if (clearTimeout(n.timeout), n.hoverState = "out", !n.options.delay || !n.options.delay.hide) return n.hide();
            n.timeout = setTimeout(function() {
                "out" == n.hoverState && n.hide()
            }, n.options.delay.hide)
        }
    }, n.prototype.show = function() {
        var e = t.Event("show.bs." + this.type);
        if (this.hasContent() && this.enabled) {
            this.$element.trigger(e);
            var i = t.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
            if (e.isDefaultPrevented() || !i) return;
            var o = this,
                r = this.tip(),
                s = this.getUID(this.type);
            this.setContent(), r.attr("id", s), this.$element.attr("aria-describedby", s), this.options.animation && r.addClass("fade");
            var a = "function" == typeof this.options.placement ? this.options.placement.call(this, r[0], this.$element[0]) : this.options.placement,
                l = /\s?auto?\s?/i,
                c = l.test(a);
            c && (a = a.replace(l, "") || "top"), r.detach().css({
                top: 0,
                left: 0,
                display: "block"
            }).addClass(a).data("bs." + this.type, this), this.options.container ? r.appendTo(this.options.container) : r.insertAfter(this.$element), this.$element.trigger("inserted.bs." + this.type);
            var u = this.getPosition(),
                d = r[0].offsetWidth,
                f = r[0].offsetHeight;
            if (c) {
                var p = a,
                    h = this.getPosition(this.$viewport);
                a = "bottom" == a && u.bottom + f > h.bottom ? "top" : "top" == a && u.top - f < h.top ? "bottom" : "right" == a && u.right + d > h.width ? "left" : "left" == a && u.left - d < h.left ? "right" : a, r.removeClass(p).addClass(a)
            }
            var m = this.getCalculatedOffset(a, u, d, f);
            this.applyPlacement(m, a);
            var g = function() {
                var t = o.hoverState;
                o.$element.trigger("shown.bs." + o.type), o.hoverState = null, "out" == t && o.leave(o)
            };
            t.support.transition && this.$tip.hasClass("fade") ? r.one("bsTransitionEnd", g).emulateTransitionEnd(n.TRANSITION_DURATION) : g()
        }
    }, n.prototype.applyPlacement = function(e, n) {
        var i = this.tip(),
            o = i[0].offsetWidth,
            r = i[0].offsetHeight,
            s = parseInt(i.css("margin-top"), 10),
            a = parseInt(i.css("margin-left"), 10);
        isNaN(s) && (s = 0), isNaN(a) && (a = 0), e.top += s, e.left += a, t.offset.setOffset(i[0], t.extend({
            using: function(t) {
                i.css({
                    top: Math.round(t.top),
                    left: Math.round(t.left)
                })
            }
        }, e), 0), i.addClass("in");
        var l = i[0].offsetWidth,
            c = i[0].offsetHeight;
        "top" == n && c != r && (e.top = e.top + r - c);
        var u = this.getViewportAdjustedDelta(n, e, l, c);
        u.left ? e.left += u.left : e.top += u.top;
        var d = /top|bottom/.test(n),
            f = d ? 2 * u.left - o + l : 2 * u.top - r + c,
            p = d ? "offsetWidth" : "offsetHeight";
        i.offset(e), this.replaceArrow(f, i[0][p], d)
    }, n.prototype.replaceArrow = function(t, e, n) {
        this.arrow().css(n ? "left" : "top", 50 * (1 - t / e) + "%").css(n ? "top" : "left", "")
    }, n.prototype.setContent = function() {
        var t = this.tip(),
            e = this.getTitle();
        t.find(".tooltip-inner")[this.options.html ? "html" : "text"](e), t.removeClass("fade in top bottom left right")
    }, n.prototype.hide = function(e) {
        function i() {
            "in" != o.hoverState && r.detach(), o.$element.removeAttr("aria-describedby").trigger("hidden.bs." + o.type), e && e()
        }
        var o = this,
            r = t(this.$tip),
            s = t.Event("hide.bs." + this.type);
        if (this.$element.trigger(s), !s.isDefaultPrevented()) return r.removeClass("in"), t.support.transition && r.hasClass("fade") ? r.one("bsTransitionEnd", i).emulateTransitionEnd(n.TRANSITION_DURATION) : i(), this.hoverState = null, this
    }, n.prototype.fixTitle = function() {
        var t = this.$element;
        (t.attr("title") || "string" != typeof t.attr("data-original-title")) && t.attr("data-original-title", t.attr("title") || "").attr("title", "")
    }, n.prototype.hasContent = function() {
        return this.getTitle()
    }, n.prototype.getPosition = function(e) {
        e = e || this.$element;
        var n = e[0],
            i = "BODY" == n.tagName,
            o = n.getBoundingClientRect();
        null == o.width && (o = t.extend({}, o, {
            width: o.right - o.left,
            height: o.bottom - o.top
        }));
        var r = i ? {
                top: 0,
                left: 0
            } : e.offset(),
            s = {
                scroll: i ? document.documentElement.scrollTop || document.body.scrollTop : e.scrollTop()
            },
            a = i ? {
                width: t(window).width(),
                height: t(window).height()
            } : null;
        return t.extend({}, o, s, a, r)
    }, n.prototype.getCalculatedOffset = function(t, e, n, i) {
        return "bottom" == t ? {
            top: e.top + e.height,
            left: e.left + e.width / 2 - n / 2
        } : "top" == t ? {
            top: e.top - i,
            left: e.left + e.width / 2 - n / 2
        } : "left" == t ? {
            top: e.top + e.height / 2 - i / 2,
            left: e.left - n
        } : {
            top: e.top + e.height / 2 - i / 2,
            left: e.left + e.width
        }
    }, n.prototype.getViewportAdjustedDelta = function(t, e, n, i) {
        var o = {
            top: 0,
            left: 0
        };
        if (!this.$viewport) return o;
        var r = this.options.viewport && this.options.viewport.padding || 0,
            s = this.getPosition(this.$viewport);
        if (/right|left/.test(t)) {
            var a = e.top - r - s.scroll,
                l = e.top + r - s.scroll + i;
            a < s.top ? o.top = s.top - a : l > s.top + s.height && (o.top = s.top + s.height - l)
        } else {
            var c = e.left - r,
                u = e.left + r + n;
            c < s.left ? o.left = s.left - c : u > s.right && (o.left = s.left + s.width - u)
        }
        return o
    }, n.prototype.getTitle = function() {
        var t = this.$element,
            e = this.options;
        return t.attr("data-original-title") || ("function" == typeof e.title ? e.title.call(t[0]) : e.title)
    }, n.prototype.getUID = function(t) {
        do t += ~~(1e6 * Math.random()); while (document.getElementById(t)) return t
    }, n.prototype.tip = function() {
        if (!this.$tip && (this.$tip = t(this.options.template), 1 != this.$tip.length)) throw new Error(this.type + " `template` option must consist of exactly 1 top-level element!");
        return this.$tip
    }, n.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }, n.prototype.enable = function() {
        this.enabled = !0
    }, n.prototype.disable = function() {
        this.enabled = !1
    }, n.prototype.toggleEnabled = function() {
        this.enabled = !this.enabled
    }, n.prototype.toggle = function(e) {
        var n = this;
        e && ((n = t(e.currentTarget).data("bs." + this.type)) || (n = new this.constructor(e.currentTarget, this.getDelegateOptions()), t(e.currentTarget).data("bs." + this.type, n))), e ? (n.inState.click = !n.inState.click, n.isInStateTrue() ? n.enter(n) : n.leave(n)) : n.tip().hasClass("in") ? n.leave(n) : n.enter(n)
    }, n.prototype.destroy = function() {
        var t = this;
        clearTimeout(this.timeout), this.hide(function() {
            t.$element.off("." + t.type).removeData("bs." + t.type), t.$tip && t.$tip.detach(), t.$tip = null, t.$arrow = null, t.$viewport = null
        })
    };
    var i = t.fn.tooltip;
    t.fn.tooltip = e, t.fn.tooltip.Constructor = n, t.fn.tooltip.noConflict = function() {
        return t.fn.tooltip = i, this
    }
}(jQuery),
function(t) {
    "use strict";

    function e(e) {
        return this.each(function() {
            var i = t(this),
                o = i.data("bs.popover"),
                r = "object" == typeof e && e;
            !o && /destroy|hide/.test(e) || (o || i.data("bs.popover", o = new n(this, r)), "string" == typeof e && o[e]())
        })
    }
    var n = function(t, e) {
        this.init("popover", t, e)
    };
    if (!t.fn.tooltip) throw new Error("Popover requires tooltip.js");
    n.VERSION = "3.3.6", n.DEFAULTS = t.extend({}, t.fn.tooltip.Constructor.DEFAULTS, {
        placement: "right",
        trigger: "click",
        content: "",
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    }), n.prototype = t.extend({}, t.fn.tooltip.Constructor.prototype), n.prototype.constructor = n, n.prototype.getDefaults = function() {
        return n.DEFAULTS
    }, n.prototype.setContent = function() {
        var t = this.tip(),
            e = this.getTitle(),
            n = this.getContent();
        t.find(".popover-title")[this.options.html ? "html" : "text"](e), t.find(".popover-content").children().detach().end()[this.options.html ? "string" == typeof n ? "html" : "append" : "text"](n), t.removeClass("fade top bottom left right in"), t.find(".popover-title").html() || t.find(".popover-title").hide()
    }, n.prototype.hasContent = function() {
        return this.getTitle() || this.getContent()
    }, n.prototype.getContent = function() {
        var t = this.$element,
            e = this.options;
        return t.attr("data-content") || ("function" == typeof e.content ? e.content.call(t[0]) : e.content)
    }, n.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".arrow")
    };
    var i = t.fn.popover;
    t.fn.popover = e, t.fn.popover.Constructor = n, t.fn.popover.noConflict = function() {
        return t.fn.popover = i, this
    }
}(jQuery),
function(t) {
    "use strict";

    function e(n, i) {
        this.$body = t(document.body), this.$scrollElement = t(t(n).is(document.body) ? window : n), this.options = t.extend({}, e.DEFAULTS, i), this.selector = (this.options.target || "") + " .nav li > a", this.offsets = [], this.targets = [], this.activeTarget = null, this.scrollHeight = 0, this.$scrollElement.on("scroll.bs.scrollspy", t.proxy(this.process, this)), this.refresh(), this.process()
    }

    function n(n) {
        return this.each(function() {
            var i = t(this),
                o = i.data("bs.scrollspy"),
                r = "object" == typeof n && n;
            o || i.data("bs.scrollspy", o = new e(this, r)), "string" == typeof n && o[n]()
        })
    }
    e.VERSION = "3.3.6", e.DEFAULTS = {
        offset: 10
    }, e.prototype.getScrollHeight = function() {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
    }, e.prototype.refresh = function() {
        var e = this,
            n = "offset",
            i = 0;
        this.offsets = [], this.targets = [], this.scrollHeight = this.getScrollHeight(), t.isWindow(this.$scrollElement[0]) || (n = "position", i = this.$scrollElement.scrollTop()), this.$body.find(this.selector).map(function() {
            var e = t(this),
                o = e.data("target") || e.attr("href"),
                r = /^#./.test(o) && t(o);
            return r && r.length && r.is(":visible") && [
                [r[n]().top + i, o]
            ] || null
        }).sort(function(t, e) {
            return t[0] - e[0]
        }).each(function() {
            e.offsets.push(this[0]), e.targets.push(this[1])
        })
    }, e.prototype.process = function() {
        var t, e = this.$scrollElement.scrollTop() + this.options.offset,
            n = this.getScrollHeight(),
            i = this.options.offset + n - this.$scrollElement.height(),
            o = this.offsets,
            r = this.targets,
            s = this.activeTarget;
        if (this.scrollHeight != n && this.refresh(), e >= i) return s != (t = r[r.length - 1]) && this.activate(t);
        if (s && e < o[0]) return this.activeTarget = null, this.clear();
        for (t = o.length; t--;) s != r[t] && e >= o[t] && (void 0 === o[t + 1] || e < o[t + 1]) && this.activate(r[t])
    }, e.prototype.activate = function(e) {
        this.activeTarget = e, this.clear();
        var n = this.selector + '[data-target="' + e + '"],' + this.selector + '[href="' + e + '"]',
            i = t(n).parents("li").addClass("active");
        i.parent(".dropdown-menu").length && (i = i.closest("li.dropdown").addClass("active")), i.trigger("activate.bs.scrollspy")
    }, e.prototype.clear = function() {
        t(this.selector).parentsUntil(this.options.target, ".active").removeClass("active")
    };
    var i = t.fn.scrollspy;
    t.fn.scrollspy = n, t.fn.scrollspy.Constructor = e, t.fn.scrollspy.noConflict = function() {
        return t.fn.scrollspy = i, this
    }, t(window).on("load.bs.scrollspy.data-api", function() {
        t('[data-spy="scroll"]').each(function() {
            var e = t(this);
            n.call(e, e.data())
        })
    })
}(jQuery),
function(t) {
    "use strict";

    function e(e) {
        return this.each(function() {
            var i = t(this),
                o = i.data("bs.tab");
            o || i.data("bs.tab", o = new n(this)), "string" == typeof e && o[e]()
        })
    }
    var n = function(e) {
        this.element = t(e)
    };
    n.VERSION = "3.3.6", n.TRANSITION_DURATION = 150, n.prototype.show = function() {
        var e = this.element,
            n = e.closest("ul:not(.dropdown-menu)"),
            i = e.data("target");
        if (i || (i = e.attr("href"), i = i && i.replace(/.*(?=#[^\s]*$)/, "")), !e.parent("li").hasClass("active")) {
            var o = n.find(".active:last a"),
                r = t.Event("hide.bs.tab", {
                    relatedTarget: e[0]
                }),
                s = t.Event("show.bs.tab", {
                    relatedTarget: o[0]
                });
            if (o.trigger(r), e.trigger(s), !s.isDefaultPrevented() && !r.isDefaultPrevented()) {
                var a = t(i);
                this.activate(e.closest("li"), n), this.activate(a, a.parent(), function() {
                    o.trigger({
                        type: "hidden.bs.tab",
                        relatedTarget: e[0]
                    }), e.trigger({
                        type: "shown.bs.tab",
                        relatedTarget: o[0]
                    })
                })
            }
        }
    }, n.prototype.activate = function(e, i, o) {
        function r() {
            s.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !1), e.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded", !0), a ? (e[0].offsetWidth, e.addClass("in")) : e.removeClass("fade"), e.parent(".dropdown-menu").length && e.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !0), o && o()
        }
        var s = i.find("> .active"),
            a = o && t.support.transition && (s.length && s.hasClass("fade") || !!i.find("> .fade").length);
        s.length && a ? s.one("bsTransitionEnd", r).emulateTransitionEnd(n.TRANSITION_DURATION) : r(), s.removeClass("in")
    };
    var i = t.fn.tab;
    t.fn.tab = e, t.fn.tab.Constructor = n, t.fn.tab.noConflict = function() {
        return t.fn.tab = i, this
    };
    var o = function(n) {
        n.preventDefault(), e.call(t(this), "show")
    };
    t(document).on("click.bs.tab.data-api", '[data-toggle="tab"]', o).on("click.bs.tab.data-api", '[data-toggle="pill"]', o)
}(jQuery),
function(t) {
    "use strict";

    function e(e) {
        return this.each(function() {
            var i = t(this),
                o = i.data("bs.affix"),
                r = "object" == typeof e && e;
            o || i.data("bs.affix", o = new n(this, r)), "string" == typeof e && o[e]()
        })
    }
    var n = function(e, i) {
        this.options = t.extend({}, n.DEFAULTS, i), this.$target = t(this.options.target).on("scroll.bs.affix.data-api", t.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", t.proxy(this.checkPositionWithEventLoop, this)), this.$element = t(e), this.affixed = null, this.unpin = null, this.pinnedOffset = null, this.checkPosition()
    };
    n.VERSION = "3.3.6", n.RESET = "affix affix-top affix-bottom", n.DEFAULTS = {
        offset: 0,
        target: window
    }, n.prototype.getState = function(t, e, n, i) {
        var o = this.$target.scrollTop(),
            r = this.$element.offset(),
            s = this.$target.height();
        if (null != n && "top" == this.affixed) return o < n && "top";
        if ("bottom" == this.affixed) return null != n ? !(o + this.unpin <= r.top) && "bottom" : !(o + s <= t - i) && "bottom";
        var a = null == this.affixed,
            l = a ? o : r.top,
            c = a ? s : e;
        return null != n && o <= n ? "top" : null != i && l + c >= t - i && "bottom"
    }, n.prototype.getPinnedOffset = function() {
        if (this.pinnedOffset) return this.pinnedOffset;
        this.$element.removeClass(n.RESET).addClass("affix");
        var t = this.$target.scrollTop(),
            e = this.$element.offset();
        return this.pinnedOffset = e.top - t
    }, n.prototype.checkPositionWithEventLoop = function() {
        setTimeout(t.proxy(this.checkPosition, this), 1)
    }, n.prototype.checkPosition = function() {
        if (this.$element.is(":visible")) {
            var e = this.$element.height(),
                i = this.options.offset,
                o = i.top,
                r = i.bottom,
                s = Math.max(t(document).height(), t(document.body).height());
            "object" != typeof i && (r = o = i), "function" == typeof o && (o = i.top(this.$element)), "function" == typeof r && (r = i.bottom(this.$element));
            var a = this.getState(s, e, o, r);
            if (this.affixed != a) {
                null != this.unpin && this.$element.css("top", "");
                var l = "affix" + (a ? "-" + a : ""),
                    c = t.Event(l + ".bs.affix");
                if (this.$element.trigger(c), c.isDefaultPrevented()) return;
                this.affixed = a, this.unpin = "bottom" == a ? this.getPinnedOffset() : null, this.$element.removeClass(n.RESET).addClass(l).trigger(l.replace("affix", "affixed") + ".bs.affix")
            }
            "bottom" == a && this.$element.offset({
                top: s - e - r
            })
        }
    };
    var i = t.fn.affix;
    t.fn.affix = e, t.fn.affix.Constructor = n, t.fn.affix.noConflict = function() {
        return t.fn.affix = i, this
    }, t(window).on("load", function() {
        t('[data-spy="affix"]').each(function() {
            var n = t(this),
                i = n.data();
            i.offset = i.offset || {}, null != i.offsetBottom && (i.offset.bottom = i.offsetBottom), null != i.offsetTop && (i.offset.top = i.offsetTop), e.call(n, i)
        })
    })
}(jQuery), $("body").append('<div id="tag_modal" class="modal fade" tabindex="-1" role="dialog">    <div class="modal-dialog">        <div class="modal-content">            <div class="modal-header">                <h3 class="lcl_options"></h3>            </div>            <div class="modal-body">                <div style="display: -webkit-inline-box">                    <input type="checkbox" id="owner" checked> <span class="lcl_collect_media_owners"></span><br>                </div>                <div style="display: -webkit-inline-box">                    <input type="checkbox" id="likes" checked> <span class="lcl_collect_who_likes_media"></span><br>                </div>                <div style="display: -webkit-inline-box">                    <input type="checkbox" id="comments" checked> <span class="lcl_collect_comments_on_media"></span>                </div>            </div>            <div class="modal-footer">                <div class="fcol-lg-10 col-lg-offset-2" style="display: -webkit-inline-box">                    <button style="background-color:#878787;border-radius:5px;border:1px solid #878787;" class="btn btn-default lcl_cancel" data-dismiss="modal"></button>                    <button id="save_tag" class="btn btn-primary lcl_save" style="border-radius : 5px;"></button>                </div>            </div>        </div>    </div></div>'), $("body").append('<div id="location_modal" class="modal fade" tabindex="-1" role="dialog">    <div class="modal-dialog">        <div class="modal-content">            <div class="modal-header">                <h3 class="lcl_options"></h3>            </div>            <div class="modal-body">                <div style="display: -webkit-inline-box">                    <input type="checkbox" id="owner_l" checked> <span class="lcl_collect_media_owners"></span><br>                </div>                <div style="display: -webkit-inline-box">                    <input type="checkbox" id="likes_l" checked> <span class="lcl_collect_who_likes_media"></span><br>                </div>                <div style="display: -webkit-inline-box">                    <input type="checkbox" id="comments_l" checked> <span class="lcl_collect_comments_on_media"></span>                </div>            </div>            <div class="modal-footer">                <div class="fcol-lg-10 col-lg-offset-2" style="display: -webkit-inline-box">                    <button style="background-color:#878787;border-radius:5px;border:1px solid #878787;" class="btn btn-default lcl_cancel" data-dismiss="modal" style="margin-bottom:5px;border-radius : 5px;"></button>                    <button id="save_location" class="btn btn-primary lcl_save" style="border-radius : 5px;"></button>                </div>            </div>        </div>    </div></div>'), $("body").append('<div id="commenters_modal" class="modal fade" tabindex="-1" role="dialog">    <div class="modal-dialog">        <div class="modal-content">            <div class="modal-header">              <h3 class="lcl_options"></h3>            </div>            <div class="modal-body">                <div style="display: -webkit-inline-box">                    <input type="checkbox" id="likes_c" checked> <span class="lcl_collect_who_likes_media"></span><br>                </div>                <div style="display: -webkit-inline-box">                    <input type="checkbox" id="comments_c" checked> <span class="lcl_collect_comments_on_media"></span>                </div>            </div>            <div class="modal-footer">              <div class="fcol-lg-10 col-lg-offset-2" style="display: -webkit-inline-box">                <button style="background-color:#878787;border-radius:5px;border:1px solid #878787;border-radius:5px;border:1px solid #878787;" class="btn btn-default lcl_cancel" data-dismiss="modal" style="margin-bottom:5px;border-radius : 5px;"></button>                <button id="save_commenters" class="btn btn-primary lcl_save" style="border-radius : 5px;"></button>              <div>            </div>        </div>    </div></div>'), $("body").append('<div id="followers_modal" class="modal fade" tabindex="-1" role="dialog">    <div class="modal-dialog">        <div class="modal-content">            <div class="modal-header">                <h3 class="lcl_options"></h3>            </div>            <div class="modal-body">                <div style="display: -webkit-inline-box">                    <input type="radio" name="followers_type" id="followers_all" checked> <span class="lcl_collect_followers_all" style="vertical-align: -webkit-baseline-middle"></span><br>                </div>                <div style="display: -webkit-inline-box">                    <input type="radio" name="followers_type" id="followers_new"> <span class="lcl_collect_followers_new" style="vertical-align: -webkit-baseline-middle"></span>                </div>            </div>            <div class="modal-footer">                <div class="fcol-lg-10 col-lg-offset-2" style="display: -webkit-inline-box">                    <button style="background-color:#878787;border-radius:5px;border:1px solid #878787;border-radius:5px;border:1px solid #878787;" class="btn btn-default lcl_cancel" data-dismiss="modal" style="margin-bottom:5px;border-radius : 5px;"></button>                    <button id="save_followers_type" class="btn btn-primary lcl_save" style="border-radius : 5px;"></button>                </div>            </div>        </div>    </div></div>'), $("body").append('<div id="user_buttons" style="display:none; position: fixed;bottom: 20px;right: 20px;"><button class="btn btn-success" data-user="" id="commenters_btn" style="margin-bottom:5px;border-radius : 5px;"></button> <button class="btn btn-success" data-user="" id="followers_btn" style="margin-bottom:5px;border-radius : 5px;"></button> </div>'), $("body").append('<button style="margin-bottom:5px;border-radius : 5px;display:none; position: fixed;bottom: 20px;right: 20px;" class="btn btn-success" data-tag="" id="tag_button"></button>'), $("body").append('<button style="display:none; position: fixed;bottom: 60px;right: 20px;margin-bottom:5px;border-radius : 5px;" class="btn btn-primary" data-tag="" id="likes_button"></button>'), $("body").append('<button data-action="add" style="display:none; position: fixed;bottom: 20px;right: 20px;margin-bottom:5px;border-radius : 5px;" data-location="" class="btn btn-success" id="location_button"></button>'), $(".lcl_options").text(chrome.i18n.getMessage("lcl_options")), $(".lcl_collect_media_owners").text(chrome.i18n.getMessage("lcl_collect_media_owners")), $(".lcl_collect_who_likes_media").text(chrome.i18n.getMessage("lcl_collect_who_likes_media")), $(".lcl_collect_comments_on_media").text(chrome.i18n.getMessage("lcl_collect_comments_on_media")), $(".lcl_cancel").text(chrome.i18n.getMessage("lcl_cancel")), $(".lcl_save").text(chrome.i18n.getMessage("lcl_save")), $(".lcl_collect_followers_new").text(chrome.i18n.getMessage("lcl_collect_followers_new")), $(".lcl_collect_followers_all").text(chrome.i18n.getMessage("lcl_collect_followers_all")), $("#likes_button").click(function() {
    message = {
        option: "add_likes_job",
        button: $("#likes_button").attr("id"),
        tag: $("#likes_button").attr("data-tag"),
        action: $("#likes_button").attr("data-action"),
        user: user
    }, chrome.runtime.sendMessage(message)
}), $("#save_tag").click(function() {
    save_tag()
}), $("#save_location").click(function() {
    save_location()
}), $("#save_commenters").click(function() {
    save_commenters()
}), $("#save_followers_type").click(function() {
    save_followers_type()
}), $("#followers_btn").click(function() {
    qi_status_check4($(this))
}), $("#commenters_btn").click(function() {
    qi_status_check3($(this))
}), $("#location_button").click(function() {
    qi_status_check2($(this))
}), $("#tag_button").click(function() {
    qi_status_check($(this))
});
var user;
login_mi = retrieveWindowVariables(["window._sharedData"]), null != login_mi.config.viewer && (user = login_mi.config, chrome.runtime.sendMessage({
    option: "set_user",
    user: login_mi.config
})), chrome.runtime.onMessage.addListener(function(t, e, n) {
    "follow_filter" == t.option && look_up_user(t.users, t.errorWaitTime), "collect_white_list" == t.option && $.ajax({
        url: "https://www.instagram.com/" + user.viewer.username + "/",
        method: "GET"
    }).done(function(e) {
		e = extractData(e);				   
        var n = 0,
            i = 0;
        "true" == t.collect_comments_white_list && (n = 1), "true" == t.collect_likes_white_list && (i = 1), kimler = {
            comments: n,
            likes: i
       }, get_from_medias(e.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges, user.viewer.id, kimler)
    }).fail(function(t, e, n) {}), "collect_from_location" == t.option && $.ajax({
        url: "https://www.instagram.com/explore/locations/" + t.location + "/",
        method: "GET"
    }).done(function(e) {
		
         arr_1 = e.split("window._sharedData = {"), arr_2 = arr_1[1].split("};"), json_s = "{" + arr_2[0] + "}", json_s = JSON.parse(json_s), t.data = json_s.entry_data.LocationsPage[0].graphql.location.edge_location_to_media, t.user = user, chrome.runtime.sendMessage(t)
    }), "unfollow_search" == t.option && ("bos" == t.cursor ? qi_website_check = "https://www.instagram.com/graphql/query/?query_id=17874545323001329&id=" + user.viewer.id + "&first=20" : qi_website_check = "https://www.instagram.com/graphql/query/?query_id=17874545323001329&id=" + user.viewer.id + "&first=10&after=" + t.cursor, $.ajax({
        url: qi_website_check,
        method: "GET"
    }).done(function(e) {
        t.veri2 = e.data.user.edge_follow, t.user = user, user_liste = e.data.user.edge_follow.edges, qi_unfollow_check(user_liste, t, [])
    })), "white_list_search" == t.option && ("bos" == t.cursor ? qi_website_check2 = "https://www.instagram.com/graphql/query/?query_id=17874545323001329&id=" + user.viewer.id + "&first=20" : qi_website_check2 = "https://www.instagram.com/graphql/query/?query_id=17874545323001329&id=" + user.viewer.id + "&first=10&after=" + t.cursor, $.ajax({
        url: qi_website_check2,
        method: "GET"
    }).done(function(e) {
        t.veri = e.data.user.edge_follow, t.user = user, chrome.runtime.sendMessage(t)
    })), "do_follow" == t.option && (takip_et = t.who_follow.user_id, $.ajax({
        url: "https://www.instagram.com/web/friendships/" + takip_et + "/follow/",
        method: "POST",
        beforeSend: function(t) {
            t.setRequestHeader("x-csrftoken", user.csrf_token), t.setRequestHeader("x-instagram-ajax", "1")
        }
    }).done(function(e) {
        t.veri = e, t.user = user, chrome.runtime.sendMessage(t)
    }).fail(function(e, n, i) {
        400 == e.status && ("" == e.responseText ? t.veri = "sil" : t.veri = "hardratelimit", t.user = user, chrome.runtime.sendMessage(t)), 403 == e.status && (t.veri = "ratelimit", t.user = user, chrome.runtime.sendMessage(t))
    })), "do_unfollow" == t.option && (takip_birak = t.who_unfollow.user_id, $.ajax({
        url: "https://www.instagram.com/web/friendships/" + takip_birak + "/unfollow/",
        method: "POST",
        beforeSend: function(t) {
            t.setRequestHeader("x-csrftoken", user.csrf_token), t.setRequestHeader("x-instagram-ajax", "1")
        }
    }).done(function(e) {
        t.veri = e, t.user = user, chrome.runtime.sendMessage(t)
    }).fail(function(e, n, i) {
        400 == e.status && ("" == e.responseText ? t.veri = "sil" : e.hasOwnProperty("responseJSON") ? $.ajax({
            url: "https://www.instagram.com/" + t.who_unfollow.username,
            method: "GET"
        }).done(function(e) {
            t.veri = "hardratelimit"
        }).fail(function(e, n, i) {
            t.veri = "sil"
        }) : t.veri = "hardratelimit", t.user = user, chrome.runtime.sendMessage(t)), 403 == e.status && (t.veri = "ratelimit", t.user = user, chrome.runtime.sendMessage(t))
    })), "do_like" == t.option && $.ajax({
        url: "https://www.instagram.com/web/likes/" + t.media_id + "/like/",
        method: "POST",
        beforeSend: function(t) {
            t.setRequestHeader("x-csrftoken", user.csrf_token), t.setRequestHeader("x-instagram-ajax", "1")
        }
    }).done(function(e) {
		
		
		
        console.log("recv like success"), t.durum = "ok", t.user = user, chrome.runtime.sendMessage(t)
    }).fail(function(e, n, i) {
        console.log("recv like fail"), $.ajax({
            url: "https://www.instagram.com/p/" + t.slug,
            method: "GET"
        }).done(function(e) {
            t.durum = "hata", t.user = user, chrome.runtime.sendMessage(t)
        }).fail(function(e, n, i) {
            t.durum = "hata_sil", t.user = user, chrome.runtime.sendMessage(t)
        })
    }), "do_like2" == t.option && $.ajax({
        url: "https://www.instagram.com/web/likes/" + t.media_id + "/like/",
        method: "POST",
        beforeSend: function(t) {
            t.setRequestHeader("x-csrftoken", user.csrf_token), t.setRequestHeader("x-instagram-ajax", "1")
        }
    }).done(function(t) {}).fail(function(t, e, n) {}), "do_comment" == t.option && (datasi = {
        comment_text: t.comment
    }, $.ajax({
        url: "https://www.instagram.com/web/comments/" + t.media_id + "/add/",
        method: "POST",
        data: datasi,
        beforeSend: function(t) {
            t.setRequestHeader("x-csrftoken", user.csrf_token), t.setRequestHeader("x-instagram-ajax", "1")
        }
    }).done(function(e) {
        t.durum = "ok", t.user = user, chrome.runtime.sendMessage(t)
    }).fail(function(e, n, i) {
        $.ajax({
            url: "https://www.instagram.com/p/" + t.slug,
            method: "GET"
        }).done(function(e) {
            t.durum = "hata", t.user = user, chrome.runtime.sendMessage(t)
        }).fail(function(e, n, i) {
            t.durum = "hata_sil", t.user = user, chrome.runtime.sendMessage(t)
        })
    })), "collect_likes_from_home" == t.option && $.ajax({
        url: "https://www.instagram.com/graphql/query/?query_hash=c9367d7014d7b7bd5ab25765910f5b96&variables={}",
        method: "GET"
    }).done(function(e) {
        t.option = "save_likes", t.veri = e.data.user.edge_web_feed_timeline.edges, t.user = user, chrome.runtime.sendMessage(t)
    }).fail(function(t, e, n) {}), "collect_followers" == t.option && ("ilk" == t.cursor || "son" == t.cursor ? istekler = "https://www.instagram.com/graphql/query/?query_id=17851374694183129&id=" + t.user_id + "&first=20" : istekler = "https://www.instagram.com/graphql/query/?query_id=17851374694183129&id=" + t.user_id + "&first=10&after=" + t.cursor, $.ajax({
        url: istekler,
        method: "GET"
    }).done(function(e) {
        t.veri = e.data.user.edge_followed_by, t.user = user, chrome.runtime.sendMessage(t)
    }).fail(function(e, n, i) {
        t.veri = "hata", t.user = user, chrome.runtime.sendMessage(t)
    })), "set_location_button" == t.option && ($("#location_button").attr("data-location", t.location), t.qi_request ? ($("#location_button").attr("data-action", "remove"), $("#location_button").text("Stop Scrape di lokasi ini"), $("#location_button").addClass("btn-danger"), $("#location_button").removeClass("btn-success")) : ($("#location_button").attr("data-action", "add"), $("#location_button").text("Scrape di lokasi ini"), $("#location_button").addClass("btn-success"), $("#location_button").removeClass("btn-danger")), 0 == $("#location_button").is(":visible") && $("#location_button").show("slow")), "set_tag_button" == t.option && ($("#tag_button").attr("data-tag", t.tag), t.qi_request ? ($("#tag_button").attr("data-action", "remove"), $("#tag_button").text("Stop Scrape Post di hashtags ini"), $("#tag_button").addClass("btn-danger"), $("#tag_button").removeClass("btn-success")) : ($("#tag_button").attr("data-action", "add"), $("#tag_button").text("Scrape Post di hashtags ini"), $("#tag_button").removeClass("btn-danger"), $("#tag_button").addClass("btn-success")), 0 == $("#tag_button").is(":visible") && $("#tag_button").show("slow")), "set_comments_button" == t.option && ($("#comments_button").attr("data-tag", t.tag), t.qi_request ? ($("#comments_button").attr("data-action", "remove"), $("#comments_button").text("Stop"), $("#comments_button").addClass("btn-danger"), $("#comments_button").removeClass("btn-primary")) : ($("#comments_button").attr("data-action", "add"), $("#comments_button").text(chrome.i18n.getMessage("lcl_comments_medias_job")), $("#comments_button").removeClass("btn-danger"), $("#comments_button").addClass("btn-primary")), 0 == $("#comments_button").is(":visible") && $("#comments_button").show("slow")), "set_likes_button" == t.option && ($("#likes_button").attr("data-tag", t.tag), t.qi_request ? ($("#likes_button").attr("data-action", "remove"), $("#likes_button").text("Stop Like Post di hashtags ini"), $("#likes_button").addClass("btn-danger"), $("#likes_button").removeClass("btn-primary")) : ($("#likes_button").attr("data-action", "add"), $("#likes_button").text("Like Post di hashtags ini"), $("#likes_button").removeClass("btn-danger"), $("#likes_button").addClass("btn-primary")), 0 == $("#likes_button").is(":visible") && $("#likes_button").show("slow")), "set_followers_button" == t.option && ($("#followers_btn").attr("data-user", t.qi_exact), t.qi_request ? ($("#followers_btn").attr("data-action", "remove"), $("#followers_btn").text("Stop Scrape Followers Akun ini"), $("#followers_btn").addClass("btn-danger"), $("#followers_btn").removeClass("btn-success")) : ($("#followers_btn").attr("data-action", "add"), $("#followers_btn").text("Scrape Followers Akun ini"), $("#followers_btn").removeClass("btn-danger"), $("#followers_btn").addClass("btn-success")), 0 == $("#user_buttons").is(":visible") && $("#user_buttons").show("slow")), "set_commenters_button" == t.option && ($("#commenters_btn").attr("data-user", t.qi_exact), t.qi_request ? ($("#commenters_btn").attr("data-action", "remove"), $("#commenters_btn").text(chrome.i18n.getMessage("lcl_remove_comments_likes_collect_job")), $("#commenters_btn").addClass("btn-danger"), $("#commenters_btn").removeClass("btn-success")) : ($("#commenters_btn").attr("data-action", "add"), $("#commenters_btn").text("Scrape Likers & Commenters"), $("#commenters_btn").removeClass("btn-danger"), $("#commenters_btn").addClass("btn-success")), 0 == $("#user_buttons").is(":visible") && $("#user_buttons").show("slow"))
}), setInterval(function() {
    do_jobs()
}, 3e3);