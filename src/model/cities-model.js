import { getCities } from '../mock/city';

export default class CitiesModel {
  cities = getCities();
  getCities() {
    return this.cities;
  }

  getCityById(id) {
    return this.getCities().find((city) => city.id === id);
  }
}
