var db_index = [],
    db_sql = [],
    db_sql_comments = [],
    db_sql_filters = [];
chrome.runtime.onMessage.addListener(function(e) {
    "white_list_update" == e.option && update_white_list(), "licence" == e.option && ($("#baska_bir_aciklama").html("other"), $("#license_modal").modal(), $("#client_username").val(my_cookie2("genel", "username")), 0 >= parseInt(my_cookie2(user_id, "left_time")) ? $("#time_left").val("Expired, please renew.") : $("#time_left").val(moment.duration(parseInt(my_cookie2(user_id, "left_time"))).humanize())), "check_insta_tab" == e.option && (!1 == e.durum ? $("#request_to_reopen_IG").show() : $("#request_to_reopen_IG").hide())
});

function update_chart(e, t, l) {
    $(e).highcharts({
        chart: {
            type: "line"
        },
        title: {
            text: l
        },
        xAxis: {
            type: "category",
            labels: {
                rotation: -45,
                style: {
                    fontSize: "13px",
                    fontFamily: "Roboto, Verdana, sans-serif"
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: l
            }
        },
        legend: {
            enabled: !1
        },
        tooltip: {
            pointFormat: "<b>{point.y:.0f}</b>"
        },
        series: [{
            name: l + "s",
            data: t,
            dataLabels: {
                enabled: !0,
                color: "#000000",
                align: "right",
                y: 10,
                style: {
                    fontSize: "13px",
                    fontFamily: "Roboto",
                    textOutline: "1px contrast"
                },
                shadow: !1
            }
        }]
    })
}

function get_date_time(e) {
    e = "undefined" == typeof e ? Date.now() : e;
    var t = new Date(e),
        l = t.getMonth() + 1 + "/" + t.getDate() + "/" + t.getFullYear();
    return my_time = new Date(l).getTime(), my_time
}

function get_date_format(e) {
    e = "undefined" == typeof e ? Date.now() : e;
    var t = new Date(e),
        l = t.getDate() + "/" + (t.getMonth() + 1) + "/" + t.getFullYear();
    return l
}

function tablo_olustur(e, t) {
    user_id = my_cookie2("genel", "user_id");
    null == user_id || (baslangic = get_date_time(Date.now() - 6048e5), database_i = "st_comments" == e ? db_sql_comments[user_id] : db_sql[user_id], database_i.transaction(function(l) {
        l.executeSql("SELECT * FROM " + e + " where gun>=" + baslangic + " order by gun asc", [], function(l, o) {
            var s, n = o.rows.length;
            if (0 == n) return void $(t).html(chrome.i18n.getMessage("lcl_no_data_available"));
            for (tablo_datalari = [], s = 0; s < n; s++) zamanisi = get_date_format(o.rows.item(s).gun), tablo_datalari.push([zamanisi, o.rows.item(s).sayi]);
            "st_follow" == e ? baslikisi = chrome.i18n.getMessage("lcl_follows") : "st_unfollow" == e ? baslikisi = chrome.i18n.getMessage("lcl_unfollows") : "st_followers" == e ? baslikisi = chrome.i18n.getMessage("lcl_followers") : "st_likes" == e ? baslikisi = chrome.i18n.getMessage("lcl_likes") : "st_comments" == e && (baslikisi = "Comment"), update_chart(t, tablo_datalari, baslikisi)
        }, null)
    }))
}

function tablo_sec() {
    $("#follow").hasClass("active") ? tablo_olustur("st_follow", "#istatistik_tablo_follow") : $("#unfollow").hasClass("active") ? tablo_olustur("st_unfollow", "#istatistik_tablo_unfollow") : $("#stats").hasClass("active") ? tablo_olustur("st_followers", "#istatistik_tablo_followers") : $("#like").hasClass("active") ? tablo_olustur("st_likes", "#istatistik_tablo_like") : $("#comments_tab_li").hasClass("active") && tablo_olustur("st_comments")
}
$("#clear_error_log").click(function() {
    user_id = my_cookie2("genel", "user_id");
    null == user_id || (db_sql[user_id].transaction(function(e) {
        e.executeSql("DELETE from  error_log")
    }), $("#error_log").html(""))
}), $("#follow_tab_a_robo").click(function() {
    tablo_olustur("st_follow")
}), $("#unfollow_tab_a_robo").click(function() {
    tablo_olustur("st_unfollow")
}), $("#followers_tab_a_robo").click(function() {
    tablo_olustur("st_followers")
}), $("#likes_tab_a_robo").click(function() {
    tablo_olustur("st_likes")
}), $("#comments_tab_a_robo").click(function() {
    tablo_olustur("st_comments")
}), $("#statistics_modal_btn").click(function() {
    setTimeout(function() {
        tablo_sec()
    }, 1e3)
}), $("#unfollow_pool_count").click(function() {
    $(".nav-tabs a[href=\"#tab2\"]").tab("show"), setTimeout(function() {
        tablo_sec()
    }, 1e3)
}), $("#last_follow_statistics").click(function() {
    $(".nav-tabs a[href=\"#tab1\"]").tab("show"), setTimeout(function() {
        tablo_sec()
    }, 1e3)
}), $("#istatistik_yenile").click(function() {
    tablo_sec()
});

function convert_time_str(e) {
    if ("null" == e) return "null";
    if ("Manually Followed" == e) return "N/A";
    var t = new Date(e);
    return gun = 10 > t.getDate() ? "0" + t.getDate().toString() : t.getDate().toString(), ay = 10 > t.getMonth() + 1 ? "0" + (t.getMonth() + 1).toString() : (t.getMonth() + 1).toString(), yil = t.getFullYear(), saat = 10 > t.getHours() ? "0" + t.getHours().toString() : t.getHours().toString(), dakika = 10 > t.getMinutes() ? "0" + t.getMinutes().toString() : t.getMinutes().toString(), saniye = 10 > t.getSeconds() ? "0" + t.getSeconds().toString() : t.getSeconds().toString(), gun + "/" + ay + "/" + yil + " " + saat + ":" + dakika + ":" + saniye
}

function lates_follows(e) {
    function t(e) {
        $("#en_son_takipler").html(e)
    }
    if (zaman_farki = Date.now() - parseInt(my_cookie2(e, "son_takip_edilenler_zaman")), !(15e3 > zaman_farki)) var l = 0,
        o = "",
        s = db_index[e].transaction(["follows_done"], "readonly").objectStore("follows_done").index("follow_time").openCursor(IDBKeyRange.upperBound("Z", !0), "prev").onsuccess = function(s) {
            var e = s.target.result;
            e && 50 > l ? (null != e.value && null != e.value && (zaman_string = convert_time_str(e.value.follow_time), o = o + "<tr><td><a href='https://www.instagram.com/" + e.value.username + "/' target='_blank'>@" + e.value.username + "</a></td>                    <td >" + zaman_string + "</td></tr>"), l++, e.continue()) : t(o)
        }
}

function error_log(e) {
    zaman_farki = Date.now() - parseInt(my_cookie2(e, "son_takip_edilenler_zaman"));
    15e3 > zaman_farki || (db_sql[e].transaction(function(e) {
        e.executeSql("SELECT * FROM error_log WHERE action!='Pool query' ORDER BY error_time DESC LIMIT 10", [], function(e, t) {
            var l, o = t.rows.length;
            if (0 == o) return void $("#error_log").html(chrome.i18n.getMessage("lcl_no_data_available"));
            for (tablo_datalari = "", l = 0; l < o; l++) zaman_error = convert_time_str(t.rows.item(l).error_time), zaman_next = convert_time_str(t.rows.item(l).next_time), icerik = "like" == t.rows.item(l).action || "comment" == t.rows.item(l).action ? "<a target=\"_blank\" href=\"https://www.instagram.com/p/" + t.rows.item(l).item + "/\">" + t.rows.item(l).item + "</a>" : "<a target=\"_blank\" href=\"https://www.instagram.com/" + t.rows.item(l).item + "/\">" + t.rows.item(l).item + "</a>", error_text = " HARD rate limit" == t.rows.item(l).error_type ? t.rows.item(l).error_type : t.rows.item(l).error_type, tablo_datalari = tablo_datalari + "<tr ><td>" + t.rows.item(l).action + "</td><td>" + icerik + "</td><td>" + error_text + "</td><td>" + zaman_error + "</td><td>" + zaman_next + "</td><tr>";
            $("#error_log").html(tablo_datalari)
        }, null)
    }), db_sql[e].transaction(function(e) {
        e.executeSql("SELECT * FROM error_log WHERE action='Pool query' ORDER BY error_time DESC LIMIT 10", [], function(e, t) {
            var l, o = t.rows.length;
            if (0 == o) return void $("#error_log").html(chrome.i18n.getMessage("lcl_no_data_available"));
            for (tablo_datalari = "", l = 0; l < o; l++) zaman_error = convert_time_str(t.rows.item(l).error_time), zaman_next = convert_time_str(t.rows.item(l).next_time), icerik = "like" == t.rows.item(l).action || "comment" == t.rows.item(l).action ? "<a target=\"_blank\" href=\"https://www.instagram.com/p/" + t.rows.item(l).item + "/\">" + t.rows.item(l).item + "</a>" : "<a target=\"_blank\" href=\"https://www.instagram.com/" + t.rows.item(l).item + "/\">" + t.rows.item(l).item + "</a>", error_text = " HARD rate limit" == t.rows.item(l).error_type ? t.rows.item(l).error_type : t.rows.item(l).error_type, tablo_datalari = tablo_datalari + "<tr ><td>" + t.rows.item(l).action + "</td><td>" + icerik + "</td><td>" + error_text + "</td><td>" + zaman_error + "</td><td>" + zaman_next + "</td><tr>";
            $("#query_error_log").html(tablo_datalari)
        }, null)
    }))
}

function license_messages() {
    var e = my_cookie2(user_id, "left_time"),
        t = 259200000,
        l = moment.duration(parseInt(e)).humanize(!0);
    e >= t ? ($("#license-about-to-expire-msg").addClass("hide"), $("#license-expired-msg").addClass("hide")) : 0 < e && e < t ? ($("#license-about-to-expire-msg").removeClass("hide"), $("#left-time-display").text(l), $("#license-expired-msg").addClass("hide")) : ($("#license-about-to-expire-msg").addClass("hide"), $("#license-expired-msg").removeClass("hide"))
}

function lates_likes(e) {
    zaman_farki = Date.now() - parseInt(my_cookie2(e, "son_takip_edilenler_zaman"));
    15e3 > zaman_farki || db_sql[e].transaction(function(e) {
        e.executeSql("SELECT * FROM likes where likes_time>0 order by likes_time desc limit 50", [], function(e, t) {
            var l, o = t.rows.length;
            if (0 != o) {
                for (tablo_datalari = "", l = 0; l < o; l++) zaman_string = convert_time_str(t.rows.item(l).likes_time), tablo_datalari = tablo_datalari + "<tr ><td><a target=\"_blank\" href=\"https://www.instagram.com/p/" + t.rows.item(l).slug + "/\"><img class=\"img-rounded\" width=\"75px\" src=\"" + t.rows.item(l).image + "\" ></a></td><td>" + zaman_string + "</td><tr>";
                $("#lates_likes").html(tablo_datalari)
            }
        }, null)
    })
}

function lates_unfollows(e) {
    function t(e) {
        $("#en_son_takip_birakmalar").html(e)
    }
    if (zaman_farki = Date.now() - parseInt(my_cookie2(e, "son_takip_edilenler_zaman")), !(15e3 > zaman_farki)) var l = 0,
        o = "",
        s = db_index[e].transaction(["unfollows"], "readonly").objectStore("unfollows").index("unfollow_time").openCursor(IDBKeyRange.upperBound("Z", !0), "prev").onsuccess = function(s) {
            var e = s.target.result;
            e && 10 > l ? (null != e.value && null != e.value && (zaman_string_follow = convert_time_str(e.value.follow_time), zaman_string_unfollow = convert_time_str(e.value.unfollow_time), o = o + "<tr><td><a href='https://www.instagram.com/" + e.value.username + "/' target='_blank'>@" + e.value.username + "</a></td>                    <td >" + zaman_string_follow + "</td><td >" + zaman_string_unfollow + "</td></tr>"), l++, e.continue()) : t(o)
        }
}

function my_cookie2(e, t, l, o) {
    return void 0 === l || null === l ? (deger = localStorage.getItem(t), void 0 === deger || null === deger ? null : deger) : void(db_index[e].transaction(["settings"], "readwrite").objectStore("settings").put({
        key: t,
        value: l
    }).onsuccess = function() {
        o && o(t, e)
    }, localStorage.setItem(t, l))
}

function connect_db() {
    if (console.log("connect_db"), user_id = my_cookie2("genel", "user_id"), null != user_id) {
        $(".loadingOverlay").hide(), setTimeout(function() {
            set_input_default_values(), like_tags_toblo_olustur(), update_like_numbers(user_id), tablo_sec()
        }, 1e3), $("#nav-menu-bar").removeClass("hide"), db_sql[user_id] = window.openDatabase("autoinsta_" + user_id, "", "AutoInsta", null, function() {}), db_sql_comments[user_id] = window.openDatabase("autoinsta_comments3_" + user_id, "", "AutoInsta Comments", null, function() {}), db_sql_filters[user_id] = window.openDatabase("autoinsta_filters_" + user_id, "", "AutoInsta Filters", null, function() {});
        var e = indexedDB.open("autoinsta_" + user_id, 10);
        e.onsuccess = function(t) {
            db_index[user_id] = t.target.result, update_all()
        }
    }
}
$(".lcl_stop_collect_current_follows").click(function() {
    user_id = my_cookie2("genel", "user_id");
    null == user_id || ($(this).hide("slow"), $(".lcl_collect_current_follows").show(), my_cookie2(user_id, "white_list_cursor", "end"))
});

function start_white_list_search() {
    if (confirm("Are you sure you want to scan your current followings into whitelist?")) {
        if (user_id = my_cookie2("genel", "user_id"), null == user_id) return;
        $(".lcl_collect_current_follows").hide(), $(".lcl_stop_collect_current_follows").show(), my_cookie2(user_id, "white_list_cursor", "bos")
    }
}
$(".lcl_delete_white_list_likes_comments").click(function() {
    lcl_delete_white_list_likes_comments(), update_white_list()
}), $(".lcl_clear_white_list").click(function() {
    lcl_clear_white_list(), update_white_list()
}), $("#copy_clipboard").click(function() {
    $("#white_list_users2").show(), $("#white_list_users2").select(), text = window.getSelection().toString(), document.execCommand("copy"), $("#white_list_users2").hide(), alert("White list copied to clipboard!")
}), $(".lcl_collect_current_follows").click(function() {
    start_white_list_search()
}), $("#start_unfollow_job").click(function() {
    user_id = my_cookie2("genel", "user_id");
    null == user_id || (my_cookie2(user_id, "unfollow_scanned_users", "0"), my_cookie2(user_id, "unfollow_cursor", "bos"))
}), $("#stop_scan_btn").click(function() {
    user_id = my_cookie2("genel", "user_id");
    null == user_id || (my_cookie2(user_id, "unfollow_cursor", "end"), $(this).hide("slow"))
}), $("#remove_unfollow_job_btn").click(function() {
    user_id = my_cookie2("genel", "user_id");
    null == user_id || (my_cookie2(user_id, "unfollow_cursor", "end"), db_index[user_id].transaction(["unfollows_waiting"], "readwrite").objectStore("unfollows_waiting").clear(), $(this).hide("slow"), $("#unfollow_pool_count").html("0"), $("#stop_scan_btn").hide())
});

function update_all() {
    if (user_id = my_cookie2("genel", "user_id"), null != user_id) {
        if (!db_index.hasOwnProperty(user_id)) return void connect_db();
        if (lates_follows(user_id), lates_unfollows(user_id), error_log(user_id), lates_likes(user_id), "end" == my_cookie2(user_id, "white_list_cursor") ? ($(".lcl_collect_current_follows").show(), $(".lcl_stop_collect_current_follows").hide()) : ($(".lcl_stop_collect_current_follows").show(), $(".lcl_collect_current_follows").hide()), gecen_zaman = Date.now() - parseInt(my_cookie2(user_id, "update_statistics_last_time")), !(1e4 > gecen_zaman)) {
            "end" == my_cookie2(user_id, "unfollow_cursor") ? $("#stop_scan_btn").hide("slow") : $("#stop_scan_btn").show("slow"), $("#unfollow_scanned_users").html(my_cookie2(user_id, "unfollow_scanned_users"));
            var e = db_index[user_id].transaction(["follows"], "readonly").objectStore("follows").count();
            e.onsuccess = function(t) {
                $("#follow_pool_count").html(t.target.result)
            };
            var e = db_index[user_id].transaction(["unfollows_waiting"], "readonly").objectStore("unfollows_waiting").count();
            e.onsuccess = function(t) {
                $("#unfollow_pool_count").html(t.target.result), 0 == t.target.result ? $("#remove_unfollow_job_btn").hide() : $("#remove_unfollow_job_btn").show()
            }, license_messages(), update_like_numbers(user_id), db_sql[user_id].transaction(function(e) {
                e.executeSql("SELECT * FROM st_follow order by gun desc limit 1", [], function(e, t) {
                    var l = t.rows.length;
                    if (0 != l) {
                        $("#last_follow_statistics").html(t.rows.item(0).sayi);
                        var o = my_cookie2(user_id, "last_count_followed");
                        o != t.rows.item(0).sayi && tablo_sec(), my_cookie2(user_id, "last_count_followed", t.rows.item(0).sayi)
                    }
                }, null)
            }), db_sql[user_id].transaction(function(e) {
                e.executeSql("SELECT * FROM st_follows order by gun desc limit 1", [], function(e, t) {
                    var l = t.rows.length;
                    0 == l || $("#follows_count").html(t.rows.item(0).sayi)
                }, null)
            }), count_unfollowed(user_id), "true" == my_cookie2(user_id, "collect_white_list") ? ($("#collect_white_list").prop("checked", !0), $("#collect_likes_white_list").prop("disabled", !1), $("#collect_comments_white_list").prop("disabled", !1)) : ($("#collect_white_list").prop("checked", !1), $("#collect_likes_white_list").prop("disabled", !0), $("#collect_comments_white_list").prop("disabled", !0)), "true" == my_cookie2(user_id, "collect_likes_white_list") ? $("#collect_likes_white_list").prop("checked", !0) : $("#collect_likes_white_list").prop("checked", !1), "true" == my_cookie2(user_id, "collect_comments_white_list") ? $("#collect_comments_white_list").prop("checked", !0) : $("#collect_comments_white_list").prop("checked", !1), "true" == my_cookie2(user_id, "following_status") ? $("#following_status").prop("checked", !0) : $("#following_status").prop("checked", !1), "true" == my_cookie2(user_id, "unfollowing_status") ? $("#unfollowing_status_btn").prop("checked", !0) : $("#unfollowing_status_btn").prop("checked", !1), "true" == my_cookie2(user_id, "pool_collect_status") ? $("#pool_collect_btn").prop("checked", !0) : $("#pool_collect_btn").prop("checked", !1)
        }
    }
}
setInterval(function() {
    update_all()
}, 5e3);

function like_tags_toblo_olustur() {
    user_id = my_cookie2("genel", "user_id");
    null == user_id || (tablo = "likes_jobs", db_sql[user_id].transaction(function(e) {
        e.executeSql("SELECT * FROM " + tablo, [], function(e, t) {
            var l, o = t.rows.length;
            if (0 == o) return void $("#like_jobs_table").html(chrome.i18n.getMessage("lcl_no_data_available"));
            for (tablo_datalari = "", l = 0; l < o; l++) data_sql = t.rows.item(l).q, itemim = decodeURIComponent("#" + t.rows.item(l).q), url = "https://www.instagram.com/explore/tags/" + t.rows.item(l).q + "/", tablo_datalari = tablo_datalari + "<tr id=\"" + tablo + "-" + l + "\"><td><a target=\"_blank\" href=\"" + url + "\">" + itemim + "</a></td><td><a title=\"Delete\" data-id=\"" + tablo + "-" + l + "\" data-tablo=\"" + tablo + "\" data-sql=\"" + data_sql + "\"  class=\"btn btn-danger btn-sm delete_likes_job_js\"><span class=\"glyphicon glyphicon-remove\"></span></a></td><tr>";
            $("#like_jobs_table").html(tablo_datalari), $(".delete_likes_job_js").click(function() {
                var e = $("#" + $(this).attr("data-id")),
                    t = $(this).attr("data-tablo"),
                    l = $(this).attr("data-sql");
                l = " WHERE q=\"" + l + "\"", $(this).attr("disabled", !0), e.hide("slow"), db_sql[user_id].transaction(function(e) {
                    e.executeSql("DELETE from " + t + l)
                })
            })
        }, null)
    }))
}

function comments_tags_toblo_olustur() {
    user_id = my_cookie2("genel", "user_id");
    null == user_id || (tablo = "comments_jobs", db_sql_comments[user_id].transaction(function(e) {
        e.executeSql("SELECT * FROM " + tablo, [], function(e, t) {
            var l, o = t.rows.length;
            if (0 == o) return void $("#comments_jobs_table").html(chrome.i18n.getMessage("lcl_no_data_available"));
            for (tablo_datalari = "", l = 0; l < o; l++) data_sql = t.rows.item(l).q, itemim = decodeURIComponent(t.rows.item(l).q), url = "https://www.instagram.com/explore/tags/" + t.rows.item(l).q + "/", tablo_datalari = tablo_datalari + "<tr id=\"" + tablo + "-" + l + "\"><td><a target=\"_blank\" href=\"" + url + "\">" + itemim + "</a></td><td><a title=\"Delete\" data-id=\"" + tablo + "-" + l + "\" data-tablo=\"" + tablo + "\" data-sql=\"" + data_sql + "\"  class=\"btn btn-danger btn-sm delete_comments_job_js\"><span class=\"glyphicon glyphicon-remove\"></span></a></td><tr>";
            $("#comments_jobs_table").html(tablo_datalari), $(".delete_comments_job_js").click(function() {
                var e = $("#" + $(this).attr("data-id")),
                    t = $(this).attr("data-tablo"),
                    l = $(this).attr("data-sql");
                l = " WHERE q=\"" + l + "\"", $(this).attr("disabled", !0), e.hide("slow"), db_sql_comments[user_id].transaction(function(e) {
                    e.executeSql("DELETE from " + t + l)
                })
            })
        }, null)
    }))
}

function comments_list_add() {
    return "" == $("#comment_text").val() ? void alert("Please write some comment") : void db_sql_comments[user_id].transaction(function(e) {
        comment_text = $("#comment_text").val(), comment_text = comment_text.split("\"").join("'"), e.executeSql("INSERT INTO comments_list (comment, use_time)  VALUES (\"" + comment_text + "\", " + Date.now() + ");"), comments_lists_toblo_olustur()
    })
}
$("#comments_add").click(function() {
    comments_list_add()
});

function comments_lists_toblo_olustur() {
    user_id = my_cookie2("genel", "user_id");
    null == user_id || (tablo = "comments_list", db_sql_comments[user_id].transaction(function(e) {
        e.executeSql("SELECT * FROM " + tablo, [], function(e, t) {
            var l, o = t.rows.length;
            if (0 == o) return void $("#comments_lists_table").html(chrome.i18n.getMessage("lcl_no_data_available"));
            for (tablo_datalari = "", l = 0; l < o; l++) data_sql = t.rows.item(l).q, itemim = decodeURIComponent(t.rows.item(l).q), url = "https://www.instagram.com/explore/tags/" + t.rows.item(l).q + "/", tablo_datalari = tablo_datalari + "<tr id=\"" + tablo + "-" + l + "\"><td>" + t.rows.item(l).comment + "</td><td><a title=\"Delete\" data-id=\"" + tablo + "-" + l + "\" data-tablo=\"" + tablo + "\" data-sql=\"" + t.rows.item(l).id + "\"  class=\"btn btn-danger btn-sm delete_comments_lists_js\"><span class=\"glyphicon glyphicon-remove\"></span></a></td><tr>";
            $("#comments_lists_table").html(tablo_datalari), $(".delete_comments_lists_js").click(function() {
                var e = $("#" + $(this).attr("data-id")),
                    t = $(this).attr("data-tablo"),
                    l = $(this).attr("data-sql");
                l = " WHERE id=" + l, $(this).attr("disabled", !0), e.hide("slow"), db_sql_comments[user_id].transaction(function(e) {
                    e.executeSql("DELETE from " + t + l)
                })
            })
        }, null)
    }))
}
$("#like_tag_jobs_btn").click(function() {
    like_tags_toblo_olustur()
}), $("#comments_tag_jobs_btn").click(function() {
    comments_tags_toblo_olustur()
}), $("#comments_lists_btn").click(function() {
    comments_lists_toblo_olustur()
});

function pool_jobs_tablo_olustur(e) {
    user_id = my_cookie2("genel", "user_id");
    null == user_id || db_sql[user_id].transaction(function(t) {
        t.executeSql("SELECT * FROM " + e, [], function(t, l) {
            var o, s = l.rows.length;
            if (0 == s) return void $("#pool_jobs_table").html(chrome.i18n.getMessage("lcl_no_data_available"));
            for (tablo_datalari = "", o = 0; o < s; o++) "searches_jobs" == e ? (data_sql = l.rows.item(o).q, itemim = decodeURIComponent("#" + l.rows.item(o).q), url = "https://www.instagram.com/explore/tags/" + l.rows.item(o).q + "/") : "locations_jobs" == e ? (data_sql = l.rows.item(o).q, itemim = decodeURIComponent(l.rows.item(o).name), url = "https://www.instagram.com/explore/locations/" + l.rows.item(o).q) : (data_sql = l.rows.item(o).user_id, itemim = "@" + l.rows.item(o).screen_name, url = "https://www.instagram.com/" + l.rows.item(o).screen_name + "/"), tablo_datalari = tablo_datalari + "<tr id=\"" + e + "-" + o + "\"><td><a target=\"_blank\" href=\"" + url + "\">" + itemim + "</a></td><td><a title=\"Delete\" data-id=\"" + e + "-" + o + "\" data-tablo=\"" + e + "\" data-sql=\"" + data_sql + "\"  class=\"btn btn-danger btn-sm delete_pool_job_js\"><span class=\"glyphicon glyphicon-remove\"></span></a></td><tr>";
            $("#pool_jobs_table").html(tablo_datalari), $(".delete_pool_job_js").click(function() {
                var e = $("#" + $(this).attr("data-id")),
                    t = $(this).attr("data-tablo"),
                    l = $(this).attr("data-sql");
                l = "searches_jobs" == t || "locations_jobs" == t || "location_areas_jobs" == t ? " WHERE q=\"" + l + "\"" : " WHERE user_id=\"" + l + "\"", $(this).attr("disabled", !0), e.hide("slow"), db_sql[user_id].transaction(function(e) {
                    e.executeSql("DELETE from " + t + l)
                })
            })
        }, null)
    })
}

function pool_jobs_tablo_sec() {
    $("#from_followers_li").hasClass("active") ? pool_jobs_tablo_olustur("followers_jobs") : $("#from_commenters_li").hasClass("active") ? pool_jobs_tablo_olustur("commenters_jobs") : $("#from_searches_li").hasClass("active") ? pool_jobs_tablo_olustur("searches_jobs") : $("#from_locations_li").hasClass("active") ? pool_jobs_tablo_olustur("locations_jobs") : $("#from_location_areas_li").hasClass("active") && pool_jobs_tablo_olustur("location_areas_jobs")
}
$("#pool_jobs_modal_btn").click(function() {
    setTimeout(function() {
        pool_jobs_tablo_sec()
    }, 1e3)
}), $("#user_filters_btn").click(function() {
    set_input_default_values()
}), $("#empty_pool").click(function() {
    if (confirm("Are you sure you want to empty pool?")) {
        $("#pool_count_span").html("0"), user_id = my_cookie2("genel", "user_id");
        db_index[user_id].transaction(["follows"], "readwrite").objectStore("follows").clear();
        delete_user_filter()
    }
}), $("#empty_pool_history").click(function() {
    if (confirm("Are you sure you want to empty pool history data?")) {
        user_id = my_cookie2("genel", "user_id"), $("#pool_history_count_span").html("0");
        db_index[user_id].transaction(["unfollows"], "readwrite").objectStore("unfollows").clear()
    }
}), $("#follow_pool_count").click(function() {
    set_input_default_values(), $(".nav-tabs a[href=\"#pool_settings\"]").tab("show")
}), $("#follow_interval_input_1").change(function() {
    var e = Math.round(86400 / parseInt($("#follow_interval_input_1").val()));
    $("#lpdt_text").removeClass("hide"), $("#lpdt").html(e), _val = parseInt($(this).val()), parseInt($(this).val()) < 40 && (_val = 40), parseInt($(this).val()) > parseInt($("#follow_interval_input_2").val()) && (_val = parseInt($("#follow_interval_input_2").val()) - 1, alert("Value can not be larger than second one")), $(this).val(_val), user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "follow_interval_1", _val)
}), $("#follow_interval_input_2").change(function() {
    _val = parseInt($(this).val()), parseInt($(this).val()) < 60 && (_val = 60), parseInt($(this).val()) < parseInt($("#follow_interval_input_1").val()) && (_val = parseInt($("#follow_interval_input_1").val()) + 20, alert("Value can not be smaller than first one")), $(this).val(_val), user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "follow_interval_2", _val)
}), $("#follow_error_interval_input").change(function() {
    var e = $(this).val();
    $(this).val() < 30 && (e = 30), $(this).val(e), user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "follow_error_interval", e)
}), $("#unfollow_interval_input_1").change(function() {
    var e = parseInt($(this).val());
    e == NaN && (e = 40), parseInt($(this).val()) < 40 && (e = 40), parseInt($(this).val()) > parseInt($("#unfollow_interval_input_2").val()) && (e = parseInt($("#unfollow_interval_input_2").val()) - 1, alert("Value can not be larger than second one")), $(this).val(e), user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "unfollow_interval_1", e)
}), $("#unfollow_interval_input_2").change(function() {
    var e = parseInt($(this).val());
    e == NaN && (e = 60), parseInt($(this).val()) < 60 && (e = 60), parseInt($(this).val()) < parseInt($("#unfollow_interval_input_1").val()) && (e = parseInt($("#unfollow_interval_input_1").val()) + 20, alert("Value can not be smaller than first one")), $(this).val(e), user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "unfollow_interval_2", e)
}), $("#unfollow_error_interval_input").change(function() {
    var e = $(this).val();
    e = Math.round(e, 0), $(this).val() < 600 && (e = 600), $(this).val(e), user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "unfollow_error_interval", e)
}), $("#get_followers_interval_input").change(function() {
    _val = $(this).val(), _val = Math.round(_val, 0), 60 > $(this).val() && (_val = 60), $(this).val(_val), user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "collect_from_followers_interval", _val)
}), $("#get_followers_error_interval_input").change(function() {
    _val = $(this).val(), _val = Math.round(_val, 0), 60 > $(this).val() && (_val = 300), $(this).val(_val), user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "collect_from_followers_error_interval", _val)
}), $("#get_commenters_interval_input").change(function() {
    _val = $(this).val(), _val = Math.round(_val, 0), 60 > $(this).val() && (_val = 60), $(this).val(_val), user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "collect_from_commenters_interval", _val)
}), $("#get_comenters_error_interval_input").change(function() {
    _val = $(this).val(), _val = Math.round(_val, 0), 60 > $(this).val() && (_val = 300), $(this).val(_val), user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "collect_from_commenters_error_interval", _val)
}), $("#get_searches_interval_input").change(function() {
    _val = $(this).val(), _val = Math.round(_val, 0), 60 > $(this).val() && (_val = 60), $(this).val(_val), user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "collect_from_searches_interval", _val)
}), $("#get_searches_error_interval_input").change(function() {
    _val = $(this).val(), _val = Math.round(_val, 0), 60 > $(this).val() && (_val = 300), $(this).val(_val), user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "collect_from_searches_error_interval", _val)
}), $("#get_locations_interval_input").change(function() {
    _val = $(this).val(), _val = Math.round(_val, 0), 60 > $(this).val() && (_val = 60), $(this).val(_val), user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "collect_from_locations_interval", _val)
}), $("#get_locations_error_interval_input").change(function() {
    _val = $(this).val(), _val = Math.round(_val, 0), 60 > $(this).val() && (_val = 300), $(this).val(_val), user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "collect_from_locations_error_interval", _val)
}), $("#filter_following_count_small").change(function() {
    user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "filter_following_count_small", $(this).val()), delete_user_filter()
}), $("#filter_following_count_big").change(function() {
    user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "filter_following_count_big", $(this).val()), delete_user_filter()
}), $("#filter_followers_count_small").change(function() {
    user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "filter_followers_count_small", $(this).val()), delete_user_filter()
}), $("#filter_followers_count_big").change(function() {
    user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "filter_followers_count_big", $(this).val()), delete_user_filter()
}), $("#filter_media_count_small").change(function() {
    user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "filter_media_count_small", $(this).val()), delete_user_filter()
}), $("#filter_media_count_big").change(function() {
    user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "filter_media_count_big", $(this).val()), delete_user_filter()
}), $("#filter_black_list").change(function() {
    user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "filter_black_list", $(this).val()), delete_user_filter()
}), $("[name=private_public_filter]").change(function() {
    user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "private_public_filter", $(this).val()), delete_user_filter()
}), $("[name=gender_filter]").change(function() {
    user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "gender_filter", $(this).val()), delete_user_filter()
}), $("#filter_external_link").change(function() {
    user_id = my_cookie2("genel", "user_id"), this.checked ? my_cookie2(user_id, "filter_external_link", "true") : my_cookie2(user_id, "filter_external_link", "false"), delete_user_filter()
}), $("#pool_limit").change(function() {
    _val = Math.round($(this).val(), 0), 10 > parseInt($(this).val()) && (_val = 10), 1e3 < parseInt($(this).val()) && (_val = 1e3), $(this).val(_val), user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "pool_limit", _val)
}), $("#follow_limit").change(function() {
    _val = Math.round($(this).val(), 0), 1e3 < $(this).val() && (_val = 1e3), $(this).val(_val), user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "follow_limit", _val)
}), $("#follow_interval_input_1").change(function() {
    var e = Math.round($(this).val(), 0);
    40 > $(this).val() && (e = 40), $(this).val(e), user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "follow_interval_1", e)
}), $("#follow_interval_input_2").change(function() {
    var e = Math.round($(this).val(), 0);
    60 > $(this).val() && (e = 60), $(this).val(e), user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "follow_interval_2", e)
}), $("#unfollow_limit").change(function() {
    _val = Math.round($(this).val(), 0), 1e3 < $(this).val() && (_val = 1e3), $(this).val(_val), 0 > $(this).val() && (_val = 1), $(this).val(_val), user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "unfollow_limit", _val)
}), $("#unfollow_interval_input_1").change(function() {
    var e = Math.round($(this).val(), 0);
    40 > $(this).val() && (e = 40), $(this).val(e), user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "unfollow_interval_1", e)
}), $("#unfollow_interval_input_2").change(function() {
    var e = Math.round($(this).val(), 0);
    60 > $(this).val() && (e = 60), $(this).val(e), user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "unfollow_interval_2", e)
}), $("#days_unfollow").change(function() {
    user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "days_unfollow", $(this).val())
}), $("#auto_unfollow_days").change(function() {
    user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "auto_unfollow_days", $(this).val())
}), $("#like_interval").change(function() {
    var e = Math.round,
        t = e($(this).val(), 0),
        l = e(86400 / t);
    $("#likes-per-day").removeClass("hide"), $("#lpd-number").html(l), 30 > $(this).val() && (t = 30), $(this).val(t), user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "like_interval", t)
}), $("#like_error_interval").change(function() {
    _val = Math.round($(this).val(), 0), 300 > $(this).val() && (_val = 300), $(this).val(_val), user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "like_error_interval", _val)
}), $("#like_limit").change(function() {
    _val = Math.round($(this).val(), 0), 2e3 < $(this).val() && (_val = 2e3), 0 > $(this).val() && (_val = 2e3), $(this).val(_val), user_id = my_cookie2("genel", "user_id"), my_cookie2(user_id, "like_limit", _val)
});

