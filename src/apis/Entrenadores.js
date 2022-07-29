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

async function getEntrenadores(){
        return await axios.get("https://strength-club-sprint1.herokuapp.com/entrenadores",);
}

async function crearEntrenador(body){
        return await axios.post("https://strength-club-sprint1.herokuapp.com/entrenador",body);
}

async function actualizarEntrenador(body){
  return await axios.put("https://strength-club-sprint1.herokuapp.com/entrenadores",body);
}

async function deleteEntrenador(body){
  return await axios.delete("https://strength-club-sprint1.herokuapp.com/entrenadores",{data:body});
}

export {getEntrenadores,crearEntrenador,deleteEntrenador,actualizarEntrenador};