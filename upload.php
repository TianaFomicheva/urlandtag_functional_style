<?php

    if ( 0 < $_FILES['file']['error'] ) {

        echo 'Error: ' . $_FILES['file']['error'] . '<br>';

    }    else {
        $now = time();
        move_uploaded_file($_FILES['file']['tmp_name'], 'uploads/img/'. $now.'_'. $_FILES['file']['name']);

        echo $now.'_'. $_FILES['file']['name'];
    }
    