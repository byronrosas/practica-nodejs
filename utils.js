// Normaliza una cadena, elimina acentos y ñs
function normalize(str) {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
        to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
        mapping = {};

    for (var i = 0, j = from.length; i < j; i++)
        mapping[from.charAt(i)] = to.charAt(i);
    var ret = [];
    for (var i = 0, j = str.length; i < j; i++) {
        var c = str.charAt(i);
        if (mapping.hasOwnProperty(str.charAt(i)))
            ret.push(mapping[c]);
        else
            ret.push(c);
    }
    return ret.join('');
}

function validarLatitud(latitud)
{
    if(latitud >= -90 && latitud <= 90)
    {
        return latitud;
    }else{
        return 0;   
    }
}

function validarLongitud(longitud)
{
    if(longitud >= -180 && longitud <= 180)
    {
        return longitud;
    }else{
        return 0;   
    }
}

module.exports = { normalize,validarLatitud,validarLongitud };