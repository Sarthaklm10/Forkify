import icons from 'url:../../img/icons.svg';
export default class View {
  _data;

  render(data) {

    // Check if data is an array & is not empty 
    if (!data || Array.isArray(data) && data.length === 0)
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  _clear() {
    console.log(this._parentElement);
    this._parentElement.innerHTML = '';
  }

  update(data) {
    // Check if data is an array & is not empty 
    // if (!data || Array.isArray(data) && data.length === 0)
    //   return this.renderError();

    this._data = data;
    const newMarkup = this._generateMarkup();

    // Convert string to new DOM object(virtual DOM)
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDOM.querySelectorAll("*"));

    const curElements = Array.from(this._parentElement.querySelectorAll("*"));

    newElements.forEach((newEl, i) => {

      const curEl = curElements[i];
      // console.log(newEl, newEl.isEqualNode(curEl));

      // Update the textcontent of the current element
      if (!newEl.isEqualNode(curEl)
        && newEl.firstChild?.nodeValue.trim() !== '') curEl.textContent = newEl.textContent;

      // Update attributes of current elt
      if (!newEl.isEqualNode(curEl)) {
        const arr = Array.from(newEl.attributes)
        // console.log(arr);
        arr.forEach(function (attr) {
          console.log(attr);
          curEl.setAttribute(attr.name, attr.value);
        })
      }
    })
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
        <use href="${icons}#icon-alert-triangle"></use>
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
        <use href="${icons}#icon-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>
    `;

    this._parentElement.innerHTML = "";
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}