function update_tag_editor(e) {
    $("#white_list_users").tagEditor("destroy"), $("#white_list_users").tagEditor({
        beforeTagSave: function(t, l, o, s, n) {
            icine_ekleme = db_index[e].transaction(["white_list2"], "readwrite").objectStore("white_list2").put({
                username: n,
                nerden: "follows"
            })
        },
        beforeTagDelete: function(t, l, o, s) {
            db_index[e].transaction(["white_list2"], "readwrite").objectStore("white_list2").index("username").openCursor(IDBKeyRange.only(s)).onsuccess = function(e) {
                var t = e.target.result;
                t && t.delete()
            }
        }
    })
}

function lcl_delete_white_list_likes_comments() {
    user_id = my_cookie2("genel", "user_id");
    null == user_id || !1 == confirm("Are you sure you want to remove likers and commenters from whitelist?") || (db_index[user_id].transaction(["white_list2"], "readwrite").objectStore("white_list2").index("username").openCursor(IDBKeyRange.lowerBound("0")).onsuccess = function(e) {
        var t = e.target.result;
        t && ("comments_likes" == t.value.nerden && t.delete(), t.continue())
    })
}

function lcl_clear_white_list() {
    user_id = my_cookie2("genel", "user_id");
    null == user_id || !1 == confirm("Are you sure want to clear all white list?") || db_index[user_id].transaction(["white_list2"], "readwrite").objectStore("white_list2").clear()
}

