const { connectDB, closeDB } = require('../db.js');
const { normalize } = require('../utils');
const path = require('path');



const csvtojson = require("csvtojson"); // libreria convierte csv a un array de objetos json


/* 
    Función que carga los registros de un CSV a una coleccion de mongodb    
 */
exports.ejercicio1LoadDB = function (request, response) {
    const path_file = path.join(__dirname, '/files/resource_accommodation.csv');
    const dbobj = connectDB();

    csvtojson()//convertir CSV en array de objetos json
        .fromFile(path_file)
        .then((csv_file_data) => {

            // obtener array normalizado
            let normalized_csv = csv_file_data.map((obj, i) => {
                let new_obj = {};
                for (var clave in obj) {
                    if (obj.hasOwnProperty(clave)) {                        
                        let valor = obj[clave];
                        // normalizar el texto quitando acentos y ñ, convertir a minusculas y reemplazar espacios por _
                        let clave_normalized = normalize(clave).toLowerCase().replace(/\s/g, "_");
                        
                        //convertir a formato geoespacial 
                        if (!new_obj.hasOwnProperty("location")) {
                            valor = { "coordinates": [Number(obj["Longitud"]),Number(obj["Latitud"])], "type": "Point" }  
                            new_obj["location"] = valor;                          
                        }
                        // evita que latitud y longitud se coloquen en el nuevo objeto.
                        if (clave_normalized !== "latitud" && clave_normalized !== "longitud") {  
                            
                            //convertir precio a number 
                            if(clave_normalized==="precio_por_metro" || clave_normalized==="precio") valor = Number(valor);                            

                            new_obj[clave_normalized] = valor;
                        }
                    } else {
                        new_obj[clave] = obj[clave];
                    }
                }
                return new_obj;
            });

            // objeto de conexión
            dbobj.then(async (db) => {                
                const collections = (await db.listCollections().toArray()).map(collection => collection.name);
                if(collections.indexOf("accommodation") !== -1)
                {
                    await db.collection("accommodation").drop();  //remover la colección, antes de ingresar los nuevos documentos                
                }                
                await db.collection("accommodation").createIndex( {"location" : "2dsphere" } );
                // Ingresar documentos en la coleccion accommodation
                db.collection("accommodation").insertMany(normalized_csv, (err, res) => {
                    if (err) throw err;
                    console.log(`Total saved: ${res.insertedCount}`);
                    closeDB();
                    response.status(200).json(res);
                });
            }).catch((err) => {
                console.log(err);
                response.status(500).json(err);
            });

        });
}
