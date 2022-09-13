const axios = require('axios').default;

function authHeader() {
  const user = JSON.parse(localStorage.getItem('token'));
  if (user && user.accessToken) {
    return { 'x-access-token': user.accessToken };
  } else {
    return {};
  }
}

async function loginApi(body){
        const response = await axios.post("https://strength-club-sprint1.herokuapp.com/login",body);
        localStorage.setItem('token', JSON.stringify(response.data));
        return response;
}


async function crearUsuario(body){
      return await axios.post("https://strength-club-sprint1.herokuapp.com/register",body, { headers: authHeader() });
}

async function getUsuarios(){
    return await axios.get("https://strength-club-sprint1.herokuapp.com/usuarios", { headers: authHeader()});
}

async function getCurrentUser(){
  return JSON.parse(localStorage.getItem("token"))
}

export {loginApi,crearUsuario, getUsuarios,getCurrentUser};