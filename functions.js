function addToArray() {
    $('#rest').css('display', 'none');
    let addInputValue1 = $('#addInput1').val()
    let  = $('#comment').val();
    let add_res = checkAddVal(addInputValue1, addInputValue3)       
    
    $.ajax({
        url: URL,
        method: 'POST',
        data: { tag: addInputValue1, comment: addInputValue3, type: 'add' },
        success: function () {
            $('#addInput1').val() = '';
            $('#comment').val() = '';
            $('#addFieldFooter>span').text(MESSAGES['post_added']);
        }
    })



}

function checkFromArray(check_val = false, start_val = 0, firstcall = false) {
    if (firstcall) {
        $('#showurlfield').html('')
        
    }
    let checkInputValue = (!check_val) ? $('#searchinput').val() : check_val;
    let from_comment = (!check_val) ? 'yes' : 'no';
    if (!checkInputValue) {
        return false;
    }
    $.ajax({
        url: 'addUrl.php',
        method: 'POST',
        data: { check: checkInputValue, type: 'check', start: start_val, from_comment: from_comment},
        beforeSend: function () {
            $('#more').css('display', 'none');
            $('.lds-dual-ring').css('display', 'block');

        },
        success: function (data) {
            $('.lds-dual-ring').css('display', 'none');
            if (JSON.parse(data).length > 0) {
                JSON.parse(data).forEach(item => {
                    if (!item["start"]) {
                        showContent(item);
                    } else {
                        if (item["start"] !== -1) {                            
                            setTimeout(showMoreButton(item), 1500);
                        }
                    }
                })                               
                $('body').find('.showurltitle').on('click', function () {
                    let cur_tag = $(this).text().slice(1);
                    checkFromArray(cur_tag, 0, true);
                })
            } else {
                notfound()
            }
        }
    });
}


function notfound() {
    if ($('body').find('.showurl').last().length == 0) {
        $('#notfound').css('display', 'block');
    }
};


function showContent(item) {    
    $('#notfount').css('display', 'none');
    let prev_showurl = $('body').find('.showurlcontent').last();
    let content_field = contentField(item)    
    if (prev_showurl.length == 0) {
        $('#showurlfield').append(content_field);
    } else {
        prev_showurl.after(content_field)
    }

}
function applyLink(comment){    
    let comment_arr = comment.split("http");
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

function showMoreButton(a) {
    $('#more').css('display', 'block').attr('rel', a["common_tag"]).attr('start', a["start"])                           
}