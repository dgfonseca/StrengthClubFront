import React,{useState, useMemo} from "react";
import { Row,Modal,Button,Form,Alert,ListGroup} from "react-bootstrap";
import '../index.css';
import { useTable, useFilters, useSortBy } from "react-table";
import { borrarVenta, getContenidoVentas, getVentas } from "../apis/Ventas";
import { useNavigate } from "react-router-dom";


export default function VentasPanel({data,onChange}){
const navigate = useNavigate();

const [id, setId] = useState();
const [fecha, setFecha]=useState();
const [cedula, setCedula]=useState();
const [error, setError]=useState();
const [nombre, setNombre]=useState();
const [precio, setPrecio]=useState();
const [contenido, setContenido]=useState([]);

const [show, setShow] = useState(false);
const [show2, setShow2] = useState(false);
const [show3, setShow3] = useState(false);
const [validated, setValidated] = useState(false);
const [buttonName, setButtonName] = useState("Borrar");
const [success, setSuccess]=useState();


const handleClose = () => {
    setId("")
    setFecha("")
    setPrecio("")
    setCedula("")
    setContenido([])
    setShow(false)};

const handleShow = () => setShow(true);

const handleShowDeleteVenta = e =>{
        getContenidoVentas({id:e.cells[0].value}).then(result=>{
            setButtonName("Borrar")
            setId(e.cells[0].value);
            setCedula(e.cells[1].value)
            setNombre(e.cells[2].value)
            setFecha(e.cells[3].value)
            setPrecio(e.cells[4].value)
            setContenido(result.data.contenido)
            handleShow();
        }).catch(error=>{
            if(error.response.status===401){
                localStorage.removeItem("token")
               navigate("/")
            }else{
                setValidated(false);
                setError("No se pudo obtener la informacion de la venta");
                setShow2(true)
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
    Header: "Ventas",
    columns:[
        {
            Header: "Id",
            accessor: "id"
        },
        {
            Header: "Cedula",
            accessor: "cedula"
        },
        {
            Header: "Nombre",
            accessor: "nombre"
        },
        {
            Header: "Fecha",
            accessor: "fecha"
        },
        {
            Header: "Precio",
            accessor: "valor"
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
    setValidated(true);
            borrarVenta({
                id:id,
              }).then(response=>{
                  setValidated(false);
                if(response.request.status==200){
                    setShow3(true)
                    setSuccess("borrado")
                    getVentas().then(response=>{
                        onChange(response.data.ventas)
                    })
                  }else{
                      setError("No se pudo borrar la venta: Verifique la información ingresada");
                      setShow2(true)
                  }
              }).catch(error=>{
                if(error.response.status===401){
                    localStorage.removeItem("token")
                   navigate("/")
                }else{
                    setValidated(false);
                    setError("No se pudo borrar la venta: Verifique la información ingresada");
                    setShow2(true)
                }
              })
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
                        {headerGroup.headers.map(column => 
                        {
                            if(column.Header!=='Id'){
                                return <th {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render("Header")}</th>
                            }
                        })}
                    </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {
                    rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr className="itemRow" {...row.getRowProps()} onClick={()=> { handleShowDeleteVenta(row);}}>
                        {row.cells.map(cell => {
                            if(cell.column.Header!=='Id'){
                                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                            }
                        })}
                        </tr>
                    );
                    })}
                </tbody>
            </table>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Venta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label style={{color:"black"}}>Id</Form.Label>
                            <Form.Control required type="textarea"  disabled defaultValue={id} placeholder="Id"/>
                        </Form.Group>


                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label style={{color:"black"}}>Cedula</Form.Label>
                            <Form.Control required type="email" disabled  defaultValue={cedula} placeholder="Cedula"/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                            <Form.Label style={{color:"black"}}>Nombre</Form.Label>
                            <Form.Control required type="textarea" disabled  defaultValue={nombre} placeholder="Nombre"/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                            <Form.Label style={{color:"black"}}>Fecha</Form.Label>
                            <Form.Control required type="textarea"  disabled defaultValue={fecha} placeholder="Fecha"/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                            <Form.Label style={{color:"black"}}>Precio</Form.Label>
                            <Form.Control required type="textarea" disabled defaultValue={precio} placeholder="Precio"/>
                        </Form.Group> 
                    </Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                            <Form.Label style={{color:"black"}}>Contenido</Form.Label>
                            <ListGroup>
                                {
                                    
                                    contenido.map((item,index)=>(

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
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="danger" onClick={handleSubmit}>{buttonName}</Button>
                </Modal.Footer>
            </Modal>
            <Alert show={show2} variant="danger" onClose={() => {setShow2(false);setError("");setValidated(false)}} dismissible>
                <Alert.Heading>Error</Alert.Heading>
                <p>
                {error}
                </p>
            </Alert>
            <Alert show={show3} variant="success" onClose={() => {setShow3(false);setError("");setValidated(false)}} dismissible>
                <Alert.Heading>Venta {success}</Alert.Heading>
                <p>
                Venta {success} Exitosamente
                </p>
            </Alert>
        </Row>
        
    );
}