import WeatherClient from './weather-client';
import DailyWeather from '../classes/daily-weather';
import TimedWeather from '../classes/timed-weather';
import NormalizedWeather from '../classes/normalized-weather';
// import SearchClient from '../clients/search-client';

import Moment from 'moment'

// const APIKEY = "ae46aaa31d4845ae9e4ed0bcf6417ce7";
const APIKEY = "2f04efc16cdb438faceba6d3d44e8236";

export default class WeatherDataLoader {
    constructor() {
        this.weatherClient = new  WeatherClient(APIKEY);
    }

    async getWeatherData(city, country){
        // var searchClient = new SearchClient();
        // var seoul = searchClient.SearchCity("seoul");
        // console.log(seoul.id);

        var currentTime = Moment();
        var yesterday = await  this.getYesterday(currentTime, 'Seattle', 'US');
        var current = await this.getToday(currentTime, 'Seoul', 'KR');
        var forecast = await this.getForecast(currentTime, 'Seoul', 'KR');

        return new NormalizedWeather(yesterday, current, forecast);
    }

    //return 3 hour interval
    //return daily average
    async getYesterday(currentTime, city, country) {
        var endDate = currentTime.format('YYYY-MM-DD');
        var startDate = currentTime.add(-1, 'days').format('YYYY-MM-DD');
        var hourly = await this.weatherClient.getHistoricalWeatherHourlyDataAsync(city, country, startDate, endDate)
            .then((data) => {
                return data.data;
            });
        var daily = await this.weatherClient.getHistoricalWeatherDailyDataAsync(city, country, startDate, endDate)
            .then((data) => {
                return data.data;
            });
        
        var hourlyFormatted = await this.transformHourly(hourly);
        var dailyFormatted = await this.transformDaily(daily);
        
        var transformedYesterday = await this.transform(hourlyFormatted, dailyFormatted);
        return transformedYesterday;
    }

    //return current
    //return daily forecast for 3 hour interval
    async getToday(currentTime, city, country) {
        var startDate = currentTime.format('YYYY-MM-DD:[00]')
        var endDate = currentTime.format('YYYY-MM-DD:hh')
        var hourlyPrevious = await this.weatherClient.getHistoricalWeatherHourlyDataAsync(city, country, startDate, endDate)
            .then((data) => {
                return data.data;
            });
        var hourlyAfter = await this.weatherClient.getFiveDayForecastWeatherDataAsync(city, country)
            .then((data) => {
                return data.data;
            });
        var daily = await this.weatherClient.getCurrentWeatherDataAsync(city, country)
            .then((data) => {
                return data.data;
            });

        var hourlyPreviousFormatted = await this.transformHourly(hourlyPrevious);
        var hourlyAfterFormatted = await this.transformHourly(hourlyAfter);
        var hourlyFormatted = this.mergeHourlyWithHourly(hourlyPreviousFormatted, hourlyAfterFormatted);
        var dailyFormatted = await this.transformDaily(daily);

        var transformedCurrent = await this.transform(hourlyFormatted, dailyFormatted);
        return transformedCurrent;
    }

    //return forecast daily average
    //return forecast 3 hour interval
    //next five days
    async getForecast(currentTime, city, country) {
        var hourly = await this.weatherClient.getFiveDayForecastWeatherDataAsync(city, country)
            .then((data) => {
                return data.data;
            });

        //filter hourly forcast to filter out from tomorrow's time 
        var daily = await this.weatherClient.getSixteenDayForecastWeatherDataAsync(city, country)
            .then((data) => {
                return data.data;
            });

        // return this.mergeHourlyWithDaily(hourly, daily)
        var hourlyFormatted = await this.transformHourly(hourly);
        var dailyFormatted = await this.transformDaily(daily);

        var transformedForecast = await this.transform(hourlyFormatted, dailyFormatted);
        return transformedForecast;
    }

    // merge hourly data and daily data to normalize
    // returns normalized-weather
    async transform(hourly, daily) {
        var transformedWeather = [];
        await daily.forEach((daily) => {
            if(daily.dateTime.length > 10) {
                daily.dateTime = Moment(daily.dateTime, "YYYY-MM-DD:HH").format("YYYY-MM-DD");
            }

            var filteredHourly = hourly.filter((hourly) => 
                hourly.dateTime.includes(daily.dateTime));

            if(filteredHourly.length > 0 && filteredHourly.length > 6)
            {
                transformedWeather.push({
                    dailyWeather: daily,
                    timedWeather: filteredHourly
                });
            }
        });

        return transformedWeather;
    }

    async transformHourly(hourly) {
        var hourlyData = [];
        await hourly.forEach((data) => {
            var timedWeather = new TimedWeather(data);
            hourlyData.push(timedWeather);
        });
        return hourlyData;
    }

    async transformDaily(daily) {
        var dailyData = [];
        await daily.forEach((data) => {
             var dailyWeather = new DailyWeather(data);
             dailyData.push(dailyWeather);
        }); 
        return dailyData;
    }

    // merge hourly prev and hourly after to form single hourly
    // returns hourly data
    mergeHourlyWithHourly(hourlyLeft, hourlyRight) {
        return hourlyLeft.concat(hourlyRight);
    }
}