function update_white_list() {
    if (user_id = my_cookie2("genel", "user_id"), null != user_id) {
        var e = db_index[user_id].transaction(["white_list2"], "readwrite").objectStore("white_list2");
        e.getAll().onsuccess = function(e) {
            if (0 < e.target.result.length) {
                $("#white_list_total").html(e.target.result.length);
                var t = "";
                for (i = 0; i < e.target.result.length; i++) t = "" == t ? e.target.result[i].username : t + "," + e.target.result[i].username;
                $("#white_list_users").val(t), $("#white_list_users2").val(t)
            } else $("#white_list_total").html("0"), $("#white_list_users").val(""), $("#white_list_users2").val("");
            update_tag_editor(user_id)
        }, setTimeout(function() {
            var e = document.getElementById("tag-editorxxx");
            e.scrollTop = e.scrollHeight - e.clientHeight
        }, 3e3)
    }
}

function set_input_default_values() {
    if (user_id = my_cookie2("genel", "user_id"), null != user_id) {
        "true" == my_cookie2(user_id, "who_follow") ? $("#who_follow").prop("checked", !0) : $("#who_follow").prop("checked", !1), $("#follow_limit").val(my_cookie2(user_id, "follow_limit")), $("#unfollow_limit").val(my_cookie2(user_id, "unfollow_limit")), $("#days_unfollow").val(my_cookie2(user_id, "days_unfollow")), $("#filter_following_count_small").val(my_cookie2(user_id, "filter_following_count_small")), $("#filter_following_count_big").val(my_cookie2(user_id, "filter_following_count_big")), $("#filter_followers_count_small").val(my_cookie2(user_id, "filter_followers_count_small")), $("#filter_followers_count_big").val(my_cookie2(user_id, "filter_followers_count_big")), $("#filter_media_count_small").val(my_cookie2(user_id, "filter_media_count_small")), $("#filter_media_count_big").val(my_cookie2(user_id, "filter_media_count_big")), $("#filter_black_list").val(my_cookie2(user_id, "filter_black_list")), "true" == my_cookie2(user_id, "filter_external_link") ? $("#filter_external_link").prop("checked", !0) : $("#filter_external_link").prop("checked", !1), "both" == my_cookie2(user_id, "private_public_filter") && $("#filter_private_public").prop("checked", !0), "private" == my_cookie2(user_id, "private_public_filter") && $("#filter_private").prop("checked", !0), "public" == my_cookie2(user_id, "private_public_filter") && $("#filter_public").prop("checked", !0), "all" == my_cookie2(user_id, "gender_filter") && $("#filter_all_gender").prop("checked", !0), "females" == my_cookie2(user_id, "gender_filter") && $("#filter_females").prop("checked", !0), "males" == my_cookie2(user_id, "gender_filter") && $("#filter_males").prop("checked", !0), "males_other" == my_cookie2(user_id, "gender_filter") && $("#filter_males_unknown").prop("checked", !0), "females_other" == my_cookie2(user_id, "gender_filter") && $("#filter_females_unknown").prop("checked", !0), "true" == my_cookie2(user_id, "auto_unfollow_enable") ? $("#auto_unfollow_enable").prop("checked", !0) : $("#auto_unfollow_enable").prop("checked", !1), $("#auto_unfollow_days").val(my_cookie2(user_id, "auto_unfollow_days")), $("#follow_interval_input_1").val(my_cookie2(user_id, "follow_interval_1")), $("#follow_interval_input_2").val(my_cookie2(user_id, "follow_interval_2")), $("#follow_error_interval_input").val(my_cookie2(user_id, "follow_error_interval")), $("#unfollow_interval_input_1").val(my_cookie2(user_id, "unfollow_interval_1")), $("#unfollow_interval_input_2").val(my_cookie2(user_id, "unfollow_interval_2")), $("#unfollow_error_interval_input").val(my_cookie2(user_id, "unfollow_error_interval")), "true" == my_cookie2(user_id, "unfollow_only_bot_followed") && $("#unfollow_only_bot_followed_checkbox").prop("checked", !0), $("#get_followers_interval_input").val(my_cookie2(user_id, "collect_from_followers_interval")), $("#get_followers_error_interval_input").val(my_cookie2(user_id, "collect_from_followers_error_interval")), $("#get_commenters_interval_input").val(my_cookie2(user_id, "collect_from_commenters_interval")), $("#get_comenters_error_interval_input").val(my_cookie2(user_id, "collect_from_commenters_error_interval")), $("#get_searches_interval_input").val(my_cookie2(user_id, "collect_from_searches_interval")), $("#get_searches_error_interval_input").val(my_cookie2(user_id, "collect_from_searches_error_interval")), $("#get_locations_interval_input").val(my_cookie2(user_id, "collect_from_locations_interval")), $("#get_locations_error_interval_input").val(my_cookie2(user_id, "collect_from_locations_error_interval")), update_white_list(), $("#pool_limit").val(my_cookie2(user_id, "pool_limit")), $("#like_interval").val(my_cookie2(user_id, "like_interval")), $("#like_error_interval").val(my_cookie2(user_id, "like_error_interval")), $("#like_limit").val(my_cookie2(user_id, "like_limit")), $("#comments_interval").val(my_cookie2(user_id, "comments_interval")), $("#comments_error_interval").val(my_cookie2(user_id, "comments_error_interval")), $("#comments_limit").val(my_cookie2(user_id, "comments_limit")), "true" == my_cookie2(user_id, "home_like_status") ? $("#home_like_status").prop("checked", !0) : $("#home_like_status").prop("checked", !1), "true" == my_cookie2(user_id, "like_status") ? $("#like_status").prop("checked", !0) : $("#like_status").prop("checked", !1), "true" == my_cookie2(user_id, "comments_status") ? $("#comments_status").prop("checked", !0) : $("#comments_status").prop("checked", !1), "true" == my_cookie2(user_id, "tag_like_status") ? $("#tag_like_status").prop("checked", !0) : $("#tag_like_status").prop("checked", !1), db_sql[user_id].transaction(function(e) {
            e.executeSql("SELECT * FROM likes where likes_time=0", [], function(e, t) {
                var l = t.rows.length;
                $("#like_pool_count").html(l)
            }, null)
        }), db_sql_comments[user_id].transaction(function(e) {
            e.executeSql("SELECT * FROM comments where comments_time=0", [], function(e, t) {
                var l = t.rows.length;
                $("#comments_pool_count").html(l)
            }, null)
        });
        var e = db_index[user_id].transaction(["follows"], "readonly").objectStore("follows").count();
        e.onsuccess = function(t) {
            $("#pool_count_span").html(t.target.result)
        };
        var e = db_index[user_id].transaction(["unfollows"], "readonly").objectStore("unfollows").count();
        e.onsuccess = function(t) {
            $("#pool_history_count_span").html(t.target.result)
        }
    }
}

