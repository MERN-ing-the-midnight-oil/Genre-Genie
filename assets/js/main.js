var lamp = document.querySelector("#lamp");
var pickGenre = document.querySelector(".pick-genre");
var suggestBtn = document.querySelector("#suggest-movie-btn");
var suggestedMovie = document.querySelector("#your-movie");
var buttonContainerEl = document.querySelector("#all-buttons");
var posterSection = document.querySelector("#poster-section");

// Function to create empty storage for genreIds
function createEmptyStorage() {
	//creates a key and value in local storage to start creating a list of genreIds
	localStorage.setItem("genreIds", "[]"); //creates the key and empty value on page load
}
createEmptyStorage(); //calls the function just created

//gets genre ID's from currently selected buttons only
function getActiveGenres() {
	const activeButtons = Array.from(
		document.querySelectorAll("#all-buttons button.active")
	);
	const activeGenreIds = activeButtons.map((button) => button.dataset.genreid);
	return activeGenreIds;
}

// Define a CSS class for the active state of the genre buttons
const ACTIVE_CLASS = "active";

function updateLocalStorage(event) {
	var localGenreIds = JSON.parse(localStorage.getItem("genreIds")); // Array list of genre ids already in local storage
	var genreID = event.target.dataset.genreid; // Get the genreID from the clicked button. DO NOT CHANGE "genreid" to "genreID" in a logical attempt to match the HTML data attribute. For some reason JS prefers being stupid.

	var index = localGenreIds.indexOf(genreID); //check if the genre button has already been clicked an odd number of times (is deselected now)
	if (index > -1) {
		localGenreIds.splice(index, 1); // Remove the genreID from the array
	} else {
		localGenreIds.push(genreID); // Add the genreID to the array
	}

	localStorage.setItem("genreIds", JSON.stringify(localGenreIds)); // Update the genreIds in local storage with the new click
	var genreString = localGenreIds.toString(); // Convert the genreIds to a string
	console.log("the string in local storage: " + genreString);
}
// Event listener for genre button clicks
buttonContainerEl.addEventListener("click", (event) => {
	const target = event.target;

	// Check if the clicked element is a button within the button container
	if (target.matches("button")) {
		console.log("Genre Button was clicked!");
		const isActive = target.classList.contains(ACTIVE_CLASS);
		const genreID = target.dataset.genreID; // Get the genre ID from the clicked button

		// Toggle the active state of the button
		if (isActive) {
			target.classList.remove(ACTIVE_CLASS);
		} else {
			target.classList.add(ACTIVE_CLASS);
		}

		// Update the genre IDs in local storage
		updateLocalStorage(event);
	}
});
// Event listener for suggest movie button click
suggestBtn.addEventListener("click", suggestMovie);

// Function to suggest a movie
function suggestMovie() {
	console.log(
		"the function suggestMovie has been called, probably by rubbing.js"
	);
	const activeGenres = getActiveGenres(); // Get the current active genre IDs
	const genreString = activeGenres.toString(); // Convert the genre IDs to a string
	// Call the function to get movie titles from the API
	getTitleByGenre(genreString);
	//Reveal the poster section aka the recommended movie
	posterSection.style.display = "block";
}
document.addEventListener("suggestMovieEvent", suggestMovie);
//Gets movie titles from the API
function getTitleByGenre(genreString) {
	var genreURL = //This is the url needed for our first API call for movies by genre.
		"https://advanced-movie-search.p.rapidapi.com/discover/movie?with_genres=" +
		genreString +
		"&page=1";

	const options = {
		method: "GET",
		headers: {
			// "X-RapidAPI-Key": "ab5fb0b08dmsh801b30df51c049dp15ea7ejsn09d021675790", //Rhys' full subscription to advanced movie search
			"X-RapidAPI-Key": "5cec1b6fafmsh96cbe5417d10614p139e32jsn36f6496e92fe", //Jayden's limited API key
			"X-RapidAPI-Host": "advanced-movie-search.p.rapidapi.com",
		},
	};
	fetch(genreURL, options)
		.then(function (response) {
			if (!response.ok) {
				throw new Error(response.statusText);
			}
			return response.json();
		})
		.then(function (genreObject) {
			console.log(genreObject + "is the genre parsed object");
			//the parsed object is full of information like titles, overviews, and movie posters.
			var randomIndex = Math.floor(Math.random() * genreObject.results.length);
			//the randomIndex is like a bookmark that lets us pick a movie at random from a long list of movies and repeatedly come back to it to collect different pieces of information pertaining to that particular movie- specifically the title, original title, overview (movie summary), and vote average.
			//var title = genreObject.results[randomIndex].title;//do we even need this?
			var movie_id = genreObject.results[randomIndex].id;
			console.log("the movie ID: " + movie_id);
			const originalTitle = genreObject.results[randomIndex].original_title;
			const overView = genreObject.results[randomIndex].overview;
			const voteAverage = genreObject.results[randomIndex].vote_average;
			const posterPath = genreObject.results[randomIndex].poster_path;
			document.querySelector("#original_title").textContent = originalTitle;
			document.querySelector("#overview").textContent = overView;
			document.querySelector("#vote_average").textContent = voteAverage;
			document
				.querySelector(".poster")
				.children[0].children[0].setAttribute("src", posterPath);
			//stretch goal for getting the poster path from getDetailedResponse query
			// console.log(
			// 	"About to give the movie_id to Advanced Movie Search getDetailedResponse"
			// );
			// getDetailedResponse(movie_id);
		});
}

