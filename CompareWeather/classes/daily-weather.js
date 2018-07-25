module.exports = class DailyWeather {
    constructor(data) {
        this.dateTime = this.data.data.dateTime;
        this.maxTemperature = this.data.data.max_temp;
        this.minTemperature = this.data.data.min_temp;
        this.humidity = this.data.data.precip;
        this.ts = this.data.data.ts;
        if(this.data.data.min_temp_ts !== null && this.data.data.min_temp_ts !== "") {
            this.min_temp_ts = this.data.data.min_temp_ts;
        }
        if(this.data.data.mix_temp_ts !== null && this.data.data.max_temp_ts !== "") {
            this.max_temp_ts = this.data.data.max_temp_ts;
        }
    }
}