function delete_likes_pool() {
    var e = confirm("Do you want to empty the pool?");
    !1 == e || ($("#like_pool_count").html("0"), user_id = my_cookie2("genel", "user_id"), db_sql[user_id].transaction(function(e) {
        e.executeSql("DELETE from likes WHERE likes_time=0")
    }))
}
$("#delete_likes_pool").click(function() {
    delete_likes_pool()
});

function delete_user_filter() {
    user_id = my_cookie2("genel", "user_id"), db_sql_filters[user_id].transaction(function(e) {
        e.executeSql("DELETE from users")
    })
}

function delete_comments_pool() {
    var e = confirm("Do you want to empty the pool?");
    !1 == e || ($("#comments_pool_count").html("0"), user_id = my_cookie2("genel", "user_id"), db_sql_comments[user_id].transaction(function(e) {
        e.executeSql("DELETE from comments WHERE comments_time=0")
    }))
}
$("#delete_comments_pool").click(function() {
    delete_comments_pool()
}), $("#likes_btn").click(function() {
    setTimeout(function() {
        $("#likeSettingsForm").validate().element("#like_interval"), $("#likeSettingsForm").validate().element("#like_error_interval"), $("#likeSettingsForm").validate().element("#like_limit")
    }, 200)
}), $("#likeSettingsForm").validate({
    rules: {
        like_interval: {
            required: !0,
            min: 30
        },
        like_error_interval: {
            required: !0,
            min: 300
        },
        like_limit: {
            required: !0,
            min: 0,
            max: 2e3
        }
    }
}), $("#follow-settings-cog").click(function() {
    setTimeout(function() {
        $("#followSettingsForm").validate().element("#follow_limit"), $("#followSettingsForm").validate().element("#follow_interval_input_1"), $("#followSettingsForm").validate().element("#follow_interval_input_2"), $("#followSettingsForm").validate().element("#follow_error_interval_input"), $("#followSettingsFilters").validate().element("#filter_following_count_small"), $("#followSettingsFilters").validate().element("#filter_following_count_big"), $("#followSettingsFilters").validate().element("#filter_followers_count_small"), $("#followSettingsFilters").validate().element("#filter_followers_count_big"), $("#followSettingsFilters").validate().element("#filter_media_count_small"), $("#followSettingsFilters").validate().element("#filter_media_count_big"), $("#followSettingPoolForm").validate().element("#pool_limit"), $("#followSettingsPoolCollects").validate().element("#get_followers_interval_input"), $("#followSettingsPoolCollects").validate().element("#get_followers_error_interval_input"), $("#followSettingsPoolCollects").validate().element("#get_commenters_interval_input"), $("#followSettingsPoolCollects").validate().element("#get_comenters_error_interval_input"), $("#followSettingsPoolCollects").validate().element("#get_searches_interval_input"), $("#followSettingsPoolCollects").validate().element("#get_searches_error_interval_input"), $("#followSettingsPoolCollects").validate().element("#get_locations_interval_input"), $("#followSettingsPoolCollects").validate().element("#get_locations_error_interval_input")
    }, 200)
}), $("#followSettingsForm").validate({
    rules: {
        follow_limit: {
            min: 0,
            max: 1e3,
            step: 1
        },
        follow_interval_input_1: {
            required: !0,
            min: 40
        },
        follow_interval_input_2: {
            required: !0,
            min: 60
        },
        follow_error_interval_input: {
            required: !0,
            min: 30
        }
    }
}), $("#followSettingPoolForm").validate({
    rules: {
        pool_limit: {
            min: 0,
            max: 1e3,
            step: 1
        }
    }
}), $("#followSettingsPoolCollects").validate({
    rules: {
        get_followers_interval_input: {
            required: !0,
            min: 60
        },
        get_followers_error_interval_input: {
            required: !0,
            min: 300
        },
        get_commenters_interval_input: {
            required: !0,
            min: 60
        },
        get_comenters_error_interval_input: {
            required: !0,
            min: 300
        },
        get_searches_interval_input: {
            required: !0,
            min: 60
        },
        get_searches_error_interval_input: {
            required: !0,
            min: 300
        },
        get_locations_interval_input: {
            required: !0,
            min: 60
        },
        get_locations_error_interval_input: {
            required: !0,
            min: 300
        }
    }
}), $("#followSettingsFilters").validate({
    rules: {
        filter_following_count_small: {
            min: 0,
            step: 1
        },
        filter_following_count_big: {
            min: 0,
            step: 1
        },
        filter_followers_count_small: {
            min: 0,
            step: 1
        },
        filter_media_count_small: {
            min: 0,
            step: 1
        },
        filter_followers_count_big: {
            required: !0,
            min: 40
        },
        filter_media_count_small: {
            required: !0,
            min: 40
        },
        filter_media_count_big: {
            required: !0,
            min: 40
        }
    }
}), $("#unfollow-settings-cog").click(function() {
    setTimeout(function() {
        $("#unfollowSettingsIntervalForm").validate().element("#unfollow_limit"), $("#unfollowSettingsIntervalForm").validate().element("#unfollow_interval_input_1"), $("#unfollowSettingsIntervalForm").validate().element("#unfollow_interval_input_2"), $("#unfollowSettingsIntervalForm").validate().element("#unfollow_error_interval_input")
    }, 200)
}), $("#unfollowSettingsIntervalForm").validate({
    rules: {
        unfollow_limit: {
            required: !0,
            max: 1e3,
            step: 1
        },
        unfollow_interval_input_1: {
            required: !0,
            min: 40,
            step: 1
        },
        unfollow_interval_input_2: {
            required: !0,
            min: 60,
            step: 1
        },
        unfollow_error_interval_input: {
            required: !0,
            min: 600,
            step: 1
        }
    }
});

