$('document').ready(function () {
    
    CLICKED_ELS.map(item => clicks(item))
    

    let autocomplete_arr = [];

    start('LASTTAGS')
    start('POPULARTAGS')
    
    $.ajax({
        url: 'addUrl.php',
        method: 'POST',
        data: { type: 'autocomplete' },
        success: function (data) {
            JSON.parse(data).forEach(item => {
                autocomplete_arr.push(item.tag)
            });
            $('#searchinput, #addInput1').keydown(function () {

                let attr_id = $(this).attr('id');
                autocomplete(document.getElementById(attr_id), autocomplete_arr)

            });

        }

    });
    $.ajax({
        url: 'addUrl.php',
        method: 'POST',
        data: { type: 'manual' },
        success: function (data) {
            console.log(JSON.parse(data));
            JSON.parse(data).forEach(item => {
                showContent(item.url_address, item.tag, item.comment, item.date)
            });
    $('body').find('.showurltitle').on('click', function () {
     let cur_tag = $(this).text().slice(1);
       checkFromArray(cur_tag, 0, true);

    })

        }

    });




   $('#addInput1').on('keydown', function (e) {
        var theEvent = e || window.event;
        var key = theEvent.keyCode || theEvent.which;
        if (key == 32) {
            e.preventDefault
            document.getElementById('err1').innerHTML = MESSAGES['not_whitespace'];
            document.getElementById('err1').style.display = 'block';
            return false
        } else if(key == 51 && e.shiftKey){
            e.preventDefault
            document.getElementById('err1').innerHTML = MESSAGES['not_sharp'];
            document.getElementById('err1').style.display = 'block';
            return false
        }else {
            let adding_tag = $(this).val();
            if(adding_tag.slice(-1) == ' '){
                $(this).val(adding_tag.slice(0, -1));
                document.getElementById('err1').innerHTML = MESSAGES['not_whitespace'];
                document.getElementById('err1').style.display = 'block';
                return false;
            }
            document.getElementById('err1').style.display = 'none';
        }
    })
    $('#comment').keydown(function (e) {
        let comment_val = $(this).val().length;
        let rest_val = 550 - comment_val
        $('#rest').css('display', 'block')
        $('#rest').find('span').text(rest_val)
        var theEvent = e || window.event;

        var key = theEvent.keyCode || theEvent.which;
        if (key == 8 || key == 46) {
            document.getElementById('err3').style.display = 'none';
        }

        if (comment_val.length > 549 && key !== 8 && key !== 46) {
            document.getElementById('err3').innerHTML = MESSAGES['less_length'];
            document.getElementById('err3').style.display = 'block';
            return false;

        } else {
            document.getElementById('err3').style.display = 'none';
        }
    });
    document.addEventListener('keydown', function (event) {
        if (event.code == 'Enter') {


            if ($('#addField').attr('rel') == 'hidden') {
                $('#searchbutton').trigger('click');
            } else {

                $('#addButton').trigger('click');
            }
        }
    });

    $('#more').on('click', function(){       
        checkFromArray($(this).attr('rel'), $(this).attr('start'), false)        
    })



});



