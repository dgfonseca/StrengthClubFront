const axios = require('axios').default;

function authHeader() {
  const user = JSON.parse(localStorage.getItem('token'));
  if (user && user.accessToken) {
    return { 'x-access-token': user.accessToken };
  } else {
    return {};
  }
}

async function getEntrenadores(){
        return await axios.get("https://strength-club-sprint1.herokuapp.com/entrenadores",{ headers: authHeader() });
}

async function crearEntrenador(body){
        return await axios.post("https://strength-club-sprint1.herokuapp.com/entrenador",body,{ headers: authHeader() });
}

async function actualizarEntrenador(body){
  return await axios.put("https://strength-club-sprint1.herokuapp.com/entrenadores",body,{ headers: authHeader() });
}

async function deleteEntrenador(body){
  return await axios.delete("https://strength-club-sprint1.herokuapp.com/entrenadores",{data:body},{ headers: authHeader() });
}

export {getEntrenadores,crearEntrenador,deleteEntrenador,actualizarEntrenador};