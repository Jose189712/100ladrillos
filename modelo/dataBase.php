<?php
require "connection.php";

class Actions extends Connection
{

    public function __construct()
    {
        parent::__construct(); //Toma el constructor de la clase que hereda
    } // Constructor que toma la conexion de la base de datos
    /**
     * Función que enviara la información de las propiedades registradas para poder participar
     */
    public function getProperties()
    {
        try {
            $query = $this->dataBase->prepare("SELECT * FROM propiedades WHERE numLadrillos>0");
            $query->execute();
            return $query->fetchAll(PDO::FETCH_OBJ);
        } catch (PDOException $e) {
            return $e;
        }
    } // Cierre del método getProperties 
    /**
     * Función que mediante el correo de usuario mostrara los ladrillos que se encuentran en el carrito
     */
    public function getCart($input)
    {
        try {
            $query = $this->dataBase->prepare("SELECT idCompra,bricksBuy,totalBuy,idFPropiedad,nombreP,estadoU,ciudadU,direccion,precioLadrillo,numladrillos FROM users as u,propiedades as p, compras as c WHERE u.idUser=(SELECT idUser FROM users WHERE correo=:correo) AND p.idPropiedad=c.idFPropiedad AND c.status='cart'");
            $query->bindValue(":correo", $input['correo'],PDO::PARAM_STR);
            $query->execute();
            return $query->fetchAll(PDO::FETCH_OBJ);
        } catch (PDOException $e) {
            return $e;
        }
    } // Cierre del función getCart
    /**
     * Función que ayuda a agregar compras en el carrito
     */
    public function addCart($input)
    {
        try {
            $query = $this->dataBase->prepare("INSERT INTO compras(bricksBuy,totalBuy,status,idFPropiedad,idUser) VALUES(:bricksBuy,((SELECT precioLadrillo FROM propiedades WHERE idPropiedad=:idFPropiedad)*:bricksBuy),'cart',:idFPropiedad,(SELECT idUser FROM users WHERE correo=:correo)
                )");
            $query->bindValue(':bricksBuy', $input['bricksBuy'], PDO::PARAM_INT);
            $query->bindValue(':idFPropiedad', $input['idFPropiedad'], PDO::PARAM_INT);
            $query->bindValue(':correo', $input['correo'], PDO::PARAM_STR);
            return $query->execute();
        } catch (PDOException $e) {
            return $e;
        }
    } // Cierre del función addCart
    /**
     * Función que permite eliminar los ladrillos del carrito de compras
     */
    public function removeCart($input)
    {
        try {
            $query = $this->dataBase->prepare("DELETE FROM compras WHERE idFPropiedad=:idFPropiedad AND idUser=(SELECT idUser FROM users WHERE correo=:correo) AND status != 'buy'");
            $query->bindValue(":idFPropiedad", $input['idFPropiedad'], PDO::PARAM_INT);
            $query->bindValue(":correo", $input['correo'], PDO::PARAM_STR);
            return($query->execute());
        } catch (PDOException $e) {
            return $e;
        }
    } // Cierre del función removeCart

    /**
     * Función que realiza la actualización de la base de datos para al realizar la compra
     */
    public function buyBricks($input)
    {
        $ids = $this->select('*', 'compras', "idUser=(SELECT idUser FROM users WHERE correo='{$input['correo']}') AND status='cart'");

        var_dump(count($ids));
        foreach ($ids as $id) {
            //var_dump($ids[$i]);                    
            $availableBricks = $this->select('numLadrillos', 'propiedades', "idPropiedad={$id->idFPropiedad}")[0]->numLadrillos;

            if (intval($id->bricksBuy) <= intval($availableBricks)) {
                $responseP = $this->update("propiedades", "numLadrillos=" . (intval($availableBricks) - intval($id->bricksBuy)), "idPropiedad={$id->idFPropiedad}");

                $responseC = $this->update("compras", "status='buy'", "idCompra={$id->idCompra}");

                if (!$responseP || !$responseC) {
                    return "Error en la compra, vuelva a intentarlo";
                }

            } else {
                return "Se paso el número de ladrillos. Se encuentran disponibles {$availableBricks}";
            }
        } // Cierre del foreach
        return "Su compra ha sido exitosa";
    } // Cierre de la función buyBricks

    /**
     * Función para obtener datos de distintas tablas de la base de datos
     */
    public function select($column, $table, $condition)
    {
        try {
            $query = $this->dataBase->prepare("SELECT $column FROM $table WHERE $condition");
            //var_dump($query);                   
            $query->execute();
            //var_dump($query->errorInfo());               
            return $query->fetchAll(PDO::FETCH_OBJ);
        } catch (PDOException $e) {
            return $e;
        }
    } // Cierre de la funcion select 

    /**
     * Función para actualizar datos de distintas tablas de la base de datos
     */
    public function update($table, $field, $condition)
    {
        try {
            $query = $this->dataBase->prepare("UPDATE $table SET $field WHERE $condition");

            return $query->execute();

        } catch (PDOException $e) {
            return $e;
        }
    } // Cierre de la función update
}// Fin de la clase Actions
