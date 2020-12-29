

function addToArray() {
    document.getElementById('rest').style.display = 'none';
    let addInputValue1 = document.getElementById('addInput1').value;
    let addInputValue3 = document.getElementById('comment').value;
    let is_err1 = false
    let is_err3 = false
    if (addInputValue1 == '') {
        document.getElementById('err1').innerHTML = 'Поле не должно быть пустым';
        document.getElementById('err1').style.display = 'block';
        is_err1 = true
    } else {
        document.getElementById('err1').style.display = 'none';
        is_err1 = false
    }
    if (addInputValue3 == '') {
        document.getElementById('err3').innerHTML = 'Поле не должно быть пустым';
        document.getElementById('err3').style.display = 'block';
        is_err3 = true
    } else if (addInputValue3.length < 5) {
        document.getElementById('err3').innerHTML = 'Длина текста должна быть не менее 5 символов';
        document.getElementById('err3').style.display = 'block';
        is_err3 = true
    } else {
        document.getElementById('err3').style.display = 'none';
        is_err3 = false
    }
    if (is_err1 || is_err3) {
        return false;
    }
    $.ajax({
        url: 'addUrl.php',
        method: 'POST',
        data: { tag: addInputValue1, comment: addInputValue3, type: 'add' },
        success: function () {
            document.getElementById('addInput1').value = '';
            document.getElementById('comment').value = '';
            $('#addFieldFooter>span').text('Спасибо! Ваша запись успешно добавлена!');
        }
    })



}

function checkFromArray(check_val = false, start_val = 0, firstcall = false) {
    if (firstcall) {
        $('#showurlfield').html('')
        
    }
    let finded = false
    let checkInputValue = (!check_val) ? $('#searchinput').val() : check_val;
    let from_comment = (!check_val) ? 'yes' : 'no';
    let start_value = start_val ? start_val : 0;
    if (!checkInputValue) {
        return false;
    }
    let showurlValue = $('#showurlfield').html();
    let result;
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
                        showContent(false, item["tag"], item["comment"], item["date"]);
                    } else {
                        if (item["start"] !== -1) {
                            function showMoreButton() {
                                $('#more').css('display', 'block');
                                $('#more').attr('rel', item["common_tag"]);
                                $('#more').attr('start', item["start"]);                            
                            }
                            setTimeout(showMoreButton, 1500);
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


function showAddField() {
    
        $('#addField').css('transform', 'translateY(0%)');
        $('#addField').css('z-index', '999999');
        $('#addField').attr('rel', 'shown');
        $('#addbutton span').text('Отменить');
        $('#showurlfield').html('')
    
}


function showContent(url, tag, comment, date_added) {
    
    $('#notfount').css('display', 'none');
    let parsed_comment = applyLink(comment);
    let date_field = '<div class="date_added">' + date_added + '</div>'
    let prev_showurl = $('body').find('.showurlcontent').last();
    let link_comment = `<div class="showcomment">` + ((comment !== undefined) ? parsed_comment : '') + `</div>`
    let schema_block = `<div class="showurl"></div><div class="showschema"><div class="schema_descr"></div></div>`
    let url_content = '<h3 class="showurltitle">#' + tag + '</h3><div class="showurlcontent">' + link_comment + date_field +'</div>'

    if (prev_showurl.length == 0) {
        $('#showurlfield').append(url_content);
    } else {
        prev_showurl.after(url_content)
    }
     
    $('#notfound').css('display', 'none');

}
function applyLink(comment){    
    let comment_arr = comment.split("http");
    
    for(key in comment_arr){
        if(comment_arr[key].indexOf('://') == 0 || comment_arr[key].indexOf('://') == 1){
        let words = comment_arr[key].split(" ");
        let url_word = words[0]
        comment_arr[key] =   comment_arr[key].replace(url_word, '<a href="http'+ url_word +'" target= "_blank">http' + url_word.slice(0, 19) + '...</a>')
        }
        
    }
    return comment_arr.join(" ")
}

