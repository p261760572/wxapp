(function($) {
    var mask;
    var actionsheet;

    function show(params) {

        mask = $('<div class="weui-mask_transparent actionsheet__mask"></div>').appendTo(document.body);

        var actions = params.actions || [];

        var actionsHtml = actions.map(function(d, i) {
            return '<div class="weui-actionsheet__cell ' + (d.className || "") + '">' + d.text + '</div>';
        }).join("");

        var tpl = '<div class="weui-actionsheet" id="weui-actionsheet">' +
            '<div class="weui-actionsheet__menu">' +
            actionsHtml +
            '</div>' +
            '<div class="weui-actionsheet__action">' +
            '<div class="weui-actionsheet__cell">取消</div>' +
            '</div>' +
            '</div>';
        actionsheet = $(tpl).appendTo(document.body);

        actionsheet.find('.weui-actionsheet__menu .weui-actionsheet__cell, .weui-actionsheet__action .weui-actionsheet__cell').each(function(i, e) {
            $(e).click(function() {
                $.closeActionsheet();
                params.onClose && params.onClose();
                if (actions[i] && actions[i].onClick) {
                    actions[i].onClick();
                }
            })
        });

        mask.show().addClass('actionsheet__mask_show');
        actionsheet.show().addClass('weui-actionsheet_toggle');
    };

    function hide() {
        mask.removeClass('actionsheet__mask_show');
        actionsheet.removeClass('weui-actionsheet_toggle').on('transitionend webkitTransitionEnd', function () {
        	if(mask) mask.remove();
        	if(actionsheet) actionsheet.remove();
        	mask = null;
        	actionsheet = null;
        });
    }

    $.actionsheet = function(params) {
        params = $.extend({}, $.actionsheet.defaults, params);
        show(params);
    }

    $.closeActionsheet = function() {
        hide();
    }

    $(document).on('click', '.actionsheet__mask', function() {
        $.closeActionsheet();
    });

    $.actionsheet.defaults = {
        onClose: undefined
    };

})($);
(function($) {

    var dialog;

    function close() {
        if (dialog) dialog.remove();
        dialog = null;
    }

    $.messager = {
        show: function(options) {
            var opts = $.extend({}, $.messager.defaults, options)
            var render = template.compile(opts.dialogTempalte);
            close(); //确保关闭
            dialog = $(render(opts)).appendTo('body');
            dialog.find('.weui-dialog__btn').each(function(i, domEle) {
                $(domEle).click(function() {
                    close();
                    if (opts.buttons[i].onClick) opts.buttons[i].onClick();
                });
            });

            return dialog;
        },
        alert: function(title, msg, fn) {
            return $.messager.show({
                title: title,
                msg: msg,
                buttons: [{
                    text: $.messager.defaults.buttonOK,
                    btnCls: 'primary',
                    onClick: fn
                }]
            });
        },
        confirm: function(title, msg, fn) {
            return $.messager.show({
                title: title,
                msg: msg,
                buttons: [{
                    text: $.messager.defaults.buttonCancel,
                    btnCls: 'default',
                    onClick: function() {
                        fn(false);
                    }
                }, {
                    text: $.messager.defaults.buttonOK,
                    btnCls: 'primary',
                    onClick: function() {
                        fn(true);
                    }
                }]
            });
        }
    };

    $.messager.defaults = {
        title: null,
        msg: null,
        buttonOK: '确定',
        buttonCancel: '取消',
        buttons: [{
            text: '确定',
            btnCls: 'primary'
        }],
        dialogTempalte: '<div class="dialog"> <div class="weui-mask"></div> <div class="weui-dialog"> <div class="weui-dialog__hd"><strong class="weui-dialog__title">{{title}}</strong></div> <div class="weui-dialog__bd">{{msg}}</div> <div class="weui-dialog__ft"> {{each buttons as button i}} <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_{{button.btnCls}}">{{button.text}}</a> {{/each}} </div> </div> </div>'
    };


    // <div class="dialog">
    //     <div class="weui-mask"></div>
    //     <div class="weui-dialog">
    //         <div class="weui-dialog__hd"><strong class="weui-dialog__title">{{title}}</strong></div>
    //         <div class="weui-dialog__bd">{{msg}}</div>
    //         <div class="weui-dialog__ft">
    //             {{each buttons as button i}}
    //             <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_{{button.btnCls}}">{{button.text}}</a>
    //             {{/each}}
    //         </div>
    //     </div>
    // </div>

})($);
(function($) {

    function load(target, data) {
        if (typeof data == 'string') {
            $.ajax({
                url: data,
                dataType: 'json',
                success: function(data) {
                    _load(data);
                }
            });
        } else {
            _load(data);
        }

        function _load(data) {
            var form = $(target);
            for (var name in data) {
                var val = data[name];
                if (!_checkField(name, val)) {
                    form.find('input[name="' + name + '"]').val(val);
                    form.find('textarea[name="' + name + '"]').val(val);
                    form.find('select[name="' + name + '"]').val(val);
                }
            }
        }

        function _checkField(name, val) {
            var cc = $(target).find('input[name="' + name + '"][type=radio], input[name="' + name + '"][type=checkbox]');
            if (cc.length) {
                //cc.prop('checked', false);
                cc.each(function() {
                    if (_isChecked($(this).val(), val)) {
                        $(this).prop('checked', true);
                    }
                });
                return true;
            }
            return false;
        }

        function _isChecked(v, val) {
            if (v == String(val) || $.inArray(v, $.isArray(val) ? val : [val]) >= 0) {
                return true;
            } else {
                return false;
            }
        }
    }

    function clear(target) {
        $('input,select,textarea', target).each(function() {
            var t = this.type,
                tag = this.tagName.toLowerCase();
            if (t == 'text' || t == 'password' || tag == 'textarea')
                this.value = '';
            else if (t == 'checkbox' || t == 'radio')
                this.checked = false;
            else if (tag == 'select')
                this.selectedIndex = -1;
        });
    }

    function reset(target) {
        target.reset();
    }

    function validate(target) {
        if ($.fn.validate) {
            var t = $(target);
            t.find('.validate-text:not(:disabled)').validate('validate');
            var invalidbox = t.find('.validate-invalid');
            var options = invalidbox.filter(':not(:disabled)').first().focus().validate('showTip');
            
            return invalidbox.length == 0;
        }
        return true;
    }

    $.fn.form = function(options, param) {
        if (typeof options == 'string') {
            return $.fn.form.methods[options](this, param);
        }
    };

    $.fn.form.methods = {
        load: function(jq, data) {
            return jq.each(function() {
                load(this, data);
            });
        },
        clear: function(jq) {
            return jq.each(function() {
                clear(this);
            });
        },
        reset: function(jq) {
            return jq.each(function() {
                reset(this);
            });
        },
        validate: function(jq) {
            return validate(jq[0]);
        }
    };
})($);

