function setCue(cue, value, done) {
    $.withCSRF(function (csrftoken) {
        $.ajax({
            url: Scratch.ROOT_URL + "/site-api/users/set-template-cue/",
            type: "POST",
            data: JSON.stringify({'cue': cue, 'value': value, 'csrftoken': csrftoken}),
		})
		.done(done)
		.error(function (data, textStatus, jqXHR){
            document.cookie = "cue_" + cue + "=" + value;
            done(data, textStatus, jqXHR);
        });
    });
}

function openDialogue(element, dialog_options) {
    $(element).dialog(dialog_options);
}

function openResendDialogue() {
    var dialog_options = {
        title: gettext("Want to share on Scratch?"),
        open: function( event, ui ) {
            var self = this;
            $('#close-resend-dialog').off();
            $('#close-resend-dialog').click(function() {
                $(self).dialog("close");
            });
            $('#email-resend-box form').submit(function(e) {
                e.preventDefault();
                $.ajax({
                    url: Scratch.ROOT_URL + '/accounts/email_resend/',
                    type: "POST",
                    data: {email_address: $('#hidden-email-address').val()},
                    success: function(data) {
                        $('#submit-resend', self).attr('disabled', 'disabled');
                        $('#submit-resend', self).val('Resent');
                    }
                })
            });
            $('#email-resend-box :link').blur();
        },
        close: function( event, ui ) {
            $(this).dialog('destroy');
            $('.ui-widget-overlay.ui-front').remove();
        },
        show: {
            effect: 'clip',
            duration: 250,
        },
        hide: {
            effect: 'clip',
            duration: 250,
        } 
    };

    if ($("#email-resend-box").length > 0) {
		openDialogue("#email-resend-box", e);
	} else {
		$.ajax({
			url: Scratch.ROOT_URL + "/accounts/email_resend/"
		}).done(function (data) {
			var template = $(_.template(data)());
			openDialogue(template, dialog_options);
		});
    }
}
!function (e) {
    var t = function (e, t) {
        this.init("tooltip", e, t)
    };
    t.prototype = {
        constructor: t,
        init: function (t, n, r) {
            var i,
            s,
            o,
            u,
            f;
            this.type = t,
            this.$element = e(n),
            this.options = this.getOptions(r),
            this.enabled = !0,
            o = this.options.trigger.split(" ");
            for (f = o.length; f--; )
                u = o[f], u == "click" ? this.$element.on("click." + this.type, this.options.selector, e.proxy(this.toggle, this)) : u != "manual" && (i = u == "hover" ? "mouseenter" : "focus", s = u == "hover" ? "mouseleave" : "blur", this.$element.on(i + "." + this.type, this.options.selector, e.proxy(this.enter, this)), this.$element.on(s + "." + this.type, this.options.selector, e.proxy(this.leave, this)));
            this.options.selector ? this._options = e.extend({}, this.options, {
                trigger: "manual",
                selector: ""
            }) : this.fixTitle()
        },
        getOptions: function (t) {
            return t = e.extend({}, e.fn[this.type].defaults, this.$element.data(), t),
            t.delay && typeof t.delay == "number" && (t.delay = {
                    show: t.delay,
                    hide: t.delay
                }),
            t
        },
        enter: function (t) {
            var n = e.fn[this.type].defaults,
            r = {},
            i;
            this._options && e.each(this._options, function (e, t) {
                n[e] != t && (r[e] = t)
            }, this),
            i = e(t.currentTarget)[this.type](r).data(this.type);
            if (!i.options.delay || !i.options.delay.show)
                return i.show();
            clearTimeout(this.timeout),
            i.hoverState = "in",
            this.timeout = setTimeout(function () {
                i.hoverState == "in" && i.show()
            }, i.options.delay.show)
        },
        leave: function (t) {
            var n = e(t.currentTarget)[this.type](this._options).data(this.type);
            this.timeout && clearTimeout(this.timeout);
            if (!n.options.delay || !n.options.delay.hide)
                return n.hide();
            n.hoverState = "out",
            this.timeout = setTimeout(function () {
                n.hoverState == "out" && n.hide()
            }, n.options.delay.hide)
        },
        show: function () {
            var t,
            n,
            r,
            i,
            s,
            o,
            u = e.Event("show");
            if (this.hasContent() && this.enabled) {
                this.$element.trigger(u);
                if (u.isDefaultPrevented())
                    return;
                t = this.tip(),
                this.setContent(),
                this.options.animation && t.addClass("fade"),
                s = typeof this.options.placement == "function" ? this.options.placement.call(this, t[0], this.$element[0]) : this.options.placement,
                t.detach().css({
                    top: 0,
                    left: 0,
                    display: "block"
                }),
                this.options.container ? t.appendTo(this.options.container) : t.insertAfter(this.$element),
                n = this.getPosition(),
                r = t[0].offsetWidth,
                i = t[0].offsetHeight;
                switch (s) {
                case "bottom":
                    o = {
                        top: n.top + n.height,
                        left: n.left + n.width / 2 - r / 2
                    };
                    break;
                case "top":
                    o = {
                        top: n.top - i,
                        left: n.left + n.width / 2 - r / 2
                    };
                    break;
                case "left":
                    o = {
                        top: n.top + n.height / 2 - i / 2,
                        left: n.left - r
                    };
                    break;
                case "right":
                    o = {
                        top: n.top + n.height / 2 - i / 2,
                        left: n.left + n.width
                    }
                }
                this.applyPlacement(o, s),
                this.$element.trigger("shown")
            }
        },
        applyPlacement: function (e, t) {
            var n = this.tip(),
            r = n[0].offsetWidth,
            i = n[0].offsetHeight,
            s,
            o,
            u,
            a;
            n.offset(e).addClass(t).addClass("in"),
            s = n[0].offsetWidth,
            o = n[0].offsetHeight,
            t == "top" && o != i && (e.top = e.top + i - o, a = !0),
            t == "bottom" || t == "top" ? (u = 0, e.left < 0 && (u = e.left * -2, e.left = 0, n.offset(e), s = n[0].offsetWidth, o = n[0].offsetHeight), this.replaceArrow(u - r + s, s, "left")) : this.replaceArrow(o - i, o, "top"),
            a && n.offset(e)
        },
        replaceArrow: function (e, t, n) {
            this.arrow().css(n, e ? 50 * (1 - e / t) + "%" : "")
        },
        setContent: function () {
            var e = this.tip(),
            t = this.getTitle();
            e.find(".tooltip-inner")[this.options.html ? "html" : "text"](t),
            e.removeClass("fade in top bottom left right")
        },
        hide: function () {
            function t() {
                var t = setTimeout(function () {
                    r.off(e.support.transition.end).detach()
                }, 500);
                r.one(e.support.transition.end, function () {
                    clearTimeout(t),
                    r.detach()
                })
            }
            var n = this,
            r = this.tip(),
            i = e.Event("hide");
            this.$element.trigger(i);
            if (i.isDefaultPrevented())
                return;
            return r.removeClass("in"),
            e.support.transition && this.$tip.hasClass("fade") ? t() : r.detach(),
            this.$element.trigger("hidden"),
            this
        },
        fixTitle: function () {
            var e = this.$element;
            (e.attr("title") || typeof e.attr("data-original-title") != "string") && e.attr("data-original-title", e.attr("title") || "").attr("title", "")
        },
        hasContent: function () {
            return this.getTitle()
        },
        getPosition: function () {
            var t = this.$element[0];
            return e.extend({}, typeof t.getBoundingClientRect == "function" ? t.getBoundingClientRect() : {
                width: t.offsetWidth,
                height: t.offsetHeight
            }, this.$element.offset())
        },
        getTitle: function () {
            var e,
            t = this.$element,
            n = this.options;
            return e = t.attr("data-original-title") || (typeof n.title == "function" ? n.title.call(t[0]) : n.title),
            e
        },
        tip: function () {
            return this.$tip = this.$tip || e(this.options.template)
        },
        arrow: function () {
            return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
        },
        validate: function () {
            this.$element[0].parentNode || (this.hide(), this.$element = null, this.options = null)
        },
        enable: function () {
            this.enabled = !0
        },
        disable: function () {
            this.enabled = !1
        },
        toggleEnabled: function () {
            this.enabled = !this.enabled
        },
        toggle: function (t) {
            var n = t ? e(t.currentTarget)[this.type](this._options).data(this.type) : this;
            n.tip().hasClass("in") ? n.hide() : n.show()
        },
        destroy: function () {
            this.hide().$element.off("." + this.type).removeData(this.type)
        }
    };
    var n = e.fn.tooltip;
    e.fn.tooltip = function (n) {
        return this.each(function () {
            var r = e(this),
            i = r.data("tooltip"),
            s = typeof n == "object" && n;
            i || r.data("tooltip", i = new t(this, s)),
            typeof n == "string" && i[n]()
        })
    },
    e.fn.tooltip.Constructor = t,
    e.fn.tooltip.defaults = {
        animation: !0,
        placement: "top",
        selector: !1,
        template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: !1,
        container: !1
    },
    e.fn.tooltip.noConflict = function () {
        return e.fn.tooltip = n,
        this
    }
}
(window.jQuery), !function (e) {
    var t = function (e, t) {
        this.init("popover", e, t)
    };
    t.prototype = e.extend({}, e.fn.tooltip.Constructor.prototype, {
        constructor: t,
        setContent: function () {
            var e = this.tip(),
            t = this.getTitle(),
            n = this.getContent();
            e.find(".popover-title")[this.options.html ? "html" : "text"](t),
            e.find(".popover-content")[this.options.html ? "html" : "text"](n),
            e.removeClass("fade top bottom left right in")
        },
        hasContent: function () {
            return this.getTitle() || this.getContent()
        },
        getContent: function () {
            var e,
            t = this.$element,
            n = this.options;
            return e = (typeof n.content == "function" ? n.content.call(t[0]) : n.content) || t.attr("data-content"),
            e
        },
        tip: function () {
            return this.$tip || (this.$tip = e(this.options.template)),
            this.$tip
        },
        destroy: function () {
            this.hide().$element.off("." + this.type).removeData(this.type)
        }
    });
    var n = e.fn.popover;
    e.fn.popover = function (n) {
        return this.each(function () {
            var r = e(this),
            i = r.data("popover"),
            s = typeof n == "object" && n;
            i || r.data("popover", i = new t(this, s)),
            typeof n == "string" && i[n]()
        })
    },
    e.fn.popover.Constructor = t,
    e.fn.popover.defaults = e.extend({}, e.fn.tooltip.defaults, {
        placement: "right",
        trigger: "click",
        content: "",
        template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    }),
    e.fn.popover.noConflict = function () {
        return e.fn.popover = n,
        this
    }
}
(window.jQuery), Backbone.View.prototype.close = function (e) {
    e = e || {},
    e.persist || this.remove(),
    this.unbind(),
    this.undelegateEvents(),
    this.onClose && this.onClose()
}, Backbone.View.prototype.open = function (e) {
    this.initialize(),
    this.model.fetch(),
    this.delegateEvents()
}, Backbone.View.prototype._super = function (e) {
    var t = this.constructor.__super__[e];
    return typeof t == "function" ? t.apply(this, _.rest(arguments)) : t
};
var Scratch = Scratch || {};
Scratch.Model = Backbone.Model.extend({
    initialize: function (e, t) {
        _.bindAll(this, "report");
        if (t && t.related) {
            this.related = t.related;
            var n = this;
            $.each(this.related, function (e, t) {
                t.parentModel = n
            })
        }
        this.init(t)
    },
    url: function () {
        return this.urlRoot + this.getId() + "/"
    },
    getId: function () {
        return this.slug ? this.get(this.slug) : this.id
    },
    init: function (e) {},
    parse: function (e) {
        return e.fields ? $.extend(e.fields, {
            id: e.pk
        }) : e
    },
    create: function (e) {
        return e = e || {},
        e.url = this.urlRoot + "create/",
        this.isNew() ? (e.error || (e.error = function () {
                console.error && console.error("in model.create, error arguments:", arguments)
            }), Backbone.sync("create", this, e), !0) : !1
    },
    fetchRelated: function (e) {
        e ? this.related[e].fetch() : $.each(this.related, function (e, t) {
            t.fetch()
        })
    },
    report: function (e, t) {
        e || (e = {});
        var n = this.url() + "report/";
        $.ajax(n, {
            type: "POST",
            data: JSON.stringify(e),
            dataType: "json",
            success: t
        })
    }
}), Scratch.Collection = Backbone.Collection.extend({
    paginationData: {
        page: 1,
        ascsort: "",
        descsort: ""
    },
    hasMore: !0,
    count: 0,
    url: function () {
        var e = this.urlRoot;
        return e += this.options.collectionType ? this.options.collectionType + "/" : "",
        e += this.parentModel ? this.parentModel.getId() + "/" : "",
        e
    },
    addItems: function (e, t) {
        var t = t || {},
        n = this.slug ? this.slug + "s" : "pks",
        r = _.isArray(e) ? e.length : 1;
        e = _.isArray(e) ? e.join(",") : e,
        t.url = this.url() + "add/?" + n + "=" + e;
        var i = t.success,
        s = this;
        t.success = function (e, t, n) {
            s.add(e),
            i && i(this, e),
            s.trigger("addItemsSuccess", r)
        },
        Backbone.sync("update", this.parentModel, t)
    },
    removeItems: function (e, t) {
        var t = t || {},
        n = this.slug ? this.slug + "s" : "pks",
        r = _.isArray(e) ? e.length : 1;
        e = _.isArray(e) ? e.join(",") : e,
        t.url = this.url() + "remove/?" + n + "=" + e;
        var s = t.success,
        o = this;
        t.success = function (e, t, n) {
            var u = [];
            for (i = 0; i < e.length; i++)
                u[i] = e[i].id;
            o.remove(u),
            s && s(this, e),
            o.trigger("removeItemsSuccess", r)
        },
        Backbone.sync("update", this.parentModel, t)
    },
    loadMore: function (e) {
        if (!this.hasMore)
            return !1;
        var e = e || {};
        this.paginationData.page += 1;
        var t = this,
        n = e.error || {};
        e.error = function (e, r, i) {
            t.hasMore = !1,
            n()
        },
        e.add = !0,
        e.data = this.paginationData,
        this.fetch(e)
    },
    ajaxSort: function (e, t) {
        var t = t || {};
        this.paginationData.page = 1,
        $.extend(this.paginationData, e),
        t.data = this.paginationData,
        t.add = !1,
        this.fetch(t)
    },
    ajaxFilter: function (e, t) {
        self.hasMore = !0;
        var t = t || {};
        this.paginationData.page = 1,
        this.options.collectionType = e,
        t.data = this.paginationData,
        t.add = !1,
        this.fetch(t)
    }
});
var Scratch = Scratch || {};
Scratch.Utils = {}, Scratch.Utils.viewMixin = function (e) {
    var t = this.prototype;
    _.defaults(t, e),
    _.defaults(t.events, e.events),
    Scratch.Utils.extendMethod(t, e, "initialize"),
    Scratch.Utils.extendMethod(t, e, "render")
}, Scratch.Utils.extendMethod = function (e, t, n) {
    if (!_.isUndefined(t[n])) {
        var r = e[n];
        e[n] = function () {
            var e = r.apply(this, arguments);
            return t[n].apply(this, arguments),
            e
        }
    }
}, Backbone.View.mixin = Scratch.Utils.viewMixin, Scratch.Mixins = Scratch.Mixins || {}, Scratch.Mixins.Followable = {
    events: {
        'click [data-control="follow"]': "follow",
        'click [data-control="unfollow"]': "unfollow"
    },
    initialize: function () {
        _.bindAll(this, "followed"),
        _.bindAll(this, "unfollowed")
    },
    follow: function () {
        this.model.related.followers.addItems(Scratch.LoggedInUser.get("username"), {
            success: this.followed,
            error: this.onFollowError
        })
    },
    followed: function (e, t) {
        this.$('[data-control="follow"]').removeClass("blue notfollowing").addClass("grey following").attr("data-control", "unfollow"),
        this.onFollowSuccess(e, t)
    },
    onFollowSuccess: function (e, t) {
        Scratch.AlertView.msg($("#alert-view"), {
            alert: "success",
            msg: Scratch.ALERT_MSGS.followed
        })
    },
    onFollowError: function (e, t) {
        Scratch.AlertView.msg($("#alert-view"), {
            alert: "error",
            msg: e.responseJSON[0].errors.join(",")
        })
    },
    unfollow: function (e, t) {
        this.model.related.followers.removeItems(Scratch.LoggedInUser.get("username"), {
            success: this.unfollowed
        })
    },
    unfollowed: function (e, t) {
        this.$('[data-control="unfollow"]').removeClass("grey following").addClass("blue notfollowing").attr("data-control", "follow"),
        this.onUnfollowSuccess(e, t)
    },
    onUnfollowSuccess: function (e, t) {
        Scratch.AlertView.msg($("#alert-view"), {
            alert: "success",
            msg: Scratch.ALERT_MSGS.unfollowed
        })
    }
}, Scratch.ModelView = Backbone.View
    .extend({
        initialize: function (e, t) {
            this.model.bind("error", this.onError, this),
            this.model.bind("changeSuccess", this.onChangeSuccess, this)
        },
        onError: function (e) {
            Scratch.AlertView.msg($("#alert-view"), {
                alert: "error",
                msg: Scratch.ALERT_MSGS.error
            })
        },
        onChangeSuccess: function (e) {
            Scratch.AlertView.msg($("#alert-view"), {
                alert: "success",
                msg: Scratch.ALERT_MSGS["changes-saved"]
            })
        }
    }), Scratch.CollectionView = Backbone.View.extend({
        events: {
            'click [data-control="load-more"]': "loadMore",
            'click [data-control="sort"]': "sort",
            'click [data-control="filter"]': "filter",
            'click [data-control="remove-item"]': "removeItem"
        },
        initialize: function (e) {
            this.options = e || {};
            if (this.options.template || this.options.collectionTemplate)
                this.wrapperTemplate = this.options.template, this.listTemplate = this.options.collectionTemplate;
            this.model.bind("add", this.render, this),
            this.model.bind("remove", this.render, this),
            this.model.bind("remove", this.onRemove, this),
            this.model.bind("reset", this.render, this),
            this.model.bind("addItemsSuccess", this.onAddSuccess, this),
            this.model.bind("removeItemsSuccess", this.onRemoveSuccess, this),
            this.model.bind("error", this.onError, this),
            this.wrapperTemplate && $(this.el).html(this.wrapperTemplate({
                    collection: []
                }))
        },
        onClose: function () {
            this.model.unbind("add", this.render),
            this.model.unbind("remove", this.render),
            this.model.unbind("remove", this.onRemove),
            this.model.unbind("reset", this.render),
            this.model.unbind("addItemsSuccess", this.onAddSuccess),
            this.model.unbind("removeItemsSuccess", this.onRemoveSuccess),
            this.model.unbind("error", this.onError)
        },
        render: function () {
            return this.renderCollection(),
            this
        },
        renderCollection: function () {
            this.$('[data-content="collection"]').html(this.listTemplate({
                    collection: this.model.toJSON()
                }))
        },
        removeItem: function (e) {
            this.model.removeItems([$(e.currentTarget).parent(["data-id"]).data("id")])
        },
        loadMore: function (e) {
            var t = this,
            n = $(e.currentTarget).addClass("loading");
            t.model.loadMore({
                success: function () {
                    t.render(),
                    n.removeClass("loading")
                },
                error: function (e) {
                    n.remove()
                }
            })
        },
        sort: function (e) {
            var t = {
                ascsort: $(e.target).data("ascsort") || "",
                descsort: $(e.target).data("descsort") || ""
            };
            this.model.ajaxSort(t)
        },
        filter: function (e) {
            this.model.ajaxFilter($(e.target).data("filter"))
        },
        onRemove: function (e) {},
        onAdd: function (e) {},
        onError: function (e) {
            Scratch.AlertView.msg($("#alert-view"), {
                alert: "error",
                msg: Scratch.ALERT_MSGS.error
            })
        }
    }), Scratch.ExploreBar = Scratch.CollectionView.extend({
        events: function () {
            return _.extend({}, Scratch.CollectionView.prototype.events, {
                'click [data-control="open"]': "openBar",
                'click [data-control="close"]': "closeBar",
                "click #explore-buttons": "stopEvent",
                'click [data-control="next"]': "next",
                'click [data-control="prev"]': "prev",
                'click [data-control="draggable"]': "itemClicked",
                'click [data-control="open-explore-bar"]': "openBar"
            })
        },
        initialize: function (e) {
            Scratch.CollectionView.prototype.initialize.apply(this, [e]),
            this.model.unbind("add"),
            this.$scrollArea = this.$(".carousel-inner ul"),
            this.$arrowLeft = this.$(".arrow-left"),
            this.$arrowRight = this.$(".arrow-right"),
            _.bindAll(this, "openBar", "preLoadSuccess", "preLoadError"),
            Scratch.EventMgr = Scratch.EventMgr || _.extend({}, Backbone.Events),
            Scratch.EventMgr.on("explore-open", this.openBar, this)
        },
        render: function () {
            Scratch.CollectionView.prototype.render.apply(this),
            this.$items = this.$(".carousel-inner li"),
            this.$scrollArea.width(this.$items.outerWidth(!0) * this.model.length),
            this.scrollPageWidth = this.$(".carousel-inner").width() + parseInt(this.$items.css("padding-right"), 10) - 10,
            this.scrollMax = this.$scrollArea.width() - this.scrollPageWidth
        },
        next: function () {
            if (this.sliding)
                return;
            return this.slide("next")
        },
        prev: function () {
            if (this.sliding)
                return;
            return this.slide("prev")
        },
        toggleArrows: function (e) {
            if (e <= 0) {
                this.$arrowLeft.addClass("off").removeClass("on");
                return
            }
            if (e >= this.scrollMax) {
                this.$arrowRight.addClass("off").removeClass("on");
                return
            }
            this.$arrowRight.removeClass("off").addClass("on"),
            this.$arrowLeft.removeClass("off").addClass("on")
        },
        slide: function (e) {
            var t;
            if (e == "start")
                t = 0;
            else {
                var n = this.$(".carousel-inner").scrollLeft(),
                r = e == "next" ? this.scrollPageWidth : -this.scrollPageWidth;
                t = n + r
            }
            return this.toggleArrows(t),
            this.sliding = !0,
            this.$(".carousel-inner").animate({
                scrollLeft: t
            }, 800, "swing", $.proxy(function () {
                    this.sliding = !1,
                    this.preLoad(t)
                }, this)),
            this
        },
        preLoad: function (e) {
            if (!this.model.hasMore)
                return;
            e >= this.scrollMax - this.scrollPageWidth && (this.$(".carousel-inner").addClass("loading"), this.model.loadMore({
                    success: this.preLoadSuccess,
                    error: this.preLoadError
                }))
        },
        preLoadSuccess: function (e, t, n) {
            this.render(),
            this.$(".carousel-inner").removeClass("loading")
        },
        preLoadError: function (e, t, n) {
            this.$(".carousel-inner").removeClass("loading")
        },
        openBar: function () {
            $("body").addClass("explore-bar-visible"),
            this.$("#related-projects").animate({
                height: "160px"
            }),
            this.$("#explore-header").attr("data-control", "close"),
            this.$("#explore-header-open").removeClass("hidden"),
            this.$("#explore-header-closed").addClass("hidden"),
            this.$(".carousel-control").css("display", "inline"),
            this.model.fetch(),
            this.isOpenBar = !0
        },
        closeBar: function () {
            $("body").removeClass("explore-bar-visible"),
            $("#related-projects").animate({
                height: "0px"
            }),
            this.$("#explore-header").attr("data-control", "open"),
            $("#explore-header-closed").removeClass("hidden"),
            $("#explore-header-open").addClass("hidden"),
            this.$(".carousel-control").css("display", "none"),
            this.isOpenBar = !1
        },
        stopEvent: function (e) {
            e.stopPropagation()
        },
        open: function () {
            this.model.fetch(),
            this.delegateEvents()
        },
        filter: function (e) {
            Scratch.CollectionView.prototype.filter.apply(this, [e]),
            this.$(".carousel-inner").scrollLeft(0)
        },
        itemClicked: function (e) {
            e.preventDefault(),
            Scratch.EventMgr.trigger("explore-item-clicked", $(e.currentTarget).data())
        }
    }), Scratch.CollectionCountView = Backbone.View.extend({
        initialize: function (e) {
            this.template = _.template($("#template-collection-count").html()),
            this.count = e.count || null,
            this.model.bind("add", this.add, this),
            this.model.bind("remove", this.remove, this),
            this.model.bind("reset", this.render, this),
            this.model.bind("change", this.render, this)
        },
        render: function () {
            count = this.count ? this.count : this.model.length,
            this.$el.html(this.template({
                    count: count
                }))
        },
        add: function () {
            count = this.count++ || this.model.length,
            this.render()
        },
        remove: function () {
            count = this.count-- || this.model.length,
            this.render()
        }
    }), Scratch.ViewManager = Backbone.View.extend({
        initialize: function (e) {
            this.views = e.views
        },
        swapView: function (e) {
            this.currentView && this.currentView.close(),
            this.currentView = this.views[e],
            this.currentView ? (this.currentView.open(), this.$('[data-content="view"]').html(this.currentView.el)) : this.$('[data-content="view"]').html(""),
            this.trigger("swapped", e)
        }
    }), Scratch.TabsView = Scratch.ViewManager.extend({
        events: {
            'click [data-control="tab"]': "switchTab"
        },
        switchTab: function (e) {
            var t = $(e.target.parentNode);
            this.$('[data-control="tab"]').removeClass("active"),
            t.addClass("active"),
            this.swapView(t.data("tab"))
        },
        selectTab: function (e) {
            this.$("[data-tab]").removeClass("active"),
            this.$('[data-tab="' + e + '"]').addClass("active"),
            this.swapView(e)
        }
    }), Scratch.LogoutView = Backbone.View.extend({
        events: {
            "submit form": "logout"
        },
        logout: function (e) {
            e.preventDefault(),
            $.ajax({
                type: "POST",
                url: Scratch.ROOT_URL + "/accounts/logout/",
                success: function (e, t, n) {
                    window.location.href = "/"
                }
            })
        }
    }), Scratch.LoginView = Backbone.View.extend({
        initialize: function (e) {
            _.bindAll(this, "onLoginSuccess", "onLoginError")
        },
        events: {
            "submit form": "login",
            "click .dropdown-menu": "formClick"
        },
        formClick: function (e) {
            e.stopPropagation()
        },
        login: function (e) {
            e.preventDefault(),
            this.$("button").hide(),
            this.$(".ajax-loader").show();
            if (this.$el.is("#login-dialog") && typeof this.recaptchaWidget != "undefined")
                var t = !0, n = grecaptcha.getResponse();
            else
                var t = !1, n = "";
            $.withCSRF(function (e) {
                this.model.login({
                    username: this.$('[name="username"]').val(),
                    password: this.$('[name="password"]').val(),
                    "g-recaptcha-response": n,
                    embed_captcha: t,
                    timezone: jstz.determine().name(),
                    csrfmiddlewaretoken: e
                }, {
                    success: this.onLoginSuccess,
                    error: this.onLoginError
                })
            }
                .bind(this))
        },
        onLoginSuccess: function (e, t) {
            Scratch.LoggedInUser.set(this.model.attributes),
            this.$el.is("#login-dialog") ? location.href.indexOf("editor") < 0 && location.href.indexOf("pathways") < 0 ? location.reload() : (this.$el.modal("hide"), setAccountNavFromJson()) : (this.$el.removeClass("open"), location.reload())
        },
        onLoginError: function (e, t) {
            if (t.status === 400)
                return this.onLoginSuccess(e, t);
            var n = t.responseJSON[0] || {
                msg: "An unknown error occurred"
            };
            "redirect" in n ? this.$el.is("#login-dialog") ? (typeof this.recaptchaWidget == "undefined" ? this.recaptchaWidget = grecaptcha.render("recaptcha-container") : grecaptcha.reset(this.recaptchaWidget), this.$(".error").html(n.msg).show(), this.$("button").show(), this.$(".ajax-loader").hide(), this.model.currentLoginUrl = this.model.loginRetryUrl) : window.location = n.redirect : (this.$(".error").html(n.msg).show(), this.$("button").show(), this.$(".ajax-loader").hide())
        }
    }), Scratch.LanguageDropdownView = Backbone.View.extend({
        events: {
            "change #language-selection": "changeLanguage"
        },
        changeLanguage: function (e) {
            var t = this;
            $.withCSRF(function (e) {
                $("<input>").attr({
                    type: "hidden",
                    name: "csrfmiddlewaretoken",
                    value: e
                }).prependTo(t.$el),
                t.$el.submit()
            })
        }
    }), Scratch.AlertView = Backbone.View.extend({
        className: "alert fade in",
        alerts: ["success", "error", "info"],
        template: _.template(['<span class="close">&times;</span>', "<%= message %>"].join("")),
        events: {
            "click .close": "closeAlert"
        },
        initialize: function (e) {
            var t = e.msg || "",
            n = e.hasOwnProperty("alert") ? e.alert : "info",
            r = e.timer === undefined ? 3e3 : e.timer,
            i = e.memory || !1;
            if (_.indexOf(this.alerts, n) === -1)
                throw new Error("Invalid alert: [" + n + "] Must be one of:" + this.alerts.join(", "));
            this.alert = n,
            this.message = t,
            this.timer = r,
            this.memory = i,
            _.bindAll(this, "closeAlert")
        },
        render: function () {
            var e = this.template({
                message: this.message
            }),
            t = this.$el.addClass("alert-" + this.alert).html(e).show();
            return this.timer && t.delay(this.timer).fadeOut("slow"),
            this
        },
        closeAlert: function (e) {
            this.$el.stop().fadeOut("fast")
        }
    }), Scratch.AlertView.msg = function (e, t) {
    var n = new Scratch.AlertView(t),
    r = e.html(n.render().el).width();
    return e.css({
        marginLeft: -r / 2,
        left: "50%"
    }),
    n
}, Scratch.Comments = Backbone.View.extend({
    page: 0,
    events: {
        'click [data-control="load-more"]': "getNextPage",
        'click [data-control="post"]': function (e) {
            this.hideError(e),
            this.postComment(e)
        },
        'click [data-control="reply-to"]': "showReplyForm",
        'click [data-control="cancel"]': "cancel",
        'click [data-control="delete"]': "deleteComment",
        'click [data-control="undelete"]': "undeleteComment",
        'click [data-control="report"]': "report",
        'click [data-control="unreport"]': "unreport",
        "click .more-replies": "showMoreReplies",
        "focus #comments textarea": "hideError",
        "change #comments-enabled": "toggleComments",
        "hover .tenmil": "confetti"
    },
    initialize: function (e) {
        this.type = e.type,
        this.typeId = e.typeId,
        this.gaqType = this.type == "user" ? "profile" : this.type == "gallery" ? "studio" : this.type;
        var t = !1;
        this.type == "project" ? t = Scratch.INIT_DATA.project_comments_enabled : this.type == "user" ? t = Scratch.INIT_DATA.userprofile_comments_enabled : this.type == "gallery" && (t = Scratch.INIT_DATA.gallery_comments_enabled);
        if (t === !1)
            return;
        this.commentPostingAllowed = $("#main-post-form").is(":visible"),
        this.student_usernames = [];
        if (Scratch.INIT_DATA.LOGGED_IN_USER.model && Scratch.INIT_DATA.LOGGED_IN_USER.model.is_educator) {
            var n = new Scratch.UserThumbnailCollection([], {
                url: Scratch.ROOT_URL + "/site-api/classrooms/students/of/" + Scratch.INIT_DATA.LOGGED_IN_USER.model.username,
                model: Scratch.UserThumbnail
            });
            this.gotStudents = $.Deferred();
            var r = function (e) {
                return typeof e == "undefined" && (e = 1),
                n.fetch({
                    url: n.options.url,
                    data: {
                        page: e
                    },
                    add: !0
                }).then(function (t) {
                    return r(e + 1)
                }
                    .bind(this)).fail(function () {
                    this.student_usernames = n.models.map(function (e) {
                        return e.get("user").username
                    }),
                    this.gotStudents.resolve()
                }
                    .bind(this))
            }
            .bind(this);
            r()
        } else
            this.gotStudents = $.Deferred(function (e) {
                e.resolve()
            });
        this.commentReplyTemplate = _.template($("#template-comment-reply").html()),
        Scratch.INIT_DATA.IS_SOCIAL ? (this.$("#main-post-form textarea").limit("500", "#chars-left"), this.$("#main-post-form textarea").keydown(function (e) {
                e.ctrlKey && (e.keyCode == 13 || e.keyCode == 10) && this.postComment(e)
            })) : (this.$("#main-post-form textarea").limit("0"), this.$("#main-post-form textarea").focus(function () {
                openResendDialogue()
            })),
        this.$commentContainer = $("<div>"),
        e.scrollTo ? (this.scrollTo(".comments"), this.getNextPage("#comments" + e.scrollTo)) : this.getNextPage()
    },
    hideError: function () {
        this.$(".control-group.tooltip").removeClass("error")
    },
    render: function () {
        var e = this.$('[data-content="comments"]');
        e.find("#comments-loading").remove(),
        e.append(this.$commentContainer.html()),
        this.$commentContainer.html("");
        if (this.type == "project") {
            var t = $("[data-control-comment-count]").attr("data-control-comment-count") || "";
            t.length == 0 && (t = "0"),
            $("#comment-count").text("(" + t + ")")
        }
    },
    confetti: function (e) {
        if (window.confettiRunning)
            return;
        window.confettiRunning = !0,
        $("#content").confetti({
            x: e.pageX,
            y: e.pageY,
            complate: function () {
                window.confettiRunning = !1
            }
        })
    },
    getNextPage: function (e) {
        this.$('[data-control="load-more"]').remove();
        var t = this,
        n = "";
        return Scratch.INIT_DATA.ADMIN && (n = "with-deleted/"),
        t.page++,
        $.ajax({
            url: Scratch.ROOT_URL + "/site-api/comments/" + n + this.type + "/" + this.typeId + "/?page=" + this.page
        }).done(function (n) {
            if (t.page > 40)
                throw "more than 40 pages of comments shouldn't be happening";
            t.$commentContainer.append(n),
            !e || e instanceof $.Event ? (t.render(), t.$("span.time").timeago()) : n.indexOf(e.slice(1)) > -1 ? (t.render(), t.$("span.time").timeago(), setTimeout(function () {
                    t.scrollTo(e)
                }, 0)) : (t.$commentContainer.find('[data-control="load-more"]').remove(), t.getNextPage(e)),
            t.showCommentOptions()
        })
    },
    showCommentOptions: function (e) {
        if (!Scratch.INIT_DATA.LOGGED_IN_USER.options.authenticated)
            return;
        if (Scratch.INIT_DATA.ADMIN)
            return;
        e = e || this.$el;
        var t = this,
        n = !1,
        r = !1;
        Scratch.INIT_DATA.ADMIN && (n = !0),
        t.type == "project" ? (Scratch.INIT_DATA.PROJECT.model.creator == Scratch.INIT_DATA.LOGGED_IN_USER.model.username && (n = !0), r = Scratch.INIT_DATA.PROJECT.model.comments_allowed && Scratch.INIT_DATA.project_comments_enabled) : t.type == "user" ? (Scratch.INIT_DATA.PROFILE.model.username == Scratch.INIT_DATA.LOGGED_IN_USER.model.username && (n = !0), r = Scratch.INIT_DATA.PROFILE.model.comments_allowed && Scratch.INIT_DATA.userprofile_comments_enabled) : t.type == "gallery" && (Scratch.INIT_DATA.GALLERY.model.is_owner && (n = !0), r = Scratch.INIT_DATA.GALLERY.model.comments_allowed && Scratch.INIT_DATA.gallery_comments_enabled),
        $.when(this.gotStudents).then(function () {
            e.find("div.comment").each(function () {
                var e = {
                    can_delete: n,
                    current_user: Scratch.INIT_DATA.LOGGED_IN_USER.model.username,
                    comment_user: $(this).find("#comment-user").data("comment-user"),
                    type: t.type,
                    is_staff: Scratch.INIT_DATA.ADMIN
                };
                e.student_of_educator = t.student_usernames.indexOf(e.comment_user) >= 0;
                var i = _.template($("#template-comment-actions").html());
                $(this).find(".actions-wrap").html(i(e)),
                $(this).find("a.reply").attr("data-control", "reply-to"),
                r && t.commentPostingAllowed && $(this).find("a.reply").css("display", "inline")
            })
        })
    },
    postComment: function (e) {
        e.preventDefault();
        var t = $(e.currentTarget),
        n = t.closest("form"),
        r = $.trim(n.find("textarea").val()),
        i = {
            content: r,
            parent_id: t.data("parent-thread") || "",
            commentee_id: t.data("commentee-id") || ""
        },
        s = !1,
        o = this;
        i.parent_id && (s = !0);
        var u = function (e, t) {
            typeof t == "undefined" && (t = !1),
            n.find('[data-control="error"] .text').html(e),
            n.find('[data-control="info"]').hide(),
            n.find(".control-group").addClass("error"),
            t && n.find(".control-group").addClass("mute")
        },
        a = function (e, t) {
            var n = formatRelativeTime(t, getCookie("scratchlanguage"));
            return interpolate(e, {
                duration: n
            }, !0)
        },
        f = function (e, t) {
            var n = a(gettext(Scratch.ALERT_MSGS["comment-muted-duration"]), t),
            r;
            e == "pii" ? r = gettext(Scratch.ALERT_MSGS["comment-pii-message"]) : e == "unconstructive" ? r = gettext(Scratch.ALERT_MSGS["comment-unconstructive-message"]) : e == "vulgarity" ? r = gettext(Scratch.ALERT_MSGS["comment-vulgarity-message"]) : e == "spam" ? r = gettext(Scratch.ALERT_MSGS["comment-spam-message"]) : r = gettext(Scratch.ALERT_MSGS["comment-bad-general-message"]),
            u(r + " " + n, !0)
        },
        l = function (e) {
            var t = e.error;
            if (t == "isBad") {
                if (typeof e.mute_status != "undefined") {
                    f(e.mute_status.currentMessageType, e.mute_status.muteExpiresAt * 1e3);
                    return
                }
                u(gettext(Scratch.ALERT_MSGS["inappropriate-comment"])),
                _gaq.push(["_trackEvent", o.gaqType, "comment_rejected:bad_word"]);
                return
            }
            if (t == "hasChatSite") {
                u(gettext(Scratch.ALERT_MSGS["comment-has-chat-site"])),
                _gaq.push(["_trackEvent", o.gaqType, "comment_rejected:chat_site"]);
                return
            }
            if (t == "isSpam") {
                u(gettext(Scratch.ALERT_MSGS["comment-spam"]));
                return
            }
            if (t == "isFlood") {
                u(gettext(Scratch.ALERT_MSGS["comment-flood"]));
                return
            }
            if (t == "isMuted") {
                if (typeof e.mute_status != "undefined") {
                    var n = a(gettext(Scratch.ALERT_MSGS["comment-muted-duration"]), e.mute_status.muteExpiresAt * 1e3);
                    u(n, !0)
                } else
                    u(gettext(Scratch.ALERT_MSGS["comment-muted"]));
                return
            }
            if (t == "isUnconstructive") {
                u(gettext(Scratch.ALERT_MSGS["comment-unconstructive"]));
                return
            }
            if (t == "isDisallowed") {
                u(gettext(Scratch.ALERT_MSGS["comment-disallowed"]));
                return
            }
            if (t == "isIPMuted") {
                $("#ip-mute-ban").modal();
                return
            }
            if (t == "isEmpty")
                u(gettext(Scratch.ALERT_MSGS.error));
            else if (t == "isTooLong")
                return;
            u(gettext(Scratch.ALERT_MSGS.error) + "<hr>" + t)
        };
        if (Scratch.INIT_DATA.IS_IP_BANNED) {
            $("#ip-mute-ban").modal();
            return
        }
        if (r == "") {
            u(Scratch.ALERT_MSGS["empty-comment"]);
            return
        }
        t.removeAttr("data-control").addClass("posting"),
        $.ajax({
            type: "POST",
            dataType: "html",
            data: JSON.stringify(i),
            url: Scratch.ROOT_URL + "/site-api/comments/" + this.type + "/" + this.typeId + "/add/"
        }).done(function (e) {
            var n = $(e).filter("#error-data");
            if (n.length > 0) {
                var r = JSON.parse(n.text());
                return l(r)
            }
            _gaq.push(["_trackEvent", o.gaqType, "comment_add"]);
            var u = $("<li></li>");
            s ? (o.$('[data-thread="' + i.parent_id + '"]').append(u.html(e)), t.closest('[data-content="reply-form"]').html("")) : (t.closest("form").find("textarea").val("").end().find("#chars-left").html("500"), o.$('[data-content="comments"]').prepend(u.html(e + '<ul class="replies" data-thread="' + $(e).data("comment-id") + '"></ul>'))),
            o.scrollTo(null, u),
            o.$("span.time").timeago(),
            o.showCommentOptions(u)
        }).error(function (e) {
            Scratch.AlertView.msg($("#alert-view"), {
                alert: "error",
                msg: Scratch.ALERT_MSGS.error
            })
        }).always
        (function (e) {
            t.attr("data-control", "post").removeClass("posting")
        })
    },
    showReplyForm: function (e) {
        function i() {
            var e = r.find('[data-content="reply-form"]:first').html(n.commentReplyTemplate({
                        thread_id: t.data("parent-thread"),
                        commentee_id: t.data("commentee-id"),
                        comment_id: t.data("comment-id")
                    }));
            Scratch.INIT_DATA.IS_SOCIAL ? e.find("textarea").focus().limit("500", "#chars-left-" + t.data("comment-id")) : (e.find("textarea").limit("0"), e.find("textarea").focus(function () {
                    openResendDialogue()
                }))
        }
        if (!this.commentPostingAllowed)
            return;
        var t = $(e.currentTarget),
        n = this,
        r = t.closest("li");
        this.showMoreReplies({
            useAnimation: r.closest(".top-level-reply").find(".truncated").length,
            $elem: r,
            callback: i
        })
    },
    cancel: function (e) {
        e.preventDefault(),
        $(e.currentTarget).parents("form:first").find("textarea")[0].value = "",
        $(e.currentTarget).parents("form:first").find("#chars-left").html("500"),
        $(e.currentTarget).parents('[data-content="reply-form"]:first').empty()
    },
    submitDelete: function (e) {
        var t = $(e.currentTarget).closest("[data-comment-id]"),
        n = t.attr("data-comment-id");
        $.ajax({
            url: Scratch.ROOT_URL + "/site-api/comments/" + this.type + "/" + this.typeId + "/del/",
            type: "POST",
            dataType: "html",
            data: JSON.stringify({
                id: n
            })
        }).done(function (e) {
            t.parent("li").remove(),
            _gaq.push(["_trackEvent", self.gaqType, "comment_deleted"])
        })
    },
    deleteComment: function (e) {
        var t = this;
        if (Scratch.INIT_DATA.ADMIN)
            return t.submitDelete(e);
        this.deleteDialogElem = this.deleteDialogElem || $(Scratch.ALERT_MSGS.delete_comment),
        this.deleteDialogElem.dialog({
            buttons: {
                Cancel: function () {
                    $(this).dialog("close")
                },
                Delete: function () {
                    $(this).dialog("close"),
                    t.submitDelete(e)
                },
                Report: function () {
                    $(this).dialog("close"),
                    t.submitReport(e)
                }
            }
        })
    },
    undeleteComment: function (e) {
        var t = $(e.currentTarget).closest("[data-comment-id]"),
        n = t.attr("data-comment-id"),
        r = this;
        $.ajax({
            url: Scratch.ROOT_URL + "/site-api/comments/" + this.type + "/" + this.typeId + "/undel/",
            type: "POST",
            dataType: "html",
            data: JSON.stringify({
                id: n
            })
        }).done(function (e) {
            t.replaceWith(e),
            $("#comments-" + n).removeClass("removed"),
            $("#comments-" + n).parents("li").removeClass("removed"),
            _gaq.push(["_trackEvent", r.gaqType, "comment_undelete"])
        })
    },
    report: function (e) {
        var t = this;
        if (Scratch.INIT_DATA.ADMIN)
            return t.submitReport(e);
        var n = $(e.currentTarget).closest("[data-comment-id]").find("#comment-user").data("comment-user"),
        r = t.student_usernames.indexOf(n) >= 0,
        i = {
            Cancel: function () {
                $(this).dialog("close")
            },
            Report: function () {
                $(this).dialog("close"),
                t.submitReport(e)
            }
        };
        r ? (this.educatorReportDialog = this.educatorReportDialog || $(Scratch.ALERT_MSGS.report_comment_educator), this.reportDialogElem = this.educatorReportDialog, i.Delete = i.Report, delete i.Report) : (this.reportDialog = this.reportDialog || $(Scratch.ALERT_MSGS.report_comment), this.reportDialogElem = this.reportDialog),
        this.reportDialogElem.dialog({
            buttons: i
        })
    },
    submitReport: function (e) {
        var t = $(e.currentTarget).closest("[data-comment-id]"),
        n = t.attr("data-comment-id");
        $.ajax({
            url: Scratch.ROOT_URL + "/site-api/comments/" + this.type + "/" + this.typeId + "/rep/",
            type: "POST",
            dataType: "html",
            data: JSON.stringify({
                id: n
            })
        }).done(function (e) {
            t.replaceWith(e),
            _gaq.push(["_trackEvent", self.gaqType, "comment_report_add"])
        })
    },
    unreport: function (e) {
        var t = $(e.currentTarget).closest("[data-comment-id]"),
        n = t.attr("data-comment-id"),
        r = $(e.currentTarget).data("report-id"),
        i = this;
        $.ajax({
            url: Scratch.ROOT_URL + "/site-api/comments/" + this.type + "/" + this.typeId + "/unrep/",
            type: "POST",
            dataType: "html",
            data: JSON.stringify({
                id: n,
                rid: r
            })
        }).done(function (e) {
            t.replaceWith(e),
            _gaq.push(["_trackEvent", i.gaqType, "comment_report_remove"])
        })
    },
    scrollTo: function (e, t) {
        if (!e && !t)
            return;
        var n = t || this.$(e);
        if (n.length === 0)
            throw e + " is non-existent.";
        var r = n.closest("li");
        r.addClass("highlighted"),
        !n.is(":visible") && Scratch.INIT_DATA.ADMIN && $("#comments .removed").toggle(),
        r.hasClass("truncated") && this.showMoreReplies({
            $elem: r,
            useAnimation: !1
        });
        var i = $(window),
        s = i.height(),
        o = i.scrollTop(),
        u = o + s,
        a = n.outerHeight(!0),
        f = n.offset().top,
        l = f + a,
        c = f - s / 2 + a / 2,
        h = c / 2;
        if (f < o || l > u)
            return $("html,body").animate({
                scrollTop: c
            }, h > 1e3 ? 1e3 : h).promise()
    },
    showMoreReplies: function (e) {
        function o() {
            i.first().prev().removeClass("lastvisible"),
            i.removeClass("truncated"),
            r.remove(),
            t.callback && t.callback()
        }
        var t = e || {},
        n,
        r,
        i;
        t.currentTarget ? (r = $(t.currentTarget), n = r.closest(".top-level-reply").find(".replies"), t.useAnimation = !0) : (n = t.$elem.closest(".top-level-reply").find(".replies"), r = n.next(".more-replies")),
        i = n.find(".truncated");
        if (t.useAnimation) {
            r.slideUp("fast");
            var s = i.first().prev(".lastvisible");
            s.animate({
                height: s.children(":first").outerHeight()
            }, "fast"),
            i.slideDown("fast").promise().always(function () {
                o(),
                s.height("")
            })
        } else
            o()
    },
    toggleComments: function (e) {
        var t = $(e.target),
        n = this.$(".comments-off"),
        r = this.$(".comments-on"),
        i = this.$('[data-content="reply-form"]'),
        s = this.$('.reply[data-control="reply-to"]'),
        o = t.is(":checked"),
        u = function () {
            n.show(),
            r.hide(),
            i.hide(),
            s.hide()
        },
        a = function () {
            n.hide(),
            r.show(),
            i.show(),
            s.show()
        };
        o ? u() : a(),
        $.post(Scratch.ROOT_URL + "/site-api/comments/" + this.type + "/" + this.typeId + "/toggle-comments/", {}).fail(function (e) {
            o ? (a(), t.removeAttr("checked")) : (u(), t.attr("checked", "checked"))
        })
    }
}), Scratch.ViewController = Backbone.View.extend({
    showView: function (e) {
        this.currentView && this.currentView.close(),
        this.currentView = e,
        this.currentView && (this.currentView.render(), this.$el.html(this.currentView.el))
    }
}), Scratch.FollowButton = Backbone.View.extend({
    events: {
        'click [data-control="follow"]': "follow",
        'click [data-control="unfollow"]': "unfollow"
    },
    initialize: function (e) {
        _.bindAll(this, "followed"),
        _.bindAll(this, "unfollowed"),
        this.displayName = e.displayName
    },
    follow: function () {
        this.model.related.followers.addItems(Scratch.LoggedInUser.get("username"), {
            success: this.followed,
            error: this.onFollowError
        })
    },
    followed: function (e, t) {
        this.$('[data-control="follow"]').removeClass("blue notfollowing").addClass("grey following").attr("data-control", "unfollow"),
        Scratch.AlertView.msg($("#alert-view"), {
            alert: "success",
            msg: Scratch.ALERT_MSGS.followed + this.displayName
        }),
        _gaq.push(["_trackEvent", "studio", "follow_add"])
    },
    onFollowError: function (e, t) {
        Scratch.AlertView.msg($("#alert-view"), {
            alert: "error",
            msg: e.responseJSON[0].errors.join(",")
        })
    },
    unfollow: function () {
        this.model.related.followers.removeItems(Scratch.LoggedInUser.get("username"), {
            success: this.unfollowed
        })
    },
    unfollowed: function (e, t) {
        this.$('[data-control="unfollow"]').removeClass("grey following").addClass("blue notfollowing").attr("data-control", "follow"),
        Scratch.AlertView.msg($("#alert-view"), {
            alert: "success",
            msg: Scratch.ALERT_MSGS.unfollowed + this.displayName
        }),
        _gaq.push(["_trackEvent", "studio", "follow_remove"])
    }
}), Scratch.EditableTextField = Backbone.View.extend({
    events: {
        "focusout textarea": "saveEditable",
        "focusout input": "saveEditable",
        click: "edit",
        "submit form": "preventFormSubmit"
    },
    initialize: function (e, t) {
        _.bindAll(this, "success", "error", "saveEditable"),
        this.$eField = this.$("input, textarea"),
        this.eField = this.$eField[0]
    },
    saveEditable: function (e) {
        if (this.eField.value != this.eField.defaultValue) {
            var t = {};
            t[this.eField.name] = this.eField.value,
            this.serverCall(t),
            e.type == "focusout" && this.$el.addClass("loading"),
            this.eField.defaultValue = this.eField.value
        }
        e.type == "focusout" && (clearInterval(this.saveInt), this.$el.removeClass("editable-empty").addClass("editable"), this.$el.addClass("read").removeClass("write"), this.eField.value || (this.$el.addClass("editable-empty").removeClass("editable"), this.$('[data-content="prompt"]').show()))
    },
    serverCall: function (e) {
        this.model.save(e, {
            wait: !0,
            success: this.success,
            error: this.error
        })
    },
    edit: function (e) {
        if (!this.$("form").length)
            return this.undelegateEvents();
        this.clearPrompt(),
        this.$el.removeClass("read").addClass("write"),
        this.$eField.focus();
        var t = this;
        clearInterval(this.saveInt),
        this.saveInt = setInterval(function () {
            t.saveEditable(e)
        }, 1e4)
    },
    clearPrompt: function () {
        this.$('[data-content="prompt"]').hide(),
        this.$eField.focus()
    },
    preventFormSubmit: function (e) {
        e.preventDefault(),
        this.saveEditable(e)
    },
    success: function (e, t) {
        this.$el.removeClass("loading");
        if (t.errors) {
            Scratch.AlertView.msg($("#alert-view"), {
                alert: "error",
                msg: Scratch.ALERT_MSGS[t.errors[0]],
                timer: 1e4
            });
            return
        }
        this.onEditSuccess()
    },
    onEditSuccess: function (e) {},
    error: function (e, t, n) {
        throw "in Scratch.EditableTextField, error - responseText:" + t.responseText + "  status:" + t.status
    }
}), Scratch.EditableSelectField = Backbone.View.extend({
    events: {
        "change select": "saveEditable",
        "submit form": "preventFormSubmit"
    },
    initialize: function (e, t) {
        _.bindAll(this, "success", "error", "saveEditable"),
        this.$eField = this.$("select"),
        this.eField = this.$eField[0]
    },
    saveEditable: function (e) {
        var t = {};
        t[this.eField.name] = this.$("select").val(),
        this.serverCall(t)
    },
    serverCall: function (e) {
        this.model.save(e, {
            wait: !0,
            success: this.success,
            error: this.error
        })
    },
    preventFormSubmit: function (e) {
        e.preventDefault(),
        this.saveEditable(e)
    },
    success: function (e, t) {
        this.$el.removeClass("loading");
        if (t.isBad) {
            Scratch.AlertView.msg($("#alert-view"), {
                alert: "error",
                msg: Scratch.ALERT_MSGS["inappropriate-generic"],
                timer: 1e4
            });
            return
        }
        this.onEditSuccess()
    },
    onEditSuccess: function (e) {},
    error: function (e, t, n) {
        throw "in Scratch.EditableSelectField, error - responseText:" + t.responseText + "  status:" + t.status
    }
}), Scratch.EditableCheckboxField = Backbone.View.extend({
    events: {
        'click [type="checkbox"]': "saveEditable",
        "submit form": "preventFormSubmit"
    },
    initialize: function (e, t) {
        _.bindAll(this, "success", "error", "saveEditable"),
        this.$eField = this.$('input[type="checkbox"]'),
        this.eField = this.$eField[0]
    },
    saveEditable: function (e) {
        var t = {};
        t[this.eField.name] = this.$eField.is(":checked") ? 1 : 0,
        this.serverCall(t)
    },
    serverCall: function (e) {
        this.model.save(e, {
            wait: !0,
            success: this.success,
            error: this.error
        })
    },
    preventFormSubmit: function (e) {
        e.preventDefault(),
        this.saveEditable(e)
    },
    success: function (e, t) {
        this.$el.removeClass("loading");
        if (t.isBad) {
            Scratch.AlertView.msg($("#alert-view"), {
                alert: "error",
                msg: Scratch.ALERT_MSGS["inappropriate-generic"],
                timer: 1e4
            });
            return
        }
        this.onEditSuccess()
    },
    onEditSuccess: function (e) {},
    error: function (e, t, n) {
        throw "in Scratch.EditableSelectField, error - responseText:" + t.responseText + "  status:" + t.status
    }
}), Scratch.EditableImage = Backbone.View.extend({
    events: {
        mouseover: "showEdit",
        mouseout: "hideEdit",
        'change input[type="file"]': "submit"
    },
    initialize: function () {
        _.bindAll(this, "imageUploadStart"),
        _.bindAll(this, "imageUploadSuccess"),
        this.$el.fileupload({
            url: this.model.url(),
            done: this.imageUploadSuccess,
            start: this.imageUploadStart,
            pasteZone: this.$el
        })
    },
    showEdit: function (e) {
        this.$el.addClass("edit")
    },
    hideEdit: function (e) {
        this.$el.removeClass("edit")
    },
    imageUploadSuccess: function (e, t) {
        this.$el.removeClass("loading");
        if (t.result.error)
            Scratch.AlertView.msg($("#alert-view"), {
                alert: "error",
                msg: t.result.errors[0]
            });
        else if (t.result.errors)
            Scratch.AlertView.msg($("#alert-view"), {
                alert: "error",
                msg: Scratch.ALERT_MSGS[t.result.errors[0]],
                timer: 1e4
            });
        else {
            var n = t.result.thumbnail_url + "#" + (new Date).getTime();
            this.$("img").attr("src", n),
            Scratch.AlertView.msg($("#alert-view"), {
                alert: "success",
                msg: Scratch.ALERT_MSGS["thumbnail-changed"]
            })
        }
    },
    imageUploadStart: function () {
        this.$el.removeClass("edit"),
        this.$el.addClass("loading")
    },
    submit: function (e) {}
});
var Scratch = Scratch || {}, gettext_noop = gettext_noop || function (e) {
    return e
};
Scratch.ALERT_MSGS = {
    error: gettext_noop("Oops! Something went wrong"),
    "inappropriate-generic": gettext_noop('Hmm...the bad word detector thinks there is a problem with your text. Please change it and remember to <a target="_blank" href="/community_guidelines/">be respectful</a>.'),
    "image-invalid": gettext_noop("Upload a valid image. The file you uploaded was either not an image or a corrupted image."),
    "thumbnail-missing": gettext_noop("Missing file"),
    "thumbnail-upload-bad": gettext_noop("Bad upload"),
    "thumbnail-too-large": gettext_noop("Maximum file size is 512 KB and less than 500x500 pixels."),
    "thumbnail-confirm-email": gettext_noop("Please confirm your email address to perform this action."),
    "inappropriate-comment": gettext_noop('Hmm...the bad word detector thinks there is a problem with your comment. Please change it and remember to <a target="_blank" href="/community_guidelines/">be respectful</a>.'),
    "comment-has-chat-site"
    : gettext_noop("Uh oh! This comment contains a link to a website with unmoderated chat. For safety reasons, please do not link to these sites!"),
    "empty-comment": gettext_noop("You can't post an empty comment!"),
    delete_comment: gettext_noop('<div title="Delete Comment?"><p>Are you sure you want to delete this comment? If the comment is mean or disrespectful, please click report instead, to let the Scratch Team know about it.</p></div>'),
    report_comment: gettext_noop('<div title="Report Comment?"></p>Are you sure you want to report this comment?</p></div>'),
    report_comment_educator: gettext_noop('<div title="Delete Comment?"></p>Are you sure you want to delete this comment?</p></div>'),
    followed: gettext_noop("You are now following "),
    unfollowed: gettext_noop("You are no longer following "),
    "comment-spam": gettext_noop("Hmm, seems like you've posted the same comment a bunch of times. Please don't spam."),
    "comment-flood": gettext_noop("Woah, seems like you're commenting really quickly. Please wait longer between posts."),
    "comment-muted": gettext_noop("Hmm, the filterbot is pretty sure your recent comments weren't ok for Scratch, so your account has been muted for the rest of the day. :/"),
    "comment-muted-duration": gettext_noop("You will be able to comment again %(duration)s. Your account has been paused from commenting until then."),
    "comment-bad-general-message": gettext_noop("It appears that your comment didn\u2019t follow the Scratch Community Guidelines."),
    "comment-unconstructive": gettext_noop("Hmm, the filterbot thinks your comment may be mean or disrespectful. Remember, most projects on Scratch are made by people who are just learning how to program. Read the <a href='/community_guidelines'>community guidelines</a>, and be nice."),
    "comment-unconstructive-message": gettext_noop("It appears that your comment was saying something that might have been hurtful."),
    "comment-vulgarity-message": gettext_noop("It appears that your comment contains a bad word."),
    "comment-pii-message": gettext_noop("Your comment appeared to be sharing or asking for private information."),
    "comment-spam-message": gettext_noop("Your most recent comment appeared to contain advertising, text art, or a chain message."),
    "comment-disallowed": gettext_noop("Hmm, it looks like comments have been turned off for this page. :/"),
    "project-complaint-length": gettext_noop("That's too short. Please describe in detail what's inappropriate or disrespectful about the project."),
    "project-complaint-buglength": gettext_noop("That's too short! Please describe in detail what you expected the project to do, and how exactly it is broken. Thanks!"),
    "editable-text-too-long": gettext_noop("That's too long! Please find a way to shorten your text."),
    "muted-create-studio": gettext_noop("You will be able to create studios again %(duration)s. Your account has been paused until then."),
    "studio-rate-limit": gettext_noop("Woah, seems like you're creating studios really quickly. Please wait a bit longer between creating studios."),
    "thumbnail-changed": gettext_noop("Thumbnail changed")
}, Scratch.UserThumbnail = Scratch.Model.extend({
    urlRoot: Scratch.ROOT_URL + "/site-api/users/all/",
    slug: "username"
}), Scratch.UserThumbnailCollection = Scratch.Collection.extend({
    model: Scratch.UserThumbnail,
    urlRoot: Scratch.ROOT_URL + "/site-api/users/",
    slug: "username",
    initialize: function (e, t) {
        this._meta = t,
        this.options = t
    },
    deleteItem: function (e, t) {
        this.remove(e),
        t.url = this.url() + "remove/" + this.url_params({
            usernames: e.get("fields").user.username
        }),
        this.sync("update", e, t)
    },
    addItem: function (e) {
        e.url = this.url() + "add/" + this.url_params({
            usernames: e.usernames
        }),
        this.sync("update", new Scratch.UserThumbnail, e)
    },
    meta: function (e, t) {
        if (t === undefined)
            return this._meta[e];
        this._meta[e] = t
    }
}), Scratch.LoggedInUserModel = Scratch.UserThumbnail.extend({
    authenticated: !1,
    admin: !1,
    loginUrl: Scratch.ROOT_URL + "/login/",
    loginRetryUrl: Scratch.ROOT_URL + "/login_retry/",
    currentLoginUrl: Scratch.ROOT_URL + "/login/",
    initialize: function (e, t) {
        this.constructor.__super__.initialize.apply(this, [e, t]),
        this.authenticated = t.authenticated
    },
    login: function (e, t) {
        this.save(e, $.extend(t, {
                url: this.currentLoginUrl,
                wait: !0
            })),
        this.authenticated = !0
    },
    logout: function () {
        this.authenticated = !1
    }
}), Scratch.ProjectThumbnail = Scratch.Model.extend({
    urlRoot: Scratch.ROOT_URL + "/site-api/projects/all/"
}), Scratch.ProjectThumbnailCollection = Scratch.Collection.extend({
    model: Scratch.ProjectThumbnail,
    urlRoot: Scratch.ROOT_URL + "/site-api/projects/",
    initialize: function (e, t) {
        _.bindAll(this, "added"),
        _.bindAll(this, "deletedAll"),
        this._meta = t,
        this.options = t
    },
    added: function (e, t) {
        this.fetch()
    },
    deleteAll: function (e) {
        this._meta["collectionType"] == "trashed" && (e || (e = {}), _.extend(e, {
                url: this.url() + "empty/",
                success: this.deletedAll
            }), Backbone.sync("update", this, e))
    },
    deletedAll: function (e, t) {
        this.fetch()
    },
    meta: function (e, t) {
        if (t === undefined)
            return this._meta[e];
        this._meta[e] = t
    }
}), Scratch.GalleryThumbnail = Scratch.Model.extend({
    urlRoot: Scratch.ROOT_URL + "/site-api/galleries/all/"
}), Scratch.GalleryThumbnailCollection = Scratch.Collection.extend({
    model: Scratch.GalleryThumbnail,
    urlRoot: Scratch.ROOT_URL + "/site-api/galleries/",
    initialize: function (e, t) {
        this._meta = t,
        this.options = t
    },
    meta: function (e, t) {
        if (t === undefined)
            return this._meta[e];
        this._meta[e] = t
    }
}), Scratch.Comment = Scratch.Model.extend({
    urlRoot: Scratch.ROOT_URL + "/site-api/comments/"
}), Scratch.CommentCollection = Scratch.Collection.extend({
    model: Scratch.Comment,
    urlRoot: Scratch.ROOT_URL + "/site-api/comments/",
    initialize: function (e, t) {
        this.options = t
    },
    toggleDisabled: function () {},
    addComment: function (e, t) {
        var t = t || {};
        return t.url = this.url() + "add/?",
        t.data = JSON.stringify(e),
        Backbone.sync("create", this.parentModel, t)
    },
    isCommentOkay: function (e) {},
    report: function (e, t) {
        e || (e = {});
        var n = this.url() + "rep/";
        $.ajax(n, {
            type: "POST",
            data: JSON.stringify(e),
            dataType: "json",
            success: t
        })
    },
    unreport: function (e, t) {
        e || (e = {});
        var n = this.url() + "unrep/";
        $.ajax(n, {
            type: "POST",
            data: JSON.stringify(e),
            dataType: "json",
            success: t
        })
    }
}), 
(function( $ ) {
    $.fn.scratchIncrementCount = function (val) {
        var count = parseInt(this.html(), 10);
        count+=val,
        this.html(count)
    },
    $.withCSRF = function (f) {
        $.get("/csrf_token/", function (data, status, xhr) {
            csrf = ("; " + document.cookie).split("; scratchcsrftoken=")[1].split(";")[0],
            f(csrf)
        })
    }
})(jQuery);

