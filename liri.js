require("dotenv").config();
var keys = require("./keys.js");
var request = require("request");
var inquirer = require("inquirer");
var fs = require("fs");

//Configure Twitter node libraries
var Twitter = require("twitter");
var client = new Twitter(keys.twitter);

//Configure Spotify node libraries
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

//Configure log4js libraries. Currently configured to log in debug mode
const log4js = require('log4js');
log4js.configure({
    appenders: { liri: { type: 'file', filename: 'liri.log' } },
    categories: { default: { appenders: ['liri'], level: 'debug' } }
});
const logger = log4js.getLogger('liri');


//Function to retrive tweets
function myTweets() {
    return new Promise((resolve, reject) => {
        var params = { screen_name: 'littlebitofmsp', count: 20 };
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (error) {
                reject(error);
            }

            var myTweetsArray = [];
            for (var i = 0; i < tweets.length; i++) {
                myTweetsArray[i] = tweets[i].text;
            }
            resolve(myTweetsArray);
        });
    });
}

//Function to retrive song details from Spotify
function getSongDetails(songName) {
    return new Promise((resolve, reject) => {
        spotify.search({ type: "track", limit: 1, query: songName }, function(error, data) {
            if (error) {
                reject(error);
            }
            var songDetails = {};
            var spotifySongDetails;
            if (data.tracks.items.length >= 1) {
                spotifySongDetails = data.tracks.items[0];
                var artist = spotifySongDetails.artists[0].name;
                for (var i = 1; i < spotifySongDetails.artists.length; i++) {
                    artist += ', ' + spotifySongDetails.artists[i].name;
                }
                songDetails.artists = artist;
                songDetails.name = spotifySongDetails.name;
                songDetails.album = spotifySongDetails.album.name;
                songDetails.preview = spotifySongDetails.preview_url;
            }
            resolve(songDetails);
        })
    });

};


//Function to pull movie details from IMDB
function getMovieDetails(movieName) {
    return new Promise((resolve, reject) => {

        var omdbQueryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
        request(omdbQueryUrl, function(error, response, body) {
            if (error && response.statusCode != 200) {
                reject(error);
            }
            resolve(JSON.parse(body));
        });
    });
}


