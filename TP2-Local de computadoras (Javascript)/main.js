// 1. DESARROLLAR FUNCIONES

// 1.1 - Precio de una máquina a armar, a partir de los componentes dados.
const precioMaquina = (componentes) => {
    return componentes.map(componente => obtenerPrecio(componente)).reduce((a, b) => a + b);
}
const obtenerPrecio = (componente) => {
    const nombreComponente = local.precios.find(compLocal => compLocal.componente === componente);
    return nombreComponente.precio;
}
console.log(`$${precioMaquina(['Monitor GPRS 3000', 'Motherboard ASUS 1500'])}`);


// 1.2 - Cantidad de veces que se vendió un componente.
const cantidadVentasComponente = componente => {
    // Accedo a cada venta:
    let cantidadVentas = 0;
    for (i = 0; i < local.ventas.length; i++){
        // Busco entre los componente vendido en esa venta, si alguno coincide con el q queremos analizar.
        const seVendio = local.ventas[i].componentes.includes(componente);
        if (seVendio === true){
            cantidadVentas++;
        };
    };
    return cantidadVentas;
};
console.log(cantidadVentasComponente("Monitor ASC 543")); // 2


// 1.3 - Vendedora que más vendió en cierto mes.
const vendedoraDelMes = (mes, anio) => {
    // Reviso cada venta para ver si coincide mes y año con el que se pide.
    let ventasDelMes = local.ventas.filter(venta => mes - 1 === venta.fecha.getMonth() && anio === venta.fecha.getFullYear())
    let vendedoras = [];
    // Creo un objeto por cada vendedora que pasó el filtro (con nombre y venta).
    for(const vendedora of local.vendedoras){
        let aux = {name: vendedora, totalvendido: 0}
        for(const venta of ventasDelMes){
            if (venta.nombreVendedora === vendedora){
                aux.totalvendido += precioMaquina(venta.componentes);
            };
        };
        vendedoras.push(aux);
    };
    // Obtengo la vendedora que más vendió guardando la mayor en cada comparación.
    let ventaAcumuladaMayor = 0;
    let vendedoraDelMes = '';
    for (let vendedora of vendedoras){
        if (vendedora.totalvendido > ventaAcumuladaMayor){
            ventaAcumuladaMayor = vendedora.totalvendido;
            vendedoraDelMes = vendedora.name;
        };
    };
    return `Vendedora del mes: ${vendedoraDelMes}. Vendió por un total de $${ventaAcumuladaMayor}.`;
};
console.log( vendedoraDelMes(1, 2019) ); // "Ada" (vendio por $670, una máquina de $320 y otra de $350)
// Función auxiliar: realiza el cálculo del total de componentes de una venta y lo va sumando.
const calculoComponentes = (totalVentasPropiedad) => {
    const componentesVendidos = totalVentasPropiedad.map(compVendProp => compVendProp.componentes);
    const ventasTotalesProp = componentesVendidos.map(componente => precioMaquina(componente)).reduce((a, b) => a + b, 0);
    return ventasTotalesProp;
}


// 1.4 - Obtener las ventas de un mes determinado.
const ventasMes = (mes, anio) => {
    const totalVentasMes = local.ventas.filter(venta => ventaEsDeMesYAnio(venta, mes, anio));
    return calculoComponentes(totalVentasMes);
}
const ventaEsDeMesYAnio = (venta, mes, anio) => {
    return venta.fecha.getMonth() === mes - 1 && venta.fecha.getFullYear() === anio;
}
console.log(`$${ventasMes(1, 2019)}`);


// 1.5 - Obtener las ventas totales por vendedora.
const ventasVendedora = (nombre) => {
    const totalVentasVendedora = local.ventas.filter(venta => venta.nombreVendedora === nombre);
    return calculoComponentes(totalVentasVendedora);
}
console.log(`$${ventasVendedora('Grace')}`);


// 1.6 - Componente más veces vendido históricamente.
const componenteMasVendido = function(){
    // Por cada componente del listado de precios (local.precios), creo un objeto 
    // que contenga la propiedad nombreComponente y la propiedad vendido,
    // y armo un array de componentesVendidos, con estos objetos.
    let componentesVendidos = [];
    for (let componente of local.precios){
        let aux = {nombreComponente: componente.componente, vendido: cantidadVentasComponente(componente.componente)};
        componentesVendidos.push(aux);
    };
    // Comparo lo vendido por cada uno.
    let componenteMasVendidoAlMomento = '';
    let masVendidoAlMomento = 0;
    for (let i = 0; i < componentesVendidos.length; i++){
        if (componentesVendidos[i].vendido > masVendidoAlMomento){
            componenteMasVendidoAlMomento = componentesVendidos[i].nombreComponente;
            masVendidoAlMomento = componentesVendidos[i].vendido;
        };
    };
    return `El componente más vendido fue: ${componenteMasVendidoAlMomento}`;
};
console.log( componenteMasVendido() ); // Monitor GPRS 3000

                
// 1.7 - Indica si hubo ventas en un mes determinado.     
const huboVentas = function(mes, anio){      
    // Reviso si alguna venta (array local.ventas) coincide con esta fecha.
    return local.ventas.some(venta => mes - 1 === venta.fecha.getMonth() && anio === venta.fecha.getFullYear());
};
console.log(huboVentas(3, 2019));


