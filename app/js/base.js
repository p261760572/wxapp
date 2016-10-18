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

    $$.setData = function(keyName, data) {
        window.localStorage.setItem(window.location.pathname + ':' + keyName, JSON.stringify(data));
    };

    $$.getData = function(keyName) {
        var data = window.localStorage.getItem(window.location.pathname + ':' + keyName);
        return data && JSON.parse(data);
    };

    $$.removeData = function(keyName) {
        return window.localStorage.removeItem(window.location.pathname + ':' + keyName);
    };

    $$.load = function(data) {
        for (var id in data) {
            $('#' + id).text(data[id]);
        }
    };

    $$.submit = function(formId, success) {
        var fm = $('#' + formId);
        if (!fm.form('validate')) {
            return false;
        }

        var data = fm.serializeObject();
        var url = fm.attr('action');

        $$.request(url, data, function(data) {
            if (data.errcode == 0) {
                $.toast('show', {
                    iconCls: 'weui-icon-success-no-circle',
                    callback: function() {
                        if (success) {
                            success();
                        }
                    }
                });
            }
        });
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
                window.location.href = '/pages/login.html';
            } else if (data.errcode != 0) {
                if (data.errmsg) {
                    $.toast('show', data.errmsg);
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
            jsApiList: ['chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'getLocation', 'scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        }, data));

    });

    wx.ready(function() {
        //wx.hideOptionMenu();
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        wx.checkJsApi({
            jsApiList: ['scanQRCode', 'chooseImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
            success: function(res) {
                // 以键值对的形式返回，可用的api值true，不可用为false
                // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                var msg = '';
                if (!res.checkResult.scanQRCode) {
                    msg += '、微信扫一扫';
                }

                if (!res.checkResult.chooseImage) {
                    msg += '、拍照或从手机相册中选图';
                }

                if (msg) {
                    $.toast('show', '当前客户端不支持' + msg.substr(1));
                }
            }
        });
    });

    wx.error(function(res) {
        $.toast('show', JSON.stringify(res));
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    });
}


//封装微信JS-SDK
function wxChooseImage(sourceType, success) {
    wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: sourceType, // 可以指定来源是相册还是相机，默认二者都有 ['camera', 'album']
        success: function(res) {
            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            var localId = localIds[0];
            if (success) { success(localId); }
        }
    });
}

function wxLocation(success, error) {
    wx.getLocation({
        type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function(res) {
            var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            var speed = res.speed; // 速度，以米/每秒计
            var accuracy = res.accuracy || null; // 位置精度
            if (success) {
                success({
                    latitude: latitude,
                    longitude: longitude
                });
            }
        },
        fail: function(res) {
            if (error) { error(res); }
        }
    });
}

function wxUploadImage(localId, success, error) {
    wx.uploadImage({
        localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function(res) {
            var serverId = res.serverId; // 返回图片的服务器端ID
            if (success) { success(serverId); }
        },
        fail: function(res) {
            if (error) { error(res); }
        }
    });
}

function wxScanQRCode(scanType, success, error) {
    wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: scanType, // 可以指定扫二维码还是一维码，默认二者都有 ["barCode"]
        success: function(res) {
            var resultStr = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
            if (success) { success(resultStr); }
        },
        fail: function(res) {
            if (error) { error(res); }
        }
    });
}
