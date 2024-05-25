import ApiService from './framework/api-service';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class EventsApiService extends ApiService {
  #apiConfig = null;
  constructor(apiConfig) {
    super(apiConfig.END_POINT, apiConfig.AUTHORIZATION);
    this.#apiConfig = apiConfig;
  }

  get events() {
    return this._load({ url: this.#apiConfig.EVENTS_URL }).then(
      ApiService.parseResponse
    );
  }

  get cities() {
    return this._load({ url: this.#apiConfig.DESTINATIONS_URL }).then(
      ApiService.parseResponse
    );
  }

  get offers() {
    return this._load({ url: this.#apiConfig.OFFERS_URL }).then(
      ApiService.parseResponse
    );
  }

  updateEvent = async (event) => {
    const request = {
      url: `${this.#apiConfig.EVENTS_URL}/${event.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    };
    const response = await this._load(request);
    return await ApiService.parseResponse(response);
  };

  addEvent = async (event) => {
    const request = {
      url: this.#apiConfig.EVENTS_URL,
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    };
    const response = await this._load(request);
    return await ApiService.parseResponse(response);
  };

  deleteEvent = async (event) => {
    const request = {
      url: `${this.#apiConfig.EVENTS_URL}/${event.id}`,
      method: Method.DELETE,
    };
    return await this._load(request);
  };

  #adaptToServer = (event) => {
    const adaptedEvent = {
      ...event,
      ['base_price']: event.basePrice,
      ['date_from']: event.dateFrom,
      ['date_to']: event.dateTo,
      ['is_favorite']: event.isFavorite,
    };
    delete adaptedEvent.basePrice;
    delete adaptedEvent.dateFrom;
    delete adaptedEvent.dateTo;
    delete adaptedEvent.isFavorite;
    return adaptedEvent;
  };
}
