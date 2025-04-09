import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render received object to DOM
   * @param {Object|Object[]} data Data to be rendered 
   * @param {boolean} [render=true] If false, create markup string instead of rendering
   * @returns {undefined|string} A markup string returned if render=false
   * @this {View} View instance  
   */
  render(data, render = true) {
    // Check if data is an array & is not empty 
    if (!data || Array.isArray(data) && data.length === 0)
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render)
      return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Clears the parent element's content
   * @private
   * @this {View}
   */
  _clear() {
    // console.log(this._parentElement);
    this._parentElement.innerHTML = '';
  }

  /**
   * Efficiently updates the DOM using virtual DOM diffing
   * @param {Object} data Updated data to be patched into the view
   * @this {View}
   */
  update(data) {
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
          // console.log(attr);
          curEl.setAttribute(attr.name, attr.value);
        })
      }
    })
  }

  /**
   * Render a loading spinner inside parent element
   * @this {View}
   */
  renderSpinner() {
    const markup = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>`
    this._parentElement.innerHTML = "";
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
    // console.log(icons);
  }

  /**
   * Render an error message to the DOM
   * @param {string} [message=this._errorMessage] The message to show
   * @this {View}
   */
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

  /**
   * Render a generic success message to the DOM
   * @param {string} [message=this._message] The message to show
   * @this {View}
   */
  renderMessage(message = this._message) {
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