const axios = require('axios').default;

// function authHeader() {
//         const token = JSON.parse(localStorage.getItem('token'));
//         console.log(token)
//         if (token && token.accessToken) {
//           return { Authorization: 'Bearer ' + token.accessToken, Rol:token.usuario.usuario };
//         } else {
//           return {};
//         }
//       }

async function crearPaquete(body){
        return await axios.post("https://strength-club-sprint1.herokuapp.com/paquetes",body);
}

async function getPaquetes(){
    return await axios.get("https://strength-club-sprint1.herokuapp.com/paquetes");
}

async function getProductosPaquete(body){
  return await axios.post("https://strength-club-sprint1.herokuapp.com/productosPaquete",body);
}

async function deletePaquete(body){
  return await axios.delete("https://strength-club-sprint1.herokuapp.com/paquete",{data:body});
}

async function actualizarPaquete(body){
  return await axios.put("https://strength-club-sprint1.herokuapp.com/paquetes",body);
}



export {crearPaquete, getPaquetes, getProductosPaquete, deletePaquete, actualizarPaquete};