const fs = require('fs');

const axios = require('axios');
const {v4: uuidv4} = require('uuid');

class Busquedas{

    historial = ['Madrid', 'Barcelona', 'Salamanca'];

    dbPath = './db/database.json'

    constructor(){
        this.leerDB();
    }


    paramsPS(lugar=''){
        return {
            'query': lugar,
            'access_key': process.env.POSITION_STACK_KEY || ''
        }
    }


    get paramsOpenWeather(){
        return{
            'appid': process.env.OPEN_WEATHER_KEY,
            'units': 'metric',
            'lang': 'es',
        }
    }

    get historialCapitalizado(){
        //Capitalizar cada palabra
        return this.historial.map( lugar =>{ 
            lugar.charAt(0).toUpperCase() + lugar.slice(1)
    });
    }


    async ciudad( lugar = '' ){
        //peticion http
        //console.log('Ciudad:', lugar);


         try {
            const instance = axios.create({
                baseURL: `http://api.positionstack.com/v1/forward`,
                params: this.paramsPS(lugar)
            })

            const resp = await instance.get();

            return resp.data.data.map( lugar => ({
                id: uuidv4(),
                name: lugar.label,
                lng: lugar.longitude,
                lat: lugar.latitude
            }));

            //return [];

         } catch (error) {
            console.log('Error: no responde');
            console.log(error);
            return [];
         }

        //retornar los lugares
    }

    async climaLugar(lat, lon){

        try {

            // instancia axios.create
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {...this.paramsOpenWeather, lat, lon}
            })

            //resp.data
            const resp = await instance.get();

            return{
                desc: resp.data.weather[0].description,
                min: resp.data.main.temp_min,
                max: resp.data.main.temp_max,
                temp: resp.data.main.temp
            }
            
        } catch (error) {
            console.log(error);
        }

    }



    agregarHistorial(lugar=''){

        //TODO: prevenir duplicados
        if(this.historial.includes(lugar.toLowerCase())){
            return;
        }

        this.historial = this.historial.splice(0,5);

        this.historial.unshift(lugar);

        //TODO: Grabar en DB
        this.guardarDB();


    }


    guardarDB(){

        const payload = {
            historial: this.historial
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));

    }


    leerDB(){

        
        let historial;
        // Comprobar que existe la BBDD
        if (fs.existsSync(this.dbPath)) {
            const data = fs.readFileSync(this.dbPath, 'utf-8');
            historial = JSON.parse(data);
        }else{
            console.log('No hay nada');
            return;
        }

        this.historial = historial.historial;
        // Si existe, leer la base de datos
        //console.log(historial);
        

    }

}

module.exports = Busquedas;