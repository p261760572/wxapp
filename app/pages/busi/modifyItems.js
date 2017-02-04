var query = $$.parseQueryString();
var row = {};
var ItemAttr = [];
var photocopy = [
	{
		value:'01',
		text: '营业执照照片'
	},{
		value:'03',
		text: '法人身份证照片'
	},{
		value:'16',
		text: '结算账户(银行卡)照片'
	},{
		value:'02',
		text: '税务登记证照片'
	},{
		value:'06',
		text: '商户协议(v1)'
	},{
		value:'04',
		text: '门店照片'
	},{
		value:'13',
		text: '账号授权书'
	},{
		value:'17',
		text: '其他照片'
	}
];

requiredWx();
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

function getObjIndex(object,value) {
	if(object == "field_attr")
		var arr = ItemAttr;
	else if(object == "photocopy")
		var arr = photocopy;
	for(var i=0; i<arr.length; i++) {
		if(arr[i].value == value) {
			return arr[i];
		}	
	}
	return null;
}
var para;
function searchBar(data) {
    var processing = false;
	data.search_name = $('input[name="search_name"]').val() ? $('input[name="search_name"]').val():'';
    $('#list').html('');
    $('#list').pagination({
        url: $$.wrapUrl('/action/ms/parameter/list'),
        pageNumber: 1,
        queryParams: data,
        onLoadSuccess: function(data) {
            processing = false;
            var html = template('templ', data);
            $('#list').append(html);
        },
        onLoadError: function() {
            processing = false;
        }
    })

    $('#infinite').infinite().on('infinite', function() {
        if (!processing) {
            processing = true;
            $('#list').pagination('next');
        }
    });
}

function searchopts() {
	searchBar(para);
}

function EditItem(value, selected, src_data, edit_data) {
	var target = selected || this;
	var options = parseOptions($(target).attr('data-options'));
	$(options.view).parents('.weui-cell').first().removeClass('hide-more');
	$(options.edit).parents('.weui-cell').first().removeClass('hide-more');
	$(options.view).val(src_data || row[value]);
	$(options.edit).removeAttr('onclick').val(edit_data || row[value]);
	var v_item = getObjIndex("field_attr", value);
	var data = {};
	data[value] = '1';
	para = data;
	if(v_item.class == '2') {	// 下拉选项
		searchBar(data);
		$(options.edit).attr('onclick',"$('#popup').popup('open')");
		$('#searchbar').searchbar({
			onSearch: searchopts
		});
		$('#list').on('click', '.weui-cell', function() {
			$(options.edit).val($(this).attr('data-text'));
			$('#popup').popup('close');
		});
	}
}

function uploadImage(sourceType, file) {
    var data = {};
    wxChooseImage(sourceType, function(localId) {
        data.localid = localId;
        wxUploadImage(localId, function(serverId) {
            data.is_new = '1';
            data.serverid = serverId;
            data.app_created_time = $$.formatDate(new Date(), 'yyyyMMddhhmmss');
            //生成html,存储
            $(file).removeClass('hide-more').attr('style', 'background-image:url('+localId+')').data('file', data);
        }, function(res) {
            $.toast('show', '上传失败,请重新上传' + JSON.stringify(res));
        });
    });
}

function loadFormDetail(data) {
	var images = data.images;
	
    $.each(images, function(index, item) {
		var photocopy_item = getObjIndex("photocopy", item.ei_type);
		var target = $('#detail-fm').find('.weui-uploader__file')[index];
		var url = item.file_url?item.file_url:item.localid;
		$(target).removeClass('hide-more').attr('style', 'background-image:url('+url+')').data('file', item);
		$(target).closest('.weui-uploader').find('input[name="photocopy-id"]').val(photocopy_item.text).attr('data-values',item.ei_type);
    });
	
    var updated = data.update;
    $.each(updated, function(index, item) {
		var field_item = getObjIndex("field_attr", item.value);
		var target = $('#detail-fm').find('input[name="fielditem"]')[index];
        $(target).val(field_item.text).attr('data-values',item.value);
		EditItem(field_item.value, target, item.src, item.edit);
	});
}

function submitDetail() {
	var data = {}, updated = [];
    $('input[name="fielditem"]').each(function(i, element) {
		var modify_item = {};
		var options = parseOptions($(element).attr('data-options'));
		if($(element).val() != '') {
			var field_attr = getObjIndex("field_attr",$(element).attr('data-values'));
			updated.push($.extend({},{
							'field_id': field_attr.field_id,
							'src'	: $(options.view).val(),
							'update': $(element).val() == "license_no"?$(options.edit).val().toUpperCase():$(options.edit).val()}));
		}
		data.update = updated;
	});
	
	if(query.table_name == "mchnt_busi") {
		//照片处理
		var images = [];
		$('#detail-fm').find('input[name="photocopy-id"]').each(function(i, element) {
			var type = $(element).attr('data-values');
			if(type && type != '') {
				$(element).parent().next().find('.weui-uploader__file').each(function(i, element) {
					var fileData = $(element).data('file');
					images.push($.extend(fileData, {
						'ei_type': type
					}));
				})
			}
		});
	
		data.images = images;
	}
	data[query.key_id] = query[query.key_id];
	
    var url = query.key_id=='changelog_id'?'/action/ms/changelog/update':(query.table_name =='mchnt_busi' ? '/action/ms/changelog/create-busi':'/action/ms/changelog/create-term');

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
    //初始化
	if(query.table_name == 'mchnt_busi') {
		$('#busi-picture').removeClass('hide-more');	
	}
	$('input[name="photocopy-id"]').select({
		title: '影印件类型',
		items: photocopy
	});
	
	//业务查询
	var Objfield = {
		value : '',
		text : '',
		clone: function () { return { value: this.value, text: this.text } }
	};
	
	var field = [];
    $$.request('/action/ms/parameter/list', {
        fielditem: '1',
		selected: '1',
		table_name: query.table_name
    }, function(data) {
        if (data.errcode == 0) {
			ItemAttr = data.rows;
			for(var i=0; i<data.rows.length; i++) {
				Objfield.value = data.rows[i].value;
				Objfield.text = data.rows[i].text;
				field.push(Objfield.clone());
			}
            $('.weui-cell__bd input[name="fielditem"]').select({
                title: '编辑项',
                items: field,
				onChange: EditItem
            });
        }
    });
	
	var url = query.changelog_id?'/action/ms/changelog/view':(query.table_name && query.table_name =='mchnt_busi' ? 
				'/action/ms/mchnt-busi/view-change':'/action/ms/term-info/view-change');
	$$.request(url, query, function(data){
		if (data.errcode == 0) {
			row = data.data;
			if(query.changelog_id) {
				$('input[name="fielditem"]').attr('disabled', true);
				$('input[name="photocopy-id"]').attr('disabled', true);
				loadFormDetail(data);
			}
		}
	});
    
	
	$('#detail-fm').on('click', '.weui-uploader__input', function() {
        var file = $(this).closest('.weui-uploader').find('.weui-uploader__file');
        uploadImage(['camera', 'album'], file);
    }).on('click', '.weui-uploader__file', function(argument) {
        var target = this;
        var data = $(target).data('file');
        $.gallery({
            deletable: true,
            imageUrl: data.file_url || data.localid,
            onDelete: function() {
                target.remove();
            }
        });
    });
});