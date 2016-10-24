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


function searchWorkorder() {
    var processing = false;
    var data = $(this).serializeObject();
    $('#workorder-list').html('');
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
    //查询
    $('#workorder-searchbar').searchbar({
        onSearch: searchWorkorder
    });

    $('#workorder-list').on('click', 'a.weui-cell', function() {
        showActions(this);
    });


    $('#workorder-searchbar').find('form.weui-search-bar__form').trigger('submit');
});
