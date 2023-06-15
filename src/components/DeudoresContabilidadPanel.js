import React,{useState, useMemo} from "react";
import '../index.css';
import { useTable, useFilters, useSortBy } from "react-table";
import { Row,Col,Form,Modal, Alert,ListGroup } from 'react-bootstrap';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from "react-router-dom";
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { getContenidoVentas } from "../apis/Ventas";
import { getVentasCliente } from "../apis/Clientes";
import Box from '@mui/material/Box';
import { FixedSizeList } from 'react-window';
import { getContabilidadDeudores } from "../apis/Contabilidad";

export default function DeudoresContabilidadPanel({data2}){

    const [data,setData] = useState(data2)
    const [fechaInicio, setFechaInicio]=useState("");
    const [show2, setShow2]=useState(false)
    const [fechaFin, setFechaFin]=useState("");
    const [error, setError]=useState("")
    const navigate = useNavigate();
    const [filterInput, setFilterInput] = useState("");




    const filtrarFechas = ()=>{
        if(fechaFin&&fechaInicio){
            getContabilidadDeudores({fechaInicio:fechaInicio,fechaFin:fechaFin}).then(response=>{
                if(response.request.status===200){
                    setData(response.data.contabilidad)
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
                  Header: "Sesiones",
                  accessor: "sesiones"
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

        return (
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
                <button type="button" onClick={()=>{filtrarFechas()}} style={{margin:"2%",width:"15%"}} className="btn btn-dark">Buscar</button>
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
                            <tr className="itemRow" {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                            })}
                            </tr>
                        );
                        })}
                    </tbody>
                </table>
            </Row>
        )

}