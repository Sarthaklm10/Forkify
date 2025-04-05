import icons from 'url:../../img/icons.svg';
export default class View {
  _data;

  render(data) {

    // if (!data)
    //   return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  _clear() {
    console.log(this._parentElement);
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>`
    this._parentElement.innerHTML = "";
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
    console.log(icons);
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
    <div>
      <svg>
        <use href="src/img/icons.svg#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>
    `;
    console.log(this._parentElement);

    this._parentElement.innerHTML = "";
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._successMessage) {
    const markup = `
    <div class="message">
    <div>
      <svg>
        <use href="src/img/icons.svg#icon-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>
    `;

    this._parentElement.innerHTML = "";
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}