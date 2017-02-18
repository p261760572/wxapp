(function() {
    
    /**
     * alert 警告弹框，功能类似于浏览器自带的 alert 弹框，用于提醒、警告用户简单扼要的信息，只有一个“确认”按钮，点击“确认”按钮后关闭弹框。
     * @param {string} content 弹窗内容
     * @param {function=} yes 点击确定按钮的回调
     * @param {object=} options 配置项
     * @param {string=} options.title 弹窗的标题
     * @param {string=} options.className 自定义类名
     * @param {array=} options.buttons 按钮配置项，详情参考dialog
     *
     * @example
     * weui.alert('普通的alert');
     * weui.alert('带回调的alert', function(){ console.log('ok') });
     * var alertDom = weui.alert('手动关闭的alert', function(){
     *     return false; // 不关闭弹窗，可用alertDom.hide()来手动关闭
     * });
     * weui.alert('自定义标题的alert', { title: '自定义标题' });
     * weui.alert('带回调的自定义标题的alert', function(){
     *    console.log('ok')
     * }, {
     *    title: '自定义标题'
     * });
     * weui.alert('自定义按钮的alert', {
     *     title: '自定义按钮的alert',
     *     buttons: [{
     *         label: 'OK',
     *         type: 'primary',
     *         onClick: function(){ console.log('ok') }
     *     }]
     * });
     */
    function alert(content, yes, options) {
        yes = yes || $.noop;

        if (typeof yes === 'object') {
            options = yes;
            yes = $.noop;
        }

        options = $.extend({
            content: content,
            buttons: [{
                label: '确定',
                type: 'primary',
                onClick: yes
            }]
        }, options);

        return weui.dialog(options);
    }

    window.weui = window.weui || {};
    window.weui.alert = alert;
    
})();

(function() {

    /**
     * 确认弹窗
     * @param {string} content 弹窗内容
     * @param {function=} yes 点击确定按钮的回调
     * @param {function=} no  点击取消按钮的回调
     * @param {object=} options 配置项
     * @param {string=} options.title 弹窗的标题
     * @param {string=} options.className 自定义类名
     * @param {array=} options.buttons 按钮配置项，详情参考dialog
     *
     * @example
     * weui.confirm('普通的confirm');
     * weui.confirm('自定义标题的confirm', { title: '自定义标题' });
     * weui.confirm('带回调的confirm', function(){ console.log('yes') }, function(){ console.log('no') });
     * var confirmDom = weui.confirm('手动关闭的confirm', function(){
     *     return false; // 不关闭弹窗，可用confirmDom.hide()来手动关闭
     * });
     * weui.confirm('带回调的自定义标题的confirm', function(){ console.log('yes') }, function(){ console.log('no') }, {
     *     title: '自定义标题'
     * });
     * weui.confirm('自定义按钮的confirm', {
     *     title: '自定义按钮的confirm',
     *     buttons: [{
     *         label: 'NO',
     *         type: 'default',
     *         onClick: function(){ console.log('no') }
     *     }, {
     *         label: 'YES',
     *         type: 'primary',
     *         onClick: function(){ console.log('yes') }
     *     }]
     * });
     */
    function confirm(content, yes, no, options) {
        yes = yes || $.noop;
        no = no || $.noop;

        if (typeof yes === 'object') {
            options = yes;
            yes = $.noop;
        } else if(typeof no === 'object'){
            options = no;
            no = $.noop;
        }

        options = $.extend({
            content: content,
            buttons: [{
                label: '取消',
                type: 'default',
                onClick: no
            }, {
                label: '确定',
                type: 'primary',
                onClick: yes
            }]
        }, options);

        return weui.dialog(options);
    }

    window.weui = window.weui || {};
    window.weui.confirm = confirm;

})();

(function() {
    var _sington;
    var tpl = '<div class="<%=className%>"><div class="weui-mask"></div><div class="weui-dialog <% if(isAndroid){ %> weui-skin_android <% } %>"><% if(title){ %><div class="weui-dialog__hd"><strong class="weui-dialog__title"><%=title%></strong></div><% } %><div class="weui-dialog__bd"><%=content%></div><div class="weui-dialog__ft"><% for(var i = 0; i < buttons.length; i++){ %><a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_<%=buttons[i][\'type\']%>"><%=buttons[i][\'label\']%></a><% } %></div></div></div>';

    /**
     * dialog，弹窗，alert和confirm的父类
     *
     * @param {object=} options 配置项
     * @param {string=} options.title 弹窗的标题
     * @param {string=} options.content 弹窗的内容
     * @param {string=} options.className 弹窗的自定义类名
     * @param {array=} options.buttons 按钮配置项
     *
     * @param {string} [options.buttons[].label=确定] 按钮的文字
     * @param {string} [options.buttons[].type=primary] 按钮的类型 [primary, default]
     * @param {function} [options.buttons[].onClick=$.noop] 按钮的回调
     *
     * @example
     * weui.dialog({
     *     title: 'dialog标题',
     *     content: 'dialog内容',
     *     className: 'custom-classname',
     *     buttons: [{
     *         label: '取消',
     *         type: 'default',
     *         onClick: function () { alert('取消') }
     *     }, {
     *         label: '确定',
     *         type: 'primary',
     *         onClick: function () { alert('确定') }
     *     }]
     * });
     */
    function dialog(options) {
        if (_sington) return _sington;
        options = options || {};

        var isAndroid = $.os.android;
        options = $.extend({
            title: null,
            content: '',
            className: '',
            buttons: [{
                label: '确定',
                type: 'primary',
                onClick: $.noop
            }],
            isAndroid: isAndroid
        }, options);
        var $dialogWrap = $($.render(tpl, options));
        var $dialog = $dialogWrap.find('.weui-dialog');
        var $mask = $dialogWrap.find('.weui-mask');

        function _hide() {
            _hide = $.noop; // 防止二次调用导致报错

            $mask.addClass('weui-animate-fade-out');
            $dialog.addClass('weui-animate-fade-out').on('animationend webkitAnimationEnd', function() {
                $dialogWrap.remove();
                _sington = false;
            });
        }

        function hide() { _hide(); }

        $('body').append($dialogWrap);
        // 不能直接把.weui-animate-fade-in加到$dialog，会导致mask的z-index有问题
        $mask.addClass('weui-animate-fade-in');
        $dialog.addClass('weui-animate-fade-in');

        $dialogWrap.on('click', '.weui-dialog__btn', function(evt) {
            var index = $(this).index();
            if (options.buttons[index].onClick) {
                if (options.buttons[index].onClick.call(this, evt) !== false) hide();
            } else {
                hide();
            }
        });

        _sington = {
            hide: hide
        };
        return _sington;
    }

    window.weui = window.weui || {};
    window.weui.dialog = dialog;

})();

(function() {
    var _sington;
    var tpl = '<div class="weui-wepay-flow"><div class="weui-wepay-flow__bd"><%for(var i=0; i < steps.length; i++) {%><div class="weui-wepay-flow__li" data-index="<%=i%>"><div class="weui-wepay-flow__state"><%=i+1%></div><p class="weui-wepay-flow__title-<%if(i%2==0){%>bottom<%}else{%>top<%}%>"><%=steps[i].title%></p></div><%if(i != steps.length-1) {%><div class="weui-wepay-flow__line" data-index="<%=i+1%>"><div class="weui-wepay-flow__process"></div></div><%}%><%}%></div></div>';
    var actionsTpl = '<div class="weui-btn-area flow__btn-area"><a class="weui-btn weui-btn_default flow__btn_previous" href="javascript:;"><%=previousText%></a><a class="weui-btn weui-btn_primary flow__btn_next" href="javascript:"><%=nextText%></a><a class="weui-btn weui-btn_primary flow__btn_finish" href="javascript:"><%=finishText%></a></div>';

    /**
     * flow 流程
     *
     * @param {string} selector 显示流程的selector
     * @param {object=} options 配置项
     * @param {string=} options.finishText 完成按钮的标签
     * @param {string=} options.nextText 下一步按钮的标签
     * @param {string=} options.previousText 上一步按钮的标签
     * @param {function=} options.onStepChanging 在步骤改变前触发，返回false阻止步骤改变
     * @param {function=} options.onStepChanged 在步骤改变后触发
     * @param {function=} options.onFinishing 在完成步骤前触发，返回false来阻止完成
     * @param {function=} options.onFinished 在完成步骤后触发
     *
     * @example
     * weui.flow('#flow', {
     *     finishText: '确认提交',
     *     nextText: '保存并下一步',
     *     previousText: '上一步',
     *     onStepChanging: function() {
     *         console.log(arguments);
     *     },
     *     onStepChanged: function() {
     *         console.log(arguments);
     *     },
     *     onFinishing: function() {
     *         console.log(arguments);
     *     },
     *     onFinished: function() {
     *         console.log(arguments);
     *     }
     * });
     */
    function flow(selector, options) {
        options = options || {};
        var $ele = $(selector);
        options = $.extend({
            finishText: '完成',
            nextText: '下一步',
            previousText: '上一步',
            onStepChanging: $.noop,
            onStepChanged: $.noop,
            onFinishing: $.noop,
            onFinished: $.noop
        }, options, {
            steps: $ele.children('.flow__step')
        });
        var $flow = $($.render(tpl, options));
        var $actions = $($.render(actionsTpl, options));
        var currentIndex = 0;
        var $steps = options.steps;

        function _stepChange(currentIndex, newIndex) {
            if(options.onStepChanging(currentIndex, newIndex) == false) return;
            _hide(currentIndex);
            _show(newIndex)
            options.onStepChanged(newIndex, currentIndex);
        }

        function _show(newIndex) {
            $steps.eq(newIndex).show();

            $flow.find('.weui-wepay-flow__li').each(function (index, item) {
                if(index <= newIndex) {
                    $(item).addClass('weui-wepay-flow__li_done');
                } else {
                    $(item).removeClass('weui-wepay-flow__li_done');
                }
            });
            $flow.find('.weui-wepay-flow__line').each(function (index, item) {
                if(index < newIndex) {
                    $(item).addClass('weui-wepay-flow__line_done');
                } else {
                    $(item).removeClass('weui-wepay-flow__line_done');
                }
            });

            if (newIndex == $steps.length - 1) {
                $actions.children('.flow__btn_next').hide().siblings().show();
            } else if (newIndex == 0) {
                $actions.children('.flow__btn_next').show().siblings().hide();
            } else {
                $actions.children('.flow__btn_finish').hide().siblings().show();
            }

            $('body').scrollTop(0);
        }

        function _hide(currentIndex) {
            $steps.eq(currentIndex).hide();
        }

        function next() {
            _stepChange(currentIndex, currentIndex+1)
            currentIndex++;
        }

        function prev() {
            _stepChange(currentIndex, currentIndex-1)
            currentIndex--;
        }

        function start(index) {
            _hide(currentIndex);
            _show(index)
            currentIndex = index;
        }

        $ele.prepend($flow).append($actions);
        _show(currentIndex);


        $actions.on('click', '.flow__btn_finish', function() {
            if(options.onFinishing(currentIndex) == false) return;
            options.onFinished(currentIndex);
        }).on('click', '.flow__btn_next', function() {
            next();
        }).on('click', '.flow__btn_previous', function() {
            prev();
        });

        _obj = {
            next: next,
            prev: prev,
            start: start
        };
        return _obj;
    }

    window.weui = window.weui || {};
    window.weui.flow = flow;

})();