function convert_time_to_int(e) {
    return zaman_spl = e.split(":"), 1e3 * (60 * (60 * zaman_spl[0])) + 1e3 * (60 * zaman_spl[1])
}

function int_to_time_str(e) {
    var t = Math.floor;
    return saat = t(e / 3600000), dakika = e - 1e3 * (60 * (60 * saat)), dakika = t(dakika / 60000), 10 > saat && (saat = "0" + saat.toString()), 10 > dakika && (dakika = "0" + dakika.toString()), saat + ":" + dakika
}

function update_sleep_table(e) {
    user_id = my_cookie2("genel", "user_id"), "like" === e ? (tablo = "sleep_times_like", targetTable = "#like_sleep_times_table") : "follow" === e ? (tablo = "sleep_times_follow", targetTable = "#follow_sleep_times_table") : "unfollow" == e && (tablo = "sleep_times_unfollow", targetTable = "#unfollow_sleep_times_table"), database_i = "sleep_times_comments" == tablo ? db_sql_comments[user_id] : db_sql[user_id], database_i.transaction(function(e) {
        e.executeSql("SELECT * FROM " + tablo + " ORDER BY start_time", [], function(e, t) {
            var l, o = t.rows.length;
            if (0 == o) return void $(targetTable).html(chrome.i18n.getMessage("lcl_no_data_available"));
            for (tablo_datalari = "", l = 0; l < o; l++) start_time = t.rows.item(l).start_time, end_time = t.rows.item(l).end_time, start_time = int_to_time_str(start_time), end_time = int_to_time_str(end_time), id = t.rows.item(l).id, tablo_datalari = tablo_datalari + "<tr id=\"" + tablo + "-" + id + "\"><td>" + start_time + "</td><td>" + end_time + "</td><td><a title=\"Delete\" data-id=\"" + tablo + "-" + id + "\" data-tablo=\"" + tablo + "\" data-sql=\"" + id + "\"  class=\"btn btn-danger btn-sm delete_sleep_js\"><span class=\"glyphicon glyphicon-remove\"></span></a></td><tr>";
            $(targetTable).html(tablo_datalari), $(".delete_sleep_js").click(function() {
                var e = $("#" + $(this).attr("data-id")),
                    t = $(this).attr("data-tablo"),
                    l = $(this).attr("data-sql");
                l = " WHERE id=" + l, $(this).attr("disabled", !0), e.hide(), database_i.transaction(function(e) {
                    e.executeSql("DELETE from " + t + l)
                })
            })
        }, null)
    })
}

