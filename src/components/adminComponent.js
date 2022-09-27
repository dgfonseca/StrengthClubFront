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
import { getClientes,getAbonos } from "../apis/Clientes";
import { getUsuarios } from "../apis/Users";
import { getPaquetes } from "../apis/Paquetes";
import { getVentas } from "../apis/Ventas";
import CalendarPanel from "./calendarioComponent";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import AbonosPanel from "./abonosComponent";




export default function AdminPane(props){
    const navigate = useNavigate();
    const [show, setShow]=useState();
    const [entrenadores,setEntrenadores]=useState([]);
    const [productos, setProductos]=useState([]);
    const [clientes, setClientes]=useState([]);
    const [usuarios, setUsuarios]=useState([]);
    const [paquetes, setPaquetes]=useState([]);
    const [ventas, setVentas]=useState([]);
    const [abonos, setAbonos]=useState([])

    const handleChangeEntrenadores = useCallback((newValue) => {
        setEntrenadores(newValue);
     },[entrenadores]);
    const handleChangeProductos = useCallback((newValue) => {
        setProductos(newValue);
     },[productos]);
    const handleChangeClientes = useCallback((newValue) => {
        setClientes(newValue);
     },[clientes]);
    const handleChangeUsuarios = useCallback((newValue) => {
        setUsuarios(newValue);
     },[usuarios]);
    const handleChangePaquetes = useCallback((newValue) => {
        setPaquetes(newValue);
     },[paquetes]);
    const handleChangeVentas = useCallback((newValue) => {
        setVentas(newValue);
     },[ventas]);
    const handleChangeAbonos = useCallback((newValue) => {
        setAbonos(newValue);
     },[abonos]);

    const handleShowEntrenadores = async ()=>{
        try {
            const ent = await getEntrenadores()
            setEntrenadores(ent.data.entrenadores)
            setShow("Entrenadores");
        } catch (error) {
            localStorage.removeItem("token")
            navigate("/")
        }
    }

    const handleShowUsuarios = async ()=>{
        try {
            const ent = await getUsuarios()
            setUsuarios(ent.data.usuarios)
            setShow("Usuarios");
        } catch (error) {
            localStorage.removeItem("token")
            navigate("/")
        }
    }

    const handleShowProductos = async ()=>{
        try {
            const ent = await getProductos()
            setProductos(ent.data.productos)
            setShow("Productos");
        } catch (error) {
            localStorage.removeItem("token")
            navigate("/")
        }
    }

    const handleShowPaquetes = async ()=>{
        try {
            const ent = await getPaquetes()
            setPaquetes(ent.data.paquetes)
            setShow("Paquetes");
        } catch (error) {
            localStorage.removeItem("token")
            navigate("/")
        }
    }

    const handleShowClientes = async ()=>{
        try {
            const ent = await getClientes()
            setClientes(ent.data.clientes)
            setShow("Clientes");
        } catch (error) {
            localStorage.removeItem("token")
            navigate("/")
        }
    }

    const handleShowAbonos = async ()=>{
        try {
            const ent = await getAbonos()
            setAbonos(ent.data.abonos)
            setShow("Abonos");
        } catch (error) {
            localStorage.removeItem("token")
            navigate("/")
        }
    }

    const handleShowVentas = async ()=>{
        try {
            const ent = await getVentas()
            setVentas(ent.data.ventas)
            setShow("Ventas");
        } catch (error) {
            localStorage.removeItem("token")
            navigate("/")
        }
    }

    const handleShowCalendario = async ()=>{
        setShow("Calendario");
    }

    function panel(){
        if(show==="Entrenadores"){
            return <EntrenadoresPanel data={entrenadores} onChange={handleChangeEntrenadores}></EntrenadoresPanel>
        }else if(show==="Usuarios"){
            return<UsuariosPanel data={usuarios} onChange={handleChangeUsuarios}></UsuariosPanel>
        }else if(show==="Clientes"){
            return<ClientesPanel data={clientes} onChange={handleChangeClientes}></ClientesPanel>
        }else if(show==="Productos"){
            return <ProductosPanel data={productos} onChange={handleChangeProductos}></ProductosPanel>
        }else if(show==="Paquetes"){
            return <PaquetesPanel data={paquetes} onChange={handleChangePaquetes}></PaquetesPanel>
        }else if(show==="Ventas"){
            return <VentasPanel data={ventas} onChange={handleChangeVentas}></VentasPanel>
        }else if(show==="Calendario"){
            return <CalendarPanel></CalendarPanel>
        }else if(show==="Abonos"){
            return <AbonosPanel data={abonos} onChange={handleChangeAbonos}></AbonosPanel>
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
                        <button type="button" className="btn btn-dark" onClick={handleShowAbonos}>Abonos</button>
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
