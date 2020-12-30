const URL = 'addUrl.php'
const START_TYPES = ['autocomplete', 'manual', 'lasttags', 'populartags']
const MESSAGES = {
    'not_whitespace': 'Значение не должно включать пробелы',
    'more_length': 'Текст должен быть не более 550 символов',
    'not_sharp': 'Значение не должно включать символ #',
    'not_empty': 'Поле не должно быть пустым',
    'less_length': 'Длина текста должна быть не менее 5 символов',
    'post_added': 'Спасибо! Ваша запись успешно добавлена!'
}
const COMMENT_LENGTH = 550;
const CSS_PROPS = {

}
const CLICKED_ELS = ['#addbutton #fa-plus-outer', '#dismissfield>i']


const tags = a => {
    if ($('#' + a).innerHTML == 'undefined') {
        return $('#' + a).innerHTML
    }
    return ''
}
const tags_item = (a, b) => {
    return '<span class="' + a.slice(0, -1) + '" rel="' + b.tag + '"> #' + b.tag + '</span>'
}
const tags_sum = (a, b) => {
    return a + b;
}
const clicked_title = a => {
    $('body').find('.' + a.slice(0, -1)).on('click', function () {
        checkFromArray($(this).attr('rel'), 0, true);
        $('#more').attr('clicked', 'false');
    })
}

const use_data = (a, b) => {
    let start_tag = tags(a)
    JSON.parse(b).map(item => {
        start_tag = tags_sum(start_tag, tags_item(a, item))
    })
    $('#' + a).html(start_tag);
    clicked_title(a)
}
const autocomplete_data = (b,a) => {
    let autocomplete_arr = [];
    JSON.parse(a).map(item => {
        autocomplete_arr.push(item.tag)
    });
    $('#searchinput, #addInput1').keydown(function () {
        let attr_id = $(this).attr('id');
        autocomplete(document.getElementById(attr_id), autocomplete_arr)

    });
}
const manual_data = (b,a) => {    
    JSON.parse(a).map(item => {
        showContent(item)
    });
    $('body').find('.showurltitle').on('click', function () {
        let cur_tag = $(this).text().slice(1);
        checkFromArray(cur_tag, 0, true);

    })
}
const METHOD = {
    'lasttags' : use_data,
    'populartags' : use_data,
    'manual' : manual_data,
    'autocomplete' : autocomplete_data,
}
const choose_method = a=>{                                
    return METHOD[a]
}
const start = a => {
    $.ajax({
        method: 'POST',
        url: URL,
        data: { type: a },
        success: function (data) {            
         choose_method(a)(a,data)       
        }

    })
}

const clicks = (a) => {
    let b = document.querySelector(a)
    b.addEventListener('click', (a) => {
        changeCss(a.target.className)
    })
}
const changeTransform = (a,b,c)=>{
    $('#addField').css('transform', 'translateY(' + a + '%)').css('z-index', b);
    $('#addbutton>i').css('display', c);
}

const changeCss = a => {    
    if (a == 'fa fa-plus') {
        changeTransform(0,999999, 'none')        
        $('#showurlfield').html('')
    }
    if (a == 'fa fa-times') {
        changeTransform(200,0,'block')        
    }
    

}

const showErr = (a, b) => {
    let mess = MESSAGES['not_whitespace']
    if (a == 51) {
        mess = MESSAGES['not_sharp']
    }
    if (a == 1) {
        mess = MESSAGES['more_length']
        $('#rest').css('display', 'none')

    }
    document.getElementById('err' + b).innerHTML = mess
    document.getElementById('err' + b).style.display = 'block';
    return false
}
const showRestVal = a => {
    $('#rest').css('display', 'block')
    $('#rest').find('span').text(a)
    return $('#err3').css('display', 'none');
}
const getCode = e => {
    let theEvent = e || window.event;
    return theEvent.keyCode || theEvent.which;
}
const checkCommVal = a => {
    if (a !== '') {
        if (a.length > 4) {            
            $('#err3').css('display', 'none')
            return true
        }
    }
    let mess = (a == '') ? MESSAGES['not_empty'] : MESSAGES['less_length']
    $('#err3').html(mess).css('display', 'block')
    return false
}
const checkAddVal = function (a) {
    if (a == '') {
        $('#err1').html(MESSAGES['not_empty']).css('display', 'block')
    }
    return function (b) {        
        return (checkCommVal(b) && (a !== ''))
    }
}



const contentField = a => {
    let parsed_comment = applyLink(a['comment']);
    let date_field = '<div class="date_added">' + a['date'] + '</div>'
    let comment_field = `<div class="showcomment">` + ((a['comment'] !== undefined) ? parsed_comment : '') + `</div>`
    return '<h3 class="showurltitle">#' + a['tag'] + '</h3><div class="showurlcontent">' + comment_field + date_field + '</div>'

}