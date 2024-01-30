// Donde inicia el sistema:

// ESTE IF SERIA PARA CUANDO PASA A PRODUCCION:
// if (process.env.NODE_ENV =! 'production'){
//     require('dotenv').config();
// }


require('dotenv').config();
const app = require("./app/app");

const port = 3000;

app.listen(port, ()=> {
    console.log(`-------- Servidor escuchando en puerto ${port}`);
});