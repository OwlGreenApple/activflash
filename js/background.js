function extract(e, t, o) {
    let n = e.indexOf(t);
    if (-1 === n) return null;
    n += t.length;
    let s = e.indexOf(o, n);
    return -1 === s ? null : e.substring(n, s)
}

function extractData(e) {
    try {
        return JSON.parse(extract(e, "<script type=\"text/javascript\">window._sharedData =", ";</script>"))
    } catch (t) {
        return null
    }
}
Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)]
};

function yorum_ayikla(e) {
    arr1 = e.split("[");
    var t = "";
    for (i = 0; i < arr1.length; ++i) 0 == i ? t += arr1[i] : (arr2 = arr1[i].split("]"), 2 == arr2.length ? (rastgele = arr2[0].split(",").random(), t = t + rastgele + arr2[1]) : t = t + "[" + arr2[0]);
    return t
}

function getRandomInt(e, t) {
    return Math.floor(Math.random() * (t - e + 1)) + e
}
chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.query({
        url: "https://www.instagram.com/*"
    }, function(e) {
        0 == e.length && chrome.tabs.create({
            url: "https://www.instagram.com/"
        }), e.forEach(function(e) {
            chrome.tabs.reload(e.id)
        })
    });
    var e = chrome.extension.getURL("index.html");
    chrome.tabs.create({
        url: e
    }), chrome.browserAction.setIcon({
        path: {
            48: "img/48.png"
        }
    })
});

function send_message(e) {
    chrome.tabs.query({
        url: "https://www.instagram.com/*"
    }, function(t) {
        0 < t.length && chrome.tabs.query({
            url: "chrome-extension://" + chrome.runtime.id + "/*"
        }, function(o) {
            0 < o.length && chrome.tabs.sendMessage(t[0].id, e)
        })
    })
}

function collect_followers(e) {
    gecen_zaman = Date.now() - parseInt(my_cookie2(e, "collect_from_followers"));
    gecen_zaman < 1e3 * parseInt(my_cookie2(e, "collect_from_followers_interval")) || (my_cookie2(e, "collect_from_followers", Date.now()), db_sql[e].transaction(function(t) {
        t.executeSql("SELECT * FROM followers_jobs ORDER BY check_time limit 1", [], function(t, o) {
            var n = o.rows.length;
            0 == n || (db_sql[e].transaction(function(e) {
                e.executeSql("UPDATE followers_jobs SET check_time=" + Date.now() + " WHERE user_id=\"" + o.rows.item(0).user_id + "\";")
            }), send_message({
                option: "collect_followers",
                user_id: o.rows.item(0).user_id,
                cursor: o.rows.item(0).cursor
            }))
        }, null)
    }))
}

function do_follow(t) {
    if ("false" != my_cookie2(t, "following_status") && (gecen_zaman = Date.now() - parseInt(my_cookie2(t, "last_follow_time")), !(gecen_zaman < 1e3 * parseInt(my_cookie2(t, "follow_interval"))))) {
        var o = new Date,
            n = o.getMinutes(),
            s = o.getHours();
        simdi = 1e3 * (60 * (60 * s)) + 1e3 * (60 * n), my_cookie2(t, "last_follow_time", Date.now()), yeni_rastgele_follow = getRandomInt(parseInt(my_cookie2(t, "follow_interval_1")), parseInt(my_cookie2(t, "follow_interval_2"))), my_cookie2(t, "follow_interval", yeni_rastgele_follow), db_sql[t].transaction(function(e) {
            e.executeSql("SELECT * FROM sleep_times_follow where start_time<" + simdi + " and end_time>" + simdi, [], function(e, o) {
                var n = o.rows.length;
                if (!(0 < n)) {
                    Date.now();
                    db_index[t].transaction(["follows_done"], "readonly").objectStore("follows_done").index("follow_time").count(IDBKeyRange.bound(Date.now() - 86400000, Date.now())).onsuccess = function(o) {
                        o.target.result < parseInt(my_cookie2(t, "follow_limit")) && (db_index[t].transaction(["follows"], "readonly").objectStore("follows").openCursor(IDBKeyRange.upperBound("Z", !0), "next").onsuccess = function(o) {
                            var e = o.target.result;
                            if (e && null != e.value && null != e.value) {
                                var n = {
                                    userid: t,
                                    username: my_cookie2(t, "username")
                                };
                                /*$.ajax({
                                    url: "https://autoinsta.me/func/check",
                                    data: n,
                                    method: "POST",
                                    dataType: "json",
                                    xhrFields: {
                                        withCredentials: !0
                                    },
                                    crossDomain: !0
                                }).done(function(o) {
                                    return "success" == o.result ? (console.log("check success"), my_cookie2(t, "left_time", o.left_time), void send_message({
                                        option: "do_follow",
                                        who_follow: e.value
                                    })) : void(console.log("check fail"), my_cookie2(t, "following_status", "false"), my_cookie2(t, "left_time", 0), o.option = "licence", chrome.tabs.query({
                                        url: "chrome-extension://" + chrome.runtime.id + "/*"
                                    }, function(e) {
                                        e.forEach(function(e) {
                                            chrome.tabs.sendMessage(e.id, o)
                                        })
                                    }))
                                }).fail(function() {
                                    send_message({
                                        option: "do_follow",
                                        who_follow: e.value
                                    })
                                })*/ 
                                console.log("A")
                            }
                        })
                    }
                }
            }, null)
        })
    }
}

function do_unfollow(t) {
    if ("false" != my_cookie2(t, "unfollowing_status") && (gecen_zaman = Date.now() - parseInt(my_cookie2(t, "last_unfollow_time")), !(gecen_zaman < 1e3 * parseInt(my_cookie2(t, "unfollow_interval"))))) {
        var o = new Date,
            n = o.getMinutes(),
            s = o.getHours();
        simdi = 1e3 * (60 * (60 * s)) + 1e3 * (60 * n), my_cookie2(t, "last_unfollow_time", Date.now()), yeni_rastgele_follow = getRandomInt(parseInt(my_cookie2(t, "unfollow_interval_1")), parseInt(my_cookie2(t, "unfollow_interval_2"))), my_cookie2(t, "unfollow_interval", yeni_rastgele_follow), db_sql[t].transaction(function(e) {
            e.executeSql("SELECT * FROM sleep_times_unfollow where start_time<" + simdi + " and end_time>" + simdi, [], function(e, o) {
                var n = o.rows.length;
                0 < n || (db_index[t].transaction(["unfollows"], "readonly").objectStore("unfollows").index("unfollow_time").count(IDBKeyRange.bound(Date.now() - 86400000, Date.now())).onsuccess = function(o) {
                    o.target.result < parseInt(my_cookie2(t, "unfollow_limit")) && (db_index[t].transaction(["unfollows_waiting"], "readonly").objectStore("unfollows_waiting").index("follow_time").openCursor(IDBKeyRange.upperBound("z"), "next").onsuccess = function(o) {
                        var e = o.target.result;
                        e && null != e.value && null != e.value && (send_message({
                            option: "do_unfollow",
                            who_unfollow: e.value
                        }), my_cookie2(t, "last_unfollow_time", Date.now() + 3e4))
                    })
                })
            }, null)
        })
    }
}

function do_comment(e) {
    var o = Math.floor;

    function t() {
        db_sql_comments[e].transaction(function(t) {
            t.executeSql("SELECT * FROM comments where comments_time=0 order by insert_time limit 1", [], function(t, n) {
                var s = n.rows.length;
                0 == s || db_sql_comments[e].transaction(function(e) {
                    e.executeSql("SELECT * FROM comments_list", [], function(e, t) {
                        var s = t.rows.length;
                        if (0 != s) {
                            var r = o(Math.random() * s);
                            send_message({
                                option: "do_comment",
                                media_id: n.rows.item(0).media_id,
                                slug: n.rows.item(0).slug,
                                comment: yorum_ayikla(t.rows.item(r).comment)
                            })
                        }
                    }, null)
                })
            }, null)
        })
    }
    if ("false" != my_cookie2(e, "comments_status") && (gecen_zaman = Date.now() - parseInt(my_cookie2(e, "last_comments_time")), !(gecen_zaman < 1e3 * parseInt(my_cookie2(e, "comments_interval"))))) {
        my_cookie2(e, "last_comments_time", Date.now());
        var n = new Date,
            s = n.getMinutes(),
            r = n.getHours();
        simdi = 1e3 * (60 * (60 * r)) + 1e3 * (60 * s), db_sql_comments[e].transaction(function(o) {
            o.executeSql("SELECT * FROM sleep_times_comments where start_time<" + simdi + " and end_time>" + simdi, [], function(o, n) {
                var s = n.rows.length;
                0 < s || db_sql_comments[e].transaction(function(o) {
                    o.executeSql("SELECT * FROM comments where comments_time>" + (Date.now() - 86400000), [], function(o, n) {
                        var s = n.rows.length;
                        s > parseInt(my_cookie2(e, "comments_limit")) || t()
                    }, null)
                })
            }, null)
        })
    }
}

