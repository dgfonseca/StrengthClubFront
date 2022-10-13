import React,{useState, useMemo} from "react";
import '../index.css';
import { useTable, useFilters, useSortBy } from "react-table";
import { Row,Col,Form,Modal, Alert,ListGroup } from 'react-bootstrap';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { getContabilidadClientes, notificarClienteCorreo,getAbonosCliente } from "../apis/Clientes";
import { useNavigate } from "react-router-dom";
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { getContenidoVentas } from "../apis/Ventas";
import { getVentasCliente } from "../apis/Clientes";
import Box from '@mui/material/Box';
import { FixedSizeList } from 'react-window';






export default function ClientesContabilidadPanel({data2}){
const navigate = useNavigate();
const [ventas, setVentas] = useState([])
const [abonos, setAbonos] = useState([])
const [contenidoVenta, setContenidoVenta]=useState([])
const [fechaInicio, setFechaInicio]=useState("");
const [fechaFin, setFechaFin]=useState("");
const [cliente,setCliente]=useState("")
const [show, setShow]=useState(false)
const [show2, setShow2]=useState(false)
const [show3, setShow3]=useState(false)
const [showContenidoSaldo, setShowContenidoSaldo]=useState(false);
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
const handleSubmit = async()=>{
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
        let arr = []
        for(let cliente of data){
            try {
                let response = await notificarClienteCorreo(
                    {cedula:cliente.cedula,fechaInicio:fechaInicio,fechaFin:fechaFin}
                )
                if(response.request.status!==200){
                    arr.push("No se pudo notificar el cliente: "+cliente.nombre + ".")
                }
            } catch (error) {
                if(error.response.status===401){
                    localStorage.removeItem("token")
                   navigate("/")
                }else{
                    arr.push("No se pudo notificar el cliente: "+cliente.nombre  + ".")
                }
            }
            
        }
        if(arr.length>0){
            setError(arr);
            setShow2(true)
        }else{
            setShow3(true)
        }
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

  function renderRow(props) {
    const { index, style } = props;
  
    return (
      <ListItem style={style} key={index} component="div" disablePadding>
        <ListItemButton>
          <ListItemText primary={`Fecha: ${ventas[index].fecha}, Precio: ${ventas[index].valor}`} onClick={()=>{getContenidoVentas({id:ventas[index].id}).then(result=>{setContenidoVenta(result.data.contenido)})}} />
        </ListItemButton>
      </ListItem>
    );
  }
  function renderRow2(props) {
    const { index, style } = props;
  
    return (
      <ListItem style={style} key={index} component="div" disablePadding>
        <ListItemButton>
          <ListItemText primary={`Fecha: ${abonos[index].fecha}, Valor: ${abonos[index].valor}, Tipo: ${abonos[index].tipo}`} />
        </ListItemButton>
      </ListItem>
    );
  }

  const handleShowContabilidad =  async e =>{
    getVentasCliente({
        "cliente":e.cells[1].value
    }).then(result=>{
        setVentas(result.data.ventas)
        getAbonosCliente({
            "cliente":e.cells[1].value
        }).then(result=>{
            setAbonos(result.data.abonos)
            console.log(result.data.abonos)
            setShowContenidoSaldo(true)
        }).catch(error=>{
            if(error.response.status===401){
                localStorage.removeItem("token")
               navigate("/")
            }
        })
    }).catch(error=>{
        if(error.response.status===401){
            localStorage.removeItem("token")
           navigate("/")
        }else{
            setError("No se pudo cargar la información del cliente")
            setShow2(true)
        }
    })
}


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
                        <tr className="itemRow" {...row.getRowProps()} onDoubleClick={async ()=> {
                            await handleShowContabilidad(row);}}>
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
            <Modal show={showContenidoSaldo} onHide={()=>{setShowContenidoSaldo(false);setContenidoVenta([])}} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label style={{color:"black"}}>Compras</Form.Label>
                            <Box
                                sx={{ width: '100%', height: 200, maxWidth: 400, bgcolor: 'background.paper' }}
                                >
                                <FixedSizeList
                                    height={200}
                                    width={400}
                                    itemSize={50}
                                    itemCount={ventas.length}
                                    overscanCount={5}
                                >
                                    {renderRow}
                                </FixedSizeList>
                            </Box>
                            <Form.Label style={{color:"black"}}>Contenido</Form.Label>
                            <ListGroup>
                                {
                                    contenidoVenta.map((item,index)=>(
                                        <ListGroup.Item action href={'#' + index}>
                                            Codigo: {item.codigo}
                                            <br></br>
                                            Nombre: {item.nombre}        
                                            <br></br>
                                            Cantidad: {item.cantidad}
                                        </ListGroup.Item>
                                    ))
                                }
                            </ListGroup>
                        </Form.Group> 
                        <Form.Group>
                            <Form.Label style={{color:"black"}}>Abonos</Form.Label>
                            <Box
                                sx={{ width: '100%', height: 200, maxWidth: 400, bgcolor: 'background.paper' }}
                                >
                                <FixedSizeList
                                    height={200}
                                    width={400}
                                    itemSize={50}
                                    itemCount={abonos.length}
                                    overscanCount={5}
                                >
                                    {renderRow2}
                                </FixedSizeList>
                            </Box>
                        </Form.Group> 
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>{setShowContenidoSaldo(false);setContenidoVenta([])}}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
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