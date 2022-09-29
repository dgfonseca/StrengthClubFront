import React,{useState, useMemo} from "react";
import '../index.css';
import { useTable, useFilters, useSortBy } from "react-table";
import { Row,Col,Form,Modal, Alert } from 'react-bootstrap';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { getContabilidadClientes, notificarClienteCorreo,notificarClientesCorreo } from "../apis/Clientes";
import { useNavigate } from "react-router-dom";





export default function ClientesContabilidadPanel({data2}){
const navigate = useNavigate();
const [fechaInicio, setFechaInicio]=useState("");
const [fechaFin, setFechaFin]=useState("");
const [cliente,setCliente]=useState("")
const [show, setShow]=useState(false)
const [show2, setShow2]=useState(false)
const [show3, setShow3]=useState(false)
const [error, setError]=useState("")
const [notificacion, setNotificacion]=useState(false);
const [data,setData]=useState(data2);

const handleShow = ()=>setShow(true);
const handleClose = ()=>setShow(false);

const filtrarClientes = ()=>{
    if(fechaFin&&fechaInicio){
        getContabilidadClientes({fechaInicio:fechaInicio,fechaFin:fechaFin}).then(response=>{
            if(response.request.status===200){
                setData(response.data.clientes)
              }else{
                  setError("No se pudo filtrar los clientes por fecha");
                  setShow2(true)
              }
          }).catch(error=>{
            if(error.response.status===401){
                localStorage.removeItem("token")
               navigate("/")
            }else{
                setError("No se pudo filtrar los clientes por fecha");
                setShow2(true)
            }
          })
    }else{
        setError("Elegir una fecha inicio y una fecha fin valida");
        setShow2(true)
    }
}
const handleSubmit = ()=>{
    if(!notificacion){
        notificarClienteCorreo({cedula:cliente,fechaInicio:fechaInicio,fechaFin:fechaFin}).then(response=>{
            if(response.request.status===200){
                setShow3(true)
              }else{
                  setError("No se pudo notificar el cliente");
                  setShow2(true)
              }
          }).catch(error=>{
            console.log(error)
            if(error.response.status===401){
                localStorage.removeItem("token")
               navigate("/")
            }else{
                setError("No se pudo Notificar el cliente");
                setShow2(true)
            }
          })
    }else{
        notificarClientesCorreo().then(response=>{
            if(response.request.status===200){
                setShow3(true)
              }else{
                  setError("No se pudo notificar los siguientes clientes: "+response.errores);
                  setShow2(true)
              }
          }).catch(error=>{
            if(error.response.status===401){
                localStorage.removeItem("token")
               navigate("/")
            }else{
                setError("No se pudo Notificar los clientes");
                setShow2(true)
            }
          })
    }
    setShow(false)
};
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
            Header: "Email",
            accessor: "email"
        },
        {
            Header: "Abonos",
            accessor: "abonos"
        },
        {
            Header: "Deudas",
            accessor: "debito"
        },
        {
            Header: "Saldo",
            accessor: "saldo"
        },
        {
            Header: "Notificar"
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


    return(
        <Row className="justify-content-md-center" style={{margin:"5%"}}>
            <Col>
            <Form noValidate>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlDatearea">
                            <Form.Label style={{color:"black"}}>Fecha Inicio</Form.Label>
                            <Form.Control required type="date" defaultValue={fechaInicio} placeholder="Fecha" onChange={e=>{setFechaInicio(e.target.value)}}/>
                            <Form.Control.Feedback type="invalid">Ingrese la fecha de Inicio.</Form.Control.Feedback>
                        </Form.Group>
                    </Form>
            </Col>
            <Col>
                <Form noValidate>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlDatearea">
                            <Form.Label style={{color:"black"}}>Fecha Fin</Form.Label>
                            <Form.Control required type="date" defaultValue={fechaFin} placeholder="Fecha" onChange={e=>setFechaFin(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">Ingrese la fecha de Fin.</Form.Control.Feedback>
                        </Form.Group>
                    </Form>
            </Col>
            <button type="button" onClick={()=>{filtrarClientes()}} style={{margin:"2%",width:"15%"}} className="btn btn-dark">Buscar</button>

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
                        <tr className="itemRow" {...row.getRowProps()} >
                        {row.cells.map(cell => {
                            if(cell.column.Header==='Notificar'){
                                return <td><Button variant="outlined" size="medium" color="success" endIcon={<SendIcon/>} onClick={()=>{handleShow();setCliente(row.cells[1].value);setNotificacion(false)}}></Button></td>
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
                    <Modal.Title>Notificar Clientes</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4 style={{color:"black"}}>¿Está seguro de enviar el correo?</h4>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="contained" color="error" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="contained" color="success" onClick={handleSubmit}>Confirmar</Button>
                </Modal.Footer>
            </Modal>
            <Alert show={show2} variant="danger" onClose={() => {setShow2(false);setError("");}} dismissible>
                <Alert.Heading>Error</Alert.Heading>
                <p>
                {error}
                </p>
            </Alert>
            <Alert show={show3} variant="success" onClose={() => {setShow3(false);setError("");}} dismissible>
                <Alert.Heading>Notificar Estado de Cuentas</Alert.Heading>
                <p>
                Se notificaron los clientes exitosamente
                </p>
            </Alert>
            <button type="button" onClick={()=>{handleShow();setNotificacion(true)}} style={{margin:"2%",width:"40%"}} className="btn btn-dark">Notificar Clientes</button>

        </Row>
        
    );
}