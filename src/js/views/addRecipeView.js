import View from "./View";
class addRecipeView extends View {

    _parentElement = document.querySelector(".upload")
    _window = document.querySelector(".add-recipe-window");
    _overlay = document.querySelector(".overlay");
    _btnOpen = document.querySelector(".nav__btn--add-recipe")
    _btnClose = document.querySelector(".btn--close-modal")

    addHandlerToggleWindow(handler) {
        const toggleWindow = () => {
            this._overlay.classList.toggle('hidden');
            this._window.classList.toggle('hidden');
            handler();
        };
        this._btnOpen.addEventListener("click", toggleWindow);
        this._btnClose.addEventListener("click", toggleWindow);
    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener("submit", e => {

            console.log(`addHandlerUpload RUNNING`);
            // prevents reloading page
            e.preventDefault();

            // FormData grabs all input fields from form
            // Spread converts FormData to array of entries

            const dataArr = [...new FormData(this._parentElement)];
            
            // Convert array of entries to object
            const data = Object.fromEntries(dataArr);
            handler(data);
        })
    }

    _generateMarkup() {

    }
}
export default new addRecipeView();