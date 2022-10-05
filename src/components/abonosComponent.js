import React,{useState, useMemo} from "react";
import { Col,Row,Modal,Button,Form,Alert} from "react-bootstrap";
import '../index.css';
import { useTable, useFilters, useSortBy, usePagination } from "react-table";
import { borrarAbono, getAbonos } from "../apis/Clientes";
import { useNavigate } from "react-router-dom";


export default function AbonosPanel({data,onChange}){
const navigate = useNavigate();

const [id, setId] = useState();
const [fecha, setFecha]=useState();
const [error, setError]=useState();
const [nombre, setNombre]=useState();
const [precio, setPrecio]=useState();
const [tipo, setTipo]=useState();

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
    setTipo("")
    setShow(false)};

const handleShow = () => setShow(true);

const handleShowDeleteVenta = e =>{
            setButtonName("Borrar")
            setId(e.cells[0].value);
            setNombre(e.cells[1].value)
            setFecha(e.cells[2].value)
            setPrecio(e.cells[3].value)
            setTipo(e.cells[5].value)
            handleShow();
}

const [filterInput, setFilterInput] = useState("");
const [filterInput2, setFilterInput2] = useState("");
const [filterInput3, setFilterInput3] = useState("");

const handleFilterChange = e => {
  const value = e.target.value || "";
  setFilter("nombre", value); // Update the show.name filter. Now our table will filter and show only the rows which have a matching value
  setFilterInput(value);
};
const handleFilterChange2 = e => {
    const value = e.target.value || "";
    setFilter("fecha", value); // Update the show.name filter. Now our table will filter and show only the rows which have a matching value
    setFilterInput2(value);
  };
  const handleFilterChange3 = e => {
    const value = e.target.value || "";
    setFilter("usuario", value); // Update the show.name filter. Now our table will filter and show only the rows which have a matching value
    setFilterInput3(value);
  };
const columns = useMemo(()=>[
    {
    Header: "Abonos",
    columns:[
        {
            Header: "Id",
            accessor: "id"
        },
        {
            Header: "Cliente",
            accessor: "nombre"
        },
        {
            Header: "Fecha",
            accessor: "fecha"
        },
        {
            Header: "Precio",
            accessor: "valor"
        },
        {
            Header: "Usuario",
            accessor: "usuario"
        },
        {
            Header: "Tipo",
            accessor: "tipo"
        }
    ],
}],[]);

const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups, if your table has groupings
    page, // rows for the table based on the data passed
    prepareRow,
    setFilter,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable({
    columns,
    data
  },useFilters, useSortBy,usePagination);



const handleSubmit = (event) => {
            setValidated(true);
            borrarAbono({
                id:id,
              }).then(response=>{
                  setValidated(false);
                if(response.request.status===200){
                    setShow3(true)
                    setSuccess("borrado")
                    getAbonos().then(response=>{
                        onChange(response.data.abonos)
                    })
                  }else{
                      setError("No se pudo borrar el abono: Verifique la información ingresada");
                      setShow2(true)
                  }
              }).catch(error=>{
                if(error.response.status===401){
                    localStorage.removeItem("token")
                   navigate("/")
                }else{
                    setValidated(false);
                    setError("No se pudo borrar el abono: Verifique la información ingresada");
                    setShow2(true)
                }
              })
        handleClose();
  };


    return(
        <Row className="justify-content-md-center" style={{margin:"5%"}}>
            <Col>
                <h5>Cliente</h5>
                <input
                value={filterInput}
                onChange={handleFilterChange}
                placeholder={"Buscar por Cliente"}
                />
            </Col>
            <Col>
                <h5>Fecha</h5>
                <input
                value={filterInput2}
                onChange={handleFilterChange2}
                placeholder={"Buscar por Fecha"}
                />
            </Col>
            <Col>
                <h5>Usuario</h5>
                <input
                value={filterInput3}
                onChange={handleFilterChange3}
                placeholder={"Buscar por Usuario"}
                />
            </Col>
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
                    page.map((row, i) => {
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
            <div>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Next
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const pageNumber = e.target.value
                ? Number(e.target.value) - 1
                : 0;
              gotoPage(pageNumber);
            }}
            style={{ width: "50px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {[10, 25, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Abono</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label style={{color:"black"}}>Id</Form.Label>
                            <Form.Control required type="textarea"  disabled defaultValue={id} placeholder="Id"/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                            <Form.Label style={{color:"black"}}>Nombre</Form.Label>
                            <Form.Control required type="textarea" disabled  defaultValue={nombre} placeholder="Nombre"/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                            <Form.Label style={{color:"black"}}>Tipo</Form.Label>
                            <Form.Control required type="textarea" disabled  defaultValue={tipo} placeholder="Nombre"/>
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
                <Alert.Heading>Abono {success}</Alert.Heading>
                <p>
                Abono {success} Exitosamente
                </p>
            </Alert>
        </Row>
        
    );
}