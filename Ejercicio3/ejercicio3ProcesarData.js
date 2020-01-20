const { connectDB, closeDB } = require('../db.js');
const { validarLatitud, validarLongitud } = require('../utils');
exports.ejercicio3ProcesarData = (req, res) => {
    const dbobj = connectDB();
    // obtener params
    const latitud = validarLatitud(Number(req.params.latitud));
    const longitud = validarLongitud(Number(req.params.longitud));
    const distancia = Number(req.params.distancia);
    let query_geo = {};
    // query geo
    query_geo = {
        location: {
            $geoWithin: {
                $centerSphere: [[longitud, latitud],
                distancia / 6378.1]
            }
        }
    };
    // aggregate query
    let aggregation_query = [
        {
            $match: query_geo
        },
        {
            $group: { _id: null, precio_promedio_metro: { $avg: "$precio_por_metro" }, precio_total_promedio: { $avg: "$precio" } }
        }
    ];

    // se abre una conexión BD
    dbobj.then(async (db) => {
        // consulta a la base de datos
        db.collection("accommodation").aggregate(aggregation_query).toArray(function (err, result) {
            if (err) throw err;
            closeDB();
            res.status(200).json(result);
        });
    }).catch((err) => {
        res.status(500).json({ err });
    });
}



