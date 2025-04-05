import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
    _parentElement = document.querySelector(".pagination");

    _generateMarkup() {
        const currentPg = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        console.log(numPages);

        // PAGE1 & other pages ...
        if (currentPg === 1 && numPages >= 2) {
            return `
            <button class="btn--inline pagination__btn--next">
            <span>Page 2</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
            `
        }

        // "PAGE 1 ONLY"
        else if (currentPg === 1 && numPages === 1) {
            return ``
        }

        // "LAST PAGE"
        else if (currentPg === numPages && numPages > 1) {
            return `
            <button class="btn--inline  pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPg - 1}</span>
          </button>
            `
        }
        // "MIDDLE PAGE"
        else {
            return `
            <button class="btn--inline  pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPg - 1}</span>
          </button>

          <button class="btn--inline pagination__btn--next">
            <span>Page ${currentPg + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>

          `
        }
    }
}
export default new PaginationView();