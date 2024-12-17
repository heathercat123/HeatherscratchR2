function JSsetEditMode(e) {
    return e ? app.navigate("editor", {
        trigger: !0,
        replace: !0
    }) : app.navigate("player", {
        trigger: !0,
        replace: !0
    }),
    !0
}
function JSsetPresentationMode(e) {
    return e ? app.navigate("fullscreen", {
        trigger: !0
    }) : history.go(-1),
    !0
}
function JSeditTitle(e) {
    Scratch.FlashApp.model.save({
        title: e,
        visibility: "visible"
    })
}
function JSlogin(e) {
    Scratch.FlashApp.lastEditorOp = e,
    $("#login-dialog").modal("show")
}
function JScreateProject(e, t) {
    console.log("JScreateProject(redirect:", e, "title:", t, ")");
    var n = new Scratch.ProjectThumbnail({
        title: t
    });
    e ? n.create({
        success: function (e, t) {
            JSredirectTo(e.id, !0)
        }
    }) : n.create({
        success: function (e, n) {
            Scratch.FlashApp.ASobj.ASsetNewProject(e.id, t)
        }
    })
}
function JSremixProject() {
    console.log("JSremixProject"),
    Scratch.FlashApp.model.remix({
        success: function (e, t) {
            Scratch.FlashApp.ASobj.ASsetNewProject(e.id, e.title)
        }
    })
}
function JScopyProject() {
    console.log("JScopyProject"),
    Scratch.FlashApp.model.copy({
        success: function (e, t) {
            Scratch.FlashApp.ASobj.ASsetNewProject(e.id, e.title)
        }
    })
}
function JSshareProject() {
    Scratch.FlashApp.model.share()
}
function JSredirectTo(e, t) {
    console.log("JSredirectTo", e, t),
    isNaN(e) ? e == "home" ? window.location.href = "/" : e == "profile" ? window.location.href = "/users/" + Scratch.LoggedInUser.get("username") : e == "mystuff" ? window.location.href = "/mystuff/" : e == "settings" ? window.location.href = "/accounts/password_change/" : e == "logout" && (window.location.href = "/accounts/logout/") : window.location.href = "/projects/" + e + (t ? "/#editor" : "")
}
function JSsetFlashDragDrop(e) {
    Scratch.FlashApp.ASobj.ondragover = function (e) {
        e.preventDefault(),
        e.stopPropagation()
    },
    Scratch.FlashApp.ASobj.ondrop = e ? handleDrop : null
}
function handleDrop(e) {
    var t = e.clientX,
    n = e.clientY,
    r = e.dataTransfer.getData("Text"),
    i = e.dataTransfer.getData("URL");
    r ? Scratch.FlashApp.ASobj.ASdropURL(r, t, n) : i && FA.obj.ASdropURL(i, t, n);
    var s = e.dataTransfer.files.length;
    for (var o = 0; o < s; o++)
        loadFile(e.dataTransfer.files[o], t, n);
    e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0
}
function loadFile(e, t, n) {
    function r(e) {
        console.log("Error loading dropped file: " + e.target.error.code)
    }
    function i(e) {
        var r = e.target.result;
        r.length > 0 && Scratch.FlashApp.ASobj.ASdropFile(s, r, t, n)
    }
    if (window.FileReader == null) {
        console.log("FileReader API not supported by this browser");
        return
    }
    var s = "name" in e ? e.name : e.fileName,
    o = new FileReader;
    o.onerror = r,
    o.onloadend = i,
    o.readAsDataURL(e)
}
function JSsetProjectStats(e, t, n, r) {
    $("#script-count").html(Scratch.FlashApp.ASobj.ASscriptCount()),
    $("#sprite-count").html(Scratch.FlashApp.ASobj.ASspriteCount()),
    n ? $("#cloud-log").show() : $("#cloud-log").hide(),
    console.log("blah " + r),
    r && (console.log("url found"), console.log($("#old-scratch-project").removeClass("hide")), $("#old-scratch-project").removeClass("hide"), $("#old-scratch-project .button").attr("href", r), $("#old-scratch-project").show())
}
Scratch.Models = Scratch.Models || {}, Scratch.Models.TipBar = Backbone.Model.extend({
    defaults: {
        currentTip: "",
        isOpen: !1,
        stackPos: 0,
        urlStack: [],
        tipsMap: {
            home: Scratch.ROOT_URL + "/help/studio/tips/home",
            scratchUI: Scratch.ROOT_URL + "/help/studio/tips/ui/editor-map",
            paint: Scratch.ROOT_URL + "/help/studio/tips/ui/image-editor-map",
            getStarted: Scratch.ROOT_URL + "/help/studio/tips/howto/get-started-1",
            "changeXposBy:": Scratch.ROOT_URL + "/help/studio/tips/blocks/change-x",
            "changeYposBy:": Scratch.ROOT_URL + "/help/studio/tips/blocks/change-y",
            heading: Scratch.ROOT_URL + "/help/studio/tips/blocks/direction",
            "glideSecs:toX:y:elapsed:from:": Scratch.ROOT_URL + "/help/studio/tips/blocks/glide",
            "gotoSpriteOrMouse:": Scratch.ROOT_URL + "/help/studio/tips/blocks/go-to",
            "gotoX:y:": Scratch.ROOT_URL + "/help/studio/tips/blocks/go-to-xy",
            bounceOffEdge: Scratch.ROOT_URL + "/help/studio/tips/blocks/if-on-edge-bounce",
            "forward:": Scratch.ROOT_URL + "/help/studio/tips/blocks/move-steps",
            "heading:": Scratch.ROOT_URL + "/help/studio/tips/blocks/point-direction",
            "pointTowards:": Scratch.ROOT_URL + "/help/studio/tips/blocks/point-towards",
            "say:": Scratch.ROOT_URL + "/help/studio/tips/blocks/say",
            "say:duration:elapsed:from:": Scratch.ROOT_URL + "/help/studio/tips/blocks/say-for-seconds",
            "turnLeft:": Scratch.ROOT_URL + "/help/studio/tips/blocks/turn-left",
            "turnRight:": Scratch.ROOT_URL + "/help/studio/tips/blocks/turn-right",
            "xpos:": Scratch.ROOT_URL + "/help/studio/tips/blocks/set-x",
            "ypos:": Scratch.ROOT_URL + "/help/studio/tips/blocks/set-y"
        }
    }
}), Scratch.Views = Scratch.Views || {}, Scratch.Views.TipBar = Backbone.View.extend({
    el: "#tip-bar",
    events: {
        "click .toggle-control": "toggle",
        "click #tip-bar-inner.tipsclosed": "toggle",
        "click .close-circle-dark": "toggle",
        "click .tip-home": function () {
            this.navTo("home")
        },
        "click a": "navByLink",
        "click .accordion-heading": "accordionSectionToggled"
    },
    template: _.template($("#template-tip-bar").html()),
    initialize: function () {
        this.originalWidth = this.$el.css("width");
        var e = this;
        this.a = this.model.attributes,
        this.$w = $(window),
        window.tip_bar_api = {
            open: function (t) {
                e.open(t)
            },
            close: function () {
                return e.close()
            },
            show: function () {
                return e.show()
            },
            hide: function () {
                return e.$el.hide()
            },
            toggle: function () {
                return e.toggle()
            },
            load: function (t) {
                return e.navTo(t)
            }
        },
        this.$w.on("resize", function () {
            e.resize()
        }),
        this.model.on("change:currentTip", this.render, this),
        this.$el.html(this.template(this.a)),
        this.$tipContent = this.$tipContent || this.$el.find(".tip-content"),
        this.$tipHeader = this.$tipHeader || this.$el.find(".tip-header"),
        this.$tipInner = this.$tipInner || this.$el.find("#tip-bar-inner"),
        this.$tipContentContainer = this.$tipContentContainer || this.$tipContent.find("#tip-content-container");
        var t = $.urlParam("tip_bar");
        this.trackingStarted = $.Deferred(),
        t ? (this.trackingStarted.resolve(), this.open(t, "trackPath")) : this.navTo("home")
    },
    toggle: function () {
        this.model.get("isOpen") ? (this.close(), _gaq.push(["_trackEvent", "project", "tip_bar_close"])) : (this.open(this.a.currentTip), _gaq.push(["_trackEvent", "project", "tip_bar_open"]))
    },
    open: function (e) {
        var t = this;
        return this.trackingStarted.resolve(),
        e && this.navTo(e),
        t.$el.animate({
            width: "321px"
        }, function () {
            t.$tipInner.removeClass("tipsclosed").addClass("tipsopen"),
            t.model.set({
                isOpen: !0
            })
        }).promise()
    },
    close: function () {
        return this.$tipInner.removeClass("tipsopen").addClass("tipsclosed"),
        this.model.set({
            isOpen: !1
        }),
        this.$el.animate({
            width: this.originalWidth
        }).promise()
    },
    show: function () {
        var e = this;
        return e.$el.show().promise().done(function () {
            e.resize()
        })
    },
    navByLink: function (e) {
        e.preventDefault(),
        $(e.currentTarget).parent().hasClass("accordion-heading") && (this.lastClickedSection = null);
        var t = e.currentTarget.pathname;
        t[0] !== "/" && (t = "/" + t),
        _gaq.push(["_trackEvent", "project", "tip_bar_close"]),
        this.navTo(t, "trackPath")
    },
    navTo: function (e) {
        var t = this.a.tipsMap[e] || e;
        if (t == this.a.currentTip)
            return;
        this.trackingStarted.done(function () {
            _gaq.push(["_trackPageview", "/tip-bar" + t])
        }),
        this.a.urlStack = this.a.urlStack.slice(0, this.a.stackPos + 1),
        this.model.set({
            currentTip: t,
            stackPos: this.a.urlStack.push(t) - 1
        })
    },
    resize: function () {
        this.$tipContent.height(this.$w.outerHeight() - this.$el.offset().top - this.$tipHeader.outerHeight() - parseInt(this.$tipContent.css("paddingTop")) - parseInt(this.$tipContent.css("paddingBottom")) - parseInt(this.$tipContent.css("borderTopWidth")) - parseInt(this.$tipContent.css("borderBottomWidth")) - 1)
    },
    accordionSectionToggled: function (e) {
        if (e.target.href)
            return;
        this.$el.find(".expanded").removeClass("expanded").find("span").text("+");
        var t = $(e.currentTarget);
        this.lastClickedSection = t.attr("data-target"),
        $(this.lastClickedSection).hasClass("in") || t.addClass("expanded").find("span").text("-")
    },
    render: function () {
        var e = this;
        this.$tipContentContainer.load(this.a.currentTip + " #tip-content", function () {
            e.a.currentTip === e.a.tipsMap.home && e.lastClickedSection && window.setTimeout(function () {
                $(e.lastClickedSection).prev().trigger("click")
            }, 300)
        })
    }
});
var Scratch = Scratch || {};
Scratch.Project = Scratch.Project || {}, Scratch.Project.Router = Backbone.Router.extend({
    routes: {
        "": "player",
        editor: "editor",
        player: "player",
        fullscreen: "fullscreen",
        "comments*comment_id": "player"
    },
    initialize: function () {
        swfobject.hasFlashPlayerVersion("1") || $("body").removeClass("black white"),
        this.projectModel = new Scratch.ProjectThumbnail(Scratch.INIT_DATA.PROJECT.model, {
            related: {
                lovers: new Scratch.UserThumbnailCollection([], {
                    model: Scratch.UserThumbnail,
                    collectionType: "lovers"
                }),
                favoriters: new Scratch.UserThumbnailCollection([], {
                    model: Scratch.UserThumbnail,
                    collectionType: "favoriters"
                }),
                tags: new Scratch.TagCollection([], {
                    model: Scratch.Tag,
                    collectionType: "project"
                }),
                comments: new Scratch.CommentCollection([], {
                    model: Scratch.Comment,
                    collectionType: "project"
                })
            }
        }),
        $.inArray("edit-project", Scratch.LoggedInUser.permissions) && (this.projectView || (this.projectView = new Scratch.Project.EditView({
                    model: this.projectModel,
                    el: $("#project")
                })));
        var e = this;
        $.when(window.SWFready).done(function () {
            Scratch.FlashApp = new Scratch.FlashAppView({
                model: e.projectModel,
                el: $("#scratch"),
                loggedInUser: Scratch.LoggedInUser,
                editor: !0
            })
        }),
        Scratch.INIT_DATA.ADMIN && (this.adminView = new Scratch.AdminPanel({
                model: this.projectModel,
                el: $("#admin-panel")
            }))
    },
    player: function (e) {
        $.when(window.SWFready).done(function () {
            Scratch.FlashApp.setEditMode(!1)
        });
        var t = this;
        Scratch.INIT_DATA.PROJECT.model.isPublished && (this.commentView || (this.commentView = new Scratch.Comments({
                    el: $("#comments"),
                    scrollTo: e,
                    type: "project",
                    typeId: Scratch.INIT_DATA.PROJECT.model.id
                })))
    },
    editor: function () {
        $.when(window.SWFready).done(function () {
            Scratch.FlashApp.setEditMode(!0)
        })
    },
    fullscreen: function () {
        $("body").removeClass("editor").addClass("editor")
    }
}), $(function () {
    app = new Scratch.Project.Router,
    Backbone.history.start()
});
var Scratch = Scratch || {};
Scratch.FlashAppView = Backbone.View.extend({
    initialize: function (e) {
        this.loggedInUser = Scratch.LoggedInUser,
        this.ASobj = swfobject.getObjectById(this.$el.attr("id")),
        this.setContextMenuHandler(),
        this.loadProjectInSwf(),
        this.setLoggedInUser();
        if (this.options.editor) {
            _.bindAll(this, "beforeUnload", "setLoggedInUser");
            try {
                new Scratch.Views.TipBar({
                    model: new Scratch.Models.TipBar
                })
            } catch (t) {
                console.log("Tip bar failed to load.  Check code for errors")
            }
            this.model.bind("change:title", this.setTitle, this),
            this.loggedInUser.bind("change", this.setLoggedInUser, this),
            window.onbeforeunload = this.beforeUnload
        }
    },
    setLoggedInUser: function () {
        console.log("in setLoggedInUser this.loggedInUser.get('username')", this.loggedInUser.get("username")),
        this.ASobj.ASsetLoginUser(this.loggedInUser.get("username"), this.lastEditorOp)
    },
    setContextMenuHandler: function () {
        function e(e) {
            return e.pageY > 24 && (e.which > 1 || e.ctrlKey)
        }
        var t = this;
        t.el.addEventListener ? t.el.parentNode.addEventListener("mousedown", function (n) {
            var r = $.Event("mousedown", n);
            e(r) && (n.stopPropagation(), n.preventDefault(), t.customContextMenu(r))
        }, !0) : t.$el.parent().on("mousedown", function (t) {
            e(t) && this.setCapture()
        }).on("mouseup", function (n) {
            e(n) && (t.customContextMenu(n), this.releaseCapture())
        }).on("contextmenu", function (e) {
            e.preventDefault()
        })
    },
    customContextMenu: function (e) {
        if (!this.ASobj.ASisEditMode())
            return;
        var t = $(this.ASobj).offset(),
        n = (e.screenX - (window.screenX || window.screenLeft || -5)) / e.pageX,
        r = n * (e.pageX - t.left),
        i = n * (e.pageY - t.top),
        s = navigator.userAgent.indexOf("Macintosh") > -1,
        o = navigator.userAgent.indexOf("Chrome") == -1;
        this.ASobj.ASrightMouseDown(r, i, s && o)
    },
    setEditMode: function (e) {
        this.ASobj.ASsetEditMode(e);
        if (e) {
            $("body").addClass("editor black");
            var t = navigator.userAgent.indexOf("Safari") > -1,
            n = navigator.userAgent.indexOf("Chrome") > -1,
            r = navigator.userAgent.indexOf("Version/5") > -1;
            n && t && (t = !1),
            !t || !r ? $("body #pagewrapper").animate({
                opacity: 1
            }, 1e3, function () {
                $("body").removeClass("black white"),
                $("body #pagewrapper").css("opacity", "1")
            }) : ($("body #pagewrapper").css("opacity", 1), $("body").removeClass("white black"));
            try {
                tip_bar_api.show()
            } catch (i) {
                console.log("Tip bar failed to load.  Check code for errors")
            }
        } else {
            $("body").removeClass("editor white").addClass("viewer"),
            this.ASobj.ASwasEdited() && this.model.save({
                datetime_modified: Date.now()
            });
            try {
                tip_bar_api.hide()
            } catch (i) {
                console.log("Tip bar failed to load.  Check code for errors")
            }
        }
    },
    beEmbedded: function () {
        console.log("beEmbedded called"),
        this.ASobj.ASsetEditMode(!0)
    },
    setTitle: function () {
        this.model.save({
            visibility: "visible"
        }),
        this.ASobj.ASsetTitle(this.model.get("title"))
    },
    loadProjectInSwf: function () {
        this.ASobj.ASloadProject(this.model.get("creator"), this.model.id, this.model.get("title"), !this.model.get("isPublished"), !1)
    },
    beforeUnload: function () {
        if (!this.loggedInUser.authenticated) {
            if (this.ASobj.ASisUnchanged())
                return;
            return "Your changes are NOT SAVED!\nTo save, stay on this page, then log in."
        }
        if (this.model.get("creator") != this.loggedInUser.get("username")) {
            if (this.ASobj.ASisUnchanged())
                return;
            return "Your changes are NOT SAVED!\nTo save, stay on this page, then click \u201cRemix\u201d."
        }
        this.ASobj.ASwasEdited() && this.model.save({
            datetime_modified: Date()
        }, {
            async: !1
        });
        var e = this.model.get("title").indexOf("Untitled") == 0;
        if (e && !this.model.get("isPublished") && this.ASobj.ASisEditMode() && this.ASobj.ASisEmpty()) {
            this.model.save({
                visibility: "trshbyusr"
            }, {
                async: !1
            });
            return
        }
        if (this.ASobj.ASisUnchanged())
            return;
        return "Your changes are NOT SAVED!\nTo save, stay on this page, then click \u201cSave now.\u201d"
    },
    syncSaveProject: function () {
        if (!this.ASobj.ASshouldSave())
            return;
        var e = this.ASobj.ASgetProject();
        if (e == null || e.length == 0)
            return;
        $.ajax({
            url: Scratch.ROOT_URL + "/internalapi/project/" + this.model.get("id") + "/set/",
            type: "POST",
            async: !1,
            data: e
        })
    },
    takeSnapshotForReport: function () {
        this.ASobj.ASrecordThumbnail()
    },
    sendReport: function (e, t, n) {
        window.projRepCallback = n,
        this.ASobj.ASflagProject(e, JSON.stringify(t), "window.projRepCallback")
    }
});
var Scratch = Scratch || {};
Scratch.Project = Scratch.Project || {}, Scratch.Project.EditTitle = Scratch.EditableTextField.extend({
    initialize: function (e, t) {
        this.model.bind("change:title", this.render, this),
        Scratch.EditableTextField.prototype.initialize.apply(this, [t]),
        this.$("input").length && this.$("input").limit("52")
    },
    render: function () {
        this.$("input").val(this.model.get("title"))
    }
}), Scratch.Project.EditNotes = Scratch.EditableTextField.extend({
    onEditSuccess: function (e) {
        Scratch.AlertView.msg($("#alert-view"), {
            alert: "success",
            msg: Scratch.ALERT_MSGS["notes-changed"]
        })
    }
}), Scratch.Project.MarkDraft = Backbone.View.extend({
    events: {
        "click #wip input": "markAsDraft"
    },
    markAsDraft: function (e) {
        $(e.target).is(":checked") ? this.model.related.tags.addItems("work-in-progress") : this.model.related.tags.removeItems("work-in-progress"),
        $(e.target).parent("#wip").toggleClass("on")
    }
}), Scratch.Project.AddTags = Scratch.EditableTextField.extend({
    template: _.template('<span class="tag"><a href=""><%= tag %></a> <span data-tag-name="<%= tag %>" data-control="remove">x</span></span>'),
    events: {
        'click [data-control="remove"]': "removeTag",
        click: "showTagDropdown",
        "keydown input.tag-input": "getKeyPress",
        'click [data-control="add-tag"]': "addCategory"
    },
    initialize: function (e, t) {
        _.bindAll(this, "hideTagDropDown", "submitTag", "limitTags", "success", "error", "saveEditable"),
        this.$eField = this.$("input.tag-input"),
        this.eField = this.$eField[0],
        $("body").on("click", this.hideTagDropDown),
        this.adjustInputWidth()
    },
    adjustInputWidth: function () {
        if (this.$('[data-content="tag-list"]').width() > 350)
            if (this.$('[data-content="tag-list"]').height() > 45) {
                var e = $('<div data-content="tag-list-full">'),
                t = 0;
                this.$("span.tag").each(function (n, r) {
                    t += $(r).width();
                    if (t >= 250)
                        return !1;
                    e.append($(r))
                }),
                this.$('[data-content="tag-list"]').before(e)
            } else
                this.$('[data-content="tag-list"]').width() > 300 && this.$('[data-content="tag-list"]').after('<div data-content="tag-list">').removeAttr("data-content");
        else
            this.$('[data-cotent="tag-list"]').remove(), this.$('[data-content="tag-list-full"]').removeAttr("data-content").attr("data-content", "tag-list")
    },
    getKeyPress: function (e) {
        if (this.limitTags(e))
            return !1;
        if (e.which == 32 || e.which == 188 || e.which == 13 || e.which == 9)
            this.addTag(), e.preventDefault()
    },
    addTag: function () {
        var e = this.$('input[name="tags"]').val();
        e = e.replace(/\s+/g, "").replace(/,/g, ""),
        this.$('input[name="tags"]').val(""),
        e && this.submitTag(e)
    },
    addCategory: function (e) {
        this.submitTag($(e.target).data("tag"))
    },
    submitTag: function (e) {
        var t = this;
        if (!e)
            throw "tag is empty in submitTag.  This should never happen.";
        this.model.addItems(e, {
            success: function (n, r) {
                if (r && r[0] && r[0].isBad)
                    return Scratch.AlertView.msg($("#alert-view"), {
                        alert: "error",
                        timer: 2e4,
                        msg: Scratch.ALERT_MSGS["inappropriate-tag"]
                    });
                t.$('[data-content="tag-list"]').append(t.template({
                        tag: e
                    })),
                t.adjustInputWidth(),
                t.$el.removeClass("no-tags").addClass("has-tags"),
                t.$(".tag-box").removeClass("editable-empty").addClass("editable"),
                Scratch.AlertView.msg($("#alert-view"), {
                    alert: "success",
                    msg: Scratch.ALERT_MSGS["tags-changed"]
                }),
                t.hideTagDropDown()
            }
        })
    },
    limitTags: function (e) {
        if (this.$(".tag").length > 2)
            return this.$(".tag-box").stop().css("backgroundColor", "#FCC").animate({
                backgroundColor: "#FFF"
            }, "slow"), this.$(".tag-input").blur(), Scratch.AlertView.msg($("#alert-view"), {
                alert: "error",
                msg: Scratch.ALERT_MSGS["tags-limited"]
            }), !0
    },
    showTagDropdown: function (e) {
        if (this.limitTags())
            return;
        var t = this;
        this.$(".tag-box").removeClass("read").addClass("write"),
        setTimeout(function () {
            t.$(".tag-choices").show(),
            t.clearPrompt()
        }, 0)
    },
    hideTagDropDown: function (e) {
        this.$(".tag-choices").hide()
    },
    removeTag: function (e) {
        var t = this;
        e.stopPropagation(),
        this.model.removeItems($(e.target).data("tag-name"), {
            success: function () {
                $(e.target).parent(".tag").remove(),
                t.adjustInputWidth(),
                t.$("div .tag").length || (t.$el.removeClass("has-tags").addClass("no-tags"), t.$(".tag-box").removeClass("editable").addClass("editable-empty")),
                Scratch.AlertView.msg($("#alert-view"), {
                    alert: "success",
                    msg: Scratch.ALERT_MSGS["tags-changed"]
                })
            }
        })
    }
}), Scratch.Project.UpdateStats = Backbone.View.extend({
    events: {
        'click [data-control="toggle-stat"]': "toggleStat"
    },
    toggleStat: function (e) {
        var t = $(e.currentTarget),
        n = parseInt(t.find(".icon").html()),
        r = t.data("add"),
        i = t.data("stat") == "favoriters" ? "favorite" : t.data("stat") == "lovers" ? "love" : "unknown_stat";
        r ? (_gaq.push(["_trackEvent", "project", i + "_add"]), this.model.related[t.data("stat")].addItems(Scratch.LoggedInUser.get("username")), t.data("add", !1), t.find(".icon").addClass("on").html(n + 1), console.log(parseInt(n) + 1)) : (_gaq.push(["_trackEvent", "project", i + "_remove"]), this.model.related[t.data("stat")].removeItems(Scratch.LoggedInUser.get("username")), t.data("add", !0), t.find(".icon").removeClass("on").html(n - 1))
    }
}), Scratch.Project.ShareBar = Backbone.View.extend({
    initialize: function () {
        this.model.bind("change:isPublished", this.success, this),
        _.bindAll(this, "success")
    },
    events: {
        'click [data-control="share"]': "shareProject"
    },
    shareProject: function () {
        this.model.share()
    },
    success: function () {
        var e = this;
        e.$el.fadeOut("fast", function () {
            e.$(".public").text("Project shared. Reloading to display shared actions."),
            e.$el.fadeIn("fast")
        }),
        _.delay(function () {
            location.reload()
        }, 5e3)
    }
}), Scratch.Project.AddTo = Backbone.View.extend({
    events: {
        "click .checkmark": "addProject",
        "click .next-page": "loadMore",
        "click .close": "close"
    },
    initialize: function (e) {
        _.bindAll(this, "open"),
        this.firstLoadComplete = !1,
        this.isOpen = !1,
        this.projectId = e.project
    },
    loadMore: function () {
        var e = this.$el.find(".next-page").data("url") || null,
        t = this;
        e != null && $.ajax({
            url: e + "?project_id=" + this.projectId
        }).always(function (e) {
            t.$el.find(".next-page").remove()
        }).done(function (e) {
            t.$el.find("ul").append(e)
        })
    },
    addProject: function (e) {
        galleryId = $(e.target).parent("li").data("studio-id"),
        $(e.target).addClass("loading"),
        $.ajax({
            url: Scratch.ROOT_URL + "/site-api/projects/in/" + galleryId + "/add/?pks=" + this.projectId,
            type: "PUT"
        }).done(function (t) {
            $(e.target).removeClass("checkmark").addClass("checkmark-checked")
        }).always(function (t) {
            $(e.target).removeClass("loading")
        })
    },
    close: function () {
        this.$el.animate({
            height: "0"
        }, function () {
            $(this).hide()
        })
    },
    open: function () {
        $(".player-box-footer-module").hide(),
        this.firstLoadComplete || this.loadMore(),
        this.$el.show().animate({
            height: "250"
        })
    },
    toggleOpen: function () {
        this.isOpen && this.$el.attr("data-type") == "share" && this.$el.css("height") > 0 ? this.close() : this.open()
    }
}), Scratch.Project.ShareTo = Backbone.View.extend({
    events: {
        "click .close": "close"
    },
    initialize: function (e) {
        _.bindAll(this, "open"),
        this.isOpen = !1,
        this.embedUrl = e.embedUrl
    },
    close: function () {
        this.$el.animate({
            height: "0"
        }, function () {
            $(this).hide()
        })
    },
    open: function () {
        $(".player-box-footer-module").hide(),
        this.$el.show().animate({
            height: "250"
        })
    },
    toggleOpen: function () {
        this.isOpen && this.$el.attr("data-type") == "share" && this.$el.css("height") > 0 ? this.close() : this.open()
    },
    setSize: function (e) {
        var t = $(e.target).val();
        t == "small" ? (this.width = 302, this.height = 252) : t == "medium" ? (this.width = 402, this.height = 355) : t == "large" && (this.width = 602, this.height = 502),
        this.$("textarea").val(this.embedCode())
    },
    embedCode: function () {
        return '<iframe allowtransparency="true" width="' + this.width + '" height="' + this.height + '" src="' + this.embedUrl + "?auto_start=" + this.autoStart + '" frameborder="0"></iframe>'
    }
}), Scratch.Project.Report = Backbone.View.extend({
    template: _.template($("#template-report").html()),
    initialize: function (e) {
        this.isOpen = !1,
        this.isSent = !1
    },
    events: {
        'click [data-control="close"]': "close",
        'click [data-control="submit"]': "submit"
    },
    render: function () {
        this.$el.html(this.template()),
        this.$el.attr("data-type", "report"),
        this.isSent && (this.$("div.form").hide(), this.$("div.message").show())
    },
    close: function () {
        this.$el.animate({
            height: "0"
        }, function () {
            $(this).hide()
        }),
        this.isOpen = !1
    },
    open: function () {
        $(".player-box-footer-module").hide();
        if (this.$el.css("height") > 0) {
            var e = this;
            this.$el.show().animate({
                height: "0",
                complete: function () {
                    e.open()
                }
            }),
            this.isOpen = !1
        } else
            this.render(), this.$el.show().animate({
                height: "150"
            }), this.isOpen = !0, $.when(window.SWFready).done(function () {
                Scratch.FlashApp.takeSnapshotForReport()
            })
    },
    toggleOpen: function () {
        this.isOpen && this.$el.attr("data-type") == "report" && this.$el.css("height") > 0 ? this.close() : this.open()
    },
    submit: function () {
        if (!confirm("Are you sure you want to report this project?"))
            return;
        var e = this.$("textarea").val();
        if (/\w+/.test(e)) {
            var t = this;
            $.when(window.SWFready).done(function () {
                Scratch.FlashApp.takeSnapshotForReport,
                Scratch.FlashApp.sendReport(t.model.url() + "report/", {
                    notes: e
                }, function () {
                    console.log("Done sending report"),
                    _gaq.push(["_trackEvent", "project", "report_add"])
                })
            }),
            this.$("div.form").hide(),
            this.$("div.message").show(),
            this.isSent = !0
        } else
            this.$("textarea").val("")
    }
}), Scratch.Project.EditView = Backbone.View.extend({
    initialize: function () {
        this.title = new Scratch.Project.EditTitle({
            el: this.$("#title"),
            model: this.model
        }),
        this.notes = new Scratch.Project.EditNotes({
            el: this.$("#description"),
            model: this.model
        }),
        this.instructions = new Scratch.Project.EditNotes({
            el: this.$("#instructions"),
            model: this.model
        }),
        this.isDraft = new Scratch.Project.MarkDraft({
            el: this.$("#wip"),
            model: this.model
        }),
        this.stats = new Scratch.Project.UpdateStats({
            el: this.$("#stats"),
            model: this.model
        }),
        this.share = new Scratch.Project.ShareBar({
            el: $("#share-bar"),
            model: this.model
        }),
        this.addTo = new Scratch.Project.AddTo({
            el: $("#add-to-menu"),
            project: Scratch.INIT_DATA.PROJECT.model.id
        }),
        this.addTags = new Scratch.Project.AddTags({
            el: $("#project-tags"),
            model: this.model.related.tags
        }),
        this.shareTo = new Scratch.Project.ShareTo({
            el: $("#share-to-menu"),
            embedUrl: Scratch.INIT_DATA.PROJECT.embedUrl
        }),
        this.report = new Scratch.Project.Report({
            el: $("#player-box-footer"),
            model: this.model
        });
        var e = 143,
        t = e - $("#fixed").height();
        $("#instructions, #description").height($("#description").height() + t / 2 - 4),
        $("#instructions").length || $("#description").height($("#description").height() * 2 + 25),
        $("#description .viewport").length && $("#instructions, #description").tinyscrollbar()
    },
    events: {
        "click #share-to": "openShareTo",
        "click #report-this": "openReport",
        "click #add-to": "openAddTo"
    },
    render: function () {},
    openShareTo: function () {
        this.shareTo.toggleOpen()
    },
    openReport: function () {
        this.report.toggleOpen()
    },
    openAddTo: function () {
        this.addTo.toggleOpen()
    }
}), Scratch.Tag = Scratch.Model.extend({
    urlRoot: Scratch.ROOT_URL + "/site-api/tags/all/",
    slug: "name"
}), Scratch.TagCollection = Scratch.Collection.extend({
    model: Scratch.Tag,
    urlRoot: Scratch.ROOT_URL + "/site-api/tags/",
    slug: "name",
    initialize: function (e, t) {
        this.options = t
    }
});