(function($) {
    function bindEvents(target, off) {
    	var container = $(target);
    	var options = container.data('infinite').options;
    	
        container[off ? 'off' : 'on']('scroll', function() {
        	var offset = container[0].scrollHeight - (container.height() + container.scrollTop());
	        if (offset <= options.distance) {
	            container.trigger('infinite');
	        }
        });
    }
    
    function unbindEvents(target) {
    	bindEvents(target, true);
    }

    $.fn.infinite = function(options, param) {
        if (typeof options == 'string') {
            return $.fn.infinite.methods[options](this, param);
        }

        options = options || {};
        return this.each(function() {

            var state = $(this).data('infinite');
            if (state) {
                $.extend(state.options, options);
            } else {
                $(this).data('infinite', {
                    options: $.extend({}, $.fn.infinite.defaults, options)
                });
                bindEvents(this);
            }
        });
    }

    $.fn.infinite.methods = {        
        destroy: function (jq) {
            return jq.each(function () {
                bindEvents(this, true);
            });
        }
    };

    $.fn.infinite.defaults = {
        distance: 50
    };

})($);

(function($) {

    function selectPage(target, pageNumber) {
        var state = $(target).data('pagination');
        var opts = state.options;
        var pageCount = Math.ceil(state.data.total / opts.pageSize);
        if (pageNumber > pageCount) pageNumber = pageCount;
        if (pageNumber < 1) pageNumber = 1; //页码最小是1
        request(target);
        opts.pageNumber = pageNumber;
    }

    function next(target) {
        var state = $(target).data('pagination');
        var opts = state.options;
        var pageCount = Math.ceil(state.data.total / opts.pageSize);
        if (opts.pageNumber < pageCount) {
            selectPage(target, opts.pageNumber + 1);
        }
    }

    function loadData(target, data) {
        var state = $(target).data('pagination');
        var opts = state.options;

        //数组数据处理
        if ($.isArray(data)) {
            data = {
                rows: data,
                total: data.length
            }
        } else {
            data.total = parseInt(data.total || data.rows.length); //防止total是字符串
        }

        state.data = data; //更新data

        if (opts.onLoadSuccess) {
            opts.onLoadSuccess.call(target, data);
        }
    }

    //请求远程数据
    function request(target) {
        var state = $(target).data('pagination');
        var opts = state.options;

        if (!opts.url) {
            return false;
        }

        var param = $.extend({}, opts.queryParams);
        $.extend(param, {
            page: opts.pageNumber,
            rows: opts.pageSize
        });

        $.toast('showLoading');
        $.ajax({
            type: opts.method,
            url: opts.url,
            data: $.toJSON(param),
            contentType: 'application/json',
            dataType: 'json',
            success: function(data) {
                $.toast('hideLoading');
                if (data.errcode == 0) {
                    loadData(target, data);
                } else if (opts.onLoadError) {
                    opts.onLoadError.call(target);
                }
            },
            error: function () {
                $.toast('hideLoading');
                if (opts.onLoadError) {
                    opts.onLoadError.call(target);
                }
            }
        });
    }

    $.fn.pagination = function(options, param) {
        if (typeof options == 'string') {
            return $.fn.pagination.methods[options](this, param);
        }

        options = options || {};
        return this.each(function() {
            var state = $(this).data('pagination');
            var opts;
            if (state) {
                opts = $.extend(state.options, options);
            } else {
                opts = $.extend({}, $.fn.pagination.defaults, options);
                $(this).data('pagination', {
                    options: opts,
                    data: {
                        total: 0,
                        rows: []
                    }
                });
            }
            selectPage(this, opts.pageNumber);
        });
    };

    $.fn.pagination.methods = {
        select: function(jq, param) {
            return jq.each(function() {
                selectPage(this, param);
            });
        },
        next: function(jq) {
            return jq.each(function() {
                next(this);
            });
        }
    };

    $.fn.pagination.defaults = {
        method: 'post',
        url: null,
        pageSize: 20,
        pageNumber: 1,
        queryParams: {},
        onLoadSuccess: function(data) {},
        onLoadError: function() {}
    };
})($);

