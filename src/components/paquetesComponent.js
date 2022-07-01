import React,{useState} from "react";
import { ListGroup,Row,Modal,Button,Form,Alert,Col,Tab, InputGroup, Container } from "react-bootstrap";
import '../index.css';
import  {getProductos}  from "../apis/Productos";
import Select from 'react-select'
import { isNaN } from "formik";
import {crearPaquete} from "../apis/Paquetes"



export default function PaquetesPanel({}){

const [nombre, setNombre] = useState();
const [codigo, setCodigo] = useState();
const [precio,setPrecio] = useState();
const [productos, setProductos] = useState([]);
const [productosSeleccionados, setProductosSeleccionados] = useState([]);
const [productoSeleccionado, setProductoSeleccionado] = useState();
const [productoCarritoSeleccionado, setProductoCarritoSeleccionado] = useState();


const[error, setError]=useState();
const [precioCalculado,setPrecioCalculado]=useState(0);

const [show, setShow] = useState(false);
const [showProductosCarrito, setShowProductosCarrito] = useState(false);
const [show2, setShow2] = useState(false);
const [show3, setShow3] = useState(false);
const [validated, setValidated] = useState(false);

const handleClose = () => setShow(false);
const handleShow = () => {setShow(true);parseProductos()}




const [cantidad, setCantidad] = useState(1);

function handleShowProductosCarrito(){
    if(showProductosCarrito){
        setShowProductosCarrito(false);
    }else{
        setShowProductosCarrito(true);
    }

}

function eliminarProductoCarrito(){
    console.log(productoCarritoSeleccionado)
    if(productoCarritoSeleccionado.item){
        setProductosSeleccionados(productosSeleccionados.filter((_,i)=>i!==productoCarritoSeleccionado.index));
        setPrecioCalculado(precioCalculado-(productoCarritoSeleccionado.item.precio*productoCarritoSeleccionado.item.cantidad))
        setProductoCarritoSeleccionado({item:null,index:null})
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
function parseProductos(){
    let arrProductos = [];
    getProductos().then(result=>{
        result.data.productos.forEach(element=>{
            arrProductos.push(
                { value: element.codigo, label: element.nombre, precio:element.precio}
            )
        })
    })
    setProductos(arrProductos);
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
    if(codigo&&nombre&&productos&&precio){
        crearPaquete({
            nombre:nombre,
            codigo:codigo,
            productos:productosSeleccionados,
            precio:precio
          }).then(response=>{
              setValidated(false);
            if(response.request.status==200){
                setShow3(true)
              }else{
                  setError("No se pudo crear el paquete: Verifique la información ingresada");
                  setShow2(true)
              }
          }).catch(error=>{
            setValidated(false);
            setError("No se pudo crear el paquete: Verifique la información ingresada");
            setShow2(true)
          })
        setProductosSeleccionados([])
        setCantidad(0);
        setPrecioCalculado(0);
        handleClose();
    }}


  };

    return(
        <Row className="justify-content-md-center" style={{margin:"5%"}}>
            <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
                <Row>
                    <Col sm={5}>
                    <ListGroup>
                        <ListGroup.Item action href="#link1">
                        Paquete 1
                        </ListGroup.Item>
                        <ListGroup.Item action href="#link2">
                        Paquete 2
                        </ListGroup.Item>
                    </ListGroup>
                    </Col>
                    <Col sm={4}>
                    <Tab.Content>
                        <Tab.Pane eventKey="#link1">
                            <p>Información</p>
                        </Tab.Pane>
                        <Tab.Pane eventKey="#link2">
                            <p>Información</p>
                        </Tab.Pane>
                    </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear Paquete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label style={{color:"black"}}>Producto</Form.Label>
                            <Select options={productos} onChange={value=>setProductoSeleccionado(value)}></Select>
                            <Form.Label style={{color:"black"}}>Cantidad</Form.Label>
                            <Form.Control required type="number" placeholder="Cantidad"  onChange={e=>setCantidad(e.target.value)}/>
                            <Container>
                                <Row className="justify-content-md-center">
                                    <Col>
                                        <button type="button" onClick={agregarProducto} style={{margin:"3%",width:"45%", marginLeft:"40%"}} className="btn btn-dark">Agregar Producto</button>
                                    </Col>
                                    <Col>
                                        <button type="button" onClick={handleShowProductosCarrito} style={{margin:"3%",width:"45%"}} className="btn btn-dark">Ver Productos</button>
                                    </Col>
                                </Row>
                            </Container>
                            <ListGroup hidden={showProductosCarrito}>
                                {
                                    
                                    productosSeleccionados.map((item,index)=>(

                                        <ListGroup.Item action href={'#' + index}
                                        onClick={()=>setProductoCarritoSeleccionado({item:item,index:index})}>
                                            Nombre: {item.nombre}        
                                            <br></br>
                                            Cantidad: {item.cantidad}
                                        </ListGroup.Item>
                                    ))
                                }
                            <button type="button" onClick={eliminarProductoCarrito} style={{margin:"3%",width:"35%", marginLeft:"30%"}} className="btn btn-dark">Eliminar Producto del Carrito</button>
                            </ListGroup>

                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicNombre">
                            <Form.Label style={{color:"black"}}>Nombre</Form.Label>
                            <Form.Control required type="text" placeholder="Nombre" onChange={e=>setNombre(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">Ingrese Nombre</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicCodigo">
                            <Form.Label style={{color:"black"}}>Codigo</Form.Label>
                            <Form.Control required type="text" placeholder="Codigo" onChange={e=>setCodigo(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">Ingrese Codigo</Form.Control.Feedback>
                        </Form.Group>
                            
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                            <Form.Label style={{color:"black"}}>Precio</Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control aria-label="Precio" required type="number" placeholder="Precio" onChange={e=>setPrecio(e.target.value)}/>
                                <InputGroup.Text>Precio: $ {precioCalculado}</InputGroup.Text>
                            </InputGroup>
                            <Form.Control.Feedback type="invalid">Ingrese el Precio.</Form.Control.Feedback>
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
            <Alert show={show2} variant="danger" onClose={() => {setShow2(false);setError("");setValidated(false)}} dismissible>
                <Alert.Heading>Error</Alert.Heading>
                <p>
                {error}
                </p>
            </Alert>
            <Alert show={show3} variant="success" onClose={() => {setShow3(false);setError("");setValidated(false)}} dismissible>
                <Alert.Heading>Producto Creado</Alert.Heading>
                <p>
                Producto Creado Exitosamente
                </p>
            </Alert>
            <button type="button" onClick={handleShow} style={{margin:"2%",width:"40%"}} className="btn btn-dark">Crear Paquete</button>

        </Row>
        
    );
}