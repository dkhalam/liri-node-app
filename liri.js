var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');
var dataKeys = require('./keys.js');

var writeToLog = function(data) {
  fs.appendFile("log.txt");

  fs.appendFile("log.txt", JSON.stringify(data), function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("log.txt was updated!");
  });
}
// * `my-tweets`
	// node liri.js my-tweets
	// * This will show your last 20 tweets and when they were created at in your terminal/bash window.

var getTweets = function() {
  var client = new twitter(dataKeys.twitterKeys);

  var params = { 
  	screen_name: 'KingKhali_', 
  	count: 20 
  };

  client.get('statuses/user_timeline', params, function(error, tweets, response) {

    if (!error) {
      var data = []; //empty array to hold data
      for (var i = 0; i < tweets.length; i++) {
        data.push({
            'created at: ' : tweets[i].created_at,
            'Tweets: ' : tweets[i].text,
        });
      }
      console.log(data);
      writeToLog(data);
    }
  });
};


// * `spotify-this-song`
	// node liri.js spotify-this-song '<song name here>'
		// 	* This will show the following information about the song in your terminal/bash window
		//     * Artist(s)
		//     * The song's name
		//     * A preview link of the song from Spotify
		//     * The album that the song is from

		// * if no song is provided then your program will default to
		//     * "The Sign" by Ace of Base

//Creates a function for finding artist name from spotify
var getArtistNames = function(artist) {
  return artist.name;
};

//Function for finding songs on Spotify
var getMeSpotify = function(songName) {
  //If it doesn't find a song, find Blink 182's What's my age again
  if (songName === undefined) {
    songName = 'What\'s my age again';
  };

  spotify.search({ type: 'track', query: songName }, function(err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
      return;
    }

    var songs = data.tracks.items;
    var data = []; //empty array to hold data

    for (var i = 0; i < songs.length; i++) {
      data.push({
        'artist(s)': songs[i].artists.map(getArtistNames),
        'song name: ': songs[i].name,
        'preview song: ': songs[i].preview_url,
        'album: ': songs[i].album.name,
      });
    }
    console.log(data);
    writeToLog(data);
  });
};

// * `movie-this`
	// node liri.js movie-this '<movie name here>'
	// 	* This will output the following information to your terminal/bash window:

	//     * Title of the movie.
	//     * Year the movie came out.
	//     * IMDB Rating of the movie.
	//     * Country where the movie was produced.
	//     * Language of the movie.
	//     * Plot of the movie.
	//     * Actors in the movie.
	//     * Rotten Tomatoes Rating.
	//     * Rotten Tomatoes URL.

	// * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
	//     * If you haven't watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/
	//     * It's on Netflix!

var getMeMovie = function(movieName) {

  if (movieName === undefined) {
    movieName = 'Mr Nobody';
  }

  var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&r=json";

  request(urlHit, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = [];
      var jsonData = JSON.parse(body);

      data.push({
      'Title: ' : jsonData.Title,
      'Year: ' : jsonData.Year,
      'Rated: ' : jsonData.Rated,
      'IMDB Rating: ' : jsonData.imdbRating,
      'Country: ' : jsonData.Country,
      'Language: ' : jsonData.Language,
      'Plot: ' : jsonData.Plot,
      'Actors: ' : jsonData.Actors,
      'Rotten Tomatoes Rating: ' : jsonData.tomatoRating,
      'Rotton Tomatoes URL: ' : jsonData.tomatoURL,
  });
      console.log(data);
      writeToLog(data);
}
  });

}

// * `do-what-it-says`
	// node liri.js do-what-it-says
		// Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
		// It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
		// Feel free to change the text in that document to test out the feature for other commands.

var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);
    writeToLog(data);
    var dataArr = data.split(',')

    if (dataArr.length == 2) {
      pick(dataArr[0], dataArr[1]);
    } else if (dataArr.length == 1) {
      pick(dataArr[0]);
    }

  });
}

var pick = function(caseData, functionData) {
  switch (caseData) {
    case 'my-tweets':
      getTweets();
      break;
    case 'spotify-this-song':
      getMeSpotify(functionData);
      break;
    case 'movie-this':
      getMeMovie(functionData);
      break;
    case 'do-what-it-says':
      doWhatItSays();
      break;
    default:
      console.log('LIRI doesn\'t know that');
  }
}

//run this on load of js file
var runThis = function(argOne, argTwo) {
  pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);