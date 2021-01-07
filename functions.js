const addToArray = () =>{    
    let addInputValue1 = getVal('addInput1')
    let addInputValue3 = getVal('comment')
    let add_res = checkAddVal(addInputValue1)(addInputValue3)       
    if(!add_res){
        return false
    }
    $.ajax({
        url: URL,
        method: 'POST',
        data: makeAddAttrs(addInputValue1, addInputValue3),
        success: function () {
            post_added()
        }
    })    

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
            dual_ring('none')            
            (JSON.parse(data).length > 0) ? success_show(data) : notfound()                                                        
        }
    });
}
const dual_ring = a =>{
    $('#more').css('display', 'none');
  return   $('.lds-dual-ring').css('display', a);
}
const showContent = item => {    
    $('#notfount').css('display', 'none');
    let prev_showurl = $('body').find('.showurlcontent').last();
    let content_field = contentField(item)
    return  (prev_showurl.length == 0) ? $('#showurlfield').append(content_field) : prev_showurl.after(content_field)
    

}
const  applyLink = comment =>{    
    let comment_arr = comment.split("http")
    let new_comment_arr   =[] 
    comment_arr.map(item=> {
        if(item.indexOf('://') == 0 || item.indexOf('://') == 1){
        let words = item.split(" ");
        let url_word = words[0]
        item =   item.replace(url_word, '<a href="http'+ url_word +'" target= "_blank">http' + url_word.slice(0, 19) + '...</a>')
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

const post_added = ()=>{
    $('#addField input, #addField textarea').each( function(){
        $(this).val('')
    })
    $('#rest').css('display', 'none');
 return   $('#addFieldFooter>span').text(MESSAGES['post_added']);
}

const getVal = a=>{
    return $('#'+a).val()
}
const makeCheckAttrs = (a,b,c)=>{
    return {check: a, type: 'check', start: b, from_comment: c}
}
const makeAddAttrs = (a,b)=>{
    return {tag: a, type: 'add', comment: b}
}
