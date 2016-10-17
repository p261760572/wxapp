// var procStData = [{
//     "text": "待提交",
//     "value": "1"
// }, {
//     "text": "待回访",
//     "value": "2"
// }, {
//     "text": "已完成",
//     "value": "3"
// }, {
//     "text": "已作废",
//     "value": "4"
// }];

// var workOrderTypeData = [{
//     "text": "装机单",
//     "value": "1"
// }, {
//     "text": "维护单",
//     "value": "2"
// }, {
//     "text": "巡检单",
//     "value": "3"
// }];

// var query = {
//     page: 1,
//     rows: 10
// };
// var loading = false; //状态标记

// template.helper('formatWorkOrderType', function(work_order_type) {
//     return formatField(workOrderTypeData, work_order_type);
// });

// template.helper('formatProcSt', function(proc_st) {
//     return formatField(procStData, proc_st);
// });

// $(function() {
//     // $('#search-fm').submit(submitSearch).submit();
//     $('#search_bar').searchbar({
//         onSearch: function () {
//             // body...
//         }
//     });
// });

function showActions(target) {
    var work_order_no = $(target).attr('data-id');
    var term_no = $(target).attr('data-tn');
    var proc_st = $(target).attr('data-st');
    var params = $.param({
        work_order_no: work_order_no,
        term_no: term_no
    });

    var actions = [{
        text: "查看",
        className: "actionsheet__cell_primary",
        onClick: function() {
            window.location.href = 'work/workorder.html?operateType=view&' + params;
        }
    }];

    if (proc_st == '1') {
        actions.push({
            text: "提交",
            className: "actionsheet__cell_warning",
            onClick: function() {
                window.location.href = 'work/sign-workorder.html?operateType=sign&' + params;
            }
        });

        actions.push({
            text: "信息维护",
            className: "actionsheet__cell_primary",
            onClick: function() {
                window.location.href = 'work/term-info.html?' + params;
            }
        });

        actions.push({
            text: "绑定设备",
            className: "actionsheet__cell_warning",
            onClick: function() {
                window.location.href = 'work/bind-device.html?' + params;
            }
        });
    }

    $.actionsheet({
        actions: actions
    });
}

// function search() {
//     var data = $(this).serializeObject();
//     $.extend(query, data);
//     query.page = 1;
//     searchWorkorder();
// }



// pager.pagination({
//     pageNumber: opts.pageNumber,
//     pageSize: opts.pageSize,
//     pageList: opts.pageList,
//     onSelectPage: function(pageNum, pageSize) {
//         // 保存分页状态
//         opts.pageNumber = pageNum;
//         opts.pageSize = pageSize;

//         request(target); // 请求远程数据
//     }
// });

// function searchWorkorder() {
//     //alert(JSON.stringify(query));
//     if (query.page == 1) {
//         $('#infinite').show();
//         $('#tab-workorder').infinite(1).on("infinite", function() {
//             if (loading) return;
//             loading = true;
//             query.page++;
//             searchWorkorder();
//         });
//     }
//     send('/action/ms/workorder/search', query, function(data) {
//         if (data.errcode == 0) {
//             var html = template('list-templ', data);
//             if (query.page == 1) {
//                 $('#order-list').html(html);
//             } else {
//                 $('#order-list').append(html);
//             }
//             $('a.weui-cell').off('click').on('click', function() {
//                 showActions(this);
//             });

//             loading = false;

//             if (data.rows.length < query.rows) {
//                 $('#tab-workorder').destroyInfinite();
//                 $('#infinite').hide();
//             }
//         }
//     });
// }



// function showActions(target) {
//     var apppay_id = $(target).attr('data-id');
//     var proc_st = $(target).attr('data-st');
//     var apptype = $(target).attr('data-tp');

//     var params = $.param({
//         apppay_id: apppay_id
//     });

//     var page = 'acq-busi.html';
//     if (apptype == '109') {
//         page = 'dmf-busi.html';
//     }

//     var actions = [{
//         text: "查看",
//         className: "actionsheet__cell_primary",
//         onClick: function() {
//             window.location.href = page + '?operateType=view&' + params;
//         }
//     }];

//     if (proc_st == '3') {
//         actions.push({
//             text: "编辑",
//             className: "actionsheet__cell_warning",
//             onClick: function() {
//                 window.location.href = page + '?operateType=update&' + params;
//             }
//         });
//     }

//     $.actionsheet({
//         actions: actions
//     });
// }


function searchWorkorder() {
    var processing = false;
    var data = $(this).serializeObject();
    $('#workorder-list').html('');
    console.log($('#workorder-list'));
    $('#workorder-list').pagination({
        url: $$.wrapUrl('/action/ms/workorder/search'),
        pageNumber: 1,
        queryParams: data,
        onLoadSuccess: function(data) {
            processing = false;
            var html = template('workorder-templ', data);
            $('#workorder-list').append(html);
        },
        onLoadError: function() {
            processing = false;
        }
    })

    $('#infinite').infinite().on('infinite', function() {
        if (!processing) {
            processing = true;
            $('#workorder-list').pagination('next');
        }
    });
}


$(function() {
    //业务查询
    $('#workorder-searchbar').searchbar({
        onSearch: searchWorkorder
    });

    $('#workorder-list').on('click', 'a.weui-cell', function() {        
        showActions(this);
    });


     $('#workorder-searchbar').find('form.weui-search-bar__form').trigger('submit');
});