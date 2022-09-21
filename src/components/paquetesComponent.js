import React,{useState, useMemo} from "react";
import { ListGroup,Row,Modal,Button,Form,Alert,Col, InputGroup, Container } from "react-bootstrap";
import '../index.css';
import  {getProductosHabilitados}  from "../apis/Productos";
import Select from 'react-select'
import { isNaN } from "formik";
import {crearPaquete, getProductosPaquete, deletePaquete, actualizarPaquete} from "../apis/Paquetes"
import { useTable, useFilters, useSortBy } from "react-table";
import { useNavigate } from "react-router-dom";



export default function PaquetesPanel({data}){
    const navigate = useNavigate();
const [nombre, setNombre] = useState();
const [codigo, setCodigo] = useState();
const [precio,setPrecio] = useState();
const [productos, setProductos] = useState([]);
const [productosSeleccionados, setProductosSeleccionados] = useState([]);
const [productoSeleccionado, setProductoSeleccionado] = useState();
const [productoCarritoSeleccionado, setProductoCarritoSeleccionado] = useState();
const [buttonName, setButtonName] = useState("Crear");
const [success, setSuccess]=useState();


const[error, setError]=useState();
const [precioCalculado,setPrecioCalculado]=useState(0);

const [show, setShow] = useState(false);
const [showProductosCarrito, setShowProductosCarrito] = useState(false);
const [show2, setShow2] = useState(false);
const [show3, setShow3] = useState(false);
const [validated, setValidated] = useState(false);

const handleClose = () => {
    setCodigo("")
    setNombre("")
    setPrecio("")
    setPrecioCalculado(0)
    setProductos([])
    setProductoSeleccionado(null)
    setProductosSeleccionados([])
    setProductoCarritoSeleccionado(null)
    setShow(false)};
const handleShow = () => {setShow(true);parseProductos()}


const handleShowUpdatePaquetes = e =>{
    getProductosPaquete({codigo:e.cells[1].value}).then(result=>{
        setButtonName("Modificar");
        setNombre(e.cells[0].value);
        setCodigo(e.cells[1].value);
        setPrecio(e.cells[2].value);
        setProductosSeleccionados(result.data.productos);
        setPrecioCalculado(result.data.precio[0].sum);
        handleShow();
    }).catch(error=>{
        if(error.response.status===401){
            localStorage.removeItem("token")
           navigate("/")
        }else{
            setValidated(false);
            setError("No se pudo obtener la informacion del paquete");
            setShow2(true)
        }
      })
}

const [cantidad, setCantidad] = useState(1);

function handleShowProductosCarrito(){
    if(showProductosCarrito){
        setShowProductosCarrito(false);
    }else{
        setShowProductosCarrito(true);
    }

}

function eliminarProductoCarrito(){
    if(productoCarritoSeleccionado.item){
        setProductosSeleccionados(productosSeleccionados.filter((_,i)=>i!==productoCarritoSeleccionado.index));
        setPrecioCalculado(precioCalculado-(productoCarritoSeleccionado.item.precio*productoCarritoSeleccionado.item.cantidad))
        setProductoCarritoSeleccionado({item:null,index:null})
    }
    if(isNaN(precioCalculado)){
        setPrecioCalculado(0)
    }

}
function agregarProducto(){
    setProductosSeleccionados([...productosSeleccionados,{
        nombre:productoSeleccionado.label,
        codigo:productoSeleccionado.value,
        precio:productoSeleccionado.precio,
        cantidad:cantidad
    }]);
    setPrecioCalculado(precioCalculado+(productoSeleccionado.precio*cantidad))
}
function parseProductos(){
    let arrProductos = [];
    getProductosHabilitados().then(result=>{
        result.data.productos.forEach(element=>{
            arrProductos.push(
                { value: element.codigo, label: element.nombre, precio:element.precio}
            )
        })
        setProductos(arrProductos);
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
  setFilter("nombre", value);
  setFilterInput(value);
};
const columns = useMemo(()=>[
    {
    Header: "Paquetes",
    columns:[
        {
            Header: "Nombre",
            accessor: "nombre"
        },
        {
            Header: "Codigo",
            accessor: "codigo"
        },
        {
            Header: "Precio",
            accessor: "precio"
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
    if(codigo&&nombre&&productos&&precio){
        if(buttonName==="Modificar"){
            actualizarPaquete({
                nombre:nombre,
                codigo:codigo,
                productos:productosSeleccionados,
                precio:precio
              }).then(response=>{
                  setValidated(false);
                if(response.request.status===200){
                    setShow3(true)
                    setSuccess("actualizado")
                  }else{
                      setError("No se pudo crear el paquete: Verifique la información ingresada");
                      setShow2(true)
                  }
              }).catch(error=>{
                if(error.response.status===401){
                    localStorage.removeItem("token")
                   navigate("/")
                }else{
                    setValidated(false);
                    setError("No se pudo crear el paquete: Verifique la información ingresada");
                    setShow2(true)
                }
              })
        }else{
            crearPaquete({
                nombre:nombre,
                codigo:codigo,
                productos:productosSeleccionados,
                precio:precio
              }).then(response=>{
                  setValidated(false);
                if(response.request.status===200){
                    setShow3(true)
                    setSuccess("creado")
                  }else{
                      setError("No se pudo crear el paquete: Verifique la información ingresada");
                      setShow2(true)
                  }
              }).catch(error=>{
                if(error.response.status===401){
                    localStorage.removeItem("token")
                   navigate("/")
                }else{
                    setValidated(false);
                    setError("No se pudo crear el paquete: Verifique la información ingresada");
                    setShow2(true)
                }
              })
        }

        setProductosSeleccionados([])
        setCantidad(0);
        setPrecioCalculado(0);
        handleClose();
    }}
  };

  const handleDelete = () => {
    if(codigo){
        deletePaquete({
            codigo:codigo
          }).then(response=>{
              setValidated(false);
            if(response.request.status===200){
                setSuccess("borrado")
                setShow3(true)
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

    return(
        <Row className="justify-content-md-center" style={{margin:"5%"}}>
            <input
            value={filterInput}
            onChange={handleFilterChange}
            placeholder={"Buscar Paquete"}
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
                        <tr className="itemRow" {...row.getRowProps()} onClick={()=> {handleShowUpdatePaquetes(row);}}>
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
                    <Modal.Title>Crear Paquete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label style={{color:"black"}}>Producto</Form.Label>
                            <Select options={productos} onChange={value=>setProductoSeleccionado(value)}></Select>
                            <Form.Label style={{color:"black"}}>Cantidad</Form.Label>
                            <Form.Control required type="number" placeholder="Cantidad"  onChange={e=>setCantidad(e.target.value)}/>
                            <Container>
                                <Row className="justify-content-md-center">
                                    <Col>
                                        <button type="button" onClick={agregarProducto} style={{margin:"3%",width:"45%", marginLeft:"40%"}} className="btn btn-dark">Agregar Producto</button>
                                    </Col>
                                    <Col>
                                        <button type="button" onClick={handleShowProductosCarrito} style={{margin:"3%",width:"45%"}} className="btn btn-dark">Ver Productos</button>
                                    </Col>
                                </Row>
                            </Container>
                            <ListGroup hidden={showProductosCarrito}>
                                {
                                    
                                    productosSeleccionados.map((item,index)=>(

                                        <ListGroup.Item action href={'#' + index}
                                        onClick={()=>setProductoCarritoSeleccionado({item:item,index:index})}>
                                            Nombre: {item.nombre}        
                                            <br></br>
                                            Cantidad: {item.cantidad}
                                        </ListGroup.Item>
                                    ))
                                }
                            <button type="button" onClick={eliminarProductoCarrito} style={{margin:"3%",width:"35%", marginLeft:"30%"}} className="btn btn-dark">Eliminar Producto del Carrito</button>
                            </ListGroup>

                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicNombre">
                            <Form.Label style={{color:"black"}}>Nombre</Form.Label>
                            <Form.Control required type="text" placeholder="Nombre" defaultValue={nombre} onChange={e=>setNombre(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">Ingrese Nombre</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicCodigo">
                            <Form.Label style={{color:"black"}}>Codigo</Form.Label>
                            <Form.Control required type="text" placeholder="Codigo" defaultValue={codigo} onChange={e=>setCodigo(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">Ingrese Codigo</Form.Control.Feedback>
                        </Form.Group>
                            
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                            <Form.Label style={{color:"black"}}>Precio</Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control aria-label="Precio" required type="number" defaultValue={precio} placeholder="Precio" onChange={e=>setPrecio(e.target.value)}/>
                                <InputGroup.Text>Precio: $ {precioCalculado}</InputGroup.Text>
                            </InputGroup>
                            <Form.Control.Feedback type="invalid">Ingrese el Precio.</Form.Control.Feedback>
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
                <Alert.Heading>Paquete {success}</Alert.Heading>
                <p>
                Paquete {success} Exitosamente
                </p>
            </Alert>
            <button type="button" onClick={()=>{setButtonName("Crear");handleShow()}} style={{margin:"2%",width:"40%"}} className="btn btn-dark">Crear Paquete</button>

        </Row>
        
    );
}