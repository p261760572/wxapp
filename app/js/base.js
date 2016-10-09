(function($) {

    $.fn.serializeObject = function() {
        var obj = {};
        $.each(this.serializeArray(), function(i, o) {
            var n = o.name,
                v = o.value;

            obj[n] = obj[n] === undefined ? v : $.isArray(obj[n]) ? obj[n].concat(v) : [obj[n], v];
        });

        return obj;
    };

})($);

function validate(target) {
	
    var result = true;
   	
   	$(target).find('input').each(function(index, item) {
   		if(item.checkValidity() == false) {
   			result = false;
   			return false;
   		}
   	});
    
    return result;
}

$(document).on('ajaxComplete', function(e, xhr, options){
	if (xhr.status == 200) {
		var contentType = xhr.getResponseHeader('Content-Type');
		if(contentType && contentType.indexOf('application/json') >= 0) {
		    var data = JSON.parse(xhr.responseText || '{}');
		    if (data.errcode == 55) {
		        window.top.location.href = 'login.html';
		        //window.location.href = 'login.html';
		    } else if (data.errcode != 0) {
		        if (data.errmsg) {
		            alert(data.errmsg);
		        }
		    }
		}
	}
})

function send(url, data, success, error) {
	$.ajax({
		type: 'POST',
		url: '/app' + url,
		async: true,
		contentType: 'application/json',
		dataType: 'json',
		data: JSON.stringify(data),
		success: success,
		error: error
	});
}

function parseQueryString() {
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
}


function load(target, data) {
    
    var form = $(target);
    for (var name in data) {
        var val = data[name];
        if (!_checkField(name, val)) {
            form.find('input[name="' + name + '"]').val(val);
            form.find('textarea[name="' + name + '"]').val(val);
            form.find('select[name="' + name + '"]').val(val);
        }
    }

    function _checkField(name, val) {
        var cc = $(target).find('input[name="' + name + '"][type=radio], input[name="' + name + '"][type=checkbox]');
        if (cc.length) {
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

//格式化字段
function formatField(rows, value, valueField, textField) {
    var i, len;
    valueField = valueField || 'value';
    textField = textField || 'text';
    if (rows) {
        len = rows.length;
        for (i = 0; i < len; i++) {
            if (rows[i][valueField] == value) {
                return rows[i][textField];
            }
        }
    }
    return null;
}

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
		        	alert('当前客户端不支持' + msg.substr(1));
		        }
		    }
		});
	});
	
	wx.error(function(res){
		alert(JSON.stringify(res));
		// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
	});
}