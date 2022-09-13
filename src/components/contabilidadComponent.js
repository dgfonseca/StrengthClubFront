import React, {useState} from "react";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Container,Row,Col} from 'react-bootstrap';
import { getContabilidadProductos } from "../apis/Productos";
import { getContabilidadClientes } from "../apis/Clientes";
import ProductosContabilidadPanel from "./productosContabilidadPanel";
import ClientesContabilidadPanel from "./clientesContabilidadPanel";



export default function ContabilidadPane(props){

    const [show, setShow]=useState();
    const [productos, setProductos]=useState([]);
    const [clientes, setClientes]=useState([]);

    const handleShowProductos = async ()=>{
        const ent = await getContabilidadProductos()
        setProductos(ent.data.productos)
        setShow("Productos");
    }

    const handleShowClientes = async ()=>{
        const ent = await getContabilidadClientes()
        setClientes(ent.data.clientes)
        setShow("Clientes");
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
                </Row>
                <Row className="justify-content-center">
                    {panel()}
                </Row>
            </Container>  
  );

}
