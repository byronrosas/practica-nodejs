const { connectDB, closeDB } = require('../db.js');

exports.ejercicio3ProcesarData = (req, res) => {
    const dbobj = connectDB();
    // obtener params
    const latitud = Number(req.params.latitud);
    const longitud = Number(req.params.longitud);
    const distancia = Number(req.params.distancia);
    let query = {};

    // query
    query = {
        location: {
            $geoWithin: {
                $centerSphere: [[longitud,latitud],
                distancia / 6378.1]
            }
        }
    };

    dbobj.then(async (db) => {
        db.collection("accommodation").find(query).toArray(function (err, result) {
            if (err) throw err;
            closeDB();
            res.status(200).json(result);
        });
    }).catch((err) => {
        res.status(500).json({ err });
    });
}