function do_like(e) {
    function t() {
        console.log("begin send_like"), db_sql[e].transaction(function(e) {
            e.executeSql("SELECT * FROM likes where likes_time=0 order by insert_time limit 1", [], function(e, t) {
                var o = t.rows.length;
                0 == o || (send_message({
                    option: "do_like",
                    media_id: t.rows.item(0).media_id,
                    slug: t.rows.item(0).slug
                }), console.log("end send_like"))
            }, null)
        })
    }
    if ("false" != my_cookie2(e, "like_status") && (gecen_zaman = Date.now() - parseInt(my_cookie2(e, "last_like_time")), !(gecen_zaman < 1e3 * parseInt(my_cookie2(e, "like_interval"))))) {
        console.log("begin do_like"), my_cookie2(e, "last_like_time", Date.now());
        var o = new Date,
            n = o.getMinutes(),
            s = o.getHours();
        simdi = 1e3 * (60 * (60 * s)) + 1e3 * (60 * n), db_sql[e].transaction(function(o) {
            o.executeSql("SELECT * FROM sleep_times_like where start_time<" + simdi + " and end_time>" + simdi, [], function(o, n) {
                var s = n.rows.length;
                0 < s || db_sql[e].transaction(function(o) {
                    o.executeSql("SELECT * FROM likes where likes_time>" + (Date.now() - 86400000), [], function(o, n) {
                        var s = n.rows.length;
                        s > parseInt(my_cookie2(e, "like_limit")) || t()
                    }, null)
                })
            }, null)
        })
    }
}
var user_cache = [],
    last_col_time = 0;

function col_users_to_pool(e, t) {
    if (t && 1e3 > user_cache.length) {
        let e = Object.keys(t),
            o = e.map(e => ({
                k: e,
                v: t[e]
            }));
        console.log("col_users_to_pool, length:", o.length), user_cache.push(...o)
    }
}

function col_user_job(e) {
    var t = Math.min;
    let o = Date.now();
    if (!(120000 > o - last_col_time) && 0 < user_cache.length) {
        last_col_time = o;
        let n = t(user_cache.length, 20),
            s = user_cache.splice(0, n),
            r = {};
        for (let e of s) r[e.k] = e.v;
        console.log("do_you_have_users len:", s.length), do_you_have_users(e, r, {})
    }
}

function do_you_have_users(t, o, n) {
    if (0 == Object.keys(o).length) return send_message({
        option: "follow_filter",
        users: n
    }), !1;
    if ("undefined" != typeof Object.keys(o)[0]) key = Object.keys(o)[0], value = o[key], delete o[key], new_key = key.toString();
    else return !1;
    db_index[t].transaction(["follows_done"], "readonly").objectStore("follows_done").index("user_id").get(IDBKeyRange.only(new_key)).onsuccess = function(s) {
        s.target.result ? do_you_have_users(t, o, n) : db_index[t].transaction(["unfollows"], "readonly").objectStore("unfollows").index("user_id").get(IDBKeyRange.only(new_key)).onsuccess = function(s) {
            s.target.result ? do_you_have_users(t, o, n) : db_index[t].transaction(["follows"], "readonly").objectStore("follows").index("user_id").get(IDBKeyRange.only(new_key)).onsuccess = function(s) {
                s.target.result ? do_you_have_users(t, o, n) : db_sql_filters[t].transaction(function(e) {
                    e.executeSql("SELECT * FROM users where user_id=\"" + new_key + "\"", [], function(e, s) {
                        var r = s.rows.length;
                        0 == r && (n[key] = value), do_you_have_users(t, o, n)
                    }, null)
                })
            }
        }
    }
}

function get_from_medias(e, t, o, n) {
    if (0 == e.length) return void(0 < Object.keys(n).length && col_users_to_pool(t, n));
    var s = e[0].node || e[0],
        r = s.code || s.shortcode;
    $.ajax({
        url: "https://www.instagram.com/p/" + r + "/?__a=1",
        method: "GET"
    }).done(function(s) {
        if (1 == o.comments && (s.graphql.shortcode_media.edge_media_to_comment ? s.graphql.shortcode_media.edge_media_to_comment.edges.forEach(function(e) {
                n[e.node.owner.id] = e.node.owner.username
            }) : s.graphql.shortcode_media.edge_media_to_parent_comment && s.graphql.shortcode_media.edge_media_to_parent_comment.edges.forEach(function(e) {
                n[e.node.owner.id] = e.node.owner.username
            })), 1 == o.owner && (n[s.graphql.shortcode_media.owner.id] = s.graphql.shortcode_media.owner.username), 1 == o.likes) {
            let s = encodeURI(`https://www.instagram.com/graphql/query/?query_hash=e0f59e4a1c8d78d0161873bc2ee7ec44&variables={"shortcode":"${r}","include_reel":false,"first":24}`);
            $.ajax({
                url: s,
                method: "GET"
            }).done(function(s) {
                s.data.shortcode_media.edge_liked_by.edges.forEach(function(e) {
                    n[e.node.id] = e.node.username
                }), e.shift(), get_from_medias(e, t, o, n)
            }).fail(function() {
                e.shift(), get_from_medias(e, t, o, n)
            })
        } else e.shift(), get_from_medias(e, t, o, n)
    })
}

function collect_commenters(e) {
    gecen_zaman = Date.now() - parseInt(my_cookie2(e, "collect_from_commenters"));
    gecen_zaman < 1e3 * parseInt(my_cookie2(e, "collect_from_commenters_interval")) || (my_cookie2(e, "collect_from_commenters", Date.now()), db_sql[e].transaction(function(t) {
        t.executeSql("SELECT * FROM commenters_jobs ORDER BY check_time limit 1", [], function(t, o) {
            var n = o.rows.length;
            0 == n || (db_sql[e].transaction(function(e) {
                e.executeSql("UPDATE commenters_jobs SET check_time=" + Date.now() + " WHERE user_id=\"" + o.rows.item(0).user_id + "\";")
            }), $.ajax({
                url: "https://www.instagram.com/" + o.rows.item(0).screen_name + "/",
                method: "GET"
            }).done(function(t) {
                t = extractData(t), yorumlar = o.rows.item(0).hasOwnProperty("comments") ? o.rows.item(0).comments : 1, begeniler = o.rows.item(0).hasOwnProperty("likes") ? o.rows.item(0).likes : 1, get_from_medias(t.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges, e, {
                    owner: 0,
                    comments: yorumlar,
                    likes: begeniler
                }, {})
            }).fail(function() {
                my_cookie2(e, "collect_from_commenters", Date.now() + 1e3 * parseInt(my_cookie2(e, "collect_from_commenters_error_interval")))
            }))
        }, null)
    }))
}

function collect_locations(e) {
    gecen_zaman = Date.now() - parseInt(my_cookie2(e, "collect_from_locations"));
    gecen_zaman < 1e3 * parseInt(my_cookie2(e, "collect_from_locations_interval")) || (my_cookie2(e, "collect_from_locations", Date.now()), db_sql[e].transaction(function(t) {
        t.executeSql("SELECT * FROM locations_jobs ORDER BY check_time limit 1", [], function(t, o) {
            var n = o.rows.length;
            0 == n || (db_sql[e].transaction(function(e) {
                e.executeSql("UPDATE locations_jobs SET check_time=" + Date.now() + " WHERE q=\"" + o.rows.item(0).q + "\";")
            }), send_message({
                option: "collect_from_location",
                location: o.rows.item(0).q,
                owner: o.rows.item(0).owner,
                comments: o.rows.item(0).comments,
                likes: o.rows.item(0).likes
            }))
        }, null)
    }))
}

function delete_old_user_filters(e) {
    gecen_zaman = Date.now() - parseInt(my_cookie2(e, "last_user_filters_delete_time"));
    6e4 > gecen_zaman || db_sql_filters[e].transaction(function(t) {
        t.executeSql("DELETE from likes WHERE insert_time<" + (Date.now() - 93600000)), my_cookie2(e, "last_user_filters_delete_time", Date.now())
    })
}

function delete_old_likes(e) {
    gecen_zaman = Date.now() - parseInt(my_cookie2(e, "last_like_delete_time"));
    6e4 > gecen_zaman || db_sql[e].transaction(function(t) {
        t.executeSql("DELETE from likes WHERE likes_time>0 and likes_time<" + (Date.now() - 93600000)), my_cookie2(e, "last_like_delete_time", Date.now())
    })
}

function delete_old_comments(e) {
    gecen_zaman = Date.now() - parseInt(my_cookie2(e, "last_comments_delete_time"));
    6e4 > gecen_zaman || db_sql_comments[e].transaction(function(t) {
        t.executeSql("DELETE from comments WHERE comments_time>0 and comments_time<" + (Date.now() - 540000000)), my_cookie2(e, "last_comments_delete_time", Date.now())
    })
}

function delete_old_error(e) {
    gecen_zaman = Date.now() - parseInt(my_cookie2(e, "last_error_delete_time"));
    6e4 > gecen_zaman || db_sql[e].transaction(function(t) {
        t.executeSql("DELETE from error_log WHERE error_time<" + (Date.now() - 93600000)), my_cookie2(e, "last_error_delete_time", Date.now())
    })
}

