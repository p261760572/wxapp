
function showActions(target, rows) {
    var apppay_id = $(target).attr('data-id');
    var proc_st = $(target).attr('data-st');
    var page = $(target).attr('data-url');

    var params = $.param({
        apppay_id: apppay_id
    });

    // var page = 'acq-busi.html';
    // if (apptype == '109') {
    //     page = 'dmf-busi.html';
    // }

    var actions = [{
        text: "查看",
        className: "actionsheet__cell_primary",
        onClick: function() {
            window.location.href = page + '?operateType=view&' + params;
        }
    }];

    if (proc_st == '3') {
        actions.push({
            text: "编辑",
            className: "actionsheet__cell_warning",
            onClick: function() {
                window.location.href = page + '?operateType=update&' + params;
            }
        });
    }

    $.actionsheet({
        actions: actions
    });
}


function searchBusi() {
    var processing = false;
    var data = $(this).serializeObject();
    $('#busi-list').html('');
    $('#busi-list').pagination({
        url: $$.wrapUrl('/action/ms/mchnt-busi/search'),
        pageNumber: 1,
        queryParams: data,
        onLoadSuccess: function(data) {
            processing = false;
            var html = template('busi-templ', data);
            $('#busi-list').append(html);
        },
        onLoadError: function() {
            processing = false;
        }
    })

    $('#infinite').infinite().on('infinite', function() {
        if (!processing) {
            processing = true;
            $('#busi-list').pagination('next');
        }
    });
}


$(function() {
    //业务查询
    $('#busi-searchbar').searchbar({
        onSearch: searchBusi
    });

    $('#busi-list').on('click', 'a.weui-cell', function() {        
        showActions(this);
    });


     $('#busi-searchbar').find('form.weui-search-bar__form').trigger('submit');
});