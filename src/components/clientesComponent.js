import React,{useState, useMemo} from "react";
import { ListGroup,Row,Modal,Button,Form,Alert,Col,Tab } from "react-bootstrap";
import '../index.css';
import {crearCliente, actualizarCliente, deleteCliente} from "../apis/Clientes"
import { useTable, useFilters } from "react-table";


export default function ClientesPanel({data}){

const [direccion, setDireccion] = useState();
const [nombre, setNombre] = useState();
const [email, setEmail] = useState();
const [cedula, setCedula] = useState();
const [telefono,setTelefono] = useState();
const [fechaNacimiento,setFechaNacimiento] = useState();
const[error, setError]=useState();

const [show, setShow] = useState(false);
const [show2, setShow2] = useState(false);
const [show3, setShow3] = useState(false);
const [validated, setValidated] = useState(false);
const [buttonName, setButtonName] = useState("Crear");
const [success, setSuccess]=useState();


const handleClose = () => {
    setDireccion("")
    setNombre("")
    setEmail("")
    setCedula("")
    setTelefono("")
    setFechaNacimiento("")
    setShow(false)};
const handleShow = () => setShow(true);

const handleShowUpdateCliente = e =>{
        setButtonName("Modificar")
        setNombre(e.cells[0].value);
        setCedula(e.cells[1].value)
        setTelefono(e.cells[2].value)
        setEmail(e.cells[3].value)
        setDireccion(e.cells[4].value)
        setFechaNacimiento(e.cells[5].value)
        handleShow();
}

const [filterInput, setFilterInput] = useState("");

const handleFilterChange = e => {
  const value = e.target.value || undefined;
  setFilter("nombre", value); // Update the show.name filter. Now our table will filter and show only the rows which have a matching value
  setFilterInput(value);
};
const columns = useMemo(()=>[
    {
    Header: "Clientes",
    columns:[
        {
            Header: "Nombre",
            accessor: "nombre"
        },
        {
            Header: "Cedula",
            accessor: "cedula"
        },
        {
            Header: "Telefono",
            accessor: "telefono"
        },
        {
            Header: "Email",
            accessor: "email"
        },
        {
            Header: "Direccion",
            accessor: "direccion"
        },
        {
            Header: "Fecha Nacimiento",
            accessor: "fecha_nacimiento"
        },
        {
            Header: "Edad",
            accessor: "edad"
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
  },useFilters);


const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    }
    else{
    setValidated(true);
    if(direccion&&nombre&&email&&cedula&&telefono){
        if(buttonName==="Modificar"){
            actualizarCliente({
                nombre:nombre,
                direccion:direccion,
                email:email,
                telefono:telefono,
                cedula:cedula,
                fechaNacimiento:fechaNacimiento
              }).then(response=>{
                  setValidated(false);
                if(response.request.status==200){
                    setShow3(true)
                    setSuccess("actualizado")
                  }else{
                      setError("No se pudo crear el cliente: Verifique la información ingresada");
                      setShow2(true)
                  }
              }).catch(error=>{
                setValidated(false);
                console.log(error)
                setError("No se pudo crear el cliente: Verifique la información ingresada");
                setShow2(true)
              })
        }else{
            crearCliente({
                nombre:nombre,
                direccion:direccion,
                email:email,
                telefono:telefono,
                cedula:cedula,
                fechaNacimiento:fechaNacimiento
              }).then(response=>{
                  setValidated(false);
                if(response.request.status==200){
                    setShow3(true)
                    setSuccess("creado")
                  }else{
                      setError("No se pudo crear el cliente: Verifique la información ingresada");
                      setShow2(true)
                  }
              }).catch(error=>{
                setValidated(false);
                setError("No se pudo crear el cliente: Verifique la información ingresada");
                setShow2(true)
              })
        }
        
        handleClose();
    }}
  };

  const handleDelete = () => {
    if(cedula){
        deleteCliente({
            cedula:cedula
          }).then(response=>{
              setValidated(false);
            if(response.request.status==200){
                setSuccess("borrado")
                setShow3(true)
              }else{
                  setError("No se pudo borrar el cliente: Verifique que no esté asociado a ninguna venta");
                  setShow2(true)
              }
          }).catch(error=>{
            setValidated(false);
            console.log(error)
            setError("No se pudo borrar el cliente: Verifique que no esté asociado a ninguna venta");
            setShow2(true)
          })
        }
        handleClose();
};

    return(
        <Row className="justify-content-md-center" style={{margin:"5%"}}>
            <input
            value={filterInput}
            onChange={handleFilterChange}
            placeholder={"Buscar Cliente"}
            />
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                        ))}
                    </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {
                    rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr className="itemRow" {...row.getRowProps()} onClick={()=> { handleShowUpdateCliente(row);}}>
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
                    <Modal.Title>Cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label style={{color:"black"}}>Nombre</Form.Label>
                            <Form.Control required type="textarea" defaultValue={nombre} placeholder="Nombre" onChange={e=>setNombre(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">Ingrese Nombre.</Form.Control.Feedback>
                        </Form.Group>


                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label style={{color:"black"}}>Email</Form.Label>
                            <Form.Control required type="email" defaultValue={email} placeholder="Email" onChange={e=>setEmail(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">Ingrese Email.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                            <Form.Label style={{color:"black"}}>Dirección</Form.Label>
                            <Form.Control required type="textarea" defaultValue={direccion} placeholder="Dirección" onChange={e=>setDireccion(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">Ingrese la dirección.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                            <Form.Label style={{color:"black"}}>Cédula</Form.Label>
                            <Form.Control required type="textarea" defaultValue={cedula} placeholder="Cédula" onChange={e=>setCedula(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">Ingrese la Cédula.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                            <Form.Label style={{color:"black"}}>Telefono</Form.Label>
                            <Form.Control required type="textarea" defaultValue={telefono} placeholder="Telefono" onChange={e=>setTelefono(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">Ingrese el Telefono.</Form.Control.Feedback>
                        </Form.Group> 
                        <Form.Group className="mb-3" controlId="exampleForm.ControlDatearea">
                            <Form.Label style={{color:"black"}}>Fecha Nacimiento</Form.Label>
                            <Form.Control required type="date" defaultValue={fechaNacimiento} placeholder="Fecha" onChange={e=>setFechaNacimiento(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">Ingrese la fecha de nacimiento.</Form.Control.Feedback>
                        </Form.Group> 
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>{buttonName}</Button>
                    {
                        buttonName==='Modificar' ?
                            <Button variant="danger" onClick={handleDelete}>Borrar</Button>:<div></div>
                        
                    }
                </Modal.Footer>
            </Modal>
            <Alert show={show2} variant="danger" onClose={() => {setShow2(false);setError("");setValidated(false)}} dismissible>
                <Alert.Heading>Error</Alert.Heading>
                <p>
                {error}
                </p>
            </Alert>
            <Alert show={show3} variant="success" onClose={() => {setShow3(false);setError("");setValidated(false)}} dismissible>
                <Alert.Heading>Cliente {success}</Alert.Heading>
                <p>
                Cliente {success} Exitosamente
                </p>
            </Alert>
            <button type="button" onClick={()=>{setButtonName("Crear");handleShow()}} style={{margin:"2%",width:"40%"}} className="btn btn-dark">Crear Cliente</button>

        </Row>
        
    );
}