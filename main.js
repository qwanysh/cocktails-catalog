const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?';

$('#searchButtonName').on('click', function (event) {
  event.preventDefault();
  const cocktailName = $('#cocktailName').val();

  clearContainer();
  searchCocktailsByName(cocktailName);
});

$('#searchButtonIngredient').on('click', function (event) {
  event.preventDefault();
  const ingredientName = $('#ingredientName').val();

  searchCocktailsByIngredient(ingredientName);
});

const searchCocktailsByName = cocktailName => {
  const url = BASE_URL + `s=${cocktailName}`;

  fetch(url).then(response => {
    return response.json();
  }).then(response => {
    renderCocktails(response.drinks);
  });
};

const searchCocktailsByIngredient = ingredientName => {
  const url = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?' + `i=${ingredientName}`;

  fetch(url).then(response => {
    return response.json();
  }).then(response => {
    return response.drinks.map(drink => drink.strDrink);
  }).then(cocktailNames => {
    clearContainer();
    for (const cocktailName of cocktailNames) {
      searchCocktailsByName(cocktailName);
    }
  });
};

const clearContainer = () => {
  const cocktailContainer = $('#cocktailsContainer');
  cocktailContainer.html('');
};

const renderCocktails = cocktails => {
  for (const cocktail of cocktails) {
    renderCocktail(cocktail);
  }
};

const renderCocktail = cocktail => {
  const cocktailContainer = $('#cocktailsContainer');

  const cocktailCard = $('<div class="col-12 col-md-6 col-lg-4">');
  cocktailCard.html(`
    <div class="card mb-2">
      <img src="${cocktail.strDrinkThumb}" class="card-img-top" alt="${cocktail.strDrink}">
      <div class="card-body">
      <h5 class="card-title">${cocktail.strDrink}</h5>
      <a href="#" class="btn btn-primary">Show details</a>
      </div>
    </div>
  `);

  const cocktailDetailsButton = cocktailCard.find('a.btn');
  cocktailDetailsButton.on('click', () => showDetailModal(cocktail));

  cocktailContainer.append(cocktailCard);
};

const showDetailModal = cocktail => {
  const detailModal = $('<div class="modal">');

  const ingredients = getIngredientsOfCocktail(cocktail);

  const ingredientsHtml = ingredients.map((ingredient, index) => {
    return `
      <div class="card mb-2">
        <div class="card-header d-flex align-items-center searchLinkIngredient" 
            data-ingredient-name="${ingredient.name}" 
            id="heading${index}" data-toggle="collapse" 
            data-target="#collapse${index}" 
            aria-expanded="false">
          <img src="${ingredient.imageUrl}" class="mr-3" alt="${ingredient.name}" style="width: 10%">
          <div class="media-body">
            <h5 class="mt-0 mb-1">${ingredient.name}${ingredient.measure ? ` (${ingredient.measure})` : ''}</h5>
          </div>
        </div>
        <div id="collapse${index}" class="collapse" aria-labelledby="headingOne">
          <div class="card-body"></div>
        </div>
      </div>
    `;
  }).join('');

  detailModal.html(`
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${cocktail.strDrink}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <h5>Ingredients:</h5>
          <ul class="list-unstyled">${ingredientsHtml}</ul>
          <h5>Instructions:</h5>
          <p>${cocktail.strInstructions}</p>
          <h5>Glass:</h5>
          <p>${cocktail.strGlass}</p>
          <h5>Is alhocolic:</h5>
          <p>${cocktail.strAlcoholic.toLowerCase() === 'alcoholic' ? 'Yes' : 'No'}</p>
          <h5>Category:</h5>
          <p>${cocktail.strCategory}</p>
        </div>
      </div>
    </div>
  `);

  detailModal.find('.searchLinkIngredient').on('click', renderIngredientDetails);

  $('body').append(detailModal);
  detailModal.modal();
};

function renderIngredientDetails() {
  const ingredientName = $(this).attr('data-ingredient-name');
  const detailContainer = $(this).next().find('.card-body');
  const url = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?' + `i=${ingredientName}`;

  fetch(url).then(response => {
    return response.json();
  }).then(response => {
    const ingredient = response.ingredients[0];
    const properties = ['Ingredient', 'Description', 'Type', 'Alcohol', 'ABV'];
    let detailHtml = '';

    for (const property of properties) {
      const propertyValue = ingredient[`str${property}`];
      if (propertyValue) {
        detailHtml += `
          <h5>${property}:</h5>
          <p>${propertyValue}</p>
        `;
      }
    }

    detailContainer.html(detailHtml);

    const searchByIngredientButton = $(
      '<button class="btn btn-primary">Search cocktails with this ingredient</button>'
    ).on('click', () => {
      searchCocktailsByIngredient(ingredientName);
    });

    detailContainer.append(searchByIngredientButton);
  });
}

const getIngredientsOfCocktail = cocktail => {
  const ingredients = [];
  let index = 1;
  let ingredientName = cocktail[`strIngredient${index}`];

  while (ingredientName) {
    const ingredientObject = {
      name: ingredientName,
      measure: cocktail[`strMeasure${index}`],
      imageUrl: `https://www.thecocktaildb.com/images/ingredients/${ingredientName}.png`,
    };
    ingredients.push(ingredientObject);
    index++;
    ingredientName = cocktail[`strIngredient${index}`];
  }

  return ingredients;
};