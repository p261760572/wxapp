
function parseOptions(opts) {
	var json_pairs = {};
	if(opts.length > 0) {
		var pairs = opts.split(',');
		for (var i = 0; i < pairs.length; i++) {
			var pair = pairs[i].split(':');
			if (pair.length < 2) {
				pair[1] = "";
			}
			json_pairs[$$.trim(decodeURIComponent(pair[0]))] = decodeURIComponent($$.trim(pair[1].replace(/\+/g, ' ')));
		}
	}
	return json_pairs;
}

function showActions(target, rows) {
    var changelog_id = $(target).attr('data-id');
    var page = $(target).attr('data-url').split(',');
	var opts = parseOptions($(target).attr('data-options'));
	var proc_st = $(target).attr('data-st');
	
	if(proc_st == '2') {
		$.toast('show', "记录处理中...");	
		return false;
	}
		
	var params = $.param({
		key_id: 'changelog_id',
        changelog_id: changelog_id
    });

    var actions = [
        {
            text: "重新编辑参数",
            className: "actionsheet__cell_warning",
            onClick: function() {
                window.location.href = page[0] + '?table_name='+opts.table_name+'&' + params;
            }
        }];

    $.actionsheet({
        actions: actions
    });
}


function searchChange() {
    var processing = false;
    var data = $(this).serializeObject();
    $('#change-list').html('');
    $('#change-list').pagination({
        url: $$.wrapUrl('/action/ms/changelog/search'),
        pageNumber: 1,
        queryParams: data,
        onLoadSuccess: function(data) {
            processing = false;
            var html = template('change-templ', data);
            $('#change-list').append(html);
        },
        onLoadError: function() {
            processing = false;
        }
    })

    $('#infinite').infinite().on('infinite', function() {
        if (!processing) {
            processing = true;
            $('#change-list').pagination('next');
        }
    });
}


$(function() {
    //业务查询
    $('#change-searchbar').searchbar({
        onSearch: searchChange
    });

    $('#change-list').on('click', 'a.weui-cell', function() {        
        showActions(this);
    });


    $('#change-searchbar').find('form.weui-search-bar__form').trigger('submit');
});