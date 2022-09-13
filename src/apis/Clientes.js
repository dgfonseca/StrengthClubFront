const axios = require('axios').default;

function authHeader() {
  const user = JSON.parse(localStorage.getItem('token'));
  if (user && user.accessToken) {
    return { 'x-access-token': user.accessToken };
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

async function notificarClienteCorreo(body){
  return await axios.post("https://strength-club-sprint1.herokuapp.com/sendEmail",body,{ headers: authHeader() });
}
async function notificarClientesCorreo(){
  return await axios.get("https://strength-club-sprint1.herokuapp.com/sendAllEmail",{ headers: authHeader() });
}

async function getClientes(){
    return await axios.get("https://strength-club-sprint1.herokuapp.com/clientes",{ headers: authHeader() });
}
async function getContabilidadClientes(body){
  return await axios.post("https://strength-club-sprint1.herokuapp.com/contabilidadClientes",body,{ headers: authHeader() });
}

async function actualizarCliente(body){
  return await axios.put("https://strength-club-sprint1.herokuapp.com/clientes",body,{ headers: authHeader() });
}

async function deleteCliente(body){
  return await axios.delete("https://strength-club-sprint1.herokuapp.com/clientes",{data:body},{ headers: authHeader() });
}

export {getClientes, crearCliente,actualizarCliente,deleteCliente,getVentasCliente,getContabilidadClientes,notificarClienteCorreo,notificarClientesCorreo}