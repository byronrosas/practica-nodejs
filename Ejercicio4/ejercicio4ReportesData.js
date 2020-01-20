const { connectDB, closeDB } = require('../db.js');
const pdf = require('html-pdf');
var { templateReportBase } = require('./templateReport.js');
const { validarLatitud, validarLongitud } = require('../utils');
exports.ejercicio4ProcesarData = (req, res) => {
    const dbobj = connectDB();
    // obtener params
    const min = req.params.min;
    const max = req.params.max;
    const nhabitaciones = req.params.nhabitaciones;
    const latitud = validarLatitud(Number(req.params.latitud));
    const longitud = validarLongitud(Number(req.params.longitud));
    const distancia = Number(req.params.distancia);
    let query_geo = {};
    let query_filter = {};
    let query = {};
    // query geo
    query_geo = {
        location: {
            $geoWithin: {
                $centerSphere: [[longitud, latitud],
                distancia / 6378.1]
            }
        }
    };


    // query_filter
    query_filter["precio"] = { $gte: !min ? "0" : min, $lte: max };
    if (nhabitaciones) {
        query["habitaciones"] = nhabitaciones;
    }

    // query
    query = {
        $and: [
            query_geo,
            query_filter
        ]
    };
    
    dbobj.then(async (db) => {
        db.collection("accommodation").find(query).toArray((err, result) => {
            if (err) throw err;

            closeDB();
            let content = templateReportBase(result);
            crearPDF(content, './files/pdf/html-pdf.pdf', (err, result) => {
                if (err) throw err;
                res.status(200).json({ msg: { status: "PDF creado y guardado.", path: './files/pdf/html-pdf.pdf' } });
            });
        });
    }).catch((err) => {
        res.status(500).json({ err });
    });

}

function crearPDF(content, path, cb) {
    pdf.create(content).toFile(path, cb);
}