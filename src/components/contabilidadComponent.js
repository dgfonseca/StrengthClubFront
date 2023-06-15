import React, {useState} from "react";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Container,Row,Col} from 'react-bootstrap';
import { getContabilidadProductos } from "../apis/Productos";
import { getContabilidadClientes } from "../apis/Clientes";
import ProductosContabilidadPanel from "./productosContabilidadPanel";
import ClientesContabilidadPanel from "./clientesContabilidadPanel";
import { getContabilidadDeudores, getContabilidadGeneral, getContabilidadSesiones } from "../apis/Contabilidad";
import { useNavigate } from "react-router-dom";
import SesionesContabilidadPanel from "./SesionesContabilidadPanel";
import DeudoresContabilidadPanel from "./DeudoresContabilidadPanel";
import GeneralContabilidadPanel from "./GeneralContabilidadPanel";



export default function ContabilidadPane(props){
    const navigate = useNavigate();

    const [show, setShow]=useState();
    const [productos, setProductos]=useState([]);
    const [clientes, setClientes]=useState([]);
    const [sesiones, setSesiones]=useState([]);
    const [general, setGeneral] = useState([]);
    const [deudores,setDeudores]=useState([]);

    const descargarContabilidadDeudores = async ()=>{
        try {
            const ent = await getContabilidadDeudores();
            setDeudores(ent.data.contabilidad)
            setShow("Deudores")
        } catch (error) {
            localStorage.removeItem("token")
            navigate("/")
        }

    }
    const descargarContabilidadSesiones = async ()=>{
        try{
            const ent = await getContabilidadSesiones()
            setSesiones(ent.data.sesiones)
            setShow("Sesiones")
        } catch(error){
            localStorage.removeItem("token")
            navigate("/")
        }
    }
    const descargarContabilidadProductosAbonos = async ()=>{
        try{
            const ent = await getContabilidadGeneral();
            setGeneral(ent.data.contabilidad)
            setShow("General")
        }catch(error){
            localStorage.removeItem("token")
            navigate("/")
        }
    }

    const handleShowProductos = async ()=>{
        try {
            const ent = await getContabilidadProductos()
            setProductos(ent.data.productos)
            setShow("Productos");
        } catch (error) {
            localStorage.removeItem("token")
            navigate("/")
        }
    }

    const handleShowClientes = async ()=>{
        try {
            const ent = await getContabilidadClientes()
            setClientes(ent.data.clientes)
            setShow("Clientes");
        } catch (error) {
            localStorage.removeItem("token")
            navigate("/")
        }
    }


    function panel(){
        if(show==="Clientes"){
            return<ClientesContabilidadPanel data2={clientes}></ClientesContabilidadPanel>
        }else if(show==="Productos"){
            return <ProductosContabilidadPanel data2={productos}></ProductosContabilidadPanel>
        }else if(show==="Sesiones"){
            return <SesionesContabilidadPanel data2={sesiones}></SesionesContabilidadPanel>
        }else if(show==="Deudores"){
            return <DeudoresContabilidadPanel data2={deudores}></DeudoresContabilidadPanel>
        }else if(show==="General"){
            return <GeneralContabilidadPanel data2={general}></GeneralContabilidadPanel>
        }
    }

    return(
            <Container>
                <Row style={{padding:"1%",backgroundImage:"linear-gradient(to right, lightgrey, grey,lightgrey)"}}>
                    <Col className="col-sm">
                        <button type="button" className="btn btn-dark" onClick={handleShowProductos}>Contabilidad Productos</button>
                    </Col>
                    <Col className="col-sm">
                        <button type="button" className="btn btn-dark" onClick={handleShowClientes}>Contabilidad Clientes</button>
                    </Col>
                    <Col className="col-sm">
                        <button type="button" className="btn btn-dark" onClick={descargarContabilidadDeudores}>Estados de Cuenta Deudores</button>
                    </Col>
                    <Col className="col-sm">
                        <button type="button" className="btn btn-dark" onClick={descargarContabilidadSesiones}>Contabilidad Sesiones</button>
                    </Col>
                    <Col className="col-sm">
                        <button type="button" className="btn btn-dark" onClick={descargarContabilidadProductosAbonos}>Contabilidad General</button>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    {panel()}
                </Row>
            </Container>  
  );

}
