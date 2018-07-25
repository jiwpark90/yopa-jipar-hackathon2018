import Weather from './weather';
import City from './city';

module.exports = class TimedWeather {
    constructor(data) {
        this.dateTime = data["datetime"];
        this.temperature = data["temp"];
        this.humidity = data["precip"];
        if(data["weather"] !== null && data["weather"] !== "" && data["weather"] !== undefined) {
            this.weather = new Weather(data["weather"]);
        }
        this.ts = data["ts"];
    }
}