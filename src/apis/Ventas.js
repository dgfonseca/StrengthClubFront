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

async function registrarVenta(body){
        return await axios.post("https://strength-club-sprint1.herokuapp.com/ventas",body);
}


module.exports={registrarVenta}