(function() {
    var _sington;
    var tpl = '<div class="<% if(isAndroid){ %>weui-skin_android <% } %><%= className %>"><div class="weui-mask"></div><div class="weui-actionsheet"><div class="weui-actionsheet__menu"><% for(var i = 0; i < menus.length; i++){ %><div class="weui-actionsheet__cell"><%= menus[i].label %></div><% } %></div><div class="weui-actionsheet__action"><% for(var j = 0; j < actions.length; j++){ %><div class="weui-actionsheet__cell"><%= actions[j].label %></div><% } %></div></div></div>';

    /**
     * actionsheet 弹出式菜单
     * @param {array} menus 上层的选项
     * @param {string} menus[].label 选项的文字
     * @param {function} menus[].onClick 选项点击时的回调
     *
     * @param {array} actions 下层的选项
     * @param {string} actions[].label 选项的文字
     * @param {function} actions[].onClick 选项点击时的回调
     *
     * @param {object=} options 配置项
     * @param {string=} options.className 自定义类名
     *
     * @example
     * weui.actionSheet([
     *     {
     *         label: '拍照',
     *         onClick: function () {
     *             console.log('拍照');
     *         }
     *     }, {
     *         label: '从相册选择',
     *         onClick: function () {
     *             console.log('从相册选择');
     *         }
     *     }, {
     *         label: '其他',
     *         onClick: function () {
     *             console.log('其他');
     *         }
     *     }
     * ], [
     *     {
     *         label: '取消',
     *         onClick: function () {
     *             console.log('取消');
     *         }
     *     }
     * ], {
     *     className: 'custom-classname'
     * });
     */
    function actionSheet(menus, actions, options) {
        if (_sington) return _sington;

        menus = menus || [];
        actions = actions || [];
        options = options || {};

        var isAndroid = $.os.android;
        options = $.extend({
            menus: menus,
            actions: actions,
            className: '',
            isAndroid: isAndroid
        }, options);
        var $actionSheetWrap = $($.render(tpl, options));
        var $actionSheet = $actionSheetWrap.find('.weui-actionsheet');
        var $actionSheetMask = $actionSheetWrap.find('.weui-mask');

        function _hide() {
            _hide = $.noop; // 防止二次调用导致报错
            
            $actionSheet.addClass(isAndroid ? 'weui-animate-fade-out' : 'weui-animate-slide-down');
            $actionSheetMask
                .addClass('weui-animate-fade-out')
                .on('animationend webkitAnimationEnd', function() {
                    $actionSheetWrap.remove();
                    _sington = false;
                });
        }

        function hide() {
            _hide();
        }

        $('body').append($actionSheetWrap);

        // 这里获取一下计算后的样式，强制触发渲染. fix IOS10下闪现的问题
        // $.getStyle($actionSheet[0], 'transform');

        $actionSheet.addClass(isAndroid ? 'weui-animate-fade-in' : 'weui-animate-slide-up');
        $actionSheetMask
            .addClass('weui-animate-fade-in')
            .on('click', hide);
        $actionSheetWrap.find('.weui-actionsheet__menu').on('click', '.weui-actionsheet__cell', function(evt) {
            var index = $(this).index();
            menus[index].onClick.call(this, evt);
            hide();
        });
        $actionSheetWrap.find('.weui-actionsheet__action').on('click', '.weui-actionsheet__cell', function(evt) {
            var index = $(this).index();
            actions[index].onClick.call(this, evt);
            hide();
        });

        _sington = $actionSheetWrap[0];
        _sington.hide = hide;
        return _sington;
    }

    window.weui = window.weui || {};
    window.weui.actionSheet = actionSheet;

})();

