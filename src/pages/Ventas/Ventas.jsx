import axios from 'axios'
import React, { useEffect, useState } from 'react'

import '../../styles/ventas.css';
import { DETALLEVENTA_DELETE, DETALLEVENTA_DELETE_ALL, DETALLEVENTA_GET_VENTA, DETALLEVENTA_POST, FACTURA_GET_NUM, Footer, NavPrincipal, PRODUCTO_GET, TOTAL_GET_SUMA, VENTA_POST } from '../../constants/constants';
import { TablaProducto, TablaUnProducto, ModalTicket } from "../../constants/constants"

const productosData = [
    {
      "id": 1,
      "nombre": "Hamburguesa Clásica",
      "descripcion": "Pan artesanal, carne de res, lechuga, tomate, queso y mayonesa.",
      "precio": 1200,
      "categoria": "Comida",
      "stockeable": false,
      "stock": 20
    },
    {
      "id": 2,
      "nombre": "Milanesa Completa",
      "descripcion": "Pan francés, milanesa de pollo, queso, tomate y lechuga.",
      "precio": 1300,
      "categoria": "Comida",
      "stockeable": false,
      "stock": 15
    },
    {
      "id": 3,
      "nombre": "Gaseosa 500ml",
      "descripcion": "Botella de gaseosa de 500ml, varios sabores disponibles.",
      "precio": 600,
      "categoria": "Bebida",
      "stockeable": true,
      "stock": 50
    },
    {
      "id": 4,
      "nombre": "Cerveza Artesanal 330ml",
      "descripcion": "Cerveza artesanal rubia o negra, en botella de 330ml.",
      "precio": 900,
      "categoria": "Bebida",
      "stockeable": false,
      "stock": 30
    },
    {
      "id": 5,
      "nombre": "Papas Fritas",
      "descripcion": "Porción mediana de papas fritas crocantes.",
      "precio": 700,
      "categoria": "Acompañamiento",
      "stockeable": false,
      "stock": 25
    },
    {
      "id": 6,
      "nombre": "Hamburguesa Vegana",
      "descripcion": "Pan integral, medallón de lentejas, palta, rúcula y tomate.",
      "precio": 1400,
      "categoria": "Comida",
      "stockeable": false,
      "stock": 10
    },
    {
      "id": 7,
      "nombre": "Agua Mineral 500ml",
      "descripcion": "Botella de agua mineral natural o con gas.",
      "precio": 500,
      "categoria": "Bebida",
      "stockeable": true,
      "stock": 40
    },
    {
      "id": 8,
      "nombre": "Sándwich de Lomito",
      "descripcion": "Pan francés, lomito, queso, tomate, lechuga y huevo.",
      "precio": 1500,
      "categoria": "Comida",
      "stockeable": false,
      "stock": 12
    }
  ]



