export default class City {
    constructor(data) {
        this.id = data.city_id;
        this.name = data.city_name;
        this.stateCode = data.state_code;
        this.stateName = data.state_name;
        this.countyCode = data.country_code;
        this.countryName = data.country_name;
        this.largeCity = (data.large_city == 'true');
        this.smallCity = (data.small_city == 'true');
    }
}