(function($) {
    $.parser = {
        /**
         * Example:
         * $.parser.parseOptions(target);
         */
        parseOptions: function(target, properties) {
            var t = $(target);
            var options = {};

            var s = $.trim(t.attr('data-options'));
            if (s) {
                if (s.substring(0, 1) != '{') {
                    s = '{' + s + '}';
                }
                options = (new Function('return ' + s))();
            }

            if (properties) {
                var opts = {};
                for (var i = 0; i < properties.length; i++) {
                    var pp = properties[i];
                    if (typeof pp == 'string') {
                        if (pp == 'width' || pp == 'height' || pp == 'left' || pp == 'top') {
                            opts[pp] = parseInt(target.style[pp]) || undefined;
                        } else {
                            opts[pp] = t.attr(pp);
                        }
                    } else {
                        for (var name in pp) {
                            var type = pp[name];
                            if (type == 'boolean') {
                                opts[name] = t.attr(name) ? (t.attr(name) == 'true') : undefined;
                            } else if (type == 'number') {
                                opts[name] = t.attr(name) == '0' ? 0 : parseFloat(t.attr(name)) || undefined;
                            }
                        }
                    }
                }
                $.extend(options, opts);
            }
            
            return options;
        }
    };
})($);

(function($) {

    function open(target) {   
        $(target).addClass('popup_toggle');
    }

    function close(target) {
        $(target).removeClass('popup_toggle');
    }

    $.fn.popup = function(options, param) {
        if (typeof options == 'string') {
            return $.fn.popup.methods[options](this, param);
        }
    };


    $.fn.popup.methods = {
        open: function(jq) {
            return jq.each(function() {
                open(this);
            });
        },
        close: function(jq) {
            return jq.each(function() {
                close(this);
            });
        }
    };

})($);

