const axios = require('axios').default;

function authHeader() {
  const user = JSON.parse(localStorage.getItem('token'));
  if (user && user.accessToken) {
    return { 'x-access-token': user.accessToken };
  } else {
    return {};
  }
}

async function registrarAbono(body){
  return await axios.post("https://strength-club-sprint1.herokuapp.com/registrarAbono",body, { headers: authHeader() });
}
async function registrarVenta(body){
        return await axios.post("https://strength-club-sprint1.herokuapp.com/ventas",body, { headers: authHeader() });
}
async function getVentas(){
  return await axios.get("https://strength-club-sprint1.herokuapp.com/ventas", { headers: authHeader() });
}

async function getContenidoVentas(body){
  return await axios.post("https://strength-club-sprint1.herokuapp.com/contenidoVentas",body, { headers: authHeader() });
}


async function borrarVenta(body){
  return await axios.delete("https://strength-club-sprint1.herokuapp.com/venta",{data:body}, { headers: authHeader() });
}


export {registrarVenta,getVentas,borrarVenta,getContenidoVentas,registrarAbono};