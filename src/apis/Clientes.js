const axios = require('axios').default;

function authHeader() {
  const user = JSON.parse(localStorage.getItem('token'));
  if (user && user.accessToken) {
    return { 'x-access-token': user.accessToken,'Access-Control-Allow-Origin': '*' };
  } else {
    return {};
  }
}

async function crearCliente(body){
        return await axios.post("https://strength-club-sprint1.herokuapp.com/cliente",body,{ headers: authHeader() });
}

async function getVentasCliente(body){
  return await axios.post("https://strength-club-sprint1.herokuapp.com/ventasCliente",body,{ headers: authHeader() });
}
async function getAbonosCliente(body){
  return await axios.post("https://strength-club-sprint1.herokuapp.com/abonosCliente",body,{ headers: authHeader() });
}
async function getDetalleContabilidadCliente(body){
  return await axios.post("https://strength-club-sprint1.herokuapp.com/detalleContabilidadCliente",body,{ headers: authHeader() });
}

async function notificarClienteCorreo(body){
  return await axios.post("https://strength-club-sprint1.herokuapp.com/sendEmail",body,{ headers: authHeader() });
}
async function notificarTodosCorreo(body){
  return await axios.post("https://strength-club-sprint1.herokuapp.com/sendAllEmail",body,{ headers: authHeader() });
}

async function getClientes(){
    return await axios.get("https://strength-club-sprint1.herokuapp.com/clientes",{ headers: authHeader() });
}

async function getAbonos(){
    return await axios.get("https://strength-club-sprint1.herokuapp.com/abonos",{ headers: authHeader() });
}
async function getContabilidadClientes(body){
  return await axios.post("https://strength-club-sprint1.herokuapp.com/contabilidadClientes",body,{ headers: authHeader() });
}

async function actualizarCliente(body){
  return await axios.put("https://strength-club-sprint1.herokuapp.com/clientes",body,{ headers: authHeader() });
}

async function deleteCliente(body){
  return await axios.delete("https://strength-club-sprint1.herokuapp.com/clientes",{headers: authHeader(),data:body});
}

async function borrarAbono(body){
  return await axios.delete("https://strength-club-sprint1.herokuapp.com/abono",{headers: authHeader(),data:body});
}

export {getDetalleContabilidadCliente,getClientes, crearCliente,actualizarCliente,deleteCliente,getVentasCliente,getContabilidadClientes,notificarClienteCorreo,notificarTodosCorreo,getAbonos,borrarAbono,getAbonosCliente}