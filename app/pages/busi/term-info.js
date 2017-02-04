var query = $$.parseQueryString();
function showActions(target, rows) {
    var term_no = $(target).attr('data-id');
    var proc_st = $(target).attr('data-st');
    var page = $(target).attr('data-url');

    var params = $.param({
		key_id: 'term_no',
        term_no: term_no
    });

    // var page = 'acq-busi.html';
    // if (apptype == '109') {
    //     page = 'dmf-busi.html';
    // }
    window.location.href = page + '?table_name=term_info&' + params;
}


function searchTerm() {
    var processing = false;
    var data = query;
    $('#term-list').html('');
    $('#term-list').pagination({
        url: $$.wrapUrl('/action/ms/term-info/search-change'),
        pageNumber: 1,
        queryParams: data,
        onLoadSuccess: function(data) {
            processing = false;
            var html = template('term-templ', data);
            $('#term-list').append(html);
        },
        onLoadError: function() {
            processing = false;
        }
    })

    $('#infinite').infinite().on('infinite', function() {
        if (!processing) {
            processing = true;
            $('#term-list').pagination('next');
        }
    });
}

$(function() {
    //业务查询
    $('#term-searchbar').searchbar({
        onSearch: searchTerm
    });
    $('#term-list').on('click', 'a.weui-cell', function() {        
        showActions(this);
    });


     $('#term-searchbar').find('form.weui-search-bar__form').trigger('submit');
});