import React, {useState} from "react";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Container,Row,Col} from 'react-bootstrap';
import { getContabilidadProductos } from "../apis/Productos";
import { getContabilidadClientes } from "../apis/Clientes";
import ProductosContabilidadPanel from "./productosContabilidadPanel";
import ClientesContabilidadPanel from "./clientesContabilidadPanel";
import { useNavigate } from "react-router-dom";



export default function ContabilidadPane(props){
    const navigate = useNavigate();

    const [show, setShow]=useState();
    const [productos, setProductos]=useState([]);
    const [clientes, setClientes]=useState([]);

    const descargarContabilidadDeudores = async ()=>{

    }
    const descargarContabilidadSesiones = async ()=>{

    }
    const descargarContabilidadProductosAbonos = async ()=>{

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
                        <button type="button" className="btn btn-dark" onClick={descargarContabilidadProductosAbonos}>Contabilidad Productos/Abonos</button>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    {panel()}
                </Row>
            </Container>  
  );

}
