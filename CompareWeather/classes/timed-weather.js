import Weather from './weather';
import City from './city';

module.exports = class TimedWeather {
    constructor(data) {
        this.dateTime = this.data.data.datetime;
        this.temperature = this.data.data.temp;
        this.humidity = this.data.data.precip;
        if(this.data.data.weather !== null && this.data.data.weather !== "") {
            this.weather = new Weather(this.data.data.weather);
        }
        this.ts = this.data.data.ts;
    }
}