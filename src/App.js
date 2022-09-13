import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Login from './components/logincomponent';
import AdminPane from './components/adminComponent';
import HomePane from './components/HomeComponent';
import { Container,Row, Nav, Navbar } from 'react-bootstrap';
import ContabilidadPane from './components/contabilidadComponent';


function App() {

  const [token, setToken] = useState(localStorage.getItem('token')==null?JSON.parse(localStorage.getItem('token')):"");
  const [role, setRole]=useState(localStorage.getItem('token')==null?JSON.parse(localStorage.getItem('token')).rol:"")
  const handleChange = useCallback((newValue) => {
    setToken(newValue);
    setRole(newValue.rol);
 },[token,role]);

  return (
    <Router>
      <div className="App" style={{ backgroundImage: `url("https://i.ibb.co/zQ3qGzK/icono-removebg-preview.png")`, backgroundRepeat: "no-repeat", backgroundPositionY: "60%", backgroundPositionX: "50%", backgroundSize:"80% 80%"}}>
        <Container fluid style={{margin:"0px", marginRight:"0px"}}>
          <Row>
            <Navbar className="navbar navbar-expand-lg navbar-dark">
              <Link className="navbar-brand" to={'/home'}>
                Strength Club
              </Link>
              { token!=="" ?
                (
                <Nav className="me-auto" variant="dark">
                  <Nav.Link href='/admin'>Administrador</Nav.Link>
                  <Nav.Link href='/contabilidad'>Contabilidad</Nav.Link>
                </Nav>):(
                <Nav className="me-auto" variant="dark">
                  <Nav.Link href='/'>Login</Nav.Link>
                </Nav>)
              }
            </Navbar>
          </Row>
          <Row>
            <Routes>
              <Route path='/home' element={(role==='ADMIN' || role==='CAJERO') &&token!==""?(<HomePane value={token}></HomePane>):(<Login value={token} onChange={handleChange}/>)}></Route>
              <Route path="/admin" element={role==='ADMIN' && token!==""?(<AdminPane value={token}></AdminPane>):(token===""?(<Login value={token} onChange={handleChange}/>):(<HomePane></HomePane>))}/>
              <Route path="/" element={<Login value={token} onChange={handleChange}/>} />
              <Route path="/contabilidad" element={role==='ADMIN' && token!==""?(<ContabilidadPane value={token}></ContabilidadPane>):(token===""?(<Login value={token} onChange={handleChange}/>):(<HomePane></HomePane>))} />
            </Routes>
          </Row>
        </Container>
      </div>
    </Router>
  );
}

export default App;