function collect_likes_from_home(e) {
    "false" != my_cookie2(e, "like_status") && "false" != my_cookie2(e, "home_like_status") && (gecen_zaman = Date.now() - parseInt(my_cookie2(e, "collect_from_likes_home")), 6e4 > gecen_zaman || (my_cookie2(e, "collect_from_likes_home", Date.now()), db_sql[e].transaction(function(e) {
        e.executeSql("SELECT * FROM likes where likes_time=0", [], function(e, t) {
            var o = t.rows.length;
            100 > o && send_message({
                option: "collect_likes_from_home"
            })
        }, null)
    })))
}

function collect_likes_from_tag(e) {
    "false" != my_cookie2(e, "like_status") && "false" != my_cookie2(e, "tag_like_status") && (gecen_zaman = Date.now() - parseInt(my_cookie2(e, "collect_from_likes_tag")), 6e4 > gecen_zaman || (my_cookie2(e, "collect_from_likes_tag", Date.now()), db_sql[e].transaction(function(t) {
        t.executeSql("SELECT * FROM likes where likes_time=0", [], function(t, o) {
            var n = o.rows.length;
            100 > n && db_sql[e].transaction(function(t) {
                t.executeSql("SELECT * FROM likes_jobs ORDER BY check_time limit 1", [], function(t, o) {
                    var n = o.rows.length;
                    0 == n || (db_sql[e].transaction(function(e) {
                        e.executeSql("UPDATE likes_jobs SET check_time=" + Date.now() + " WHERE q=\"" + o.rows.item(0).q + "\";")
                    }), $.ajax({
                        url: "https://www.instagram.com/explore/tags/" + o.rows.item(0).q + "/?__a=1",
                        method: "GET"
                    }).done(function(t) {
                        t.graphql.hashtag.edge_hashtag_to_media.edges.forEach(function(t) {
                            let o = t.node;
                            db_sql[e].transaction(function(e) {
                                e.executeSql("INSERT INTO likes (user_id, media_id, slug, image, insert_time, likes_time)  VALUES (\"" + o.owner.id + "\", \"" + o.id + "\", \"" + o.shortcode + "\", \"" + o.display_url + "\",  " + Date.now() + ",0);")
                            })
                        })
                    }).fail(function() {
                        my_cookie2(e, "collect_from_likes_tag", Date.now() + 6e5)
                    }))
                }, null)
            })
        }, null)
    })))
}

function collect_comments_from_tag(e) {
    "false" != my_cookie2(e, "comments_status") && (gecen_zaman = Date.now() - parseInt(my_cookie2(e, "collect_from_comments_tag")), 6e4 > gecen_zaman || (my_cookie2(e, "collect_from_comments_tag", Date.now()), db_sql_comments[e].transaction(function(t) {
        t.executeSql("SELECT * FROM comments where comments_time=0", [], function(t, o) {
            var n = o.rows.length;
            100 > n && db_sql_comments[e].transaction(function(t) {
                t.executeSql("SELECT * FROM comments_jobs ORDER BY check_time limit 1", [], function(t, o) {
                    var n = o.rows.length;
                    0 == n || (db_sql_comments[e].transaction(function(e) {
                        e.executeSql("UPDATE comments_jobs SET check_time=" + Date.now() + " WHERE q=\"" + o.rows.item(0).q + "\";")
                    }), $.ajax({
                        url: "https://www.instagram.com/explore/tags/" + o.rows.item(0).q + "/?__a=1",
                        method: "GET"
                    }).done(function(t) {
                        t.graphql.hashtag.edge_hashtag_to_media.edges.forEach(function(t) {
                            let o = t.node;
                            db_sql_comments[e].transaction(function(e) {
                                e.executeSql("INSERT INTO comments (user_id, media_id, slug, image, insert_time, comments_time)  VALUES (\"" + o.owner.id + "\", \"" + o.id + "\", \"" + o.shortcode + "\", \"" + o.display_url + "\",  " + Date.now() + ",0);")
                            })
                        })
                    }).fail(function() {
                        my_cookie2(e, "collect_from_comments_tag", Date.now() + 6e5)
                    }))
                }, null)
            })
        }, null)
    })))
}

function collect_searches(e) {
    gecen_zaman = Date.now() - parseInt(my_cookie2(e, "collect_from_searches"));
    gecen_zaman < 1e3 * parseInt(my_cookie2(e, "collect_from_searches_interval")) || (my_cookie2(e, "collect_from_searches", Date.now()), db_sql[e].transaction(function(t) {
        t.executeSql("SELECT * FROM searches_jobs ORDER BY check_time limit 1", [], function(t, o) {
            var n = o.rows.length;
            0 == n || (db_sql[e].transaction(function(e) {
                e.executeSql("UPDATE searches_jobs SET check_time=" + Date.now() + " WHERE q=\"" + o.rows.item(0).q + "\";")
            }), $.ajax({
                url: "https://www.instagram.com/explore/tags/" + o.rows.item(0).q + "/?__a=1",
                method: "GET"
            }).done(function(t) {
                get_from_medias(t.graphql.hashtag.edge_hashtag_to_media.edges, e, o.rows.item(0), {})
            }).fail(function() {
                my_cookie2(e, "collect_from_searches", Date.now() + 1e3 * parseInt(my_cookie2(e, "collect_from_searches_error_interval")))
            }))
        }, null)
    }))
}

function do_collects(t) {
    if ("false" != my_cookie2(t, "pool_collect_status")) {
        var o = db_index[t].transaction(["follows"], "readonly").objectStore("follows").count();
        o.onsuccess = function(o) {
            let e = o.target.result + user_cache.length;
            1e3 < e || e > parseInt(my_cookie2(t, "pool_limit")) || (collect_followers(t), collect_locations(t), collect_commenters(t), collect_searches(t))
        }
    }
}

function collect_white_list(e) {
    "false" != my_cookie2(e, "collect_white_list") && ("false" != my_cookie2(e, "collect_likes_white_list") || "false" != my_cookie2(e, "collect_comments_white_list")) && (gecen_zaman = Date.now() - parseInt(my_cookie2(e, "collect_white_list_last_time")), 1e5 > gecen_zaman || (my_cookie2(e, "collect_white_list_last_time", Date.now()), send_message({
        option: "collect_white_list",
        collect_likes_white_list: my_cookie2(e, "collect_likes_white_list"),
        collect_comments_white_list: my_cookie2(e, "collect_comments_white_list")
    })))
}

function white_list_search(e) {
    "end" != my_cookie2(e, "white_list_cursor") && (gecen_zaman = Date.now() - parseInt(my_cookie2(e, "last_white_list_scan_time")), 6e4 > gecen_zaman || (my_cookie2(e, "last_white_list_scan_time", Date.now()), send_message({
        option: "white_list_search",
        cursor: my_cookie2(e, "white_list_cursor")
    })))
}

function unfollow_search(e) {
    "end" != my_cookie2(e, "unfollow_cursor") && "false" != my_cookie2(e, "unfollowing_status") && (gecen_zaman = Date.now() - parseInt(my_cookie2(e, "last_unfollow_scan_time")), 120000 > gecen_zaman || (my_cookie2(e, "last_unfollow_scan_time", Date.now()), send_message({
        option: "unfollow_search",
        cursor: my_cookie2(e, "unfollow_cursor")
    })))
}

function do_auto_unfollow(e) {
    "false" != my_cookie2(e, "auto_unfollow_enable") && (gecen_zaman = Date.now() - parseInt(my_cookie2(e, "last_auto_unfollow_time")), gecen_zaman < 864e5 * parseInt(my_cookie2(e, "auto_unfollow_days")) || (my_cookie2(e, "last_auto_unfollow_time", Date.now()), my_cookie2(e, "unfollow_cursor", "bos"), my_cookie2(e, "unfollowing_status", "true")))
}

function check_insta_tab() {
    chrome.tabs.query({
        url: "https://www.instagram.com/*"
    }, function(e) {
        message = 0 < e.length ? {
            option: "check_insta_tab",
            durum: !0
        } : {
            option: "check_insta_tab",
            durum: !1
        }, chrome.tabs.query({
            url: "chrome-extension://" + chrome.runtime.id + "/*"
        }, function(e) {
            e.forEach(function(e) {
                chrome.tabs.sendMessage(e.id, message)
            })
        })
    })
}

function do_jobs() {
    (user_id = my_cookie2("genel", "user_id"), null != user_id) && (db_sql.hasOwnProperty(user_id) || connect_sql_db(user_id), db_index[user_id] && (do_collects(user_id), unfollow_search(user_id), do_auto_unfollow(user_id), white_list_search(user_id), collect_white_list(user_id), do_unfollow(user_id), do_follow(user_id), do_like(user_id), do_comment(user_id), get_followers_count(user_id), get_follows_count(user_id), delete_old_likes(user_id), delete_old_comments(user_id), delete_old_user_filters(user_id), delete_old_error(user_id), collect_likes_from_tag(user_id), collect_comments_from_tag(user_id), collect_likes_from_home(user_id), col_user_job(user_id)))
}
setInterval(function() {
    chrome.tabs.query({
        url: "https://www.instagram.com/*"
    }, function(e) {
        0 < e.length && chrome.tabs.query({
            url: "chrome-extension://" + chrome.runtime.id + "/*"
        }, function(e) {
            0 < e.length && do_jobs()
        })
    }), check_insta_tab()
}, 1e3);

