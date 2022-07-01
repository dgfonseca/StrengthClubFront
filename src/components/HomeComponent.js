import React, {useState} from "react";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Container,Row,Col } from 'react-bootstrap';
import { ListGroup,Modal,Button,Form,Alert,Tab, InputGroup } from "react-bootstrap";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from "moment";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Select from 'react-select'
import  {getClientes} from "../apis/Clientes";
import  {getSesiones,crearSesion,registrarAsistencia,desagendarSesion} from "../apis/Sesiones"
import {getEntrenadores} from "../apis/Entrenadores"
import {getProductos} from "../apis/Productos";
import TimePicker from 'react-time-picker';
import DatePicker from 'react-date-picker';
import { registrarVenta } from "../apis/Ventas";
import ical from "cal-parser";
const axios = require('axios').default;




const localizer = momentLocalizer(moment);

export default function HomePane({}){

 
    const [cliente,setCliente]=useState();
    const [entrenador,setEntrenador]=useState();
    const [fecha,setFecha]=useState();
    const [hora, setHora]=useState();

    const [clientes,setClientes]=useState([]);
    const [entrenadores,setEntrenadores]=useState([]);
    const [sesiones, setSesiones]=useState(parseSesiones)
    const [productos, setProductos] = useState([]);
    const [paquetes, setPaquetes]= useState([]);
    const [sesion,setSesion]=useState({sesion:{}});
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState();
    const [paqueteSeleccionado, setPaqueteSeleccionado] = useState();
    const [paquetesSeleccionados, setPaquetesSeleccionados] = useState([]);
    const [productoCarritoSeleccionado, setProductoCarritoSeleccionado] = useState();
    const [paqueteCarritoSeleccionado, setPaqueteCarritoSeleccionado] = useState();
    const [cantidad, setCantidad] = useState(1);
    const [cantidadPaquete, setCantidadPaquete] = useState(1);

    const [precioCalculado,setPrecioCalculado]=useState(0);

    const [showProductosCarrito, setShowProductosCarrito] = useState(false);
    const [showPaquetesCarrito, setShowPaquetesCarrito] = useState(false);
    const [showVenta, setShowVenta]=useState();
    const [show, setShow]=useState();
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const [show4, setShow4] = useState(false);
    const[error, setError]=useState();
    const[success, setSuccess]=useState("Sesion Creada/Modificada Exitosamente");

    const[icsData,setIcsData]=useState([]);
    const[failedEventsIcs, setFailedEventsIcs]=useState([]);


    const handleClose = () => setShow(false);
    const handleCloseVenta = () => {setShowVenta(false);setProductosSeleccionados([]);setPaquetesSeleccionados([]);setCantidad(1);setPrecioCalculado(0)};
    const handleClose4 = () => setShow4(false);
    const handleShow = () => {setShow(true);parseClientes();parseEntrenadores();}; 
    const handleShowVenta = () => {setShowVenta(true);parseClientes();parseProductos();parsePaquetes();}; 
    const [validated, setValidated] = useState(false);


    async function readIcs(e){
            e.preventDefault()
            const reader = new FileReader()
            reader.onload = async (e) => { 
            const json = ical.parseString(e.target.result)
            var now = moment();
            let icsDataSesion=[]
            json.events.forEach(element => {
                var input = moment(element.dtstart.value);
                if((now.isoWeek() == input.isoWeek())&&now.year()==input.year()){
                    var data = element.description.value.split("-");
                    var clienteId = data[0];
                    var entrenadorId = data[1];
                    icsDataSesion.push({
                        cliente:clienteId,
                        entrenador:entrenadorId,
                        fecha:element.dtstart.value,
                        descripcion:element.description.value
                    })
                    
                }
            });
            setIcsData(icsDataSesion)
        };
        reader.readAsText(e.target.files[0])
    }
    function handleShowProductosCarrito(){
        if(showProductosCarrito){
            setShowProductosCarrito(false);
        }else{
            setShowProductosCarrito(true);
        }
    
    }

    function handleShowPaquetesCarrito(){
        if(showPaquetesCarrito){
            setShowPaquetesCarrito(false);
        }else{
            setShowPaquetesCarrito(true);
        }
    
    }
    
    function eliminarProductoCarrito(){
        if(productoCarritoSeleccionado.item){
            setProductosSeleccionados(productosSeleccionados.filter((_,i)=>i!==productoCarritoSeleccionado.index));
            setPrecioCalculado(precioCalculado-(productoCarritoSeleccionado.item.precio*productoCarritoSeleccionado.item.cantidad))
            setProductoCarritoSeleccionado({item:null,index:null})
        }
        if(isNaN(precioCalculado)){
            setPrecioCalculado(0)
        }
    }

    function eliminarPaqueteCarrito(){
        if(paqueteCarritoSeleccionado.item){
            setPaquetesSeleccionados(paquetesSeleccionados.filter((_,i)=>i!==paqueteCarritoSeleccionado.index));
            setPrecioCalculado(precioCalculado-(paqueteCarritoSeleccionado.item.precio*paqueteCarritoSeleccionado.item.cantidad))
            setPaqueteCarritoSeleccionado({item:null,index:null})
        }
        if(isNaN(precioCalculado)){
            setPrecioCalculado(0)
        }
    }
    function agregarProducto(){
        setProductosSeleccionados([...productosSeleccionados,{
            nombre:productoSeleccionado.label,
            codigo:productoSeleccionado.value,
            precio:productoSeleccionado.precio,
            cantidad:cantidad
        }]);
        setPrecioCalculado(precioCalculado+(productoSeleccionado.precio*cantidad))
    }

    function agregarPaquete(){
        setPaquetesSeleccionados([...paquetesSeleccionados,{
            nombre:paqueteSeleccionado.label,
            codigo:paqueteSeleccionado.value,
            precio:paqueteSeleccionado.precio,
            cantidad:cantidadPaquete
        }]);
        setPrecioCalculado(precioCalculado+(paqueteSeleccionado.precio*cantidad))
    }
    const handleEventClick = (event)=>{
        setSesion(event)
        setShow4(true)
};

function parsePaquetes(){
    let arrPaquetes=[];
    axios.get("https://strength-club-sprint1.herokuapp.com/paquetes").then(result=>{
        result.data.paquetes.forEach(element=>{
            arrPaquetes.push(
                { value: element.codigo, label: element.nombre, precio:element.precio}
            )
        })
        setPaquetes(arrPaquetes)
    })
}
function parseProductos(){
    let arrProductos = [];
    getProductos().then(result=>{
        result.data.productos.forEach(element=>{
            arrProductos.push(
                { value: element.codigo, label: element.nombre, precio:element.precio}
            )
        })
    })
    setProductos(arrProductos);
}
    function parseDate(date){
         date = date.toString().split(" ");
         let arrHour = date[1];
         date = date[0];
         date = date.split("-");
         let year = date[0];
         let month = date[1];
         let day = date[2];
         arrHour = arrHour.split(":")
         let hour = arrHour[0];
         let minute = arrHour[1];
         return new Date(year,month-1,day,hour,minute);
    }

    function parseDate2(date){
        date = date.toString().split(" ");
        let months = {
            Jan: "01",
            Feb: "02",
            Mar: "03",
            Apr: "04",
            May: "05",
            Jun: "06",
            Jul: "07",
            Aug: "08",
            Sep: "09",
            Oct: "10",
            Nov: "11",
            Dec: "12"
          };
        let arrHour = date[4].split(":");
        let year = date[3];
        let month = months[date[1]];
        let day = date[2];
        let hour = arrHour[0];
        let minute = arrHour[1];
        return year+"-"+month+"-"+day+" "+hour+":"+minute;
   }

    function parseSesiones(){
        let arrSesiones = [];
        getSesiones().then(result=>{
            result.data.sesiones.forEach(element=>{
                arrSesiones.push({
                    'title': element.nombrecliente,
                    'allDay': false,
                    'start': parseDate(element.fecha), 
                    'end': parseDate(element.fechafin), 
                    'color': element.color,
                    'sesion': element
                  })
            })
            setSesiones(arrSesiones);
        })
    }
    function parseClientes(){
        getClientes().then(result=>{
            let showClientes = []
            result.data.clientes.forEach(element => {
                showClientes.push(
                    { value: element.cedula, label: element.nombre}
                )
            });
            setClientes(showClientes)
        });
        
    }
    function parseEntrenadores(){
        getEntrenadores().then(result=>{
            let showEntrenadores = []
            result.data.entrenadores.forEach(element => {
                showEntrenadores.push(
                    { value: element.cedula, label: element.nombre}
                )
            });
            setEntrenadores(showEntrenadores)
        });
        
    }

    const delay = ms => new Promise(
        resolve => setTimeout(resolve, ms)
      );

    const handleUploadIcs=async ()=>{
        let arr = []
        icsData.forEach(element => {
             crearSesion({
                cliente:element.cliente,
                entrenador:element.entrenador,
                fecha:parseDate2(element.fecha),
                asistio:true
              }).then(response=>{
                  setValidated(false);
                if(response.request.status==200){
                    setShow3(true)
                  }else{
                    arr.push({
                        descripcion:element.descripcion
                    });
                  }
              }).catch(error=>{
                    setValidated(false);
                    arr.push({
                    descripcion:element.descripcion
                });
              })
        });
        await delay(1000);
        setFailedEventsIcs(arr)
        if(failedEventsIcs.length!=0){
            let errors = "Los eventos con la siguiente descripción no se cargaron correctamente:"
            failedEventsIcs.forEach(element => {
                errors=errors.concat(" "+element.descripcion+",")
            });
            setError(errors);
            setShow2(true);
        }
    }
    const handleDeleteSesion=()=>{
        desagendarSesion({
            id:sesion.sesion.id
        }).then(response=>{
            if(response.request.status==200){
                setSuccess("Sesion desagendada exitosamente")
                setShow3(true)
              }else{
                setError("No se pudo eliminar la sesion: Verifique que no se haya registrado la asistencia a dicha sesión");
                setShow2(true)
              }
        }).catch(error=>{
            setValidated(false);
            setError("No se pudo eliminar la sesion: Verifique la información ingresada");
            setShow2(true)
          })
          setShow4(false)
          parseSesiones()
          setSesion({sesion:{}})
    }

    const handleModificarSesion=()=>{
        registrarAsistencia({
            cliente:sesion.sesion.cliente,
            entrenador:sesion.sesion.entrenador,
            fecha:sesion.sesion.fecha,
            asistio:sesion.asistio
          }).then(response=>{
            if(response.request.status==200){
                setShow3(true)
              }else{
                setError("No se pudo modificar la sesion: Verifique la información ingresada");
                setShow2(true)
              }
          }).catch(error=>{
            setValidated(false);
            setError("No se pudo modificar la sesion: Verifique la información ingresada");
            setShow2(true)
          })
          setShow4(false)
          setSesion({sesion:{}})
          parseSesiones()
    };

    const handleSubmitRegistrarVenta = ()=>{
        if(cliente&&productosSeleccionados&&paquetesSeleccionados){
            registrarVenta({
                cliente:cliente.value,
                productos:productosSeleccionados,
                paquetes:paquetesSeleccionados
            }).then(response=>{
                setValidated(false);
              if(response.request.status==200){
                  setShow3(true)
                }else{
                    setError("No se pudo registrar la venta: Verifique la información ingresada");
                    setShow2(true)
                }
            }).catch(error=>{
                setValidated(false);
                setError(error.response.data.message);
                setShow2(true)
              })
        }
        handleCloseVenta()
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
          setValidated(true);
        }
        else{
        setValidated(true);
        let partsDate = fecha.toString().split(" ");
        let months = {
            Jan: "01",
            Feb: "02",
            Mar: "03",
            Apr: "04",
            May: "05",
            Jun: "06",
            Jul: "07",
            Aug: "08",
            Sep: "09",
            Oct: "10",
            Nov: "11",
            Dec: "12"
          };
        let date = partsDate[3]+"-"+months[partsDate[1]]+"-"+partsDate[2]+" "+hora

        if(cliente&&entrenador&&fecha&&hora){
            crearSesion({
                cliente:cliente.value,
                entrenador:entrenador.value,
                fecha:date,
                asistio:false
              }).then(response=>{
                  setValidated(false);
                if(response.request.status==200){
                    setShow3(true)
                  }else{
                      setError("No se pudo crear la sesion: Verifique la información ingresada");
                      setShow2(true)
                  }
              }).catch(error=>{
                setValidated(false);
                setError("No se pudo crear la sesion: Verifique la información ingresada");
                setShow2(true)
              })
            handleClose();
        
            }
            parseSesiones();
        }
      };


    return(
            <Container>
                <Row style={{padding:"1%",backgroundImage:"linear-gradient(to right, lightgrey, grey,lightgrey)"}}>
                    <Col className="col-sm">
                        <Alert show={show2} variant="danger" onClose={() => {setShow2(false);setError("");setValidated(false);setFailedEventsIcs([]);}} dismissible>
                            <Alert.Heading>Error</Alert.Heading>
                            <p>
                            {error}
                            </p>
                        </Alert>
                        <Alert show={show3} variant="success" onClose={() => {setShow3(false);setError("");setValidated(false)}} dismissible>
                            <Alert.Heading>Operación exitosa</Alert.Heading>
                            <p>
                            {success}
                            </p>
                        </Alert>
                        <Calendar
                        localizer={localizer}
                        defaultDate={new Date()}
                        defaultView="day"
                        events={sesiones}
                        style={{ height: "100vh" }}
                        onDoubleClickEvent={event=>handleEventClick(event)}
                        eventPropGetter={
                            (event, start, end, isSelected) => {
                              let newStyle = {
                                backgroundColor: event.color,
                              };                        
                              return {
                                className: "",
                                style: newStyle
                              };
                            }
                          }
                        />
                        <Modal show={show4} onHide={handleClose4} backdrop="static" keyboard={false}>
                            <Modal.Header closeButton>
                                <Modal.Title>Sesion</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                        <Form.Label style={{color:"black"}}>Descripción:</Form.Label>
                                        <Form.Text style={{color:"black"}}> El cliente {sesion.sesion.nombrecliente} con cedula {sesion.sesion.cliente} tiene una sesión con el entrenador {sesion.sesion.nombreentrenador} con cedula {sesion.sesion.entrenador}
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                        <Form.Label style={{color:"black"}}>Fecha:</Form.Label>
                                        <Form.Text style={{color:"black"}}> {sesion.sesion.fecha}
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{color:"black"}}>Asistió:</Form.Label>
                                        <Form.Check
                                        defaultChecked={sesion.sesion.asistio}
                                        onChange={event=>setSesion({...sesion,asistio:event.target.checked})}
                                        />
                                    </Form.Group>    
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose4}>
                                    Cerrar
                                </Button>
                                <Button variant="danger" onClick={handleDeleteSesion}>
                                    Borrar
                                </Button>
                                <Button variant="primary" onClick={handleModificarSesion}>Modificar</Button>
                            </Modal.Footer>
                        </Modal>
                    </Col>
                </Row>
                <Row style={{padding:"1%",backgroundImage:"linear-gradient(to right, lightgrey, grey,lightgrey)"}}>
                    <Col className="col-sm">
                        
                        <button type="button" onClick={handleShow} style={{margin:"2%",width:"40%"}} className="btn btn-dark">Agendar Sesiones</button>
                        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                            <Modal.Header closeButton>
                                <Modal.Title>Agendar Sesion</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                        <Form.Label style={{color:"black"}}>Cliente</Form.Label>
                                        <Select options={clientes} onChange={value=>setCliente(value)}></Select>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label style={{color:"black"}}>Entrenador</Form.Label>
                                        <Select options={entrenadores} onChange={value=>setEntrenador(value)}></Select>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                                        <Form.Label style={{color:"black"}}>Fecha</Form.Label>
                                        <DatePicker onChange={value=>setFecha(value)} value={fecha} />
                                        <TimePicker onChange={value=>setHora(value)} value={hora} />
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Cerrar
                                </Button>
                                <Button variant="primary" onClick={handleSubmit}>Crear</Button>
                            </Modal.Footer>
                        </Modal>
                    </Col>
                    <Col className="col-sm">
                        <button type="button" onClick={handleShowVenta} style={{margin:"2%",width:"40%"}} className="btn btn-dark">Registrar Venta</button>
                        <Modal show={showVenta} onHide={handleCloseVenta} backdrop="static" keyboard={false}>
                            <Modal.Header closeButton>
                                <Modal.Title>Registrar Venta</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                        <Form.Label style={{color:"black"}}>Producto</Form.Label>
                                        <Select options={productos} onChange={value=>setProductoSeleccionado(value)}></Select>
                                        <Form.Label style={{color:"black"}}>Cantidad</Form.Label>
                                        <Form.Control required type="number" placeholder="Cantidad"  onChange={e=>setCantidad(e.target.value)}/>
                                        <Container>
                                            <Row className="justify-content-md-center">
                                                <Col>
                                                    <button type="button" onClick={agregarProducto} style={{margin:"3%",width:"80%", marginLeft:"20%"}} className="btn btn-dark">Agregar Producto</button>
                                                </Col>
                                                <Col>
                                                    <button type="button" onClick={handleShowProductosCarrito} style={{margin:"3%",width:"80%"}} className="btn btn-dark">Ver Productos</button>
                                                </Col>
                                            </Row>
                                        </Container>
                                        <ListGroup hidden={showProductosCarrito}>
                                            {
                                                
                                                productosSeleccionados.map((item,index)=>(

                                                    <ListGroup.Item action href={'#producto' + index} style={{backgroundColor:"lightgray"}}
                                                    onClick={()=>setProductoCarritoSeleccionado({item:item,index:index})}>
                                                        Nombre: {item.nombre}        
                                                        <br></br>
                                                        Cantidad: {item.cantidad}
                                                    </ListGroup.Item>
                                                ))
                                            }
                                        <button type="button" onClick={eliminarProductoCarrito} style={{margin:"3%",width:"80%", marginLeft:"11%"}} className="btn btn-dark">Eliminar Producto del Carrito</button>
                                        </ListGroup>

                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                        <Form.Label style={{color:"black"}}>Paquete</Form.Label>
                                        <Select options={paquetes} onChange={value=>setPaqueteSeleccionado(value)}></Select>
                                        <Form.Label style={{color:"black"}}>Cantidad</Form.Label>
                                        <Form.Control required type="number" placeholder="Cantidad"  onChange={e=>setCantidadPaquete(e.target.value)}/>
                                        <Container>
                                            <Row className="justify-content-md-center">
                                                <Col>
                                                    <button type="button" onClick={agregarPaquete} style={{margin:"3%",width:"80%", marginLeft:"20%"}} className="btn btn-dark">Agregar Paquete</button>
                                                </Col>
                                                <Col>
                                                    <button type="button" onClick={handleShowPaquetesCarrito} style={{margin:"3%",width:"80%"}} className="btn btn-dark">Ver Paquetes</button>
                                                </Col>
                                            </Row>
                                        </Container>
                                        <ListGroup hidden={showPaquetesCarrito}>
                                            {
                                                
                                                paquetesSeleccionados.map((item,index)=>(

                                                    <ListGroup.Item action href={'#paquete' + index} style={{backgroundColor:"lightgray"}}
                                                    onClick={()=>setPaqueteCarritoSeleccionado({item:item,index:index})}>
                                                        Nombre: {item.nombre}        
                                                        <br></br>
                                                        Cantidad: {item.cantidad}
                                                    </ListGroup.Item>
                                                ))
                                            }
                                        <button type="button" onClick={eliminarPaqueteCarrito} style={{margin:"3%",width:"80%", marginLeft:"11%"}} className="btn btn-dark">Eliminar Paquete del Carrito</button>
                                        </ListGroup>

                                    </Form.Group>
                                        
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                                        <Form.Label style={{color:"black"}}>Cliente</Form.Label>
                                        <Select options={clientes} onChange={value=>setCliente(value)}></Select>
                                    </Form.Group> 
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea2">
                                        <Form.Label style={{color:"black"}}>Precio</Form.Label>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text>$</InputGroup.Text>
                                            <InputGroup.Text>Precio: $ {precioCalculado}</InputGroup.Text>
                                        </InputGroup>
                                    </Form.Group> 
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseVenta}>
                                    Cerrar
                                </Button>
                                <Button variant="primary" onClick={handleSubmitRegistrarVenta}>Registrar</Button>
                            </Modal.Footer>
                        </Modal>
                    </Col>
                </Row>
                <Row style={{padding:"1%",backgroundImage:"linear-gradient(to right, lightgrey, grey,lightgrey)"}}>
                    <Col className="col-sm" >
                        <Form.Group controlId="formFile" className="mb-3" style={{width:"40%", marginLeft:"30%"}}>
                            <Form.Label style={{color:"black"}}>Cargar Calendario</Form.Label>
                            <Form.Control type="file" onChange={(e)=>readIcs(e)}/>
                        </Form.Group>
                        <Button variant="dark" onClick={handleUploadIcs}>Cargar Data</Button>
                    </Col>
                </Row>
            </Container>  
  );

}
