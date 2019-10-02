function extract(e, t, n) {
    let o = e.indexOf(t);
    if (o === -1) return null;
    o += t.length;
    let i = e.indexOf(n, o);
    return i === -1 ? null : e.substring(o, i)
}

function extractData(e) {
    try {
        let t = '<script type="text/javascript">window._sharedData =';
        return JSON.parse(extract(e, t, ";</script>"))
    } catch (e) {
        return null
    }
}

function qi_collectcomments(e) {
    arr1 = e.split("[");
    var t = "";
    for (i = 0; i < arr1.length; ++i) 0 == i ? t += arr1[i] : (arr2 = arr1[i].split("]"), 2 == arr2.length ? (rastgele = arr2[0].split(",").random(), t = t + rastgele + arr2[1]) : t = t + "[" + arr2[0]);
    return t
}

function getRandomInt(e, t) {
    return Math.floor(Math.random() * (t - e + 1)) + e
}

function send_message(e) {
    chrome.tabs.query({
        url: "https://www.instagram.com/*"
    }, function(t) {
        t.length > 0 && chrome.tabs.query({
            url: "chrome-extension://" + chrome.runtime.id + "/*"
        }, function(n) {
            n.length > 0 && chrome.tabs.sendMessage(t[0].id, e)
        })
    })
}

function collect_followers(e) {
    qi_start_time = Date.now() - parseInt(my_cookie2(e, "collect_from_followers")), qi_start_time < 1e3 * parseInt(my_cookie2(e, "collect_from_followers_interval")) || (my_cookie2(e, "collect_from_followers", Date.now()), db_sql[e].transaction(function(t) {
        t.executeSql("SELECT * FROM followers_jobs ORDER BY check_time limit 1", [], function(t, n) {
            0 != n.rows.length && (db_sql[e].transaction(function(e) {
                e.executeSql("UPDATE followers_jobs SET check_time=" + Date.now() + ' WHERE user_id="' + n.rows.item(0).user_id + '";')
            }), send_message({
                option: "collect_followers",
                user_id: n.rows.item(0).user_id,
                cursor: n.rows.item(0).cursor
            }))
        }, null)
    }))
}

function do_follow(e) {
    if ("false" != my_cookie2(e, "following_status") && (qi_start_time = Date.now() - parseInt(my_cookie2(e, "last_follow_time")), !(qi_start_time < 1e3 * parseInt(my_cookie2(e, "follow_interval"))))) {
        var t = new Date,
            n = t.getMinutes(),
            o = t.getHours();
        q_now = 60 * o * 60 * 1e3 + 60 * n * 1e3, my_cookie2(e, "last_follow_time", Date.now()), q_new_follow = getRandomInt(parseInt(my_cookie2(e, "follow_interval_1")), parseInt(my_cookie2(e, "follow_interval_2"))), my_cookie2(e, "follow_interval", q_new_follow), db_sql[e].transaction(function(t) {
            t.executeSql("SELECT * FROM sleep_times_follow where start_time<" + q_now + " and end_time>" + q_now, [], function(t, n) {
                n.rows.length > 0 || (Date.now(), db_index[e].transaction(["follows_done"], "readonly").objectStore("follows_done").index("follow_time").count(IDBKeyRange.bound(Date.now() - 864e5, Date.now())).onsuccess = function(t) {
                    t.target.result < parseInt(my_cookie2(e, "follow_limit")) && (db_index[e].transaction(["follows"], "readonly").objectStore("follows").openCursor(IDBKeyRange.upperBound("Z", !0), "next").onsuccess = function(t) {
                        var n = t.target.result;
                        if (n && null != n.value && void 0 != n.value) {
							send_message({
								option: "do_follow",
								who_follow: n.value
							});
                                
                        }
                    })
                })
            }, null)
        })
    }
}

function do_unfollow(e) {
    if ("false" != my_cookie2(e, "unfollowing_status") && (qi_start_time = Date.now() - parseInt(my_cookie2(e, "last_unfollow_time")), !(qi_start_time < 1e3 * parseInt(my_cookie2(e, "unfollow_interval"))))) {
        var t = new Date,
            n = t.getMinutes(),
            o = t.getHours();
        q_now = 60 * o * 60 * 1e3 + 60 * n * 1e3, my_cookie2(e, "last_unfollow_time", Date.now()), q_new_follow = getRandomInt(parseInt(my_cookie2(e, "unfollow_interval_1")), parseInt(my_cookie2(e, "unfollow_interval_2"))), my_cookie2(e, "unfollow_interval", q_new_follow), db_sql[e].transaction(function(t) {
            t.executeSql("SELECT * FROM sleep_times_unfollow where start_time<" + q_now + " and end_time>" + q_now, [], function(t, n) {
                n.rows.length > 0 || (db_index[e].transaction(["unfollows"], "readonly").objectStore("unfollows").index("unfollow_time").count(IDBKeyRange.bound(Date.now() - 864e5, Date.now())).onsuccess = function(t) {
                    t.target.result < parseInt(my_cookie2(e, "unfollow_limit")) && (db_index[e].transaction(["unfollows_waiting"], "readonly").objectStore("unfollows_waiting").index("follow_time").openCursor(IDBKeyRange.upperBound("z"), "next").onsuccess = function(t) {
                        var n = t.target.result;
                        n && null != n.value && void 0 != n.value && (send_message({
                            option: "do_unfollow",
                            who_unfollow: n.value
                        }), my_cookie2(e, "last_unfollow_time", Date.now() + 3e4))
                    })
                })
            }, null)
        })
    }
}