function my_cookie2(e, t, o, n) {
    return void 0 === o || null === o ? (deger = localStorage.getItem(t), void 0 === deger || null === deger ? null : deger) : void(db_index[e].transaction(["settings"], "readwrite").objectStore("settings").put({
        key: t,
        value: o
    }).onsuccess = function() {
        n && n(t, e)
    }, localStorage.setItem(t, o))
}

function get_followers_count(e) {
    gecen_zaman = Date.now() - parseInt(my_cookie2(e, "last_follower_check_time"));
    1800000 > gecen_zaman || ($.ajax({
        url: "https://www.instagram.com/" + localStorage.username + "/",
        method: "GET"
    }).done(function(t) {
        t = extractData(t), update_follower_statistics(e, t.entry_data.ProfilePage[0].graphql.user.edge_followed_by.count)
    }), my_cookie2(e, "last_follower_check_time", Date.now()))
}

function get_follows_count(e) {
    gecen_zaman = Date.now() - parseInt(my_cookie2(e, "last_follows_count_check_time"));
    60000 > gecen_zaman || ($.ajax({
        url: "https://www.instagram.com/" + localStorage.username + "/",
        method: "GET"
    }).done(function(t) {
        t = extractData(t), update_follows_statistics(e, t.entry_data.ProfilePage[0].graphql.user.edge_follow.count)
    }), my_cookie2(e, "last_follows_count_check_time", Date.now()))
}
var db_sql = [],
    db_sql_comments = [],
    db_sql_filters = [],
    db_index = {};

function set_defaults(t, o) {
    function n() {
        return Object.keys(key_arr).length == s ? void(o && o()) : void(cikacak = Object.keys(key_arr)[s], db_index[t].transaction(["settings"], "readwrite").objectStore("settings").get(IDBKeyRange.only(cikacak)).onsuccess = function(o) {
            o.target.result ? my_cookie2(t, cikacak, o.target.result.value) : my_cookie2(t, cikacak, key_arr[cikacak]), s++, n()
        })
    }
    key_arr = {
        collect_from_followers: Date.now(),
        collect_from_followers_error_interval: "300",
        collect_from_followers_interval: "60",
        collect_from_commenters: Date.now(),
        collect_from_commenters_error_interval: "300",
        collect_from_commenters_interval: "60",
        collect_from_searches: Date.now(),
        collect_from_searches_error_interval: "300",
        collect_from_searches_interval: "60",
        collect_from_locations: Date.now(),
        collect_from_locations_error_interval: "300",
        collect_from_locations_interval: "60",
        collect_from_location_areas: Date.now(),
        collect_from_location_areas_error_interval: "300",
        collect_from_location_areas_interval: "60",
        follow_error_interval: "60",
        follow_interval: "51",
        follow_interval_1: "60",
        follow_interval_2: "65",
        followers_statistics_time: Date.now(),
        following_status: "true",
        last_follow_time: Date.now(),
        last_unfollow_time: Date.now(),
        pool_collect_status: "true",
        pool_limit: "1000",
        unfollow_error_interval: "600",
        unfollow_interval: "52",
        unfollow_interval_1: "60",
        unfollow_interval_2: "65",
        unfollowing_status: "false",
        unfollow_only_bot_followed: "true",
        son_takip_edilenler_zaman: Date.now(),
        update_statistics_last_time: Date.now(),
        follow_limit: "1000",
        unfollow_limit: "1000",
        days_unfollow: "1",
        who_follow: "true",
        auto_unfollow_days: "1",
        auto_unfollow_enable: "false",
        last_auto_unfollow_time: Date.now(),
        unfollow_scanned_users: "0",
        last_unfollow_scan_time: Date.now(),
        last_white_list_scan_time: Date.now(),
        unfollow_cursor: "end",
        white_list_cursor: "end",
        last_follower_check_time: Date.now(),
        collect_from_likes_tag: Date.now(),
        collect_from_likes_home: Date.now(),
        home_like_status: "false",
        tag_like_status: "false",
        like_status: "false",
        like_interval: "60",
        like_error_interval: "300",
        like_limit: "2000",
        last_like_time: Date.now(),
        last_like_delete_time: Date.now(),
        last_user_filters_delete_time: Date.now(),
        comments_status: "false",
        comments_interval: "60",
        comments_error_interval: "300",
        comments_limit: "2000",
        collect_from_comments_tag: Date.now(),
        last_comments_time: Date.now(),
        last_comments_delete_time: Date.now(),
        last_error_delete_time: Date.now(),
        last_hardratelimit: Date.now(),
        white_list_users: "",
        collect_white_list: "false",
        collect_likes_white_list: "true",
        collect_comments_white_list: "true",
        collect_white_list_last_time: Date.now(),
        filter_following_count_small: "",
        filter_following_count_big: "",
        filter_followers_count_small: "",
        filter_followers_count_big: "",
        filter_media_count_small: "",
        filter_media_count_big: "",
        private_public_filter: "public",
        filter_external_link: "false",
        filter_black_list: "",
        gender_filter: "all",
        last_follows_count_check_time: Date.now(),
        left_time: Date.now(),
        queryErrorWaitTime: 50,
        queryBatchDelayTime: 25,
        last_count_liked: "",
        last_count_followed: "",
        last_count_unfollowed: ""
    };
    var s = 0;
    n()
}
var old_index_db_version = "yok";

function update_to_v102(e) {
    "yok" == old_index_db_version && setTimeout(function() {
        update_to_v102(e)
    }, 2e3), 5 == old_index_db_version && (my_cookie2(e, "collect_from_followers_error_interval", "300"), my_cookie2(e, "collect_from_commenters_error_interval", "300"), my_cookie2(e, "collect_from_searches_error_interval", "300"), my_cookie2(e, "collect_from_locations_error_interval", "300"), my_cookie2(e, "collect_from_location_areas_error_interval", "300"), my_cookie2(e, "follow_error_interval", "60"), my_cookie2(e, "unfollow_error_interval", "600"))
}