//The main application function
function liri() {
    inquirer
        .prompt([{
                type: "list",
                message: "What can i do for you?",
                choices: ["my-tweets", "get-song-details", "get-movie-details", "do-what-it-says", "exit"],
                name: "command"
            },
            {
                type: "input",
                message: "Enter the song/album name:",
                name: "song",
                default: "The Sign",
                when: function(userInput) {
                    return userInput.command === "get-song-details"
                }
            },
            {
                type: "input",
                message: "Enter the movie name:",
                name: "movie",
                default: "Mr. Nobody.",
                when: function(userInput) {
                    return userInput.command === "get-movie-details"
                }
            }
        ])
        .then(async function(userInput) {
            logger.info("User selected command is " + userInput.command);
            if (userInput.command === "my-tweets") {
                console.log("\n\n--------------Tweets---------------");
                try {
                    var tweets = await myTweets();
                    logger.info("Successfully retrived tweets");
                    logger.debug(tweets);
                    tweets.forEach(function(tweet, index) {
                        console.log((parseInt(index) + 1) + ". " + tweet);
                    });
                } catch (e) {
                    logger.error(JSON.stringify(e));
                    console.log("Error trying to retrive your tweets");
                }
                console.log("-----------------------------------\n\n");
                liri();

            } else if (userInput.command === "get-song-details") {
                console.log("\n\n-----------Song Details------------");
                try {
                    var songDetails = await getSongDetails(userInput.song);
                    logger.info("Successfully retrived song details");
                    logger.debug(JSON.stringify(songDetails));

                    console.log("Name: " + songDetails.name);
                    console.log("Artist(s): " + songDetails.artists);
                    console.log("Preview URL: " + songDetails.preview);
                    console.log("Album: " + songDetails.album);
                } catch (e) {
                    logger.error(JSON.stringify(e));
                    console.log("Error trying to retrive song details");
                }
                console.log("-----------------------------------\n\n");
                liri();

            } else if (userInput.command === "get-movie-details") {
                console.log("\n\n-----------Movie Details-----------");
                try {
                    var movieDetails = await getMovieDetails(userInput.movie);
                    logger.info("Successfully retrived movie details");
                    logger.debug(JSON.stringify(movieDetails));

                    console.log("Movie Title: " + movieDetails.Title);
                    console.log("Year: " + movieDetails.Year);
                    console.log("IMDB Rating: " + movieDetails.imdbRating);
                    console.log("Rotten Tomatoes Rating: " + movieDetails.Ratings.find(function (rating) { return rating.Source === "Rotten Tomatoes"; }).Value);
                    console.log("Country produced in: " + movieDetails.Country);
                    console.log("Language: " + movieDetails.Language);
                    console.log("Plot: " + movieDetails.Plot);
                    console.log("Actors: " + movieDetails.Actors);

                } catch (e) {
                    logger.error(JSON.stringify(e));
                    console.log("Error trying to retrive movie details");
                }
                console.log("-----------------------------------\n\n");
                liri();

            } else if (userInput.command === "do-what-it-says") {
                fs.readFile("random.txt", "utf8", async function(error, data) {
                    var fileCommand = data.split(",");
                    if (fileCommand[0] === "my-tweets") {
                        console.log("\n\n-----------Tweets------------");
                        try {
                            var tweets = await myTweets();
                            logger.info("Successfully retrived tweets");
                            logger.debug(tweets);
                            tweets.forEach(function(tweet, index) {
                                console.log((parseInt(index) + 1) + ". " + tweet);
                            });
                        } catch (e) {
                            logger.error(JSON.stringify(e));
                            console.log("Error trying to retrive your tweets");
                        }
                        console.log("-----------------------------\n\n");
                        liri();
                    } else if (fileCommand[0] === "get-song-details") {
                        console.log("\n\n-----------Song Details------------");
                        try {
                            var songDetails = await getSongDetails(fileCommand[1]);
                            logger.info("Successfully retrived song details");
                            logger.debug(JSON.stringify(songDetails));

                            console.log("Name: " + songDetails.name);
                            console.log("Artist(s): " + songDetails.artists);
                            console.log("Preview URL: " + songDetails.preview);
                            console.log("Album: " + songDetails.album);
                        } catch (e) {
                            logger.error(JSON.stringify(e));
                            console.log("Error trying to retrive song details");
                        }
                        console.log("-----------------------------------\n\n");
                        liri();

                    } else if (fileCommand[0] === "get-movie-details") {
                        console.log("\n\n-----------Movie Details-----------");
                        try {
                            var movieDetails = await getMovieDetails(fileCommand[1]);
                            logger.info("Successfully retrived movie details");
                            logger.debug(JSON.stringify(movieDetails));

                            console.log("Movie Title: " + movieDetails.Title);
                            console.log("Year: " + movieDetails.Year);
                            console.log("IMDB Rating: " + movieDetails.imdbRating);
                            console.log("Rotten Tomatoes Rating: " + movieDetails.Ratings.find(function (rating) { return rating.Source === "Rotten Tomatoes"; }).Value);
                            console.log("Country produced in: " + movieDetails.Country);
                            console.log("Language: " + movieDetails.Language);
                            console.log("Plot: " + movieDetails.Plot);
                            console.log("Actors: " + movieDetails.Actors);

                        } catch (e) {
                            logger.error(JSON.stringify(e));
                            console.log("Error trying to retrive movie details");
                        }
                        console.log("-----------------------------------\n\n");
                        liri();

                    } else {
                        liri();
                    }

                });

            } else {
            	//Exit the application
            	logger.info("Shutting down liri....");
                process.exit();

            }
        });
};

//Start the application
logger.info("Starting up liri....");
liri();