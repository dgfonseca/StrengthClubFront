import React, {useState} from "react";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Container,Row,Col } from 'react-bootstrap';
import { Modal,Button,Form,Alert } from "react-bootstrap";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment-timezone'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Select from 'react-select'
import  {getClientes} from "../apis/Clientes";
import  {getSesiones,crearSesion,registrarAsistencia,desagendarSesion, crearSesionIcs,borrarSesionesEntrenador} from "../apis/Sesiones"
import {getEntrenadores} from "../apis/Entrenadores"
import TimePicker from 'react-time-picker';
import DatePicker from 'react-date-picker';
import ical from "cal-parser";
import { useNavigate } from "react-router-dom";


moment.tz.setDefault("America/Bogota");
const localizer = momentLocalizer(moment);

export default function CalendarPanel(){

    const navigate = useNavigate();

    const[fechaInicio, setFechaInicio]=useState();
    const[fechaFin, setFechaFin]=useState();
    const [cliente,setCliente]=useState();
    const [entrenador,setEntrenador]=useState();
    const [fecha,setFecha]=useState();
    const [hora, setHora]=useState();

    const [clientes,setClientes]=useState([]);
    const [entrenadores,setEntrenadores]=useState([]);
    const [sesiones, setSesiones]=useState(parseSesiones)
    const [sesion,setSesion]=useState({sesion:{}});


    const [show, setShow]=useState();
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);
    const [show4, setShow4] = useState(false);
    const[error, setError]=useState();
    const[success, setSuccess]=useState("Sesion Creada/Modificada Exitosamente");

    const[icsData,setIcsData]=useState([]);

    const [filteredEvents, setFilteredEvents]=useState([])
    const [searchValue, setSearchValue] = useState('');

    const searchClient = (searchTerm)=> {
        setSearchValue(searchTerm.target.value.toLowerCase());
        const search = sesiones.filter(
            event =>
                event.title.toLowerCase().indexOf(searchValue) > -1,
            
        );
        const search2 = sesiones.filter(
            event =>
                event.entrenador.toLowerCase().indexOf(searchValue) > -1,
            
        );
        setFilteredEvents(search.concat(search2));
    }

    const handleClose = () => setShow(false);
    const handleClose4 = () => setShow4(false);
    const handleShow = () => {setShow(true);parseClientes();parseEntrenadores();}; 
    const [validated, setValidated] = useState(false);


    async function readIcs(e){
            e.preventDefault()
            const reader = new FileReader()
            reader.onload = async (e) => { 

            const json = ical.parseString(e.target.result)
            var now = moment();
            let icsDataSesion=[]
            let entrenador = json.calendarData['x-wr-calname'];
            json.events.forEach(element => {
                var input = new Date(element.dtstart.value)
                input.setHours(input.getHours()+5)
                if(fechaInicio&&fechaFin){
                    if(input>=fechaInicio && input<=fechaFin){
                        let cliente = element.summary;
                        icsDataSesion.push({
                            cliente:cliente.value,
                            entrenador:entrenador,
                            fecha:input,
                            descripcion:element.summary.value
                        })
                    }
                }
                else{
                    let input2=moment(input)
                    if((now.isoWeek() === input2.isoWeek())&&now.year()===input2.year()){
                        let cliente = element.summary;
                        icsDataSesion.push({
                            cliente:cliente.value,
                            entrenador:entrenador,
                            fecha:input,
                            descripcion:element.summary.value
                        })
                    }
                }
            });
            setIcsData(icsDataSesion)
        };
        reader.readAsText(e.target.files[0])
    }

    const handleEventClick = (event)=>{
        setSesion(event.sesion)
        setShow4(true)
    };

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
                    'title': element.asistio?element.nombrecliente:"*"+element.nombrecliente,
                    'allDay': false,
                    'start': parseDate(element.fecha), 
                    'end': parseDate(element.fechafin), 
                    'color': element.color,
                    'sesion': element,
                    'entrenador':element.nombreentrenador
                  })
            })
            setSesiones(arrSesiones);
        }).catch(error=>{
            if(error.response.status===401){
                localStorage.removeItem("token")
                navigate("/")
            }
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
        }).catch(error=>{
            if(error.response.status===401){
                localStorage.removeItem("token")
                navigate("/")
            }
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
        }).catch(error=>{
            if(error.response.status===401){
                localStorage.removeItem("token")
                navigate("/")
            }
        });
        
    }


    const handleUploadIcs=async ()=>{
        let arr = []
        try {
            await borrarSesionesEntrenador({
                entrenador:icsData[0].entrenador,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin
            })
            for(let element of icsData){
                try {
                    await  crearSesionIcs({
                            cliente:element.cliente,
                            entrenador:element.entrenador,
                            fecha:parseDate2(element.fecha),
                            asistio:true
                            })
                    setValidated(false);
                } catch (error) {
                    if(error.response.status===401){
                        localStorage.removeItem("token")
                        navigate("/")
                    }else{
                        setValidated(false);
                        arr.push({
                            descripcion:error.response.data.message
                        })
                    }
                }
            }
            setIcsData([])
            if(arr.length!==0){
                let errors = "Los eventos con la siguiente descripción no se cargaron correctamente:"
                for(let element of arr){
                    errors=errors.concat(" "+element.descripcion+",")
                }
                setError(errors);
                setShow2(true);
            }else{
                setShow3(true)
            }
            parseSesiones()
        } catch (error) {
                setError("No se pudo borrar el calendario del entrenador para volver a cargarlo, vuelva a intentarlo");
                setShow2(true);
        }
        
    }
    const handleDeleteSesion=()=>{
        desagendarSesion({
            id:sesion.id
        }).then(response=>{
            if(response.request.status===200){
                setSuccess("Sesion desagendada exitosamente")
                setShow3(true)
                
              }else{
                setError("No se pudo eliminar la sesion: Verifique que no se haya registrado la asistencia a dicha sesión");
                setShow2(true)
              }
              parseSesiones()
              setShow4(false)
              setSesion({sesion:{}})
        }).catch(error=>{
            if(error.response.status===401){
                localStorage.removeItem("token")
                navigate("/")
            }else{
                setValidated(false);
                setError("No se pudo eliminar la sesion: Verifique la información ingresada");
                setShow2(true)
                parseSesiones()
                setShow4(false)
                setSesion({sesion:{}})
            }
          })
          
    }

    const handleModificarSesion=()=>{
        registrarAsistencia({
            cliente:sesion.cliente,
            entrenador:sesion.entrenador,
            fecha:sesion.fecha,
            asistio:sesion.asistio,
            virtual:sesion.virtual
          }).then(response=>{
            if(response.request.status===200){
                setShow3(true)
              }else{
                setError("No se pudo modificar la sesion: Verifique la información ingresada");
                setShow2(true)
              }
              setShow4(false)
              setSesion({sesion:{}})
              parseSesiones()
          }).catch(error=>{
            if(error.response.status===401){
                localStorage.removeItem("token")
                navigate("/")
            }else{
                setValidated(false);
                setError("No se pudo modificar la sesion: Verifique la información ingresada");
                setShow2(true)
            }
            parseSesiones()
            setShow4(false)
            setSesion({sesion:{}})
        })

    };

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
                asistio:true
              }).then(response=>{
                  setValidated(false);
                if(response.request.status===200){
                    setShow3(true)
                  }else{
                      setError("No se pudo crear la sesion: Verifique la información ingresada");
                      setShow2(true)
                  }
                  parseSesiones();
              }).catch(error=>{
                if(error.response.status===401){
                    localStorage.removeItem("token")
                    navigate("/")
                }else{
                    setValidated(false);
                    setError("No se pudo crear la sesion: Verifique la información ingresada");
                    setShow2(true)
                    parseSesiones();
                }
              })
            handleClose();
            }
        }
      };


    return(
            <Container>
                <Row style={{padding:"1%",backgroundImage:"linear-gradient(to right, lightgrey, grey,lightgrey)"}}>
                    <Col className="col-sm">
                        <Alert show={show2} variant="danger" onClose={() => {setShow2(false);setError("");setValidated(false);}} dismissible>
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
                        <input
            value={searchValue}
            onChange={searchClient}
            placeholder={"Buscar Cliente o Entrenador"}
            />
                        <Calendar
                        localizer={localizer}
                        defaultDate={new Date()}
                        defaultView="day"
                        events={searchValue?filteredEvents:sesiones}
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
                                        <Form.Text style={{color:"black"}}> El cliente {sesion.nombrecliente} con cedula {sesion.cliente} tiene una sesión con el entrenador {sesion.nombreentrenador} con cedula {sesion.entrenador}
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                        <Form.Label style={{color:"black"}}>Fecha:</Form.Label>
                                        <Form.Text style={{color:"black"}}> {sesion.fecha}
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{color:"black"}}>Asistió:</Form.Label>
                                        <Form.Check
                                        defaultChecked={sesion.asistio}
                                        onChange={event=>{setSesion({...sesion,asistio:event.target.checked});}}
                                        />
                                    </Form.Group>    
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{color:"black"}}>Virtual:</Form.Label>
                                        <Form.Check
                                        defaultChecked={sesion.virtual}
                                        onChange={event=>setSesion({...sesion,virtual:event.target.checked})}
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
                </Row>
                <Row style={{padding:"1%",backgroundImage:"linear-gradient(to right, lightgrey, grey,lightgrey)"}}>
                    <Col className="col-sm" >
                        <Form.Group>
                            <Form.Label style={{color:"black"}}>Fecha Inicio</Form.Label>
                            <DatePicker onChange={value=>setFechaInicio(value)} value={fechaInicio} />
                            <Form.Label style={{color:"black"}}>Fecha Fin</Form.Label>
                            <DatePicker onChange={value=>setFechaFin(value)} value={fechaFin} />
                        </Form.Group>
                        <Form.Group controlId="formFile" className="mb-3" style={{width:"40%", marginLeft:"30%"}}>
                            <Form.Control type="file" onChange={(e)=>readIcs(e)}/>
                        </Form.Group>
                        <Button variant="dark" onClick={handleUploadIcs}>Cargar Data</Button>
                    </Col>
                </Row>
            </Container>  
  );

}
