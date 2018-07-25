import * as cities from '../data/cities_all.json';
import * as countries from '../data/countries.json';

export default class DataLoader {
    getCities() {
        return cities;
    }

    getCountries() {
        return countries;
    }
}