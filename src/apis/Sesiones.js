const axios = require('axios').default;

function authHeader() {
        const token = JSON.parse(localStorage.getItem('token'));
        console.log(token)
        if (token && token.accessToken) {
          return { Authorization: 'Bearer ' + token.accessToken, Rol:token.usuario.usuario };
        } else {
          return {};
        }
      }

async function crearSesion(body){
        return await axios.post("https://strength-club-sprint1.herokuapp.com/sesiones",body);
}

async function getSesiones(){
  return await axios.get("https://strength-club-sprint1.herokuapp.com/sesiones");
}

async function registrarAsistencia(body){
  return await axios.put("https://strength-club-sprint1.herokuapp.com/sesiones",body);
}

async function desagendarSesion(body){
  return await axios.delete("https://strength-club-sprint1.herokuapp.com/sesiones", {data:body})
}

export {getSesiones,crearSesion,registrarAsistencia,desagendarSesion};