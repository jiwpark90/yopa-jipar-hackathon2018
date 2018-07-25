export default class Weather {
    constructor(data) {
        this.icon = data.icon;
        this.code = data.code;
        this.description = data.description;
    }
}