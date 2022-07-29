import React, {useState} from "react";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Container,Row,Col } from 'react-bootstrap';
import UsuariosPanel from "./usuariosComponent";
import EntrenadoresPanel from "./entrenadoresComponent";
import ClientesPanel from "./clientesComponent";
import ProductosPanel from "./productosComponent";
import PaquetesPanel from "./paquetesComponent";
import VentasPanel from "./ventasComponent"
import { getEntrenadores } from "../apis/Entrenadores";
import { getProductos } from "../apis/Productos";
import { getClientes } from "../apis/Clientes";
import { getUsuarios } from "../apis/Users";
import { getPaquetes } from "../apis/Paquetes";
import { getVentas } from "../apis/Ventas";
import CalendarPanel from "./calendarioComponent";



export default function AdminPane({}){

    const [show, setShow]=useState();
    const [entrenadores,setEntrenadores]=useState([]);
    const [productos, setProductos]=useState([]);
    const [clientes, setClientes]=useState([]);
    const [usuarios, setUsuarios]=useState([]);
    const [paquetes, setPaquetes]=useState([]);
    const [ventas, setVentas]=useState([]);

    const handleShowEntrenadores = async ()=>{
        const ent = await getEntrenadores()
        setEntrenadores(ent.data.entrenadores)
        setShow("Entrenadores");
    }

    const handleShowUsuarios = async ()=>{
        const ent = await getUsuarios()
        setUsuarios(ent.data.usuarios)
        setShow("Usuarios");
    }

    const handleShowProductos = async ()=>{
        const ent = await getProductos()
        setProductos(ent.data.productos)
        setShow("Productos");
    }

    const handleShowPaquetes = async ()=>{
        const ent = await getPaquetes()
        setPaquetes(ent.data.paquetes)
        setShow("Paquetes");
    }

    const handleShowClientes = async ()=>{
        const ent = await getClientes()
        setClientes(ent.data.clientes)
        setShow("Clientes");
    }

    const handleShowVentas = async ()=>{
        const ent = await getVentas()
        setVentas(ent.data.ventas)
        setShow("Ventas");
    }

    const handleShowCalendario = async ()=>{
        // const ent = await getVentas()
        // setVentas(ent.data.ventas)
        setShow("Calendario");
    }

    function panel(){
        if(show==="Entrenadores"){
            return <EntrenadoresPanel data={entrenadores}></EntrenadoresPanel>
        }else if(show=="Usuarios"){
            return<UsuariosPanel data={usuarios}></UsuariosPanel>
        }else if(show=="Clientes"){
            return<ClientesPanel data={clientes}></ClientesPanel>
        }else if(show=="Productos"){
            return <ProductosPanel data={productos}></ProductosPanel>
        }else if(show=="Paquetes"){
            return <PaquetesPanel data={paquetes}></PaquetesPanel>
        }else if(show=="Ventas"){
            return <VentasPanel data={ventas}></VentasPanel>
        }else if(show=="Calendario"){
            return <CalendarPanel></CalendarPanel>
        }
    }

    return(
            <Container>
                <Row style={{padding:"1%",backgroundImage:"linear-gradient(to right, lightgrey, grey,lightgrey)"}}>
                    <Col className="col-sm">
                        <button type="button" className="btn btn-dark" onClick={handleShowEntrenadores}>Entrenadores</button>
                    </Col>
                    <Col className="col-sm">
                        <button type="button" className="btn btn-dark" onClick={handleShowUsuarios}>Usuarios</button>
                    </Col>
                    <Col className="col-sm">
                        <button type="button" className="btn btn-dark" onClick={handleShowClientes}>Clientes</button>
                    </Col>
                    <Col className="col-sm">
                        <button type="button" className="btn btn-dark" onClick={handleShowProductos}>Productos</button>
                    </Col>
                    <Col className="col-sm">
                        <button type="button" className="btn btn-dark" onClick={handleShowPaquetes}>Paquetes</button>
                    </Col>
                    <Col className="col-sm">
                        <button type="button" className="btn btn-dark" onClick={handleShowVentas}>Ventas</button>
                    </Col>
                    <Col className="col-sm">
                        <button type="button" className="btn btn-dark" onClick={handleShowCalendario}>Calendario</button>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    {panel()}
                </Row>
            </Container>  
  );

}
