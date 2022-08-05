window.onload = function () {
    var important = [];    
    var form = document.getElementById("formCorreo");
    form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        let data = {}
        data.correo = document.getElementById("typeCorreo").value;
        fetch('./controllers/inUser.php', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'aplication/json'
            }
        })
            .then(function (response) {
                return response.text();
            })
            .then(function (respuesta) {
                if (respuesta) {
                    getPropiedades();
                    document.getElementById("btnCarrito").innerHTML = "Carrito";
                    document.getElementById("correo").innerHTML = respuesta;
                    document.getElementById("containerAlert").style.display = "block";
                    document.getElementById("containerAlert").innerHTML = "<div class=\"alert alert-success\" role=\"alert\">Correo Correcto</div>";
                    document.getElementById("containerCorreo").style.display = 'none';
                    document.getElementById("containerPropiedades").style.display = 'block';
                } else {
                    document.getElementById("containerAlert").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">Correo Incorrecto</div>";
                    document.getElementById("containerAlert").style.display = 'block';
                }
            })
    }); // Cierre de funcion de form para el evento submit


    //  FUNCIONES PARA PROCESAR LAS RESPUESTAS


    function getPropiedades() {
        fetch('./controllers/properties.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'aplication/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (respuesta) {
                let containerPropiedades = document.getElementById("containerPropiedades");
                containerPropiedades.innerHTML = "";
                important = respuesta;
                for (i = 0; i < respuesta.length; i++) {
                    containerPropiedades.innerHTML += "<div class=\"card\">" +
                        "<div class=\"card-header\">" +
                        "Propiedad" +
                        "</div>" +
                        "<div class=\"card-body\">" +
                        "<div class=\"row\">" +
                        "<div class=\"col-6\">" +
                        "<h5 class=\"card-title\">" + respuesta[i]['nombreP'] + "</h5>" +
                        "<p class=\"card-text\">" + respuesta[i]['direccion'] + ", " + respuesta[i]['ciudadU'] + ", " + respuesta[i]['estadoU'] + "</p>" +
                        "</div>" +
                        "<div class=\"col-3\"><strong>$" + respuesta[i]['precioLadrillo'] + "</strong> Por Ladrillo</div>" +
                        "<div class=\"col-3 text-muted\"><strong>" + respuesta[i]['numLadrillos'] + " Ladrillos disponibles</strong></div>" +
                        "</div>" +
                        "<br>" +
                        "<div class=\"row\">" +
                        "<div class=\"col-12\">" +
                        "<div class=\"input-group mb-3\">" +
                        "<span class=\"input-group-text bricksAssign\"><strong>-</strong></span>" +
                        "<input id=\"in" + i + "\" class=\"input-group-text bg-white\" type=\"text\" value=\"1\" min=\"1\" max=\"" + respuesta[i]['numLadrillos'] + "\">" +
                        "<span class=\"input-group-text bricksAssign\"><strong>+</strong></span>" +
                        "<span id=\"" + i + "\" class=\"btn btn-primary add\">Añadir al carrito</span>" +
                        "</div>" +
                        "</div>" +
                        "</div>" +
                        "</div>" +
                        "</div>";
                } // Cierre del for para recorrer los registros de las propiedades  
                let addsCarts = document.querySelectorAll(".add");
                for (j = 0; j < addsCarts.length; j++) {
                    addsCarts[j].onclick = addCart;
                }
            })// Cierre de la promesa final
    }// Fin de la función getPropiedades

    /**
     * Función para mandar ladrillos al carrito
     */
    function addCart() {
        let inputClear = document.getElementById("in" + this.id);
        let data = JSON.stringify({ "bricksBuy": document.getElementById("in" + this.id).value, "status": "cart", "idFPropiedad": important[parseInt(this.id)]['idPropiedad'], "correo": document.getElementById("correo").innerHTML });
        fetch('./controllers/addCart.php', {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'aplication/json'
            }
        })
            .then(function (response) {
                return response.text();
            })
            .then(function (respuesta) {
                if (respuesta) {
                    document.getElementById("containerAlert").innerHTML = "<div class=\"alert alert-success\" role=\"alert\">Se añadio al carrito correctamente</div>";                    
                    inputClear.value = 1;
                    getsCart();
                    window.scrollTo(0,0);
                } else {
                    document.getElementById("containerAlert").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">Ocurrio una falla al momento de añadirlo al carrito</div>";
                }
            })
    }// Cierre de la función addCart

    /**
     * Elementos para darles los eventos para traer lo que tiene el carrito
     */
    var getCart = document.getElementById("btnCarrito");
    getCart.addEventListener('click',getsCart);// Cierre del addEventListener para conocer lo que tenia el carrito

    /**
     * Función para mostrar lo que el usuario tiene en el carrito
     */
    function getsCart() {
        let data = JSON.stringify({ "correo": document.getElementById("correo").innerHTML });
        fetch('./controllers/getCart.php', {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'aplication/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (respuesta) {
                if (respuesta.length > 0) {              
                    document.getElementById("accordionCart").innerHTML = "";          
                    for (i = 0; i < respuesta.length; i++) {                                               
                        document.getElementById("accordionCart").innerHTML += "<div class=\"accordion-item compras\">" +
                            "<h2 class=\"accordion-header\" id=\"headingTwo" + respuesta[i]['idCompra'] + "\">" +
                            "<button class=\"accordion-button collapsed comprasInside\" type=\"button\" data-bs-toggle=\"collapse\"" +
                            "data-bs-target=\"#collapseTwo" + respuesta[i]['idCompra'] + "\" aria-expanded=\"false\" aria-controls=\"collapseTwo" + respuesta[i]['idCompra'] + "\">" +
                            respuesta[i]['nombreP'] +
                            "</button>" +
                            "</h2>" +
                            "<div id=\"collapseTwo" + respuesta[i]['idCompra'] + "\" class=\"accordion-collapse collapse\" aria-labelledby=\"headingTwo" + respuesta[i]['idCompra'] + "\"" +
                            "data-bs-parent=\"#accordionExample\">" +
                            "<div class=\"accordion-body\">" +
                            "<div class=\"row\">" +
                            "<div class=\"col-3 comprasInside\">" + respuesta[i]['bricksBuy'] + " <span class=\"text-muted\">ladrillos para comprar</span></div>" +
                            "<div class=\"col-3 comprasInside\">$" + respuesta[i]['precioLadrillo'] + " <span class=\"text-muted\">precio/ladrillo</span></div>" +
                            "<div class=\"col-3 comprasInside\">$" + respuesta[i]['totalBuy'] + " <span class=\"text-muted\">Total de la compra</span></div>" +
                            "<div id=\"" + respuesta[i]['idFPropiedad'] + "\" class=\"col-3 removeCart text-end\">" +
                            "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-trash3-fill\" viewBox=\"0 0 16 16\">" +
                            "<path d=\"M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z\"/>" +
                            "</svg>" +
                            "</div>"
                        "</div>" +
                            "</div>" +
                            "</div>" +
                            "</div>"
                    } //Cierre del for para mostrar lo que hay en el carrito
                    let removeCart = document.querySelectorAll(".removeCart");
                    for (j = 0; j < removeCart.length; j++) {
                        removeCart[j].onclick = removeCartF;
                    }
                    document.getElementById("containerCarrito").style.display = 'block';
                    document.getElementById("checkOut").style.display = 'block';
                } else {
                    document.getElementById("accordionCart").innerHTML = "<h3 class=\"text-muted text-center\">No tienes nada en el carrito</h3>"
                    document.getElementById("containerCarrito").style.display = 'block';
                    document.getElementById("checkOut").style.display = 'none';
                }
            })
    }//Cierre funcion getsCart


    /**
     * Función para eliminar compras del carrito
     */
    function removeCartF() {
        let data = JSON.stringify({ "idFPropiedad": parseInt(this.id), "correo": document.getElementById("correo").innerHTML });
        fetch('./controllers/removeCart.php', {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'aplication/json'
            }
        })
            .then(function (response) {
                return response.text();
            })
            .then(function (respuesta) {                
                if (respuesta) {
                    getsCart();
                    document.getElementById("containerAlert").innerHTML = "<div class=\"alert alert-success\" role=\"alert\">Se elimino la compra del carrito correctamente</div>";
                } else {
                    document.getElementById("containerAlert").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">Hubo problemas al eliminar la compra del carrito</div>";
                }
            })
    }// Cierre de la función que permite eliminar compras del carrito

    /**
     * Funciones para realizar el checkout del carrito de compras
     */
    var myModal = new bootstrap.Modal(document.getElementById('termsAndConditions'), {});
    var myModalFinish = new bootstrap.Modal(document.getElementById('finishCompra'), {});
    var check = document.getElementById("checkOut");
    check.addEventListener('click', function() {
        myModal.show();
    });

    /**
     * Funciones para checar los terminos y condiciones 
     */
    var checkBox = document.getElementById("aceptTerminos");
    checkBox.addEventListener('change',function (){
        if(checkBox.checked) {            
            document.getElementById("seguirCompra").removeAttribute("disabled");
        } else {            
            document.getElementById("seguirCompra").setAttribute("disabled","");
        }
    });

    /**
     * 
     */
    var seguirCompra = document.getElementById("seguirCompra");
    seguirCompra.addEventListener('click', function () {
        let nodos = document.getElementById("listaCompras");
        nodos.innerHTML= "<li class=\"list-group-item\">"+
            "<div class=\"row\">"+
                "<div class=\"col-6\"><strong>Propiedad</strong></div>"+
                "<div class=\"col-2\"><strong>N° Ladrillos</strong></div>"+
                "<div class=\"col-2\"><strong>Precio/Ladrillo</strong></div>"+
                "<div class=\"col-2\"><strong>Total</strong></div>"+
            "</div>"+
        "</li> "
        let compras = document.querySelectorAll(".compras");        
        for(i = 0; i < compras.length; i++) {                       
            document.getElementById("listaCompras").innerHTML += "<li class=\"list-group-item\">"+
                    "<div class=\"row\">"+
                        "<div class=\"col-6\">"+compras[i].querySelectorAll(".comprasInside")[0].innerHTML+"</div>"+
                        "<div class=\"col-2\">"+compras[i].querySelectorAll(".comprasInside")[1].innerHTML.split(" ")[0]+"</div>"+
                        "<div class=\"col-2\">"+compras[i].querySelectorAll(".comprasInside")[2].innerHTML.split(" ")[0]+"</div>"+
                        "<div class=\"col-2\">"+compras[i].querySelectorAll(".comprasInside")[3].innerHTML.split(" ")[0]+"</div>"+
                    "</div>"+
                "</li>"
        }        
        myModalFinish.show();                
    });

    /**
     * Función para finalizar la compra de ladrillos
     */
    var aceptarCompra = document.getElementById("terminarBuy");
    aceptarCompra.addEventListener('click', function () {
        let data = JSON.stringify({"correo": document.getElementById("correo").innerHTML});
        fetch('./controllers/buyBricks.php', {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'aplication/json'
            }
        })
        .then(function(response) {
            return response.text();
        })
        .then(function(respuesta) {            
            if(respuesta.split("\n")[1] == "Su compra ha sido exitosa"){
                getsCart();
                getPropiedades();
                document.getElementById("containerAlert").innerHTML = "<div class=\"alert alert-success\" role=\"alert\">"+respuesta.split("\n")[1]+"</div>";
            } else {
                document.getElementById("containerAlert").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">"+respuesta.split("\n")[1]+"</div>";
            }
        })
    });    
}; // Cierre de la función que checa cuando se termina de cargar la página