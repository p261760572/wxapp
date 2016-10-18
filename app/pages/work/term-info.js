//             data.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
//             data.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
//             //var speed = res.speed; // 速度，以米/每秒计
//             data.radius = res.accuracy || null; // 位置精度

var query = $$.parseQueryString();
requiredWx();


function scanDeviceNo(id) {
    wxScanQRCode(['barCode'], function(resultStr) {
        var index = resultStr.indexOf(",");
        if (index >= 0) {
            resultStr = resultStr.substr(index + 1);
        }
        $('#' + id).val(resultStr);
    });
}

function serializeDetailForm() {
    var data = $('#detail-fm').serializeObject();

    //照片处理
    // var images = [];
    // $('#detail-fm').find('.weui-uploader__files').each(function(i, element) {
    //     var type = $(element).attr('id');
    //     var container = $(element).children('.weui-uploader__file').each(function(i, element) {
    //         var fileData = $(element).data('file');
    //         images.push($.extend(fileData, {
    //             'ei_type': type
    //         }));
    //     });
    // });

    // data.images = images;

    return data;
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

function loadDetailForm(data) {
    //图片
    // $('#detail-fm').find('.weui-uploader__files').each(function(i, element) {
    //     $(element).html('');
    // });

    // var images = data.images;
    // $.each(images, function(index, item) {
    //     var file = $(template('uploader-file-templ', item)).data('file', item);
    //     $('#' + item.ei_type).append(file);
    // });

    // data.data.work_flag = formatWorkFlag(data.data.work_flag);
    // data.data.work_name = data.data.work_name || data.data.work_id;

    // for (var i = 0; i < data.expense.length; i++) {
    //     data.data['expense_no' + data.expense[i].type] = data.expense[i].expense_no;
    //     data.data['money' + data.expense[i].type] = data.expense[i].money;
    // }

    $('#detail-fm').form('load', data.data);

    // $('#shop_name').text(data.data.shop_name);
    // $('#term-busi-list').attr('href', 'term-busi-list.html?term_no=' + data.data.term_no);
}

// function uploadImage(sourceType, files) {
//     var data = {};
//     wxChooseImage(sourceType, function(localId) {
//         data.localid = localId;
//         $.toast('showLoading', {
//             msg: '获取地理位置'
//         });
//         wxLocation(function(res) {
//             $.toast('hideLoading');
//             $.extend(data, res);
//             wxUploadImage(localId, function(serverId) {
//                 data.serverid = serverId;
//                 data.app_created_time = $$.formatDate(new Date(), 'yyyyMMddhhmmss');
//                 //生成html,存储
//                 $(template('uploader-file-templ', data)).appendTo(files).data('file', data);
//             }, function(res) {
//                 $.toast('show', '上传失败,请重新上传' + JSON.stringify(res));
//             });
//         }, function(res) {
//             $.toast('show', '获取地理位置失败,请重新上传' + JSON.stringify(res));
//         });
//     });
// }

function submitDetail() {
    if (!$('#detail-fm').form('validate')) {
        return false;
    }

    $.toast('showLoading', {
        msg: '获取地理位置'
    });
    wxLocation(function() {
        $.toast('hideLoading');
        var data = serializeDetailForm();
        var url = '/action/ms/term-info/update-base';

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
    }, function(res) {
        $.toast('show', '获取地理位置失败,请重试' + JSON.stringify(res));
    });
}

$(function() {
    //验证
    $('.validate').validate({
        // required: true
    });

    //上传照片
    // $('#detail-fm').on('click', '.weui-uploader__input', function() {
    //     var files = $(this).closest('.weui-uploader').find('.weui-uploader__files');
    //     uploadImage(['camera', 'album'], files);
    // }).on('click', '.weui-uploader__file', function(argument) {
    //     var target = this;
    //     var data = $(target).data('file');
    //     $.gallery({
    //         deletable: query.operateType == 'view' ? false : true,
    //         imageUrl: data.file_url || data.localid,
    //         onDelete: function() {
    //             target.remove();
    //         }
    //     });
    // });

    $$.request('/action/ms/term-info/view-base', query, function(data) {
        if (data.errcode == 0) {
            loadDetailForm(data);
        }
    });
});
