const mysql = require("mysql")

//Conexión con POO
class Connection{ //Creando una clase Connection
    constructor(host, database, user, password){ //Creando un constructor con atributos
        this.host = host,
        this.database = database,
        this.user = user,
        this.password = password
        this.con = mysql.createConnection({
            host: this.host,
            database: this.database,
            user: this.user,
            password: this.password
        })
    }

    validarCon(){
        this.con.connect((err) => {
            if (err){
                throw err;
            }
            else{
                console.log("Conectado a la base de datos");
            }    
        })
    }

    desconectar(){
        this.con.end();
        console.log("Conexión terminada")
    }
}

//Creando el objeto
conData = new Connection("localhost", "Prueba", "root", "")

conData.validarCon();

conData.desconectar();