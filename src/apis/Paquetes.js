const axios = require('axios').default;

function authHeader() {
  const user = JSON.parse(localStorage.getItem('token'));
  if (user && user.accessToken) {
    return { 'x-access-token': user.accessToken };
  } else {
    return {};
  }
}

async function crearPaquete(body){
        return await axios.post("https://strength-club-sprint1.herokuapp.com/paquetes",body,{ headers: authHeader() });
}

async function getPaquetes(){
    return await axios.get("https://strength-club-sprint1.herokuapp.com/paquetes",{ headers: authHeader() });
}

async function getProductosPaquete(body){
  return await axios.post("https://strength-club-sprint1.herokuapp.com/productosPaquete",body,{ headers: authHeader() });
}

async function deletePaquete(body){
  return await axios.delete("https://strength-club-sprint1.herokuapp.com/paquete",{headers: authHeader(),data:body});
}

async function actualizarPaquete(body){
  return await axios.put("https://strength-club-sprint1.herokuapp.com/paquetes",body,{ headers: authHeader() });
}



export {crearPaquete, getPaquetes, getProductosPaquete, deletePaquete, actualizarPaquete};