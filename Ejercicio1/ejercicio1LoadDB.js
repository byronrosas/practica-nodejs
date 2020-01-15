const { connectDB,closeDB } = require('../db.js');
const { normalize } = require('../utils');
const path = require('path');
const file = path.join(__dirname,'/files/resource_accommodation.csv');


const csvtojson = require("csvtojson"); // libreria convierte csv a un array de objetos json


/* 
    Función que carga los registros de un CSV a una coleccion de mongodb
    parametros: 1 (ruta del archivo csv)
 */
function ejercicio1LoadDB(path_file) {    
    
    const dbobj = connectDB();  
    
    csvtojson()//convertir CSV en array de objetos json
        .fromFile(path_file)
        .then((csv_file_data) => { 
            
            // obtener array normalizado
            let normalized_csv = csv_file_data.map((obj,i)=>{
                let new_obj={};
                for (var clave in obj){                    
                    if (obj.hasOwnProperty(clave)) {                      
                        // normalizar el texto quitando acentos y ñ, convertir a minusculas y reemplazar espacios por _
                        let clave_normalized = normalize(clave).toLowerCase().replace(/\s/g,"_");;                        
                        new_obj[clave_normalized]=obj[clave];
                    }else{
                        new_obj[clave]=obj[clave];
                    }
                }                
                return new_obj;
            });          

            // objeto de conexión
            dbobj.then(async (db)=>{

                await db.collection("accommodation").remove({});  //remover todos los documentos, antes de ingresar los nuevos documentos
                
                // Ingresar documentos en la coleccion accommodation
                db.collection("accommodation").insertMany(normalized_csv, (err, res) => {
                    if (err) throw err;
                    console.log(`Total saved: ${res.insertedCount}`);                
                    closeDB();
                });
            }).catch(err=>console.log(err));
            
        });        
}

ejercicio1LoadDB(file);