import WeatherClient from './weather-client';
import DailyWeather from '../classes/daily-weather';
import TimedWeather from '../classes/timed-weather';
// import SearchClient from '../clients/search-client';

import Moment from 'moment'

const APIKEY = "ae46aaa31d4845ae9e4ed0bcf6417ce7";

export default class WeatherDataLoader {
    constructor() {
        this.weatherClient = new  WeatherClient(APIKEY);
    }

    getWeatherData(city, country){
        // var searchClient = new SearchClient();
        // var seoul = searchClient.SearchCity("seoul");
        // console.log(seoul.id);

        var currentTime = Moment();
        this.getYesterday(currentTime, 'Seoul', 'KR');
        this.getToday(currentTime, 'Seoul', 'KR');
        this.getForecast(currentTime, 'Seoul', 'KR');
    }

    //return 3 hour interval
    //return daily average
    async getYesterday(currentTime, city, country) {
        var endDate = currentTime.format('YYYY-MM-DD');
        var startDate = currentTime.add(-1, 'days').format('YYYY-MM-DD');
        var hourly = await this.weatherClient.getHistoricalWeatherHourlyDataAsync(city, country, startDate, endDate)
            .then((data) => {
                return data;
            });
        var daily = await this.weatherClient.getHistoricalWeatherDailyDataAsync(city, country, startDate, endDate)
            .then((data) => {
                return data;
            });
            
        this.transform(hourly, daily);
    }

    //return current
    //return daily forecast for 3 hour interval
    async getToday(currentTime, city, country) {
        var startDate = currentTime.format('YYYY-MM-DD:[00]')
        var endDate = currentTime.format('YYYY-MM-DD:hh')
        console.log(startDate, endDate);
        var hourlyPrevious = await this.weatherClient.getHistoricalWeatherHourlyDataAsync(city, country, startDate, endDate);
        var hourlyAfter = await this.weatherClient.getFiveDayForecastWeatherDataAsync(city, country)
        var daily = await this.weatherClient.getCurrentWeatherDataAsync(city, country)
            .then((data) => {
                return data;
            });
    }

    //return forecast daily average
    //return forecast 3 hour interval
    //next five days
    async getForecast(currentTime, city, country) {
        var hourly = await this.weatherClient.getFiveDayForecastWeatherDataAsync(city, country)
            .then((data) => {
                return data;
            });

       //filter hourly forcast to filter out from tomorrow's time 

        var daily = await this.weatherClient.getSixteenDayForecastWeatherDataAsync(city, country)
            .then((data) => {
                return data;
            });

        // return this.mergeHourlyWithDaily(hourly, daily)
    }

    // merge hourly data and daily data to normalize
    // returns normalized-weather
    transform(hourly, daily) {
        console.log(hourly);
    }

    // merge hourly prev and hourly after to form single hourly
    // returns hourly data
    mergeHourlyWithHourly(hourlyLeft, hourlyRight) {
        
    }
}