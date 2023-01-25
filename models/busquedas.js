const axios = require('axios');
const {v4: uuidv4} = require('uuid');

class Busquedas{

    historial = ['Madrid', 'Barcelona', 'Salamanca'];

    constructor(){
        //TODO: leer si DB existe
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

            return [];

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

}

module.exports = Busquedas;