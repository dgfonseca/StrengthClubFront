const axios = require('axios').default;

function authHeader() {
  const user = JSON.parse(localStorage.getItem('token'));
  if (user && user.accessToken) {
    return { 'x-access-token': user.accessToken };
  } else {
    return {};
  }
}

async function crearProducto(body){
        return await axios.post("https://strength-club-sprint1.herokuapp.com/productos",body,{ headers: authHeader() });
}

async function actualizarProducto(body){
  return await axios.put("https://strength-club-sprint1.herokuapp.com/productos",body,{ headers: authHeader() });
}


async function getProductos(){
      return await axios.get("https://strength-club-sprint1.herokuapp.com/productos",{ headers: authHeader() });
}

async function getContabilidadProductos(){
  return await axios.get("https://strength-club-sprint1.herokuapp.com/contabilidadProductos",{ headers: authHeader() });
}

async function getProductosHabilitados(){
  return await axios.get("https://strength-club-sprint1.herokuapp.com/productosHabilitados",{ headers: authHeader() });
}

async function deleteProductos(body){
  return await axios.delete("https://strength-club-sprint1.herokuapp.com/productos",{ headers: authHeader(),data:body});
}

export {getProductos, crearProducto,actualizarProducto,getProductosHabilitados,deleteProductos,getContabilidadProductos};