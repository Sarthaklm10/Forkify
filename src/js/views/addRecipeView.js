import View from "./View";

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _message = 'Recipe was successfully uploaded!';
    _window = document.querySelector(".add-recipe-window");
    _overlay = document.querySelector(".overlay");
    _btnOpen = document.querySelector(".nav__btn--add-recipe");
    _btnClose = document.querySelector(".btn--close-modal");

    toggleWindow() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }

    constructor() {
        super();
        this._btnOpen.addEventListener('click', () => this.toggleWindow());
        this._btnClose.addEventListener('click', () => this.toggleWindow());
        this._overlay.addEventListener('click', () => this.toggleWindow());
    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener("submit", e => {
            e.preventDefault();
            console.log(`addHandlerUpload RUNNING`);

            const dataArr = [...new FormData(this._parentElement)];
            const data = Object.fromEntries(dataArr);
            handler(data);
        });
    }

    _generateMarkup() {
        
    }
}

export default new AddRecipeView();