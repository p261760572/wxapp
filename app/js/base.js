var baseJs = (function() {
    var $$;

    $$ = {};

    $$.wrapUrl = function(url) {
        return '/app' + url;
    }

    //POST请求
    $$.request = function(url, data, success, error, async) {
        error = error || $.noop;
        async = (async == false) ? false: true;
        $.toast('showLoading');
        $.ajax({
            url: $$.wrapUrl(url),
            type: 'POST',
            async: async,
            contentType: 'application/json',
            dataType: 'json',
            data: $.toJSON(data),
            success: function(data) {
                $.toast('hideLoading');
                if (data.errcode == 0) {
                    success(data)
                } else {
                    error(data);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $.toast('hideLoading');
                console.log(arguments);
            }
        });
    };


    //字符串去空白
    $$.trim = function(str) {
        return str.replace(/(^[\s]*)|([\s]*$)/g, '');
    };

    $$.ltrim = function(str) {
        return str.replace(/(^[\s]*)/g, '');
    };

    $$.rtrim = function(str) {
        return str.replace(/([\s]*$)/g, '');
    };


    //格式化日期
    $$.formatDate = function(date, format) {
        var o = {
            "M+": date.getMonth() + 1, //month
            "d+": date.getDate(), //day
            "h+": date.getHours(), //hour
            "m+": date.getMinutes(), //minute
            "s+": date.getSeconds(), //second
            "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
            "S": date.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(format))
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(format))
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        return format;
    };

    //解析日期
    $$.parseDate = function(format) {
        var date = new Date();
        var o = {
            "y+": 'setFullYear', //year
            "M+": 'setMonth', //month
            "d+": 'setDate', //day
            "h+": 'setHours', //hour
            "m+": 'setMinutes', //minute
            "s+": 'setSeconds', //second
            "S": 'setMilliseconds' //millisecond
        }

        for (var k in o)
            if (new RegExp("(" + k + ")").test(format))
                date[o[k]](RegExp.$1);
        return date;
    };


    $$.parseQueryString = function() {
        var query = {};
        var queryString = window.location.search.substr(1);
        if (queryString.length > 0) {
            var pairs = queryString.split('&');
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i].split('=');
                if (pair.length < 2) {
                    pair[1] = "";
                }
                query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1].replace(/\+/g, ' '));
            }
        }
        return query;
    };

    $$.setData = function (data) {
        window.localStorage.setItem(window.location.pathname, JSON.stringify(data));
    };


    $$.getData = function () {
        return JSON.parse(window.localStorage.getItem(window.location.pathname));  
    };

    return $$;
})();

window.$$ === undefined && (window.$$ = baseJs);


$(document).on('ajaxComplete', function(e, xhr, options) {
    if (xhr.status == 200) {
        var contentType = xhr.getResponseHeader('Content-Type');
        if (contentType && contentType.indexOf('application/json') >= 0) {
            var data = JSON.parse(xhr.responseText || '{}');
            if (data.errcode == 55) {
                // window.top.location.href = 'login.html';
                window.location.href = 'login.html';
            } else if (data.errcode != 0) {
                if (data.errmsg) {
                    $.toast('showPlain', data.errmsg);
                }
            }
        }
    }
});


function requiredWx() {
    $.get('/wx/get-jsapi-signature', {
        url: location.href
    }, function(data) {
        data = JSON.parse(data);
        
        wx.config($.extend({
            //debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            jsApiList: ['chooseImage','previewImage','uploadImage', 'downloadImage', 'getNetworkType', 'getLocation', 'scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        }, data));
        
    });
     
    wx.ready(function(){
        //wx.hideOptionMenu();
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        wx.checkJsApi({
            jsApiList: ['scanQRCode','chooseImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
            success: function(res) {
                // 以键值对的形式返回，可用的api值true，不可用为false
                // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                var msg = '';
                if(!res.checkResult.scanQRCode) {
                    msg += '、微信扫一扫';
                }
                
                if(!res.checkResult.chooseImage) {
                    msg += '、拍照或从手机相册中选图';
                }
                
                if(msg) {
                    $.toast('showPlain', '当前客户端不支持' + msg.substr(1));
                }
            }
        });
    });
    
    wx.error(function(res){
        $.toast('showPlain', JSON.stringify(res));
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    });
}