(function ($) {

    function init(target) {
        var container = $(target);
        var options = container.data('pull-to-refresh').options;
        var render = template.compile(pullTemplate);

        container.addClass('weui-pull-to-refresh').prepend(render(options));
    }

    function bindEvents(target) {
        var container = $(target);
        var options = container.data('pull-to-refresh').options;
        var start, diffY;
        //container.addClass('weui-pull-to-refresh');
        container.on('touchstart', touchStart);
        container.on('touchmove', touchMove);
        container.on('touchend', touchEnd);

        function getDirection(diffY) {
            if (diffY > 0 && container.scrollTop() == 0) {
                return 'down';
            } else if (diffY < 0 && (container[0].scrollHeight - container.height() - container.scrollTop()) == 0) {
                return 'up';
            }
            return null;
        }

        function touchStart(e) {
            if (container.hasClass('weui-pull-refreshing')) return;
            start = {
                x: e.targetTouches[0].pageX,
                y: e.targetTouches[0].pageY
            };
            diffY = 0;
        };

        function touchMove(e) {
            if (container.hasClass('weui-pull-refreshing')) return;
            if (!start) return false;
            var p = {
                x: e.targetTouches[0].pageX,
                y: e.targetTouches[0].pageY
            };
            //diffX = p.x - p.y;
            diffY = p.y - start.y;
            var direction = getDirection(diffY);
            if (direction != 'down') return;

            //var y = Math.abs(diffY) > options.distance ? options.distance : Math.abs(diffY);
            diffY = Math.pow(diffY, 0.8);
            container.css('transform', 'translate3d(0, ' + diffY + 'px, 0)');

            container.removeClass('weui-pull-down weui-pull-refresh');
            if (diffY < options.distance) {
                container.addClass('weui-pull-down');
            } else {
                container.removeClass('weui-pull-down').addClass('weui-pull-refresh');
            }
        };

        function touchEnd(e) {
            start = false;
            if (container.hasClass('weui-pull-refreshing')) return;
            var direction = getDirection(diffY);
            if (direction != 'down') return;

            //container.removeClass('touching');
            container.removeClass('weui-pull-down weui-pull-refresh');
            container.css('transform', '');
            if (diffY <= options.distance) {
            } else {
                container.addClass('weui-pull-refreshing');
                container.trigger('pull-to-refresh');
            }
        };
    };

    function done(target) {
        $(target).removeClass('weui-pull-refreshing');
    }

    $.fn.pullToRefresh = function (options, param) {
        if (typeof options == 'string') {
            return $.fn.pullToRefresh.methods[options](this, param);
        }

        options = options || {};
        return this.each(function () {
            var state = $(this).data('pull-to-refresh');
            if (state) {
                $.extend(state.options, options);
            } else {
                $(this).data('pull-to-refresh', {
                    options: $.extend({}, $.fn.pullToRefresh.defaults, options)
                });
                init(this);
                bindEvents(this);
            }
        });
    }

    $.fn.pullToRefresh.methods = {
        options: function (jq) {
            return $.data(jq[0], 'pull-to-refresh').options;
        },
        done: function (jq) {
            return jq.each(function () {
                done(this);
            });
        }
    };

    $.fn.pullToRefresh.defaults = {
        distance: 50
    };

    var pullTemplate = '<div class="weui-pull-to-refresh-layer"> <div class="weui-pull-down-inner"><i class="iconfont icon-down"></i>下拉刷新</div> <div class="weui-pull-refresh-inner"><i class="iconfont icon-refresh"></i>释放刷新</div> <div class="weui-pull-refreshing-inner"><i class="iconfont icon-refresh"></i>正在刷新</div> </div>';

    /* pullTemplate
     <div class="weui-pull-to-refresh-layer">
     <div class="weui-pull-down-inner"><i class="iconfont icon-down"></i>下拉刷新</div>
     <div class="weui-pull-refresh-inner"><i class="iconfont icon-refresh"></i>释放刷新</div>
     <div class="weui-pull-refreshing-inner"><i class="iconfont icon-refresh"></i>正在刷新</div>
     </div>
     */
})($);

