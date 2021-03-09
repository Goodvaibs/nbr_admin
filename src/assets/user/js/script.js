!function(a) {
    "use strict";
    for (var b, c, d = {}, e = function() {}, f = "memory".split(","), g = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","); b = f.pop(); ) a[b] = a[b] || d;
    for (;c = g.pop(); ) a[c] = a[c] || e;
}(window.console = window.console || {}), function(a, b) {
    "use strict";
    function c(a) {
        this.callback = a, this.ticking = !1;
    }
    function d(a) {
        if (arguments.length <= 0) throw new Error("Missing arguments in extend function");
        var b, c, e = a || {};
        for (c = 1; c < arguments.length; c++) {
            var f = arguments[c] || {};
            for (b in f) "object" == typeof e[b] ? e[b] = d(e[b], f[b]) : e[b] = e[b] || f[b];
        }
        return e;
    }
    function e(a, b) {
        b = d(b, e.options), this.lastKnownScrollY = 0, this.elem = a, this.debouncer = new c(this.update.bind(this)), 
        this.tolerance = b.tolerance, this.classes = b.classes, this.offset = b.offset, 
        this.initialised = !1, this.onPin = b.onPin, this.onUnpin = b.onUnpin;
    }
    var f = {
        bind: !!function() {}.bind,
        classList: "classList" in b.documentElement,
        rAF: !!(a.requestAnimationFrame || a.webkitRequestAnimationFrame || a.mozRequestAnimationFrame)
    };
    a.requestAnimationFrame = a.requestAnimationFrame || a.webkitRequestAnimationFrame || a.mozRequestAnimationFrame, 
    c.prototype = {
        constructor: c,
        update: function() {
            this.callback && this.callback(), this.ticking = !1;
        },
        requestTick: function() {
            this.ticking || (requestAnimationFrame(this.rafCallback || (this.rafCallback = this.update.bind(this))), 
            this.ticking = !0);
        },
        handleEvent: function() {
            this.requestTick();
        }
    }, e.prototype = {
        constructor: e,
        init: function() {
            return e.cutsTheMustard ? (this.elem.classList.add(this.classes.initial), setTimeout(this.attachEvent.bind(this), 100), 
            this) : void 0;
        },
        destroy: function() {
            var b = this.classes;
            this.initialised = !1, a.removeEventListener("scroll", this.debouncer, !1), this.elem.classList.remove(b.unpinned, b.pinned, b.initial);
        },
        attachEvent: function() {
            this.initialised || (this.lastKnownScrollY = this.getScrollY(), this.initialised = !0, 
            a.addEventListener("scroll", this.debouncer, !1));
        },
        unpin: function() {
            var a = this.elem.classList, b = this.classes;
            (a.contains(b.pinned) || !a.contains(b.unpinned)) && (a.add(b.unpinned), a.remove(b.pinned), 
            this.onUnpin && this.onUnpin.call(this));
        },
        pin: function() {
            var a = this.elem.classList, b = this.classes;
            a.contains(b.unpinned) && (a.remove(b.unpinned), a.add(b.pinned), this.onPin && this.onPin.call(this));
        },
        getScrollY: function() {
            return void 0 !== a.pageYOffset ? a.pageYOffset : (b.documentElement || b.body.parentNode || b.body).scrollTop;
        },
        getViewportHeight: function() {
            return a.innerHeight || b.documentElement.clientHeight || b.body.clientHeight;
        },
        getDocumentHeight: function() {
            var a = b.body, c = b.documentElement;
            return Math.max(a.scrollHeight, c.scrollHeight, a.offsetHeight, c.offsetHeight, a.clientHeight, c.clientHeight);
        },
        isOutOfBounds: function(a) {
            var b = 0 > a, c = a + this.getViewportHeight() > this.getDocumentHeight();
            return b || c;
        },
        toleranceExceeded: function(a) {
            return Math.abs(a - this.lastKnownScrollY) >= this.tolerance;
        },
        shouldUnpin: function(a, b) {
            var c = a > this.lastKnownScrollY, d = a >= this.offset;
            return c && d && b;
        },
        shouldPin: function(a, b) {
            var c = a < this.lastKnownScrollY, d = a <= this.offset;
            return c && b || d;
        },
        update: function() {
            var a = this.getScrollY(), b = this.toleranceExceeded(a);
            this.isOutOfBounds(a) || (this.shouldUnpin(a, b) ? this.unpin() : this.shouldPin(a, b) && this.pin(), 
            this.lastKnownScrollY = a);
        }
    }, e.options = {
        tolerance: 0,
        offset: 0,
        classes: {
            pinned: "headroom--pinned",
            unpinned: "headroom--unpinned",
            initial: "headroom"
        }
    }, e.cutsTheMustard = "undefined" != typeof f && f.rAF && f.bind && f.classList, 
    a.Headroom = e;
}(window, document), function(a) {
    a.extend(a.fn, {
        validate: function(b) {
            if (!this.length) return void (b && b.debug && window.console && console.warn("Nothing selected, can't validate, returning nothing."));
            var c = a.data(this[0], "validator");
            return c ? c : (this.attr("novalidate", "novalidate"), c = new a.validator(b, this[0]), 
            a.data(this[0], "validator", c), c.settings.onsubmit && (this.validateDelegate(":submit", "click", function(b) {
                c.settings.submitHandler && (c.submitButton = b.target), a(b.target).hasClass("cancel") && (c.cancelSubmit = !0), 
                void 0 !== a(b.target).attr("formnovalidate") && (c.cancelSubmit = !0);
            }), this.submit(function(b) {
                function d() {
                    var d;
                    return c.settings.submitHandler ? (c.submitButton && (d = a("<input type='hidden'/>").attr("name", c.submitButton.name).val(a(c.submitButton).val()).appendTo(c.currentForm)), 
                    c.settings.submitHandler.call(c, c.currentForm, b), c.submitButton && d.remove(), 
                    !1) : !0;
                }
                return c.settings.debug && b.preventDefault(), c.cancelSubmit ? (c.cancelSubmit = !1, 
                d()) : c.form() ? c.pendingRequest ? (c.formSubmitted = !0, !1) : d() : (c.focusInvalid(), 
                !1);
            })), c);
        },
        valid: function() {
            if (a(this[0]).is("form")) return this.validate().form();
            var b = !0, c = a(this[0].form).validate();
            return this.each(function() {
                b = b && c.element(this);
            }), b;
        },
        removeAttrs: function(b) {
            var c = {}, d = this;
            return a.each(b.split(/\s/), function(a, b) {
                c[b] = d.attr(b), d.removeAttr(b);
            }), c;
        },
        rules: function(b, c) {
            var d = this[0];
            if (b) {
                var e = a.data(d.form, "validator").settings, f = e.rules, g = a.validator.staticRules(d);
                switch (b) {
                  case "add":
                    a.extend(g, a.validator.normalizeRule(c)), delete g.messages, f[d.name] = g, c.messages && (e.messages[d.name] = a.extend(e.messages[d.name], c.messages));
                    break;

                  case "remove":
                    if (!c) return delete f[d.name], g;
                    var h = {};
                    return a.each(c.split(/\s/), function(a, b) {
                        h[b] = g[b], delete g[b];
                    }), h;
                }
            }
            var i = a.validator.normalizeRules(a.extend({}, a.validator.classRules(d), a.validator.attributeRules(d), a.validator.dataRules(d), a.validator.staticRules(d)), d);
            if (i.required) {
                var j = i.required;
                delete i.required, i = a.extend({
                    required: j
                }, i);
            }
            return i;
        }
    }), a.extend(a.expr[":"], {
        blank: function(b) {
            return !a.trim("" + a(b).val());
        },
        filled: function(b) {
            return !!a.trim("" + a(b).val());
        },
        unchecked: function(b) {
            return !a(b).prop("checked");
        }
    }), a.validator = function(b, c) {
        this.settings = a.extend(!0, {}, a.validator.defaults, b), this.currentForm = c, 
        this.init();
    }, a.validator.format = function(b, c) {
        return 1 === arguments.length ? function() {
            var c = a.makeArray(arguments);
            return c.unshift(b), a.validator.format.apply(this, c);
        } : (arguments.length > 2 && c.constructor !== Array && (c = a.makeArray(arguments).slice(1)), 
        c.constructor !== Array && (c = [ c ]), a.each(c, function(a, c) {
            b = b.replace(new RegExp("\\{" + a + "\\}", "g"), function() {
                return c;
            });
        }), b);
    }, a.extend(a.validator, {
        defaults: {
            messages: {},
            groups: {},
            rules: {},
            errorClass: "error",
            validClass: "valid",
            errorElement: "label",
            focusInvalid: !0,
            errorContainer: a([]),
            errorLabelContainer: a([]),
            onsubmit: !0,
            ignore: "",
            ignoreTitle: !1,
            onfocusin: function(a, b) {
                this.lastActive = a, this.settings.focusCleanup && !this.blockFocusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, a, this.settings.errorClass, this.settings.validClass), 
                this.addWrapper(this.errorsFor(a)).hide());
            },
            onfocusout: function(a, b) {
                this.checkable(a) || !(a.name in this.submitted) && this.optional(a) || this.element(a);
            },
            onkeyup: function(a, b) {
                (9 !== b.which || "" !== this.elementValue(a)) && (a.name in this.submitted || a === this.lastElement) && this.element(a);
            },
            onclick: function(a, b) {
                a.name in this.submitted ? this.element(a) : a.parentNode.name in this.submitted && this.element(a.parentNode);
            },
            highlight: function(b, c, d) {
                "radio" === b.type ? this.findByName(b.name).addClass(c).removeClass(d) : a(b).addClass(c).removeClass(d);
            },
            unhighlight: function(b, c, d) {
                "radio" === b.type ? this.findByName(b.name).removeClass(c).addClass(d) : a(b).removeClass(c).addClass(d);
            }
        },
        setDefaults: function(b) {
            a.extend(a.validator.defaults, b);
        },
        messages: {
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
            maxlength: a.validator.format("Please enter no more than {0} characters."),
            minlength: a.validator.format("Please enter at least {0} characters."),
            rangelength: a.validator.format("Please enter a value between {0} and {1} characters long."),
            range: a.validator.format("Please enter a value between {0} and {1}."),
            max: a.validator.format("Please enter a value less than or equal to {0}."),
            min: a.validator.format("Please enter a value greater than or equal to {0}.")
        },
        autoCreateRanges: !1,
        prototype: {
            init: function() {
                function b(b) {
                    var c = a.data(this[0].form, "validator"), d = "on" + b.type.replace(/^validate/, "");
                    c.settings[d] && c.settings[d].call(c, this[0], b);
                }
                this.labelContainer = a(this.settings.errorLabelContainer), this.errorContext = this.labelContainer.length && this.labelContainer || a(this.currentForm), 
                this.containers = a(this.settings.errorContainer).add(this.settings.errorLabelContainer), 
                this.submitted = {}, this.valueCache = {}, this.pendingRequest = 0, this.pending = {}, 
                this.invalid = {}, this.reset();
                var c = this.groups = {};
                a.each(this.settings.groups, function(b, d) {
                    "string" == typeof d && (d = d.split(/\s/)), a.each(d, function(a, d) {
                        c[d] = b;
                    });
                });
                var d = this.settings.rules;
                a.each(d, function(b, c) {
                    d[b] = a.validator.normalizeRule(c);
                }), a(this.currentForm).validateDelegate(":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'] ,[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'] ", "focusin focusout keyup", b).validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", b), 
                this.settings.invalidHandler && a(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
            },
            form: function() {
                return this.checkForm(), a.extend(this.submitted, this.errorMap), this.invalid = a.extend({}, this.errorMap), 
                this.valid() || a(this.currentForm).triggerHandler("invalid-form", [ this ]), this.showErrors(), 
                this.valid();
            },
            checkForm: function() {
                this.prepareForm();
                for (var a = 0, b = this.currentElements = this.elements(); b[a]; a++) this.check(b[a]);
                return this.valid();
            },
            element: function(b) {
                b = this.validationTargetFor(this.clean(b)), this.lastElement = b, this.prepareElement(b), 
                this.currentElements = a(b);
                var c = this.check(b) !== !1;
                return c ? delete this.invalid[b.name] : this.invalid[b.name] = !0, this.numberOfInvalids() || (this.toHide = this.toHide.add(this.containers)), 
                this.showErrors(), c;
            },
            showErrors: function(b) {
                if (b) {
                    a.extend(this.errorMap, b), this.errorList = [];
                    for (var c in b) this.errorList.push({
                        message: b[c],
                        element: this.findByName(c)[0]
                    });
                    this.successList = a.grep(this.successList, function(a) {
                        return !(a.name in b);
                    });
                }
                this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors();
            },
            resetForm: function() {
                a.fn.resetForm && a(this.currentForm).resetForm(), this.submitted = {}, this.lastElement = null, 
                this.prepareForm(), this.hideErrors(), this.elements().removeClass(this.settings.errorClass).removeData("previousValue");
            },
            numberOfInvalids: function() {
                return this.objectLength(this.invalid);
            },
            objectLength: function(a) {
                var b = 0;
                for (var c in a) b++;
                return b;
            },
            hideErrors: function() {
                this.addWrapper(this.toHide).hide();
            },
            valid: function() {
                return 0 === this.size();
            },
            size: function() {
                return this.errorList.length;
            },
            focusInvalid: function() {
                if (this.settings.focusInvalid) {
                    var b = bb.focusInvalidElements(a(this.currentForm));
                    if (!b) try {
                        a(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin");
                    } catch (c) {}
                }
            },
            findLastActive: function() {
                var b = this.lastActive;
                return b && 1 === a.grep(this.errorList, function(a) {
                    return a.element.name === b.name;
                }).length && b;
            },
            elements: function() {
                var b = this, c = {};
                return a(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function() {
                    return !this.name && b.settings.debug && window.console && console.error("%o has no name assigned", this), 
                    this.name in c || !b.objectLength(a(this).rules()) ? !1 : (c[this.name] = !0, !0);
                });
            },
            clean: function(b) {
                return a(b)[0];
            },
            errors: function() {
                var b = this.settings.errorClass.replace(" ", ".");
                return a(this.settings.errorElement + "." + b, this.errorContext);
            },
            reset: function() {
                this.successList = [], this.errorList = [], this.errorMap = {}, this.toShow = a([]), 
                this.toHide = a([]), this.currentElements = a([]);
            },
            prepareForm: function() {
                this.reset(), this.toHide = this.errors().add(this.containers);
            },
            prepareElement: function(a) {
                this.reset(), this.toHide = this.errorsFor(a);
            },
            elementValue: function(b) {
                var c = a(b).attr("type"), d = a(b).val();
                return "radio" === c || "checkbox" === c ? a("input[name='" + a(b).attr("name") + "']:checked").val() : "string" == typeof d ? d.replace(/\r/g, "") : d;
            },
            check: function(b) {
                b = this.validationTargetFor(this.clean(b));
                var c, d = a(b).rules(), e = !1, f = this.elementValue(b);
                for (var g in d) {
                    var h = {
                        method: g,
                        parameters: d[g]
                    };
                    try {
                        if (c = a.validator.methods[g].call(this, f, b, h.parameters), "dependency-mismatch" === c) {
                            e = !0;
                            continue;
                        }
                        if (e = !1, "pending" === c) return void (this.toHide = this.toHide.not(this.errorsFor(b)));
                        if (!c) return this.formatAndAdd(b, h), !1;
                    } catch (i) {
                        throw this.settings.debug && window.console && console.log("Exception occurred when checking element " + b.id + ", check the '" + h.method + "' method.", i), 
                        i;
                    }
                }
                return e ? void 0 : (this.objectLength(d) && this.successList.push(b), !0);
            },
            customDataMessage: function(b, c) {
                return a(b).data("msg-" + c.toLowerCase()) || b.attributes && a(b).attr("data-msg-" + c.toLowerCase());
            },
            customMessage: function(a, b) {
                var c = this.settings.messages[a];
                return c && (c.constructor === String ? c : c[b]);
            },
            findDefined: function() {
                for (var a = 0; a < arguments.length; a++) if (void 0 !== arguments[a]) return arguments[a];
                return void 0;
            },
            defaultMessage: function(b, c) {
                return this.findDefined(this.customMessage(b.name, c), this.customDataMessage(b, c), !this.settings.ignoreTitle && b.title || void 0, a.validator.messages[c], "<strong>Warning: No message defined for " + b.name + "</strong>");
            },
            formatAndAdd: function(b, c) {
                var d = this.defaultMessage(b, c.method), e = /\$?\{(\d+)\}/g;
                "function" == typeof d ? d = d.call(this, c.parameters, b) : e.test(d) && (d = a.validator.format(d.replace(e, "{$1}"), c.parameters)), 
                this.errorList.push({
                    message: d,
                    element: b
                }), this.errorMap[b.name] = d, this.submitted[b.name] = d;
            },
            addWrapper: function(a) {
                return this.settings.wrapper && (a = a.add(a.parent(this.settings.wrapper))), a;
            },
            defaultShowErrors: function() {
                var a, b;
                for (a = 0; this.errorList[a]; a++) {
                    var c = this.errorList[a];
                    this.settings.highlight && this.settings.highlight.call(this, c.element, this.settings.errorClass, this.settings.validClass), 
                    this.showLabel(c.element, c.message);
                }
                if (this.errorList.length && (this.toShow = this.toShow.add(this.containers)), this.settings.success) for (a = 0; this.successList[a]; a++) this.showLabel(this.successList[a]);
                if (this.settings.unhighlight) for (a = 0, b = this.validElements(); b[a]; a++) this.settings.unhighlight.call(this, b[a], this.settings.errorClass, this.settings.validClass);
                this.toHide = this.toHide.not(this.toShow), this.hideErrors(), this.addWrapper(this.toShow).show();
            },
            validElements: function() {
                return this.currentElements.not(this.invalidElements());
            },
            invalidElements: function() {
                return a(this.errorList).map(function() {
                    return this.element;
                });
            },
            showLabel: function(b, c) {
                var d = this.errorsFor(b);
                d.length ? (d.removeClass(this.settings.validClass).addClass(this.settings.errorClass), 
                d.html(c)) : (d = a("<" + this.settings.errorElement + ">").attr("for", this.idOrName(b)).addClass(this.settings.errorClass).html(c || ""), 
                this.settings.wrapper && (d = d.hide().show().wrap("<" + this.settings.wrapper + "/>").parent()), 
                this.labelContainer.append(d).length || (this.settings.errorPlacement ? this.settings.errorPlacement(d, a(b)) : d.insertAfter(b))), 
                !c && this.settings.success && (d.text(""), "string" == typeof this.settings.success ? d.addClass(this.settings.success) : this.settings.success(d, b)), 
                this.toShow = this.toShow.add(d);
            },
            errorsFor: function(b) {
                var c = this.idOrName(b);
                return this.errors().filter(function() {
                    return a(this).attr("for") === c;
                });
            },
            idOrName: function(a) {
                return this.groups[a.name] || (this.checkable(a) ? a.name : a.id || a.name);
            },
            validationTargetFor: function(a) {
                return this.checkable(a) && (a = this.findByName(a.name).not(this.settings.ignore)[0]), 
                a;
            },
            checkable: function(a) {
                return /radio|checkbox/i.test(a.type);
            },
            findByName: function(b) {
                return a(this.currentForm).find("[name='" + b + "']");
            },
            getLength: function(b, c) {
                switch (c.nodeName.toLowerCase()) {
                  case "select":
                    return a("option:selected", c).length;

                  case "input":
                    if (this.checkable(c)) return this.findByName(c.name).filter(":checked").length;
                }
                return b.length;
            },
            depend: function(a, b) {
                return this.dependTypes[typeof a] ? this.dependTypes[typeof a](a, b) : !0;
            },
            dependTypes: {
                "boolean": function(a, b) {
                    return a;
                },
                string: function(b, c) {
                    return !!a(b, c.form).length;
                },
                "function": function(a, b) {
                    return a(b);
                }
            },
            optional: function(b) {
                var c = this.elementValue(b);
                return !a.validator.methods.required.call(this, c, b) && "dependency-mismatch";
            },
            startRequest: function(a) {
                this.pending[a.name] || (this.pendingRequest++, this.pending[a.name] = !0);
            },
            stopRequest: function(b, c) {
                this.pendingRequest--, this.pendingRequest < 0 && (this.pendingRequest = 0), delete this.pending[b.name], 
                c && 0 === this.pendingRequest && this.formSubmitted && this.form() ? (a(this.currentForm).submit(), 
                this.formSubmitted = !1) : !c && 0 === this.pendingRequest && this.formSubmitted && (a(this.currentForm).triggerHandler("invalid-form", [ this ]), 
                this.formSubmitted = !1);
            },
            previousValue: function(b) {
                return a.data(b, "previousValue") || a.data(b, "previousValue", {
                    old: null,
                    valid: !0,
                    message: this.defaultMessage(b, "remote")
                });
            }
        },
        classRuleSettings: {
            required: {
                required: !0
            },
            email: {
                email: !0
            },
            url: {
                url: !0
            },
            date: {
                date: !0
            },
            dateISO: {
                dateISO: !0
            },
            number: {
                number: !0
            },
            digits: {
                digits: !0
            },
            creditcard: {
                creditcard: !0
            }
        },
        addClassRules: function(b, c) {
            b.constructor === String ? this.classRuleSettings[b] = c : a.extend(this.classRuleSettings, b);
        },
        classRules: function(b) {
            var c = {}, d = a(b).attr("class");
            return d && a.each(d.split(" "), function() {
                this in a.validator.classRuleSettings && a.extend(c, a.validator.classRuleSettings[this]);
            }), c;
        },
        attributeRules: function(b) {
            var c = {}, d = a(b), e = d[0].getAttribute("type");
            for (var f in a.validator.methods) {
                var g;
                "required" === f ? (g = d.get(0).getAttribute(f), "" === g && (g = !0), g = !!g) : g = d.attr(f), 
                /min|max/.test(f) && (null === e || /number|range|text/.test(e)) && (g = Number(g)), 
                g ? c[f] = g : e === f && "range" !== e && (c[f] = !0);
            }
            return c.maxlength && /-1|2147483647|524288/.test(c.maxlength) && delete c.maxlength, 
            c;
        },
        dataRules: function(b) {
            var c, d, e = {}, f = a(b);
            for (c in a.validator.methods) d = f.data("rule-" + c.toLowerCase()), void 0 !== d && (e[c] = d);
            return e;
        },
        staticRules: function(b) {
            var c = {}, d = a.data(b.form, "validator");
            return d.settings.rules && (c = a.validator.normalizeRule(d.settings.rules[b.name]) || {}), 
            c;
        },
        normalizeRules: function(b, c) {
            return a.each(b, function(d, e) {
                if (e === !1) return void delete b[d];
                if (e.param || e.depends) {
                    var f = !0;
                    switch (typeof e.depends) {
                      case "string":
                        f = !!a(e.depends, c.form).length;
                        break;

                      case "function":
                        f = e.depends.call(c, c);
                    }
                    f ? b[d] = void 0 !== e.param ? e.param : !0 : delete b[d];
                }
            }), a.each(b, function(d, e) {
                b[d] = a.isFunction(e) ? e(c) : e;
            }), a.each([ "minlength", "maxlength" ], function() {
                b[this] && (b[this] = Number(b[this]));
            }), a.each([ "rangelength", "range" ], function() {
                var c;
                b[this] && (a.isArray(b[this]) ? b[this] = [ Number(b[this][0]), Number(b[this][1]) ] : "string" == typeof b[this] && (c = b[this].split(/[\s,]+/), 
                b[this] = [ Number(c[0]), Number(c[1]) ]));
            }), a.validator.autoCreateRanges && (b.min && b.max && (b.range = [ b.min, b.max ], 
            delete b.min, delete b.max), b.minlength && b.maxlength && (b.rangelength = [ b.minlength, b.maxlength ], 
            delete b.minlength, delete b.maxlength)), b;
        },
        normalizeRule: function(b) {
            if ("string" == typeof b) {
                var c = {};
                a.each(b.split(/\s/), function() {
                    c[this] = !0;
                }), b = c;
            }
            return b;
        },
        addMethod: function(b, c, d) {
            a.validator.methods[b] = c, a.validator.messages[b] = void 0 !== d ? d : a.validator.messages[b], 
            c.length < 3 && a.validator.addClassRules(b, a.validator.normalizeRule(b));
        },
        methods: {
            required: function(b, c, d) {
                if (!this.depend(d, c)) return "dependency-mismatch";
                if ("select" === c.nodeName.toLowerCase()) {
                    var e = a(c).val();
                    return e && e.length > 0;
                }
                return this.checkable(c) ? this.getLength(b, c) > 0 : a.trim(b).length > 0;
            },
            email: function(a, b) {
                return this.optional(b) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(a);
            },
            url: function(a, b) {
                return this.optional(b) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(a);
            },
            date: function(a, b) {
                return this.optional(b) || !/Invalid|NaN/.test(new Date(a).toString());
            },
            dateISO: function(a, b) {
                return this.optional(b) || /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(a);
            },
            number: function(a, b) {
                return this.optional(b) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(a);
            },
            digits: function(a, b) {
                return this.optional(b) || /^\d+$/.test(a);
            },
            creditcard: function(a, b) {
                if (this.optional(b)) return "dependency-mismatch";
                if (/[^0-9 \-]+/.test(a)) return !1;
                var c = 0, d = 0, e = !1;
                a = a.replace(/\D/g, "");
                for (var f = a.length - 1; f >= 0; f--) {
                    var g = a.charAt(f);
                    d = parseInt(g, 10), e && (d *= 2) > 9 && (d -= 9), c += d, e = !e;
                }
                return c % 10 === 0;
            },
            minlength: function(b, c, d) {
                var e = a.isArray(b) ? b.length : this.getLength(a.trim(b), c);
                return this.optional(c) || e >= d;
            },
            maxlength: function(b, c, d) {
                var e = a.isArray(b) ? b.length : this.getLength(a.trim(b), c);
                return this.optional(c) || d >= e;
            },
            rangelength: function(b, c, d) {
                var e = a.isArray(b) ? b.length : this.getLength(a.trim(b), c);
                return this.optional(c) || e >= d[0] && e <= d[1];
            },
            min: function(a, b, c) {
                return this.optional(b) || a >= c;
            },
            max: function(a, b, c) {
                return this.optional(b) || c >= a;
            },
            range: function(a, b, c) {
                return this.optional(b) || a >= c[0] && a <= c[1];
            },
            equalTo: function(b, c, d) {
                var e = a(d);
                return this.settings.onfocusout && e.unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
                    a(c).valid();
                }), b === e.val();
            },
            remote: function(b, c, d) {
                if (this.optional(c)) return "dependency-mismatch";
                var e = this.previousValue(c);
                if (this.settings.messages[c.name] || (this.settings.messages[c.name] = {}), e.originalMessage = this.settings.messages[c.name].remote, 
                this.settings.messages[c.name].remote = e.message, d = "string" == typeof d && {
                    url: d
                } || d, e.old === b) return e.valid;
                e.old = b;
                var f = this;
                this.startRequest(c);
                var g = {};
                return g[c.name] = b, a.ajax(a.extend(!0, {
                    url: d,
                    mode: "abort",
                    port: "validate" + c.name,
                    dataType: "json",
                    data: g,
                    success: function(d) {
                        f.settings.messages[c.name].remote = e.originalMessage;
                        var g = d === !0 || "true" === d;
                        if (g) {
                            var h = f.formSubmitted;
                            f.prepareElement(c), f.formSubmitted = h, f.successList.push(c), delete f.invalid[c.name], 
                            f.showErrors();
                        } else {
                            var i = {}, j = d || f.defaultMessage(c, "remote");
                            i[c.name] = e.message = a.isFunction(j) ? j(b) : j, f.invalid[c.name] = !0, f.showErrors(i);
                        }
                        e.valid = g, f.stopRequest(c, g);
                    }
                }, d)), "pending";
            }
        }
    }), a.format = a.validator.format;
}(jQuery), function(a) {
    var b = {};
    if (a.ajaxPrefilter) a.ajaxPrefilter(function(a, c, d) {
        var e = a.port;
        "abort" === a.mode && (b[e] && b[e].abort(), b[e] = d);
    }); else {
        var c = a.ajax;
        a.ajax = function(d) {
            var e = ("mode" in d ? d : a.ajaxSettings).mode, f = ("port" in d ? d : a.ajaxSettings).port;
            return "abort" === e ? (b[f] && b[f].abort(), b[f] = c.apply(this, arguments), b[f]) : c.apply(this, arguments);
        };
    }
}(jQuery), function(a) {
    a.extend(a.fn, {
        validateDelegate: function(b, c, d) {
            return this.bind(c, function(c) {
                var e = a(c.target);
                return e.is(b) ? d.apply(e, arguments) : void 0;
            });
        }
    });
}(jQuery), function(a, b) {
    "object" == typeof exports ? module.exports = b() : "function" == typeof define && define.amd ? define(b) : a.Spinner = b();
}(this, function() {
    "use strict";
    function a(a, b) {
        var c, d = document.createElement(a || "div");
        for (c in b) d[c] = b[c];
        return d;
    }
    function b(a) {
        for (var b = 1, c = arguments.length; c > b; b++) a.appendChild(arguments[b]);
        return a;
    }
    function c(a, b, c, d) {
        var e = [ "opacity", b, ~~(100 * a), c, d ].join("-"), f = .01 + c / d * 100, g = Math.max(1 - (1 - a) / b * (100 - f), a), h = k.substring(0, k.indexOf("Animation")).toLowerCase(), i = h && "-" + h + "-" || "";
        return m[e] || (n.insertRule("@" + i + "keyframes " + e + "{0%{opacity:" + g + "}" + f + "%{opacity:" + a + "}" + (f + .01) + "%{opacity:1}" + (f + b) % 100 + "%{opacity:" + a + "}100%{opacity:" + g + "}}", n.cssRules.length), 
        m[e] = 1), e;
    }
    function d(a, b) {
        var c, d, e = a.style;
        for (b = b.charAt(0).toUpperCase() + b.slice(1), d = 0; d < l.length; d++) if (c = l[d] + b, 
        void 0 !== e[c]) return c;
        return void 0 !== e[b] ? b : void 0;
    }
    function e(a, b) {
        for (var c in b) a.style[d(a, c) || c] = b[c];
        return a;
    }
    function f(a) {
        for (var b = 1; b < arguments.length; b++) {
            var c = arguments[b];
            for (var d in c) void 0 === a[d] && (a[d] = c[d]);
        }
        return a;
    }
    function g(a) {
        for (var b = {
            x: a.offsetLeft,
            y: a.offsetTop
        }; a = a.offsetParent; ) b.x += a.offsetLeft, b.y += a.offsetTop;
        return b;
    }
    function h(a, b) {
        return "string" == typeof a ? a : a[b % a.length];
    }
    function i(a) {
        return "undefined" == typeof this ? new i(a) : void (this.opts = f(a || {}, i.defaults, o));
    }
    function j() {
        function c(b, c) {
            return a("<" + b + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', c);
        }
        n.addRule(".spin-vml", "behavior:url(#default#VML)"), i.prototype.lines = function(a, d) {
            function f() {
                return e(c("group", {
                    coordsize: k + " " + k,
                    coordorigin: -j + " " + -j
                }), {
                    width: k,
                    height: k
                });
            }
            function g(a, g, i) {
                b(m, b(e(f(), {
                    rotation: 360 / d.lines * a + "deg",
                    left: ~~g
                }), b(e(c("roundrect", {
                    arcsize: d.corners
                }), {
                    width: j,
                    height: d.width,
                    left: d.radius,
                    top: -d.width >> 1,
                    filter: i
                }), c("fill", {
                    color: h(d.color, a),
                    opacity: d.opacity
                }), c("stroke", {
                    opacity: 0
                }))));
            }
            var i, j = d.length + d.width, k = 2 * j, l = 2 * -(d.width + d.length) + "px", m = e(f(), {
                position: "absolute",
                top: l,
                left: l
            });
            if (d.shadow) for (i = 1; i <= d.lines; i++) g(i, -2, "progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");
            for (i = 1; i <= d.lines; i++) g(i);
            return b(a, m);
        }, i.prototype.opacity = function(a, b, c, d) {
            var e = a.firstChild;
            d = d.shadow && d.lines || 0, e && b + d < e.childNodes.length && (e = e.childNodes[b + d], 
            e = e && e.firstChild, e = e && e.firstChild, e && (e.opacity = c));
        };
    }
    var k, l = [ "webkit", "Moz", "ms", "O" ], m = {}, n = function() {
        var c = a("style", {
            type: "text/css"
        });
        return b(document.getElementsByTagName("head")[0], c), c.sheet || c.styleSheet;
    }(), o = {
        lines: 12,
        length: 7,
        width: 5,
        radius: 10,
        rotate: 0,
        corners: 1,
        color: "#000",
        direction: 1,
        speed: 1,
        trail: 100,
        opacity: .25,
        fps: 20,
        zIndex: 2e9,
        className: "spinner",
        top: "auto",
        left: "auto",
        position: "relative"
    };
    i.defaults = {}, f(i.prototype, {
        spin: function(b) {
            this.stop();
            var c, d, f = this, h = f.opts, i = f.el = e(a(0, {
                className: h.className
            }), {
                position: h.position,
                width: 0,
                zIndex: h.zIndex
            }), j = h.radius + h.length + h.width;
            if (b && (b.insertBefore(i, b.firstChild || null), d = g(b), c = g(i), e(i, {
                left: ("auto" == h.left ? d.x - c.x + (b.offsetWidth >> 1) : parseInt(h.left, 10) + j) + "px",
                top: ("auto" == h.top ? d.y - c.y + (b.offsetHeight >> 1) : parseInt(h.top, 10) + j) + "px"
            })), i.setAttribute("role", "progressbar"), f.lines(i, f.opts), !k) {
                var l, m = 0, n = (h.lines - 1) * (1 - h.direction) / 2, o = h.fps, p = o / h.speed, q = (1 - h.opacity) / (p * h.trail / 100), r = p / h.lines;
                !function s() {
                    m++;
                    for (var a = 0; a < h.lines; a++) l = Math.max(1 - (m + (h.lines - a) * r) % p * q, h.opacity), 
                    f.opacity(i, a * h.direction + n, l, h);
                    f.timeout = f.el && setTimeout(s, ~~(1e3 / o));
                }();
            }
            return f;
        },
        stop: function() {
            var a = this.el;
            return a && (clearTimeout(this.timeout), a.parentNode && a.parentNode.removeChild(a), 
            this.el = void 0), this;
        },
        lines: function(d, f) {
            function g(b, c) {
                return e(a(), {
                    position: "absolute",
                    width: f.length + f.width + "px",
                    height: f.width + "px",
                    background: b,
                    boxShadow: c,
                    transformOrigin: "left",
                    transform: "rotate(" + ~~(360 / f.lines * j + f.rotate) + "deg) translate(" + f.radius + "px,0)",
                    borderRadius: (f.corners * f.width >> 1) + "px"
                });
            }
            for (var i, j = 0, l = (f.lines - 1) * (1 - f.direction) / 2; j < f.lines; j++) i = e(a(), {
                position: "absolute",
                top: 1 + ~(f.width / 2) + "px",
                transform: f.hwaccel ? "translate3d(0,0,0)" : "",
                opacity: f.opacity,
                animation: k && c(f.opacity, f.trail, l + j * f.direction, f.lines) + " " + 1 / f.speed + "s linear infinite"
            }), f.shadow && b(i, e(g("#000", "0 0 4px #000"), {
                top: "2px"
            })), b(d, b(i, g(h(f.color, j), "0 0 1px rgba(0,0,0,.1)")));
            return d;
        },
        opacity: function(a, b, c) {
            b < a.childNodes.length && (a.childNodes[b].style.opacity = c);
        }
    });
    var p = e(a("group"), {
        behavior: "url(#default#VML)"
    });
    return !d(p, "transform") && p.adj ? j() : k = d(p, "animation"), i;
}), function(a) {
    function b(b) {
        if (!b) return null;
        var c = a(b), d = c.closest("form").find("[name='" + b.name + "']");
        c.data();
        return c.data("highlight") && ($additional = a(c.data("highlight")), $additional.each(function() {
            d = d.add(a(this));
        })), d;
    }
    var c = {
        highlight: function(a, c, d) {
            var e = b(a);
            e.addClass(c).removeClass(d);
        },
        unhighlight: function(a, c, d) {
            var e = b(a);
            e.removeClass(c).addClass(d);
        },
        ignore: ":hidden:not(.val-hidden)",
        submitHandler: function(a) {
            Placeholders.disable(), a.submit();
        },
        invalidHandler: function() {
            a.each(placeholders, function(b, c) {
                a(c).attr("placeholder", b);
            }), Placeholders.enable();
        }
    };
    a.validator && a.validator.setDefaults(c), a.validator.addMethod("requiredif", function(b, c, d) {
        var e = "#" + d.dependentupon, f = d.targetvalue;
        f = (null == f ? "" : f).toString();
        var g = a(e);
        if (0 == g.length && (g = a("input[name=" + d.dependentupon + "]")), 0 == g.length) return !1;
        var h, i = g.eq(0).attr("type"), j = null;
        return "checkbox" == i && g.length > 1 ? h = g.is(":checked").val().toString() : "checkbox" == i && 1 == g.length ? h = g.is(":checked").toString() : "radio" == i ? h = g.filter(":checked").val().toString() : (h = g.val(), 
        j = g.val()), "password" == i ? j ? a.validator.methods.required.call(this, b, c, d) : !0 : f.toLowerCase() === h.toLowerCase() ? a.validator.methods.required.call(this, b, c, d) : !0;
    }), a.validator.addMethod("requiredifvalue", function(b, c, d) {
        var e = "#" + d.dependentupon, f = d.targetvalue;
        f = (null == f ? "" : f).toString();
        var g = a(e);
        if (0 == g.length && (g = a("input[name=" + d.dependentupon + "]")), 0 == g.length) return !1;
        var h, i = g.eq(0).attr("type");
        return h = "checkbox" == i && g.length > 1 ? g.is(":checked").val().toString() : "checkbox" == i && 1 == g.length ? g.is(":checked").toString() : "radio" == i ? g.filter(":checked").val().toString() : g.val(), 
        f === h ? a.validator.methods.required.call(this, b, c, d) : !0;
    }), a.validator.addMethod("atleast", function(b, c, d) {
        var e = a(c), f = null, g = e.attr("name");
        if (d = d ? parseInt(d) : 0, !g) return !1;
        f = a("[name=" + g + "]");
        var h = 0;
        return f.each(function() {
            return $input = a(this), $input.is(":checkbox:not(:checked)") || $input.is(":radio:not(:checked)") ? !1 : 0 === $input.val().length ? !1 : void h++;
        }), h >= d ? !0 : !1;
    }), a.validator.addMethod("inputlistatleast", function(b, c) {
        return a(c).parents(".input-list-added").find(":input").length > 1 ? !0 : !1;
    }), a.validator.addMethod("atleastin", function(b, c, d) {
        var e = a(c), f = a(d.container), g = null, h = d.minimum;
        return f.length ? (g = f.find(d.target), f.data("atleastin-container-append") || (f.on("prepend.atleastin append.atleastin", function() {
            e.valid();
        }), f.data("atleastin-container-append", !0))) : g = a(d.target), g.length ? (h = h ? parseInt(h, 10) : 0, 
        g.length < h ? !1 : !0) : !1;
    }), a.validator.addMethod("autocompleteonly", function(b, c) {
        return a(c).data("from-autocomplete") ? !0 : !1;
    }), a.validator.addMethod("phone", function(a, b) {
        return this.optional(b) || /^[0-9 (+)]+$/.test(a);
    }), a.validator.addMethod("multiemail", function(b, c) {
        if (this.optional(c)) return !0;
        for (var d = b.trim().replace(/\,$/, "").split(","), e = !0, f = 0, g = d.length; g > f; f++) b = a.trim(d[f]), 
        e = e && a.validator.methods.email.call(this, b, c);
        return e;
    }, "Invalid email format: please use a comma to separate multiple email addresses."), 
    a.validator.addMethod("time", function(a, b) {
        if (this.optional(b) && a.length < 1) return !0;
        var c = !0, d = /^(([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$/i.test(a);
        return d || (c = !1), c;
    }, "Please enter a valid time (hh:mm)."), a.validator.addMethod("datetimerange", function(b, c) {
        var d = a(c), e = d.siblings(".start-date"), f = e.val();
        if ("" === f) return !0;
        var g = d.siblings(".start-time"), h = g.is(":hidden") ? "00:00" : g.val();
        if ("" === h) return !0;
        var i = d.siblings(".end-date"), j = i.val();
        if ("" === j) return !0;
        var k = d.siblings(".end-time"), l = k.is(":hidden") ? "00:00" : k.val();
        if ("" === l) return !0;
        var m = Date.parse(f + "T" + h), n = Date.parse(j + "T" + l);
        return n >= m;
    }, "The end date/time must be after the start date/time."), a.validator.addMethod("minage", function(b, c, d) {
        var e = a(c), f = e.parents(".controls"), g = parseInt(f.find(".dob-day").val()), h = parseInt(f.find(".dob-month").val()), i = parseInt(f.find(".dob-year").val()), j = new Date(), k = new Date(j.getFullYear() - d, j.getMonth(), j.getDate(), 0, 0, 0, 0);
        if (isNaN(g) || isNaN(h) || isNaN(i)) return !1;
        var l = new Date(i, h - 1, g, 0, 0, 0, 0);
        return k >= l;
    }), a.validator.addMethod("validdate", function(b, c, d) {
        var e = a(c), f = e.parents(".controls"), g = parseInt(f.find(".dob-day").val()), h = parseInt(f.find(".dob-month").val()), i = parseInt(f.find(".dob-year").val());
        if (f.find("input:visible").on("change.validdate", function() {
            a(this).parents(".controls").find(".validdate").valid();
        }), isNaN(g) || isNaN(h) || isNaN(i)) return !1;
        var j = new Date(i, h - 1, g);
        return j.getFullYear() == i && j.getMonth() + 1 == h && j.getDate() == g;
    }), a.validator.addMethod("fileext", function(b, c, d) {
        var d = d.split(","), e = b.substr(b.lastIndexOf("."));
        return a.inArray(e.toLowerCase(), d) > -1;
    }), a.validator.addMethod("filesize", function(a, b, c) {
        if (!Modernizr.filereader) return !0;
        var d = b.files[0].size;
        return c >= d;
    });
}(window.jQuery), function(a) {
    function b(a, b, c) {
        a.rules[b] = c, a.message && (a.messages[b] = a.message);
    }
    function c(a) {
        return a.replace(/^\s+|\s+$/g, "").split(/\s*,\s*/g);
    }
    function d(a) {
        return a.substr(0, a.lastIndexOf(".") + 1);
    }
    function e(a, b) {
        return 0 === a.indexOf("*.") && (a = a.replace("*.", b)), a;
    }
    function f(b, c) {
        var d = a("[data-valmsg-for='" + c[0].name + "']"), e = d.attr("data-valmsg-replace") && a.parseJSON(d.attr("data-valmsg-replace")) !== !1;
        d.removeClass("field-validation-valid").addClass("field-validation-error"), b.data("unobtrusiveContainer", d), 
        e ? (d.empty(), b.removeClass("input-validation-error").appendTo(d)) : b.hide();
    }
    function g(b, c) {
        var d = a(this).find("[data-valmsg-summary=true]"), e = d.find("ul");
        e && e.length && c.errorList.length && (e.empty(), d.addClass("validation-summary-errors").removeClass("validation-summary-valid"), 
        a.each(c.errorList, function() {
            a("<li />").html(this.message).appendTo(e);
        }));
    }
    function h(b) {
        var c = b.data("unobtrusiveContainer"), d = c.attr("data-valmsg-replace") && a.parseJSON(c.attr("data-valmsg-replace"));
        c && (c.addClass("field-validation-valid").removeClass("field-validation-error"), 
        b.removeData("unobtrusiveContainer"), d && c.empty());
    }
    function i(b) {
        var c = a(b), d = c.data(l);
        return d || (d = {
            options: {
                errorClass: "input-validation-error",
                errorElement: "span",
                errorPlacement: a.proxy(f, b),
                invalidHandler: a.proxy(g, b),
                messages: {},
                rules: {},
                success: a.proxy(h, b)
            },
            attachValidation: function() {
                c.validate(this.options);
            },
            validate: function() {
                return c.validate(), c.valid();
            }
        }, c.data(l, d)), d;
    }
    var j, k = a.validator, l = "unobtrusiveValidation";
    k.unobtrusive = {
        adapters: [],
        parseElement: function(b, c) {
            var d, e, f, g = a(b), h = g.parents("form")[0];
            h && (d = i(h), d.options.rules[b.name] = e = {}, d.options.messages[b.name] = f = {}, 
            a.each(this.adapters, function() {
                var c = "data-val-" + this.name, d = g.attr(c), i = {};
                void 0 !== d && (c += "-", a.each(this.params, function() {
                    i[this] = g.attr(c + this);
                }), this.adapt({
                    element: b,
                    form: h,
                    message: d,
                    params: i,
                    rules: e,
                    messages: f
                }));
            }), jQuery.extend(e, {
                __dummy__: !0
            }), c || d.attachValidation());
        },
        parse: function(b) {
            a(b).find(":input[data-val=true]").each(function() {
                k.unobtrusive.parseElement(this, !0);
            }), a("form").each(function() {
                var a = i(this);
                a && a.attachValidation();
            });
        }
    }, j = k.unobtrusive.adapters, j.add = function(a, b, c) {
        return c || (c = b, b = []), this.push({
            name: a,
            params: b,
            adapt: c
        }), this;
    }, j.addBool = function(a, c) {
        return this.add(a, function(d) {
            b(d, c || a, !0);
        });
    }, j.addMinMax = function(a, c, d, e, f, g) {
        return this.add(a, [ f || "min", g || "max" ], function(a) {
            var f = a.params.min, g = a.params.max;
            f && g ? b(a, e, [ f, g ]) : f ? b(a, c, f) : g && b(a, d, g);
        });
    }, j.addSingleVal = function(a, c, d) {
        return this.add(a, [ c || "val" ], function(e) {
            b(e, d || a, e.params[c]);
        });
    }, k.addMethod("__dummy__", function(a, b, c) {
        return !0;
    }), k.addMethod("regex", function(a, b, c) {
        var d;
        return this.optional(b) ? !0 : (d = new RegExp(c).exec(a), d && 0 === d.index && d[0].length === a.length);
    }), j.addSingleVal("accept", "exts").addSingleVal("regex", "pattern"), j.addBool("creditcard").addBool("date").addBool("digits").addBool("email").addBool("number").addBool("url"), 
    j.addMinMax("length", "minlength", "maxlength", "rangelength").addMinMax("range", "min", "max", "range"), 
    j.add("equalto", [ "other" ], function(c) {
        var f = d(c.element.name), g = c.params.other, h = e(g, f), i = a(c.form).find(":input[name=" + h + "]")[0];
        b(c, "equalTo", i);
    }), j.add("required", function(a) {
        ("INPUT" !== a.element.tagName.toUpperCase() || "CHECKBOX" !== a.element.type.toUpperCase()) && b(a, "required", !0);
    }), j.add("remote", [ "url", "type", "additionalfields" ], function(f) {
        var g = {
            url: f.params.url,
            type: f.params.type || "GET",
            data: {}
        }, h = d(f.element.name);
        a.each(c(f.params.additionalfields || f.element.name), function(b, c) {
            var d = e(c, h);
            g.data[d] = function() {
                return a(f.form).find(":input[name='" + d + "']").val();
            };
        }), b(f, "remote", g);
    }), a(function() {
        k.unobtrusive.parse(document);
    });
}(jQuery), function(a) {
    a.validator.unobtrusive.adapters.addBool("mandatory", "required"), a.validator.unobtrusive.adapters.add("requiredif", [ "dependentupon" ], function(a) {
        a.rules.requiredif = {
            dependentupon: a.params.dependentupon
        }, a.messages.requiredif = a.message;
    }), a.validator.unobtrusive.adapters.add("requiredifvalue", [ "dependentupon", "targetvalue" ], function(a) {
        a.rules.requiredif = {
            dependentupon: a.params.dependentupon,
            targetvalue: a.params.targetvalue
        }, a.messages.requiredif = a.message;
    }), a.validator.unobtrusive.adapters.add("atleast", [ "minimum" ], function(a) {
        a.rules.atleast = a.params.minimum, a.messages.atleast = a.message;
    }), a.validator.unobtrusive.adapters.addBool("phone"), a.validator.unobtrusive.adapters.add("multiemail", function(a) {
        a.rules.multiemail = {}, a.messages.multiemail = a.message;
    }), a.validator.unobtrusive.adapters.add("inputlistatleast", function(a) {
        a.rules.inputlistatleast = {}, a.messages.inputlistatleast = a.message;
    }), a.validator.unobtrusive.adapters.add("atleastin", [ "minimum", "container", "target" ], function(a) {
        a.rules.atleastin = {
            minimum: a.params.minimum,
            container: a.params.container,
            target: a.params.target
        }, a.messages.atleastin = a.message;
    }), a.validator.unobtrusive.adapters.add("autocompleteonly", function(a) {
        a.rules.autocompleteonly = {}, a.messages.autocompleteonly = a.message;
    }), a.validator.unobtrusive.adapters.add("minage", [ "minimum" ], function(a) {
        a.rules.minage = a.params.minimum, a.messages.minage = a.message;
    }), a.validator.unobtrusive.adapters.add("validdate", function(a) {
        a.rules.validdate = {}, a.messages.validdate = a.message;
    }), a.validator.unobtrusive.adapters.add("datetimerange", function(a) {
        a.rules.datetimerange = {}, a.messages.datetimerange = a.message;
    }), a.validator.unobtrusive.adapters.add("time", function(a) {
        a.rules.time = {}, a.messages.time = a.message;
    }), a.validator.unobtrusive.adapters.add("fileext", [ "extensions" ], function(a) {
        a.rules.fileext = a.params.extensions, a.messages.fileext = a.message;
    }), a.validator.unobtrusive.adapters.add("filesize", [ "maxlength" ], function(a) {
        a.rules.filesize = a.params.maxlength, a.messages.filesize = a.message;
    });
}(window.jQuery);

var cookies = {
    $cookieAlert: null,
    cookiesAllowed: "cookiesAllowed",
    $html: $("html"),
    setCookiesAllowed: function(a) {
        var b = this;
        $.cookie(b.cookiesAllowed, a, {
            expires: 365,
            path: "/",
            secure: !1,
            raw: !0
        });
    },
    removeCookieAlert: function() {
        var a = this;
        a.$html.removeClass("cookiealert-open"), a.$cookieAlert.remove();
    },
    ready: function() {
        var a = this;
        return cookiesAllowedDomain ? (a.$cookieAlert = $("#cookie_alert"), a.$cookieAlert || console.log("Cookie container does not exist"), 
        $.cookie(a.cookiesAllowed) ? void a.removeCookieAlert() : (a.$html.addClass("cookiealert-open"), 
        void $("#cookie_dismiss").on("click", function(b) {
            b.preventDefault(), a.setCookiesAllowed("true"), a.removeCookieAlert();
        }))) : void console.log("Cookie domain not set");
    }
};

if ($(function() {
    cookies.ready();
}), function(a) {
    a.fn.equalHeights = function() {
        var b = 0, c = a(this);
        return c.each(function() {
            var c = a(this).innerHeight();
            c > b && (b = c);
        }), c.css("height", b);
    }, a("[data-equal]").each(function() {
        var b = a(this), c = b.data("equal");
        b.find(c).equalHeights();
    });
}(jQuery), function(a, b) {
    function c(b) {
        a.extend(!0, wa, b);
    }
    function d(c, d, j) {
        function k(a) {
            ea ? q() && (z(), x(a)) : l();
        }
        function l() {
            fa = d.theme ? "ui" : "fc", c.addClass("fc"), d.isRTL ? c.addClass("fc-rtl") : c.addClass("fc-ltr"), 
            d.theme && c.addClass("ui-widget"), ea = a("<div class='fc-content' style='position:relative'/>").prependTo(c), 
            ca = new e(ba, d), da = ca.render(), da && c.prepend(da), s(d.defaultView), d.handleWindowResize && a(window).resize(B), 
            r() || n();
        }
        function n() {
            setTimeout(function() {
                !ga.start && r() && w();
            }, 0);
        }
        function o() {
            ga && (aa("viewDestroy", ga, ga, ga.element), ga.triggerEventDestroy()), a(window).unbind("resize", B), 
            ca.destroy(), ea.remove(), c.removeClass("fc fc-rtl ui-widget");
        }
        function q() {
            return c.is(":visible");
        }
        function r() {
            return a("body").is(":visible");
        }
        function s(a) {
            ga && a == ga.name || v(a);
        }
        function v(b) {
            oa++, ga && (aa("viewDestroy", ga, ga, ga.element), P(), ga.triggerEventDestroy(), 
            Y(), ga.element.remove(), ca.deactivateButton(ga.name)), ca.activateButton(b), ga = new za[b](a("<div class='fc-view fc-view-" + b + "' style='position:relative'/>").appendTo(ea), ba), 
            w(), Z(), oa--;
        }
        function w(a) {
            (!ga.start || a || pa < ga.start || pa >= ga.end) && q() && x(a);
        }
        function x(a) {
            oa++, ga.start && (aa("viewDestroy", ga, ga, ga.element), P(), G()), Y(), ga.render(pa, a || 0), 
            A(), Z(), (ga.afterRender || J)(), M(), N(), aa("viewRender", ga, ga, ga.element), 
            ga.trigger("viewDisplay", ma), oa--, H();
        }
        function y() {
            q() && (P(), G(), z(), A(), E());
        }
        function z() {
            ia = d.contentHeight ? d.contentHeight : d.height ? d.height - (da ? da.height() : 0) - F(ea) : Math.round(ea.width() / Math.max(d.aspectRatio, .5));
        }
        function A() {
            ia === b && z(), oa++, ga.setHeight(ia), ga.setWidth(ea.width()), oa--, ha = c.outerWidth();
        }
        function B() {
            if (!oa) if (ga.start) {
                var a = ++na;
                setTimeout(function() {
                    a == na && !oa && q() && ha != (ha = c.outerWidth()) && (oa++, y(), ga.trigger("windowResize", ma), 
                    oa--);
                }, 200);
            } else n();
        }
        function C() {
            G(), I();
        }
        function D(a) {
            G(), E(a);
        }
        function E(a) {
            q() && (ga.setEventData(qa), ga.renderEvents(qa, a), ga.trigger("eventAfterAllRender"));
        }
        function G() {
            ga.triggerEventDestroy(), ga.clearEvents(), ga.clearEventData();
        }
        function H() {
            !d.lazyFetching || ka(ga.visStart, ga.visEnd) ? I() : E();
        }
        function I() {
            la(ga.visStart, ga.visEnd);
        }
        function K(a) {
            qa = a, E();
        }
        function L(a) {
            D(a);
        }
        function M() {
            ca.updateTitle(ga.title);
        }
        function N() {
            var a = new Date();
            a >= ga.start && a < ga.end ? ca.disableButton("today") : ca.enableButton("today");
        }
        function O(a, c, d) {
            ga.select(a, c, d === b ? !0 : d);
        }
        function P() {
            ga && ga.unselect();
        }
        function Q() {
            w(-1);
        }
        function R() {
            w(1);
        }
        function S() {
            g(pa, -1), w();
        }
        function T() {
            g(pa, 1), w();
        }
        function U() {
            pa = new Date(), w();
        }
        function V(a, b, c) {
            a instanceof Date ? pa = m(a) : p(pa, a, b, c), w();
        }
        function W(a, c, d) {
            a !== b && g(pa, a), c !== b && h(pa, c), d !== b && i(pa, d), w();
        }
        function X() {
            return m(pa);
        }
        function Y() {
            ea.css({
                width: "100%",
                height: ea.height(),
                overflow: "hidden"
            });
        }
        function Z() {
            ea.css({
                width: "",
                height: "",
                overflow: ""
            });
        }
        function $() {
            return ga;
        }
        function _(a, c) {
            return c === b ? d[a] : void (("height" == a || "contentHeight" == a || "aspectRatio" == a) && (d[a] = c, 
            y()));
        }
        function aa(a, b) {
            return d[a] ? d[a].apply(b || ma, Array.prototype.slice.call(arguments, 2)) : void 0;
        }
        var ba = this;
        ba.options = d, ba.render = k, ba.destroy = o, ba.refetchEvents = C, ba.reportEvents = K, 
        ba.reportEventChange = L, ba.rerenderEvents = D, ba.changeView = s, ba.select = O, 
        ba.unselect = P, ba.prev = Q, ba.next = R, ba.prevYear = S, ba.nextYear = T, ba.today = U, 
        ba.gotoDate = V, ba.incrementDate = W, ba.formatDate = function(a, b) {
            return t(a, b, d);
        }, ba.formatDates = function(a, b, c) {
            return u(a, b, c, d);
        }, ba.getDate = X, ba.getView = $, ba.option = _, ba.trigger = aa, f.call(ba, d, j);
        var ca, da, ea, fa, ga, ha, ia, ja, ka = ba.isFetchNeeded, la = ba.fetchEvents, ma = c[0], na = 0, oa = 0, pa = new Date(), qa = [];
        p(pa, d.year, d.month, d.date), d.droppable && a(document).bind("dragstart", function(b, c) {
            var e = b.target, f = a(e);
            if (!f.parents(".fc").length) {
                var g = d.dropAccept;
                (a.isFunction(g) ? g.call(e, f) : f.is(g)) && (ja = e, ga.dragStart(ja, b, c));
            }
        }).bind("dragstop", function(a, b) {
            ja && (ga.dragStop(ja, a, b), ja = null);
        });
    }
    function e(b, c) {
        function d() {
            m = c.theme ? "ui" : "fc";
            var b = c.header;
            return b ? n = a("<table class='fc-header' style='width:100%'/>").append(a("<tr/>").append(f("left")).append(f("center")).append(f("right"))) : void 0;
        }
        function e() {
            n.remove();
        }
        function f(d) {
            var e = a("<td class='fc-header-" + d + "'/>"), f = c.header[d];
            return f && a.each(f.split(" "), function(d) {
                d > 0 && e.append("<span class='fc-header-space'/>");
                var f;
                a.each(this.split(","), function(d, g) {
                    if ("title" == g) e.append("<span class='fc-header-title'><h2>&nbsp;</h2></span>"), 
                    f && f.addClass(m + "-corner-right"), f = null; else {
                        var h;
                        if (b[g] ? h = b[g] : za[g] && (h = function() {
                            k.removeClass(m + "-state-hover"), b.changeView(g);
                        }), h) {
                            var i = c.theme ? N(c.buttonIcons, g) : null, j = N(c.buttonText, g), k = a("<span class='fc-button fc-button-" + g + " " + m + "-state-default'>" + (i ? "<span class='fc-icon-wrap'><span class='ui-icon ui-icon-" + i + "'/></span>" : j) + "</span>").click(function() {
                                k.hasClass(m + "-state-disabled") || h();
                            }).mousedown(function() {
                                k.not("." + m + "-state-active").not("." + m + "-state-disabled").addClass(m + "-state-down");
                            }).mouseup(function() {
                                k.removeClass(m + "-state-down");
                            }).hover(function() {
                                k.not("." + m + "-state-active").not("." + m + "-state-disabled").addClass(m + "-state-hover");
                            }, function() {
                                k.removeClass(m + "-state-hover").removeClass(m + "-state-down");
                            }).appendTo(e);
                            P(k), f || k.addClass(m + "-corner-left"), f = k;
                        }
                    }
                }), f && f.addClass(m + "-corner-right");
            }), e;
        }
        function g(a) {
            n.find("h2").html(a);
        }
        function h(a) {
            n.find("span.fc-button-" + a).addClass(m + "-state-active");
        }
        function i(a) {
            n.find("span.fc-button-" + a).removeClass(m + "-state-active");
        }
        function j(a) {
            n.find("span.fc-button-" + a).addClass(m + "-state-disabled");
        }
        function k(a) {
            n.find("span.fc-button-" + a).removeClass(m + "-state-disabled");
        }
        var l = this;
        l.render = d, l.destroy = e, l.updateTitle = g, l.activateButton = h, l.deactivateButton = i, 
        l.disableButton = j, l.enableButton = k;
        var m, n = a([]);
    }
    function f(c, d) {
        function e(a, b) {
            return !y || y > a || b > z;
        }
        function f(a, b) {
            y = a, z = b, I = [];
            var c = ++F, d = E.length;
            G = d;
            for (var e = 0; d > e; e++) g(E[e], c);
        }
        function g(b, d) {
            h(b, function(e) {
                if (d == F) {
                    if (e) {
                        c.eventDataTransform && (e = a.map(e, c.eventDataTransform)), b.eventDataTransform && (e = a.map(e, b.eventDataTransform));
                        for (var f = 0; f < e.length; f++) e[f].source = b, t(e[f]);
                        I = I.concat(e);
                    }
                    G--, G || C(I);
                }
            });
        }
        function h(b, d) {
            var e, f, g = ya.sourceFetchers;
            for (e = 0; e < g.length; e++) {
                if (f = g[e](b, y, z, d), f === !0) return;
                if ("object" == typeof f) return void h(f, d);
            }
            var i = b.events;
            if (i) a.isFunction(i) ? (r(), i(m(y), m(z), function(a) {
                d(a), s();
            })) : a.isArray(i) ? d(i) : d(); else {
                var j = b.url;
                if (j) {
                    var k, l = b.success, n = b.error, o = b.complete;
                    k = a.isFunction(b.data) ? b.data() : b.data;
                    var p = a.extend({}, k || {}), q = T(b.startParam, c.startParam), t = T(b.endParam, c.endParam);
                    q && (p[q] = Math.round(+y / 1e3)), t && (p[t] = Math.round(+z / 1e3)), r(), a.ajax(a.extend({}, Aa, b, {
                        data: p,
                        success: function(b) {
                            b = b || [];
                            var c = S(l, this, arguments);
                            a.isArray(c) && (b = c), d(b);
                        },
                        error: function() {
                            S(n, this, arguments), d();
                        },
                        complete: function() {
                            S(o, this, arguments), s();
                        }
                    }));
                } else d();
            }
        }
        function i(a) {
            a = j(a), a && (G++, g(a, F));
        }
        function j(b) {
            return a.isFunction(b) || a.isArray(b) ? b = {
                events: b
            } : "string" == typeof b && (b = {
                url: b
            }), "object" == typeof b ? (u(b), E.push(b), b) : void 0;
        }
        function k(b) {
            E = a.grep(E, function(a) {
                return !v(a, b);
            }), I = a.grep(I, function(a) {
                return !v(a.source, b);
            }), C(I);
        }
        function l(a) {
            var b, c, d = I.length, e = B().defaultEventEnd, f = a.start - a._start, g = a.end ? a.end - (a._end || e(a)) : 0;
            for (b = 0; d > b; b++) c = I[b], c._id == a._id && c != a && (c.start = new Date(+c.start + f), 
            a.end ? c.end ? c.end = new Date(+c.end + g) : c.end = new Date(+e(c) + g) : c.end = null, 
            c.title = a.title, c.url = a.url, c.allDay = a.allDay, c.className = a.className, 
            c.editable = a.editable, c.color = a.color, c.backgroundColor = a.backgroundColor, 
            c.borderColor = a.borderColor, c.textColor = a.textColor, t(c));
            t(a), C(I);
        }
        function n(a, b) {
            t(a), a.source || (b && (D.events.push(a), a.source = D), I.push(a)), C(I);
        }
        function o(b) {
            if (b) {
                if (!a.isFunction(b)) {
                    var c = b + "";
                    b = function(a) {
                        return a._id == c;
                    };
                }
                I = a.grep(I, b, !0);
                for (var d = 0; d < E.length; d++) a.isArray(E[d].events) && (E[d].events = a.grep(E[d].events, b, !0));
            } else {
                I = [];
                for (var d = 0; d < E.length; d++) a.isArray(E[d].events) && (E[d].events = []);
            }
            C(I);
        }
        function p(b) {
            return a.isFunction(b) ? a.grep(I, b) : b ? (b += "", a.grep(I, function(a) {
                return a._id == b;
            })) : I;
        }
        function r() {
            H++ || A("loading", null, !0, B());
        }
        function s() {
            --H || A("loading", null, !1, B());
        }
        function t(a) {
            var d = a.source || {}, e = T(d.ignoreTimezone, c.ignoreTimezone);
            a._id = a._id || (a.id === b ? "_fc" + Ba++ : a.id + ""), a.date && (a.start || (a.start = a.date), 
            delete a.date), a._start = m(a.start = q(a.start, e)), a.end = q(a.end, e), a.end && a.end <= a.start && (a.end = null), 
            a._end = a.end ? m(a.end) : null, a.allDay === b && (a.allDay = T(d.allDayDefault, c.allDayDefault)), 
            a.className ? "string" == typeof a.className && (a.className = a.className.split(/\s+/)) : a.className = [];
        }
        function u(a) {
            a.className ? "string" == typeof a.className && (a.className = a.className.split(/\s+/)) : a.className = [];
            for (var b = ya.sourceNormalizers, c = 0; c < b.length; c++) b[c](a);
        }
        function v(a, b) {
            return a && b && w(a) == w(b);
        }
        function w(a) {
            return ("object" == typeof a ? a.events || a.url : "") || a;
        }
        var x = this;
        x.isFetchNeeded = e, x.fetchEvents = f, x.addEventSource = i, x.removeEventSource = k, 
        x.updateEvent = l, x.renderEvent = n, x.removeEvents = o, x.clientEvents = p, x.normalizeEvent = t;
        for (var y, z, A = x.trigger, B = x.getView, C = x.reportEvents, D = {
            events: []
        }, E = [ D ], F = 0, G = 0, H = 0, I = [], J = 0; J < d.length; J++) j(d[J]);
    }
    function g(a, b, c) {
        return a.setFullYear(a.getFullYear() + b), c || l(a), a;
    }
    function h(a, b, c) {
        if (+a) {
            var d = a.getMonth() + b, e = m(a);
            for (e.setDate(1), e.setMonth(d), a.setMonth(d), c || l(a); a.getMonth() != e.getMonth(); ) a.setDate(a.getDate() + (e > a ? 1 : -1));
        }
        return a;
    }
    function i(a, b, c) {
        if (+a) {
            var d = a.getDate() + b, e = m(a);
            e.setHours(9), e.setDate(d), a.setDate(d), c || l(a), j(a, e);
        }
        return a;
    }
    function j(a, b) {
        if (+a) for (;a.getDate() != b.getDate(); ) a.setTime(+a + (b > a ? 1 : -1) * Ea);
    }
    function k(a, b) {
        return a.setMinutes(a.getMinutes() + b), a;
    }
    function l(a) {
        return a.setHours(0), a.setMinutes(0), a.setSeconds(0), a.setMilliseconds(0), a;
    }
    function m(a, b) {
        return b ? l(new Date(+a)) : new Date(+a);
    }
    function n() {
        var a, b = 0;
        do a = new Date(1970, b++, 1); while (a.getHours());
        return a;
    }
    function o(a, b) {
        return Math.round((m(a, !0) - m(b, !0)) / Da);
    }
    function p(a, c, d, e) {
        c !== b && c != a.getFullYear() && (a.setDate(1), a.setMonth(0), a.setFullYear(c)), 
        d !== b && d != a.getMonth() && (a.setDate(1), a.setMonth(d)), e !== b && a.setDate(e);
    }
    function q(a, c) {
        return "object" == typeof a ? a : "number" == typeof a ? new Date(1e3 * a) : "string" == typeof a ? a.match(/^\d+(\.\d+)?$/) ? new Date(1e3 * parseFloat(a)) : (c === b && (c = !0), 
        r(a, c) || (a ? new Date(a) : null)) : null;
    }
    function r(a, b) {
        var c = a.match(/^([0-9]{4})(-([0-9]{2})(-([0-9]{2})([T ]([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?(Z|(([-+])([0-9]{2})(:?([0-9]{2}))?))?)?)?)?$/);
        if (!c) return null;
        var d = new Date(c[1], 0, 1);
        if (b || !c[13]) {
            var e = new Date(c[1], 0, 1, 9, 0);
            c[3] && (d.setMonth(c[3] - 1), e.setMonth(c[3] - 1)), c[5] && (d.setDate(c[5]), 
            e.setDate(c[5])), j(d, e), c[7] && d.setHours(c[7]), c[8] && d.setMinutes(c[8]), 
            c[10] && d.setSeconds(c[10]), c[12] && d.setMilliseconds(1e3 * Number("0." + c[12])), 
            j(d, e);
        } else if (d.setUTCFullYear(c[1], c[3] ? c[3] - 1 : 0, c[5] || 1), d.setUTCHours(c[7] || 0, c[8] || 0, c[10] || 0, c[12] ? 1e3 * Number("0." + c[12]) : 0), 
        c[14]) {
            var f = 60 * Number(c[16]) + (c[18] ? Number(c[18]) : 0);
            f *= "-" == c[15] ? 1 : -1, d = new Date(+d + 60 * f * 1e3);
        }
        return d;
    }
    function s(a) {
        if ("number" == typeof a) return 60 * a;
        if ("object" == typeof a) return 60 * a.getHours() + a.getMinutes();
        var b = a.match(/(\d+)(?::(\d+))?\s*(\w+)?/);
        if (b) {
            var c = parseInt(b[1], 10);
            return b[3] && (c %= 12, "p" == b[3].toLowerCase().charAt(0) && (c += 12)), 60 * c + (b[2] ? parseInt(b[2], 10) : 0);
        }
    }
    function t(a, b, c) {
        return u(a, null, b, c);
    }
    function u(a, b, c, d) {
        d = d || wa;
        var e, f, g, h, i = a, j = b, k = c.length, l = "";
        for (e = 0; k > e; e++) if (f = c.charAt(e), "'" == f) {
            for (g = e + 1; k > g; g++) if ("'" == c.charAt(g)) {
                i && (l += g == e + 1 ? "'" : c.substring(e + 1, g), e = g);
                break;
            }
        } else if ("(" == f) {
            for (g = e + 1; k > g; g++) if (")" == c.charAt(g)) {
                var m = t(i, c.substring(e + 1, g), d);
                parseInt(m.replace(/\D/, ""), 10) && (l += m), e = g;
                break;
            }
        } else if ("[" == f) {
            for (g = e + 1; k > g; g++) if ("]" == c.charAt(g)) {
                var n = c.substring(e + 1, g), m = t(i, n, d);
                m != t(j, n, d) && (l += m), e = g;
                break;
            }
        } else if ("{" == f) i = b, j = a; else if ("}" == f) i = a, j = b; else {
            for (g = k; g > e; g--) if (h = Ga[c.substring(e, g)]) {
                i && (l += h(i, d)), e = g - 1;
                break;
            }
            g == e && i && (l += f);
        }
        return l;
    }
    function v(a) {
        var b, c = new Date(a.getTime());
        return c.setDate(c.getDate() + 4 - (c.getDay() || 7)), b = c.getTime(), c.setMonth(0), 
        c.setDate(1), Math.floor(Math.round((b - c) / 864e5) / 7) + 1;
    }
    function w(a) {
        return a.end ? x(a.end, a.allDay) : i(m(a.start), 1);
    }
    function x(a, b) {
        return a = m(a), b || a.getHours() || a.getMinutes() ? i(a, 1) : l(a);
    }
    function y(c, d, e) {
        c.unbind("mouseover").mouseover(function(c) {
            for (var f, g, h, i = c.target; i != this; ) f = i, i = i.parentNode;
            (g = f._fci) !== b && (f._fci = b, h = d[g], e(h.event, h.element, h), a(c.target).trigger(c)), 
            c.stopPropagation();
        });
    }
    function z(b, c, d) {
        for (var e, f = 0; f < b.length; f++) e = a(b[f]), e.width(Math.max(0, c - B(e, d)));
    }
    function A(b, c, d) {
        for (var e, f = 0; f < b.length; f++) e = a(b[f]), e.height(Math.max(0, c - F(e, d)));
    }
    function B(a, b) {
        return C(a) + E(a) + (b ? D(a) : 0);
    }
    function C(b) {
        return (parseFloat(a.css(b[0], "paddingLeft", !0)) || 0) + (parseFloat(a.css(b[0], "paddingRight", !0)) || 0);
    }
    function D(b) {
        return (parseFloat(a.css(b[0], "marginLeft", !0)) || 0) + (parseFloat(a.css(b[0], "marginRight", !0)) || 0);
    }
    function E(b) {
        return (parseFloat(a.css(b[0], "borderLeftWidth", !0)) || 0) + (parseFloat(a.css(b[0], "borderRightWidth", !0)) || 0);
    }
    function F(a, b) {
        return G(a) + I(a) + (b ? H(a) : 0);
    }
    function G(b) {
        return (parseFloat(a.css(b[0], "paddingTop", !0)) || 0) + (parseFloat(a.css(b[0], "paddingBottom", !0)) || 0);
    }
    function H(b) {
        return (parseFloat(a.css(b[0], "marginTop", !0)) || 0) + (parseFloat(a.css(b[0], "marginBottom", !0)) || 0);
    }
    function I(b) {
        return (parseFloat(a.css(b[0], "borderTopWidth", !0)) || 0) + (parseFloat(a.css(b[0], "borderBottomWidth", !0)) || 0);
    }
    function J() {}
    function K(a, b) {
        return a - b;
    }
    function L(a) {
        return Math.max.apply(Math, a);
    }
    function M(a) {
        return (10 > a ? "0" : "") + a;
    }
    function N(a, c) {
        if (a[c] !== b) return a[c];
        for (var d, e = c.split(/(?=[A-Z])/), f = e.length - 1; f >= 0; f--) if (d = a[e[f].toLowerCase()], 
        d !== b) return d;
        return a[""];
    }
    function O(a) {
        return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#039;").replace(/"/g, "&quot;").replace(/\n/g, "<br />");
    }
    function P(a) {
        a.attr("unselectable", "on").css("MozUserSelect", "none").bind("selectstart.ui", function() {
            return !1;
        });
    }
    function Q(a) {
        a.children().removeClass("fc-first fc-last").filter(":first-child").addClass("fc-first").end().filter(":last-child").addClass("fc-last");
    }
    function R(a, b) {
        var c = a.source || {}, d = a.color, e = c.color, f = b("eventColor"), g = a.backgroundColor || d || c.backgroundColor || e || b("eventBackgroundColor") || f, h = a.borderColor || d || c.borderColor || e || b("eventBorderColor") || f, i = a.textColor || c.textColor || b("eventTextColor"), j = [];
        return g && j.push("background-color:" + g), h && j.push("border-color:" + h), i && j.push("color:" + i), 
        j.join(";");
    }
    function S(b, c, d) {
        if (a.isFunction(b) && (b = [ b ]), b) {
            var e, f;
            for (e = 0; e < b.length; e++) f = b[e].apply(c, d) || f;
            return f;
        }
    }
    function T() {
        for (var a = 0; a < arguments.length; a++) if (arguments[a] !== b) return arguments[a];
    }
    function U(a, b) {
        function c(a, b) {
            b && (h(a, b), a.setDate(1));
            var c = e("firstDay"), l = m(a, !0);
            l.setDate(1);
            var n = h(m(l), 1), p = m(l);
            i(p, -((p.getDay() - c + 7) % 7)), g(p);
            var q = m(n);
            i(q, (7 - q.getDay() + c) % 7), g(q, -1, !0);
            var r = j(), s = Math.round(o(q, p) / 7);
            "fixed" == e("weekMode") && (i(q, 7 * (6 - s)), s = 6), d.title = k(l, e("titleFormat")), 
            d.start = l, d.end = n, d.visStart = p, d.visEnd = q, f(s, r, !0);
        }
        var d = this;
        d.render = c, X.call(d, a, b, "month");
        var e = d.opt, f = d.renderBasic, g = d.skipHiddenDays, j = d.getCellsPerWeek, k = b.formatDate;
    }
    function V(a, b) {
        function c(a, b) {
            b && i(a, 7 * b);
            var c = i(m(a), -((a.getDay() - e("firstDay") + 7) % 7)), k = i(m(c), 7), l = m(c);
            g(l);
            var n = m(k);
            g(n, -1, !0);
            var o = h();
            d.start = c, d.end = k, d.visStart = l, d.visEnd = n, d.title = j(l, i(m(n), -1), e("titleFormat")), 
            f(1, o, !1);
        }
        var d = this;
        d.render = c, X.call(d, a, b, "basicWeek");
        var e = d.opt, f = d.renderBasic, g = d.skipHiddenDays, h = d.getCellsPerWeek, j = b.formatDates;
    }
    function W(a, b) {
        function c(a, b) {
            b && i(a, b), g(a, 0 > b ? -1 : 1);
            var c = m(a, !0), j = i(m(c), 1);
            d.title = h(a, e("titleFormat")), d.start = d.visStart = c, d.end = d.visEnd = j, 
            f(1, 1, !1);
        }
        var d = this;
        d.render = c, X.call(d, a, b, "basicDay");
        var e = d.opt, f = d.renderBasic, g = d.skipHiddenDays, h = b.formatDate;
    }
    function X(b, c, d) {
        function e(a, b, c) {
            ba = a, ca = b, da = c, f(), R || g(), h();
        }
        function f() {
            ia = oa("theme") ? "ui" : "fc", ja = oa("columnFormat"), ka = oa("weekNumbers"), 
            ma = oa("weekNumberTitle"), na = "iso" != oa("weekNumberCalculation") ? "w" : "W";
        }
        function g() {
            X = a("<div class='fc-event-container' style='position:absolute;z-index:8;top:0;left:0'/>").appendTo(b);
        }
        function h() {
            var c = j();
            L && L.remove(), L = a(c).appendTo(b), M = L.find("thead"), N = M.find(".fc-day-header"), 
            R = L.find("tbody"), S = R.find("tr"), T = R.find(".fc-day"), U = S.find("td:first-child"), 
            V = S.eq(0).find(".fc-day > div"), W = S.eq(0).find(".fc-day-content > div"), Q(M.add(M.find("tr"))), 
            Q(S), S.eq(0).addClass("fc-first"), S.filter(":last").addClass("fc-last"), T.each(function(b, c) {
                var d = ya(Math.floor(b / ca), b % ca);
                pa("dayRender", K, d, a(c));
            }), s(T);
        }
        function j() {
            var a = "<table class='fc-border-separate' style='width:100%' cellspacing='0'>" + k() + n() + "</table>";
            return a;
        }
        function k() {
            var a, b, c = ia + "-widget-header", d = "";
            for (d += "<thead><tr>", ka && (d += "<th class='fc-week-number " + c + "'>" + O(ma) + "</th>"), 
            a = 0; ca > a; a++) b = ya(0, a), d += "<th class='fc-day-header fc-" + Ca[b.getDay()] + " " + c + "'>" + O(Ba(b, ja)) + "</th>";
            return d += "</tr></thead>";
        }
        function n() {
            var a, b, c, d = ia + "-widget-content", e = "";
            for (e += "<tbody>", a = 0; ba > a; a++) {
                for (e += "<tr class='fc-week'>", ka && (c = ya(a, 0), e += "<td class='fc-week-number " + d + "'><div>" + O(Ba(c, na)) + "</div></td>"), 
                b = 0; ca > b; b++) c = ya(a, b), e += o(c);
                e += "</tr>";
            }
            return e += "</tbody>";
        }
        function o(a) {
            var b = ia + "-widget-content", c = K.start.getMonth(), d = l(new Date()), e = "", f = [ "fc-day", "fc-" + Ca[a.getDay()], b ];
            return a.getMonth() != c && f.push("fc-other-month"), +a == +d ? f.push("fc-today", ia + "-state-highlight") : d > a ? f.push("fc-past") : f.push("fc-future"), 
            e += "<td class='" + f.join(" ") + "' data-date='" + Ba(a, "yyyy-MM-dd") + "'><div>", 
            da && (e += "<div class='fc-day-number'>" + a.getDate() + "</div>"), e += "<div class='fc-day-content'><div style='position:relative'>&nbsp;</div></div></div></td>";
        }
        function p(b) {
            $ = b;
            var c, d, e, f = $ - M.height();
            "variable" == oa("weekMode") ? c = d = Math.floor(f / (1 == ba ? 2 : 6)) : (c = Math.floor(f / ba), 
            d = f - c * (ba - 1)), U.each(function(b, f) {
                ba > b && (e = a(f), e.find("> div").css("min-height", (b == ba - 1 ? d : c) - F(e)));
            });
        }
        function q(a) {
            Z = a, ga.clear(), ha.clear(), aa = 0, ka && (aa = M.find("th.fc-week-number").outerWidth()), 
            _ = Math.floor((Z - aa) / ca), z(N.slice(0, -1), _);
        }
        function s(a) {
            a.click(t).mousedown(xa);
        }
        function t(b) {
            if (!oa("selectable")) {
                var c = r(a(this).data("date"));
                pa("dayClick", this, c, !0, b);
            }
        }
        function u(a, b, c) {
            c && ea.build();
            for (var d = Aa(a, b), e = 0; e < d.length; e++) {
                var f = d[e];
                s(v(f.row, f.leftCol, f.row, f.rightCol));
            }
        }
        function v(a, c, d, e) {
            var f = ea.rect(a, c, d, e, b);
            return ua(f, b);
        }
        function w(a, b) {
            return m(a);
        }
        function x(a, b, c) {
            u(a, i(m(b), 1), !0);
        }
        function y() {
            wa();
        }
        function A(a, b, c) {
            var d = za(a), e = T[d.row * ca + d.col];
            pa("dayClick", e, a, b, c);
        }
        function B(a, b, c) {
            fa.start(function(a) {
                wa(), a && v(a.row, a.col, a.row, a.col);
            }, b);
        }
        function C(a, b, c) {
            var d = fa.stop();
            if (wa(), d) {
                var e = ya(d);
                pa("drop", a, e, !0, b, c);
            }
        }
        function D(a) {
            return m(a.start);
        }
        function E(a) {
            return ga.left(a);
        }
        function G(a) {
            return ga.right(a);
        }
        function H(a) {
            return ha.left(a);
        }
        function I(a) {
            return ha.right(a);
        }
        function J(a) {
            return S.eq(a);
        }
        var K = this;
        K.renderBasic = e, K.setHeight = p, K.setWidth = q, K.renderDayOverlay = u, K.defaultSelectionEnd = w, 
        K.renderSelection = x, K.clearSelection = y, K.reportDayClick = A, K.dragStart = B, 
        K.dragStop = C, K.defaultEventEnd = D, K.getHoverListener = function() {
            return fa;
        }, K.colLeft = E, K.colRight = G, K.colContentLeft = H, K.colContentRight = I, K.getIsCellAllDay = function() {
            return !0;
        }, K.allDayRow = J, K.getRowCnt = function() {
            return ba;
        }, K.getColCnt = function() {
            return ca;
        }, K.getColWidth = function() {
            return _;
        }, K.getDaySegmentContainer = function() {
            return X;
        }, la.call(K, b, c, d), ra.call(K), qa.call(K), Y.call(K);
        var L, M, N, R, S, T, U, V, W, X, Z, $, _, aa, ba, ca, da, ea, fa, ga, ha, ia, ja, ka, ma, na, oa = K.opt, pa = K.trigger, ua = K.renderOverlay, wa = K.clearOverlays, xa = K.daySelectionMousedown, ya = K.cellToDate, za = K.dateToCell, Aa = K.rangeToSegments, Ba = c.formatDate;
        P(b.addClass("fc-grid")), ea = new sa(function(b, c) {
            var d, e, f;
            N.each(function(b, g) {
                d = a(g), e = d.offset().left, b && (f[1] = e), f = [ e ], c[b] = f;
            }), f[1] = e + d.outerWidth(), S.each(function(c, g) {
                ba > c && (d = a(g), e = d.offset().top, c && (f[1] = e), f = [ e ], b[c] = f);
            }), f[1] = e + d.outerHeight();
        }), fa = new ta(ea), ga = new va(function(a) {
            return V.eq(a);
        }), ha = new va(function(a) {
            return W.eq(a);
        });
    }
    function Y() {
        function a(a, b) {
            c.renderDayEvents(a, b);
        }
        function b() {
            c.getDaySegmentContainer().empty();
        }
        var c = this;
        c.renderEvents = a, c.clearEvents = b, ma.call(c);
    }
    function Z(a, b) {
        function c(a, b) {
            b && i(a, 7 * b);
            var c = i(m(a), -((a.getDay() - e("firstDay") + 7) % 7)), k = i(m(c), 7), l = m(c);
            g(l);
            var n = m(k);
            g(n, -1, !0);
            var o = h();
            d.title = j(l, i(m(n), -1), e("titleFormat")), d.start = c, d.end = k, d.visStart = l, 
            d.visEnd = n, f(o);
        }
        var d = this;
        d.render = c, _.call(d, a, b, "agendaWeek");
        var e = d.opt, f = d.renderAgenda, g = d.skipHiddenDays, h = d.getCellsPerWeek, j = b.formatDates;
    }
    function $(a, b) {
        function c(a, b) {
            b && i(a, b), g(a, 0 > b ? -1 : 1);
            var c = m(a, !0), j = i(m(c), 1);
            d.title = h(a, e("titleFormat")), d.start = d.visStart = c, d.end = d.visEnd = j, 
            f(1);
        }
        var d = this;
        d.render = c, _.call(d, a, b, "agendaDay");
        var e = d.opt, f = d.renderAgenda, g = d.skipHiddenDays, h = b.formatDate;
    }
    function _(c, d, e) {
        function f(a) {
            Ia = a, g(), _ ? j() : h();
        }
        function g() {
            Oa = Wa("theme") ? "ui" : "fc", Pa = Wa("isRTL"), Qa = s(Wa("minTime")), Ra = s(Wa("maxTime")), 
            Sa = Wa("columnFormat"), Ta = Wa("weekNumbers"), Ua = Wa("weekNumberTitle"), Va = "iso" != Wa("weekNumberCalculation") ? "w" : "W", 
            Fa = Wa("snapMinutes") || Wa("slotMinutes");
        }
        function h() {
            var b, d, e, f, g, h = Oa + "-widget-header", i = Oa + "-widget-content", l = Wa("slotMinutes") % 15 == 0;
            for (j(), ja = a("<div style='position:absolute;z-index:2;left:0;width:100%'/>").appendTo(c), 
            Wa("allDaySlot") ? (ka = a("<div class='fc-event-container' style='position:absolute;z-index:8;top:0;left:0'/>").appendTo(ja), 
            b = "<table style='width:100%' class='fc-agenda-allday' cellspacing='0'><tr><th class='" + h + " fc-agenda-axis'>" + Wa("allDayText") + "</th><td><div class='fc-day-content'><div style='position:relative'/></div></td><th class='" + h + " fc-agenda-gutter'>&nbsp;</th></tr></table>", 
            ma = a(b).appendTo(ja), na = ma.find("tr"), w(na.find("td")), ja.append("<div class='fc-agenda-divider " + h + "'><div class='fc-agenda-divider-inner'/></div>")) : ka = a([]), 
            oa = a("<div style='position:absolute;width:100%;overflow-x:hidden;overflow-y:auto'/>").appendTo(ja), 
            pa = a("<div style='position:relative;width:100%;overflow:hidden'/>").appendTo(oa), 
            ua = a("<div class='fc-event-container' style='position:absolute;z-index:8;top:0;left:0'/>").appendTo(pa), 
            b = "<table class='fc-agenda-slots' style='width:100%' cellspacing='0'><tbody>", 
            d = n(), f = k(m(d), Ra), k(d, Qa), Ja = 0, e = 0; f > d; e++) g = d.getMinutes(), 
            b += "<tr class='fc-slot" + e + " " + (g ? "fc-minor" : "") + "'><th class='fc-agenda-axis " + h + "'>" + (l && g ? "&nbsp;" : fb(d, Wa("axisFormat"))) + "</th><td class='" + i + "'><div style='position:relative'>&nbsp;</div></td></tr>", 
            k(d, Wa("slotMinutes")), Ja++;
            b += "</tbody></table>", wa = a(b).appendTo(pa), x(wa.find("td"));
        }
        function j() {
            var b = o();
            _ && _.remove(), _ = a(b).appendTo(c), ba = _.find("thead"), ca = ba.find("th").slice(1, -1), 
            da = _.find("tbody"), ea = da.find("td").slice(0, -1), fa = ea.find("> div"), ga = ea.find(".fc-day-content > div"), 
            ha = ea.eq(0), ia = fa.eq(0), Q(ba.add(ba.find("tr"))), Q(da.add(da.find("tr")));
        }
        function o() {
            var a = "<table style='width:100%' class='fc-agenda-days fc-border-separate' cellspacing='0'>" + p() + q() + "</table>";
            return a;
        }
        function p() {
            var a, b, c, d = Oa + "-widget-header", e = "";
            for (e += "<thead><tr>", Ta ? (a = cb(0, 0), b = fb(a, Va), Pa ? b += Ua : b = Ua + b, 
            e += "<th class='fc-agenda-axis fc-week-number " + d + "'>" + O(b) + "</th>") : e += "<th class='fc-agenda-axis " + d + "'>&nbsp;</th>", 
            c = 0; Ia > c; c++) a = cb(0, c), e += "<th class='fc-" + Ca[a.getDay()] + " fc-col" + c + " " + d + "'>" + O(fb(a, Sa)) + "</th>";
            return e += "<th class='fc-agenda-gutter " + d + "'>&nbsp;</th></tr></thead>";
        }
        function q() {
            var a, b, c, d, e, f = Oa + "-widget-header", g = Oa + "-widget-content", h = l(new Date()), i = "";
            for (i += "<tbody><tr><th class='fc-agenda-axis " + f + "'>&nbsp;</th>", c = "", 
            b = 0; Ia > b; b++) a = cb(0, b), e = [ "fc-col" + b, "fc-" + Ca[a.getDay()], g ], 
            +a == +h ? e.push(Oa + "-state-highlight", "fc-today") : h > a ? e.push("fc-past") : e.push("fc-future"), 
            d = "<td class='" + e.join(" ") + "'><div><div class='fc-day-content'><div style='position:relative'>&nbsp;</div></div></div></td>", 
            c += d;
            return i += c, i += "<td class='fc-agenda-gutter " + g + "'>&nbsp;</td></tr></tbody>";
        }
        function r(a) {
            a === b && (a = za), za = a, gb = {};
            var c = da.position().top, d = oa.position().top, e = Math.min(a - c, wa.height() + d + 1);
            ia.height(e - F(ha)), ja.css("top", c), oa.height(e - d - 1), Ea = wa.find("tr:first").height() + 1, 
            Ga = Wa("slotMinutes") / Fa, Ha = Ea / Ga;
        }
        function t(b) {
            ya = b, Ma.clear(), Na.clear();
            var c = ba.find("th:first");
            ma && (c = c.add(ma.find("th:first"))), c = c.add(wa.find("th:first")), Aa = 0, 
            z(c.width("").each(function(b, c) {
                Aa = Math.max(Aa, a(c).outerWidth());
            }), Aa);
            var d = _.find(".fc-agenda-gutter");
            ma && (d = d.add(ma.find("th.fc-agenda-gutter")));
            var e = oa[0].clientWidth;
            Da = oa.width() - e, Da ? (z(d, Da), d.show().prev().removeClass("fc-last")) : d.hide().prev().addClass("fc-last"), 
            Ba = Math.floor((e - Aa) / Ia), z(ca.slice(0, -1), Ba);
        }
        function u() {
            function a() {
                oa.scrollTop(d);
            }
            var b = n(), c = m(b);
            c.setHours(Wa("firstHour"));
            var d = M(b, c) + 1;
            a(), setTimeout(a, 0);
        }
        function v() {
            u();
        }
        function w(a) {
            a.click(y).mousedown(ab);
        }
        function x(a) {
            a.click(y).mousedown(W);
        }
        function y(a) {
            if (!Wa("selectable")) {
                var b = Math.min(Ia - 1, Math.floor((a.pageX - _.offset().left - Aa) / Ba)), c = cb(0, b), d = this.parentNode.className.match(/fc-slot(\d+)/);
                if (d) {
                    var e = parseInt(d[1]) * Wa("slotMinutes"), f = Math.floor(e / 60);
                    c.setHours(f), c.setMinutes(e % 60 + Qa), Xa("dayClick", ea[b], c, !1, a);
                } else Xa("dayClick", ea[b], c, !0, a);
            }
        }
        function B(a, b, c) {
            c && Ka.build();
            for (var d = eb(a, b), e = 0; e < d.length; e++) {
                var f = d[e];
                w(C(f.row, f.leftCol, f.row, f.rightCol));
            }
        }
        function C(a, b, c, d) {
            var e = Ka.rect(a, b, c, d, ja);
            return Ya(e, ja);
        }
        function D(a, b) {
            for (var c = 0; Ia > c; c++) {
                var d = cb(0, c), e = i(m(d), 1), f = new Date(Math.max(d, a)), g = new Date(Math.min(e, b));
                if (g > f) {
                    var h = Ka.rect(0, c, 0, c, pa), j = M(d, f), k = M(d, g);
                    h.top = j, h.height = k - j, x(Ya(h, pa));
                }
            }
        }
        function E(a) {
            return Ma.left(a);
        }
        function G(a) {
            return Na.left(a);
        }
        function H(a) {
            return Ma.right(a);
        }
        function I(a) {
            return Na.right(a);
        }
        function J(a) {
            return Wa("allDaySlot") && !a.row;
        }
        function L(a) {
            var b = cb(0, a.col), c = a.row;
            return Wa("allDaySlot") && c--, c >= 0 && k(b, Qa + c * Fa), b;
        }
        function M(a, c) {
            if (a = m(a, !0), c < k(m(a), Qa)) return 0;
            if (c >= k(m(a), Ra)) return wa.height();
            var d = Wa("slotMinutes"), e = 60 * c.getHours() + c.getMinutes() - Qa, f = Math.floor(e / d), g = gb[f];
            return g === b && (g = gb[f] = wa.find("tr").eq(f).find("td div")[0].offsetTop), 
            Math.max(0, Math.round(g - 1 + Ea * (e % d / d)));
        }
        function N(a) {
            return na;
        }
        function R(a) {
            var b = m(a.start);
            return a.allDay ? b : k(b, Wa("defaultEventMinutes"));
        }
        function S(a, b) {
            return b ? m(a) : k(m(a), Wa("slotMinutes"));
        }
        function T(a, b, c) {
            c ? Wa("allDaySlot") && B(a, i(m(b), 1), !0) : U(a, b);
        }
        function U(b, c) {
            var d = Wa("selectHelper");
            if (Ka.build(), d) {
                var e = db(b).col;
                if (e >= 0 && Ia > e) {
                    var f = Ka.rect(0, e, 0, e, pa), g = M(b, b), h = M(b, c);
                    if (h > g) {
                        if (f.top = g, f.height = h - g, f.left += 2, f.width -= 5, a.isFunction(d)) {
                            var i = d(b, c);
                            i && (f.position = "absolute", xa = a(i).css(f).appendTo(pa));
                        } else f.isStart = !0, f.isEnd = !0, xa = a(bb({
                            title: "",
                            start: b,
                            end: c,
                            className: [ "fc-select-helper" ],
                            editable: !1
                        }, f)), xa.css("opacity", Wa("dragOpacity"));
                        xa && (x(xa), pa.append(xa), z(xa, f.width, !0), A(xa, f.height, !0));
                    }
                }
            } else D(b, c);
        }
        function V() {
            Za(), xa && (xa.remove(), xa = null);
        }
        function W(b) {
            if (1 == b.which && Wa("selectable")) {
                _a(b);
                var c;
                La.start(function(a, b) {
                    if (V(), a && a.col == b.col && !J(a)) {
                        var d = L(b), e = L(a);
                        c = [ d, k(m(d), Fa), e, k(m(e), Fa) ].sort(K), U(c[0], c[3]);
                    } else c = null;
                }, b), a(document).one("mouseup", function(a) {
                    La.stop(), c && (+c[0] == +c[1] && X(c[0], !1, a), $a(c[0], c[3], !1, a));
                });
            }
        }
        function X(a, b, c) {
            Xa("dayClick", ea[db(a).col], a, b, c);
        }
        function Y(a, b, c) {
            La.start(function(a) {
                if (Za(), a) if (J(a)) C(a.row, a.col, a.row, a.col); else {
                    var b = L(a), c = k(m(b), Wa("defaultEventMinutes"));
                    D(b, c);
                }
            }, b);
        }
        function Z(a, b, c) {
            var d = La.stop();
            Za(), d && Xa("drop", a, L(d), J(d), b, c);
        }
        var $ = this;
        $.renderAgenda = f, $.setWidth = t, $.setHeight = r, $.afterRender = v, $.defaultEventEnd = R, 
        $.timePosition = M, $.getIsCellAllDay = J, $.allDayRow = N, $.getCoordinateGrid = function() {
            return Ka;
        }, $.getHoverListener = function() {
            return La;
        }, $.colLeft = E, $.colRight = H, $.colContentLeft = G, $.colContentRight = I, $.getDaySegmentContainer = function() {
            return ka;
        }, $.getSlotSegmentContainer = function() {
            return ua;
        }, $.getMinMinute = function() {
            return Qa;
        }, $.getMaxMinute = function() {
            return Ra;
        }, $.getSlotContainer = function() {
            return pa;
        }, $.getRowCnt = function() {
            return 1;
        }, $.getColCnt = function() {
            return Ia;
        }, $.getColWidth = function() {
            return Ba;
        }, $.getSnapHeight = function() {
            return Ha;
        }, $.getSnapMinutes = function() {
            return Fa;
        }, $.defaultSelectionEnd = S, $.renderDayOverlay = B, $.renderSelection = T, $.clearSelection = V, 
        $.reportDayClick = X, $.dragStart = Y, $.dragStop = Z, la.call($, c, d, e), ra.call($), 
        qa.call($), aa.call($);
        var _, ba, ca, da, ea, fa, ga, ha, ia, ja, ka, ma, na, oa, pa, ua, wa, xa, ya, za, Aa, Ba, Da, Ea, Fa, Ga, Ha, Ia, Ja, Ka, La, Ma, Na, Oa, Pa, Qa, Ra, Sa, Ta, Ua, Va, Wa = $.opt, Xa = $.trigger, Ya = $.renderOverlay, Za = $.clearOverlays, $a = $.reportSelection, _a = $.unselect, ab = $.daySelectionMousedown, bb = $.slotSegHtml, cb = $.cellToDate, db = $.dateToCell, eb = $.rangeToSegments, fb = d.formatDate, gb = {};
        P(c.addClass("fc-agenda")), Ka = new sa(function(b, c) {
            function d(a) {
                return Math.max(i, Math.min(j, a));
            }
            var e, f, g;
            ca.each(function(b, d) {
                e = a(d), f = e.offset().left, b && (g[1] = f), g = [ f ], c[b] = g;
            }), g[1] = f + e.outerWidth(), Wa("allDaySlot") && (e = na, f = e.offset().top, 
            b[0] = [ f, f + e.outerHeight() ]);
            for (var h = pa.offset().top, i = oa.offset().top, j = i + oa.outerHeight(), k = 0; Ja * Ga > k; k++) b.push([ d(h + Ha * k), d(h + Ha * (k + 1)) ]);
        }), La = new ta(Ka), Ma = new va(function(a) {
            return fa.eq(a);
        }), Na = new va(function(a) {
            return ga.eq(a);
        });
    }
    function aa() {
        function c(a, b) {
            var c, d = a.length, f = [], g = [];
            for (c = 0; d > c; c++) a[c].allDay ? f.push(a[c]) : g.push(a[c]);
            s("allDaySlot") && (aa(f, b), C()), h(e(g), b);
        }
        function d() {
            D().empty(), E().empty();
        }
        function e(b) {
            var c, d, e, h, i, j = P(), l = I(), n = H(), o = a.map(b, g), p = [];
            for (d = 0; j > d; d++) for (c = N(0, d), k(c, l), i = f(b, o, c, k(m(c), n - l)), 
            i = ba(i), e = 0; e < i.length; e++) h = i[e], h.col = d, p.push(h);
            return p;
        }
        function f(a, b, c, d) {
            var e, f, g, h, i, j, k, l, n = [], o = a.length;
            for (e = 0; o > e; e++) f = a[e], g = f.start, h = b[e], h > c && d > g && (c > g ? (i = m(c), 
            k = !1) : (i = g, k = !0), h > d ? (j = m(d), l = !1) : (j = h, l = !0), n.push({
                event: f,
                start: i,
                end: j,
                isStart: k,
                isEnd: l
            }));
            return n.sort(ka);
        }
        function g(a) {
            return a.end ? m(a.end) : k(m(a.start), s("defaultEventMinutes"));
        }
        function h(c, d) {
            var e, f, g, h, i, k, m, n, o, p, q, r, u, v, w, x, z = c.length, A = "", C = E(), D = s("isRTL");
            for (e = 0; z > e; e++) f = c[e], g = f.event, h = J(f.start, f.start), i = J(f.start, f.end), 
            k = L(f.col), m = M(f.col), n = m - k, m -= .025 * n, n = m - k, o = n * (f.forwardCoord - f.backwardCoord), 
            s("slotEventOverlap") && (o = Math.max(2 * (o - 10), o)), D ? (q = m - f.backwardCoord * n, 
            p = q - o) : (p = k + f.backwardCoord * n, q = p + o), p = Math.max(p, k), q = Math.min(q, m), 
            o = q - p, f.top = h, f.left = p, f.outerWidth = o, f.outerHeight = i - h, A += j(g, f);
            for (C[0].innerHTML = A, r = C.children(), e = 0; z > e; e++) f = c[e], g = f.event, 
            u = a(r[e]), v = t("eventRender", g, g, u), v === !1 ? u.remove() : (v && v !== !0 && (u.remove(), 
            u = a(v).css({
                position: "absolute",
                top: f.top,
                left: f.left
            }).appendTo(C)), f.element = u, g._id === d ? l(g, u, f) : u[0]._fci = e, V(g, u));
            for (y(C, c, l), e = 0; z > e; e++) f = c[e], (u = f.element) && (f.vsides = F(u, !0), 
            f.hsides = B(u, !0), w = u.find(".fc-event-title"), w.length && (f.contentTop = w[0].offsetTop));
            for (e = 0; z > e; e++) f = c[e], (u = f.element) && (u[0].style.width = Math.max(0, f.outerWidth - f.hsides) + "px", 
            x = Math.max(0, f.outerHeight - f.vsides), u[0].style.height = x + "px", g = f.event, 
            f.contentTop !== b && x - f.contentTop < 10 && (u.find("div.fc-event-time").text(da(g.start, s("timeFormat")) + " - " + g.title), 
            u.find("div.fc-event-title").remove()), t("eventAfterRender", g, g, u));
        }
        function j(a, b) {
            var c = "<", d = a.url, e = R(a, s), f = [ "fc-event", "fc-event-vert" ];
            return u(a) && f.push("fc-event-draggable"), b.isStart && f.push("fc-event-start"), 
            b.isEnd && f.push("fc-event-end"), f = f.concat(a.className), a.source && (f = f.concat(a.source.className || [])), 
            c += d ? "a href='" + O(a.url) + "'" : "div", c += " class='" + f.join(" ") + "' style='position:absolute;top:" + b.top + "px;left:" + b.left + "px;" + e + "'><div class='fc-event-inner'><div class='fc-event-time'>" + O(ea(a.start, a.end, s("timeFormat"))) + "</div><div class='fc-event-title'>" + O(a.title || "") + "</div></div><div class='fc-event-bg'></div>", 
            b.isEnd && v(a) && (c += "<div class='ui-resizable-handle ui-resizable-s'>=</div>"), 
            c += "</" + (d ? "a" : "div") + ">";
        }
        function l(a, b, c) {
            var d = b.find("div.fc-event-time");
            u(a) && p(a, b, d), c.isEnd && v(a) && q(a, b, d), z(a, b);
        }
        function n(a, b, c) {
            function d() {
                j || (b.width(e).height("").draggable("option", "grid", null), j = !0);
            }
            var e, f, g, h = c.isStart, j = !0, k = G(), l = Q(), n = S(), p = T(), q = I();
            b.draggable({
                opacity: s("dragOpacity", "month"),
                revertDuration: s("dragRevertDuration"),
                start: function(c, q) {
                    t("eventDragStart", b, a, c, q), X(a, b), e = b.width(), k.start(function(c, e) {
                        if (_(), c) {
                            f = !1;
                            var k = N(0, e.col), q = N(0, c.col);
                            g = o(q, k), c.row ? h ? j && (b.width(l - 10), A(b, n * Math.round((a.end ? (a.end - a.start) / Fa : s("defaultEventMinutes")) / p)), 
                            b.draggable("option", "grid", [ l, 1 ]), j = !1) : f = !0 : ($(i(m(a.start), g), i(w(a), g)), 
                            d()), f = f || j && !g;
                        } else d(), f = !0;
                        b.draggable("option", "revert", f);
                    }, c, "drag");
                },
                stop: function(c, e) {
                    if (k.stop(), _(), t("eventDragStop", b, a, c, e), f) d(), b.css("filter", ""), 
                    W(a, b); else {
                        var h = 0;
                        j || (h = Math.round((b.offset().top - U().offset().top) / n) * p + q - (60 * a.start.getHours() + a.start.getMinutes())), 
                        Y(this, a, g, h, j, c, e);
                    }
                }
            });
        }
        function p(a, b, c) {
            function d() {
                _(), h && (l ? (c.hide(), b.draggable("option", "grid", null), $(i(m(a.start), u), i(w(a), u))) : (e(v), 
                c.css("display", ""), b.draggable("option", "grid", [ A, B ])));
            }
            function e(b) {
                var d, e = k(m(a.start), b);
                a.end && (d = k(m(a.end), b)), c.text(ea(e, d, s("timeFormat")));
            }
            var f, g, h, j, l, n, p, q, u, v, x, y = r.getCoordinateGrid(), z = P(), A = Q(), B = S(), C = T();
            b.draggable({
                scroll: !1,
                grid: [ A, B ],
                axis: 1 == z ? "y" : !1,
                opacity: s("dragOpacity"),
                revertDuration: s("dragRevertDuration"),
                start: function(c, d) {
                    t("eventDragStart", b, a, c, d), X(a, b), y.build(), f = b.position(), g = y.cell(c.pageX, c.pageY), 
                    h = j = !0, l = n = K(g), p = q = 0, u = 0, v = x = 0;
                },
                drag: function(a, c) {
                    var e = y.cell(a.pageX, a.pageY);
                    if (h = !!e) {
                        if (l = K(e), p = Math.round((c.position.left - f.left) / A), p != q) {
                            var i = N(0, g.col), k = g.col + p;
                            k = Math.max(0, k), k = Math.min(z - 1, k);
                            var m = N(0, k);
                            u = o(m, i);
                        }
                        l || (v = Math.round((c.position.top - f.top) / B) * C);
                    }
                    (h != j || l != n || p != q || v != x) && (d(), j = h, n = l, q = p, x = v), b.draggable("option", "revert", !h);
                },
                stop: function(c, e) {
                    _(), t("eventDragStop", b, a, c, e), h && (l || u || v) ? Y(this, a, u, l ? 0 : v, l, c, e) : (h = !0, 
                    l = !1, p = 0, u = 0, v = 0, d(), b.css("filter", ""), b.css(f), W(a, b));
                }
            });
        }
        function q(a, b, c) {
            var d, e, f = S(), g = T();
            b.resizable({
                handles: {
                    s: ".ui-resizable-handle"
                },
                grid: f,
                start: function(c, f) {
                    d = e = 0, X(a, b), t("eventResizeStart", this, a, c, f);
                },
                resize: function(h, i) {
                    d = Math.round((Math.max(f, b.height()) - i.originalSize.height) / f), d != e && (c.text(ea(a.start, d || a.end ? k(x(a), g * d) : null, s("timeFormat"))), 
                    e = d);
                },
                stop: function(c, e) {
                    t("eventResizeStop", this, a, c, e), d ? Z(this, a, 0, g * d, c, e) : W(a, b);
                }
            });
        }
        var r = this;
        r.renderEvents = c, r.clearEvents = d, r.slotSegHtml = j, ma.call(r);
        var s = r.opt, t = r.trigger, u = r.isEventDraggable, v = r.isEventResizable, x = r.eventEnd, z = r.eventElementHandlers, C = r.setHeight, D = r.getDaySegmentContainer, E = r.getSlotSegmentContainer, G = r.getHoverListener, H = r.getMaxMinute, I = r.getMinMinute, J = r.timePosition, K = r.getIsCellAllDay, L = r.colContentLeft, M = r.colContentRight, N = r.cellToDate, P = r.getColCnt, Q = r.getColWidth, S = r.getSnapHeight, T = r.getSnapMinutes, U = r.getSlotContainer, V = r.reportEventElement, W = r.showEvents, X = r.hideEvents, Y = r.eventDrop, Z = r.eventResize, $ = r.renderDayOverlay, _ = r.clearOverlays, aa = r.renderDayEvents, ca = r.calendar, da = ca.formatDate, ea = ca.formatDates;
        r.draggableDayEvent = n;
    }
    function ba(a) {
        var b, c = ca(a), d = c[0];
        if (da(c), d) {
            for (b = 0; b < d.length; b++) ea(d[b]);
            for (b = 0; b < d.length; b++) fa(d[b], 0, 0);
        }
        return ga(c);
    }
    function ca(a) {
        var b, c, d, e = [];
        for (b = 0; b < a.length; b++) {
            for (c = a[b], d = 0; d < e.length && ha(c, e[d]).length; d++) ;
            (e[d] || (e[d] = [])).push(c);
        }
        return e;
    }
    function da(a) {
        var b, c, d, e, f;
        for (b = 0; b < a.length; b++) for (c = a[b], d = 0; d < c.length; d++) for (e = c[d], 
        e.forwardSegs = [], f = b + 1; f < a.length; f++) ha(e, a[f], e.forwardSegs);
    }
    function ea(a) {
        var c, d, e = a.forwardSegs, f = 0;
        if (a.forwardPressure === b) {
            for (c = 0; c < e.length; c++) d = e[c], ea(d), f = Math.max(f, 1 + d.forwardPressure);
            a.forwardPressure = f;
        }
    }
    function fa(a, c, d) {
        var e, f = a.forwardSegs;
        if (a.forwardCoord === b) for (f.length ? (f.sort(ja), fa(f[0], c + 1, d), a.forwardCoord = f[0].backwardCoord) : a.forwardCoord = 1, 
        a.backwardCoord = a.forwardCoord - (a.forwardCoord - d) / (c + 1), e = 0; e < f.length; e++) fa(f[e], 0, a.forwardCoord);
    }
    function ga(a) {
        var b, c, d, e = [];
        for (b = 0; b < a.length; b++) for (c = a[b], d = 0; d < c.length; d++) e.push(c[d]);
        return e;
    }
    function ha(a, b, c) {
        c = c || [];
        for (var d = 0; d < b.length; d++) ia(a, b[d]) && c.push(b[d]);
        return c;
    }
    function ia(a, b) {
        return a.end > b.start && a.start < b.end;
    }
    function ja(a, b) {
        return b.forwardPressure - a.forwardPressure || (a.backwardCoord || 0) - (b.backwardCoord || 0) || ka(a, b);
    }
    function ka(a, b) {
        return a.start - b.start || b.end - b.start - (a.end - a.start) || (a.event.title || "").localeCompare(b.event.title);
    }
    function la(c, d, e) {
        function f(b, c) {
            var d = V[b];
            return a.isPlainObject(d) ? N(d, c || e) : d;
        }
        function g(a, b) {
            return d.trigger.apply(d, [ a, b || M ].concat(Array.prototype.slice.call(arguments, 2), [ M ]));
        }
        function h(a) {
            var b = a.source || {};
            return T(a.startEditable, b.startEditable, f("eventStartEditable"), a.editable, b.editable, f("editable")) && !f("disableDragging");
        }
        function j(a) {
            var b = a.source || {};
            return T(a.durationEditable, b.durationEditable, f("eventDurationEditable"), a.editable, b.editable, f("editable")) && !f("disableResizing");
        }
        function l(a) {
            R = {};
            var b, c, d = a.length;
            for (b = 0; d > b; b++) c = a[b], R[c._id] ? R[c._id].push(c) : R[c._id] = [ c ];
        }
        function n() {
            R = {}, S = {}, U = [];
        }
        function p(a) {
            return a.end ? m(a.end) : O(a);
        }
        function q(a, b) {
            U.push({
                event: a,
                element: b
            }), S[a._id] ? S[a._id].push(b) : S[a._id] = [ b ];
        }
        function r() {
            a.each(U, function(a, b) {
                M.trigger("eventDestroy", b.event, b.event, b.element);
            });
        }
        function s(a, b) {
            b.click(function(c) {
                return b.hasClass("ui-draggable-dragging") || b.hasClass("ui-resizable-resizing") ? void 0 : g("eventClick", this, a, c);
            }).hover(function(b) {
                g("eventMouseover", this, a, b);
            }, function(b) {
                g("eventMouseout", this, a, b);
            });
        }
        function t(a, b) {
            v(a, b, "show");
        }
        function u(a, b) {
            v(a, b, "hide");
        }
        function v(a, b, c) {
            var d, e = S[a._id], f = e.length;
            for (d = 0; f > d; d++) b && e[d][0] == b[0] || e[d][c]();
        }
        function w(a, b, c, d, e, f, h) {
            var i = b.allDay, j = b._id;
            y(R[j], c, d, e), g("eventDrop", a, b, c, d, e, function() {
                y(R[j], -c, -d, i), Q(j);
            }, f, h), Q(j);
        }
        function x(a, b, c, d, e, f) {
            var h = b._id;
            z(R[h], c, d), g("eventResize", a, b, c, d, function() {
                z(R[h], -c, -d), Q(h);
            }, e, f), Q(h);
        }
        function y(a, c, d, e) {
            d = d || 0;
            for (var f, g = a.length, h = 0; g > h; h++) f = a[h], e !== b && (f.allDay = e), 
            k(i(f.start, c, !0), d), f.end && (f.end = k(i(f.end, c, !0), d)), P(f, V);
        }
        function z(a, b, c) {
            c = c || 0;
            for (var d, e = a.length, f = 0; e > f; f++) d = a[f], d.end = k(i(p(d), b, !0), c), 
            P(d, V);
        }
        function A(a) {
            return "object" == typeof a && (a = a.getDay()), Y[a];
        }
        function B() {
            return W;
        }
        function C(a, b, c) {
            for (b = b || 1; Y[(a.getDay() + (c ? b : 0) + 7) % 7]; ) i(a, b);
        }
        function D() {
            var a = E.apply(null, arguments), b = F(a), c = G(b);
            return c;
        }
        function E(a, b) {
            var c = M.getColCnt(), d = _ ? -1 : 1, e = _ ? c - 1 : 0;
            "object" == typeof a && (b = a.col, a = a.row);
            var f = a * c + (b * d + e);
            return f;
        }
        function F(a) {
            var b = M.visStart.getDay();
            return a += Z[b], 7 * Math.floor(a / W) + $[(a % W + W) % W] - b;
        }
        function G(a) {
            var b = m(M.visStart);
            return i(b, a), b;
        }
        function H(a) {
            var b = I(a), c = J(b), d = K(c);
            return d;
        }
        function I(a) {
            return o(a, M.visStart);
        }
        function J(a) {
            var b = M.visStart.getDay();
            return a += b, Math.floor(a / 7) * W + Z[(a % 7 + 7) % 7] - Z[b];
        }
        function K(a) {
            var b = M.getColCnt(), c = _ ? -1 : 1, d = _ ? b - 1 : 0, e = Math.floor(a / b), f = (a % b + b) % b * c + d;
            return {
                row: e,
                col: f
            };
        }
        function L(a, b) {
            for (var c = M.getRowCnt(), d = M.getColCnt(), e = [], f = I(a), g = I(b), h = J(f), i = J(g) - 1, j = 0; c > j; j++) {
                var k = j * d, l = k + d - 1, m = Math.max(h, k), n = Math.min(i, l);
                if (n >= m) {
                    var o = K(m), p = K(n), q = [ o.col, p.col ].sort(), r = F(m) == f, s = F(n) + 1 == g;
                    e.push({
                        row: j,
                        leftCol: q[0],
                        rightCol: q[1],
                        isStart: r,
                        isEnd: s
                    });
                }
            }
            return e;
        }
        var M = this;
        M.element = c, M.calendar = d, M.name = e, M.opt = f, M.trigger = g, M.isEventDraggable = h, 
        M.isEventResizable = j, M.setEventData = l, M.clearEventData = n, M.eventEnd = p, 
        M.reportEventElement = q, M.triggerEventDestroy = r, M.eventElementHandlers = s, 
        M.showEvents = t, M.hideEvents = u, M.eventDrop = w, M.eventResize = x;
        var O = M.defaultEventEnd, P = d.normalizeEvent, Q = d.reportEventChange, R = {}, S = {}, U = [], V = d.options;
        M.isHiddenDay = A, M.skipHiddenDays = C, M.getCellsPerWeek = B, M.dateToCell = H, 
        M.dateToDayOffset = I, M.dayOffsetToCellOffset = J, M.cellOffsetToCell = K, M.cellToDate = D, 
        M.cellToCellOffset = E, M.cellOffsetToDayOffset = F, M.dayOffsetToDate = G, M.rangeToSegments = L;
        var W, X = f("hiddenDays") || [], Y = [], Z = [], $ = [], _ = f("isRTL");
        !function() {
            f("weekends") === !1 && X.push(0, 6);
            for (var b = 0, c = 0; 7 > b; b++) Z[b] = c, Y[b] = -1 != a.inArray(b, X), Y[b] || ($[c] = b, 
            c++);
            if (W = c, !W) throw "invalid hiddenDays";
        }();
    }
    function ma() {
        function b(a, b) {
            var c = d(a, !1, !0);
            oa(c, function(a, b) {
                G(a.event, b);
            }), t(c, b), oa(c, function(a, b) {
                C("eventAfterRender", a.event, a.event, b);
            });
        }
        function c(a, b, c) {
            var e = d([ a ], !0, !1), f = [];
            return oa(e, function(a, d) {
                a.row === b && d.css("top", c), f.push(d[0]);
            }), f;
        }
        function d(b, c, d) {
            var f, i, j = X(), m = c ? a("<div/>") : j, n = e(b);
            return g(n), f = h(n), m[0].innerHTML = f, i = m.children(), c && j.append(i), k(n, i), 
            oa(n, function(a, b) {
                a.hsides = B(b, !0);
            }), oa(n, function(a, b) {
                b.width(Math.max(0, a.outerWidth - a.hsides));
            }), oa(n, function(a, b) {
                a.outerHeight = b.outerHeight(!0);
            }), l(n, d), n;
        }
        function e(a) {
            for (var b = [], c = 0; c < a.length; c++) {
                var d = f(a[c]);
                b.push.apply(b, d);
            }
            return b;
        }
        function f(a) {
            for (var b = a.start, c = w(a), d = aa(b, c), e = 0; e < d.length; e++) d[e].event = a;
            return d;
        }
        function g(a) {
            for (var b = A("isRTL"), c = 0; c < a.length; c++) {
                var d = a[c], e = (b ? d.isEnd : d.isStart) ? V : T, f = (b ? d.isStart : d.isEnd) ? W : U, g = e(d.leftCol), h = f(d.rightCol);
                d.left = g, d.outerWidth = h - g;
            }
        }
        function h(a) {
            for (var b = "", c = 0; c < a.length; c++) b += j(a[c]);
            return b;
        }
        function j(a) {
            var b = "", c = A("isRTL"), d = a.event, e = d.url, f = [ "fc-event", "fc-event-hori" ];
            D(d) && f.push("fc-event-draggable"), a.isStart && f.push("fc-event-start"), a.isEnd && f.push("fc-event-end"), 
            f = f.concat(d.className), d.source && (f = f.concat(d.source.className || []));
            var g = R(d, A);
            return b += e ? "<a href='" + O(e) + "'" : "<div", b += " class='" + f.join(" ") + "' style='position:absolute;left:" + a.left + "px;" + g + "'><div class='fc-event-inner'>", 
            b += "<div><span class='fc-event-recs'>" + O(d.recs || "") + "</span></div>", b += "<div><span class='fc-event-country'>" + O(d.country || "") + "</span></div>", 
            b += "<div><span class='fc-event-title'>" + O(d.title || "") + "</span></div>", 
            b += "<div><span class='fc-event-attendees'>" + O(d.attendees || "") + "</span></div></div>", 
            a.isEnd && E(d) && (b += "<div class='ui-resizable-handle ui-resizable-" + (c ? "w" : "e") + "'>&nbsp;&nbsp;&nbsp;</div>"), 
            b += "</" + (e ? "a" : "div") + ">";
        }
        function k(b, c) {
            for (var d = 0; d < b.length; d++) {
                var e = b[d], f = e.event, g = c.eq(d), h = C("eventRender", f, f, g);
                h === !1 ? g.remove() : (h && h !== !0 && (h = a(h).css({
                    position: "absolute",
                    left: e.left
                }), g.replaceWith(h), g = h), e.element = g);
            }
        }
        function l(a, b) {
            var c = n(a), d = s(), e = [];
            if (b) for (var f = 0; f < d.length; f++) d[f].height(c[f]);
            for (var f = 0; f < d.length; f++) e.push(d[f].position().top);
            oa(a, function(a, b) {
                b.css("top", e[a.row] + a.top);
            });
        }
        function n(a) {
            for (var b = N(), c = Q(), d = [], e = p(a), f = 0; b > f; f++) {
                for (var g = e[f], h = [], i = 0; c > i; i++) h.push(0);
                for (var j = 0; j < g.length; j++) {
                    var k = g[j];
                    k.top = L(h.slice(k.leftCol, k.rightCol + 1));
                    for (var i = k.leftCol; i <= k.rightCol; i++) h[i] = k.top + k.outerHeight;
                }
                d.push(L(h));
            }
            return d;
        }
        function p(a) {
            var b, c, d, e = N(), f = [];
            for (b = 0; b < a.length; b++) c = a[b], d = c.row, c.element && (f[d] ? f[d].push(c) : f[d] = [ c ]);
            for (d = 0; e > d; d++) f[d] = q(f[d] || []);
            return f;
        }
        function q(a) {
            for (var b = [], c = r(a), d = 0; d < c.length; d++) b.push.apply(b, c[d]);
            return b;
        }
        function r(a) {
            a.sort(pa);
            for (var b = [], c = 0; c < a.length; c++) {
                for (var d = a[c], e = 0; e < b.length && na(d, b[e]); e++) ;
                b[e] ? b[e].push(d) : b[e] = [ d ];
            }
            return b;
        }
        function s() {
            var a, b = N(), c = [];
            for (a = 0; b > a; a++) c[a] = S(a).find("div.fc-day-content > div");
            return c;
        }
        function t(a, b) {
            var c = X();
            oa(a, function(a, c, d) {
                var e = a.event;
                e._id === b ? u(e, c, a) : c[0]._fci = d;
            }), y(c, a, u);
        }
        function u(a, b, c) {
            D(a) && z.draggableDayEvent(a, b, c), c.isEnd && E(a) && z.resizableDayEvent(a, b, c), 
            H(a, b);
        }
        function v(a, b) {
            var c, d = _();
            b.draggable({
                delay: 50,
                opacity: A("dragOpacity"),
                revertDuration: A("dragRevertDuration"),
                start: function(e, f) {
                    C("eventDragStart", b, a, e, f), J(a, b), d.start(function(d, e, f, g) {
                        if (b.draggable("option", "revert", !d || !f && !g), Z(), d) {
                            var h = ba(e), j = ba(d);
                            c = o(j, h), Y(i(m(a.start), c), i(w(a), c));
                        } else c = 0;
                    }, e, "drag");
                },
                stop: function(e, f) {
                    d.stop(), Z(), C("eventDragStop", b, a, e, f), c ? K(this, a, c, 0, a.allDay, e, f) : (b.css("filter", ""), 
                    I(a, b));
                }
            });
        }
        function x(b, d, e) {
            var f = A("isRTL"), g = f ? "w" : "e", h = d.find(".ui-resizable-" + g), j = !1;
            P(d), d.mousedown(function(a) {
                a.preventDefault();
            }).click(function(a) {
                j && (a.preventDefault(), a.stopImmediatePropagation());
            }), h.mousedown(function(f) {
                function h(c) {
                    C("eventResizeStop", this, b, c), a("body").css("cursor", ""), m.stop(), Z(), k && M(this, b, k, 0, c), 
                    setTimeout(function() {
                        j = !1;
                    }, 0);
                }
                if (1 == f.which) {
                    j = !0;
                    var k, l, m = _(), n = (N(), Q(), d.css("top")), o = a.extend({}, b), p = fa(ea(b.start));
                    $(), a("body").css("cursor", g + "-resize").one("mouseup", h), C("eventResizeStart", this, b, f), 
                    m.start(function(d, f) {
                        if (d) {
                            var h = ca(f), j = ca(d);
                            if (j = Math.max(j, p), k = da(j) - da(h)) {
                                o.end = i(F(b), k, !0);
                                var m = l;
                                l = c(o, e.row, n), l = a(l), l.find("*").css("cursor", g + "-resize"), m && m.remove(), 
                                J(b);
                            } else l && (I(b), l.remove(), l = null);
                            Z(), Y(b.start, i(w(b), k));
                        }
                    }, f);
                }
            });
        }
        var z = this;
        z.renderDayEvents = b, z.draggableDayEvent = v, z.resizableDayEvent = x;
        var A = z.opt, C = z.trigger, D = z.isEventDraggable, E = z.isEventResizable, F = z.eventEnd, G = z.reportEventElement, H = z.eventElementHandlers, I = z.showEvents, J = z.hideEvents, K = z.eventDrop, M = z.eventResize, N = z.getRowCnt, Q = z.getColCnt, S = (z.getColWidth, 
        z.allDayRow), T = z.colLeft, U = z.colRight, V = z.colContentLeft, W = z.colContentRight, X = (z.dateToCell, 
        z.getDaySegmentContainer), Y = (z.calendar.formatDates, z.renderDayOverlay), Z = z.clearOverlays, $ = z.clearSelection, _ = z.getHoverListener, aa = z.rangeToSegments, ba = z.cellToDate, ca = z.cellToCellOffset, da = z.cellOffsetToDayOffset, ea = z.dateToDayOffset, fa = z.dayOffsetToCellOffset;
    }
    function na(a, b) {
        for (var c = 0; c < b.length; c++) {
            var d = b[c];
            if (d.leftCol <= a.rightCol && d.rightCol >= a.leftCol) return !0;
        }
        return !1;
    }
    function oa(a, b) {
        for (var c = 0; c < a.length; c++) {
            var d = a[c], e = d.element;
            e && b(d, e, c);
        }
    }
    function pa(a, b) {
        return b.rightCol - b.leftCol - (a.rightCol - a.leftCol) || b.event.allDay - a.event.allDay || a.event.start - b.event.start || (a.event.title || "").localeCompare(b.event.title);
    }
    function qa() {
        function b(a, b, e) {
            c(), b || (b = i(a, e)), j(a, b, e), d(a, b, e);
        }
        function c(a) {
            l && (l = !1, k(), h("unselect", null, a));
        }
        function d(a, b, c, d) {
            l = !0, h("select", null, a, b, c, d);
        }
        function e(b) {
            var e = f.cellToDate, h = f.getIsCellAllDay, i = f.getHoverListener(), l = f.reportDayClick;
            if (1 == b.which && g("selectable")) {
                c(b);
                var m;
                i.start(function(a, b) {
                    k(), a && h(a) ? (m = [ e(b), e(a) ].sort(K), j(m[0], m[1], !0)) : m = null;
                }, b), a(document).one("mouseup", function(a) {
                    i.stop(), m && (+m[0] == +m[1] && l(m[0], !0, a), d(m[0], m[1], !0, a));
                });
            }
        }
        var f = this;
        f.select = b, f.unselect = c, f.reportSelection = d, f.daySelectionMousedown = e;
        var g = f.opt, h = f.trigger, i = f.defaultSelectionEnd, j = f.renderSelection, k = f.clearSelection, l = !1;
        g("selectable") && g("unselectAuto") && a(document).mousedown(function(b) {
            var d = g("unselectCancel");
            d && a(b.target).parents(d).length || c(b);
        });
    }
    function ra() {
        function b(b, c) {
            var d = f.shift();
            return d || (d = a("<div class='fc-cell-overlay' style='position:absolute;z-index:3'/>")), 
            d[0].parentNode != c[0] && d.appendTo(c), e.push(d.css(b).show()), d;
        }
        function c() {
            for (var a; a = e.shift(); ) f.push(a.hide().unbind());
        }
        var d = this;
        d.renderOverlay = b, d.clearOverlays = c;
        var e = [], f = [];
    }
    function sa(a) {
        var b, c, d = this;
        d.build = function() {
            b = [], c = [], a(b, c);
        }, d.cell = function(a, d) {
            var e, f = b.length, g = c.length, h = -1, i = -1;
            for (e = 0; f > e; e++) if (d >= b[e][0] && d < b[e][1]) {
                h = e;
                break;
            }
            for (e = 0; g > e; e++) if (a >= c[e][0] && a < c[e][1]) {
                i = e;
                break;
            }
            return h >= 0 && i >= 0 ? {
                row: h,
                col: i
            } : null;
        }, d.rect = function(a, d, e, f, g) {
            var h = g.offset();
            return {
                top: b[a][0] - h.top,
                left: c[d][0] - h.left,
                width: c[f][1] - c[d][0],
                height: b[e][1] - b[a][0]
            };
        };
    }
    function ta(b) {
        function c(a) {
            ua(a);
            var c = b.cell(a.pageX, a.pageY);
            (!c != !g || c && (c.row != g.row || c.col != g.col)) && (c ? (f || (f = c), e(c, f, c.row - f.row, c.col - f.col)) : e(c, f), 
            g = c);
        }
        var d, e, f, g, h = this;
        h.start = function(h, i, j) {
            e = h, f = g = null, b.build(), c(i), d = j || "mousemove", a(document).bind(d, c);
        }, h.stop = function() {
            return a(document).unbind(d, c), g;
        };
    }
    function ua(a) {
        a.pageX === b && (a.pageX = a.originalEvent.pageX, a.pageY = a.originalEvent.pageY);
    }
    function va(a) {
        function c(b) {
            return e[b] = e[b] || a(b);
        }
        var d = this, e = {}, f = {}, g = {};
        d.left = function(a) {
            return f[a] = f[a] === b ? c(a).position().left : f[a];
        }, d.right = function(a) {
            return g[a] = g[a] === b ? d.left(a) + c(a).width() : g[a];
        }, d.clear = function() {
            e = {}, f = {}, g = {};
        };
    }
    var wa = {
        defaultView: "month",
        aspectRatio: 1.35,
        header: {
            left: "title",
            center: "",
            right: "today prev,next"
        },
        weekends: !0,
        weekNumbers: !1,
        weekNumberCalculation: "iso",
        weekNumberTitle: "W",
        allDayDefault: !0,
        ignoreTimezone: !0,
        lazyFetching: !0,
        startParam: "start",
        endParam: "end",
        titleFormat: {
            month: "MMMM yyyy",
            week: "MMM d[ yyyy]{ '&#8212;'[ MMM] d yyyy}",
            day: "dddd, MMM d, yyyy"
        },
        columnFormat: {
            month: "ddd",
            week: "ddd M/d",
            day: "dddd M/d"
        },
        timeFormat: {
            "": "h(:mm)t"
        },
        isRTL: !1,
        firstDay: 0,
        monthNames: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
        monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
        dayNames: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
        dayNamesShort: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
        buttonText: {
            prev: "<span class='fc-text-arrow'>&lsaquo;</span>",
            next: "<span class='fc-text-arrow'>&rsaquo;</span>",
            prevYear: "<span class='fc-text-arrow'>&laquo;</span>",
            nextYear: "<span class='fc-text-arrow'>&raquo;</span>",
            today: "today",
            month: "month",
            week: "week",
            day: "day"
        },
        theme: !1,
        buttonIcons: {
            prev: "circle-triangle-w",
            next: "circle-triangle-e"
        },
        unselectAuto: !0,
        dropAccept: "*",
        handleWindowResize: !0
    }, xa = {
        header: {
            left: "next,prev today",
            center: "",
            right: "title"
        },
        buttonText: {
            prev: "<span class='fc-text-arrow'>&rsaquo;</span>",
            next: "<span class='fc-text-arrow'>&lsaquo;</span>",
            prevYear: "<span class='fc-text-arrow'>&raquo;</span>",
            nextYear: "<span class='fc-text-arrow'>&laquo;</span>"
        },
        buttonIcons: {
            prev: "circle-triangle-e",
            next: "circle-triangle-w"
        }
    }, ya = a.fullCalendar = {
        version: "1.6.4"
    }, za = ya.views = {};
    a.fn.fullCalendar = function(c) {
        if ("string" == typeof c) {
            var e, f = Array.prototype.slice.call(arguments, 1);
            return this.each(function() {
                var d = a.data(this, "fullCalendar");
                if (d && a.isFunction(d[c])) {
                    var g = d[c].apply(d, f);
                    e === b && (e = g), "destroy" == c && a.removeData(this, "fullCalendar");
                }
            }), e !== b ? e : this;
        }
        c = c || {};
        var g = c.eventSources || [];
        return delete c.eventSources, c.events && (g.push(c.events), delete c.events), c = a.extend(!0, {}, wa, c.isRTL || c.isRTL === b && wa.isRTL ? xa : {}, c), 
        this.each(function(b, e) {
            var f = a(e), h = new d(f, c, g);
            f.data("fullCalendar", h), h.render();
        }), this;
    }, ya.sourceNormalizers = [], ya.sourceFetchers = [];
    var Aa = {
        dataType: "json",
        cache: !1
    }, Ba = 1;
    ya.addDays = i, ya.cloneDate = m, ya.parseDate = q, ya.parseISO8601 = r, ya.parseTime = s, 
    ya.formatDate = t, ya.formatDates = u;
    var Ca = [ "sun", "mon", "tue", "wed", "thu", "fri", "sat" ], Da = 864e5, Ea = 36e5, Fa = 6e4, Ga = {
        s: function(a) {
            return a.getSeconds();
        },
        ss: function(a) {
            return M(a.getSeconds());
        },
        m: function(a) {
            return a.getMinutes();
        },
        mm: function(a) {
            return M(a.getMinutes());
        },
        h: function(a) {
            return a.getHours() % 12 || 12;
        },
        hh: function(a) {
            return M(a.getHours() % 12 || 12);
        },
        H: function(a) {
            return a.getHours();
        },
        HH: function(a) {
            return M(a.getHours());
        },
        d: function(a) {
            return a.getDate();
        },
        dd: function(a) {
            return M(a.getDate());
        },
        ddd: function(a, b) {
            return b.dayNamesShort[a.getDay()];
        },
        dddd: function(a, b) {
            return b.dayNames[a.getDay()];
        },
        M: function(a) {
            return a.getMonth() + 1;
        },
        MM: function(a) {
            return M(a.getMonth() + 1);
        },
        MMM: function(a, b) {
            return b.monthNamesShort[a.getMonth()];
        },
        MMMM: function(a, b) {
            return b.monthNames[a.getMonth()];
        },
        yy: function(a) {
            return (a.getFullYear() + "").substring(2);
        },
        yyyy: function(a) {
            return a.getFullYear();
        },
        t: function(a) {
            return a.getHours() < 12 ? "a" : "p";
        },
        tt: function(a) {
            return a.getHours() < 12 ? "am" : "pm";
        },
        T: function(a) {
            return a.getHours() < 12 ? "A" : "P";
        },
        TT: function(a) {
            return a.getHours() < 12 ? "AM" : "PM";
        },
        u: function(a) {
            return t(a, "yyyy-MM-dd'T'HH:mm:ss'Z'");
        },
        S: function(a) {
            var b = a.getDate();
            return b > 10 && 20 > b ? "th" : [ "st", "nd", "rd" ][b % 10 - 1] || "th";
        },
        w: function(a, b) {
            return b.weekNumberCalculation(a);
        },
        W: function(a) {
            return v(a);
        }
    };
    ya.dateFormatters = Ga, ya.applyAll = S, za.month = U, za.basicWeek = V, za.basicDay = W, 
    c({
        weekMode: "fixed"
    }), za.agendaWeek = Z, za.agendaDay = $, c({
        allDaySlot: !0,
        allDayText: "all-day",
        firstHour: 6,
        slotMinutes: 30,
        defaultEventMinutes: 120,
        axisFormat: "h(:mm)tt",
        timeFormat: {
            agenda: "h:mm{ - h:mm}"
        },
        dragOpacity: {
            agenda: .5
        },
        minTime: 0,
        maxTime: 24,
        slotEventOverlap: !0
    });
}(jQuery), function() {
    function a() {}
    function b(a, b) {
        for (var c = a.length; c--; ) if (a[c].listener === b) return c;
        return -1;
    }
    function c(a) {
        return function() {
            return this[a].apply(this, arguments);
        };
    }
    var d = a.prototype, e = this, f = e.EventEmitter;
    d.getListeners = function(a) {
        var b, c, d = this._getEvents();
        if ("object" == typeof a) {
            b = {};
            for (c in d) d.hasOwnProperty(c) && a.test(c) && (b[c] = d[c]);
        } else b = d[a] || (d[a] = []);
        return b;
    }, d.flattenListeners = function(a) {
        var b, c = [];
        for (b = 0; b < a.length; b += 1) c.push(a[b].listener);
        return c;
    }, d.getListenersAsObject = function(a) {
        var b, c = this.getListeners(a);
        return c instanceof Array && (b = {}, b[a] = c), b || c;
    }, d.addListener = function(a, c) {
        var d, e = this.getListenersAsObject(a), f = "object" == typeof c;
        for (d in e) e.hasOwnProperty(d) && -1 === b(e[d], c) && e[d].push(f ? c : {
            listener: c,
            once: !1
        });
        return this;
    }, d.on = c("addListener"), d.addOnceListener = function(a, b) {
        return this.addListener(a, {
            listener: b,
            once: !0
        });
    }, d.once = c("addOnceListener"), d.defineEvent = function(a) {
        return this.getListeners(a), this;
    }, d.defineEvents = function(a) {
        for (var b = 0; b < a.length; b += 1) this.defineEvent(a[b]);
        return this;
    }, d.removeListener = function(a, c) {
        var d, e, f = this.getListenersAsObject(a);
        for (e in f) f.hasOwnProperty(e) && (d = b(f[e], c), -1 !== d && f[e].splice(d, 1));
        return this;
    }, d.off = c("removeListener"), d.addListeners = function(a, b) {
        return this.manipulateListeners(!1, a, b);
    }, d.removeListeners = function(a, b) {
        return this.manipulateListeners(!0, a, b);
    }, d.manipulateListeners = function(a, b, c) {
        var d, e, f = a ? this.removeListener : this.addListener, g = a ? this.removeListeners : this.addListeners;
        if ("object" != typeof b || b instanceof RegExp) for (d = c.length; d--; ) f.call(this, b, c[d]); else for (d in b) b.hasOwnProperty(d) && (e = b[d]) && ("function" == typeof e ? f.call(this, d, e) : g.call(this, d, e));
        return this;
    }, d.removeEvent = function(a) {
        var b, c = typeof a, d = this._getEvents();
        if ("string" === c) delete d[a]; else if ("object" === c) for (b in d) d.hasOwnProperty(b) && a.test(b) && delete d[b]; else delete this._events;
        return this;
    }, d.removeAllListeners = c("removeEvent"), d.emitEvent = function(a, b) {
        var c, d, e, f, g = this.getListenersAsObject(a);
        for (e in g) if (g.hasOwnProperty(e)) for (d = g[e].length; d--; ) c = g[e][d], 
        c.once === !0 && this.removeListener(a, c.listener), f = c.listener.apply(this, b || []), 
        f === this._getOnceReturnValue() && this.removeListener(a, c.listener);
        return this;
    }, d.trigger = c("emitEvent"), d.emit = function(a) {
        var b = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(a, b);
    }, d.setOnceReturnValue = function(a) {
        return this._onceReturnValue = a, this;
    }, d._getOnceReturnValue = function() {
        return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0;
    }, d._getEvents = function() {
        return this._events || (this._events = {});
    }, a.noConflict = function() {
        return e.EventEmitter = f, a;
    }, "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function() {
        return a;
    }) : "object" == typeof module && module.exports ? module.exports = a : this.EventEmitter = a;
}.call(this), function(a) {
    function b(b) {
        var c = a.event;
        return c.target = c.target || c.srcElement || b, c;
    }
    var c = document.documentElement, d = function() {};
    c.addEventListener ? d = function(a, b, c) {
        a.addEventListener(b, c, !1);
    } : c.attachEvent && (d = function(a, c, d) {
        a[c + d] = d.handleEvent ? function() {
            var c = b(a);
            d.handleEvent.call(d, c);
        } : function() {
            var c = b(a);
            d.call(a, c);
        }, a.attachEvent("on" + c, a[c + d]);
    });
    var e = function() {};
    c.removeEventListener ? e = function(a, b, c) {
        a.removeEventListener(b, c, !1);
    } : c.detachEvent && (e = function(a, b, c) {
        a.detachEvent("on" + b, a[b + c]);
        try {
            delete a[b + c];
        } catch (d) {
            a[b + c] = void 0;
        }
    });
    var f = {
        bind: d,
        unbind: e
    };
    "function" == typeof define && define.amd ? define("eventie/eventie", f) : a.eventie = f;
}(this), function(a) {
    "use strict";
    function b(a, b) {
        for (var c in b) a[c] = b[c];
        return a;
    }
    function c(a) {
        return "[object Array]" === i.call(a);
    }
    function d(a) {
        var b = [];
        if (c(a)) b = a; else if ("number" == typeof a.length) for (var d = 0, e = a.length; e > d; d++) b.push(a[d]); else b.push(a);
        return b;
    }
    function e(a, c) {
        function e(a, c, g) {
            if (!(this instanceof e)) return new e(a, c);
            "string" == typeof a && (a = document.querySelectorAll(a)), this.elements = d(a), 
            this.options = b({}, this.options), "function" == typeof c ? g = c : b(this.options, c), 
            g && this.on("always", g), this.getImages(), f && (this.jqDeferred = new f.Deferred());
            var h = this;
            setTimeout(function() {
                h.check();
            });
        }
        function i(a) {
            this.img = a;
        }
        e.prototype = new a(), e.prototype.options = {}, e.prototype.getImages = function() {
            this.images = [];
            for (var a = 0, b = this.elements.length; b > a; a++) {
                var c = this.elements[a];
                "IMG" === c.nodeName && this.addImage(c);
                for (var d = c.querySelectorAll("img"), e = 0, f = d.length; f > e; e++) {
                    var g = d[e];
                    this.addImage(g);
                }
            }
        }, e.prototype.addImage = function(a) {
            var b = new i(a);
            this.images.push(b);
        }, e.prototype.check = function() {
            function a(a, e) {
                return b.options.debug && h && g.log("confirm", a, e), b.progress(a), c++, c === d && b.complete(), 
                !0;
            }
            var b = this, c = 0, d = this.images.length;
            if (this.hasAnyBroken = !1, !d) return void this.complete();
            for (var e = 0; d > e; e++) {
                var f = this.images[e];
                f.on("confirm", a), f.check();
            }
        }, e.prototype.progress = function(a) {
            this.hasAnyBroken = this.hasAnyBroken || !a.isLoaded;
            var b = this;
            setTimeout(function() {
                b.emit("progress", b, a), b.jqDeferred && b.jqDeferred.notify(b, a);
            });
        }, e.prototype.complete = function() {
            var a = this.hasAnyBroken ? "fail" : "done";
            this.isComplete = !0;
            var b = this;
            setTimeout(function() {
                if (b.emit(a, b), b.emit("always", b), b.jqDeferred) {
                    var c = b.hasAnyBroken ? "reject" : "resolve";
                    b.jqDeferred[c](b);
                }
            });
        }, f && (f.fn.imagesLoaded = function(a, b) {
            var c = new e(this, a, b);
            return c.jqDeferred.promise(f(this));
        });
        var j = {};
        return i.prototype = new a(), i.prototype.check = function() {
            var a = j[this.img.src];
            if (a) return void this.useCached(a);
            if (j[this.img.src] = this, this.img.complete && void 0 !== this.img.naturalWidth) return void this.confirm(0 !== this.img.naturalWidth, "naturalWidth");
            var b = this.proxyImage = new Image();
            c.bind(b, "load", this), c.bind(b, "error", this), b.src = this.img.src;
        }, i.prototype.useCached = function(a) {
            if (a.isConfirmed) {
                var b = this, c = function() {
                    0 !== b.img.naturalWidth ? b.confirm(a.isLoaded, "cached was confirmed") : setTimeout(c, 2);
                };
                c();
            } else {
                var b = this;
                a.on("confirm", function(a) {
                    return b.confirm(a.isLoaded, "cache emitted confirmed"), !0;
                });
            }
        }, i.prototype.confirm = function(a, b) {
            this.isConfirmed = !0, this.isLoaded = a, this.emit("confirm", this, b);
        }, i.prototype.handleEvent = function(a) {
            var b = "on" + a.type;
            this[b] && this[b](a);
        }, i.prototype.onload = function() {
            this.confirm(!0, "onload"), this.unbindProxyEvents();
        }, i.prototype.onerror = function() {
            this.confirm(!1, "onerror"), this.unbindProxyEvents();
        }, i.prototype.unbindProxyEvents = function() {
            c.unbind(this.proxyImage, "load", this), c.unbind(this.proxyImage, "error", this);
        }, e;
    }
    var f = a.jQuery, g = a.console, h = "undefined" != typeof g, i = Object.prototype.toString;
    "function" == typeof define && define.amd ? define([ "eventEmitter/EventEmitter", "eventie/eventie" ], e) : a.imagesLoaded = e(a.EventEmitter, a.eventie);
}(window), function(a, b) {
    "function" == typeof define && define.amd ? define([], b) : "object" == typeof exports ? module.exports = b() : b();
}(this, function() {
    function a(a) {
        if (null === p) {
            for (var b = a.length, c = 0, d = document.getElementById(f), e = "<ul>"; b > c; ) e += "<li>" + a[c] + "</li>", 
            c++;
            e += "</ul>", d.innerHTML = e;
        } else p(a);
    }
    function b(a) {
        return a.replace(/<b[^>]*>(.*?)<\/b>/gi, function(a, b) {
            return b;
        }).replace(/class="(?!(tco-hidden|tco-display|tco-ellipsis))+.*?"|data-query-source=".*?"|dir=".*?"|rel=".*?"/gi, "");
    }
    function c(a) {
        for (var b = a.getElementsByTagName("a"), c = b.length - 1; c >= 0; c--) b[c].setAttribute("target", "_blank");
    }
    function d(a, b) {
        for (var c = [], d = new RegExp("(^| )" + b + "( |$)"), e = a.getElementsByTagName("*"), f = 0, g = e.length; g > f; f++) d.test(e[f].className) && c.push(e[f]);
        return c;
    }
    function e(a) {
        if (void 0 !== a && a.innerHTML.indexOf("data-srcset") >= 0) {
            var b = a.innerHTML.match(/data-srcset="([A-z0-9%_\.-]+)/i)[0];
            return decodeURIComponent(b).split('"')[1];
        }
    }
    var f = "", g = 20, h = !0, i = [], j = !1, k = !0, l = !0, m = null, n = !0, o = !0, p = null, q = !0, r = !1, s = !0, t = "en", u = !0, v = !1, w = null, x = {
        fetch: function(a) {
            if (void 0 === a.maxTweets && (a.maxTweets = 20), void 0 === a.enableLinks && (a.enableLinks = !0), 
            void 0 === a.showUser && (a.showUser = !0), void 0 === a.showTime && (a.showTime = !0), 
            void 0 === a.dateFunction && (a.dateFunction = "default"), void 0 === a.showRetweet && (a.showRetweet = !0), 
            void 0 === a.customCallback && (a.customCallback = null), void 0 === a.showInteraction && (a.showInteraction = !0), 
            void 0 === a.showImages && (a.showImages = !1), void 0 === a.linksInNewWindow && (a.linksInNewWindow = !0), 
            void 0 === a.showPermalinks && (a.showPermalinks = !0), void 0 === a.dataOnly && (a.dataOnly = !1), 
            j) i.push(a); else {
                j = !0, f = a.domId, g = a.maxTweets, h = a.enableLinks, l = a.showUser, k = a.showTime, 
                o = a.showRetweet, m = a.dateFunction, p = a.customCallback, q = a.showInteraction, 
                r = a.showImages, s = a.linksInNewWindow, u = a.showPermalinks, v = a.dataOnly;
                var b = document.getElementsByTagName("head")[0];
                null !== w && b.removeChild(w), w = document.createElement("script"), w.type = "text/javascript", 
                void 0 !== a.list ? w.src = "https://syndication.twitter.com/timeline/list?callback=__twttrf.callback&dnt=false&list_slug=" + a.list.listSlug + "&screen_name=" + a.list.screenName + "&suppress_response_codes=true&lang=" + (a.lang || t) + "&rnd=" + Math.random() : void 0 !== a.profile ? w.src = "https://syndication.twitter.com/timeline/profile?callback=__twttrf.callback&dnt=false&screen_name=" + a.profile.screenName + "&suppress_response_codes=true&lang=" + (a.lang || t) + "&rnd=" + Math.random() : void 0 !== a.likes ? w.src = "https://syndication.twitter.com/timeline/likes?callback=__twttrf.callback&dnt=false&screen_name=" + a.likes.screenName + "&suppress_response_codes=true&lang=" + (a.lang || t) + "&rnd=" + Math.random() : w.src = "https://cdn.syndication.twimg.com/widgets/timelines/" + a.id + "?&lang=" + (a.lang || t) + "&callback=__twttrf.callback&suppress_response_codes=true&rnd=" + Math.random(), 
                b.appendChild(w);
            }
        },
        callback: function(f) {
            function p(a) {
                var b = a.getElementsByTagName("img")[0];
                return b.src = b.getAttribute("data-src-2x"), a;
            }
            if (void 0 === f || void 0 === f.body) return j = !1, void (i.length > 0 && (x.fetch(i[0]), 
            i.splice(0, 1)));
            f.body = f.body.replace(/(<img[^c]*class="Emoji[^>]*>)|(<img[^c]*class="u-block[^>]*>)/g, ""), 
            r || (f.body = f.body.replace(/(<img[^c]*class="NaturalImage-image[^>]*>|(<img[^c]*class="CroppedImage-image[^>]*>))/g, "")), 
            l || (f.body = f.body.replace(/(<img[^c]*class="Avatar"[^>]*>)/g, ""));
            var t = document.createElement("div");
            t.innerHTML = f.body, "undefined" == typeof t.getElementsByClassName && (n = !1);
            var w = [], y = [], z = [], A = [], B = [], C = [], D = [], E = 0;
            if (n) for (var F = t.getElementsByClassName("timeline-Tweet"); E < F.length; ) F[E].getElementsByClassName("timeline-Tweet-retweetCredit").length > 0 ? B.push(!0) : B.push(!1), 
            (!B[E] || B[E] && o) && (w.push(F[E].getElementsByClassName("timeline-Tweet-text")[0]), 
            C.push(F[E].getAttribute("data-tweet-id")), l && y.push(p(F[E].getElementsByClassName("timeline-Tweet-author")[0])), 
            z.push(F[E].getElementsByClassName("dt-updated")[0]), D.push(F[E].getElementsByClassName("timeline-Tweet-timestamp")[0]), 
            void 0 !== F[E].getElementsByClassName("timeline-Tweet-media")[0] ? A.push(F[E].getElementsByClassName("timeline-Tweet-media")[0]) : A.push(void 0)), 
            E++; else for (var F = d(t, "timeline-Tweet"); E < F.length; ) d(F[E], "timeline-Tweet-retweetCredit").length > 0 ? B.push(!0) : B.push(!1), 
            (!B[E] || B[E] && o) && (w.push(d(F[E], "timeline-Tweet-text")[0]), C.push(F[E].getAttribute("data-tweet-id")), 
            l && y.push(p(d(F[E], "timeline-Tweet-author")[0])), z.push(d(F[E], "dt-updated")[0]), 
            D.push(d(F[E], "timeline-Tweet-timestamp")[0]), void 0 !== d(F[E], "timeline-Tweet-media")[0] ? A.push(d(F[E], "timeline-Tweet-media")[0]) : A.push(void 0)), 
            E++;
            w.length > g && (w.splice(g, w.length - g), y.splice(g, y.length - g), z.splice(g, z.length - g), 
            B.splice(g, B.length - g), A.splice(g, A.length - g), D.splice(g, D.length - g));
            var G = [], E = w.length, H = 0;
            if (v) for (;E > H; ) G.push({
                tweet: w[H].innerHTML,
                author: y[H] ? y[H].innerHTML : "Unknown Author",
                time: z[H].textContent,
                timestamp: z[H].getAttribute("datetime").replace("+0000", "Z").replace(/([\+\-])(\d\d)(\d\d)/, "$1$2:$3"),
                image: e(A[H]),
                rt: B[H],
                tid: C[H],
                permalinkURL: void 0 === D[H] ? "" : D[H].href
            }), H++; else for (;E > H; ) {
                if ("string" != typeof m) {
                    var I = z[H].getAttribute("datetime"), J = new Date(z[H].getAttribute("datetime").replace(/-/g, "/").replace("T", " ").split("+")[0]), K = m(J, I);
                    if (z[H].setAttribute("aria-label", K), w[H].textContent) if (n) z[H].textContent = K; else {
                        var L = document.createElement("p"), M = document.createTextNode(K);
                        L.appendChild(M), L.setAttribute("aria-label", K), z[H] = L;
                    } else z[H].textContent = K;
                }
                var N = "";
                h ? (s && (c(w[H]), l && c(y[H])), l && (N += '<div class="user">' + b(y[H].innerHTML) + "</div>"), 
                N += '<p class="tweet">' + b(w[H].innerHTML) + "</p>", k && (N += u ? '<p class="timePosted"><a href="' + D[H] + '">' + z[H].getAttribute("aria-label") + "</a></p>" : '<p class="timePosted">' + z[H].getAttribute("aria-label") + "</p>")) : w[H].textContent ? (l && (N += '<p class="user">' + y[H].textContent + "</p>"), 
                N += '<p class="tweet">' + w[H].textContent + "</p>", k && (N += '<p class="timePosted">' + z[H].textContent + "</p>")) : (l && (N += '<p class="user">' + y[H].textContent + "</p>"), 
                N += '<p class="tweet">' + w[H].textContent + "</p>", k && (N += '<p class="timePosted">' + z[H].textContent + "</p>")), 
                q && (N += '<p class="interact"><a href="https://twitter.com/intent/tweet?in_reply_to=' + C[H] + '" class="twitter_reply_icon"' + (s ? ' target="_blank">' : ">") + 'Reply</a><a href="https://twitter.com/intent/retweet?tweet_id=' + C[H] + '" class="twitter_retweet_icon"' + (s ? ' target="_blank">' : ">") + 'Retweet</a><a href="https://twitter.com/intent/favorite?tweet_id=' + C[H] + '" class="twitter_fav_icon"' + (s ? ' target="_blank">' : ">") + "Favorite</a></p>"), 
                r && void 0 !== A[H] && void 0 !== e(A[H]) && (N += '<div class="media"><img src="' + e(A[H]) + '" alt="Image from tweet" /></div>'), 
                r ? G.push(N) : !r && w[H].textContent.length && G.push(N), H++;
            }
            a(G), j = !1, i.length > 0 && (x.fetch(i[0]), i.splice(0, 1));
        }
    };
    return window.__twttrf = x, window.twitterFetcher = x, x;
}), $("#twitter-feed-special").length) {
    var configProfile = {
        profile: {
            screenName: "GWR"
        },
        domId: "twitter-feed-special",
        maxTweets: 1,
        enableLinks: !0,
        showUser: !1,
        showTime: !0,
        showImages: !1,
        lang: "en"
    };
    twitterFetcher.fetch(configProfile);
}

if ($("#twitter-feed-special-jp").length) {
    var configProfile = {
        profile: {
            screenName: "gwrjapan"
        },
        domId: "twitter-feed-special-jp",
        maxTweets: 1,
        enableLinks: !0,
        showUser: !1,
        showTime: !0,
        showImages: !1,
        lang: "jp"
    };
    twitterFetcher.fetch(configProfile);
}

if ($("#twitter-feed-special-es").length) {
    var configProfile = {
        profile: {
            screenName: "gwr_es"
        },
        domId: "twitter-feed-special-es",
        maxTweets: 1,
        enableLinks: !0,
        showUser: !1,
        showTime: !0,
        showImages: !1,
        lang: "es"
    };
    twitterFetcher.fetch(configProfile);
}

(function() {
    var a;
    a = function() {
        function a(a, b) {
            var c, d;
            if (this.options = {
                target: "instafeed",
                get: "popular",
                resolution: "thumbnail",
                sortBy: "none",
                links: !0,
                mock: !1,
                useHttps: !1
            }, "object" == typeof a) for (c in a) d = a[c], this.options[c] = d;
            this.context = null != b ? b : this, this.unique = this._genKey();
        }
        return a.prototype.hasNext = function() {
            return "string" == typeof this.context.nextUrl && this.context.nextUrl.length > 0;
        }, a.prototype.next = function() {
            return this.hasNext() ? this.run(this.context.nextUrl) : !1;
        }, a.prototype.run = function(b) {
            var c, d, e;
            if ("string" != typeof this.options.clientId && "string" != typeof this.options.accessToken) throw new Error("Missing clientId or accessToken.");
            if ("string" != typeof this.options.accessToken && "string" != typeof this.options.clientId) throw new Error("Missing clientId or accessToken.");
            return null != this.options.before && "function" == typeof this.options.before && this.options.before.call(this), 
            "undefined" != typeof document && null !== document && (e = document.createElement("script"), 
            e.id = "instafeed-fetcher", e.src = b || this._buildUrl(), c = document.getElementsByTagName("head"), 
            c[0].appendChild(e), d = "instafeedCache" + this.unique, window[d] = new a(this.options, this), 
            window[d].unique = this.unique), !0;
        }, a.prototype.parse = function(a) {
            var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H;
            if ("object" != typeof a) {
                if (null != this.options.error && "function" == typeof this.options.error) return this.options.error.call(this, "Invalid JSON data"), 
                !1;
                throw new Error("Invalid JSON response");
            }
            if (200 !== a.meta.code) {
                if (null != this.options.error && "function" == typeof this.options.error) return this.options.error.call(this, a.meta.error_message), 
                !1;
                throw new Error("Error from Instagram: " + a.meta.error_message);
            }
            if (0 === a.data.length) {
                if (null != this.options.error && "function" == typeof this.options.error) return this.options.error.call(this, "No images were returned from Instagram"), 
                !1;
                throw new Error("No images were returned from Instagram");
            }
            if (null != this.options.success && "function" == typeof this.options.success && this.options.success.call(this, a), 
            this.context.nextUrl = "", null != a.pagination && (this.context.nextUrl = a.pagination.next_url), 
            "none" !== this.options.sortBy) switch (F = "random" === this.options.sortBy ? [ "", "random" ] : this.options.sortBy.split("-"), 
            E = "least" === F[0] ? !0 : !1, F[1]) {
              case "random":
                a.data.sort(function() {
                    return .5 - Math.random();
                });
                break;

              case "recent":
                a.data = this._sortBy(a.data, "created_time", E);
                break;

              case "liked":
                a.data = this._sortBy(a.data, "likes.count", E);
                break;

              case "commented":
                a.data = this._sortBy(a.data, "comments.count", E);
                break;

              default:
                throw new Error("Invalid option for sortBy: '" + this.options.sortBy + "'.");
            }
            if ("undefined" != typeof document && null !== document && this.options.mock === !1) {
                if (q = a.data, D = parseInt(this.options.limit, 10), null != this.options.limit && q.length > D && (q = q.slice(0, D)), 
                h = document.createDocumentFragment(), null != this.options.filter && "function" == typeof this.options.filter && (q = this._filter(q, this.options.filter)), 
                null != this.options.template && "string" == typeof this.options.template) {
                    for (j = "", o = "", u = "", H = document.createElement("div"), l = 0, z = q.length; z > l; l++) {
                        if (m = q[l], n = m.images[this.options.resolution], "object" != typeof n) throw g = "No image found for resolution: " + this.options.resolution + ".", 
                        new Error(g);
                        v = n.width, s = n.height, t = "square", v > s && (t = "landscape"), s > v && (t = "portrait"), 
                        p = n.url, k = window.location.protocol.indexOf("http") >= 0, k && !this.options.useHttp && (p = p.replace(/https?:\/\//, "//")), 
                        o = this._makeTemplate(this.options.template, {
                            model: m,
                            id: m.id,
                            link: m.link,
                            type: m.type,
                            image: p,
                            width: v,
                            height: s,
                            orientation: t,
                            caption: this._getObjectProperty(m, "caption.text"),
                            likes: m.likes.count,
                            comments: m.comments.count,
                            location: this._getObjectProperty(m, "location.name")
                        }), j += o;
                    }
                    for (H.innerHTML = j, e = [], d = 0, c = H.childNodes.length; c > d; ) e.push(H.childNodes[d]), 
                    d += 1;
                    for (x = 0, A = e.length; A > x; x++) C = e[x], h.appendChild(C);
                } else for (y = 0, B = q.length; B > y; y++) {
                    if (m = q[y], r = document.createElement("img"), n = m.images[this.options.resolution], 
                    "object" != typeof n) throw g = "No image found for resolution: " + this.options.resolution + ".", 
                    new Error(g);
                    p = n.url, k = window.location.protocol.indexOf("http") >= 0, k && !this.options.useHttp && (p = p.replace(/https?:\/\//, "//")), 
                    r.src = p, this.options.links === !0 ? (b = document.createElement("a"), b.href = m.link, 
                    b.appendChild(r), h.appendChild(b)) : h.appendChild(r);
                }
                if (G = this.options.target, "string" == typeof G && (G = document.getElementById(G)), 
                null == G) throw g = 'No element with id="' + this.options.target + '" on page.', 
                new Error(g);
                G.appendChild(h), i = document.getElementsByTagName("head")[0], i.removeChild(document.getElementById("instafeed-fetcher")), 
                w = "instafeedCache" + this.unique, window[w] = void 0;
                try {
                    delete window[w];
                } catch (I) {
                    f = I;
                }
            }
            return null != this.options.after && "function" == typeof this.options.after && this.options.after.call(this), 
            !0;
        }, a.prototype._buildUrl = function() {
            var a, b, c;
            switch (a = "https://api.instagram.com/v1", this.options.get) {
              case "popular":
                b = "media/popular";
                break;

              case "tagged":
                if (!this.options.tagName) throw new Error("No tag name specified. Use the 'tagName' option.");
                b = "tags/" + this.options.tagName + "/media/recent";
                break;

              case "location":
                if (!this.options.locationId) throw new Error("No location specified. Use the 'locationId' option.");
                b = "locations/" + this.options.locationId + "/media/recent";
                break;

              case "user":
                if (!this.options.userId) throw new Error("No user specified. Use the 'userId' option.");
                b = "users/" + this.options.userId + "/media/recent";
                break;

              default:
                throw new Error("Invalid option for get: '" + this.options.get + "'.");
            }
            return c = a + "/" + b, c += null != this.options.accessToken ? "?access_token=" + this.options.accessToken : "?client_id=" + this.options.clientId, 
            null != this.options.limit && (c += "&count=" + this.options.limit), c += "&callback=instafeedCache" + this.unique + ".parse";
        }, a.prototype._genKey = function() {
            var a;
            return a = function() {
                return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
            }, "" + a() + a() + a() + a();
        }, a.prototype._makeTemplate = function(a, b) {
            var c, d, e, f, g;
            for (d = /(?:\{{2})([\w\[\]\.]+)(?:\}{2})/, c = a; d.test(c); ) f = c.match(d)[1], 
            g = null != (e = this._getObjectProperty(b, f)) ? e : "", c = c.replace(d, function() {
                return "" + g;
            });
            return c;
        }, a.prototype._getObjectProperty = function(a, b) {
            var c, d;
            for (b = b.replace(/\[(\w+)\]/g, ".$1"), d = b.split("."); d.length; ) {
                if (c = d.shift(), !(null != a && c in a)) return null;
                a = a[c];
            }
            return a;
        }, a.prototype._sortBy = function(a, b, c) {
            var d;
            return d = function(a, d) {
                var e, f;
                return e = this._getObjectProperty(a, b), f = this._getObjectProperty(d, b), c ? e > f ? 1 : -1 : f > e ? 1 : -1;
            }, a.sort(d.bind(this)), a;
        }, a.prototype._filter = function(a, b) {
            var c, d, e, f, g;
            for (c = [], d = function(a) {
                return b(a) ? c.push(a) : void 0;
            }, e = 0, g = a.length; g > e; e++) f = a[e], d(f);
            return c;
        }, a;
    }(), function(a, b) {
        return "function" == typeof define && define.amd ? define([], b) : "object" == typeof module && module.exports ? module.exports = b() : a.Instafeed = b();
    }(this, function() {
        return a;
    });
}).call(this);

var Instagramfeed = new Instafeed({
    get: "user",
    userId: "1129864380",
    accessToken: "1129864380.c5dcea1.e61c8aa8243e452a883a9a4b9d5922e1",
    target: "instafeed",
    resolution: "standard_resolution",
    sortBy: "most-recent",
    limit: "1"
}), InstagramfeedArabic = new Instafeed({
    get: "user",
    userId: "7995628083",
    accessToken: "7995628083.975564f.eb75120e646e49cdb6744665931df206",
    target: "instafeed-arabic",
    resolution: "standard_resolution",
    sortBy: "most-recent",
    limit: "1"
});

$("#instafeed").length && Instagramfeed.run(), $("#instafeed-arabic").length && InstagramfeedArabic.run(), 
function(a) {
    "function" == typeof define && define.amd ? define([ "jquery" ], a) : a(window.jQuery || window.$);
}(function(a) {
    var b, c = {
        className: "autosizejs",
        append: "",
        callback: !1,
        resizeDelay: 10
    }, d = '<textarea tabindex="-1" style="position:absolute; top:-9999px; left:-9999px; right:auto; bottom:auto; border:0; -moz-box-sizing:content-box; -webkit-box-sizing:content-box; box-sizing:content-box; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden; transition:none; -webkit-transition:none; -moz-transition:none;" readonly="readonly" disabled="disabled" />', e = [ "fontFamily", "fontSize", "fontWeight", "fontStyle", "letterSpacing", "textTransform", "wordSpacing", "textIndent" ], f = a(d).data("autosize", !0)[0];
    f.style.lineHeight = "99px", "99px" === a(f).css("lineHeight") && e.push("lineHeight"), 
    f.style.lineHeight = "", a.fn.autosize = function(d) {
        return d = a.extend({}, c, d || {}), f.parentNode !== document.body && a(document.body).append(f), 
        this.each(function() {
            function c() {
                var c, g = {};
                if (b = l, f.className = d.className, i = parseInt(m.css("maxHeight"), 10), a.each(e, function(a, b) {
                    g[b] = m.css(b);
                }), a(f).css(g), "oninput" in l) {
                    var h = l.style.width;
                    l.style.width = "0px", c = l.offsetWidth, l.style.width = h;
                }
            }
            function g() {
                var e, g, h, k;
                b !== l && c(), f.value = l.value + d.append, f.style.overflowY = l.style.overflowY, 
                g = parseInt(l.style.height, 10), "getComputedStyle" in window ? (k = window.getComputedStyle(l), 
                h = l.getBoundingClientRect().width, a.each([ "paddingLeft", "paddingRight", "borderLeftWidth", "borderRightWidth" ], function(a, b) {
                    h -= parseInt(k[b], 10);
                }), f.style.width = h + "px") : f.style.width = Math.max(m.width(), 0) + "px", f.scrollTop = 0, 
                f.scrollTop = 9e4, e = f.scrollTop, i && e > i ? (l.style.overflowY = "scroll", 
                e = i) : (l.style.overflowY = "hidden", j > e && (e = j)), e += n, g !== e && (l.style.height = e + "px", 
                o && d.callback.call(l, l));
            }
            function h() {
                clearTimeout(k), k = setTimeout(function() {
                    m.width() !== q && g();
                }, parseInt(d.resizeDelay, 10));
            }
            var i, j, k, l = this, m = a(l), n = 0, o = a.isFunction(d.callback), p = {
                height: l.style.height,
                overflow: l.style.overflow,
                overflowY: l.style.overflowY,
                wordWrap: l.style.wordWrap,
                resize: l.style.resize
            }, q = m.width();
            m.data("autosize") || (m.data("autosize", !0), ("border-box" === m.css("box-sizing") || "border-box" === m.css("-moz-box-sizing") || "border-box" === m.css("-webkit-box-sizing")) && (n = m.outerHeight() - m.height()), 
            j = Math.max(parseInt(m.css("minHeight"), 10) - n || 0, m.height()), m.css({
                overflow: "hidden",
                overflowY: "hidden",
                wordWrap: "break-word",
                resize: "none" === m.css("resize") || "vertical" === m.css("resize") ? "none" : "horizontal"
            }), "onpropertychange" in l ? "oninput" in l ? m.on("input.autosize keyup.autosize", g) : m.on("propertychange.autosize", function() {
                "value" === event.propertyName && g();
            }) : m.on("input.autosize", g), d.resizeDelay !== !1 && a(window).on("resize.autosize", h), 
            m.on("autosize.resize", g), m.on("autosize.resizeIncludeStyle", function() {
                b = null, g();
            }), m.on("autosize.destroy", function() {
                b = null, clearTimeout(k), a(window).off("resize", h), m.off("autosize").off(".autosize").css(p).removeData("autosize");
            }), g());
        });
    };
}), function(a) {
    function b(b) {
        function d(b) {
            var c = (k.gutterX, k.gutterY, k.cellH), d = k.cellW, f = a(b), g = f.find(f.attr("data-handle"));
            e.setDraggable(b, {
                handle: g[0],
                onStart: function(a) {
                    j.animate && e.transition && e.setTransition(this, ""), f.css("z-index", 9999).addClass("fw-float"), 
                    j.onBlockDrag.call(b, a);
                },
                onDrag: function(a, e) {
                    var g = f.position(), h = Math.round(g.top / c), l = Math.round(g.left / d), m = Math.round(f.width() / d), n = Math.round(f.height() / c);
                    h = Math.min(Math.max(0, h), k.limitRow - n), l = Math.min(Math.max(0, l), k.limitCol - m), 
                    i.setHoles({
                        top: h,
                        left: l,
                        width: m,
                        height: n
                    }), i.refresh(), j.onBlockMove.call(b, a);
                },
                onDrop: function(e) {
                    var g = f.position(), h = Math.round(g.top / c), l = Math.round(g.left / d), m = Math.round(f.width() / d), n = Math.round(f.height() / c);
                    h = Math.min(Math.max(0, h), k.limitRow - n), l = Math.min(Math.max(0, l), k.limitCol - m), 
                    f.removeClass("fw-float"), f.css({
                        zIndex: "auto",
                        top: h * c,
                        left: l * d
                    });
                    var o, p, q, r;
                    for (p = 0; n > p; ++p) for (o = 0; m > o; ++o) q = p + h + "-" + (o + l), r = k.matrix[q], 
                    r && 1 != r && a("#" + r).removeAttr("data-position");
                    k.holes = {}, f.attr({
                        "data-width": f.width(),
                        "data-height": f.height(),
                        "data-position": h + "-" + l
                    }), i.refresh(), j.onBlockDrop.call(b, e);
                }
            });
        }
        var g = a(b);
        "static" == g.css("position") && g.css("position", "relative");
        var h = Number.MAX_VALUE, i = this;
        e.totalGrid += 1;
        var j = a.extend({}, e.defaultConfig), k = {
            arguments: null,
            blocks: {},
            events: {},
            matrix: {},
            holes: {},
            cellW: 0,
            cellH: 0,
            cellS: 1,
            filter: "",
            lastId: 0,
            length: 0,
            maxWoB: 0,
            maxHoB: 0,
            minWoB: h,
            minHoB: h,
            running: 0,
            gutterX: 15,
            gutterY: 15,
            totalCol: 0,
            totalRow: 0,
            limitCol: 666666,
            limitRow: 666666,
            sortFunc: null,
            keepOrder: !1
        };
        j.runtime = k, k.totalGrid = e.totalGrid;
        var l = document.body.style;
        e.transition || (null != l.webkitTransition || null != l.MozTransition || null != l.msTransition || null != l.OTransition || null != l.transition) && (e.transition = !0), 
        a.extend(i, {
            addCustomEvent: function(a, b) {
                var c = k.events;
                return a = a.toLowerCase(), !c[a] && (c[a] = []), b.eid = c[a].length, c[a].push(b), 
                this;
            },
            appendBlock: function(b) {
                var c = a(b).appendTo(g), h = null, i = [];
                k.arguments && (a.isFunction(k.sortFunc) && c.sort(k.sortFunc), c.each(function(a, b) {
                    b.index = ++a, h = e.loadBlock(b, j), h && i.push(h);
                }), f[j.engine](i, j), e.setWallSize(k, g), k.length = c.length, c.each(function(a, b) {
                    e.showBlock(b, j), (j.draggable || b.getAttribute("data-draggable")) && d(b);
                }));
            },
            appendHoles: function(a) {
                var b, c = [].concat(a), d = {};
                for (b = 0; b < c.length; ++b) d = c[b], k.holes[d.top + "-" + d.left + "-" + d.width + "-" + d.height] = d;
                return this;
            },
            container: g,
            destroy: function() {
                var b = g.find(j.selector).removeAttr("id");
                b.each(function(b, c) {
                    $item = a(c);
                    var d = 1 * $item.attr("data-width") || "", e = 1 * $item.attr("data-height") || "";
                    $item.width(d).height(e).css({
                        position: "static"
                    });
                });
            },
            fillHoles: function(a) {
                if (0 == arguments.length) k.holes = {}; else {
                    var b, c = [].concat(a), d = {};
                    for (b = 0; b < c.length; ++b) d = c[b], delete k.holes[d.top + "-" + d.left + "-" + d.width + "-" + d.height];
                }
                return this;
            },
            filter: function(a) {
                return k.filter = a, k.arguments && this.refresh(), this;
            },
            fireEvent: function(a, b, c) {
                var d = k.events;
                if (a = a.toLowerCase(), d[a] && d[a].length) for (var e = 0; e < d[a].length; ++e) d[a][e].call(this, b, c);
                return this;
            },
            fitHeight: function(a) {
                var a = a ? a : g.height() || c.height();
                this.fitZone("auto", a), k.arguments = arguments;
            },
            fitWidth: function(a) {
                var a = a ? a : g.width() || c.width();
                this.fitZone(a, "auto"), k.arguments = arguments;
            },
            fitZone: function(b, h) {
                var l = g.find(j.selector).removeAttr("id"), m = null, n = [];
                h = h ? h : g.height() || c.height(), b = b ? b : g.width() || c.width(), k.arguments = arguments, 
                e.resetGrid(k), e.adjustUnit(b, h, j), k.filter ? (l.data("active", 0), l.filter(k.filter).data("active", 1)) : l.data("active", 1), 
                a.isFunction(k.sortFunc) && l.sort(k.sortFunc), l.each(function(b, c) {
                    var d = a(c);
                    c.index = ++b, m = e.loadBlock(c, j), m && d.data("active") && n.push(m);
                }), i.fireEvent("onGridReady", g, j), f[j.engine](n, j), e.setWallSize(k, g), i.fireEvent("onGridArrange", g, j), 
                k.length = l.length, l.each(function(a, b) {
                    e.showBlock(b, j), (j.draggable || b.getAttribute("data-draggable")) && d(b);
                });
            },
            fixPos: function(b) {
                return a(b.block).attr({
                    "data-position": b.top + "-" + b.left
                }), this;
            },
            fixSize: function(b) {
                return null != b.height && a(b.block).attr({
                    "data-height": b.height
                }), null != b.width && a(b.block).attr({
                    "data-width": b.width
                }), this;
            },
            prepend: function(a) {
                return g.prepend(a), k.arguments && this.refresh(), this;
            },
            refresh: function() {
                var a = arguments.length ? arguments : k.arguments, b = k.arguments, c = b ? b.callee : this.fitWidth;
                return c.apply(this, Array.prototype.slice.call(a, 0)), this;
            },
            reset: function(b) {
                return a.extend(j, b), this;
            },
            setHoles: function(a) {
                var b, c = [].concat(a), d = {};
                for (k.holes = {}, b = 0; b < c.length; ++b) d = c[b], k.holes[d.top + "-" + d.left + "-" + d.width + "-" + d.height] = d;
                return this;
            },
            sortBy: function(a) {
                return k.sortFunc = a, k.arguments && this.refresh(), this;
            },
            unFilter: function() {
                return delete k.filter, this.refresh(), this;
            }
        }), g.attr("data-min-width", 80 * Math.floor(c.width() / 80));
        for (var m in e.plugin) e.plugin.hasOwnProperty(m) && e.plugin[m].call(i, j, g);
        c.resize(function() {
            k.running || (k.running = 1, setTimeout(function() {
                k.running = 0, j.onResize.call(i, g);
            }, 122), g.attr("data-min-width", 80 * Math.floor(c.width() / 80)));
        });
    }
    null == a.isNumeric && (a.isNumeric = function(a) {
        return null != a && a.constructor === Number;
    }), null == a.isFunction && (a.isFunction = function(a) {
        return null != a && a instanceof Function;
    });
    var c = a(window), d = a(document), e = {
        defaultConfig: {
            animate: !1,
            cellW: 100,
            cellH: 100,
            delay: 0,
            engine: "giot",
            fixSize: null,
            gutterX: 15,
            gutterY: 15,
            keepOrder: !1,
            selector: "> div",
            draggable: !1,
            cacheSize: !0,
            rightToLeft: !1,
            bottomToTop: !1,
            onGapFound: function() {},
            onComplete: function() {},
            onResize: function() {},
            onBlockDrag: function() {},
            onBlockMove: function() {},
            onBlockDrop: function() {},
            onBlockReady: function() {},
            onBlockFinish: function() {},
            onBlockActive: function() {},
            onBlockResize: function() {}
        },
        plugin: {},
        totalGrid: 1,
        transition: !1,
        loadBlock: function(b, c) {
            var d = c.runtime, e = d.gutterX, f = d.gutterY, g = d.cellH, h = d.cellW, i = null, j = a(b), k = j.data("active"), l = j.attr("data-position"), m = parseInt(j.attr("data-fixSize")), n = d.lastId++ + "-" + d.totalGrid;
            if (j.hasClass("fw-float")) return null;
            j.attr({
                id: n,
                "data-delay": b.index
            }), c.animate && this.transition && this.setTransition(b, ""), isNaN(m) && (m = null), 
            null == m && (m = c.fixSize);
            var o = m ? "ceil" : "round";
            null == j.attr("data-height") && j.attr("data-height", j.height()), null == j.attr("data-width") && j.attr("data-width", j.width());
            var p = 1 * j.attr("data-height"), q = 1 * j.attr("data-width");
            c.cacheSize || (b.style.width = "", q = j.width(), b.style.height = "", p = j.height());
            var r = q ? Math[o]((q + e) / h) : 0, s = p ? Math[o]((p + f) / g) : 0;
            if (m || "auto" != c.cellH || (j.width(h * r - e), b.style.height = "", p = j.height(), 
            s = p ? Math.round((p + f) / g) : 0), m || "auto" != c.cellW || (j.height(g * s - f), 
            b.style.width = "", q = j.width(), r = q ? Math.round((q + e) / h) : 0), null != m && (r > d.limitCol || s > d.limitRow)) i = null; else if (s && s < d.minHoB && (d.minHoB = s), 
            r && r < d.minWoB && (d.minWoB = r), s > d.maxHoB && (d.maxHoB = s), r > d.maxWoB && (d.maxWoB = r), 
            0 == q && (r = 0), 0 == p && (s = 0), i = {
                resize: !1,
                id: n,
                width: r,
                height: s,
                fixSize: m
            }, l) {
                l = l.split("-"), i.y = 1 * l[0], i.x = 1 * l[1], i.width = null != m ? r : Math.min(r, d.limitCol - i.x), 
                i.height = null != m ? s : Math.min(s, d.limitRow - i.y);
                var t = i.y + "-" + i.x + "-" + i.width + "-" + i.height;
                k ? (d.holes[t] = {
                    id: i.id,
                    top: i.y,
                    left: i.x,
                    width: i.width,
                    height: i.height
                }, this.setBlock(i, c)) : delete d.holes[t];
            }
            return null == j.attr("data-state") ? j.attr("data-state", "init") : j.attr("data-state", "move"), 
            c.onBlockReady.call(b, i, c), l && k ? null : i;
        },
        setBlock: function(a, b) {
            var c = b.runtime, d = c.gutterX, e = c.gutterY, f = a.height, g = a.width, h = c.cellH, i = c.cellW, j = a.x, k = a.y;
            b.rightToLeft && (j = c.limitCol - j - g), b.bottomToTop && (k = c.limitRow - k - f);
            var l = {
                fixSize: a.fixSize,
                resize: a.resize,
                top: k * h,
                left: j * i,
                width: i * g - d,
                height: h * f - e
            };
            return l.top = 1 * l.top.toFixed(2), l.left = 1 * l.left.toFixed(2), l.width = 1 * l.width.toFixed(2), 
            l.height = 1 * l.height.toFixed(2), a.id && (c.blocks[a.id] = l), l;
        },
        showBlock: function(b, c) {
            function d() {
                if (j && h.attr("data-state", "start"), c.animate && i.transition && i.setTransition(b, k), 
                e.length -= 1, g) g.fixSize && (g.height = 1 * h.attr("data-height"), g.width = 1 * h.attr("data-width")), 
                h.css({
                    opacity: 1,
                    width: g.width,
                    height: g.height
                }), h[f]({
                    top: g.top,
                    left: g.left
                }), null != h.attr("data-nested") && i.nestedGrid(b, c); else {
                    var a = parseInt(b.style.height) || 0, d = parseInt(b.style.width) || 0, l = parseInt(b.style.left) || 0, m = parseInt(b.style.top) || 0;
                    h[f]({
                        left: l + d / 2,
                        top: m + a / 2,
                        width: 0,
                        height: 0,
                        opacity: 0
                    });
                }
                if (c.onBlockFinish.call(b, g, c), 0 == e.length) {
                    var n = c.animate ? 500 : 0;
                    b.delay = setTimeout(function() {
                        c.onComplete.call(b, g, c);
                    }, n);
                }
            }
            var e = c.runtime, f = c.animate && !this.transition ? "animate" : "css", g = e.blocks[b.id], h = a(b), i = this, j = "move" != h.attr("data-state"), k = j ? "width 0.5s, height 0.5s" : "top 0.5s, left 0.5s, width 0.5s, height 0.5s, opacity 0.5s";
            b.delay && clearTimeout(b.delay), h.hasClass("fw-float") || (i.setTransition(b, ""), 
            b.style.position = "absolute", c.onBlockActive.call(b, g, c), g && g.resize && c.onBlockResize.call(b, g, c), 
            c.delay > 0 ? b.delay = setTimeout(d, c.delay * h.attr("data-delay")) : d());
        },
        nestedGrid: function(c, d) {
            var e, f = a(c), g = d.runtime, h = f.attr("data-gutterX") || d.gutterX, i = f.attr("data-gutterY") || d.gutterY, j = f.attr("data-method") || "fitZone", k = f.attr("data-nested") || "> div", l = f.attr("data-cellH") || d.cellH, m = f.attr("data-cellW") || d.cellW, n = g.blocks[c.id];
            if (n) switch (e = new b(f), e.reset({
                cellH: l,
                cellW: m,
                gutterX: 1 * h,
                gutterY: 1 * i,
                selector: k,
                cacheSize: !1
            }), j) {
              case "fitHeight":
                e[j](n.height);
                break;

              case "fitWidth":
                e[j](n.width);
                break;

              case "fitZone":
                e[j](n.width, n.height);
            }
        },
        adjustBlock: function(b, c) {
            var d = c.runtime, e = d.gutterX, f = d.gutterY, g = a("#" + b.id), h = d.cellH, i = d.cellW;
            "auto" == c.cellH && (g.width(b.width * i - e), g[0].style.height = "", b.height = Math.round((g.height() + f) / h));
        },
        adjustUnit: function(b, c, d) {
            var e = d.gutterX, f = d.gutterY, g = d.runtime, h = d.cellW, i = d.cellH;
            if (a.isFunction(h) && (h = h(b)), h = 1 * h, !a.isNumeric(h) && (h = 1), a.isFunction(i) && (i = i(c)), 
            i = 1 * i, !a.isNumeric(i) && (i = 1), a.isNumeric(b)) {
                1 > h && (h *= b);
                var j = Math.max(1, Math.floor(b / h));
                a.isNumeric(e) || (e = (b - j * h) / Math.max(1, j - 1), e = Math.max(0, e)), j = Math.floor((b + e) / h), 
                g.cellW = (b + e) / Math.max(j, 1), g.cellS = g.cellW / h, g.gutterX = e, g.limitCol = j;
            }
            if (a.isNumeric(c)) {
                1 > i && (i *= c);
                var k = Math.max(1, Math.floor(c / i));
                a.isNumeric(f) || (f = (c - k * i) / Math.max(1, k - 1), f = Math.max(0, f)), k = Math.floor((c + f) / i), 
                g.cellH = (c + f) / Math.max(k, 1), g.cellS = g.cellH / i, g.gutterY = f, g.limitRow = k;
            }
            a.isNumeric(b) || (1 > h && (h = g.cellH), g.cellW = 1 != h ? h * g.cellS : 1, g.gutterX = e, 
            g.limitCol = 666666), a.isNumeric(c) || (1 > i && (i = g.cellW), g.cellH = 1 != i ? i * g.cellS : 1, 
            g.gutterY = f, g.limitRow = 666666), g.keepOrder = d.keepOrder;
        },
        resetGrid: function(a) {
            a.blocks = {}, a.length = 0, a.cellH = 0, a.cellW = 0, a.lastId = 1, a.matrix = {}, 
            a.totalCol = 0, a.totalRow = 0;
        },
        setDraggable: function(b, c) {
            var e = !1, f = {
                startX: 0,
                startY: 0,
                top: 0,
                left: 0,
                handle: null,
                onDrop: function() {},
                onDrag: function() {},
                onStart: function() {}
            };
            a(b).each(function() {
                function b(a) {
                    return a.stopPropagation(), a = a.originalEvent, a.touches && (e = !0, a = a.changedTouches[0]), 
                    2 != a.button && 3 != a.which && (i.onStart.call(k, a), i.startX = a.clientX, i.startY = a.clientY, 
                    i.top = parseInt(l.css("top")) || 0, i.left = parseInt(l.css("left")) || 0, d.bind("mouseup touchend", h), 
                    d.bind("mousemove touchmove", g)), !1;
                }
                function g(a) {
                    a = a.originalEvent, e && (a = a.changedTouches[0]), l.css({
                        top: i.top - (i.startY - a.clientY),
                        left: i.left - (i.startX - a.clientX)
                    }), i.onDrag.call(k, a);
                }
                function h(a) {
                    a = a.originalEvent, e && (a = a.changedTouches[0]), i.onDrop.call(k, a), d.unbind("mouseup touchend", h), 
                    d.unbind("mousemove touchmove", g);
                }
                var i = a.extend({}, f, c), j = i.handle || this, k = this, l = a(k), m = a(j), n = l.css("position");
                "absolute" != n && l.css("position", "relative"), l.find("iframe, form, input, textarea, .ignore-drag").each(function() {
                    a(this).on("touchstart mousedown", function(a) {
                        a.stopPropagation();
                    });
                }), d.unbind("mouseup touchend", h), d.unbind("mousemove touchmove", g), m.unbind("mousedown touchstart").bind("mousedown touchstart", b);
            });
        },
        setTransition: function(b, c) {
            var d = b.style, e = a(b);
            !this.transition && e.stop ? e.stop() : null != d.webkitTransition ? d.webkitTransition = c : null != d.MozTransition ? d.MozTransition = c : null != d.msTransition ? d.msTransition = c : null != d.OTransition ? d.OTransition = c : d.transition = c;
        },
        getFreeArea: function(a, b, c) {
            for (var d = Math.min(a + c.maxHoB, c.limitRow), e = Math.min(b + c.maxWoB, c.limitCol), f = e, g = d, h = c.matrix, i = a; g > i; ++i) for (var j = b; e > j; ++j) h[i + "-" + j] && j > b && f > j && (f = j);
            for (var i = a; d > i; ++i) for (var j = b; f > j; ++j) h[i + "-" + j] && i > a && g > i && (g = i);
            return {
                top: a,
                left: b,
                width: f - b,
                height: g - a
            };
        },
        setWallSize: function(a, b) {
            var c = a.totalRow, d = a.totalCol, e = a.gutterY, f = a.gutterX, g = a.cellH, h = a.cellW, i = Math.max(0, h * d - f), j = Math.max(0, g * c - e);
            b.attr({
                "data-total-col": d,
                "data-total-row": c,
                "data-wall-width": Math.ceil(i),
                "data-wall-height": Math.ceil(j)
            }), a.limitCol < a.limitRow && !b.attr("data-height") && b.height(Math.ceil(j));
        }
    }, f = {
        giot: function(a, b) {
            function c(a, b, c, d, e) {
                for (var f = b; b + e > f; ) {
                    for (var g = c; c + d > g; ) o[f + "-" + g] = a, ++g > j && (j = g);
                    ++f > k && (k = f);
                }
            }
            var d = b.runtime, f = d.limitRow, g = d.limitCol, h = 0, i = 0, j = d.totalCol, k = d.totalRow, l = {}, m = d.holes, n = null, o = d.matrix, p = Math.max(g, f), q = null, r = null, s = f > g ? 1 : 0, t = null, u = Math.min(g, f);
            for (var v in m) m.hasOwnProperty(v) && c(m[v].id || !0, m[v].top, m[v].left, m[v].width, m[v].height);
            for (var w = 0; p > w && a.length; ++w) {
                s ? i = w : h = w, t = null;
                for (var x = 0; u > x && a.length; ++x) if (n = null, s ? h = x : i = x, !d.matrix[i + "-" + h]) {
                    if (q = e.getFreeArea(i, h, d), null == b.fixSize) {
                        if (t && !s && d.minHoB > q.height) {
                            t.height += q.height, t.resize = !0, c(t.id, t.y, t.x, t.width, t.height), e.setBlock(t, b);
                            continue;
                        }
                        if (t && s && d.minWoB > q.width) {
                            t.width += q.width, t.resize = !0, c(t.id, t.y, t.x, t.width, t.height), e.setBlock(t, b);
                            continue;
                        }
                    }
                    if (d.keepOrder) n = a.shift(), n.resize = !0; else {
                        for (var v = 0; v < a.length; ++v) if (!(a[v].height > q.height || a[v].width > q.width)) {
                            n = a.splice(v, 1)[0];
                            break;
                        }
                        if (null == n && null == b.fixSize) for (var v = 0; v < a.length; ++v) if (null == a[v].fixSize) {
                            n = a.splice(v, 1)[0], n.resize = !0;
                            break;
                        }
                    }
                    if (null != n) n.resize && (s ? (n.width = q.width, "auto" == b.cellH && e.adjustBlock(n, b), 
                    n.height = Math.min(n.height, q.height)) : (n.height = q.height, n.width = Math.min(n.width, q.width))), 
                    l[n.id] = {
                        id: n.id,
                        x: h,
                        y: i,
                        width: n.width,
                        height: n.height,
                        resize: n.resize,
                        fixSize: n.fixSize
                    }, t = l[n.id], c(t.id, t.y, t.x, t.width, t.height), e.setBlock(t, b); else {
                        var r = {
                            x: h,
                            y: i,
                            fixSize: 0
                        };
                        if (s) {
                            r.width = q.width, r.height = 0;
                            for (var y = h - 1, z = i; o[z + "-" + y]; ) o[z + "-" + h] = !0, r.height += 1, 
                            z += 1;
                        } else {
                            r.height = q.height, r.width = 0;
                            for (var z = i - 1, y = h; o[z + "-" + y]; ) o[i + "-" + y] = !0, r.width += 1, 
                            y += 1;
                        }
                        b.onGapFound(e.setBlock(r, b), b);
                    }
                }
            }
            d.matrix = o, d.totalRow = k, d.totalCol = j;
        }
    };
    b.addConfig = function(b) {
        a.extend(e.defaultConfig, b);
    }, b.createEngine = function(b) {
        a.extend(f, b);
    }, b.createPlugin = function(b) {
        a.extend(e.plugin, b);
    }, b.getMethod = function(a) {
        return e[a];
    }, window.Freewall = window.freewall = b;
}(window.Zepto || window.jQuery), function(a) {
    var b = {}, c = {
        mode: "horizontal",
        slideSelector: "",
        infiniteLoop: !0,
        hideControlOnEnd: !1,
        speed: 500,
        easing: null,
        slideMargin: 0,
        startSlide: 0,
        randomStart: !1,
        captions: !1,
        ticker: !1,
        tickerHover: !1,
        adaptiveHeight: !1,
        adaptiveHeightSpeed: 500,
        video: !1,
        useCSS: !0,
        preloadImages: "visible",
        responsive: !0,
        slideZIndex: 50,
        wrapperClass: "bx-wrapper",
        touchEnabled: !0,
        swipeThreshold: 50,
        oneToOneTouch: !0,
        preventDefaultSwipeX: !0,
        preventDefaultSwipeY: !1,
        pager: !0,
        pagerType: "full",
        pagerShortSeparator: " / ",
        pagerSelector: null,
        buildPager: null,
        pagerCustom: null,
        controls: !0,
        nextText: "Next",
        prevText: "Prev",
        nextSelector: null,
        prevSelector: null,
        autoControls: !1,
        startText: "Start",
        stopText: "Stop",
        autoControlsCombine: !1,
        autoControlsSelector: null,
        auto: !1,
        pause: 4e3,
        autoStart: !0,
        autoDirection: "next",
        autoHover: !1,
        autoDelay: 0,
        autoSlideForOnePage: !1,
        minSlides: 1,
        maxSlides: 1,
        moveSlides: 0,
        slideWidth: 0,
        onSliderLoad: function() {},
        onSlideBefore: function() {},
        onSlideAfter: function() {},
        onSlideNext: function() {},
        onSlidePrev: function() {},
        onSliderResize: function() {}
    };
    a.fn.bxSlider = function(d) {
        if (0 == this.length) return this;
        if (this.length > 1) return this.each(function() {
            a(this).bxSlider(d);
        }), this;
        var e = {}, f = this;
        b.el = this;
        var g = a(window).width(), h = a(window).height(), j = function() {
            e.settings = a.extend({}, c, d), e.settings.slideWidth = parseInt(e.settings.slideWidth), 
            e.children = f.children(e.settings.slideSelector), e.children.length < e.settings.minSlides && (e.settings.minSlides = e.children.length), 
            e.children.length < e.settings.maxSlides && (e.settings.maxSlides = e.children.length), 
            e.settings.randomStart && (e.settings.startSlide = Math.floor(Math.random() * e.children.length)), 
            e.active = {
                index: e.settings.startSlide
            }, e.carousel = e.settings.minSlides > 1 || e.settings.maxSlides > 1, e.carousel && (e.settings.preloadImages = "all"), 
            e.minThreshold = e.settings.minSlides * e.settings.slideWidth + (e.settings.minSlides - 1) * e.settings.slideMargin, 
            e.maxThreshold = e.settings.maxSlides * e.settings.slideWidth + (e.settings.maxSlides - 1) * e.settings.slideMargin, 
            e.working = !1, e.controls = {}, e.interval = null, e.animProp = "vertical" == e.settings.mode ? "top" : "left", 
            e.usingCSS = e.settings.useCSS && "fade" != e.settings.mode && function() {
                var a = document.createElement("div"), b = [ "WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective" ];
                for (var c in b) if (void 0 !== a.style[b[c]]) return e.cssPrefix = b[c].replace("Perspective", "").toLowerCase(), 
                e.animProp = "-" + e.cssPrefix + "-transform", !0;
                return !1;
            }(), "vertical" == e.settings.mode && (e.settings.maxSlides = e.settings.minSlides), 
            f.data("origStyle", f.attr("style")), f.children(e.settings.slideSelector).each(function() {
                a(this).data("origStyle", a(this).attr("style"));
            }), k();
        }, k = function() {
            f.wrap('<div class="' + e.settings.wrapperClass + '"><div class="bx-viewport"></div></div>'), 
            e.wrapper = f.closest("." + e.settings.wrapperClass), e.viewport = f.parent(), e.loader = a('<div class="bx-loading" />'), 
            e.viewport.prepend(e.loader), f.css({
                width: "horizontal" == e.settings.mode ? 100 * e.children.length + 215 + "%" : "auto",
                position: "relative"
            }), e.usingCSS && e.settings.easing ? f.css("-" + e.cssPrefix + "-transition-timing-function", e.settings.easing) : e.settings.easing || (e.settings.easing = "swing");
            q();
            e.viewport.css({
                width: "100%",
                overflow: "hidden",
                position: "relative"
            }), e.viewport.parent().css({
                maxWidth: o()
            }), e.settings.pager || e.viewport.parent().css({
                margin: "0 auto 0px"
            }), e.children.css({
                "float": "horizontal" == e.settings.mode ? "left" : "none",
                listStyle: "none",
                position: "relative"
            }), e.children.css("width", p()), "horizontal" == e.settings.mode && e.settings.slideMargin > 0 && e.children.css("marginRight", e.settings.slideMargin), 
            "vertical" == e.settings.mode && e.settings.slideMargin > 0 && e.children.css("marginBottom", e.settings.slideMargin), 
            "fade" == e.settings.mode && (e.children.css({
                position: "absolute",
                zIndex: 0,
                display: "none"
            }), e.children.eq(e.settings.startSlide).css({
                zIndex: e.settings.slideZIndex,
                display: "block"
            })), e.controls.el = a('<div class="bx-controls" />'), e.settings.captions && z(), 
            e.active.last = e.settings.startSlide == r() - 1, e.settings.video && f.fitVids();
            var b = e.children.eq(e.settings.startSlide);
            "all" == e.settings.preloadImages && (b = e.children), e.settings.ticker ? e.settings.pager = !1 : (e.settings.pager && w(), 
            e.settings.controls && x(), e.settings.auto && e.settings.autoControls && y(), (e.settings.controls || e.settings.autoControls || e.settings.pager) && e.viewport.after(e.controls.el)), 
            l(b, m);
        }, l = function(b, c) {
            var d = b.find("img, iframe").length;
            if (0 == d) return void c();
            var e = 0;
            b.find("img, iframe").each(function() {
                a(this).one("load", function() {
                    ++e == d && c();
                }).each(function() {
                    this.complete && a(this).load();
                });
            });
        }, m = function() {
            if (e.settings.infiniteLoop && "fade" != e.settings.mode && !e.settings.ticker) {
                var b = "vertical" == e.settings.mode ? e.settings.minSlides : e.settings.maxSlides, c = e.children.slice(0, b).clone().addClass("bx-clone"), d = e.children.slice(-b).clone().addClass("bx-clone");
                f.append(c).prepend(d);
            }
            e.loader.remove(), t(), "vertical" == e.settings.mode && (e.settings.adaptiveHeight = !0), 
            e.viewport.height(n()), f.redrawSlider(), e.settings.onSliderLoad(e.active.index), 
            e.initialized = !0, e.settings.responsive && a(window).bind("resize", Q), e.settings.auto && e.settings.autoStart && (r() > 1 || e.settings.autoSlideForOnePage) && J(), 
            e.settings.ticker && K(), e.settings.pager && F(e.settings.startSlide), e.settings.controls && I(), 
            e.settings.touchEnabled && !e.settings.ticker && M(), setTimeout(function() {
                f.redrawSlider(), e.wrapper.addClass("bx-ready");
            }, 100);
        }, n = function() {
            var b = 0, c = a();
            if ("vertical" == e.settings.mode || e.settings.adaptiveHeight) if (e.carousel) {
                var d = 1 == e.settings.moveSlides ? e.active.index : e.active.index * s();
                for (c = e.children.eq(d), i = 1; i <= e.settings.maxSlides - 1; i++) c = d + i >= e.children.length ? c.add(e.children.eq(i - 1)) : c.add(e.children.eq(d + i));
            } else c = e.children.eq(e.active.index); else c = e.children;
            return "vertical" == e.settings.mode ? (c.each(function(c) {
                b += a(this).outerHeight();
            }), e.settings.slideMargin > 0 && (b += e.settings.slideMargin * (e.settings.minSlides - 1))) : b = Math.max.apply(Math, c.map(function() {
                return a(this).outerHeight(!1);
            }).get()), "border-box" == e.viewport.css("box-sizing") ? b += parseFloat(e.viewport.css("padding-top")) + parseFloat(e.viewport.css("padding-bottom")) + parseFloat(e.viewport.css("border-top-width")) + parseFloat(e.viewport.css("border-bottom-width")) : "padding-box" == e.viewport.css("box-sizing") && (b += parseFloat(e.viewport.css("padding-top")) + parseFloat(e.viewport.css("padding-bottom"))), 
            b;
        }, o = function() {
            var a = "100%";
            return e.settings.slideWidth > 0 && (a = "horizontal" == e.settings.mode ? e.settings.maxSlides * e.settings.slideWidth + (e.settings.maxSlides - 1) * e.settings.slideMargin : e.settings.slideWidth), 
            a;
        }, p = function() {
            var a = e.settings.slideWidth, b = e.viewport.width();
            return 0 == e.settings.slideWidth || e.settings.slideWidth > b && !e.carousel || "vertical" == e.settings.mode ? a = b : e.settings.maxSlides > 1 && "horizontal" == e.settings.mode && (b > e.maxThreshold || b < e.minThreshold && (a = (b - e.settings.slideMargin * (e.settings.minSlides - 1)) / e.settings.minSlides)), 
            a;
        }, q = function() {
            var a = 1;
            if ("horizontal" == e.settings.mode && e.settings.slideWidth > 0) if (e.viewport.width() < e.minThreshold) a = e.settings.minSlides; else if (e.viewport.width() > e.maxThreshold) a = e.settings.maxSlides; else {
                var b = e.children.first().width() + e.settings.slideMargin;
                a = Math.floor((e.viewport.width() + e.settings.slideMargin) / b);
            } else "vertical" == e.settings.mode && (a = e.settings.minSlides);
            return a;
        }, r = function() {
            var a = 0;
            if (e.settings.moveSlides > 0) if (e.settings.infiniteLoop) a = Math.ceil(e.children.length / s()); else for (var b = 0, c = 0; b < e.children.length; ) ++a, 
            b = c + q(), c += e.settings.moveSlides <= q() ? e.settings.moveSlides : q(); else a = Math.ceil(e.children.length / q());
            return a;
        }, s = function() {
            return e.settings.moveSlides > 0 && e.settings.moveSlides <= q() ? e.settings.moveSlides : q();
        }, t = function() {
            if (e.children.length > e.settings.maxSlides && e.active.last && !e.settings.infiniteLoop) {
                if ("horizontal" == e.settings.mode) {
                    var a = e.children.last(), b = a.position();
                    u(-(b.left - (e.viewport.width() - a.outerWidth())), "reset", 0);
                } else if ("vertical" == e.settings.mode) {
                    var c = e.children.length - e.settings.minSlides, b = e.children.eq(c).position();
                    u(-b.top, "reset", 0);
                }
            } else {
                var b = e.children.eq(e.active.index * s()).position();
                e.active.index == r() - 1 && (e.active.last = !0), void 0 != b && ("horizontal" == e.settings.mode ? u(-b.left, "reset", 0) : "vertical" == e.settings.mode && u(-b.top, "reset", 0));
            }
        }, u = function(a, b, c, d) {
            if (e.usingCSS) {
                var g = "vertical" == e.settings.mode ? "translate3d(0, " + a + "px, 0)" : "translate3d(" + a + "px, 0, 0)";
                f.css("-" + e.cssPrefix + "-transition-duration", c / 1e3 + "s"), "slide" == b ? (f.css(e.animProp, g), 
                f.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
                    f.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"), G();
                })) : "reset" == b ? f.css(e.animProp, g) : "ticker" == b && (f.css("-" + e.cssPrefix + "-transition-timing-function", "linear"), 
                f.css(e.animProp, g), f.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
                    f.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"), u(d.resetValue, "reset", 0), 
                    L();
                }));
            } else {
                var h = {};
                h[e.animProp] = a, "slide" == b ? f.animate(h, c, e.settings.easing, function() {
                    G();
                }) : "reset" == b ? f.css(e.animProp, a) : "ticker" == b && f.animate(h, speed, "linear", function() {
                    u(d.resetValue, "reset", 0), L();
                });
            }
        }, v = function() {
            for (var b = "", c = r(), d = 0; c > d; d++) {
                var f = "";
                e.settings.buildPager && a.isFunction(e.settings.buildPager) ? (f = e.settings.buildPager(d), 
                e.pagerEl.addClass("bx-custom-pager")) : (f = d + 1, e.pagerEl.addClass("bx-default-pager")), 
                b += '<div class="bx-pager-item"><a href="" data-slide-index="' + d + '" class="bx-pager-link">' + f + "</a></div>";
            }
            e.pagerEl.html(b);
        }, w = function() {
            e.settings.pagerCustom ? e.pagerEl = a(e.settings.pagerCustom) : (e.pagerEl = a('<div class="bx-pager" />'), 
            e.settings.pagerSelector ? a(e.settings.pagerSelector).html(e.pagerEl) : e.controls.el.addClass("bx-has-pager").append(e.pagerEl), 
            v()), e.pagerEl.on("click", "a", E);
        }, x = function() {
            e.controls.next = a('<a class="bx-next" href="">' + e.settings.nextText + "</a>"), 
            e.controls.prev = a('<a class="bx-prev" href="">' + e.settings.prevText + "</a>"), 
            e.controls.next.bind("click", A), e.controls.prev.bind("click", B), e.settings.nextSelector && a(e.settings.nextSelector).append(e.controls.next), 
            e.settings.prevSelector && a(e.settings.prevSelector).append(e.controls.prev), e.settings.nextSelector || e.settings.prevSelector || (e.controls.directionEl = a('<div class="bx-controls-direction" />'), 
            e.controls.directionEl.append(e.controls.prev).append(e.controls.next), e.controls.el.addClass("bx-has-controls-direction").append(e.controls.directionEl));
        }, y = function() {
            e.controls.start = a('<div class="bx-controls-auto-item"><a class="bx-start" href="">' + e.settings.startText + "</a></div>"), 
            e.controls.stop = a('<div class="bx-controls-auto-item"><a class="bx-stop" href="">' + e.settings.stopText + "</a></div>"), 
            e.controls.autoEl = a('<div class="bx-controls-auto" />'), e.controls.autoEl.on("click", ".bx-start", C), 
            e.controls.autoEl.on("click", ".bx-stop", D), e.settings.autoControlsCombine ? e.controls.autoEl.append(e.controls.start) : e.controls.autoEl.append(e.controls.start).append(e.controls.stop), 
            e.settings.autoControlsSelector ? a(e.settings.autoControlsSelector).html(e.controls.autoEl) : e.controls.el.addClass("bx-has-controls-auto").append(e.controls.autoEl), 
            H(e.settings.autoStart ? "stop" : "start");
        }, z = function() {
            e.children.each(function(b) {
                var c = a(this).find("img:first").attr("title");
                void 0 != c && ("" + c).length && a(this).append('<div class="bx-caption"><span>' + c + "</span></div>");
            });
        }, A = function(a) {
            e.settings.auto && f.stopAuto(), f.goToNextSlide(), a.preventDefault();
        }, B = function(a) {
            e.settings.auto && f.stopAuto(), f.goToPrevSlide(), a.preventDefault();
        }, C = function(a) {
            f.startAuto(), a.preventDefault();
        }, D = function(a) {
            f.stopAuto(), a.preventDefault();
        }, E = function(b) {
            e.settings.auto && f.stopAuto();
            var c = a(b.currentTarget);
            if (void 0 !== c.attr("data-slide-index")) {
                var d = parseInt(c.attr("data-slide-index"));
                d != e.active.index && f.goToSlide(d), b.preventDefault();
            }
        }, F = function(b) {
            var c = e.children.length;
            return "short" == e.settings.pagerType ? (e.settings.maxSlides > 1 && (c = Math.ceil(e.children.length / e.settings.maxSlides)), 
            void e.pagerEl.html(b + 1 + e.settings.pagerShortSeparator + c)) : (e.pagerEl.find("a").removeClass("active"), 
            void e.pagerEl.each(function(c, d) {
                a(d).find("a").eq(b).addClass("active");
            }));
        }, G = function() {
            if (e.settings.infiniteLoop) {
                var a = "";
                0 == e.active.index ? a = e.children.eq(0).position() : e.active.index == r() - 1 && e.carousel ? a = e.children.eq((r() - 1) * s()).position() : e.active.index == e.children.length - 1 && (a = e.children.eq(e.children.length - 1).position()), 
                a && ("horizontal" == e.settings.mode ? u(-a.left, "reset", 0) : "vertical" == e.settings.mode && u(-a.top, "reset", 0));
            }
            e.working = !1, e.settings.onSlideAfter(e.children.eq(e.active.index), e.oldIndex, e.active.index);
        }, H = function(a) {
            e.settings.autoControlsCombine ? e.controls.autoEl.html(e.controls[a]) : (e.controls.autoEl.find("a").removeClass("active"), 
            e.controls.autoEl.find("a:not(.bx-" + a + ")").addClass("active"));
        }, I = function() {
            1 == r() ? (e.controls.prev.addClass("disabled"), e.controls.next.addClass("disabled")) : !e.settings.infiniteLoop && e.settings.hideControlOnEnd && (0 == e.active.index ? (e.controls.prev.addClass("disabled"), 
            e.controls.next.removeClass("disabled")) : e.active.index == r() - 1 ? (e.controls.next.addClass("disabled"), 
            e.controls.prev.removeClass("disabled")) : (e.controls.prev.removeClass("disabled"), 
            e.controls.next.removeClass("disabled")));
        }, J = function() {
            if (e.settings.autoDelay > 0) {
                setTimeout(f.startAuto, e.settings.autoDelay);
            } else f.startAuto();
            e.settings.autoHover && f.hover(function() {
                e.interval && (f.stopAuto(!0), e.autoPaused = !0);
            }, function() {
                e.autoPaused && (f.startAuto(!0), e.autoPaused = null);
            });
        }, K = function() {
            var b = 0;
            if ("next" == e.settings.autoDirection) f.append(e.children.clone().addClass("bx-clone")); else {
                f.prepend(e.children.clone().addClass("bx-clone"));
                var c = e.children.first().position();
                b = "horizontal" == e.settings.mode ? -c.left : -c.top;
            }
            u(b, "reset", 0), e.settings.pager = !1, e.settings.controls = !1, e.settings.autoControls = !1, 
            e.settings.tickerHover && !e.usingCSS && e.viewport.hover(function() {
                f.stop();
            }, function() {
                var b = 0;
                e.children.each(function(c) {
                    b += "horizontal" == e.settings.mode ? a(this).outerWidth(!0) : a(this).outerHeight(!0);
                });
                var c = e.settings.speed / b, d = "horizontal" == e.settings.mode ? "left" : "top", g = c * (b - Math.abs(parseInt(f.css(d))));
                L(g);
            }), L();
        }, L = function(a) {
            speed = a ? a : e.settings.speed;
            var b = {
                left: 0,
                top: 0
            }, c = {
                left: 0,
                top: 0
            };
            "next" == e.settings.autoDirection ? b = f.find(".bx-clone").first().position() : c = e.children.first().position();
            var d = "horizontal" == e.settings.mode ? -b.left : -b.top, g = "horizontal" == e.settings.mode ? -c.left : -c.top, h = {
                resetValue: g
            };
            u(d, "ticker", speed, h);
        }, M = function() {
            e.touch = {
                start: {
                    x: 0,
                    y: 0
                },
                end: {
                    x: 0,
                    y: 0
                }
            }, e.viewport.bind("touchstart", N);
        }, N = function(a) {
            if (e.working) a.preventDefault(); else {
                e.touch.originalPos = f.position();
                var b = a.originalEvent;
                e.touch.start.x = b.changedTouches[0].pageX, e.touch.start.y = b.changedTouches[0].pageY, 
                e.viewport.bind("touchmove", O), e.viewport.bind("touchend", P);
            }
        }, O = function(a) {
            var b = a.originalEvent, c = Math.abs(b.changedTouches[0].pageX - e.touch.start.x), d = Math.abs(b.changedTouches[0].pageY - e.touch.start.y);
            if (3 * c > d && e.settings.preventDefaultSwipeX ? a.preventDefault() : 3 * d > c && e.settings.preventDefaultSwipeY && a.preventDefault(), 
            "fade" != e.settings.mode && e.settings.oneToOneTouch) {
                var f = 0;
                if ("horizontal" == e.settings.mode) {
                    var g = b.changedTouches[0].pageX - e.touch.start.x;
                    f = e.touch.originalPos.left + g;
                } else {
                    var g = b.changedTouches[0].pageY - e.touch.start.y;
                    f = e.touch.originalPos.top + g;
                }
                u(f, "reset", 0);
            }
        }, P = function(a) {
            e.viewport.unbind("touchmove", O);
            var b = a.originalEvent, c = 0;
            if (e.touch.end.x = b.changedTouches[0].pageX, e.touch.end.y = b.changedTouches[0].pageY, 
            "fade" == e.settings.mode) {
                var d = Math.abs(e.touch.start.x - e.touch.end.x);
                d >= e.settings.swipeThreshold && (e.touch.start.x > e.touch.end.x ? f.goToNextSlide() : f.goToPrevSlide(), 
                f.stopAuto());
            } else {
                var d = 0;
                "horizontal" == e.settings.mode ? (d = e.touch.end.x - e.touch.start.x, c = e.touch.originalPos.left) : (d = e.touch.end.y - e.touch.start.y, 
                c = e.touch.originalPos.top), !e.settings.infiniteLoop && (0 == e.active.index && d > 0 || e.active.last && 0 > d) ? u(c, "reset", 200) : Math.abs(d) >= e.settings.swipeThreshold ? (0 > d ? f.goToNextSlide() : f.goToPrevSlide(), 
                f.stopAuto()) : u(c, "reset", 200);
            }
            e.viewport.unbind("touchend", P);
        }, Q = function(b) {
            if (e.initialized) {
                var c = a(window).width(), d = a(window).height();
                (g != c || h != d) && (g = c, h = d, f.redrawSlider(), e.settings.onSliderResize.call(f, e.active.index));
            }
        };
        return f.goToSlide = function(b, c) {
            if (!e.working && e.active.index != b) if (e.working = !0, e.oldIndex = e.active.index, 
            0 > b ? e.active.index = r() - 1 : b >= r() ? e.active.index = 0 : e.active.index = b, 
            e.settings.onSlideBefore(e.children.eq(e.active.index), e.oldIndex, e.active.index), 
            "next" == c ? e.settings.onSlideNext(e.children.eq(e.active.index), e.oldIndex, e.active.index) : "prev" == c && e.settings.onSlidePrev(e.children.eq(e.active.index), e.oldIndex, e.active.index), 
            e.active.last = e.active.index >= r() - 1, e.settings.pager && F(e.active.index), 
            e.settings.controls && I(), "fade" == e.settings.mode) e.settings.adaptiveHeight && e.viewport.height() != n() && e.viewport.animate({
                height: n()
            }, e.settings.adaptiveHeightSpeed), e.children.filter(":visible").fadeOut(e.settings.speed).css({
                zIndex: 0
            }), e.children.eq(e.active.index).css("zIndex", e.settings.slideZIndex + 1).fadeIn(e.settings.speed, function() {
                a(this).css("zIndex", e.settings.slideZIndex), G();
            }); else {
                e.settings.adaptiveHeight && e.viewport.height() != n() && e.viewport.animate({
                    height: n()
                }, e.settings.adaptiveHeightSpeed);
                var d = 0, g = {
                    left: 0,
                    top: 0
                };
                if (!e.settings.infiniteLoop && e.carousel && e.active.last) if ("horizontal" == e.settings.mode) {
                    var h = e.children.eq(e.children.length - 1);
                    g = h.position(), d = e.viewport.width() - h.outerWidth();
                } else {
                    var i = e.children.length - e.settings.minSlides;
                    g = e.children.eq(i).position();
                } else if (e.carousel && e.active.last && "prev" == c) {
                    var j = 1 == e.settings.moveSlides ? e.settings.maxSlides - s() : (r() - 1) * s() - (e.children.length - e.settings.maxSlides), h = f.children(".bx-clone").eq(j);
                    g = h.position();
                } else if ("next" == c && 0 == e.active.index) g = f.find("> .bx-clone").eq(e.settings.maxSlides).position(), 
                e.active.last = !1; else if (b >= 0) {
                    var k = b * s();
                    g = e.children.eq(k).position();
                }
                if ("undefined" != typeof g) {
                    var l = "horizontal" == e.settings.mode ? -(g.left - d) : -g.top;
                    u(l, "slide", e.settings.speed);
                }
            }
        }, f.goToNextSlide = function() {
            if (e.settings.infiniteLoop || !e.active.last) {
                var a = parseInt(e.active.index) + 1;
                f.goToSlide(a, "next");
            }
        }, f.goToPrevSlide = function() {
            if (e.settings.infiniteLoop || 0 != e.active.index) {
                var a = parseInt(e.active.index) - 1;
                f.goToSlide(a, "prev");
            }
        }, f.startAuto = function(a) {
            e.interval || (e.interval = setInterval(function() {
                "next" == e.settings.autoDirection ? f.goToNextSlide() : f.goToPrevSlide();
            }, e.settings.pause), e.settings.autoControls && 1 != a && H("stop"));
        }, f.stopAuto = function(a) {
            e.interval && (clearInterval(e.interval), e.interval = null, e.settings.autoControls && 1 != a && H("start"));
        }, f.getCurrentSlide = function() {
            return e.active.index;
        }, f.getCurrentSlideElement = function() {
            return e.children.eq(e.active.index);
        }, f.getSlideCount = function() {
            return e.children.length;
        }, f.redrawSlider = function() {
            e.children.add(f.find(".bx-clone")).width(p()), e.viewport.css("height", n()), e.settings.ticker || t(), 
            e.active.last && (e.active.index = r() - 1), e.active.index >= r() && (e.active.last = !0), 
            e.settings.pager && !e.settings.pagerCustom && (v(), F(e.active.index));
        }, f.destroySlider = function() {
            e.initialized && (e.initialized = !1, a(".bx-clone", this).remove(), e.children.each(function() {
                void 0 != a(this).data("origStyle") ? a(this).attr("style", a(this).data("origStyle")) : a(this).removeAttr("style");
            }), void 0 != a(this).data("origStyle") ? this.attr("style", a(this).data("origStyle")) : a(this).removeAttr("style"), 
            a(this).unwrap().unwrap(), e.controls.el && e.controls.el.remove(), e.controls.next && e.controls.next.remove(), 
            e.controls.prev && e.controls.prev.remove(), e.pagerEl && e.settings.controls && e.pagerEl.remove(), 
            a(".bx-caption", this).remove(), e.controls.autoEl && e.controls.autoEl.remove(), 
            clearInterval(e.interval), e.settings.responsive && a(window).unbind("resize", Q));
        }, f.reloadSlider = function(a) {
            void 0 != a && (d = a), f.destroySlider(), j();
        }, j(), this;
    };
}(jQuery), function(a) {
    a.cookie = function(b, c, d) {
        if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(c)) || null === c || void 0 === c)) {
            if (d = a.extend({}, d), (null === c || void 0 === c) && (d.expires = -1), "number" == typeof d.expires) {
                var e = d.expires, f = d.expires = new Date();
                f.setDate(f.getDate() + e);
            }
            return c = String(c), document.cookie = [ encodeURIComponent(b), "=", d.raw ? c : encodeURIComponent(c), d.expires ? "; expires=" + d.expires.toUTCString() : "", d.path ? "; path=" + d.path : "", d.domain ? "; domain=" + d.domain : "", d.secure ? "; secure" : "" ].join("");
        }
        d = c || {};
        for (var g, h = d.raw ? function(a) {
            return a;
        } : decodeURIComponent, i = document.cookie.split("; "), j = 0; g = i[j] && i[j].split("="); j++) if (h(g[0]) === b) return h(g[1] || "");
        return null;
    };
}(jQuery), function(a, b, c, d) {
    "use strict";
    var e = c("html"), f = c(a), g = c(b), h = c.fancybox = function() {
        h.open.apply(this, arguments);
    }, i = navigator.userAgent.match(/msie/i), j = null, k = b.createTouch !== d, l = function(a) {
        return a && a.hasOwnProperty && a instanceof c;
    }, m = function(a) {
        return a && "string" === c.type(a);
    }, n = function(a) {
        return m(a) && a.indexOf("%") > 0;
    }, o = function(a) {
        return a && !(a.style.overflow && "hidden" === a.style.overflow) && (a.clientWidth && a.scrollWidth > a.clientWidth || a.clientHeight && a.scrollHeight > a.clientHeight);
    }, p = function(a, b) {
        var c = parseInt(a, 10) || 0;
        return b && n(a) && (c = h.getViewport()[b] / 100 * c), Math.ceil(c);
    }, q = function(a, b) {
        return p(a, b) + "px";
    };
    c.extend(h, {
        version: "2.1.5",
        defaults: {
            padding: 15,
            margin: 20,
            width: 800,
            height: 600,
            minWidth: 100,
            minHeight: 100,
            maxWidth: 9999,
            maxHeight: 9999,
            pixelRatio: 1,
            autoSize: !0,
            autoHeight: !1,
            autoWidth: !1,
            autoResize: !0,
            autoCenter: !k,
            fitToView: !0,
            aspectRatio: !1,
            topRatio: .5,
            leftRatio: .5,
            scrolling: "auto",
            wrapCSS: "",
            arrows: !0,
            closeBtn: !0,
            closeClick: !1,
            nextClick: !1,
            mouseWheel: !0,
            autoPlay: !1,
            playSpeed: 3e3,
            preload: 3,
            modal: !1,
            loop: !0,
            ajax: {
                dataType: "html",
                headers: {
                    "X-fancyBox": !0
                }
            },
            iframe: {
                scrolling: "auto",
                preload: !0
            },
            swf: {
                allowfullscreen: "true",
                allowscriptaccess: "always"
            },
            keys: {
                next: {
                    13: "left",
                    34: "up",
                    39: "left",
                    40: "up"
                },
                prev: {
                    8: "right",
                    33: "down",
                    37: "right",
                    38: "down"
                },
                close: [ 27 ],
                play: [ 32 ],
                toggle: [ 70 ]
            },
            direction: {
                next: "left",
                prev: "right"
            },
            scrollOutside: !0,
            index: 0,
            type: null,
            href: null,
            content: null,
            title: null,
            tpl: {
                wrap: '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
                image: '<img class="fancybox-image" src="{href}" alt="" />',
                iframe: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + (i ? ' allowtransparency="true"' : "") + "></iframe>",
                error: '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',
                closeBtn: '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',
                next: '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
                prev: '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>',
                loading: '<div id="fancybox-loading"><div></div></div>'
            },
            openEffect: "fade",
            openSpeed: 250,
            openEasing: "swing",
            openOpacity: !0,
            openMethod: "zoomIn",
            closeEffect: "fade",
            closeSpeed: 250,
            closeEasing: "swing",
            closeOpacity: !0,
            closeMethod: "zoomOut",
            nextEffect: "elastic",
            nextSpeed: 250,
            nextEasing: "swing",
            nextMethod: "changeIn",
            prevEffect: "elastic",
            prevSpeed: 250,
            prevEasing: "swing",
            prevMethod: "changeOut",
            helpers: {
                overlay: !0,
                title: !0
            },
            onCancel: c.noop,
            beforeLoad: c.noop,
            afterLoad: c.noop,
            beforeShow: c.noop,
            afterShow: c.noop,
            beforeChange: c.noop,
            beforeClose: c.noop,
            afterClose: c.noop
        },
        group: {},
        opts: {},
        previous: null,
        coming: null,
        current: null,
        isActive: !1,
        isOpen: !1,
        isOpened: !1,
        wrap: null,
        skin: null,
        outer: null,
        inner: null,
        player: {
            timer: null,
            isActive: !1
        },
        ajaxLoad: null,
        imgPreload: null,
        transitions: {},
        helpers: {},
        open: function(a, b) {
            return a && (c.isPlainObject(b) || (b = {}), !1 !== h.close(!0)) ? (c.isArray(a) || (a = l(a) ? c(a).get() : [ a ]), 
            c.each(a, function(e, f) {
                var g, i, j, k, n, o, p, q = {};
                "object" === c.type(f) && (f.nodeType && (f = c(f)), l(f) ? (q = {
                    href: f.data("fancybox-href") || f.attr("href"),
                    title: c("<div/>").text(f.data("fancybox-title") || f.attr("title") || "").html(),
                    isDom: !0,
                    element: f
                }, c.metadata && c.extend(!0, q, f.metadata())) : q = f), g = b.href || q.href || (m(f) ? f : null), 
                i = b.title !== d ? b.title : q.title || "", j = b.content || q.content, k = j ? "html" : b.type || q.type, 
                !k && q.isDom && (k = f.data("fancybox-type"), k || (n = f.prop("class").match(/fancybox\.(\w+)/), 
                k = n ? n[1] : null)), m(g) && (k || (h.isImage(g) ? k = "image" : h.isSWF(g) ? k = "swf" : "#" === g.charAt(0) ? k = "inline" : m(f) && (k = "html", 
                j = f)), "ajax" === k && (o = g.split(/\s+/, 2), g = o.shift(), p = o.shift())), 
                j || ("inline" === k ? g ? j = c(m(g) ? g.replace(/.*(?=#[^\s]+$)/, "") : g) : q.isDom && (j = f) : "html" === k ? j = g : k || g || !q.isDom || (k = "inline", 
                j = f)), c.extend(q, {
                    href: g,
                    type: k,
                    content: j,
                    title: i,
                    selector: p
                }), a[e] = q;
            }), h.opts = c.extend(!0, {}, h.defaults, b), b.keys !== d && (h.opts.keys = b.keys ? c.extend({}, h.defaults.keys, b.keys) : !1), 
            h.group = a, h._start(h.opts.index)) : void 0;
        },
        cancel: function() {
            var a = h.coming;
            a && !1 === h.trigger("onCancel") || (h.hideLoading(), a && (h.ajaxLoad && h.ajaxLoad.abort(), 
            h.ajaxLoad = null, h.imgPreload && (h.imgPreload.onload = h.imgPreload.onerror = null), 
            a.wrap && a.wrap.stop(!0, !0).trigger("onReset").remove(), h.coming = null, h.current || h._afterZoomOut(a)));
        },
        close: function(a) {
            h.cancel(), !1 !== h.trigger("beforeClose") && (h.unbindEvents(), h.isActive && (h.isOpen && a !== !0 ? (h.isOpen = h.isOpened = !1, 
            h.isClosing = !0, c(".fancybox-item, .fancybox-nav").remove(), h.wrap.stop(!0, !0).removeClass("fancybox-opened"), 
            h.transitions[h.current.closeMethod]()) : (c(".fancybox-wrap").stop(!0).trigger("onReset").remove(), 
            h._afterZoomOut())));
        },
        play: function(a) {
            var b = function() {
                clearTimeout(h.player.timer);
            }, c = function() {
                b(), h.current && h.player.isActive && (h.player.timer = setTimeout(h.next, h.current.playSpeed));
            }, d = function() {
                b(), g.unbind(".player"), h.player.isActive = !1, h.trigger("onPlayEnd");
            }, e = function() {
                h.current && (h.current.loop || h.current.index < h.group.length - 1) && (h.player.isActive = !0, 
                g.bind({
                    "onCancel.player beforeClose.player": d,
                    "onUpdate.player": c,
                    "beforeLoad.player": b
                }), c(), h.trigger("onPlayStart"));
            };
            a === !0 || !h.player.isActive && a !== !1 ? e() : d();
        },
        next: function(a) {
            var b = h.current;
            b && (m(a) || (a = b.direction.next), h.jumpto(b.index + 1, a, "next"));
        },
        prev: function(a) {
            var b = h.current;
            b && (m(a) || (a = b.direction.prev), h.jumpto(b.index - 1, a, "prev"));
        },
        jumpto: function(a, b, c) {
            var e = h.current;
            e && (a = p(a), h.direction = b || e.direction[a >= e.index ? "next" : "prev"], 
            h.router = c || "jumpto", e.loop && (0 > a && (a = e.group.length + a % e.group.length), 
            a %= e.group.length), e.group[a] !== d && (h.cancel(), h._start(a)));
        },
        reposition: function(a, b) {
            var d, e = h.current, f = e ? e.wrap : null;
            f && (d = h._getPosition(b), a && "scroll" === a.type ? (delete d.position, f.stop(!0, !0).animate(d, 200)) : (f.css(d), 
            e.pos = c.extend({}, e.dim, d)));
        },
        update: function(a) {
            var b = a && a.originalEvent && a.originalEvent.type, c = !b || "orientationchange" === b;
            c && (clearTimeout(j), j = null), h.isOpen && !j && (j = setTimeout(function() {
                var d = h.current;
                d && !h.isClosing && (h.wrap.removeClass("fancybox-tmp"), (c || "load" === b || "resize" === b && d.autoResize) && h._setDimension(), 
                "scroll" === b && d.canShrink || h.reposition(a), h.trigger("onUpdate"), j = null);
            }, c && !k ? 0 : 300));
        },
        toggle: function(a) {
            h.isOpen && (h.current.fitToView = "boolean" === c.type(a) ? a : !h.current.fitToView, 
            k && (h.wrap.removeAttr("style").addClass("fancybox-tmp"), h.trigger("onUpdate")), 
            h.update());
        },
        hideLoading: function() {
            g.unbind(".loading"), c("#fancybox-loading").remove();
        },
        showLoading: function() {
            var a, b;
            h.hideLoading(), a = c(h.opts.tpl.loading).click(h.cancel).appendTo("body"), g.bind("keydown.loading", function(a) {
                27 === (a.which || a.keyCode) && (a.preventDefault(), h.cancel());
            }), h.defaults.fixed || (b = h.getViewport(), a.css({
                position: "absolute",
                top: .5 * b.h + b.y,
                left: .5 * b.w + b.x
            })), h.trigger("onLoading");
        },
        getViewport: function() {
            var b = h.current && h.current.locked || !1, c = {
                x: f.scrollLeft(),
                y: f.scrollTop()
            };
            return b && b.length ? (c.w = b[0].clientWidth, c.h = b[0].clientHeight) : (c.w = k && a.innerWidth ? a.innerWidth : f.width(), 
            c.h = k && a.innerHeight ? a.innerHeight : f.height()), c;
        },
        unbindEvents: function() {
            h.wrap && l(h.wrap) && h.wrap.unbind(".fb"), g.unbind(".fb"), f.unbind(".fb");
        },
        bindEvents: function() {
            var a, b = h.current;
            b && (f.bind("orientationchange.fb" + (k ? "" : " resize.fb") + (b.autoCenter && !b.locked ? " scroll.fb" : ""), h.update), 
            a = b.keys, a && g.bind("keydown.fb", function(e) {
                var f = e.which || e.keyCode, g = e.target || e.srcElement;
                return 27 === f && h.coming ? !1 : void (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey || g && (g.type || c(g).is("[contenteditable]")) || c.each(a, function(a, g) {
                    return b.group.length > 1 && g[f] !== d ? (h[a](g[f]), e.preventDefault(), !1) : c.inArray(f, g) > -1 ? (h[a](), 
                    e.preventDefault(), !1) : void 0;
                }));
            }), c.fn.mousewheel && b.mouseWheel && h.wrap.bind("mousewheel.fb", function(a, d, e, f) {
                for (var g = a.target || null, i = c(g), j = !1; i.length && !(j || i.is(".fancybox-skin") || i.is(".fancybox-wrap")); ) j = o(i[0]), 
                i = c(i).parent();
                0 === d || j || h.group.length > 1 && !b.canShrink && (f > 0 || e > 0 ? h.prev(f > 0 ? "down" : "left") : (0 > f || 0 > e) && h.next(0 > f ? "up" : "right"), 
                a.preventDefault());
            }));
        },
        trigger: function(a, b) {
            var d, e = b || h.coming || h.current;
            if (e) {
                if (c.isFunction(e[a]) && (d = e[a].apply(e, Array.prototype.slice.call(arguments, 1))), 
                d === !1) return !1;
                e.helpers && c.each(e.helpers, function(b, d) {
                    d && h.helpers[b] && c.isFunction(h.helpers[b][a]) && h.helpers[b][a](c.extend(!0, {}, h.helpers[b].defaults, d), e);
                });
            }
            g.trigger(a);
        },
        isImage: function(a) {
            return m(a) && a.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i);
        },
        isSWF: function(a) {
            return m(a) && a.match(/\.(swf)((\?|#).*)?$/i);
        },
        _start: function(a) {
            var b, d, e, f, g, i = {};
            if (a = p(a), b = h.group[a] || null, !b) return !1;
            if (i = c.extend(!0, {}, h.opts, b), f = i.margin, g = i.padding, "number" === c.type(f) && (i.margin = [ f, f, f, f ]), 
            "number" === c.type(g) && (i.padding = [ g, g, g, g ]), i.modal && c.extend(!0, i, {
                closeBtn: !1,
                closeClick: !1,
                nextClick: !1,
                arrows: !1,
                mouseWheel: !1,
                keys: null,
                helpers: {
                    overlay: {
                        closeClick: !1
                    }
                }
            }), i.autoSize && (i.autoWidth = i.autoHeight = !0), "auto" === i.width && (i.autoWidth = !0), 
            "auto" === i.height && (i.autoHeight = !0), i.group = h.group, i.index = a, h.coming = i, 
            !1 === h.trigger("beforeLoad")) return void (h.coming = null);
            if (e = i.type, d = i.href, !e) return h.coming = null, h.current && h.router && "jumpto" !== h.router ? (h.current.index = a, 
            h[h.router](h.direction)) : !1;
            if (h.isActive = !0, ("image" === e || "swf" === e) && (i.autoHeight = i.autoWidth = !1, 
            i.scrolling = "visible"), "image" === e && (i.aspectRatio = !0), "iframe" === e && k && (i.scrolling = "scroll"), 
            i.wrap = c(i.tpl.wrap).addClass("fancybox-" + (k ? "mobile" : "desktop") + " fancybox-type-" + e + " fancybox-tmp " + i.wrapCSS).appendTo(i.parent || "body"), 
            c.extend(i, {
                skin: c(".fancybox-skin", i.wrap),
                outer: c(".fancybox-outer", i.wrap),
                inner: c(".fancybox-inner", i.wrap)
            }), c.each([ "Top", "Right", "Bottom", "Left" ], function(a, b) {
                i.skin.css("padding" + b, q(i.padding[a]));
            }), h.trigger("onReady"), "inline" === e || "html" === e) {
                if (!i.content || !i.content.length) return h._error("content");
            } else if (!d) return h._error("href");
            "image" === e ? h._loadImage() : "ajax" === e ? h._loadAjax() : "iframe" === e ? h._loadIframe() : h._afterLoad();
        },
        _error: function(a) {
            c.extend(h.coming, {
                type: "html",
                autoWidth: !0,
                autoHeight: !0,
                minWidth: 0,
                minHeight: 0,
                scrolling: "no",
                hasError: a,
                content: h.coming.tpl.error
            }), h._afterLoad();
        },
        _loadImage: function() {
            var a = h.imgPreload = new Image();
            a.onload = function() {
                this.onload = this.onerror = null, h.coming.width = this.width / h.opts.pixelRatio, 
                h.coming.height = this.height / h.opts.pixelRatio, h._afterLoad();
            }, a.onerror = function() {
                this.onload = this.onerror = null, h._error("image");
            }, a.src = h.coming.href, a.complete !== !0 && h.showLoading();
        },
        _loadAjax: function() {
            var a = h.coming;
            h.showLoading(), h.ajaxLoad = c.ajax(c.extend({}, a.ajax, {
                url: a.href,
                error: function(a, b) {
                    h.coming && "abort" !== b ? h._error("ajax", a) : h.hideLoading();
                },
                success: function(b, c) {
                    "success" === c && (a.content = b, h._afterLoad());
                }
            }));
        },
        _loadIframe: function() {
            var a = h.coming, b = c(a.tpl.iframe.replace(/\{rnd\}/g, new Date().getTime())).attr("scrolling", k ? "auto" : a.iframe.scrolling).attr("src", a.href);
            c(a.wrap).bind("onReset", function() {
                try {
                    c(this).find("iframe").hide().attr("src", "//about:blank").end().empty();
                } catch (a) {}
            }), a.iframe.preload && (h.showLoading(), b.one("load", function() {
                c(this).data("ready", 1), k || c(this).bind("load.fb", h.update), c(this).parents(".fancybox-wrap").width("100%").removeClass("fancybox-tmp").show(), 
                h._afterLoad();
            })), a.content = b.appendTo(a.inner), a.iframe.preload || h._afterLoad();
        },
        _preloadImages: function() {
            var a, b, c = h.group, d = h.current, e = c.length, f = d.preload ? Math.min(d.preload, e - 1) : 0;
            for (b = 1; f >= b; b += 1) a = c[(d.index + b) % e], "image" === a.type && a.href && (new Image().src = a.href);
        },
        _afterLoad: function() {
            var a, b, d, e, f, g, i = h.coming, j = h.current, k = "fancybox-placeholder";
            if (h.hideLoading(), i && h.isActive !== !1) {
                if (!1 === h.trigger("afterLoad", i, j)) return i.wrap.stop(!0).trigger("onReset").remove(), 
                void (h.coming = null);
                switch (j && (h.trigger("beforeChange", j), j.wrap.stop(!0).removeClass("fancybox-opened").find(".fancybox-item, .fancybox-nav").remove()), 
                h.unbindEvents(), a = i, b = i.content, d = i.type, e = i.scrolling, c.extend(h, {
                    wrap: a.wrap,
                    skin: a.skin,
                    outer: a.outer,
                    inner: a.inner,
                    current: a,
                    previous: j
                }), f = a.href, d) {
                  case "inline":
                  case "ajax":
                  case "html":
                    a.selector ? b = c("<div>").html(b).find(a.selector) : l(b) && (b.data(k) || b.data(k, c('<div class="' + k + '"></div>').insertAfter(b).hide()), 
                    b = b.show().detach(), a.wrap.bind("onReset", function() {
                        c(this).find(b).length && b.hide().replaceAll(b.data(k)).data(k, !1);
                    }));
                    break;

                  case "image":
                    b = a.tpl.image.replace(/\{href\}/g, f);
                    break;

                  case "swf":
                    b = '<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="' + f + '"></param>', 
                    g = "", c.each(a.swf, function(a, c) {
                        b += '<param name="' + a + '" value="' + c + '"></param>', g += " " + a + '="' + c + '"';
                    }), b += '<embed src="' + f + '" type="application/x-shockwave-flash" width="100%" height="100%"' + g + "></embed></object>";
                }
                l(b) && b.parent().is(a.inner) || a.inner.append(b), h.trigger("beforeShow"), a.inner.css("overflow", "yes" === e ? "scroll" : "no" === e ? "hidden" : e), 
                h._setDimension(), h.reposition(), h.isOpen = !1, h.coming = null, h.bindEvents(), 
                h.isOpened ? j.prevMethod && h.transitions[j.prevMethod]() : c(".fancybox-wrap").not(a.wrap).stop(!0).trigger("onReset").remove(), 
                h.transitions[h.isOpened ? a.nextMethod : a.openMethod](), h._preloadImages();
            }
        },
        _setDimension: function() {
            var a, b, d, e, f, g, i, j, k, l, m, o, r, s, t, u = h.getViewport(), v = 0, w = !1, x = !1, y = h.wrap, z = h.skin, A = h.inner, B = h.current, C = B.width, D = B.height, E = B.minWidth, F = B.minHeight, G = B.maxWidth, H = B.maxHeight, I = B.scrolling, J = B.scrollOutside ? B.scrollbarWidth : 0, K = B.margin, L = p(K[1] + K[3]), M = p(K[0] + K[2]);
            if (y.add(z).add(A).width("auto").height("auto").removeClass("fancybox-tmp"), a = p(z.outerWidth(!0) - z.width()), 
            b = p(z.outerHeight(!0) - z.height()), d = L + a, e = M + b, f = n(C) ? (u.w - d) * p(C) / 100 : C, 
            g = n(D) ? (u.h - e) * p(D) / 100 : D, "iframe" === B.type) {
                if (s = B.content, B.autoHeight && 1 === s.data("ready")) try {
                    s[0].contentWindow.document.location && (A.width(f).height(9999), t = s.contents().find("body"), 
                    J && t.css("overflow-x", "hidden"), g = t.outerHeight(!0));
                } catch (N) {}
            } else (B.autoWidth || B.autoHeight) && (A.addClass("fancybox-tmp"), B.autoWidth || A.width(f), 
            B.autoHeight || A.height(g), B.autoWidth && (f = A.width()), B.autoHeight && (g = A.height()), 
            A.removeClass("fancybox-tmp"));
            if (C = p(f), D = p(g), k = f / g, E = p(n(E) ? p(E, "w") - d : E), G = p(n(G) ? p(G, "w") - d : G), 
            F = p(n(F) ? p(F, "h") - e : F), H = p(n(H) ? p(H, "h") - e : H), i = G, j = H, 
            B.fitToView && (G = Math.min(u.w - d, G), H = Math.min(u.h - e, H)), o = u.w - L, 
            r = u.h - M, B.aspectRatio ? (C > G && (C = G, D = p(C / k)), D > H && (D = H, C = p(D * k)), 
            E > C && (C = E, D = p(C / k)), F > D && (D = F, C = p(D * k))) : (C = Math.max(E, Math.min(C, G)), 
            B.autoHeight && "iframe" !== B.type && (A.width(C), D = A.height()), D = Math.max(F, Math.min(D, H))), 
            B.fitToView) if (A.width(C).height(D), y.width(C + a), l = y.width(), m = y.height(), 
            B.aspectRatio) for (;(l > o || m > r) && C > E && D > F && !(v++ > 19); ) D = Math.max(F, Math.min(H, D - 10)), 
            C = p(D * k), E > C && (C = E, D = p(C / k)), C > G && (C = G, D = p(C / k)), A.width(C).height(D), 
            y.width(C + a), l = y.width(), m = y.height(); else C = Math.max(E, Math.min(C, C - (l - o))), 
            D = Math.max(F, Math.min(D, D - (m - r)));
            J && "auto" === I && g > D && o > C + a + J && (C += J), A.width(C).height(D), y.width(C + a), 
            l = y.width(), m = y.height(), w = (l > o || m > r) && C > E && D > F, x = B.aspectRatio ? i > C && j > D && f > C && g > D : (i > C || j > D) && (f > C || g > D), 
            c.extend(B, {
                dim: {
                    width: q(l),
                    height: q(m)
                },
                origWidth: f,
                origHeight: g,
                canShrink: w,
                canExpand: x,
                wPadding: a,
                hPadding: b,
                wrapSpace: m - z.outerHeight(!0),
                skinSpace: z.height() - D
            }), !s && B.autoHeight && D > F && H > D && !x && A.height("auto");
        },
        _getPosition: function(a) {
            var b = h.current, c = h.getViewport(), d = b.margin, e = h.wrap.width() + d[1] + d[3], f = h.wrap.height() + d[0] + d[2], g = {
                position: "absolute",
                top: d[0],
                left: d[3]
            };
            return b.autoCenter && b.fixed && !a && f <= c.h && e <= c.w ? g.position = "fixed" : b.locked || (g.top += c.y, 
            g.left += c.x), g.top = q(Math.max(g.top, g.top + (c.h - f) * b.topRatio)), g.left = q(Math.max(g.left, g.left + (c.w - e) * b.leftRatio)), 
            g;
        },
        _afterZoomIn: function() {
            var a = h.current;
            a && (h.isOpen = h.isOpened = !0, h.wrap.css("overflow", "visible").addClass("fancybox-opened").hide().show(0), 
            h.update(), (a.closeClick || a.nextClick && h.group.length > 1) && h.inner.css("cursor", "pointer").bind("click.fb", function(b) {
                c(b.target).is("a") || c(b.target).parent().is("a") || (b.preventDefault(), h[a.closeClick ? "close" : "next"]());
            }), a.closeBtn && c(a.tpl.closeBtn).appendTo(h.skin).bind("click.fb", function(a) {
                a.preventDefault(), h.close();
            }), a.arrows && h.group.length > 1 && ((a.loop || a.index > 0) && c(a.tpl.prev).appendTo(h.outer).bind("click.fb", h.prev), 
            (a.loop || a.index < h.group.length - 1) && c(a.tpl.next).appendTo(h.outer).bind("click.fb", h.next)), 
            h.trigger("afterShow"), a.loop || a.index !== a.group.length - 1 ? h.opts.autoPlay && !h.player.isActive && (h.opts.autoPlay = !1, 
            h.play(!0)) : h.play(!1));
        },
        _afterZoomOut: function(a) {
            a = a || h.current, c(".fancybox-wrap").trigger("onReset").remove(), c.extend(h, {
                group: {},
                opts: {},
                router: !1,
                current: null,
                isActive: !1,
                isOpened: !1,
                isOpen: !1,
                isClosing: !1,
                wrap: null,
                skin: null,
                outer: null,
                inner: null
            }), h.trigger("afterClose", a);
        }
    }), h.transitions = {
        getOrigPosition: function() {
            var a = h.current, b = a.element, c = a.orig, d = {}, e = 50, f = 50, g = a.hPadding, i = a.wPadding, j = h.getViewport();
            return !c && a.isDom && b.is(":visible") && (c = b.find("img:first"), c.length || (c = b)), 
            l(c) ? (d = c.offset(), c.is("img") && (e = c.outerWidth(), f = c.outerHeight())) : (d.top = j.y + (j.h - f) * a.topRatio, 
            d.left = j.x + (j.w - e) * a.leftRatio), ("fixed" === h.wrap.css("position") || a.locked) && (d.top -= j.y, 
            d.left -= j.x), d = {
                top: q(d.top - g * a.topRatio),
                left: q(d.left - i * a.leftRatio),
                width: q(e + i),
                height: q(f + g)
            };
        },
        step: function(a, b) {
            var c, d, e, f = b.prop, g = h.current, i = g.wrapSpace, j = g.skinSpace;
            ("width" === f || "height" === f) && (c = b.end === b.start ? 1 : (a - b.start) / (b.end - b.start), 
            h.isClosing && (c = 1 - c), d = "width" === f ? g.wPadding : g.hPadding, e = a - d, 
            h.skin[f](p("width" === f ? e : e - i * c)), h.inner[f](p("width" === f ? e : e - i * c - j * c)));
        },
        zoomIn: function() {
            var a = h.current, b = a.pos, d = a.openEffect, e = "elastic" === d, f = c.extend({
                opacity: 1
            }, b);
            delete f.position, e ? (b = this.getOrigPosition(), a.openOpacity && (b.opacity = .1)) : "fade" === d && (b.opacity = .1), 
            h.wrap.css(b).animate(f, {
                duration: "none" === d ? 0 : a.openSpeed,
                easing: a.openEasing,
                step: e ? this.step : null,
                complete: h._afterZoomIn
            });
        },
        zoomOut: function() {
            var a = h.current, b = a.closeEffect, c = "elastic" === b, d = {
                opacity: .1
            };
            c && (d = this.getOrigPosition(), a.closeOpacity && (d.opacity = .1)), h.wrap.animate(d, {
                duration: "none" === b ? 0 : a.closeSpeed,
                easing: a.closeEasing,
                step: c ? this.step : null,
                complete: h._afterZoomOut
            });
        },
        changeIn: function() {
            var a, b = h.current, c = b.nextEffect, d = b.pos, e = {
                opacity: 1
            }, f = h.direction, g = 200;
            d.opacity = .1, "elastic" === c && (a = "down" === f || "up" === f ? "top" : "left", 
            "down" === f || "right" === f ? (d[a] = q(p(d[a]) - g), e[a] = "+=" + g + "px") : (d[a] = q(p(d[a]) + g), 
            e[a] = "-=" + g + "px")), "none" === c ? h._afterZoomIn() : h.wrap.css(d).animate(e, {
                duration: b.nextSpeed,
                easing: b.nextEasing,
                complete: h._afterZoomIn
            });
        },
        changeOut: function() {
            var a = h.previous, b = a.prevEffect, d = {
                opacity: .1
            }, e = h.direction, f = 200;
            "elastic" === b && (d["down" === e || "up" === e ? "top" : "left"] = ("up" === e || "left" === e ? "-" : "+") + "=" + f + "px"), 
            a.wrap.animate(d, {
                duration: "none" === b ? 0 : a.prevSpeed,
                easing: a.prevEasing,
                complete: function() {
                    c(this).trigger("onReset").remove();
                }
            });
        }
    }, h.helpers.overlay = {
        defaults: {
            closeClick: !0,
            speedOut: 200,
            showEarly: !0,
            css: {},
            locked: !k,
            fixed: !0
        },
        overlay: null,
        fixed: !1,
        el: c("html"),
        create: function(a) {
            var b;
            a = c.extend({}, this.defaults, a), this.overlay && this.close(), b = h.coming ? h.coming.parent : a.parent, 
            this.overlay = c('<div class="fancybox-overlay"></div>').appendTo(b && b.length ? b : "body"), 
            this.fixed = !1, a.fixed && h.defaults.fixed && (this.overlay.addClass("fancybox-overlay-fixed"), 
            this.fixed = !0);
        },
        open: function(a) {
            var b = this;
            a = c.extend({}, this.defaults, a), this.overlay ? this.overlay.unbind(".overlay").width("auto").height("auto") : this.create(a), 
            this.fixed || (f.bind("resize.overlay", c.proxy(this.update, this)), this.update()), 
            a.closeClick && this.overlay.bind("click.overlay", function(a) {
                return c(a.target).hasClass("fancybox-overlay") ? (h.isActive ? h.close() : b.close(), 
                !1) : void 0;
            }), this.overlay.css(a.css).show();
        },
        close: function() {
            f.unbind("resize.overlay"), this.el.hasClass("fancybox-lock") && (c(".fancybox-margin").removeClass("fancybox-margin"), 
            this.el.removeClass("fancybox-lock"), f.scrollTop(this.scrollV).scrollLeft(this.scrollH)), 
            c(".fancybox-overlay").hide(), c.extend(this, {
                overlay: null,
                fixed: !1
            });
        },
        update: function() {
            var a, c = "100%";
            this.overlay.width(c).height("100%"), i ? (a = Math.max(b.documentElement.offsetWidth, b.body.offsetWidth), 
            g.width() > a && (c = g.width())) : g.width() > f.width() && (c = g.width()), this.overlay.width(c).height(g.height());
        },
        onReady: function(a, b) {
            var d = this.overlay;
            c(".fancybox-overlay").stop(!0, !0), d || this.create(a), a.locked && this.fixed && b.fixed && (b.locked = this.overlay.append(b.wrap), 
            b.fixed = !1), a.showEarly === !0 && this.beforeShow.apply(this, arguments);
        },
        beforeShow: function(a, b) {
            b.locked && !this.el.hasClass("fancybox-lock") && (this.fixPosition !== !1 && c("*").filter(function() {
                return "fixed" === c(this).css("position") && !c(this).hasClass("fancybox-overlay") && !c(this).hasClass("fancybox-wrap");
            }).addClass("fancybox-margin"), this.el.addClass("fancybox-margin"), this.scrollV = f.scrollTop(), 
            this.scrollH = f.scrollLeft(), this.el.addClass("fancybox-lock"), f.scrollTop(this.scrollV).scrollLeft(this.scrollH)), 
            this.open(a);
        },
        onUpdate: function() {
            this.fixed || this.update();
        },
        afterClose: function(a) {
            this.overlay && !h.coming && this.overlay.fadeOut(a.speedOut, c.proxy(this.close, this));
        }
    }, h.helpers.title = {
        defaults: {
            type: "float",
            position: "bottom"
        },
        beforeShow: function(a) {
            var b, d, e = h.current, f = e.title, g = a.type;
            if (c.isFunction(f) && (f = f.call(e.element, e)), m(f) && "" !== c.trim(f)) {
                switch (b = c('<div class="fancybox-title fancybox-title-' + g + '-wrap">' + f + "</div>"), 
                g) {
                  case "inside":
                    d = h.skin;
                    break;

                  case "outside":
                    d = h.wrap;
                    break;

                  case "over":
                    d = h.inner;
                    break;

                  default:
                    d = h.skin, b.appendTo("body"), i && b.width(b.width()), b.wrapInner('<span class="child"></span>'), 
                    h.current.margin[2] += Math.abs(p(b.css("margin-bottom")));
                }
                b["top" === a.position ? "prependTo" : "appendTo"](d);
            }
        }
    }, c.fn.fancybox = function(a) {
        var b, d = c(this), e = this.selector || "", f = function(f) {
            var g, i, j = c(this).blur(), k = b;
            f.ctrlKey || f.altKey || f.shiftKey || f.metaKey || j.is(".fancybox-wrap") || (g = a.groupAttr || "data-fancybox-group", 
            i = j.attr(g), i || (g = "rel", i = j.get(0)[g]), i && "" !== i && "nofollow" !== i && (j = e.length ? c(e) : d, 
            j = j.filter("[" + g + '="' + i + '"]'), k = j.index(this)), a.index = k, h.open(j, a) !== !1 && f.preventDefault());
        };
        return a = a || {}, b = a.index || 0, e && a.live !== !1 ? g.undelegate(e, "click.fb-start").delegate(e + ":not('.fancybox-item, .fancybox-nav')", "click.fb-start", f) : d.unbind("click.fb-start").bind("click.fb-start", f), 
        this.filter("[data-fancybox-start=1]").trigger("click"), this;
    }, g.ready(function() {
        var b, f;
        c.scrollbarWidth === d && (c.scrollbarWidth = function() {
            var a = c('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo("body"), b = a.children(), d = b.innerWidth() - b.height(99).innerWidth();
            return a.remove(), d;
        }), c.support.fixedPosition === d && (c.support.fixedPosition = function() {
            var a = c('<div style="position:fixed;top:20px;"></div>').appendTo("body"), b = 20 === a[0].offsetTop || 15 === a[0].offsetTop;
            return a.remove(), b;
        }()), c.extend(h.defaults, {
            scrollbarWidth: c.scrollbarWidth(),
            fixed: c.support.fixedPosition,
            parent: c("body")
        }), b = c(a).width(), e.addClass("fancybox-lock-test"), f = c(a).width(), e.removeClass("fancybox-lock-test"), 
        c("<style type='text/css'>.fancybox-margin{margin-right:" + (f - b) + "px;}</style>").appendTo("head");
    });
}(window, document, jQuery), function(a) {
    var b = a.fancybox;
    b.helpers.thumbs = {
        defaults: {
            width: 50,
            height: 50,
            position: "bottom",
            source: function(b) {
                var c;
                return b.element && (c = a(b.element).find("img").attr("src")), !c && "image" === b.type && b.href && (c = b.href), 
                c;
            }
        },
        wrap: null,
        list: null,
        width: 0,
        init: function(b, c) {
            var d, e = this, f = b.width, g = b.height, h = b.source;
            d = "";
            for (var i = 0; i < c.group.length; i++) d += '<li><a style="width:' + f + "px;height:" + g + 'px;" href="javascript:jQuery.fancybox.jumpto(' + i + ');"></a></li>';
            this.wrap = a('<div id="fancybox-thumbs"></div>').addClass(b.position).appendTo("body"), 
            this.list = a("<ul>" + d + "</ul>").appendTo(this.wrap), a.each(c.group, function(b) {
                var d = c.group[b], i = h(d);
                i && a("<img />").load(function() {
                    var c, d, h, i = this.width, j = this.height;
                    e.list && i && j && (c = i / f, d = j / g, h = e.list.children().eq(b).find("a"), 
                    c >= 1 && d >= 1 && (c > d ? (i = Math.floor(i / d), j = g) : (i = f, j = Math.floor(j / c))), 
                    a(this).css({
                        width: i,
                        height: j,
                        top: Math.floor(g / 2 - j / 2),
                        left: Math.floor(f / 2 - i / 2)
                    }), h.width(f).height(g), a(this).hide().appendTo(h).fadeIn(300));
                }).attr("src", i).attr("title", d.title);
            }), this.width = this.list.children().eq(0).outerWidth(!0), this.list.width(this.width * (c.group.length + 1)).css("left", Math.floor(.5 * a(window).width() - (c.index * this.width + .5 * this.width)));
        },
        beforeLoad: function(a, b) {
            return b.group.length < 2 ? void (b.helpers.thumbs = !1) : void (b.margin["top" === a.position ? 0 : 2] += a.height + 15);
        },
        afterShow: function(a, b) {
            this.list ? this.onUpdate(a, b) : this.init(a, b), this.list.children().removeClass("active").eq(b.index).addClass("active");
        },
        onUpdate: function(b, c) {
            this.list && this.list.stop(!0).animate({
                left: Math.floor(.5 * a(window).width() - (c.index * this.width + .5 * this.width))
            }, 150);
        },
        beforeClose: function() {
            this.wrap && this.wrap.remove(), this.wrap = null, this.list = null, this.width = 0;
        }
    };
}(jQuery), function(a) {
    "use strict";
    a.fn.fitVids = function(b) {
        var c = {
            customSelector: null
        };
        if (!document.getElementById("fit-vids-style")) {
            var d = document.createElement("div"), e = document.getElementsByTagName("base")[0] || document.getElementsByTagName("script")[0], f = "&shy;<style>.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}</style>";
            d.className = "fit-vids-style", d.id = "fit-vids-style", d.style.display = "none", 
            d.innerHTML = f, e.parentNode.insertBefore(d, e);
        }
        return b && a.extend(c, b), this.each(function() {
            var b = [ "iframe[src*='player.vimeo.com']", "iframe[src*='youtube.com']", "iframe[src*='youtube-nocookie.com']", "iframe[src*='kickstarter.com'][src*='video.html']", "object", "embed" ];
            c.customSelector && b.push(c.customSelector);
            var d = a(this).find(b.join(","));
            d = d.not("object object"), d.each(function() {
                var b = a(this);
                if (!("embed" === this.tagName.toLowerCase() && b.parent("object").length || b.parent(".fluid-width-video-wrapper").length)) {
                    var c = "object" === this.tagName.toLowerCase() || b.attr("height") && !isNaN(parseInt(b.attr("height"), 10)) ? parseInt(b.attr("height"), 10) : b.height(), d = isNaN(parseInt(b.attr("width"), 10)) ? b.width() : parseInt(b.attr("width"), 10), e = c / d;
                    if (!b.attr("id")) {
                        var f = "fitvid" + Math.floor(999999 * Math.random());
                        b.attr("id", f);
                    }
                    b.wrap('<div class="fluid-width-video-wrapper"></div>').parent(".fluid-width-video-wrapper").css("padding-top", 100 * e + "%"), 
                    b.removeAttr("height").removeAttr("width");
                }
            });
        });
    };
}(window.jQuery || window.Zepto), function(a) {
    a.flexslider = function(b, c) {
        var d = a(b);
        d.vars = a.extend({}, a.flexslider.defaults, c);
        var e, f = d.vars.namespace, g = window.navigator && window.navigator.msPointerEnabled && window.MSGesture, h = ("ontouchstart" in window || g || window.DocumentTouch && document instanceof DocumentTouch) && d.vars.touch, i = "click touchend MSPointerUp keyup", j = "", k = "vertical" === d.vars.direction, l = d.vars.reverse, m = d.vars.itemWidth > 0, n = "fade" === d.vars.animation, o = "" !== d.vars.asNavFor, p = {}, q = !0;
        a.data(b, "flexslider", d), p = {
            init: function() {
                d.animating = !1, d.currentSlide = parseInt(d.vars.startAt ? d.vars.startAt : 0, 10), 
                isNaN(d.currentSlide) && (d.currentSlide = 0), d.animatingTo = d.currentSlide, d.atEnd = 0 === d.currentSlide || d.currentSlide === d.last, 
                d.containerSelector = d.vars.selector.substr(0, d.vars.selector.search(" ")), d.slides = a(d.vars.selector, d), 
                d.container = a(d.containerSelector, d), d.count = d.slides.length, d.syncExists = a(d.vars.sync).length > 0, 
                "slide" === d.vars.animation && (d.vars.animation = "swing"), d.prop = k ? "top" : "marginLeft", 
                d.args = {}, d.manualPause = !1, d.stopped = !1, d.started = !1, d.startTimeout = null, 
                d.transitions = !d.vars.video && !n && d.vars.useCSS && function() {
                    var a = document.createElement("div"), b = [ "perspectiveProperty", "WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective" ];
                    for (var c in b) if (void 0 !== a.style[b[c]]) return d.pfx = b[c].replace("Perspective", "").toLowerCase(), 
                    d.prop = "-" + d.pfx + "-transform", !0;
                    return !1;
                }(), d.ensureAnimationEnd = "", "" !== d.vars.controlsContainer && (d.controlsContainer = a(d.vars.controlsContainer).length > 0 && a(d.vars.controlsContainer)), 
                "" !== d.vars.manualControls && (d.manualControls = a(d.vars.manualControls).length > 0 && a(d.vars.manualControls)), 
                "" !== d.vars.customDirectionNav && (d.customDirectionNav = 2 === a(d.vars.customDirectionNav).length && a(d.vars.customDirectionNav)), 
                d.vars.randomize && (d.slides.sort(function() {
                    return Math.round(Math.random()) - .5;
                }), d.container.empty().append(d.slides)), d.doMath(), d.setup("init"), d.vars.controlNav && p.controlNav.setup(), 
                d.vars.directionNav && p.directionNav.setup(), d.vars.keyboard && (1 === a(d.containerSelector).length || d.vars.multipleKeyboard) && a(document).bind("keyup", function(a) {
                    var b = a.keyCode;
                    if (!d.animating && (39 === b || 37 === b)) {
                        var c = 39 === b ? d.getTarget("next") : 37 === b ? d.getTarget("prev") : !1;
                        d.flexAnimate(c, d.vars.pauseOnAction);
                    }
                }), d.vars.mousewheel && d.bind("mousewheel", function(a, b, c, e) {
                    a.preventDefault();
                    var f = 0 > b ? d.getTarget("next") : d.getTarget("prev");
                    d.flexAnimate(f, d.vars.pauseOnAction);
                }), d.vars.pausePlay && p.pausePlay.setup(), d.vars.slideshow && d.vars.pauseInvisible && p.pauseInvisible.init(), 
                d.vars.slideshow && (d.vars.pauseOnHover && d.hover(function() {
                    d.manualPlay || d.manualPause || d.pause();
                }, function() {
                    d.manualPause || d.manualPlay || d.stopped || d.play();
                }), d.vars.pauseInvisible && p.pauseInvisible.isHidden() || (d.vars.initDelay > 0 ? d.startTimeout = setTimeout(d.play, d.vars.initDelay) : d.play())), 
                o && p.asNav.setup(), h && d.vars.touch && p.touch(), (!n || n && d.vars.smoothHeight) && a(window).bind("resize orientationchange focus", p.resize), 
                d.find("img").attr("draggable", "false"), setTimeout(function() {
                    d.vars.start(d);
                }, 200);
            },
            asNav: {
                setup: function() {
                    d.asNav = !0, d.animatingTo = Math.floor(d.currentSlide / d.move), d.currentItem = d.currentSlide, 
                    d.slides.removeClass(f + "active-slide").eq(d.currentItem).addClass(f + "active-slide"), 
                    g ? (b._slider = d, d.slides.each(function() {
                        var b = this;
                        b._gesture = new MSGesture(), b._gesture.target = b, b.addEventListener("MSPointerDown", function(a) {
                            a.preventDefault(), a.currentTarget._gesture && a.currentTarget._gesture.addPointer(a.pointerId);
                        }, !1), b.addEventListener("MSGestureTap", function(b) {
                            b.preventDefault();
                            var c = a(this), e = c.index();
                            a(d.vars.asNavFor).data("flexslider").animating || c.hasClass("active") || (d.direction = d.currentItem < e ? "next" : "prev", 
                            d.flexAnimate(e, d.vars.pauseOnAction, !1, !0, !0));
                        });
                    })) : d.slides.on(i, function(b) {
                        b.preventDefault();
                        var c = a(this), e = c.index(), g = c.offset().left - a(d).scrollLeft();
                        0 >= g && c.hasClass(f + "active-slide") ? d.flexAnimate(d.getTarget("prev"), !0) : a(d.vars.asNavFor).data("flexslider").animating || c.hasClass(f + "active-slide") || (d.direction = d.currentItem < e ? "next" : "prev", 
                        d.flexAnimate(e, d.vars.pauseOnAction, !1, !0, !0));
                    });
                }
            },
            controlNav: {
                setup: function() {
                    d.manualControls ? p.controlNav.setupManual() : p.controlNav.setupPaging();
                },
                setupPaging: function() {
                    var b, c, e = "thumbnails" === d.vars.controlNav ? "control-thumbs" : "control-paging", g = 1;
                    if (d.controlNavScaffold = a('<ol class="' + f + "control-nav " + f + e + '"></ol>'), 
                    d.pagingCount > 1) for (var h = 0; h < d.pagingCount; h++) {
                        if (c = d.slides.eq(h), b = "thumbnails" === d.vars.controlNav ? '<img src="' + c.attr("data-thumb") + '"/>' : "<a>" + g + "</a>", 
                        "thumbnails" === d.vars.controlNav && !0 === d.vars.thumbCaptions) {
                            var k = c.attr("data-thumbcaption");
                            "" !== k && void 0 !== k && (b += '<span class="' + f + 'caption">' + k + "</span>");
                        }
                        d.controlNavScaffold.append("<li>" + b + "</li>"), g++;
                    }
                    d.controlsContainer ? a(d.controlsContainer).append(d.controlNavScaffold) : d.append(d.controlNavScaffold), 
                    p.controlNav.set(), p.controlNav.active(), d.controlNavScaffold.delegate("a, img", i, function(b) {
                        if (b.preventDefault(), "" === j || j === b.type) {
                            var c = a(this), e = d.controlNav.index(c);
                            c.hasClass(f + "active") || (d.direction = e > d.currentSlide ? "next" : "prev", 
                            d.flexAnimate(e, d.vars.pauseOnAction));
                        }
                        "" === j && (j = b.type), p.setToClearWatchedEvent();
                    });
                },
                setupManual: function() {
                    d.controlNav = d.manualControls, p.controlNav.active(), d.controlNav.bind(i, function(b) {
                        if (b.preventDefault(), "" === j || j === b.type) {
                            var c = a(this), e = d.controlNav.index(c);
                            c.hasClass(f + "active") || (e > d.currentSlide ? d.direction = "next" : d.direction = "prev", 
                            d.flexAnimate(e, d.vars.pauseOnAction));
                        }
                        "" === j && (j = b.type), p.setToClearWatchedEvent();
                    });
                },
                set: function() {
                    var b = "thumbnails" === d.vars.controlNav ? "img" : "a";
                    d.controlNav = a("." + f + "control-nav li " + b, d.controlsContainer ? d.controlsContainer : d);
                },
                active: function() {
                    d.controlNav.removeClass(f + "active").eq(d.animatingTo).addClass(f + "active");
                },
                update: function(b, c) {
                    d.pagingCount > 1 && "add" === b ? d.controlNavScaffold.append(a("<li><a>" + d.count + "</a></li>")) : 1 === d.pagingCount ? d.controlNavScaffold.find("li").remove() : d.controlNav.eq(c).closest("li").remove(), 
                    p.controlNav.set(), d.pagingCount > 1 && d.pagingCount !== d.controlNav.length ? d.update(c, b) : p.controlNav.active();
                }
            },
            directionNav: {
                setup: function() {
                    var b = a('<ul class="' + f + 'direction-nav"><li class="' + f + 'nav-prev"><a class="' + f + 'prev" href="#">' + d.vars.prevText + '</a></li><li class="' + f + 'nav-next"><a class="' + f + 'next" href="#">' + d.vars.nextText + "</a></li></ul>");
                    d.customDirectionNav ? d.directionNav = d.customDirectionNav : d.controlsContainer ? (a(d.controlsContainer).append(b), 
                    d.directionNav = a("." + f + "direction-nav li a", d.controlsContainer)) : (d.append(b), 
                    d.directionNav = a("." + f + "direction-nav li a", d)), p.directionNav.update(), 
                    d.directionNav.bind(i, function(b) {
                        b.preventDefault();
                        var c;
                        ("" === j || j === b.type) && (c = a(this).hasClass(f + "next") ? d.getTarget("next") : d.getTarget("prev"), 
                        d.flexAnimate(c, d.vars.pauseOnAction)), "" === j && (j = b.type), p.setToClearWatchedEvent();
                    });
                },
                update: function() {
                    var a = f + "disabled";
                    1 === d.pagingCount ? d.directionNav.addClass(a).attr("tabindex", "-1") : d.vars.animationLoop ? d.directionNav.removeClass(a).removeAttr("tabindex") : 0 === d.animatingTo ? d.directionNav.removeClass(a).filter("." + f + "prev").addClass(a).attr("tabindex", "-1") : d.animatingTo === d.last ? d.directionNav.removeClass(a).filter("." + f + "next").addClass(a).attr("tabindex", "-1") : d.directionNav.removeClass(a).removeAttr("tabindex");
                }
            },
            pausePlay: {
                setup: function() {
                    var b = a('<div class="' + f + 'pauseplay"><a></a></div>');
                    d.controlsContainer ? (d.controlsContainer.append(b), d.pausePlay = a("." + f + "pauseplay a", d.controlsContainer)) : (d.append(b), 
                    d.pausePlay = a("." + f + "pauseplay a", d)), p.pausePlay.update(d.vars.slideshow ? f + "pause" : f + "play"), 
                    d.pausePlay.bind(i, function(b) {
                        b.preventDefault(), ("" === j || j === b.type) && (a(this).hasClass(f + "pause") ? (d.manualPause = !0, 
                        d.manualPlay = !1, d.pause()) : (d.manualPause = !1, d.manualPlay = !0, d.play())), 
                        "" === j && (j = b.type), p.setToClearWatchedEvent();
                    });
                },
                update: function(a) {
                    "play" === a ? d.pausePlay.removeClass(f + "pause").addClass(f + "play").html(d.vars.playText) : d.pausePlay.removeClass(f + "play").addClass(f + "pause").html(d.vars.pauseText);
                }
            },
            touch: function() {
                function a(a) {
                    a.stopPropagation(), d.animating ? a.preventDefault() : (d.pause(), b._gesture.addPointer(a.pointerId), 
                    w = 0, j = k ? d.h : d.w, p = Number(new Date()), i = m && l && d.animatingTo === d.last ? 0 : m && l ? d.limit - (d.itemW + d.vars.itemMargin) * d.move * d.animatingTo : m && d.currentSlide === d.last ? d.limit : m ? (d.itemW + d.vars.itemMargin) * d.move * d.currentSlide : l ? (d.last - d.currentSlide + d.cloneOffset) * j : (d.currentSlide + d.cloneOffset) * j);
                }
                function c(a) {
                    a.stopPropagation();
                    var c = a.target._slider;
                    if (c) {
                        var d = -a.translationX, e = -a.translationY;
                        return w += k ? e : d, o = w, t = k ? Math.abs(w) < Math.abs(-d) : Math.abs(w) < Math.abs(-e), 
                        a.detail === a.MSGESTURE_FLAG_INERTIA ? void setImmediate(function() {
                            b._gesture.stop();
                        }) : void ((!t || Number(new Date()) - p > 500) && (a.preventDefault(), !n && c.transitions && (c.vars.animationLoop || (o = w / (0 === c.currentSlide && 0 > w || c.currentSlide === c.last && w > 0 ? Math.abs(w) / j + 2 : 1)), 
                        c.setProps(i + o, "setTouch"))));
                    }
                }
                function e(a) {
                    a.stopPropagation();
                    var b = a.target._slider;
                    if (b) {
                        if (b.animatingTo === b.currentSlide && !t && null !== o) {
                            var c = l ? -o : o, d = c > 0 ? b.getTarget("next") : b.getTarget("prev");
                            b.canAdvance(d) && (Number(new Date()) - p < 550 && Math.abs(c) > 50 || Math.abs(c) > j / 2) ? b.flexAnimate(d, b.vars.pauseOnAction) : n || b.flexAnimate(b.currentSlide, b.vars.pauseOnAction, !0);
                        }
                        f = null, h = null, o = null, i = null, w = 0;
                    }
                }
                var f, h, i, j, o, p, q, r, s, t = !1, u = 0, v = 0, w = 0;
                g ? (b.style.msTouchAction = "none", b._gesture = new MSGesture(), b._gesture.target = b, 
                b.addEventListener("MSPointerDown", a, !1), b._slider = d, b.addEventListener("MSGestureChange", c, !1), 
                b.addEventListener("MSGestureEnd", e, !1)) : (q = function(a) {
                    d.animating ? a.preventDefault() : (window.navigator.msPointerEnabled || 1 === a.touches.length) && (d.pause(), 
                    j = k ? d.h : d.w, p = Number(new Date()), u = a.touches[0].pageX, v = a.touches[0].pageY, 
                    i = m && l && d.animatingTo === d.last ? 0 : m && l ? d.limit - (d.itemW + d.vars.itemMargin) * d.move * d.animatingTo : m && d.currentSlide === d.last ? d.limit : m ? (d.itemW + d.vars.itemMargin) * d.move * d.currentSlide : l ? (d.last - d.currentSlide + d.cloneOffset) * j : (d.currentSlide + d.cloneOffset) * j, 
                    f = k ? v : u, h = k ? u : v, b.addEventListener("touchmove", r, !1), b.addEventListener("touchend", s, !1));
                }, r = function(a) {
                    u = a.touches[0].pageX, v = a.touches[0].pageY, o = k ? f - v : f - u, t = k ? Math.abs(o) < Math.abs(u - h) : Math.abs(o) < Math.abs(v - h);
                    var b = 500;
                    (!t || Number(new Date()) - p > b) && (a.preventDefault(), !n && d.transitions && (d.vars.animationLoop || (o /= 0 === d.currentSlide && 0 > o || d.currentSlide === d.last && o > 0 ? Math.abs(o) / j + 2 : 1), 
                    d.setProps(i + o, "setTouch")));
                }, s = function(a) {
                    if (b.removeEventListener("touchmove", r, !1), d.animatingTo === d.currentSlide && !t && null !== o) {
                        var c = l ? -o : o, e = c > 0 ? d.getTarget("next") : d.getTarget("prev");
                        d.canAdvance(e) && (Number(new Date()) - p < 550 && Math.abs(c) > 50 || Math.abs(c) > j / 2) ? d.flexAnimate(e, d.vars.pauseOnAction) : n || d.flexAnimate(d.currentSlide, d.vars.pauseOnAction, !0);
                    }
                    b.removeEventListener("touchend", s, !1), f = null, h = null, o = null, i = null;
                }, b.addEventListener("touchstart", q, !1));
            },
            resize: function() {
                !d.animating && d.is(":visible") && (m || d.doMath(), n ? p.smoothHeight() : m ? (d.slides.width(d.computedW), 
                d.update(d.pagingCount), d.setProps()) : k ? (d.viewport.height(d.h), d.setProps(d.h, "setTotal")) : (d.vars.smoothHeight && p.smoothHeight(), 
                d.newSlides.width(d.computedW), d.setProps(d.computedW, "setTotal")));
            },
            smoothHeight: function(a) {
                if (!k || n) {
                    var b = n ? d : d.viewport;
                    a ? b.animate({
                        height: d.slides.eq(d.animatingTo).height()
                    }, a) : b.height(d.slides.eq(d.animatingTo).height());
                }
            },
            sync: function(b) {
                var c = a(d.vars.sync).data("flexslider"), e = d.animatingTo;
                switch (b) {
                  case "animate":
                    c.flexAnimate(e, d.vars.pauseOnAction, !1, !0);
                    break;

                  case "play":
                    c.playing || c.asNav || c.play();
                    break;

                  case "pause":
                    c.pause();
                }
            },
            uniqueID: function(b) {
                return b.filter("[id]").add(b.find("[id]")).each(function() {
                    var b = a(this);
                    b.attr("id", b.attr("id") + "_clone");
                }), b;
            },
            pauseInvisible: {
                visProp: null,
                init: function() {
                    var a = p.pauseInvisible.getHiddenProp();
                    if (a) {
                        var b = a.replace(/[H|h]idden/, "") + "visibilitychange";
                        document.addEventListener(b, function() {
                            p.pauseInvisible.isHidden() ? d.startTimeout ? clearTimeout(d.startTimeout) : d.pause() : d.started ? d.play() : d.vars.initDelay > 0 ? setTimeout(d.play, d.vars.initDelay) : d.play();
                        });
                    }
                },
                isHidden: function() {
                    var a = p.pauseInvisible.getHiddenProp();
                    return a ? document[a] : !1;
                },
                getHiddenProp: function() {
                    var a = [ "webkit", "moz", "ms", "o" ];
                    if ("hidden" in document) return "hidden";
                    for (var b = 0; b < a.length; b++) if (a[b] + "Hidden" in document) return a[b] + "Hidden";
                    return null;
                }
            },
            setToClearWatchedEvent: function() {
                clearTimeout(e), e = setTimeout(function() {
                    j = "";
                }, 3e3);
            }
        }, d.flexAnimate = function(b, c, e, g, i) {
            if (d.vars.animationLoop || b === d.currentSlide || (d.direction = b > d.currentSlide ? "next" : "prev"), 
            o && 1 === d.pagingCount && (d.direction = d.currentItem < b ? "next" : "prev"), 
            !d.animating && (d.canAdvance(b, i) || e) && d.is(":visible")) {
                if (o && g) {
                    var j = a(d.vars.asNavFor).data("flexslider");
                    if (d.atEnd = 0 === b || b === d.count - 1, j.flexAnimate(b, !0, !1, !0, i), d.direction = d.currentItem < b ? "next" : "prev", 
                    j.direction = d.direction, Math.ceil((b + 1) / d.visible) - 1 === d.currentSlide || 0 === b) return d.currentItem = b, 
                    d.slides.removeClass(f + "active-slide").eq(b).addClass(f + "active-slide"), !1;
                    d.currentItem = b, d.slides.removeClass(f + "active-slide").eq(b).addClass(f + "active-slide"), 
                    b = Math.floor(b / d.visible);
                }
                if (d.animating = !0, d.animatingTo = b, c && d.pause(), d.vars.before(d), d.syncExists && !i && p.sync("animate"), 
                d.vars.controlNav && p.controlNav.active(), m || d.slides.removeClass(f + "active-slide").eq(b).addClass(f + "active-slide"), 
                d.atEnd = 0 === b || b === d.last, d.vars.directionNav && p.directionNav.update(), 
                b === d.last && (d.vars.end(d), d.vars.animationLoop || d.pause()), n) h ? (d.slides.eq(d.currentSlide).css({
                    opacity: 0,
                    zIndex: 1
                }), d.slides.eq(b).css({
                    opacity: 1,
                    zIndex: 2
                }), d.wrapup(t)) : (d.slides.eq(d.currentSlide).css({
                    zIndex: 1
                }).animate({
                    opacity: 0
                }, d.vars.animationSpeed, d.vars.easing), d.slides.eq(b).css({
                    zIndex: 2
                }).animate({
                    opacity: 1
                }, d.vars.animationSpeed, d.vars.easing, d.wrapup)); else {
                    var q, r, s, t = k ? d.slides.filter(":first").height() : d.computedW;
                    m ? (q = d.vars.itemMargin, s = (d.itemW + q) * d.move * d.animatingTo, r = s > d.limit && 1 !== d.visible ? d.limit : s) : r = 0 === d.currentSlide && b === d.count - 1 && d.vars.animationLoop && "next" !== d.direction ? l ? (d.count + d.cloneOffset) * t : 0 : d.currentSlide === d.last && 0 === b && d.vars.animationLoop && "prev" !== d.direction ? l ? 0 : (d.count + 1) * t : l ? (d.count - 1 - b + d.cloneOffset) * t : (b + d.cloneOffset) * t, 
                    d.setProps(r, "", d.vars.animationSpeed), d.transitions ? (d.vars.animationLoop && d.atEnd || (d.animating = !1, 
                    d.currentSlide = d.animatingTo), d.container.unbind("webkitTransitionEnd transitionend"), 
                    d.container.bind("webkitTransitionEnd transitionend", function() {
                        clearTimeout(d.ensureAnimationEnd), d.wrapup(t);
                    }), clearTimeout(d.ensureAnimationEnd), d.ensureAnimationEnd = setTimeout(function() {
                        d.wrapup(t);
                    }, d.vars.animationSpeed + 100)) : d.container.animate(d.args, d.vars.animationSpeed, d.vars.easing, function() {
                        d.wrapup(t);
                    });
                }
                d.vars.smoothHeight && p.smoothHeight(d.vars.animationSpeed);
            }
        }, d.wrapup = function(a) {
            n || m || (0 === d.currentSlide && d.animatingTo === d.last && d.vars.animationLoop ? d.setProps(a, "jumpEnd") : d.currentSlide === d.last && 0 === d.animatingTo && d.vars.animationLoop && d.setProps(a, "jumpStart")), 
            d.animating = !1, d.currentSlide = d.animatingTo, d.vars.after(d);
        }, d.animateSlides = function() {
            !d.animating && q && d.flexAnimate(d.getTarget("next"));
        }, d.pause = function() {
            clearInterval(d.animatedSlides), d.animatedSlides = null, d.playing = !1, d.vars.pausePlay && p.pausePlay.update("play"), 
            d.syncExists && p.sync("pause");
        }, d.play = function() {
            d.playing && clearInterval(d.animatedSlides), d.animatedSlides = d.animatedSlides || setInterval(d.animateSlides, d.vars.slideshowSpeed), 
            d.started = d.playing = !0, d.vars.pausePlay && p.pausePlay.update("pause"), d.syncExists && p.sync("play");
        }, d.stop = function() {
            d.pause(), d.stopped = !0;
        }, d.canAdvance = function(a, b) {
            var c = o ? d.pagingCount - 1 : d.last;
            return b ? !0 : o && d.currentItem === d.count - 1 && 0 === a && "prev" === d.direction ? !0 : o && 0 === d.currentItem && a === d.pagingCount - 1 && "next" !== d.direction ? !1 : a !== d.currentSlide || o ? d.vars.animationLoop ? !0 : d.atEnd && 0 === d.currentSlide && a === c && "next" !== d.direction ? !1 : d.atEnd && d.currentSlide === c && 0 === a && "next" === d.direction ? !1 : !0 : !1;
        }, d.getTarget = function(a) {
            return d.direction = a, "next" === a ? d.currentSlide === d.last ? 0 : d.currentSlide + 1 : 0 === d.currentSlide ? d.last : d.currentSlide - 1;
        }, d.setProps = function(a, b, c) {
            var e = function() {
                var c = a ? a : (d.itemW + d.vars.itemMargin) * d.move * d.animatingTo, e = function() {
                    if (m) return "setTouch" === b ? a : l && d.animatingTo === d.last ? 0 : l ? d.limit - (d.itemW + d.vars.itemMargin) * d.move * d.animatingTo : d.animatingTo === d.last ? d.limit : c;
                    switch (b) {
                      case "setTotal":
                        return l ? (d.count - 1 - d.currentSlide + d.cloneOffset) * a : (d.currentSlide + d.cloneOffset) * a;

                      case "setTouch":
                        return l ? a : a;

                      case "jumpEnd":
                        return l ? a : d.count * a;

                      case "jumpStart":
                        return l ? d.count * a : a;

                      default:
                        return a;
                    }
                }();
                return -1 * e + "px";
            }();
            d.transitions && (e = k ? "translate3d(0," + e + ",0)" : "translate3d(" + e + ",0,0)", 
            c = void 0 !== c ? c / 1e3 + "s" : "0s", d.container.css("-" + d.pfx + "-transition-duration", c), 
            d.container.css("transition-duration", c)), d.args[d.prop] = e, (d.transitions || void 0 === c) && d.container.css(d.args), 
            d.container.css("transform", e);
        }, d.setup = function(b) {
            if (n) d.slides.css({
                width: "100%",
                "float": "left",
                marginRight: "-100%",
                position: "relative"
            }), "init" === b && (h ? d.slides.css({
                opacity: 0,
                display: "block",
                webkitTransition: "opacity " + d.vars.animationSpeed / 1e3 + "s ease",
                zIndex: 1
            }).eq(d.currentSlide).css({
                opacity: 1,
                zIndex: 2
            }) : 0 == d.vars.fadeFirstSlide ? d.slides.css({
                opacity: 0,
                display: "block",
                zIndex: 1
            }).eq(d.currentSlide).css({
                zIndex: 2
            }).css({
                opacity: 1
            }) : d.slides.css({
                opacity: 0,
                display: "block",
                zIndex: 1
            }).eq(d.currentSlide).css({
                zIndex: 2
            }).animate({
                opacity: 1
            }, d.vars.animationSpeed, d.vars.easing)), d.vars.smoothHeight && p.smoothHeight(); else {
                var c, e;
                "init" === b && (d.viewport = a('<div class="' + f + 'viewport"></div>').css({
                    overflow: "hidden",
                    position: "relative"
                }).appendTo(d).append(d.container), d.cloneCount = 0, d.cloneOffset = 0, l && (e = a.makeArray(d.slides).reverse(), 
                d.slides = a(e), d.container.empty().append(d.slides))), d.vars.animationLoop && !m && (d.cloneCount = 2, 
                d.cloneOffset = 1, "init" !== b && d.container.find(".clone").remove(), d.container.append(p.uniqueID(d.slides.first().clone().addClass("clone")).attr("aria-hidden", "true")).prepend(p.uniqueID(d.slides.last().clone().addClass("clone")).attr("aria-hidden", "true"))), 
                d.newSlides = a(d.vars.selector, d), c = l ? d.count - 1 - d.currentSlide + d.cloneOffset : d.currentSlide + d.cloneOffset, 
                k && !m ? (d.container.height(200 * (d.count + d.cloneCount) + "%").css("position", "absolute").width("100%"), 
                setTimeout(function() {
                    d.newSlides.css({
                        display: "block"
                    }), d.doMath(), d.viewport.height(d.h), d.setProps(c * d.h, "init");
                }, "init" === b ? 100 : 0)) : (d.container.width(200 * (d.count + d.cloneCount) + "%"), 
                d.setProps(c * d.computedW, "init"), setTimeout(function() {
                    d.doMath(), d.newSlides.css({
                        width: d.computedW,
                        "float": "left",
                        display: "block"
                    }), d.vars.smoothHeight && p.smoothHeight();
                }, "init" === b ? 100 : 0));
            }
            m || d.slides.removeClass(f + "active-slide").eq(d.currentSlide).addClass(f + "active-slide"), 
            d.vars.init(d);
        }, d.doMath = function() {
            var a = d.slides.first(), b = d.vars.itemMargin, c = d.vars.minItems, e = d.vars.maxItems;
            d.w = void 0 === d.viewport ? d.width() : d.viewport.width(), d.h = a.height(), 
            d.boxPadding = a.outerWidth() - a.width(), m ? (d.itemT = d.vars.itemWidth + b, 
            d.minW = c ? c * d.itemT : d.w, d.maxW = e ? e * d.itemT - b : d.w, d.itemW = d.minW > d.w ? (d.w - b * (c - 1)) / c : d.maxW < d.w ? (d.w - b * (e - 1)) / e : d.vars.itemWidth > d.w ? d.w : d.vars.itemWidth, 
            d.visible = Math.floor(d.w / d.itemW), d.move = d.vars.move > 0 && d.vars.move < d.visible ? d.vars.move : d.visible, 
            d.pagingCount = Math.ceil((d.count - d.visible) / d.move + 1), d.last = d.pagingCount - 1, 
            d.limit = 1 === d.pagingCount ? 0 : d.vars.itemWidth > d.w ? d.itemW * (d.count - 1) + b * (d.count - 1) : (d.itemW + b) * d.count - d.w - b) : (d.itemW = d.w, 
            d.pagingCount = d.count, d.last = d.count - 1), d.computedW = d.itemW - d.boxPadding;
        }, d.update = function(a, b) {
            d.doMath(), m || (a < d.currentSlide ? d.currentSlide += 1 : a <= d.currentSlide && 0 !== a && (d.currentSlide -= 1), 
            d.animatingTo = d.currentSlide), d.vars.controlNav && !d.manualControls && ("add" === b && !m || d.pagingCount > d.controlNav.length ? p.controlNav.update("add") : ("remove" === b && !m || d.pagingCount < d.controlNav.length) && (m && d.currentSlide > d.last && (d.currentSlide -= 1, 
            d.animatingTo -= 1), p.controlNav.update("remove", d.last))), d.vars.directionNav && p.directionNav.update();
        }, d.addSlide = function(b, c) {
            var e = a(b);
            d.count += 1, d.last = d.count - 1, k && l ? void 0 !== c ? d.slides.eq(d.count - c).after(e) : d.container.prepend(e) : void 0 !== c ? d.slides.eq(c).before(e) : d.container.append(e), 
            d.update(c, "add"), d.slides = a(d.vars.selector + ":not(.clone)", d), d.setup(), 
            d.vars.added(d);
        }, d.removeSlide = function(b) {
            var c = isNaN(b) ? d.slides.index(a(b)) : b;
            d.count -= 1, d.last = d.count - 1, isNaN(b) ? a(b, d.slides).remove() : k && l ? d.slides.eq(d.last).remove() : d.slides.eq(b).remove(), 
            d.doMath(), d.update(c, "remove"), d.slides = a(d.vars.selector + ":not(.clone)", d), 
            d.setup(), d.vars.removed(d);
        }, p.init();
    }, a(window).blur(function(a) {
        focused = !1;
    }).focus(function(a) {
        focused = !0;
    }), a.flexslider.defaults = {
        namespace: "flex-",
        selector: ".slides > li",
        animation: "fade",
        easing: "swing",
        direction: "horizontal",
        reverse: !1,
        animationLoop: !0,
        smoothHeight: !1,
        startAt: 0,
        slideshow: !0,
        slideshowSpeed: 7e3,
        animationSpeed: 600,
        initDelay: 0,
        randomize: !1,
        fadeFirstSlide: !0,
        thumbCaptions: !1,
        pauseOnAction: !0,
        pauseOnHover: !1,
        pauseInvisible: !0,
        useCSS: !0,
        touch: !0,
        video: !1,
        controlNav: !0,
        directionNav: !0,
        prevText: "Previous",
        nextText: "Next",
        keyboard: !0,
        multipleKeyboard: !1,
        mousewheel: !1,
        pausePlay: !1,
        pauseText: "Pause",
        playText: "Play",
        controlsContainer: "",
        manualControls: "",
        customDirectionNav: "",
        sync: "",
        asNavFor: "",
        itemWidth: 0,
        itemMargin: 0,
        minItems: 1,
        maxItems: 0,
        move: 0,
        allowOneSlide: !0,
        start: function() {},
        before: function() {},
        after: function() {},
        end: function() {},
        added: function() {},
        removed: function() {},
        init: function() {}
    }, a.fn.flexslider = function(b) {
        if (void 0 === b && (b = {}), "object" == typeof b) return this.each(function() {
            var c = a(this), d = b.selector ? b.selector : ".slides > li", e = c.find(d);
            1 === e.length && b.allowOneSlide === !0 || 0 === e.length ? (e.fadeIn(400), b.start && b.start(c)) : void 0 === c.data("flexslider") && new a.flexslider(this, b);
        });
        var c = a(this).data("flexslider");
        switch (b) {
          case "play":
            c.play();
            break;

          case "pause":
            c.pause();
            break;

          case "stop":
            c.stop();
            break;

          case "next":
            c.flexAnimate(c.getTarget("next"), !0);
            break;

          case "prev":
          case "previous":
            c.flexAnimate(c.getTarget("prev"), !0);
            break;

          default:
            "number" == typeof b && c.flexAnimate(b, !0);
        }
    };
}(jQuery), function(a, b, c) {
    function d(a, b) {
        var d = document.getElementById(a), e = d ? d.value : c;
        return e ? e : b;
    }
    function e() {
        return {
            Header: d("search-header", ""),
            Term: d("search-term", l),
            Page: d("search-page", m),
            Type: d("search-type", n),
            Max: d("search-page-size", o),
            FacetType: d("search-facet-type", p),
            FacetContentType: d("search-facet-contenttype", p),
            FacetCategories: d("search-facet-categories", p),
            FacetLocation: d("search-facet-location", p),
            FacetIndustry: d("search-facet-industries", p),
            FacetPurpose: d("search-facet-purposes", p),
            FacetPubDate: d("search-facet-pubdate", p),
            Partial: d("search-partial", q),
            Filter1: d("search-filter1", p),
            Filter2: d("search-filter2", p),
            Filter3: d("search-filter3", p),
            AudienceType: d("search-audience-type", p),
            AutoSearch: d("search-auto-search", !1)
        };
    }
    function f() {
        document.getElementById("search-page").value = m;
    }
    function g() {
        var a = document.getElementById("search-update-history");
        return a && a.value ? !0 : !1;
    }
    function h() {
        document.getElementById("search-facet-type").value = p, document.getElementById("search-facet-contenttype").value = p, 
        document.getElementById("search-facet-categories").value = p, document.getElementById("search-facet-location").value = p, 
        document.getElementById("search-facet-industries").value = p, document.getElementById("search-facet-purposes").value = p, 
        document.getElementById("search-facet-pubdate").value = p;
    }
    function i() {
        b("#search-results").html('<div class="loader2">Loading...</div>'), b(".ab-search-results").hide();
    }
    function j(a) {
        var b = "";
        for (var c in a) a.hasOwnProperty(c) && a[c] && (b = b + c.toLowerCase() + "=" + a[c] + "&");
        return {
            pageTitle: "Search Results",
            pageUrl: "/search?" + b
        };
    }
    function k(a) {
        var c = e();
        c.Term && c.Term.length > 0 && ("*" !== c.Term || "yes" == c.AutoSearch) ? (i(), 
        b.ajax({
            url: "/search/results",
            type: "GET",
            data: c,
            processData: !0,
            cache: !0
        }).done(function(d) {
            if (b("#search-results").html(d), b(".select-navigate").find(".active").attr("selected", "selected"), 
            b(".article-list .case-study").on("click", function() {
                b(this).append('<div class="loader2" style="top: 40%; margin: 0 auto; z-index: 999;"></div>');
            }), console.log("performed search"), b(".search-paging").length) {
                var e = "#search-results", f = b(e);
                b("html, body").stop().animate({
                    scrollTop: f.offset().top
                }, 500, "swing", function() {
                    window.location.hash = e;
                });
            }
            if (a) {
                console.log("update state");
                var g = j(c);
                history.pushState(c, g.pageTitle, g.pageUrl);
            }
        }).always(function() {})) : setNoSearch();
    }
    var l = "*", m = 1, n = "all", o = 20, p = "", q = "_Results";
    b("#search-button").on("click", function(b) {
        b.preventDefault(), a.doSearch(!0, !0);
    }), a.doSearch = function(a, b) {
        a && f(), b && h();
        var c = g();
        k(c);
    }, a.selectPagingList = function(a) {
        var b = d("search-page", m), c = a.dataset.page;
        switch (c) {
          case "next":
            c = parseInt(b) + 1;
            break;

          case "previous":
            c = parseInt(b) - 1;
        }
        0 >= c && (c = m), document.getElementById("search-page").value = c;
    }, a.selectPageSize = function(a) {
        document.getElementById("search-page-size").value = parseInt(a);
    }, a.selectPagingSelect = function(a) {
        document.getElementById("search-page").value = a.value;
    }, a.setStateAndSearch = function(a) {
        document.getElementById("search-term").value = a.Term, document.getElementById("search-page").value = a.Page, 
        document.getElementById("search-type").value = a.Type, document.getElementById("search-page-size").value = a.Max, 
        document.getElementById("search-facet-type").value = a.FacetType, document.getElementById("search-facet-categories").value = a.FacetCategories, 
        document.getElementById("search-facet-location").value = a.FacetLocation, document.getElementById("search-facet-industries").value = a.FacetIndustry, 
        document.getElementById("search-facet-purposes").value = a.FacetPurposes, document.getElementById("search-facet-pubdate").value = a.FacetPubDate, 
        console.log("rebuilding state: " + a), k(!1);
    };
}(window.gwrsearch = window.gwrsearch || {}, jQuery), function(a) {
    a && (a.fn.headroom = function(b) {
        return this.each(function() {
            var c = a(this), d = c.data("headroom"), e = "object" == typeof b && b;
            e = a.extend(!0, {}, Headroom.options, e), d || (d = new Headroom(this, e), d.init(), 
            c.data("headroom", d)), "string" == typeof b && d[b]();
        });
    }, a("[data-headroom]").each(function() {
        var b = a(this);
        b.headroom(b.data());
    }));
}(window.Zepto || window.jQuery), !function(a) {
    jQuery.fn.jsTabs = function(b) {
        return b = a.extend({
            onChange: function() {},
            onReady: function() {}
        }, b), this.each(function(c) {
            var d = a(this);
            if (d.length > 0) {
                var e = d.find("a"), f = a(), g = 0;
                e.each(function(b) {
                    $tabLink = a(this), $tabLinkParent = $tabLink.parent("li"), $tabPanel = a($tabLink.attr("href").substring($tabLink.attr("href").indexOf("#"))), 
                    f = f.add($tabPanel), $tabLinkParent.hasClass("active") && (g = b);
                }), e.on("click.jsTabs", function(c) {
                    c.preventDefault(), $tabLink = a(this), $tabLinkParent = $tabLink.parent("li"), 
                    $tabPanel = a($tabLink.attr("href").substring($tabLink.attr("href").indexOf("#"))), 
                    e.removeClass("active"), d.find("li").removeClass("active"), f.removeClass("in"), 
                    $tabLinkParent.length > 0 ? $tabLinkParent.addClass("active") : $tabLink.addClass("active"), 
                    $tabPanel.addClass("in"), b.onChange();
                }), e.eq(g).trigger("click.jsTabs"), b.onReady();
            }
        });
    };
}(window.jQuery), function(a, b, c, d) {
    function e(b, c) {
        this.settings = null, this.options = a.extend({}, e.Defaults, c), this.$element = a(b), 
        this.drag = a.extend({}, m), this.state = a.extend({}, n), this.e = a.extend({}, o), 
        this._plugins = {}, this._supress = {}, this._current = null, this._speed = null, 
        this._coordinates = [], this._breakpoint = null, this._width = null, this._items = [], 
        this._clones = [], this._mergers = [], this._invalidated = {}, this._pipe = [], 
        a.each(e.Plugins, a.proxy(function(a, b) {
            this._plugins[a[0].toLowerCase() + a.slice(1)] = new b(this);
        }, this)), a.each(e.Pipe, a.proxy(function(b, c) {
            this._pipe.push({
                filter: c.filter,
                run: a.proxy(c.run, this)
            });
        }, this)), this.setup(), this.initialize();
    }
    function f(a) {
        if (a.touches !== d) return {
            x: a.touches[0].pageX,
            y: a.touches[0].pageY
        };
        if (a.touches === d) {
            if (a.pageX !== d) return {
                x: a.pageX,
                y: a.pageY
            };
            if (a.pageX === d) return {
                x: a.clientX,
                y: a.clientY
            };
        }
    }
    function g(a) {
        var b, d, e = c.createElement("div"), f = a;
        for (b in f) if (d = f[b], "undefined" != typeof e.style[d]) return e = null, [ d, b ];
        return [ !1 ];
    }
    function h() {
        return g([ "transition", "WebkitTransition", "MozTransition", "OTransition" ])[1];
    }
    function i() {
        return g([ "transform", "WebkitTransform", "MozTransform", "OTransform", "msTransform" ])[0];
    }
    function j() {
        return g([ "perspective", "webkitPerspective", "MozPerspective", "OPerspective", "MsPerspective" ])[0];
    }
    function k() {
        return "ontouchstart" in b || !!navigator.msMaxTouchPoints;
    }
    function l() {
        return b.navigator.msPointerEnabled;
    }
    var m, n, o;
    m = {
        start: 0,
        startX: 0,
        startY: 0,
        current: 0,
        currentX: 0,
        currentY: 0,
        offsetX: 0,
        offsetY: 0,
        distance: null,
        startTime: 0,
        endTime: 0,
        updatedX: 0,
        targetEl: null
    }, n = {
        isTouch: !1,
        isScrolling: !1,
        isSwiping: !1,
        direction: !1,
        inMotion: !1
    }, o = {
        _onDragStart: null,
        _onDragMove: null,
        _onDragEnd: null,
        _transitionEnd: null,
        _resizer: null,
        _responsiveCall: null,
        _goToLoop: null,
        _checkVisibile: null
    }, e.Defaults = {
        items: 3,
        loop: !1,
        center: !1,
        mouseDrag: !0,
        touchDrag: !0,
        pullDrag: !0,
        freeDrag: !1,
        margin: 0,
        stagePadding: 0,
        merge: !1,
        mergeFit: !0,
        autoWidth: !1,
        startPosition: 0,
        rtl: !1,
        smartSpeed: 250,
        fluidSpeed: !1,
        dragEndSpeed: !1,
        responsive: {},
        responsiveRefreshRate: 200,
        responsiveBaseElement: b,
        responsiveClass: !1,
        fallbackEasing: "swing",
        info: !1,
        nestedItemSelector: !1,
        itemElement: "div",
        stageElement: "div",
        themeClass: "owl-theme",
        baseClass: "owl-carousel",
        itemClass: "owl-item",
        centerClass: "center",
        activeClass: "active"
    }, e.Width = {
        Default: "default",
        Inner: "inner",
        Outer: "outer"
    }, e.Plugins = {}, e.Pipe = [ {
        filter: [ "width", "items", "settings" ],
        run: function(a) {
            a.current = this._items && this._items[this.relative(this._current)];
        }
    }, {
        filter: [ "items", "settings" ],
        run: function() {
            var a = this._clones, b = this.$stage.children(".cloned");
            (b.length !== a.length || !this.settings.loop && a.length > 0) && (this.$stage.children(".cloned").remove(), 
            this._clones = []);
        }
    }, {
        filter: [ "items", "settings" ],
        run: function() {
            var a, b, c = this._clones, d = this._items, e = this.settings.loop ? c.length - Math.max(2 * this.settings.items, 2) : 0;
            for (a = 0, b = Math.abs(e / 2); b > a; a++) e > 0 ? (this.$stage.children().eq(d.length + c.length - 1).remove(), 
            c.pop(), this.$stage.children().eq(0).remove(), c.pop()) : (c.push(c.length / 2), 
            this.$stage.append(d[c[c.length - 1]].clone().addClass("cloned")), c.push(d.length - 1 - (c.length - 1) / 2), 
            this.$stage.prepend(d[c[c.length - 1]].clone().addClass("cloned")));
        }
    }, {
        filter: [ "width", "items", "settings" ],
        run: function() {
            var a, b, c, d = this.settings.rtl ? 1 : -1, e = (this.width() / this.settings.items).toFixed(3), f = 0;
            for (this._coordinates = [], b = 0, c = this._clones.length + this._items.length; c > b; b++) a = this._mergers[this.relative(b)], 
            a = this.settings.mergeFit && Math.min(a, this.settings.items) || a, f += (this.settings.autoWidth ? this._items[this.relative(b)].width() + this.settings.margin : e * a) * d, 
            this._coordinates.push(f);
        }
    }, {
        filter: [ "width", "items", "settings" ],
        run: function() {
            var b, c, d = (this.width() / this.settings.items).toFixed(3), e = {
                width: Math.abs(this._coordinates[this._coordinates.length - 1]) + 2 * this.settings.stagePadding,
                "padding-left": this.settings.stagePadding || "",
                "padding-right": this.settings.stagePadding || ""
            };
            if (this.$stage.css(e), e = {
                width: this.settings.autoWidth ? "auto" : d - this.settings.margin
            }, e[this.settings.rtl ? "margin-left" : "margin-right"] = this.settings.margin, 
            !this.settings.autoWidth && a.grep(this._mergers, function(a) {
                return a > 1;
            }).length > 0) for (b = 0, c = this._coordinates.length; c > b; b++) e.width = Math.abs(this._coordinates[b]) - Math.abs(this._coordinates[b - 1] || 0) - this.settings.margin, 
            this.$stage.children().eq(b).css(e); else this.$stage.children().css(e);
        }
    }, {
        filter: [ "width", "items", "settings" ],
        run: function(a) {
            a.current && this.reset(this.$stage.children().index(a.current));
        }
    }, {
        filter: [ "position" ],
        run: function() {
            this.animate(this.coordinates(this._current));
        }
    }, {
        filter: [ "width", "position", "items", "settings" ],
        run: function() {
            var a, b, c, d, e = this.settings.rtl ? 1 : -1, f = 2 * this.settings.stagePadding, g = this.coordinates(this.current()) + f, h = g + this.width() * e, i = [];
            for (c = 0, d = this._coordinates.length; d > c; c++) a = this._coordinates[c - 1] || 0, 
            b = Math.abs(this._coordinates[c]) + f * e, (this.op(a, "<=", g) && this.op(a, ">", h) || this.op(b, "<", g) && this.op(b, ">", h)) && i.push(c);
            this.$stage.children("." + this.settings.activeClass).removeClass(this.settings.activeClass), 
            this.$stage.children(":eq(" + i.join("), :eq(") + ")").addClass(this.settings.activeClass), 
            this.settings.center && (this.$stage.children("." + this.settings.centerClass).removeClass(this.settings.centerClass), 
            this.$stage.children().eq(this.current()).addClass(this.settings.centerClass));
        }
    } ], e.prototype.initialize = function() {
        if (this.trigger("initialize"), this.$element.addClass(this.settings.baseClass).addClass(this.settings.themeClass).toggleClass("owl-rtl", this.settings.rtl), 
        this.browserSupport(), this.settings.autoWidth && this.state.imagesLoaded !== !0) {
            var b, c, e;
            if (b = this.$element.find("img"), c = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : d, 
            e = this.$element.children(c).width(), b.length && 0 >= e) return this.preloadAutoWidthImages(b), 
            !1;
        }
        this.$element.addClass("owl-loading"), this.$stage = a("<" + this.settings.stageElement + ' class="owl-stage"/>').wrap('<div class="owl-stage-outer">'), 
        this.$element.append(this.$stage.parent()), this.replace(this.$element.children().not(this.$stage.parent())), 
        this._width = this.$element.width(), this.refresh(), this.$element.removeClass("owl-loading").addClass("owl-loaded"), 
        this.eventsCall(), this.internalEvents(), this.addTriggerableEvents(), this.trigger("initialized");
    }, e.prototype.setup = function() {
        var b = this.viewport(), c = this.options.responsive, d = -1, e = null;
        c ? (a.each(c, function(a) {
            b >= a && a > d && (d = Number(a));
        }), e = a.extend({}, this.options, c[d]), delete e.responsive, e.responsiveClass && this.$element.attr("class", function(a, b) {
            return b.replace(/\b owl-responsive-\S+/g, "");
        }).addClass("owl-responsive-" + d)) : e = a.extend({}, this.options), (null === this.settings || this._breakpoint !== d) && (this.trigger("change", {
            property: {
                name: "settings",
                value: e
            }
        }), this._breakpoint = d, this.settings = e, this.invalidate("settings"), this.trigger("changed", {
            property: {
                name: "settings",
                value: this.settings
            }
        }));
    }, e.prototype.optionsLogic = function() {
        this.$element.toggleClass("owl-center", this.settings.center), this.settings.loop && this._items.length < this.settings.items && (this.settings.loop = !1), 
        this.settings.autoWidth && (this.settings.stagePadding = !1, this.settings.merge = !1);
    }, e.prototype.prepare = function(b) {
        var c = this.trigger("prepare", {
            content: b
        });
        return c.data || (c.data = a("<" + this.settings.itemElement + "/>").addClass(this.settings.itemClass).append(b)), 
        this.trigger("prepared", {
            content: c.data
        }), c.data;
    }, e.prototype.update = function() {
        for (var b = 0, c = this._pipe.length, d = a.proxy(function(a) {
            return this[a];
        }, this._invalidated), e = {}; c > b; ) (this._invalidated.all || a.grep(this._pipe[b].filter, d).length > 0) && this._pipe[b].run(e), 
        b++;
        this._invalidated = {};
    }, e.prototype.width = function(a) {
        switch (a = a || e.Width.Default) {
          case e.Width.Inner:
          case e.Width.Outer:
            return this._width;

          default:
            return this._width - 2 * this.settings.stagePadding + this.settings.margin;
        }
    }, e.prototype.refresh = function() {
        if (0 === this._items.length) return !1;
        new Date().getTime();
        this.trigger("refresh"), this.setup(), this.optionsLogic(), this.$stage.addClass("owl-refresh"), 
        this.update(), this.$stage.removeClass("owl-refresh"), this.state.orientation = b.orientation, 
        this.watchVisibility(), this.trigger("refreshed");
    }, e.prototype.eventsCall = function() {
        this.e._onDragStart = a.proxy(function(a) {
            this.onDragStart(a);
        }, this), this.e._onDragMove = a.proxy(function(a) {
            this.onDragMove(a);
        }, this), this.e._onDragEnd = a.proxy(function(a) {
            this.onDragEnd(a);
        }, this), this.e._onResize = a.proxy(function(a) {
            this.onResize(a);
        }, this), this.e._transitionEnd = a.proxy(function(a) {
            this.transitionEnd(a);
        }, this), this.e._preventClick = a.proxy(function(a) {
            this.preventClick(a);
        }, this);
    }, e.prototype.onThrottledResize = function() {
        b.clearTimeout(this.resizeTimer), this.resizeTimer = b.setTimeout(this.e._onResize, this.settings.responsiveRefreshRate);
    }, e.prototype.onResize = function() {
        return this._items.length ? this._width === this.$element.width() ? !1 : this.trigger("resize").isDefaultPrevented() ? !1 : (this._width = this.$element.width(), 
        this.invalidate("width"), this.refresh(), void this.trigger("resized")) : !1;
    }, e.prototype.eventsRouter = function(a) {
        var b = a.type;
        "mousedown" === b || "touchstart" === b ? this.onDragStart(a) : "mousemove" === b || "touchmove" === b ? this.onDragMove(a) : "mouseup" === b || "touchend" === b ? this.onDragEnd(a) : "touchcancel" === b && this.onDragEnd(a);
    }, e.prototype.internalEvents = function() {
        var c = (k(), l());
        this.settings.mouseDrag ? (this.$stage.on("mousedown", a.proxy(function(a) {
            this.eventsRouter(a);
        }, this)), this.$stage.on("dragstart", function() {
            return !1;
        }), this.$stage.get(0).onselectstart = function() {
            return !1;
        }) : this.$element.addClass("owl-text-select-on"), this.settings.touchDrag && !c && this.$stage.on("touchstart touchcancel", a.proxy(function(a) {
            this.eventsRouter(a);
        }, this)), this.transitionEndVendor && this.on(this.$stage.get(0), this.transitionEndVendor, this.e._transitionEnd, !1), 
        this.settings.responsive !== !1 && this.on(b, "resize", a.proxy(this.onThrottledResize, this));
    }, e.prototype.onDragStart = function(d) {
        var e, g, h, i;
        if (e = d.originalEvent || d || b.event, 3 === e.which || this.state.isTouch) return !1;
        if ("mousedown" === e.type && this.$stage.addClass("owl-grab"), this.trigger("drag"), 
        this.drag.startTime = new Date().getTime(), this.speed(0), this.state.isTouch = !0, 
        this.state.isScrolling = !1, this.state.isSwiping = !1, this.drag.distance = 0, 
        g = f(e).x, h = f(e).y, this.drag.offsetX = this.$stage.position().left, this.drag.offsetY = this.$stage.position().top, 
        this.settings.rtl && (this.drag.offsetX = this.$stage.position().left + this.$stage.width() - this.width() + this.settings.margin), 
        this.state.inMotion && this.support3d) i = this.getTransformProperty(), this.drag.offsetX = i, 
        this.animate(i), this.state.inMotion = !0; else if (this.state.inMotion && !this.support3d) return this.state.inMotion = !1, 
        !1;
        this.drag.startX = g - this.drag.offsetX, this.drag.startY = h - this.drag.offsetY, 
        this.drag.start = g - this.drag.startX, this.drag.targetEl = e.target || e.srcElement, 
        this.drag.updatedX = this.drag.start, ("IMG" === this.drag.targetEl.tagName || "A" === this.drag.targetEl.tagName) && (this.drag.targetEl.draggable = !1), 
        a(c).on("mousemove.owl.dragEvents mouseup.owl.dragEvents touchmove.owl.dragEvents touchend.owl.dragEvents", a.proxy(function(a) {
            this.eventsRouter(a);
        }, this));
    }, e.prototype.onDragMove = function(a) {
        var c, e, g, h, i, j;
        this.state.isTouch && (this.state.isScrolling || (c = a.originalEvent || a || b.event, 
        e = f(c).x, g = f(c).y, this.drag.currentX = e - this.drag.startX, this.drag.currentY = g - this.drag.startY, 
        this.drag.distance = this.drag.currentX - this.drag.offsetX, this.drag.distance < 0 ? this.state.direction = this.settings.rtl ? "right" : "left" : this.drag.distance > 0 && (this.state.direction = this.settings.rtl ? "left" : "right"), 
        this.settings.loop ? this.op(this.drag.currentX, ">", this.coordinates(this.minimum())) && "right" === this.state.direction ? this.drag.currentX -= (this.settings.center && this.coordinates(0)) - this.coordinates(this._items.length) : this.op(this.drag.currentX, "<", this.coordinates(this.maximum())) && "left" === this.state.direction && (this.drag.currentX += (this.settings.center && this.coordinates(0)) - this.coordinates(this._items.length)) : (h = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum()), 
        i = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum()), 
        j = this.settings.pullDrag ? this.drag.distance / 5 : 0, this.drag.currentX = Math.max(Math.min(this.drag.currentX, h + j), i + j)), 
        (this.drag.distance > 8 || this.drag.distance < -8) && (c.preventDefault !== d ? c.preventDefault() : c.returnValue = !1, 
        this.state.isSwiping = !0), this.drag.updatedX = this.drag.currentX, (this.drag.currentY > 16 || this.drag.currentY < -16) && this.state.isSwiping === !1 && (this.state.isScrolling = !0, 
        this.drag.updatedX = this.drag.start), this.animate(this.drag.updatedX)));
    }, e.prototype.onDragEnd = function(b) {
        var d, e, f;
        if (this.state.isTouch) {
            if ("mouseup" === b.type && this.$stage.removeClass("owl-grab"), this.trigger("dragged"), 
            this.drag.targetEl.removeAttribute("draggable"), this.state.isTouch = !1, this.state.isScrolling = !1, 
            this.state.isSwiping = !1, 0 === this.drag.distance && this.state.inMotion !== !0) return this.state.inMotion = !1, 
            !1;
            this.drag.endTime = new Date().getTime(), d = this.drag.endTime - this.drag.startTime, 
            e = Math.abs(this.drag.distance), (e > 3 || d > 300) && this.removeClick(this.drag.targetEl), 
            f = this.closest(this.drag.updatedX), this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed), 
            this.current(f), this.invalidate("position"), this.update(), this.settings.pullDrag || this.drag.updatedX !== this.coordinates(f) || this.transitionEnd(), 
            this.drag.distance = 0, a(c).off(".owl.dragEvents");
        }
    }, e.prototype.removeClick = function(c) {
        this.drag.targetEl = c, a(c).on("click.preventClick", this.e._preventClick), b.setTimeout(function() {
            a(c).off("click.preventClick");
        }, 300);
    }, e.prototype.preventClick = function(b) {
        b.preventDefault ? b.preventDefault() : b.returnValue = !1, b.stopPropagation && b.stopPropagation(), 
        a(b.target).off("click.preventClick");
    }, e.prototype.getTransformProperty = function() {
        var a, c;
        return a = b.getComputedStyle(this.$stage.get(0), null).getPropertyValue(this.vendorName + "transform"), 
        a = a.replace(/matrix(3d)?\(|\)/g, "").split(","), c = 16 === a.length, c !== !0 ? a[4] : a[12];
    }, e.prototype.closest = function(b) {
        var c = -1, d = 30, e = this.width(), f = this.coordinates();
        return this.settings.freeDrag || a.each(f, a.proxy(function(a, g) {
            return b > g - d && g + d > b ? c = a : this.op(b, "<", g) && this.op(b, ">", f[a + 1] || g - e) && (c = "left" === this.state.direction ? a + 1 : a), 
            -1 === c;
        }, this)), this.settings.loop || (this.op(b, ">", f[this.minimum()]) ? c = b = this.minimum() : this.op(b, "<", f[this.maximum()]) && (c = b = this.maximum())), 
        c;
    }, e.prototype.animate = function(b) {
        this.trigger("translate"), this.state.inMotion = this.speed() > 0, this.support3d ? this.$stage.css({
            transform: "translate3d(" + b + "px,0px, 0px)",
            transition: this.speed() / 1e3 + "s"
        }) : this.state.isTouch ? this.$stage.css({
            left: b + "px"
        }) : this.$stage.animate({
            left: b
        }, this.speed() / 1e3, this.settings.fallbackEasing, a.proxy(function() {
            this.state.inMotion && this.transitionEnd();
        }, this));
    }, e.prototype.current = function(a) {
        if (a === d) return this._current;
        if (0 === this._items.length) return d;
        if (a = this.normalize(a), this._current !== a) {
            var b = this.trigger("change", {
                property: {
                    name: "position",
                    value: a
                }
            });
            b.data !== d && (a = this.normalize(b.data)), this._current = a, this.invalidate("position"), 
            this.trigger("changed", {
                property: {
                    name: "position",
                    value: this._current
                }
            });
        }
        return this._current;
    }, e.prototype.invalidate = function(a) {
        this._invalidated[a] = !0;
    }, e.prototype.reset = function(a) {
        a = this.normalize(a), a !== d && (this._speed = 0, this._current = a, this.suppress([ "translate", "translated" ]), 
        this.animate(this.coordinates(a)), this.release([ "translate", "translated" ]));
    }, e.prototype.normalize = function(b, c) {
        var e = c ? this._items.length : this._items.length + this._clones.length;
        return !a.isNumeric(b) || 1 > e ? d : b = this._clones.length ? (b % e + e) % e : Math.max(this.minimum(c), Math.min(this.maximum(c), b));
    }, e.prototype.relative = function(a) {
        return a = this.normalize(a), a -= this._clones.length / 2, this.normalize(a, !0);
    }, e.prototype.maximum = function(a) {
        var b, c, d, e = 0, f = this.settings;
        if (a) return this._items.length - 1;
        if (!f.loop && f.center) b = this._items.length - 1; else if (f.loop || f.center) if (f.loop || f.center) b = this._items.length + f.items; else {
            if (!f.autoWidth && !f.merge) throw "Can not detect maximum absolute position.";
            for (revert = f.rtl ? 1 : -1, c = this.$stage.width() - this.$element.width(); (d = this.coordinates(e)) && !(d * revert >= c); ) b = ++e;
        } else b = this._items.length - f.items;
        return b;
    }, e.prototype.minimum = function(a) {
        return a ? 0 : this._clones.length / 2;
    }, e.prototype.items = function(a) {
        return a === d ? this._items.slice() : (a = this.normalize(a, !0), this._items[a]);
    }, e.prototype.mergers = function(a) {
        return a === d ? this._mergers.slice() : (a = this.normalize(a, !0), this._mergers[a]);
    }, e.prototype.clones = function(b) {
        var c = this._clones.length / 2, e = c + this._items.length, f = function(a) {
            return a % 2 === 0 ? e + a / 2 : c - (a + 1) / 2;
        };
        return b === d ? a.map(this._clones, function(a, b) {
            return f(b);
        }) : a.map(this._clones, function(a, c) {
            return a === b ? f(c) : null;
        });
    }, e.prototype.speed = function(a) {
        return a !== d && (this._speed = a), this._speed;
    }, e.prototype.coordinates = function(b) {
        var c = null;
        return b === d ? a.map(this._coordinates, a.proxy(function(a, b) {
            return this.coordinates(b);
        }, this)) : (this.settings.center ? (c = this._coordinates[b], c += (this.width() - c + (this._coordinates[b - 1] || 0)) / 2 * (this.settings.rtl ? -1 : 1)) : c = this._coordinates[b - 1] || 0, 
        c);
    }, e.prototype.duration = function(a, b, c) {
        return Math.min(Math.max(Math.abs(b - a), 1), 6) * Math.abs(c || this.settings.smartSpeed);
    }, e.prototype.to = function(c, d) {
        if (this.settings.loop) {
            var e = c - this.relative(this.current()), f = this.current(), g = this.current(), h = this.current() + e, i = 0 > g - h ? !0 : !1, j = this._clones.length + this._items.length;
            h < this.settings.items && i === !1 ? (f = g + this._items.length, this.reset(f)) : h >= j - this.settings.items && i === !0 && (f = g - this._items.length, 
            this.reset(f)), b.clearTimeout(this.e._goToLoop), this.e._goToLoop = b.setTimeout(a.proxy(function() {
                this.speed(this.duration(this.current(), f + e, d)), this.current(f + e), this.update();
            }, this), 30);
        } else this.speed(this.duration(this.current(), c, d)), this.current(c), this.update();
    }, e.prototype.next = function(a) {
        a = a || !1, this.to(this.relative(this.current()) + 1, a);
    }, e.prototype.prev = function(a) {
        a = a || !1, this.to(this.relative(this.current()) - 1, a);
    }, e.prototype.transitionEnd = function(a) {
        return a !== d && (a.stopPropagation(), (a.target || a.srcElement || a.originalTarget) !== this.$stage.get(0)) ? !1 : (this.state.inMotion = !1, 
        void this.trigger("translated"));
    }, e.prototype.viewport = function() {
        var d;
        if (this.options.responsiveBaseElement !== b) d = a(this.options.responsiveBaseElement).width(); else if (b.innerWidth) d = b.innerWidth; else {
            if (!c.documentElement || !c.documentElement.clientWidth) throw "Can not detect viewport width.";
            d = c.documentElement.clientWidth;
        }
        return d;
    }, e.prototype.replace = function(b) {
        this.$stage.empty(), this._items = [], b && (b = b instanceof jQuery ? b : a(b)), 
        this.settings.nestedItemSelector && (b = b.find("." + this.settings.nestedItemSelector)), 
        b.filter(function() {
            return 1 === this.nodeType;
        }).each(a.proxy(function(a, b) {
            b = this.prepare(b), this.$stage.append(b), this._items.push(b), this._mergers.push(1 * b.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") || 1);
        }, this)), this.reset(a.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0), 
        this.invalidate("items");
    }, e.prototype.add = function(a, b) {
        b = b === d ? this._items.length : this.normalize(b, !0), this.trigger("add", {
            content: a,
            position: b
        }), 0 === this._items.length || b === this._items.length ? (this.$stage.append(a), 
        this._items.push(a), this._mergers.push(1 * a.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") || 1)) : (this._items[b].before(a), 
        this._items.splice(b, 0, a), this._mergers.splice(b, 0, 1 * a.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") || 1)), 
        this.invalidate("items"), this.trigger("added", {
            content: a,
            position: b
        });
    }, e.prototype.remove = function(a) {
        a = this.normalize(a, !0), a !== d && (this.trigger("remove", {
            content: this._items[a],
            position: a
        }), this._items[a].remove(), this._items.splice(a, 1), this._mergers.splice(a, 1), 
        this.invalidate("items"), this.trigger("removed", {
            content: null,
            position: a
        }));
    }, e.prototype.addTriggerableEvents = function() {
        var b = a.proxy(function(b, c) {
            return a.proxy(function(a) {
                a.relatedTarget !== this && (this.suppress([ c ]), b.apply(this, [].slice.call(arguments, 1)), 
                this.release([ c ]));
            }, this);
        }, this);
        a.each({
            next: this.next,
            prev: this.prev,
            to: this.to,
            destroy: this.destroy,
            refresh: this.refresh,
            replace: this.replace,
            add: this.add,
            remove: this.remove
        }, a.proxy(function(a, c) {
            this.$element.on(a + ".owl.carousel", b(c, a + ".owl.carousel"));
        }, this));
    }, e.prototype.watchVisibility = function() {
        function c(a) {
            return a.offsetWidth > 0 && a.offsetHeight > 0;
        }
        function d() {
            c(this.$element.get(0)) && (this.$element.removeClass("owl-hidden"), this.refresh(), 
            b.clearInterval(this.e._checkVisibile));
        }
        c(this.$element.get(0)) || (this.$element.addClass("owl-hidden"), b.clearInterval(this.e._checkVisibile), 
        this.e._checkVisibile = b.setInterval(a.proxy(d, this), 500));
    }, e.prototype.preloadAutoWidthImages = function(b) {
        var c, d, e, f;
        c = 0, d = this, b.each(function(g, h) {
            e = a(h), f = new Image(), f.onload = function() {
                c++, e.attr("src", f.src), e.css("opacity", 1), c >= b.length && (d.state.imagesLoaded = !0, 
                d.initialize());
            }, f.src = e.attr("src") || e.attr("data-src") || e.attr("data-src-retina");
        });
    }, e.prototype.destroy = function() {
        this.$element.hasClass(this.settings.themeClass) && this.$element.removeClass(this.settings.themeClass), 
        this.settings.responsive !== !1 && a(b).off("resize.owl.carousel"), this.transitionEndVendor && this.off(this.$stage.get(0), this.transitionEndVendor, this.e._transitionEnd);
        for (var d in this._plugins) this._plugins[d].destroy();
        (this.settings.mouseDrag || this.settings.touchDrag) && (this.$stage.off("mousedown touchstart touchcancel"), 
        a(c).off(".owl.dragEvents"), this.$stage.get(0).onselectstart = function() {}, this.$stage.off("dragstart", function() {
            return !1;
        })), this.$element.off(".owl"), this.$stage.children(".cloned").remove(), this.e = null, 
        this.$element.removeData("owlCarousel"), this.$stage.children().contents().unwrap(), 
        this.$stage.children().unwrap(), this.$stage.unwrap();
    }, e.prototype.op = function(a, b, c) {
        var d = this.settings.rtl;
        switch (b) {
          case "<":
            return d ? a > c : c > a;

          case ">":
            return d ? c > a : a > c;

          case ">=":
            return d ? c >= a : a >= c;

          case "<=":
            return d ? a >= c : c >= a;
        }
    }, e.prototype.on = function(a, b, c, d) {
        a.addEventListener ? a.addEventListener(b, c, d) : a.attachEvent && a.attachEvent("on" + b, c);
    }, e.prototype.off = function(a, b, c, d) {
        a.removeEventListener ? a.removeEventListener(b, c, d) : a.detachEvent && a.detachEvent("on" + b, c);
    }, e.prototype.trigger = function(b, c, d) {
        var e = {
            item: {
                count: this._items.length,
                index: this.current()
            }
        }, f = a.camelCase(a.grep([ "on", b, d ], function(a) {
            return a;
        }).join("-").toLowerCase()), g = a.Event([ b, "owl", d || "carousel" ].join(".").toLowerCase(), a.extend({
            relatedTarget: this
        }, e, c));
        return this._supress[b] || (a.each(this._plugins, function(a, b) {
            b.onTrigger && b.onTrigger(g);
        }), this.$element.trigger(g), this.settings && "function" == typeof this.settings[f] && this.settings[f].apply(this, g)), 
        g;
    }, e.prototype.suppress = function(b) {
        a.each(b, a.proxy(function(a, b) {
            this._supress[b] = !0;
        }, this));
    }, e.prototype.release = function(b) {
        a.each(b, a.proxy(function(a, b) {
            delete this._supress[b];
        }, this));
    }, e.prototype.browserSupport = function() {
        if (this.support3d = j(), this.support3d) {
            this.transformVendor = i();
            var a = [ "transitionend", "webkitTransitionEnd", "transitionend", "oTransitionEnd" ];
            this.transitionEndVendor = a[h()], this.vendorName = this.transformVendor.replace(/Transform/i, ""), 
            this.vendorName = "" !== this.vendorName ? "-" + this.vendorName.toLowerCase() + "-" : "";
        }
        this.state.orientation = b.orientation;
    }, a.fn.owlCarousel = function(b) {
        return this.each(function() {
            a(this).data("owlCarousel") || a(this).data("owlCarousel", new e(this, b));
        });
    }, a.fn.owlCarousel.Constructor = e;
}(window.Zepto || window.jQuery, window, document), function(a, b, c, d) {
    var e = function(b) {
        this._core = b, this._loaded = [], this._handlers = {
            "initialized.owl.carousel change.owl.carousel": a.proxy(function(b) {
                if (b.namespace && this._core.settings && this._core.settings.lazyLoad && (b.property && "position" == b.property.name || "initialized" == b.type)) for (var c = this._core.settings, d = c.center && Math.ceil(c.items / 2) || c.items, e = c.center && -1 * d || 0, f = (b.property && b.property.value || this._core.current()) + e, g = this._core.clones().length, h = a.proxy(function(a, b) {
                    this.load(b);
                }, this); e++ < d; ) this.load(g / 2 + this._core.relative(f)), g && a.each(this._core.clones(this._core.relative(f++)), h);
            }, this)
        }, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers);
    };
    e.Defaults = {
        lazyLoad: !1
    }, e.prototype.load = function(c) {
        var d = this._core.$stage.children().eq(c), e = d && d.find(".owl-lazy");
        !e || a.inArray(d.get(0), this._loaded) > -1 || (e.each(a.proxy(function(c, d) {
            var e, f = a(d), g = b.devicePixelRatio > 1 && f.attr("data-src-retina") || f.attr("data-src");
            this._core.trigger("load", {
                element: f,
                url: g
            }, "lazy"), f.is("img") ? f.one("load.owl.lazy", a.proxy(function() {
                f.css("opacity", 1), this._core.trigger("loaded", {
                    element: f,
                    url: g
                }, "lazy");
            }, this)).attr("src", g) : (e = new Image(), e.onload = a.proxy(function() {
                f.css({
                    "background-image": "url(" + g + ")",
                    opacity: "1"
                }), this._core.trigger("loaded", {
                    element: f,
                    url: g
                }, "lazy");
            }, this), e.src = g);
        }, this)), this._loaded.push(d.get(0)));
    }, e.prototype.destroy = function() {
        var a, b;
        for (a in this.handlers) this._core.$element.off(a, this.handlers[a]);
        for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null);
    }, a.fn.owlCarousel.Constructor.Plugins.Lazy = e;
}(window.Zepto || window.jQuery, window, document), function(a, b, c, d) {
    var e = function(b) {
        this._core = b, this._handlers = {
            "initialized.owl.carousel": a.proxy(function() {
                this._core.settings.autoHeight && this.update();
            }, this),
            "changed.owl.carousel": a.proxy(function(a) {
                this._core.settings.autoHeight && "position" == a.property.name && this.update();
            }, this),
            "loaded.owl.lazy": a.proxy(function(a) {
                this._core.settings.autoHeight && a.element.closest("." + this._core.settings.itemClass) === this._core.$stage.children().eq(this._core.current()) && this.update();
            }, this)
        }, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers);
    };
    e.Defaults = {
        autoHeight: !1,
        autoHeightClass: "owl-height"
    }, e.prototype.update = function() {
        this._core.$stage.parent().height(this._core.$stage.children().eq(this._core.current()).height()).addClass(this._core.settings.autoHeightClass);
    }, e.prototype.destroy = function() {
        var a, b;
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null);
    }, a.fn.owlCarousel.Constructor.Plugins.AutoHeight = e;
}(window.Zepto || window.jQuery, window, document), function(a, b, c, d) {
    var e = function(b) {
        this._core = b, this._videos = {}, this._playing = null, this._fullscreen = !1, 
        this._handlers = {
            "resize.owl.carousel": a.proxy(function(a) {
                this._core.settings.video && !this.isInFullScreen() && a.preventDefault();
            }, this),
            "refresh.owl.carousel changed.owl.carousel": a.proxy(function(a) {
                this._playing && this.stop();
            }, this),
            "prepared.owl.carousel": a.proxy(function(b) {
                var c = a(b.content).find(".owl-video");
                c.length && (c.css("display", "none"), this.fetch(c, a(b.content)));
            }, this)
        }, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers), 
        this._core.$element.on("click.owl.video", ".owl-video-play-icon", a.proxy(function(a) {
            this.play(a);
        }, this));
    };
    e.Defaults = {
        video: !1,
        videoHeight: !1,
        videoWidth: !1
    }, e.prototype.fetch = function(a, b) {
        var c = a.attr("data-vimeo-id") ? "vimeo" : "youtube", d = a.attr("data-vimeo-id") || a.attr("data-youtube-id"), e = a.attr("data-width") || this._core.settings.videoWidth, f = a.attr("data-height") || this._core.settings.videoHeight, g = a.attr("href");
        if (!g) throw new Error("Missing video URL.");
        if (d = g.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/), 
        d[3].indexOf("youtu") > -1) c = "youtube"; else {
            if (!(d[3].indexOf("vimeo") > -1)) throw new Error("Video URL not supported.");
            c = "vimeo";
        }
        d = d[6], this._videos[g] = {
            type: c,
            id: d,
            width: e,
            height: f
        }, b.attr("data-video", g), this.thumbnail(a, this._videos[g]);
    }, e.prototype.thumbnail = function(b, c) {
        var d, e, f, g = c.width && c.height ? 'style="width:' + c.width + "px;height:" + c.height + 'px;"' : "", h = b.find("img"), i = "src", j = "", k = this._core.settings, l = function(a) {
            e = '<div class="owl-video-play-icon"></div>', d = k.lazyLoad ? '<div class="owl-video-tn ' + j + '" ' + i + '="' + a + '"></div>' : '<div class="owl-video-tn" style="opacity:1;background-image:url(' + a + ')"></div>', 
            b.after(d), b.after(e);
        };
        return b.wrap('<div class="owl-video-wrapper"' + g + "></div>"), this._core.settings.lazyLoad && (i = "data-src", 
        j = "owl-lazy"), h.length ? (l(h.attr(i)), h.remove(), !1) : void ("youtube" === c.type ? (f = "http://img.youtube.com/vi/" + c.id + "/hqdefault.jpg", 
        l(f)) : "vimeo" === c.type && a.ajax({
            type: "GET",
            url: "http://vimeo.com/api/v2/video/" + c.id + ".json",
            jsonp: "callback",
            dataType: "jsonp",
            success: function(a) {
                f = a[0].thumbnail_large, l(f);
            }
        }));
    }, e.prototype.stop = function() {
        this._core.trigger("stop", null, "video"), this._playing.find(".owl-video-frame").remove(), 
        this._playing.removeClass("owl-video-playing"), this._playing = null;
    }, e.prototype.play = function(b) {
        this._core.trigger("play", null, "video"), this._playing && this.stop();
        var c, d, e = a(b.target || b.srcElement), f = e.closest("." + this._core.settings.itemClass), g = this._videos[f.attr("data-video")], h = g.width || "100%", i = g.height || this._core.$stage.height();
        "youtube" === g.type ? c = '<iframe width="' + h + '" height="' + i + '" src="http://www.youtube.com/embed/' + g.id + "?autoplay=1&v=" + g.id + '" frameborder="0" allowfullscreen></iframe>' : "vimeo" === g.type && (c = '<iframe src="http://player.vimeo.com/video/' + g.id + '?autoplay=1" width="' + h + '" height="' + i + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'), 
        f.addClass("owl-video-playing"), this._playing = f, d = a('<div style="height:' + i + "px; width:" + h + 'px" class="owl-video-frame">' + c + "</div>"), 
        e.after(d);
    }, e.prototype.isInFullScreen = function() {
        var d = c.fullscreenElement || c.mozFullScreenElement || c.webkitFullscreenElement;
        return d && a(d).parent().hasClass("owl-video-frame") && (this._core.speed(0), this._fullscreen = !0), 
        d && this._fullscreen && this._playing ? !1 : this._fullscreen ? (this._fullscreen = !1, 
        !1) : this._playing && this._core.state.orientation !== b.orientation ? (this._core.state.orientation = b.orientation, 
        !1) : !0;
    }, e.prototype.destroy = function() {
        var a, b;
        this._core.$element.off("click.owl.video");
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null);
    }, a.fn.owlCarousel.Constructor.Plugins.Video = e;
}(window.Zepto || window.jQuery, window, document), function(a, b, c, d) {
    var e = function(b) {
        this.core = b, this.core.options = a.extend({}, e.Defaults, this.core.options), 
        this.swapping = !0, this.previous = d, this.next = d, this.handlers = {
            "change.owl.carousel": a.proxy(function(a) {
                "position" == a.property.name && (this.previous = this.core.current(), this.next = a.property.value);
            }, this),
            "drag.owl.carousel dragged.owl.carousel translated.owl.carousel": a.proxy(function(a) {
                this.swapping = "translated" == a.type;
            }, this),
            "translate.owl.carousel": a.proxy(function(a) {
                this.swapping && (this.core.options.animateOut || this.core.options.animateIn) && this.swap();
            }, this)
        }, this.core.$element.on(this.handlers);
    };
    e.Defaults = {
        animateOut: !1,
        animateIn: !1
    }, e.prototype.swap = function() {
        if (1 === this.core.settings.items && this.core.support3d) {
            this.core.speed(0);
            var b, c = a.proxy(this.clear, this), d = this.core.$stage.children().eq(this.previous), e = this.core.$stage.children().eq(this.next), f = this.core.settings.animateIn, g = this.core.settings.animateOut;
            this.core.current() !== this.previous && (g && (b = this.core.coordinates(this.previous) - this.core.coordinates(this.next), 
            d.css({
                left: b + "px"
            }).addClass("animated owl-animated-out").addClass(g).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", c)), 
            f && e.addClass("animated owl-animated-in").addClass(f).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", c));
        }
    }, e.prototype.clear = function(b) {
        a(b.target).css({
            left: ""
        }).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut), 
        this.core.transitionEnd();
    }, e.prototype.destroy = function() {
        var a, b;
        for (a in this.handlers) this.core.$element.off(a, this.handlers[a]);
        for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null);
    }, a.fn.owlCarousel.Constructor.Plugins.Animate = e;
}(window.Zepto || window.jQuery, window, document), function(a, b, c, d) {
    var e = function(b) {
        this.core = b, this.core.options = a.extend({}, e.Defaults, this.core.options), 
        this.handlers = {
            "translated.owl.carousel refreshed.owl.carousel": a.proxy(function() {
                this.autoplay();
            }, this),
            "play.owl.autoplay": a.proxy(function(a, b, c) {
                this.play(b, c);
            }, this),
            "stop.owl.autoplay": a.proxy(function() {
                this.stop();
            }, this),
            "mouseover.owl.autoplay": a.proxy(function() {
                this.core.settings.autoplayHoverPause && this.pause();
            }, this),
            "mouseleave.owl.autoplay": a.proxy(function() {
                this.core.settings.autoplayHoverPause && this.autoplay();
            }, this)
        }, this.core.$element.on(this.handlers);
    };
    e.Defaults = {
        autoplay: !1,
        autoplayTimeout: 5e3,
        autoplayHoverPause: !1,
        autoplaySpeed: !1
    }, e.prototype.autoplay = function() {
        this.core.settings.autoplay && !this.core.state.videoPlay ? (b.clearInterval(this.interval), 
        this.interval = b.setInterval(a.proxy(function() {
            this.play();
        }, this), this.core.settings.autoplayTimeout)) : b.clearInterval(this.interval);
    }, e.prototype.play = function(a, d) {
        return c.hidden === !0 || this.core.state.isTouch || this.core.state.isScrolling || this.core.state.isSwiping || this.core.state.inMotion ? void 0 : this.core.settings.autoplay === !1 ? void b.clearInterval(this.interval) : void this.core.next(this.core.settings.autoplaySpeed);
    }, e.prototype.stop = function() {
        b.clearInterval(this.interval);
    }, e.prototype.pause = function() {
        b.clearInterval(this.interval);
    }, e.prototype.destroy = function() {
        var a, c;
        b.clearInterval(this.interval);
        for (a in this.handlers) this.core.$element.off(a, this.handlers[a]);
        for (c in Object.getOwnPropertyNames(this)) "function" != typeof this[c] && (this[c] = null);
    }, a.fn.owlCarousel.Constructor.Plugins.autoplay = e;
}(window.Zepto || window.jQuery, window, document), function(a, b, c, d) {
    "use strict";
    var e = function(b) {
        this._core = b, this._initialized = !1, this._pages = [], this._controls = {}, this._templates = [], 
        this.$element = this._core.$element, this._overrides = {
            next: this._core.next,
            prev: this._core.prev,
            to: this._core.to
        }, this._handlers = {
            "prepared.owl.carousel": a.proxy(function(b) {
                this._core.settings.dotsData && this._templates.push(a(b.content).find("[data-dot]").andSelf("[data-dot]").attr("data-dot"));
            }, this),
            "add.owl.carousel": a.proxy(function(b) {
                this._core.settings.dotsData && this._templates.splice(b.position, 0, a(b.content).find("[data-dot]").andSelf("[data-dot]").attr("data-dot"));
            }, this),
            "remove.owl.carousel prepared.owl.carousel": a.proxy(function(a) {
                this._core.settings.dotsData && this._templates.splice(a.position, 1);
            }, this),
            "change.owl.carousel": a.proxy(function(a) {
                if ("position" == a.property.name && !this._core.state.revert && !this._core.settings.loop && this._core.settings.navRewind) {
                    var b = this._core.current(), c = this._core.maximum(), d = this._core.minimum();
                    a.data = a.property.value > c ? b >= c ? d : c : a.property.value < d ? c : a.property.value;
                }
            }, this),
            "changed.owl.carousel": a.proxy(function(a) {
                "position" == a.property.name && this.draw();
            }, this),
            "refreshed.owl.carousel": a.proxy(function() {
                this._initialized || (this.initialize(), this._initialized = !0), this._core.trigger("refresh", null, "navigation"), 
                this.update(), this.draw(), this._core.trigger("refreshed", null, "navigation");
            }, this)
        }, this._core.options = a.extend({}, e.Defaults, this._core.options), this.$element.on(this._handlers);
    };
    e.Defaults = {
        nav: !1,
        navRewind: !0,
        navText: [ "prev", "next" ],
        navSpeed: !1,
        navElement: "div",
        navContainer: !1,
        navContainerClass: "owl-nav",
        navClass: [ "owl-prev", "owl-next" ],
        slideBy: 1,
        dotClass: "owl-dot",
        dotsClass: "owl-dots",
        dots: !0,
        dotsEach: !1,
        dotData: !1,
        dotsSpeed: !1,
        dotsContainer: !1,
        controlsClass: "owl-controls"
    }, e.prototype.initialize = function() {
        var b, c, d = this._core.settings;
        d.dotsData || (this._templates = [ a("<div>").addClass(d.dotClass).append(a("<span>")).prop("outerHTML") ]), 
        d.navContainer && d.dotsContainer || (this._controls.$container = a("<div>").addClass(d.controlsClass).appendTo(this.$element)), 
        this._controls.$indicators = d.dotsContainer ? a(d.dotsContainer) : a("<div>").hide().addClass(d.dotsClass).appendTo(this._controls.$container), 
        this._controls.$indicators.on("click", "div", a.proxy(function(b) {
            var c = a(b.target).parent().is(this._controls.$indicators) ? a(b.target).index() : a(b.target).parent().index();
            b.preventDefault(), this.to(c, d.dotsSpeed);
        }, this)), b = d.navContainer ? a(d.navContainer) : a("<div>").addClass(d.navContainerClass).prependTo(this._controls.$container), 
        this._controls.$next = a("<" + d.navElement + ">"), this._controls.$previous = this._controls.$next.clone(), 
        this._controls.$previous.addClass(d.navClass[0]).html(d.navText[0]).hide().prependTo(b).on("click", a.proxy(function(a) {
            this.prev(d.navSpeed);
        }, this)), this._controls.$next.addClass(d.navClass[1]).html(d.navText[1]).hide().appendTo(b).on("click", a.proxy(function(a) {
            this.next(d.navSpeed);
        }, this));
        for (c in this._overrides) this._core[c] = a.proxy(this[c], this);
    }, e.prototype.destroy = function() {
        var a, b, c, d;
        for (a in this._handlers) this.$element.off(a, this._handlers[a]);
        for (b in this._controls) this._controls[b].remove();
        for (d in this.overides) this._core[d] = this._overrides[d];
        for (c in Object.getOwnPropertyNames(this)) "function" != typeof this[c] && (this[c] = null);
    }, e.prototype.update = function() {
        var a, b, c, d = this._core.settings, e = this._core.clones().length / 2, f = e + this._core.items().length, g = d.center || d.autoWidth || d.dotData ? 1 : d.dotsEach || d.items;
        if ("page" !== d.slideBy && (d.slideBy = Math.min(d.slideBy, d.items)), d.dots || "page" == d.slideBy) for (this._pages = [], 
        a = e, b = 0, c = 0; f > a; a++) (b >= g || 0 === b) && (this._pages.push({
            start: a - e,
            end: a - e + g - 1
        }), b = 0, ++c), b += this._core.mergers(this._core.relative(a));
    }, e.prototype.draw = function() {
        var b, c, d = "", e = this._core.settings, f = (this._core.$stage.children(), this._core.relative(this._core.current()));
        if (!e.nav || e.loop || e.navRewind || (this._controls.$previous.toggleClass("disabled", 0 >= f), 
        this._controls.$next.toggleClass("disabled", f >= this._core.maximum())), this._controls.$previous.toggle(e.nav), 
        this._controls.$next.toggle(e.nav), e.dots) {
            if (b = this._pages.length - this._controls.$indicators.children().length, e.dotData && 0 !== b) {
                for (c = 0; c < this._controls.$indicators.children().length; c++) d += this._templates[this._core.relative(c)];
                this._controls.$indicators.html(d);
            } else b > 0 ? (d = new Array(b + 1).join(this._templates[0]), this._controls.$indicators.append(d)) : 0 > b && this._controls.$indicators.children().slice(b).remove();
            this._controls.$indicators.find(".active").removeClass("active"), this._controls.$indicators.children().eq(a.inArray(this.current(), this._pages)).addClass("active");
        }
        this._controls.$indicators.toggle(e.dots);
    }, e.prototype.onTrigger = function(b) {
        var c = this._core.settings;
        b.page = {
            index: a.inArray(this.current(), this._pages),
            count: this._pages.length,
            size: c && (c.center || c.autoWidth || c.dotData ? 1 : c.dotsEach || c.items)
        };
    }, e.prototype.current = function() {
        var b = this._core.relative(this._core.current());
        return a.grep(this._pages, function(a) {
            return a.start <= b && a.end >= b;
        }).pop();
    }, e.prototype.getPosition = function(b) {
        var c, d, e = this._core.settings;
        return "page" == e.slideBy ? (c = a.inArray(this.current(), this._pages), d = this._pages.length, 
        b ? ++c : --c, c = this._pages[(c % d + d) % d].start) : (c = this._core.relative(this._core.current()), 
        d = this._core.items().length, b ? c += e.slideBy : c -= e.slideBy), c;
    }, e.prototype.next = function(b) {
        a.proxy(this._overrides.to, this._core)(this.getPosition(!0), b);
    }, e.prototype.prev = function(b) {
        a.proxy(this._overrides.to, this._core)(this.getPosition(!1), b);
    }, e.prototype.to = function(b, c, d) {
        var e;
        d ? a.proxy(this._overrides.to, this._core)(b, c) : (e = this._pages.length, a.proxy(this._overrides.to, this._core)(this._pages[(b % e + e) % e].start, c));
    }, a.fn.owlCarousel.Constructor.Plugins.Navigation = e;
}(window.Zepto || window.jQuery, window, document), function(a, b, c, d) {
    "use strict";
    var e = function(c) {
        this._core = c, this._hashes = {}, this.$element = this._core.$element, this._handlers = {
            "initialized.owl.carousel": a.proxy(function() {
                "URLHash" == this._core.settings.startPosition && a(b).trigger("hashchange.owl.navigation");
            }, this),
            "prepared.owl.carousel": a.proxy(function(b) {
                var c = a(b.content).find("[data-hash]").andSelf("[data-hash]").attr("data-hash");
                this._hashes[c] = b.content;
            }, this)
        }, this._core.options = a.extend({}, e.Defaults, this._core.options), this.$element.on(this._handlers), 
        a(b).on("hashchange.owl.navigation", a.proxy(function() {
            var a = b.location.hash.substring(1), c = this._core.$stage.children(), d = this._hashes[a] && c.index(this._hashes[a]) || 0;
            return a ? void this._core.to(d, !1, !0) : !1;
        }, this));
    };
    e.Defaults = {
        URLhashListener: !1
    }, e.prototype.destroy = function() {
        var c, d;
        a(b).off("hashchange.owl.navigation");
        for (c in this._handlers) this._core.$element.off(c, this._handlers[c]);
        for (d in Object.getOwnPropertyNames(this)) "function" != typeof this[d] && (this[d] = null);
    }, a.fn.owlCarousel.Constructor.Plugins.Hash = e;
}(window.Zepto || window.jQuery, window, document), function(a) {
    var b = jQuery.fn.prepend;
    jQuery.fn.prepend = function() {
        b.apply(this, arguments).trigger("prepend");
    };
}(jQuery), jQuery.fn.quickOuterWidth = function(a) {
    var b = this.get(0), c = b.offsetWidth;
    if (a && window.getComputedStyle) {
        var d = window.getComputedStyle(b, null);
        c = c + (parseInt(d.getPropertyValue("margin-left"), 10) || 0) + (parseInt(d.getPropertyValue("margin-right"), 10) || 0);
    } else a && (c = c + (parseInt(b.currentStyle.marginLeft) || 0) + (parseInt(b.currentStyle.marginRight) || 0));
    return c;
}, function(a) {
    jQuery.fn.randomize = function() {
        return !0;
    };
}(jQuery), function(a) {
    var b = jQuery.fn.remove;
    jQuery.fn.remove = function() {
        a(this).trigger("remove"), b.apply(this, arguments);
    };
}(jQuery), function(a) {
    jQuery.fn.removeStyle = function(a) {
        return this.each(function() {
            if (a) for (var b = a.split(","), c = 0; c < b.length; c++) this.removeProperty(a[c]); else this.removeAttribute("style");
        });
    };
}(jQuery), function(a) {
    jQuery.fn.reverse = [].reverse;
}(jQuery), function(a) {
    if ("object" == typeof exports) a(require("jquery"), require("spin")); else if ("function" == typeof define && define.amd) define([ "jquery", "spin" ], a); else {
        if (!window.Spinner) throw new Error("Spin.js not present");
        a(window.jQuery, window.Spinner);
    }
}(function(a, b) {
    a.fn.spin = function(c, d) {
        return this.each(function() {
            var e = a(this), f = e.data();
            f.spinner && (f.spinner.stop(), delete f.spinner), c !== !1 && (c = a.extend({
                color: d || e.css("color")
            }, a.fn.spin.presets[c] || c), f.spinner = new b(c).spin(this));
        });
    }, a.fn.spin.presets = {
        tiny: {
            lines: 8,
            length: 2,
            width: 2,
            radius: 3
        },
        small: {
            lines: 8,
            length: 4,
            width: 3,
            radius: 5
        },
        large: {
            lines: 10,
            length: 8,
            width: 4,
            radius: 8
        }
    };
}), function(a, b) {
    if ("object" == typeof exports && exports) b(exports); else {
        var c = {};
        b(c), "function" == typeof define && define.amd ? define(c) : a.Mustache = c;
    }
}(this, function(a) {
    function b(a, b) {
        return u.call(a, b);
    }
    function c(a) {
        return !b(q, a);
    }
    function d(a) {
        return "function" == typeof a;
    }
    function e(a) {
        return a.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    }
    function f(a) {
        return String(a).replace(/[&<>"'\/]/g, function(a) {
            return x[a];
        });
    }
    function g(a) {
        this.string = a, this.tail = a, this.pos = 0;
    }
    function h(a, b) {
        this.view = null == a ? {} : a, this.parent = b, this._cache = {
            ".": this.view
        };
    }
    function i() {
        this.clearCache();
    }
    function j(b, c, e, f) {
        function g(a) {
            return c.render(a, e);
        }
        for (var h, i, k, l = "", m = 0, n = b.length; n > m; ++m) switch (h = b[m], i = h[1], 
        h[0]) {
          case "#":
            if (k = e.lookup(i), "object" == typeof k || "string" == typeof k) if (w(k)) for (var o = 0, p = k.length; p > o; ++o) l += j(h[4], c, e.push(k[o]), f); else k && (l += j(h[4], c, e.push(k), f)); else if (d(k)) {
                var q = null == f ? null : f.slice(h[3], h[5]);
                k = k.call(e.view, q, g), null != k && (l += k);
            } else k && (l += j(h[4], c, e, f));
            break;

          case "^":
            k = e.lookup(i), (!k || w(k) && 0 === k.length) && (l += j(h[4], c, e, f));
            break;

          case ">":
            k = c.getPartial(i), d(k) && (l += k(e));
            break;

          case "&":
            k = e.lookup(i), null != k && (l += k);
            break;

          case "name":
            k = e.lookup(i), null != k && (l += a.escape(k));
            break;

          case "text":
            l += i;
        }
        return l;
    }
    function k(a) {
        for (var b, c = [], d = c, e = [], f = 0, g = a.length; g > f; ++f) switch (b = a[f], 
        b[0]) {
          case "#":
          case "^":
            e.push(b), d.push(b), d = b[4] = [];
            break;

          case "/":
            var h = e.pop();
            h[5] = b[2], d = e.length > 0 ? e[e.length - 1][4] : c;
            break;

          default:
            d.push(b);
        }
        return c;
    }
    function l(a) {
        for (var b, c, d = [], e = 0, f = a.length; f > e; ++e) b = a[e], b && ("text" === b[0] && c && "text" === c[0] ? (c[1] += b[1], 
        c[3] = b[3]) : (c = b, d.push(b)));
        return d;
    }
    function m(a) {
        return [ new RegExp(e(a[0]) + "\\s*"), new RegExp("\\s*" + e(a[1])) ];
    }
    function n(b, d) {
        function f() {
            if (A && !B) for (;z.length; ) delete y[z.pop()]; else z = [];
            A = !1, B = !1;
        }
        if (b = b || "", d = d || a.tags, "string" == typeof d && (d = d.split(p)), 2 !== d.length) throw new Error("Invalid tags: " + d.join(", "));
        for (var h, i, j, n, q, u, v = m(d), w = new g(b), x = [], y = [], z = [], A = !1, B = !1; !w.eos(); ) {
            if (h = w.pos, j = w.scanUntil(v[0])) for (var C = 0, D = j.length; D > C; ++C) n = j.charAt(C), 
            c(n) ? z.push(y.length) : B = !0, y.push([ "text", n, h, h + 1 ]), h += 1, "\n" == n && f();
            if (!w.scan(v[0])) break;
            if (A = !0, i = w.scan(t) || "name", w.scan(o), "=" === i ? (j = w.scanUntil(r), 
            w.scan(r), w.scanUntil(v[1])) : "{" === i ? (j = w.scanUntil(new RegExp("\\s*" + e("}" + d[1]))), 
            w.scan(s), w.scanUntil(v[1]), i = "&") : j = w.scanUntil(v[1]), !w.scan(v[1])) throw new Error("Unclosed tag at " + w.pos);
            if (q = [ i, j, h, w.pos ], y.push(q), "#" === i || "^" === i) x.push(q); else if ("/" === i) {
                if (u = x.pop(), !u) throw new Error('Unopened section "' + j + '" at ' + h);
                if (u[1] !== j) throw new Error('Unclosed section "' + u[1] + '" at ' + h);
            } else if ("name" === i || "{" === i || "&" === i) B = !0; else if ("=" === i) {
                if (d = j.split(p), 2 !== d.length) throw new Error("Invalid tags at " + h + ": " + d.join(", "));
                v = m(d);
            }
        }
        if (u = x.pop()) throw new Error('Unclosed section "' + u[1] + '" at ' + w.pos);
        return k(l(y));
    }
    var o = /\s*/, p = /\s+/, q = /\S/, r = /\s*=/, s = /\s*\}/, t = /#|\^|\/|>|\{|&|=|!/, u = RegExp.prototype.test, v = Object.prototype.toString, w = Array.isArray || function(a) {
        return "[object Array]" === v.call(a);
    }, x = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "&#x2F;"
    };
    g.prototype.eos = function() {
        return "" === this.tail;
    }, g.prototype.scan = function(a) {
        var b = this.tail.match(a);
        if (b && 0 === b.index) {
            var c = b[0];
            return this.tail = this.tail.substring(c.length), this.pos += c.length, c;
        }
        return "";
    }, g.prototype.scanUntil = function(a) {
        var b, c = this.tail.search(a);
        switch (c) {
          case -1:
            b = this.tail, this.tail = "";
            break;

          case 0:
            b = "";
            break;

          default:
            b = this.tail.substring(0, c), this.tail = this.tail.substring(c);
        }
        return this.pos += b.length, b;
    }, h.make = function(a) {
        return a instanceof h ? a : new h(a);
    }, h.prototype.push = function(a) {
        return new h(a, this);
    }, h.prototype.lookup = function(a) {
        var b;
        if (a in this._cache) b = this._cache[a]; else {
            for (var c = this; c; ) {
                if (a.indexOf(".") > 0) {
                    b = c.view;
                    for (var e = a.split("."), f = 0; null != b && f < e.length; ) b = b[e[f++]];
                } else b = c.view[a];
                if (null != b) break;
                c = c.parent;
            }
            this._cache[a] = b;
        }
        return d(b) && (b = b.call(this.view)), b;
    }, i.prototype.clearCache = function() {
        this._cache = {}, this._partialCache = {};
    }, i.prototype.compile = function(b, c) {
        var d = this._cache[b];
        if (!d) {
            var e = a.parse(b, c);
            d = this._cache[b] = this.compileTokens(e, b);
        }
        return d;
    }, i.prototype.compilePartial = function(a, b, c) {
        var d = this.compile(b, c);
        return this._partialCache[a] = d, d;
    }, i.prototype.getPartial = function(a) {
        return a in this._partialCache || !this._loadPartial || this.compilePartial(a, this._loadPartial(a)), 
        this._partialCache[a];
    }, i.prototype.compileTokens = function(a, b) {
        var c = this;
        return function(e, f) {
            if (f) if (d(f)) c._loadPartial = f; else for (var g in f) c.compilePartial(g, f[g]);
            return j(a, c, h.make(e), b);
        };
    }, i.prototype.render = function(a, b, c) {
        return this.compile(a)(b, c);
    }, a.name = "mustache.js", a.version = "0.7.3", a.tags = [ "{{", "}}" ], a.Scanner = g, 
    a.Context = h, a.Writer = i, a.parse = n, a.escape = f;
    var y = new i();
    a.clearCache = function() {
        return y.clearCache();
    }, a.compile = function(a, b) {
        return y.compile(a, b);
    }, a.compilePartial = function(a, b, c) {
        return y.compilePartial(a, b, c);
    }, a.compileTokens = function(a, b) {
        return y.compileTokens(a, b);
    }, a.render = function(a, b, c) {
        return y.render(a, b, c);
    }, a.to_html = function(b, c, e, f) {
        var g = a.render(b, c, e);
        return d(f) ? void f(g) : g;
    };
}), function(a) {
    function b() {}
    function c(a) {
        function c(b) {
            b.prototype.option || (b.prototype.option = function(b) {
                a.isPlainObject(b) && (this.options = a.extend(!0, this.options, b));
            });
        }
        function e(b, c) {
            a.fn[b] = function(e) {
                if ("string" == typeof e) {
                    for (var g = d.call(arguments, 1), h = 0, i = this.length; i > h; h++) {
                        var j = this[h], k = a.data(j, b);
                        if (k) if (a.isFunction(k[e]) && "_" !== e.charAt(0)) {
                            var l = k[e].apply(k, g);
                            if (void 0 !== l) return l;
                        } else f("no such method '" + e + "' for " + b + " instance"); else f("cannot call methods on " + b + " prior to initialization; attempted to call '" + e + "'");
                    }
                    return this;
                }
                return this.each(function() {
                    var d = a.data(this, b);
                    d ? (d.option(e), d._init()) : (d = new c(this, e), a.data(this, b, d));
                });
            };
        }
        if (a) {
            var f = "undefined" == typeof console ? b : function(a) {
                console.error(a);
            };
            return a.bridget = function(a, b) {
                c(b), e(a, b);
            }, a.bridget;
        }
    }
    var d = Array.prototype.slice;
    "function" == typeof define && define.amd ? define("jquery-bridget/jquery.bridget", [ "jquery" ], c) : c(a.jQuery);
}(window), function(a) {
    function b(a) {
        return new RegExp("(^|\\s+)" + a + "(\\s+|$)");
    }
    function c(a, b) {
        var c = d(a, b) ? f : e;
        c(a, b);
    }
    var d, e, f;
    "classList" in document.documentElement ? (d = function(a, b) {
        return a.classList.contains(b);
    }, e = function(a, b) {
        a.classList.add(b);
    }, f = function(a, b) {
        a.classList.remove(b);
    }) : (d = function(a, c) {
        return b(c).test(a.className);
    }, e = function(a, b) {
        d(a, b) || (a.className = a.className + " " + b);
    }, f = function(a, c) {
        a.className = a.className.replace(b(c), " ");
    });
    var g = {
        hasClass: d,
        addClass: e,
        removeClass: f,
        toggleClass: c,
        has: d,
        add: e,
        remove: f,
        toggle: c
    };
    "function" == typeof define && define.amd ? define("classie/classie", g) : a.classie = g;
}(window), function(a) {
    function b(a) {
        if (a) {
            if ("string" == typeof d[a]) return a;
            a = a.charAt(0).toUpperCase() + a.slice(1);
            for (var b, e = 0, f = c.length; f > e; e++) if (b = c[e] + a, "string" == typeof d[b]) return b;
        }
    }
    var c = "Webkit Moz ms Ms O".split(" "), d = document.documentElement.style;
    "function" == typeof define && define.amd ? define("get-style-property/get-style-property", [], function() {
        return b;
    }) : "object" == typeof exports ? module.exports = b : a.getStyleProperty = b;
}(window), function(a, b) {
    function c(a) {
        var b = parseFloat(a), c = -1 === a.indexOf("%") && !isNaN(b);
        return c && b;
    }
    function d() {
        for (var a = {
            width: 0,
            height: 0,
            innerWidth: 0,
            innerHeight: 0,
            outerWidth: 0,
            outerHeight: 0
        }, b = 0, c = i.length; c > b; b++) {
            var d = i[b];
            a[d] = 0;
        }
        return a;
    }
    function e(a) {
        function b(a) {
            if ("string" == typeof a && (a = document.querySelector(a)), a && "object" == typeof a && a.nodeType) {
                var b = h(a);
                if ("none" === b.display) return d();
                var g = {};
                g.width = a.offsetWidth, g.height = a.offsetHeight;
                for (var k = g.isBorderBox = !(!j || !b[j] || "border-box" !== b[j]), l = 0, m = i.length; m > l; l++) {
                    var n = i[l], o = b[n];
                    o = e(a, o);
                    var p = parseFloat(o);
                    g[n] = isNaN(p) ? 0 : p;
                }
                var q = g.paddingLeft + g.paddingRight, r = g.paddingTop + g.paddingBottom, s = g.marginLeft + g.marginRight, t = g.marginTop + g.marginBottom, u = g.borderLeftWidth + g.borderRightWidth, v = g.borderTopWidth + g.borderBottomWidth, w = k && f, x = c(b.width);
                x !== !1 && (g.width = x + (w ? 0 : q + u));
                var y = c(b.height);
                return y !== !1 && (g.height = y + (w ? 0 : r + v)), g.innerWidth = g.width - (q + u), 
                g.innerHeight = g.height - (r + v), g.outerWidth = g.width + s, g.outerHeight = g.height + t, 
                g;
            }
        }
        function e(a, b) {
            if (g || -1 === b.indexOf("%")) return b;
            var c = a.style, d = c.left, e = a.runtimeStyle, f = e && e.left;
            return f && (e.left = a.currentStyle.left), c.left = b, b = c.pixelLeft, c.left = d, 
            f && (e.left = f), b;
        }
        var f, j = a("boxSizing");
        return function() {
            if (j) {
                var a = document.createElement("div");
                a.style.width = "200px", a.style.padding = "1px 2px 3px 4px", a.style.borderStyle = "solid", 
                a.style.borderWidth = "1px 2px 3px 4px", a.style[j] = "border-box";
                var b = document.body || document.documentElement;
                b.appendChild(a);
                var d = h(a);
                f = 200 === c(d.width), b.removeChild(a);
            }
        }(), b;
    }
    var f = document.defaultView, g = f && f.getComputedStyle, h = g ? function(a) {
        return f.getComputedStyle(a, null);
    } : function(a) {
        return a.currentStyle;
    }, i = [ "paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth" ];
    "function" == typeof define && define.amd ? define("get-size/get-size", [ "get-style-property/get-style-property" ], e) : "object" == typeof exports ? module.exports = e(require("get-style-property")) : a.getSize = e(a.getStyleProperty);
}(window), function(a) {
    var b = document.documentElement, c = function() {};
    b.addEventListener ? c = function(a, b, c) {
        a.addEventListener(b, c, !1);
    } : b.attachEvent && (c = function(b, c, d) {
        b[c + d] = d.handleEvent ? function() {
            var b = a.event;
            b.target = b.target || b.srcElement, d.handleEvent.call(d, b);
        } : function() {
            var c = a.event;
            c.target = c.target || c.srcElement, d.call(b, c);
        }, b.attachEvent("on" + c, b[c + d]);
    });
    var d = function() {};
    b.removeEventListener ? d = function(a, b, c) {
        a.removeEventListener(b, c, !1);
    } : b.detachEvent && (d = function(a, b, c) {
        a.detachEvent("on" + b, a[b + c]);
        try {
            delete a[b + c];
        } catch (d) {
            a[b + c] = void 0;
        }
    });
    var e = {
        bind: c,
        unbind: d
    };
    "function" == typeof define && define.amd ? define("eventie/eventie", e) : a.eventie = e;
}(this), function(a) {
    function b(a) {
        "function" == typeof a && (b.isReady ? a() : f.push(a));
    }
    function c(a) {
        var c = "readystatechange" === a.type && "complete" !== e.readyState;
        if (!b.isReady && !c) {
            b.isReady = !0;
            for (var d = 0, g = f.length; g > d; d++) {
                var h = f[d];
                h();
            }
        }
    }
    function d(d) {
        return d.bind(e, "DOMContentLoaded", c), d.bind(e, "readystatechange", c), d.bind(a, "load", c), 
        b;
    }
    var e = a.document, f = [];
    b.isReady = !1, "function" == typeof define && define.amd ? (b.isReady = "function" == typeof requirejs, 
    define("doc-ready/doc-ready", [ "eventie/eventie" ], d)) : a.docReady = d(a.eventie);
}(this), function() {
    function a() {}
    function b(a, b) {
        for (var c = a.length; c--; ) if (a[c].listener === b) return c;
        return -1;
    }
    function c(a) {
        return function() {
            return this[a].apply(this, arguments);
        };
    }
    var d = a.prototype, e = this, f = e.EventEmitter;
    d.getListeners = function(a) {
        var b, c, d = this._getEvents();
        if ("object" == typeof a) {
            b = {};
            for (c in d) d.hasOwnProperty(c) && a.test(c) && (b[c] = d[c]);
        } else b = d[a] || (d[a] = []);
        return b;
    }, d.flattenListeners = function(a) {
        var b, c = [];
        for (b = 0; b < a.length; b += 1) c.push(a[b].listener);
        return c;
    }, d.getListenersAsObject = function(a) {
        var b, c = this.getListeners(a);
        return c instanceof Array && (b = {}, b[a] = c), b || c;
    }, d.addListener = function(a, c) {
        var d, e = this.getListenersAsObject(a), f = "object" == typeof c;
        for (d in e) e.hasOwnProperty(d) && -1 === b(e[d], c) && e[d].push(f ? c : {
            listener: c,
            once: !1
        });
        return this;
    }, d.on = c("addListener"), d.addOnceListener = function(a, b) {
        return this.addListener(a, {
            listener: b,
            once: !0
        });
    }, d.once = c("addOnceListener"), d.defineEvent = function(a) {
        return this.getListeners(a), this;
    }, d.defineEvents = function(a) {
        for (var b = 0; b < a.length; b += 1) this.defineEvent(a[b]);
        return this;
    }, d.removeListener = function(a, c) {
        var d, e, f = this.getListenersAsObject(a);
        for (e in f) f.hasOwnProperty(e) && (d = b(f[e], c), -1 !== d && f[e].splice(d, 1));
        return this;
    }, d.off = c("removeListener"), d.addListeners = function(a, b) {
        return this.manipulateListeners(!1, a, b);
    }, d.removeListeners = function(a, b) {
        return this.manipulateListeners(!0, a, b);
    }, d.manipulateListeners = function(a, b, c) {
        var d, e, f = a ? this.removeListener : this.addListener, g = a ? this.removeListeners : this.addListeners;
        if ("object" != typeof b || b instanceof RegExp) for (d = c.length; d--; ) f.call(this, b, c[d]); else for (d in b) b.hasOwnProperty(d) && (e = b[d]) && ("function" == typeof e ? f.call(this, d, e) : g.call(this, d, e));
        return this;
    }, d.removeEvent = function(a) {
        var b, c = typeof a, d = this._getEvents();
        if ("string" === c) delete d[a]; else if ("object" === c) for (b in d) d.hasOwnProperty(b) && a.test(b) && delete d[b]; else delete this._events;
        return this;
    }, d.removeAllListeners = c("removeEvent"), d.emitEvent = function(a, b) {
        var c, d, e, f, g = this.getListenersAsObject(a);
        for (e in g) if (g.hasOwnProperty(e)) for (d = g[e].length; d--; ) c = g[e][d], 
        c.once === !0 && this.removeListener(a, c.listener), f = c.listener.apply(this, b || []), 
        f === this._getOnceReturnValue() && this.removeListener(a, c.listener);
        return this;
    }, d.trigger = c("emitEvent"), d.emit = function(a) {
        var b = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(a, b);
    }, d.setOnceReturnValue = function(a) {
        return this._onceReturnValue = a, this;
    }, d._getOnceReturnValue = function() {
        return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0;
    }, d._getEvents = function() {
        return this._events || (this._events = {});
    }, a.noConflict = function() {
        return e.EventEmitter = f, a;
    }, "function" == typeof define && define.amd ? define("eventEmitter/EventEmitter", [], function() {
        return a;
    }) : "object" == typeof module && module.exports ? module.exports = a : this.EventEmitter = a;
}.call(this), function(a, b) {
    function c(a, b) {
        return a[h](b);
    }
    function d(a) {
        if (!a.parentNode) {
            var b = document.createDocumentFragment();
            b.appendChild(a);
        }
    }
    function e(a, b) {
        d(a);
        for (var c = a.parentNode.querySelectorAll(b), e = 0, f = c.length; f > e; e++) if (c[e] === a) return !0;
        return !1;
    }
    function f(a, b) {
        return d(a), c(a, b);
    }
    var g, h = function() {
        if (b.matchesSelector) return "matchesSelector";
        for (var a = [ "webkit", "moz", "ms", "o" ], c = 0, d = a.length; d > c; c++) {
            var e = a[c], f = e + "MatchesSelector";
            if (b[f]) return f;
        }
    }();
    if (h) {
        var i = document.createElement("div"), j = c(i, "div");
        g = j ? c : f;
    } else g = e;
    "function" == typeof define && define.amd ? define("matches-selector/matches-selector", [], function() {
        return g;
    }) : window.matchesSelector = g;
}(this, Element.prototype), function(a) {
    function b(a, b) {
        for (var c in b) a[c] = b[c];
        return a;
    }
    function c(a) {
        for (var b in a) return !1;
        return b = null, !0;
    }
    function d(a) {
        return a.replace(/([A-Z])/g, function(a) {
            return "-" + a.toLowerCase();
        });
    }
    function e(a, e, f) {
        function h(a, b) {
            a && (this.element = a, this.layout = b, this.position = {
                x: 0,
                y: 0
            }, this._create());
        }
        var i = f("transition"), j = f("transform"), k = i && j, l = !!f("perspective"), m = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "otransitionend",
            transition: "transitionend"
        }[i], n = [ "transform", "transition", "transitionDuration", "transitionProperty" ], o = function() {
            for (var a = {}, b = 0, c = n.length; c > b; b++) {
                var d = n[b], e = f(d);
                e && e !== d && (a[d] = e);
            }
            return a;
        }();
        b(h.prototype, a.prototype), h.prototype._create = function() {
            this._transition = {
                ingProperties: {},
                clean: {},
                onEnd: {}
            }, this.css({
                position: "absolute"
            });
        }, h.prototype.handleEvent = function(a) {
            var b = "on" + a.type;
            this[b] && this[b](a);
        }, h.prototype.getSize = function() {
            this.size = e(this.element);
        }, h.prototype.css = function(a) {
            var b = this.element.style;
            for (var c in a) {
                var d = o[c] || c;
                b[d] = a[c];
            }
        }, h.prototype.getPosition = function() {
            var a = g(this.element), b = this.layout.options, c = b.isOriginLeft, d = b.isOriginTop, e = parseInt(a[c ? "left" : "right"], 10), f = parseInt(a[d ? "top" : "bottom"], 10);
            e = isNaN(e) ? 0 : e, f = isNaN(f) ? 0 : f;
            var h = this.layout.size;
            e -= c ? h.paddingLeft : h.paddingRight, f -= d ? h.paddingTop : h.paddingBottom, 
            this.position.x = e, this.position.y = f;
        }, h.prototype.layoutPosition = function() {
            var a = this.layout.size, b = this.layout.options, c = {};
            b.isOriginLeft ? (c.left = this.position.x + a.paddingLeft + "px", c.right = "") : (c.right = this.position.x + a.paddingRight + "px", 
            c.left = ""), b.isOriginTop ? (c.top = this.position.y + a.paddingTop + "px", c.bottom = "") : (c.bottom = this.position.y + a.paddingBottom + "px", 
            c.top = ""), this.css(c), this.emitEvent("layout", [ this ]);
        };
        var p = l ? function(a, b) {
            return "translate3d(" + a + "px, " + b + "px, 0)";
        } : function(a, b) {
            return "translate(" + a + "px, " + b + "px)";
        };
        h.prototype._transitionTo = function(a, b) {
            this.getPosition();
            var c = this.position.x, d = this.position.y, e = parseInt(a, 10), f = parseInt(b, 10), g = e === this.position.x && f === this.position.y;
            if (this.setPosition(a, b), g && !this.isTransitioning) return void this.layoutPosition();
            var h = a - c, i = b - d, j = {}, k = this.layout.options;
            h = k.isOriginLeft ? h : -h, i = k.isOriginTop ? i : -i, j.transform = p(h, i), 
            this.transition({
                to: j,
                onTransitionEnd: {
                    transform: this.layoutPosition
                },
                isCleaning: !0
            });
        }, h.prototype.goTo = function(a, b) {
            this.setPosition(a, b), this.layoutPosition();
        }, h.prototype.moveTo = k ? h.prototype._transitionTo : h.prototype.goTo, h.prototype.setPosition = function(a, b) {
            this.position.x = parseInt(a, 10), this.position.y = parseInt(b, 10);
        }, h.prototype._nonTransition = function(a) {
            this.css(a.to), a.isCleaning && this._removeStyles(a.to);
            for (var b in a.onTransitionEnd) a.onTransitionEnd[b].call(this);
        }, h.prototype._transition = function(a) {
            if (!parseFloat(this.layout.options.transitionDuration)) return void this._nonTransition(a);
            var b = this._transition;
            for (var c in a.onTransitionEnd) b.onEnd[c] = a.onTransitionEnd[c];
            for (c in a.to) b.ingProperties[c] = !0, a.isCleaning && (b.clean[c] = !0);
            if (a.from) {
                this.css(a.from);
                var d = this.element.offsetHeight;
                d = null;
            }
            this.enableTransition(a.to), this.css(a.to), this.isTransitioning = !0;
        };
        var q = j && d(j) + ",opacity";
        h.prototype.enableTransition = function() {
            this.isTransitioning || (this.css({
                transitionProperty: q,
                transitionDuration: this.layout.options.transitionDuration
            }), this.element.addEventListener(m, this, !1));
        }, h.prototype.transition = h.prototype[i ? "_transition" : "_nonTransition"], h.prototype.onwebkitTransitionEnd = function(a) {
            this.ontransitionend(a);
        }, h.prototype.onotransitionend = function(a) {
            this.ontransitionend(a);
        };
        var r = {
            "-webkit-transform": "transform",
            "-moz-transform": "transform",
            "-o-transform": "transform"
        };
        h.prototype.ontransitionend = function(a) {
            if (a.target === this.element) {
                var b = this._transition, d = r[a.propertyName] || a.propertyName;
                if (delete b.ingProperties[d], c(b.ingProperties) && this.disableTransition(), d in b.clean && (this.element.style[a.propertyName] = "", 
                delete b.clean[d]), d in b.onEnd) {
                    var e = b.onEnd[d];
                    e.call(this), delete b.onEnd[d];
                }
                this.emitEvent("transitionEnd", [ this ]);
            }
        }, h.prototype.disableTransition = function() {
            this.removeTransitionStyles(), this.element.removeEventListener(m, this, !1), this.isTransitioning = !1;
        }, h.prototype._removeStyles = function(a) {
            var b = {};
            for (var c in a) b[c] = "";
            this.css(b);
        };
        var s = {
            transitionProperty: "",
            transitionDuration: ""
        };
        return h.prototype.removeTransitionStyles = function() {
            this.css(s);
        }, h.prototype.removeElem = function() {
            this.element.parentNode.removeChild(this.element), this.emitEvent("remove", [ this ]);
        }, h.prototype.remove = function() {
            if (!i || !parseFloat(this.layout.options.transitionDuration)) return void this.removeElem();
            var a = this;
            this.on("transitionEnd", function() {
                return a.removeElem(), !0;
            }), this.hide();
        }, h.prototype.reveal = function() {
            delete this.isHidden, this.css({
                display: ""
            });
            var a = this.layout.options;
            this.transition({
                from: a.hiddenStyle,
                to: a.visibleStyle,
                isCleaning: !0
            });
        }, h.prototype.hide = function() {
            this.isHidden = !0, this.css({
                display: ""
            });
            var a = this.layout.options;
            this.transition({
                from: a.visibleStyle,
                to: a.hiddenStyle,
                isCleaning: !0,
                onTransitionEnd: {
                    opacity: function() {
                        this.isHidden && this.css({
                            display: "none"
                        });
                    }
                }
            });
        }, h.prototype.destroy = function() {
            this.css({
                position: "",
                left: "",
                right: "",
                top: "",
                bottom: "",
                transition: "",
                transform: ""
            });
        }, h;
    }
    var f = document.defaultView, g = f && f.getComputedStyle ? function(a) {
        return f.getComputedStyle(a, null);
    } : function(a) {
        return a.currentStyle;
    };
    "function" == typeof define && define.amd ? define("outlayer/item", [ "eventEmitter/EventEmitter", "get-size/get-size", "get-style-property/get-style-property" ], e) : (a.Outlayer = {}, 
    a.Outlayer.Item = e(a.EventEmitter, a.getSize, a.getStyleProperty));
}(window), function(a) {
    function b(a, b) {
        for (var c in b) a[c] = b[c];
        return a;
    }
    function c(a) {
        return "[object Array]" === l.call(a);
    }
    function d(a) {
        var b = [];
        if (c(a)) b = a; else if (a && "number" == typeof a.length) for (var d = 0, e = a.length; e > d; d++) b.push(a[d]); else b.push(a);
        return b;
    }
    function e(a, b) {
        var c = n(b, a);
        -1 !== c && b.splice(c, 1);
    }
    function f(a) {
        return a.replace(/(.)([A-Z])/g, function(a, b, c) {
            return b + "-" + c;
        }).toLowerCase();
    }
    function g(c, g, l, n, o, p) {
        function q(a, c) {
            if ("string" == typeof a && (a = h.querySelector(a)), !a || !m(a)) return void (i && i.error("Bad " + this.settings.namespace + " element: " + a));
            this.element = a, this.options = b({}, this.options), this.option(c);
            var d = ++s;
            this.element.outlayerGUID = d, t[d] = this, this._create(), this.options.isInitLayout && this.layout();
        }
        function r(a, c) {
            a.prototype[c] = b({}, q.prototype[c]);
        }
        var s = 0, t = {};
        return q.prototype.settings = {
            namespace: "outlayer",
            item: p
        }, q.prototype.options = {
            containerStyle: {
                position: "relative"
            },
            isInitLayout: !0,
            isOriginLeft: !0,
            isOriginTop: !0,
            isResizeBound: !0,
            transitionDuration: "0.4s",
            hiddenStyle: {
                opacity: 0,
                transform: "scale(0.001)"
            },
            visibleStyle: {
                opacity: 1,
                transform: "scale(1)"
            }
        }, b(q.prototype, l.prototype), q.prototype.option = function(a) {
            b(this.options, a);
        }, q.prototype._create = function() {
            this.reloadItems(), this.stamps = [], this.stamp(this.options.stamp), b(this.element.style, this.options.containerStyle), 
            this.options.isResizeBound && this.bindResize();
        }, q.prototype.reloadItems = function() {
            this.items = this._itemize(this.element.children);
        }, q.prototype._itemize = function(a) {
            for (var b = this._filterFindItemElements(a), c = this.settings.item, d = [], e = 0, f = b.length; f > e; e++) {
                var g = b[e], h = new c(g, this);
                d.push(h);
            }
            return d;
        }, q.prototype._filterFindItemElements = function(a) {
            a = d(a);
            for (var b = this.options.itemSelector, c = [], e = 0, f = a.length; f > e; e++) {
                var g = a[e];
                if (m(g)) if (b) {
                    o(g, b) && c.push(g);
                    for (var h = g.querySelectorAll(b), i = 0, j = h.length; j > i; i++) c.push(h[i]);
                } else c.push(g);
            }
            return c;
        }, q.prototype.getItemElements = function() {
            for (var a = [], b = 0, c = this.items.length; c > b; b++) a.push(this.items[b].element);
            return a;
        }, q.prototype.layout = function() {
            this._resetLayout(), this._manageStamps();
            var a = void 0 !== this.options.isLayoutInstant ? this.options.isLayoutInstant : !this._isLayoutInited;
            this.layoutItems(this.items, a), this._isLayoutInited = !0;
        }, q.prototype._init = q.prototype.layout, q.prototype._resetLayout = function() {
            this.getSize();
        }, q.prototype.getSize = function() {
            this.size = n(this.element);
        }, q.prototype._getMeasurement = function(a, b) {
            var c, d = this.options[a];
            d ? ("string" == typeof d ? c = this.element.querySelector(d) : m(d) && (c = d), 
            this[a] = c ? n(c)[b] : d) : this[a] = 0;
        }, q.prototype.layoutItems = function(a, b) {
            a = this._getItemsForLayout(a), this._layoutItems(a, b), this._postLayout();
        }, q.prototype._getItemsForLayout = function(a) {
            for (var b = [], c = 0, d = a.length; d > c; c++) {
                var e = a[c];
                e.isIgnored || b.push(e);
            }
            return b;
        }, q.prototype._layoutItems = function(a, b) {
            if (!a || !a.length) return void this.emitEvent("layoutComplete", [ this, a ]);
            this._itemsOn(a, "layout", function() {
                this.emitEvent("layoutComplete", [ this, a ]);
            });
            for (var c = [], d = 0, e = a.length; e > d; d++) {
                var f = a[d], g = this._getItemLayoutPosition(f);
                g.item = f, g.isInstant = b, c.push(g);
            }
            this._processLayoutQueue(c);
        }, q.prototype._getItemLayoutPosition = function() {
            return {
                x: 0,
                y: 0
            };
        }, q.prototype._processLayoutQueue = function(a) {
            for (var b = 0, c = a.length; c > b; b++) {
                var d = a[b];
                this._positionItem(d.item, d.x, d.y, d.isInstant);
            }
        }, q.prototype._positionItem = function(a, b, c, d) {
            d ? a.goTo(b, c) : a.moveTo(b, c);
        }, q.prototype._postLayout = function() {
            var a = this._getContainerSize();
            a && (this._setContainerMeasure(a.width, !0), this._setContainerMeasure(a.height, !1));
        }, q.prototype._getContainerSize = k, q.prototype._setContainerMeasure = function(a, b) {
            if (void 0 !== a) {
                var c = this.size;
                c.isBorderBox && (a += b ? c.paddingLeft + c.paddingRight + c.borderLeftWidth + c.borderRightWidth : c.paddingBottom + c.paddingTop + c.borderTopWidth + c.borderBottomWidth), 
                a = Math.max(a, 0), this.element.style[b ? "width" : "height"] = a + "px";
            }
        }, q.prototype._itemsOn = function(a, b, c) {
            function d() {
                return e++, e === f && c.call(g), !0;
            }
            for (var e = 0, f = a.length, g = this, h = 0, i = a.length; i > h; h++) {
                var j = a[h];
                j.on(b, d);
            }
        }, q.prototype.ignore = function(a) {
            var b = this.getItem(a);
            b && (b.isIgnored = !0);
        }, q.prototype.unignore = function(a) {
            var b = this.getItem(a);
            b && delete b.isIgnored;
        }, q.prototype.stamp = function(a) {
            if (a = this._find(a)) {
                this.stamps = this.stamps.concat(a);
                for (var b = 0, c = a.length; c > b; b++) {
                    var d = a[b];
                    this.ignore(d);
                }
            }
        }, q.prototype.unstamp = function(a) {
            if (a = this._find(a)) for (var b = 0, c = a.length; c > b; b++) {
                var d = a[b];
                e(d, this.stamps), this.unignore(d);
            }
        }, q.prototype._find = function(a) {
            return a ? ("string" == typeof a && (a = this.element.querySelectorAll(a)), a = d(a)) : void 0;
        }, q.prototype._manageStamps = function() {
            if (this.stamps && this.stamps.length) {
                this._getBoundingRect();
                for (var a = 0, b = this.stamps.length; b > a; a++) {
                    var c = this.stamps[a];
                    this._manageStamp(c);
                }
            }
        }, q.prototype._getBoundingRect = function() {
            var a = this.element.getBoundingClientRect(), b = this.size;
            this._boundingRect = {
                left: a.left + b.paddingLeft + b.borderLeftWidth,
                top: a.top + b.paddingTop + b.borderTopWidth,
                right: a.right - (b.paddingRight + b.borderRightWidth),
                bottom: a.bottom - (b.paddingBottom + b.borderBottomWidth)
            };
        }, q.prototype._manageStamp = k, q.prototype._getElementOffset = function(a) {
            var b = a.getBoundingClientRect(), c = this._boundingRect, d = n(a), e = {
                left: b.left - c.left - d.marginLeft,
                top: b.top - c.top - d.marginTop,
                right: c.right - b.right - d.marginRight,
                bottom: c.bottom - b.bottom - d.marginBottom
            };
            return e;
        }, q.prototype.handleEvent = function(a) {
            var b = "on" + a.type;
            this[b] && this[b](a);
        }, q.prototype.bindResize = function() {
            this.isResizeBound || (c.bind(a, "resize", this), this.isResizeBound = !0);
        }, q.prototype.unbindResize = function() {
            c.unbind(a, "resize", this), this.isResizeBound = !1;
        }, q.prototype.onresize = function() {
            function a() {
                b.resize(), delete b.resizeTimeout;
            }
            this.resizeTimeout && clearTimeout(this.resizeTimeout);
            var b = this;
            this.resizeTimeout = setTimeout(a, 100);
        }, q.prototype.resize = function() {
            var a = n(this.element), b = this.size && a;
            b && a.innerWidth === this.size.innerWidth || this.layout();
        }, q.prototype.addItems = function(a) {
            var b = this._itemize(a);
            return b.length && (this.items = this.items.concat(b)), b;
        }, q.prototype.appended = function(a) {
            var b = this.addItems(a);
            b.length && (this.layoutItems(b, !0), this.reveal(b));
        }, q.prototype.prepended = function(a) {
            var b = this._itemize(a);
            if (b.length) {
                var c = this.items.slice(0);
                this.items = b.concat(c), this._resetLayout(), this._manageStamps(), this.layoutItems(b, !0), 
                this.reveal(b), this.layoutItems(c);
            }
        }, q.prototype.reveal = function(a) {
            if (a && a.length) for (var b = 0, c = a.length; c > b; b++) {
                var d = a[b];
                d.reveal();
            }
        }, q.prototype.hide = function(a) {
            if (a && a.length) for (var b = 0, c = a.length; c > b; b++) {
                var d = a[b];
                d.hide();
            }
        }, q.prototype.getItem = function(a) {
            for (var b = 0, c = this.items.length; c > b; b++) {
                var d = this.items[b];
                if (d.element === a) return d;
            }
        }, q.prototype.getItems = function(a) {
            if (a && a.length) {
                for (var b = [], c = 0, d = a.length; d > c; c++) {
                    var e = a[c], f = this.getItem(e);
                    f && b.push(f);
                }
                return b;
            }
        }, q.prototype.remove = function(a) {
            a = d(a);
            var b = this.getItems(a);
            if (b && b.length) {
                this._itemsOn(b, "remove", function() {
                    this.emitEvent("removeComplete", [ this, b ]);
                });
                for (var c = 0, f = b.length; f > c; c++) {
                    var g = b[c];
                    g.remove(), e(g, this.items);
                }
            }
        }, q.prototype.destroy = function() {
            var a = this.element.style;
            a.height = "", a.position = "", a.width = "";
            for (var b = 0, c = this.items.length; c > b; b++) {
                var d = this.items[b];
                d.destroy();
            }
            this.unbindResize(), delete this.element.outlayerGUID, j && j.removeData(this.element, this.settings.namespace);
        }, q.data = function(a) {
            var b = a && a.outlayerGUID;
            return b && t[b];
        }, q.create = function(a, c) {
            function d() {
                q.apply(this, arguments);
            }
            return b(d.prototype, q.prototype), r(d, "options"), r(d, "settings"), b(d.prototype.options, c), 
            d.prototype.settings.namespace = a, d.data = q.data, d.Item = function() {
                p.apply(this, arguments);
            }, d.Item.prototype = new p(), d.prototype.settings.item = d.Item, g(function() {
                for (var b = f(a), c = h.querySelectorAll(".js-" + b), e = "data-" + b + "-options", g = 0, k = c.length; k > g; g++) {
                    var l, m = c[g], n = m.getAttribute(e);
                    try {
                        l = n && JSON.parse(n);
                    } catch (o) {
                        i && i.error("Error parsing " + e + " on " + m.nodeName.toLowerCase() + (m.id ? "#" + m.id : "") + ": " + o);
                        continue;
                    }
                    var p = new d(m, l);
                    j && j.data(m, a, p);
                }
            }), j && j.bridget && j.bridget(a, d), d;
        }, q.Item = p, q;
    }
    var h = a.document, i = a.console, j = a.jQuery, k = function() {}, l = Object.prototype.toString, m = "object" == typeof HTMLElement ? function(a) {
        return a instanceof HTMLElement;
    } : function(a) {
        return a && "object" == typeof a && 1 === a.nodeType && "string" == typeof a.nodeName;
    }, n = Array.prototype.indexOf ? function(a, b) {
        return a.indexOf(b);
    } : function(a, b) {
        for (var c = 0, d = a.length; d > c; c++) if (a[c] === b) return c;
        return -1;
    };
    "function" == typeof define && define.amd ? define("outlayer/outlayer", [ "eventie/eventie", "doc-ready/doc-ready", "eventEmitter/EventEmitter", "get-size/get-size", "matches-selector/matches-selector", "./item" ], g) : a.Outlayer = g(a.eventie, a.docReady, a.EventEmitter, a.getSize, a.matchesSelector, a.Outlayer.Item);
}(window), function(a) {
    function b() {
        function a(b) {
            for (var c in a.defaults) this[c] = a.defaults[c];
            for (c in b) this[c] = b[c];
        }
        return c.Rect = a, a.defaults = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        }, a.prototype.contains = function(a) {
            var b = a.width || 0, c = a.height || 0;
            return this.x <= a.x && this.y <= a.y && this.x + this.width >= a.x + b && this.y + this.height >= a.y + c;
        }, a.prototype.overlaps = function(a) {
            var b = this.x + this.width, c = this.y + this.height, d = a.x + a.width, e = a.y + a.height;
            return this.x < d && b > a.x && this.y < e && c > a.y;
        }, a.prototype.getMaximalFreeRects = function(b) {
            if (!this.overlaps(b)) return !1;
            var c, d = [], e = this.x + this.width, f = this.y + this.height, g = b.x + b.width, h = b.y + b.height;
            return this.y < b.y && (c = new a({
                x: this.x,
                y: this.y,
                width: this.width,
                height: b.y - this.y
            }), d.push(c)), e > g && (c = new a({
                x: g,
                y: this.y,
                width: e - g,
                height: this.height
            }), d.push(c)), f > h && (c = new a({
                x: this.x,
                y: h,
                width: this.width,
                height: f - h
            }), d.push(c)), this.x < b.x && (c = new a({
                x: this.x,
                y: this.y,
                width: b.x - this.x,
                height: this.height
            }), d.push(c)), d;
        }, a.prototype.canFit = function(a) {
            return this.width >= a.width && this.height >= a.height;
        }, a;
    }
    var c = a.Packery = function() {};
    "function" == typeof define && define.amd ? define("packery/js/rect", b) : (a.Packery = a.Packery || {}, 
    a.Packery.Rect = b());
}(window), function(a) {
    function b(a) {
        function b(a, b, c) {
            this.width = a || 0, this.height = b || 0, this.sortDirection = c || "downwardLeftToRight", 
            this.reset();
        }
        b.prototype.reset = function() {
            this.spaces = [], this.newSpaces = [];
            var b = new a({
                x: 0,
                y: 0,
                width: this.width,
                height: this.height
            });
            this.spaces.push(b), this.sorter = c[this.sortDirection] || c.downwardLeftToRight;
        }, b.prototype.pack = function(a) {
            for (var b = 0, c = this.spaces.length; c > b; b++) {
                var d = this.spaces[b];
                if (d.canFit(a)) {
                    this.placeInSpace(a, d);
                    break;
                }
            }
        }, b.prototype.placeInSpace = function(a, b) {
            a.x = b.x, a.y = b.y, this.placed(a);
        }, b.prototype.placed = function(a) {
            for (var c = [], d = 0, e = this.spaces.length; e > d; d++) {
                var f = this.spaces[d], g = f.getMaximalFreeRects(a);
                g ? c.push.apply(c, g) : c.push(f);
            }
            this.spaces = c, b.mergeRects(this.spaces), this.spaces.sort(this.sorter);
        }, b.mergeRects = function(a) {
            for (var b = 0, c = a.length; c > b; b++) {
                var d = a[b];
                if (d) {
                    var e = a.slice(0);
                    e.splice(b, 1);
                    for (var f = 0, g = 0, h = e.length; h > g; g++) {
                        var i = e[g], j = b > g ? 0 : 1;
                        d.contains(i) && (a.splice(g + j - f, 1), f++);
                    }
                }
            }
            return a;
        };
        var c = {
            downwardLeftToRight: function(a, b) {
                return a.y - b.y || a.x - b.x;
            },
            rightwardTopToBottom: function(a, b) {
                return a.x - b.x || a.y - b.y;
            }
        };
        return b;
    }
    if ("function" == typeof define && define.amd) define("packery/js/packer", [ "./rect" ], b); else {
        var c = a.Packery = a.Packery || {};
        c.Packer = b(c.Rect);
    }
}(window), function(a) {
    function b(a, b, c) {
        var d = a("transform"), e = function() {
            b.Item.apply(this, arguments);
        };
        e.prototype = new b.Item();
        var f = e.prototype._create;
        return e.prototype._create = function() {
            f.call(this), this.rect = new c(), this.placeRect = new c();
        }, e.prototype.dragStart = function() {
            this.getPosition(), this.removeTransitionStyles(), this.isTransitioning && d && (this.element.style[d] = "none"), 
            this.getSize(), this.isPlacing = !0, this.needsPositioning = !1, this.positionPlaceRect(this.position.x, this.position.y), 
            this.isTransitioning = !1, this.didDrag = !1;
        }, e.prototype.dragMove = function(a, b) {
            this.didDrag = !0;
            var c = this.layout.size;
            a -= c.paddingLeft, b -= c.paddingTop, this.positionPlaceRect(a, b);
        }, e.prototype.dragStop = function() {
            this.getPosition();
            var a = this.position.x !== this.placeRect.x, b = this.position.y !== this.placeRect.y;
            this.needsPositioning = a || b, this.didDrag = !1;
        }, e.prototype.positionPlaceRect = function(a, b, c) {
            this.placeRect.x = this.getPlaceRectCoord(a, !0), this.placeRect.y = this.getPlaceRectCoord(b, !1, c);
        }, e.prototype.getPlaceRectCoord = function(a, b, c) {
            var d = b ? "Width" : "Height", e = this.size["outer" + d], f = this.layout[b ? "columnWidth" : "rowHeight"], g = this.layout.size["inner" + d];
            b || (g = Math.max(g, this.layout.maxY), this.layout.rowHeight || (g -= this.layout.gutter));
            var h;
            if (f) {
                f += this.layout.gutter, g += b ? this.layout.gutter : 0, a = Math.round(a / f);
                var i;
                i = this.layout.options.isHorizontal ? b ? "ceil" : "floor" : b ? "floor" : "ceil";
                var j = Math[i](g / f);
                j -= Math.ceil(e / f), h = j;
            } else h = g - e;
            return a = c ? a : Math.min(a, h), a *= f || 1, Math.max(0, a);
        }, e.prototype.copyPlaceRectPosition = function() {
            this.rect.x = this.placeRect.x, this.rect.y = this.placeRect.y;
        }, e;
    }
    "function" == typeof define && define.amd ? define("packery/js/item", [ "get-style-property/get-style-property", "outlayer/outlayer", "./rect" ], b) : a.Packery.Item = b(a.getStyleProperty, a.Outlayer, a.Packery.Rect);
}(window), function(a) {
    function b(a, b, c, d, e, f) {
        var g = c.create("packery");
        return g.Item = g.prototype.settings.item = f, g.prototype._create = function() {
            c.prototype._create.call(this), this.packer = new e(), this.stamp(this.options.stamped);
            var a = this;
            this.handleDraggabilly = {
                dragStart: function(b) {
                    a.itemDragStart(b.element);
                },
                dragMove: function(b) {
                    a.itemDragMove(b.element, b.position.x, b.position.y);
                },
                dragEnd: function(b) {
                    a.itemDragEnd(b.element);
                }
            }, this.handleUIDraggable = {
                start: function(b) {
                    a.itemDragStart(b.currentTarget);
                },
                drag: function(b, c) {
                    a.itemDragMove(b.currentTarget, c.position.left, c.position.top);
                },
                stop: function(b) {
                    a.itemDragEnd(b.currentTarget);
                }
            };
        }, g.prototype._resetLayout = function() {
            this.getSize(), this._getMeasurements();
            var a = this.packer;
            this.options.isHorizontal ? (a.width = Number.POSITIVE_INFINITY, a.height = this.size.innerHeight + this.gutter, 
            a.sortDirection = "rightwardTopToBottom") : (a.width = this.size.innerWidth + this.gutter, 
            a.height = Number.POSITIVE_INFINITY, a.sortDirection = "downwardLeftToRight"), a.reset(), 
            this.maxY = 0, this.maxX = 0;
        }, g.prototype._getMeasurements = function() {
            this._getMeasurement("columnWidth", "width"), this._getMeasurement("rowHeight", "height"), 
            this._getMeasurement("gutter", "width");
        }, g.prototype._getItemLayoutPosition = function(a) {
            return this._packItem(a), a.rect;
        }, g.prototype._packItem = function(a) {
            this._setRectSize(a.element, a.rect), this.packer.pack(a.rect), this._setMaxXY(a.rect);
        }, g.prototype._setMaxXY = function(a) {
            this.maxX = Math.max(a.x + a.width, this.maxX), this.maxY = Math.max(a.y + a.height, this.maxY);
        }, g.prototype._setRectSize = function(a, c) {
            var d = b(a), e = d.outerWidth, f = d.outerHeight, g = this.columnWidth + this.gutter, h = this.rowHeight + this.gutter;
            e = this.columnWidth ? Math.ceil(e / g) * g : e + this.gutter, f = this.rowHeight ? Math.ceil(f / h) * h : f + this.gutter, 
            c.width = Math.min(e, this.packer.width), c.height = f;
        }, g.prototype._getContainerSize = function() {
            return this.options.isHorizontal ? {
                width: this.maxX - this.gutter
            } : {
                height: this.maxY - this.gutter
            };
        }, g.prototype._manageStamp = function(a) {
            var b, c = this.getItem(a);
            if (c && c.isPlacing) b = c.placeRect; else {
                var e = this._getElementOffset(a);
                b = new d({
                    x: this.options.isOriginLeft ? e.left : e.right,
                    y: this.options.isOriginTop ? e.top : e.bottom
                });
            }
            this._setRectSize(a, b), this.packer.placed(b), this._setMaxXY(b);
        }, g.prototype.sortItemsByPosition = function() {
            this.items.sort(function(a, b) {
                return a.position.y - b.position.y || a.position.x - b.position.x;
            });
        }, g.prototype.fit = function(a, b, c) {
            var d = this.getItem(a);
            d && (this._getMeasurements(), this.stamp(d.element), d.getSize(), d.isPlacing = !0, 
            b = void 0 === b ? d.rect.x : b, c = void 0 === c ? d.rect.y : c, d.positionPlaceRect(b, c, !0), 
            this._bindFitEvents(d), d.moveTo(d.placeRect.x, d.placeRect.y), this.layout(), this.unstamp(d.element), 
            this.sortItemsByPosition(), d.isPlacing = !1, d.copyPlaceRectPosition());
        }, g.prototype._bindFitEvents = function(a) {
            function b() {
                d++, 2 === d && c.emitEvent("fitComplete", [ c, a ]);
            }
            var c = this, d = 0;
            a.on("layout", function() {
                return b(), !0;
            }), this.on("layoutComplete", function() {
                return b(), !0;
            });
        }, g.prototype.resize = function() {
            var a = b(this.element), c = this.size && a, d = this.options.isHorizontal ? "innerHeight" : "innerWidth";
            c && a[d] === this.size[d] || this.layout();
        }, g.prototype.itemDragStart = function(a) {
            this.stamp(a);
            var b = this.getItem(a);
            b && b.dragStart();
        }, g.prototype.itemDragMove = function(a, b, c) {
            function d() {
                f.layout(), delete f.dragTimeout;
            }
            var e = this.getItem(a);
            e && e.dragMove(b, c);
            var f = this;
            this.clearDragTimeout(), this.dragTimeout = setTimeout(d, 40);
        }, g.prototype.clearDragTimeout = function() {
            this.dragTimeout && clearTimeout(this.dragTimeout);
        }, g.prototype.itemDragEnd = function(b) {
            var c, d = this.getItem(b);
            if (d && (c = d.didDrag, d.dragStop()), !d || !c && !d.needsPositioning) return void this.unstamp(b);
            a.add(d.element, "is-positioning-post-drag");
            var e = this._getDragEndLayoutComplete(b, d);
            d.needsPositioning ? (d.on("layout", e), d.moveTo(d.placeRect.x, d.placeRect.y)) : d && d.copyPlaceRectPosition(), 
            this.clearDragTimeout(), this.on("layoutComplete", e), this.layout();
        }, g.prototype._getDragEndLayoutComplete = function(b, c) {
            var d = c && c.needsPositioning, e = 0, f = d ? 2 : 1, g = this;
            return function() {
                return e++, e !== f ? !0 : (c && (a.remove(c.element, "is-positioning-post-drag"), 
                c.isPlacing = !1, c.copyPlaceRectPosition()), g.unstamp(b), g.sortItemsByPosition(), 
                d && g.emitEvent("dragItemPositioned", [ g, c ]), !0);
            };
        }, g.prototype.bindDraggabillyEvents = function(a) {
            a.on("dragStart", this.handleDraggabilly.dragStart), a.on("dragMove", this.handleDraggabilly.dragMove), 
            a.on("dragEnd", this.handleDraggabilly.dragEnd);
        }, g.prototype.bindUIDraggableEvents = function(a) {
            a.on("dragstart", this.handleUIDraggable.start).on("drag", this.handleUIDraggable.drag).on("dragstop", this.handleUIDraggable.stop);
        }, g.Rect = d, g.Packer = e, g;
    }
    "function" == typeof define && define.amd ? define([ "classie/classie", "get-size/get-size", "outlayer/outlayer", "packery/js/rect", "packery/js/packer", "packery/js/item" ], b) : a.Packery = b(a.classie, a.getSize, a.Outlayer, a.Packery.Rect, a.Packery.Packer, a.Packery.Item);
}(window), function(a) {
    "use strict";
    function b(a, b, c) {
        return a.addEventListener ? a.addEventListener(b, c, !1) : a.attachEvent ? a.attachEvent("on" + b, c) : void 0;
    }
    function c(a, b) {
        var c, d;
        for (c = 0, d = a.length; d > c; c++) if (a[c] === b) return !0;
        return !1;
    }
    function d(a, b) {
        var c;
        a.createTextRange ? (c = a.createTextRange(), c.move("character", b), c.select()) : a.selectionStart && (a.focus(), 
        a.setSelectionRange(b, b));
    }
    function e(a, b) {
        try {
            return a.type = b, !0;
        } catch (c) {
            return !1;
        }
    }
    a.Placeholders = {
        Utils: {
            addEventListener: b,
            inArray: c,
            moveCaret: d,
            changeType: e
        }
    };
}(this), function(a) {
    "use strict";
    function b() {}
    function c() {
        try {
            return document.activeElement;
        } catch (a) {}
    }
    function d(a, b) {
        var c, d, e = !!b && a.value !== b, f = a.value === a.getAttribute(H);
        return (e || f) && "true" === a.getAttribute(I) ? (a.removeAttribute(I), a.value = a.value.replace(a.getAttribute(H), ""), 
        a.className = a.className.replace(G, ""), d = a.getAttribute(O), parseInt(d, 10) >= 0 && (a.setAttribute("maxLength", d), 
        a.removeAttribute(O)), c = a.getAttribute(J), c && (a.type = c), !0) : !1;
    }
    function e(a) {
        var b, c, d = a.getAttribute(H);
        return "" === a.value && d ? (a.setAttribute(I, "true"), a.value = d, a.className += " " + F, 
        c = a.getAttribute(O), c || (a.setAttribute(O, a.maxLength), a.removeAttribute("maxLength")), 
        b = a.getAttribute(J), b ? a.type = "text" : "password" === a.type && T.changeType(a, "text") && a.setAttribute(J, "password"), 
        !0) : !1;
    }
    function f(a, b) {
        var c, d, e, f, g, h, i;
        if (a && a.getAttribute(H)) b(a); else for (e = a ? a.getElementsByTagName("input") : p, 
        f = a ? a.getElementsByTagName("textarea") : q, c = e ? e.length : 0, d = f ? f.length : 0, 
        i = 0, h = c + d; h > i; i++) g = c > i ? e[i] : f[i - c], b(g);
    }
    function g(a) {
        f(a, d);
    }
    function h(a) {
        f(a, e);
    }
    function i(a) {
        return function() {
            r && a.value === a.getAttribute(H) && "true" === a.getAttribute(I) ? T.moveCaret(a, 0) : d(a);
        };
    }
    function j(a) {
        return function() {
            e(a);
        };
    }
    function k(a) {
        return function(b) {
            return t = a.value, "true" === a.getAttribute(I) && t === a.getAttribute(H) && T.inArray(D, b.keyCode) ? (b.preventDefault && b.preventDefault(), 
            !1) : void 0;
        };
    }
    function l(a) {
        return function() {
            d(a, t), "" === a.value && (a.blur(), T.moveCaret(a, 0));
        };
    }
    function m(a) {
        return function() {
            a === c() && a.value === a.getAttribute(H) && "true" === a.getAttribute(I) && T.moveCaret(a, 0);
        };
    }
    function n(a) {
        return function() {
            g(a);
        };
    }
    function o(a) {
        a.form && (y = a.form, "string" == typeof y && (y = document.getElementById(y)), 
        y.getAttribute(K) || (T.addEventListener(y, "submit", n(y)), y.setAttribute(K, "true"))), 
        T.addEventListener(a, "focus", i(a)), T.addEventListener(a, "blur", j(a)), r && (T.addEventListener(a, "keydown", k(a)), 
        T.addEventListener(a, "keyup", l(a)), T.addEventListener(a, "click", m(a))), a.setAttribute(L, "true"), 
        a.setAttribute(H, w), (r || a !== c()) && e(a);
    }
    var p, q, r, s, t, u, v, w, x, y, z, A, B, C = [ "text", "search", "url", "tel", "email", "password", "number", "textarea" ], D = [ 27, 33, 34, 35, 36, 37, 38, 39, 40, 8, 46 ], E = "#ccc", F = "placeholdersjs", G = new RegExp("(?:^|\\s)" + F + "(?!\\S)"), H = "data-placeholder-value", I = "data-placeholder-active", J = "data-placeholder-type", K = "data-placeholder-submit", L = "data-placeholder-bound", M = "data-placeholder-focus", N = "data-placeholder-live", O = "data-placeholder-maxlength", P = document.createElement("input"), Q = document.getElementsByTagName("head")[0], R = document.documentElement, S = a.Placeholders, T = S.Utils;
    if (S.nativeSupport = void 0 !== P.placeholder, !S.nativeSupport) {
        for (p = document.getElementsByTagName("input"), q = document.getElementsByTagName("textarea"), 
        r = "false" === R.getAttribute(M), s = "false" !== R.getAttribute(N), u = document.createElement("style"), 
        u.type = "text/css", v = document.createTextNode("." + F + " { color:" + E + "; }"), 
        u.styleSheet ? u.styleSheet.cssText = v.nodeValue : u.appendChild(v), Q.insertBefore(u, Q.firstChild), 
        B = 0, A = p.length + q.length; A > B; B++) z = B < p.length ? p[B] : q[B - p.length], 
        w = z.attributes.placeholder, w && (w = w.nodeValue, w && T.inArray(C, z.type) && o(z));
        x = setInterval(function() {
            for (B = 0, A = p.length + q.length; A > B; B++) z = B < p.length ? p[B] : q[B - p.length], 
            w = z.attributes.placeholder, w ? (w = w.nodeValue, w && T.inArray(C, z.type) && (z.getAttribute(L) || o(z), 
            (w !== z.getAttribute(H) || "password" === z.type && !z.getAttribute(J)) && ("password" === z.type && !z.getAttribute(J) && T.changeType(z, "text") && z.setAttribute(J, "password"), 
            z.value === z.getAttribute(H) && (z.value = w), z.setAttribute(H, w)))) : z.getAttribute(I) && (d(z), 
            z.removeAttribute(H));
            s || clearInterval(x);
        }, 100);
    }
    T.addEventListener(a, "beforeunload", function() {
        S.disable();
    }), S.disable = S.nativeSupport ? b : g, S.enable = S.nativeSupport ? b : h;
}(this), function(a) {
    a.fn.stacktable = function(b) {
        var c = this, d = {
            id: "stacktable small-only",
            hideOriginal: !0,
            headIndex: 0
        }, e = a.extend({}, d, b);
        return b && b.headIndex ? headIndex = b.headIndex : headIndex = 0, c.each(function() {
            var b = a(this).prop("class"), c = a('<table class="' + b + " " + e.id + '"><tbody></tbody></table>');
            "undefined" != typeof e.myClass && c.addClass(e.myClass);
            var d = "";
            $table = a(this), $table.addClass("stacktable large-only"), $caption = $table.find("caption").clone(), 
            $topRow = $table.find("tr").eq(0), $table.find("tr").each(function(b, c) {
                headMarkup = "", bodyMarkup = "", tr_class = a(this).prop("class"), 0 === b ? d += '<tr class=" ' + tr_class + ' "><th class="st-head-row st-head-row-main" colspan="2">' + a(this).find("th,td").eq(headIndex).html() + "</th></tr>" : (a(this).find("td,th").each(function(b, c) {
                    b === headIndex ? headMarkup = '<tr class="' + tr_class + '"><th class="st-head-row" colspan="2">' + a(this).html() + "</th></tr>" : b === headIndex + 1 ? headMarkup += '<tr class="' + tr_class + '"><td class="st-thumb-row" colspan="2">' + a(this).html() + "</td></tr>" : b === headIndex + 6 ? headMarkup += '<tr class="' + tr_class + '"><td class="st-thumb-row" colspan="2">' + a(this).html() + "</td></tr>" : "" !== a(this).html() && (bodyMarkup += '<tr class="' + tr_class + '">', 
                    $topRow.find("td,th").eq(b).html() ? bodyMarkup += '<td class="st-key">' + $topRow.find("td,th").eq(b).html() + "</td>" : bodyMarkup += '<td class="st-key"></td>', 
                    bodyMarkup += '<td class="st-val ' + a(this).prop("class") + '">' + a(this).html() + "</td>", 
                    bodyMarkup += "</tr>");
                }), d += headMarkup + bodyMarkup);
            }), c.prepend($caption), c.append(a(d)), $table.before(c), e.hideOriginal || $table.show();
        });
    }, a.fn.stackcolumns = function(b) {
        var c = this, d = {
            id: "stacktable small-only",
            hideOriginal: !0
        }, e = a.extend({}, d, b);
        return c.each(function() {
            $table = a(this);
            var b = $table.find("tr").eq(0).find("td,th").length;
            if (!(3 > b)) {
                var c = a('<table class="' + e.id + '"></table>');
                "undefined" != typeof e.myClass && c.addClass(e.myClass), $table.addClass("stacktable large-only");
                for (var d = a("<tbody></tbody>"), f = 1; b > f; ) $table.find("tr").each(function(b, c) {
                    var e = a("<tr></tr>");
                    0 === b && e.addClass("st-head-row st-head-row-main"), first = a(this).find("td,th").eq(0).clone().addClass("st-key");
                    var g = f;
                    if (a(this).find("*[colspan]").length) {
                        var h = 0;
                        a(this).find("td,th").each(function(b, c) {
                            var d = a(this).attr("colspan");
                            return d ? (d = parseInt(d, 10), g -= d - 1, h + d > f && (g += h + d - f - 1), 
                            h += d) : h++, h > f ? !1 : void 0;
                        });
                    }
                    second = a(this).find("td,th").eq(g).clone().addClass("st-val").removeAttr("colspan"), 
                    e.append(first, second), d.append(e);
                }), ++f;
                c.append(a(d)), $table.before(c), e.hideOriginal || $table.show();
            }
        });
    };
}(jQuery);

var bb = bb ? bb : {};

$.extend(bb, {
    settings: {
        $window: $(window),
        $html: $("html"),
        $body: $("body"),
        $htmlbody: $("html,body"),
        $page: $("#page"),
        $header: $("#header"),
        $main: $("#main"),
        $footer: $("#footer"),
        urlParams: {},
        processedClass: "processed",
        browserPrefix: null,
        transitionEnd: null,
        animationEnd: null,
        transitionAnimationEnd: null,
        processinglastComponent: !1,
        breakpointA: 320,
        breakpointB: 480,
        breakpointC: 600,
        breakpointD: 768,
        breakpointE: 1024,
        breakpointF: 1200,
        modules: {
            moduleRoot: "/_scripts/plugins/modules/min/"
        },
        mustache: {
            templateRoot: "/_templates/"
        },
        rtl: !1
    },
    mq: {
        globalObj: null,
        $detector: $("#monitor-width"),
        detectorWidth: 0,
        currentBreakpoint: 0,
        previousBreakpoint: 0,
        breakpointChange: !1,
        monitorWidth: function() {
            var a = this;
            a.$detector.length || (a.$detector = $("<div />", {
                id: "monitor-width"
            }), a.globalObj.settings.$body.append(a.$detector)), a.detectorWidth = a.$detector.width(), 
            a.previousBreakpoint = a.currentBreakpoint, a.breakpointChange = !1, a.detectorWidth !== a.currentBreakpoint && (a.currentBreakpoint = a.detectorWidth, 
            a.breakpointChange = !0);
        }
    },
    getUrlParams: function(a) {
        if (a) {
            for (var b = {}, c = a.split("&"), d = 0; d < c.length; d++) {
                var e = c[d].split("=");
                b[decodeURIComponent(e[0])] = decodeURIComponent(e[1]);
            }
            return b;
        }
    },
    setUrlParams: function() {
        var a = this;
        a.settings.urlParams = a.getUrlParams(window.location.search);
    },
    log: function(a) {
        "undefined" != typeof console && console.log(a);
    },
    htmlEncode: function(a) {
        return a ? $("<div />").text(a).html() : "";
    },
    htmlDecode: function(a) {
        return a ? $("<div />").html(a).text() : "";
    },
    removeStyle: function(a) {
        a.removeAttr("style");
    },
    ltIECache: {},
    ltIE: function(a) {
        var b = this;
        return b.ltIECache[a] || (b.settings.$html.hasClass("lt-ie" + a) ? b.ltIECache[a] = !0 : b.ltIECache[a] = !1), 
        b.ltIECache[a];
    },
    browserPrefix: function() {
        if (window.getComputedStyle) {
            var a = this, b = window.getComputedStyle(window.document.documentElement, ""), c = (Array.prototype.slice.call(b).join("").match(/-(moz|webkit|ms)-/) || "" === b.OLink && [ "", "o" ])[1];
            "WebKit|Moz|MS|O".match(new RegExp("(" + c + ")", "i"))[1];
            a.settings.browserPrefix = "-" + c + "-";
        }
    },
    transitionAnimationEndEvent: function() {
        var a, b, c, d, e = this, f = window.document.createElement("transitionAnimationElement");
        b = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            MSTransition: "msTransitionEnd",
            OTransition: "oTransitionEnd",
            transition: "transitionend"
        }, d = {
            WebkitAnimation: "webkitAnimationEnd",
            MozAnimation: "animationend",
            MSAnimation: "msAnimationEnd",
            OAnimation: "oAnimationEnd",
            animation: "animationend"
        };
        for (a in b) void 0 !== f.style[a] && (e.settings.transitionEnd = b[a]);
        null === e.settings.transitionEnd && (e.settings.transitionEnd = "noTransitionEnd");
        for (c in d) void 0 !== f.style[c] && (e.settings.animationEnd = d[c]);
        null === e.settings.animationEnd && (e.settings.animationEnd = "noAnimationEnd"), 
        e.settings.transitionAnimationEnd = (e.settings.transitionEnd + " " + e.settings.animationEnd).toString();
    },
    rightToLeft: function() {
        var a = this, b = a.settings.$html.attr("dir");
        "rtl" === b && (a.settings.rtl = !0);
    },
    lastComponent: {
        globalObj: null,
        $moduleContainers: null,
        moduleSelector: ".block",
        lastClass: "block-last",
        ieLastClass: "block-last-clear",
        $currentModuleContainer: null,
        processing: !1,
        roundingOffset: 3,
        init: function() {
            var a = this;
            return a.$moduleContainers = $(".region-inner"), a.$moduleContainers ? void a.startProcessing(!1) : !1;
        },
        stopProcessing: function() {
            var a = this;
            return console.timeEnd("Processing last components"), a.processing = !1, !1;
        },
        startProcessing: function(a) {
            var b = this;
            console.time("Processing last components"), b.processing = !0, (b.processing || b.$moduleContainers.length < 1) && b.stopProcessing(), 
            a && ($(b.moduleSelector).removeClass(b.lastClass), b.globalObj.ltIE(8) && $("." + b.ieLastClass).remove()), 
            b.$moduleContainers.each(function(a) {
                var c = $(this), d = c.find(b.moduleSelector), e = d.length, f = null;
                1 > e && b.stopProcessing(), f = c.width() - b.roundingOffset, b.processModules(d, f);
            });
        },
        processModules: function(a, b) {
            var c = this;
            a && b || c.stopProcessing(), a.each(function(a) {
                var d = $(this);
                if (d.hasClass("pull-right")) return !0;
                var e = parseInt(d.quickOuterWidth(!0), 10);
                if (e >= b) return c.setLastModule(d), !0;
                var f = parseInt(d.position().left, 10), g = Math.round(b - parseInt(f + e, 10));
                return c.globalObj.settings.rtl && f > c.roundingOffset ? !0 : !c.globalObj.settings.rtl && g > c.roundingOffset ? !0 : void c.setLastModule(d);
            }), c.stopProcessing();
        },
        setLastModule: function(a) {
            var b = this;
            return a ? (a.addClass(b.lastClass), void (b.globalObj.ltIE(8) && a.after("<div />", {
                "class": b.ieLastClass
            }))) : !1;
        }
    },
    fixedHeader: {
        globalObj: null,
        init: function() {
            var a = this;
            a.globalObj.ltIE(10) || a.fixHeader();
        },
        fixHeader: function() {
            var a = this;
            a.resize(), $("#header").children(".header-main").length > 0 && $("#header").headroom({
                tolerance: 5,
                topTolerance: 2 * a.globalObj.settings.$header.outerHeight(),
                offset: a.globalObj.settings.$header.outerHeight(),
                classes: {
                    initial: "animated",
                    pinned: "pinned",
                    unpinned: "unpinned",
                    top: "headerTop"
                }
            });
        },
        resize: function() {
            var a = this;
            a.globalObj.settings.$window, a.globalObj.settings.$html;
            a.globalObj.mq.currentBreakpoint < a.globalObj.settings.breakpointD && !a.globalObj.ltIE(10) ? a.globalObj.settings.$body.css({
                "padding-top": a.globalObj.settings.$header.outerHeight()
            }) : a.globalObj.settings.$body.css({
                "padding-top": "0"
            });
        }
    },
    selectNavigate: function() {
        var a = $(".select-navigate");
        a.length > 0 && a.on("change.bbSelectNav", function() {
            window.document.location = $(this).val();
        });
    },
    navigation: {
        globalObj: null,
        $navHandle: null,
        navInClass: "nav-in",
        init: function() {
            var a = this;
            a.$navHandle = $(".header-nav-handle"), a.$navHandle.on("click.navigation", function(b) {
                b.preventDefault(), a.toggleNav();
            });
        },
        toggleNav: function() {
            var a = this;
            a.globalObj.settings.$html.hasClass(a.navInClass) ? a.hideNav() : a.showNav();
        },
        hideNav: function() {
            var a = this;
            a.globalObj.settings.$html.removeClass(a.navInClass);
        },
        showNav: function() {
            var a = this;
            a.globalObj.settings.$html.addClass(a.navInClass), a.globalObj.search.hideSearch();
        }
    },
    secondaryNavigation: {
        globalObj: null,
        subHandleSelector: ".sub-nav-handle",
        $subNavHandle: null,
        subNavInClass: "sub-nav-in",
        iconOpenClass: "icon-arrow-down",
        iconCloseClass: "icon-arrow-up",
        init: function() {
            var a = this;
            a.$subNavHandle = $(a.subHandleSelector), a.toggleSubNav();
        },
        toggleSubNav: function() {
            var a = this;
            a.$subNavHandle.each(function() {
                var b = $(this);
                b.on("click.secondaryNavigation", function(b) {
                    var c = $(this), d = c.parent("li").find(".menu-secondary"), e = 0;
                    d.hasClass(a.subNavInClass) ? (d.attr("style", "height:" + e + "px"), d.removeClass(a.subNavInClass), 
                    c.removeClass(a.iconCloseClass), c.addClass(a.iconOpenClass)) : (d.find("li").each(function() {
                        e += $(this).outerHeight();
                    }), d.attr("style", "height:" + e + "px"), d.addClass(a.subNavInClass), c.removeClass(a.iconOpenClass), 
                    c.addClass(a.iconCloseClass));
                });
            });
        }
    },
    loader: {
        globalObj: null,
        $loader: null,
        spin: !1,
        init: function() {
            var a = this;
            a.$loader || (a.$loader = $('<div class="loader" />'), a.globalObj.settings.$body.append(a.$loader));
        },
        showLoader: function() {
            var a = this;
            a.$loader.addClass("show").removeClass("out").addClass("in"), a.spin || (a.$loader.spin("large", "#fff"), 
            a.spin = !0);
        },
        hideLoader: function() {
            var a = this;
            a.$loader.on(a.globalObj.settings.transitionAnimationEnd, function() {
                a.$loader.removeClass("out").removeClass("show"), a.$loader.off(a.globalObj.settings.transitionAnimationEnd);
            }).removeClass("in").addClass("out"), Modernizr.csstransitions || a.$loader.trigger(a.globalObj.settings.transitionEnd).trigger(a.globalObj.settings.animationEnd);
        }
    },
    search: {
        globalObj: null,
        $searchHandle: null,
        searchInClass: "search-in",
        init: function() {
            var a = this;
            a.$searchHandle = $(".header-search-handle-old"), a.$searchHandle.on("click.search", function(b) {
                b.preventDefault(), a.globalObj.mq.currentBreakpoint < a.globalObj.settings.breakpointD ? a.toggleSearch() : a.quickSearch();
            });
        },
        toggleSearch: function() {
            var a = this;
            a.globalObj.settings.$html.hasClass(a.searchInClass) ? a.hideSearch() : a.showSearch();
        },
        hideSearch: function() {
            var a = this;
            a.globalObj.settings.$html.removeClass(a.searchInClass);
        },
        showSearch: function() {
            var a = this;
            a.globalObj.settings.$html.addClass(a.searchInClass), a.globalObj.navigation.hideNav();
        },
        quickSearch: function() {
            var a = this;
            a.globalObj.quickSearch.showSearch();
        }
    },
    quickSearch: {
        globalObj: null,
        $quickSearchOverlay: null,
        $quickSearch: null,
        $searchForm: null,
        $searchResultsKeyword: null,
        $searchResultsTotalRecords: null,
        $searchResultsSuggestion: null,
        $searchResultsSuggestionLink: null,
        $searchResultsCount: null,
        masonry: null,
        keyupTimer: null,
        keyupTimerTimeout: 300,
        searchIn: !1,
        reqGetResults: null,
        processResultsTimeout: null,
        data: null,
        loading: !1,
        templates: {
            result: "search/result.mustache"
        },
        preInit: function() {
            var a = this;
            a.$quickSearch = $(".quicksearch"), a.$quickSearchOverlay = $(".quicksearch-overlay"), 
            a.$quickSearch.length > 0 && a.init();
        },
        init: function() {
            var a = this;
            a.$quickSearch.length < 1 || ($.get(a.globalObj.settings.mustache.templateRoot + a.templates.result, function(b) {
                a.templates.result = Mustache.compile(b);
            }), a.$searchForm = $("#search-form"), a.$searchForm.on("submit.bbsearch", function() {
                null !== a.reqGetResults && a.reqGetResults.abort();
            }), a.$searchResultsKeyword = $("#search-keyword"), a.$searchResultsTotalRecords = $("#search-total-records"), 
            a.$searchResultsSuggestion = $("#search-suggestion"), a.$searchResultsSuggestionLink = $("#search-suggestion-link"), 
            a.$searchResultsCount = $("#search-count"), a.$searchResultsTerm = $("#search-term"), 
            a.$searchResults = $("#search-results"), a.$quickSearch.on("keypress.bbSearch", "input[type=search], input[type=text]", function(a) {
                var b = a.keyCode ? a.keyCode : a.which;
                return 13 === b ? (a.preventDefault(), void a.stopPropagation()) : void 0;
            }).on("keyup.bbSearch", "input[type=search], input[type=text]", function(b) {
                var c = b.keyCode ? b.keyCode : b.which;
                if (13 === c) return b.preventDefault(), void b.stopPropagation();
                var d = $(this), e = d.val(), f = d.data("previous-value");
                clearTimeout(a.keyupTimer), e && (e = $.trim(e)), 0 === e.length && e !== f ? (a.clearSearch(), 
                e = "") : a.keyupTimer = setTimeout(function() {
                    a.loading = !0, a.refineSearch();
                }, a.keyupTimerTimeout), d.data("previous-value", e);
            }), a.$searchResultsCount.on("click.bbSearch", "a", function(b) {
                b.preventDefault(), a.$searchForm.submit();
            }), a.globalObj.settings.$body.on("click.bbQuickSearch", ".quicksearch-dismiss", function(b) {
                b.preventDefault(), a.hideSearch();
            }));
        },
        refineSearch: function() {
            var a = this, b = a.$searchForm.attr("action"), c = a.globalObj.getUrlParams(a.$searchForm.serialize());
            a.clearSearch(), a.getResults(b, c);
        },
        getResults: function(a, b) {
            console.time("Get Results");
            var c = this;
            null !== c.reqGetResults && c.reqGetResults.abort(), c.globalObj.loader.showLoader(), 
            $.extend(b, {
                json: 1
            }), c.reqGetResults = $.ajax({
                url: a,
                data: b,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                cache: !1,
                success: function(a, b, d) {
                    c.globalObj.loader.hideLoader(), a.labels = c.globalObj.language.labels, c.data = a, 
                    c.processResults();
                },
                error: function(a, b, d) {
                    c.globalObj.loader.hideLoader(), ("abort" !== b && "error" !== b || a.getAllResponseHeaders()) && window.alert(c.globalObj.language.labels.global.genericError);
                }
            });
        },
        processResults: function() {
            var a = this, b = null;
            if (!a.data) return void a.getResults();
            a.$searchResults.children(".block-sizer").length < 1 && (a.$masonrySizer = $('<div class="block-sizer b-1"></div><div class="gutter-sizer"></div>'), 
            a.$searchResults.append(a.$masonrySizer));
            var c = $(a.templates.result(a.data));
            a.$searchResults.removeClass("in"), c.each(function() {
                a.$searchResults.append($(this));
            }), a.$searchResultsTerm.text(a.data.searchTerm), a.$searchResultsTotalRecords.text(a.data.totalRecords), 
            a.data.totalRecords > 0 ? a.$searchResultsCount.addClass("in") : a.$searchResultsCount.removeClass("in"), 
            a.data.suggestion && a.data.suggestionUrl && (a.$searchResultsSuggestion.addClass("in"), 
            a.$searchResultsSuggestionLink.attr("href", a.data.suggestionUrl).html(a.data.suggestion)), 
            a.$searchResults.addClass("in"), b = window.setTimeout(function() {
                a.masonryInit(), clearTimeout(b);
            }, 100), a.loading = !1;
        },
        masonryInit: function() {
            var a = this;
            a.masonry && a.$searchResults.packery("destroy"), a.$masonryBlocks = a.$searchResults.find(".result"), 
            a.buildMasonry();
        },
        buildMasonry: function() {
            var a = this;
            return a.$searchResults = $("#search-results"), a.$searchResults.length < 1 ? !1 : (a.$searchResults.addClass("loading"), 
            void a.$searchResults.imagesLoaded(function(b) {
                a.$searchResults.packery({
                    columnWidth: ".block-sizer",
                    gutter: ".gutter-sizer",
                    itemSelector: ".result"
                }), a.showMasonry(), a.$searchResults.removeClass("loading"), a.masonry = a.$searchResults.data("packery");
            }));
        },
        refreshMasonry: function() {
            var a = this;
            return a.masonry ? void a.$searchResults.packery() : !1;
        },
        showMasonry: function() {
            var a = this;
            if (a.$searchResults.length < 1) return !1;
            var b = 0, c = 1;
            a.$masonryBlocks.each(function() {
                var a, d = $(this);
                clearTimeout(a), a = setTimeout(function() {
                    d.addClass("in"), clearTimeout(a);
                }, b), b = 150 * c, c++;
            });
        },
        clearSearch: function() {
            var a = this, b = a.$searchResults.find(".result");
            b.length && (b.remove(), a.$searchResultsTerm.text(""), a.$searchResultsTotalRecords.text("0"), 
            a.$searchResultsCount.removeClass("in"), a.$searchResultsSuggestion.removeClass("in"), 
            a.$searchResultsSuggestionLink.attr("href", "#").html(""));
        },
        showOverlay: function() {
            var a = this;
            a.globalObj.settings.$body.width(a.globalObj.settings.$body.width()).addClass("quicksearch-in"), 
            a.globalObj.settings.$header.width(a.globalObj.settings.$body.width()), a.searchIn = !0, 
            a.$quickSearchOverlay.addClass("show").delay(10).queue(function(b) {
                a.$quickSearchOverlay.addClass("in"), b();
            });
        },
        hideOverlay: function() {
            var a = this;
            a.searchIn && (null !== a.reqGetResults && (console.log("abort search"), a.reqGetResults.abort()), 
            a.$searchResultsKeyword.length > 0 && a.$searchResultsKeyword.val(""), a.$quickSearchOverlay.on(a.globalObj.settings.transitionAnimationEnd, function() {
                a.$quickSearchOverlay.off(a.globalObj.settings.transitionEnd).off(a.globalObj.settings.animationEnd).removeClass("show").removeClass("out"), 
                a.globalObj.settings.$body.removeClass("quicksearch-in").removeStyle(), a.globalObj.settings.$header.removeStyle(), 
                a.searchIn = !1;
            }).removeClass("in"), Modernizr.csstransitions || a.$quickSearchOverlay.trigger(a.globalObj.settings.transitionEnd).trigger(a.globalObj.settings.animationEnd));
        },
        showSearch: function() {
            var a, b = this;
            b.searchIn || (b.$quickSearch.find("input[type=search], input[type=text]").val(""), 
            b.clearSearch(), b.showOverlay(), b.$quickSearch.addClass("show").delay(10).queue(function(c) {
                b.$quickSearch.addClass("in"), a = window.setTimeout(function() {
                    $(".quicksearch-keyword").focus(), window.clearTimeout(a);
                }, 100), c();
            }));
        },
        hideSearch: function() {
            var a = this;
            a.searchIn && (a.$quickSearch.on(a.globalObj.settings.transitionAnimationEnd, function() {
                a.$quickSearch.off(a.globalObj.settings.transitionEnd).off(a.globalObj.settings.animationEnd).removeClass("show").removeClass("out"), 
                a.hideOverlay();
            }).removeClass("in").addClass("out"), Modernizr.csstransitions || a.$quickSearch.trigger(a.globalObj.settings.transitionEnd).trigger(a.globalObj.settings.animationEnd));
        },
        resize: function() {
            var a = this;
            a.searchIn;
        }
    },
    dropdownMenus: {
        globalObj: null,
        $dropdowns: null,
        dropdownHover: !1,
        dropdownInClass: "dropdown-in",
        init: function() {
            var a = this;
            a.$dropdowns = $(".dropdown"), a.$dropdowns.on("click.dropdownMenus", ".dropdown-handle", function(b) {
                var c = $(this), d = c.closest(".dropdown"), e = c.attr("href"), f = $(e);
                d.hasClass(a.dropdownInClass) ? a.$dropdowns.removeClass(a.dropdownInClass) : (a.$dropdowns.removeClass(a.dropdownInClass), 
                d.addClass(a.dropdownInClass)), f.on("mouseenter.bbDropdownMenus", function() {
                    a.dropdownHover = !0;
                }).on("mouseleave.bbDropdownMenus", function() {
                    a.dropdownHover = !1;
                }), b.preventDefault(), b.stopPropagation();
            }), a.globalObj.settings.$html.on("click.dropdownMenus", function(b) {
                a.dropdownHover || a.$dropdowns.removeClass(a.dropdownInClass);
            });
        }
    },
    videos: {
        globalObj: null,
        videoWrapTemplate: "videos/iframe-video-wrap.mustache",
        videoWrapTemplateCompiled: null,
        init: function() {
            var a = this;
            $("iframe:not(.processed)").each(function() {
                var b = $(this), c = b.attr("src");
                "undefined" != typeof c && c !== !1 && c.indexOf("youtube") > -1 && b.parent(".media-video-iframe").length < 1 && a.wrapVideoIframe(b);
            }), a.doFitVids();
        },
        doFitVids: function() {
            var a = $(".media-video-iframe:not(.processed)");
            return a.length < 1 ? !1 : (a.fitVids(), void a.addClass("processed"));
        },
        loadTemplate: function(a) {
            if (a) {
                var b = this, c = null;
                c = $.get(b.globalObj.settings.mustache.templateRoot + b.videoWrapTemplate, function(a) {
                    b.videoWrapTemplateCompiled = Mustache.compile(a);
                }), $.when(c).done(function() {
                    b.wrapVideoIframe(a);
                });
            }
        },
        wrapVideoIframe: function(a) {
            if (a) {
                var b = this;
                if (!b.videoWrapTemplateCompiled) return void b.loadTemplate(a);
                a.wrap(b.videoWrapTemplateCompiled), a.addClass("processed"), b.doFitVids();
            }
        }
    },
    numberInputs: {
        $inputNumbers: null,
        preInit: function() {
            var a = this;
            a.$inputNumbers = $(".input-number,input[type=number]"), a.$inputNumbers.length > 0 && Modernizr.load({
                test: Modernizr.input.number,
                nope: a.globalObj.settings.modules.moduleRoot + "jquery.numeric.js",
                callback: function() {
                    a.init();
                }
            });
        },
        init: function() {
            var a = this;
            a.$inputNumbers.numeric();
        }
    },
    dateInputs: {
        globalObj: null,
        $dateInputs: null,
        preInit: function() {
            var a = this;
            a.$dateInputs = $('input[type="date"]:not(.processed)'), a.$dateInputs.length > 0 && Modernizr.load({
                test: Modernizr.inputtypes.date,
                nope: [ a.globalObj.settings.modules.moduleRoot + "picker.js", a.globalObj.settings.modules.moduleRoot + "picker.date.js", a.globalObj.settings.modules.moduleRoot + "legacy.js" ],
                complete: function() {
                    a.init();
                }
            });
        },
        init: function() {
            var a = this;
            Modernizr.inputtypes.date || (a.$dateInputs.addClass("processed"), a.$dateInputs.each(function() {
                var a = $(this), b = a.attr("min") ? a.attr("min") : !1, c = a.attr("max") ? a.attr("max") : !1, d = (a.attr("class"), 
                a.val());
                a.attr("placeholder");
                if (d.length > 0) {
                    var e = d.toString().split("-");
                    e = $.trim(e[2]) + "/" + $.trim(e[1]) + "/" + $.trim(e[0]), a.val(e);
                }
                b && (b = b.toString().split("-"), b = b[2] + "/" + b[1] + "/" + b[0]), c && (c = c.toString().split("-"), 
                c = c[2] + "/" + c[1] + "/" + c[0]), a.pickadate({
                    format: "dd/mm/yyyy",
                    min: b,
                    max: c,
                    submitFormat: "yyyy-mm-dd",
                    editable: !0
                });
            }));
            var b = $(".event-date-range");
            b.length > 0 && b.find('input:not([type="hidden"])').on("change.bbDateRange", function() {
                $(".date-range-validator").valid();
            });
        }
    },
    showHideFields: function() {
        $(".showhide-fields").each(function() {
            var a = $(this), b = a.attr("data-showhide-fields"), c = a.attr("data-showhide-default");
            void 0 !== b && ($(b).hide(), void 0 !== c && $(c).show(), a.find("[data-showhide-target]").on("click.bbShowHideFields", function() {
                var a = $(this), c = a.attr("data-showhide-target");
                $(b).hide(), $(b).addClass("indivdual-chosen"), "" !== c ? ($(c).show(), $(c).removeClass("indivdual-chosen"), 
                $(".application-numbering").text("3"), $(".application-numbering-rd").text("4")) : ($(".application-numbering").text("2"), 
                $(".application-numbering-rd").text("3"));
            }), a.find("[data-showhide-target]:checked").click());
        });
    },
    formDefaults: function() {
        $.validator.setDefaults({
            ignore: ":hidden:not(.val-hidden)"
        });
    },
    textareas: {
        globalObj: null,
        $richTextareas: null,
        $autoTextareas: null,
        preInit: function() {
            var a = this;
            a.$richTextareas = $("textarea.textarea-rte:not(.processed)"), a.$autoTextareas = $("textarea.textarea-autoheight:not(.processed)"), 
            a.$richTextareas.length > 0 && Modernizr.load({
                load: a.globalObj.settings.modules.moduleRoot + "jquery-te-1.4.0.js",
                complete: function() {
                    a.richTextareas();
                }
            }), a.$autoTextareas.length > 0 && a.autoTextareas();
        },
        richTextareas: function() {
            var a = this;
            a.$richTextareas.each(function() {
                var a = $(this), b = a.attr("class"), c = "";
                a.addClass("processed"), a.jqte({
                    css: "rte",
                    fsize: !1,
                    format: !1,
                    sub: !1,
                    sup: !1,
                    strike: !1,
                    color: !1,
                    center: !1,
                    left: !1,
                    right: !1,
                    br: !1,
                    u: !1,
                    rule: !1,
                    unlink: !1,
                    remove: !1,
                    source: !1,
                    focus: function() {
                        c = a.val();
                    },
                    blur: function() {
                        c !== a.val() && (a.trigger("change"), c = a.val());
                    }
                }), a.closest(".rte").addClass(b).removeClass("textarea-rte");
            });
        },
        autoTextareas: function() {
            var a = this;
            a.$autoTextareas.each(function() {
                var a = $(this);
                a.addClass("processed").autosize();
            });
        }
    },
    searchForm: {
        $searchButtons: null,
        init: function() {
            var a = this;
            a.$searchButtons = $(".search-form-btn"), a.resize();
        },
        resize: function() {
            var a = this;
            a.$searchButtons.length > 0 && a.$searchButtons.each(function() {
                var a = $(this);
                a.parents(".item").width(a.outerWidth(!0));
            });
        }
    },
    formSteps: function() {
        var a = this;
        $(".form-steps:not(.processed)").each(function() {
            var b = $(this), c = (b.find("form"), $(".form-step")), d = $(".form-step-next"), e = $(".form-step-prev");
            b.addClass("processed"), d.on("click.bbFormSteps", function(b) {
                var d = $(this), e = d.attr("href"), f = d.closest(".form-step"), g = $(e), h = null, i = 0;
                f.find("[data-val=true]").each(function() {
                    var a = $(this), b = a.valid();
                    b || (h = h ? h.add(a) : a, i++);
                }), 1 > i ? (c.addClass("hidden"), g.removeClass("hidden").find("input,select").filter(":first").focus()) : a.focusInvalidElements(f) || h.filter(":first").focus(), 
                b.preventDefault();
            }), e.on("click.bbFormSteps", function(a) {
                var b = $(this), d = b.attr("href"), e = $(d);
                c.addClass("hidden"), e.removeClass("hidden").find("input:first").focus(), a.preventDefault();
            });
        });
    },
    autocomplete: {
        globalObj: null,
        $autoCompletes: null,
        $currentAutocomplete: null,
        keyupTimer: null,
        keyupTimerTimeout: 300,
        getResultsRequest: null,
        minCharacters: 1,
        maxResults: 5,
        ignoreFocus: !1,
        defaultTemplate: "autocomplete/autocomplete-results.mustache",
        defaultTemplateCompiled: null,
        preInit: function() {
            var a = this;
            a.$autoCompletes = $(".autocomplete:not(.processed)"), a.$autoCompletes.length > 0 && a.init();
        },
        init: function() {
            var a = this;
            $.get(a.globalObj.settings.mustache.templateRoot + a.defaultTemplate, function(b) {
                a.defaultTemplateCompiled = Mustache.compile(b);
            }), a.$autoCompletes.each(function() {
                var b = $(this), c = b.find(".autocomplete-input"), d = b.find(".autocomplete-select"), e = b.data("autocomplete-template");
                if (b.addClass("processed").append('<div class="autocomplete-results" />'), d.length > 0) {
                    var f = d.attr("class"), g = d.attr("id");
                    c = $("<input />", {
                        "class": f,
                        id: g,
                        autocomplete: "off"
                    }), $.each(d.data(), function(a, b) {
                        c.data(a, b);
                    }), d.after(c.removeClass("autocomplete-select").addClass("autocomplete-input")), 
                    d.hide().addClass("processed").removeAttr("id").removeAttr("name");
                }
                e && $.get(a.globalObj.settings.mustache.templateRoot + e, function(a) {
                    b.data("autocomplete-template-compiled", Mustache.compile(a));
                });
            }), a.globalObj.settings.$html.on("click.bbAutocomplete", function(b) {
                b.stopPropagation(), a.clearResults();
            }), a.$autoCompletes.on("keydown.bbAutocomplete", ".autocomplete-input", function(a) {
                var b = $(this), c = b.closest(".autocomplete"), d = c.find(".autocomplete-results");
                if (b.data("from-autocomplete", !1), 13 === a.which) return !1;
                if (40 === a.which) {
                    var e = d.find("a:first");
                    if (e.length > 0) return d.find("a:first").focus(), !1;
                }
            }).on("keyup.bbAutocomplete", ".autocomplete-input", function(b) {
                if (a.ignoreFocus) a.ignoreFocus = !1; else {
                    var c = $(this);
                    a.$currentAutocomplete = c.closest(".autocomplete");
                    var d = a.$currentAutocomplete.data("autocomplete-cache");
                    c.val().length >= a.minCharacters ? (window.clearTimeout(a.keyupTimer), a.keyupTimer = window.setTimeout(function() {
                        a.getResults(d), window.clearTimeout(a.keyupTimer);
                    }, a.keyupTimerTimeout)) : a.clearResults(), c.val().length < 1 && (a.clearInputs(), 
                    a.clearResults());
                }
            }), a.$autoCompletes.on("keydown.bbAutocomplete", ".autocomplete-result", function(b) {
                var c = $(this), d = c.closest(".autocomplete"), e = d.find(".autocomplete-input"), f = c.parent();
                if (e.data("from-autocomplete", !0), 40 === b.which) return f.next().children("a").focus(), 
                !1;
                if (38 === b.which && f.is(":first-child")) a.ignoreFocus = !0, e.focus(); else {
                    if (38 === b.which) return f.prev().children("a").focus(), !1;
                    13 === b.which;
                }
            }).on("click.bbAutocomplete", ".autocomplete-result", function(b) {
                var c = $(this), d = (a.$currentAutocomplete, a.$currentAutocomplete.find(".autocomplete-input")), e = c.data("result-id"), f = c.data("label"), g = a.$currentAutocomplete.data("autocomplete-data"), h = g.airports ? !0 : !1, i = a.$currentAutocomplete.find(".autocomplete-hidden-input");
                a.ignoreFocus = !0, h && (d.focus().data("value", e).data("label", f).data("from-autocomplete", !0).val(f).valid(), 
                i.length > 0 && i.val(e)), b.preventDefault();
            });
        },
        getResults: function(a, b) {
            var c = this, d = c.$currentAutocomplete.data("autocomplete-data"), e = c.$currentAutocomplete.find(".autocomplete-input"), f = c.$currentAutocomplete.find(".autocomplete-select"), g = c.$currentAutocomplete.data("autocomplete-url"), h = a ? null : e.val();
            if (f.length > 0 && "undefined" == typeof d) {
                var i = (f[0], f.find("option")), j = {};
                j.results = [];
                for (var k = 0; k < i.length; k++) j.results.push({
                    id: i.eq(k).val(),
                    label: i.eq(k).text()
                });
                c.$currentAutocomplete.data("autocomplete-data", j), c.processResults(b);
            } else if (a && "undefined" != typeof d || !g) {
                if (!d) return !1;
                c.processResults(b);
            } else {
                c.getResultsRequest && c.getResultsRequest.abort(), e.addClass("loading");
                var l = c.$currentAutocomplete.data("autocomplete-max");
                c.getResultsRequest = $.ajax({
                    dataType: "json",
                    url: g,
                    data: {
                        term: h,
                        max: l ? l : c.maxResults
                    },
                    success: function(a) {
                        c.$currentAutocomplete.data("autocomplete-data", a), e.removeClass("loading"), c.processResults(b);
                    }
                });
            }
        },
        processResults: function(a) {
            var b = this, c = b.$currentAutocomplete.data("autocomplete-data"), d = c.people ? !0 : !1, e = c.airports ? !0 : !1, f = b.$currentAutocomplete.data("autocomplete-template-compiled"), g = b.$currentAutocomplete.find(".autocomplete-input").val(), h = $.extend({}, c), i = 0, j = "", k = b.$currentAutocomplete.find(".autocomplete-input"), l = b.$currentAutocomplete.find(".autocomplete-results"), m = b.$currentAutocomplete.data("autocomplete-cache");
            return f || (f = b.defaultTemplateCompiled), c ? (h.labels = b.globalObj.language.labels, 
            (m || !a) && (d && (h.results = h.people), e && (h.results = h.airports), h.results = $.grep(h.results, function(a) {
                j = d ? (a.name + "(" + a.email + ")").toString().toLowerCase() : e ? (a.name + "(" + a.id + ")").toString().toLowerCase() : a.label.toString().toLowerCase();
                var c = b.$currentAutocomplete.data("autocomplete-max");
                return c = c ? c : b.maxResults, i > c ? !1 : -1 !== j.indexOf(g.toLowerCase()) ? (i++, 
                !0) : void 0;
            })), l.css({
                width: k.outerWidth()
            }).html(f(h)), b.$currentAutocomplete.addClass("in"), void 0) : (b.getResults(), 
            !1);
        },
        clearResults: function() {
            var a = this;
            a.$currentAutocomplete && a.$currentAutocomplete.removeClass("in").find(".autocomplete-results").empty();
        },
        clearInputs: function() {
            var a = this;
            a.$currentAutocomplete.find(".autocomplete-input").val("");
        }
    },
    assignPerson: function() {
        var a = this;
        a.settings.$body.on("click.bbAssignPerson", ".assign-person-name", function(a) {
            var b = $(this);
            b.select();
        }).on("click.bbAssignPerson", ".assign-person-add", function(b) {
            b.preventDefault(), b.stopPropagation();
            var c = $(this), d = c.data("label"), e = c.data("assignid"), f = $(".assign-person-name"), g = $(".assign-person-id");
            f.length > 0 && g.length > 0 && d && e && (f.data("label", d).data("value", e), 
            g.val(e), f.val(d).trigger("blur"), a.autocomplete.clearResults());
        });
    },
    autofillPerson: function() {
        var a = this;
        a.settings.$body.on("click.bbAutofillPerson", ".autofill-person", function(b) {
            b.preventDefault(), b.stopPropagation();
            var c = $(this), d = c.data("email"), e = c.data("name"), f = c.data("surname"), g = c.data("organisation"), h = c.data("telephone"), i = c.data("mobile"), j = c.data("country"), k = c.data("address1"), l = c.data("address2"), m = c.data("city"), n = c.data("state"), o = c.data("zip");
            if (d.length > 0) {
                var p = $(".create-application-email");
                p.val(d).trigger("focusout"), p = $(".create-application-name"), p.val(e).trigger("focusout"), 
                p = $(".create-application-surname"), p.val(f).trigger("focusout"), p = $(".create-application-organisation"), 
                p.val(g).trigger("focusout"), p = $(".create-application-telephone"), p.val(h).trigger("focusout"), 
                p = $(".create-application-mobile"), p.val(i).trigger("focusout"), p = $(".create-application-country"), 
                p.val(j).trigger("focusout"), p = $(".create-application-address1"), p.val(k).trigger("focusout"), 
                p = $(".create-application-address2"), p.val(l).trigger("focusout"), p = $(".create-application-city"), 
                p.val(m).trigger("focusout"), p = $(".create-application-state"), p.val(n).trigger("focusout"), 
                p = $(".create-application-zip"), p.val(o).trigger("focusout"), a.autocomplete.clearResults();
            }
            b.preventDefault();
        });
    },
    inputLists: {
        globalObj: null,
        defaultTemplate: "input-lists/default-result.mustache",
        defaultTemplateCompiled: null,
        $addBtns: null,
        preInit: function() {
            var a = this;
            a.$addBtns = $(".input-list-add:not(.processed)"), a.$addBtns.length > 0 && a.init();
        },
        init: function() {
            var a = this;
            $.get(a.globalObj.settings.mustache.templateRoot + a.defaultTemplate, function(b) {
                a.defaultTemplateCompiled = Mustache.compile(b);
            }).done(function() {
                a.$addBtns.each(function(b) {
                    var c = $(this), d = c.data("template");
                    d ? $.get(a.globalObj.settings.mustache.templateRoot + d, function(a) {
                        c.data("template-compiled", Mustache.compile(a));
                    }).fail(function(b) {
                        c.data("template-compiled", a.defaultTemplateCompiled);
                    }).done(function() {
                        a.buildLink(c);
                    }) : (c.data("template-compiled", a.defaultTemplateCompiled), a.buildLink(c));
                });
            }), a.globalObj.settings.$body.on("click.bbInputList", ".input-list-dismiss", function(b) {
                var c = $(this), d = c.closest(".input-list-element"), e = (d.data("label"), d.data("value")), f = c.closest(".input-list-added"), g = f.data("existing"), h = null;
                if (b.preventDefault(), h = window.confirm(a.globalObj.language.labels.global.removeConfirm), 
                h === !1) return !1;
                if (g) {
                    var i = e.toString().toLowerCase().replace(/^(\s*)|(\s*)$/g, "").replace(/\s+/g, " ");
                    if ($.inArray(i, g) >= 0) {
                        var j = g.indexOf(i);
                        g.splice(j, 1);
                    }
                    f.data("existing", g);
                }
                d.remove(), 0 === f.find(".input-list-element").length && f.removeClass("in");
            }), a.globalObj.settings.$body.on("click.bbInputList-object", ".input-list-dismiss-object", function(b) {
                var c = $(this), d = c.closest(".input-list-element"), e = (d.data("label"), d.data("value"), 
                c.closest(".input-list-added")), f = (e.data("existing"), null);
                return b.preventDefault(), f = window.confirm(a.globalObj.language.labels.global.removeConfirm), 
                f === !1 ? !1 : ($(this).closest(".input-list-element").children(".change-value").attr("value", "true"), 
                void $(this).closest(".input-list-element").hide());
            });
        },
        buildLink: function(a) {
            var b = this, c = a.data("target"), d = a.data("container"), e = null, f = d ? $("#" + d) : a.next(".input-list-added"), g = f.find(".input-list-element"), h = [];
            a.addClass("processed"), c = c.split(","), $.each(c, function(a, b) {
                var c = $("#" + b), d = c.attr("name");
                c.data("name", d), e = e ? e.add(c) : c;
            }), e.removeAttr("name"), f.length < 1 ? (f = $('<div class="input-list-added" />'), 
            a.after(f)) : g.each(function() {
                var a = $(this).data("value");
                a && (a = a.toString().toLowerCase().replace(/\s+/g, " "), h.push(a));
            }), f.data("existing", h), e.on("keydown.bbInputList", function(a) {
                var b = $(this);
                13 === a.which && b.is(":not(textarea)") && (a.preventDefault(), a.stopPropagation());
            }), a.on("click.bbInputList", function(a) {
                var c = $(this), d = c.data("target"), e = c.data("container"), f = c.data("template-compiled"), g = c.data("autocomplete-results-only"), h = null, i = e ? $("#" + e) : c.next(".input-list-added"), j = i.find(".input-list-element"), k = i.data("existing"), l = {}, m = "", n = !1;
                if (d = d.split(","), l.results = [], $.each(d, function(a, b) {
                    var d = $("#" + b);
                    d.hasClass("placeholdersjs") && Placeholders.disable(d[0]);
                    var e = d.val(), f = d.data("value"), i = d.data("label"), j = d.data("from-autocomplete"), k = d.data("allow-empty"), l = d.data("include-text");
                    return d.removeClass("input-validation-error"), h = h ? h.add(d) : d, g && !j ? (d.focus(), 
                    !1) : (f && "undefined" !== f && f === e || (f = e, d.data("value", e)), i && "undefined" !== i || (i = f, 
                    d.data("label", f)), l ? d.data("text", d.find("option:selected").text()) : d.data("text", i), 
                    f && (m += f.toString().toLowerCase().replace(/^(\s*)|(\s*)$/g, "").replace(/\s+/g, " ")), 
                    void (c.hasClass("require-all") && (f || k || (n = !0, d.addClass("input-validation-error")))));
                }), m.length < 1) return h.filter(":first").focus(), !1;
                if (n) return h.filter(".input-validation-error:first").focus(), !1;
                if ($.inArray(m, k) >= 0) return window.alert(b.globalObj.language.labels.global.warnDuplicate), 
                h.val("").data("value", null).data("label", null).data("text", null).data("from-autocomplete", null), 
                $.isFunction(h.jqteVal) && h.jqteVal(""), h.filter(":first").focus(), !1;
                h.each(function() {
                    var a = $(this), c = a.val(), d = a.data("value"), e = a.data("label"), f = a.data("text"), g = a.data("name") ? a.data("name") : a.attr("id"), h = a.data("guidelines-url"), i = 0, k = {};
                    c.length > 0 ? (h && $.ajax({
                        dataType: "json",
                        url: h,
                        data: {
                            catId: d
                        },
                        success: function(a) {
                            a && a.guidelines.length > 0 && b.globalObj.guidelines.addGuidelines(a.guidelines);
                        },
                        error: function() {
                            window.alert(b.globalObj.language.labels.global.genericError);
                        }
                    }), i = j.length, k = {
                        id: d,
                        label: e,
                        index: i,
                        target: g,
                        text: f
                    }, l.results.push(k)) : a.focus();
                }), h.val("").data("value", null).data("label", null).data("text", null).data("from-autocomplete", null), 
                $.isFunction(h.jqteVal) && h.jqteVal(""), h.filter(":first").focus(), l.value = m, 
                k.push(m), i.data("existing", k), l.hasItems = !0, i.prepend(f(l)), k.length > 0 ? i.addClass("in") : i.removeClass("in");
                var o = null;
                $.each(d, function(a, b) {
                    var c = $('[name="' + b + '"]');
                    c.attr("data-val") === !0 && (o = o ? o.add(c) : c);
                }), o && o.length > 0 && o.valid(), b.globalObj.textareas.preInit(), a.preventDefault();
            });
        }
    },
    disableSend: function() {
        $("form").each(function(a) {
            $(this).submit(function() {
                $(".input-validation-error").length ? $(this).find(".disable-on-submit").prop("disabled", !1).addClass("btn-loading") : ($(this).find(".disable-on-submit").prop("disabled", !0).addClass("btn-loading"), 
                $(this).find("#nextBtn_2").prop("disabled", !0).addClass("btn-loading")), $(".loading-submit").removeClass("hidden");
            });
        });
    },
    hero: {
        globalObj: null,
        maxItems: 2,
        slider: {},
        $heros: null,
        preInit: function() {
            var a = this;
            a.$heros = $(".hero:not(" + a.globalObj.settings.processedClass + ")"), a.$heros.spin("large", "#fff");
        },
        init: function() {
            var a = this;
            a.$heros.each(function() {
                var b = $(this), c = b.find(".hero-inner"), d = "next";
                a.globalObj.settings.rtl && (d = "prev");
                var e = {
                    direction: "rtl",
                    selector: ".hero-item",
                    infiniteLoop: !0,
                    slideMargin: 0,
                    minSlides: 1,
                    maxSlides: a.maxItems,
                    nextText: "",
                    prevText: "",
                    touchEnabled: !1,
                    oneToOneTouch: !1,
                    responsive: !0,
                    controls: !0,
                    pager: !0,
                    adaptiveHeight: !0,
                    autoHover: !0,
                    pause: 8e3,
                    speed: 800,
                    forceReloadAtResize: !0,
                    auto: !0,
                    startSlide: 0,
                    useCSS: !1,
                    onSliderLoad: function(b) {
                        c.width(1170 * c.find(".hero-item").length);
                        var d = $(".hero-item", c), e = a.calculateSlides(d, b);
                        e.addClass("active in").removeClass("out"), d.not(".active").removeClass("in").addClass("out");
                    },
                    onSlideBefore: function(b, d, e) {
                        $(".active", c).removeClass("active").removeClass("in").addClass("out");
                        var f = $(".hero-item", c), g = a.calculateSlides(f, e);
                        g.addClass("in").removeClass("out");
                    },
                    onSlideAfter: function(b, d, e) {
                        var f = $(".hero-item", c), g = a.calculateSlides(f, e);
                        g.addClass("active"), f.not(".active").removeClass("in").addClass("out");
                    }
                };
                b.addClass(a.globalObj.settings.processedClass), a.slider[c] = c.bxSlider(e);
            });
        },
        calculateSlides: function(a, b) {
            var c = this, d = a.eq(b), e = a.eq(b + c.maxItems), f = a.eq(b + 2 * c.maxItems), g = d.add(e).add(f);
            return g;
        }
    },
    carousels: {
        globalObj: null,
        $carousels: null,
        $itemSizer: null,
        minItemsDefault: 3,
        minItemsSmallscreen: 1,
        minItems: null,
        itemWidth: null,
        itemMargin: null,
        carouselType: null,
        currentType: null,
        options: null,
        init: function() {
            var a = this;
            a.$itemSizer = $(".promo-carousel-sizer"), a.getType(), a.options = {
                selector: ".block",
                infiniteLoop: !0,
                useCSS: !1,
                slideWidth: a.itemWidth,
                slideMargin: a.slideMargin,
                minSlides: a.minItems,
                maxSlides: a.minItems,
                nextText: "",
                prevText: ""
            }, a.setOptions(), $(".promo-carousel:not(" + a.globalObj.settings.processedClass + ")").each(function() {
                var b = $(this), c = b.find(".promo-carousel-inner"), d = {};
                if ($.extend(d, a.options), c.find(d.selector).length <= d.minSlides && ($.extend(d, {
                    pager: !1,
                    controls: !1
                }), b.addClass("no-controls")), $(window).width() > 760) {
                    var e = c.bxSlider(d);
                    b.addClass(a.globalObj.settings.processedClass).data("carousel", e), a.$carousels ? a.$carousels.add(b) : a.$carousels = b;
                }
            });
        },
        getType: function() {
            var a = this;
            a.carouselType = 1, a.globalObj.mq.currentBreakpoint < a.globalObj.settings.breakpointD && (a.carouselType = 0);
        },
        setOptions: function() {
            var a = this, b = parseFloat(a.$itemSizer.css("margin-right"));
            a.slideMargin = Math.floor(b ? b : 0), a.itemWidth = a.$itemSizer.width(), a.minItems = a.minItemsDefault, 
            0 === a.carouselType && (a.minItems = a.minItemsSmallscreen, a.itemWidth = 0), $.extend(a.options, {
                minSlides: a.minItems,
                maxSlides: a.minItems,
                slideWidth: a.itemWidth,
                slideMargin: a.slideMargin
            });
        },
        reload: function() {
            var a = this;
            return a.getType(), a.$carousels && a.carouselType !== a.currentType ? (a.currentType = a.carouselType, 
            a.setOptions(), void a.$carousels.each(function() {
                var b = $(this), c = b.data("carousel");
                c.reloadSlider(a.options);
            })) : !1;
        }
    },
    mediaGallery: {
        globalObj: null,
        $carousels: null,
        minItemsDefault: 1,
        minItemsSmallscreen: 1,
        minItems: null,
        carouselType: null,
        currentType: null,
        options: null,
        auto: !1,
        autoDelay: "4000ms",
        pager: !0,
        controls: !0,
        init: function() {
            var a = this, b = "next";
            a.globalObj.settings.rtl && (b = "prev"), a.options = {
                autoDirection: b,
                selector: "li",
                infiniteLoop: !0,
                useCSS: !1,
                minSlides: a.minItems,
                maxSlides: a.minItems,
                nextText: "",
                prevText: ""
            }, $(".media-gallery:not(" + a.globalObj.settings.processedClass + ")").each(function() {
                var b = $(this), c = b.find(".media-gallery-inner"), d = {};
                $.extend(d, a.options), c.find(d.selector).length <= d.minSlides && $.extend(d, {
                    pager: !1,
                    controls: !1
                });
                var e = c.bxSlider(d);
                b.addClass(a.globalObj.settings.processedClass).data("carousel", e), a.$carousels ? a.$carousels.add(b) : a.$carousels = b;
            });
        }
    },
    explore: {
        globalObj: null,
        $exploreContainer: null,
        $exploreContainerInner: null,
        masonry: null,
        timeout: null,
        transitionSpeed: 300,
        animating: !1,
        preInit: function() {
            var a = this;
            a.$exploreContainer = $(".explore"), a.$exploreContainer.length > 0 && a.init();
        },
        init: function() {
            var a = this, b = null, c = null;
            a.$exploreContainerInner = a.$exploreContainer.find(".explore-inner"), a.$exploreContainerInner.append('<div class="block-sizer" />'), 
            a.$exploreContainer.find(".explore-item:first").addClass("grow in"), a.$exploreContainerInner.imagesLoaded(function() {
                a.$exploreContainerInner.packery({
                    itemSelector: ".explore-item",
                    columnWidth: ".block-sizer",
                    gutter: 0
                }), a.masonry = a.$exploreContainerInner.data("packery"), a.$exploreContainer.addClass("explore-loaded");
            }), Modernizr.csstransitions || (a.transitionSpeed = 0), a.$exploreContainer.on("click.bbExplore", ".explore-item, .explore-img", function(d) {
                var e = $(this), f = e.hasClass("explore-item") ? e : e.closest(".explore-item");
                return console.log("animate = " + a.animating), a.animating ? (d.preventDefault(), 
                !1) : void (f.hasClass("in") && f.hasClass("grow") || (d.preventDefault(), a.animating = !0, 
                a.$exploreContainer.removeClass("masonry-complete"), a.$exploreContainer.find(".in").removeClass("in"), 
                a.$exploreContainer.find(".grow").removeClass("grow"), Modernizr.csstransitions ? (f.addClass("grow"), 
                b = setTimeout(function() {
                    f.addClass("in"), c = setTimeout(function() {
                        a.$exploreContainerInner.packery(), a.animating = !1, clearTimeout(c);
                    }, 50), clearTimeout(b);
                }, a.transitionSpeed + 20)) : (a.$exploreContainerInner.packery(), f.addClass("grow in"), 
                a.masonry.fit(f[0]), b = setTimeout(function() {
                    a.$exploreContainerInner.packery(), a.animating = !1, clearTimeout(b);
                }, 30))));
            });
        }
    },
    masonryLayout: {
        globalObj: null,
        $masonryContainer: null,
        $masonrySizer: null,
        $masonryBlocks: null,
        buildTimeout: null,
        masonry: null,
        preInit: function() {
            var a = this;
            a.$masonryContainer = $(".masonry"), a.$masonryContainer.length > 0 && a.init();
        },
        init: function() {
            var a = this;
            a.$masonryBlocks = a.$masonryContainer.find(".block"), a.$masonrySizer = $('<div class="block-sizer b-1" /><div class="gutter-sizer" />'), 
            a.$masonryContainer.append(a.$masonrySizer), a.buildMasonry();
        },
        buildMasonry: function() {
            var a = this;
            return a.$masonryContainer.length < 1 ? !1 : (a.$masonryContainer.addClass("loading"), 
            void a.$masonryContainer.imagesLoaded(function() {
                a.$masonryContainer.removeClass("loading"), a.$masonryContainer.packery({
                    columnWidth: ".block-sizer",
                    gutter: ".gutter-sizer",
                    itemSelector: ".block"
                }), a.showMasonry(), a.masonry = a.$masonryContainer.data("packery");
            }));
        },
        refreshMasonry: function() {
            var a = this;
            return a.masonry ? void a.masonry.layout() : !1;
        },
        showMasonry: function() {
            var a = this;
            if (a.$masonryContainer.length < 1) return !1;
            var b = 0, c = 1;
            a.$masonryBlocks.each(function() {
                var a, d = $(this);
                clearTimeout(a), a = setTimeout(function() {
                    d.addClass("in"), clearTimeout(a);
                }, b), b = 150 * c, c++;
            }), a.globalObj.masonryLayout.refreshMasonry();
        }
    },
    fileUploadTrigger: {
        globalObj: null,
        preInit: function() {
            var a = this;
            a.init();
        },
        init: function() {
            var a = this;
            $(".lt-ie10").length > 0 || $(".control-file:not(." + a.globalObj.settings.processedClass + ")").each(function() {
                var b = $(this), c = b.find(".control-file-handle"), d = b.find(".control-file-input"), e = b.find(".control-file-name");
                b.addClass(a.globalObj.settings.processedClass), d.on("change.fileUploadTrigger", function() {
                    var a = d.val().split(/[\/\\]/).pop();
                    a.length < 1 ? (b.removeClass("control-file-added"), e.empty()) : (b.addClass("control-file-added"), 
                    e.html(a));
                }), c.on("click.fileUploadTrigger", function() {
                    d.trigger("click");
                });
            });
        }
    },
    tabs: {
        globalObj: null,
        init: function() {
            var a = $(".tabs").filter(":not(.processed)");
            a.jsTabs({
                onChange: function() {
                    a.hasClass("processed");
                },
                onReady: function() {}
            }).addClass("processed");
        }
    },
    alerts: {
        globalObj: null,
        alertWaitTime: 300,
        $alertsContainer: $(".alerts"),
        init: function() {
            var a = this, b = a.$alertsContainer.find(".alert:not(.in)");
            b.length > 0 && a.showAlerts(), a.$alertsContainer.on("click.bbAlerts", ".alert-dismiss", function(b) {
                a.hideAlert($(this).closest(".alert")), b.preventDefault();
            }), a.formAlerts();
        },
        showContainer: function() {
            var a = this;
            a.$alertsContainer.addClass("in"), a.$alertsContainer.hasClass("inactive-alert-popup-free-claims") && a.$alertsContainer.hasClass("in") && a.$alertsContainer.removeClass("in");
        },
        hideContainer: function() {
            var a = this;
            a.$alertsContainer.removeClass("in");
        },
        addAlert: function(a) {
            var b = this, c = $("#" + a), d = c.clone().removeAttr("id").attr("data-id", a);
            b.$alertsContainer.find("[data-id=" + a + "]").length < 1 && (b.hideAlerts(), b.$alertsContainer.find(".container").prepend(d), 
            b.showAlerts());
        },
        hideAlerts: function() {
            var a = this, b = a.$alertsContainer.find(".alert");
            return 0 === b.length ? !1 : void b.each(function(b) {
                var c, d = $(this);
                c = window.setTimeout(function() {
                    a.hideAlert(d), window.clearTimeout(c);
                }, a.alertWaitTime * b);
            });
        },
        hideAlert: function(a) {
            var b = this;
            a.length > 0 && (b.globalObj.ltIE(10) ? (a.removeClass("in").addClass("out"), a.each(function() {
                $(this).remove();
            })) : a.on(b.globalObj.settings.animationEnd, function() {
                $(this).remove();
            }).removeClass("in").addClass("out"), b.$alertsContainer.find(".alert").length < 1 && b.$alertsContainer.removeClass("in"));
        },
        showAlerts: function() {
            var a = this, b = a.$alertsContainer.find(".alert:not(.in)");
            return 0 === b.length ? !1 : (a.showContainer(), void b.reverse().each(function(b) {
                var c, d, e = $(this), f = e.data("timeout");
                e.addClass("show"), c = window.setTimeout(function() {
                    e.addClass("in"), f && f > 0 && (d = window.setTimeout(function() {
                        a.hideAlert(e), window.clearTimeout(d);
                    }, 1e3 * f)), window.clearTimeout(c);
                }, a.alertWaitTime * b);
            }));
        },
        formAlerts: function() {
            var a = this, b = $("[data-alert]:not(.processed)");
            b.each(function() {
                var b = $(this), c = b.data("alert"), d = b.find("select,input,textarea,.input-list-element,.multiupload-item").not("[data-ignore-alert]");
                b.addClass("processed"), d.on("change.bbFormAlerts remove.bbFormAlerts", function() {
                    a.addAlert(c);
                });
            });
        }
    },
    paymentSelect: {
        globalObj: null,
        $wrapper: null,
        $form: null,
        actionUrl: null,
        $responseContainer: null,
        paymentSelectRequest: null,
        keyupTimeout: null,
        $inputs: null,
        init: function() {
            var a = this;
            a.$wrapper = $(".application-payment"), a.$form = $(".application-payment-form"), 
            a.$inputs = a.$form.find("input, select, textarea"), a.$inputs.attr("readonly", !1), 
            a.$form.length && (a.$responseContainer = $(".application-payment-total"), a.actionUrl = a.$form.data("action"), 
            a.$form.on("change.paymentSelect", "input, select, textarea", function(b) {
                a.submitForm();
            }), a.$form.on("keydown.paymentSelect", "input, select, textarea", function(a) {
                $(".payment-method").hide();
            }), a.$form.on("keyup.paymentSelect blur.paymentSelect", "input, select, textarea", function(b) {
                a.keyupTimeout && clearTimeout(a.keyupTimeout), a.keyupTimeout = setTimeout(function() {
                    a.submitForm(), clearTimeout(a.keyupTimeout);
                }, 1e3);
            }), a.submitForm());
        },
        submitForm: function() {
            var a = this, b = !0;
            if (a.actionUrl) {
                if (a.paymentSelectRequest && a.paymentSelectRequest.abort(), a.$form.validate(), 
                a.$form.find("input, select, textarea").each(function() {
                    var a = $(this);
                    return a.valid() ? void 0 : void (b = !1);
                }), !b) return !1;
                a.$inputs.attr("readonly", !0), a.$wrapper.addClass("loading"), a.paymentSelectRequest = $.ajax({
                    dataType: "html",
                    type: "post",
                    url: a.actionUrl,
                    data: a.$form.serialize(),
                    success: function(b) {
                        a.displayResponse(b);
                    },
                    error: function(a, b, c) {
                        console.log(b, c);
                    }
                });
            }
        },
        displayResponse: function(a) {
            var b = this;
            a && (b.$wrapper.removeClass("loading"), b.$responseContainer.html(a), b.$inputs.attr("readonly", !1));
        }
    },
    modals: {
        globalObj: null,
        $modalOverlay: null,
        $modalContainer: null,
        $modalSizer: null,
        $modalLinks: null,
        $modal: null,
        modalFilter: "#main",
        $modalAjaxError: null,
        modalIn: !1,
        modalRequest: null,
        modalImageTemplate: "modals/modal-image.mustache",
        modalImageTemplateCompiled: null,
        modalYoutubeTemplate: "modals/modal-youtube.mustache",
        modalYoutubeTemplateCompiled: null,
        init: function() {
            var a = this;
            a.$modalOverlay = $(".modal-overlay"), a.$modalContainer = $(".modal-container"), 
            a.$modalSizer = $(".modal-sizer"), a.$modalLinks = $("[data-modal]"), a.$modal = $(".modal"), 
            a.$modalAjaxError = $('<div class="modal-error">' + a.globalObj.language.labels.modal.error + ' <button class="modal-dismiss" data-modal-dismiss="true" title="' + a.globalObj.language.labels.modal.close + '"><i class="icon icon-dismiss"></i></button></div>'), 
            a.$modalOverlay.length < 1 && (a.$modalOverlay = $('<div class="modal-overlay" />'), 
            a.globalObj.settings.$body.append(a.$modalOverlay)), a.$modalContainer.length < 1 && (a.$modalContainer = $('<div class="modal-container" />'), 
            a.globalObj.settings.$body.append(a.$modalContainer)), a.$modalSizer.length < 1 && (a.$modalSizer = $('<div class="modal-sizer" />'), 
            a.$modalContainer.append(a.$modalSizer)), a.$modal.length < 1 && (a.$modal = $('<div class="modal" />'), 
            a.$modalContainer.append(a.$modal)), a.globalObj.settings.$page.on("click.bbModals", "[data-modal]", function(b) {
                var c = $(this);
                a.globalObj.mq.currentBreakpoint >= a.globalObj.settings.breakpointD && !a.modalIn && 0 === $(".lt-ie9").length && (b.preventDefault(), 
                c.data("youtube-id") ? a.buildVideo(c.data("youtube-id"), c.data("youtube-title")) : a.getContent($(this).attr("href")));
            }), a.globalObj.settings.$body.on("click.bbModals", "[data-modal-dismiss]", function(b) {
                b.preventDefault(), a.hideModal();
            });
        },
        buildVideo: function(a, b) {
            var c = this;
            if (!a) return !1;
            if (null === c.modalYoutubeTemplateCompiled) return $.get(c.globalObj.settings.mustache.templateRoot + c.modalYoutubeTemplate, function(d) {
                c.modalYoutubeTemplateCompiled = Mustache.compile(d), c.buildVideo(a, b);
            }), !1;
            var d = {
                close: c.globalObj.language.labels.modal.close,
                videoId: a,
                title: b ? b : c.globalObj.language.labels.modal.video
            };
            c.showOverlay(), c.showModal(c.modalYoutubeTemplateCompiled(d));
        },
        buildImage: function(a, b) {
            var c = this;
            if (!a) return a = c.$modalAjaxError, !1;
            if (null === c.modalImageTemplateCompiled) return $.get(c.globalObj.settings.mustache.templateRoot + c.modalImageTemplate, function(d) {
                c.modalImageTemplateCompiled = Mustache.compile(d), c.buildImage(a, b);
            }), !1;
            var d = {
                close: c.globalObj.language.labels.modal.close,
                image: a,
                title: b ? b : c.globalObj.language.labels.modal.imageTitle
            };
            c.showOverlay(), c.showModal(c.modalImageTemplateCompiled(d));
        },
        getContent: function(a) {
            var b, c = this, d = !1;
            a && !c.modalIn && (c.showOverlay(), -1 !== a.indexOf("#") ? (d = $(a).contents(), 
            d || (d = c.$modalAjaxError), c.showModal(d, !0, a)) : (c.globalObj.loader.showLoader(), 
            b = setTimeout(function() {
                c.modalRequest && c.modalRequest.abort(), c.modalRequest = $.get(a, function(a, b, d) {
                    if (c.globalObj.loader.hideLoader(), null !== d.getResponseHeader("FORCE_REDIRECT")) return void (window.location = d.getResponseHeader("FORCE_REDIRECT"));
                    var e = $("<div/>").html(a), f = e.find(c.modalFilter).html();
                    f || (f = c.$modalAjaxError), c.showModal(f);
                }).fail(function() {
                    window.alert(c.globalObj.language.labels.global.genericError), c.globalObj.loader.hideLoader(), 
                    c.hideOverlay();
                }), clearTimeout(b);
            }, 1e3)));
        },
        showOverlay: function() {
            var a = this;
            a.globalObj.settings.$body.width(a.globalObj.settings.$body.width()).addClass("modal-in"), 
            a.globalObj.settings.$header.width(a.globalObj.settings.$body.width()), a.modalIn = !0, 
            a.$modalOverlay.addClass("show").delay(10).queue(function(b) {
                a.$modalOverlay.addClass("in"), b();
            });
        },
        hideOverlay: function() {
            var a = this;
            a.modalIn && (a.$modalOverlay.on(a.globalObj.settings.transitionAnimationEnd, function() {
                a.$modalOverlay.removeClass("out").removeClass("show"), a.$modalOverlay.off(a.globalObj.settings.transitionAnimationEnd), 
                a.globalObj.settings.$body.removeClass("modal-in").removeStyle(), a.globalObj.settings.$header.removeStyle(), 
                a.modalIn = !1;
            }).removeClass("in").addClass("out"), Modernizr.csstransitions || a.$modalOverlay.trigger(a.globalObj.settings.transitionEnd).trigger(a.globalObj.settings.animationEnd));
        },
        showModal: function(a, b, c) {
            var d, e = this;
            a && (e.$modal.html(a).addClass("show").delay(10).queue(function(a) {
                e.$modal.addClass("in"), d = window.setTimeout(function() {
                    e.globalObj.ajaxLoaded(e.$modal), window.clearTimeout(d);
                }, 100), a();
            }), b && e.$modal.addClass("modal-inline").data("inline-container", c));
        },
        hideModal: function() {
            var a = this, b = a.$modal.hasClass("modal-inline"), c = a.$modal.data("inline-container");
            a.modalIn && (a.globalObj.loader.hideLoader(), a.modalRequest && a.modalRequest.abort(), 
            a.$modal.on(a.globalObj.settings.transitionAnimationEnd, function(d) {
                a.$modal.removeClass("out").removeClass("show"), a.$modal.off(a.globalObj.settings.transitionAnimationEnd), 
                b ? $(c).html(a.$modal.contents()) : a.$modal.empty(), a.hideOverlay();
            }).removeClass("in").addClass("out"), Modernizr.csstransitions || a.$modal.trigger(a.globalObj.settings.transitionEnd).trigger(a.globalObj.settings.animationEnd));
        },
        resize: function() {
            var a = this;
            a.modalIn && a.globalObj.settings.$body.width(a.$modalSizer.width());
        }
    },
    carouselLightbox: {
        globalObj: null,
        $youtube: null,
        $handle: null,
        youtubeSelector: ".youtubeLightbox",
        html5videoSelector: ".html5videoLightbox",
        jwSelector: ".jwLightbox",
        vimeoSelector: ".vimeoLightbox",
        carouselSelector: ".carouselLightbox",
        lightboxSelector: ".lightbox",
        loadedContentSelector: ".cboxLoadedContent",
        captionFigureSelector: ".carousel-item-caption--figure",
        lightboxNavTemplate: "lightbox/lightbox-nav.mustache",
        lightboxNavTemplateCompiled: null,
        init: function() {
            var a = this;
            a.$images = $(a.lightboxSelector), a.images(), a.$carouselLightbox = $(a.carouselSelector), 
            a.carouselLightbox(), a.$vimeo = $(a.vimeoSelector), a.vimeo(), a.$youtube = $(a.youtubeSelector), 
            a.youtube(), a.$html5video = $(a.html5videoSelector), a.html5video(), a.$jwPlayer = $(a.jwSelector), 
            a.jwPlayer(), a.$disable = $(a.carouselSelector), a.disable();
        },
        images: function() {
            var a = this;
            a.$images.fancybox({
                padding: 0,
                autoScale: !1,
                transitionIn: "none",
                transitionOut: "none",
                title: !1,
                arrows: !0,
                topRatio: .2,
                maxHeight: 600
            });
        },
        // carouselLightbox: function() {
        //     var a = this;
        //     a.$carouselLightbox.fancybox({
        //         padding: 0,
        //         autoScale: !1,
        //         transitionIn: "none",
        //         transitionOut: "none",
        //         title: !1,
        //         arrows: !0,
        //         topRatio: .2,
        //         maxHeight: 600,
        //         afterShow: function() {
        //             var a = $(this.element).find(".carousel-item-caption--figure").html(), b = '<figure class="carousel-item-caption--figure in">' + a + "</figure>";
        //             $(".fancybox-inner").append(b);
        //         }
        //     });
        // },
        vimeo: function() {
            var a = this;
            a.$vimeo.fancybox(), $(a.vimeoSelector).each(function() {
                var a = $(this), b = a.attr("data-vimeo-id"), c = "https://player.vimeo.com/video/" + b;
                a.attr("href", c);
            }), a.globalObj.mq.currentBreakpoint < a.globalObj.settings.breakpointD && a.$vimeo.fancybox({
                type: "iframe",
                padding: 0,
                autoScale: !1,
                transitionIn: "none",
                transitionOut: "none",
                title: this.title,
                arrows: !0,
                width: 640,
                height: 390,
                afterShow: function() {
                    var a = $(this.element).find(".carousel-item-caption--figure").html(), b = '<figure class="carousel-item-caption--figure in">' + a + "</figure>";
                    $(a).length > 0 && $(".fancybox-outer").append(b);
                },
                helpers: {
                    thumbs: {
                        source: function(a) {
                            return $(a.element).data("thumbnail");
                        },
                        width: 177,
                        height: 100
                    }
                }
            }), a.globalObj.mq.currentBreakpoint > a.globalObj.settings.breakpointD && a.$vimeo.fancybox({
                type: "iframe",
                padding: 0,
                autoScale: !1,
                transitionIn: "none",
                transitionOut: "none",
                title: this.title,
                arrows: !0,
                width: 1e3,
                height: 572,
                afterShow: function() {
                    var a = $(this.element).find(".carousel-item-caption--figure").html(), b = '<figure class="carousel-item-caption--figure in">' + a + "</figure>";
                    $(a).length > 0 && $(".fancybox-outer").append(b);
                },
                helpers: {
                    thumbs: {
                        source: function(a) {
                            return $(a.element).data("thumbnail");
                        },
                        width: 177,
                        height: 100
                    }
                }
            });
        },
        youtube: function() {
            var a = this;
            $(a.youtubeSelector).each(function() {
                var a = $(this), b = a.attr("data-youtube-id"), c = "https://www.youtube.com/embed/" + b;
                a.attr("href", c);
            }), a.globalObj.mq.currentBreakpoint < a.globalObj.settings.breakpointD && a.$youtube.fancybox({
                type: "iframe",
                padding: 0,
                autoScale: !1,
                transitionIn: "none",
                transitionOut: "none",
                title: this.title,
                arrows: !0,
                width: 640,
                height: 390,
                helpers: {
                    thumbs: {
                        source: function(a) {
                            return $(a.element).data("thumbnail");
                        },
                        width: 177,
                        height: 100
                    }
                }
            }), a.globalObj.mq.currentBreakpoint > a.globalObj.settings.breakpointD && a.$youtube.fancybox({
                type: "iframe",
                padding: 0,
                autoScale: !1,
                transitionIn: "none",
                transitionOut: "none",
                title: this.title,
                arrows: !0,
                width: 1e3,
                height: 609,
                helpers: {
                    thumbs: {
                        source: function(a) {
                            return $(a.element).data("thumbnail");
                        },
                        width: 177,
                        height: 100
                    }
                }
            });
        },
        html5video: function() {
            var a = this;
            $(a.html5videoSelector).each(function() {
                var a = $(this), b = a.attr("data-html5video-id"), c = b;
                a.attr("href", c);
            }), a.globalObj.mq.currentBreakpoint < a.globalObj.settings.breakpointD && (a.$html5video.fancybox({
                type: "iframe",
                padding: 0,
                autoScale: !1,
                transitionIn: "none",
                transitionOut: "none",
                title: this.title,
                arrows: !1,
                "max-width": 640,
                "max-height": 390,
                autoResize: !0,
                helpers: {
                    thumbs: {
                        source: function(a) {
                            return $(a.element).data("thumbnail");
                        },
                        width: 177,
                        height: 100
                    }
                }
            }), $(".leaderboard tr").click(function(a) {
                var b = $(this).find("a.tr-select");
                a.target !== b[0] && b.trigger("click");
            })), a.globalObj.mq.currentBreakpoint > a.globalObj.settings.breakpointD && (a.$html5video.fancybox({
                type: "iframe",
                padding: 0,
                autoScale: !1,
                transitionIn: "none",
                transitionOut: "none",
                title: this.title,
                arrows: !1,
                "max-width": 1e3,
                "max-height": 609,
                autoResize: !0,
                helpers: {}
            }), $(".leaderboard tr").click(function(a) {
                var b = $(this).find("a.tr-select");
                a.target !== b[0] && b.trigger("click");
            }));
        },
        jwPlayer: function() {
            var a = this;
            $(a.jwSelector).each(function() {
                var a = $(this), b = a.attr("data-jwPlayer-id"), c = b;
                a.attr("href", c), console.log(a.attr("href", c));
            }), a.globalObj.mq.currentBreakpoint < a.globalObj.settings.breakpointD && (a.$jwPlayer.fancybox({
                type: "iframe",
                padding: 0,
                autoScale: !1,
                transitionIn: "none",
                transitionOut: "none",
                title: this.title,
                arrows: !1,
                "max-width": 640,
                "max-height": 390,
                autoResize: !0,
                helpers: {
                    thumbs: {
                        source: function(a) {
                            return $(a.element).data("thumbnail");
                        },
                        width: 177,
                        height: 100
                    }
                }
            }), $(".leaderboard tr").click(function(a) {
                var b = $(this).find("a.tr-select");
                a.target !== b[0] && b.trigger("click");
            })), a.globalObj.mq.currentBreakpoint > a.globalObj.settings.breakpointD && (a.$jwPlayer.fancybox({
                type: "iframe",
                padding: 0,
                autoScale: !1,
                transitionIn: "none",
                transitionOut: "none",
                title: this.title,
                arrows: !1,
                "max-width": 1e3,
                "max-height": 609,
                autoResize: !0,
                helpers: {}
            }), $(".leaderboard tr").click(function(a) {
                var b = $(this).find("a.tr-select");
                a.target !== b[0] && b.trigger("click");
            }));
        },
        buildLightboxNav: function(a, b) {
            var c = this;
            if (null === c.modalImageTemplateCompiled) return $.get(c.globalObj.settings.mustache.templateRoot + c.lightboxNavTemplate, function(d) {
                c.lightboxNavTemplateCompiled = Mustache.compile(d), c.buildLightboxNav(a, b);
            }), !1;
            ({
                image: a,
                link: b ? b : c.globalObj.language.labels.modal.imageLink
            });
        },
        disable: function() {
            var a = this;
            a.globalObj.mq.currentBreakpoint < a.globalObj.settings.breakpointD && a.$disable.on("touchstart click", function() {
                return !1;
            });
        },
        resize: function() {
            var a = this;
            a.disable();
        }
    },
    multiupload: {
        globalObj: null,
        init: function() {
            var a = this;
            $(".multiupload-dismiss").on("click.multiupload", function(b) {
                var c = window.confirm(a.globalObj.language.labels.global.removeConfirm);
                return c === !1 ? !1 : ($(this).parents(".multiupload-item").remove(), void b.preventDefault());
            }), $(".multiupload-dismiss-object").on("click.multiupload-object", function(b) {
                var c = window.confirm(a.globalObj.language.labels.global.removeConfirm);
                return c === !1 ? !1 : ($(this).closest(".multiupload-item").children(".change-value").attr("value", "true"), 
                $(this).closest(".multiupload-item").hide(), void b.preventDefault());
            });
        }
    },
    uploaders: {
        $multiuploads: null,
        globalObj: null,
        preInit: function() {
            var a = this;
            a.$multiuploads = $(".multiupload:not(.processed):visible"), a.$multiuploads.length > 0 && Modernizr.load({
                load: "/_scripts/vendor/plupload/plupload.full.min.js",
                callback: function() {
                    a.init();
                }
            });
        },
        init: function() {
            var a = this, b = "upload/upload-item.mustache";
            $.get(a.globalObj.settings.mustache.templateRoot + b, function(a) {
                b = Mustache.compile(a);
            }), a.$multiuploads.each(function(c) {
                var d = $(this), e = d.find(".multiupload-upload"), f = d.find(".multiupload-pick"), g = d.find(".multiupload-contain"), h = d.find(".multiupload-list-added"), i = d.attr("data-multiupload-saved"), j = $("#" + i), k = d.find(".progress"), l = k.find(".progress-bar"), m = k.find(".progress-bar-percent"), n = d.attr("data-multiupload-name"), o = d.attr("data-multiupload-url"), p = d.attr("data-multiupload-maxsize"), q = "true" === d.attr("data-multiupload-allowmultiple").toString() ? !0 : !1, r = d.attr("data-multiupload-extensions"), s = d.data("error"), t = null, u = $(".save-upload"), v = $(".btn-ev-next"), w = $(".btn-ev-back"), x = $(".btn-ev-cancel"), y = $(".input-list-add"), z = {};
                d.addClass("processed"), e.attr("id", "multiuploadUpload_" + n), f.attr("id", "multiuploadPick_" + n), 
                f.find(".btn").attr("id", "multiuploadPickBtn_" + n), g.attr("id", "multiuploadContainer_" + n), 
                r = r ? [ {
                    title: "File types",
                    extensions: r
                } ] : !1;
                var A = "flash";
                window.File && window.FileReader && window.FileList && window.Blob && (A = "html5", 
                p = "20gb"), r && $.extend(z, {
                    filters: r
                }), $.extend(z, {
                    runtimes: A,
                    browse_button: "multiuploadPickBtn_" + n,
                    container: "multiuploadPick_" + n,
                    max_file_size: p,
                    url: o,
                    multi_selection: q,
                    flash_swf_url: "/_scripts/vendor/plupload/Moxie.swf",
                    chunk_size: "5mb",
                    init: {
                        FilesAdded: function(c, d) {
                            if (w.attr("disabled", !0), w.addClass("btn-disabled"), x.attr("disabled", !0), 
                            x.addClass("link-disabled"), y.attr("disabled", !0), y.addClass("btn-disabled"), 
                            d.length > 0) {
                                s = !1;
                                var f = j.find("li").length;
                                if (console.log(!q && f > 0), !q && f > 0) {
                                    var i = window.confirm(a.globalObj.language.labels.global.removeSavedConfirm);
                                    if (i === !1) return !1;
                                    j.remove();
                                }
                                k.addClass("hidden"), e.removeClass("hidden");
                                var l = "", m = $("#marked-sensitive").val(), n = $("#mark-sensitive-checkbox-label").val();
                                "false" === m ? l = "hidden" : "true" === m ? $(".checkbox-notice-message").removeClass("hidden") : l = "hidden";
                                for (var o = 0; o < d.length; o++) {
                                    var p = {
                                        id: d[o].id,
                                        name: d[o].name,
                                        size: plupload.formatSize(d[o].size),
                                        extension: d[o].name.split(".").pop(),
                                        markedSensitive: l,
                                        checkboxLabel: n
                                    };
                                    q ? h.append(b(p)) : h.html(b(p)), g.addClass("in");
                                }
                                var r = $("#nuberOfFilesAllowed").text();
                                if ("" !== r && $(".ev-col-filename").length > r) {
                                    $(".checkallowedfilesno").addClass("hidden");
                                    var t = $("#FilesAllowedMessage").text();
                                    window.alert(t);
                                }
                            }
                            k.removeClass("hidden progress-complete");
                        },
                        BeforeUpload: function(a, b) {
                            var c = $("#marked-sensitive").val(), d = "true" === c;
                            if (d) {
                                var e = "isSensitive=", f = $("#" + b.id + "-sensitive"), g = f.is(":checked");
                                f.attr("disabled", !0), a.settings.url = o.substring(0, o.indexOf(e) + e.length) + g;
                            }
                        },
                        FileUploaded: function(a, b, c) {
                            var d = $("#" + b.id), e = d.find(".multiupload-item-status");
                            if (c.response.match(/[0-9]/)) {
                                d.find("[name=" + n + "]").trigger("change");
                                var f = c.response.replace(/"/g, "");
                                e.addClass("in status-success").html('<i class="icon icon-ok-sign"></i>'), d.append('<input type="hidden" name="' + n + '" value="' + f + '" />'), 
                                d.removeClass(), d.addClass("icon"), d.addClass("icon-alt"), d.addClass("icon-success"), 
                                d.addClass("icon-tick");
                                var g = $("#" + b.id + "-remove");
                                g.removeClass(), g.addClass("icon"), g.addClass("icon-alt"), g.addClass("icon-danger"), 
                                g.addClass("icon-dismiss"), g.attr("data-assetid", f);
                                var h = $("#" + b.id + "-row");
                                h.addClass("ev-upload-row-success");
                            } else {
                                window.alert("Error loading file.");
                                var i = $("#" + b.id);
                                i.find(".multiupload-item-status");
                                i.removeClass(), i.addClass("icon"), i.addClass("icon-alt"), i.addClass("icon-warn"), 
                                i.addClass("icon-exclamation-sign");
                                var j = $("#" + b.id + "-remove");
                                j.removeClass(), j.removeClass(), j.addClass("icon"), j.addClass("icon-alt"), j.addClass("icon-white"), 
                                j.removeAttr("href"), j.removeAttr("onclick");
                                var k = $("#" + b.id + "-row");
                                k.addClass("ev-upload-row-error");
                            }
                        },
                        UploadProgress: function(a, b) {
                            l.width(b.percent + "%"), m.html(b.percent + "%");
                        },
                        UploadComplete: function(a, b) {
                            var c, d = 0;
                            s ? h.html("") : (k.addClass("progress-complete"), d = 1e3), e.addClass("hidden"), 
                            c = setTimeout(function() {
                                k.addClass("hidden").removeClass("progress-complete"), l.width("0%"), m.html("0%"), 
                                u.removeAttr("disabled"), v.removeAttr("disabled"), v.removeClass("btn-disabled"), 
                                w.removeAttr("disabled"), w.removeClass("btn-disabled"), x.removeAttr("disabled", !0), 
                                x.removeClass("link-disabled"), y.removeAttr("disabled", !0), y.removeClass("btn-disabled"), 
                                clearTimeout(c);
                            }, d);
                        },
                        Error: function(a, b) {
                            if ("file size error" === b.message) window.alert("This file is too large to be loaded into the RMS."); else {
                                window.alert(b.response);
                                var c = $("#" + b.file.id);
                                c.find(".multiupload-item-status");
                                c.removeClass(), c.addClass("icon"), c.addClass("icon-alt"), c.addClass("icon-warn"), 
                                c.addClass("icon-exclamation-sign");
                                var d = $("#" + b.file.id + "-remove");
                                d.removeClass(), d.removeClass(), d.addClass("icon"), d.addClass("icon-alt"), d.addClass("icon-white"), 
                                d.removeAttr("href"), d.removeAttr("onclick");
                                var e = $("#" + b.file.id + "-row");
                                e.addClass("ev-upload-row-error");
                            }
                            w.removeAttr("disabled"), w.removeClass("btn-disabled"), x.removeAttr("disabled", !0), 
                            x.removeClass("link-disabled"), y.removeAttr("disabled", !0), y.removeClass("btn-disabled");
                        }
                    }
                }), t = new plupload.Uploader(z), t.init(), d.data("multiupload", t), e.on("click.multiupload", function(a) {
                    var b = $("#marked-sensitive").val(), c = "true" === b, d = $(".mark-sensitive-checkbox:checked").length;
                    if (c && 1 > d) $(".checkbox-validation-message-container").removeClass("hidden"); else {
                        $(".checkbox-validation-message-container").addClass("hidden");
                        var e = $(this), f = e.parents(".multiupload");
                        u.attr("disabled", !0), k.removeClass("hidden progress-complete"), l.width("0%"), 
                        m.html("0%"), $("a.multiupload-dismiss").each(function() {
                            $(this).addClass("hidden");
                        }), f.data("multiupload").start(), a.preventDefault();
                    }
                });
            }), a.globalObj.settings.$body.on("click.multiupload", ".multiupload-dismiss", function(b) {
                var c = $(this), d = c.closest(".multiupload-item"), e = d.attr("id"), f = c.closest(".multiupload"), g = f.find(".multiupload-contain"), h = f.find(".multiupload-list-added"), i = f.find(".progress"), j = i.find(".progress-bar"), k = i.find(".progress-bar-percent"), l = f.find(".multiupload-upload"), m = ($(".btn-ev-next"), 
                $(".btn-ev-back")), n = $(".btn-ev-cancel"), o = $(".input-list-add"), p = c.closest(".multiupload-list-saved"), q = null;
                if (b.preventDefault(), f.length > 0) f.data("multiupload").removeFile(e); else if (p.length > 0 && (q = window.confirm(a.globalObj.language.labels.global.removeConfirm), 
                q === !1)) return !1;
                d.remove();
                var r = $("#nuberOfFilesAllowed").text();
                if ("" !== r) if ($(".ev-col-filename").length > r) {
                    $(".checkallowedfilesno").addClass("hidden");
                    var s = $("#FilesAllowedMessage").text();
                    window.alert(s);
                } else $(".checkallowedfilesno").removeClass("hidden");
                if (h.length > 0) {
                    var t = h.find(".multiupload-item");
                    t.length < 1 && (i.addClass("hidden").removeClass("progress-complete"), j.width("0%"), 
                    k.html("0%"), l.addClass("hidden"), m.removeAttr("disabled"), m.removeClass("btn-disabled"), 
                    n.removeAttr("disabled", !0), n.removeClass("link-disabled"), o.removeAttr("disabled", !0), 
                    o.removeClass("btn-disabled"), g.removeClass("in"));
                }
            });
        }
    },
    toggle: {
        globalObj: null,
        toggleClass: "toggle-contain",
        init: function() {
            var a = this;
            $(".toggle").each(function(b) {
                var c = $(this), d = c.attr("href"), e = -1 !== d.indexOf("#"), f = c.data("toggle-contain"), g = null;
                if (f) g = $(f); else {
                    if (!e) return;
                    g = $(c.attr("href"));
                }
                c.data("toggle-open", c.text()), g.add(c).data("toggle-link", "link-" + b), c.on("click.bbToggle", function(b) {
                    f && !e ? $.get(d, function(b) {
                        var d = $("<div/>").html(b), e = d.find(a.globalObj.settings.ajaxContainer).html();
                        e || (e = d.find("body").html()), g.addClass("ajax-loaded").html(e), a.openCloseToggle(g, c);
                    }) : a.openCloseToggle(g, c), b.preventDefault();
                });
            }), $("#page").on("click.bbToggle", ".toggle-close", function() {
                var b = $(this), c = b.parents("." + a.toggleClass), d = $('a[data-toggle-link="' + c.attr("data-toggle-link") + '"]');
                a.openCloseToggle(c, d, 0);
            });
        },
        openCloseToggle: function(a, b) {
            var c = this;
            a.hasClass("toggle-open") ? (a.removeClass("toggle-open"), c.globalObj.removeStyle(a), 
            b.text(b.data("toggle-open"))) : (a.addClass("toggle-open"), b.text(b.data("toggle-close")));
        },
        resizeContainers: function() {
            var a = this;
            $("." + a.toggleContainerClass + ":not(.toggle-closed)").each(function() {
                $(this);
            });
        }
    },
    social: {
        globalObj: null,
        init: function() {
            var a = this;
            $(".comments-facebook").length > 0 && (a.globalObj.settings.$body.append('<div id="fb-root"></div>'), 
            $.getScript("https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v3.2", function() {
                FB.init({
                    status: !0,
                    cookie: !0,
                    xfbml: !0,
                    version: "v2.8"
                });
            }));
        }
    },
    faqs: {
        globalObj: null,
        init: function() {
            $(".faq-header").on("click.faqs", "a", function(a) {
                var b = $(this), c = b.parents(".faq"), d = c.children(".faq-details");
                d.slideToggle(500), c.toggleClass("in"), b.parents(".application-form-title").toggleClass("active"), 
                a.preventDefault();
            });
        }
    },
    adverts: function() {
        var a = $(".advert");
        a.length > 0 && $.getScript(("https:" === window.document.location.protocol ? "https:" : "http:") + "//www.googletagservices.com/tag/js/gpt.js");
    },
    confirmAction: function() {
        $(".btn-confirm-action").on("click", function(a) {
            var b = $(this), c = window.confirm(b.data("confirm-action-msg"));
            c || a.preventDefault();
        });
    },
    searchFieldReset: function() {
        var a = $(".search-form-container"), b = a.find(".search-form-input"), c = b.val();
        b.length > 0 && c && "*" === c && (b.val(""), b.focus()), $(".select-navigate").find(".active").attr("selected", "selected");
    },
    ieFixes: function() {
        var a = this;
        a.ltIE(9) && ($("input[type=radio]").addClass("radio"), $("input[type=checkbox]").addClass("checkbox"));
    },
    modernizrTests: {
        globalObj: null,
        init: function() {
            Modernizr.addTest("fileinput", function() {
                if (window.navigator.userAgent.match(/(Android)|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) return !1;
                var a = window.document.createElement("input");
                return a.type = "file", !a.disabled;
            }), Modernizr.addTest("ipad", function() {
                return !!window.navigator.userAgent.match(/iPad/i);
            }), Modernizr.addTest("iphone", function() {
                return !!window.navigator.userAgent.match(/iPhone/i);
            }), Modernizr.addTest("ipod", function() {
                return !!window.navigator.userAgent.match(/iPod/i);
            }), Modernizr.addTest("appleios", function() {
                return Modernizr.ipad || Modernizr.ipod || Modernizr.iphone;
            }), Modernizr.addTest("android", function() {
                var a = window.navigator.userAgent.toLowerCase();
                return !!a.match(/android/i);
            }), Modernizr.addTest("androidmobile", function() {
                var a = window.navigator.userAgent.toLowerCase();
                return !!a.match(/android/i) && !!a.match(/mobile/i);
            }), Modernizr.addTest("oldandroid", function() {
                var a = window.navigator.userAgent.toLowerCase(), b = parseFloat(a.slice(a.indexOf("android") + 8));
                return !!a.match(/android/i) && !!a.match(/mobile/i) && 4 > b;
            });
        }
    },
    scroll: {
        globalObj: null,
        previousScroll: 0,
        scrollTimeout: null,
        init: function() {
            var a = this;
            a.globalObj.settings.$window.on("scroll.bbScroll", function() {
                var b = a.globalObj.settings.$window.scrollTop();
                a.globalObj.settings.$window.scrollTop() < 0 && (b = 0), b !== a.previousScroll && (a.clearScrollTimeout(), 
                a.scrollTimeout = setTimeout(function() {
                    a.scrollFinished();
                }, 200));
            });
        },
        clearScrollTimeout: function() {
            var a = this;
            a.scrollTimeout && clearTimeout(a.scrollTimeout);
        },
        scrollFinished: function() {
            var a = this;
            a.globalObj.fixedHeader.resize();
        }
    },
    carousel: {
        globalObj: null,
        $carousels: null,
        maxSlidesValue: 0,
        slideWidth: 0,
        slideMarginValue: 0,
        carouselControls: !0,
        numberOfItems: 0,
        scrollPerPage: !0,
        init: function() {
            var a = this;
            a.globalObj.settings.$html.addClass("carousel-in"), a.options = {
                loop: !0,
                margin: 15,
                rtl: !1,
                responsiveClass: !0,
                nav: !0,
                slideBy: 4,
                lazyLoad: !0,
                callbacks: !0,
                responsive: {
                    0: {
                        items: 1
                    },
                    600: {
                        items: 3
                    },
                    1200: {
                        items: 4
                    }
                }
            }, a.$carousels = $(".carousel, .owl-carousel"), a.bindEvents(), a.reload();
        },
        bindEvents: function() {
            var a = this;
            a.$carousels.each(function() {
                a.buildCarousel($(this));
            });
        },
        buildCarousel: function(a) {
            var b = this, c = a.find(".carousel-inner"), d = a.find(".carousel-items").html();
            a.html(d), c.remove();
            a.find(".carousel-item").length > 4;
            a.owlCarousel(b.options), bb.settings.rtl ? (a.find(".owl-next").html('<i class="icon icon-chevron-right2"></i>'), 
            a.find(".owl-prev").html('<i class="icon icon-chevron-left2"></i>')) : (a.find(".owl-next").html('<i class="icon icon-chevron-right2"></i>'), 
            a.find(".owl-prev").html('<i class="icon icon-chevron-left2"></i>')), setTimeout(function() {
                var b = a.find(".owl-item"), c = 0;
                b.each(function() {
                    var a = $(this), b = a.height();
                    b > c && (c = b);
                }), $(".owl-stage, .owl-next, .owl-prev").css({
                    height: c,
                    "line-height": c + "px"
                });
            }, 300);
        },
        // reload: function(a) {
        //     var b = this;
        //     $(window).width() > 1200 ? $(".carousel").each(function() {
        //         var a = $(this);
        //         a.find(".owl-item").length <= 12 && a.find(".owl-controls").css("display", "none");
        //     }) : $(".carousel").each(function() {
        //         var a = $(this);
        //         a.find(".owl-controls").css("display", "block");
        //     }), window.innerWidth < 600 ? ($(".carousel, .owl-carousel").trigger("destroy.owl.carousel"), 
        //     $(".carousel, .owl-carousel").find(".owl-stage-outer").children().unwrap()) : b.$carousels.each(function() {
        //         b.buildCarousel($(this));
        //     }), window.innerWidth < 600 ? (0 === $(".show-more-button").length && $(".carousel .carousel-item:nth-child(5)").after('<div class="btn show-more-button"><span class="icon icon-chevron-down"></span></div>'), 
        //     $(".show-more-button").click(function() {
        //         $(this).hide(), $(this).parents(".carousel").addClass("show-all");
        //     })) : $(".show-more-button").parent(".owl-item").remove();
        // }
    },
    equalHeights: function() {
        $(window).width() > 600 && ($(".carousel-2017").each(function() {
            $(this).find(".carousel-item-caption").equalHeights();
        }), $(".bx-2017").each(function() {
            $(this).find(".promo-header").equalHeights();
        }), $(".record-page-2017 .record-details .equal-one").children().closest("dd").slice(0, 2).equalHeights(), 
        $(".record-page-2017 .record-details .equal-one").children().closest("dd").slice(2, 5).equalHeights(), 
        $(".social-feed-2017 .equalHeights").equalHeights()), $(window).width() > 768 && ($(".main-body-page .explore-list-wrap .result").equalHeights(), 
        $(".three-column-article-2017").each(function() {
            $(this).find(".heading").equalHeights();
        }), $(".three-column-article-2017").each(function() {
            $(this).find(".block-content").equalHeights();
        }), $(".ColumnedLayouts").each(function() {
            $(this).find(".columned .carousel-item-caption").equalHeights(), $(this).find(".full-width-header").equalHeights(), 
            $(this).find(".columned>.columned-equal").equalHeights();
        }), $(".our-company-section-wrap .our-company-section").equalHeights()), $(".hero-2017").each(function() {
            var a = $(this);
            a.find(".hero-item").length <= 3 && a.find(".bx-controls").remove();
        }), $(".hero-2017").each(function() {
            $(this).find(".hero-details-quote").equalHeights();
        }), $(".hero .hero-inner").animate({
            left: "-0.1px"
        });
    },
    stTable: function() {
        $("#leaderboard").stacktable({
            hideOriginal: !0
        }), $("#divQuizQuestionsPartialView").length && (console.log("Questions present"), 
        $("#main").not(":has(#divQuizQuestionsPartialView)").addClass("hidden"), $("#main .section").not(":has(#divQuizQuestionsPartialView)").addClass("hidden"), 
        $("#main .content").not(":has(#divQuizQuestionsPartialView)").addClass("hidden"));
    },
    blockDisplay: function() {
        function a(a) {
            console.log("init wall"), a.reset({
                selector: ".blog",
                animate: !0,
                cellW: function(a) {
                    var b = 250;
                    return b;
                },
                cellH: function(a) {
                    var b = 250;
                    return b;
                },
                gutterX: g,
                gutterY: g,
                KeepOrder: !0,
                onResize: function(b) {
                    a.fitWidth();
                }
            }), a.fitWidth(), $(".news-gallery .loader2").hide(), $(".news-gallery").addClass("in");
        }
        function b() {
            var b = new window.Freewall("#home-page-news");
            a(b);
        }
        var c = $(".home-social-twitter").find(".hidden").html(), d = $(".home-social-instagram").find(".hidden").html(), e = $(".home-social-facebook").find(".hidden").html();
        $(".home-social-twitter").insertBefore(".blog:eq(" + c + ")"), $(".home-social-instagram").insertBefore(".blog:eq(" + d + ")"), 
        $(".home-social-facebook").insertBefore(".blog:eq(" + e + ")");
        var f = document.getElementsByClassName("gwr-kids"), g = f.length > 0 ? 20 : 5;
        b();
    },
    // carouselContent: function() {
    //     $(".carousel-content").each(function() {
    //         var a = $(this), b = a.find(".carousel-content-list"), c = a.find(".carousel-content-main"), d = a.find(".carousel-count-current"), e = a.find(".carousel-count-total"), f = 0, g = !1, h = a.attr("data-carousel-slideshow");
    //         g = "undefined" != typeof h && "true" === h, a.find(".carousel-content-main-viewport > article").length > 1 && c.flexslider({
    //             selector: ".carousel-content-main-viewport > article",
    //             controlNav: !1,
    //             useCSS: !1,
    //             slideshow: g,
    //             animation: "slide",
    //             startAt: f,
    //             video: !0,
    //             pauseOnAction: !0,
    //             pauseOnHover: !0,
    //             touch: !0,
    //             sync: b,
    //             controlsContainer: ".flex-counter-container",
    //             start: function(a) {
    //                 d.length > 0 && (d.text(a.currentSlide + 1), e.text(a.count));
    //             },
    //             after: function(a) {
    //                 d.length > 0 && d.text(a.currentSlide + 1);
    //             }
    //         });
    //     });
    // },
    focusInvalidElements: function(a) {
        var b = $(".field-validation-error:first"), c = a.find('[name="' + b.attr("data-valmsg-for") + '"]');
        if (c.data("highlight")) {
            var d = $(c.data("highlight"));
            if (d.length > 0) return d[0].focus(), !0;
        }
    },
    ajaxLoaded: function() {
        var a = this;
        a.lastComponent.startProcessing(!0), a.videos.init();
    },
    resize: {
        globalObj: null,
        resizeTimeout: null,
        init: function() {
            var a = this;
            a.globalObj.settings.$window.on("resize.bbResize", function() {
                a.clearResizeTimeout(), a.resizeTimeout = setTimeout(function() {
                    a.resizeFinished();
                }, 200);
            });
        },
        clearResizeTimeout: function() {
            var a = this;
            a.resizeTimeout && clearTimeout(a.resizeTimeout);
        },
        resizeFinished: function() {
            var a = this;
            a.globalObj.mq.monitorWidth(), a.globalObj.lastComponent.startProcessing(!0), a.globalObj.carousels.reload(), 
            a.globalObj.carousel.reload(), a.globalObj.carouselLightbox.resize(), a.globalObj.searchForm.resize(), 
            a.globalObj.fixedHeader.resize(), a.globalObj.modals.resize(), a.clearResizeTimeout();
        }
    },
    simpleAccordion: {
        actionSelector: ".book-covers--content-action-mobile",
        wrapperSelector: ".book-covers--content",
        contentContainerSelector: ".book-covers--content-item",
        contentContentSelector: ".book-covers--content-content",
        accordionInClass: "accordion-in",
        accordionOutClass: "accordion-out",
        init: function() {
            var a = this;
            $(a.actionSelector).each(function() {
                var b = $(this);
                b.on("touchstart click", function() {
                    var c = b.closest(a.contentContainerSelector), d = b.next(a.contentContentSelector), e = b.next(a.contentContentSelector).find(".book-covers--content-content-inner"), f = e.outerHeight();
                    c.hasClass(a.accordionInClass) ? (c.addClass(a.accordionOutClass), c.removeClass(a.accordionInClass), 
                    d.attr("style", "height:0px")) : (c.removeClass(a.accordionOutClass), c.addClass(a.accordionInClass), 
                    d.attr("style", "height:" + f + "px;"));
                });
            });
        }
    },
    filter: {
        filterSelector: 'input[name="filter"]:radio',
        globalObj: null,
        $handle: null,
        $action: null,
        actionIn: null,
        init: function() {
            var a = this;
            a.$handle = $(a.filterSelector), a.bindEvents();
        },
        bindEvents: function() {
            var a = this;
            a.$handle.change(function() {
                var a = this, b = $(this), c = $("[data-filter-type=" + a.value + "]"), d = c.find(".book-covers--content-item-inner").outerHeight();
                $(".filter label").removeClass("active"), b.closest("label").addClass("active"), 
                $("[data-filter-type]").removeClass("filter-in"), $("[data-filter-type]").addClass("filter-out"), 
                $(".book-covers--content").wrap("<li/>"), $(".book-covers--controls-item").each(function(a) {
                    $(this);
                    a += 1;
                    var b = 9;
                    a === b && (a = -1), console.log(a);
                }), setTimeout(function() {
                    $("[data-filter-type]").removeClass("filter-show"), $("[data-filter-type]").addClass("filter-hide"), 
                    c.removeClass("filter-hide"), c.addClass("filter-show"), $(".book-covers--content").attr("style", "height:" + d + "px;"), 
                    clearTimeout();
                }, 350), setTimeout(function() {
                    c.removeClass("filter-out"), c.addClass("filter-in"), clearTimeout();
                }, 750);
            });
        }
    },
    bookCovers: {
        linkSelector: ".action-book-covers--link",
        closeBtnSelector: ".action-book-covers-close",
        globalObj: null,
        $handle: null,
        $action: null,
        actionIn: null,
        $closeBtn: null,
        $link: null,
        hideBookDelay: null,
        showBookDelay: null,
        init: function() {
            var a = this;
            a.$closeBtn = $(a.closeBtnSelector), a.$link = $(a.linkSelector), a.bindEvents();
        },
        bindEvents: function() {
            var a = this;
            a.$closeBtn.on("click.bookCovers", function(b) {
                b.preventDefault(), a.hideBookContent();
            }), a.$link.on("click.bookCovers", function(b) {
                b.preventDefault();
                var c = $(this), d = c.closest(".book-covers--controls-item"), e = c.position().top, f = d.find(".book-covers--content"), g = d.find(".book-covers--content-item-inner");
                if (f.hasClass("book-content-active")) return void a.hideBookContent();
                if (!d || d.length < 1) return void console.log("ERROR: bookCovers - bindEvents() - $handle.change - no $controlItem");
                var h = $(".book-content-active");
                if (!h || h.length < 1) console.log("ERROR: bookCovers - hideBookContent() - no $activeBookContent"); else {
                    h.removeClass("book-content-active"), h.removeClass("book-content-in");
                    var i = h.attr("data-book-covers-position-top");
                    i = parseInt(i, 10), i !== e && h.height(0), a.hideBookDelay = setTimeout(function() {
                        h.removeClass("book-content-show"), clearTimeout(a.hideBookDelay);
                    }, 150);
                }
                var j = $(".book-covers--controls-item-active");
                f.addClass("book-content-active"), f.addClass("book-content-show"), f.attr("data-book-covers-position-top", e);
                var k = g.outerHeight(!0), l = d.closest(".book-covers--controls"), m = l.outerHeight(!0), n = d.outerHeight(!0);
                k + n > m && l.css("min-height", m + k), a.showBookContent = setTimeout(function() {
                    j && j.length > 0 && j.removeAttr("style"), f.addClass("book-content-in"), j.removeClass("book-covers--controls-item-active"), 
                    d.addClass("book-covers--controls-item-active"), f.height(k), d.height(n + k), $("html,body").animate({
                        scrollTop: d.offset().top - 120
                    }, 250), clearTimeout(a.showBookContent);
                }, 200);
            });
        },
        hideBookContent: function() {
            var a = this, b = $(".book-content-active");
            if (!b || b.length < 1) return void console.log("ERROR: bookCovers - hideBookContent() - no $activeBookContent");
            var c = b.closest(".book-covers--controls-item"), d = b.closest(".book-covers--controls");
            b.removeClass("book-content-active"), b.removeClass("book-content-in"), c.removeClass("book-covers--controls-item-active"), 
            b.height(0), c && c.length > 0 && c.removeAttr("style"), a.hideBookDelay = setTimeout(function() {
                b.removeClass("book-content-show"), d.removeAttr("style"), clearTimeout(a.hideBookDelay);
            }, 150);
        },
        showBookContent: function(a) {
            var b = this;
            if (!a) return void console.log("ERROR - bookCovers - showBookContent() - no $controlItem");
            var c = a.find(".book-covers--content"), d = a.find(".book-covers--content-item-inner");
            c.addClass("book-content-active"), c.addClass("book-content-show");
            var e = d.outerHeight(!0);
            b.showBookContent = setTimeout(function() {
                c.addClass("book-content-in"), c.height(e), clearTimeout(b.showBookContent);
            }, 50);
        }
    },
    datePicker: function() {
        var a = ($("#DateAttemptedYear").val(), !1);
        $(".application-box .application-button.continue").prop("disabled", !0), $(".attempt-date-wrap").on("click", "#dont-know", function(a) {
            $(this).is(":checked") ? $(".application-box .application-button.continue").prop("disabled", !1) : $(".application-box .application-button.continue").prop("disabled", !0);
        }), $("#DateAttemptedDay,#DateAttemptedMonth,#DateAttemptedYear").on("input", function() {
            $("#DateAttemptedDay").val().length && $("#DateAttemptedMonth").val().length && $("#DateAttemptedYear").val().length ? $(".application-box .application-button.continue").prop("disabled", !1) : $(".application-box .application-button.continue").prop("disabled", !0);
        }), $(".attempt-date-wrap").on("click", ".continue", function(a) {
            var b = $(".dob-day").val(), c = $(".dob-month").val(), d = $(".dob-year").val(), e = b + "/" + c + "/" + d;
            $(".application-date").text(e), e = c + "," + b + "," + d;
            var f = Date.parse(e) + 864e5, g = new Date().getTime() + 71712e5, h = new Date().getTime() + 0;
            $('input[name="dont-know"]').is(":checked") ? $("#dont-know-date").css("display", "block") : h > f ? $("#in-the-past").css("display", "block") : f > g ? $("#in-the-future").css("display", "block") : g > f ? $("#less-than-12").css("display", "block") : $(".your-attempt-date-wrap").css("display", "block"), 
            $(".attempt-date-wrap").css("display", "none");
        }), $(".your-attempt-date-wrap").on("click", ".continue", function(a) {
            $(this).parents(".your-attempt-date-wrap").css("display", "none"), $(".date-hide").removeClass("date-hide");
        }), $(".your-attempt-date-wrap, .attempt-date-wrap-btn").on("click", ".previous", function(a) {
            $(this).parents(".your-attempt-date-wrap").css("display", "none"), $(".attempt-date-wrap").css("display", "block");
        }), $(".attempt-date-wrap-btn").on("click", ".previous", function(a) {
            $(".your-attempt-date-wrap").length ? (a.preventDefault(), $(".application-form-section").addClass("date-hide")) : window.history.back();
        }), $(".application-form-section").on("click", ".application-button.continue", function(a) {
            var b = $(this), c = b.parents(".faq"), d = c.children(".application-form-title"), e = c.children(".faq-details"), f = c.nextAll(".faq").not(".indivdual-chosen").first(), g = f.children(".application-form-title"), h = f.children(".faq-details");
            b.addClass("complete"), d.addClass("complete"), c.toggleClass("in"), d.toggleClass("active"), 
            e.slideToggle(500), f.addClass("in"), g.toggleClass("active"), h.slideToggle(500), 
            $("html, body").animate({
                scrollTop: $("#nav-scroll").offset().top
            }, 1e3);
        }), $(".application-form-section").on("click", ".application-button.previous", function(a) {
            if (!$(this).closest(".attempt-date-wrap-btn").length) {
                var b = $(this), c = b.parents(".faq"), d = c.children(".application-form-title"), e = c.children(".faq-details"), f = c.prevAll(".faq").not(".indivdual-chosen").first(), g = f.children(".application-form-title"), h = f.children(".faq-details");
                c.toggleClass("in"), d.toggleClass("active"), e.slideToggle(500), f.addClass("in"), 
                g.toggleClass("active"), h.slideToggle(500), $("html, body").animate({
                    scrollTop: $("#nav-scroll").offset().top
                }, 1e3);
            }
        }), $(".application-form-section").on("click", "#geteventsBTN", function(b) {
            if (!a) {
                var c = "";
                $("#Country option:selected").each(function() {
                    c += $(this)[0].value;
                });
                var d = "";
                $("#State option:selected").each(function() {
                    d += $(this)[0].value;
                });
                var e = $("#DateAttemptedDay").val(), f = $("#DateAttemptedMonth").val(), g = $("#DateAttemptedYear").val(), h = e + "/" + f + "/" + g;
                $.ajax({
                    url: "/Applications/MatchEvent?attemptDate=" + h + "&attemptCountry=" + c + "&attemptState=" + d + "&globalEvent=false",
                    type: "POST",
                    cache: !1
                }).done(function(a) {
                    a.indexOf("no event match") > -1 ? $("#matchEvent").html("") : $("#matchEvent").html(a);
                });
            }
        }), $(".application-box").on("click", "#aftergeteventsBTNGlobal", function(b) {
            a = !1, $("#matchEvent").html("");
            var c = [];
            $('.application-box input[name="MatchEvent.SelectedEvent"]:checked').each(function() {
                c.push(this.value);
            });
            for (var d = 0; d < c.length; d++) "None" !== c[d] && (a = !0);
        }), $(".application-box").on("click", "#geteventsBTNGlobal", function(a) {
            var b = $(".dob-day").val(), c = $(".dob-month").val(), d = $(".dob-year").val(), e = b + "/" + c + "/" + d;
            $(".application-date").text(e), e = c + "," + b + "," + d;
            var f = Date.parse(e) + 864e5, g = new Date().getTime() + 71712e5, h = new Date().getTime() + 0, i = !0, j = "";
            $("#Country option:selected").each(function() {
                j += $(this)[0].value;
            });
            var k = "";
            $("#State option:selected").each(function() {
                k += $(this)[0].value;
            });
            var l = $("#DateAttemptedDay").val(), m = $("#DateAttemptedMonth").val(), n = $("#DateAttemptedYear").val(), o = l + "/" + m + "/" + n;
            $.ajax({
                url: "/Applications/MatchEvent?attemptDate=" + o + "&attemptCountry=" + j + "&attemptState=" + k + "&globalEvent=" + i,
                type: "POST",
                cache: !1
            }).done(function(a) {
                a.indexOf("no event match") > -1 ? ($("#matchEventGlobalInThePast").html(""), $("#matchEventGlobalInTheFuture").html(""), 
                $("#matchEventGloballessthan12").html("")) : h > f ? ($("#matchEventGlobalInThePast").html(a), 
                $("#matchEventGlobalInTheFuture").html(""), $("#matchEventGloballessthan12").html("")) : f > g ? ($("#matchEventGlobalInTheFuture").html(a), 
                $("#matchEventGlobalInThePast").html(""), $("#matchEventGloballessthan12").html("")) : g > f && ($("#matchEventGloballessthan12").html(a), 
                $("#matchEventGlobalInThePast").html(""), $("#matchEventGlobalInTheFuture").html(""));
            });
        }), $(".commercial-cost-warning-question").length && $(".qq-one, .page-title").addClass("hidden"), 
        $("body").on("click", ".commercial-cost-warning-question .application-button", function(a) {
            var b = $(this).data("answer"), c = window.location.pathname.split("/").pop();
            $.ajax({
                url: "/Applications/SubmitCommercialCostWarningAnswer?answer=" + b + "&recordId=" + c,
                type: "POST",
                success: function(a) {
                    b === !0 ? ($(".commercial-cost-warning-question, .page-title-comercial-warning").addClass("hidden"), 
                    $(".qq-one, .page-title").removeClass("hidden")) : window.history.back();
                }
            });
        });
    },
    wysiScripts: function() {
        for (var a = $(".content-body > .wysi-half, .card--inner .wysi-half, .application-info-page .wysi-half"), b = 0; b < a.length; b += 2) a.slice(b, b + 2).wrapAll("<div class='wysi-both-halfs'></div>");
        $('iframe[src*="vimeo.com"]').each(function() {
            $(this).wrap("<div class='embed-container'/>"), $(".embed-container").parent().hasClass("homevideo") && $(".embed-container").addClass("homevideowrap");
        });
        var c = '<div class="wysi-image-gallery-clicked-back"></div>', d = $(c).insertAfter(".wysi-image-gallery");
        d.toggle(), $(".wysi-image-gallery img").click(function() {
            d.toggle(), $(this).toggleClass("wysi-image-gallery-clicked");
        }), $(".wysi-image-gallery-clicked-back").click(function() {
            d.hide(), $(".wysi-image-gallery img").removeClass("wysi-image-gallery-clicked");
        }), $(".wysi-gallery img").each(function() {
            var a = $(this), b = a.attr("src");
            a.wrap('<a href="' + b + '" class="wysi-gallery-img" rel="gallery1"></a>'), a.removeClass("wysi-gallery");
        }), $(".wysi-gallery-img").fancybox({
            openEffect: "none",
            closeEffect: "none"
        }), $(".image-with-caption").each(function() {
            var a = this.alt;
            $(this).after('<div class="image-with-caption-caption"><em>' + a + "</em></div>");
        }), $("#instafeed img, #instafeed-arabic img").css("opacity", "0");
        var e = $("#instafeed img, #instafeed-arabic img").attr("src");
        $(".home-social-instagram").css("background-image", "url(" + e + ")"), $(".region-b .page-menu:not(:has(li))").each(function() {
            $(this).parent().find(".page-menu").css("display", "none");
        }), $(".hero-heading:empty, .hero-content:empty").hide(), $(".filters .filter").on("click", function(a) {
            var b = $(this).find("ul");
            b.slideToggle();
            var c = $(this).find("div i");
            c.toggleClass("icon-chevron-down icon-chevron-up", 500, "easeInQuad");
        });
        var f = window.location.hostname, g = $(".pagination-prev").find("a").attr("href"), h = $(".pagination-next").find("a").attr("href");
        $(".pagination-prev").length && $("head").append($('<link rel="prev" />').attr("href", f + g)), 
        $(".pagination-next").length && $("head").append($('<link rel="next" />').attr("href", f + h));
    },
    socialShareButtons: function() {
        $(".social-email").on("click", function(a) {
            $(".social-email").attr("target", "_self");
            var b = window.location.href, c = $("#main").contents().find("h1").html();
            $(".social-email").attr("href", "mailto:?Subject=" + c + "&Body=" + b);
        }), $(".social-whatsapp").on("click", function(a) {
            $(".social-whatsapp").attr("target", "_self");
            var b = window.location.href;
            $(".social-whatsapp").attr("href", "whatsapp://send?text=" + b + " data-action=share/whatsapp/share");
        }), $(".social-pinterest").on("click", function(a) {
            $(".social-reddit-alien").attr("target", "_blank");
            var b = window.location.href, c = $(".media-picture").closest("div").find("img").attr("src"), d = $("#main").contents().find("h1").html();
            $(".social-pinterest").attr("href", "http://pinterest.com/pin/create/link/?url=" + b + "&media=http://www.guinnessworldrecords.com" + c + "&description=" + d);
        });
    },
    Navigation2017: function() {
        function a() {
            var a = document.getElementById("nav-header");
            a.className = "nav-header", $(".show").removeClass("show"), $(".res-sub-nav").removeAttr("style"), 
            $(".nav-header li").removeAttr("style"), $(".res-mob-nav").html('<i class="fa fa-chevron-down"></i>'), 
            $("#togglebar-menu").removeClass("is-active"), $(".header .nav-links a").removeClass("cross");
        }
        function b() {
            $(".res-mob-nav").on("click", function() {
                var a = $(this).parent().parent().hasClass("show");
                a ? ($(this).html("<i class='fa fa-chevron-down' aria-hidden='true'></i>"), 
                $(this).next().slideUp(500, function() {
                    $(this).parent().parent().removeClass("show");
                }), $(".nav-header > li:not(.show)").show()) : ($(this).html("<i class='icon icon-chevron-up' aria-hidden='true'></i>"), 
                $(this).parent().parent().addClass("show"), $(this).next().hide().slideDown(500, function() {})), 
                $("html, body").animate({
                    scrollTop: $(this).parent().offset().top
                }, 1e3);
            });
        }
        $("header .top #globe").on("click", function() {
            $("header .top #useractions, header .top #search-bar, .header .nav-links a").removeClass("show cross"), 
            $("header .top #countries").toggleClass("show");
        }), $("header .top #useraccount").on("click", function() {
            $("header .top #countries, header .top #search-bar, .header .nav-links a").removeClass("show cross"), 
            $("header .top #useractions").toggleClass("show");
        }), $("header .top #otherlinks").on("click", function(a) {
            a.preventDefault(), $(this).toggleClass("minus"), $("header .top #useractions, header .top #search-bar, .header .nav-links a").removeClass("show cross"), 
            $("header .top #otherlinks-list").toggleClass("show");
        }), $("nav .icon.togglebar").on("click", function() {
            $("#togglebar-menu").toggleClass("is-active"), $(".header .nav-links a, .header #otherlinks").removeClass("show cross minus");
            var b = document.getElementById("nav-header");
            "nav-header" === b.className ? b.className += " responsive" : a();
        }), b(), window.onresize = function(b) {
            $(window).width() > 1030 && a();
        }, $(".qq").on("click", ".radio", function(a) {
            $(".application-button.continue").prop("disabled", !1);
        }), $(".qq").on("click", ".application-button.continue", function(a) {
            $(this).hasClass("btn-disabled") ? a.preventDefault() : ($(".qq-one").addClass("hidden"), 
            $(".qq-two").css("display", "block"));
        }), $(".qq").on("click", ".application-button.previous", function(a) {
            $(".qq-one").removeClass("hidden"), $(".qq-two").css("display", "none");
        }), $(".dynamic-menu-content").on("mouseover", function() {
            var a = $(this);
            a.off("mouseover");
            var b = a.find("div").first(), c = b.data();
            $.ajax({
                url: "/search/dynamicmenu",
                type: "GET",
                data: c,
                processData: !0,
                cache: !0
            }).done(function(a) {
                b.find(".dynamic-loading").remove();
                for (var c = a.navigationItems.length, d = 0; c > d; d++) {
                    var e = a.navigationItems[d];
                    b.append('<a href="' + e.link.url + '" class="attribute"><div class="bg-img"><img src=' + e.link.imageUrl + ' alt="' + e.title + '"/></div><span>' + e.title + "</span></a>");
                }
            }).always(function() {});
        });
        var c = ".main-menu nav ul.nav-header li .res-sub-nav ul li:not(.dynamic-menu-content)";
        $(c).on("mouseover", function() {
            var a = $(this);
            a.off("mouseover"), a.find("img").attr("src", function() {
                return $(this).data("navsrc");
            });
        });
    },
    Games: function() {
        $("#Kids-image-map").on("click", ".clickable-click", function(a) {
            $(".clickable-content-holder").removeClass("show"), $(this).addClass("display").removeClass("clickable-click"), 
            $(this).find(".clickable-content-holder").addClass("show"), $(".clickable-bg").addClass("show");
        }), $("body").on("click", ".clickable-bg, .close", function(a) {
            $(".clickable-content-holder, .clickable-bg").removeClass("show"), $(".clickable").removeClass("display"), 
            $(".clickable").addClass("clickable-click");
        });
    },
    newsletter: function() {
        var a = $(".right-hand-step1>div>div").height() + "px", b = $(".right-hand-step2").height() + "px";
        a > b ? $(".right-hand-step1 > div").css({
            "min-height": a
        }) : $(".right-hand-step1 > div").css({
            "min-height": b
        }), $(".right-hand-step1, .right-hand-step2").css("opacity", "1"), $(".right-hand-step1").click(function() {
            var a = "translateX(-101%)";
            $(".right-hand-step1").css({
                transform: a
            });
        });
    },
    Calendars: function() {
        var a = this, b = $(".calendar"), c = b.data("events-url"), d = $(".calendar-select"), e = $("#contactId"), f = ($("#country"), 
        $("#eventType"), d.closest("form"));
        b.length > 0 && (b.fullCalendar({
            firstDay: 1,
            header: {
                left: "prev,next today",
                center: "title",
                right: "month,agendaWeek,agendaDay"
            },
            events: c,
            timeFormat: "h(:mm)tt",
            columnFormat: "dddd",
            eventColor: "#147997",
            dayClick: function(a, c, d, e) {
                ("month" === e || c) && (b.fullCalendar("changeView", "agendaDay"), b.fullCalendar("gotoDate", a));
            },
            loading: function(b, c) {
                b ? a.loader.showLoader() : a.loader.hideLoader();
            }
        }), d.on("change.bbCalendars", function() {
            $(this);
            b.fullCalendar("removeEvents"), b.fullCalendar("removeEventSource", c);
            var d = [];
            $('[name="statuses"]:checked').each(function() {
                d.push($(this).val());
            });
            var g = [];
            $('[name="eventTypes"]:checked').each(function() {
                g.push($(this).val());
            }), $(".search-filters-added").empty(), $("<ul />").appendTo(".search-filters-added");
            var h = [];
            $('[name="countries"]:checked').each(function() {
                h.push($(this).val()), $(this).parents("label").addClass("active");
                var a = $(this).val();
                $('<li><a class="tag" href="#"data-tag-value="' + a + '"> ' + a + '<i class= "icon icon-dismiss"></i></a></li>').appendTo(".search-filters-added ul");
            });
            var i = [];
            $('[name="regions"]:checked').each(function() {
                i.push($(this).val());
            }), a.$searchFilterAdded = f.find(".search-filters-added"), a.$searchFilterList = f.find(".search-filters-list"), 
            $(".search-filters-added .tag").unbind("click"), $(".search-filters-added .tag").off("click").on("click", function() {}), 
            h.length > 0 && a.$searchFilterAdded.one("click.bbCalendars", ".tag", function(d) {
                var g = $(this), h = a.$searchFilterList.find('input[value="' + g.attr("data-tag-value") + '"]'), i = h.closest(".tag"), j = h.closest("li");
                a.loads = 0, d.stopImmediatePropagation(), i.removeClass("active"), j.removeClass("in").removeStyle(), 
                j.find(".active").removeClass("active"), j.find(":checked").removeAttr("checked").prop("checked", !1), 
                j.find(".in").removeClass("in").removeStyle(), b.fullCalendar("removeEvents"), b.fullCalendar("removeEventSource", c);
                var k = [];
                $('[name="statuses"]:checked').each(function() {
                    k.push($(this).val());
                });
                var l = [];
                $('[name="eventTypes"]:checked').each(function() {
                    l.push($(this).val());
                }), $(".search-filters-added").empty(), $("<ul />").appendTo(".search-filters-added");
                var m = [];
                $('[name="countries"]:checked').each(function() {
                    m.push($(this).val()), $(this).parents("label").addClass("active");
                    var a = $(this).val();
                    $('<li><a class="tag" href="#"data-tag-value="' + a + '"> ' + a + '<i class= "icon icon-dismiss"></i></a></li>').appendTo(".search-filters-added ul");
                });
                var n = [];
                $('[name="regions"]:checked').each(function() {
                    n.push($(this).val());
                }), a.$searchFilterAdded = f.find(".search-filters-added"), a.$searchFilterList = f.find(".search-filters-list"), 
                c = f.attr("action") + "?contactId=" + e.val() + "&country=" + m + "&eventTypes=" + l + "&statuses=" + k + "&regions=" + n, 
                b.fullCalendar("addEventSource", c), d.preventDefault();
            }), c = f.attr("action") + "?contactId=" + e.val() + "&country=" + h + "&eventTypes=" + g + "&statuses=" + d + "&regions=" + i, 
            b.fullCalendar("addEventSource", c);
        }));
    },
    tooltipfunction: function() {
        $(".display-tooltip").click(function() {
            $(this).closest(".control-group").find(".alert").addClass("show in");
        }), $(".tooltip-dismiss").click(function() {
            $(this).offsetParent().removeClass("show in");
        });
    },
    addRecordHolderCheck: function() {
        $(".addRecordHolderCheckk").click(function() {
            document.getElementById("noEntries").value < 1 && $(function() {
                window.addRecordHolder();
            });
        });
    },
    testfunctionRecord: function() {
        $(".input-list-added").click(function() {
            console.log($("#existingHolders div.input-list-element").length), 1 === $("#existingHolders div.input-list-element;").length && $(function() {
                window.addRecordHolder();
            });
        });
    },
    testfunction: function() {
        $(".tr-select").fancybox(), $(".leaderboard tr").click(function(a) {
            var b = $(this).find("a.tr-select");
            a.target !== b[0] && b.trigger("click");
        });
    },
    setGlobalObj: function() {
        var a = this;
        a.mq.globalObj = a, a.modernizrTests.globalObj = a, a.lastComponent.globalObj = a, 
        a.scroll.globalObj = a, a.fixedHeader.globalObj = a, a.navigation.globalObj = a, 
        a.search.globalObj = a, a.quickSearch.globalObj = a, a.dropdownMenus.globalObj = a, 
        a.videos.globalObj = a, a.carousels.globalObj = a, a.carousel.globalObj = a, a.carouselLightbox.globalObj = a, 
        a.resize.globalObj = a, a.inputLists.globalObj = a, a.textareas.globalObj = a, a.numberInputs.globalObj = a, 
        a.masonryLayout.globalObj = a, a.dateInputs.globalObj = a, a.hero.globalObj = a, 
        a.fileUploadTrigger.globalObj = a, a.autocomplete.globalObj = a, a.loader.globalObj = a, 
        a.tabs.globalObj = a, a.explore.globalObj = a, a.modals.globalObj = a, a.social.globalObj = a, 
        a.toggle.globalObj = a, a.faqs.globalObj = a, a.alerts.globalObj = a, a.mediaGallery.globalObj = a, 
        a.uploaders.globalObj = a, a.paymentSelect.globalObj = a, a.multiupload.globalObj = a;
    },
    loaded: function() {
        var a = this;
        a.settings.$window.on("load", function() {
            a.masonryLayout.refreshMasonry(), a.hero.init(), a.carousel.init(), a.socialShareButtons(), 
            a.equalHeights(), a.stTable(), a.blockDisplay(), a.Games(), a.newsletter(), a.disableSend();
        });
    },
    ready: function() {
        var a = this;
        a.setGlobalObj(), a.rightToLeft(), a.mq.monitorWidth(), a.browserPrefix(), a.transitionAnimationEndEvent(), 
        a.setUrlParams(), a.carouselContent(), a.formDefaults(), a.loader.init(), a.scroll.init(), 
        a.modernizrTests.init(), a.lastComponent.init(), a.masonryLayout.preInit(), a.fixedHeader.init(), 
        a.navigation.init(), a.secondaryNavigation.init(), a.search.init(), a.explore.preInit(), 
        a.quickSearch.preInit(), a.dropdownMenus.init(), a.videos.init(), a.carousels.init(), 
        a.carouselLightbox.init(), a.tabs.init(), a.filter.init(), a.bookCovers.init(), 
        a.simpleAccordion.init(), a.paymentSelect.init(), a.modals.init(), a.social.init(), 
        a.multiupload.init(), a.toggle.init(), a.faqs.init(), a.alerts.init(), a.mediaGallery.init(), 
        a.uploaders.preInit(), a.hero.preInit(), a.tooltipfunction(), a.wysiScripts(), a.numberInputs.preInit(), 
        a.dateInputs.preInit(), a.textareas.preInit(), a.showHideFields(), a.inputLists.preInit(), 
        a.fileUploadTrigger.preInit(), a.autocomplete.preInit(), a.assignPerson(), a.autofillPerson(), 
        a.formSteps(), a.searchForm.init(), a.selectNavigate(), a.adverts(), a.confirmAction(), 
        a.searchFieldReset(), a.Navigation2017(), a.datePicker(), a.Calendars(), a.ieFixes(), 
        a.loaded(), a.resize.init();
    }
}), $(bb.ready());