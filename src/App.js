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

  const [token, setToken] = useState(localStorage.getItem('token')!=null?JSON.parse(localStorage.getItem('token')):"");
  const handleChange = useCallback((newValue) => {
    setToken(newValue);
 },[token]);

  return (
    <Router>
      <div className="App" style={{ backgroundImage: `url("/img/strength.png")`, backgroundRepeat: "no-repeat", backgroundPositionY: "60%", backgroundPositionX: "50%", backgroundSize:"80% 80%"}}>
        <Container fluid>
          <Row>
            <Navbar className="navbar navbar-expand-lg navbar-dark" collapseOnSelect>
              <Link className="navbar-brand" to={'/home'}>
                Strength Club
              </Link>
              { token!==""&&token!==null && token!==undefined ?
                (
                <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav className="me-auto" variant="dark">
                    <Nav.Link href='/admin'>Administrador</Nav.Link>
                    <Nav.Link href='/contabilidad'>Contabilidad</Nav.Link>
                  </Nav>
                  <Nav>
                    <Nav.Link className="justify-content-end" href='/' onClick={()=>{localStorage.removeItem("token");setToken(null);}}>Logout</Nav.Link>
                  </Nav>
                </Navbar.Collapse>
                ):(
                <Nav className="me-auto" variant="dark">
                  <Nav.Link href='/'>Login</Nav.Link>
                </Nav>)
              }
            </Navbar>
          </Row>
          <Row>
            <Routes>
              <Route path='/home' element={(token.rol==='ADMIN' || token.rol==='CAJERO') &&token!==""?(<HomePane value={token}></HomePane>):(<Login value={token} onChange={handleChange}/>)}></Route>
              <Route path="/admin" element={token.rol==='ADMIN' && token.rol!==""?(<AdminPane value={token}></AdminPane>):(token===""?(<Login value={token} onChange={handleChange}/>):(<HomePane></HomePane>))}/>
              <Route path="/" element={<Login value={token} onChange={handleChange}/>} />
              <Route path="/contabilidad" element={token.rol==='ADMIN' && token.rol!==""?(<ContabilidadPane value={token}></ContabilidadPane>):(token===""?(<Login value={token} onChange={handleChange}/>):(<HomePane></HomePane>))} />
            </Routes>
          </Row>
        </Container>
      </div>
    </Router>
  );
}

export default App;