(function($) {
    function bindEvents(target) {
        var state = $(target).data('searchbar');
        var opts = state.options;
        var form = $(target).find('form.weui-search-bar__form');

        form.off('submit').on('submit', function(e) {
            e.preventDefault();
            if (opts.onSearch) { opts.onSearch.call(this) }
        });

        $(target).off('click').on('click', '.search-bar__search-btn', function(e) {
            form.trigger('submit');
        });
    }

    $.fn.searchbar = function(options, param) {
        options = options || {};
        return this.each(function() {
            var state = $(this).data('searchbar');
            if (state) {
                $.extend(state.options, options);
            } else {
                $(this).data('searchbar', {
                    options: $.extend({}, $.fn.searchbar.defaults, options)
                });
            }
            bindEvents(this);
        });
    };

    $.fn.searchbar.defaults = {
        onSearch: null // function
    };
})($);

(function($) {

    function init(target) {
        var state = $(target).data('select');
        var opts = state.options;
        var render = template.compile(selectTemplate);
        state.panel = $(render(state.options)).appendTo('body');
        state.toolbar = state.panel.children('div.toolbar');
        state.list = state.panel.children('div.select__content');
    }

    function bindEvents(target) {
        var state = $(target).data('select');

        $(target).off('click').on('click', function(e) {
            open(target);
        });

        state.toolbar.off('click').on('click', '.toolbar-close', function(e) {
            close(target);
        }).on('click', '.toolbar-back', function(e) {
            if (state.values.length == 0) {
                close(target);
            } else {
                var deleteArray = state.values.splice(state.values.length - 1, 1);
                loadData(target, deleteArray[0].items);
            }
        });

        state.list.off('change').on('change', function(e) {
            var value = $(e.target).val();
            var item = findItem(state.items, 'value', value);
            state.values.push({
                item: item,
                items: state.items
            });
            if (item && item.items) {
                loadData(target, item.items);
            } else {
                var text = state.values.map(function(d, i) {
                    return d.item.text;
                }).join(state.options.split);

                var values = state.values.map(function(d, i) {
                    return d.item.value;
                }).join(state.options.split);

                $(target).val(text).attr('data-values', values);
                close(target);
            }
        });
    }

    function findItem(items, key, value) {
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item[key] == value) {
                return item
            }
        }
        return null;
    }

    function build(target) {
        var state = $(target).data('select');
        var opts = state.options;

        //字符串数组支持
        opts.items = opts.items.map(function(d, i) {
            if (typeof d == 'string') {
                return {
                    text: d,
                    value: d
                };
            }
            return d;
        });

        loadData(target, opts.items);
    }

    function loadData(target, items) {
        var state = $(target).data('select');
        var opts = state.options;
        var render = template.compile(radioTemplate);
        state.items = items;
        state.list.html(render(state));
    }

    function open(target) {
        var state = $(target).data('select');
        var opts = state.options;
        state.values = [];
        loadData(target, opts.items);
        state.panel.addClass('select_toggle');
    }

    function close(target) {
        var state = $(target).data('select');
        state.panel.removeClass('select_toggle');
    }

    $.fn.select = function(options, param) {
        if (typeof options == 'string') {
            return $.fn.select.methods[options](this, param);
        }

        options = options || {};
        return this.each(function() {
            var state = $(this).data('select');
            var opts;
            if (state) {
                opts = $.extend(state.options, options);
            } else {
                opts = $.extend({}, $.fn.select.defaults, options);
                $(this).data('select', {
                    options: opts
                });
                init(this);
            }
            build(this);
            bindEvents(this);
        });
    };


    $.fn.select.methods = {
        options: function(jq) {
            return $.data(jq[0], 'select').options;
        },
        open: function(jq) {
            return jq.each(function() {
                open(this);
            });
        },
        close: function(jq) {
            return jq.each(function() {
                close(this);
            });
        }
    };

    $.fn.select.defaults = {
        items: [],
        title: "请选择",
        closeText: "关闭",
        backText: "返回",
        onChange: null, //function
        onClose: null, //function
        onOpen: null, //function
        split: " " //多选模式下的分隔符
    };

    var selectTemplate = '<div class="select"> <div class="toolbar"> <div class="toolbar-inner"> <a href="javascript:;" class="toolbar-back">{{backText}}</a> <h1 class="toolbar-title">{{title}}</h1> <a href="javascript:;" class="toolbar-close">{{closeText}}</a></div> </div> <div class="select__content"></div> </div>';
    var radioTemplate = '<div class="weui-cells weui-cells_radio"> {{each items as item i}} <label class="weui-cell weui-check__label"> <div class="weui-cell__bd"> <p>{{item.text}}</p> </div> <div class="weui-cell__ft"> <input type="radio" class="weui-check" name="select" value="{{item.value}}"> <span class="weui-icon-checked"></span> </div> </label> {{/each}} </div>';

    /* selectTemplate
     <div class="select">
     <div class="toolbar">
     <div class="toolbar-inner">
     <a href="javascript:;" class="toolbar-back">{{backText}}</a>
     <h1 class="toolbar-title">{{title}}</h1>
     <a href="javascript:;" class="toolbar-close">{{closeText}}</a></div>
     </div>
     <div class="select__content"></div>
     </div>
     */


    //  <div class="weui-cells weui-cells_radio">
    //     {{each items as item i}}
    //     <label class="weui-cell weui-check__label">
    //         <div class="weui-cell__bd">
    //             <p>{{item.text}}</p>
    //         </div>
    //         <div class="weui-cell__ft">
    //             <input type="radio" class="weui-check" name="select" value="{{item.value}}">
    //             <span class="weui-icon-checked"></span>
    //         </div>
    //     </label>
    //     {{/each}}
    // </div>

})($);

