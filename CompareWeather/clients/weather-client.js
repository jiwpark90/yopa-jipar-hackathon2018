import Axios from 'axios';

const baseUrl = "https://api.weatherbit.io/v2.0/";

// utilizing Weatherbit's API
export default class WeatherClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async getCurrentWeatherDataAsync(city, country) {
        return await Axios.get(baseUrl + "current?city=" + city + "&county=" + country + "&key=" + this.apiKey)
            .then((response) => {
                return response.data;
            }).catch((err) => {
                console.log(err);
            });
    }

    // async getCurrentWeatherDataAsync(latitude, longitude) {
    //     return await Axios.get(this.baseUrl + "current?lat="+latitude + "&lon" + longitude + "&key=" + this.apiKey);
    // }

    // async getCurrentWeatherDataAsync(cityId) {
    //     return await Axios.get(this.baseUrl + "current?city_id="+cityId+"&akey" + this.apiKey);
    // }

    // returns historical data between two dates by hourly
    async getHistoricalWeatherHourlyDataAsync(city, country, startDate, endDate) {
        return await Axios.get(baseUrl + "history/hourly?city=" + city + "&country=" + country + "&start_date=" + startDate + "&end_date=" + endDate + "&key=" + this.apiKey)
            .then((response) => {
                return response.data;
            }).catch((err) => {
                console.log(err);
            });
    }

    // async getHistoricalWeatherHourlyDataAsync(latitude, longitude, startDate, endDate) {
    //     return await Axios.get(this.baseUrl + "history/hourly?lat=" + latitude + "&lon" + longitude + "start_date=" + startDate + "&end_date=" + endDate + "&key=" + this.apiKey);
    // }

    // async getHistoricalWeatherHourlyDataAsync(cityId, startDate, endDate) {
    //     return await Axios.get(this.baseUrl + "history/hourly?city_id=" + cityId + "&key=" + this.apiKey)
    //         .then((response) => {
    //             return response;
    //         });
    // }

    // returns historical data between two dates by daily
    async getHistoricalWeatherDailyDataAsync(city, country, startDate, endDate) {
        return await Axios.get(baseUrl + "history/daily?city=" + city + "&country=" + country + "&start_date=" + startDate + "&end_date=" + endDate + "&key=" + this.apiKey)
            .then((response) => {
                return response.data;
            }).catch((err) => {
                console.log(err);
            });
    }
    
    // async getHistoricalWeatherDailyDataAsync(latitude, longitude, startDate, endDate) {
    //     return await Axios.get(this.baseUrl + "history/daily?lat=" + latitude + "&lon=" + longitude + "&start_date=" + startDate + "&end_date=" + endDate + "&key=" + this.apiKey);
    // }

    // async getHistoricalWeatherDailyDataAsync(cityId, startDate, endDate) {
    //     return await Axios.get(this.baseUrl + "history/daily?city_id=" + cityId + "&start_date=" + startDate + "&end_date=" + endDate + "&key=" + this.apiKey);
    // }

    // get 5 day forecast data at 3 hours interval
    async getFiveDayForecastWeatherDataAsync(city, country) {
        return await Axios.get(baseUrl + "forecast/3hourly?city=" + city + "&country=" + country + "&key=" + this.apiKey)
            .then((response) => {
                return response.data;
            }).catch((err) => {
                console.log(err);
            });
    }

    // async getFiveDayForecastWeatherDataAsync(latitude, longitude) {
    //     return await Axios.get(this.baseUrl + "forecast/3hourly?lat=" + latitude + "&lon=" + longitude +"&key=" + this.apiKey);
    // }

    // async getFiveDayForecastWeatherDataAsync(cityId) {
    //     return await Axios.get(this.baseUrl + "forecast/3hourly?city_id=" + cityId + "&key=" + this.apiKey);
    // }

    // get 16 day forecast data at 1 day interval
    async getSixteenDayForecastWeatherDataAsync(city, country) {
        return await Axios.get(baseUrl + "forecast/daily?city=" + city + "&country=" + country + "&key=" + this.apiKey)
            .then((response) => {
                return response.data;
            }).catch((err) => {
                console.log(err);
            });
    }

    // async getSixteenDayForecastWeatherDataAsync(latitude, longitude) {
    //     return await Axios.get(this.baseUrl + "forecast/daily?lat=" + latitude + "&lon=" + longitude + "&key=" + this.apiKey);
    // }

    // async getSixteenDayForecastWeatherDataAsync(cityId) {
    //     return await Axios.get(this.baseUrl + "forecast/daily?city_id=" + cityId + "&key=" + this.apiKey);
    // }
}