$.ajaxSetup({
    jsonp: false
});

$(document).ajaxSend(function (event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != "") {
            var cookies = document.cookie.split(";");
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
				// Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == name + "=") {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    function sameOrigin(url) {
		// url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        protocol = document.location.protocol;
        sr_origin = "//" + host,
        origin = protocol + sr_origin;
		// Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
		(url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
		// or any other URL that isn't scheme relative or absolute i.e relative.
		!/^(\/\/|http:|https:).*/.test(url);
    }
    function safeMethod(method) {
        return /^(GET|HEAD|OPTIONS|TRACE)$/.test(method)
    }
    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
		xhr.setRequestHeader("X-CSRFToken", getCookie('scratchcsrftoken'));
	}
});

/* add a callback for ajax errors where no handler is defined */
$(document).ajaxError(function(event, xhr, ajaxSettings, thrownError) {
  if ( ajaxSettings.error===undefined ){ // if no error handler is defined
    
    if ( location.port==='' ){ // log non-dev-port errors to Google Analytics
      throw 'Uncaught ajax error. Attempted URL: '+ajaxSettings.url+'   Status: '+ xhr.status;
    } else if ( xhr.status===0 ){ // else we're on a dev port and with a response status 0
      // Workaround for successful requests incorrectly appearing to fail on dev ports. Not applicable on production.
      // see https://code.google.com/p/chromium/issues/detail?id=195550
      ajaxSettings.success(ajaxSettings.fakeResponseForDevPortAjaxFail,xhr.status,xhr);
      console.error('Status 0 ajax bug. Calling success(options.fakeResponseForDevPortAjaxFail, xhr.status, xhr)');
    }
  }
});

/* extend twitter-bootstrap-dropdown.js to handle more select style dropdown for filters */
$(document).on('click', '.dropdown.select ul li', function() {
  var text = $(this).text();
  var $dropdown = $(this).closest('.dropdown');
  var $selected = $dropdown.find('.selected');
  $dropdown.find('li.hide').removeClass('hide');
  $(this).addClass('hide');
  $selected.text(text);
}),

$(document).on('click', '.dropdown.radio-style ul li', function() {
  var $dropdown = $(this).closest('.dropdown');
  $dropdown.find('.selected').removeClass('selected');
  $(this).addClass('selected');
}),

$.urlParam = function (name) {
  if (window.location.search.indexOf(name) == -1) {
    return null;
  } else {
	  var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
	  return results[1] || 0;
  }
};