const { connectDB, closeDB } = require('../db.js');
const pdf = require('html-pdf');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const uuidv4 = require("uuid/v4");

var { templateReportBase } = require('./templateReport.js');
const { validarLatitud, validarLongitud } = require('../utils');



exports.ejercicio4ProcesarData = (req, res) => {
    const dbobj = connectDB();
    // obtener params
    const min = Number(req.params.min);
    const max = Number(req.params.max);
    const nhabitaciones = req.params.nhabitaciones;
    const latitud = validarLatitud(Number(req.params.latitud));
    const longitud = validarLongitud(Number(req.params.longitud));
    const distancia = Number(req.params.distancia);
    const file_tipo = String(req.params.tiporeporte).toLowerCase();
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
            // generar nombre unico para el archivo
            const file_name = uuidv4() + "_" + new Date().getDay() + "_" + new Date().getMonth() + "_" + new Date().getFullYear();

            if (file_tipo === "pdf") {
                let content = templateReportBase(result);//obtener el template para el reporte
                crearPDF(content, `./files/pdf/${file_name}.pdf`, (err, result) => {
                    if (err) throw err;
                    res.status(200).json({ msg: { status: "PDF creado y guardado.", path: `./files/pdf/${file_name}.pdf` } });
                });
            } else if (file_tipo === "csv") {
                // options para crear el archivo CSV
                const csvWriter = createCsvWriter({
                    path: `./files/csv/${file_name}.csv`,
                    header: [
                        { id: 'id', title: 'id' },
                        { id: 'titulo', title: 'titulo' },
                        { id: 'anunciante', title: 'anunciante' },
                        { id: 'tipo', title: 'tipo' },
                        { id: 'precio', title: 'precio' }                        
                    ]
                });

                crearCSV(csvWriter,result, (err) => {
                    if (err) throw err;
                    res.status(200).json({ msg: { status: "CSV creado y guardado.", path: `./files/csv/${file_name}.csv` } });
                });
            } else {
                res.status(404).json({ error: "tipo de archivo no encontrado, solo acepta [PDF,CSV]" });
            }
        });
    }).catch((err) => {
        res.status(500).json({ err });
    });

}

function crearPDF(content, path, cb) {
    pdf.create(content).toFile(path, cb);
}

function crearCSV(csvWriter,data, cb) {
    csvWriter.writeRecords(data)      
        .then(cb);
}