export function Ventas() {


    const [productosFiltrados, setProductosFiltrados] = useState([])

    const [productos, setProductos] = useState(productosData)

    const [idCarrito, setIdCarrito] = useState(0)

    const [productoPorVenta, setProductoPorVenta] = useState([])
    const [idProducto, setIdProducto] = useState(1)
    const [idProd, setIdProd] = useState(0)
    const [ultimoSaldo, setUltimoSaldo] = useState(0)


    const [detalleVenta, setDetalleVenta] = useState([])
    const [nuevaVenta, setNuevaVenta] = useState([])

    const [numFactura, setNumFactrura] = useState(0)
    const [total, setTotal] = useState(0)
    //const [mostrarObservacion, setMostrarObservacion] =useState(false)

    const [mostrarComponente, setMostrarComponente] = useState(true);
    const [mostrarTodos, setMostrarTodos] = useState(true);

    /* estados para actualizar tabla venta */
    const [identificacionCliente, setIdentificacionCliente] = useState("");

    const [formaDePago, setFormaDePago] = useState("");

    const [tipoEntrega, setTipoEntrega] = useState("");

    // aca es la parte del Modal
    const [mostrarModal, setMostrarModal] = useState(false);
    const [validarVenta, setValidarVenta] = useState(false);

    const [validarTipoEntrega, setValidarTipoEntrega] = useState(false);
    const [validarIdentificacion, setValidarIdentificacion] = useState(false);
    const [validarFormaPago, setValidarFormaPago] = useState(false);

    const [modalVisible, setModalVisible] = useState(true);
    // aca termina el modal 

    const [carrito, setCarrito] =useState([])



    const handleAgregar = (id) => {
        setMostrarComponente(!mostrarComponente)
        setIdProducto(id)
    }
    const handleVolver = () => {
        setMostrarComponente(!mostrarComponente)
    }


    const handleQuitar = (id) => {
        setCarrito((prevCarrito) => {
            // Encontrar el producto que se va a eliminar
            const productoEliminado = prevCarrito.find(producto => producto.id === id);
    
            if (productoEliminado) {
                // Calcular el monto a restar: precio * cantidad
                const montoARestar = productoEliminado.precio * productoEliminado.cantidad;
    
                // Actualizar el total restando el monto calculado
                setTotal((prevTotal) => prevTotal - montoARestar);
            }
    
            // Retornar el nuevo carrito sin el producto eliminado
            return prevCarrito.filter(producto => producto.id !== id);
        });
    };
    

    const handleCancelar = () => {

        if (carrito.length > 0) {

                    setCarrito([])
                    setTotal(0)
                    resetItems()

        } else (alert("No hay productos para realizar la venta"))
    }

    const handleValidarVenta = () => {

        if (validarFormaPago === true && validarIdentificacion === true && validarTipoEntrega === true) {
            setValidarVenta(true)
        }
    }

    const closeModal = () => {
        setModalVisible(false);
        setCarrito([])
      };

    const handleFinalizarVenta = () => {

        if (carrito.length > 0 && validarVenta === true) {
            const fechaActual = new Date()
            const dia = fechaActual.getDate();
            const mes = fechaActual.getMonth() + 1; // Los meses empiezan desde 0, por lo que sumamos 1
            const anio = fechaActual.getFullYear();
            const horas = fechaActual.getHours();
            const minutos = fechaActual.getMinutes();

            // Agregar ceros a la izquierda si es necesario
            const diaFormateado = dia < 10 ? `0${dia}` : dia;
            const mesFormateado = mes < 10 ? `0${mes}` : mes;
            const horasFormateadas = horas < 10 ? `0${horas}` : horas;
            const minutosFormateados = minutos < 10 ? `0${minutos}` : minutos;

            // Formatear la fecha y hora en el formato deseado
            const fechaHoraFormateada = `${anio}-${mesFormateado}-${diaFormateado} ${horasFormateadas}:${minutosFormateados}`;


            setNuevaVenta({
                fechaYHora: fechaHoraFormateada.toString(),
                concepto: "Venta nro: " + numFactura,
                ingresos: total,
                egresos: 0,
                saldo: ultimoSaldo + total,
                estado: "Abierta"

            })


        setDetalleVenta ({
                montoTotal: total,
                fechaYHora: fechaHoraFormateada,
                formaDePago: formaDePago,
                tipoEntrega: tipoEntrega,
                identificacionComprador: identificacionCliente
            })

                    resetItems()
                    setTotal(null)
                    setMostrarModal(true)
                    setModalVisible(true)
                    setValidarVenta(false)
                
                    
        } else (alert("Faltan ingresar datos"))
    }


    const handleAgregarCarrito = (unProductoArray, contador, descripcion, observacion) => {
        
        if (contador > 0) {
            const productoNuevo = {
                id: idCarrito,
                cod_Producto: unProductoArray.id,
                nombre: unProductoArray.nombre,
                num_Factura: numFactura,
                cantidad: contador,
                precio: unProductoArray.precio,
                descripcion: 'Preparacion: ' + descripcion + '| Aclaracion: ' + observacion,
                subTotal: unProductoArray.precio * contador
            };
    
            // Usar el estado previo para actualizar el carrito
            setCarrito(prevCarrito => {
                const nuevoCarrito = [...prevCarrito, productoNuevo];
                return nuevoCarrito;
            });
    
            // Actualizar el idProd y numFactura de manera segura
            setIdProd((prevIdProd) => prevIdProd + 1);
            setIdCarrito(idCarrito + 1)
            setTotal(total + productoNuevo.subTotal)
    
            // Mostrar el componente o realizar otras acciones
            setMostrarComponente(true);
        } else {
            alert("Debe ingresar una cantidad");
        }
    };
    

    const resetItems = () => {
        setTipoEntrega("")
        setFormaDePago("")
        setIdentificacionCliente("")
        setValidarFormaPago(false)
        setValidarIdentificacion(false)
        setValidarTipoEntrega(false)
        setIdCarrito(0)
    }

    
    useEffect(() => {
        handleValidarVenta()
    }, [idProd, total, mostrarTodos, validarFormaPago, validarIdentificacion, validarTipoEntrega, validarVenta, numFactura, carrito])

    useEffect(() => {
    }, [carrito]); // Dependencia en carrito
    

    return (
        <div className='divVentas'>
            <NavPrincipal />
            <h2 className='glass2'>Ventas</h2>
            <div className='row m-auto main'>


                <main className='col-lg-8 mainVentas'>
                    <article className='col-12 glass2 productos'>
                        {mostrarComponente ? <TablaProducto productos={productos} handleAgregar={handleAgregar}
                            mostrarTodos={mostrarTodos} /> : <TablaUnProducto mostrarComponente={mostrarComponente} idProducto={idProducto} productos={productos}
                                handleVolver={handleVolver} handleAgregarCarrito={handleAgregarCarrito} />}

                    </article>
                </main>
                <aside className='col-lg-4'>
                    <div className='glass2 divFactura'>
                        <h5>Numero de factura {numFactura}</h5>
                        <h6>
                            Cliente <input type="text" value={identificacionCliente} onChange={(e) => { setIdentificacionCliente(e.target.value), setValidarIdentificacion(true) }} />
                        </h6>
                        <h6>
                            Forma de pago <select name="" id="" value={formaDePago} onChange={(e) => { setFormaDePago(e.target.value), setValidarFormaPago(true) }}>
                                <option value=""></option>
                                <option value="Transferencia">Transferencia</option>
                                <option value="Efectivo">Efectivo</option>
                            </select>
                        </h6>
                        <h6>
                            Forma de entrega <select name="" id="" value={tipoEntrega} onChange={(e) => { setTipoEntrega(e.target.value), setValidarTipoEntrega(true) }}>
                                <option value=""></option>
                                <option value="Comer AQUI">Comer AQUI</option>
                                <option value="Para llevar<">Para llevar</option>
                                <option value="PY / RAPPI">PY / RAPPI</option>
                            </select>
                        </h6>


                        <ul className='ulDeslizable2'>
                            {
                                carrito.map((producto) => {
                                    if (producto.num_Factura === numFactura) {
                                        return (
                                            <li className='border-1' key={producto.id}>
                                                <p>
                                                    {producto.cantidad} -- {producto.nombre} -- {producto.precio} --
                                                    {producto.stockeable === "NO" && (
                                                        <span>{producto.observacion}</span> 
                                                    )}
                                                </p>
                                                <button onClick={() => handleQuitar(producto.id)}>Quitar</button>
                                            </li>
                                        );
                                    } else {
                                        return null; 
                                    }
                                })
                            }



                        </ul>
                        <div className='pFactura1'>
                            <p className='pFactura'>Total  {total === null ? " ----     " : `${total}      `}
                                <button onClick={() => { handleCancelar() }}>Cancelar</button>
                                <button onClick={() => { handleFinalizarVenta() }}>Finalizar</button>

                            </p>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Esta es la parte del modal */}
            {mostrarModal && <ModalTicket closeModal={closeModal} nuevaVenta={nuevaVenta} carrito={carrito} detalleVenta={detalleVenta} dato={numFactura} abrir={true} modalVisible={modalVisible} />}
            <Footer />
        </div>
    )
}

export default Ventas