import { createElement } from '../render';

export default class ComponentSimpleView {
  createComponentTemplate() {
    return '';
  }

  getTemplate() {
    return this.createComponentTemplate();
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
