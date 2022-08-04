<?php
    require "../config/variables.php";

    class Connection{
        var $dataBase = '';       

        public function __construct(){
            $this->dataBase = $this->get_connection(SERVER,DATA_BASE,USER,PASS);                                
        }

        public function get_connection($servidor,$base,$usuario,$pass){
            try{                
                $config = new PDO("mysql:host=$servidor;dbname=$base",$usuario,$pass);
                return $config;
            }catch(PDOException $e){                
                return;
            } 
        }//fin de la función que retorna la connection       
    }//fin de la clase connection   
?>