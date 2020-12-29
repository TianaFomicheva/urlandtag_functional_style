const URL = 'addUrl.php'
const TYPES = {'CHECK':'check', 'ADD': 'add', 'AUTOCOMPLETE': 'autocomplete', 'MANUAL': 'manual', 'LASTTAGS' :'lasttags', 'POPULARTAGS':'populartags'}
const MESSAGES = {
    'not_whitespace': 'Значение не должно включать пробелы',
    'less_length' : 'Текст должен быть не более 550 символов',
    'not_sharp': 'Значение не должно включать символ #'
}
const COMMENT_LENGTH = 550;
const CSS_PROPS = {
    
}
const CLICKED_ELS = ['#addbutton #fa-plus-outer', '#dismissfield>i']
const tags  = a =>{
    if($('#'+a).innerHTML == 'undefined') {
        return $('#'+a).innerHTML
    }
     return ''
}
const tags_item = (a,b) =>{
   return  '<span class="' + a.slice(0,-1) + '" rel="' + b.tag + '"> #' + b.tag + '</span>'
}
const tags_sum = (a,b) => {
    return a + b; 
}
const clicked_title = a =>{
    $('body').find('.'+ a.slice(0,-1)).on('click', function () {
                    checkFromArray($(this).attr('rel'), 0, true);
                    $('#more').attr('clicked', 'false');
})
}

const start = a =>{
    $.ajax({
        method: 'POST',
        url: URL,
        data: {type: TYPES[a]},
        success: function(data){
            let start_tag = tags(TYPES[a])            
            JSON.parse(data).map(item => {                
               start_tag = tags_sum(start_tag, tags_item(TYPES[a],item))
            })
            $('#'+ TYPES[a]).html(start_tag);
            clicked_title(TYPES[a])
        }

    })
}

const clicks = (a) =>{
   let b = document.querySelector(a)
   b.addEventListener('click',(a)=>{
        changeCss(a)
    })    
}
const changeCss = a =>{
    let transf
    let ind
    let disp = false;
    if( a.target.className == 'fa fa-plus'){
        transf = 0
        ind = 999999
        disp = 'none'
        $('#showurlfield').html('')


    }
    if(a.target.className == 'fa fa-times'){
        transf = 200
        ind = 0
        disp = 'block'
    }
    if(disp){
    $('#addField').css('transform', 'translateY('+ transf + '%)').css('z-index', ind);
    $('#addbutton>i').css('display', disp);
    }

}