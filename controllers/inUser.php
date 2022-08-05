<?php

use LDAP\Result;

    require "../config/instancia.php";

    $input = json_decode(file_get_contents('php://input'),true);   
    
    $result = $data->select("correo","users","correo='{$input['correo']}'");

    if($result) {
        echo $result[0]->correo;
    } else {
        echo '';
    }
?>