(function() {

    // function _findCellParent(ele) {
    //     if (!ele || !ele.classList) return null;
    //     if (ele.classList.contains('weui-cell')) return ele;
    //     return _findCellParent(ele.parentNode);
    // }

    function _validate($input, $form, regexp) {
        var input = $input[0],
            val = $input.val();

        if (input.tagName == 'INPUT' || input.tagName == 'TEXTAREA') {
            var reg = input.getAttribute('pattern') || '';

            if (input.type == 'radio') {
                var radioInputs = $form.find('input[type="radio"][name="' + input.name + '"]');
                for (var i = 0, len = radioInputs.length; i < len; ++i) {
                    if (radioInputs[i].checked) return null;
                }
                return 'empty';
            } else if (input.type == 'checkbox') {
                if (reg) {
                    var checkboxInputs = $form.find('input[type="checkbox"][name="' + input.name + '"]');
                    var regs = reg.replace(/[{\s}]/g, '').split(',');
                    var count = 0;

                    if (regs.length != 2) {
                        throw input.outerHTML + ' regexp is wrong.';
                    }

                    checkboxInputs.forEach(function(checkboxInput) {
                        if (checkboxInput.checked) ++count;
                    });

                    if (!count) return 'empty';

                    if (regs[1] === '') { // {0,}
                        if (count >= parseInt(regs[0])) {
                            return null;
                        } else {
                            return 'notMatch';
                        }
                    } else { // {0,2}
                        if (parseInt(regs[0]) <= count && count <= parseInt(regs[1])) {
                            return null;
                        } else {
                            return 'notMatch';
                        }
                    }
                } else {
                    return input.checked ? null : 'empty';
                }
            } else if ($input.is('[required]') && !val.length) {
                return 'empty';
            } else if (val.length && reg) {
                if (/^REG_/.test(reg)) {
                    if (!regexp) throw 'RegExp ' + reg + ' is empty.';

                    reg = reg.replace(/^REG_/, '');
                    if (!regexp[reg]) throw 'RegExp ' + reg + ' has not found.';

                    reg = regexp[reg];
                }
                if (typeof reg == 'function') {
                    return reg(val) ? null : 'notMatch';
                } else {
                    return new RegExp(reg).test(val) ? null : 'notMatch';
                }
            } else {
                return null;
            }
        } else if ($input.is('[required]') && !val.length) {
            // 没有输入值
            return 'empty';
        }

        return null;
    }

    function _showErrorMsg(error) {
        if (error) {
            var $ele = $(error.ele),
                msg = error.msg,
                tips = $ele.attr(msg + 'Tips') || $ele.attr('tips') || $ele.attr('placeholder');
            if (tips) weui.topTips(tips);

            if (error.ele.type == 'checkbox' || error.ele.type == 'radio') return;

            $ele.closest('.weui-cell').addClass('weui-cell_warn');
        }
    }

    /**
     * 表单校验
     * @param {string} selector 表单的selector
     * @param {Object=} options 配置项
     * @param {function=} options.callback 校验后的回调
     * @param {object=} options.regexp 表单所需的正则表达式
     *
     * @example
     * ##### 普通input的HTML
     * ```html
     * <input type="tel" required pattern="[0-9]{11}" placeholder="输入你现在的手机号" emptyTips="请输入手机号" notMatchTips="请输入正确的手机号">
     * <input type="text" required pattern="REG_IDNUM" placeholder="输入你的身份证号码" emptyTips="请输入身份证号码" notMatchTips="请输入正确的身份证号码">
     * ```
     * - required 表示需要校验
     * - pattern 表示校验的正则，不填则进行为空校验。当以REG_开头时，则获取校验时传入的正则。如`pattern="REG_IDNUM"`，则需要在调用相应方法时传入`{regexp:{IDNUM: /(?:^\d{15}$)|(?:^\d{18}$)|^\d{17}[\dXx]$/}}`，详情请看下面`checkIfBlur`和`validate`
     * - 报错的wording会从 emptyTips | notMatchTips | tips | placeholder 里获得
     * <br>
     *
     * ##### radio
     * radio需要检验，只需把参数写在同一表单下，同name的第一个元素即可。
     * ```html
     * <input type="radio" value="male" name="sex" required tips="请选择性别" />
     * <input type="radio" value="female" name="sex" />
     * ```
     * <br>
     *
     * ##### checkbox
     * checkbox需要校验，只需把参数写在同一表单下，同name的第一个元素即可。
     * pattern 规定选择个数，用法与正则一致，例如：
     * ```html
     * <input type="checkbox" name="assistance" value="黄药师" required pattern="{1,2}" tips="请勾选1-2个敲码助手" />
     * <input type="checkbox" name="assistance" value="欧阳锋" />
     * <input type="checkbox" name="assistance" value="段智兴" />
     * <input type="checkbox" name="assistance" value="洪七公" />
     * ```
     * - {1,}   至少选择1个
     * - {1,2}  选择1-2个
     * - 这里不会出现{0,}这种情况，因为有required就表示必选。否则直接去掉required即可。
     * <br>
     *
     * ``` js
     * // weui.form.validate('#form');
     * weui.form.validate('#form', {
     *     callback: function(error) {
     *         console.log(error); // error: {dom:[Object], msg:[String]}
     *         // return true; // 当return true时，不会显示错误
     *     },
     *     regexp: {
     *         IDNUM: /(?:^\d{15}$)|(?:^\d{18}$)|^\d{17}[\dXx]$/,
     *         VCODE: /^.{4}$/
     *     }
     * });
     * ```
     */
    function validate(selector, options) {
        var $eles = $(selector);
        options = options || {};
        options = $.extend({
            callback: $.noop
        }, options);
        var result = true;
        $eles.each(function(index, ele) {
            var $form = $(ele);
            var $requireds = $form.find('[required],[pattern]') ;
            // $requireds.forEach(function(ele) {
            //     $(ele).closest('.weui-cell').removeClass('weui-cell_warn');
            // });

            for (var i = 0, len = $requireds.length; i < len; ++i) {
                var $required = $requireds.eq(i),
                    errorMsg = _validate($required, $form, options.regexp),
                    error = { ele: $required[0], msg: errorMsg };
                if (errorMsg) {
                    if (!options.callback(error)) _showErrorMsg(error);
                    result = false;
                    return false;
                }
            }
        });

        return result;
    }

    /**
     * checkIfBlur 当表单的input失去焦点时校验
     * @param {string} selector 表单的selector
     * @param {Object=} options 配置项
     * @param {object=} options.regexp 表单所需的正则表达式
     *
     * @example
     * weui.form.checkIfBlur('#form', {
     *     regexp: {
     *         IDNUM: /(?:^\d{15}$)|(?:^\d{18}$)|^\d{17}[\dXx]$/,
     *         VCODE: /^.{4}$/
     *     }
     * });
     */
    function checkIfBlur(selector, options) {
        var $eles = $(selector);

        options = options || {};

        $eles.forEach(function(ele) {
            var $form = $(ele);
            $form.find('[required],[pattern]').on('blur', function() {
                // checkbox 和 radio 不做blur检测，以免误触发
                if (this.type == 'checkbox' || this.type == 'radio') return;

                var $this = $(this);
                if ($this.val().length < 1) return; // 当空的时候不校验，以防不断弹出toptips

                var errorMsg = _validate($this, $form, options.regexp);
                if (errorMsg) {
                    _showErrorMsg({
                        ele: $this[0],
                        msg: errorMsg
                    });
                }
            }).on('focus', function() {
                $(this).closest('.weui-cell').removeClass('weui-cell_warn');
            });
        });

        return this;
    }

    /**
     * load 表单加载数据
     * @param {string} selector 表单的selector
     * @param {Object} data 数据
     *
     * @example
     * weui.form.load('#form', {
     *     name: value
     * });
     */
    function load(selector, data) {
        var $eles = $(selector);

        function _load($form, data) {
            for (var name in data) {
                var val = data[name];
                if (!_checkField($form, name, val)) {
                    $form.find('input[name="' + name + '"]').val(val);
                    $form.find('textarea[name="' + name + '"]').val(val);
                    $form.find('select[name="' + name + '"]').val(val);
                }
            }
        }

        function _checkField($form, name, val) {
            var $cc = $form.find('input[name="' + name + '"][type=radio], input[name="' + name + '"][type=checkbox]');
            if ($cc.length) {
                $cc.forEach(function(ele) {
                    $ele = $(ele);
                    if (_isChecked($ele.val(), val)) {
                        $ele.prop('checked', true);
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

        $eles.forEach(function(ele) {
            var $form = $(ele);
            _load($form, data);
        });

        return this;
    }


    /**
     * clear 表单清空
     * @param {string} selector 表单的selector
     *
     * @example
     * weui.form.clear('#form');
     */
    function clear(selector) {
        $(selector).find('input,textarea,select').forEach(function(ele) {
            var type = ele.type,
                tagName = ele.tagName;
            if (tagName == 'INPUT' || tagName == 'TEXTAREA') {
                if (type == 'checkbox' || type == 'radio') {
                    ele.checked = false;
                } else {
                    ele.value = '';
                }
            } else {
                ele.selectedIndex = -1;
            }
        });
    }
  

    window.weui = window.weui || {};
    window.weui.form = {
        validate: validate,
        checkIfBlur: checkIfBlur,
        load: load,
        clear: clear
    };

})();

(function() {
    var _sington;
    var tpl = '<div class="weui-gallery <%= className %>"><span class="weui-gallery__img" style="background-image: url(<%= url %>); <% if(!deletable){ %>bottom: 0;<% } %>"><%= url %></span><% if(deletable){ %><div class="weui-gallery__opr"><a href="javascript:" class="weui-gallery__del"><i class="weui-icon-delete weui-icon_gallery-delete"></i></a></div><% } %></div>';

    /**
     * gallery 带删除按钮的图片预览，主要是配合图片上传使用
     * @param {string} url gallery显示的图片的url
     * @param {object=} options 配置项
     * @param {string=} options.className 自定义类名
     * @param {boolean=} options.deletable 是否可以删除
     * @param {function=} options.onDelete 点击删除图片时的回调
     *
     * @example
     * var gallery = weui.gallery(url, {
     *     className: 'custom-classname',
     *     onDelete: function(){
     *         if(confirm('确定删除该图片？')){ console.log('删除'); }
     *         gallery.hide();
     *     }
     * });
     */
    function gallery(url, options) {
        if (_sington) return _sington;

        options = options || {};

        options = $.extend({
            className: '',
            deletable: true,
            onDelete: $.noop
        }, options);

        var $gallery = $($.render(tpl, $.extend({
            url: url
        }, options)));

        function _hide() {
            _hide = $.noop; // 防止二次调用导致报错

            $gallery.addClass('weui-animate-fade-out').on('animationend webkitAnimationEnd', function() {
                $gallery.remove();
                _sington = false;
            });
        }

        function hide() { _hide(); }

        $('body').append($gallery);
        $gallery.find('.weui-gallery__img').on('click', hide);
        $gallery.find('.weui-gallery__del').on('click', function() {
            options.onDelete.call(this, url);
        });

        $gallery.show().addClass('weui-animate-fade-in');

        _sington = $gallery[0];
        _sington.hide = hide;
        return _sington;
    }

    window.weui = window.weui || {};
    window.weui.gallery = gallery;

})();

(function() {
    var tpl = '<div class="<%= className %>" style="display: none;"><div class="weui-footer" style="margin:1.5em auto;"><p class="weui-footer__links"><a href="javascript:void(0);" class="weui-footer__link">加载更多数据</a></p></div><div class="weui-loadmore"><i class="weui-loading"></i><span class="weui-loadmore__tips">正在加载</span></div><div class="weui-loadmore weui-loadmore_line"><span class="weui-loadmore__tips">暂无数据</span></div></div>';

    var _sington;

    /**
     * loadmore 加载更多
     * @param {string} selector 显示loadmore的selector
     * @param {Object=} options 配置项
     * @param {function=} options.onLoad 加载数据回调
     *
     * @example
     * weui.loadmore('#loadmore');
     */
    function loadmore(selector, options) {
        if (_sington) return _sington;

        var $parent = $(selector);

        options = options || {};

        options = $.extend({
            pageNumber: 1,
            pageSize: 20,
            onLoad: $.noop
        }, options);

        var $loadmoreWrap = $($.render(tpl, options));
        var isLoading = false;

        function _hide() {
            _hide = $.noop; // 防止二次调用导致报错

            $loadmoreWrap.remove();
            _sington = false;
        }

        function hide() { _hide(); }

        function _loading() {
            if (isLoading) return;
            isLoading = true;

            $loadmoreWrap.show();
            $loadmoreWrap.children().hide();
            $loadmoreWrap.find('.weui-loadmore').eq(0).show();
            options.onLoad(options.pageNumber, options.pageSize);
            options.pageNumber++;
        }

        function loading(pageNumber) {
            options.pageNumber = pageNumber || 1;
            _loading();
        }

        function loaded(hasMore) {
            isLoading = false;

            $loadmoreWrap.children().hide();
            if (hasMore == true) {
                $loadmoreWrap.find('.weui-footer').show();
            } else if (hasMore == false) {
                $loadmoreWrap.find('.weui-loadmore_line').show();
            }
        }

        $parent.append($loadmoreWrap);
        $loadmoreWrap.find('.weui-footer__link').on('click', function() {
            _loading();
        });

        _sington = true;
        return {
            hide: hide,
            loading: loading,
            loaded: loaded
        };
    }

    window.weui = window.weui || {};
    window.weui.loadmore = loadmore;

})();

(function() {
    function depthOf(object) {
    var depth = 1;
    if (object.children && object.children[0]) {
        depth = depthOf(object.children[0]) + 1;
    }
    return depth;
}
    var regex = /^(\d+)(?:-(\d+))?(?:\/(\d+))?$/g;
var varraints = [
    [1, 31],
    [1, 12],
    [0, 6]
];

/**
 * Schedule
 */
function Schedule(fields, start, end) {
    /**
     * dayOfMonth
     * @type {Array}
     */
    this._dates = fields[0];

    /**
     * month
     * @type {Array}
     */
    this._months = fields[1];

    /**
     * dayOfWeek
     * @type {Array}
     */
    this._days = fields[2];

    /**
     * start
     * @type {Date}
     */
    this._start = start;

    /**
     * end
     * @type {Date}
     */
    this._end = end;

    /**
     * cursor
     * @type {Date}
     * @private
     */
    this._pointer = start;
}

Schedule.prototype._findNext = function() {
    var next;
    while (true) {
        if (this._end.getTime() - this._pointer.getTime() <= 0) {
            throw new Error('out of range, end is ' + this._end + ', current is ' + this._pointer);
        }

        var month = this._pointer.getMonth();
        var date = this._pointer.getDate();
        var day = this._pointer.getDay();

        if (this._months.indexOf(month + 1) === -1) {
            this._pointer.setMonth(month + 1);
            this._pointer.setDate(1);
            continue;
        }

        if (this._dates.indexOf(date) === -1) {
            this._pointer.setDate(date + 1);
            continue;
        }

        if (this._days.indexOf(day) === -1) {
            this._pointer.setDate(date + 1);
            continue;
        }

        next = new Date(this._pointer);

        break;
    }
    return next;
}

/**
 * fetch next data
 */
Schedule.prototype.next = function() {
    var value = this._findNext();
    // move next date
    this._pointer.setDate(this._pointer.getDate() + 1);
    return {
        value: value,
        done: !this.hasNext()
    };
}

/**
 * has next
 * @returns {boolean}
 */
Schedule.prototype.hasNext = function() {
    try {
        this._findNext();
        return true;
    } catch (e) {
        return false;
    }
}

function parseField(field, varraints) {
    var low = varraints[0];
    var high = varraints[1];
    var result = [];
    var pointer;

    // * 号等于最低到最高
    field = field.replace(/\*/g, low + '-' + high);

    // 处理 1,2,5-9 这种情况
    var fields = field.split(',');
    for (var i = 0, len = fields.length; i < len; i++) {
        var f = fields[i];
        if (f.match(regex)) {
            f.replace(regex, function($0, lower, upper, step) {
                // ref to `cron-parser`
                step = parseInt(step) || 1;
                // Positive integer higher than varraints[0]
                lower = Math.min(Math.max(low, ~~Math.abs(lower)), high);

                // Positive integer lower than varraints[1]
                upper = upper ? Math.min(high, ~~Math.abs(upper)) : lower;

                // Count from the lower barrier to the upper
                pointer = lower;

                do {
                    result.push(pointer);
                    pointer += step;
                } while (pointer <= upper);
            });
        }
    }
    return result;
}

/**
 *
 * @param expr
 * @param start
 * @param end
 * @returns {*}
 */
function parse(expr, start, end) {
    var atoms = expr.replace(/^\s\s*|\s\s*$/g, '').split(/\s+/);
    var fields = [];
    atoms.forEach(function(atom, index) {
        var varraint = varraints[index];
        fields.push(parseField(atom, varraint));
    });
    return new Schedule(fields, start, end);
}

    /**
 * set transition
 * @param $target
 * @param time
 */
function setTransition($target, time) {
    return $target.css({
        '-webkit-transition': 'all ' + time + 's',
        'transition': 'all ' + time + 's'
    });
};


/**
 * set translate
 */
function setTranslate($target, diff) {
    return $target.css({
        '-webkit-transform': 'translate3d(0, ' + diff + 'px, 0)',
        'transform': 'translate3d(0, ' + diff + 'px, 0)'
    });
};

/**
 * @desc get index of middle item
 * @param items
 * @returns {number}
 */
function getDefaultIndex(items) {
    var current = Math.floor(items.length / 2);
    var count = 0;
    while (!!items[current] && items[current].disabled) {
        current = ++current % items.length;
        count++;

        if (count > items.length) {
            throw new Error('No selectable item.');
        }
    }

    return current;
};

function getDefaultTranslate(offset, rowHeight, items) {
    var currentIndex = getDefaultIndex(items);

    return (offset - currentIndex) * rowHeight;
};

/**
 * get max translate
 * @param offset
 * @param rowHeight
 * @returns {number}
 */
function getMax(offset, rowHeight) {
    return offset * rowHeight;
};

/**
 * get min translate
 * @param offset
 * @param rowHeight
 * @param length
 * @returns {number}
 */
function getMin(offset, rowHeight, length) {
    return -(rowHeight * (length - offset - 1));
};

$.fn.scroll = function(options) {
    var defaults = $.extend({
        items: [], // 数据
        scrollable: '.weui-picker__content', // 滚动的元素
        offset: 3, // 列表初始化时的偏移量（列表初始化时，选项是聚焦在中间的，通过offset强制往上挪3项，以达到初始选项是为顶部的那项）
        rowHeight: 34, // 列表每一行的高度
        onChange: $.noop, // onChange回调
        temp: null, // translate的缓存
        bodyHeight: 7 * 34 // picker的高度，用于辅助点击滚动的计算
    }, options);
    var items = defaults.items.map(function(item) {
        return '<div class="weui-picker__item' + (item.disabled ? ' weui-picker__item_disabled' : '') + '">' + item.label + '</div>';
    }).join('');
    $(this).find('.weui-picker__content').html(items);

    var $scrollable = $(this).find(defaults.scrollable); // 可滚动的元素
    var start; // 保存开始按下的位置
    var end; // 保存结束时的位置
    var startTime; // 开始触摸的时间
    var translate; // 缓存 translate
    var points = []; // 记录移动点
    var windowHeight = window.innerHeight; // 屏幕的高度

    // 首次触发选中事件
    // 如果有缓存的选项，则用缓存的选项，否则使用中间值。
    if (defaults.temp !== null && defaults.temp < defaults.items.length) {
        var index = defaults.temp;
        defaults.onChange.call(this, defaults.items[index], index);
        translate = (defaults.offset - index) * defaults.rowHeight;
    } else {
        var index = getDefaultIndex(defaults.items);
        defaults.onChange.call(this, defaults.items[index], index);
        translate = getDefaultTranslate(defaults.offset, defaults.rowHeight, defaults.items);
    }
    setTranslate($scrollable, translate);

    function stop(diff) {
        translate += diff;

        // 移动到最接近的那一行
        translate = Math.round(translate / defaults.rowHeight) * defaults.rowHeight;
        var max = getMax(defaults.offset, defaults.rowHeight);
        var min = getMin(defaults.offset, defaults.rowHeight, defaults.items.length);
        // 不要超过最大值或者最小值
        if (translate > max) {
            translate = max;
        }
        if (translate < min) {
            translate = min;
        }

        // 如果是 disabled 的就跳过
        var index = defaults.offset - translate / defaults.rowHeight;
        while (!!defaults.items[index] && defaults.items[index].disabled) {
            diff > 0 ? ++index : --index;
        }
        translate = (defaults.offset - index) * defaults.rowHeight;
        setTransition($scrollable, .3);
        setTranslate($scrollable, translate);

        // 触发选择事件
        defaults.onChange.call(this, defaults.items[index], index);
    };


    function _start(pageY) {
        start = pageY;
        startTime = +new Date();
    }

    function _move(pageY) {
        end = pageY;
        var diff = end - start;

        setTransition($scrollable, 0);
        setTranslate($scrollable, (translate + diff));
        startTime = +new Date();
        points.push({ time: startTime, y: end });
        if (points.length > 40) {
            points.shift();
        }
    }

    function _end(pageY) {
        if (!start) return;

        /**
         * 思路:
         * 0. touchstart 记录按下的点和时间
         * 1. touchmove 移动时记录前 40个经过的点和时间
         * 2. touchend 松开手时, 记录该点和时间. 如果松开手时的时间, 距离上一次 move时的时间超过 100ms, 那么认为停止了, 不执行惯性滑动
         *    如果间隔时间在 100ms 内, 查找 100ms 内最近的那个点, 和松开手时的那个点, 计算距离和时间差, 算出速度
         *    速度乘以惯性滑动的时间, 例如 300ms, 计算出应该滑动的距离
         */
        var endTime = new Date().getTime();
        var relativeY = windowHeight - (defaults.bodyHeight / 2);
        end = pageY;

        // 如果上次时间距离松开手的时间超过 100ms, 则停止了, 没有惯性滑动
        if (endTime - startTime > 100) {
            //如果end和start相差小于10，则视为
            if (Math.abs(end - start) > 10) {
                stop(end - start);
            } else {
                stop(relativeY - end);
            }
        } else {
            if (Math.abs(end - start) > 10) {
                var endPos = points.length - 1;
                var startPos = endPos;
                for (var i = endPos; i > 0 && startTime - points[i].time < 100; i--) {
                    startPos = i;
                }

                if (startPos !== endPos) {
                    var ep = points[endPos];
                    var sp = points[startPos];
                    var t = ep.time - sp.time;
                    var s = ep.y - sp.y;
                    var v = s / t; // 出手时的速度
                    var diff = v * 150 + (end - start); // 滑行 150ms,这里直接影响“灵敏度”
                    stop(diff);
                } else {
                    stop(0);
                }
            } else {
                stop(relativeY - end);
            }
        }

        start = null;
    }

    /**
     * 因为现在没有移除匿名函数的方法，所以先暴力移除（off），并且改变$scrollable。
     */
    $scrollable = $(this).off().on('touchstart', function(evt) {
        _start(evt.changedTouches[0].pageY);
    }).on('touchmove', function(evt) {
        _move(evt.changedTouches[0].pageY);
        evt.preventDefault();
    }).on('touchend', function(evt) {
        _end(evt.changedTouches[0].pageY);
    }).on('mousedown', function(evt) {
        _start(evt.pageY);
        evt.stopPropagation();
        evt.preventDefault();
    }).on('mousemove', function(evt) {
        if (!start) return;
        _move(evt.pageY);
        evt.stopPropagation();
        evt.preventDefault();
    }).on('mouseup mouseleave', function(evt) {
        _end(evt.pageY);
        evt.stopPropagation();
        evt.preventDefault();
    }).find(defaults.scrollable);
};


    var pickerTpl = '<div class="<%= className %>"><div class="weui-mask"></div><div class="weui-picker"><div class="weui-picker__hd"><a href="javascript:;" data-action="cancel" class="weui-picker__action">取消</a><a href="javascript:;" data-action="select" class="weui-picker__action" id="weui-picker-confirm">确定</a></div><div class="weui-picker__bd"></div></div></div>';
    var groupTpl = '<div class="weui-picker__group"><div class="weui-picker__mask"></div><div class="weui-picker__indicator"></div><div class="weui-picker__content"></div></div>';

    function Result(item) {
        this.label = item.label;
        this.value = item.value;
    }
    Result.prototype.toString = function() {
        return this.value
    };
    Result.prototype.valueOf = function() {
        return this.value
    };

    var _sington;
    var temp = {}; // temp 存在上一次滑动的位置

    /**
     * picker 多列选择器。
     * @param {array} items picker的数据，即用于生成picker的数据，picker的层级可以自己定义，但建议最多三层。数据格式参考example。
     * @param {Object} options 配置项
     * @param {number=} [options.depth] picker深度(也就是picker有多少列) 取值为1-3。如果为空，则取items第一项的深度。
     * @param {string=} [options.id=default] 作为picker的唯一标识
     * @param {string=} [options.className] 自定义类名
     * @param {array=} [options.defaultValue] 默认选项的value数组
     * @param {function=} [options.onChange] 在picker选中的值发生变化的时候回调
     * @param {function=} [options.onConfirm] 在点击"确定"之后的回调。回调返回选中的结果(Array)，数组长度依赖于picker的层级。
     *
     * @example
     * // 单列picker
     * weui.picker([
     * {
     *     label: '飞机票',
     *     value: 0,
     *     disabled: true // 不可用
     * },
     * {
     *     label: '火车票',
     *     value: 1
     * },
     * {
     *     label: '汽车票',
     *     value: 3
     * },
     * {
     *     label: '公车票',
     *     value: 4,
     * }
     * ], {
     *    className: 'custom-classname',
     *    defaultValue: [3],
     *    onChange: function (result) {
     *        console.log(result)
     *    },
     *    onConfirm: function (result) {
     *        console.log(result)
     *    },
     *    id: 'singleLinePicker'
     * });
     *
     * @example
     * // 多列picker
     * weui.picker([
     *     {
     *         label: '1',
     *         value: '1'
     *     }, {
     *         label: '2',
     *         value: '2'
     *     }, {
     *         label: '3',
     *         value: '3'
     *     }
     * ], [
     *     {
     *         label: 'A',
     *         value: 'A'
     *     }, {
     *         label: 'B',
     *         value: 'B'
     *     }, {
     *         label: 'C',
     *         value: 'C'
     *     }
     * ], {
     *     defaultValue: ['3', 'A'],
     *     onChange: function (result) {
     *         console.log(result);
     *     },
     *     onConfirm: function (result) {
     *         console.log(result);
     *     },
     *     id: 'multiPickerBtn'
     * });
     *
     * @example
     * // 级联picker
     * weui.picker([
     * {
     *     label: '飞机票',
     *     value: 0,
     *     children: [
     *         {
     *             label: '经济舱',
     *             value: 1
     *         },
     *         {
     *             label: '商务舱',
     *             value: 2
     *         }
     *     ]
     * },
     * {
     *     label: '火车票',
     *     value: 1,
     *     children: [
     *         {
     *             label: '卧铺',
     *             value: 1,
     *             disabled: true // 不可用
     *         },
     *         {
     *             label: '坐票',
     *             value: 2
     *         },
     *         {
     *             label: '站票',
     *             value: 3
     *         }
     *     ]
     * },
     * {
     *     label: '汽车票',
     *     value: 3,
     *     children: [
     *         {
     *             label: '快班',
     *             value: 1
     *         },
     *         {
     *             label: '普通',
     *             value: 2
     *         }
     *     ]
     * }
     * ], {
     *    className: 'custom-classname',
     *    defaultValue: [1, 3],
     *    onChange: function (result) {
     *        console.log(result)
     *    },
     *    onConfirm: function (result) {
     *        console.log(result)
     *    },
     *    id: 'doubleLinePicker'
     * });
     */
    function picker() {
        if (_sington) return _sington;

        // 配置项
        var options = arguments[arguments.length - 1];
        var defaults = $.extend({
            id: 'default',
            className: '',
            onChange: $.noop,
            onConfirm: $.noop
        }, options);

        // 数据处理
        var items;
        var isMulti = false; // 是否多列的类型
        if (arguments.length > 2) {
            var i = 0;
            items = [];
            while (i < arguments.length - 1) {
                items.push(arguments[i++]);
            }
            isMulti = true;
        } else {
            items = arguments[0];
        }

        // 获取缓存
        temp[defaults.id] = temp[defaults.id] || [];
        var result = [];
        var lineTemp = temp[defaults.id];
        var $picker = $($.render(pickerTpl, defaults));
        var depth = options.depth || (isMulti ? items.length : util.depthOf(items[0])),
            groups = '';

        // 显示与隐藏的方法
        function show() {
            $('body').append($picker);

            // 这里获取一下计算后的样式，强制触发渲染. fix IOS10下闪现的问题
            // $.getStyle($picker[0], 'transform');

            $picker.find('.weui-mask').addClass('weui-animate-fade-in');
            $picker.find('.weui-picker').addClass('weui-animate-slide-up');
        }

        function _hide() {
            _hide = $.noop; // 防止二次调用导致报错

            $picker.find('.weui-mask').addClass('weui-animate-fade-out');
            $picker.find('.weui-picker').addClass('weui-animate-slide-down')
                .on('animationend webkitAnimationEnd', function() {
                    $picker.remove();
                    _sington = false;
                });
        }

        function hide() { _hide(); }

        // 初始化滚动的方法
        function scroll(items, level) {
            if (lineTemp[level] === undefined && defaults.defaultValue && defaults.defaultValue[level] !== undefined) {
                // 没有缓存选项，而且存在defaultValue
                var defaultVal = defaults.defaultValue[level];
                var index = 0,
                    len = items.length;

                for (; index < len; ++index) {
                    if (defaultVal == items[index].value) break;
                }
                if (index < len) {
                    lineTemp[level] = index;
                } else {
                    console.warn('Picker has not match defaultValue: ' + defaultVal);
                }
            }
            $picker.find('.weui-picker__group').eq(level).scroll({
                items: items,
                temp: lineTemp[level],
                onChange: function(item, index) {
                    //为当前的result赋值。
                    if (item) {
                        result[level] = new Result(item);
                    } else {
                        result[level] = null;
                    }
                    lineTemp[level] = index;

                    if (isMulti) {
                        defaults.onChange(result);
                    } else {
                        /**
                         * @子列表处理
                         * 1. 在没有子列表，或者值列表的数组长度为0时，隐藏掉子列表。
                         * 2. 滑动之后发现重新有子列表时，再次显示子列表。
                         *
                         * @回调处理
                         * 1. 因为滑动实际上是一层一层传递的：父列表滚动完成之后，会call子列表的onChange，从而带动子列表的滑动。
                         * 2. 所以，使用者的传进来onChange回调应该在最后一个子列表滑动时再call
                         */
                        if (item.children && item.children.length > 0) {
                            $picker.find('.weui-picker__group').eq(level + 1).show();
                            !isMulti && scroll(item.children, level + 1); // 不是多列的情况下才继续处理children
                        } else {
                            //如果子列表test不通过，子孙列表都隐藏。
                            var $items = $picker.find('.weui-picker__group');
                            $items.forEach(function(ele, index) {
                                if (index > level) {
                                    $(ele).hide();
                                }
                            });

                            result.splice(level + 1);

                            defaults.onChange(result);
                        }
                    }
                },
                onConfirm: defaults.onConfirm
            });
        }


        while (depth--) {
            groups += groupTpl;
        }

        $picker.find('.weui-picker__bd').html(groups);
        show();

        if (isMulti) {
            items.forEach(function(item, index) {
                scroll(item, index);
            });
        } else {
            scroll(items, 0);
        }

        $picker.on('click', '.weui-mask', hide).on('click', '.weui-picker__action', hide)
            .on('click', '#weui-picker-confirm', function() {
                defaults.onConfirm(result);
            });
        _sington = $picker[0];
        _sington.hide = hide;
        return _sington;
    }

    /**
     * dataPicker 时间选择器，由picker拓展而来，提供年、月、日的选择。
     * @param options 配置项
     * @param {string=} [options.id=datePicker] 作为picker的唯一标识
     * @param {number=|string|Date} [options.start=2000] 起始年份，如果是 `Number` 类型，表示起始年份；如果是 `String` 类型，格式为 'YYYY-MM-DD'；如果是 `Date` 类型，就传一个 Date
     * @param {number=|string|Date} [options.end=2030] 结束年份，同上
     * @param {string=} [options.cron=* * *] cron 表达式，三位，分别是 dayOfMonth[1-31]，month[1-12] 和 dayOfWeek[0-6]（周日-周六）
     * @param {string=} [options.className] 自定义类名
     * @param {array=} [options.defaultValue] 默认选项的value数组, 如 [1991, 6, 9]
     * @param {function=} [options.onChange] 在picker选中的值发生变化的时候回调
     * @param {function=} [options.onConfirm] 在点击"确定"之后的回调。回调返回选中的结果(Array)，数组长度依赖于picker的层级。
     *
     *@example
     * // 示例1：
     * weui.datePicker({
     *     start: 1990,
     *     end: 2000,
     *     defaultValue: [1991, 6, 9],
     *     onChange: function(result){
     *         console.log(result);
     *     },
     *     onConfirm: function(result){
     *         console.log(result);
     *     },
     *     id: 'datePicker'
     * });
     *
     * // 示例2：
     * weui.datePicker({
     *      start: new Date(), // 从今天开始
     *      end: 2030,
     *      defaultValue: [2020, 6, 9],
     *      onChange: function(result){
     *          console.log(result);
     *      },
     *      onConfirm: function(result){
     *          console.log(result);
     *      },
     *      id: 'datePicker'
     *  });
     *
     *  // 示例3：
     * weui.datePicker({
     *      start: new Date(), // 从今天开始
     *      end: 2030,
     *      cron: '* * 0,6',  // 每逢周日、周六
     *      onChange: function(result){
     *          console.log(result);
     *      },
     *      onConfirm: function(result){
     *          console.log(result);
     *      },
     *      id: 'datePicker'
     *  });
     *
     *  // 示例4：
     * weui.datePicker({
     *      start: new Date(), // 从今天开始
     *      end: 2030,
     *      cron: '1-10 * *',  // 每月1日-10日
     *      onChange: function(result){
     *          console.log(result);
     *      },
     *      onConfirm: function(result){
     *          console.log(result);
     *      },
     *      id: 'datePicker'
     *  });
     */
    function datePicker(options) {
        var defaults = $.extend({
            id: 'datePicker',
            onChange: $.noop,
            onConfirm: $.noop,
            start: 2000,
            end: 2030,
            cron: '* * *'
        }, options);

        // 兼容原来的 start、end 传 Number 的用法
        if (typeof defaults.start === 'number') {
            defaults.start = new Date(defaults.start + '-01-01');
        } else if (typeof defaults.start === 'string') {
            defaults.start = new Date(defaults.start);
        }
        if (typeof defaults.end === 'number') {
            defaults.end = new Date(defaults.end + '-12-31');
        } else if (typeof defaults.end === 'string') {
            defaults.end = new Date(defaults.end);
        }

        var findBy = function(array, key, value) {
            for (var i = 0, len = array.length; i < len; i++) {
                var obj = array[i];
                if (obj[key] == value) {
                    return obj;
                }
            }
        };

        var date = [];
        var interval = parse(defaults.cron, defaults.start, defaults.end);
        var obj;
        do {
            obj = interval.next();

            var year = obj.value.getFullYear();
            var month = obj.value.getMonth() + 1;
            var day = obj.value.getDate();

            var Y = findBy(date, 'value', year);
            if (!Y) {
                Y = {
                    label: year + '年',
                    value: year,
                    children: []
                };
                date.push(Y);
            }
            var M = findBy(Y.children, 'value', month);
            if (!M) {
                M = {
                    label: month + '月',
                    value: month,
                    children: []
                };
                Y.children.push(M);
            }
            M.children.push({
                label: day + '日',
                value: day
            });
        }
        while (!obj.done);

        return picker(date, defaults);
    }


    window.weui = window.weui || {};
    window.weui.picker = picker;
    window.weui.datePicker = datePicker;

})();

(function() {
    var _sington;
    var tpl = '<div class="weui-loading_toast <%= className %>"><div class="weui-mask_transparent"></div><div class="weui-toast"><i class="weui-loading weui-icon_toast"></i><p class="weui-toast__content"><%=content%></p></div></div>';

    /**
     * loading
     * @param {string} content loading的文字
     * @param {object=} options 配置项
     * @param {string=} options.className 自定义类名
     *
     * @example
     * var loading = weui.loading('loading', {
     *     className: 'custom-classname'
     * });
     * setTimeout(function () {
     *     loading.hide();
     * }, 3000);
     */
    function loading(content, options) {
        if (_sington) return _sington;

        options = options || {};

        options = $.extend({
            content: content,
            className: ''
        }, options);

        const $loadingWrap = $($.render(tpl, options));
        const $loading = $loadingWrap.find('.weui-toast');
        const $mask = $loadingWrap.find('.weui-mask');

        function _hide() {
            _hide = $.noop; // 防止二次调用导致报错

            $mask.addClass('weui-animate-fade-out');
            $loading
                .addClass('weui-animate-fade-out')
                .on('animationend webkitAnimationEnd', function() {
                    $loadingWrap.remove();
                    _sington = false;
                });
        }

        function hide() { _hide(); }

        $('body').append($loadingWrap);
        $loading.addClass('weui-animate-fade-in');
        $mask.addClass('weui-animate-fade-in');

        _sington = $loadingWrap[0];
        _sington.hide = hide;
        return _sington;
    }

    window.weui = window.weui || {};
    window.weui.loading = loading;

})();

(function() {
    var _history = [];
    var $currentPage;

    function _show($page) {
        _hide();
        $currentPage = $page;
        $page.addClass('page_show weui-animate-fade-in');
    }

    function _hide($page) {
        if ($page) {
            $page.removeClass('page_show weui-animate-fade-in');
        } else if ($currentPage) {
            $currentPage.removeClass('page_show weui-animate-fade-in');
        }
    }

    /**
     * show 显示页面
     *
     * @param {object} ele 当前页面的Dom Element
     * @param {string} selector 显示页面的selector
     *
     * @example
     * weui.page.show(this, '#page');
     */
    function show(ele, selector) {
        var $page = $(ele).closest('.page');
        _hide($page);
        _history.push($page);
        _show($(selector));
    }


    /**
     * back 页面返回
     *
     * @example
     * weui.page.back();
     */
    function back() {
        if (_history.length > 0) {
            var $page = _history.pop();
            _show($page);
        }
    }

    window.weui = window.weui || {};
    window.weui.page = {
        show: show,
        back: back
    };

})();

(function() {

    /**
     * searchbar 搜索框，主要实现搜索框组件一些显隐逻辑
     * @param {string} selector searchbar的selector
     * @param {function=} onSearch 搜索提交回调
     * @param {function=} onCancelSearch 搜索取消回调
     *
     * @example
     * weui.searchBar('#searchBar');
     */
    function searchBar(selector, onSearch, onCancelSearch) {
        var $eles = $(selector);

        onSearch = onSearch || $.noop;
        onCancelSearch = onCancelSearch || $.noop;

        $eles.forEach(function(ele) {
            var $searchBar = $(ele);
            var $searchLabel = $searchBar.find('.weui-search-bar__label');
            var $searchInput = $searchBar.find('.weui-search-bar__input');
            var $searchClear = $searchBar.find('.weui-icon-clear');
            var $searchCancel = $searchBar.find('.weui-search-bar__cancel-btn');
            var $searchForm = $searchBar.find('.weui-search-bar__form');

            function cancelSearch() {
                $searchInput.val('');
                $searchBar.removeClass('weui-search-bar_focusing');
                onCancelSearch();
            }

            $searchLabel.on('click', function() {
                $searchBar.addClass('weui-search-bar_focusing');
                $searchInput[0].focus();
            });
            $searchInput.on('blur', function() {
                if (!this.value.length) cancelSearch();
            });
            $searchClear.on('click', function() {
                $searchInput.val('');
                $searchInput[0].focus();
            });
            $searchCancel.on('click', function() {
                cancelSearch();
                $searchInput[0].blur();
            });
            $searchForm.on('submit', function(evt) {
                evt.preventDefault();
                onSearch();
            });
        });

        var _obj = {};

        return _obj;
    }

    window.weui = window.weui || {};
    window.weui.searchBar = searchBar;

})();

(function() {

    /**
     * searchPage 搜索页
     * @param {string} selector searchPage的selector
     * @param {object=} options 配置项
     * @param {function=} options.onSearch 搜索页搜索回调
     * @param {function=} options.onCancelSearch 搜索页取消搜索回调
     *
     * @example
     * weui.searchPage('#searchPage');
     */
    function searchPage(selector, options) {
        options = options || {};

        var $ele = $(selector);
        var $searchBar = $ele.children('.weui-search-bar');
        var $searchForm = $searchBar.children('form');
        var $searchBarResult = $ele.children('.searchbar-result');

        options = $.extend({
            onSearch: $.noop,
            onCancelSearch: $.noop
        }, options);

        var loadmore = weui.loadmore($ele, {
            onLoad: function(pageNumber, pageSize) {
                var queryParams = $searchForm.serializeObject();
                $.extend(queryParams, {
                    page: pageNumber,
                    rows: pageSize
                });
                console.log(queryParams);
                options.onSearch($searchBarResult, queryParams);
            }
        });

        weui.searchBar($searchBar, function() {
            $searchBarResult.html('');
            loadmore.loading();
        }, function() {
            options.onCancelSearch();
        });

        function _clear() {
            loadmore.loaded(); //不显示loadmore
            weui.form.clear($searchForm);
            $searchBarResult.html('');
        }

        function show(target) {
            weui.page.show(target, selector);
            _clear();

            return _obj;
        }

        function loaded(hasMore) {
            loadmore.loaded(hasMore);

            return _obj;
        }

        function search() {
            $searchForm.submit();

            return _obj;
        }

        var _obj = {
            show: show,
            loaded: loaded,
            search: search
        }

        return _obj;
    }

    window.weui = window.weui || {};
    window.weui.searchPage = searchPage;

})();

(function() {

    /**
     * slider slider滑块，单位是百分比。注意，因为需要获取slider的长度，所以必须要在slider可见的情况下来调用。
     * @param {string} selector slider的selector
     * @param {object=} options 配置项
     * @param {number=} options.step slider的step，每次移动的百分比，取值范围 [0-100]
     * @param {number=} [options.defaultValue=0] slider的默认百分比值，取值范围 [0-100]
     * @param {function=} options.onChange slider发生改变时返回对应的百分比，取值范围 [0-100]
     *
     * @example
     * weui.slider('#sliderStep', {
     *     step: 10,
     *     defaultValue: 40,
     *     onChange: function(percent){
     *         console.log(percent);
     *     }
     * });
     */
    function slider(selector, options) {
        var $eles = $(selector);
        options = options || {};
        options = $.extend({
            step: undefined,
            defaultValue: 0,
            onChange: $.noop
        }, options);

        if (options.step !== undefined) {
            options.step = parseFloat(options.step);
            if (!options.step || options.step < 0) {
                throw new Error('Slider step must be a positive number.');
            }
        }
        if (options.defaultValue !== undefined && options.defaultValue < 0 || options.defaultValue > 100) {
            throw new Error('Slider defaultValue must be >= 0 and <= 100.');
        }

        $eles.forEach(function(ele) {
            var $slider = $(ele);
            var $sliderInner = $slider.find('.weui-slider__inner');
            var $sliderTrack = $slider.find('.weui-slider__track');
            var $sliderHandler = $slider.find('.weui-slider__handler');

            var sliderLength = $sliderInner.width(); // slider的长度
            var sliderLeft = $sliderInner[0].offsetLeft; // slider相对于页面的offset
            var handlerStartPos = 0; // handler起始位置
            var handlerStartX = 0; // handler touchstart的X
            var stepWidth; // 每个step的宽度

            function getHandlerPos() {
                var pos = $sliderHandler.css('left');

                if (/%/.test(pos)) {
                    pos = sliderLength * parseFloat(pos) / 100;
                } else {
                    pos = parseFloat(pos);
                }
                return pos;
            }

            function setHandler(distance) {
                var dist, // handler的目标位置
                    percent; // 所在位置的百分比

                if (options.step) {
                    distance = Math.round(distance / stepWidth) * stepWidth;
                }

                dist = handlerStartPos + distance;
                dist = dist < 0 ? 0 : dist > sliderLength ? sliderLength : dist;

                percent = 100 * dist / sliderLength;

                $sliderTrack.css({ width: percent + '%' });
                $sliderHandler.css({ left: percent + '%' });
                options.onChange.call(ele, percent);
            }


            if (options.step) {
                stepWidth = sliderLength * options.step / 100;
            }
            if (options.defaultValue) {
                setHandler(sliderLength * options.defaultValue / 100);
            }

            $slider.on('click', function(evt) {
                evt.preventDefault();

                handlerStartPos = getHandlerPos();
                setHandler(evt.pageX - sliderLeft - handlerStartPos);
            });
            $sliderHandler.on('touchstart', function(evt) {
                handlerStartPos = getHandlerPos();
                handlerStartX = evt.changedTouches[0].clientX;
            }).on('touchmove', function(evt) {
                evt.preventDefault();

                setHandler(evt.changedTouches[0].clientX - handlerStartX);
            });
        });

        return this;
    }

    window.weui = window.weui || {};
    window.weui.slider = slider;

})();

(function() {
    var _sington;
    var tpl = '<div class="<%= className %>"><div class="weui-mask_transparent"></div><div class="weui-toast"><i class="weui-icon_toast weui-icon-success-no-circle"></i><p class="weui-toast__content"><%=content%></p></div></div>';

    /**
     * toast 一般用于操作成功时的提示场景
     * @param {string} content toast的文字
     * @param {Object|number|function=} options 配置项|多少毫秒后关闭|关闭后的回调
     * @param {number=} [options.duration=3000] 多少毫秒后关闭toast
     * @param {function=} options.callback 关闭后的回调
     * @param {string=} options.className 自定义类名
     *
     * @example
     * weui.toast('操作成功', 3000);
     * weui.toast('操作成功', {
     *     duration: 3000,
     *     className: 'custom-classname',
     *     callback: function(){ console.log('close') }
     * });
     */
    function toast(content, options) {
        if (_sington) return _sington;

        options = options || {};

        if (typeof options === 'number') {
            options = {
                duration: options
            };
        }
        if (typeof options === 'function') {
            options = {
                callback: options
            };
        }

        options = $.extend({
            content: content,
            duration: 3000,
            callback: $.noop,
            className: ''
        }, options);

        var $toastWrap = $($.render(tpl, options));
        var $toast = $toastWrap.find('.weui-toast');
        var $mask = $toastWrap.find('.weui-mask');

        $('body').append($toastWrap);
        $toast.addClass('weui-animate-fade-in');
        $mask.addClass('weui-animate-fade-in');

        setTimeout(function() {
            $mask.addClass('weui-animate-fade-out');
            $toast.addClass('weui-animate-fade-out').on('animationend webkitAnimationEnd', function() {
                $toastWrap.remove();
                _sington = false;
                options.callback();
            });
        }, options.duration);

        _sington = $toastWrap[0];
        return $toastWrap[0];
    }

    window.weui = window.weui || {};
    window.weui.toast = toast;

})();

(function() {

    /**
     * tab tab导航栏
     * @param {string} selector tab的selector
     * @param {object=} options 配置项
     * @param {number=} [options.defaultIndex=0] 初始展示的index
     * @param {function=} options.onChange 点击tab时，返回对应的index
     *
     * @example
     * weui.tab('#tab',{
     *     defaultIndex: 0,
     *     onChange: function(index){
     *         console.log(index);
     *     }
     * });
     */
    function tab(selector, options) {
        var $eles = $(selector);
        options = options || {};
        options = $.extend({
            defaultIndex: 0,
            onChange: $.noop
        }, options);

        $eles.forEach(function(ele) {
            var $tab = $(ele);
            var $tabItems = $tab.find('.weui-navbar__item, .weui-tabbar__item');
            var $tabContents = $tab.find('.weui-tab__content');

            $tabItems.eq(options.defaultIndex).addClass('weui-bar__item_on');
            $tabContents.eq(options.defaultIndex).show();

            $tabItems.on('click', function() {
                var $this = $(this),
                    index = $this.index();

                $tabItems.removeClass('weui-bar__item_on');
                $this.addClass('weui-bar__item_on');

                $tabContents.hide();
                $tabContents.eq(index).show();

                options.onChange.call(this, index);
            });
        });

        return this;
    }

    window.weui = window.weui || {};
    window.weui.tab = tab;

})();

(function() {
    /**
 * 检查图片是否有被压扁，如果有，返回比率
 */
function detectVerticalSquash(img) {
    // 拍照在IOS7或以下的机型会出现照片被压扁的bug
    var data;
    var ih = img.naturalHeight;
    var canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = ih;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    try {
        data = ctx.getImageData(0, 0, 1, ih).data;
    } catch (err) {
        console.log('Cannot check verticalSquash: CORS?');
        return 1;
    }
    var sy = 0;
    var ey = ih;
    var py = ih;
    while (py > sy) {
        var alpha = data[(py - 1) * 4 + 3];
        if (alpha === 0) {
            ey = py;
        } else {
            sy = py;
        }
        py = (ey + sy) >> 1; // py = parseInt((ey + sy) / 2)
    }
    var ratio = (py / ih);
    return (ratio === 0) ? 1 : ratio;
}

/**
 * dataURI to blob, ref to https://gist.github.com/fupslot/5015897
 * @param dataURI
 */
function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: mimeString});
}

/**
 * 压缩图片
 */
function compress(file, options, callback) {
    var reader = new FileReader();
    reader.onload = function (evt) {
        if(options.compress === false){
            // 不启用压缩 & base64上传 的分支
            file.base64 = evt.target.result;
            callback(file);
            return;
        }

        // 启用压缩的分支
        var img = new Image();
        img.onload = function () {
            var ratio = detectVerticalSquash(img);
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');

            var maxW = options.compress.width;
            var maxH = options.compress.height;
            var w = img.width;
            var h = img.height;
            var dataURL;

            if(w < h && h > maxH){
                w = parseInt(maxH * img.width / img.height);
                h = maxH;
            }else if(w >= h && w > maxW){
                h = parseInt(maxW * img.height / img.width);
                w = maxW;
            }

            canvas.width = w;
            canvas.height = h;

            ctx.drawImage(img, 0, 0, w, h / ratio);

            if(/image\/jpeg/.test(file.type) || /image\/jpg/.test(file.type)){
                dataURL = canvas.toDataURL('image/jpeg', options.compress.quality);
            }else{
                dataURL =  canvas.toDataURL(file.type);
            }

            if(options.type == 'file'){
                if(/;base64,null/.test(dataURL) || /;base64,$/.test(dataURL)){
                    // 压缩出错，以文件方式上传的，采用原文件上传
                    console.warn('Compress fail, dataURL is ' + dataURL + '. Next will use origin file to upload.');
                    callback(file);
                }else{
                    var blob = dataURItoBlob(dataURL);
                    blob.id = file.id;
                    blob.name = file.name;
                    blob.lastModified = file.lastModified;
                    blob.lastModifiedDate = file.lastModifiedDate;
                    callback(blob);
                }
            }else{
                if(/;base64,null/.test(dataURL) || /;base64,$/.test(dataURL)){
                    // 压缩失败，以base64上传的，直接报错不上传
                    options.onError(file, new Error('Compress fail, dataURL is ' + dataURL + '.'));
                    callback();
                }else{
                    file.base64 = dataURL;
                    callback(file);
                }
            }
        };
        img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
}

    function upload(options) {
    var url = options.url;
    var file = options.file;
    var fileVal = options.fileVal;
    var onBeforeSend = options.onBeforeSend;
    var onProgress = options.onProgress;
    var onError = options.onError;
    var onSuccess = options.onSuccess;

    var name = file.name;
    var type = file.type;
    var lastModifiedDate = file.lastModifiedDate;;
    var data = {
        name: name,
        type: type,
        size: options.type == 'file' ? file.size : file.base64.length,
        lastModifiedDate: lastModifiedDate
    };
    var headers = {};

    if (onBeforeSend(file, data, headers) === false) return;

    file.status = 'progress';

    onProgress(file, 0);

    var formData = new FormData();
    var xhr = new XMLHttpRequest();

    file.xhr = xhr;

    // 设置参数
    Object.keys(data).forEach(function(key) {
        formData.append(key, data[key]);
    });
    if (options.type == 'file') {
        formData.append(fileVal, file, name);
    } else {
        formData.append(fileVal, file.base64);
    }

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                try {
                    // 只支持json
                    var ret = JSON.parse(xhr.responseText);
                    onSuccess(file, ret);
                } catch (err) {
                    onError(file, err);
                }
            } else {
                onError(file, new Error('XMLHttpRequest response status is ' + xhr.status));
            }
        }
    };
    xhr.upload.addEventListener('progress', function(evt) {
        if (evt.total == 0) return;

        var percent = Math.ceil(evt.loaded / evt.total) * 100;

        onProgress(file, percent);
    }, false);

    xhr.open('POST', url);

    // 设置头部信息
    Object.keys(headers).forEach(function(key) {
        xhr.setRequestHeader(key, headers[key]);
    });

    xhr.send(formData);
}


    var tplItem = '<li class="weui-uploader__file weui-uploader__file_status" data-id="<%= id %>"><div class="weui-uploader__file-content"><i class="weui-loading" style="width: 30px;height: 30px;"></i></div></li>';

    var _id = 0;



    /**
     * uploader 上传组件
     * @param {string} selector 上传组件的selector
     * @param {object} options 配置项
     * @param {string} [options.url] 上传的url，返回值需要使用json格式
     * @param {boolean} [options.auto=true] 设置为`true`后，不需要手动调用上传，有文件选择即开始上传。用this.upload()来上传，详情请看example
     * @param {string} [options.type=file] 上传类型, `file`为文件上传; `base64`为以base64上传
     * @param {string=} [options.fileVal=file] 文件上传域的name
     * @param {object=} [options.compress] 压缩配置, `false`则不压缩
     * @param {number=} [options.compress.width=1600] 图片的最大宽度
     * @param {number=} [options.compress.height=1600] 图片的最大高度
     * @param {number=} [options.compress.quality=.8] 压缩质量, 取值范围 0 ~ 1
     * @param {function=} [options.onBeforeQueued] 文件添加前的回调，return false则不添加
     * @param {function=} [options.onQueued] 文件添加成功的回调
     * @param {function=} [options.onBeforeSend] 文件上传前调用，具体参数看example
     * @param {function=} [options.onSuccess] 上传成功的回调
     * @param {function=} [options.onProgress] 上传进度的回调
     * @param {function=} [options.onError] 上传失败的回调
     *
     * @example
     * var uploadCount = 0;
     * weui.uploader('#uploader', {
     *    url: 'http://localhost:8081',
     *    auto: true,
     *    type: 'file',
     *    fileVal: 'fileVal',
     *    compress: {
     *        width: 1600,
     *        height: 1600,
     *        quality: .8
     *    },
     *    onBeforeQueued: function(files) {
     *        // `this` 是轮询到的文件, `files` 是所有文件
     *
     *        if(["image/jpg", "image/jpeg", "image/png", "image/gif"].indexOf(this.type) < 0){
     *            weui.alert('请上传图片');
     *            return false; // 阻止文件添加
     *        }
     *        if(this.size > 10 * 1024 * 1024){
     *            weui.alert('请上传不超过10M的图片');
     *            return false;
     *        }
     *        if (files.length > 5) { // 防止一下子选择过多文件
     *            weui.alert('最多只能上传5张图片，请重新选择');
     *            return false;
     *        }
     *        if (uploadCount + 1 > 5) {
     *            weui.alert('最多只能上传5张图片');
     *            return false;
     *        }
     *
     *        ++uploadCount;
     *
     *        // return true; // 阻止默认行为，不插入预览图的框架
     *    },
     *    onQueued: function(){
     *        console.log(this);
     *
     *        // console.log(this.status); // 文件的状态：'ready', 'progress', 'success', 'fail'
     *        // console.log(this.base64); // 如果是base64上传，file.base64可以获得文件的base64
     *
     *        // this.upload(); // 如果是手动上传，这里可以通过调用upload来实现；也可以用它来实现重传。
     *        // this.stop(); // 中断上传
     *
     *        // return true; // 阻止默认行为，不显示预览图的图像
     *    },
     *    onBeforeSend: function(data, headers){
     *        console.log(this, data, headers);
     *        // $.extend(data, { test: 1 }); // 可以扩展此对象来控制上传参数
     *        // $.extend(headers, { Origin: 'http://127.0.0.1' }); // 可以扩展此对象来控制上传头部
     *
     *        // return false; // 阻止文件上传
     *    },
     *    onProgress: function(procent){
     *        console.log(this, procent);
     *        // return true; // 阻止默认行为，不使用默认的进度显示
     *    },
     *    onSuccess: function (ret) {
     *        console.log(this, ret);
     *        // return true; // 阻止默认行为，不使用默认的成功态
     *    },
     *    onError: function(err){
     *        console.log(this, err);
     *        // return true; // 阻止默认行为，不使用默认的失败态
     *    }
     * });
     */
    function uploader(selector, options) {
        var $uploader = $(selector);
        var URL = window.URL || window.webkitURL || window.mozURL;

        // 找到DOM里file-content，若无，则插入一个。
        function findFileCtn($uploader, id) {
            var $file = $uploader.find('[data-id="' + id + '"]');
            var $fileCtn = $file.find('.weui-uploader__file-content');

            if (!$fileCtn.length) {
                $fileCtn = $('<div class="weui-uploader__file-content"></div>');
                $file.append($fileCtn);
            }
            $file.addClass('weui-uploader__file_status');
            return $fileCtn;
        }

        // 清除DOM里的上传状态
        function clearFileStatus($uploader, id) {
            var $file = $uploader.find('[data-id="' + id + '"]').removeClass('weui-uploader__file_status');
            $file.find('.weui-uploader__file-content').remove();
        }

        // 设置上传
        function setUploadFile(file) {
            file.url = URL.createObjectURL(file);
            file.status = 'ready';
            file.upload = function() {
                upload($.extend({
                    $uploader: $uploader,
                    file: file
                }, options));
            };
            file.stop = function(){
                this.xhr.abort();
            };

            options.onQueued(file);
            if (options.auto) file.upload();
        }

        options = $.extend({
            url: '',
            auto: true,
            type: 'file',
            fileVal: 'file',
            onBeforeQueued: $.noop,
            onQueued: $.noop,
            onBeforeSend: $.noop,
            onSuccess: $.noop,
            onProgress: $.noop,
            onError: $.noop
        }, options);

        if (options.compress !== false) {
            options.compress = $.extend({
                width: 1600,
                height: 1600,
                quality: .8
            }, options.compress);
        }

        if (options.onBeforeQueued) {
            var onBeforeQueued = options.onBeforeQueued;
            options.onBeforeQueued = function(file, files) {
                var ret = onBeforeQueued.call(file, files);
                if (ret === false) {
                    return false;
                }
                if (ret === true) {
                    return;
                }

                var $item = $($.render(tplItem, {
                    id: file.id
                }));
                $uploader.find('.weui-uploader__files').append($item);
            };
        }
        if (options.onQueued) {
            var onQueued = options.onQueued;
            options.onQueued = function(file) {
                if (!onQueued.call(file)) {
                    var $file = $uploader.find('[data-id="' + file.id + '"]');
                    $file.css({
                        backgroundImage: 'url("' + (file.base64 || file.url) + '")'
                    });
                    if (!options.auto) {
                        clearFileStatus($uploader, file.id);
                    }
                }
            };
        }
        if (options.onBeforeSend) {
            var onBeforeSend = options.onBeforeSend;
            options.onBeforeSend = function(file, data, headers) {
                var ret = onBeforeSend.call(file, data, headers);
                if (ret === false) {
                    return false;
                }
            };
        }
        if (options.onSuccess) {
            var onSuccess = options.onSuccess;
            options.onSuccess = function(file, ret) {
                file.status = 'success';
                if (!onSuccess.call(file, ret)) {
                    clearFileStatus($uploader, file.id);
                }
            };
        }
        if (options.onProgress) {
            var onProgress = options.onProgress;
            options.onProgress = function(file, percent) {
                if (!onProgress.call(file, percent)) {
                    findFileCtn($uploader, file.id).html(percent + '%');
                }
            };
        }
        if (options.onError) {
            var onError = options.onError;
            options.onError = function(file, err) {
                file.status = 'fail';
                if (!onError.call(file, err)) {
                    findFileCtn($uploader, file.id).html('<i class="weui-icon-warn"></i>');
                }
            };
        }

        $uploader.find('input[type="file"]').on('change', function(evt) {
            var files = evt.target.files;

            if (files.length === 0) {
                return;
            }

            if (options.compress === false && options.type == 'file') {
                // 以原文件方式上传
                Array.prototype.forEach.call(files, function(file) {
                    file.id = ++_id;

                    if (options.onBeforeQueued(file, files) === false) return;

                    setUploadFile(file);
                });
            } else {
                // base64上传 和 压缩上传
                Array.prototype.forEach.call(files, function(file) {
                    file.id = ++_id;

                    if (options.onBeforeQueued(file, files) === false) return;

                    compress(file, options, function(blob) {
                        if (blob) setUploadFile(blob);
                    });
                });
            }

            this.value = '';
        });
    }

    window.weui = window.weui || {};
    window.weui.uploader = uploader;

})();

