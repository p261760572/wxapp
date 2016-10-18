var query = $$.parseQueryString();

$(function() {
    $$.request('/action/ms/term-info/list-busi', query, function(data) {
        if (data.errcode == 0) {
            var html = template('busi-templ', data);
            $('#busi-list').html(html);
            $('#busi-list div.qrcode').each(function(index, element) {
                var qrcode = new QRCode(element, {
                    width: 200,
                    height: 200,
                    correctLevel: QRCode.CorrectLevel.H
                });
                qrcode.makeCode($(element).attr('data-qrcode'));
            });
        }
    });
});
