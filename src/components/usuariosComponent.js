import React,{useState,useMemo} from "react";
import { ListGroup,Row,Modal,Button,Form,Alert,Col,Tab,Sonnet } from "react-bootstrap";
import '../index.css';
import {crearUsuario, getUsuarios, actualizarUsuario} from "../apis/Users";
import { useTable, useFilters, useSortBy } from "react-table";
import { useNavigate } from "react-router-dom";

export default function UsuariosPanel({data, onChange}){
const navigate = useNavigate();

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
const [show4, setShow4] = useState(false);
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

const [filterInput, setFilterInput] = useState("");

const handleFilterChange = e => {
  const value = e.target.value || undefined;
  setFilter("nombre", value);
  setFilterInput(value);
};
const columns = useMemo(()=>[
    {
    Header: "Usuarios",
    columns:[
        {
            Header: "Usuario",
            accessor: "usuario"
        },
        {
            Header: "Email",
            accessor: "email"
        },
        {
            Header: "Rol",
            accessor: "rol"
        }
    ],
}],[]);
const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups, if your table has groupings
    rows, // rows for the table based on the data passed
    prepareRow,
    setFilter
  } = useTable({
    columns,
    data
  },useFilters,useSortBy);



const handleShowUpdateUsuario = (row)=>{
    setUsuario(row.cells[0].value)
    setEmail(row.cells[1].value)
    setShow4(true)
}  

const handleSubmitCambiar = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    if(password==password2){
        setValidated(true);
    }else{
        setError("Las contraseñas no coinciden");
    }
    if(usuario&&email&&(password===password2)&&password&&password2){
        actualizarUsuario({
            usuario:usuario,
            email:email,
            password:password
          }).then(response=>{
              setValidated(false);
            if(response.request.status==200){
                setShow3(true)
                getUsuarios().then(response=>{
                    onChange(response.data.usuarios)
                })
              }else{
                  setError("No se pudo actualizar el usuario");
                  setShow2(true)
              }
          }).catch(error=>{
            if(error.response.status===401){
                localStorage.removeItem("token")
               navigate("/")
            }else{
                setValidated(false);
                setError("No se pudo crear el usuario");
                setShow2(true)
            }
          })
        setShow4(false);
    }
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
                getUsuarios().then(response=>{
                    onChange(response.data.usuarios)
                })
              }else{
                  setError("No se pudo crear el usuario");
                  setShow2(true)
              }
          }).catch(error=>{
            if(error.response.status===401){
                localStorage.removeItem("token")
               navigate("/")
            }else{
                setValidated(false);
                setError("No se pudo crear el usuario");
                setShow2(true)
            }
          })
        handleClose();
    }
  };
    return(
        <Row className="justify-content-md-center" style={{margin:"5%"}}>
            <input
            value={filterInput}
            onChange={handleFilterChange}
            placeholder={"Buscar Usuario"}
            />
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render("Header")}</th>
                        ))}
                    </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {
                    rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr className="itemRow" {...row.getRowProps()} onClick={async ()=> {
                             handleShowUpdateUsuario(row);}}>
                        {row.cells.map(cell => {
                            return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                        })}
                        </tr>
                    );
                    })}
                </tbody>
            </table>
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
            <Modal show={show4} onHide={()=>{setShow4(false)}} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Actualizar Cuenta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmitCambiar}>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                            <Form.Label style={{color:"black"}}>Usuario</Form.Label>
                            <Form.Control required type="textarea" placeholder="Usuario" defaultValue={usuario} disabled/>
                            <Form.Control.Feedback type="invalid">Ingrese Usuario.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label style={{color:"black"}}>Email</Form.Label>
                            <Form.Control required type="email" placeholder="Email" onChange={e=>setEmail(e.target.value)} defaultValue={email}/>
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
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>{setShow4(false)}}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleSubmitCambiar}>Cambiar Usuario</Button>
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