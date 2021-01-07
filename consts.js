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
const CLICKED_ELS = ['#addbutton #fa-plus-outer', '#dismissfield>i']
const keysMess = {
    51: MESSAGES['not_sharp'],
    1:  MESSAGES['more_length']
}
const BACKSPACES = {
    8: true,
    46:  true
}
const not_allowed =  (e)=> {
    return {
    32 : true,
    51: (e ? true : false)

}
}
const MIN_COMM_VAL = 5
const ADDFIELD_OPACITY = {
    'fa fa-plus': { 'transform': 0, 'z-index' : 999999, 'display': 'none'},
     'fa fa-times': { 'transform': 200, 'z-index' : 0, 'display': 'block'}
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
    clickedTitle()
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

    clickedTitle()
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
const firstcall = ()=>{return $('#showurlfield').html('')}
const changeCss = a => {           
    return change_opacity(a)    
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
const comment_err_mess = a =>{
    return $('#err3').html(a)
}
const checkCommVal = a => {
    let valid =  (checkCommValEmpty(a, MESSAGES['not_empty']) && checkCommValLength(a, MESSAGES['less_length']))
    $('#err3').css('display', (!valid ? 'block' : 'none'))
    return valid
}
const checkCommValEmpty = (a,b) =>{
    comment_err_mess(b)
    return a > 0
}
const checkCommValLength = (a,b) =>{
    comment_err_mess(b)
   return a>= MIN_COMM_VAL
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
    let parsed_comment = applyLink(a['comment']);
    let date_field = '<div class="date_added">' + a['date'] + '</div>'
    let comment_field = `<div class="showcomment">` + ((a['comment'] !== undefined) ? parsed_comment : '') + `</div>`
    return '<h3 class="showurltitle contenttitle">#' + a['tag'] + '</h3><div class="showurlcontent">' + comment_field + date_field + '</div>'

}

const clickedTitle = (e)=>{
    $('.showurltitle.contenttitle, .populartag, .lasttag').on('click', function (e) {
        firstcall()                        
        let cur_tag = e.target.innerText.slice(1)
        console.log(cur_tag)
        
        checkFromArray(cur_tag, 0);
    })
}

const notfound = ()=> {
    if ($('body').find('.showurl').last().length == 0) {
        $('#notfound').css('display', 'block');
    }
}
const showMoreButton = a => {
    $('#more').css('display', 'block').attr('rel', a["common_tag"]).attr('start', a["start"])                           
}

const check_is_added_vals = ()=>{
    return (($('#addInput1').val().length > 0) || ($('#comment').val().length > 0))
}

const not_allowed_keys  = (a, e)=>{
 return 
}

