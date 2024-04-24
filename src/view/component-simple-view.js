import { createElement } from '../render';

export default class ComponentSimpleView {
  createComponentTemplace() {
    return '';
  }

  getTemplate() {
    return this.createComponentTemplace();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
