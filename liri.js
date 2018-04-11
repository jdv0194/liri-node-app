require("dotenv").config();
var dotenv = require("dotenv");
var Twitter = require("twitter");
var request = require("request");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var keys = require("./keys.js");

var command = process.argv[2];

var value = process.argv[3];

var spotify = new Spotify(keys.spotify);

var client = new Twitter(keys.twitter);

// run different function depending on argument entered
if (command === "my-tweets") {
  twitterFeed();
} else if (command === "spotify-this-song") {
  spotifySong();
} else if (command === "movie-this") {
  imdbMovie();
} else if (command === "do-what-it-says") {
  textFile();
}

// read text file and run appropriate function
function textFile() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) throw error;

    // get rid of `*` and ' ' in beginning of txt file, split array at comma
    if (data.charAt(0) === "*") data = data.slice(2);
    var dataArray = data.split(",");

    // reassign command and value and rerun conditional
    command = dataArray[0];
    value = dataArray[1];

    if (command === "my-tweets") {
      twitterFeed();
    } else if (command === "spotify-this-song") {
      spotifySong();
    } else if (command === "movie-this") {
      imdbMovie();
    }
  });
}

function twitterFeed() {
  var params = {
    q: "jdv0194",
    count: 20
  };

  client.get("search/tweets", params, function(err, data, response) {
    if (err) throw err;

    for (i = 0; i < data.statuses.length; i++) {
      console.log("Tweet: " + '"' + data.statuses[i].text + '".');
      console.log("Time created: " + data.statuses[i].created_at + ".");
    }
  });
}

function spotifySong() {
  if (value == null) {
    value = "The Sign";
    spotify.search({ type: "track", query: value }, function(err, data) {
      if (err) throw err;

      console.log("Artist: " + data.tracks.items[5].artists[0].name + ".");

      console.log("Song: " + '"' + data.tracks.items[5].name + '".');

      console.log("Link: " + data.tracks.items[5].external_urls.spotify);

      console.log("Album: " + '"' + data.tracks.items[5].album.name + '".');
    });
  } else {
    spotify.search({ type: "track", query: value }, function(err, data) {
      if (err) throw err;

      console.log("Artist: " + data.tracks.items[0].artists[0].name + ".");

      console.log("Song: " + '"' + data.tracks.items[0].name + '".');

      console.log("Link: " + data.tracks.items[0].external_urls.spotify);

      console.log("Album: " + '"' + data.tracks.items[0].album.name + '".');
    });
  }
}

function imdbMovie() {
  if (value == null) {
    var movieURL = "http://www.omdbapi.com/?t=Mr+Nobody&apikey=trilogy";
    request(movieURL, function(error, response, body) {
      var json = JSON.parse(body);
      if (error) throw error;

      console.log("Title: " + json.Title + ".");
      console.log("Year: " + json.Year + ".");
      console.log("IMDB Rating: " + json.imdbRating + "/10.");
      console.log(
        json.Ratings[1].Source +
          " gave the movie a rating of " +
          json.Ratings[1].Value +
          "."
      );
      console.log(json.Title + " was produced in " + json.Country + ".");
      console.log(json.Title + "Languages: " + json.Language + ".");
      console.log("Synopsis of " + json.Title + ": " + json.Plot);
      console.log(
        json.Title + " features " + json.Actors + " in leading roles."
      );
    });
  } else {
    var movieURL = "http://www.omdbapi.com/?t=" + value + "&apikey=trilogy";

    request(movieURL, function(error, response, body) {
      if (error) throw error;

      var json = JSON.parse(body);

      console.log("Title: " + json.Title + ".");
      console.log("Release Date " + json.Year + ".");
      console.log("IMDB rating: " + json.imdbRating + "/10.");
      console.log(
        json.Ratings[1].Source + " rating: " + json.Ratings[1].Value + "."
      );
      console.log("Produced in " + json.Country + ".");
      console.log("Languages: " + json.Language + ".");
      console.log("Synopsis: " + json.Plot);
      console.log("Actors: " + json.Actors);
    });
  }
}