function do_comment(e) {
    function t() {
        db_sql_comments[e].transaction(function(t) {
            t.executeSql("SELECT * FROM comments where comments_time=0 order by insert_time limit 1", [], function(t, n) {
                0 != n.rows.length && db_sql_comments[e].transaction(function(e) {
                    e.executeSql("SELECT * FROM comments_list", [], function(e, t) {
                        var o = t.rows.length;
                        if (0 != o) {
                            var i = Math.floor(Math.random() * o);
                            send_message({
                                option: "do_comment",
                                media_id: n.rows.item(0).media_id,
                                slug: n.rows.item(0).slug,
                                comment: qi_collectcomments(t.rows.item(i).comment)
                            })
                        }
                    }, null)
                })
            }, null)
        })
    }
    if ("false" != my_cookie2(e, "comments_status") && (qi_start_time = Date.now() - parseInt(my_cookie2(e, "last_comments_time")), !(qi_start_time < 1e3 * parseInt(my_cookie2(e, "comments_interval"))))) {
        my_cookie2(e, "last_comments_time", Date.now());
        var n = new Date,
            o = n.getMinutes(),
            i = n.getHours();
        q_now = 60 * i * 60 * 1e3 + 60 * o * 1e3, db_sql_comments[e].transaction(function(n) {
            n.executeSql("SELECT * FROM sleep_times_comments where start_time<" + q_now + " and end_time>" + q_now, [], function(n, o) {
                o.rows.length > 0 || db_sql_comments[e].transaction(function(n) {
                    n.executeSql("SELECT * FROM comments where comments_time>" + (Date.now() - 864e5), [], function(n, o) {
                        o.rows.length > parseInt(my_cookie2(e, "comments_limit")) || t()
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
                0 != t.rows.length && (send_message({
                    option: "do_like",
                    media_id: t.rows.item(0).media_id,
                    slug: t.rows.item(0).slug
                }), console.log("end send_like"))
            }, null)
        })
    }
	
	var variation = Math.floor(Math.random() * 34);
	
    if ("false" != my_cookie2(e, "like_status") && (qi_start_time = Date.now() - parseInt(my_cookie2(e, "last_like_time")), !(qi_start_time < 1e3 * (parseInt(my_cookie2(e, "like_interval")) + variation )))) {
        console.log("begin do_like"), my_cookie2(e, "last_like_time", Date.now());
        var n = new Date,
            o = n.getMinutes(),
            i = n.getHours();
        q_now = 60 * i * 60 * 1e3 + 60 * o * 1e3, db_sql[e].transaction(function(n) {
            n.executeSql("SELECT * FROM sleep_times_like where start_time<" + q_now + " and end_time>" + q_now, [], function(n, o) {
                o.rows.length > 0 || db_sql[e].transaction(function(n) {
                    n.executeSql("SELECT * FROM likes where likes_time>" + (Date.now() - 864e5), [], function(n, o) {
                        o.rows.length > parseInt(my_cookie2(e, "like_limit")) || t()
                    }, null)
                })
            }, null)
        })
    }
}

function col_users_to_pool(e, t) {
    if (t && user_cache.length < 1e3) {
        let e = Object.keys(t),
            n = e.map(e => {
                return {
                    k: e,
                    v: t[e]
                }
            });
        console.log("col_users_to_pool, length:", n.length), user_cache.push(...n)
    }
}

function col_user_job(e) {
    let t = Date.now();
    if (!(t - last_col_time < 12e4) && user_cache.length > 0) {
        last_col_time = t;
        let n = Math.min(user_cache.length, 20),
            o = user_cache.splice(0, n),
            i = {};
        for (let e of o) i[e.k] = e.v;
        console.log("while_have_users len:", o.length), while_have_users(e, i, {})
    }
}

function while_have_users(e, t, n) {
    return 0 == Object.keys(t).length ? (send_message({
        option: "follow_filter",
        users: n
    }), !1) : void 0 !== Object.keys(t)[0] && (key = Object.keys(t)[0], value = t[key], delete t[key], new_key = key.toString(), void(db_index[e].transaction(["follows_done"], "readonly").objectStore("follows_done").index("user_id").get(IDBKeyRange.only(new_key)).onsuccess = function(o) {
        o.target.result ? while_have_users(e, t, n) : db_index[e].transaction(["unfollows"], "readonly").objectStore("unfollows").index("user_id").get(IDBKeyRange.only(new_key)).onsuccess = function(o) {
            o.target.result ? while_have_users(e, t, n) : db_index[e].transaction(["follows"], "readonly").objectStore("follows").index("user_id").get(IDBKeyRange.only(new_key)).onsuccess = function(o) {
                o.target.result ? while_have_users(e, t, n) : db_sql_filters[e].transaction(function(o) {
                    o.executeSql('SELECT * FROM users where user_id="' + new_key + '"', [], function(o, i) {
                        0 == i.rows.length && (n[key] = value), while_have_users(e, t, n)
                    }, null)
                })
            }
        }
    }))
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
    qi_start_time = Date.now() - parseInt(my_cookie2(e, "collect_from_commenters")), qi_start_time < 1e3 * parseInt(my_cookie2(e, "collect_from_commenters_interval")) || (my_cookie2(e, "collect_from_commenters", Date.now()), db_sql[e].transaction(function(t) {
        t.executeSql("SELECT * FROM commenters_jobs ORDER BY check_time limit 1", [], function(t, n) {
            0 != n.rows.length && (db_sql[e].transaction(function(e) {
                e.executeSql("UPDATE commenters_jobs SET check_time=" + Date.now() + ' WHERE user_id="' + n.rows.item(0).user_id + '";')
            }), $.ajax({
                url: "https://www.instagram.com/" + n.rows.item(0).screen_name + "/",
                method: "GET"
            }).done(function(t) {
                t = extractData(t), n.rows.item(0).hasOwnProperty("comments") ? qi_commentz = n.rows.item(0).comments : qi_commentz = 1, n.rows.item(0).hasOwnProperty("likes") ? qi_trendz = n.rows.item(0).likes : qi_trendz = 1, get_from_medias(t.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges, e, {
                    owner: 0,
                    comments: qi_commentz,
                    likes: qi_trendz
                }, {})
            }).fail(function(t, n, o) {
                my_cookie2(e, "collect_from_commenters", Date.now() + 1e3 * parseInt(my_cookie2(e, "collect_from_commenters_error_interval")))
            }))
        }, null)
    }))
}

function collect_locations(e) {
    qi_start_time = Date.now() - parseInt(my_cookie2(e, "collect_from_locations")), qi_start_time < 1e3 * parseInt(my_cookie2(e, "collect_from_locations_interval")) || (my_cookie2(e, "collect_from_locations", Date.now()), db_sql[e].transaction(function(t) {
        t.executeSql("SELECT * FROM locations_jobs ORDER BY check_time limit 1", [], function(t, n) {
            0 != n.rows.length && (db_sql[e].transaction(function(e) {
                e.executeSql("UPDATE locations_jobs SET check_time=" + Date.now() + ' WHERE q="' + n.rows.item(0).q + '";')
            }), send_message({
                option: "collect_from_location",
                location: n.rows.item(0).q,
                owner: n.rows.item(0).owner,
                comments: n.rows.item(0).comments,
                likes: n.rows.item(0).likes
            }))
        }, null)
    }))
}

function delete_old_user_filters(e) {
    qi_start_time = Date.now() - parseInt(my_cookie2(e, "last_user_filters_delete_time")), qi_start_time < 6e4 || db_sql_filters[e].transaction(function(t) {
        t.executeSql("DELETE from likes WHERE insert_time<" + (Date.now() - 936e5)), my_cookie2(e, "last_user_filters_delete_time", Date.now())
    })
}

function delete_old_likes(e) {
    qi_start_time = Date.now() - parseInt(my_cookie2(e, "last_like_delete_time")), qi_start_time < 6e4 || db_sql[e].transaction(function(t) {
        t.executeSql("DELETE from likes WHERE likes_time>0 and likes_time<" + (Date.now() - 936e5)), my_cookie2(e, "last_like_delete_time", Date.now())
    })
}

function delete_old_comments(e) {
    qi_start_time = Date.now() - parseInt(my_cookie2(e, "last_comments_delete_time")), qi_start_time < 6e4 || db_sql_comments[e].transaction(function(t) {
        t.executeSql("DELETE from comments WHERE comments_time>0 and comments_time<" + (Date.now() - 54e7)), my_cookie2(e, "last_comments_delete_time", Date.now())
    })
}

function delete_old_error(e) {
    qi_start_time = Date.now() - parseInt(my_cookie2(e, "last_error_delete_time")), qi_start_time < 6e4 || db_sql[e].transaction(function(t) {
        t.executeSql("DELETE from error_log WHERE error_time<" + (Date.now() - 936e5)), my_cookie2(e, "last_error_delete_time", Date.now())
    })
}

function collect_likes_from_home(e) {
    "false" != my_cookie2(e, "like_status") && "false" != my_cookie2(e, "home_like_status") && (qi_start_time = Date.now() - parseInt(my_cookie2(e, "collect_from_likes_home")), qi_start_time < 6e4 || (my_cookie2(e, "collect_from_likes_home", Date.now()), db_sql[e].transaction(function(e) {
        e.executeSql("SELECT * FROM likes where likes_time=0", [], function(e, t) {
            t.rows.length < 100 && send_message({
                option: "collect_likes_from_home"
            })
        }, null)
    })))
}

function collect_likes_from_tag(e) {
    "false" != my_cookie2(e, "like_status") && "false" != my_cookie2(e, "tag_like_status") && (qi_start_time = Date.now() - parseInt(my_cookie2(e, "collect_from_likes_tag")), qi_start_time < 6e4 || (my_cookie2(e, "collect_from_likes_tag", Date.now()), db_sql[e].transaction(function(t) {
        t.executeSql("SELECT * FROM likes where likes_time=0", [], function(t, n) {
            n.rows.length < 100 && db_sql[e].transaction(function(t) {
                t.executeSql("SELECT * FROM likes_jobs ORDER BY check_time limit 1", [], function(t, n) {
                    0 != n.rows.length && (db_sql[e].transaction(function(e) {
                        e.executeSql("UPDATE likes_jobs SET check_time=" + Date.now() + ' WHERE q="' + n.rows.item(0).q + '";')
                    }), $.ajax({
                        url: "https://www.instagram.com/explore/tags/" + n.rows.item(0).q + "/?__a=1",
                        method: "GET"
                    }).done(function(t) {
                        t.graphql.hashtag.edge_hashtag_to_media.edges.forEach(function(t) {
                            let n = t.node;
                            db_sql[e].transaction(function(e) {
                                e.executeSql('INSERT INTO likes (user_id, media_id, slug, image, insert_time, likes_time)  VALUES ("' + n.owner.id + '", "' + n.id + '", "' + n.shortcode + '", "' + n.display_url + '",  ' + Date.now() + ",0);")
                            })
                        })
                    }).fail(function(t, n, o) {
                        my_cookie2(e, "collect_from_likes_tag", Date.now() + 6e5)
                    }))
                }, null)
            })
        }, null)
    })))
}

function collect_comments_from_tag(e) {
    "false" != my_cookie2(e, "comments_status") && (qi_start_time = Date.now() - parseInt(my_cookie2(e, "collect_from_comments_tag")), qi_start_time < 6e4 || (my_cookie2(e, "collect_from_comments_tag", Date.now()), db_sql_comments[e].transaction(function(t) {
        t.executeSql("SELECT * FROM comments where comments_time=0", [], function(t, n) {
            n.rows.length < 100 && db_sql_comments[e].transaction(function(t) {
                t.executeSql("SELECT * FROM comments_jobs ORDER BY check_time limit 1", [], function(t, n) {
                    0 != n.rows.length && (db_sql_comments[e].transaction(function(e) {
                        e.executeSql("UPDATE comments_jobs SET check_time=" + Date.now() + ' WHERE q="' + n.rows.item(0).q + '";')
                    }), $.ajax({
                        url: "https://www.instagram.com/explore/tags/" + n.rows.item(0).q + "/?__a=1",
                        method: "GET"
                    }).done(function(t) {
                        t.graphql.hashtag.edge_hashtag_to_media.edges.forEach(function(t) {
                            let n = t.node;
                            db_sql_comments[e].transaction(function(e) {
                                e.executeSql('INSERT INTO comments (user_id, media_id, slug, image, insert_time, comments_time)  VALUES ("' + n.owner.id + '", "' + n.id + '", "' + n.shortcode + '", "' + n.display_url + '",  ' + Date.now() + ",0);")
                            })
                        })
                    }).fail(function(t, n, o) {
                        my_cookie2(e, "collect_from_comments_tag", Date.now() + 6e5)
                    }))
                }, null)
            })
        }, null)
    })))
}

function collect_searches(e) {
    qi_start_time = Date.now() - parseInt(my_cookie2(e, "collect_from_searches")), qi_start_time < 1e3 * parseInt(my_cookie2(e, "collect_from_searches_interval")) || (my_cookie2(e, "collect_from_searches", Date.now()), db_sql[e].transaction(function(t) {
        t.executeSql("SELECT * FROM searches_jobs ORDER BY check_time limit 1", [], function(t, n) {
            0 != n.rows.length && (db_sql[e].transaction(function(e) {
                e.executeSql("UPDATE searches_jobs SET check_time=" + Date.now() + ' WHERE q="' + n.rows.item(0).q + '";')
            }), $.ajax({
                url: "https://www.instagram.com/explore/tags/" + n.rows.item(0).q + "/?__a=1",
                method: "GET"
            }).done(function(t) {
                get_from_medias(t.graphql.hashtag.edge_hashtag_to_media.edges, e, n.rows.item(0), {})
            }).fail(function(t, n, o) {
                my_cookie2(e, "collect_from_searches", Date.now() + 1e3 * parseInt(my_cookie2(e, "collect_from_searches_error_interval")))
            }))
        }, null)
    }))
}

function do_collects(e) {
    if ("false" != my_cookie2(e, "pool_collect_status")) {
        db_index[e].transaction(["follows"], "readonly").objectStore("follows").count().onsuccess = function(t) {
            t.target.result > 1e3 || t.target.result > parseInt(my_cookie2(e, "pool_limit")) || (collect_followers(e), collect_locations(e), collect_commenters(e), collect_searches(e))
        }
    }
}

function collect_white_list(e) {
    "false" != my_cookie2(e, "collect_white_list") && ("false" == my_cookie2(e, "collect_likes_white_list") && "false" == my_cookie2(e, "collect_comments_white_list") || (qi_start_time = Date.now() - parseInt(my_cookie2(e, "collect_white_list_last_time")), qi_start_time < 1e5 || (my_cookie2(e, "collect_white_list_last_time", Date.now()), send_message({
        option: "collect_white_list",
        collect_likes_white_list: my_cookie2(e, "collect_likes_white_list"),
        collect_comments_white_list: my_cookie2(e, "collect_comments_white_list")
    }))))
}

function white_list_search(e) {
    "end" != my_cookie2(e, "white_list_cursor") && (qi_start_time = Date.now() - parseInt(my_cookie2(e, "last_white_list_scan_time")), qi_start_time < 6e4 || (my_cookie2(e, "last_white_list_scan_time", Date.now()), send_message({
        option: "white_list_search",
        cursor: my_cookie2(e, "white_list_cursor")
    })))
}

function unfollow_search(e) {
    "end" != my_cookie2(e, "unfollow_cursor") && "false" != my_cookie2(e, "unfollowing_status") && (qi_start_time = Date.now() - parseInt(my_cookie2(e, "last_unfollow_scan_time")), qi_start_time < 12e4 || (my_cookie2(e, "last_unfollow_scan_time", Date.now()), send_message({
        option: "unfollow_search",
        cursor: my_cookie2(e, "unfollow_cursor")
    })))
}

function do_auto_unfollow(e) {
    "false" != my_cookie2(e, "auto_unfollow_enable") && (qi_start_time = Date.now() - parseInt(my_cookie2(e, "last_auto_unfollow_time")), qi_start_time < 864e5 * parseInt(my_cookie2(e, "auto_unfollow_days")) || (my_cookie2(e, "last_auto_unfollow_time", Date.now()), my_cookie2(e, "unfollow_cursor", "bos"), my_cookie2(e, "unfollowing_status", "true")))
}

function check_insta_tab() {
    chrome.tabs.query({
        url: "https://www.instagram.com/*"
    }, function(e) {
        e.length > 0 ? message = {
            option: "check_insta_tab",
            durum: !0
        } : message = {
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
    user_id = my_cookie2("genel", "user_id"), null != user_id && (db_sql.hasOwnProperty(user_id) || connect_sql_db(user_id), do_collects(user_id), unfollow_search(user_id), do_auto_unfollow(user_id), white_list_search(user_id), collect_white_list(user_id), do_unfollow(user_id), do_follow(user_id), do_like(user_id), do_comment(user_id), get_followers_count(user_id), get_follows_count(user_id), delete_old_likes(user_id), delete_old_comments(user_id), delete_old_user_filters(user_id), delete_old_error(user_id), collect_likes_from_tag(user_id), collect_comments_from_tag(user_id), collect_likes_from_home(user_id), col_user_job(user_id))
}

function my_cookie2(e, t, n, o) {
    if (void 0 === n || null === n) return qi_value = localStorage.getItem(t), void 0 === qi_value || null === qi_value ? null : qi_value;
    db_index[e].transaction(["settings"], "readwrite").objectStore("settings").put({
        key: t,
        value: n
    }).onsuccess = function(n) {
        o && o(t, e)
    }, localStorage.setItem(t, n)
}

function get_followers_count(e) {
    qi_start_time = Date.now() - parseInt(my_cookie2(e, "last_follower_check_time")), qi_start_time < 18e5 || ($.ajax({
        url: "https://www.instagram.com/" + localStorage.username + "/",
        method: "GET"
    }).done(function(t) {
        t = extractData(t), update_follower_statistics(e, t.entry_data.ProfilePage[0].graphql.user.edge_followed_by.count)
    }), my_cookie2(e, "last_follower_check_time", Date.now()))
}

function get_follows_count(e) {
    qi_start_time = Date.now() - parseInt(my_cookie2(e, "last_follows_count_check_time")), qi_start_time < 6e4 || ($.ajax({
        url: "https://www.instagram.com/" + localStorage.username + "/",
        method: "GET"
    }).done(function(t) {
        t = extractData(t), update_follows_statistics(e, t.entry_data.ProfilePage[0].graphql.user.edge_follow.count)
    }), my_cookie2(e, "last_follows_count_check_time", Date.now()))
}

function set_defaults(e, t) {
    function n() {
        if (Object.keys(key_arr).length == o) return void(t && t());
        qi_replace = Object.keys(key_arr)[o], db_index[e].transaction(["settings"], "readwrite").objectStore("settings").get(IDBKeyRange.only(qi_replace)).onsuccess = function(t) {
            t.target.result ? my_cookie2(e, qi_replace, t.target.result.value) : my_cookie2(e, qi_replace, key_arr[qi_replace]), o++, n()
        }
    }
    key_arr = {
        collect_from_followers: Date.now(),
        collect_from_followers_error_interval: "601",
        collect_from_followers_interval: "126",
        collect_from_commenters: Date.now(),
        collect_from_commenters_error_interval: "601",
        collect_from_commenters_interval: "126",
        collect_from_searches: Date.now(),
        collect_from_searches_error_interval: "601",
        collect_from_searches_interval: "126",
        collect_from_locations: Date.now(),
        collect_from_locations_error_interval: "601",
        collect_from_locations_interval: "126",
        collect_from_location_areas: Date.now(),
        collect_from_location_areas_error_interval: "601",
        collect_from_location_areas_interval: "126",
        follow_error_interval: "120",
        follow_interval: "171",
        follow_interval_1: "131",
        follow_interval_2: "305",
        followers_statistics_time: Date.now(),
        following_status: "false",
        last_follow_time: Date.now(),
        last_unfollow_time: Date.now(),
        pool_collect_status: "true",
        pool_limit: "60",
        unfollow_error_interval: "500",
        unfollow_interval: "172",
        unfollow_interval_1: "131",
        unfollow_interval_2: "305",
        unfollowing_status: "false",
        unfollow_only_bot_followed: "false",
        qi_last_time_follow: Date.now(),
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
        home_like_status: "true",
        tag_like_status: "false",
        like_status: "true",
        like_interval: "255",
        like_error_interval: "750",
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
        left_time: 9999999999999999,
        queryErrorWaitTime: 50,
        queryBatchDelayTime: 25,
        last_count_liked: "",
        last_count_followed: "",
        last_count_unfollowed: ""
    };
    var o = 0;
    n()
}

function qi_db_upgrade(e) {
    "downgraded" == old_index_db_version && setTimeout(function() {
        qi_db_upgrade(e)
    }, 2e3), 5 == old_index_db_version && (my_cookie2(e, "collect_from_followers_error_interval", "300"), my_cookie2(e, "collect_from_commenters_error_interval", "300"), my_cookie2(e, "collect_from_searches_error_interval", "300"), my_cookie2(e, "collect_from_locations_error_interval", "300"), my_cookie2(e, "collect_from_location_areas_error_interval", "300"), my_cookie2(e, "follow_error_interval", "60"), my_cookie2(e, "unfollow_error_interval", "600"))
}

function connect_sql_db(e, t) {
    console.log("x connect_sql_db"), db_sql_comments[e] = window.openDatabase("activflash_comments3_" + e, "", "Comments", null, function(e) {}), db_sql_comments[e].transaction(function(e) {
        e.executeSql("CREATE TABLE comments_jobs (q TEXT unique, check_time INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS comments (user_id TEXT unique, media_id TEXT, slug TEXT, image TEXT, insert_time INTEGER, comments_time INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS comments_list (id INTEGER PRIMARY KEY   AUTOINCREMENT,comment TEXT unique,use_time INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS st_comments (gun INTEGER unique, sayi INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS sleep_times_comments (id INTEGER PRIMARY KEY   AUTOINCREMENT, start_time INTEGER, end_time INTEGER)")
    }), db_sql_filters[e] = window.openDatabase("activflash_filters_" + e, "", "Filters", null, function(e) {}), db_sql_filters[e].transaction(function(e) {
        e.executeSql("CREATE TABLE IF NOT EXISTS users (user_id TEXT unique, username TEXT, insert_time INTEGER)")
    }), db_sql[e] = window.openDatabase("activflash_" + e, "", "", null, function(e) {}), db_sql[e].transaction(function(e) {
        e.executeSql("CREATE TABLE IF NOT EXISTS st_follow (gun INTEGER unique, sayi INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS st_unfollow (gun INTEGER unique, sayi INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS st_followers (gun INTEGER unique, sayi INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS st_follows (gun INTEGER unique, sayi INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS st_likes (gun INTEGER unique, sayi INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS followers_jobs (user_id TEXT unique, screen_name TEXT, cursor TEXT, check_time INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS commenters_jobs (user_id TEXT unique, screen_name TEXT, check_time INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS searches_jobs (q TEXT unique, owner INTEGER, likes INTEGER, comments INTEGER, check_time INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS locations_jobs (q TEXT unique, owner INTEGER, likes INTEGER, comments INTEGER, name TEXT, check_time INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS location_areas_jobs (q TEXT unique, owner INTEGER, likes INTEGER, comments INTEGER, distance INTEGER, check_time INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS likes_jobs (q TEXT unique, check_time INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS likes (user_id TEXT unique, media_id TEXT, slug TEXT, image TEXT, insert_time INTEGER, likes_time INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS error_log (action TEXT, item TEXT, error_type TEXT, error_time INTEGER, next_time INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS sleep_times_follow (id INTEGER PRIMARY KEY   AUTOINCREMENT, start_time INTEGER, end_time INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS sleep_times_unfollow (id INTEGER PRIMARY KEY   AUTOINCREMENT, start_time INTEGER, end_time INTEGER)"), e.executeSql("CREATE TABLE IF NOT EXISTS sleep_times_like (id INTEGER PRIMARY KEY   AUTOINCREMENT, start_time INTEGER, end_time INTEGER)"), e.executeSql("ALTER TABLE commenters_jobs ADD COLUMN comments INTEGER DEFAULT 1;"), e.executeSql("ALTER TABLE commenters_jobs ADD COLUMN likes INTEGER DEFAULT 1;")
    }), 10 != (localStorage.db_version || 0) && (indexedDB.deleteDatabase("activflash_" + e), localStorage.db_version = 10);
    var n = indexedDB.open("activflash_" + e, 10);
    n.onupgradeneeded = function(e) {
        var t = e.target.result,
            n = e.target.transaction;
        if (old_index_db_version = e.oldVersion, t.objectStoreNames.contains("follows")) var o = n.objectStore("follows");
        else var o = t.createObjectStore("follows", {
            autoIncrement: !0
        });
        if (t.objectStoreNames.contains("follows_done")) var i = n.objectStore("follows_done");
        else var i = t.createObjectStore("follows_done", {
            autoIncrement: !0
        });
        if (t.objectStoreNames.contains("unfollows")) var r = n.objectStore("unfollows");
        else var r = t.createObjectStore("unfollows", {
            autoIncrement: !0
        });
        if (t.objectStoreNames.contains("unfollows_waiting")) var s = n.objectStore("unfollows_waiting");
        else var s = t.createObjectStore("unfollows_waiting", {
            autoIncrement: !0
        });
        if (t.objectStoreNames.contains("settings")) var a = n.objectStore("settings");
        else var a = t.createObjectStore("settings", {
            autoIncrement: !0,
            keyPath: "key"
        });
        if (t.objectStoreNames.contains("white_list2")) var l = n.objectStore("white_list2");
        else var l = t.createObjectStore("white_list2", {
            autoIncrement: !0,
            keyPath: "key"
        });
        l.indexNames.contains("username") || l.createIndex("username", "username", {
            unique: !0
        }), o.indexNames.contains("user_id") || o.createIndex("user_id", "user_id", {
            unique: !0
        }), i.indexNames.contains("user_id") || i.createIndex("user_id", "user_id", {
            unique: !0
        }), i.indexNames.contains("follow_time") || i.createIndex("follow_time", "follow_time"), i.indexNames.contains("result,follow_time") || i.createIndex("result,follow_time", ["result", "follow_time"]), r.indexNames.contains("user_id") || r.createIndex("user_id", "user_id", {
            unique: !0
        }), r.indexNames.contains("unfollow_time") || r.createIndex("unfollow_time", "unfollow_time"), r.indexNames.contains("follow_time") || r.createIndex("follow_time", "follow_time"), s.indexNames.contains("follow_time") || s.createIndex("follow_time", "follow_time"), s.indexNames.contains("user_id") || s.createIndex("user_id", "user_id", {
            unique: !0
        }), a.indexNames.contains("key") || a.createIndex("key", "key", {
            unique: !0
        })
    }, n.onsuccess = function(t) {
        if (db_index[e] = t.target.result, set_defaults(e), qi_db_upgrade(e), my_cookie2(e, "white_list_users").length > 5)
            for (qi_new_value = my_cookie2(e, "white_list_users").split(","), i = 0; i < qi_new_value.length; i++) db_index[e].transaction(["white_list2"], "readwrite").objectStore("white_list2").put({
                username: qi_new_value[i],
                nerden: "follows"
            }).onsuccess = function(e) {}
    }
}

function user_filter(e, t) {
    if (user_id = my_cookie2("genel", "user_id"), e.hasOwnProperty("id") && e.id == user_id) return void t(!1);
    if (e.profile_pic_url) {
        let n = e.profile_pic_url.split("/");
        if (n.length > 0 && "11906329_960233084022564_1448528159_a.jpg" == n[n.length - 1]) return void t(!1)
    }
    if (e.hasOwnProperty("biography") && "" != my_cookie2(user_id, "filter_black_list") && null != e.biography) {
        qi_new_value = my_cookie2(user_id, "filter_black_list").toLowerCase().split(","), biography = e.biography.toLowerCase();
        var n = !0;
        for (i = 0; i < qi_new_value.length; i++) {
            var o = qi_new_value[i].trim();
            "" != o && biography.indexOf(o) > -1 && (n = !1)
        }
        if (0 == n) return void t(!1)
    }
    if (e.hasOwnProperty("edge_follow") && "" != my_cookie2(user_id, "filter_following_count_big") && e.edge_follow.count > parseInt(my_cookie2(user_id, "filter_following_count_big"))) return void t(!1);
    if (e.hasOwnProperty("edge_followed_by") && "" != my_cookie2(user_id, "filter_followers_count_big") && e.edge_followed_by.count > parseInt(my_cookie2(user_id, "filter_followers_count_big"))) return void t(!1);
    if (e.hasOwnProperty("edge_owner_to_timeline_media") && "" != my_cookie2(user_id, "filter_media_count_big") && e.edge_owner_to_timeline_media.count > parseInt(my_cookie2(user_id, "filter_media_count_big"))) return void t(!1);
    if (e.hasOwnProperty("edge_follow") && "" != my_cookie2(user_id, "filter_following_count_small") && e.edge_follow.count < parseInt(my_cookie2(user_id, "filter_following_count_small"))) return void t(!1);
    if (e.hasOwnProperty("edge_followed_by") && "" != my_cookie2(user_id, "filter_followers_count_small") && e.edge_followed_by.count < parseInt(my_cookie2(user_id, "filter_followers_count_small"))) return void t(!1);
    if (e.hasOwnProperty("edge_owner_to_timeline_media") && "" != my_cookie2(user_id, "filter_media_count_small") && e.edge_owner_to_timeline_media.count < parseInt(my_cookie2(user_id, "filter_media_count_small"))) return void t(!1);
    if (e.hasOwnProperty("is_private") && "both" != my_cookie2(user_id, "private_public_filter")) {
        if (1 == e.is_private && "public" == my_cookie2(user_id, "private_public_filter")) return void t(!1);
        if (0 == e.is_private && "private" == my_cookie2(user_id, "private_public_filter")) return void t(!1)
    }
    return e.hasOwnProperty("blocked_by_viewer") && e.blocked_by_viewer ? void t(!1) : e.hasOwnProperty("follows_viewer") && e.follows_viewer ? void t(!1) : e.hasOwnProperty("has_blocked_viewer") && e.has_blocked_viewer ? void t(!1) : e.hasOwnProperty("has_requested_viewer") && e.has_requested_viewer ? void t(!1) : e.hasOwnProperty("followed_by_viewer") && e.followed_by_viewer ? void t(!1) : e.hasOwnProperty("requested_by_viewer") && e.requested_by_viewer ? void t(!1) : e.hasOwnProperty("profile_pic_url") && "https://scontent-fra3-1.cdninstagram.com/t51.2885-19/11906329_960233084022564_1448528159_a.jpg" == e.profile_pic_url ? void t(!1) : e.hasOwnProperty("external_url") && null != e.external_url && "true" == my_cookie2(user_id, "filter_external_link") ? void t(!1) : "all" == my_cookie2(user_id, "gender_filter") ? void t(!0) : e.hasOwnProperty("full_name") ? null != e.full_name && "null" != e.full_name || "males" != my_cookie2(user_id, "gender_filter") && "females" != my_cookie2(user_id, "gender_filter") ? (name_arr = e.full_name.split(" "), name = name_arr[0].toLowerCase(), /*void $.ajax({
        url: "http://gender.instagrowth.space/?name=" + name,
        error: function() {
            t(!0)
        },
        success: function(e) {
            return e.hasOwnProperty("gender") ? null == e.gender || "null" == e.gender ? "females_other" == my_cookie2(user_id, "gender_filter") || "males_other" == my_cookie2(user_id, "gender_filter") ? void t(!0) : void t(!1) : "male" == e.gender ? "males" == my_cookie2(user_id, "gender_filter") ? void t(!0) : void t(!1) : "female" == e.gender ? "females" == my_cookie2(user_id, "gender_filter") ? void t(!0) : void t(!1) : void 0 : void t(!0)
        },
        timeout: 2e3,
        dataType: "json"
    })*/
      void t(!0)
    // console.log("clearr")
    ) : void t(!1) : void t(!0)
}

function insert_pool2(e, t) {	
    user_filter(e, function(n) {
        1 == n ? db_index[t].transaction(["follows_done"], "readonly").objectStore("follows_done").index("user_id").get(IDBKeyRange.only(e.id)).onsuccess = function(n) {
            n.target.result || (db_index[t].transaction(["unfollows"], "readonly").objectStore("unfollows").index("user_id").get(IDBKeyRange.only(e.id)).onsuccess = function(n) {
                if (!n.target.result) {
                    var o = {
                        user_id: e.id,
                        username: e.username
                    };
                    db_index[t].transaction(["follows"], "readwrite").objectStore("follows").add(o)
                }
            })
        } : db_sql_filters[t].transaction(function(t) {
            t.executeSql('INSERT INTO users (user_id, username, insert_time)  VALUES ("' + e.id + '","' + e.username + '", ' + Date.now() + ");")
        })
    })
}

function get_date_time(e) {
    e = void 0 !== e ? e : Date.now();
    var t = new Date(e),
        n = t.getMonth() + 1 + "/" + t.getDate() + "/" + t.getFullYear();
    return my_time = new Date(n).getTime(), my_time
}

function get_date_format(e) {
    e = void 0 !== e ? e : Date.now();
    var t = new Date(e);
    return t.getDate() + "/" + (t.getMonth() + 1) + "/" + t.getFullYear()
}

function update_follow_statistics(e) {
    day = get_date_time(), db_sql[e].transaction(function(t) {
        t.executeSql("SELECT * FROM st_follow where gun=" + day, [], function(t, n) {
            var o = n.rows.length;
            0 == o ? db_sql[e].transaction(function(e) {
                e.executeSql("INSERT INTO st_follow (gun, sayi)  VALUES (" + day + ", 1);")
            }) : db_sql[e].transaction(function(e) {
                e.executeSql("UPDATE st_follow SET sayi=" + (n.rows.item(0).sayi + 1) + " WHERE gun=" + day + ";")
            })
        }, null)
    })
}

function update_follower_statistics(e, t) {
    day = get_date_time(), db_sql[e].transaction(function(n) {
        n.executeSql("SELECT * FROM st_followers where gun=" + day, [], function(n, o) {
            var i = o.rows.length;
            0 == i ? db_sql[e].transaction(function(e) {
                e.executeSql("INSERT INTO st_followers (gun, sayi)  VALUES (" + day + ", " + t + ");")
            }) : db_sql[e].transaction(function(e) {
                e.executeSql("UPDATE st_followers SET sayi=" + t + " WHERE gun=" + day + ";")
            })
        }, null)
    })
}

function update_follows_statistics(e, t) {
    day = get_date_time(), db_sql[e].transaction(function(n) {
        n.executeSql("SELECT * FROM st_follows where gun=" + day, [], function(n, o) {
            var i = o.rows.length;
            0 == i ? db_sql[e].transaction(function(e) {
                e.executeSql("INSERT INTO st_follows (gun, sayi)  VALUES (" + day + ", " + t + ");")
            }) : db_sql[e].transaction(function(e) {
                e.executeSql("UPDATE st_follows SET sayi=" + t + " WHERE gun=" + day + ";")
            })
        }, null)
    })
}

function update_unfollow_statistics(e) {
    day = get_date_time(), db_sql[e].transaction(function(t) {
        t.executeSql("SELECT * FROM st_unfollow where gun=" + day, [], function(t, n) {
            var o = n.rows.length;
            0 == o ? db_sql[e].transaction(function(e) {
                e.executeSql("INSERT INTO st_unfollow (gun, sayi)  VALUES (" + day + ", 1);")
            }) : db_sql[e].transaction(function(e) {
                e.executeSql("UPDATE st_unfollow SET sayi=" + (n.rows.item(0).sayi + 1) + " WHERE gun=" + day + ";")
            })
        }, null)
    })
}

function update_comments_statistics(e) {
    day = get_date_time(), db_sql_comments[e].transaction(function(t) {
        t.executeSql("SELECT * FROM st_comments where gun=" + day, [], function(t, n) {
            var o = n.rows.length;
            0 == o ? db_sql_comments[e].transaction(function(e) {
                e.executeSql("INSERT INTO st_comments (gun, sayi)  VALUES (" + day + ", 1);")
            }) : db_sql_comments[e].transaction(function(e) {
                e.executeSql("UPDATE st_comments SET sayi=" + (n.rows.item(0).sayi + 1) + " WHERE gun=" + day + ";")
            })
        }, null)
    })
}

function update_likes_statistics(e) {
    day = get_date_time(), db_sql[e].transaction(function(t) {
        t.executeSql("SELECT * FROM st_likes where gun=" + day, [], function(t, n) {
            var o = n.rows.length;
            0 == o ? db_sql[e].transaction(function(e) {
                e.executeSql("INSERT INTO st_likes (gun, sayi)  VALUES (" + day + ", 1);")
            }) : db_sql[e].transaction(function(e) {
                e.executeSql("UPDATE st_likes SET sayi=" + (n.rows.item(0).sayi + 1) + " WHERE gun=" + day + ";")
            })
        }, null)
    })
}

function insert_unfolow_db(e, t, n) {
    if ("true" != my_cookie2(t.id, "who_follow") || !e.follows_viewer) {
        var o = {
            user_id: e.id,
            username: e.username,
            follow_time: n
        };
        db_index[t.id].transaction(["unfollows_waiting"], "readwrite").objectStore("unfollows_waiting").add(o)
    }
}

function insert_pendings(e) {
    db_index[e.id].transaction(["follows_done"], "readonly").objectStore("follows_done").index("result,follow_time").getAll(IDBKeyRange.bound(["requested", 1], ["requested", Date.now() - 24 * parseInt(my_cookie2(e.id, "days_unfollow")) * 60 * 60 * 1e3])).onsuccess = function(t) {
        t.target.result && $.each(t.target.result, function(t, n) {
            db_index[e.id].transaction(["white_list2"], "readwrite").objectStore("white_list2").index("username").openCursor(IDBKeyRange.only(n.username)).onsuccess = function(t) {
                t.target.result ? qi_rand = "" : (n.id = n.user_id, insert_unfolow_db(n, e, n.follow_time))
            }
        })
    }
}! function(e, t) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
        if (!e.document) throw new Error("jQuery requires a window with a document");
        return t(e)
    } : t(e)
}("undefined" != typeof window ? window : this, function(e, t) {
    function n(e) {
        var t = !!e && "length" in e && e.length,
            n = fe.type(e);
        return "function" !== n && !fe.isWindow(e) && ("array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e)
    }

    function o(e, t, n) {
        if (fe.isFunction(t)) return fe.grep(e, function(e, o) {
            return !!t.call(e, o, e) !== n
        });
        if (t.nodeType) return fe.grep(e, function(e) {
            return e === t !== n
        });
        if ("string" == typeof t) {
            if (we.test(t)) return fe.filter(t, e, n);
            t = fe.filter(t, e)
        }
        return fe.grep(e, function(e) {
            return fe.inArray(e, t) > -1 !== n
        })
    }

    function i(e, t) {
        do e = e[t]; while (e && 1 !== e.nodeType) return e
    }

    function r(e) {
        var t = {};
        return fe.each(e.match(Te) || [], function(e, n) {
            t[n] = !0
        }), t
    }

    function s() {
        oe.addEventListener ? (oe.removeEventListener("DOMContentLoaded", a), e.removeEventListener("load", a)) : (oe.detachEvent("onreadystatechange", a), e.detachEvent("onload", a))
    }

    function a() {
        (oe.addEventListener || "load" === e.event.type || "complete" === oe.readyState) && (s(), fe.ready())
    }

    function l(e, t, n) {
        if (void 0 === n && 1 === e.nodeType) {
            var o = "data-" + t.replace(Ne, "-$1").toLowerCase();
            if ("string" == typeof(n = e.getAttribute(o))) {
                try {
                    n = "true" === n || "false" !== n && ("null" === n ? null : +n + "" === n ? +n : De.test(n) ? fe.parseJSON(n) : n)
                } catch (e) {}
                fe.data(e, t, n)
            } else n = void 0
        }
        return n
    }

    function c(e) {
        var t;
        for (t in e)
            if (("data" !== t || !fe.isEmptyObject(e[t])) && "toJSON" !== t) return !1;
        return !0
    }

    function u(e, t, n, o) {
        if (qe(e)) {
            var i, r, s = fe.expando,
                a = e.nodeType,
                l = a ? fe.cache : e,
                c = a ? e[s] : e[s] && s;
            if (c && l[c] && (o || l[c].data) || void 0 !== n || "string" != typeof t) return c || (c = a ? e[s] = ne.pop() || fe.guid++ : s), l[c] || (l[c] = a ? {} : {
                toJSON: fe.noop
            }), "object" != typeof t && "function" != typeof t || (o ? l[c] = fe.extend(l[c], t) : l[c].data = fe.extend(l[c].data, t)), r = l[c], o || (r.data || (r.data = {}), r = r.data), void 0 !== n && (r[fe.camelCase(t)] = n), "string" == typeof t ? null == (i = r[t]) && (i = r[fe.camelCase(t)]) : i = r, i
        }
    }

    function d(e, t, n) {
        if (qe(e)) {
            var o, i, r = e.nodeType,
                s = r ? fe.cache : e,
                a = r ? e[fe.expando] : fe.expando;
            if (s[a]) {
                if (t && (o = n ? s[a] : s[a].data)) {
                    fe.isArray(t) ? t = t.concat(fe.map(t, fe.camelCase)) : t in o ? t = [t] : (t = fe.camelCase(t), t = t in o ? [t] : t.split(" ")), i = t.length;
                    for (; i--;) delete o[t[i]];
                    if (n ? !c(o) : !fe.isEmptyObject(o)) return
                }(n || (delete s[a].data, c(s[a]))) && (r ? fe.cleanData([e], !0) : de.deleteExpando || s != s.window ? delete s[a] : s[a] = void 0)
            }
        }
    }

    function f(e, t, n, o) {
        var i, r = 1,
            s = 20,
            a = o ? function() {
                return o.cur()
            } : function() {
                return fe.css(e, t, "")
            },
            l = a(),
            c = n && n[3] || (fe.cssNumber[t] ? "" : "px"),
            u = (fe.cssNumber[t] || "px" !== c && +l) && Ie.exec(fe.css(e, t));
        if (u && u[3] !== c) {
            c = c || u[3], n = n || [], u = +l || 1;
            do r = r || ".5", u /= r, fe.style(e, t, u + c); while (r !== (r = a() / l) && 1 !== r && --s)
        }
        return n && (u = +u || +l || 0, i = n[1] ? u + (n[1] + 1) * n[2] : +n[2], o && (o.unit = c, o.start = u, o.end = i)), i
    }

    function m(e) {
        var t = Fe.split("|"),
            n = e.createDocumentFragment();
        if (n.createElement)
            for (; t.length;) n.createElement(t.pop());
        return n
    }

    function _(e, t) {
        var n, o, i = 0,
            r = void 0 !== e.getElementsByTagName ? e.getElementsByTagName(t || "*") : void 0 !== e.querySelectorAll ? e.querySelectorAll(t || "*") : void 0;
        if (!r)
            for (r = [], n = e.childNodes || e; null != (o = n[i]); i++) !t || fe.nodeName(o, t) ? r.push(o) : fe.merge(r, _(o, t));
        return void 0 === t || t && fe.nodeName(e, t) ? fe.merge([e], r) : r
    }

    function p(e, t) {
        for (var n, o = 0; null != (n = e[o]); o++) fe._data(n, "globalEval", !t || fe._data(t[o], "globalEval"))
    }

    function h(e) {
        Le.test(e.type) && (e.defaultChecked = e.checked)
    }

    function g(e, t, n, o, i) {
        for (var r, s, a, l, c, u, d, f = e.length, g = m(t), y = [], w = 0; w < f; w++)
            if ((s = e[w]) || 0 === s)
                if ("object" === fe.type(s)) fe.merge(y, s.nodeType ? [s] : s);
                else if (Be.test(s)) {
            for (l = l || g.appendChild(t.createElement("div")), c = (Oe.exec(s) || ["", ""])[1].toLowerCase(), d = Pe[c] || Pe._default, l.innerHTML = d[1] + fe.htmlPrefilter(s) + d[2], r = d[0]; r--;) l = l.lastChild;
            if (!de.leadingWhitespace && He.test(s) && y.push(t.createTextNode(He.exec(s)[0])), !de.tbody)
                for (s = "table" !== c || We.test(s) ? "<table>" !== d[1] || We.test(s) ? 0 : l : l.firstChild, r = s && s.childNodes.length; r--;) fe.nodeName(u = s.childNodes[r], "tbody") && !u.childNodes.length && s.removeChild(u);
            for (fe.merge(y, l.childNodes), l.textContent = ""; l.firstChild;) l.removeChild(l.firstChild);
            l = g.lastChild
        } else y.push(t.createTextNode(s));
        for (l && g.removeChild(l), de.appendChecked || fe.grep(_(y, "input"), h), w = 0; s = y[w++];)
            if (o && fe.inArray(s, o) > -1) i && i.push(s);
            else if (a = fe.contains(s.ownerDocument, s), l = _(g.appendChild(s), "script"), a && p(l), n)
            for (r = 0; s = l[r++];) Me.test(s.type || "") && n.push(s);
        return l = null, g
    }

    function y() {
        return !0
    }

    function w() {
        return !1
    }

    function v() {
        try {
            return oe.activeElement
        } catch (e) {}
    }

    function b(e, t, n, o, i, r) {
        var s, a;
        if ("object" == typeof t) {
            "string" != typeof n && (o = o || n, n = void 0);
            for (a in t) b(e, a, n, o, t[a], r);
            return e
        }
        if (null == o && null == i ? (i = n, o = n = void 0) : null == i && ("string" == typeof n ? (i = o, o = void 0) : (i = o, o = n, n = void 0)), i === !1) i = w;
        else if (!i) return e;
        return 1 === r && (s = i, i = function(e) {
            return fe().off(e), s.apply(this, arguments)
        }, i.guid = s.guid || (s.guid = fe.guid++)), e.each(function() {
            fe.event.add(this, t, i, o, n)
        })
    }

    function E(e, t) {
        return fe.nodeName(e, "table") && fe.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
    }

    function x(e) {
        return e.type = (null !== fe.find.attr(e, "type")) + "/" + e.type, e
    }

    function T(e) {
        var t = Qe.exec(e.type);
        return t ? e.type = t[1] : e.removeAttribute("type"), e
    }

    function k(e, t) {
        if (1 === t.nodeType && fe.hasData(e)) {
            var n, o, i, r = fe._data(e),
                s = fe._data(t, r),
                a = r.events;
            if (a) {
                delete s.handle, s.events = {};
                for (n in a)
                    for (o = 0, i = a[n].length; o < i; o++) fe.event.add(t, n, a[n][o])
            }
            s.data && (s.data = fe.extend({}, s.data))
        }
    }

    function S(e, t) {
        var n, o, i;
        if (1 === t.nodeType) {
            if (n = t.nodeName.toLowerCase(), !de.noCloneEvent && t[fe.expando]) {
                i = fe._data(t);
                for (o in i.events) fe.removeEvent(t, o, i.handle);
                t.removeAttribute(fe.expando)
            }
            "script" === n && t.text !== e.text ? (x(t).text = e.text, T(t)) : "object" === n ? (t.parentNode && (t.outerHTML = e.outerHTML), de.html5Clone && e.innerHTML && !fe.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : "input" === n && Le.test(e.type) ? (t.defaultChecked = t.checked = e.checked, t.value !== e.value && (t.value = e.value)) : "option" === n ? t.defaultSelected = t.selected = e.defaultSelected : "input" !== n && "textarea" !== n || (t.defaultValue = e.defaultValue)
        }
    }

    function q(e, t, n, o) {
        t = re.apply([], t);
        var i, r, s, a, l, c, u = 0,
            d = e.length,
            f = d - 1,
            m = t[0],
            p = fe.isFunction(m);
        if (p || d > 1 && "string" == typeof m && !de.checkClone && Ke.test(m)) return e.each(function(i) {
            var r = e.eq(i);
            p && (t[0] = m.call(this, i, r.html())), q(r, t, n, o)
        });
        if (d && (c = g(t, e[0].ownerDocument, !1, e, o), i = c.firstChild, 1 === c.childNodes.length && (c = i), i || o)) {
            for (a = fe.map(_(c, "script"), x), s = a.length; u < d; u++) r = c, u !== f && (r = fe.clone(r, !0, !0), s && fe.merge(a, _(r, "script"))), n.call(e[u], r, u);
            if (s)
                for (l = a[a.length - 1].ownerDocument, fe.map(a, T), u = 0; u < s; u++) r = a[u], Me.test(r.type || "") && !fe._data(r, "globalEval") && fe.contains(l, r) && (r.src ? fe._evalUrl && fe._evalUrl(r.src) : fe.globalEval((r.text || r.textContent || r.innerHTML || "").replace(Je, "")));
            c = i = null
        }
        return e
    }

    function D(e, t, n) {
        for (var o, i = t ? fe.filter(t, e) : e, r = 0; null != (o = i[r]); r++) n || 1 !== o.nodeType || fe.cleanData(_(o)), o.parentNode && (n && fe.contains(o.ownerDocument, o) && p(_(o, "script")), o.parentNode.removeChild(o));
        return e
    }

    function N(e, t) {
        var n = fe(t.createElement(e)).appendTo(t.body),
            o = fe.css(n[0], "display");
        return n.detach(), o
    }

    function C(e) {
        var t = oe,
            n = nt[e];
        return n || (n = N(e, t), "none" !== n && n || (tt = (tt || fe("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement), t = (tt[0].contentWindow || tt[0].contentDocument).document, t.write(), t.close(), n = N(e, t), tt.detach()), nt[e] = n), n
    }

    function I(e, t) {
        return {
            get: function() {
                return e() ? void delete this.get : (this.get = t).apply(this, arguments)
            }
        }
    }

    function j(e) {
        if (e in gt) return e;
        for (var t = e.charAt(0).toUpperCase() + e.slice(1), n = ht.length; n--;)
            if ((e = ht[n] + t) in gt) return e
    }

    function R(e, t) {
        for (var n, o, i, r = [], s = 0, a = e.length; s < a; s++) o = e[s], o.style && (r[s] = fe._data(o, "olddisplay"), n = o.style.display, t ? (r[s] || "none" !== n || (o.style.display = ""), "" === o.style.display && Re(o) && (r[s] = fe._data(o, "olddisplay", C(o.nodeName)))) : (i = Re(o), (n && "none" !== n || !i) && fe._data(o, "olddisplay", i ? n : fe.css(o, "display"))));
        for (s = 0; s < a; s++) o = e[s], o.style && (t && "none" !== o.style.display && "" !== o.style.display || (o.style.display = t ? r[s] || "" : "none"));
        return e
    }

    function A(e, t, n) {
        var o = mt.exec(t);
        return o ? Math.max(0, o[1] - (n || 0)) + (o[2] || "px") : t
    }

    function L(e, t, n, o, i) {
        for (var r = n === (o ? "border" : "content") ? 4 : "width" === t ? 1 : 0, s = 0; r < 4; r += 2) "margin" === n && (s += fe.css(e, n + je[r], !0, i)), o ? ("content" === n && (s -= fe.css(e, "padding" + je[r], !0, i)), "margin" !== n && (s -= fe.css(e, "border" + je[r] + "Width", !0, i))) : (s += fe.css(e, "padding" + je[r], !0, i), "padding" !== n && (s += fe.css(e, "border" + je[r] + "Width", !0, i)));
        return s
    }

    function O(t, n, o) {
        var i = !0,
            r = "width" === n ? t.offsetWidth : t.offsetHeight,
            s = at(t),
            a = de.boxSizing && "border-box" === fe.css(t, "boxSizing", !1, s);
        if (oe.msFullscreenElement && e.top !== e && t.getClientRects().length && (r = Math.round(100 * t.getBoundingClientRect()[n])), r <= 0 || null == r) {
            if (r = lt(t, n, s), (r < 0 || null == r) && (r = t.style[n]), it.test(r)) return r;
            i = a && (de.boxSizingReliable() || r === t.style[n]), r = parseFloat(r) || 0
        }
        return r + L(t, n, o || (a ? "border" : "content"), i, s) + "px"
    }

    function M(e, t, n, o, i) {
        return new M.prototype.init(e, t, n, o, i)
    }

    function H() {
        return e.setTimeout(function() {
            yt = void 0
        }), yt = fe.now()
    }

    function F(e, t) {
        var n, o = {
                height: e
            },
            i = 0;
        for (t = t ? 1 : 0; i < 4; i += 2 - t) n = je[i], o["margin" + n] = o["padding" + n] = e;
        return t && (o.opacity = o.width = e), o
    }

    function P(e, t, n) {
        for (var o, i = (z.tweeners[t] || []).concat(z.tweeners["*"]), r = 0, s = i.length; r < s; r++)
            if (o = i[r].call(n, t, e)) return o
    }

    function B(e, t, n) {
        var o, i, r, s, a, l, c, u = this,
            d = {},
            f = e.style,
            m = e.nodeType && Re(e),
            _ = fe._data(e, "fxshow");
        n.queue || (a = fe._queueHooks(e, "fx"), null == a.unqueued && (a.unqueued = 0, l = a.empty.fire, a.empty.fire = function() {
            a.unqueued || l()
        }), a.unqueued++, u.always(function() {
            u.always(function() {
                a.unqueued--, fe.queue(e, "fx").length || a.empty.fire()
            })
        })), 1 === e.nodeType && ("height" in t || "width" in t) && (n.overflow = [f.overflow, f.overflowX, f.overflowY], c = fe.css(e, "display"), "inline" === ("none" === c ? fe._data(e, "olddisplay") || C(e.nodeName) : c) && "none" === fe.css(e, "float") && (de.inlineBlockNeedsLayout && "inline" !== C(e.nodeName) ? f.zoom = 1 : f.display = "inline-block")), n.overflow && (f.overflow = "hidden", de.shrinkWrapBlocks() || u.always(function() {
            f.overflow = n.overflow[0], f.overflowX = n.overflow[1], f.overflowY = n.overflow[2]
        }));
        for (o in t)
            if (i = t[o], vt.exec(i)) {
                if (delete t[o], r = r || "toggle" === i, i === (m ? "hide" : "show")) {
                    if ("show" !== i || !_ || void 0 === _[o]) continue;
                    m = !0
                }
                d[o] = _ && _[o] || fe.style(e, o)
            } else c = void 0;
        if (fe.isEmptyObject(d)) "inline" === ("none" === c ? C(e.nodeName) : c) && (f.display = c);
        else {
            _ ? "hidden" in _ && (m = _.hidden) : _ = fe._data(e, "fxshow", {}), r && (_.hidden = !m), m ? fe(e).show() : u.done(function() {
                fe(e).hide()
            }), u.done(function() {
                var t;
                fe._removeData(e, "fxshow");
                for (t in d) fe.style(e, t, d[t])
            });
            for (o in d) s = P(m ? _[o] : 0, o, u), o in _ || (_[o] = s.start, m && (s.end = s.start, s.start = "width" === o || "height" === o ? 1 : 0))
        }
    }

    function W(e, t) {
        var n, o, i, r, s;
        for (n in e)
            if (o = fe.camelCase(n), i = t[o], r = e[n], fe.isArray(r) && (i = r[1], r = e[n] = r[0]), n !== o && (e[o] = r, delete e[n]), (s = fe.cssHooks[o]) && "expand" in s) {
                r = s.expand(r), delete e[o];
                for (n in r) n in e || (e[n] = r[n], t[n] = i)
            } else t[o] = i
    }

    function z(e, t, n) {
        var o, i, r = 0,
            s = z.prefilters.length,
            a = fe.Deferred().always(function() {
                delete l.elem
            }),
            l = function() {
                if (i) return !1;
                for (var t = yt || H(), n = Math.max(0, c.startTime + c.duration - t), o = n / c.duration || 0, r = 1 - o, s = 0, l = c.tweens.length; s < l; s++) c.tweens[s].run(r);
                return a.notifyWith(e, [c, r, n]), r < 1 && l ? n : (a.resolveWith(e, [c]), !1)
            },
            c = a.promise({
                elem: e,
                props: fe.extend({}, t),
                opts: fe.extend(!0, {
                    specialEasing: {},
                    easing: fe.easing._default
                }, n),
                originalProperties: t,
                originalOptions: n,
                startTime: yt || H(),
                duration: n.duration,
                tweens: [],
                createTween: function(t, n) {
                    var o = fe.Tween(e, c.opts, t, n, c.opts.specialEasing[t] || c.opts.easing);
                    return c.tweens.push(o), o
                },
                stop: function(t) {
                    var n = 0,
                        o = t ? c.tweens.length : 0;
                    if (i) return this;
                    for (i = !0; n < o; n++) c.tweens[n].run(1);
                    return t ? (a.notifyWith(e, [c, 1, 0]), a.resolveWith(e, [c, t])) : a.rejectWith(e, [c, t]), this
                }
            }),
            u = c.props;
        for (W(u, c.opts.specialEasing); r < s; r++)
            if (o = z.prefilters[r].call(c, e, u, c.opts)) return fe.isFunction(o.stop) && (fe._queueHooks(c.elem, c.opts.queue).stop = fe.proxy(o.stop, o)), o;
        return fe.map(u, P, c), fe.isFunction(c.opts.start) && c.opts.start.call(e, c), fe.fx.timer(fe.extend(l, {
            elem: e,
            anim: c,
            queue: c.opts.queue
        })), c.progress(c.opts.progress).done(c.opts.done, c.opts.complete).fail(c.opts.fail).always(c.opts.always)
    }

    function X(e) {
        return fe.attr(e, "class") || ""
    }

    function U(e) {
        return function(t, n) {
            "string" != typeof t && (n = t, t = "*");
            var o, i = 0,
                r = t.toLowerCase().match(Te) || [];
            if (fe.isFunction(n))
                for (; o = r[i++];) "+" === o.charAt(0) ? (o = o.slice(1) || "*", (e[o] = e[o] || []).unshift(n)) : (e[o] = e[o] || []).push(n)
        }
    }

    function G(e, t, n, o) {
        function i(a) {
            var l;
            return r[a] = !0, fe.each(e[a] || [], function(e, a) {
                var c = a(t, n, o);
                return "string" != typeof c || s || r[c] ? s ? !(l = c) : void 0 : (t.dataTypes.unshift(c), i(c), !1)
            }), l
        }
        var r = {},
            s = e === Ft;
        return i(t.dataTypes[0]) || !r["*"] && i("*")
    }

    function $(e, t) {
        var n, o, i = fe.ajaxSettings.flatOptions || {};
        for (o in t) void 0 !== t[o] && ((i[o] ? e : n || (n = {}))[o] = t[o]);
        return n && fe.extend(!0, e, n), e
    }

    function V(e, t, n) {
        for (var o, i, r, s, a = e.contents, l = e.dataTypes;
            "*" === l[0];) l.shift(), void 0 === i && (i = e.mimeType || t.getResponseHeader("Content-Type"));
        if (i)
            for (s in a)
                if (a[s] && a[s].test(i)) {
                    l.unshift(s);
                    break
                }
        if (l[0] in n) r = l[0];
        else {
            for (s in n) {
                if (!l[0] || e.converters[s + " " + l[0]]) {
                    r = s;
                    break
                }
                o || (o = s)
            }
            r = r || o
        }
        if (r) return r !== l[0] && l.unshift(r), n[r]
    }

    function Y(e, t, n, o) {
        var i, r, s, a, l, c = {},
            u = e.dataTypes.slice();
        if (u[1])
            for (s in e.converters) c[s.toLowerCase()] = e.converters[s];
        for (r = u.shift(); r;)
            if (e.responseFields[r] && (n[e.responseFields[r]] = t), !l && o && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = r, r = u.shift())
                if ("*" === r) r = l;
                else if ("*" !== l && l !== r) {
            if (!(s = c[l + " " + r] || c["* " + r]))
                for (i in c)
                    if (a = i.split(" "), a[1] === r && (s = c[l + " " + a[0]] || c["* " + a[0]])) {
                        s === !0 ? s = c[i] : c[i] !== !0 && (r = a[0], u.unshift(a[1]));
                        break
                    }
            if (s !== !0)
                if (s && e.throws) t = s(t);
                else try {
                    t = s(t)
                } catch (e) {
                    return {
                        state: "parsererror",
                        error: s ? e : "No conversion from " + l + " to " + r
                    }
                }
        }
        return {
            state: "success",
            data: t
        }
    }

    function K(e) {
        return e.style && e.style.display || fe.css(e, "display")
    }

    function Q(e) {
        for (; e && 1 === e.nodeType;) {
            if ("none" === K(e) || "hidden" === e.type) return !0;
            e = e.parentNode
        }
        return !1
    }

    function J(e, t, n, o) {
        var i;
        if (fe.isArray(t)) fe.each(t, function(t, i) {
            n || zt.test(e) ? o(e, i) : J(e + "[" + ("object" == typeof i && null != i ? t : "") + "]", i, n, o)
        });
        else if (n || "object" !== fe.type(t)) o(e, t);
        else
            for (i in t) J(e + "[" + i + "]", t[i], n, o)
    }

    function Z() {
        try {
            return new e.XMLHttpRequest
        } catch (e) {}
    }

    function ee() {
        try {
            return new e.ActiveXObject("Microsoft.XMLHTTP")
        } catch (e) {}
    }

    function te(e) {
        return fe.isWindow(e) ? e : 9 === e.nodeType && (e.defaultView || e.parentWindow)
    }
    var ne = [],
        oe = e.document,
        ie = ne.slice,
        re = ne.concat,
        se = ne.push,
        ae = ne.indexOf,
        le = {},
        ce = le.toString,
        ue = le.hasOwnProperty,
        de = {},
        fe = function(e, t) {
            return new fe.fn.init(e, t)
        },
        me = function(e, t) {
            return t.toUpperCase()
        };
    fe.fn = fe.prototype = {
        jquery: "1.12.2",
        constructor: fe,
        selector: "",
        length: 0,
        toArray: function() {
            return ie.call(this)
        },
        get: function(e) {
            return null != e ? e < 0 ? this[e + this.length] : this[e] : ie.call(this)
        },
        pushStack: function(e) {
            var t = fe.merge(this.constructor(), e);
            return t.prevObject = this, t.context = this.context, t
        },
        each: function(e) {
            return fe.each(this, e)
        },
        map: function(e) {
            return this.pushStack(fe.map(this, function(t, n) {
                return e.call(t, n, t)
            }))
        },
        slice: function() {
            return this.pushStack(ie.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(e) {
            var t = this.length,
                n = +e + (e < 0 ? t : 0);
            return this.pushStack(n >= 0 && n < t ? [this[n]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor()
        },
        push: se,
        sort: ne.sort,
        splice: ne.splice
    }, fe.extend = fe.fn.extend = function() {
        var e, t, n, o, i, r, s = arguments[0] || {},
            a = 1,
            l = arguments.length,
            c = !1;
        for ("boolean" == typeof s && (c = s, s = arguments[a] || {}, a++), "object" == typeof s || fe.isFunction(s) || (s = {}), a === l && (s = this, a--); a < l; a++)
            if (null != (i = arguments[a]))
                for (o in i) e = s[o], n = i[o], s !== n && (c && n && (fe.isPlainObject(n) || (t = fe.isArray(n))) ? (t ? (t = !1, r = e && fe.isArray(e) ? e : []) : r = e && fe.isPlainObject(e) ? e : {}, s[o] = fe.extend(c, r, n)) : void 0 !== n && (s[o] = n));
        return s
    }, fe.extend({
        expando: "jQuery" + ("1.12.2" + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(e) {
            throw new Error(e)
        },
        noop: function() {},
        isFunction: function(e) {
            return "function" === fe.type(e)
        },
        isArray: Array.isArray || function(e) {
            return "array" === fe.type(e)
        },
        isWindow: function(e) {
            return null != e && e == e.window
        },
        isNumeric: function(e) {
            var t = e && e.toString();
            return !fe.isArray(e) && t - parseFloat(t) + 1 >= 0
        },
        isEmptyObject: function(e) {
            var t;
            for (t in e) return !1;
            return !0
        },
        isPlainObject: function(e) {
            var t;
            if (!e || "object" !== fe.type(e) || e.nodeType || fe.isWindow(e)) return !1;
            try {
                if (e.constructor && !ue.call(e, "constructor") && !ue.call(e.constructor.prototype, "isPrototypeOf")) return !1
            } catch (e) {
                return !1
            }
            if (!de.ownFirst)
                for (t in e) return ue.call(e, t);
            for (t in e);
            return void 0 === t || ue.call(e, t)
        },
        type: function(e) {
            return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? le[ce.call(e)] || "object" : typeof e
        },
        globalEval: function(t) {
            t && fe.trim(t) && (e.execScript || function(t) {
                e.eval.call(e, t)
            })(t)
        },
        camelCase: function(e) {
            return e.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, me)
        },
        nodeName: function(e, t) {
            return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
        },
        each: function(e, t) {
            var o, i = 0;
            if (n(e))
                for (o = e.length; i < o && t.call(e[i], i, e[i]) !== !1; i++);
            else
                for (i in e)
                    if (t.call(e[i], i, e[i]) === !1) break; return e
        },
        trim: function(e) {
            return null == e ? "" : (e + "").replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
        },
        makeArray: function(e, t) {
            var o = t || [];
            return null != e && (n(Object(e)) ? fe.merge(o, "string" == typeof e ? [e] : e) : se.call(o, e)), o
        },
        inArray: function(e, t, n) {
            var o;
            if (t) {
                if (ae) return ae.call(t, e, n);
                for (o = t.length, n = n ? n < 0 ? Math.max(0, o + n) : n : 0; n < o; n++)
                    if (n in t && t[n] === e) return n
            }
            return -1
        },
        merge: function(e, t) {
            for (var n = +t.length, o = 0, i = e.length; o < n;) e[i++] = t[o++];
            if (n !== n)
                for (; void 0 !== t[o];) e[i++] = t[o++];
            return e.length = i, e
        },
        grep: function(e, t, n) {
            for (var o = [], i = 0, r = e.length, s = !n; i < r; i++) !t(e[i], i) !== s && o.push(e[i]);
            return o
        },
        map: function(e, t, o) {
            var i, r, s = 0,
                a = [];
            if (n(e))
                for (i = e.length; s < i; s++) null != (r = t(e[s], s, o)) && a.push(r);
            else
                for (s in e) null != (r = t(e[s], s, o)) && a.push(r);
            return re.apply([], a)
        },
        guid: 1,
        proxy: function(e, t) {
            var n, o, i;
            if ("string" == typeof t && (i = e[t], t = e, e = i), fe.isFunction(e)) return n = ie.call(arguments, 2), o = function() {
                return e.apply(t || this, n.concat(ie.call(arguments)))
            }, o.guid = e.guid = e.guid || fe.guid++, o
        },
        now: function() {
            return +new Date
        },
        support: de
    }), "function" == typeof Symbol && (fe.fn[Symbol.iterator] = ne[Symbol.iterator]), fe.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(e, t) {
        le["[object " + t + "]"] = t.toLowerCase()
    });
    var _e = function(e) {
        function t(e, t, n, o) {
            var i, r, s, a, c, d, f, m, _ = t && t.ownerDocument,
                p = t ? t.nodeType : 9;
            if (n = n || [], "string" != typeof e || !e || 1 !== p && 9 !== p && 11 !== p) return n;
            if (!o && ((t ? t.ownerDocument || t : H) !== C && N(t), t = t || C, j)) {
                if (11 !== p && (d = pe.exec(e)))
                    if (i = d[1]) {
                        if (9 === p) {
                            if (!(s = t.getElementById(i))) return n;
                            if (s.id === i) return n.push(s), n
                        } else if (_ && (s = _.getElementById(i)) && O(t, s) && s.id === i) return n.push(s), n
                    } else {
                        if (d[2]) return K.apply(n, t.getElementsByTagName(e)), n;
                        if ((i = d[3]) && w.getElementsByClassName && t.getElementsByClassName) return K.apply(n, t.getElementsByClassName(i)), n
                    }
                if (w.qsa && !z[e + " "] && (!R || !R.test(e))) {
                    if (1 !== p) _ = t, m = e;
                    else if ("object" !== t.nodeName.toLowerCase()) {
                        for ((a = t.getAttribute("id")) ? a = a.replace(ge, "\\$&") : t.setAttribute("id", a = M), f = x(e), r = f.length, c = ue.test(a) ? "#" + a : "[id='" + a + "']"; r--;) f[r] = c + " " + u(f[r]);
                        m = f.join(","), _ = he.test(e) && l(t.parentNode) || t
                    }
                    if (m) try {
                        return K.apply(n, _.querySelectorAll(m)), n
                    } catch (e) {} finally {
                        a === M && t.removeAttribute("id")
                    }
                }
            }
            return k(e.replace(re, "$1"), t, n, o)
        }

        function n() {
            function e(n, o) {
                return t.push(n + " ") > v.cacheLength && delete e[t.shift()], e[n + " "] = o
            }
            var t = [];
            return e
        }

        function o(e) {
            return e[M] = !0, e
        }

        function i(e) {
            var t = C.createElement("div");
            try {
                return !!e(t)
            } catch (e) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t), t = null
            }
        }

        function r(e, t) {
            for (var n = e.split("|"), o = n.length; o--;) v.attrHandle[n[o]] = t
        }

        function s(e, t) {
            var n = t && e,
                o = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || U) - (~e.sourceIndex || U);
            if (o) return o;
            if (n)
                for (; n = n.nextSibling;)
                    if (n === t) return -1;
            return e ? 1 : -1
        }

        function a(e) {
            return o(function(t) {
                return t = +t, o(function(n, o) {
                    for (var i, r = e([], n.length, t), s = r.length; s--;) n[i = r[s]] && (n[i] = !(o[i] = n[i]))
                })
            })
        }

        function l(e) {
            return e && void 0 !== e.getElementsByTagName && e
        }

        function c() {}

        function u(e) {
            for (var t = 0, n = e.length, o = ""; t < n; t++) o += e[t].value;
            return o
        }

        function d(e, t, n) {
            var o = t.dir,
                i = n && "parentNode" === o,
                r = P++;
            return t.first ? function(t, n, r) {
                for (; t = t[o];)
                    if (1 === t.nodeType || i) return e(t, n, r)
            } : function(t, n, s) {
                var a, l, c, u = [F, r];
                if (s) {
                    for (; t = t[o];)
                        if ((1 === t.nodeType || i) && e(t, n, s)) return !0
                } else
                    for (; t = t[o];)
                        if (1 === t.nodeType || i) {
                            if (c = t[M] || (t[M] = {}), l = c[t.uniqueID] || (c[t.uniqueID] = {}), (a = l[o]) && a[0] === F && a[1] === r) return u[2] = a[2];
                            if (l[o] = u, u[2] = e(t, n, s)) return !0
                        }
            }
        }

        function f(e) {
            return e.length > 1 ? function(t, n, o) {
                for (var i = e.length; i--;)
                    if (!e[i](t, n, o)) return !1;
                return !0
            } : e[0]
        }

        function m(e, n, o) {
            for (var i = 0, r = n.length; i < r; i++) t(e, n[i], o);
            return o
        }

        function _(e, t, n, o, i) {
            for (var r, s = [], a = 0, l = e.length, c = null != t; a < l; a++)(r = e[a]) && (n && !n(r, o, i) || (s.push(r), c && t.push(a)));
            return s
        }

        function p(e, t, n, i, r, s) {
            return i && !i[M] && (i = p(i)), r && !r[M] && (r = p(r, s)), o(function(o, s, a, l) {
                var c, u, d, f = [],
                    p = [],
                    h = s.length,
                    g = o || m(t || "*", a.nodeType ? [a] : a, []),
                    y = !e || !o && t ? g : _(g, f, e, a, l),
                    w = n ? r || (o ? e : h || i) ? [] : s : y;
                if (n && n(y, w, a, l), i)
                    for (c = _(w, p), i(c, [], a, l), u = c.length; u--;)(d = c[u]) && (w[p[u]] = !(y[p[u]] = d));
                if (o) {
                    if (r || e) {
                        if (r) {
                            for (c = [], u = w.length; u--;)(d = w[u]) && c.push(y[u] = d);
                            r(null, w = [], c, l)
                        }
                        for (u = w.length; u--;)(d = w[u]) && (c = r ? J(o, d) : f[u]) > -1 && (o[c] = !(s[c] = d))
                    }
                } else w = _(w === s ? w.splice(h, w.length) : w), r ? r(null, s, w, l) : K.apply(s, w)
            })
        }

        function h(e) {
            for (var t, n, o, i = e.length, r = v.relative[e[0].type], s = r || v.relative[" "], a = r ? 1 : 0, l = d(function(e) {
                    return e === t
                }, s, !0), c = d(function(e) {
                    return J(t, e) > -1
                }, s, !0), m = [function(e, n, o) {
                    var i = !r && (o || n !== S) || ((t = n).nodeType ? l(e, n, o) : c(e, n, o));
                    return t = null, i
                }]; a < i; a++)
                if (n = v.relative[e[a].type]) m = [d(f(m), n)];
                else {
                    if (n = v.filter[e[a].type].apply(null, e[a].matches), n[M]) {
                        for (o = ++a; o < i && !v.relative[e[o].type]; o++);
                        return p(a > 1 && f(m), a > 1 && u(e.slice(0, a - 1).concat({
                            value: " " === e[a - 2].type ? "*" : ""
                        })).replace(re, "$1"), n, a < o && h(e.slice(a, o)), o < i && h(e = e.slice(o)), o < i && u(e))
                    }
                    m.push(n)
                }
            return f(m)
        }

        function g(e, n) {
            var i = n.length > 0,
                r = e.length > 0,
                s = function(o, s, a, l, c) {
                    var u, d, f, m = 0,
                        p = "0",
                        h = o && [],
                        g = [],
                        y = S,
                        w = o || r && v.find.TAG("*", c),
                        b = F += null == y ? 1 : Math.random() || .1,
                        E = w.length;
                    for (c && (S = s === C || s || c); p !== E && null != (u = w[p]); p++) {
                        if (r && u) {
                            for (d = 0, s || u.ownerDocument === C || (N(u), a = !j); f = e[d++];)
                                if (f(u, s || C, a)) {
                                    l.push(u);
                                    break
                                }
                            c && (F = b)
                        }
                        i && ((u = !f && u) && m--, o && h.push(u))
                    }
                    if (m += p, i && p !== m) {
                        for (d = 0; f = n[d++];) f(h, g, s, a);
                        if (o) {
                            if (m > 0)
                                for (; p--;) h[p] || g[p] || (g[p] = V.call(l));
                            g = _(g)
                        }
                        K.apply(l, g), c && !o && g.length > 0 && m + n.length > 1 && t.uniqueSort(l)
                    }
                    return c && (F = b, S = y), h
                };
            return i ? o(s) : s
        }
        var y, w, v, b, E, x, T, k, S, q, D, N, C, I, j, R, A, L, O, M = "sizzle" + 1 * new Date,
            H = e.document,
            F = 0,
            P = 0,
            B = n(),
            W = n(),
            z = n(),
            X = function(e, t) {
                return e === t && (D = !0), 0
            },
            U = 1 << 31,
            G = {}.hasOwnProperty,
            $ = [],
            V = $.pop,
            Y = $.push,
            K = $.push,
            Q = $.slice,
            J = function(e, t) {
                for (var n = 0, o = e.length; n < o; n++)
                    if (e[n] === t) return n;
                return -1
            },
            Z = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            ee = "[\\x20\\t\\r\\n\\f]",
            te = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
            ne = "\\[" + ee + "*(" + te + ")(?:" + ee + "*([*^$|!~]?=)" + ee + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + te + "))|)" + ee + "*\\]",
            oe = ":(" + te + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + ne + ")*)|.*)\\)|)",
            ie = new RegExp(ee + "+", "g"),
            re = new RegExp("^" + ee + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ee + "+$", "g"),
            se = new RegExp("^" + ee + "*," + ee + "*"),
            ae = new RegExp("^" + ee + "*([>+~]|" + ee + ")" + ee + "*"),
            le = new RegExp("=" + ee + "*([^\\]'\"]*?)" + ee + "*\\]", "g"),
            ce = new RegExp(oe),
            ue = new RegExp("^" + te + "$"),
            de = {
                ID: new RegExp("^#(" + te + ")"),
                CLASS: new RegExp("^\\.(" + te + ")"),
                TAG: new RegExp("^(" + te + "|[*])"),
                ATTR: new RegExp("^" + ne),
                PSEUDO: new RegExp("^" + oe),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ee + "*(even|odd|(([+-]|)(\\d*)n|)" + ee + "*(?:([+-]|)" + ee + "*(\\d+)|))" + ee + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + Z + ")$", "i"),
                needsContext: new RegExp("^" + ee + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ee + "*((?:-\\d)?\\d*)" + ee + "*\\)|)(?=[^-]|$)", "i")
            },
            fe = /^(?:input|select|textarea|button)$/i,
            me = /^h\d$/i,
            _e = /^[^{]+\{\s*\[native \w/,
            pe = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            he = /[+~]/,
            ge = /'|\\/g,
            ye = new RegExp("\\\\([\\da-f]{1,6}" + ee + "?|(" + ee + ")|.)", "ig"),
            we = function(e, t, n) {
                var o = "0x" + t - 65536;
                return o !== o || n ? t : o < 0 ? String.fromCharCode(o + 65536) : String.fromCharCode(o >> 10 | 55296, 1023 & o | 56320)
            },
            ve = function() {
                N()
            };
        try {
            K.apply($ = Q.call(H.childNodes), H.childNodes), $[H.childNodes.length].nodeType
        } catch (e) {
            K = {
                apply: $.length ? function(e, t) {
                    Y.apply(e, Q.call(t))
                } : function(e, t) {
                    for (var n = e.length, o = 0; e[n++] = t[o++];);
                    e.length = n - 1
                }
            }
        }
        w = t.support = {}, E = t.isXML = function(e) {
            var t = e && (e.ownerDocument || e).documentElement;
            return !!t && "HTML" !== t.nodeName
        }, N = t.setDocument = function(e) {
            var t, n, o = e ? e.ownerDocument || e : H;
            return o !== C && 9 === o.nodeType && o.documentElement ? (C = o, I = C.documentElement, j = !E(C), (n = C.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener("unload", ve, !1) : n.attachEvent && n.attachEvent("onunload", ve)), w.attributes = i(function(e) {
                return e.className = "i", !e.getAttribute("className")
            }), w.getElementsByTagName = i(function(e) {
                return e.appendChild(C.createComment("")), !e.getElementsByTagName("*").length
            }), w.getElementsByClassName = _e.test(C.getElementsByClassName), w.getById = i(function(e) {
                return I.appendChild(e).id = M, !C.getElementsByName || !C.getElementsByName(M).length
            }), w.getById ? (v.find.ID = function(e, t) {
                if (void 0 !== t.getElementById && j) {
                    var n = t.getElementById(e);
                    return n ? [n] : []
                }
            }, v.filter.ID = function(e) {
                var t = e.replace(ye, we);
                return function(e) {
                    return e.getAttribute("id") === t
                }
            }) : (delete v.find.ID, v.filter.ID = function(e) {
                var t = e.replace(ye, we);
                return function(e) {
                    var n = void 0 !== e.getAttributeNode && e.getAttributeNode("id");
                    return n && n.value === t
                }
            }), v.find.TAG = w.getElementsByTagName ? function(e, t) {
                return void 0 !== t.getElementsByTagName ? t.getElementsByTagName(e) : w.qsa ? t.querySelectorAll(e) : void 0
            } : function(e, t) {
                var n, o = [],
                    i = 0,
                    r = t.getElementsByTagName(e);
                if ("*" === e) {
                    for (; n = r[i++];) 1 === n.nodeType && o.push(n);
                    return o
                }
                return r
            }, v.find.CLASS = w.getElementsByClassName && function(e, t) {
                if (void 0 !== t.getElementsByClassName && j) return t.getElementsByClassName(e)
            }, A = [], R = [], (w.qsa = _e.test(C.querySelectorAll)) && (i(function(e) {
                I.appendChild(e).innerHTML = "<a id='" + M + "'></a><select id='" + M + "-\r\\' msallowcapture=''><option selected=''></option></select>", e.querySelectorAll("[msallowcapture^='']").length && R.push("[*^$]=" + ee + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || R.push("\\[" + ee + "*(?:value|" + Z + ")"), e.querySelectorAll("[id~=" + M + "-]").length || R.push("~="), e.querySelectorAll(":checked").length || R.push(":checked"), e.querySelectorAll("a#" + M + "+*").length || R.push(".#.+[+~]")
            }), i(function(e) {
                var t = C.createElement("input");
                t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && R.push("name" + ee + "*[*^$|!~]?="), e.querySelectorAll(":enabled").length || R.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), R.push(",.*:")
            })), (w.matchesSelector = _e.test(L = I.matches || I.webkitMatchesSelector || I.mozMatchesSelector || I.oMatchesSelector || I.msMatchesSelector)) && i(function(e) {
                w.disconnectedMatch = L.call(e, "div"), L.call(e, "[s!='']:x"), A.push("!=", oe)
            }), R = R.length && new RegExp(R.join("|")), A = A.length && new RegExp(A.join("|")), t = _e.test(I.compareDocumentPosition), O = t || _e.test(I.contains) ? function(e, t) {
                var n = 9 === e.nodeType ? e.documentElement : e,
                    o = t && t.parentNode;
                return e === o || !(!o || 1 !== o.nodeType || !(n.contains ? n.contains(o) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(o)))
            } : function(e, t) {
                if (t)
                    for (; t = t.parentNode;)
                        if (t === e) return !0;
                return !1
            }, X = t ? function(e, t) {
                if (e === t) return D = !0, 0;
                var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                return n ? n : (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1, 1 & n || !w.sortDetached && t.compareDocumentPosition(e) === n ? e === C || e.ownerDocument === H && O(H, e) ? -1 : t === C || t.ownerDocument === H && O(H, t) ? 1 : q ? J(q, e) - J(q, t) : 0 : 4 & n ? -1 : 1)
            } : function(e, t) {
                if (e === t) return D = !0, 0;
                var n, o = 0,
                    i = e.parentNode,
                    r = t.parentNode,
                    a = [e],
                    l = [t];
                if (!i || !r) return e === C ? -1 : t === C ? 1 : i ? -1 : r ? 1 : q ? J(q, e) - J(q, t) : 0;
                if (i === r) return s(e, t);
                for (n = e; n = n.parentNode;) a.unshift(n);
                for (n = t; n = n.parentNode;) l.unshift(n);
                for (; a[o] === l[o];) o++;
                return o ? s(a[o], l[o]) : a[o] === H ? -1 : l[o] === H ? 1 : 0
            }, C) : C
        }, t.matches = function(e, n) {
            return t(e, null, null, n)
        }, t.matchesSelector = function(e, n) {
            if ((e.ownerDocument || e) !== C && N(e), n = n.replace(le, "='$1']"), w.matchesSelector && j && !z[n + " "] && (!A || !A.test(n)) && (!R || !R.test(n))) try {
                var o = L.call(e, n);
                if (o || w.disconnectedMatch || e.document && 11 !== e.document.nodeType) return o
            } catch (e) {}
            return t(n, C, null, [e]).length > 0
        }, t.contains = function(e, t) {
            return (e.ownerDocument || e) !== C && N(e), O(e, t)
        }, t.attr = function(e, t) {
            (e.ownerDocument || e) !== C && N(e);
            var n = v.attrHandle[t.toLowerCase()],
                o = n && G.call(v.attrHandle, t.toLowerCase()) ? n(e, t, !j) : void 0;
            return void 0 !== o ? o : w.attributes || !j ? e.getAttribute(t) : (o = e.getAttributeNode(t)) && o.specified ? o.value : null
        }, t.error = function(e) {
            throw new Error("Syntax error, unrecognized expression: " + e)
        }, t.uniqueSort = function(e) {
            var t, n = [],
                o = 0,
                i = 0;
            if (D = !w.detectDuplicates, q = !w.sortStable && e.slice(0), e.sort(X), D) {
                for (; t = e[i++];) t === e[i] && (o = n.push(i));
                for (; o--;) e.splice(n[o], 1)
            }
            return q = null, e
        }, b = t.getText = function(e) {
            var t, n = "",
                o = 0,
                i = e.nodeType;
            if (i) {
                if (1 === i || 9 === i || 11 === i) {
                    if ("string" == typeof e.textContent) return e.textContent;
                    for (e = e.firstChild; e; e = e.nextSibling) n += b(e)
                } else if (3 === i || 4 === i) return e.nodeValue
            } else
                for (; t = e[o++];) n += b(t);
            return n
        }, v = t.selectors = {
            cacheLength: 50,
            createPseudo: o,
            match: de,
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
                ATTR: function(e) {
                    return e[1] = e[1].replace(ye, we), e[3] = (e[3] || e[4] || e[5] || "").replace(ye, we), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                },
                CHILD: function(e) {
                    return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]), e
                },
                PSEUDO: function(e) {
                    var t, n = !e[6] && e[2];
                    return de.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && ce.test(n) && (t = x(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
                }
            },
            filter: {
                TAG: function(e) {
                    var t = e.replace(ye, we).toLowerCase();
                    return "*" === e ? function() {
                        return !0
                    } : function(e) {
                        return e.nodeName && e.nodeName.toLowerCase() === t
                    }
                },
                CLASS: function(e) {
                    var t = B[e + " "];
                    return t || (t = new RegExp("(^|" + ee + ")" + e + "(" + ee + "|$)")) && B(e, function(e) {
                        return t.test("string" == typeof e.className && e.className || void 0 !== e.getAttribute && e.getAttribute("class") || "")
                    })
                },
                ATTR: function(e, n, o) {
                    return function(i) {
                        var r = t.attr(i, e);
                        return null == r ? "!=" === n : !n || (r += "", "=" === n ? r === o : "!=" === n ? r !== o : "^=" === n ? o && 0 === r.indexOf(o) : "*=" === n ? o && r.indexOf(o) > -1 : "$=" === n ? o && r.slice(-o.length) === o : "~=" === n ? (" " + r.replace(ie, " ") + " ").indexOf(o) > -1 : "|=" === n && (r === o || r.slice(0, o.length + 1) === o + "-"))
                    }
                },
                CHILD: function(e, t, n, o, i) {
                    var r = "nth" !== e.slice(0, 3),
                        s = "last" !== e.slice(-4),
                        a = "of-type" === t;
                    return 1 === o && 0 === i ? function(e) {
                        return !!e.parentNode
                    } : function(t, n, l) {
                        var c, u, d, f, m, _, p = r !== s ? "nextSibling" : "previousSibling",
                            h = t.parentNode,
                            g = a && t.nodeName.toLowerCase(),
                            y = !l && !a,
                            w = !1;
                        if (h) {
                            if (r) {
                                for (; p;) {
                                    for (f = t; f = f[p];)
                                        if (a ? f.nodeName.toLowerCase() === g : 1 === f.nodeType) return !1;
                                    _ = p = "only" === e && !_ && "nextSibling"
                                }
                                return !0
                            }
                            if (_ = [s ? h.firstChild : h.lastChild], s && y) {
                                for (f = h, d = f[M] || (f[M] = {}), u = d[f.uniqueID] || (d[f.uniqueID] = {}), c = u[e] || [], m = c[0] === F && c[1], w = m && c[2], f = m && h.childNodes[m]; f = ++m && f && f[p] || (w = m = 0) || _.pop();)
                                    if (1 === f.nodeType && ++w && f === t) {
                                        u[e] = [F, m, w];
                                        break
                                    }
                            } else if (y && (f = t, d = f[M] || (f[M] = {}), u = d[f.uniqueID] || (d[f.uniqueID] = {}), c = u[e] || [], m = c[0] === F && c[1], w = m), w === !1)
                                for (;
                                    (f = ++m && f && f[p] || (w = m = 0) || _.pop()) && ((a ? f.nodeName.toLowerCase() !== g : 1 !== f.nodeType) || !++w || (y && (d = f[M] || (f[M] = {}), u = d[f.uniqueID] || (d[f.uniqueID] = {}), u[e] = [F, w]), f !== t)););
                            return (w -= i) === o || w % o == 0 && w / o >= 0
                        }
                    }
                },
                PSEUDO: function(e, n) {
                    var i, r = v.pseudos[e] || v.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                    return r[M] ? r(n) : r.length > 1 ? (i = [e, e, "", n], v.setFilters.hasOwnProperty(e.toLowerCase()) ? o(function(e, t) {
                        for (var o, i = r(e, n), s = i.length; s--;) o = J(e, i[s]), e[o] = !(t[o] = i[s])
                    }) : function(e) {
                        return r(e, 0, i)
                    }) : r
                }
            },
            pseudos: {
                not: o(function(e) {
                    var t = [],
                        n = [],
                        i = T(e.replace(re, "$1"));
                    return i[M] ? o(function(e, t, n, o) {
                        for (var r, s = i(e, null, o, []), a = e.length; a--;)(r = s[a]) && (e[a] = !(t[a] = r))
                    }) : function(e, o, r) {
                        return t[0] = e, i(t, null, r, n), t[0] = null, !n.pop()
                    }
                }),
                has: o(function(e) {
                    return function(n) {
                        return t(e, n).length > 0
                    }
                }),
                contains: o(function(e) {
                    return e = e.replace(ye, we),
                        function(t) {
                            return (t.textContent || t.innerText || b(t)).indexOf(e) > -1
                        }
                }),
                lang: o(function(e) {
                    return ue.test(e || "") || t.error("unsupported lang: " + e), e = e.replace(ye, we).toLowerCase(),
                        function(t) {
                            var n;
                            do
                                if (n = j ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return (n = n.toLowerCase()) === e || 0 === n.indexOf(e + "-");
                            while ((t = t.parentNode) && 1 === t.nodeType) return !1
                        }
                }),
                target: function(t) {
                    var n = e.location && e.location.hash;
                    return n && n.slice(1) === t.id
                },
                root: function(e) {
                    return e === I
                },
                focus: function(e) {
                    return e === C.activeElement && (!C.hasFocus || C.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                },
                enabled: function(e) {
                    return e.disabled === !1
                },
                disabled: function(e) {
                    return e.disabled === !0
                },
                checked: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && !!e.checked || "option" === t && !!e.selected
                },
                selected: function(e) {
                    return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
                },
                empty: function(e) {
                    for (e = e.firstChild; e; e = e.nextSibling)
                        if (e.nodeType < 6) return !1;
                    return !0
                },
                parent: function(e) {
                    return !v.pseudos.empty(e)
                },
                header: function(e) {
                    return me.test(e.nodeName)
                },
                input: function(e) {
                    return fe.test(e.nodeName)
                },
                button: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && "button" === e.type || "button" === t
                },
                text: function(e) {
                    var t;
                    return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                },
                first: a(function() {
                    return [0]
                }),
                last: a(function(e, t) {
                    return [t - 1]
                }),
                eq: a(function(e, t, n) {
                    return [n < 0 ? n + t : n]
                }),
                even: a(function(e, t) {
                    for (var n = 0; n < t; n += 2) e.push(n);
                    return e
                }),
                odd: a(function(e, t) {
                    for (var n = 1; n < t; n += 2) e.push(n);
                    return e
                }),
                lt: a(function(e, t, n) {
                    for (var o = n < 0 ? n + t : n; --o >= 0;) e.push(o);
                    return e
                }),
                gt: a(function(e, t, n) {
                    for (var o = n < 0 ? n + t : n; ++o < t;) e.push(o);
                    return e
                })
            }
        }, v.pseudos.nth = v.pseudos.eq;
        for (y in {
                radio: !0,
                checkbox: !0,
                file: !0,
                password: !0,
                image: !0
            }) v.pseudos[y] = function(e) {
            return function(t) {
                return "input" === t.nodeName.toLowerCase() && t.type === e
            }
        }(y);
        for (y in {
                submit: !0,
                reset: !0
            }) v.pseudos[y] = function(e) {
            return function(t) {
                var n = t.nodeName.toLowerCase();
                return ("input" === n || "button" === n) && t.type === e
            }
        }(y);
        return c.prototype = v.filters = v.pseudos, v.setFilters = new c, x = t.tokenize = function(e, n) {
            var o, i, r, s, a, l, c, u = W[e + " "];
            if (u) return n ? 0 : u.slice(0);
            for (a = e, l = [], c = v.preFilter; a;) {
                o && !(i = se.exec(a)) || (i && (a = a.slice(i[0].length) || a), l.push(r = [])), o = !1, (i = ae.exec(a)) && (o = i.shift(), r.push({
                    value: o,
                    type: i[0].replace(re, " ")
                }), a = a.slice(o.length));
                for (s in v.filter) !(i = de[s].exec(a)) || c[s] && !(i = c[s](i)) || (o = i.shift(), r.push({
                    value: o,
                    type: s,
                    matches: i
                }), a = a.slice(o.length));
                if (!o) break
            }
            return n ? a.length : a ? t.error(e) : W(e, l).slice(0)
        }, T = t.compile = function(e, t) {
            var n, o = [],
                i = [],
                r = z[e + " "];
            if (!r) {
                for (t || (t = x(e)), n = t.length; n--;) r = h(t[n]), r[M] ? o.push(r) : i.push(r);
                r = z(e, g(i, o)), r.selector = e
            }
            return r
        }, k = t.select = function(e, t, n, o) {
            var i, r, s, a, c, d = "function" == typeof e && e,
                f = !o && x(e = d.selector || e);
            if (n = n || [], 1 === f.length) {
                if (r = f[0] = f[0].slice(0), r.length > 2 && "ID" === (s = r[0]).type && w.getById && 9 === t.nodeType && j && v.relative[r[1].type]) {
                    if (!(t = (v.find.ID(s.matches[0].replace(ye, we), t) || [])[0])) return n;
                    d && (t = t.parentNode), e = e.slice(r.shift().value.length)
                }
                for (i = de.needsContext.test(e) ? 0 : r.length; i-- && (s = r[i], !v.relative[a = s.type]);)
                    if ((c = v.find[a]) && (o = c(s.matches[0].replace(ye, we), he.test(r[0].type) && l(t.parentNode) || t))) {
                        if (r.splice(i, 1), !(e = o.length && u(r))) return K.apply(n, o), n;
                        break
                    }
            }
            return (d || T(e, f))(o, t, !j, n, !t || he.test(e) && l(t.parentNode) || t), n
        }, w.sortStable = M.split("").sort(X).join("") === M, w.detectDuplicates = !!D, N(), w.sortDetached = i(function(e) {
            return 1 & e.compareDocumentPosition(C.createElement("div"))
        }), i(function(e) {
            return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
        }) || r("type|href|height|width", function(e, t, n) {
            if (!n) return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }), w.attributes && i(function(e) {
            return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
        }) || r("value", function(e, t, n) {
            if (!n && "input" === e.nodeName.toLowerCase()) return e.defaultValue
        }), i(function(e) {
            return null == e.getAttribute("disabled")
        }) || r(Z, function(e, t, n) {
            var o;
            if (!n) return e[t] === !0 ? t.toLowerCase() : (o = e.getAttributeNode(t)) && o.specified ? o.value : null
        }), t
    }(e);
    fe.find = _e, fe.expr = _e.selectors, fe.expr[":"] = fe.expr.pseudos, fe.uniqueSort = fe.unique = _e.uniqueSort, fe.text = _e.getText, fe.isXMLDoc = _e.isXML, fe.contains = _e.contains;
    var pe = function(e, t, n) {
            for (var o = [], i = void 0 !== n;
                (e = e[t]) && 9 !== e.nodeType;)
                if (1 === e.nodeType) {
                    if (i && fe(e).is(n)) break;
                    o.push(e)
                }
            return o
        },
        he = function(e, t) {
            for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
            return n
        },
        ge = fe.expr.match.needsContext,
        ye = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,
        we = /^.[^:#\[\.,]*$/;
    fe.filter = function(e, t, n) {
        var o = t[0];
        return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === o.nodeType ? fe.find.matchesSelector(o, e) ? [o] : [] : fe.find.matches(e, fe.grep(t, function(e) {
            return 1 === e.nodeType
        }))
    }, fe.fn.extend({
        find: function(e) {
            var t, n = [],
                o = this,
                i = o.length;
            if ("string" != typeof e) return this.pushStack(fe(e).filter(function() {
                for (t = 0; t < i; t++)
                    if (fe.contains(o[t], this)) return !0
            }));
            for (t = 0; t < i; t++) fe.find(e, o[t], n);
            return n = this.pushStack(i > 1 ? fe.unique(n) : n), n.selector = this.selector ? this.selector + " " + e : e, n
        },
        filter: function(e) {
            return this.pushStack(o(this, e || [], !1))
        },
        not: function(e) {
            return this.pushStack(o(this, e || [], !0))
        },
        is: function(e) {
            return !!o(this, "string" == typeof e && ge.test(e) ? fe(e) : e || [], !1).length
        }
    });
    var ve, be = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
    (fe.fn.init = function(e, t, n) {
        var o, i;
        if (!e) return this;
        if (n = n || ve, "string" == typeof e) {
            if (!(o = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && e.length >= 3 ? [null, e, null] : be.exec(e)) || !o[1] && t) return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
            if (o[1]) {
                if (t = t instanceof fe ? t[0] : t, fe.merge(this, fe.parseHTML(o[1], t && t.nodeType ? t.ownerDocument || t : oe, !0)), ye.test(o[1]) && fe.isPlainObject(t))
                    for (o in t) fe.isFunction(this[o]) ? this[o](t[o]) : this.attr(o, t[o]);
                return this
            }
            if ((i = oe.getElementById(o[2])) && i.parentNode) {
                if (i.id !== o[2]) return ve.find(e);
                this.length = 1, this[0] = i
            }
            return this.context = oe, this.selector = e, this
        }
        return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : fe.isFunction(e) ? void 0 !== n.ready ? n.ready(e) : e(fe) : (void 0 !== e.selector && (this.selector = e.selector, this.context = e.context), fe.makeArray(e, this))
    }).prototype = fe.fn, ve = fe(oe);
    var Ee = /^(?:parents|prev(?:Until|All))/,
        xe = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    fe.fn.extend({
        has: function(e) {
            var t, n = fe(e, this),
                o = n.length;
            return this.filter(function() {
                for (t = 0; t < o; t++)
                    if (fe.contains(this, n[t])) return !0
            })
        },
        closest: function(e, t) {
            for (var n, o = 0, i = this.length, r = [], s = ge.test(e) || "string" != typeof e ? fe(e, t || this.context) : 0; o < i; o++)
                for (n = this[o]; n && n !== t; n = n.parentNode)
                    if (n.nodeType < 11 && (s ? s.index(n) > -1 : 1 === n.nodeType && fe.find.matchesSelector(n, e))) {
                        r.push(n);
                        break
                    }
            return this.pushStack(r.length > 1 ? fe.uniqueSort(r) : r)
        },
        index: function(e) {
            return e ? "string" == typeof e ? fe.inArray(this[0], fe(e)) : fe.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            return this.pushStack(fe.uniqueSort(fe.merge(this.get(), fe(e, t))))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }), fe.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function(e) {
            return pe(e, "parentNode")
        },
        parentsUntil: function(e, t, n) {
            return pe(e, "parentNode", n)
        },
        next: function(e) {
            return i(e, "nextSibling")
        },
        prev: function(e) {
            return i(e, "previousSibling")
        },
        nextAll: function(e) {
            return pe(e, "nextSibling")
        },
        prevAll: function(e) {
            return pe(e, "previousSibling")
        },
        nextUntil: function(e, t, n) {
            return pe(e, "nextSibling", n)
        },
        prevUntil: function(e, t, n) {
            return pe(e, "previousSibling", n)
        },
        siblings: function(e) {
            return he((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return he(e.firstChild)
        },
        contents: function(e) {
            return fe.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : fe.merge([], e.childNodes)
        }
    }, function(e, t) {
        fe.fn[e] = function(n, o) {
            var i = fe.map(this, t, n);
            return "Until" !== e.slice(-5) && (o = n), o && "string" == typeof o && (i = fe.filter(o, i)), this.length > 1 && (xe[e] || (i = fe.uniqueSort(i)), Ee.test(e) && (i = i.reverse())), this.pushStack(i)
        }
    });
    var Te = /\S+/g;
    fe.Callbacks = function(e) {
        e = "string" == typeof e ? r(e) : fe.extend({}, e);
        var t, n, o, i, s = [],
            a = [],
            l = -1,
            c = function() {
                for (i = e.once, o = t = !0; a.length; l = -1)
                    for (n = a.shift(); ++l < s.length;) s[l].apply(n[0], n[1]) === !1 && e.stopOnFalse && (l = s.length, n = !1);
                e.memory || (n = !1), t = !1, i && (s = n ? [] : "")
            },
            u = {
                add: function() {
                    return s && (n && !t && (l = s.length - 1, a.push(n)), function t(n) {
                        fe.each(n, function(n, o) {
                            fe.isFunction(o) ? e.unique && u.has(o) || s.push(o) : o && o.length && "string" !== fe.type(o) && t(o)
                        })
                    }(arguments), n && !t && c()), this
                },
                remove: function() {
                    return fe.each(arguments, function(e, t) {
                        for (var n;
                            (n = fe.inArray(t, s, n)) > -1;) s.splice(n, 1), n <= l && l--
                    }), this
                },
                has: function(e) {
                    return e ? fe.inArray(e, s) > -1 : s.length > 0
                },
                empty: function() {
                    return s && (s = []), this
                },
                disable: function() {
                    return i = a = [], s = n = "", this
                },
                disabled: function() {
                    return !s
                },
                lock: function() {
                    return i = !0, n || u.disable(), this
                },
                locked: function() {
                    return !!i
                },
                fireWith: function(e, n) {
                    return i || (n = n || [], n = [e, n.slice ? n.slice() : n], a.push(n), t || c()), this
                },
                fire: function() {
                    return u.fireWith(this, arguments), this
                },
                fired: function() {
                    return !!o
                }
            };
        return u
    }, fe.extend({
        Deferred: function(e) {
            var t = [
                    ["resolve", "done", fe.Callbacks("once memory"), "resolved"],
                    ["reject", "fail", fe.Callbacks("once memory"), "rejected"],
                    ["notify", "progress", fe.Callbacks("memory")]
                ],
                n = "pending",
                o = {
                    state: function() {
                        return n
                    },
                    always: function() {
                        return i.done(arguments).fail(arguments), this
                    },
                    then: function() {
                        var e = arguments;
                        return fe.Deferred(function(n) {
                            fe.each(t, function(t, r) {
                                var s = fe.isFunction(e[t]) && e[t];
                                i[r[1]](function() {
                                    var e = s && s.apply(this, arguments);
                                    e && fe.isFunction(e.promise) ? e.promise().progress(n.notify).done(n.resolve).fail(n.reject) : n[r[0] + "With"](this === o ? n.promise() : this, s ? [e] : arguments)
                                })
                            }), e = null
                        }).promise()
                    },
                    promise: function(e) {
                        return null != e ? fe.extend(e, o) : o
                    }
                },
                i = {};
            return o.pipe = o.then, fe.each(t, function(e, r) {
                var s = r[2],
                    a = r[3];
                o[r[1]] = s.add, a && s.add(function() {
                    n = a
                }, t[1 ^ e][2].disable, t[2][2].lock), i[r[0]] = function() {
                    return i[r[0] + "With"](this === i ? o : this, arguments), this
                }, i[r[0] + "With"] = s.fireWith
            }), o.promise(i), e && e.call(i, i), i
        },
        when: function(e) {
            var t, n, o, i = 0,
                r = ie.call(arguments),
                s = r.length,
                a = 1 !== s || e && fe.isFunction(e.promise) ? s : 0,
                l = 1 === a ? e : fe.Deferred(),
                c = function(e, n, o) {
                    return function(i) {
                        n[e] = this, o[e] = arguments.length > 1 ? ie.call(arguments) : i, o === t ? l.notifyWith(n, o) : --a || l.resolveWith(n, o)
                    }
                };
            if (s > 1)
                for (t = new Array(s), n = new Array(s), o = new Array(s); i < s; i++) r[i] && fe.isFunction(r[i].promise) ? r[i].promise().progress(c(i, n, t)).done(c(i, o, r)).fail(l.reject) : --a;
            return a || l.resolveWith(o, r), l.promise()
        }
    });
    var ke;
    fe.fn.ready = function(e) {
        return fe.ready.promise().done(e), this
    }, fe.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function(e) {
            e ? fe.readyWait++ : fe.ready(!0)
        },
        ready: function(e) {
            (e === !0 ? --fe.readyWait : fe.isReady) || (fe.isReady = !0, e !== !0 && --fe.readyWait > 0 || (ke.resolveWith(oe, [fe]), fe.fn.triggerHandler && (fe(oe).triggerHandler("ready"), fe(oe).off("ready"))))
        }
    }), fe.ready.promise = function(t) {
        if (!ke)
            if (ke = fe.Deferred(), "complete" === oe.readyState || "loading" !== oe.readyState && !oe.documentElement.doScroll) e.setTimeout(fe.ready);
            else if (oe.addEventListener) oe.addEventListener("DOMContentLoaded", a), e.addEventListener("load", a);
        else {
            oe.attachEvent("onreadystatechange", a), e.attachEvent("onload", a);
            var n = !1;
            try {
                n = null == e.frameElement && oe.documentElement
            } catch (e) {}
            n && n.doScroll && function t() {
                if (!fe.isReady) {
                    try {
                        n.doScroll("left")
                    } catch (n) {
                        return e.setTimeout(t, 50)
                    }
                    s(), fe.ready()
                }
            }()
        }
        return ke.promise(t)
    }, fe.ready.promise();
    var Se;
    for (Se in fe(de)) break;
    de.ownFirst = "0" === Se, de.inlineBlockNeedsLayout = !1, fe(function() {
            var e, t, n, o;
            (n = oe.getElementsByTagName("body")[0]) && n.style && (t = oe.createElement("div"), o = oe.createElement("div"), o.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(o).appendChild(t), void 0 !== t.style.zoom && (t.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", de.inlineBlockNeedsLayout = e = 3 === t.offsetWidth, e && (n.style.zoom = 1)), n.removeChild(o))
        }),
        function() {
            var e = oe.createElement("div");
            de.deleteExpando = !0;
            try {
                delete e.test
            } catch (e) {
                de.deleteExpando = !1
            }
            e = null
        }();
    var qe = function(e) {
            var t = fe.noData[(e.nodeName + " ").toLowerCase()],
                n = +e.nodeType || 1;
            return (1 === n || 9 === n) && (!t || t !== !0 && e.getAttribute("classid") === t)
        },
        De = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        Ne = /([A-Z])/g;
    fe.extend({
            cache: {},
            noData: {
                "applet ": !0,
                "embed ": !0,
                "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
            },
            hasData: function(e) {
                return !!(e = e.nodeType ? fe.cache[e[fe.expando]] : e[fe.expando]) && !c(e)
            },
            data: function(e, t, n) {
                return u(e, t, n)
            },
            removeData: function(e, t) {
                return d(e, t)
            },
            _data: function(e, t, n) {
                return u(e, t, n, !0)
            },
            _removeData: function(e, t) {
                return d(e, t, !0)
            }
        }), fe.fn.extend({
            data: function(e, t) {
                var n, o, i, r = this[0],
                    s = r && r.attributes;
                if (void 0 === e) {
                    if (this.length && (i = fe.data(r), 1 === r.nodeType && !fe._data(r, "parsedAttrs"))) {
                        for (n = s.length; n--;) s[n] && (o = s[n].name, 0 === o.indexOf("data-") && (o = fe.camelCase(o.slice(5)), l(r, o, i[o])));
                        fe._data(r, "parsedAttrs", !0)
                    }
                    return i
                }
                return "object" == typeof e ? this.each(function() {
                    fe.data(this, e)
                }) : arguments.length > 1 ? this.each(function() {
                    fe.data(this, e, t)
                }) : r ? l(r, e, fe.data(r, e)) : void 0
            },
            removeData: function(e) {
                return this.each(function() {
                    fe.removeData(this, e)
                })
            }
        }), fe.extend({
            queue: function(e, t, n) {
                var o;
                if (e) return t = (t || "fx") + "queue", o = fe._data(e, t), n && (!o || fe.isArray(n) ? o = fe._data(e, t, fe.makeArray(n)) : o.push(n)), o || []
            },
            dequeue: function(e, t) {
                t = t || "fx";
                var n = fe.queue(e, t),
                    o = n.length,
                    i = n.shift(),
                    r = fe._queueHooks(e, t),
                    s = function() {
                        fe.dequeue(e, t)
                    };
                "inprogress" === i && (i = n.shift(), o--), i && ("fx" === t && n.unshift("inprogress"), delete r.stop, i.call(e, s, r)), !o && r && r.empty.fire()
            },
            _queueHooks: function(e, t) {
                var n = t + "queueHooks";
                return fe._data(e, n) || fe._data(e, n, {
                    empty: fe.Callbacks("once memory").add(function() {
                        fe._removeData(e, t + "queue"), fe._removeData(e, n)
                    })
                })
            }
        }), fe.fn.extend({
            queue: function(e, t) {
                var n = 2;
                return "string" != typeof e && (t = e, e = "fx", n--), arguments.length < n ? fe.queue(this[0], e) : void 0 === t ? this : this.each(function() {
                    var n = fe.queue(this, e, t);
                    fe._queueHooks(this, e), "fx" === e && "inprogress" !== n[0] && fe.dequeue(this, e)
                })
            },
            dequeue: function(e) {
                return this.each(function() {
                    fe.dequeue(this, e)
                })
            },
            clearQueue: function(e) {
                return this.queue(e || "fx", [])
            },
            promise: function(e, t) {
                var n, o = 1,
                    i = fe.Deferred(),
                    r = this,
                    s = this.length,
                    a = function() {
                        --o || i.resolveWith(r, [r])
                    };
                for ("string" != typeof e && (t = e, e = void 0), e = e || "fx"; s--;)(n = fe._data(r[s], e + "queueHooks")) && n.empty && (o++, n.empty.add(a));
                return a(), i.promise(t)
            }
        }),
        function() {
            var e;
            de.shrinkWrapBlocks = function() {
                if (null != e) return e;
                e = !1;
                var t, n, o;
                return (n = oe.getElementsByTagName("body")[0]) && n.style ? (t = oe.createElement("div"), o = oe.createElement("div"), o.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(o).appendChild(t), void 0 !== t.style.zoom && (t.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", t.appendChild(oe.createElement("div")).style.width = "5px", e = 3 !== t.offsetWidth), n.removeChild(o), e) : void 0
            }
        }();
    var Ce = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        Ie = new RegExp("^(?:([+-])=|)(" + Ce + ")([a-z%]*)$", "i"),
        je = ["Top", "Right", "Bottom", "Left"],
        Re = function(e, t) {
            return e = t || e, "none" === fe.css(e, "display") || !fe.contains(e.ownerDocument, e)
        },
        Ae = function(e, t, n, o, i, r, s) {
            var a = 0,
                l = e.length,
                c = null == n;
            if ("object" === fe.type(n)) {
                i = !0;
                for (a in n) Ae(e, t, a, n[a], !0, r, s)
            } else if (void 0 !== o && (i = !0, fe.isFunction(o) || (s = !0), c && (s ? (t.call(e, o), t = null) : (c = t, t = function(e, t, n) {
                    return c.call(fe(e), n)
                })), t))
                for (; a < l; a++) t(e[a], n, s ? o : o.call(e[a], a, t(e[a], n)));
            return i ? e : c ? t.call(e) : l ? t(e[0], n) : r
        },
        Le = /^(?:checkbox|radio)$/i,
        Oe = /<([\w:-]+)/,
        Me = /^$|\/(?:java|ecma)script/i,
        He = /^\s+/,
        Fe = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|dialog|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|picture|progress|section|summary|template|time|video";
    ! function() {
        var e = oe.createElement("div"),
            t = oe.createDocumentFragment(),
            n = oe.createElement("input");
        e.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", de.leadingWhitespace = 3 === e.firstChild.nodeType, de.tbody = !e.getElementsByTagName("tbody").length, de.htmlSerialize = !!e.getElementsByTagName("link").length, de.html5Clone = "<:nav></:nav>" !== oe.createElement("nav").cloneNode(!0).outerHTML, n.type = "checkbox", n.checked = !0, t.appendChild(n), de.appendChecked = n.checked, e.innerHTML = "<textarea>x</textarea>", de.noCloneChecked = !!e.cloneNode(!0).lastChild.defaultValue, t.appendChild(e), n = oe.createElement("input"), n.setAttribute("type", "radio"), n.setAttribute("checked", "checked"), n.setAttribute("name", "t"), e.appendChild(n), de.checkClone = e.cloneNode(!0).cloneNode(!0).lastChild.checked, de.noCloneEvent = !!e.addEventListener, e[fe.expando] = 1, de.attributes = !e.getAttribute(fe.expando)
    }();
    var Pe = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        legend: [1, "<fieldset>", "</fieldset>"],
        area: [1, "<map>", "</map>"],
        param: [1, "<object>", "</object>"],
        thead: [1, "<table>", "</table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: de.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
    };
    Pe.optgroup = Pe.option, Pe.tbody = Pe.tfoot = Pe.colgroup = Pe.caption = Pe.thead, Pe.th = Pe.td;
    var Be = /<|&#?\w+;/,
        We = /<tbody/i;
    ! function() {
        var t, n, o = oe.createElement("div");
        for (t in {
                submit: !0,
                change: !0,
                focusin: !0
            }) n = "on" + t, (de[t] = n in e) || (o.setAttribute(n, "t"), de[t] = o.attributes[n].expando === !1);
        o = null
    }();
    var ze = /^(?:input|select|textarea)$/i,
        Xe = /^key/,
        Ue = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
        Ge = /^(?:focusinfocus|focusoutblur)$/,
        $e = /^([^.]*)(?:\.(.+)|)/;
    fe.event = {
        global: {},
        add: function(e, t, n, o, i) {
            var r, s, a, l, c, u, d, f, m, _, p, h = fe._data(e);
            if (h) {
                for (n.handler && (l = n, n = l.handler, i = l.selector), n.guid || (n.guid = fe.guid++), (s = h.events) || (s = h.events = {}), (u = h.handle) || (u = h.handle = function(e) {
                        return void 0 === fe || e && fe.event.triggered === e.type ? void 0 : fe.event.dispatch.apply(u.elem, arguments)
                    }, u.elem = e), t = (t || "").match(Te) || [""], a = t.length; a--;) r = $e.exec(t[a]) || [], m = p = r[1], _ = (r[2] || "").split(".").sort(), m && (c = fe.event.special[m] || {}, m = (i ? c.delegateType : c.bindType) || m, c = fe.event.special[m] || {}, d = fe.extend({
                    type: m,
                    origType: p,
                    data: o,
                    handler: n,
                    guid: n.guid,
                    selector: i,
                    needsContext: i && fe.expr.match.needsContext.test(i),
                    namespace: _.join(".")
                }, l), (f = s[m]) || (f = s[m] = [], f.delegateCount = 0, c.setup && c.setup.call(e, o, _, u) !== !1 || (e.addEventListener ? e.addEventListener(m, u, !1) : e.attachEvent && e.attachEvent("on" + m, u))), c.add && (c.add.call(e, d), d.handler.guid || (d.handler.guid = n.guid)), i ? f.splice(f.delegateCount++, 0, d) : f.push(d), fe.event.global[m] = !0);
                e = null
            }
        },
        remove: function(e, t, n, o, i) {
            var r, s, a, l, c, u, d, f, m, _, p, h = fe.hasData(e) && fe._data(e);
            if (h && (u = h.events)) {
                for (t = (t || "").match(Te) || [""], c = t.length; c--;)
                    if (a = $e.exec(t[c]) || [], m = p = a[1], _ = (a[2] || "").split(".").sort(), m) {
                        for (d = fe.event.special[m] || {}, m = (o ? d.delegateType : d.bindType) || m, f = u[m] || [], a = a[2] && new RegExp("(^|\\.)" + _.join("\\.(?:.*\\.|)") + "(\\.|$)"), l = r = f.length; r--;) s = f[r], !i && p !== s.origType || n && n.guid !== s.guid || a && !a.test(s.namespace) || o && o !== s.selector && ("**" !== o || !s.selector) || (f.splice(r, 1), s.selector && f.delegateCount--, d.remove && d.remove.call(e, s));
                        l && !f.length && (d.teardown && d.teardown.call(e, _, h.handle) !== !1 || fe.removeEvent(e, m, h.handle), delete u[m])
                    } else
                        for (m in u) fe.event.remove(e, m + t[c], n, o, !0);
                fe.isEmptyObject(u) && (delete h.handle, fe._removeData(e, "events"))
            }
        },
        trigger: function(t, n, o, i) {
            var r, s, a, l, c, u, d, f = [o || oe],
                m = ue.call(t, "type") ? t.type : t,
                _ = ue.call(t, "namespace") ? t.namespace.split(".") : [];
            if (a = u = o = o || oe, 3 !== o.nodeType && 8 !== o.nodeType && !Ge.test(m + fe.event.triggered) && (m.indexOf(".") > -1 && (_ = m.split("."), m = _.shift(), _.sort()), s = m.indexOf(":") < 0 && "on" + m, t = t[fe.expando] ? t : new fe.Event(m, "object" == typeof t && t), t.isTrigger = i ? 2 : 3, t.namespace = _.join("."), t.rnamespace = t.namespace ? new RegExp("(^|\\.)" + _.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = void 0, t.target || (t.target = o), n = null == n ? [t] : fe.makeArray(n, [t]), c = fe.event.special[m] || {}, i || !c.trigger || c.trigger.apply(o, n) !== !1)) {
                if (!i && !c.noBubble && !fe.isWindow(o)) {
                    for (l = c.delegateType || m, Ge.test(l + m) || (a = a.parentNode); a; a = a.parentNode) f.push(a), u = a;
                    u === (o.ownerDocument || oe) && f.push(u.defaultView || u.parentWindow || e)
                }
                for (d = 0;
                    (a = f[d++]) && !t.isPropagationStopped();) t.type = d > 1 ? l : c.bindType || m, r = (fe._data(a, "events") || {})[t.type] && fe._data(a, "handle"), r && r.apply(a, n), (r = s && a[s]) && r.apply && qe(a) && (t.result = r.apply(a, n), t.result === !1 && t.preventDefault());
                if (t.type = m, !i && !t.isDefaultPrevented() && (!c._default || c._default.apply(f.pop(), n) === !1) && qe(o) && s && o[m] && !fe.isWindow(o)) {
                    u = o[s], u && (o[s] = null), fe.event.triggered = m;
                    try {
                        o[m]()
                    } catch (e) {}
                    fe.event.triggered = void 0, u && (o[s] = u)
                }
                return t.result
            }
        },
        dispatch: function(e) {
            e = fe.event.fix(e);
            var t, n, o, i, r, s = [],
                a = ie.call(arguments),
                l = (fe._data(this, "events") || {})[e.type] || [],
                c = fe.event.special[e.type] || {};
            if (a[0] = e, e.delegateTarget = this, !c.preDispatch || c.preDispatch.call(this, e) !== !1) {
                for (s = fe.event.handlers.call(this, e, l), t = 0;
                    (i = s[t++]) && !e.isPropagationStopped();)
                    for (e.currentTarget = i.elem, n = 0;
                        (r = i.handlers[n++]) && !e.isImmediatePropagationStopped();) e.rnamespace && !e.rnamespace.test(r.namespace) || (e.handleObj = r, e.data = r.data, void 0 !== (o = ((fe.event.special[r.origType] || {}).handle || r.handler).apply(i.elem, a)) && (e.result = o) === !1 && (e.preventDefault(), e.stopPropagation()));
                return c.postDispatch && c.postDispatch.call(this, e), e.result
            }
        },
        handlers: function(e, t) {
            var n, o, i, r, s = [],
                a = t.delegateCount,
                l = e.target;
            if (a && l.nodeType && ("click" !== e.type || isNaN(e.button) || e.button < 1))
                for (; l != this; l = l.parentNode || this)
                    if (1 === l.nodeType && (l.disabled !== !0 || "click" !== e.type)) {
                        for (o = [], n = 0; n < a; n++) r = t[n], i = r.selector + " ", void 0 === o[i] && (o[i] = r.needsContext ? fe(i, this).index(l) > -1 : fe.find(i, this, null, [l]).length), o[i] && o.push(r);
                        o.length && s.push({
                            elem: l,
                            handlers: o
                        })
                    }
            return a < t.length && s.push({
                elem: this,
                handlers: t.slice(a)
            }), s
        },
        fix: function(e) {
            if (e[fe.expando]) return e;
            var t, n, o, i = e.type,
                r = e,
                s = this.fixHooks[i];
            for (s || (this.fixHooks[i] = s = Ue.test(i) ? this.mouseHooks : Xe.test(i) ? this.keyHooks : {}), o = s.props ? this.props.concat(s.props) : this.props, e = new fe.Event(r), t = o.length; t--;) n = o[t], e[n] = r[n];
            return e.target || (e.target = r.srcElement || oe), 3 === e.target.nodeType && (e.target = e.target.parentNode), e.metaKey = !!e.metaKey, s.filter ? s.filter(e, r) : e
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(e, t) {
                return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(e, t) {
                var n, o, i, r = t.button,
                    s = t.fromElement;
                return null == e.pageX && null != t.clientX && (o = e.target.ownerDocument || oe, i = o.documentElement, n = o.body, e.pageX = t.clientX + (i && i.scrollLeft || n && n.scrollLeft || 0) - (i && i.clientLeft || n && n.clientLeft || 0), e.pageY = t.clientY + (i && i.scrollTop || n && n.scrollTop || 0) - (i && i.clientTop || n && n.clientTop || 0)), !e.relatedTarget && s && (e.relatedTarget = s === e.target ? t.toElement : s), e.which || void 0 === r || (e.which = 1 & r ? 1 : 2 & r ? 3 : 4 & r ? 2 : 0), e
            }
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== v() && this.focus) try {
                        return this.focus(), !1
                    } catch (e) {}
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    if (this === v() && this.blur) return this.blur(), !1
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    if (fe.nodeName(this, "input") && "checkbox" === this.type && this.click) return this.click(), !1
                },
                _default: function(e) {
                    return fe.nodeName(e.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        },
        simulate: function(e, t, n) {
            var o = fe.extend(new fe.Event, n, {
                type: e,
                isSimulated: !0
            });
            fe.event.trigger(o, null, t), o.isDefaultPrevented() && n.preventDefault()
        }
    }, fe.removeEvent = oe.removeEventListener ? function(e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n)
    } : function(e, t, n) {
        var o = "on" + t;
        e.detachEvent && (void 0 === e[o] && (e[o] = null), e.detachEvent(o, n))
    }, fe.Event = function(e, t) {
        if (!(this instanceof fe.Event)) return new fe.Event(e, t);
        e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && e.returnValue === !1 ? y : w) : this.type = e, t && fe.extend(this, t), this.timeStamp = e && e.timeStamp || fe.now(), this[fe.expando] = !0
    }, fe.Event.prototype = {
        constructor: fe.Event,
        isDefaultPrevented: w,
        isPropagationStopped: w,
        isImmediatePropagationStopped: w,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = y, e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1)
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = y, e && !this.isSimulated && (e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0)
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = y, e && e.stopImmediatePropagation && e.stopImmediatePropagation(), this.stopPropagation()
        }
    }, fe.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(e, t) {
        fe.event.special[e] = {
            delegateType: t,
            bindType: t,
            handle: function(e) {
                var n, o = this,
                    i = e.relatedTarget,
                    r = e.handleObj;
                return i && (i === o || fe.contains(o, i)) || (e.type = r.origType, n = r.handler.apply(this, arguments), e.type = t), n
            }
        }
    }), de.submit || (fe.event.special.submit = {
        setup: function() {
            if (fe.nodeName(this, "form")) return !1;
            fe.event.add(this, "click._submit keypress._submit", function(e) {
                var t = e.target,
                    n = fe.nodeName(t, "input") || fe.nodeName(t, "button") ? fe.prop(t, "form") : void 0;
                n && !fe._data(n, "submit") && (fe.event.add(n, "submit._submit", function(e) {
                    e._submitBubble = !0
                }), fe._data(n, "submit", !0))
            })
        },
        postDispatch: function(e) {
            e._submitBubble && (delete e._submitBubble, this.parentNode && !e.isTrigger && fe.event.simulate("submit", this.parentNode, e))
        },
        teardown: function() {
            if (fe.nodeName(this, "form")) return !1;
            fe.event.remove(this, "._submit")
        }
    }), de.change || (fe.event.special.change = {
        setup: function() {
            if (ze.test(this.nodeName)) return "checkbox" !== this.type && "radio" !== this.type || (fe.event.add(this, "propertychange._change", function(e) {
                "checked" === e.originalEvent.propertyName && (this._justChanged = !0)
            }), fe.event.add(this, "click._change", function(e) {
                this._justChanged && !e.isTrigger && (this._justChanged = !1), fe.event.simulate("change", this, e)
            })), !1;
            fe.event.add(this, "beforeactivate._change", function(e) {
                var t = e.target;
                ze.test(t.nodeName) && !fe._data(t, "change") && (fe.event.add(t, "change._change", function(e) {
                    !this.parentNode || e.isSimulated || e.isTrigger || fe.event.simulate("change", this.parentNode, e)
                }), fe._data(t, "change", !0))
            })
        },
        handle: function(e) {
            var t = e.target;
            if (this !== t || e.isSimulated || e.isTrigger || "radio" !== t.type && "checkbox" !== t.type) return e.handleObj.handler.apply(this, arguments)
        },
        teardown: function() {
            return fe.event.remove(this, "._change"), !ze.test(this.nodeName)
        }
    }), de.focusin || fe.each({
        focus: "focusin",
        blur: "focusout"
    }, function(e, t) {
        var n = function(e) {
            fe.event.simulate(t, e.target, fe.event.fix(e))
        };
        fe.event.special[t] = {
            setup: function() {
                var o = this.ownerDocument || this,
                    i = fe._data(o, t);
                i || o.addEventListener(e, n, !0), fe._data(o, t, (i || 0) + 1)
            },
            teardown: function() {
                var o = this.ownerDocument || this,
                    i = fe._data(o, t) - 1;
                i ? fe._data(o, t, i) : (o.removeEventListener(e, n, !0), fe._removeData(o, t))
            }
        }
    }), fe.fn.extend({
        on: function(e, t, n, o) {
            return b(this, e, t, n, o)
        },
        one: function(e, t, n, o) {
            return b(this, e, t, n, o, 1)
        },
        off: function(e, t, n) {
            var o, i;
            if (e && e.preventDefault && e.handleObj) return o = e.handleObj, fe(e.delegateTarget).off(o.namespace ? o.origType + "." + o.namespace : o.origType, o.selector, o.handler), this;
            if ("object" == typeof e) {
                for (i in e) this.off(i, t, e[i]);
                return this
            }
            return t !== !1 && "function" != typeof t || (n = t, t = void 0), n === !1 && (n = w), this.each(function() {
                fe.event.remove(this, e, n, t)
            })
        },
        trigger: function(e, t) {
            return this.each(function() {
                fe.event.trigger(e, t, this)
            })
        },
        triggerHandler: function(e, t) {
            var n = this[0];
            if (n) return fe.event.trigger(e, t, n, !0)
        }
    });
    var Ve = new RegExp("<(?:" + Fe + ")[\\s/>]", "i"),
        Ye = /<script|<style|<link/i,
        Ke = /checked\s*(?:[^=]|=\s*.checked.)/i,
        Qe = /^true\/(.*)/,
        Je = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
        Ze = m(oe),
        et = Ze.appendChild(oe.createElement("div"));
    fe.extend({
        htmlPrefilter: function(e) {
            return e.replace(/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi, "<$1></$2>")
        },
        clone: function(e, t, n) {
            var o, i, r, s, a, l = fe.contains(e.ownerDocument, e);
            if (de.html5Clone || fe.isXMLDoc(e) || !Ve.test("<" + e.nodeName + ">") ? r = e.cloneNode(!0) : (et.innerHTML = e.outerHTML, et.removeChild(r = et.firstChild)), !(de.noCloneEvent && de.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || fe.isXMLDoc(e)))
                for (o = _(r), a = _(e), s = 0; null != (i = a[s]); ++s) o[s] && S(i, o[s]);
            if (t)
                if (n)
                    for (a = a || _(e), o = o || _(r), s = 0; null != (i = a[s]); s++) k(i, o[s]);
                else k(e, r);
            return o = _(r, "script"), o.length > 0 && p(o, !l && _(e, "script")), o = a = i = null, r
        },
        cleanData: function(e, t) {
            for (var n, o, i, r, s = 0, a = fe.expando, l = fe.cache, c = de.attributes, u = fe.event.special; null != (n = e[s]); s++)
                if ((t || qe(n)) && (i = n[a], r = i && l[i])) {
                    if (r.events)
                        for (o in r.events) u[o] ? fe.event.remove(n, o) : fe.removeEvent(n, o, r.handle);
                    l[i] && (delete l[i], c || void 0 === n.removeAttribute ? n[a] = void 0 : n.removeAttribute(a), ne.push(i))
                }
        }
    }), fe.fn.extend({
        domManip: q,
        detach: function(e) {
            return D(this, e, !0)
        },
        remove: function(e) {
            return D(this, e)
        },
        text: function(e) {
            return Ae(this, function(e) {
                return void 0 === e ? fe.text(this) : this.empty().append((this[0] && this[0].ownerDocument || oe).createTextNode(e))
            }, null, e, arguments.length)
        },
        append: function() {
            return q(this, arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    E(this, e).appendChild(e)
                }
            })
        },
        prepend: function() {
            return q(this, arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = E(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            })
        },
        before: function() {
            return q(this, arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function() {
            return q(this, arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        empty: function() {
            for (var e, t = 0; null != (e = this[t]); t++) {
                for (1 === e.nodeType && fe.cleanData(_(e, !1)); e.firstChild;) e.removeChild(e.firstChild);
                e.options && fe.nodeName(e, "select") && (e.options.length = 0)
            }
            return this
        },
        clone: function(e, t) {
            return e = null != e && e, t = null == t ? e : t, this.map(function() {
                return fe.clone(this, e, t)
            })
        },
        html: function(e) {
            return Ae(this, function(e) {
                var t = this[0] || {},
                    n = 0,
                    o = this.length;
                if (void 0 === e) return 1 === t.nodeType ? t.innerHTML.replace(/ jQuery\d+="(?:null|\d+)"/g, "") : void 0;
                if ("string" == typeof e && !Ye.test(e) && (de.htmlSerialize || !Ve.test(e)) && (de.leadingWhitespace || !He.test(e)) && !Pe[(Oe.exec(e) || ["", ""])[1].toLowerCase()]) {
                    e = fe.htmlPrefilter(e);
                    try {
                        for (; n < o; n++) t = this[n] || {}, 1 === t.nodeType && (fe.cleanData(_(t, !1)), t.innerHTML = e);
                        t = 0
                    } catch (e) {}
                }
                t && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function() {
            var e = [];
            return q(this, arguments, function(t) {
                var n = this.parentNode;
                fe.inArray(this, e) < 0 && (fe.cleanData(_(this)), n && n.replaceChild(t, this))
            }, e)
        }
    }), fe.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(e, t) {
        fe.fn[e] = function(e) {
            for (var n, o = 0, i = [], r = fe(e), s = r.length - 1; o <= s; o++) n = o === s ? this : this.clone(!0), fe(r[o])[t](n), se.apply(i, n.get());
            return this.pushStack(i)
        }
    });
    var tt, nt = {
            HTML: "block",
            BODY: "block"
        },
        ot = /^margin/,
        it = new RegExp("^(" + Ce + ")(?!px)[a-z%]+$", "i"),
        rt = function(e, t, n, o) {
            var i, r, s = {};
            for (r in t) s[r] = e.style[r], e.style[r] = t[r];
            i = n.apply(e, o || []);
            for (r in t) e.style[r] = s[r];
            return i
        },
        st = oe.documentElement;
    ! function() {
        function t() {
            var t, u, d = oe.documentElement;
            d.appendChild(l), c.style.cssText = "-webkit-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%", n = i = a = !1, o = s = !0, e.getComputedStyle && (u = e.getComputedStyle(c), n = "1%" !== (u || {}).top, a = "2px" === (u || {}).marginLeft, i = "4px" === (u || {
                width: "4px"
            }).width, c.style.marginRight = "50%", o = "4px" === (u || {
                marginRight: "4px"
            }).marginRight, t = c.appendChild(oe.createElement("div")), t.style.cssText = c.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", t.style.marginRight = t.style.width = "0", c.style.width = "1px", s = !parseFloat((e.getComputedStyle(t) || {}).marginRight), c.removeChild(t)), c.style.display = "none", r = 0 === c.getClientRects().length, r && (c.style.display = "", c.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", t = c.getElementsByTagName("td"), t[0].style.cssText = "margin:0;border:0;padding:0;display:none", (r = 0 === t[0].offsetHeight) && (t[0].style.display = "", t[1].style.display = "none", r = 0 === t[0].offsetHeight)), d.removeChild(l)
        }
        var n, o, i, r, s, a, l = oe.createElement("div"),
            c = oe.createElement("div");
        c.style && (c.style.cssText = "float:left;opacity:.5", de.opacity = "0.5" === c.style.opacity, de.cssFloat = !!c.style.cssFloat, c.style.backgroundClip = "content-box", c.cloneNode(!0).style.backgroundClip = "", de.clearCloneStyle = "content-box" === c.style.backgroundClip, l = oe.createElement("div"), l.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute", c.innerHTML = "", l.appendChild(c), de.boxSizing = "" === c.style.boxSizing || "" === c.style.MozBoxSizing || "" === c.style.WebkitBoxSizing, fe.extend(de, {
            reliableHiddenOffsets: function() {
                return null == n && t(), r
            },
            boxSizingReliable: function() {
                return null == n && t(), i
            },
            pixelMarginRight: function() {
                return null == n && t(), o
            },
            pixelPosition: function() {
                return null == n && t(), n
            },
            reliableMarginRight: function() {
                return null == n && t(), s
            },
            reliableMarginLeft: function() {
                return null == n && t(), a
            }
        }))
    }();
    var at, lt, ct = /^(top|right|bottom|left)$/;
    e.getComputedStyle ? (at = function(t) {
        var n = t.ownerDocument.defaultView;
        return n && n.opener || (n = e), n.getComputedStyle(t)
    }, lt = function(e, t, n) {
        var o, i, r, s, a = e.style;
        return n = n || at(e), s = n ? n.getPropertyValue(t) || n[t] : void 0, "" !== s && void 0 !== s || fe.contains(e.ownerDocument, e) || (s = fe.style(e, t)), n && !de.pixelMarginRight() && it.test(s) && ot.test(t) && (o = a.width, i = a.minWidth, r = a.maxWidth, a.minWidth = a.maxWidth = a.width = s, s = n.width, a.width = o, a.minWidth = i, a.maxWidth = r), void 0 === s ? s : s + ""
    }) : st.currentStyle && (at = function(e) {
        return e.currentStyle
    }, lt = function(e, t, n) {
        var o, i, r, s, a = e.style;
        return n = n || at(e), s = n ? n[t] : void 0, null == s && a && a[t] && (s = a[t]), it.test(s) && !ct.test(t) && (o = a.left, i = e.runtimeStyle, r = i && i.left, r && (i.left = e.currentStyle.left), a.left = "fontSize" === t ? "1em" : s, s = a.pixelLeft + "px", a.left = o, r && (i.left = r)), void 0 === s ? s : s + "" || "auto"
    });
    var ut = /alpha\([^)]*\)/i,
        dt = /opacity\s*=\s*([^)]*)/i,
        ft = /^(none|table(?!-c[ea]).+)/,
        mt = new RegExp("^(" + Ce + ")(.*)$", "i"),
        _t = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        pt = {
            letterSpacing: "0",
            fontWeight: "400"
        },
        ht = ["Webkit", "O", "Moz", "ms"],
        gt = oe.createElement("div").style;
    fe.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = lt(e, "opacity");
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
            float: de.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(e, t, n, o) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var i, r, s, a = fe.camelCase(t),
                    l = e.style;
                if (t = fe.cssProps[a] || (fe.cssProps[a] = j(a) || a), s = fe.cssHooks[t] || fe.cssHooks[a], void 0 === n) return s && "get" in s && void 0 !== (i = s.get(e, !1, o)) ? i : l[t];
                if (r = typeof n, "string" === r && (i = Ie.exec(n)) && i[1] && (n = f(e, t, i), r = "number"), null != n && n === n && ("number" === r && (n += i && i[3] || (fe.cssNumber[a] ? "" : "px")), de.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"), !(s && "set" in s && void 0 === (n = s.set(e, n, o))))) try {
                    l[t] = n
                } catch (e) {}
            }
        },
        css: function(e, t, n, o) {
            var i, r, s, a = fe.camelCase(t);
            return t = fe.cssProps[a] || (fe.cssProps[a] = j(a) || a), s = fe.cssHooks[t] || fe.cssHooks[a], s && "get" in s && (r = s.get(e, !0, n)), void 0 === r && (r = lt(e, t, o)), "normal" === r && t in pt && (r = pt[t]), "" === n || n ? (i = parseFloat(r), n === !0 || isFinite(i) ? i || 0 : r) : r
        }
    }), fe.each(["height", "width"], function(e, t) {
        fe.cssHooks[t] = {
            get: function(e, n, o) {
                if (n) return ft.test(fe.css(e, "display")) && 0 === e.offsetWidth ? rt(e, _t, function() {
                    return O(e, t, o)
                }) : O(e, t, o)
            },
            set: function(e, n, o) {
                var i = o && at(e);
                return A(e, n, o ? L(e, t, o, de.boxSizing && "border-box" === fe.css(e, "boxSizing", !1, i), i) : 0)
            }
        }
    }), de.opacity || (fe.cssHooks.opacity = {
        get: function(e, t) {
            return dt.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
        },
        set: function(e, t) {
            var n = e.style,
                o = e.currentStyle,
                i = fe.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "",
                r = o && o.filter || n.filter || "";
            n.zoom = 1, (t >= 1 || "" === t) && "" === fe.trim(r.replace(ut, "")) && n.removeAttribute && (n.removeAttribute("filter"), "" === t || o && !o.filter) || (n.filter = ut.test(r) ? r.replace(ut, i) : r + " " + i)
        }
    }), fe.cssHooks.marginRight = I(de.reliableMarginRight, function(e, t) {
        if (t) return rt(e, {
            display: "inline-block"
        }, lt, [e, "marginRight"])
    }), fe.cssHooks.marginLeft = I(de.reliableMarginLeft, function(e, t) {
        if (t) return (parseFloat(lt(e, "marginLeft")) || (fe.contains(e.ownerDocument, e) ? e.getBoundingClientRect().left - rt(e, {
            marginLeft: 0
        }, function() {
            return e.getBoundingClientRect().left
        }) : 0)) + "px"
    }), fe.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(e, t) {
        fe.cssHooks[e + t] = {
            expand: function(n) {
                for (var o = 0, i = {}, r = "string" == typeof n ? n.split(" ") : [n]; o < 4; o++) i[e + je[o] + t] = r[o] || r[o - 2] || r[0];
                return i
            }
        }, ot.test(e) || (fe.cssHooks[e + t].set = A)
    }), fe.fn.extend({
        css: function(e, t) {
            return Ae(this, function(e, t, n) {
                var o, i, r = {},
                    s = 0;
                if (fe.isArray(t)) {
                    for (o = at(e), i = t.length; s < i; s++) r[t[s]] = fe.css(e, t[s], !1, o);
                    return r
                }
                return void 0 !== n ? fe.style(e, t, n) : fe.css(e, t)
            }, e, t, arguments.length > 1)
        },
        show: function() {
            return R(this, !0)
        },
        hide: function() {
            return R(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                Re(this) ? fe(this).show() : fe(this).hide()
            })
        }
    }), fe.Tween = M, M.prototype = {
        constructor: M,
        init: function(e, t, n, o, i, r) {
            this.elem = e, this.prop = n, this.easing = i || fe.easing._default, this.options = t, this.start = this.now = this.cur(), this.end = o, this.unit = r || (fe.cssNumber[n] ? "" : "px")
        },
        cur: function() {
            var e = M.propHooks[this.prop];
            return e && e.get ? e.get(this) : M.propHooks._default.get(this)
        },
        run: function(e) {
            var t, n = M.propHooks[this.prop];
            return this.options.duration ? this.pos = t = fe.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : M.propHooks._default.set(this), this
        }
    }, M.prototype.init.prototype = M.prototype, M.propHooks = {
        _default: {
            get: function(e) {
                var t;
                return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = fe.css(e.elem, e.prop, ""), t && "auto" !== t ? t : 0)
            },
            set: function(e) {
                fe.fx.step[e.prop] ? fe.fx.step[e.prop](e) : 1 !== e.elem.nodeType || null == e.elem.style[fe.cssProps[e.prop]] && !fe.cssHooks[e.prop] ? e.elem[e.prop] = e.now : fe.style(e.elem, e.prop, e.now + e.unit)
            }
        }
    }, M.propHooks.scrollTop = M.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    }, fe.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        },
        _default: "swing"
    }, fe.fx = M.prototype.init, fe.fx.step = {};
    var yt, wt, vt = /^(?:toggle|show|hide)$/,
        bt = /queueHooks$/;
    fe.Animation = fe.extend(z, {
            tweeners: {
                "*": [function(e, t) {
                    var n = this.createTween(e, t);
                    return f(n.elem, e, Ie.exec(t), n), n
                }]
            },
            tweener: function(e, t) {
                fe.isFunction(e) ? (t = e, e = ["*"]) : e = e.match(Te);
                for (var n, o = 0, i = e.length; o < i; o++) n = e[o], z.tweeners[n] = z.tweeners[n] || [], z.tweeners[n].unshift(t)
            },
            prefilters: [B],
            prefilter: function(e, t) {
                t ? z.prefilters.unshift(e) : z.prefilters.push(e)
            }
        }), fe.speed = function(e, t, n) {
            var o = e && "object" == typeof e ? fe.extend({}, e) : {
                complete: n || !n && t || fe.isFunction(e) && e,
                duration: e,
                easing: n && t || t && !fe.isFunction(t) && t
            };
            return o.duration = fe.fx.off ? 0 : "number" == typeof o.duration ? o.duration : o.duration in fe.fx.speeds ? fe.fx.speeds[o.duration] : fe.fx.speeds._default, null != o.queue && o.queue !== !0 || (o.queue = "fx"), o.old = o.complete, o.complete = function() {
                fe.isFunction(o.old) && o.old.call(this), o.queue && fe.dequeue(this, o.queue)
            }, o
        }, fe.fn.extend({
            fadeTo: function(e, t, n, o) {
                return this.filter(Re).css("opacity", 0).show().end().animate({
                    opacity: t
                }, e, n, o)
            },
            animate: function(e, t, n, o) {
                var i = fe.isEmptyObject(e),
                    r = fe.speed(t, n, o),
                    s = function() {
                        var t = z(this, fe.extend({}, e), r);
                        (i || fe._data(this, "finish")) && t.stop(!0)
                    };
                return s.finish = s, i || r.queue === !1 ? this.each(s) : this.queue(r.queue, s)
            },
            stop: function(e, t, n) {
                var o = function(e) {
                    var t = e.stop;
                    delete e.stop, t(n)
                };
                return "string" != typeof e && (n = t, t = e, e = void 0), t && e !== !1 && this.queue(e || "fx", []), this.each(function() {
                    var t = !0,
                        i = null != e && e + "queueHooks",
                        r = fe.timers,
                        s = fe._data(this);
                    if (i) s[i] && s[i].stop && o(s[i]);
                    else
                        for (i in s) s[i] && s[i].stop && bt.test(i) && o(s[i]);
                    for (i = r.length; i--;) r[i].elem !== this || null != e && r[i].queue !== e || (r[i].anim.stop(n), t = !1, r.splice(i, 1));
                    !t && n || fe.dequeue(this, e)
                })
            },
            finish: function(e) {
                return e !== !1 && (e = e || "fx"), this.each(function() {
                    var t, n = fe._data(this),
                        o = n[e + "queue"],
                        i = n[e + "queueHooks"],
                        r = fe.timers,
                        s = o ? o.length : 0;
                    for (n.finish = !0, fe.queue(this, e, []), i && i.stop && i.stop.call(this, !0), t = r.length; t--;) r[t].elem === this && r[t].queue === e && (r[t].anim.stop(!0), r.splice(t, 1));
                    for (t = 0; t < s; t++) o[t] && o[t].finish && o[t].finish.call(this);
                    delete n.finish
                })
            }
        }), fe.each(["toggle", "show", "hide"], function(e, t) {
            var n = fe.fn[t];
            fe.fn[t] = function(e, o, i) {
                return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(F(t, !0), e, o, i)
            }
        }), fe.each({
            slideDown: F("show"),
            slideUp: F("hide"),
            slideToggle: F("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, function(e, t) {
            fe.fn[e] = function(e, n, o) {
                return this.animate(t, e, n, o)
            }
        }), fe.timers = [], fe.fx.tick = function() {
            var e, t = fe.timers,
                n = 0;
            for (yt = fe.now(); n < t.length; n++)(e = t[n])() || t[n] !== e || t.splice(n--, 1);
            t.length || fe.fx.stop(), yt = void 0
        }, fe.fx.timer = function(e) {
            fe.timers.push(e), e() ? fe.fx.start() : fe.timers.pop()
        }, fe.fx.interval = 13, fe.fx.start = function() {
            wt || (wt = e.setInterval(fe.fx.tick, fe.fx.interval))
        }, fe.fx.stop = function() {
            e.clearInterval(wt), wt = null
        }, fe.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400
        }, fe.fn.delay = function(t, n) {
            return t = fe.fx ? fe.fx.speeds[t] || t : t, n = n || "fx", this.queue(n, function(n, o) {
                var i = e.setTimeout(n, t);
                o.stop = function() {
                    e.clearTimeout(i)
                }
            })
        },
        function() {
            var e, t = oe.createElement("input"),
                n = oe.createElement("div"),
                o = oe.createElement("select"),
                i = o.appendChild(oe.createElement("option"));
            n = oe.createElement("div"), n.setAttribute("className", "t"), n.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", e = n.getElementsByTagName("a")[0], t.setAttribute("type", "checkbox"), n.appendChild(t), e = n.getElementsByTagName("a")[0], e.style.cssText = "top:1px", de.getSetAttribute = "t" !== n.className, de.style = /top/.test(e.getAttribute("style")), de.hrefNormalized = "/a" === e.getAttribute("href"), de.checkOn = !!t.value, de.optSelected = i.selected, de.enctype = !!oe.createElement("form").enctype, o.disabled = !0, de.optDisabled = !i.disabled, t = oe.createElement("input"), t.setAttribute("value", ""), de.input = "" === t.getAttribute("value"), t.value = "t", t.setAttribute("type", "radio"), de.radioValue = "t" === t.value
        }();
    fe.fn.extend({
        val: function(e) {
            var t, n, o, i = this[0];
            if (arguments.length) return o = fe.isFunction(e), this.each(function(n) {
                var i;
                1 === this.nodeType && (i = o ? e.call(this, n, fe(this).val()) : e, null == i ? i = "" : "number" == typeof i ? i += "" : fe.isArray(i) && (i = fe.map(i, function(e) {
                    return null == e ? "" : e + ""
                })), (t = fe.valHooks[this.type] || fe.valHooks[this.nodeName.toLowerCase()]) && "set" in t && void 0 !== t.set(this, i, "value") || (this.value = i))
            });
            if (i) return (t = fe.valHooks[i.type] || fe.valHooks[i.nodeName.toLowerCase()]) && "get" in t && void 0 !== (n = t.get(i, "value")) ? n : (n = i.value, "string" == typeof n ? n.replace(/\r/g, "") : null == n ? "" : n)
        }
    }), fe.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = fe.find.attr(e, "value");
                    return null != t ? t : fe.trim(fe.text(e)).replace(/[\x20\t\r\n\f]+/g, " ")
                }
            },
            select: {
                get: function(e) {
                    for (var t, n, o = e.options, i = e.selectedIndex, r = "select-one" === e.type || i < 0, s = r ? null : [], a = r ? i + 1 : o.length, l = i < 0 ? a : r ? i : 0; l < a; l++)
                        if (n = o[l], (n.selected || l === i) && (de.optDisabled ? !n.disabled : null === n.getAttribute("disabled")) && (!n.parentNode.disabled || !fe.nodeName(n.parentNode, "optgroup"))) {
                            if (t = fe(n).val(), r) return t;
                            s.push(t)
                        }
                    return s
                },
                set: function(e, t) {
                    for (var n, o, i = e.options, r = fe.makeArray(t), s = i.length; s--;)
                        if (o = i[s], fe.inArray(fe.valHooks.option.get(o), r) > -1) try {
                            o.selected = n = !0
                        } catch (e) {
                            o.scrollHeight
                        } else o.selected = !1;
                    return n || (e.selectedIndex = -1), i
                }
            }
        }
    }), fe.each(["radio", "checkbox"], function() {
        fe.valHooks[this] = {
            set: function(e, t) {
                if (fe.isArray(t)) return e.checked = fe.inArray(fe(e).val(), t) > -1
            }
        }, de.checkOn || (fe.valHooks[this].get = function(e) {
            return null === e.getAttribute("value") ? "on" : e.value
        })
    });
    var Et, xt, Tt = fe.expr.attrHandle,
        kt = /^(?:checked|selected)$/i,
        St = de.getSetAttribute,
        qt = de.input;
    fe.fn.extend({
        attr: function(e, t) {
            return Ae(this, fe.attr, e, t, arguments.length > 1)
        },
        removeAttr: function(e) {
            return this.each(function() {
                fe.removeAttr(this, e)
            })
        }
    }), fe.extend({
        attr: function(e, t, n) {
            var o, i, r = e.nodeType;
            if (3 !== r && 8 !== r && 2 !== r) return void 0 === e.getAttribute ? fe.prop(e, t, n) : (1 === r && fe.isXMLDoc(e) || (t = t.toLowerCase(), i = fe.attrHooks[t] || (fe.expr.match.bool.test(t) ? xt : Et)), void 0 !== n ? null === n ? void fe.removeAttr(e, t) : i && "set" in i && void 0 !== (o = i.set(e, n, t)) ? o : (e.setAttribute(t, n + ""), n) : i && "get" in i && null !== (o = i.get(e, t)) ? o : (o = fe.find.attr(e, t), null == o ? void 0 : o))
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (!de.radioValue && "radio" === t && fe.nodeName(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t), n && (e.value = n), t
                    }
                }
            }
        },
        removeAttr: function(e, t) {
            var n, o, i = 0,
                r = t && t.match(Te);
            if (r && 1 === e.nodeType)
                for (; n = r[i++];) o = fe.propFix[n] || n, fe.expr.match.bool.test(n) ? qt && St || !kt.test(n) ? e[o] = !1 : e[fe.camelCase("default-" + n)] = e[o] = !1 : fe.attr(e, n, ""), e.removeAttribute(St ? n : o)
        }
    }), xt = {
        set: function(e, t, n) {
            return t === !1 ? fe.removeAttr(e, n) : qt && St || !kt.test(n) ? e.setAttribute(!St && fe.propFix[n] || n, n) : e[fe.camelCase("default-" + n)] = e[n] = !0, n
        }
    }, fe.each(fe.expr.match.bool.source.match(/\w+/g), function(e, t) {
        var n = Tt[t] || fe.find.attr;
        qt && St || !kt.test(t) ? Tt[t] = function(e, t, o) {
            var i, r;
            return o || (r = Tt[t], Tt[t] = i, i = null != n(e, t, o) ? t.toLowerCase() : null, Tt[t] = r), i
        } : Tt[t] = function(e, t, n) {
            if (!n) return e[fe.camelCase("default-" + t)] ? t.toLowerCase() : null
        }
    }), qt && St || (fe.attrHooks.value = {
        set: function(e, t, n) {
            if (!fe.nodeName(e, "input")) return Et && Et.set(e, t, n);
            e.defaultValue = t
        }
    }), St || (Et = {
        set: function(e, t, n) {
            var o = e.getAttributeNode(n);
            if (o || e.setAttributeNode(o = e.ownerDocument.createAttribute(n)), o.value = t += "", "value" === n || t === e.getAttribute(n)) return t
        }
    }, Tt.id = Tt.name = Tt.coords = function(e, t, n) {
        var o;
        if (!n) return (o = e.getAttributeNode(t)) && "" !== o.value ? o.value : null
    }, fe.valHooks.button = {
        get: function(e, t) {
            var n = e.getAttributeNode(t);
            if (n && n.specified) return n.value
        },
        set: Et.set
    }, fe.attrHooks.contenteditable = {
        set: function(e, t, n) {
            Et.set(e, "" !== t && t, n)
        }
    }, fe.each(["width", "height"], function(e, t) {
        fe.attrHooks[t] = {
            set: function(e, n) {
                if ("" === n) return e.setAttribute(t, "auto"), n
            }
        }
    })), de.style || (fe.attrHooks.style = {
        get: function(e) {
            return e.style.cssText || void 0
        },
        set: function(e, t) {
            return e.style.cssText = t + ""
        }
    });
    var Dt = /^(?:input|select|textarea|button|object)$/i,
        Nt = /^(?:a|area)$/i;
    fe.fn.extend({
        prop: function(e, t) {
            return Ae(this, fe.prop, e, t, arguments.length > 1)
        },
        removeProp: function(e) {
            return e = fe.propFix[e] || e, this.each(function() {
                try {
                    this[e] = void 0, delete this[e]
                } catch (e) {}
            })
        }
    }), fe.extend({
        prop: function(e, t, n) {
            var o, i, r = e.nodeType;
            if (3 !== r && 8 !== r && 2 !== r) return 1 === r && fe.isXMLDoc(e) || (t = fe.propFix[t] || t, i = fe.propHooks[t]), void 0 !== n ? i && "set" in i && void 0 !== (o = i.set(e, n, t)) ? o : e[t] = n : i && "get" in i && null !== (o = i.get(e, t)) ? o : e[t]
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    var t = fe.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : Dt.test(e.nodeName) || Nt.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        },
        propFix: {
            for: "htmlFor",
            class: "className"
        }
    }), de.hrefNormalized || fe.each(["href", "src"], function(e, t) {
        fe.propHooks[t] = {
            get: function(e) {
                return e.getAttribute(t, 4)
            }
        }
    }), de.optSelected || (fe.propHooks.selected = {
        get: function(e) {
            var t = e.parentNode;
            return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null
        },
        set: function(e) {
            var t = e.parentNode;
            t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex)
        }
    }), fe.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        fe.propFix[this.toLowerCase()] = this
    }), de.enctype || (fe.propFix.enctype = "encoding");
    fe.fn.extend({
        addClass: function(e) {
            var t, n, o, i, r, s, a, l = 0;
            if (fe.isFunction(e)) return this.each(function(t) {
                fe(this).addClass(e.call(this, t, X(this)))
            });
            if ("string" == typeof e && e)
                for (t = e.match(Te) || []; n = this[l++];)
                    if (i = X(n), o = 1 === n.nodeType && (" " + i + " ").replace(/[\t\r\n\f]/g, " ")) {
                        for (s = 0; r = t[s++];) o.indexOf(" " + r + " ") < 0 && (o += r + " ");
                        a = fe.trim(o), i !== a && fe.attr(n, "class", a)
                    }
            return this
        },
        removeClass: function(e) {
            var t, n, o, i, r, s, a, l = 0;
            if (fe.isFunction(e)) return this.each(function(t) {
                fe(this).removeClass(e.call(this, t, X(this)))
            });
            if (!arguments.length) return this.attr("class", "");
            if ("string" == typeof e && e)
                for (t = e.match(Te) || []; n = this[l++];)
                    if (i = X(n), o = 1 === n.nodeType && (" " + i + " ").replace(/[\t\r\n\f]/g, " ")) {
                        for (s = 0; r = t[s++];)
                            for (; o.indexOf(" " + r + " ") > -1;) o = o.replace(" " + r + " ", " ");
                        a = fe.trim(o), i !== a && fe.attr(n, "class", a)
                    }
            return this
        },
        toggleClass: function(e, t) {
            var n = typeof e;
            return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : fe.isFunction(e) ? this.each(function(n) {
                fe(this).toggleClass(e.call(this, n, X(this), t), t)
            }) : this.each(function() {
                var t, o, i, r;
                if ("string" === n)
                    for (o = 0, i = fe(this), r = e.match(Te) || []; t = r[o++];) i.hasClass(t) ? i.removeClass(t) : i.addClass(t);
                else void 0 !== e && "boolean" !== n || (t = X(this), t && fe._data(this, "__className__", t), fe.attr(this, "class", t || e === !1 ? "" : fe._data(this, "__className__") || ""))
            })
        },
        hasClass: function(e) {
            var t, n, o = 0;
            for (t = " " + e + " "; n = this[o++];)
                if (1 === n.nodeType && (" " + X(n) + " ").replace(/[\t\r\n\f]/g, " ").indexOf(t) > -1) return !0;
            return !1
        }
    }), fe.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
        fe.fn[t] = function(e, n) {
            return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
        }
    }), fe.fn.extend({
        hover: function(e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        }
    });
    var Ct = e.location,
        It = fe.now(),
        jt = /\?/;
    fe.parseJSON = function(t) {
        if (e.JSON && e.JSON.parse) return e.JSON.parse(t + "");
        var n, o = null,
            i = fe.trim(t + "");
        return i && !fe.trim(i.replace(/(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g, function(e, t, i, r) {
            return n && t && (o = 0), 0 === o ? e : (n = i || t, o += !r - !i, "")
        })) ? Function("return " + i)() : fe.error("Invalid JSON: " + t)
    }, fe.parseXML = function(t) {
        var n, o;
        if (!t || "string" != typeof t) return null;
        try {
            e.DOMParser ? (o = new e.DOMParser, n = o.parseFromString(t, "text/xml")) : (n = new e.ActiveXObject("Microsoft.XMLDOM"), n.async = "false", n.loadXML(t))
        } catch (e) {
            n = void 0
        }
        return n && n.documentElement && !n.getElementsByTagName("parsererror").length || fe.error("Invalid XML: " + t), n
    };
    var Rt = /([?&])_=[^&]*/,
        At = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
        Lt = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        Ot = /^(?:GET|HEAD)$/,
        Mt = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
        Ht = {},
        Ft = {},
        Pt = "*/".concat("*"),
        Bt = Ct.href,
        Wt = Mt.exec(Bt.toLowerCase()) || [];
    fe.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: Bt,
            type: "GET",
            isLocal: Lt.test(Wt[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Pt,
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
                "text json": fe.parseJSON,
                "text xml": fe.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? $($(e, fe.ajaxSettings), t) : $(fe.ajaxSettings, e)
        },
        ajaxPrefilter: U(Ht),
        ajaxTransport: U(Ft),
        ajax: function(t, n) {
            function o(t, n, o, i) {
                var r, d, y, w, b, x = n;
                2 !== v && (v = 2, l && e.clearTimeout(l), u = void 0, a = i || "", E.readyState = t > 0 ? 4 : 0, r = t >= 200 && t < 300 || 304 === t, o && (w = V(f, E, o)), w = Y(f, w, E, r), r ? (f.ifModified && (b = E.getResponseHeader("Last-Modified"), b && (fe.lastModified[s] = b), (b = E.getResponseHeader("etag")) && (fe.etag[s] = b)), 204 === t || "HEAD" === f.type ? x = "nocontent" : 304 === t ? x = "notmodified" : (x = w.state, d = w.data, y = w.error, r = !y)) : (y = x, !t && x || (x = "error", t < 0 && (t = 0))), E.status = t, E.statusText = (n || x) + "", r ? p.resolveWith(m, [d, x, E]) : p.rejectWith(m, [E, x, y]), E.statusCode(g), g = void 0, c && _.trigger(r ? "ajaxSuccess" : "ajaxError", [E, f, r ? d : y]), h.fireWith(m, [E, x]), c && (_.trigger("ajaxComplete", [E, f]), --fe.active || fe.event.trigger("ajaxStop")))
            }
            "object" == typeof t && (n = t, t = void 0), n = n || {};
            var i, r, s, a, l, c, u, d, f = fe.ajaxSetup({}, n),
                m = f.context || f,
                _ = f.context && (m.nodeType || m.jquery) ? fe(m) : fe.event,
                p = fe.Deferred(),
                h = fe.Callbacks("once memory"),
                g = f.statusCode || {},
                y = {},
                w = {},
                v = 0,
                b = "canceled",
                E = {
                    readyState: 0,
                    getResponseHeader: function(e) {
                        var t;
                        if (2 === v) {
                            if (!d)
                                for (d = {}; t = At.exec(a);) d[t[1].toLowerCase()] = t[2];
                            t = d[e.toLowerCase()]
                        }
                        return null == t ? null : t
                    },
                    getAllResponseHeaders: function() {
                        return 2 === v ? a : null
                    },
                    setRequestHeader: function(e, t) {
                        var n = e.toLowerCase();
                        return v || (e = w[n] = w[n] || e, y[e] = t), this
                    },
                    overrideMimeType: function(e) {
                        return v || (f.mimeType = e), this
                    },
                    statusCode: function(e) {
                        var t;
                        if (e)
                            if (v < 2)
                                for (t in e) g[t] = [g[t], e[t]];
                            else E.always(e[E.status]);
                        return this
                    },
                    abort: function(e) {
                        var t = e || b;
                        return u && u.abort(t), o(0, t), this
                    }
                };
            if (p.promise(E).complete = h.add, E.success = E.done, E.error = E.fail, f.url = ((t || f.url || Bt) + "").replace(/#.*$/, "").replace(/^\/\//, Wt[1] + "//"), f.type = n.method || n.type || f.method || f.type, f.dataTypes = fe.trim(f.dataType || "*").toLowerCase().match(Te) || [""], null == f.crossDomain && (i = Mt.exec(f.url.toLowerCase()), f.crossDomain = !(!i || i[1] === Wt[1] && i[2] === Wt[2] && (i[3] || ("http:" === i[1] ? "80" : "443")) === (Wt[3] || ("http:" === Wt[1] ? "80" : "443")))), f.data && f.processData && "string" != typeof f.data && (f.data = fe.param(f.data, f.traditional)), G(Ht, f, n, E), 2 === v) return E;
            c = fe.event && f.global, c && 0 == fe.active++ && fe.event.trigger("ajaxStart"), f.type = f.type.toUpperCase(), f.hasContent = !Ot.test(f.type), s = f.url, f.hasContent || (f.data && (s = f.url += (jt.test(s) ? "&" : "?") + f.data, delete f.data), f.cache === !1 && (f.url = Rt.test(s) ? s.replace(Rt, "$1_=" + It++) : s + (jt.test(s) ? "&" : "?") + "_=" + It++)), f.ifModified && (fe.lastModified[s] && E.setRequestHeader("If-Modified-Since", fe.lastModified[s]), fe.etag[s] && E.setRequestHeader("If-None-Match", fe.etag[s])), (f.data && f.hasContent && f.contentType !== !1 || n.contentType) && E.setRequestHeader("Content-Type", f.contentType), E.setRequestHeader("Accept", f.dataTypes[0] && f.accepts[f.dataTypes[0]] ? f.accepts[f.dataTypes[0]] + ("*" !== f.dataTypes[0] ? ", " + Pt + "; q=0.01" : "") : f.accepts["*"]);
            for (r in f.headers) E.setRequestHeader(r, f.headers[r]);
            if (f.beforeSend && (f.beforeSend.call(m, E, f) === !1 || 2 === v)) return E.abort();
            b = "abort";
            for (r in {
                    success: 1,
                    error: 1,
                    complete: 1
                }) E[r](f[r]);
            if (u = G(Ft, f, n, E)) {
                if (E.readyState = 1, c && _.trigger("ajaxSend", [E, f]), 2 === v) return E;
                f.async && f.timeout > 0 && (l = e.setTimeout(function() {
                    E.abort("timeout")
                }, f.timeout));
                try {
                    v = 1, u.send(y, o)
                } catch (e) {
                    if (!(v < 2)) throw e;
                    o(-1, e)
                }
            } else o(-1, "No Transport");
            return E
        },
        getJSON: function(e, t, n) {
            return fe.get(e, t, n, "json")
        },
        getScript: function(e, t) {
            return fe.get(e, void 0, t, "script")
        }
    }), fe.each(["get", "post"], function(e, t) {
        fe[t] = function(e, n, o, i) {
            return fe.isFunction(n) && (i = i || o, o = n, n = void 0), fe.ajax(fe.extend({
                url: e,
                type: t,
                dataType: i,
                data: n,
                success: o
            }, fe.isPlainObject(e) && e))
        }
    }), fe._evalUrl = function(e) {
        return fe.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            cache: !0,
            async: !1,
            global: !1,
            throws: !0
        })
    }, fe.fn.extend({
        wrapAll: function(e) {
            if (fe.isFunction(e)) return this.each(function(t) {
                fe(this).wrapAll(e.call(this, t))
            });
            if (this[0]) {
                var t = fe(e, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
                    for (var e = this; e.firstChild && 1 === e.firstChild.nodeType;) e = e.firstChild;
                    return e
                }).append(this)
            }
            return this
        },
        wrapInner: function(e) {
            return fe.isFunction(e) ? this.each(function(t) {
                fe(this).wrapInner(e.call(this, t))
            }) : this.each(function() {
                var t = fe(this),
                    n = t.contents();
                n.length ? n.wrapAll(e) : t.append(e)
            })
        },
        wrap: function(e) {
            var t = fe.isFunction(e);
            return this.each(function(n) {
                fe(this).wrapAll(t ? e.call(this, n) : e)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                fe.nodeName(this, "body") || fe(this).replaceWith(this.childNodes)
            }).end()
        }
    }), fe.expr.filters.hidden = function(e) {
        return de.reliableHiddenOffsets() ? e.offsetWidth <= 0 && e.offsetHeight <= 0 && !e.getClientRects().length : Q(e)
    }, fe.expr.filters.visible = function(e) {
        return !fe.expr.filters.hidden(e)
    };
    var zt = /\[\]$/,
        Xt = /^(?:submit|button|image|reset|file)$/i,
        Ut = /^(?:input|select|textarea|keygen)/i;
    fe.param = function(e, t) {
        var n, o = [],
            i = function(e, t) {
                t = fe.isFunction(t) ? t() : null == t ? "" : t, o[o.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
            };
        if (void 0 === t && (t = fe.ajaxSettings && fe.ajaxSettings.traditional), fe.isArray(e) || e.jquery && !fe.isPlainObject(e)) fe.each(e, function() {
            i(this.name, this.value)
        });
        else
            for (n in e) J(n, e[n], t, i);
        return o.join("&").replace(/%20/g, "+")
    }, fe.fn.extend({
        serialize: function() {
            return fe.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var e = fe.prop(this, "elements");
                return e ? fe.makeArray(e) : this
            }).filter(function() {
                var e = this.type;
                return this.name && !fe(this).is(":disabled") && Ut.test(this.nodeName) && !Xt.test(e) && (this.checked || !Le.test(e))
            }).map(function(e, t) {
                var n = fe(this).val();
                return null == n ? null : fe.isArray(n) ? fe.map(n, function(e) {
                    return {
                        name: t.name,
                        value: e.replace(/\r?\n/g, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace(/\r?\n/g, "\r\n")
                }
            }).get()
        }
    }), fe.ajaxSettings.xhr = void 0 !== e.ActiveXObject ? function() {
        return this.isLocal ? ee() : oe.documentMode > 8 ? Z() : /^(get|post|head|put|delete|options)$/i.test(this.type) && Z() || ee()
    } : Z;
    var Gt = 0,
        $t = {},
        Vt = fe.ajaxSettings.xhr();
    e.attachEvent && e.attachEvent("onunload", function() {
        for (var e in $t) $t[e](void 0, !0)
    }), de.cors = !!Vt && "withCredentials" in Vt, Vt = de.ajax = !!Vt, Vt && fe.ajaxTransport(function(t) {
        if (!t.crossDomain || de.cors) {
            var n;
            return {
                send: function(o, i) {
                    var r, s = t.xhr(),
                        a = ++Gt;
                    if (s.open(t.type, t.url, t.async, t.username, t.password), t.xhrFields)
                        for (r in t.xhrFields) s[r] = t.xhrFields[r];
                    t.mimeType && s.overrideMimeType && s.overrideMimeType(t.mimeType), t.crossDomain || o["X-Requested-With"] || (o["X-Requested-With"] = "XMLHttpRequest");
                    for (r in o) void 0 !== o[r] && s.setRequestHeader(r, o[r] + "");
                    s.send(t.hasContent && t.data || null), n = function(e, o) {
                        var r, l, c;
                        if (n && (o || 4 === s.readyState))
                            if (delete $t[a], n = void 0, s.onreadystatechange = fe.noop, o) 4 !== s.readyState && s.abort();
                            else {
                                c = {}, r = s.status, "string" == typeof s.responseText && (c.text = s.responseText);
                                try {
                                    l = s.statusText
                                } catch (e) {
                                    l = ""
                                }
                                r || !t.isLocal || t.crossDomain ? 1223 === r && (r = 204) : r = c.text ? 200 : 404
                            }
                        c && i(r, l, c, s.getAllResponseHeaders())
                    }, t.async ? 4 === s.readyState ? e.setTimeout(n) : s.onreadystatechange = $t[a] = n : n()
                },
                abort: function() {
                    n && n(void 0, !0)
                }
            }
        }
    }), fe.ajaxPrefilter(function(e) {
        e.crossDomain && (e.contents.script = !1)
    }), fe.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function(e) {
                return fe.globalEval(e), e
            }
        }
    }), fe.ajaxPrefilter("script", function(e) {
        void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1)
    }), fe.ajaxTransport("script", function(e) {
        if (e.crossDomain) {
            var t, n = oe.head || fe("head")[0] || oe.documentElement;
            return {
                send: function(o, i) {
                    t = oe.createElement("script"), t.async = !0, e.scriptCharset && (t.charset = e.scriptCharset), t.src = e.url, t.onload = t.onreadystatechange = function(e, n) {
                        (n || !t.readyState || /loaded|complete/.test(t.readyState)) && (t.onload = t.onreadystatechange = null, t.parentNode && t.parentNode.removeChild(t), t = null, n || i(200, "success"))
                    }, n.insertBefore(t, n.firstChild)
                },
                abort: function() {
                    t && t.onload(void 0, !0)
                }
            }
        }
    });
    var Yt = [],
        Kt = /(=)\?(?=&|$)|\?\?/;
    fe.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = Yt.pop() || fe.expando + "_" + It++;
            return this[e] = !0, e
        }
    }), fe.ajaxPrefilter("json jsonp", function(t, n, o) {
        var i, r, s, a = t.jsonp !== !1 && (Kt.test(t.url) ? "url" : "string" == typeof t.data && 0 === (t.contentType || "").indexOf("application/x-www-form-urlencoded") && Kt.test(t.data) && "data");
        if (a || "jsonp" === t.dataTypes[0]) return i = t.jsonpCallback = fe.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, a ? t[a] = t[a].replace(Kt, "$1" + i) : t.jsonp !== !1 && (t.url += (jt.test(t.url) ? "&" : "?") + t.jsonp + "=" + i), t.converters["script json"] = function() {
            return s || fe.error(i + " was not called"), s[0]
        }, t.dataTypes[0] = "json", r = e[i], e[i] = function() {
            s = arguments
        }, o.always(function() {
            void 0 === r ? fe(e).removeProp(i) : e[i] = r, t[i] && (t.jsonpCallback = n.jsonpCallback, Yt.push(i)), s && fe.isFunction(r) && r(s[0]), s = r = void 0
        }), "script"
    }), fe.parseHTML = function(e, t, n) {
        if (!e || "string" != typeof e) return null;
        "boolean" == typeof t && (n = t, t = !1), t = t || oe;
        var o = ye.exec(e),
            i = !n && [];
        return o ? [t.createElement(o[1])] : (o = g([e], t, i), i && i.length && fe(i).remove(), fe.merge([], o.childNodes))
    };
    var Qt = fe.fn.load;
    fe.fn.load = function(e, t, n) {
        if ("string" != typeof e && Qt) return Qt.apply(this, arguments);
        var o, i, r, s = this,
            a = e.indexOf(" ");
        return a > -1 && (o = fe.trim(e.slice(a, e.length)), e = e.slice(0, a)), fe.isFunction(t) ? (n = t, t = void 0) : t && "object" == typeof t && (i = "POST"), s.length > 0 && fe.ajax({
            url: e,
            type: i || "GET",
            dataType: "html",
            data: t
        }).done(function(e) {
            r = arguments, s.html(o ? fe("<div>").append(fe.parseHTML(e)).find(o) : e)
        }).always(n && function(e, t) {
            s.each(function() {
                n.apply(s, r || [e.responseText, t, e])
            })
        }), this
    }, fe.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
        fe.fn[t] = function(e) {
            return this.on(t, e)
        }
    }), fe.expr.filters.animated = function(e) {
        return fe.grep(fe.timers, function(t) {
            return e === t.elem
        }).length
    }, fe.offset = {
        setOffset: function(e, t, n) {
            var o, i, r, s, a, l, c, u = fe.css(e, "position"),
                d = fe(e),
                f = {};
            "static" === u && (e.style.position = "relative"), a = d.offset(), r = fe.css(e, "top"), l = fe.css(e, "left"), c = ("absolute" === u || "fixed" === u) && fe.inArray("auto", [r, l]) > -1, c ? (o = d.position(), s = o.top, i = o.left) : (s = parseFloat(r) || 0, i = parseFloat(l) || 0), fe.isFunction(t) && (t = t.call(e, n, fe.extend({}, a))), null != t.top && (f.top = t.top - a.top + s), null != t.left && (f.left = t.left - a.left + i), "using" in t ? t.using.call(e, f) : d.css(f)
        }
    }, fe.fn.extend({
        offset: function(e) {
            if (arguments.length) return void 0 === e ? this : this.each(function(t) {
                fe.offset.setOffset(this, e, t)
            });
            var t, n, o = {
                    top: 0,
                    left: 0
                },
                i = this[0],
                r = i && i.ownerDocument;
            if (r) return t = r.documentElement, fe.contains(t, i) ? (void 0 !== i.getBoundingClientRect && (o = i.getBoundingClientRect()), n = te(r), {
                top: o.top + (n.pageYOffset || t.scrollTop) - (t.clientTop || 0),
                left: o.left + (n.pageXOffset || t.scrollLeft) - (t.clientLeft || 0)
            }) : o
        },
        position: function() {
            if (this[0]) {
                var e, t, n = {
                        top: 0,
                        left: 0
                    },
                    o = this[0];
                return "fixed" === fe.css(o, "position") ? t = o.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), fe.nodeName(e[0], "html") || (n = e.offset()), n.top += fe.css(e[0], "borderTopWidth", !0), n.left += fe.css(e[0], "borderLeftWidth", !0)), {
                    top: t.top - n.top - fe.css(o, "marginTop", !0),
                    left: t.left - n.left - fe.css(o, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var e = this.offsetParent; e && !fe.nodeName(e, "html") && "static" === fe.css(e, "position");) e = e.offsetParent;
                return e || st
            })
        }
    }), fe.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(e, t) {
        var n = /Y/.test(t);
        fe.fn[e] = function(o) {
            return Ae(this, function(e, o, i) {
                var r = te(e);
                if (void 0 === i) return r ? t in r ? r[t] : r.document.documentElement[o] : e[o];
                r ? r.scrollTo(n ? fe(r).scrollLeft() : i, n ? i : fe(r).scrollTop()) : e[o] = i
            }, e, o, arguments.length, null)
        }
    }), fe.each(["top", "left"], function(e, t) {
        fe.cssHooks[t] = I(de.pixelPosition, function(e, n) {
            if (n) return n = lt(e, t), it.test(n) ? fe(e).position()[t] + "px" : n
        })
    }), fe.each({
        Height: "height",
        Width: "width"
    }, function(e, t) {
        fe.each({
            padding: "inner" + e,
            content: t,
            "": "outer" + e
        }, function(n, o) {
            fe.fn[o] = function(o, i) {
                var r = arguments.length && (n || "boolean" != typeof o),
                    s = n || (o === !0 || i === !0 ? "margin" : "border");
                return Ae(this, function(t, n, o) {
                    var i;
                    return fe.isWindow(t) ? t.document.documentElement["client" + e] : 9 === t.nodeType ? (i = t.documentElement, Math.max(t.body["scroll" + e], i["scroll" + e], t.body["offset" + e], i["offset" + e], i["client" + e])) : void 0 === o ? fe.css(t, n, s) : fe.style(t, n, o, s)
                }, t, r ? o : void 0, r, null)
            }
        })
    }), fe.fn.extend({
        bind: function(e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function(e, t) {
            return this.off(e, null, t)
        },
        delegate: function(e, t, n, o) {
            return this.on(t, e, n, o)
        },
        undelegate: function(e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        }
    }), fe.fn.size = function() {
        return this.length
    }, fe.fn.andSelf = fe.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function() {
        return fe
    });
    var Jt = e.jQuery,
        Zt = e.$;
    return fe.noConflict = function(t) {
        return e.$ === fe && (e.$ = Zt), t && e.jQuery === fe && (e.jQuery = Jt), fe
    }, t || (e.jQuery = e.$ = fe), fe
}),
function() {
    var e, t;
    jQuery.uaMatch = function(e) {
        e = e.toLowerCase();
        var t = /(chrome)[ \/]([\w.]+)/.exec(e) || /(webkit)[ \/]([\w.]+)/.exec(e) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e) || /(msie) ([\w.]+)/.exec(e) || e.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e) || [];
        return {
            browser: t[1] || "",
            version: t[2] || "0"
        }
    }, e = jQuery.uaMatch(navigator.userAgent), t = {}, e.browser && (t[e.browser] = !0, t.version = e.version), t.chrome ? t.webkit = !0 : t.webkit && (t.safari = !0), jQuery.browser = t, jQuery.sub = function() {
        function e(t, n) {
            return new e.fn.init(t, n)
        }
        jQuery.extend(!0, e, this), e.superclass = this, e.fn = e.prototype = this(), e.fn.constructor = e, e.sub = this.sub, e.fn.init = function(n, o) {
            return o && o instanceof jQuery && !(o instanceof e) && (o = e(o)), jQuery.fn.init.call(this, n, o, t)
        }, e.fn.init.prototype = e.fn;
        var t = e(document);
        return e
    }
}(), Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)]
}, chrome.browserAction.onClicked.addListener(function(e) {
    chrome.tabs.query({
        url: "https://www.instagram.com/*"
    }, function(e) {
        0 == e.length && chrome.tabs.create({
            url: "https://www.instagram.com/"
        }), e.forEach(function(e) {
            chrome.tabs.reload(e.id)
        })
    });
    var t = chrome.extension.getURL("index.html");
    chrome.tabs.create({
        url: t
    }), chrome.browserAction.setIcon({
        path: {
            48: "img/48.png"
        }
    })
});
var user_cache = [],
    last_col_time = 0;
