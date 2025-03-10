const axios = require('axios').default;

function authHeader() {
  const user = JSON.parse(localStorage.getItem('token'));
  if (user && user.accessToken) {
    return { 'x-access-token': user.accessToken,'Access-Control-Allow-Origin': '*' };
  } else {
    return {};
  }
}

async function crearSesion(body){
        return await axios.post("https://strength-club-sprint1.herokuapp.com/sesiones",body,{ headers: authHeader() });
}
async function crearSesionIcs(body){
        return await axios.post("https://strength-club-sprint1.herokuapp.com/sesionesics",body,{ headers: authHeader() });
}

async function getSesiones(){
  return await axios.get("https://strength-club-sprint1.herokuapp.com/sesiones",{ headers: authHeader() });
}

async function registrarAsistencia(body){
  return await axios.put("https://strength-club-sprint1.herokuapp.com/sesiones",body,{ headers: authHeader() });
}

async function desagendarSesion(body){
  return await axios.delete("https://strength-club-sprint1.herokuapp.com/sesiones", {headers: authHeader(),data:body})
}

async function borrarSesionesEntrenador(body){
  return await axios.delete("https://strength-club-sprint1.herokuapp.com/sesionesEntrenador", {headers: authHeader(),data:body})
}

async function borrarVentasSesionesEntrenador(body){
  return await axios.delete("https://strength-club-sprint1.herokuapp.com/ventasSesionesEntrenador",{headers: authHeader(),data:body})
}

export {getSesiones,crearSesion,registrarAsistencia,desagendarSesion,crearSesionIcs,borrarSesionesEntrenador,borrarVentasSesionesEntrenador};