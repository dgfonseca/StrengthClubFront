import React, {useState} from "react";
import {loginApi} from "../apis/Users";
import PropTypes from 'prop-types';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import { useNavigate } from "react-router-dom";




export default function Login({ setToken }){
  const navigate = useNavigate();
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const [email, setEmail] = useState();


  const errorMessage = () => {
    return (
    <div
        className="error"
        style={{
        display: error ? '' : 'none',
        color:"red"
        }}>
        <h4>{error}</h4>
    </div>
    );
};

  const handleSubmit = async e =>{
    e.preventDefault();
    if(username=='' || password=='' || email==''){
      setError("Campos faltantes")
    }else{
      setError('')
      loginApi({
        usuario:username,
        email:email,
        password:password
      }).then(response=>{
      if(response.request.status==200){
        setToken(response.data);
        navigate("/home")
      }else{
        setError("Credenciales Invalidas")
        alert("Credenciales Invalidas")
      }
    }).catch(error=>setError("Credenciales Invalidas"));
    ;
  }
  }
        return(
      <div className="auth-wrapper">
        <div className="auth-inner">
          <div className="login-wrapper">
            <form onSubmit={handleSubmit}>
            <h3>Sign In</h3>
            <div className="mb-3">
              <label>Usuario</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter user"
                onChange={e=>setUserName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                onChange={e=>setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                onChange={e=>setPassword(e.target.value)}
              />
            </div>
            <div className="messages">
              {errorMessage()}
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
        );
    
}
Login.propTypes = {
  setToken: PropTypes.func.isRequired
}