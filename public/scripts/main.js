'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var timerPlugIn = {};

timerPlugIn.setClock = function () {

	var time = +'2000';
	var clock = $('.your-clock').FlipClock(time, {
		clockFace: 'MinuteCounter',
		autoStart: false,
		countdown: true
	});
	$('#startTimer').on('click', function (totalTimeInSeconds) {
		var clock = $('.your-clock').FlipClock(totalTimeInSeconds, {
			clockFace: 'MinuteCounter',
			autoStart: true,
			countdown: true
		});
	});

	// var event = clock.on('click' function() {

	// 	// This code will trigger every time this event is triggered.
	// });
	console.log("ready!");
};

var screenChange = {};

screenChange.hideSections = function () {
	$('#yummlySection').hide();
	$('#displaySection').hide();
	$('#timerSection').hide();
	$('#externalRecipe').hide();
	// $('#playlistSection').hide();

	console.log("I AM READY TO HIDE THINGS!");
};

screenChange.showSections = function () {
	$('.musicType').on('click', function (e) {
		e.preventDefault();
		$('#playlistOptions').hide();
		$('#spotifySection').hide();
		$('#yummlySection').fadeIn();
		$('#displaySection').fadeIn();
	});

	// $('#recipeSubmit').on('click',function(e) {
	// 	console.log('I work?');
	// 	e.preventDefault();
	// 	$('#yummlySection').hide();
	// 	$('#displaySection').show();
	// });

	$('#searchAgainSubmit').on('click', function (e) {
		location.reload();
	});

	console.log("I AM READY TO SHOW SECTIONS!");
};

var yummlyApp = {};

// call api and return recipe info based on query search	
// 
yummlyApp.key = "d64bdf3253f0c38225e7761cfa1151ef";
yummlyApp.url = "http://api.yummly.com/v1/api/recipes?_app_id=";
yummlyApp.id = "cb509487";
yummlyApp.urlInitial = '' + yummlyApp.url + yummlyApp.id + '&_app_key=' + yummlyApp.key;

yummlyApp.getRecipes = function (query, allAllergies) {
	$.ajax({
		url: yummlyApp.urlInitial,
		method: 'GET',
		dataType: 'json',
		data: {
			requirePictures: true,
			q: query,
			allowedAllergies: allAllergies ? allAllergies : null
		}
	}).then(function (recipeData) {
		yummlyApp.checkResults(recipeData);
	});
};

yummlyApp.checkResults = function (recipeData) {
	$('.resultsUl').html('');
	var filteredRecipes = recipeData.matches;
	console.log(filteredRecipes);

	for (i = 0; i < filteredRecipes.length; i++) {
		var searchResults = recipeData.matches[i];
		console.log(searchResults); // logs the search result of 10 recipes based on the user's search
		yummlyApp.displayResults(searchResults);
	}

	if (filteredRecipes.length === 0) {
		$('.resultsContent').html('<h3 class="noResults">No Recipes Found <i class="fa fa-frown-o" aria-hidden="true"></i></h3><label for="recipeSearch" class="searchAgain">Search again</label>');
	}

	$('.resultsUl li').on('click', function (e) {
		e.preventDefault();
		// var choice = $(this).data("data-id");

		// var choice = jquery.data($(this),"data-id");
		var choice = $(this).data("id");
		// console.log("here:"+choice);
		yummlyApp.specificRecipe(choice);
	});
};

// Display search results on the page
yummlyApp.displayResults = function (results) {
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

	$('.resultsUl').append('<li class="resultsLi" data-id="' + resultsId + '"><div class="cardImage"><img src="' + resultsImage + '" alt=""></div><div class="cardTitle"></div><div class="resultTime"><i class="fa fa-clock-o" aria-hidden="true"></i> ' + resultsTime + ' mins</div><div class="resultId"></div></li>');
};

yummlyApp.specificRecipe = function (recipeId) {
	var _$$ajax;

	$.ajax((_$$ajax = {
		url: yummlyApp.urlSpecific
	}, _defineProperty(_$$ajax, 'url', 'http://api.yummly.com/v1/api/recipe/' + recipeId + '?_app_id=' + yummlyApp.id + '&_app_key=' + yummlyApp.key), _defineProperty(_$$ajax, 'method', 'GET'), _defineProperty(_$$ajax, 'dataType', 'json'), _defineProperty(_$$ajax, 'data', {
		requirePictures: true
	}), _$$ajax)).then(function (recipeData) {
		console.log(recipeData);
		// $('.resultsUl').empty();
		$('.displayResults').addClass('disappear');
		$('.objectTest').fadeIn();
		$('body').addClass('fixed');
		yummlyApp.totalTimeInSeconds = recipeData.totalTimeInSeconds;
		$('object').attr('data', recipeData.source.sourceRecipeUrl);
	});
};

yummlyApp.init = function () {
	$('.yummlyForm').on('submit', function (e) {
		e.preventDefault();
		$('html, body').animate({
			scrollTop: $('.displayResults').offset().top
		}, 1150);
		var chosenRecipes = $('#recipeSearch').val();
		console.log("clyde:-----" + chosenRecipes);
		var chosenAllergies = $('input[type=checkbox]:checked');
		var allAllergies = $.map(chosenAllergies, function ($yummly, index) {
			return $yummly.value;
			console.log(chosenAllergies);
			$('.resultsLi').css('border', '200px solid orange');
		});
		// use value of type of food as parameter for query	
		yummlyApp.getRecipes(chosenRecipes, allAllergies);
		console.log(chosenRecipes);
	});
	$('.yummlyImage').on('click', function () {
		var checkbox = $(this).next();
		var isChecked = checkbox.prop('checked');
		checkbox.prop('checked', !isChecked);
	});
	$('#recipeSearch').on('click', function () {
		$(this).val('');
	});
};

// ****************


var spotApp = {};

spotApp.getSomething = function () {
	var spotURL = "https://api.spotify.com/v1/search";
	$('button').on('click', function (e) {
		e.preventDefault();
		var searchQuery = $('.musicType').val();
		$.ajax({
			url: spotURL,
			method: 'GET',
			dataType: 'json',
			data: {
				type: 'playlist',
				q: searchQuery
			},
			success: function success(res) {
				var random = Math.floor(Math.random() * 20);
				var playlist = res.playlists.items[random];
				var playlistID = playlist.uri;
				$('.spotify').empty();
				console.log(playlistID);
				var iframe = '<iframe src="https://embed.spotify.com/?uri=' + playlistID + ' "width=300" height="380" frameborder="0" allowtransparency ="true" id="iframeID"></iframe>';
				$('.spotify').append(iframe);
				spotApp.displaySomething(res);

				$('.spotify').on('click', function () {
					var timer = +'1000';
					console.log(timer);
					var iframe = $("#iframeID");
					console.log(iframe);
					setTimeout(function () {
						iframe.remove();
					}, timer);
				});
			}
		});
	});
};

spotApp.displaySomething = function () {};

spotApp.init = function () {
	spotApp.getSomething();
};

timerPlugIn.init = function () {
	timerPlugIn.setClock();
};

screenChange.init = function () {
	screenChange.hideSections();
	screenChange.showSections();
};

// Doc ready, run init
$(function () {
	timerPlugIn.init();
	yummlyApp.init();
	spotApp.init();
	screenChange.init();
});