//stretch goal: getDetailedResponse will take the regular movie id and give a IMDB movie ID that we need for getStreamsbyIMDBId
// function getDetailedResponse(movie_id) {
// 	var detailedURL =
// 		"https://advanced-movie-search.p.rapidapi.com/movies/getdetails?movie_id=" +
// 		movie_id;
// 	const options3 = {
// 		method: "GET",
// 		headers: {
// 			"X-RapidAPI-Key": "5cec1b6fafmsh96cbe5417d10614p139e32jsn36f6496e92fe", //Jayden's limited API key
// 			"X-RapidAPI-Host": "advanced-movie-search.p.rapidapi.com",
// 		},
// 	};
// 	fetch(detailedURL, options3)
// 		.then(function (response) {
// 			if (!response.ok) {
// 				throw response.json();
// 			}
// 			return response.json();
// 		})
// 		.then(function (detailedObject) {
// 			//find the data we need in the object
// 			console.log(detailedObject);
// 			var IMDBID = detailedObject.imdb_id;

// 			//if the IMDBID is null, then start over!
// 			console.log("The IMDBID IS :" + IMDBID);
// 			console.log(
// 				"ABOUT TO START THE FETCH FUNCTION THAT GETS STREAM SOURCES FROM MBDLIST USING MBDID"
// 			);
// 			getStreamsByIMDBID(IMDBID); //call the final function that gets streaming data given an IMDBID.
// 		});
// }
// function getStreamsByIMDBID(IMDBID) {
// 	//uses Get by IMDb ID which is an option from the MDBList API (paid for by Rhys)
// 	var getByIMDBidURL = "https://mdblist.p.rapidapi.com/?i=" + IMDBID;
// 	//console.log(getByIMDBidURL+"is the ImbdIdURL");
// 	const options = {
// 		method: "GET",
// 		headers: {
// 			"X-RapidAPI-Key": "5cec1b6fafmsh96cbe5417d10614p139e32jsn36f6496e92fe", //Jayden's limited API key
// 			"X-RapidAPI-Host": "mdblist.p.rapidapi.com",
// 		},
// 	};
// 	fetch(getByIMDBidURL, options)
// 		.then(function (response) {
// 			if (!response.ok) {
// 				throw response.json();
// 			}
// 			return response.json();
// 		})
// 		.then(function (imdbObject) {
// 			//if the imdbObject is not an object for some weird (but weirdly frequent) reason, maybe start over with getTitleByGenre

// 			var trailerPath = (document.querySelector(
// 				"#streaming-content"
// 			).textContent = "Click to Watch Trailer");
// 			console.log(trailerPath);
// 			document.querySelector("#streaming-content").textContent = trailerPath;
// 			document.querySelector("#streaming-content").textContent =
// 				"Click to Watch Trailer";
// 			streamingContent = document.querySelector("#streaming-content");
// 			streamingContent.addEventListener("click", function (event) {
// 				event.preventDefault();
// 				window.open((streamingContent.href = imdbObject.trailer));
// 			});

// 			streamingContent.href = imdbObject.trailer;
// 		});
// }
