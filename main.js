const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?';

$('#searchButton').on('click', function (event) {
  event.preventDefault();
  const cocktailName = $('#cocktailName').val();
  const url = BASE_URL + `s=${cocktailName}`;

  fetch(url).then(response => {
    return response.json();
  }).then(response => {
    renderCocktails(response.drinks);
  });
});

const renderCocktails = cocktails => {
  const cocktailContainer = $('#cocktailsContainer');
  cocktailContainer.html('');

  for (const cocktail of cocktails) {
    renderCocktail(cocktail);
  }
};

const renderCocktail = cocktail => {
  const cocktailContainer = $('#cocktailsContainer');

  const cocktailCard = $('<div class="col-4">');
  cocktailCard.html(`
    <div class="card">
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

  const ingredientsHtml = ingredients.map((ingredient) => {
    return `
      <li class="media">
        <img src="${ingredient.imageUrl}" class="mr-3" alt="${ingredient.name}" style="width: 10%">
        <div class="media-body">
          <h5 class="mt-0 mb-1">${ingredient.name}${ingredient.measure ? ` (${ingredient.measure})` : ''}</h5>
        </div>
      </li>
    `;
  });

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
          <ul class="list-unstyled">
            ${ingredientsHtml.join('')}
          </ul>
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

  $('body').append(detailModal);
  detailModal.modal();
};

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