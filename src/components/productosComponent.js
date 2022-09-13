import React,{useState, useMemo} from "react";
import { Row,Modal,Button,Form,Alert, InputGroup } from "react-bootstrap";
import '../index.css';
import {crearProducto,actualizarProducto,deleteProductos} from "../apis/Productos";
import { useTable, useFilters, useSortBy } from "react-table";



export default function ProductosPanel({data}){


const [nombre, setNombre] = useState();
const [codigo, setCodigo] = useState();
const [descripcion, setDescripcion] = useState();
const [inventario, setInventario] = useState();
const [inventarioAdicional, setInventarioAdicional] = useState();
const [precio,setPrecio] = useState();
const [precioCompra,setPrecioCompra] = useState();
const[error, setError]=useState();
const [success, setSuccess]=useState();
const [habilitado, setHabilitado]=useState(true);
const [correccion, setCorreccion]=useState(false);

const [show, setShow] = useState(false);
const [show2, setShow2] = useState(false);
const [show3, setShow3] = useState(false);
const [validated, setValidated] = useState(false);
const [buttonName,setButtonName]=useState("Crear");

const handleClose = () => {
    setShow(false)
    setCorreccion(false)
    setNombre("")
    setCodigo("")
    setDescripcion("")
    setInventario("")
    setPrecio("")
    setPrecioCompra("")
    setInventarioAdicional("")
};
const handleShow = () => {setShow(true)};

const handleShowUpdateProducto = e =>{
        setButtonName("Modificar")
        setNombre(e.cells[0].value);
        setCodigo(e.cells[1].value)
        setDescripcion(e.cells[2].value)
        setInventario(e.cells[3].value)
        setPrecio(e.cells[4].value)
        setPrecioCompra(e.cells[5].value)
        setHabilitado(e.cells[6].value)
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
    Header: "Productos",
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
            Header: "Descripcion",
            accessor: "descripcion"
        },
        {
            Header: "Inventario",
            accessor: "inventario"
        },
        {
            Header: "Precio",
            accessor: "precio"
        },
        {
            Header: "Precio Compra",
            accessor: "preciocompra"
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

const handleDelete = () => {
    if(codigo){
        deleteProductos({
            codigo:codigo
          }).then(response=>{
              setValidated(false);
            if(response.request.status===200){
                setSuccess("borrado")
                setShow3(true)
              }else{
                  setError("No se pudo borrar el producto: Verifique que no esté asociado a ninguna venta o paquete");
                  setShow2(true)
              }
          }).catch(error=>{
            setValidated(false);
            console.log(error)
            setError("No se pudo borrar el producto: Verifique que no esté asociado a ninguna venta o paquete");
            setShow2(true)
          })
        }
        handleClose();
};
const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    }
    else{
    setValidated(true);
    if(codigo&&nombre&&descripcion&&inventario&&precio){
        if(buttonName==="Modificar"){
            actualizarProducto({
                nombre:nombre,
                codigo:codigo,
                descripcion:descripcion,
                inventario:inventario,
                inventarioAdicional:inventarioAdicional,
                precio:precio,
                habilitado:habilitado,
                precioCompra:precioCompra,
                correccion:correccion
              }).then(response=>{
                  setValidated(false);
                if(response.request.status===200){
                    setSuccess("actualizado")
                    setShow3(true)
                  }else{
                      setError("No se pudo actualizar el producto: Verifique la información ingresada");
                      setShow2(true)
                  }
              }).catch(error=>{
                console.log(error)
                setValidated(false);
                setError("No se pudo actualizar el producto: Verifique la información ingresada");
                setShow2(true)
              })
        }else{
            crearProducto({
                nombre:nombre,
                codigo:codigo,
                descripcion:descripcion,
                inventario:inventario,
                precio:precio,
                precioCompra:precioCompra,
                habilitado:habilitado
              }).then(response=>{
                  setValidated(false);
                if(response.request.status===200){
                    setSuccess("creado")
                    setShow3(true)
                  }else{
                      setError("No se pudo crear el producto: Verifique la información ingresada");
                      setShow2(true)
                  }
              }).catch(error=>{
                setValidated(false);
                console.log(error)
                setError("No se pudo crear el producto: Verifique la información ingresada");
                setShow2(true)
              })
        }
        handleClose();
    }}
  };

    return(
        <Row className="justify-content-md-center" style={{margin:"5%"}}>
            <input
            value={filterInput}
            onChange={handleFilterChange}
            placeholder={"Buscar Producto"}
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
                        <tr className="itemRow" {...row.getRowProps()} onClick={()=> { handleShowUpdateProducto(row);}}>
                        {row.cells.map(cell => {
                            if(cell.column.Header==='Habilitado'){
                                if(cell.value){
                                    return <td><div style={{background:"green",height:"20px",width:"20px", marginLeft:"40%", borderRadius:"50%"}}></div></td>
                                }else{
                                    return <td><div style={{background:"red",height:"20px",width:"20px", marginLeft:"40%", borderRadius:"50%"}}></div></td>
                                }
                            }else{
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
                    <Modal.Title>Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label style={{color:"black"}}>Nombre</Form.Label>
                            <Form.Control required type="textarea" placeholder="Nombre" defaultValue={nombre} onChange={e=>setNombre(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">Ingrese Nombre.</Form.Control.Feedback>
                        </Form.Group>


                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label style={{color:"black"}}>Codigo</Form.Label>
                            <Form.Control required type="email" placeholder="Codigo" defaultValue={codigo} onChange={e=>setCodigo(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">Ingrese Codigo</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                            <Form.Label style={{color:"black"}}>Descripcion</Form.Label>
                            <Form.Control required type="textarea" placeholder="Descripcion" defaultValue={descripcion} onChange={e=>setDescripcion(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">Ingrese la Descripcion.</Form.Control.Feedback>
                        </Form.Group>
                        {
                            buttonName==='Modificar' ? 
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                                <Form.Label style={{color:"black"}}>Inventario Adicional</Form.Label>
                                <Form.Control required type="number" placeholder="Inventario" defaultValue={0} onChange={e=>setInventarioAdicional(e.target.value)}/>
                                <Form.Control.Feedback type="invalid">Ingrese el Inventario adicional.</Form.Control.Feedback>
                            </Form.Group>
                            : null
                        }
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                            <Form.Label style={{color:"black"}}>Inventario</Form.Label>
                            <Form.Control required type="number" placeholder="Inventario" defaultValue={inventario} onChange={e=>setInventario(e.target.value)}/>
                            <Form.Control.Feedback type="invalid">Ingrese el Inventario.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                            <Form.Label style={{color:"black"}}>Precio</Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control aria-label="Precio" required type="number" defaultValue={precio} placeholder="Precio" onChange={e=>setPrecio(e.target.value)}/>
                            </InputGroup>
                            <Form.Control.Feedback type="invalid">Ingrese el Precio.</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                            <Form.Label style={{color:"black"}}>Precio Compra</Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control aria-label="Precio" required type="number" defaultValue={precioCompra} placeholder="Precio Compra" onChange={e=>setPrecioCompra(e.target.value)}/>
                            </InputGroup>
                            <Form.Control.Feedback type="invalid">Ingrese el Precio de Compra.</Form.Control.Feedback>
                        </Form.Group>  
                        <Form.Group className="mb-3">
                                        <Form.Label style={{color:"black"}}>Habilitado:</Form.Label>
                                        <Form.Check
                                        defaultChecked={habilitado}
                                        onChange={event=>setHabilitado(event.target.checked)}
                                        />
                        </Form.Group>
                        <Form.Group className="mb-3">
                                        <Form.Label style={{color:"black"}}>Corrección:</Form.Label>
                                        <Form.Check
                                        defaultChecked={correccion}
                                        onChange={event=>setCorreccion(event.target.checked)}
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
                <Alert.Heading>Producto {success}</Alert.Heading>
                <p>
                Producto {success} Exitosamente
                </p>
            </Alert>
            <button type="button" onClick={()=>{setButtonName("Crear");handleShow()}} style={{margin:"2%",width:"40%"}} className="btn btn-dark">Crear Producto</button>

        </Row>
        
    );
}