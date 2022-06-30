import React,{useState} from "react";
import { ListGroup,Row,Modal,Button,Form,Alert,Col,Tab } from "react-bootstrap";
import '../index.css';
import {crearEntrenador} from "../apis/Entrenadores.js";
import { SketchPicker } from 'react-color';




export default function EntrenadoresPanel({}){


const [direccion, setDireccion] = useState();
const [nombre, setNombre] = useState();
const [email, setEmail] = useState();
const [cedula, setCedula] = useState();
const [telefono,setTelefono] = useState();
const [color,setColor] = useState('#fff');
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
    if(direccion&&nombre&&email&&cedula&&telefono&&color){
        crearEntrenador({
            nombre:nombre,
            direccion:direccion,
            email:email,
            telefono:telefono,
            cedula:cedula,
            color:color
          }).then(response=>{
              setValidated(false);
            if(response.request.status==200){
                setShow3(true)
              }else{
                  setError("No se pudo crear el entrenador: Verifique la información ingresada");
                  setShow2(true)
              }
          }).catch(error=>{
            setValidated(false);
            setError("No se pudo crear el entrenador: Verifique la información ingresada");
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
                        Nicolas Gomez
                        </ListGroup.Item>
                        <ListGroup.Item action href="#link2">
                        Santiago Parra
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
                    <Modal.Title>Crear Entrenador</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label style={{color:"black"}}>Nombre</Form.Label>
                            <Form.Control required type="textarea" placeholder="Nombre" onChange={e=>setNombre(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">Ingrese Nombre.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label style={{color:"black"}}>Email</Form.Label>
                            <Form.Control required type="email" placeholder="Email" onChange={e=>setEmail(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">Ingrese Email.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                            <Form.Label style={{color:"black"}}>Dirección</Form.Label>
                            <Form.Control required type="textarea" placeholder="Dirección" onChange={e=>setDireccion(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">Ingrese la dirección.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                            <Form.Label style={{color:"black"}}>Cédula</Form.Label>
                            <Form.Control required type="textarea" placeholder="Cédula" onChange={e=>setCedula(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">Ingrese la Cédula.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                            <Form.Label style={{color:"black"}}>Telefono</Form.Label>
                            <Form.Control required type="textarea" placeholder="Telefono" onChange={e=>setTelefono(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">Ingrese el Telefono.</Form.Control.Feedback>
                        </Form.Group> 
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                            <Form.Label style={{color:"black"}}>Color</Form.Label>
                            <SketchPicker
                                color={ color }
                                onChangeComplete={(color)=>setColor(color.hex)}
                            />
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
                <Alert.Heading>Entrenador Creado</Alert.Heading>
                <p>
                Entrenador Creado Exitosamente
                </p>
            </Alert>
            <button type="button" onClick={handleShow} style={{margin:"2%",width:"40%"}} className="btn btn-dark">Crear Entrenador</button>

        </Row>
        
    );
}