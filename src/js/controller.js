import * as model from './model.js';

// Polyfilling
import 'core-js/stable';
import 'regenerator-runtime/runtime'
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

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


const init = function () {
  console.log("Init called ✅");
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(
    controlSearchResults);
};
init();

// window.addEventListener('load', controlRecipes);
// window.addEventListener('hashchange', controlRecipes);

///////////////////////////////////////