<?php
$rqdata = json_decode(file_get_contents('php://input'),1);
$url = $rqdata['url'];

$data = file_get_contents(trim($url));
if(!$data){
    $data = file_get_contents(trim($url).'/index.php');
}
if(!$data){
    $data = file_get_contents(trim($url).'/index.html');
}

$data = stristr($data, '<head>');
$data = stristr($data, '</head>', true);

$data = str_replace('<script>', '<script>/*', $data);
$data = str_replace('<script type="text/javascript">', '<script type="text/javascript">/*', $data);
$data = str_replace('</script>', '*/</script>', $data);
echo $data;