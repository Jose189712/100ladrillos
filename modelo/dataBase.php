<?php
    require "connection.php";

    class Actions extends Connetion {

        public function __construct(){
            parent::__construct(); //Toma el constructor de la clase que hereda
        } // Constructor que toma la conexion de la base de datos
        /**
         * Función que enviara la información de las propiedades registradas para poder participar
         */
        public function getProperties() {            
            try {
                $query = $this->dataBase->prepare("SELECT * FROM propiedades WHERE numLadrillos>0");
                $query->execute();
                return $query->fetchAll(PDO::FETCH_OBJ);
            }
            catch (PDOException $e) {
                return $e;
            }
        }// Método que traera las propiedades con su información 
        /**
         * Función que mediante el correo de usuario mostrara los ladrillos que se encuentran en el carrito
         */
        public function getCart($correo) {
            try {
                 $query = $this->dataBase->prepare("SELECT idCompra,bricksBuy,totalBuy,idFPropiedad,nombreP,estadoU,ciudadU,direccion,precioLadrillo,numladrillos FROM users as u,propiedades as p, compras as c WHERE u.idUser=(SELECT idUser FROM users WHERE correo='$correo') AND p.idPropiedad=c.idFPropiedad AND c.status='cart'");
                 $query->execute();
                 return $query->fetchAll(PDO::FETCH_OBJ);
            }
            catch (PDOException $e) {
                return $e;
            }
        }// Método que mostrara los ladrillos que se encuentran en el carrito

        
    }// Fin de la clase Actions

?>