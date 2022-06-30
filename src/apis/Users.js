const axios = require('axios').default;

function authHeader() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.accessToken) {
          return { Authorization: 'Bearer ' + user.accessToken };
        } else {
          return {};
        }
      }

async function loginApi(body){
        const response = await axios.post("https://strength-club-sprint1.herokuapp.com/login",body);
        localStorage.setItem('token', response.data);
        return response;
}


async function crearUsuario(body){
      return await axios.post("https://strength-club-sprint1.herokuapp.com/register",body);
}

module.exports = {loginApi,crearUsuario};