'use strict';

var allergyApp = {};

// call api and return recipe info based on query search	
allergyApp.getRecipes = function (query, allAllergies) {
	$.ajax({
		url: 'http://api.yummly.com/v1/api/recipes?_app_id=cb509487&_app_key=d64bdf3253f0c38225e7761cfa1151ef',
		method: 'GET',
		dataType: 'json',
		data: {
			requirePictures: true,
			q: query,
			allowedAllergy: allAllergies ? allAllergies : null
		}
	}).then(function (recipeData) {
		$('.resultsUl').html('');
		var filteredRecipes = recipeData.matches;
		// console.log(filteredRecipes);

		for (i = 0; i < filteredRecipes.length; i++) {
			var searchResults = recipeData.matches[i];
			// console.log(searchResults); // logs the search result of 10 recipes based on the user's search
			allergyApp.displayResults(searchResults);
		}

		if (filteredRecipes.length === 0) {
			$('.resultsContent').html('<h3 class="noResults">No Recipes Found <i class="fa fa-frown-o" aria-hidden="true"></i></h3><label for="recipeSearch" class="searchAgain">Search again</label>');
		}
	});
};

// Display search results on the page
allergyApp.displayResults = function (results) {
	var resultsName = results.recipeName; // stores name of results
	// console.log(resultsName);

	var resultsImage = results.smallImageUrls[0]; //stores url of result image
	resultsImage = resultsImage.replace(/=s90/gi, '');
	// console.log(resultsImage);

	var resultsTime = results.totalTimeInSeconds;
	resultsTime = resultsTime / 60; // stores total cook time in minutes
	// console.log(resultsTime); 

	var resultsId = results.id; //stores results id code
	// console.log(resultsId);


	$('.resultsUl').append('<li class="resultsLi"><div class="cardImage"><a href="http://www.yummly.com/recipe/' + resultsId + '" target="_blank"><img src="' + resultsImage + '" alt=""></a></div><div class="cardTitle"><a href="http://www.yummly.com/recipe/' + resultsId + '" target="_blank">' + resultsName + '</a></div><div class="resultTime"><i class="fa fa-clock-o" aria-hidden="true"></i> ' + resultsTime + ' mins</div><div class="resultId"><a href="http://www.yummly.com/recipe/' + resultsId + '" target="_blank">Click <span class="here">HERE</span> for full recipe</a></div></li>');
};

allergyApp.init = function () {
	$('.allergyForm').on('submit', function (e) {
		e.preventDefault();
		// $('html, body').animate({
		//         scrollTop: $('.displayResults').offset().top
		//     }, 1150);
		var chosenRecipes = $('input[type=text]').val();
		console.log(chosenRecipes);

		var chosenAllergies = $('input[type=checkbox]:checked');
		var allAllergies = $.map(chosenAllergies, function ($allergy, index) {
			return $allergy.value;
			// console.log(chosenAllergies);
		});

		// use value of type of food as parameter for query	
		allergyApp.getRecipes(chosenRecipes, allAllergies);
		// console.log(chosenRecipes);
	});
	$('.allergyImage').on('click', function () {
		var checkbox = $(this).next();
		var isChecked = checkbox.prop('checked');
		checkbox.prop('checked', !isChecked);
	});
	$('#recipeSearch').on('click', function () {
		$(this).val('');
	});
};

// Doc ready, run init
$(function () {
	allergyApp.init();
});