function connect_sql_db(t) {
    console.log("x connect_sql_db"), db_sql_comments[t] = window.openDatabase("autoinsta_comments3_" + t, "", "activflash Comments", null, function() {}), db_sql_comments[t].transaction(function(e) {
        e.executeSql("CREATE TABLE comments_jobs (q TEXT unique, check_time INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS comments (user_id TEXT unique, media_id TEXT, slug TEXT, image TEXT, insert_time INTEGER, comments_time INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS comments_list (id INTEGER PRIMARY KEY   AUTOINCREMENT,comment TEXT unique,use_time INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS st_comments (gun INTEGER unique, sayi INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS sleep_times_comments (id INTEGER PRIMARY KEY   AUTOINCREMENT, start_time INTEGER, end_time INTEGER)")
    }), db_sql_filters[t] = window.openDatabase("autoinsta_filters_" + t, "", "activflash Filters", null, function() {}), db_sql_filters[t].transaction(function(e) {
        e.executeSql("CREATE TABLE IF NOT EXISTS users (user_id TEXT unique, username TEXT, insert_time INTEGER)")
    }), db_sql[t] = window.openDatabase("autoinsta_" + t, "", "activflash", null, function() {}), db_sql[t].transaction(function(e) {
        e.executeSql("CREATE TABLE IF NOT EXISTS st_follow (gun INTEGER unique, sayi INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS st_unfollow (gun INTEGER unique, sayi INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS st_followers (gun INTEGER unique, sayi INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS st_follows (gun INTEGER unique, sayi INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS st_likes (gun INTEGER unique, sayi INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS followers_jobs (user_id TEXT unique, screen_name TEXT, cursor TEXT, check_time INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS commenters_jobs (user_id TEXT unique, screen_name TEXT, check_time INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS searches_jobs (q TEXT unique, owner INTEGER, likes INTEGER, comments INTEGER, check_time INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS locations_jobs (q TEXT unique, owner INTEGER, likes INTEGER, comments INTEGER, name TEXT, check_time INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS location_areas_jobs (q TEXT unique, owner INTEGER, likes INTEGER, comments INTEGER, distance INTEGER, check_time INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS likes_jobs (q TEXT unique, check_time INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS likes (user_id TEXT unique, media_id TEXT, slug TEXT, image TEXT, insert_time INTEGER, likes_time INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS error_log (action TEXT, item TEXT, error_type TEXT, error_time INTEGER, next_time INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS sleep_times_follow (id INTEGER PRIMARY KEY   AUTOINCREMENT, start_time INTEGER, end_time INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS sleep_times_unfollow (id INTEGER PRIMARY KEY   AUTOINCREMENT, start_time INTEGER, end_time INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS sleep_times_like (id INTEGER PRIMARY KEY   AUTOINCREMENT, start_time INTEGER, end_time INTEGER)"), e.executeSql("ALTER TABLE commenters_jobs ADD COLUMN comments INTEGER DEFAULT 1;"), e.executeSql("ALTER TABLE commenters_jobs ADD COLUMN likes INTEGER DEFAULT 1;")
    });
    var o = localStorage.db_version || 0;
    10 != o && (indexedDB.deleteDatabase("autoinsta_" + t), localStorage.db_version = 10);
    var n = indexedDB.open("autoinsta_" + t, 10);
    n.onupgradeneeded = function(t) {
        var e = t.target.result,
            o = t.target.transaction;
        if (old_index_db_version = t.oldVersion, !e.objectStoreNames.contains("follows")) var n = e.createObjectStore("follows", {
            autoIncrement: !0
        });
        else var n = o.objectStore("follows");
        if (!e.objectStoreNames.contains("follows_done")) var s = e.createObjectStore("follows_done", {
            autoIncrement: !0
        });
        else var s = o.objectStore("follows_done");
        if (!e.objectStoreNames.contains("unfollows")) var r = e.createObjectStore("unfollows", {
            autoIncrement: !0
        });
        else var r = o.objectStore("unfollows");
        if (!e.objectStoreNames.contains("unfollows_waiting")) var l = e.createObjectStore("unfollows_waiting", {
            autoIncrement: !0
        });
        else var l = o.objectStore("unfollows_waiting");
        if (!e.objectStoreNames.contains("settings")) var _ = e.createObjectStore("settings", {
            autoIncrement: !0,
            keyPath: "key"
        });
        else var _ = o.objectStore("settings");
        if (!e.objectStoreNames.contains("white_list2")) var a = e.createObjectStore("white_list2", {
            autoIncrement: !0,
            keyPath: "key"
        });
        else var a = o.objectStore("white_list2");
        a.indexNames.contains("username") || a.createIndex("username", "username", {
            unique: !0
        }), n.indexNames.contains("user_id") || n.createIndex("user_id", "user_id", {
            unique: !0
        }), s.indexNames.contains("user_id") || s.createIndex("user_id", "user_id", {
            unique: !0
        }), s.indexNames.contains("follow_time") || s.createIndex("follow_time", "follow_time"), s.indexNames.contains("result,follow_time") || s.createIndex("result,follow_time", ["result", "follow_time"]), r.indexNames.contains("user_id") || r.createIndex("user_id", "user_id", {
            unique: !0
        }), r.indexNames.contains("unfollow_time") || r.createIndex("unfollow_time", "unfollow_time"), r.indexNames.contains("follow_time") || r.createIndex("follow_time", "follow_time"), l.indexNames.contains("follow_time") || l.createIndex("follow_time", "follow_time"), l.indexNames.contains("user_id") || l.createIndex("user_id", "user_id", {
            unique: !0
        }), _.indexNames.contains("key") || _.createIndex("key", "key", {
            unique: !0
        })
    }, n.onsuccess = function(o) {
        db_index[t] = o.target.result, set_defaults(t), update_to_v102(t);
        let e = my_cookie2(t, "white_list_users");
        if (e && 5 < e.length)
            for (yeni_deger = e.split(","), i = 0; i < yeni_deger.length; i++) db_index[t].transaction(["white_list2"], "readwrite").objectStore("white_list2").put({
                username: yeni_deger[i],
                nerden: "follows"
            }).onsuccess = function() {}
    }
}

function user_filter(e, t) {
    if (user_id = my_cookie2("genel", "user_id"), e.hasOwnProperty("id") && e.id == user_id) return void t(!1);
    if (e.profile_pic_url) {
        let o = e.profile_pic_url.split("/");
        if (0 < o.length && "11906329_960233084022564_1448528159_a.jpg" == o[o.length - 1]) return void t(!1)
    }
    if (e.hasOwnProperty("biography") && "" != my_cookie2(user_id, "filter_black_list") && null != e.biography) {
        yeni_deger = my_cookie2(user_id, "filter_black_list").toLowerCase().split(","), biography = e.biography.toLowerCase();
        var o = !0;
        for (i = 0; i < yeni_deger.length; i++) {
            var n = yeni_deger[i].trim();
            "" != n && -1 < biography.indexOf(n) && (o = !1)
        }
        if (!1 == o) return void t(!1)
    }
    if (e.hasOwnProperty("edge_follow") && "" != my_cookie2(user_id, "filter_following_count_big") && e.edge_follow.count > parseInt(my_cookie2(user_id, "filter_following_count_big"))) return void t(!1);
    if (e.hasOwnProperty("edge_followed_by") && "" != my_cookie2(user_id, "filter_followers_count_big") && e.edge_followed_by.count > parseInt(my_cookie2(user_id, "filter_followers_count_big"))) return void t(!1);
    if (e.hasOwnProperty("edge_owner_to_timeline_media") && "" != my_cookie2(user_id, "filter_media_count_big") && e.edge_owner_to_timeline_media.count > parseInt(my_cookie2(user_id, "filter_media_count_big"))) return void t(!1);
    if (e.hasOwnProperty("edge_follow") && "" != my_cookie2(user_id, "filter_following_count_small") && e.edge_follow.count < parseInt(my_cookie2(user_id, "filter_following_count_small"))) return void t(!1);
    if (e.hasOwnProperty("edge_followed_by") && "" != my_cookie2(user_id, "filter_followers_count_small") && e.edge_followed_by.count < parseInt(my_cookie2(user_id, "filter_followers_count_small"))) return void t(!1);
    if (e.hasOwnProperty("edge_owner_to_timeline_media") && "" != my_cookie2(user_id, "filter_media_count_small") && e.edge_owner_to_timeline_media.count < parseInt(my_cookie2(user_id, "filter_media_count_small"))) return void t(!1);
    if (e.hasOwnProperty("is_private") && "both" != my_cookie2(user_id, "private_public_filter")) {
        if (!0 == e.is_private && "public" == my_cookie2(user_id, "private_public_filter")) return void t(!1);
        if (!1 == e.is_private && "private" == my_cookie2(user_id, "private_public_filter")) return void t(!1)
    }
    if (e.hasOwnProperty("blocked_by_viewer") && e.blocked_by_viewer) return void t(!1);
    if (e.hasOwnProperty("follows_viewer") && e.follows_viewer) return void t(!1);
    if (e.hasOwnProperty("has_blocked_viewer") && e.has_blocked_viewer) return void t(!1);
    if (e.hasOwnProperty("has_requested_viewer") && e.has_requested_viewer) return void t(!1);
    if (e.hasOwnProperty("followed_by_viewer") && e.followed_by_viewer) return void t(!1);
    if (e.hasOwnProperty("requested_by_viewer") && e.requested_by_viewer) return void t(!1);
    if (e.hasOwnProperty("profile_pic_url") && "https://scontent-fra3-1.cdninstagram.com/t51.2885-19/11906329_960233084022564_1448528159_a.jpg" == e.profile_pic_url) return void t(!1);
    if (e.hasOwnProperty("external_url") && null != e.external_url && "true" == my_cookie2(user_id, "filter_external_link")) return void t(!1);
    if ("all" == my_cookie2(user_id, "gender_filter")) return void t(!0);
    if (e.hasOwnProperty("full_name")) {
        if ((null == e.full_name || "null" == e.full_name) && ("males" == my_cookie2(user_id, "gender_filter") || "females" == my_cookie2(user_id, "gender_filter"))) return void t(!1);
        name_arr = e.full_name.split(" "), name = name_arr[0].toLowerCase();
        /*$.ajax({
            url: "http://gender.autoinsta.me/?name=" + name,
            error: function() {
                t(!0)
            },
            success: function(e) {
                if (e.hasOwnProperty("gender")) {
                    if (null == e.gender || "null" == e.gender) return "females_other" == my_cookie2(user_id, "gender_filter") || "males_other" == my_cookie2(user_id, "gender_filter") ? void t(!0) : void t(!1);
                    if ("male" == e.gender) return "males" == my_cookie2(user_id, "gender_filter") ? void t(!0) : void t(!1);
                    if ("female" == e.gender) return "females" == my_cookie2(user_id, "gender_filter") ? void t(!0) : void t(!1)
                } else return void t(!0)
            },
            timeout: 2e3,
            dataType: "json"
        })*/
        console.log("B");
    } else return void t(!0)
}

function insert_pool2(t, o) {
    user_filter(t, function(e) {
        !0 == e ? db_index[o].transaction(["follows_done"], "readonly").objectStore("follows_done").index("user_id").get(IDBKeyRange.only(t.id)).onsuccess = function(n) {
            n.target.result || (db_index[o].transaction(["unfollows"], "readonly").objectStore("unfollows").index("user_id").get(IDBKeyRange.only(t.id)).onsuccess = function(n) {
                if (!n.target.result) {
                    var e = {
                        user_id: t.id,
                        username: t.username
                    };
                    db_index[o].transaction(["follows"], "readwrite").objectStore("follows").add(e)
                }
            })
        } : db_sql_filters[o].transaction(function(e) {
            e.executeSql("INSERT INTO users (user_id, username, insert_time)  VALUES (\"" + t.id + "\",\"" + t.username + "\", " + Date.now() + ");")
        })
    })
}

