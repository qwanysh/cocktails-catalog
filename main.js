const DOMAIN = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?';

$('#searchButton').on('click', function (event) {
  event.preventDefault();
  const cocktailName = $('#cocktailName').val();
  const url = DOMAIN + `s=${cocktailName}`;

  fetch(url).then(response => {
    return response.json();
  }).then(response => {
    renderCocktails(response.drinks);
  });
});

const renderCocktails = cocktails => {
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

  cocktailContainer.append(cocktailCard);
};