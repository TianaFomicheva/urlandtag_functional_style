const URL = 'addUrl.php'
const START_TYPES = ['autocomplete', 'manual', 'lasttags', 'populartags', 'personaltags']
const MESSAGES = {
    'not_whitespace': 'Значение не должно включать пробелы',
    'more_length': 'Текст должен быть не более 550 символов',
    'not_sharp': 'Значение не должно включать символ #',
    'not_empty': 'Поле не должно быть пустым',
    'less_length': 'Длина текста должна быть не менее 5 символов',
    'post_added': 'Спасибо! Ваша запись успешно добавлена!',
    'personal_tag': 'Тег является личным, вы не можете его использовать'
}
const COMMENT_LENGTH = 550;
const CLICKED_ELS = ['#addbutton #fa-plus-outer', '#dismissfield>i']
const keysMess = {
    51: MESSAGES['not_sharp'],
    1: MESSAGES['more_length'],
    2: MESSAGES['personal_tag']

}

const CLASSES = {
    'populartags': 'populartag',
    'lasttags': 'lasttag',
    'personaltags': 'personaltag',
    'manual': 'showurltitle',
}
const BACKSPACES = {
    8: true,
    46: true
}
const not_allowed = (e) => {
    return {
        32: true,
        51: (e ? true : false)

    }
}
const LAST_SIMBOL = {
    ' ': 'not_whitespace',
    '#': 'not_sharp'
}
const MIN_COMM_VAL = 5
const ADDFIELD_OPACITY = {
    'fa fa-plus': { 'transform': 0, 'z-index': 999999, 'display': 'none' },
    'fa fa-times': { 'transform': 200, 'z-index': 0, 'display': 'block' }
}


let dual_ring = a => {
    $('#more').css('display', 'none')
    return $('.lds-dual-ring').css('display', a)

}

const showContent = item => {
    $('#notfount').css('display', 'none');
    let prev_showurl = $('body').find('.showurlcontent').last();
    let content_field = contentField(item)
    return (prev_showurl.length == 0) ? $('#showurlfield').append(content_field) : prev_showurl.after(content_field)


}
const applyLink = a => {
    let comment_arr = a.split("http")
    let new_comment_arr = []
    comment_arr.map(item => {
        if (item.indexOf('://') == 0 || item.indexOf('://') == 1) {
            let words = item.split(" ");
            let url_word = words[0]
            item = item.replace(url_word, '<a href="http' + url_word + '" target= "_blank">http' + url_word.slice(0, 19) + '...</a>')
        }
        new_comment_arr.push(item)
    })
    return new_comment_arr.join(" ")
}

const success_show = data => {
    JSON.parse(data).forEach(item => {
        if (!item["start"]) {
            showContent(item);
        } else {
            if (item["start"] !== -1) {
                setTimeout(showMoreButton(item), 1500);
            }
        }

    })



}

const post_added = () => {
    $('#addField input, #addField textarea').each(function () {
        $(this).val('')
    })
    $('#rest').css('display', 'none');
    return $('#addFieldFooter>span').text(MESSAGES['post_added']);
}

const getVal = a => {
    return $('#' + a).val()
}
const makeCheckAttrs = (a, b, c) => {
    return { check: a, type: 'check', start: b, from_comment: c }
}
const makeAddAttrs = (a, b, c) => {
    return { tag: a, type: 'add', comment: b, image: c }
}


const change_opacity = (a) => {
    $('#addField').css('transform', 'translateY(' + ADDFIELD_OPACITY[a]['transform'] + '%)').css('z-index', ADDFIELD_OPACITY[a]['z-index']);
    return $('#addbutton>i').css('display', ADDFIELD_OPACITY[a]['display']);
}

const tags = a => {
    if ($('#' + a).innerHTML == 'undefined') {
        return $('#' + a).innerHTML
    }
    return ''
}
const tags_item = (a, b) => {
    return '<span class="' + a.slice(0, -1) + '" rel="' + b.tag + '">#' + b.tag + ' </span>'
}
const tags_sum = (a, b) => {
    return a + b;
}


const use_data = (a, b) => {
    let start_tag = tags(a)
    JSON.parse(b).map(item => {
        start_tag = tags_sum(start_tag, tags_item(a, item))
    })
    $('#' + a).html(start_tag);

}
const autocomplete_data = (b, a) => {
    let autocomplete_arr = [];
    JSON.parse(a).map(item => {
        autocomplete_arr.push(item.tag)
    });
    $('#searchinput, #addInput1').keydown(function () {
        let attr_id = $(this).attr('id');
        autocomplete(document.getElementById(attr_id), autocomplete_arr)

    });
}
const manual_data = (b, a) => {
    JSON.parse(a).map(item => {
        showContent(item)
    });


}
const METHOD = {
    'lasttags': use_data,
    'populartags': use_data,
    'personaltags': use_data,
    'manual': manual_data,
    'autocomplete': autocomplete_data,
}
const choose_method = a => {
    return METHOD[a]
}
const start = a => {
    $.ajax({
        method: 'POST',
        url: URL,
        data: { type: a },
        success: function (data) {
            choose_method(a)(a, data)

        },
        complete: function () {


            $('.' + CLASSES[a]).on('click', function (e) {

                firstcall()
                clickedTitle(e)
            })


        }
    })
}

const clicks = (a) => {
    let b = document.querySelector(a)
    b.addEventListener('click', (a) => {
        changeCss(a.target.className)
    })
}
const changeTransform = (a, b, c) => {
    $('#addField').css('transform', 'translateY(' + a + '%)').css('z-index', b);
    $('#addbutton>i').css('display', c);
}
const firstcall = () => { return $('#showurlfield').html('') }
const changeCss = a => {
    return change_opacity(a)
}


