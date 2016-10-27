"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var allergyApp = {};

// call api and return recipe info based on query search	
// 
allergyApp.key = "d64bdf3253f0c38225e7761cfa1151ef";
allergyApp.url = "http://api.yummly.com/v1/api/recipes?_app_id=";
allergyApp.id = "cb509487";
allergyApp.urlInitial = "" + allergyApp.url + allergyApp.id + "&_app_key=" + allergyApp.key;

// allergyApp.urlSpecific =`http://api.yummly.com/v1/api/recipe/${recipeId}?_app_id=${allergyApp.id}&_app_key=${allergyApp.key}`

// http://api.yummly.com/v1/api/recipe/recipe-id?_app_id=YOUR_ID&_app_key=YOUR_APP_KEY
// 
// 


allergyApp.getRecipes = function (query, allAllergies) {
	$.ajax({
		url: allergyApp.urlInitial,
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
		console.log(filteredRecipes);

		for (i = 0; i < filteredRecipes.length; i++) {
			var searchResults = recipeData.matches[i];
			console.log(searchResults); // logs the search result of 10 recipes based on the user's search
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
	console.log(resultsName);

	var resultsImage = results.smallImageUrls[0]; //stores url of result image
	resultsImage = resultsImage.replace(/=s90/gi, '');
	console.log(resultsImage);

	var resultsTime = results.totalTimeInSeconds;
	resultsTime = resultsTime / 60; // stores total cook time in minutes
	console.log(resultsTime);

	var resultsId = results.id; //stores results id code
	console.log(resultsId);

	$('.resultsUl').append('<li class="resultsLi"><div class="cardImage"><a href="http://www.yummly.com/recipe/' + resultsId + '" target="_blank"><img src="' + resultsImage + '" alt=""></a></div><div class="cardTitle"><a href="http://www.yummly.com/recipe/' + resultsId + '" target="_blank">' + resultsName + '</a></div><div class="resultTime"><i class="fa fa-clock-o" aria-hidden="true"></i> ' + resultsTime + ' mins</div><div class="resultId"><a href="http://www.yummly.com/recipe/' + resultsId + '" target="_blank">Click <span class="here">HERE</span> for full recipe</a></div></li>');
	// $('.resultsUl').append('<li class="resultsLi"><a href="http://www.yummly.com/recipe/'+resultsId+'" target="_blank">link</a></div></li>');
	$('.resultsUl li').css('border', '1px solid red');
	$('.resultsUl li a').on('click', function (e) {
		var results = "Artisan-Bread-1905589";
		e.preventDefault();
		allergyApp.specificRecipe(results);
	});
};

allergyApp.specificRecipe = function (recipeId) {
	var _$$ajax;

	$.ajax((_$$ajax = {
		url: allergyApp.urlSpecific
	}, _defineProperty(_$$ajax, "url", "http://api.yummly.com/v1/api/recipe/" + recipeId + "?_app_id=" + allergyApp.id + "&_app_key=" + allergyApp.key), _defineProperty(_$$ajax, "method", 'GET'), _defineProperty(_$$ajax, "dataType", 'json'), _defineProperty(_$$ajax, "data", {
		requirePictures: true
	}), _$$ajax)).then(function (recipeData) {
		console.log('yo:' + recipeData);
		// $('.resultsUl').html('');
		// var filteredRecipes = recipeData.matches;
		// console.log(filteredRecipes);

		// for(i = 0; i < filteredRecipes.length; i++) {
		// 	var searchResults = recipeData.matches[i];
		// 	console.log(searchResults); // logs the search result of 10 recipes based on the user's search
		// 	allergyApp.displayResults(searchResults)
		// }

		// if(filteredRecipes.length === 0) {
		// 	$('.resultsContent').html('<h3 class="noResults">No Recipes Found <i class="fa fa-frown-o" aria-hidden="true"></i></h3><label for="recipeSearch" class="searchAgain">Search again</label>');
	});
};

// };


allergyApp.init = function () {
	$('.allergyForm').on('submit', function (e) {
		e.preventDefault();
		$('html, body').animate({
			scrollTop: $('.displayResults').offset().top
		}, 1150);
		var chosenRecipes = $('input[type=text]').val();
		console.log(chosenRecipes);

		var chosenAllergies = $('input[type=checkbox]:checked');
		var allAllergies = $.map(chosenAllergies, function ($allergy, index) {
			return $allergy.value;
			console.log(chosenAllergies);
			$('.resultsLi').css('border', '200px solid orange');
		});

		// use value of type of food as parameter for query	
		allergyApp.getRecipes(chosenRecipes, allAllergies);
		console.log(chosenRecipes);
	});
	$('.allergyImage').on('click', function () {
		var checkbox = $(this).next();
		var isChecked = checkbox.prop('checked');
		checkbox.prop('checked', !isChecked);
	});
	$('#recipeSearch').on('click', function () {
		$(this).val('');
	});

	// $('.resultsLi').css('border','200px solid pink');
	// $('.resultsLi a').on('click',function(e){
	// 	e.preventDefault();
	// 	$(this).css('color','red');
	// 	alert('clyde');


	// });

};

// Doc ready, run init
$(function () {
	allergyApp.init();
});