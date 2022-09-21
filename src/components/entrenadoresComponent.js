import React,{useMemo, useState} from "react";
import {Row,Modal,Button,Form,Alert} from "react-bootstrap";
import '../index.css';
import {actualizarEntrenador, crearEntrenador, deleteEntrenador} from "../apis/Entrenadores.js";
import { SketchPicker } from 'react-color';
import { useTable, useFilters, useSortBy } from "react-table";
import { useNavigate } from "react-router-dom";

export default function EntrenadoresPanel({data}){
const navigate = useNavigate();
const [filterInput, setFilterInput] = useState("");

const handleFilterChange = e => {
  const value = e.target.value || undefined;
  setFilter("nombre", value); // Update the show.name filter. Now our table will filter and show only the rows which have a matching value
  setFilterInput(value);
};
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
const [buttonName, setButtonName] = useState("Crear");
const [success, setSuccess]=useState();

const handleClose = () => {
    setDireccion("")
    setNombre("")
    setEmail("")
    setCedula("")
    setTelefono("")
    setColor("")
    setShow(false)};
const handleShow = () => setShow(true);

const handleShowUpdateEntrenador = e =>{
    setButtonName("Modificar")
    setNombre(e.cells[0].value);
    setCedula(e.cells[1].value)
    setTelefono(e.cells[2].value)
    setEmail(e.cells[3].value)
    setDireccion(e.cells[4].value)
    setColor(e.cells[5].value)
    handleShow();
}

const columns = useMemo(()=>[
    {
    Header: "Entrenadores",
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
            Header: "Color",
            accessor: "color"
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
  },useFilters, useSortBy);

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
        if(buttonName==="Modificar"){
            actualizarEntrenador({
                nombre:nombre,
                direccion:direccion,
                email:email,
                telefono:telefono,
                cedula:cedula,
                color:color
              }).then(response=>{
                  setValidated(false);
                if(response.request.status===200){
                    setShow3(true)
                  }else{
                      setError("No se pudo crear el entrenador: Verifique la información ingresada");
                      setShow2(true)
                  }
              }).catch(error=>{
                if(error.response.status===401){
                    localStorage.removeItem("token")
                   navigate("/")
                }else{
                    setValidated(false);
                    setError("No se pudo crear el entrenador: Verifique la información ingresada");
                    setShow2(true)
                }
              })
        }else{
            crearEntrenador({
                nombre:nombre,
                direccion:direccion,
                email:email,
                telefono:telefono,
                cedula:cedula,
                color:color
              }).then(response=>{
                  setValidated(false);
                if(response.request.status===200){
                    setShow3(true)
                  }else{
                      setError("No se pudo crear el entrenador: Verifique la información ingresada");
                      setShow2(true)
                  }
              }).catch(error=>{
                if(error.response.status===401){
                    localStorage.removeItem("token")
                   navigate("/")
                }
                else{
                    setValidated(false);
                    setError("No se pudo crear el entrenador: Verifique la información ingresada");
                    setShow2(true)
                }
              })
        }
        handleClose();
    }}
  };

  const handleDelete = () => {
    if(cedula){
        deleteEntrenador({
            cedula:cedula
          }).then(response=>{
              setValidated(false);
            if(response.request.status===200){
                setSuccess("borrado")
                setShow3(true)
              }else{
                  setError("No se pudo borrar el entrenador: Verifique que no esté asociado a ninguna sesion");
                  setShow2(true)
              }
          }).catch(error=>{
            if(error.response.status===401){
                localStorage.removeItem("token")
               navigate("/")
            }
            else{
                setValidated(false);
                setError("No se pudo borrar el entrenador: Verifique que no esté asociado a ninguna sesion");
                setShow2(true)
            }
          })
        }
        handleClose();
};

    return(
        <Row className="justify-content-md-center" style={{margin:"5%"}}>
            <input
            value={filterInput}
            onChange={handleFilterChange}
            placeholder={"Buscar Entrenador"}
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
                        <tr className="itemRow" {...row.getRowProps()} onClick={()=> { handleShowUpdateEntrenador(row);}}>
                        {row.cells.map(cell => {
                            if(cell.column.Header==='Color'){
                                return <td><div style={{background:cell.value,height:"20px",width:"20px", marginLeft:"40%", borderRadius:"50%"}}></div></td>
                            }
                            return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                        })}
                        </tr>
                    );
                    })}
                </tbody>
            </table>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Entrenador</Modal.Title>
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
                <Alert.Heading>Entrenador {success}</Alert.Heading>
                <p>
                Entrenador {success} Exitosamente
                </p>
            </Alert>
            <button type="button" onClick={()=>{setButtonName("Crear");handleShow()}} style={{margin:"2%",width:"40%"}} className="btn btn-dark">Crear Entrenador</button>

        </Row>
        
    );
}