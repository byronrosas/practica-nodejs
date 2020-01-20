const { connectDB,closeDB } = require('../db.js');
exports.ejercicio2FilterAccommodation = (req, res) => {
    const dbobj = connectDB();
    // obtener params
    const min = Number(req.params.min);
    const max = Number(req.params.max);
    const nhabitaciones = req.params.nhabitaciones;
    let query = {};    

    // query
    query["precio"] = { $gte: !min ? 0 : min, $lte: max };
    if(nhabitaciones){
        query["habitaciones"] = nhabitaciones;
    }   
    // se abre una conexión BD
    dbobj.then(async (db) => {
        // consulta a la base de datos
        db.collection("accommodation").find(query).toArray(function (err, result) {
            if (err) throw err;            
            closeDB();
            res.status(200).json(result);
        });
    }).catch((err)=>{
        res.status(500).json({err});
    });
}