//2
// En las ventas ya existentes, tenemos que agregar la propiedad sucursal con el valor 'Centro' (ya que es la sucursal original).
const agregarSucursal = () => {
    return local.ventas.map(venta => venta = {
        fecha: venta.fecha,
        nombreVendedora: venta.nombreVendedora,
        componentes: venta.componentes,
        sucursal: 'Centro'
    });
}
local.ventas = agregarSucursal();
console.log(agregarSucursal());
// Agregar al objeto principal la propiedad sucursales: ['Centro', 'Caballito']
local.sucursales = ['Centro', 'Caballito'];
console.log(local.sucursales);
// Cargar la siguiente información en el array ventas, creando sus respectivos objetos siguiendo el patrón: fecha, nombreVendedora, componentes, sucursal
const ventasNuevas = [[new Date(2019, 1, 12), 'Hedy', ['Monitor GPRS 3000', 'HDD Toyiva'], 'Centro'],
[new Date(2019, 1, 24), 'Sheryl', ['Motherboard ASUS 1500', 'HDD Wezter Dishital'], 'Caballito'],
[new Date(2019, 1, 01), 'Ada', ['Motherboard MZI', 'RAM Quinston Fury'], 'Centro'],
[new Date(2019, 1, 11), 'Grace', ['Monitor ASC 543', 'RAM Quinston'], 'Caballito'],
[new Date(2019, 1, 15), 'Ada', ['Motherboard ASUS 1200', 'RAM Quinston Fury'], 'Centro'],
[new Date(2019, 1, 12), 'Hedy', ['Motherboard ASUS 1500', 'HDD Toyiva'], 'Caballito'],
[new Date(2019, 1, 21), 'Grace', ['Motherboard MZI', 'RAM Quinston'], 'Centro'],
[new Date(2019, 1, 08), 'Sheryl', ['Monitor ASC 543', 'HDD Wezter Dishital'], 'Centro'],
[new Date(2019, 1, 16), 'Sheryl', ['Monitor GPRS 3000', 'RAM Quinston Fury'], 'Centro'],
[new Date(2019, 1, 27), 'Hedy', ['Motherboard ASUS 1200', 'HDD Toyiva'], 'Caballito'],
[new Date(2019, 1, 22), 'Grace', ['Monitor ASC 543', 'HDD Wezter Dishital'], 'Centro'],
[new Date(2019, 1, 05), 'Ada', ['Motherboard ASUS 1500', 'RAM Quinston'], 'Centro'],
[new Date(2019, 1, 01), 'Grace', ['Motherboard MZI', 'HDD Wezter Dishital'], 'Centro'],
[new Date(2019, 1, 07), 'Sheryl', ['Monitor GPRS 3000', 'RAM Quinston'], 'Caballito'],
[new Date(2019, 1, 14), 'Ada', ['Motherboard ASUS 1200', 'HDD Toyiva'], 'Centro']]

//Transforma en objeto una lista con los valores de la venta
const listaVentasNuevas = (nuevaVenta) => {
    return {
        fecha: nuevaVenta[0],
        nombreVendedora: nuevaVenta[1],
        componentes: nuevaVenta[2],
        sucursal: nuevaVenta[3]
    };
}

//Agrega a local.ventas, una lista nueva de ventas
const agregarVenta = (ventasParametro) => {
    for (const venta of ventasParametro) {
        local.ventas.push(listaVentasNuevas(venta));
    }
}
agregarVenta(ventasNuevas);


// 2.1 - Obtener las ventas totales realizadas por una sucursal sin límite de fecha.
const ventasSucursal = (sucursal) => {
    const totalVentasSucursal = ventasPorSucursal(local.ventas, sucursal);
    return calculoComponentes(totalVentasSucursal);
}
const ventasPorSucursal = (ventas, sucursal) => {
    return ventas.filter(nombreSucursal => nombreSucursal.sucursal === sucursal);
}
console.log(`$${ventasSucursal('Centro')}`);