function insert_time(e) {
    return "" == $(".start_time").val() || "" == $(".end_time").val() ? void alert("please fill times") : ("like" === e ? (inputStartTime = $("#start_time_like"), inputEndTime = $("#end_time_like"), tablosu = "sleep_times_like") : "follow" === e ? (inputStartTime = $("#start_time_follow"), inputEndTime = $("#end_time_follow"), tablosu = "sleep_times_follow") : "unfollow" == e && (inputStartTime = $("#start_time_unfollow"), inputEndTime = $("#end_time_unfollow"), tablosu = "sleep_times_unfollow"), zaman1 = convert_time_to_int(inputStartTime.val()), zaman2 = convert_time_to_int(inputEndTime.val()), zaman1 >= zaman2 ? void alert("Start Time must be smaller than End Time") : void(user_id = my_cookie2("genel", "user_id"), database_i = "sleep_times_comments" == tablosu ? db_sql_comments[user_id] : db_sql[user_id], database_i.transaction(function(e) {
        e.executeSql("INSERT INTO " + tablosu + " (start_time, end_time)  VALUES (" + zaman1 + ", " + zaman2 + ");")
    }), update_sleep_table(e)))
}
$(".advanced_sleep_time").change(function() {
    var e = Math.round($(this).val(), 0);
    if (59 < $(this).val()) var e = 59;
    if (1 > $(this).val()) var e = 1;
    $(this).val(e)
});

function insertAdvancedSleepTime(e) {
    if ("like" === e) {
        if (!$("#like_advanced_sleep_time_input").val()) return void alert("Please insert a time.");
        min = $("#like_advanced_sleep_time_input").val(), tablosu = "sleep_times_like"
    } else if ("follow" === e) {
        if (!$("#follow_advanced_sleep_time_input").val()) return void alert("Please insert a time.");
        min = $("#follow_advanced_sleep_time_input").val(), tablosu = "sleep_times_follow"
    } else if ("unfollow" === e) {
        if (!$("#unfollow_advanced_sleep_time_input").val()) return void alert("Please insert a time.");
        min = $("#unfollow_advanced_sleep_time_input").val(), tablosu = "sleep_times_unfollow"
    }
    var t = 1e3 * (60 * min),
        l = my_cookie2("genel", "user_id"),
        o = db_sql[l];
    o.transaction(function(e) {
        for (var l = 0; 24 > l; l++) {
            var o = 1e3 * (60 * (60 * l)),
                s = [o, o + t];
            e.executeSql("INSERT INTO " + tablosu + " (start_time, end_time)  VALUES (" + s[0] + ", " + s[1] + ");")
        }
    }), update_sleep_table(e)
}
$("#sleep_like_btn").click(function() {
    setTimeout(function() {
        update_sleep_table("like")
    }, 500)
}), $("#sleep_follow_btn").click(function() {
    setTimeout(function() {
        update_sleep_table("follow")
    }, 500)
}), $("#sleep_unfollow_btn").click(function() {
    setTimeout(function() {
        update_sleep_table("unfollow")
    }, 500)
}), $("#insert_time_like").click(function() {
    insert_time("like")
}), $("#insert_time_follow").click(function() {
    insert_time("follow")
}), $("#insert_time_unfollow").click(function() {
    insert_time("unfollow")
}), $("#add_like_advanced_sleep_time").click(function() {
    insertAdvancedSleepTime("like")
}), $("#add_follow_advanced_sleep_time").click(function() {
    insertAdvancedSleepTime("follow")
}), $("#add_unfollow_advanced_sleep_time").click(function() {
    insertAdvancedSleepTime("unfollow")
}), $(".start_time, .end_time").timepicker({
    showMeridian: !1,
    minuteStep: 1
}), $("#likes_btn").click(function() {
    set_input_default_values(), like_tags_toblo_olustur()
}), $("#like-tab").click(function() {
    set_input_default_values(), like_tags_toblo_olustur()
}), $("#comments_btn").click(function() {
    set_input_default_values(), comments_tags_toblo_olustur()
}), $("#settings_modal_btn").click(function() {
    set_input_default_values()
}), $("#unfollow_btn").click(function() {
    set_input_default_values()
}), $("#whitelist_btn").click(function() {
    set_input_default_values()
}), $("#from_followers_tab_btn, #follow-settings-cog").click(function() {
    pool_jobs_tablo_olustur("followers_jobs")
}), $("#from_commenters_tab_btn").click(function() {
    pool_jobs_tablo_olustur("commenters_jobs")
}), $("#from_searches_tab_btn").click(function() {
    pool_jobs_tablo_olustur("searches_jobs")
}), $("#from_locations_tab_btn").click(function() {
    pool_jobs_tablo_olustur("locations_jobs")
}), $("#from_location_areas_tab_btn").click(function() {
    pool_jobs_tablo_olustur("location_areas_jobs")
}), $("#home_like_status").change(function() {
    user_id = my_cookie2("genel", "user_id"), this.checked ? my_cookie2(user_id, "home_like_status", "true") : my_cookie2(user_id, "home_like_status", "false")
}), $("#like_status").change(function() {
    user_id = my_cookie2("genel", "user_id"), this.checked ? my_cookie2(user_id, "like_status", "true") : my_cookie2(user_id, "like_status", "false")
}), $("#tag_like_status").change(function() {
    user_id = my_cookie2("genel", "user_id"), this.checked ? my_cookie2(user_id, "tag_like_status", "true") : my_cookie2(user_id, "tag_like_status", "false")
}), $("#comments_status").change(function() {
    user_id = my_cookie2("genel", "user_id"), this.checked ? my_cookie2(user_id, "comments_status", "true") : my_cookie2(user_id, "comments_status", "false")
}), $("#collect_white_list").change(function() {
    user_id = my_cookie2("genel", "user_id"), this.checked ? ($("#collect_likes_white_list").prop("disabled", !1), $("#collect_comments_white_list").prop("disabled", !1), my_cookie2(user_id, "collect_white_list", "true")) : ($("#collect_likes_white_list").prop("disabled", !0), $("#collect_comments_white_list").prop("disabled", !0), my_cookie2(user_id, "collect_white_list", "false"))
}), $("#collect_likes_white_list").change(function() {
    user_id = my_cookie2("genel", "user_id"), this.checked ? my_cookie2(user_id, "collect_likes_white_list", "true") : my_cookie2(user_id, "collect_likes_white_list", "false")
}), $("#collect_comments_white_list").change(function() {
    user_id = my_cookie2("genel", "user_id"), this.checked ? my_cookie2(user_id, "collect_comments_white_list", "true") : my_cookie2(user_id, "collect_comments_white_list", "false")
}), $("#following_status").change(function() {
    user_id = my_cookie2("genel", "user_id"), this.checked ? (my_cookie2(user_id, "following_status", "true"), my_cookie2(user_id, "last_follow_time", Date.now()), my_cookie2(user_id, "pool_collect_status", "true")) : (my_cookie2(user_id, "following_status", "false"), my_cookie2(user_id, "pool_collect_status", "false"))
}), $("#unfollowing_status_btn").change(function() {
    if (this.checked) {
        if (user_id = my_cookie2("genel", "user_id"), null == user_id) return;
        my_cookie2(user_id, "unfollow_scanned_users", "0"), my_cookie2(user_id, "unfollow_cursor", "bos"), my_cookie2(user_id, "unfollowing_status", "true"), my_cookie2(user_id, "last_unfollow_time", Date.now()), my_cookie2(user_id, "unfollow_ban", "0")
    } else my_cookie2(user_id, "unfollowing_status", "false")
}), $("#unfollow_only_bot_followed_checkbox").change(function() {
    user_id = my_cookie2("genel", "user_id"), this.checked ? my_cookie2(user_id, "unfollow_only_bot_followed", "true") : my_cookie2(user_id, "unfollow_only_bot_followed", "false")
}), $("#start_unfollow_job").click(function() {
    user_id = my_cookie2("genel", "user_id");
    null == user_id || (my_cookie2(user_id, "unfollow_scanned_users", "0"), my_cookie2(user_id, "unfollow_cursor", "bos"))
}), $("#who_follow").change(function() {
    this.checked ? my_cookie2(user_id, "who_follow", "true") : my_cookie2(user_id, "who_follow", "false")
}), $("#auto_unfollow_enable").change(function() {
    this.checked ? my_cookie2(user_id, "auto_unfollow_enable", "true") : my_cookie2(user_id, "auto_unfollow_enable", "false")
}), jQuery.extend(jQuery.validator.messages, {
    required: "This field is required.",
    remote: "Please fix this field.",
    email: "Please enter a valid email address.",
    url: "Please enter a valid URL.",
    date: "Please enter a valid date.",
    dateISO: "Please enter a valid date (ISO).",
    number: "Please enter a valid number.",
    digits: "Please enter only digits.",
    creditcard: "Please enter a valid credit card number.",
    equalTo: "Please enter the same value again.",
    accept: "Please enter a value with a valid extension.",
    maxlength: jQuery.validator.format("Please enter no more than {0} characters."),
    minlength: jQuery.validator.format("Please enter at least {0} characters."),
    rangelength: jQuery.validator.format("Please enter a value between {0} and {1} characters long."),
    range: jQuery.validator.format("Please enter a value between {0} and {1}."),
    max: jQuery.validator.format("Your account will be in risk. Please enter less than {0} (max safe value)."),
    min: jQuery.validator.format("Your account will be in risk. Please enter more than {0} (min safe time).")
}), $("#like-refresh-all-button, #like-tab").click(function() {
    setTimeout(function() {
        set_input_default_values(), like_tags_toblo_olustur(), update_like_numbers(user_id), tablo_sec()
    }, 1e3)
});

