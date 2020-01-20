function templateReportBase(data) {
    const titulo = `
    <h1>Reporte Ejercicio 4</h1>    
    `;
    const table = `
        <table>
            <tr>
                <th>id</th>
                <th>Titulo</th>
                <th>Anunciante</th>
                <th>Tipo</th>
                <th>Precio</th>
            </tr>        
    `;
    let contenido;
    data.forEach(element => {
        contenido += `
            <tr>
                <th>${element.id}</th>
                <th>${element.titulo}</th>
                <th>${element.anunciante}</th>
                <th>${element.tipo}</th>
                <th>${element.precio}</th>
            </tr>`;
    });
    const endtable = `
        </table>
    `;
    const Footer = `
    <h3>Elaborado por Byron Rosas</h3>    
    `;
    return titulo + table + contenido + endtable + Footer;
}

module.exports = { templateReportBase };