// 2.2 - Hacer que ambas funciones reutilicen código y evitar repetir
const ventasPropiedad = (parametro) => {
    totalVentasPropiedad = local.ventas.filter(nombreProp => nombreProp.nombreVendedora === parametro);
    //Llamo a la función calculoComponentes declarada anteriormente
    return calculoComponentes(totalVentasPropiedad);
}
console.log(`$${ventasPropiedad('Ada')}`);


// 2.3 - Sucursal que más vendió en cierto mes.
const sucursalDelMes = (mes, anio) => {
    return local.sucursales.reduce((sucursal1, sucursal2) => {
        return (ventasSucursalYMes(sucursal1, mes, anio) > ventasSucursalYMes(sucursal2, mes, anio))? sucursal1 : sucursal2;
    })
}
// Verifica qué venta de la lista de ventas coinciden con la sucursal, el mes y el anio pasado por parametro.
const ventasSucursalYMes = (sucursal, mes, anio) => {
    const totalVentasSucursal = ventasPorSucursalYMes(local.ventas, sucursal, mes, anio);
    return calculoComponentes(totalVentasSucursal);
}
const ventasPorSucursalYMes = (ventas, sucursal, mes, anio) => {
    return ventas.filter(venta => venta.sucursal === sucursal && ventaEsDeMesYAnio(venta, mes, anio));
}
console.log(sucursalDelMes(2, 2019));

// 3.1 - Muestra una lista ordenada del importe total vendido por cada mes/año
let renderPorMes = function(){
    // Busco la fecha más antigua que hay dentro de las ventas realizadas.
    let fecha = new Date();
    for (let i = 0; i < local.ventas.length; i++){
        if (local.ventas[i].fecha < fecha){
            fecha = local.ventas[i].fecha;
        };
    };
    let fechaActual = new Date ();
    let todasLasFechas = [fecha]; 
    // Para cada fecha desde la más antigua hasta la actual, calculo las ventas por mes con la función ventasMes.
    let tituloInforme = 'Ventas del mes:';
    let informe = '';
    for (let i = 0; i < todasLasFechas.length; i++){
        fecha = new Date (todasLasFechas[i].getFullYear(), todasLasFechas[i].getMonth() + 1);
        if (fecha <= fechaActual){
            todasLasFechas.push(fecha);
        };
        let fechaAnio = fecha.getFullYear();
        // Convierto los números a los nombres reales de los meses.
        let fechaMes = fecha.getMonth()-1;
        switch (fechaMes) {
            case 0: 
                fechaMes = "enero";
            break;
            case 1:
                fechaMes = "febrero";
            break;
            case 2:
                fechaMes = "marzo";
            break;
            case 3:
                fechaMes = "abril";
            break;
            case 4: 
                fechaMes = "mayo";
            break;
            case 5:
                fechaMes = "junio";
            break;
            case 6:
                fechaMes = "julio";
            break;
            case 7:
                fechaMes = "agosto";
            break;
            case 8: 
                fechaMes = "septiembre";
            break;
            case 9:
                fechaMes = "octubre";
            break;
            case 10:
                fechaMes = "noviembre";
            break;
            case 11:
                fechaMes = "diciembre";
            break;
        };
        informe += `\n Total de ${fechaMes} ${fechaAnio}: $${ventasMes(todasLasFechas[i].getMonth() + 1, todasLasFechas[i].getFullYear())}`;
    };
    return tituloInforme + informe;
};
console.log(renderPorMes());


// 3.2 - Muestra una lista del importe total vendido por cada sucursal
const renderPorSucursal = function(){
    let tituloInforme = 'Ventas por sucursal:';
    let informe = '';
    for (let i = 0; i < local.sucursales.length; i++){
        informe += `\n Total de ${local.sucursales[i]}: $${ventasSucursal(local.sucursales[i])}`;
    }
    return tituloInforme + informe;
}
console.log( renderPorSucursal() );

// 3.3 - Tiene que mostrar la unión de los dos reportes anteriores, cual fue el producto más vendido y la vendedora que más ingresos generó
let mejorVendedora = function(){
    let vendedora = '';
    let mayoresVentas = 0;
    for (let i = 0; i < local.vendedoras.length; i++){
        if (ventasVendedora(local.vendedoras[i]) > mayoresVentas){
            vendedora = local.vendedoras[i];
            mayoresVentas = ventasVendedora(local.vendedoras[i]);
        };
    };
    return `Vendedora que más ingresos generó: ${vendedora}`;
};
const render = function(){
    renderPorMes();
    renderPorSucursal();
    componenteMasVendido();
    mejorVendedora();
};
console.log(`Reporte\n${renderPorMes()}\n${renderPorSucursal()}\n${componenteMasVendido()}\n${mejorVendedora()}`);