'use strict';

const cakeRecipes = require("./cake-recipes.json");
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


// Function to get unique authors
const getUniqueAuthors = (recipes) => {
  const authors = [];
  recipes.forEach(recipe => {
    if (!authors.includes(recipe.Author)) {
      authors.push(recipe.Author);
    }
  });
  return authors;
}

// Function to log the name of each recipe
const logRecipeNames = (recipes) => {
  if (recipes.length === 0) {
    console.log("No recipes found.");
    return;
  }
  recipes.forEach(({ Name }) => {
    console.log(Name);
  });
}

// Function to get all recipes of a given author
const getRecipesByAuthor = (recipes, author) => {
  return recipes.filter(recipe => recipe.Author === author);
}

// Function to get recipes by ingredient
const getRecipesByIngredient = (recipes, ingredient) => {
  return recipes.filter(recipe =>
    recipe.Ingredients.some(item => item.toLowerCase().includes(ingredient.toLowerCase()))
  );
}

// Function to get recipe by name
const getRecipeByName = (recipes, name) => {
  return recipes.find(recipe => recipe.Name.toLowerCase().includes(name.toLowerCase()));
}

// Function to get all ingredients of a recipe list
const getAllIngredients = (recipes) => {
  return recipes.reduce((ingredients, recipe) => {
    return [...ingredients, ...recipe.Ingredients];
  }, []);
}

// Global variable to save ingredients
let savedIngredients = [];

const saveRecipeIngredients = (recipe) => {
  savedIngredients.push(...recipe.Ingredients);
}

const getAllIngredientsOfSavedRecipes = () => {
  return savedIngredients;
}

const displayMenu = () => {
  console.log("\nRecipe Management System Menu:");
  console.log("1. Show All Authors");
  console.log("2. Show Recipe names by Author");
  console.log("3. Show Recipe names by Ingredient");
  console.log("4. Get Recipe by Name");
  console.log("5. Get All Ingredients of Saved Recipes");
  console.log("0. Exit");
}
// resolve user input for node enviorment
const getUserInput = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
}
// display menu system for user input
const main = async () => {
  let choice;
  do {
    displayMenu();
    choice = parseInt(await getUserInput("Enter a number (1-5) or 0 to exit: "), 10);

    switch (choice) {
      case 1:
        const allAuthors = getUniqueAuthors(cakeRecipes);
        console.log("All Authors:", allAuthors);
        break;
      case 2:
        const authorName = await getUserInput("Enter the name of the author: ");
        const recipesByAuthor = getRecipesByAuthor(cakeRecipes, authorName);
        logRecipeNames(recipesByAuthor);
        break;
      case 3:
        const ingredientName = await getUserInput("Enter the name of the ingredient: ");
        const recipesByIngredient = getRecipesByIngredient(cakeRecipes, ingredientName);
        logRecipeNames(recipesByIngredient);
        break;
      case 4:
        const recipeName = await getUserInput("Enter the name of the recipe: ");
        const foundRecipe = getRecipeByName(cakeRecipes, recipeName);
        if (foundRecipe) {
          console.log("Recipe Details:", foundRecipe);
          const saveOption = await getUserInput("Do you want to save the ingredients of this recipe? (yes/no): ");
          if (saveOption.toLowerCase() === 'yes') {
            saveRecipeIngredients(foundRecipe);
          }
        } else {
          console.log("Recipe not found.");
        }
        break;
      case 5:
        const allSavedIngredients = getAllIngredientsOfSavedRecipes();
        console.log("All Ingredients of Saved Recipes:", allSavedIngredients);
        break;
      case 0:
        console.log("Exiting...");
        break;
      default:
        console.log("Invalid input. Please enter a number between 0 and 5.");
    }
  } while (choice !== 0);

  rl.close();
}

main();
