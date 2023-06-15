import React,{useState, useMemo} from "react";
import {Row, Form, Col,Alert} from "react-bootstrap";
import '../index.css';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import { getContabilidadSesiones } from "../apis/Contabilidad";
import { useNavigate } from "react-router-dom";


export default function SesionesContabilidadpanel({data2}){

    const [fechaInicio, setFechaInicio]=useState("");
    const [fechaFin, setFechaFin]=useState("");
    const [data,setData]=useState(data2)
    const [show, setShow]=useState(false)
    const [error, setError]=useState("")

    const navigate = useNavigate();



    const filtrarFechas = ()=>{
        if(fechaFin&&fechaInicio){
            getContabilidadSesiones({fechaInicio:fechaInicio,fechaFin:fechaFin}).then(response=>{
                if(response.request.status===200){
                    setData(response.data.sesiones)
                  }else{
                      setError("No se pudo filtrar los clientes por fecha");
                      setShow(true)
                  }
              }).catch(error=>{
                if(error.response.status===401){
                    localStorage.removeItem("token")
                   navigate("/")
                }else{
                    setError("No se pudo filtrar los clientes por fecha");
                    setShow(true)
                }
              })
        }else{
            setError("Elegir una fecha inicio y una fecha fin valida");
            setShow(true)
        }
    }

    
    
    return (
        <Row className="justify-content-md-center" style={{margin:"5%"}}>
            <Alert show={show} variant="danger" onClose={() => {setShow(false);setError("");}} dismissible>
                    <Alert.Heading>Error</Alert.Heading>
                    <p>
                    {error}
                    </p>
            </Alert>
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
            <button type="button" onClick={()=>{filtrarFechas()}} style={{margin:"2%",width:"15%"}} className="btn btn-dark">Buscar</button>
            
            <ListGroup as="ol" numbered>
                <ListGroup.Item
                as="li"
                className="d-flex justify-content-between align-items-start"
                >
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">Sesiones Completadas</div>
                        {data[0].asistio}
                    </div>
                    <Badge bg="primary" pill>
                        {Math.round(data[0].asistio / data[0].total * 100)} %
                    </Badge>
                </ListGroup.Item>
                <ListGroup.Item
                as="li"
                className="d-flex justify-content-between align-items-start"
                >
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">Sesiones Ausentes</div>
                        {data[0].noasistio}
                    </div>
                    <Badge bg="primary" pill>
                        {Math.round(data[0].noasistio / data[0].total * 100)} %
                    </Badge>
                </ListGroup.Item>
                <ListGroup.Item
                as="li"
                className="d-flex justify-content-between align-items-start"
                >
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">Sesiones Virtuales</div>
                        {data[0].virtual}
                    </div>
                    <Badge bg="primary" pill>
                        {Math.round(data[0].virtual / data[0].total * 100)} %
                    </Badge>
                </ListGroup.Item>
                <ListGroup.Item
                as="li"
                className="d-flex justify-content-between align-items-start"
                >
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">Sesiones No Virtuales</div>
                        {data[0].novirtual}
                    </div>
                    <Badge bg="primary" pill>
                        {Math.round(data[0].novirtual / data[0].total * 100)} %
                    </Badge>
                </ListGroup.Item>
                <ListGroup.Item
                as="li"
                className="d-flex justify-content-between align-items-start"
                >
                    <div className="ms-2 me-auto">
                        <div className="fw-bold">Sesiones Totales</div>
                        {data[0].total}
                    </div>
                    <Badge bg="primary" pill>
                        {Math.round(data[0].total / data[0].total * 100)} %
                    </Badge>
                </ListGroup.Item>
            </ListGroup>
        </Row>
    )

}