function get_date_time(e) {
    e = "undefined" == typeof e ? Date.now() : e;
    var t = new Date(e),
        o = t.getMonth() + 1 + "/" + t.getDate() + "/" + t.getFullYear();
    return my_time = new Date(o).getTime(), my_time
}

function get_date_format(e) {
    e = "undefined" == typeof e ? Date.now() : e;
    var t = new Date(e),
        o = t.getDate() + "/" + (t.getMonth() + 1) + "/" + t.getFullYear();
    return o
}

function update_follow_statistics(e) {
    gun = get_date_time(), db_sql[e].transaction(function(t) {
        t.executeSql("SELECT * FROM st_follow where gun=" + gun, [], function(t, o) {
            var n = o.rows.length;
            0 == n ? db_sql[e].transaction(function(e) {
                e.executeSql("INSERT INTO st_follow (gun, sayi)  VALUES (" + gun + ", 1);")
            }) : db_sql[e].transaction(function(e) {
                e.executeSql("UPDATE st_follow SET sayi=" + (o.rows.item(0).sayi + 1) + " WHERE gun=" + gun + ";")
            })
        }, null)
    })
}

function update_follower_statistics(e, t) {
    gun = get_date_time(), db_sql[e].transaction(function(o) {
        o.executeSql("SELECT * FROM st_followers where gun=" + gun, [], function(o, n) {
            var s = n.rows.length;
            0 == s ? db_sql[e].transaction(function(e) {
                e.executeSql("INSERT INTO st_followers (gun, sayi)  VALUES (" + gun + ", " + t + ");")
            }) : db_sql[e].transaction(function(e) {
                e.executeSql("UPDATE st_followers SET sayi=" + t + " WHERE gun=" + gun + ";")
            })
        }, null)
    })
}

function update_follows_statistics(e, t) {
    gun = get_date_time(), db_sql[e].transaction(function(o) {
        o.executeSql("SELECT * FROM st_follows where gun=" + gun, [], function(o, n) {
            var s = n.rows.length;
            0 == s ? db_sql[e].transaction(function(e) {
                e.executeSql("INSERT INTO st_follows (gun, sayi)  VALUES (" + gun + ", " + t + ");")
            }) : db_sql[e].transaction(function(e) {
                e.executeSql("UPDATE st_follows SET sayi=" + t + " WHERE gun=" + gun + ";")
            })
        }, null)
    })
}

function update_unfollow_statistics(e) {
    gun = get_date_time(), db_sql[e].transaction(function(t) {
        t.executeSql("SELECT * FROM st_unfollow where gun=" + gun, [], function(t, o) {
            var n = o.rows.length;
            0 == n ? db_sql[e].transaction(function(e) {
                e.executeSql("INSERT INTO st_unfollow (gun, sayi)  VALUES (" + gun + ", 1);")
            }) : db_sql[e].transaction(function(e) {
                e.executeSql("UPDATE st_unfollow SET sayi=" + (o.rows.item(0).sayi + 1) + " WHERE gun=" + gun + ";")
            })
        }, null)
    })
}

function update_comments_statistics(e) {
    gun = get_date_time(), db_sql_comments[e].transaction(function(t) {
        t.executeSql("SELECT * FROM st_comments where gun=" + gun, [], function(t, o) {
            var n = o.rows.length;
            0 == n ? db_sql_comments[e].transaction(function(e) {
                e.executeSql("INSERT INTO st_comments (gun, sayi)  VALUES (" + gun + ", 1);")
            }) : db_sql_comments[e].transaction(function(e) {
                e.executeSql("UPDATE st_comments SET sayi=" + (o.rows.item(0).sayi + 1) + " WHERE gun=" + gun + ";")
            })
        }, null)
    })
}

function update_likes_statistics(e) {
    gun = get_date_time(), db_sql[e].transaction(function(t) {
        t.executeSql("SELECT * FROM st_likes where gun=" + gun, [], function(t, o) {
            var n = o.rows.length;
            0 == n ? db_sql[e].transaction(function(e) {
                e.executeSql("INSERT INTO st_likes (gun, sayi)  VALUES (" + gun + ", 1);")
            }) : db_sql[e].transaction(function(e) {
                e.executeSql("UPDATE st_likes SET sayi=" + (o.rows.item(0).sayi + 1) + " WHERE gun=" + gun + ";")
            })
        }, null)
    })
}

function insert_unfolow_db(e, t, o) {
    if (!("true" == my_cookie2(t.id, "who_follow") && e.follows_viewer)) {
        var n = {
            user_id: e.id,
            username: e.username,
            follow_time: o
        };
        db_index[t.id].transaction(["unfollows_waiting"], "readwrite").objectStore("unfollows_waiting").add(n)
    }
}

