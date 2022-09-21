import React,{useState, useMemo} from "react";
import {Row, Form, Col} from "react-bootstrap";
import '../index.css';
import { useTable, useFilters,useSortBy } from "react-table";



export default function ProductosContabilidadPanel({data2}){
const [filterInput, setFilterInput] = useState("");
const [fechaInicio, setFechaInicio]=useState("");
const [fechaFin, setFechaFin]=useState("");


const [data,setData]=useState(data2);


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
            Header: "Inventario",
            accessor: "inventario"
        },
        {
            Header: "Precio Unitario",
            accessor: "precio"
        },
        {
            Header: "Costo Unitario",
            accessor: "preciocompra"
        },
        {
            Header: "Unidades Vendidas",
            accessor: "unidadesvendidas"
        },
        {
            Header: "Ingresos",
            accessor: "ingresos"
        },
        {
            Header: "Egresos",
            accessor: "egresos"
        },
        {
            Header: "Utilidad",
            accessor: "utilidad"
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
                            <Form.Control required type="date" defaultValue={fechaInicio} placeholder="Fecha" onChange={e=>setFechaInicio(e.target.value)}/>
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
            <button type="button" onClick={()=>{}} style={{margin:"2%",width:"15%"}} className="btn btn-dark">Buscar</button>
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
                        <tr className="itemRow" {...row.getRowProps()}>
                        {row.cells.map(cell => {
                            if(cell.column.Header=='Habilitado'){
                                if(cell.value){
                                    return <div style={{background:"green",height:"20px",width:"20px", marginLeft:"40%", borderRadius:"50%"}}></div>
                                }else{
                                    return <div style={{background:"red",height:"20px",width:"20px", marginLeft:"40%", borderRadius:"50%"}}></div>
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
        </Row>
        
    );
}