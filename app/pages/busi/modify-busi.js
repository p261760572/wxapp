
function showActions(target, rows) {
    var apppay_id = $(target).attr('data-id');
    var proc_st = $(target).attr('data-st');
    var page = $(target).attr('data-url').split(',');

    var params = $.param({
		key_id: 'apppay_id',
        apppay_id: apppay_id
    });

    var actions = [
        {
            text: "编辑业务参数",
            className: "actionsheet__cell_warning",
            onClick: function() {
                window.location.href = page[0] + '?table_name=mchnt_busi&' + params;
            }
        },
		{
            text: "编辑终端参数",
            className: "actionsheet__cell_warning",
            onClick: function() {
                window.location.href = page[1] + '?' + params;
            }
        },
		{
            text: "新增终端",
            className: "actionsheet__cell_warning",
            onClick: function() {
                window.location.href = page[2] + '?' + params;
            }
        }];

    $.actionsheet({
        actions: actions
    });
}


function searchBusi() {
    var processing = false;
    var data = $(this).serializeObject();
    $('#busi-list').html('');
    $('#busi-list').pagination({
        url: $$.wrapUrl('/action/ms/mchnt-busi/search-change'),
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