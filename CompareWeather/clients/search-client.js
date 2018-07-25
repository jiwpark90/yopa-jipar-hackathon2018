import DataLoader from './data-loader';
import City from '../classes/city';
import Country from '../classes/country';

export default class SearchClient {
    constructor() {
        this.data = new DataLoader();
    }

    async searchCity(cityName) {
        var cities = this.data.getCities();
        var cityData = await cities.filter((city) => {
            city.name.toLowerCase() === cityName.toLowerCase();
        });
          
        if(cityData !== null && cityData !== "") {
            return new City(cityData);
        } else {
            return null;
        }
    }

    async searchCountry(countryName) {
        var countries = this.data.getCountries();
        var countryData = await countries.filter((country) => {
            country.name.toLowerCase() === countryName.toLowerCase();
        });
        
        if(countryData !== null && countryData !== "") {
            return new Country(countryData);
        } else {
            return null;
        }
    }
}