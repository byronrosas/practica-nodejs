var express = require('express');
var router = express.Router();
var controllerLoad  = require('../Ejercicio1/ejercicio1CargarData');
var controllerFilter  = require('../Ejercicio2/ejercicio2FiltrarData');
var controllerProcesarData  = require('../Ejercicio3/ejercicio3ProcesarData');
var controllerReportesData  = require('../Ejercicio4/ejercicio4ReportesData');

/* GET Ejercicio 1 CSV a Mongodb. */
router.get('/csvToMongo',controllerLoad.ejercicio1LoadDB);

/* GET Ejercicio 2 Filter. */
router.get('/precio/min/:min?/max/:max?/habitaciones/:nhabitaciones?',controllerFilter.ejercicio2FilterAccommodation);

/* GET Ejercicio 3 Procesar Data */
router.get('/coords/lng/:longitud/lat/:latitud/d/:distancia',controllerProcesarData.ejercicio3ProcesarData);

/* GET Ejercicio 4 Reportes Data */
router.get('/reportes/precio/:min?/:max?/habitaciones/:nhabitaciones?/coords/:longitud/:latitud/:distancia/tipo/:tiporeporte',controllerReportesData.ejercicio4ProcesarData);
module.exports = router;