(function() {
    var _toptips = null;
    var tpl = '<div class="weui-toptips weui-toptips_warn <%= className %>" style="display: block;"><%= content %></div>';

    /**
     * toptips 顶部报错提示
     * @param {string} content 报错的文字
     * @param {number|function|object=} options 多少毫秒后消失|消失后的回调|配置项
     * @param {number=} [options.duration=3000] 多少毫秒后消失
     * @param {function=} options.callback 消失后的回调
     *
     * @example
     * weui.topTips('请填写正确的字段');
     * weui.topTips('请填写正确的字段', 3000);
     * weui.topTips('请填写正确的字段', function(){ console.log('close') });
     * weui.topTips('请填写正确的字段', {
     *     duration: 3000,
     *     className: 'custom-classname',
     *     callback: function(){ console.log('close') }
     * });
     */
    function topTips(content, options) {
        options = options || {};
        if (typeof options === 'number') {
            options = {
                duration: options
            };
        }

        if (typeof options === 'function') {
            options = {
                callback: options
            };
        }

        options = $.extend({
            content: content,
            duration: 3000,
            callback: $.noop,
            className: ''
        }, options);

        var $topTips = $($.render(tpl, options));

        function _hide() {
            _hide = $.noop; // 防止二次调用导致报错

            $topTips.remove();
            options.callback();
            _toptips = null;
        }

        function hide() { _hide(); }

        $('body').append($topTips);
        if (_toptips) {
            clearTimeout(_toptips.timeout);
            _toptips.hide();
        }

        _toptips = {
            hide: hide
        };
        _toptips.timeout = setTimeout(hide, options.duration);

        $topTips[0].hide = hide;
        return $topTips[0];
    }

    window.weui = window.weui || {};
    window.weui.topTips = topTips;

})();
