const cities = require('../data/cities_partial');
const countries = require('../data/countries');

export default class DataLoader {
    getCities() {
        return cities;
    }

    getCountries() {
        return countries;
    }
}