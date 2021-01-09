<?php
$servername = "localhost";
$username = "root";
$password = "123";
$database = "urlandtag";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("SET NAMES utf8");
  
    } catch(PDOException $e) {    
    echo "Connection failed: " . $e->getMessage();
    }
    if($_POST['type'] == 'add'){
$tag = $_POST['tag'];
$comment = $_POST['comment'];

$query = "INSERT INTO url_tag (tag, comment) VALUES('".$tag."', '".$comment."');";
echo $query;

$conn->query($query);
    }
    
    else if($_POST['type'] == 'check_personal'){
$tag = $_POST['tag'];
$code = $_POST['code'];


$query = "SELECT  tag, code   FROM  personal_tags WHERE tag LIKE '".$tag."'";
        
        $res = $conn->query($query)->fetchAll(PDO::FETCH_ASSOC);
        if((!$res && $code == '') || ($res[0]['tag'] == $tag && $res[0]['code'] == $code)){
            echo 'OK';
            exit;
        }else if(!$res && $code !== ''){
            $query = "INSERT INTO personal_tags (tag, code) VALUES('".$tag."', '".$code."');";
        $conn->query($query);
        echo 'OK';
        exit;
        }else{
            echo 'NOT OK';
            exit;
        }

        
        
$conn->query($query);
    }
    
    else if($_POST['type'] == 'check'){
        $check = trim($_POST['check']);
        $from_comment = $_POST['from_comment'] == 'yes' ?  "OR comment LIKE '%".$check."%'" : "";
        $start = $_POST['start'] ? $_POST['start'] : 0;
        $step = 8;
        $query_count = "SELECT COUNT(DISTINCT id) as count FROM  url_tag WHERE tag LIKE '%".$check."%'".$from_comment.";";
        $res_count = $conn->query($query_count)->fetchAll(PDO::FETCH_ASSOC);
        $count = $res_count[0]['count'];
        

        $query = "SELECT id, tag,  comment, date_added FROM  url_tag WHERE tag LIKE '%".$check."%' ".$from_comment." GROUP BY id ORDER BY id DESC LIMIT ".$start.",".$step.";";
        
        $res = $conn->query($query)->fetchAll(PDO::FETCH_ASSOC);
        $default_date = new DateTime('2020-12-08 23:48:47');
       
        foreach($res as $key=>$r){
            $post_date = new DateTime($r['date_added']);
            $res[$key]['date'] = ($post_date > $default_date) ? $post_date->format("d.m.Y H:i") : "";
            $query = "UPDATE `url_tag` SET `popularity` = `popularity` + 1 WHERE `id` = ".$r['id'];
            $conn->query($query);
        }
        if($res){
        if($count > $start + $step){
            $more = $start + $step;

        }else{
            $more = -1;
        }
        $res[] =  ['start' => $more, 'common_tag' =>$check];
    }
       
        echo json_encode($res);
    }else  if($_POST['type'] == 'lasttags'){      
        $query = "SET sql_mode = '';";
        $conn->query($query);
        $query = "SELECT url_tag.tag, personal_tags.code FROM  url_tag LEFT JOIN personal_tags USING(tag) WHERE  personal_tags.tag IS NULL AND url_tag.tag <>'' GROUP BY url_tag.tag ORDER BY url_tag.id DESC LIMIT 18;";

        
        $res = $conn->query($query)->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($res);
    }
    else  if($_POST['type'] == 'populartags'){
        $query = "SET sql_mode = '';";
        $conn->query($query);
        $query = "SELECT url_tag.tag, personal_tags.code FROM  url_tag LEFT JOIN personal_tags USING(tag) WHERE  personal_tags.tag IS NULL AND url_tag.tag <>'' GROUP BY url_tag.tag ORDER BY url_tag.popularity DESC LIMIT 18;";

        
        $res = $conn->query($query)->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($res);
    
    }
    else  if($_POST['type'] == 'personaltags'){
        $query = "SET sql_mode = '';";
        $conn->query($query);
        $query = "SELECT url_tag.tag, personal_tags.code FROM  url_tag LEFT JOIN personal_tags USING(tag) WHERE  personal_tags.tag IS NOT NULL AND url_tag.tag <>'' GROUP BY url_tag.tag ORDER BY url_tag.popularity DESC LIMIT 18;";

        
        $res = $conn->query($query)->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($res);
    
    }
    
    else  if($_POST['type'] == 'autocomplete'){
        $query = "SET sql_mode = '';";
        $conn->query($query);
        $query = "SELECT tag FROM  url_tag  GROUP BY tag ;";

        
        $res = $conn->query($query)->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($res);
    }else  if($_POST['type'] == 'manual'){
        $query = "SET sql_mode = '';";
        $conn->query($query);
        $query = "SELECT tag, comment, date_added FROM  url_tag WHERE manual_add = '1'   LIMIT 10;";
        $default_date = new DateTime('2020-12-08 23:48:47');
        $res = $conn->query($query)->fetchAll(PDO::FETCH_ASSOC);
        foreach($res as $key=>$r){
            $post_date = new DateTime($r['date_added']);
            $res[$key]['date'] = ($post_date > $default_date) ? $post_date->format("d.m.Y H:i") : "";
        }
        
        echo json_encode($res);
    }
