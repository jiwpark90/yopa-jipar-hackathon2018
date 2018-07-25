export default class Country {
    constructor(data) {
        this.id = data.country_code;
        this.name = data.country_name;
    }
}