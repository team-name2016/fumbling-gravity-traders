var spotApp= {};

spotApp.getSomething= function(){
	var spotURL= "https://api.spotify.com/v1/search";
	$('form').on('submit', function(e){
		e.preventDefault();
		var searchQuery = $('#saySomething').val();
		$.ajax({
			url: spotURL,
			method: 'GET',
			dataType: 'json',
			data: {
				type: 'playlist',
				q: searchQuery
			},
	success: function(res){
		var random = Math.floor(Math.random()*20);
		var playlist = res.playlists.items[random];
		var playlistID = playlist.uri;
		$('.spotify').empty();
		console.log (playlistID);
		var iframe = '<iframe src="https://embed.spotify.com/?uri='+ playlistID + ' "width=300" height="380" frameborder="0" allowtransparency ="true" id="iframeID"></iframe>';
		$('.spotify').append(iframe);
		spotApp.displaySomething(res);


		$('.spotify').on('click', function(){
			var timer = +('1000');
			console.log(timer);
			var iframe = $("#iframeID");
			console.log (iframe);
			setTimeout(function() {
			 iframe.remove();
			}, timer);
		});
	}
		});


		});
	};


spotApp.displaySomething = function (){

};

spotApp.init= function(){
	spotApp.getSomething();
};


// DOCUMENT READY ---------------------------------------
$(function() {
	spotApp.init();
});


// var player = '<object type="text/html" data="https://embed.spotify.com/?uri='+ playlistID" ></object>';
// console.log (player)

// https://accounts.spotify.com/en-CA/status