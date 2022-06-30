import React, {useState} from "react";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Container,Row,Col } from 'react-bootstrap';
import UsuariosPanel from "./usuariosComponent";
import EntrenadoresPanel from "./entrenadoresComponent";
import ClientesPanel from "./clientesComponent";
import ProductosPanel from "./productosComponent";
import PaquetesPanel from "./paquetesComponent";



export default function AdminPane({}){

    const [show, setShow]=useState();

    function panel(){
        if(show==="Entrenadores"){
            return <EntrenadoresPanel></EntrenadoresPanel>
        }else if(show=="Usuarios"){
            return<UsuariosPanel></UsuariosPanel>
        }else if(show=="Clientes"){
            return<ClientesPanel></ClientesPanel>
        }else if(show=="Productos"){
            return <ProductosPanel></ProductosPanel>
        }else if(show=="Paquetes"){
            return <PaquetesPanel></PaquetesPanel>
        }
    }

    return(
            <Container>
                <Row style={{padding:"1%",backgroundImage:"linear-gradient(to right, lightgrey, grey,lightgrey)"}}>
                    <Col className="col-sm">
                        <button type="button" className="btn btn-dark" onClick={()=>setShow("Entrenadores")}>Entrenadores</button>
                    </Col>
                    <Col className="col-sm">
                        <button type="button" className="btn btn-dark" onClick={()=>setShow("Usuarios")}>Usuarios</button>
                    </Col>
                    <Col className="col-sm">
                        <button type="button" className="btn btn-dark" onClick={()=>setShow("Clientes")}>Clientes</button>
                    </Col>
                    <Col className="col-sm">
                        <button type="button" className="btn btn-dark" onClick={()=>setShow("Productos")}>Productos</button>
                    </Col>
                    <Col className="col-sm">
                        <button type="button" className="btn btn-dark" onClick={()=>setShow("Paquetes")}>Paquetes</button>
                    </Col>
                    <Col className="col-sm">
                        <button type="button" className="btn btn-dark" >Notificar Clientes</button>
                    </Col>
                    <Col className="col-sm">
                        <button type="button" className="btn btn-dark">Base de Datos</button>
                    </Col>
                </Row>
                    {panel()}
            </Container>  
  );

}
