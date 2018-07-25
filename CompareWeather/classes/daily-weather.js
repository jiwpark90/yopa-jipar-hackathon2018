module.exports = class DailyWeather {
    constructor(data) {
        this.dateTime = data["datetime"];
        this.maxTemperature = data["max_temp"];
        this.minTemperature = data["min_temp"];
        this.humidity = data["precip"];
        this.ts = data["ts"];
        if(data["min_temp_ts"] !== null && data["min_temp_ts"] !== "" && data["min_temp_ts"] !== undefined) {
            this.min_temp_ts = data["min_temp_ts"];
        }
        if(data["max_temp_ts"] !== null && data["max_temp_ts"] !== "" && data["max_temp_ts"] !== undefined) {
            this.max_temp_ts = data["max_temp_ts"];
        }
    }
}