(function($) {

    //加载数据
    function loadData(target, items) {
        var state = $(target).data('select2');
        var opts = state.options;
        var render = template.compile(optionTemplate);

        state.items = items;
        $(target).html(render(state));
        opts.onLoadSuccess.call(target, items);
    }

    //请求远程数据
    function request(target, url, param) {
        var opts = $(target).data('select2').options;
        if (url) {
            opts.url = url;
        }
        if (!opts.url)
            return;
        param = param || {};

        if (opts.onBeforeLoad.call(target, param) == false)
            return;

        $.ajax({
            type: opts.method,
            url: opts.url,
            data: $.toJSON(param),
            contentType: 'application/json',
            dataType: 'json',
            success: function(data) {
                loadData(target, data.rows);
            },
            error: function() {
                opts.onLoadError.apply(this, arguments);
            }
        });
    }

    $.fn.select2 = function(options, param) {
        if (typeof options == 'string') {
            return $.fn.select2.methods[options](this, param);
        }

        options = options || {};
        return this.each(function() {
            var state = $(this).data('select2');
            var opts;

            if (state) {
                opts = $.extend(state.options, options);
            } else {
                opts = $.extend({}, $.fn.select2.defaults, options);
                state = $(this).data('select2', {
                    options: opts,
                    items: []
                });
            }

            if (opts.items) {
                loadData(this, opts.items);
            }
            request(this);
        });
    };


    $.fn.select2.methods = {
        loadData: function(jq, items) {
            return jq.each(function() {
                loadData(this, items);
            });
        },
        reload: function(jq, url) {
            return jq.each(function() {
                request(this, url);
            });
        }
    };

    $.fn.select2.defaults = {
        valueField: 'value',
        textField: 'text',
        method: 'post',
        url: null,
        items: null,
        onBeforeLoad: function(param) {},
        onLoadSuccess: function() {},
        onLoadError: function() {}
    };

    var optionTemplate = '{{each items as item i}} <option value="{{item.value}}">{{item.text}}</option> {{/each}}';

    // {{each items as item i}}
    // <option value="{{item.value}}">{{item.text}}</option>
    // {{/each}}
})($);