setInterval(function() {
    chrome.tabs.query({
        url: "https://www.instagram.com/*"
    }, function(e) {
        e.length > 0 && chrome.tabs.query({
            url: "chrome-extension://" + chrome.runtime.id + "/*"
        }, function(e) {
            e.length > 0 && do_jobs()
        })
    }), check_insta_tab()
}, 1e3);
var db_sql = [],
    db_sql_comments = [],
    db_sql_filters = [],
    db_index = [],
    old_index_db_version = "downgraded";
chrome.runtime.onMessage.addListener(function(e, t, n) {
    if ("follow_filter" == e.option && insert_pool2(e.user_follow, e.user.viewer.id), "add_to_white_list" == e.option && db_index[e.user.viewer.id].transaction(["white_list2"], "readwrite").objectStore("white_list2").put({
            username: e.add_user.username,
            nerden: "comments_likes"
        }), "save_likes" == e.option && (console.log("save_likes", e.veri), e.veri.forEach(function(t) {
            0 == t.node.viewer_has_liked && db_sql[e.user.viewer.id].transaction(function(e) {
                e.executeSql('INSERT INTO likes (user_id, media_id, slug, image, insert_time, likes_time)  VALUES ("' + t.node.owner.id + '", "' + t.node.id + '", "' + t.node.shortcode + '", "' + t.node.display_url + '",  ' + Date.now() + ",0);")
            })
        })), "collect_from_location" == e.option && get_from_medias(e.data, e.user.viewer.id, {
            owner: e.owner,
            comments: e.comments,
            likes: e.likes
        }, {}), "unfollow_search" == e.option) {
        if ("end" == my_cookie2(e.user.viewer.id, "unfollow_cursor")) return;
        e.veri2.page_info.has_next_page ? my_cookie2(e.user.viewer.id, "unfollow_cursor", e.veri2.page_info.end_cursor) : (my_cookie2(e.user.viewer.id, "unfollow_cursor", "end"), insert_pendings(e.user.viewer)), my_cookie2(e.user.viewer.id, "unfollow_scanned_users", parseInt(my_cookie2(e.user.viewer.id, "unfollow_scanned_users")) + e.veri.length), $.each(e.veri, function(t, n) {
            db_index[e.user.viewer.id].transaction(["white_list2"], "readwrite").objectStore("white_list2").index("username").openCursor(IDBKeyRange.only(n.username)).onsuccess = function(t) {
                t.target.result ? qi_rand = "" : db_index[e.user.viewer.id].transaction(["follows_done"], "readwrite").objectStore("follows_done").index("user_id").openCursor(IDBKeyRange.only(n.id)).onsuccess = function(t) {
                    var o = t.target.result;
                    o ? (o.value.result = "following", o.update(o.value), o.value.follow_time < Date.now() - 24 * parseInt(my_cookie2(e.user.viewer.id, "days_unfollow")) * 60 * 60 * 1e3 && insert_unfolow_db(n, e.user.viewer, o.value.follow_time)) : "false" == my_cookie2(e.user.viewer.id, "unfollow_only_bot_followed") && insert_unfolow_db(n, e.user.viewer, "Manually Followed")
                }
            }
        })
    }
    if ("white_list_search" == e.option) {
        if ("end" == my_cookie2(e.user.viewer.id, "white_list_cursor")) return;
        e.veri.page_info.has_next_page ? my_cookie2(e.user.viewer.id, "white_list_cursor", e.veri.page_info.end_cursor) : my_cookie2(e.user.viewer.id, "white_list_cursor", "end"), $.each(e.veri.edges, function(t, n) {
            icine_ekleme = db_index[e.user.viewer.id].transaction(["white_list2"], "readwrite").objectStore("white_list2").put({
                username: n.node.username,
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
            "ok" == e.durum ? (t.executeSql("UPDATE likes SET likes_time=" + Date.now() + ' WHERE media_id="' + e.media_id + '";'), update_likes_statistics(e.user.viewer.id)) : (t.executeSql('DELETE from likes WHERE media_id="' + e.media_id + '";'), my_cookie2(user_id, "last_like_time", Date.now() + 1e3 * parseInt(my_cookie2(user_id, "like_error_interval"))), o = Date.now() + 1e3 * (parseInt(my_cookie2(user_id, "like_error_interval")) + parseInt(my_cookie2(user_id, "like_interval"))), "hata" == e.durum && db_sql[user_id].transaction(function(t) {
                t.executeSql('INSERT INTO error_log (action, item, error_type, error_time, next_time)  VALUES ("like", "' + e.slug + '", "unknown", ' + Date.now() + ",  " + o + ");")
            }))
        }), "do_comment" == e.option && db_sql_comments[e.user.viewer.id].transaction(function(t) {
            "ok" == e.durum ? (t.executeSql("UPDATE comments SET comments_time=" + Date.now() + ' WHERE media_id="' + e.media_id + '";'), update_comments_statistics(e.user.viewer.id)) : (t.executeSql('DELETE from comments WHERE media_id="' + e.media_id + '";'), my_cookie2(user_id, "last_comments_time", Date.now() + 1e3 * parseInt(my_cookie2(user_id, "comments_error_interval"))), o = Date.now() + 1e3 * (parseInt(my_cookie2(user_id, "comments_error_interval")) + parseInt(my_cookie2(user_id, "comments_interval"))), "hata" == e.durum && db_sql[user_id].transaction(function(t) {
                t.executeSql('INSERT INTO error_log (action, item, error_type, error_time, next_time)  VALUES ("comment", "' + e.slug + '", "unknown", ' + Date.now() + ",  " + o + ");")
            }))
        }), "do_unfollow" == e.option) {
        if ("ratelimit" == e.veri) return my_cookie2(user_id, "last_unfollow_time", Date.now() + 1e3 * parseInt(my_cookie2(user_id, "unfollow_error_interval"))), o = Date.now() + 1e3 * (parseInt(my_cookie2(user_id, "unfollow_error_interval")) + parseInt(my_cookie2(user_id, "unfollow_interval"))), void db_sql[user_id].transaction(function(t) {
            t.executeSql('INSERT INTO error_log (action, item, error_type, error_time, next_time)  VALUES ("unfollow", "' + e.who_unfollow.username + '", "rate limit", ' + Date.now() + ",  " + o + ");")
        });
        my_cookie2(user_id, "last_unfollow_time", Date.now()), db_index[e.user.viewer.id].transaction(["unfollows_waiting"], "readwrite").objectStore("unfollows_waiting").index("user_id").openCursor(IDBKeyRange.only(e.who_unfollow.user_id)).onsuccess = function(t) {
            var n = t.target.result;
            if (n) {
                if (n.delete(), "hardratelimit" == e.veri) return my_cookie2(user_id, "last_unfollow_time", Date.now() + 9e5), o = Date.now() + 9e5 + 1e3 * parseInt(my_cookie2(user_id, "unfollow_interval")), void db_sql[user_id].transaction(function(t) {
                    t.executeSql('INSERT INTO error_log (action, item, error_type, error_time, next_time)  VALUES ("unfollow", "' + e.who_unfollow.username + '", " HARD rate limit", ' + Date.now() + ",  " + o + ");")
                });
                if ("sil" != e.veri) {
                    var i = {
                        user_id: e.who_unfollow.user_id,
                        username: e.who_unfollow.username,
                        follow_time: e.who_unfollow.follow_time,
                        unfollow_time: Date.now()
                    };
                    db_index[e.user.viewer.id].transaction(["unfollows"], "readwrite").objectStore("unfollows").add(i), update_unfollow_statistics(e.user.viewer.id)
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
            t.executeSql('INSERT INTO error_log (action, item, error_type, error_time, next_time)  VALUES ("follow", "' + e.who_follow.username + '", "rate limit", ' + Date.now() + ",  " + o + ");")
        });
        my_cookie2(user_id, "last_follow_time", Date.now()), db_index[e.user.viewer.id].transaction(["follows"], "readwrite").objectStore("follows").index("user_id").openCursor(IDBKeyRange.only(e.who_follow.user_id)).onsuccess = function(t) {
            var n = t.target.result;
            if (n) {
                if (n.delete(), "hardratelimit" == e.veri) return last_hardratelimit = my_cookie2(user_id, "last_hardratelimit"), qi_start_time_hardratelimit = Date.now() - last_hardratelimit, qi_start_time_hardratelimit < 1500 * parseInt(my_cookie2(user_id, "follow_interval")) && (my_cookie2(user_id, "last_follow_time", Date.now() + 9e5), o = Date.now() + 9e5 + 1e3 * parseInt(my_cookie2(user_id, "follow_interval")), db_sql[user_id].transaction(function(t) {
                    t.executeSql('INSERT INTO error_log (action, item, error_type, error_time, next_time)  VALUES ("follow", "' + e.who_follow.username + '", " HARD rate limit", ' + Date.now() + ",  " + o + ");")
                })), void my_cookie2(user_id, "last_hardratelimit", Date.now());
                if ("sil" != e.veri) {
                    var i = {
                        user_id: e.who_follow.user_id,
                        username: e.who_follow.username,
                        follow_time: Date.now(),
                        result: e.veri.result
                    };
                    db_index[e.user.viewer.id].transaction(["follows_done"], "readwrite").objectStore("follows_done").add(i), update_follow_statistics(e.user.viewer.id)
                }
            }
        }
    }
    if ("collect_followers" == e.option && ("hata" != e.veri ? (my_cookie2(e.user.viewer.id, "collect_from_followers", Date.now()), qi_user_followers = {}, e.veri.edges.forEach(function(e) {
            qi_user_followers[e.node.id] = e.node.username
        }), col_users_to_pool(e.user.viewer.id, qi_user_followers), e.veri.page_info.has_next_page ? "son" != e.cursor && db_sql[e.user.viewer.id].transaction(function(t) {
            t.executeSql('UPDATE followers_jobs SET cursor="' + e.veri.page_info.end_cursor + '" WHERE user_id="' + e.user_id + '";')
        }) : db_sql[e.user.viewer.id].transaction(function(t) {
            t.executeSql('UPDATE followers_jobs SET cursor="son" WHERE user_id="' + e.user_id + '";')
        })) : my_cookie2(e.user.viewer.id, "collect_from_followers", Date.now() + 1e3 * parseInt(my_cookie2(e.user.viewer.id, "collect_from_followers_error_interval")))), e.hasOwnProperty("user")) db_sql.hasOwnProperty(e.user.viewer.id) || connect_sql_db(e.user.viewer.id);
    else {
        if (qi_value = my_cookie2("genel", "user_id"), null == qi_value) return;
        db_sql.hasOwnProperty(qi_value) || connect_sql_db(qi_value)
    }
    if ("set_user" == e.option && (qi_value = my_cookie2(e.user.viewer.id, "user_id"), null != qi_value && qi_value != e.user.viewer.id && set_defaults(e.user.viewer.id), localStorage.username = e.user.viewer.username, localStorage.user_id = e.user.viewer.id), "add_comments_job" == e.option && (qi_new_transaction = {
            option: "set_comments_button",
            tag: e.tag
        }, "add" == e.action ? (qi_new_transaction.qi_request = !0, db_sql_comments[e.user.viewer.id].transaction(function(t) {
            t.executeSql('INSERT INTO comments_jobs (q, check_time)  VALUES ("' + e.tag + '",  ' + Date.now() + ");")
        })) : "remove" == e.action && (qi_new_transaction.qi_request = !1, db_sql_comments[e.user.viewer.id].transaction(function(t) {
            t.executeSql('DELETE from comments_jobs WHERE q="' + e.tag + '";')
        })), chrome.tabs.sendMessage(t.tab.id, qi_new_transaction)), "add_likes_job" == e.option && (qi_new_transaction = {
            option: "set_likes_button",
            tag: e.tag
        }, "add" == e.action ? (qi_new_transaction.qi_request = !0, db_sql[e.user.viewer.id].transaction(function(t) {
            t.executeSql('INSERT INTO likes_jobs (q, check_time)  VALUES ("' + e.tag + '",  ' + Date.now() + ");")
        })) : "remove" == e.action && (qi_new_transaction.qi_request = !1, db_sql[e.user.viewer.id].transaction(function(t) {
            t.executeSql('DELETE from likes_jobs WHERE q="' + e.tag + '";')
        })), chrome.tabs.sendMessage(t.tab.id, qi_new_transaction)), "add_tag_job" == e.option && (qi_new_transaction = {
            option: "set_tag_button",
            tag: e.tag
        }, "add" == e.action ? (qi_new_transaction.qi_request = !0, db_sql[e.user.viewer.id].transaction(function(t) {
            t.executeSql('INSERT INTO searches_jobs (q, owner, likes, comments, check_time)  VALUES ("' + e.tag + '", ' + e.owner + ", " + e.likes + ", " + e.comments + ",  " + Date.now() + ");")
        })) : "remove" == e.action && (qi_new_transaction.qi_request = !1, db_sql[e.user.viewer.id].transaction(function(t) {
            t.executeSql('DELETE from searches_jobs WHERE q="' + e.tag + '";')
        })), chrome.tabs.sendMessage(t.tab.id, qi_new_transaction)), "add_location_job" == e.option && (qi_value = my_cookie2("genel", "user_id"), qi_new_transaction = {
            option: "set_location_button"
        }, "add" == e.action ? (qi_new_transaction.qi_request = !0, db_sql[qi_value].transaction(function(t) {
            t.executeSql('INSERT INTO locations_jobs (q, name, owner, likes, comments, check_time)  VALUES ("' + e.location_id + '", "' + encodeURIComponent(e.location_name) + '", ' + e.owner + ", " + e.likes + ", " + e.comments + ",  " + Date.now() + ");")
        })) : "remove" == e.action && (qi_new_transaction.qi_request = !1, db_sql[qi_value].transaction(function(t) {
            t.executeSql('DELETE from locations_jobs WHERE q="' + e.location + '";')
        })), chrome.tabs.sendMessage(t.tab.id, qi_new_transaction)), "add_location_area_job" == e.option && (qi_value = my_cookie2("genel", "user_id"), qi_new_transaction = {
            option: "set_location_area_button"
        }, "add" == e.action ? (qi_new_transaction.qi_request = !0, db_sql[qi_value].transaction(function(t) {
            t.executeSql('INSERT INTO location_areas_jobs (q, distance, owner, likes, comments, check_time)  VALUES ("' + e.area + '", ' + e.distance + ", " + e.owner + ", " + e.likes + ", " + e.comments + ",  " + Date.now() + ");")
        })) : "remove" == e.action && (qi_new_transaction.qi_request = !1, db_sql[qi_value].transaction(function(t) {
            t.executeSql('DELETE from location_areas_jobs WHERE q="' + e.area + '";')
        })), chrome.tabs.sendMessage(t.tab.id, qi_new_transaction)), "add_user_job" == e.option && (qi_exact = JSON.parse(e.qi_exact), qi_new_transaction = {
            qi_exact: e.qi_exact
        }, "commenters_btn" == e.button ? (qi_new_transaction.option = "set_commenters_button", table = "commenters_jobs") : "followers_btn" == e.button && (qi_new_transaction.option = "set_followers_button", table = "followers_jobs"), "add" == e.action ? (qi_new_transaction.qi_request = !0, db_sql[e.user.viewer.id].transaction(function(t) {
            "followers_jobs" == table ? t.executeSql("INSERT INTO " + table + ' (user_id, screen_name, cursor, check_time)  VALUES ("' + qi_exact.user_id + '", "' + qi_exact.screen_name + '", "' + e.followers_tipi + '", ' + Date.now() + ");") : "commenters_jobs" == table && t.executeSql("INSERT INTO " + table + ' (user_id, screen_name, check_time, comments, likes)  VALUES ("' + qi_exact.user_id + '", "' + qi_exact.screen_name + '",  ' + Date.now() + ", " + e.comments + ", " + e.likes + ");")
        })) : "remove" == e.action && (qi_new_transaction.qi_request = !1, db_sql[e.user.viewer.id].transaction(function(e) {
            e.executeSql("DELETE from " + table + ' WHERE user_id="' + qi_exact.user_id + '";')
        })), chrome.tabs.sendMessage(t.tab.id, qi_new_transaction)), "get_tag_button" == e.option && db_sql[e.user.viewer.id].transaction(function(n) {
            n.executeSql('SELECT * FROM searches_jobs where q="' + e.tag + '" limit 1', [], function(n, o) {
                var i = o.rows.length;
                qi_new_transaction = {
                    option: "set_tag_button",
                    tag: e.tag
                }, qi_new_transaction.qi_request = i > 0, chrome.tabs.sendMessage(t.tab.id, qi_new_transaction)
            }, null)
        }), "get_likes_button" == e.option && db_sql[e.user.viewer.id].transaction(function(n) {
            n.executeSql('SELECT * FROM likes_jobs where q="' + e.tag + '" limit 1', [], function(n, o) {
                var i = o.rows.length;
                qi_new_transaction = {
                    option: "set_likes_button",
                    tag: e.tag
                }, qi_new_transaction.qi_request = i > 0, chrome.tabs.sendMessage(t.tab.id, qi_new_transaction)
            }, null)
        }), "get_comments_button" == e.option && db_sql_comments[e.user.viewer.id].transaction(function(n) {
            n.executeSql('SELECT * FROM comments_jobs where q="' + e.tag + '" limit 1', [], function(n, o) {
                var i = o.rows.length;
                qi_new_transaction = {
                    option: "set_comments_button",
                    tag: e.tag
                }, qi_new_transaction.qi_request = i > 0, chrome.tabs.sendMessage(t.tab.id, qi_new_transaction)
            }, null)
        }), "get_location_button" == e.option && (qi_value = my_cookie2("genel", "user_id"), db_sql[qi_value].transaction(function(n) {
            n.executeSql('SELECT * FROM locations_jobs where q="' + e.location + '" limit 1', [], function(n, o) {
                var i = o.rows.length;
                qi_new_transaction = {
                    option: "set_location_button",
                    location: e.location
                }, qi_new_transaction.qi_request = i > 0, chrome.tabs.sendMessage(t.tab.id, qi_new_transaction)
            }, null)
        })), "get_location_area_button" == e.option && (qi_value = my_cookie2("genel", "user_id"), db_sql[qi_value].transaction(function(n) {
            n.executeSql('SELECT * FROM location_areas_jobs where q="' + e.area + '" limit 1', [], function(e, n) {
                var o = n.rows.length;
                qi_new_transaction = {
                    option: "set_location_area_button"
                }, qi_new_transaction.qi_request = o > 0, chrome.tabs.sendMessage(t.tab.id, qi_new_transaction)
            }, null)
        })), "get_user_buttons" == e.option && (qi_exact = JSON.parse(e.qi_exact), db_sql[e.user.viewer.id].transaction(function(n) {
            n.executeSql('SELECT * FROM followers_jobs where user_id="' + qi_exact.user_id + '" limit 1', [], function(n, o) {
                var i = o.rows.length;
                qi_new_transaction = {
                    option: "set_followers_button",
                    qi_exact: e.qi_exact
                }, qi_new_transaction.qi_request = i > 0, chrome.tabs.sendMessage(t.tab.id, qi_new_transaction)
            }, null), n.executeSql('SELECT * FROM commenters_jobs where user_id="' + qi_exact.user_id + '" limit 1', [], function(n, o) {
                var i = o.rows.length;
                qi_new_transaction = {
                    option: "set_commenters_button",
                    qi_exact: e.qi_exact
                }, qi_new_transaction.qi_request = i > 0, chrome.tabs.sendMessage(t.tab.id, qi_new_transaction)
            }, null)
        })), "queryError" == e.option) {
        var o = Date.now() + 1e3 * my_cookie2(user_id, "queryErrorWaitTime");
        db_sql[user_id].transaction(function(e) {
            e.executeSql('INSERT INTO error_log (action, item, error_type, error_time, next_time)  VALUES ("Pool query", "unknown", "Too frequent", ' + Date.now() + ",  " + o + ");")
        })
    }
}), chrome.runtime.onInstalled.addListener(function(e) {
    "install" == e.reason ? console.log("This is a first install!") : "update" == e.reason && (chrome.tabs.create({
        url: chrome.extension.getURL("index.html")
    }), chrome.tabs.create({
        url: "https://www.instagram.com/"
    }))
});