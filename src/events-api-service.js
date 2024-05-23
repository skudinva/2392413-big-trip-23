import ApiService from './framework/api-service';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
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

  updateEvent = async (event) => {
    const request = {
      url: `${this.#apiConfig.EVENTS_URL}/${event.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({ 'Content-type:': 'application/json' }),
    };
    const response = await this._load(request);

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  };

  #adaptToServer = (event) => {
    const adaptedEvent = {
      ...event,
      ['base_price']: event.basePrice,
      ['date_from']: event.dateFrom.toISOString(),
      ['date_to']: event.dateTo.toISOString(),
      ['is_favorite']: event.isFavorite,
    };

    delete event.basePrice;
    delete event.dateFrom;
    delete event.dateTo;
    delete event.isFavorite;
    return adaptedEvent;
  };
}
