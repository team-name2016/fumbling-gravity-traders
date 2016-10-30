'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var totalTimeInSeconds;
var screenChange = {};

screenChange.hideSections = function () {
	$('#yummlySection, #displaySection, .backButton, .backButton2, #externalRecipe').hide();

	console.log("I AM READY TO HIDE THINGS!");
};

screenChange.showSections = function () {
	$('.musicType').on('click', function (e) {
		e.preventDefault();

		$('#playlistSection').hide();
		$('#yummlySection').fadeIn();
		$('.backButton').fadeIn();
	});

	$('.backButton').on('click', function () {
		$('#playlistSection').fadeIn();
		$('#yummlySection').hide();
		$('.backButton').hide();
	});

	$('.backButton2').on('click', function () {
		$('#yummlySection').fadeIn();
		$('#displaySection').hide();
		$('.backButton').fadeIn();
		$('.backButton2').hide();
	});

	$('#spotifySubmit').on('click', function (e) {
		e.preventDefault();
		$('#spotifySection').hide();
		$('#yummlySection').fadeIn();
	});

	$('#searchAgainSubmit').on('click', function (e) {
		location.reload();
	});

	$('#close').on('click', function () {
		$('#externalRecipe').fadeOut();
	});

	$('#toggle').on('click', function () {
		$('#sidebar').fadeIn();
		$('#toggle').hide();
		$('#closeSidebar').fadeIn();
	});

	$('#closeSidebar').on('click', function () {
		$('#toggle').show();
		$('#sidebar').fadeOut();
	});

	// Note that recipe submit - results display is housed in the yummly app section (already an event listener there)
	// Note that externalRecipe display is also housed in yummly js (see above)
};

var yummlyApp = {};

yummlyApp.getRecipes = function (query) {
	yummlyApp.key = "d64bdf3253f0c38225e7761cfa1151ef";
	yummlyApp.url = "http://api.yummly.com/v1/api/recipes?_app_id=";
	yummlyApp.id = "cb509487";
	yummlyApp.urlInitial = '' + yummlyApp.url + yummlyApp.id + '&_app_key=' + yummlyApp.key;

	$.ajax({
		url: yummlyApp.urlInitial,
		method: 'GET',
		dataType: 'json',
		data: {
			requirePictures: true,
			q: query
		}
	}).then(function (recipeData) {
		var totalTimeInSeconds = yummlyApp.checkResults(recipeData);
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

	var totalTimeInSeconds = $('.resultsUl li').on('click', function (e) {
		e.preventDefault();
		$('#externalRecipe').fadeIn();
		var choice = $(this).data("id");
		var totalTimeInSeconds = yummlyApp.specificRecipe(choice);
		return totalTimeInSeconds;
	});
	return totalTimeInSeconds;
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
	// console.log(resultsTime); 

	var resultsId = results.id; //stores results id code
	console.log(resultsId);

	$('.resultsUl').append('<li class="resultsLi" data-id="' + resultsId + '"><div class="cardImage"><img src="' + resultsImage + '" alt=""></div><div class="cardTitle"></div><div class="resultTime"><i class="fa fa-clock-o" aria-hidden="true"></i><p class="minutes"> ' + resultsTime + ' mins</p></div><div class="resultId"></div></li>');
};

yummlyApp.specificRecipe = function (recipeId) {
	var _$$ajax;

	$.ajax((_$$ajax = {
		url: yummlyApp.urlSpecific
	}, _defineProperty(_$$ajax, 'url', 'http://api.yummly.com/v1/api/recipe/' + recipeId + '?_app_id=' + yummlyApp.id + '&_app_key=' + yummlyApp.key), _defineProperty(_$$ajax, 'method', 'GET'), _defineProperty(_$$ajax, 'dataType', 'json'), _defineProperty(_$$ajax, 'data', {
		requirePictures: true
	}), _$$ajax)).then(function (recipeData) {
		console.log(recipeData);
		var totalTimeInSeconds = recipeData.totalTimeInSeconds;
		$('#externalSite').attr('data', recipeData.source.sourceRecipeUrl);
		$('#sidebar').attr('class', 'onScreen').draggable();
		return totalTimeInSeconds;
	});
};

yummlyApp.init = function () {
	$('.yummlyForm').on('submit', function (e) {
		e.preventDefault();
		$('#yummlySection').hide();
		$('#displaySection').fadeIn();
		$('.backButton2').fadeIn();
		var chosenRecipes = $('#recipeSearch').val();
		yummlyApp.getRecipes(chosenRecipes);
	});
};

// ****************


var spotApp = {};

spotApp.getSomething = function () {
	var spotURL = "https://api.spotify.com/v1/search";
	$('.musicType').on('click', function (e) {
		e.preventDefault();
		var searchQuery = $(this).val();
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

				console.log(playlistID);
				var iframe = '<iframe src="https://embed.spotify.com/?uri=' + playlistID + ' "width=300" height="80" frameborder="0" allowtransparency ="true" id="iframeID"></iframe>';

				$('.spotify').append(iframe);

				spotApp.displaySomething(res);
				//  


				$('.spotify').on('click', function () {
					spotWindow = window.open('https://play.spotify.com/user/1172590264/playlist/6k9SRlrbGcCIGVNq05VkXF');
					var timer = totalTimeInSeconds;
					var iframe = $("#iframeID");
					setTimeout(function () {
						iframe.remove();
					}, timer);
					setTimeout(function () {
						spotWindow.close();
					}, timer);
				});
			}
		});
	});
};

spotApp.displaySomething = function () {
	console.log('annabel');
};

spotApp.init = function () {
	$('#sidebar').attr('class', 'offScreen');

	spotApp.getSomething();
};

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

timerPlugIn.init = function () {
	timerPlugIn.setClock();
};

screenChange.init = function () {
	screenChange.hideSections();
	screenChange.showSections();
};

// Doc ready, run init
$(function () {
	yummlyApp.init();
	timerPlugIn.init();

	spotApp.init();
	screenChange.init();
});