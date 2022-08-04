<?php
    require "instancia.php";    

    $result = $data->getProperties();

    echo json_encode($result);

?>