<?php
    require "instancia.php";

    $result = $data->getCart($_GET['correo']);

    echo json_encode($result);
?>