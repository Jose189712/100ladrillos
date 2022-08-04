<?php
    require "../config/instancia.php";

    $input = json_decode(file_get_contents('php://input'),true);
    
    echo $data->buyBricks($input);
?>