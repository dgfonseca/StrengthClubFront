import React,{useState, useMemo, setState} from "react";
import { ListGroup,Row,Modal,Button,Form,Alert,Col,Tab } from "react-bootstrap";
import '../index.css';
import {crearCliente, actualizarCliente, deleteCliente, getVentasCliente, getClientes} from "../apis/Clientes"
import { useTable, useFilters, useSortBy } from "react-table";
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';
import { getContenidoVentas } from "../apis/Ventas";
import { useNavigate } from "react-router-dom";




export default function ClientesPanel({data,onChange}){
const navigate = useNavigate();
const [direccion, setDireccion] = useState();
const [nombre, setNombre] = useState();
const [email, setEmail] = useState();
const [cedula, setCedula] = useState();
const [telefono,setTelefono] = useState();
const [fechaNacimiento,setFechaNacimiento] = useState();
const [anticipado, setAnticipado]=useState(true);
const [habilitado, setHabilitado]=useState(true);
const[error, setError]=useState();

const [show, setShow] = useState(false);
const [show2, setShow2] = useState(false);
const [show3, setShow3] = useState(false);
const [validated, setValidated] = useState(false);
const [buttonName, setButtonName] = useState("Crear");
const [success, setSuccess]=useState();
const [precioSesion, setPrecioSesion]=useState();

const [ventas,setVentas] = useState([]);
const [contenidoVenta, setContenidoVenta] = useState([]);


const handleClose = () => {
    setDireccion("")
    setNombre("")
    setEmail("")
    setCedula("")
    setTelefono("")
    setFechaNacimiento("")
    setContenidoVenta([])
    setAnticipado(true)
    setVentas([])
    setPrecioSesion(null)
    setHabilitado(true);
    setShow(false)};
const handleShow = () => setShow(true);

const handleShowUpdateCliente =  async e =>{
        setCedula(e.cells[1].value);
        getVentasCliente({
            "cliente":e.cells[1].value
        }).then(result=>{
            setVentas(result.data.ventas)
            setButtonName("Modificar")
            setNombre(e.cells[0].value);
            setTelefono(e.cells[2].value)
            setEmail(e.cells[3].value)
            setDireccion(e.cells[4].value)
            setFechaNacimiento(e.cells[5].value)
            setAnticipado(e.cells[7].value)
            setPrecioSesion(e.cells[8].value)
            setHabilitado(e.cells[9].value)
            handleShow()
        }).catch(error=>{
            if(error.response.status===401){
                localStorage.removeItem("token")
               navigate("/")
            }
        })
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
        },
        {
            Header: "Pago",
            accessor: "anticipado"
        },
        {
            Header: "Precio Sesion",
            accessor: "precio_sesion"
        },
        {
            Header: "Habilitado",
            accessor: "habilitado"
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
    if(direccion&&nombre&&email&&cedula&&telefono){
        if(buttonName==="Modificar"){
            actualizarCliente({
                nombre:nombre,
                direccion:direccion,
                email:email,
                telefono:telefono,
                cedula:cedula,
                fechaNacimiento:fechaNacimiento,
                anticipado:anticipado,
                precioSesion:precioSesion,
                habilitado:habilitado
              }).then(response=>{
                  setValidated(false);
                if(response.request.status==200){
                    setShow3(true)
                    setSuccess("actualizado")
                    getClientes().then(response=>{
                        onChange(response.data.clientes)
                    })
                  }else{
                      setError("No se pudo crear el cliente: Verifique la información ingresada");
                      setShow2(true)
                  }
              }).catch(error=>{
                console.log(error)
                if(error.response.status===401){
                    localStorage.removeItem("token")
                   navigate("/")
                }else{
                    setValidated(false);
                    setError("No se pudo crear el cliente: Verifique la información ingresada");
                    setShow2(true)
                }
              })
        }else{
            crearCliente({
                nombre:nombre,
                direccion:direccion,
                email:email,
                telefono:telefono,
                cedula:cedula,
                fechaNacimiento:fechaNacimiento,
                anticipado:anticipado
              }).then(response=>{
                  setValidated(false);
                if(response.request.status==200){
                    setShow3(true)
                    setSuccess("creado")
                    getClientes().then(response=>{
                        onChange(response.data.clientes)
                    })
                  }else{
                      setError("No se pudo crear el cliente: Verifique la información ingresada");
                      setShow2(true)
                  }
              }).catch(error=>{
                if(error.response.status===401){
                    localStorage.removeItem("token")
                    navigate("/")
                }else{
                    setValidated(false);
                    setError("No se pudo crear el cliente: Verifique la información ingresada");
                    setShow2(true)
                }
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
                getClientes().then(response=>{
                    onChange(response.data.clientes)
                })
              }else{
                  setError("No se pudo borrar el cliente: Verifique que no esté asociado a ninguna venta");
                  setShow2(true)
              }
          }).catch(error=>{
            if(error.response.status===401){
                localStorage.removeItem("token")
               navigate("/")
            }else{
                setValidated(false);
                setError("No se pudo borrar el cliente: Verifique que no esté asociado a ninguna venta");
                setShow2(true)
            }
          })
        }
        handleClose();
};

function renderRow(props) {
    const { index, style } = props;
  
    return (
      <ListItem style={style} key={index} component="div" disablePadding>
        <ListItemButton>
          <ListItemText primary={`Fecha: ${ventas[index].fecha}, Precio: ${ventas[index].precio}$`} onClick={()=>{getContenidoVentas({id:ventas[index].id}).then(result=>{setContenidoVenta(result.data.contenido)})}} />
        </ListItemButton>
      </ListItem>
    );
  }

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
                            await handleShowUpdateCliente(row);}}>
                        {row.cells.map(cell => {
                            if(cell.column.Header=="Pago"){
                                if(cell.value){
                                    return <td >Anticipado</td>;
                                }else{
                                    return <td>Vencido</td>;
                                }
                            }
                            if(cell.column.Header==='Habilitado'){
                                if(cell.value){
                                    return <td><div style={{background:"green",height:"20px",width:"20px", marginLeft:"40%", borderRadius:"50%"}}></div></td>
                                }else{
                                    return <td><div style={{background:"red",height:"20px",width:"20px", marginLeft:"40%", borderRadius:"50%"}}></div></td>
                                }
                            }
                            if(cell.column.Header==="Precio Sesion" && (cell.value===null||cell.value===0||cell.value===undefined)){
                                return <td>N/A</td>
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
                            <Form.Control required type="date" defaultValue={fechaNacimiento} placeholder="Fecha" onChange={e=>{setFechaNacimiento(e.target.value)}}/>
                            <Form.Control.Feedback type="invalid">Ingrese la fecha de nacimiento.</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                                        <Form.Label style={{color:"black"}}>Anticipado:</Form.Label>
                                        <Form.Check
                                        defaultChecked={anticipado}
                                        onChange={event=>setAnticipado(event.target.checked)}
                                        />
                        </Form.Group>
                        <Form.Group className="mb-3">
                                        <Form.Label style={{color:"black"}}>Habilitado:</Form.Label>
                                        <Form.Check
                                        defaultChecked={habilitado}
                                        onChange={event=>setHabilitado(event.target.checked)}
                                        />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                                        <Form.Label style={{color:"black"}}>Precio Sesion</Form.Label>
                                        <Form.Control required type="number" placeholder="Precio" defaultValue={precioSesion} onChange={e=>setPrecioSesion(e.target.value)}/>
                                        <Form.Control.Feedback type="invalid">Precio Sesion.</Form.Control.Feedback>
                        </Form.Group>
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