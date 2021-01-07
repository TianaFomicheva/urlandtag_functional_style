$('document').ready(function () {
    
    CLICKED_ELS.map(item => clicks(item))
    START_TYPES.map(item => start(item))    

   $('#addInput1').on('keydown', function (e) {
        var theEvent = e || window.event;
        var key = theEvent.keyCode || theEvent.which;
        let not_allowed_key = not_allowed(e.shiftKey)        
        return (not_allowed_key[key] == true) ?  showErr(key,1) :  $('#err1').css('display', 'none');

    })
    $('#comment').keyup(function (e) {
        let rest_val = COMMENT_LENGTH - $(this).val().length                 
        let key = getCode(e)  
        return (rest_val < 1  && !BACKSPACES[key]) ? showErr(1,3) : showRestVal(rest_val)                
    });

    document.addEventListener('keydown', function (e) {             
        if (e.code == 'Enter') {
            let is_added_vals = check_is_added_vals()   
            return is_added_vals ? $('#addButton').trigger('click') :  $('#searchbutton').trigger('click');
        }
    });

    $('#more').on('click', function(){       
        checkFromArray($(this).attr('rel'), $(this).attr('start'))        
    })

    

});



