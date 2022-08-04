import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Login from './components/logincomponent';
import AdminPane from './components/adminComponent';
import HomePane from './components/HomeComponent';
import { Container,Row,Col, Nav, Navbar } from 'react-bootstrap';


function App() {

  const [token, setToken] = useState();

  return (
    <Router>
      <div className="App" style={{ backgroundImage: `url("https://i.ibb.co/zQ3qGzK/icono-removebg-preview.png")`, backgroundRepeat: "no-repeat", backgroundPositionY: "60%", backgroundPositionX: "50%", backgroundSize:"80% 80%"}}>
        <Container fluid style={{margin:"0px", marginRight:"0px"}}>
          <Row>
            <Navbar className="navbar navbar-expand-lg navbar-dark">
              <Link className="navbar-brand" to={'/home'}>
                Strength Club
              </Link>
              <Nav className="me-auto" variant="dark">
                <Nav.Link>Sesiones</Nav.Link>
                <Nav.Link>Productos</Nav.Link>
                <Nav.Link href='/admin'>Administrador</Nav.Link>
              </Nav>
            </Navbar>
          </Row>
          <Row>
            <Routes>
              <Route path='/home' element={<HomePane></HomePane>}></Route>
              <Route path="/admin" element={<AdminPane></AdminPane>}/>
              <Route path="/" element={<Login setToken={setToken}/>} />
            </Routes>
          </Row>
        </Container>
      </div>
    </Router>
  );
}

export default App;
