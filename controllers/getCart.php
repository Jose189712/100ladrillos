<?php
    require "../config/instancia.php";

    $result = $data->getCart(json_decode(file_get_contents('php://input'),true));

    echo json_encode($result);
?>