function update_like_numbers(e) {
    count_like_pool(e), count_like_hashtags(e), count_liked(e)
}

function count_like_pool(e) {
    db_sql[e].transaction(function(e) {
        e.executeSql("SELECT * FROM likes where likes_time=0", [], function(e, t) {
            var l = t.rows.length;
            $("#like_pool_count").html(l)
        }, null)
    })
}

function count_like_hashtags(e) {
    db_sql[e].transaction(function(e) {
        e.executeSql("SELECT * FROM likes_jobs", [], function(e, t) {
            var l = t.rows.length;
            $("#like_hashtags_count").html(l)
        }, null)
    })
}

function count_liked(e) {
    db_sql[e].transaction(function(t) {
        t.executeSql("SELECT * FROM likes where likes_time>0", [], function(t, l) {
            var o = l.rows.length;
            $("#liked_count").html(o);
            var s = my_cookie2(e, "last_count_liked");
            s != o && tablo_sec(), my_cookie2(e, "last_count_liked", o)
        }, null)
    })
}
$("#follow-refresh-all-button, #follow-tab").click(function() {
    setTimeout(function() {
        set_input_default_values(), tablo_sec(), lates_follows(user_id)
    }, 1e3)
}), $("#followers-refresh-all-button, #stats-tab").click(function() {
    setTimeout(function() {
        set_input_default_values(), tablo_sec()
    }, 1e3)
}), $("#unfollow-refresh-all-button, #unfollow-tab").click(function() {
    setTimeout(function() {
        set_input_default_values(), tablo_sec(), lates_unfollows(user_id)
    }, 1e3)
});

function count_unfollowed(e) {
    db_sql[e].transaction(function(t) {
        t.executeSql("SELECT * FROM st_unfollow order by gun desc limit 1", [], function(t, l) {
            var o = l.rows.length;
            if (0 != o) {
                $("#unfollowed_count").html(l.rows.item(0).sayi);
                var s = my_cookie2(e, "last_count_unfollowed");
                s != l.rows.item(0).sayi && tablo_sec(), my_cookie2(e, "last_count_unfollowed", l.rows.item(0).sayi)
            }
        }, null)
    })
}
$("#license-tab").click(function() {
    var e = my_cookie2("genel", "user_id"),
        t = my_cookie2(e, "username");
    /*$.ajax({
        url: "https://autoinsta.me/func/check",
        data: {
            userid: e,
            username: t
        },
        method: "POST",
        dataType: "json"
    }).done(function(t) {
        $("#client_username").val(my_cookie2("genel", "username")), "success" == t.result ? (my_cookie2(e, "left_time", t.left_time), $("#time_left").val(moment.duration(parseInt(t.left_time)).humanize()), $("#license_modal").modal(), $("#license-expired-msg").addClass("hide")) : (my_cookie2(e, "left_time", 0), $("#time_left").val("Expired, please renew."), $("#license_modal").modal(), $("#license-expired-msg").removeClass("hide"))
    })*/
    console.log("a")
}), $("#account-tab").click(function() {
    var e = my_cookie2("genel", "user_id"),
        t = my_cookie2(e, "username");
    $("#client_username").val(my_cookie2("genel", "username")), $.ajax({
        url: "https://autoinsta.me/func/check",
        data: {
            userid: e,
            username: t
        },
        method: "POST",
        dataType: "json"
    }).done(function(t) {
        "success" == t.result ? (0 == t.reward ? $("#input_email_div").removeClass("hide") : 1 == t.reward && $("#input_email_div").addClass("hide"), my_cookie2(e, "left_time", t.left_time), $("#time_left").val(moment.duration(parseInt(t.left_time)).humanize()), $("#license-expired-msg").addClass("hide")) : (0 == t.reward ? $("#input_email_div").removeClass("hide") : 1 == t.reward && $("#input_email_div").addClass("hide"), my_cookie2(e, "left_time", 0), $("#time_left").val("Expired, please renew."), $("#license-expired-msg").removeClass("hide"))
    }), generateSettings()
});

function validateEmail(e) {
    var t = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return t.test(e)
}
$("#email_save_btn").click(function() {
    var e = my_cookie2("genel", "user_id"),
        t = $("#inputEmail").val(),
        l = validateEmail(t);
        /*
    l ? $.ajax({
        url: "https://autoinsta.me/func/setMail?userid=" + e + "&mail=" + t,
        method: "GET"
    }).done(function(e) {
        e && "success" == e.result ? alert("Thank you! Please check your email and click the link we sent you to confirm.") : alert("Something's not right. You may have already entered an email address but haven't confirmed it.")
    }).fail(function(e) {
        console.log("DEBUG_fk24 | data: ", e)
    }) : alert("Please enter a valid email address.")
    */
    console.log("b")
}), $(function() {
    var e = 0,
        t = 0;
    e = setInterval(function() {
        t++, $("#progress-bar-loading > .progress-bar").attr("style", "width:" + t + "%"), t == 100 && clearInterval(e)
    }, 30), $(".btn-default").click(function() {
        clearInterval(e)
    }), getWhatsnew()
});
var copyTextareaBtn = document.querySelector("#exportSettingsBtn");
copyTextareaBtn.addEventListener("click", function() {
    var e = document.querySelector("#settingsExport");
    e.select();
    try {
        var t = document.execCommand("copy"),
            l = t ? "successful" : "unsuccessful";
        $("#exportSettingsBtn").text("Copied")
    } catch (e) {
        console.log("Oops, unable to copy"), $("#exportSettingsBtn").text("Error")
    }
});
var saveList = ["auto_unfollow_days", "auto_unfollow_enable", "collect_comments_white_list", "collect_from_followers_error_interval", "collect_from_followers_interval", "collect_from_locations_error_interval", "collect_from_locations_interval", "collect_from_searches_error_interval", "collect_from_searches_interval", "collect_likes_white_list", "collect_white_list", "days_unfollow", "filter_black_list", "filter_external_link", "filter_followers_count_big", "filter_followers_count_small", "filter_following_count_big", "filter_following_count_small", "filter_media_count_big", "filter_media_count_small", "follow_error_interval", "follow_interval", "follow_interval_1", "follow_interval_2", "follow_limit", "home_like_status", "like_error_interval", "like_interval", "like_limit", "pool_limit", "private_public_filter", "queryBatchDelayTime", "queryErrorWaitTime", "unfollow_error_interval", "unfollow_interval", "unfollow_interval_1", "unfollow_interval_2", "unfollow_limit", "unfollow_only_bot_followed", "unfollowing_status", "white_list_users"];

