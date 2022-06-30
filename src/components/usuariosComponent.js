import React,{useState} from "react";
import { ListGroup,Row,Modal,Button,Form,Alert,Col,Tab,Sonnet } from "react-bootstrap";
import '../index.css';
import {crearUsuario} from "../apis/Users";



export default function UsuariosPanel({}){


const [usuario, setUsuario] = useState();
const [nombre, setNombre] = useState();
const [email, setEmail] = useState();
const [password, setPassword] = useState();
const [password2,setPassword2] = useState();
const [rol,setRol] = useState();
const[error, setError]=useState();

const [show, setShow] = useState(false);
const [show2, setShow2] = useState(false);
const [show3, setShow3] = useState(false);
const [validated, setValidated] = useState(false);

const handleClose = () => setShow(false);
const handleShow = () => setShow(true);
const handleClose2 = () => setShow2(false);
const handleShow2 = () => setShow2(true);

const errorMessage = () => {
    return (
    <div
        className="error"
        style={{
        display: error ? '' : 'none',
        }}>
        <Form.Label style={{color:"red"}}>{error}</Form.Label>
    </div>
    );
};

const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    if(!rol){
        event.preventDefault();
        event.stopPropagation();
    }
    if(password==password2){
        setValidated(true);
    }else{
        setError("Las contraseñas no coinciden");
    }
    if(rol&&usuario&&email&&(password===password2)&&nombre&&password&&password2){
        crearUsuario({
            usuario:usuario,
            email:email,
            password:password,
            rol:rol
          }).then(response=>{
              setValidated(false);
            if(response.request.status==200){
                setShow3(true)
              }else{
                  setError("No se pudo crear el usuario");
                  setShow2(true)
              }
          }).catch(error=>{
            setValidated(false);
            setError("No se pudo crear el usuario"+error);
            setShow2(true)
          })
        handleClose();
    }


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
                    <Modal.Title>Crear Cuenta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label style={{color:"black"}}>Nombre</Form.Label>
                            <Form.Control required type="textarea" placeholder="Nombre" onChange={e=>setNombre(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">Ingrese Nombre.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                            <Form.Label style={{color:"black"}}>Usuario</Form.Label>
                            <Form.Control required type="textarea" placeholder="Usuario" onChange={e=>setUsuario(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">Ingrese Usuario.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label style={{color:"black"}}>Email</Form.Label>
                            <Form.Control required type="email" placeholder="Email" onChange={e=>setEmail(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">Ingrese Email.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label style={{color:"black"}}>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                aria-describedby="passwordHelpBlock"
                                required
                                onChange={e=>setPassword(e.target.value)}
                            />
                            {errorMessage()}
                            <Form.Control.Feedback type="invalid">Ingrese Contraseña.</Form.Control.Feedback>                       
                         </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword2">
                            <Form.Label style={{color:"black"}}>Confirmar Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                aria-describedby="passwordHelpBlock"
                                required
                                onChange={e=>setPassword2(e.target.value)}
                            /> 
                            {errorMessage()}
                            <Form.Control.Feedback type="invalid">Ingrese Contraseña.</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicRol">
                            <Form.Label style={{color:"black"}}>Seleccione Rol</Form.Label>
                            <Form.Control as="select"
                                    onChange={e=>setRol(e.target.value)}
                                    defaultValue=""
                                    required
                                    >
                                    <option>Seleccione Un Rol</option>
                                    <option value="CAJERO">Cajero</option>
                                    <option value="ADMIN">Administrador</option>                          
                            </Form.Control>   
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
                <Alert.Heading>Usuario Creado</Alert.Heading>
                <p>
                Usuario Creado Exitosamente
                </p>
            </Alert>
            <button type="button" onClick={handleShow} style={{margin:"2%",width:"40%"}} className="btn btn-dark">Crear Cuenta</button>

        </Row>
        
    );
}