(function($) {
    function bindEvents(target) {
    	$(target).on('click', '.weui-tabbar__item', function () {
	        $(this).addClass('weui-bar__item_on').siblings('.weui-bar__item_on').removeClass('weui-bar__item_on');
	    });
    }

    $.fn.tabbar = function() {
        return this.each(function() {
            bindEvents(this);
        });
    }
})($);

(function($) {
    var toast;

    function show(options) {
        options = options || {};
        var opts = $.extend({}, $.toast.defaults, options)
        var render = template.compile(toastTemplate);
        hide(opts);
        toast = $(render(opts)).appendTo('body');

        if (opts.duration != 0) {
            setTimeout(function() {
                hide(opts);
            }, opts.duration);
        }
    };

    function hide(opts) {
        if (toast) {
            toast.remove();
            toast = null;
            if (opts && opts.callback) opts.callback(this);
        }
    }

    $.toast = function(options, param) {
        if (typeof options == 'string') {
            return $.toast.methods[options](param);
        }
    };

    $.toast.methods = {
        show: function(options) {
            //msg
            if (typeof options == 'string') {
                options = {
                    msg: options
                };
            }
            show(options);
        },
        showLoading: function(options) {
            show($.extend({
                duration: 0,
                msg: '数据加载中',
                iconCls: 'weui-loading'
            }, options));
        },
        hideLoading: function(options) {
            hide();
        },
    };

    $.toast.defaults = {
        duration: 2000,
        msg: '操作成功',
        iconCls: null, //weui-icon-success-no-circle
        callback: null //function
    };

    var toastTemplate = '<div style="display: block;"> <div class="weui-mask_transparent"></div> <div class="weui-toast {{if !iconCls}}toast_plain{{/if}}"> {{if iconCls}} <i class="weui-icon_toast {{iconCls}}"></i> {{/if}} <p class="weui-toast__content">{{msg}}</p> </div> </div>';

     // toastTemplate
     // <div style="display: block;">
     // <div class="weui-mask_transparent"></div>
     // <div class="weui-toast {{if !iconCls}}toast_plain{{/if}}">
     // {{if iconCls}}
     // <i class="weui-icon_toast {{iconCls}}"></i>
     // {{/if}}
     // <p class="weui-toast__content">{{msg}}</p>
     // </div>
     // </div>
     
})
($);

