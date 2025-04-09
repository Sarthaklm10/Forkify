import { API_KEY, API_URL, RESULTS_PER_PAGE } from "./config";
import { AJAX } from "./helpers";

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultsPerPage: RESULTS_PER_PAGE,
        page: 1,
    },
    bookmarks: [],
};

const createRecipeObject = function (data) {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,

        //add `key` property only if it exists in recipe
        ...(recipe.key && { key: recipe.key }),
    };
};

export const loadRecipe = async function (id) {
    try {
        const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);
        state.recipe = createRecipeObject(data);

        state.recipe.bookmarked = state.bookmarks.some(bookmark => bookmark.id === id);

        console.log(state.recipe);
    } catch (err) {
        console.error(`${err}🔥🔥🔥`);
        throw err;
    }
};

export const loadSearchResults = async function (query) {
    try {
        state.search.query = query;
        const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
        // console.log(data.data.recipes);

        state.search.results = data.data.recipes.map(rec => ({
            id: rec.id,
            title: rec.title,
            publisher: rec.publisher,
            image: rec.image_url,
            ...(rec.key && { key: rec.key }),
        }));

        state.search.page = 1;
    } catch (err) {
        console.error(`${err}🔥`);
        throw err;
    }
};

export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;

    console.log(start, end);
    return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        const perServe = ing.quantity / state.recipe.servings;
        ing.quantity = newServings * perServe;
    });
    state.recipe.servings = newServings;
};

const persistBookmarks = function () {
    localStorage.setItem('bookmark', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
    state.bookmarks.push(recipe);
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmarks();
};

export const removeBookmark = function (id) {
    const index = state.bookmarks.findIndex(elt => elt.id === id);
    state.bookmarks.splice(index, 1);
    state.recipe.bookmarked = false;
    persistBookmarks();
};

const clearBookmarks = function () {
    localStorage.clear('bookmarks');
};

const init = function () {
    const storage = localStorage.getItem('bookmark');
    if (storage) state.bookmarks = JSON.parse(storage);
};
init();

export const uploadRecipe = async function (newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe)
            .filter(entry => entry[0].startsWith("ingredient") && entry[1] !== "")
            .map(ing => {
                const ingArr = ing[1].split(',').map(el => el.trim());
                if (ingArr.length !== 3 || ingArr[2] === '')
                    throw new Error("Wrong ingredient format! Please use the format: 'Quantity,Unit,Description'");
                const [quantity, unit, description] = ingArr;
                return {
                    quantity: quantity ? +quantity : null,
                    unit,
                    description
                };
            });

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: Number(newRecipe.cookingTime),
            servings: Number(newRecipe.servings),
            ingredients: ingredients,
        };

        console.log(recipe);

        const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
        state.recipe = createRecipeObject(data);

        // Add bookmark to the new recipe
        addBookmark(state.recipe);

        console.log(data)
    } catch (err) {
        throw err;
    }
};
