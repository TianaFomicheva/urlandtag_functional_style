$('document').ready(function () {
    
    CLICKED_ELS.map(item => clicks(item))
    START_TYPES.map(item => start(item))    

   $('#addInput1').on('keydown', function (e) {
        var theEvent = e || window.event;
        var key = theEvent.keyCode || theEvent.which;
        if (key == 32 || (key == 51 && e.shiftKey) || (adding_tag = $(this).val().slice(-1) == ' ' )) {
            return showErr(key,1)                                    
        } 
            document.getElementById('err1').style.display = 'none';

    })
    $('#comment').keyup(function (e) {
        let rest_val = COMMENT_LENGTH - $(this).val().length                 
        let key = getCode(e)
        if (rest_val < 1  && key !== 8 && key !== 46) {
            return showErr(1,3)            
        }
        return showRestVal(rest_val)                
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



