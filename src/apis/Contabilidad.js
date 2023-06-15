const axios = require('axios').default;

function authHeader() {
    const user = JSON.parse(localStorage.getItem('token'));
    if (user && user.accessToken) {
      return { 'x-access-token': user.accessToken };
    } else {
      return {};
    }
}


async function getContabilidadSesiones(body){
    return await axios.post("https://strength-club-sprint1.herokuapp.com/contabilidadSesiones",body,{headers:authHeader()})
}
async function getContabilidadDeudores(body){
    return await axios.post("https://strength-club-sprint1.herokuapp.com/contabilidadDeudores",body,{headers:authHeader()})
}
async function getContabilidadGeneral(body){
    return await axios.post("https://strength-club-sprint1.herokuapp.com/contabilidadGeneral",body,{headers:authHeader()})
}

export {getContabilidadSesiones,getContabilidadDeudores,getContabilidadGeneral};