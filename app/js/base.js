
var baseJs = (function() {
    var $$;

    function wrapUrl(url) {
        return '/app' + url;
    }

    $$ = {};

    //POST请求
    $$.request = function(url, data, success, error, async) {
        error = error || $.noop;
        async = (async == false) ? false : true;
        $.ajax({
            url: wrapUrl(url),
            type: 'POST',
            async: async,
            contentType: 'application/json',
            dataType: 'json',
            data: $.toJSON(data),
            success: function(data) {
                if (data.errcode == 0) {
                    success(data)
                } else {
                    error(data);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
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


    return $$;
})();

window.$$ === undefined && (window.$$ = baseJs);
