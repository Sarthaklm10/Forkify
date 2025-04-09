import * as model from './model.js';

// Polyfilling
import 'core-js/stable';
import 'regenerator-runtime/runtime'
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {

    console.log("🔄 controlRecipes called");
    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks)

    // 1-LOADING RECIPE
    await model.loadRecipe(id);
    console.log("✅ Loaded recipe data:", model.state.recipe);

    // RENDERING RECIPE
    recipeView.render(model.state.recipe);

  }
  catch (err) {
    recipeView.renderError();
  }
}

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    console.log(resultsView);
    // Get search query from search bar
    const query = searchView.getQuery();
    if (!query) return;

    // Load search results 
    await model.loadSearchResults(query);

    // Render search results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage(1));

    // RENDER PAGINATION
    paginationView.render(model.state.search)
  }
  catch (err) {
    console.log(err);
  }
}

const controlPagination = function (goToPage) {
  console.log("PAGINATION CONTROLLER");
  console.log(goToPage);

  // RENDER NEW RESULTS:
  resultsView.render(model.getSearchResultsPage(goToPage));

  // RENDER NEW PAGINATION BUTTONS
  paginationView.render(model.state.search);
}

const controlServings = function (newServings) {
  // UPDATE RECIPE SERVINGS 
  console.log(`CONTROLLING SERVINGS`);
  model.updateServings(newServings);

  console.log(newServings);

  // UPDATE entire RECIPE VIEW  
  // recipeView.render(model.state.recipe);

  // Update only the servings in the recipe view
  recipeView.update(model.state.recipe)
}

const controlAddBookmark = function () {

  // console.log("CONTROLLER FOR BOOKMARKS RUNNING");
  // ADD BOOKMARK
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);

  // Remove bookmark
  else model.removeBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function () {
  const bookmarks = model.state.bookmarks;
  bookmarksView.render(bookmarks);
}

const controlAddRecipe = async function (newRecipe) {
  console.log(newRecipe);
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    recipeView.render(model.state.recipe)

    addRecipeView.renderMessage();

    // Update bookmark view(add new recipe)
    bookmarksView.render(model.state.bookmarks);

    // Update ID in URL
    window.history.pushState(null, "", `#${model.state.recipe.id}`)

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000)
  }
  catch (err) {
    console.error("😭", err);
    addRecipeView.renderError(err.message);
  }
}

const init = function () {
  console.log("Init called ✅");
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);

  searchView.addHandlerSearch(
    controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
const clear = function () {
  localStorage.clear();
}
// clear();
// window.addEventListener('load', controlRecipes);
// window.addEventListener('hashchange', controlRecipes);

///////////////////////////////////////