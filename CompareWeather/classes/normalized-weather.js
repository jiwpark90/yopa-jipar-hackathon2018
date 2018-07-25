module.exports = class DailyWeather {
    constructor(yesterday, current, forecast) {
        this.yesterday = yesterday;
        this.current = current;
        this.forecast = forecast;
    }
}