const check_slice_symbol = () => {
    $('#addInput1').on('keyup', function (e) {

        let adding_tag = getVal('addInput1')
        if (LAST_SIMBOL[adding_tag.slice(-1)]) {
            $('#err1').html(MESSAGES[LAST_SIMBOL[adding_tag.slice(-1)]]).css('display', 'block')
            $(this).val(adding_tag.slice(0, -1));

            return false
        }
    })
    return $('#err1').css('display', 'none')
}

const showErr = (a, b) => {

    let mess = keysMess[a] || MESSAGES['not_whitespace']
    $('#err' + b).html(mess).css('display', 'block')
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
const comment_err_mess = a => {
    return $('#err3').html(a)
}
const checkCommVal = a => {
    let valid = (checkCommValEmpty(a, MESSAGES['not_empty']) && checkCommValLength(a, MESSAGES['less_length']))
    $('#err3').css('display', (!valid ? 'block' : 'none'))
    return valid
}
const checkCommValEmpty = (a, b) => {
    comment_err_mess(b)
    return a > 0
}
const checkCommValLength = (a, b) => {
    comment_err_mess(b)
    return a >= MIN_COMM_VAL
}

const checkAddVal = function (a) {
    return function (b) {
        if (a == '') {
            $('#err1').html(MESSAGES['not_empty']).css('display', 'block')
        }
        return (checkCommVal(b.length) && (a !== ''))
    }
}



const contentField = a => {
    const src_link = (a['image_name'] !== '') ? 'uploads/img/' + a['image_name'] : false
    const img_block = (src_link) ? '<div class="content_img"><img src="' + src_link + '"/></div>' : ''
    const with_img_class = (src_link) ? ' with_img_class' : ''
    const parsed_comment = applyLink(a['comment']);
    const date_field = '<div class="date_added">' + a['date'] + '</div>'
    const comment_field = `<div class="showcomment">` + ((a['comment'] !== undefined) ? parsed_comment : '') + `</div>`
    const content_header = '<h3 class="showurltitle contenttitle">#' + a['tag'] + '</h3>'
    return content_header + ' <div class="showurlcontent"><div class="showurltext showurltext_mobile">' + comment_field + '</div>' + img_block + '<div class="showurltext showurltext_pc' + with_img_class + '">' + comment_field + date_field + '</div></div>'

}

const clickedTitle = (e) => {

    let cur_tag = e.target.innerText.slice(1)


    checkFromArray(cur_tag, 0);



}

const notfound = () => {
    if ($('body').find('.showurl').last().length == 0) {
        $('#notfound').css('display', 'block');
    }
}
const showMoreButton = a => {
    $('#more').css('display', 'block').attr('rel', a["common_tag"]).attr('start', a["start"])
}

const check_is_added_vals = () => {
    return (($('#addInput1').val().length > 0) || ($('#comment').val().length > 0))
}


const getTagCode = (a)=>{
    a.length>1 ? a[1] :''
}


const checkPersonal = (tag_body, tag_code)=>{
    return new Promise(rs=>rs($.ajax({
        url: URL,
        method: 'POST',
        data: { tag: tag_body, code: tag_code, type: 'check_personal' },
        success: function(data){
           return data
        }})))

    }

    
    const addFoto = (photo,tag_body, addInputValue3)=>{
        const formData = new FormData()
        formData.append('file', photo)
        return new Promise((resolve, reject)=>{
            $.ajax({
                url: 'upload.php',
                type: "POST",
                data: formData,
                async: false,
                success: function (msg) {
                    resolve($.ajax({
                        url: URL,
                        method: 'POST',
                        data: makeAddAttrs(tag_body, addInputValue3, msg),                        
                    }))                    
                },
                error: function () {
                    reject(alert('Ошибка!'))
                },
                cache: false,
                contentType: false,
                processData: false
            });
        })             
    }            
const addToArray = () => {
    const addInputValue3 = getVal('comment')
    const addInputValue1_arr = getVal('addInput1').split("@");
    const tag_code  = getTagCode(addInputValue1_arr)
    const tag_body = addInputValue1_arr[0];
    const photo = document.getElementById("image-file").files[0]; 
    checkPersonal(tag_body, tag_code)
    .then(    
        (data)=> {
            if (data !== 'OK') {
                showErr(2, 1)
            } else {
                let add_res = checkAddVal(tag_body)(addInputValue3)
                if (!add_res) {
                    return false
                }
                if (photo) {
                    addFoto(photo,tag_body, addInputValue3)
                    .then(post_added())        
                } else {
                    $.ajax({
                        url: URL,
                        method: 'POST',
                        data: makeAddAttrs(tag_body, addInputValue3, ''),
                        success: function () {
                            post_added()
                        }
                    })
                }

            }
        }
    )
}
const checkFromArray = (check_val, start_val) => {
    check_val = check_val || false
    start_val = start_val || 0
    let checkInputValue = (!check_val) ? getVal('searchinput') : check_val;
    let from_comment = (!check_val) ? 'yes' : 'no';
    if (!checkInputValue) {
        return false;
    }
    $.ajax({
        url: URL,
        method: 'POST',
        data: makeCheckAttrs(checkInputValue, start_val, from_comment),
        beforeSend: function () {
            dual_ring('block')
        },
        success: function (data) {
            if (data) {
                dual_ring('none')
            }
            (JSON.parse(data).length > 0) ? success_show(data) : notfound()
        },
        complete: function () {
        },
        complete: function () {
            $('.contenttitle').on('click', function (e) {
                firstcall()
                clickedTitle(e)
            })
        }
    });
}

