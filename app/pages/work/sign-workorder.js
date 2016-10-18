//     function onClickScanQRCode(id) {
//         wx.scanQRCode({
//             needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
//             scanType: ["barCode"], // 可以指定扫二维码还是一维码，默认二者都有
//             success: function(res) {
//                 var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
//                 var index = result.indexOf(",");
//                 if (index >= 0) {
//                     result = result.substr(index + 1);
//                 }
//                 $('#' + id).val(result);
//             },
//             fail: function(res) {
//                 alert(JSON.stringify(res));
//             }
//         });
//     }

var query = $$.parseQueryString();
requiredWx();


function serializeDetailForm() {
    var data = $('#detail-fm').serializeObject();

    //照片处理
    var images = [];
    $('#detail-fm').find('.weui-uploader__files').each(function(i, element) {
        var type = $(element).attr('id');
        var container = $(element).children('.weui-uploader__file').each(function(i, element) {
            var fileData = $(element).data('file');
            images.push($.extend(fileData, {
                'ei_type': type
            }));
        });
    });

    data.images = images;

    return data;
}

function loadDetailForm(data) {
    //图片
    $('#detail-fm').find('.weui-uploader__files').each(function(i, element) {
        $(element).html('');
    });

    var images = data.images;
    $.each(images, function(index, item) {
        var file = $(template('uploader-file-templ', item)).data('file', item);
        $('#' + item.ei_type).append(file);
    });

    data.data.work_flag = formatWorkFlag(data.data.work_flag);
    data.data.work_name = data.data.work_name || data.data.work_id;

    for (var i = 0; i < data.expense.length; i++) {
        data.data['expense_no' + data.expense[i].type] = data.expense[i].expense_no;
        data.data['money' + data.expense[i].type] = data.expense[i].money;
    }

    $('#detail-fm').form('load', data.data);

    $('#shop_name').text(data.data.shop_name);
    $('#term-busi-list').attr('href', 'term-busi-list.html?term_no=' + data.data.term_no);
}

function formatWorkFlag(value) {
    var flag = ['装机', '调单', '移机', '培训', '其它', '换机'];
    var work_flag = [],
        i;

    for (i = 0; i < value.length; i++) {
        if (value.charAt(i) == '1') {
            work_flag.push(flag[i]);
        }
    }

    return work_flag.join(',');
}


function uploadImage(sourceType, files) {
    var data = {};
    wxChooseImage(sourceType, function(localId) {
        data.localid = localId;
        $.toast('showLoading', {
            msg: '获取地理位置'
        });
        wxLocation(function(res) {
            $.toast('hideLoading');
            $.extend(data, res);
            wxUploadImage(localId, function(serverId) {
                data.serverid = serverId;
                data.app_created_time = $$.formatDate(new Date(), 'yyyyMMddhhmmss');
                //生成html,存储
                $(template('uploader-file-templ', data)).appendTo(files).data('file', data);
            }, function(res) {
                $.toast('show', '上传失败,请重新上传' + JSON.stringify(res));
            });
        }, function(res) {
            $.toast('show', '获取地理位置失败,请重新上传' + JSON.stringify(res));
        });
    });
}

function submitDetail() {
    if (!$('#detail-fm').form('validate')) {
        return false;
    }

    var data = serializeDetailForm();

    var url = '/action/ms/workorder/' + query.operateType;

    $$.request(url, data, function(data) {
        if (data.errcode == 0) {
            $$.removeData('detail');
            $.toast('show', {
                iconCls: 'weui-icon-success-no-circle',
                callback: function() {
                    history.back();
                }
            });
        }
    });
}

$(function() {
    //验证
    $('.validate').validate({
        // required: true
    });

    //上传照片
    $('#detail-fm').on('click', '.weui-uploader__input', function() {
        var files = $(this).closest('.weui-uploader').find('.weui-uploader__files');
        uploadImage(['camera', 'album'], files);
    }).on('click', '.weui-uploader__file', function(argument) {
        var target = this;
        var data = $(target).data('file');
        $.gallery({
            deletable: query.operateType == 'view' ? false : true,
            imageUrl: data.file_url || data.localid,
            onDelete: function() {
                target.remove();
            }
        });
    });

    $$.request('/action/ms/workorder/view', query, function(data) {
        if (data.errcode == 0) {
            loadDetailForm(data);
        }
    });
});
