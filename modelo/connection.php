<?php
    require "../config/variables.php";

    class Connetion{
        var $dataBase = '';       

        public function __construct(){
            $this->dataBase = $this->get_connetion(SERVER,DATA_BASE,USER,PASS);                                
        }

        public function get_connetion($servidor,$base,$usuario,$pass){
            try{                
                $config = new PDO("mysql:host=$servidor;dbname=$base",$usuario,$pass);
                return $config;
            }catch(PDOException $e){                
                return;
            } 
        }//fin de la función que retorna la connetion       
    }//fin de la clase connetion   
?>