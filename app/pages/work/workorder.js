var query = $$.parseQueryString();
requiredWx();

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

    $('#detail-fm').form('load', data.data);
}

$(function() {
    $$.request('/action/ms/workorder/view', query, function(data) {
        if (data.errcode == 0) {
            loadDetailForm(data);
        }
    });
});



//     function loadDetail(query) {
//         if (!query.work_order_no) {
//             return false;
//         }
//         send('/action/ms/workorder/view', query, function(data) {
//             if (data.errcode == 0) {

//                 var images = data.images;
//                 $('#order-photo').find('.weui-cell__bd').each(function(index, item) {
//                     if (index < images.length) {
//                         var image = images[index];
//                         $(item).show().find('img').attr('src', image.localid);
//                     }
//                 });

//                 if (data.data.install_flag == '1') {
//                     data.data.install_flag = 'on';
//                 } else {
//                     data.data.install_flag = null;
//                 }

//                 data.data.proc_st_nm = formatField(procStData, data.data.proc_st);
//                 data.data.work_order_type = formatField(workOrderTypeData, data.data.work_order_type);
//                 data.data.work_flag = formatWorkFlag(data.data.work_flag);
//                 data.data.work_name = data.data.work_name || data.data.work_id;

//                 for (var i = 0; i < data.expense.length; i++) {
//                     data.data['expense_no' + data.expense[i].type] = data.expense[i].expense_no;
//                     data.data['money' + data.expense[i].type] = data.expense[i].money;
//                 }


//                 load('#detail-fm', data.data);
//                 $('#shop_name').text(data.data.shop_name);
//                 $('#term-busi-list').attr('href', 'term-busi-list.html?term_no=' + data.data.term_no);
//             }
//         });
//     }

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
