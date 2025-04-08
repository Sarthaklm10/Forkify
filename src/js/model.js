import { API_URL, RESULTS_PER_PAGE } from "./config";
import { getJSON } from "./helpers"

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultsPerPage: RESULTS_PER_PAGE,
        page: 1,
    },
    bookmarks: [],
}

export const loadRecipe = async function (id) {
    try {
        const data = await getJSON(`${API_URL}/${id}`)

        let { recipe } = data.data;
        state.recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients,
        }

        if (state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;

        console.log(state.recipe);
    }

    catch (err) {
        console.error(`${err}🔥🔥🔥`);
        throw err;
    }
}

export const loadSearchResults = async function (query) {
    try {
        state.search.query = query;
        const data = await getJSON(`${API_URL}?search=${query}`);
        console.log(data.data.recipes);
        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
            }
        })
        state.search.page = 1;
    }
    catch (err) {
        console.error(`${err}🔥`);
        throw err;
    }
}

// default value of page=1
export const getSearchResultsPage = function (page = state.search.page) {

    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage;         // page=2 start=10

    const end = page * state.search.resultsPerPage          // end=20 (not included) 

    console.log(start, end);
    return state.search.results.slice(start, end);
}

export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        const perServe = ing.quantity / state.recipe.servings;
        ing.quantity = newServings * perServe;
    })
    state.recipe.servings = newServings;
}

const persistBookmarks = function () {
    localStorage.setItem('bookmark', JSON.stringify(state.bookmarks));
}

export const addBookmark = function (recipe) {
    state.bookmarks.push(recipe);
    if (recipe.id === state.recipe.id)
        state.recipe.bookmarked = true;
    persistBookmarks();
}

export const removeBookmark = function (id) {
    const index = state.bookmarks.findIndex(elt => elt.id === id);
    state.bookmarks.splice(index, 1);
    state.recipe.bookmarked = false;
    persistBookmarks();
}

const clearBookmarks = function () {
    localStorage.clear('bookmarks');
}

const init = function () {
    // Key=Bookmark
    const storage = localStorage.getItem('bookmark');

    // Convert string to object
    if (storage) state.bookmarks = JSON.parse(storage);
}

init();
// console.log(state.bookmarks);
export const uploadRecipe = async function (newRecipe) {

}