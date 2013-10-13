var validateDatagram = function (d) {
    return /^[ABCDEFabcdef0-9\s]+$/g.test(d)
}
var onDatagramChange = function (e) {
    var d = $('#datagram')
      , p = d.parent()
      , value = e.type === 'paste'? e.originalEvent.clipboardData.getData('Text'): d.val()
      , valid = true

    if (value) {
        valid = validateDatagram(value)
    }

    p[valid? 'removeClass': 'addClass']('has-error')
    d.data('valid', valid)
    if (value && valid) {
        setTimeout(function () {
            var v = value.toUpperCase()
            if (d.val() !== v) d.val()
        }, 0)
    }
}

$(function () {
    $('#datagram')
        .bind('paste', onDatagramChange)
        .change(onDatagramChange)
        .keyup(onDatagramChange)

    $('#datagramForm').submit(function (e) {
        var d = $('#datagram');

        if (!d.data('valid')) return e.preventDefault()
        d.val(d.val().replace(/[^ABCDEFabcdef0-9]/g, '').replace(/\s/g, '').toUpperCase() || '')
        if (!d.val()) return e.preventDefault()

        $('#datagramResult').fadeOut()

        $.get('/datagram?' + d.val(), function (data) {
            $('#datagramResultData').html(data);
            $('#datagramResult').fadeIn()
        });
        e.preventDefault()
    })

    $('.page-header button.close').click(function (e) {
        $(this).parent().fadeOut()
    })
})