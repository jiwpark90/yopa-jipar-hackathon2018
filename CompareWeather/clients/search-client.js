import DataLoader from './data-loader';
import City from '../classes/city';
import Country from '../classes/country';

class SearchHandler {
    cities = [];
    countries = [];
    citiesLoaded = false;
    countriesLoaded = false;

    constructor() {
        this.data = new DataLoader();
    }

    searchCity(cityName, contains, caseInsensitive) {
        if (!this.citiesLoaded) {
            this.cities = this.data.getCities();
            this.citiesLoaded = true;
        }

        let cityData = this.cities.filter((city) => {
            if (contains) {
                if (caseInsensitive) {
                    return city.city_name.search(new RegExp(cityName, 'i')) !== -1;
                } else {
                    return city.city_name.search(new RegExp(cityName)) !== -1;
                }
            } else {
                if (caseInsensitive) {
                    return city.city_name.toLowerCase() === cityName.toLowerCase();
                } else {
                    return city.city_name === cityName;
                }
            }
        });

        if (cityData) {
            return cityData.map((city) => (new City(city)));
        } else {
            return [];
        }
    }

    searchCountry(countryName) {
        if (!this.countriesLoaded) {
            this.countries = this.data.getCountries();
            this.countriesLoaded = true;
        }

        var countryData = this.countries.filter((country) => {
            country.name.toLowerCase() === countryName.toLowerCase();
        });
        
        if(countryData !== null && countryData !== "") {
            return new Country(countryData);
        } else {
            return null;
        }
    }
}

const searchClient = new SearchHandler();
const searchCity = (cityName, contains = true, caseInsensitive = false) => {
    return searchClient.searchCity(cityName, contains, caseInsensitive);
}

export {
    searchCity
}