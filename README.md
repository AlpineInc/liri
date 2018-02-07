# liri

Liri is a command line personal assistant built using Node.js. Feel free to clone the project and modify it to your needs.

To run Liri, type $> node liri.js

Note: You will need node.js v7.9 or above to support JS promise featured used here.

Key features:
1. Liri prompts the user to select one of the 4 commands.

What can i do for you? (Use arrow keys)
 my-tweets
 get-song-details
 get-movie-details
 do-what-it-says
 exit 

2. Once you make a selection, Liri executes the action. Once completed, it prompts the user to select the next command. User can select exit to exit out of the application. Just for kicks, Liri makes use of javascript Promise and Async/Await features to implement the ability to continiously accept user commands in a loop. Since support for Promise was introduced in node.js v7.9, you will need node version 7.9 or above to run Liri.

3. Liri makes use of log4js to log all actions into a log file by liri.log. The application is currently configured to log in debug mode which mean your will see debug, info, warn and error messages.

4. Liri also makes use of a ES6 feature to select a object from a object array, based on the object property value.
e.g.: movieDetails.Ratings.find(function (rating) { return rating.Source === "Rotten Tomatoes"; }).Value


 
Given below is an extract of Liri's stdout:

What can i do for you? my-tweets


--------------Tweets---------------
1. go eagles!
2. RT @coolcam101: Me getting ready for the Super Bowl.
3. RT @coolcam101: Tom Brady wins Super Bowl 51
4. RT @pepsi: Want to win some epic PepsiHalftime prizes? Follow @Pepsi and keep an eye out for chances to win all day! 
___________________________________


What can i do for you? get-song-details
Enter the song/album name: The Sign


-----------Song Details------------
Name: Or Nah (feat. The Weeknd, Wiz Khalifa and DJ Mustard) - Remix
Artist(s): Ty Dolla Sign, Mustard, Wiz Khalifa, The Weeknd
Preview URL: 
Album: Or Nah (feat. The Weeknd, Wiz Khalifa and DJ Mustard) [Remix Version]
----------------------------------


What can i do for you? get-movie-details
Enter the movie name: Mr. Nobody.


-----------Movie Details-----------
Movie Title: Mr. Nobody
Year: 2009
IMDB Rating: 7.9
Rotten Tomatoes Rating: 66%
Country produced in: Belgium, Germany, Canada, France, USA, UK
Language: English, Mohawk
Plot: A boy stands on a station platform as a train is about to leave. Should he go with his mother or stay with his father? Infinite possibilities arise from this decision. As long as he doesn't choose, anything is possible.
Actors: Jared Leto, Sarah Polley, Diane Kruger, Linh Dan Pham
-----------------------------------


What can i do for you? do-what-it-says


-----------Movie Details-----------
Movie Title: The Post
Year: 2017
IMDB Rating: 7.5
Rotten Tomatoes Rating: 88%
Country produced in: USA
Language: English
Plot: A cover-up that spanned four U.S. Presidents pushed the country's first female newspaper publisher and a hard-driving editor to join an unprecedented battle between the press and the government.
Actors: Meryl Streep, Tom Hanks, Sarah Paulson, Bob Odenkirk
-----------------------------------


What can i do for you?
  my-tweets
  get-song-details
  get-movie-details
  do-what-it-says
> exit


