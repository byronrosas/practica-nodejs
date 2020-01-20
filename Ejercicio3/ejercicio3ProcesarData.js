const { connectDB, closeDB } = require('../db.js');

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
            $match:query_geo            
        },
        {
            $group: { _id: null, precio_promedio_metro: { $avg:"$precio_por_metro" }, precio_total_promedio: { $avg:"$precio" } } 
        }
    ];

    dbobj.then(async (db) => {
        db.collection("accommodation").aggregate(aggregation_query).toArray(function (err, result) {
            if (err) throw err;
            closeDB();
            res.status(200).json(result);
        });
    }).catch((err) => {
        res.status(500).json({ err });
    });
}



validarLatitud(latitud)
{
    if(latitud >= -90 && latitud <= 90)
    {
        return latitud;
    }else{
        return 0;   
    }
}

validarLongitud(longitud)
{
    if(longitud >= -180 && longitud <= 180)
    {
        return longitud;
    }else{
        return 0;   
    }
}