function generateSettings() {
    const e = localStorage,
        t = Object.keys(e).filter(e => saveList.includes(e)).reduce((t, l) => (t[l] = e[l], t), {}),
        l = JSON.stringify(t);
    $("#settingsExport").val(l)
}
$("#importSettingsBtn").click(function() {
    let e = $("#settingImport").val();
    if ("" == e) return void $("#importSettingsBtn").text("Empty, try again");
    if (!tryParseJSON(e)) return void $("#importSettingsBtn").text("Format error, try again");
    let t = JSON.parse(e),
        l = Object.keys(t),
        o = l.every(e => saveList.includes(e));
    return o ? void(Object.keys(t).forEach(e => {
        localStorage.setItem(e, t[e])
    }), $("#importSettingsBtn").text("Imported")) : void $("#importSettingsBtn").text("Must contain no extra items")
});

function tryParseJSON(e) {
    try {
        var t = JSON.parse(e);
        if (t && "object" == typeof t && 0 != Object.keys(t).length) return !0
    } catch (t) {}
    return !1
}
$(document).on("click", ".navbar-collapse.in", function(t) {
    $(t.target).is("a") && "dropdown-toggle" != $(t.target).attr("class") && $(this).collapse("hide")
});

function backupIndexDbTable(e, t) {
    return new Promise(l => {
        let o = [];
        db_index[user_id].transaction([e], "readwrite").objectStore(e).index(t).openCursor(IDBKeyRange.lowerBound("0")).onsuccess = function(e) {
            var t = e.target.result;
            t ? (o.push(t.value), t.continue()) : l(o)
        }
    })
}

function backupWebsqlTable(e, t) {
    let l = [],
        o = db_sql;
    return t && (o = "filters" == t ? db_sql_filters : db_sql_comments), new Promise(t => {
        o[user_id].transaction(function(o) {
            o.executeSql("SELECT * FROM " + e, [], function(e, o) {
                for (let t = 0; t < o.rows.length; t++) l.push(o.rows.item(t));
                t(l)
            }, null)
        })
    })
}

function backupLocalStorage() {
    let e = [];
    for (let t, l = 0; l < localStorage.length; l++) t = localStorage.key(l), e.push({
        key: t,
        value: localStorage.getItem(t)
    });
    return e
}

function backupIndexDb() {
    let e = {};
    return Promise.all([backupIndexDbTable("white_list2", "username"), backupIndexDbTable("follows_done", "user_id"), backupIndexDbTable("follows", "user_id"), backupIndexDbTable("unfollows", "unfollow_time")]).then(t => ([e.white_list2, e.follows_done, e.follows, e.unfollows] = t, e))
}

function backupWebsql() {
    let e = {};
    return Promise.all([backupWebsqlTable("commenters_jobs"), backupWebsqlTable("followers_jobs"), backupWebsqlTable("likes_jobs"), backupWebsqlTable("locations_jobs"), backupWebsqlTable("searches_jobs"), backupWebsqlTable("sleep_times_follow"), backupWebsqlTable("sleep_times_like"), backupWebsqlTable("sleep_times_unfollow")]).then(t => ([e.commenters_jobs, e.followers_jobs, e.likes_jobs, e.locations_jobs, e.searches_jobs, e.sleep_times_follow, e.sleep_times_like, e.sleep_times_unfollow] = t, e))
}

function backupWebsql_comments() {
    let e = {};
    return Promise.all([backupWebsqlTable("comments", "comments"), backupWebsqlTable("comments_jobs", "comments"), backupWebsqlTable("comments_list", "comments"), backupWebsqlTable("sleep_times_comments", "comments"), backupWebsqlTable("sqlite_sequence", "comments"), backupWebsqlTable("st_comments", "comments")]).then(t => ([e.comments, e.comments_jobs, e.comments_list, e.sleep_times_comments, e.sqlite_sequence, e.st_comments] = t, e))
}

function backupWebsql_filters() {
    let e = {};
    return Promise.all([backupWebsqlTable("users", "filters")]).then(t => ([e.users] = t, e))
}

function backup() {
    let e = {};
    Promise.all([backupLocalStorage(), backupIndexDb(), backupWebsql()]).then(l => {
        [e.localStorage, e.indexDB, e.websql] = l;
        let o = JSON.stringify(e),
            s = my_cookie2("genel", "username"),
            n = Date.now();
        var t = new Blob([o], {
            type: "text/plain;charset=utf-8"
        });
        saveAs(t, "autoinsta_" + s + "_" + moment(n).format("YYYYMMDD_HH_mm") + ".json")
    })
}

function revertLocalStorage(e) {
    return new Promise((t, l) => {
        try {
            let l = localStorage.getItem("user_id"),
                o = localStorage.getItem("username");
            localStorage.clear();
            for (let t of e.localStorage) localStorage.setItem(t.key, t.value);
            localStorage.setItem("user_id", l), localStorage.setItem("username", o), t()
        } catch (t) {
            l(t)
        }
    })
}

function revertIndexDbTable(e, t) {
    let l = db_index[user_id].transaction([t], "readwrite").objectStore(t);
    l.clear();
    let o = e.indexDB[t].map(e => new Promise((t, o) => {
        let s = l.put(e);
        s.onsuccess = () => t(), s.onerror = t => o(t)
    }));
    return Promise.all(o)
}

function revertIndexDb(e) {
    return Promise.all([revertIndexDbTable(e, "white_list2"), revertIndexDbTable(e, "follows_done"), revertIndexDbTable(e, "follows"), revertIndexDbTable(e, "unfollows")]).then(() => {
        console.log("revertIndexDb success")
    })
}

function revertWebsqlTable(e, t, l) {
    let o = db_sql,
        s = "websql";
    l && (o = "filters" == l ? db_sql_filters : db_sql_comments, s = s + "_" + l);
    let n = new Promise((e, l) => {
            o[user_id].transaction(function(o) {
                o.executeSql(`DELETE FROM ${t}`, [], () => {
                    e()
                }, (e, t) => {
                    l(t)
                })
            })
        }),
        a = new Promise((l, n) => {
            try {
                let n = e[s][t];
                o[user_id].transaction(function(e) {
                    for (let l of n) {
                        let o = Object.entries(l),
                            s = o.map(e => e[0]).join(","),
                            n = e => "string" == typeof e ? "'" + e + "'" : e,
                            a = o.map(e => e[1]).map(e => n(e)).join(","),
                            r = `INSERT INTO ${t} (${s}) VALUES (${a});`;
                        e.executeSql(r, [], () => {}, (e, t) => {
                            console.log(t), console.log("cmd", r)
                        })
                    }
                    l()
                })
            } catch (t) {
                n(t)
            }
        });
    return n.then(() => a)
}

function revertWebsql(e) {
    return Promise.all([revertWebsqlTable(e, "commenters_jobs"), revertWebsqlTable(e, "followers_jobs"), revertWebsqlTable(e, "likes_jobs"), revertWebsqlTable(e, "locations_jobs"), revertWebsqlTable(e, "searches_jobs"), revertWebsqlTable(e, "sleep_times_follow"), revertWebsqlTable(e, "sleep_times_like"), revertWebsqlTable(e, "sleep_times_unfollow")]).then(() => {
        console.log("revertWebsql success")
    })
}

function revertWebsql_comments(e) {
    return Promise.all([revertWebsqlTable(e, "comments", "comments"), revertWebsqlTable(e, "comments_jobs", "comments"), revertWebsqlTable(e, "comments_list", "comments"), revertWebsqlTable(e, "sleep_times_comments", "comments"), revertWebsqlTable(e, "sqlite_sequence", "comments"), revertWebsqlTable(e, "st_comments", "comments")]).then(() => {
        console.log("revertWebsql_comments success")
    })
}

function revertWebsql_filters(e) {
    return Promise.all([revertWebsqlTable(e, "users", "filters")]).then(() => {
        console.log("revertWebsql_filters success")
    })
}

function revert() {
    let e = document.getElementById("import_data_file").files;
    if (e && 0 < e.length) {
        var t = e[0],
            l = new FileReader;
        l.onload = function() {
            let e = JSON.parse(this.result);
            Promise.all([revertLocalStorage(e), revertIndexDb(e), revertWebsql(e)]).then(() => {
                console.log("revert success!"), alert("Revert successful. Cheers!")
            }).catch(t => {
                console.log("revert failed:", t), alert("Revert failed. Make sure the recovery file hasn't been altered.")
            })
        }, l.readAsText(t)
    }
}
$("#export_data_btn").click(function() {
    console.log("begin backup"), backup()
}), $("#import_data_file").change(function() {
    console.log("begin revert"), revert()
});

function getWhatsnew() {
    var e = chrome.runtime.getManifest().version;
    $("#version").html("Version " + e), $("#version_home").html("V " + e)
}
$("#whatsnew-tab").click(function() {
    getWhatsnew(), $("#update-info-modal").modal("show")
}), $("#share_btn").click(function() {
    var e = my_cookie2("genel", "user_id");
    /*$.ajax({
        url: "https://autoinsta.me/func/getShareUrl?userid=" + e,
        method: "GET"
    }).done(function(e) {
        if (e && e.url) {
            var t = e.url;
            $("#url_box").val(t);
            var l = document.querySelector("#url_box");
            l.select();
            try {
                var o = document.execCommand("copy"),
                    s = o ? "successful" : "unsuccessful";
                $("#share_btn").text(chrome.i18n.getMessage("lcl_copied"))
            } catch (e) {
                console.log("Oops, unable to copy"), $("#share_btn").text(chrome.i18n.getMessage("lcl_error"))
            }
        }
    })*/
    console.log("c");
}); 
/*
$.ajax({
    url: "http://autoinsta.me/func/notice",
    method: "GET"
}).done(function(e) {
    if ("" != e) {
        let t = localStorage.getItem("notice_str");
        e == t ? $("#notice_box").addClass("hide") : (localStorage.setItem("notice_str", e), $("#notice_box").removeClass("hide"), $("#notice-text").html(e))
    } else $("#notice_box").addClass("hide")
});
*/
console.log("D");