(function($) {
    var toptip;

    function show(options) {
        options = options || {};
        var opts = $.extend({}, $.toptip.defaults, options)
        var render = template.compile(toptipTemplate);
        if (toptip) {hide(opts)}
        toptip = $(render(opts)).appendTo('body');

        setTimeout(function() {
            hide(opts);
        }, opts.duration);
    };

    function hide(opts) {
        toptip.remove();
        toptip = null;
        if (opts && opts.callback) opts.callback(this);
    }

    $.toptip = function(options, param) {
        if (typeof options == 'string') {
            return $.toptip.methods[options](param);
        }
    };

    $.toptip.methods = {
        show: function(options) {
            show(options);
        }
    };

    $.toptip.defaults = {
        //toptip
        duration: 2000,
        msg: '操作成功',
        callback: null //function
    };

    var toptipTemplate = '<div class="weui-toptips weui-toptips_warn" style="display: block;">{{msg}}</div>';

    /* toptipTemplate
     <div class="weui-toptips weui-toptips_warn" style="display: block;">{{msg}}</div>
     */
})
($);

(function($) {

    function init(target) {
        $(target).addClass('validate-text');
    }

    function showTip(target) {
        if(target) {
            var state = $(target).data('validate');
            //if(validate(target) == false) {
            $.toptip('show', {
                msg: state.message
            });
            //}
        }
    }

    function validate(target) {
        var state = $(target).data('validate');
        var opts = state.options;
        var t = $(target);
        var value = t.val();

        function setTipMessage(msg) {
            state.message = msg.replace(new RegExp('\\{title\\}', 'g'), opts.title);;
        }
        
        function validateRule(validType) {
        	var result = /([a-zA-Z_]+)(.*)/.exec(validType);
            var rule = opts.rules[result[1]];
            if (value && rule) {
                var param = eval(result[2]);
                if (!rule['validator'].call(target, value, param)) {
                    var message = rule['message'];
                    if (param) {
                        for (var i = 0; i < param.length; i++) {
                            message = message.replace(new RegExp('\\{' + i + '\\}', 'g'), param[i]);
                        }
                    }
                    setTipMessage(opts.invalidMessage || message);
                    t.addClass('validate-invalid');
                    return false;
                }
            }
            
            return true;
        }

        if (opts.required) {
            if (value === '' || value === null) {
                setTipMessage(opts.missingMessage);
                t.addClass('validate-invalid');
                return false;
            }
        }
        if (opts.validType) {
        	if ($.isArray(opts.validType)) {
        		for (var i = 0; i < opts.validType.length; i++) {
                    if (!validateRule(opts.validType[i])) {
                        return false;
                    }
                }
        	} else {
        		if(!validateRule(opts.validType)) {
        			return false;
        		}
        	}
        }

        t.removeClass('validate-invalid');
        
        return true;
    }

    $.fn.validate = function(options, param) {
        if (typeof options == 'string') {
            return $.fn.validate.methods[options](this, param);
        }

        options = options || {};
        return this.each(function() {
            var state = $(this).data('validate');
            if (state) {
                $.extend(state.options, options);
            } else {
                $(this).data('validate', {
                    options: $.extend({}, $.fn.validate.defaults, $.fn.validate.parseOptions(this), options)
                });
            }
			init(this);
        });
    };

    $.fn.validate.methods = {
    	options: function(jq) {
            return jq.data('validate').options;
        },
        validate: function(jq) {
            return jq.each(function() {
                validate(this);
            });
        },
        isValid: function(jq) {
            return validate(jq[0]);
        },
        showTip: function(jq) {
            return showTip(jq[0]);
        }
    };

    $.fn.validate.parseOptions = function(target) {
        return $.parser.parseOptions(target, ['title', 'required']);
    };

    $.fn.validate.defaults = {
        title: null,
        required: false,
        validType: null,
        missingMessage: '{title}为必输项',
        invalidMessage: null,
        rules: {
            length: {
                validator: function(value, param) {
                    var len = $.trim(value).length;
                    return len >= param[0] && len <= param[1]
                },
                message: '{title}输入内容长度必须介于{0}和{1}之间'
            }
        }
    };
})($);
