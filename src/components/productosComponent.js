import React,{useState} from "react";
import { ListGroup,Row,Modal,Button,Form,Alert,Col,Tab, InputGroup } from "react-bootstrap";
import '../index.css';
import {crearProducto} from "../apis/Productos";



export default function ProductosPanel({}){


const [nombre, setNombre] = useState();
const [codigo, setCodigo] = useState();
const [descripcion, setDescripcion] = useState();
const [inventario, setInventario] = useState();
const [precio,setPrecio] = useState();
const[error, setError]=useState();

const [show, setShow] = useState(false);
const [show2, setShow2] = useState(false);
const [show3, setShow3] = useState(false);
const [validated, setValidated] = useState(false);

const handleClose = () => setShow(false);
const handleShow = () => setShow(true);


const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    }
    else{
    setValidated(true);
    if(codigo&&nombre&&descripcion&&inventario&&precio){
        crearProducto({
            nombre:nombre,
            codigo:codigo,
            descripcion:descripcion,
            inventario:inventario,
            precio:precio
          }).then(response=>{
              setValidated(false);
            if(response.request.status==200){
                setShow3(true)
              }else{
                  setError("No se pudo crear el producto: Verifique la información ingresada");
                  setShow2(true)
              }
          }).catch(error=>{
            setValidated(false);
            setError("No se pudo crear el producto: Verifique la información ingresada");
            setShow2(true)
          })
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
                        Proteina Bi Pro
                        </ListGroup.Item>
                        <ListGroup.Item action href="#link2">
                        Creatina
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
                    <Modal.Title>Crear Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label style={{color:"black"}}>Nombre</Form.Label>
                            <Form.Control required type="textarea" placeholder="Nombre" onChange={e=>setNombre(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">Ingrese Nombre.</Form.Control.Feedback>
                        </Form.Group>


                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label style={{color:"black"}}>Codigo</Form.Label>
                            <Form.Control required type="email" placeholder="Codigo" onChange={e=>setCodigo(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">Ingrese Codigo</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                            <Form.Label style={{color:"black"}}>Descripcion</Form.Label>
                            <Form.Control required type="textarea" placeholder="Descripcion" onChange={e=>setDescripcion(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">Ingrese la Descripcion.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                            <Form.Label style={{color:"black"}}>Inventario</Form.Label>
                            <Form.Control required type="number" placeholder="Inventario" onChange={e=>setInventario(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">Ingrese el Inventario.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                            <Form.Label style={{color:"black"}}>Precio</Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control aria-label="Precio" required type="number" placeholder="Precio" onChange={e=>setPrecio(e.target.value)}/>
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
            <button type="button" onClick={handleShow} style={{margin:"2%",width:"40%"}} className="btn btn-dark">Crear Producto</button>

        </Row>
        
    );
}