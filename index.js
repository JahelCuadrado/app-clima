const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");
require('dotenv').config()

//console.log(process.env.POSITION_STACK_KEY);

const main = async() =>{

    const busquedas = new Busquedas();
    let opt;

    do {

        opt = await inquirerMenu();
        if(opt == 2) await pausa();

        switch (opt) {
            case 1:
                //mostrar mensaje
                const termino = await leerInput('Ciudad: ');

                //mostrar los lugares
                const lugares = await busquedas.ciudad(termino);

                //Seleccionar el lugar
                const id = await listarLugares(lugares);

                if(id==0) break;

                const lugarSeleccionado = lugares.find(lugar => lugar.id === id);
                //console.log(lugarSeleccionado);

                const clima = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng)

                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad: ', lugarSeleccionado.name);
                console.log('Latitud: ', lugarSeleccionado.lat);
                console.log('Longitud: ', lugarSeleccionado.lng);
                console.log('Temperatura: ', clima.temp, 'ºC');
                console.log('Mínima: ', clima.min, 'ºC');
                console.log('Máxima: ', clima.max, 'ºC');
                console.log('Clima: ', clima.desc);


                await pausa();
                break;
            case 2:
                
                break;
            case 3:
                
                break;       
            default:
                break;
        }

    } while (opt!==0)
    
}

main();