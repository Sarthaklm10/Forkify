class SearchView {
    _parentElt = document.querySelector('.search');

    _clearInput() {
        this._parentElt.querySelector(".search__field").value = "";
    }

    getQuery() {
        const query = this._parentElt.querySelector(".search__field").value;
        this._clearInput();
        return query;
    }

    addHandlerSearch(handler) {
        this._parentElt.addEventListener("submit", function (e) {
            //Prevent page reload (default)
            e.preventDefault();
            handler();
        })
    }
}
export default new SearchView();