function insert_pendings(e) {
    db_index[e.id].transaction(["follows_done"], "readonly").objectStore("follows_done").index("result,follow_time").getAll(IDBKeyRange.bound(["requested", 1], ["requested", Date.now() - 1e3 * (60 * (60 * (24 * parseInt(my_cookie2(e.id, "days_unfollow")))))])).onsuccess = function(t) {
        t.target.result && $.each(t.target.result, function(t, o) {
            db_index[e.id].transaction(["white_list2"], "readwrite").objectStore("white_list2").index("username").openCursor(IDBKeyRange.only(o.username)).onsuccess = function(t) {
                var n = t.target.result;
                n ? dfdf = "" : (o.id = o.user_id, insert_unfolow_db(o, e, o.follow_time))
            }
        })
    }
}
chrome.runtime.onMessage.addListener(function(e, t) {
    if ("follow_filter" == e.option && insert_pool2(e.user_follow, e.user.viewer.id), "add_to_white_list" == e.option && db_index[e.user.viewer.id].transaction(["white_list2"], "readwrite").objectStore("white_list2").put({
            username: e.add_user.username,
            nerden: "comments_likes"
        }), "save_likes" == e.option && (console.log("save_likes", e.veri), e.veri.forEach(function(t) {
            !1 == t.node.viewer_has_liked && db_sql[e.user.viewer.id].transaction(function(e) {
                e.executeSql("INSERT INTO likes (user_id, media_id, slug, image, insert_time, likes_time)  VALUES (\"" + t.node.owner.id + "\", \"" + t.node.id + "\", \"" + t.node.shortcode + "\", \"" + t.node.display_url + "\",  " + Date.now() + ",0);")
            })
        })), "collect_from_location" == e.option && get_from_medias(e.data, e.user.viewer.id, {
            owner: e.owner,
            comments: e.comments,
            likes: e.likes
        }, {}), "unfollow_search" == e.option) {
        if ("end" == my_cookie2(e.user.viewer.id, "unfollow_cursor")) return;
        e.veri2.page_info.has_next_page ? my_cookie2(e.user.viewer.id, "unfollow_cursor", e.veri2.page_info.end_cursor) : (my_cookie2(e.user.viewer.id, "unfollow_cursor", "end"), insert_pendings(e.user.viewer)), my_cookie2(e.user.viewer.id, "unfollow_scanned_users", parseInt(my_cookie2(e.user.viewer.id, "unfollow_scanned_users")) + e.veri.length), $.each(e.veri, function(t, o) {
            db_index[e.user.viewer.id].transaction(["white_list2"], "readwrite").objectStore("white_list2").index("username").openCursor(IDBKeyRange.only(o.username)).onsuccess = function(t) {
                var n = t.target.result;
                n ? dfdf = "" : db_index[e.user.viewer.id].transaction(["follows_done"], "readwrite").objectStore("follows_done").index("user_id").openCursor(IDBKeyRange.only(o.id)).onsuccess = function(t) {
                    var n = t.target.result;
                    n ? (n.value.result = "following", n.update(n.value), n.value.follow_time < Date.now() - 1e3 * (60 * (60 * (24 * parseInt(my_cookie2(e.user.viewer.id, "days_unfollow"))))) && insert_unfolow_db(o, e.user.viewer, n.value.follow_time)) : "false" == my_cookie2(e.user.viewer.id, "unfollow_only_bot_followed") && insert_unfolow_db(o, e.user.viewer, "Manually Followed")
                }
            }
        })
    }
    if ("white_list_search" == e.option) {
        if ("end" == my_cookie2(e.user.viewer.id, "white_list_cursor")) return;
        e.veri.page_info.has_next_page ? my_cookie2(e.user.viewer.id, "white_list_cursor", e.veri.page_info.end_cursor) : my_cookie2(e.user.viewer.id, "white_list_cursor", "end"), $.each(e.veri.edges, function(t, o) {
            icine_ekleme = db_index[e.user.viewer.id].transaction(["white_list2"], "readwrite").objectStore("white_list2").put({
                username: o.node.username,
                nerden: "follows"
            })
        }), chrome.tabs.query({
            url: "chrome-extension://" + chrome.runtime.id + "/*"
        }, function(e) {
            e.forEach(function(e) {
                chrome.tabs.sendMessage(e.id, {
                    option: "white_list_update"
                })
            })
        })
    }
    if ("do_like" == e.option && db_sql[e.user.viewer.id].transaction(function(t) {
            "ok" == e.durum ? (t.executeSql("UPDATE likes SET likes_time=" + Date.now() + " WHERE media_id=\"" + e.media_id + "\";"), update_likes_statistics(e.user.viewer.id)) : (t.executeSql("DELETE from likes WHERE media_id=\"" + e.media_id + "\";"), my_cookie2(user_id, "last_like_time", Date.now() + 1e3 * parseInt(my_cookie2(user_id, "like_error_interval"))), o = Date.now() + 1e3 * (parseInt(my_cookie2(user_id, "like_error_interval")) + parseInt(my_cookie2(user_id, "like_interval"))), "hata" == e.durum && db_sql[user_id].transaction(function(t) {
                t.executeSql("INSERT INTO error_log (action, item, error_type, error_time, next_time)  VALUES (\"like\", \"" + e.slug + "\", \"unknown\", " + Date.now() + ",  " + o + ");")
            }))
        }), "do_comment" == e.option && db_sql_comments[e.user.viewer.id].transaction(function(t) {
            "ok" == e.durum ? (t.executeSql("UPDATE comments SET comments_time=" + Date.now() + " WHERE media_id=\"" + e.media_id + "\";"), update_comments_statistics(e.user.viewer.id)) : (t.executeSql("DELETE from comments WHERE media_id=\"" + e.media_id + "\";"), my_cookie2(user_id, "last_comments_time", Date.now() + 1e3 * parseInt(my_cookie2(user_id, "comments_error_interval"))), o = Date.now() + 1e3 * (parseInt(my_cookie2(user_id, "comments_error_interval")) + parseInt(my_cookie2(user_id, "comments_interval"))), "hata" == e.durum && db_sql[user_id].transaction(function(t) {
                t.executeSql("INSERT INTO error_log (action, item, error_type, error_time, next_time)  VALUES (\"comment\", \"" + e.slug + "\", \"unknown\", " + Date.now() + ",  " + o + ");")
            }))
        }), "do_unfollow" == e.option) {
        if ("ratelimit" == e.veri) return my_cookie2(user_id, "last_unfollow_time", Date.now() + 1e3 * parseInt(my_cookie2(user_id, "unfollow_error_interval"))), o = Date.now() + 1e3 * (parseInt(my_cookie2(user_id, "unfollow_error_interval")) + parseInt(my_cookie2(user_id, "unfollow_interval"))), void db_sql[user_id].transaction(function(t) {
            t.executeSql("INSERT INTO error_log (action, item, error_type, error_time, next_time)  VALUES (\"unfollow\", \"" + e.who_unfollow.username + "\", \"rate limit\", " + Date.now() + ",  " + o + ");")
        });
        my_cookie2(user_id, "last_unfollow_time", Date.now()), db_index[e.user.viewer.id].transaction(["unfollows_waiting"], "readwrite").objectStore("unfollows_waiting").index("user_id").openCursor(IDBKeyRange.only(e.who_unfollow.user_id)).onsuccess = function(t) {
            var n = t.target.result;
            if (n) {
                if (n.delete(), "hardratelimit" == e.veri) return my_cookie2(user_id, "last_unfollow_time", Date.now() + 900000), o = Date.now() + 900000 + 1e3 * parseInt(my_cookie2(user_id, "unfollow_interval")), void db_sql[user_id].transaction(function(t) {
                    t.executeSql("INSERT INTO error_log (action, item, error_type, error_time, next_time)  VALUES (\"unfollow\", \"" + e.who_unfollow.username + "\", \" HARD rate limit\", " + Date.now() + ",  " + o + ");")
                });
                if ("sil" != e.veri) {
                    var s = {
                        user_id: e.who_unfollow.user_id,
                        username: e.who_unfollow.username,
                        follow_time: e.who_unfollow.follow_time,
                        unfollow_time: Date.now()
                    };
                    db_index[e.user.viewer.id].transaction(["unfollows"], "readwrite").objectStore("unfollows").add(s), update_unfollow_statistics(e.user.viewer.id)
                }
                db_index[e.user.viewer.id].transaction(["follows_done"], "readwrite").objectStore("follows_done").index("user_id").openCursor(IDBKeyRange.only(e.who_unfollow.user_id)).onsuccess = function(e) {
                    var t = e.target.result;
                    t && t.delete()
                }
            }
        }
    }
    if ("do_follow" == e.option) {
        if ("ratelimit" == e.veri) return my_cookie2(user_id, "last_follow_time", Date.now() + 1e3 * parseInt(my_cookie2(user_id, "follow_error_interval"))), o = Date.now() + 1e3 * (parseInt(my_cookie2(user_id, "follow_error_interval")) + parseInt(my_cookie2(user_id, "follow_interval"))), void db_sql[user_id].transaction(function(t) {
            t.executeSql("INSERT INTO error_log (action, item, error_type, error_time, next_time)  VALUES (\"follow\", \"" + e.who_follow.username + "\", \"rate limit\", " + Date.now() + ",  " + o + ");")
        });
        my_cookie2(user_id, "last_follow_time", Date.now()), db_index[e.user.viewer.id].transaction(["follows"], "readwrite").objectStore("follows").index("user_id").openCursor(IDBKeyRange.only(e.who_follow.user_id)).onsuccess = function(t) {
            var n = t.target.result;
            if (n) {
                if (n.delete(), "hardratelimit" == e.veri) return last_hardratelimit = my_cookie2(user_id, "last_hardratelimit"), gecen_zaman_hardratelimit = Date.now() - last_hardratelimit, gecen_zaman_hardratelimit < 1500 * parseInt(my_cookie2(user_id, "follow_interval")) && (my_cookie2(user_id, "last_follow_time", Date.now() + 900000), o = Date.now() + 900000 + 1e3 * parseInt(my_cookie2(user_id, "follow_interval")), db_sql[user_id].transaction(function(t) {
                    t.executeSql("INSERT INTO error_log (action, item, error_type, error_time, next_time)  VALUES (\"follow\", \"" + e.who_follow.username + "\", \" HARD rate limit\", " + Date.now() + ",  " + o + ");")
                })), void my_cookie2(user_id, "last_hardratelimit", Date.now());
                if ("sil" != e.veri) {
                    var s = {
                        user_id: e.who_follow.user_id,
                        username: e.who_follow.username,
                        follow_time: Date.now(),
                        result: e.veri.result
                    };
                    db_index[e.user.viewer.id].transaction(["follows_done"], "readwrite").objectStore("follows_done").add(s), update_follow_statistics(e.user.viewer.id)
                }
            }
        }
    }
    if ("collect_followers" == e.option && ("hata" == e.veri ? my_cookie2(e.user.viewer.id, "collect_from_followers", Date.now() + 1e3 * parseInt(my_cookie2(e.user.viewer.id, "collect_from_followers_error_interval"))) : (my_cookie2(e.user.viewer.id, "collect_from_followers", Date.now()), kullanicilar_followers = {}, e.veri.edges.forEach(function(e) {
            kullanicilar_followers[e.node.id] = e.node.username
        }), col_users_to_pool(e.user.viewer.id, kullanicilar_followers), e.veri.page_info.has_next_page ? "son" != e.cursor && db_sql[e.user.viewer.id].transaction(function(t) {
            t.executeSql("UPDATE followers_jobs SET cursor=\"" + e.veri.page_info.end_cursor + "\" WHERE user_id=\"" + e.user_id + "\";")
        }) : db_sql[e.user.viewer.id].transaction(function(t) {
            t.executeSql("UPDATE followers_jobs SET cursor=\"son\" WHERE user_id=\"" + e.user_id + "\";")
        }))), e.hasOwnProperty("user")) db_sql.hasOwnProperty(e.user.viewer.id) || connect_sql_db(e.user.viewer.id);
    else {
        if (deger = my_cookie2("genel", "user_id"), null == deger) return;
        db_sql.hasOwnProperty(deger) || connect_sql_db(deger)
    }
    if ("set_user" == e.option && (deger = my_cookie2(e.user.viewer.id, "user_id"), null != deger && deger != e.user.viewer.id && set_defaults(e.user.viewer.id), localStorage.username = e.user.viewer.username, localStorage.user_id = e.user.viewer.id), "add_comments_job" == e.option && (yeni_mesaj = {
            option: "set_comments_button",
            tag: e.tag
        }, "add" == e.action ? (yeni_mesaj.varmi = !0, db_sql_comments[e.user.viewer.id].transaction(function(t) {
            t.executeSql("INSERT INTO comments_jobs (q, check_time)  VALUES (\"" + e.tag + "\",  " + Date.now() + ");")
        })) : "remove" == e.action && (yeni_mesaj.varmi = !1, db_sql_comments[e.user.viewer.id].transaction(function(t) {
            t.executeSql("DELETE from comments_jobs WHERE q=\"" + e.tag + "\";")
        })), chrome.tabs.sendMessage(t.tab.id, yeni_mesaj)), "add_likes_job" == e.option && (yeni_mesaj = {
            option: "set_likes_button",
            tag: e.tag
        }, "add" == e.action ? (yeni_mesaj.varmi = !0, db_sql[e.user.viewer.id].transaction(function(t) {
            t.executeSql("INSERT INTO likes_jobs (q, check_time)  VALUES (\"" + e.tag + "\",  " + Date.now() + ");")
        })) : "remove" == e.action && (yeni_mesaj.varmi = !1, db_sql[e.user.viewer.id].transaction(function(t) {
            t.executeSql("DELETE from likes_jobs WHERE q=\"" + e.tag + "\";")
        })), chrome.tabs.sendMessage(t.tab.id, yeni_mesaj)), "add_tag_job" == e.option && (yeni_mesaj = {
            option: "set_tag_button",
            tag: e.tag
        }, "add" == e.action ? (yeni_mesaj.varmi = !0, db_sql[e.user.viewer.id].transaction(function(t) {
            t.executeSql("INSERT INTO searches_jobs (q, owner, likes, comments, check_time)  VALUES (\"" + e.tag + "\", " + e.owner + ", " + e.likes + ", " + e.comments + ",  " + Date.now() + ");")
        })) : "remove" == e.action && (yeni_mesaj.varmi = !1, db_sql[e.user.viewer.id].transaction(function(t) {
            t.executeSql("DELETE from searches_jobs WHERE q=\"" + e.tag + "\";")
        })), chrome.tabs.sendMessage(t.tab.id, yeni_mesaj)), "add_location_job" == e.option && (deger = my_cookie2("genel", "user_id"), yeni_mesaj = {
            option: "set_location_button"
        }, "add" == e.action ? (yeni_mesaj.varmi = !0, db_sql[deger].transaction(function(t) {
            t.executeSql("INSERT INTO locations_jobs (q, name, owner, likes, comments, check_time)  VALUES (\"" + e.location_id + "\", \"" + encodeURIComponent(e.location_name) + "\", " + e.owner + ", " + e.likes + ", " + e.comments + ",  " + Date.now() + ");")
        })) : "remove" == e.action && (yeni_mesaj.varmi = !1, db_sql[deger].transaction(function(t) {
            t.executeSql("DELETE from locations_jobs WHERE q=\"" + e.location + "\";")
        })), chrome.tabs.sendMessage(t.tab.id, yeni_mesaj)), "add_location_area_job" == e.option && (deger = my_cookie2("genel", "user_id"), yeni_mesaj = {
            option: "set_location_area_button"
        }, "add" == e.action ? (yeni_mesaj.varmi = !0, db_sql[deger].transaction(function(t) {
            t.executeSql("INSERT INTO location_areas_jobs (q, distance, owner, likes, comments, check_time)  VALUES (\"" + e.area + "\", " + e.distance + ", " + e.owner + ", " + e.likes + ", " + e.comments + ",  " + Date.now() + ");")
        })) : "remove" == e.action && (yeni_mesaj.varmi = !1, db_sql[deger].transaction(function(t) {
            t.executeSql("DELETE from location_areas_jobs WHERE q=\"" + e.area + "\";")
        })), chrome.tabs.sendMessage(t.tab.id, yeni_mesaj)), "add_user_job" == e.option && (fenomen = JSON.parse(e.fenomen), yeni_mesaj = {
            fenomen: e.fenomen
        }, "commenters_btn" == e.button ? (yeni_mesaj.option = "set_commenters_button", table = "commenters_jobs") : "followers_btn" == e.button && (yeni_mesaj.option = "set_followers_button", table = "followers_jobs"), "add" == e.action ? (yeni_mesaj.varmi = !0, db_sql[e.user.viewer.id].transaction(function(t) {
            "followers_jobs" == table ? t.executeSql("INSERT INTO " + table + " (user_id, screen_name, cursor, check_time)  VALUES (\"" + fenomen.user_id + "\", \"" + fenomen.screen_name + "\", \"" + e.followers_tipi + "\", " + Date.now() + ");") : "commenters_jobs" == table && t.executeSql("INSERT INTO " + table + " (user_id, screen_name, check_time, comments, likes)  VALUES (\"" + fenomen.user_id + "\", \"" + fenomen.screen_name + "\",  " + Date.now() + ", " + e.comments + ", " + e.likes + ");")
        })) : "remove" == e.action && (yeni_mesaj.varmi = !1, db_sql[e.user.viewer.id].transaction(function(e) {
            e.executeSql("DELETE from " + table + " WHERE user_id=\"" + fenomen.user_id + "\";")
        })), chrome.tabs.sendMessage(t.tab.id, yeni_mesaj)), "get_tag_button" == e.option && db_sql[e.user.viewer.id].transaction(function(o) {
            o.executeSql("SELECT * FROM searches_jobs where q=\"" + e.tag + "\" limit 1", [], function(o, n) {
                var s = n.rows.length;
                yeni_mesaj = {
                    option: "set_tag_button",
                    tag: e.tag
                }, yeni_mesaj.varmi = !!(0 < s), chrome.tabs.sendMessage(t.tab.id, yeni_mesaj)
            }, null)
        }), "get_likes_button" == e.option && db_sql[e.user.viewer.id].transaction(function(o) {
            o.executeSql("SELECT * FROM likes_jobs where q=\"" + e.tag + "\" limit 1", [], function(o, n) {
                var s = n.rows.length;
                yeni_mesaj = {
                    option: "set_likes_button",
                    tag: e.tag
                }, yeni_mesaj.varmi = !!(0 < s), chrome.tabs.sendMessage(t.tab.id, yeni_mesaj)
            }, null)
        }), "get_comments_button" == e.option && db_sql_comments[e.user.viewer.id].transaction(function(o) {
            o.executeSql("SELECT * FROM comments_jobs where q=\"" + e.tag + "\" limit 1", [], function(o, n) {
                var s = n.rows.length;
                yeni_mesaj = {
                    option: "set_comments_button",
                    tag: e.tag
                }, yeni_mesaj.varmi = !!(0 < s), chrome.tabs.sendMessage(t.tab.id, yeni_mesaj)
            }, null)
        }), "get_location_button" == e.option && (deger = my_cookie2("genel", "user_id"), db_sql[deger].transaction(function(o) {
            o.executeSql("SELECT * FROM locations_jobs where q=\"" + e.location + "\" limit 1", [], function(o, n) {
                var s = n.rows.length;
                yeni_mesaj = {
                    option: "set_location_button",
                    location: e.location
                }, yeni_mesaj.varmi = !!(0 < s), chrome.tabs.sendMessage(t.tab.id, yeni_mesaj)
            }, null)
        })), "get_location_area_button" == e.option && (deger = my_cookie2("genel", "user_id"), db_sql[deger].transaction(function(o) {
            o.executeSql("SELECT * FROM location_areas_jobs where q=\"" + e.area + "\" limit 1", [], function(e, o) {
                var n = o.rows.length;
                yeni_mesaj = {
                    option: "set_location_area_button"
                }, yeni_mesaj.varmi = !!(0 < n), chrome.tabs.sendMessage(t.tab.id, yeni_mesaj)
            }, null)
        })), "get_user_buttons" == e.option && (fenomen = JSON.parse(e.fenomen), db_sql[e.user.viewer.id].transaction(function(o) {
            o.executeSql("SELECT * FROM followers_jobs where user_id=\"" + fenomen.user_id + "\" limit 1", [], function(o, n) {
                var s = n.rows.length;
                yeni_mesaj = {
                    option: "set_followers_button",
                    fenomen: e.fenomen
                }, yeni_mesaj.varmi = !!(0 < s), chrome.tabs.sendMessage(t.tab.id, yeni_mesaj)
            }, null), o.executeSql("SELECT * FROM commenters_jobs where user_id=\"" + fenomen.user_id + "\" limit 1", [], function(o, n) {
                var s = n.rows.length;
                yeni_mesaj = {
                    option: "set_commenters_button",
                    fenomen: e.fenomen
                }, yeni_mesaj.varmi = !!(0 < s), chrome.tabs.sendMessage(t.tab.id, yeni_mesaj)
            }, null)
        })), "queryError" == e.option) {
        var o = Date.now() + 1e3 * my_cookie2(user_id, "queryErrorWaitTime");
        db_sql[user_id].transaction(function(e) {
            e.executeSql("INSERT INTO error_log (action, item, error_type, error_time, next_time)  VALUES (\"Pool query\", \"unknown\", \"Too frequent\", " + Date.now() + ",  " + o + ");")
        })
    }
}), chrome.runtime.onInstalled.addListener(function(e) {
    "install" == e.reason ? console.log("This is a first install!") : "update" == e.reason && (chrome.tabs.create({
        url: chrome.extension.getURL("index.html")
    }), chrome.tabs.create({
        url: "https://www.instagram.com/"
    }))
});