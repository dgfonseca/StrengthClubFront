import React, {useState} from "react";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Container,Row,Col } from 'react-bootstrap';
import { ListGroup,Modal,Button,Form,Alert, InputGroup } from "react-bootstrap";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Select from 'react-select'
import  {getClientes} from "../apis/Clientes";
import  {crearSesion} from "../apis/Sesiones"
import {getEntrenadores} from "../apis/Entrenadores"
import {getProductosHabilitados} from "../apis/Productos";
import TimePicker from 'react-time-picker';
import DatePicker from 'react-date-picker';
import { registrarVenta, registrarAbono } from "../apis/Ventas";
import { getPaquetes } from "../apis/Paquetes";





export default function HomePane(props){

 
    const [cliente,setCliente]=useState();
    const [entrenador,setEntrenador]=useState();
    const [fecha,setFecha]=useState();
    const [hora, setHora]=useState();

    const [clientes,setClientes]=useState([]);
    const [entrenadores,setEntrenadores]=useState([]);
    const [productos, setProductos] = useState([]);
    const [paquetes, setPaquetes]= useState([]);
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState();
    const [paqueteSeleccionado, setPaqueteSeleccionado] = useState();
    const [paquetesSeleccionados, setPaquetesSeleccionados] = useState([]);
    const [productoCarritoSeleccionado, setProductoCarritoSeleccionado] = useState();
    const [paqueteCarritoSeleccionado, setPaqueteCarritoSeleccionado] = useState();
    const [cantidad, setCantidad] = useState(1);
    const [cantidadPaquete, setCantidadPaquete] = useState(1);

    const [precioCalculado,setPrecioCalculado]=useState(0);

    const [showProductosCarrito, setShowProductosCarrito] = useState(false);
    const [showPaquetesCarrito, setShowPaquetesCarrito] = useState(false);
    const [showVenta, setShowVenta]=useState();
    const [show, setShow]=useState();
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const [show4, setShow4] = useState(false);
    const [abono,setAbono]= useState(0);
    const[error, setError]=useState();
    const[success, setSuccess]=useState("Sesion Creada/Modificada Exitosamente");



    
    const handleClose = () => {setShow(false);setAbono(0);setCliente("")}
    const handleClose4 = () => {setShow4(false);setCliente("");setAbono(0)}
    const handleCloseVenta = () => {setShowVenta(false);setProductosSeleccionados([]);setPaquetesSeleccionados([]);setCantidad(1);setPrecioCalculado(0)};
    const handleShow = () => {setShow(true);parseClientes();parseEntrenadores();}; 
    const handleShow4 = () =>{setShow4(true);parseClientes()}
    const handleShowVenta = () => {setShowVenta(true);parseClientes();parseProductos();parsePaquetes();}; 
    const [validated, setValidated] = useState(false);


    function handleShowProductosCarrito(){
        if(showProductosCarrito){
            setShowProductosCarrito(false);
        }else{
            setShowProductosCarrito(true);
        }
    
    }

    function handleShowPaquetesCarrito(){
        if(showPaquetesCarrito){
            setShowPaquetesCarrito(false);
        }else{
            setShowPaquetesCarrito(true);
        }
    
    }
    
    function eliminarProductoCarrito(){
        if(productoCarritoSeleccionado.item){
            setProductosSeleccionados(productosSeleccionados.filter((_,i)=>i!==productoCarritoSeleccionado.index));
            setPrecioCalculado(precioCalculado-(productoCarritoSeleccionado.item.precio*productoCarritoSeleccionado.item.cantidad))
            setProductoCarritoSeleccionado({item:null,index:null})
        }
        if(isNaN(precioCalculado)){
            setPrecioCalculado(0)
        }
    }

    function eliminarPaqueteCarrito(){
        if(paqueteCarritoSeleccionado.item){
            setPaquetesSeleccionados(paquetesSeleccionados.filter((_,i)=>i!==paqueteCarritoSeleccionado.index));
            setPrecioCalculado(precioCalculado-(paqueteCarritoSeleccionado.item.precio*paqueteCarritoSeleccionado.item.cantidad))
            setPaqueteCarritoSeleccionado({item:null,index:null})
        }
        if(isNaN(precioCalculado)){
            setPrecioCalculado(0)
        }
    }
    function agregarProducto(){
        setProductosSeleccionados([...productosSeleccionados,{
            nombre:productoSeleccionado.label,
            codigo:productoSeleccionado.value,
            precio:productoSeleccionado.precio,
            cantidad:cantidad
        }]);
        setPrecioCalculado(precioCalculado+(productoSeleccionado.precio*cantidad))
    }

    function agregarPaquete(){
        setPaquetesSeleccionados([...paquetesSeleccionados,{
            nombre:paqueteSeleccionado.label,
            codigo:paqueteSeleccionado.value,
            precio:paqueteSeleccionado.precio,
            cantidad:cantidadPaquete
        }]);
        setPrecioCalculado(precioCalculado+(paqueteSeleccionado.precio*cantidad))
    }

function parsePaquetes(){
    let arrPaquetes=[];
    getPaquetes().then(result=>{
        result.data.paquetes.forEach(element=>{
            arrPaquetes.push(
                { value: element.codigo, label: element.nombre, precio:element.precio}
            )
        })
        setPaquetes(arrPaquetes)
    })
}
function parseProductos(){
    let arrProductos = [];
    getProductosHabilitados().then(result=>{
        result.data.productos.forEach(element=>{
            arrProductos.push(
                { value: element.codigo, label: element.nombre, precio:element.precio}
            )
        })
    })
    setProductos(arrProductos);
}
    function parseClientes(){
        getClientes().then(result=>{
            let showClientes = []
            result.data.clientes.forEach(element => {
                showClientes.push(
                    { value: element.cedula, label: element.nombre}
                )
            });
            setClientes(showClientes)
        });
        
    }
    function parseEntrenadores(){
        getEntrenadores().then(result=>{
            let showEntrenadores = []
            result.data.entrenadores.forEach(element => {
                showEntrenadores.push(
                    { value: element.cedula, label: element.nombre}
                )
            });
            setEntrenadores(showEntrenadores)
        });
        
    }

        const handleSubmitAbono = (event)=>{
            const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
          setValidated(true);
        }else{
            if(cliente&&abono){
                registrarAbono({
                    cliente:cliente.value,
                    abono:abono
                }).then(response=>{
                    setValidated(false);
                if(response.request.status===200){
                    setSuccess("Abono registrado exitosamente")
                    setShow3(true)
                  }else{
                      setError("No se pudo registrar el abono: Verifique la información ingresada");
                      setShow2(true)
                  }
                }).catch(error=>{
                    setValidated(false);
                    setError(error.response.data.message);
                    setShow2(true)})
            }else{
                setError("No se pudo registrar el abono: Verifique la información ingresada");
                setShow2(true)
            }
        }
        handleClose4()
    }

    const handleSubmitRegistrarVenta = ()=>{
        if(cliente&&productosSeleccionados&&paquetesSeleccionados){
            registrarVenta({
                cliente:cliente.value,
                productos:productosSeleccionados,
                paquetes:paquetesSeleccionados,
                valor:precioCalculado
            }).then(response=>{
                setValidated(false);
              if(response.request.status===200){
                  setSuccess("Venta registrada correctamente")
                  setShow3(true)
                }else{
                    setError("No se pudo registrar la venta: Verifique la información ingresada");
                    setShow2(true)
                }
            }).catch(error=>{
                setValidated(false);
                setError(error.response.data.message);
                setShow2(true)
              })
        }
        handleCloseVenta()
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
          setValidated(true);
        }
        else{
        setValidated(true);
        let partsDate = fecha.toString().split(" ");
        let months = {
            Jan: "01",
            Feb: "02",
            Mar: "03",
            Apr: "04",
            May: "05",
            Jun: "06",
            Jul: "07",
            Aug: "08",
            Sep: "09",
            Oct: "10",
            Nov: "11",
            Dec: "12"
          };
        let date = partsDate[3]+"-"+months[partsDate[1]]+"-"+partsDate[2]+" "+hora

        if(cliente&&entrenador&&fecha&&hora){
            crearSesion({
                cliente:cliente.value,
                entrenador:entrenador.value,
                fecha:date,
                asistio:true
              }).then(response=>{
                  setValidated(false);
                if(response.request.status===200){
                    setSuccess("Abono Registrado Exitosamente")
                    setShow3(true)
                  }else{
                        setSuccess("Abono Registrado Exitosamente")
                      setError("No se pudo crear la sesion: Verifique la información ingresada");
                      setShow2(true)
                  }
              }).catch(error=>{
                setValidated(false);
                setError("No se pudo crear la sesion: Verifique la información ingresada");
                setShow2(true)
              })
            handleClose();
        
            }
        }
      };


    return(
            <Container>
                <Row style={{padding:"1%"}}>
                    <Col className="col-sm">
                        <Alert show={show2} variant="danger" onClose={() => {setShow2(false);setError("");setValidated(false);}} dismissible>
                            <Alert.Heading>Error</Alert.Heading>
                            <p>
                            {error}
                            </p>
                        </Alert>
                        <Alert show={show3} variant="success" onClose={() => {setShow3(false);setError("");setValidated(false)}} dismissible>
                            <Alert.Heading>Operación exitosa</Alert.Heading>
                            <p>
                            {success}
                            </p>
                        </Alert>
                    </Col>
                </Row>
                <Row style={{padding:"1%"}}>
                <Col className="col-sm">
                        <button type="button" onClick={handleShow4} style={{margin:"2%",width:"40%"}} className="btn btn-dark">Registrar abono</button>
                        <Modal show={show4} onHide={handleClose4} backdrop="static" keyboard={false}>
                            <Modal.Header closeButton>
                                <Modal.Title>Registrar Abono</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form noValidate validated={validated} onSubmit={handleSubmitAbono}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                        <Form.Label style={{color:"black"}}>Cliente</Form.Label>
                                        <Select options={clientes} onChange={value=>setCliente(value)}></Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                                        <Form.Label style={{color:"black"}}>Precio</Form.Label>
                                        <Form.Control required type="number" placeholder="Precio" defaultValue={0} onChange={e=>setAbono(e.target.value)}/>
                                        <Form.Control.Feedback type="invalid">Precio.</Form.Control.Feedback>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose4}>
                                    Cerrar
                                </Button>
                                <Button variant="primary" onClick={handleSubmitAbono}>Registrar</Button>
                            </Modal.Footer>
                        </Modal>
                    </Col>
                    <Col className="col-sm">
                        <button type="button" onClick={handleShow} style={{margin:"2%",width:"40%"}} className="btn btn-dark">Agendar Sesiones</button>
                        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                            <Modal.Header closeButton>
                                <Modal.Title>Agendar Sesion</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                        <Form.Label style={{color:"black"}}>Cliente</Form.Label>
                                        <Select options={clientes} onChange={value=>setCliente(value)}></Select>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label style={{color:"black"}}>Entrenador</Form.Label>
                                        <Select options={entrenadores} onChange={value=>setEntrenador(value)}></Select>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                                        <Form.Label style={{color:"black"}}>Fecha</Form.Label>
                                        <DatePicker onChange={value=>setFecha(value)} value={fecha} />
                                        <TimePicker onChange={value=>setHora(value)} value={hora} />
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Cerrar
                                </Button>
                                <Button variant="primary" onClick={handleSubmit}>Crear</Button>
                            </Modal.Footer>
                        </Modal>
                    </Col>
                    <Col className="col-sm">
                        <button type="button" onClick={handleShowVenta} style={{margin:"2%",width:"40%"}} className="btn btn-dark">Registrar Venta</button>
                        <Modal show={showVenta} onHide={handleCloseVenta} backdrop="static" keyboard={false}>
                            <Modal.Header closeButton>
                                <Modal.Title>Registrar Venta</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                                        <Form.Label style={{color:"black"}}>Cliente</Form.Label>
                                        <Select options={clientes} onChange={value=>setCliente(value)}></Select>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                        <Form.Label style={{color:"black"}}>Producto</Form.Label>
                                        <Select options={productos} onChange={value=>setProductoSeleccionado(value)}></Select>
                                        <Form.Label style={{color:"black"}}>Cantidad</Form.Label>
                                        <Form.Control required type="number" placeholder="Cantidad"  onChange={e=>setCantidad(e.target.value)}/>
                                        <Container>
                                            <Row className="justify-content-md-center">
                                                <Col>
                                                    <button type="button" onClick={agregarProducto} style={{margin:"3%",width:"80%", marginLeft:"20%"}} className="btn btn-dark">Agregar Producto</button>
                                                </Col>
                                                <Col>
                                                    <button type="button" onClick={handleShowProductosCarrito} style={{margin:"3%",width:"80%"}} className="btn btn-dark">Ver Productos</button>
                                                </Col>
                                            </Row>
                                        </Container>
                                        <ListGroup hidden={showProductosCarrito}>
                                            {
                                                
                                                productosSeleccionados.map((item,index)=>(

                                                    <ListGroup.Item action href={'#producto' + index} style={{backgroundColor:"lightgray"}}
                                                    onClick={()=>setProductoCarritoSeleccionado({item:item,index:index})}>
                                                        Nombre: {item.nombre}        
                                                        <br></br>
                                                        Cantidad: {item.cantidad}
                                                    </ListGroup.Item>
                                                ))
                                            }
                                        <button type="button" onClick={eliminarProductoCarrito} style={{margin:"3%",width:"80%", marginLeft:"11%"}} className="btn btn-dark">Eliminar Producto del Carrito</button>
                                        </ListGroup>

                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                        <Form.Label style={{color:"black"}}>Paquete</Form.Label>
                                        <Select options={paquetes} onChange={value=>setPaqueteSeleccionado(value)}></Select>
                                        <Form.Label style={{color:"black"}}>Cantidad</Form.Label>
                                        <Form.Control required type="number" placeholder="Cantidad"  onChange={e=>setCantidadPaquete(e.target.value)}/>
                                        <Container>
                                            <Row className="justify-content-md-center">
                                                <Col>
                                                    <button type="button" onClick={agregarPaquete} style={{margin:"3%",width:"80%", marginLeft:"20%"}} className="btn btn-dark">Agregar Paquete</button>
                                                </Col>
                                                <Col>
                                                    <button type="button" onClick={handleShowPaquetesCarrito} style={{margin:"3%",width:"80%"}} className="btn btn-dark">Ver Paquetes</button>
                                                </Col>
                                            </Row>
                                        </Container>
                                        <ListGroup hidden={showPaquetesCarrito}>
                                            {
                                                
                                                paquetesSeleccionados.map((item,index)=>(

                                                    <ListGroup.Item action href={'#paquete' + index} style={{backgroundColor:"lightgray"}}
                                                    onClick={()=>setPaqueteCarritoSeleccionado({item:item,index:index})}>
                                                        Nombre: {item.nombre}        
                                                        <br></br>
                                                        Cantidad: {item.cantidad}
                                                    </ListGroup.Item>
                                                ))
                                            }
                                        <button type="button" onClick={eliminarPaqueteCarrito} style={{margin:"3%",width:"80%", marginLeft:"11%"}} className="btn btn-dark">Eliminar Paquete del Carrito</button>
                                        </ListGroup>

                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                                        <Form.Label style={{color:"black"}}>Precio</Form.Label>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text>$</InputGroup.Text>
                                            <InputGroup.Text>Precio: $ {precioCalculado}</InputGroup.Text>
                                        </InputGroup>
                                    </Form.Group> 
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseVenta}>
                                    Cerrar
                                </Button>
                                <Button variant="primary" onClick={handleSubmitRegistrarVenta}>Registrar</Button>
                            </Modal.Footer>
                        </Modal>
                    </Col>
                </Row>
            </Container>  
  );

}
