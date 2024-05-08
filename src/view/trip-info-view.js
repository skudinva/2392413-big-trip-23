import AbstractView from '../framework/view/abstract-view';
import { getPeriodString } from '../utils';

export default class TripInfoView extends AbstractView {
  #tripInfo = null;
  constructor({ tripInfo }) {
    super();
    this.#tripInfo = tripInfo;
  }

  get template() {
    const { destinationInfo, cost } = this.#tripInfo;
    const destinationPath = destinationInfo
      .map((destination) => destination.cityName)
      .join(' &mdash; ');

    const dateInfo = getPeriodString(
      destinationInfo[0].date,
      destinationInfo[destinationInfo.length - 1].date,
      '&nbsp;&mdash;&nbsp;'
    );
    return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${destinationPath}</h1>

      <p class="trip-info__dates">${dateInfo}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>
  </section>`;
  }
}
