const mysql = require("mysql")

const con = mysql.createConnection({
    host: "localhost",
    database: "Prueba",
    user: "root",
    password: ""
});

con.connect((err) => {
    if (err){
        throw err;
    }
    else{
        console.log("Conectado a la base de datos");
    }    
})

con.end();
