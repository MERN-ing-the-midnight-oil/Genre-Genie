// Function to handle click on genre buttons
var remote = document.querySelector("#remote");
var pickGenre = document.querySelector(".pick-genre");
var suggestBtn = document.querySelector("#suggest-movie-btn");
var suggestedMovie = document.querySelector("#your-movie");
var watchMovieBtn = document.querySelector("#watch-movie");
var streamingAvail = document.querySelector("#streaming-avail");
var startOverBtn = document.querySelector("#start-over");
var savedMovieBtn = document.querySelector("#saved-movie");
var modal = document.querySelector(".modal");
var closeModal = document.querySelector("#close-modal");
var buttons = document.querySelector("button");

// click event to scroll to pickGenre section//
remote.addEventListener("click", function () {
	pickGenre.scrollIntoView(true);
});

// Click event to scroll to suggestedMovie section
suggestBtn.addEventListener("click", function () {
	suggestedMovie.scrollIntoView(true);
});
// Click event to scroll to streamingAvail section
watchMovieBtn.addEventListener("click", function () {
	streamingAvail.scrollIntoView(true);
});

// Function to scroll to the top of the page
function scrollTop() {
	if (history.scrollRestoration) {
		history.scrollRestoration = "manual";
	} else {
		window.onbeforeunload = function () {
			window.scrollTo(0, 0);
		};
	}
}

// Click event to open the modal
savedMovieBtn.addEventListener("click", function () {
	console.log("open modal");
	modal.classList.add("is-active");
	modal.classList.add("is-clipped");
});

closeModal.addEventListener("click", function () {
	console.log("close modal");
	modal.classList.remove("is-active");
	modal.classList.remove("is-clipped");
});

// Selecting button container element
var buttonContainerEl = document.querySelector("#all-buttons");
var posterPath = null; //Global variable for poster path

// Function to create empty storage for genreIds
function createEmptyStorage() {
	//creates a key and value in local storage to start creating a list of genreIds
	localStorage.setItem("genreIds", "[]"); //creates the key and empty value on page load
}
createEmptyStorage(); //calls the function just created

// Define a CSS class for the active state of the genre buttons
const ACTIVE_CLASS = "active";

// Add an event listener to the button container
buttonContainerEl.addEventListener("click", (event) => {
	const target = event.target;

	// Check if the clicked element is a button within the button container
	if (target.matches("button")) {
		const isActive = target.classList.contains(ACTIVE_CLASS);

		// Toggle the active state of the button
		if (isActive) {
			target.classList.remove(ACTIVE_CLASS);
		} else {
			target.classList.add(ACTIVE_CLASS);
		}

		// Call the grabData function with the updated active genres
		grabData(getActiveGenres());
	}
});

buttonContainerEl.addEventListener("click", grabData); //waits for a click on any genre button
function grabData(event) {
	var localGenreIds = JSON.parse(localStorage.getItem("genreIds")); // Array list of genre ids already in local storage
	var genreID = event.target.dataset.genreid; // Get the genre ID from the clicked button
	localGenreIds.push(genreID); // Push the genreID onto the end of the list from local storage
	localStorage.setItem("genreIds", JSON.stringify(localGenreIds)); // Update the genreIds in local storage
	var genreString = localGenreIds.toString(); // Convert the genreIds to a string
	console.log("the string in local storage: " + genreString);
	getTitleByGenre(genreString); // Call the function to get movie titles by genre
}
//possible rework of grabdata to include toggling
// function grabData(event) {
// 	var localGenreIds = JSON.parse(localStorage.getItem("genreIds")); // Array list of genre ids already in local storage
// 	var genreID = event.target.dataset.genreid; // Get the genre ID from the clicked button

// 	var index = localGenreIds.indexOf(genreID);
// 	if (index > -1) {
// 	  localGenreIds.splice(index, 1); // Remove the genreID from the array
// 	} else {
// 	  localGenreIds.push(genreID); // Add the genreID to the array
// 	}

// 	localStorage.setItem("genreIds", JSON.stringify(localGenreIds)); // Update the genreIds in local storage
// 	var genreString = localGenreIds.toString(); // Convert the genreIds to a string
// 	console.log("the string in local storage: " + genreString);
// 	getTitleByGenre(genreString); // Call the function to get movie titles by genre
//   }

//The following function calls Advanced Movie Search with the collected genre IDs
function getTitleByGenre(genreString) {
	var genreURL = //This is the url needed for our first API call for movies by genre.
		"https://advanced-movie-search.p.rapidapi.com/discover/movie?with_genres=" +
		genreString +
		"&page=1";

	const options = {
		method: "GET",
		headers: {
			"X-RapidAPI-Key": "5cec1b6fafmsh96cbe5417d10614p139e32jsn36f6496e92fe", //Jayden's limited API key
			"X-RapidAPI-Host": "advanced-movie-search.p.rapidapi.com",
		},
	};
	fetch(genreURL, options)
		.then(function (response) {
			if (!response.ok) {
				throw response.json();
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
			originalTitle = genreObject.results[randomIndex].original_title;
			overView = genreObject.results[randomIndex].overview;
			voteAverage = genreObject.results[randomIndex].vote_average;
			posterPath = genreObject.results[randomIndex].poster_path;
			document.querySelector("#original_title").textContent = originalTitle;
			document.querySelector("#overview").textContent = overView;
			document.querySelector("#vote_average").textContent = voteAverage;
			document
				.querySelector(".poster")
				.children[0].children[0].setAttribute("src", posterPath);
			// console.log(
			// 	"about to get detailed response, which could give information we need for the trailer url, the stretch goal"
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

//save movie in local storage, etc
var watchItButton = document.getElementById("watch-movie");
var saveMovie = document.getElementById("save-movie");
var theSavedMovie = document.getElementById("saved-movie");
var remoteImg = document.getElementById("remote");
var movieBox = document.getElementById("streaming-avail");
var wholeMovieSection = document.getElementById("poster-section");
var suggestMovieBtn = document.getElementById("suggest-movie-btn");
var startOverBtn = document.getElementById("Start-over");
//Console log test
function printConsole() {
	console.log("test");
}
//Reveals buttons and movie information on remote click
remoteImg.addEventListener("click", function revealMain() {
	var mainBody = document.querySelector("main");
	mainBody.style.display = "block";
	wholeMovieSection.style.display = "none";
	movieBox.style.display = "none";
	pickGenre.scrollIntoView(true);
});

suggestMovieBtn.addEventListener("click", function revealMovies() {
	wholeMovieSection.style.display = "block";
	movieBox.style.display = "block";
	movieBox.style.display = "flex";
	streamingAvail.scrollIntoView(true);
});

startOverBtn.addEventListener("click", function hideMovies() {
	wholeMovieSection.style.display = "none";
	movieBox.style.display = "none";
	sessionStorage.removeItem("genreIds");
	localStorage.setItem("genreIds", "[]");
});

// Fills sidebar with currently selected movie information (Might need to delete later)
function clickWatchButton() {
	var poster = document.getElementById("poster-img").src;
	var title = document.getElementById("original_title").textContent;
	var overview = document.getElementById("overview").textContent;
	var vote = document.getElementById("vote_average").textContent;
	//Reveals the movie box
	movieBox.style.display = "block";
	movieBox.style.display = "flex";

	//Targets the sidebar and fills with their original information above
	document.getElementById("poster-img2").src = poster;
	document.getElementById("original_title2").textContent = title;
	document.getElementById("overview2").textContent = overview;
	document.getElementById("vote_average2").textContent = [
		"Rating: " + vote + "/10",
	];
}

//Stores currently displayed movie into localStorage
function saveMyMovie() {
	// Clears local storage first if it contains previous movie
	if (localStorage !== null) {
		localStorage.clear();
	}
	var captureMovieElements = {
		posterEl: document.getElementById("poster-img2").src,
		titleEl: document.getElementById("original_title2").textContent,
		overviewEl: document.getElementById("overview2").textContent,
		voteEl: document.getElementById("vote_average2").textContent,
	};

	localStorage.setItem("saved movie", JSON.stringify(captureMovieElements));
}

function showMyMovie() {
	var lastMovie = JSON.parse(localStorage.getItem("saved movie"));
	console.log(lastMovie);
	document.getElementById("modal-poster").src = lastMovie.posterEl;
	document.getElementById("modal-movie-name").textContent = lastMovie.titleEl;
	document.getElementById("modal-movie-plot").textContent =
		lastMovie.overviewEl;
	document.getElementById("modal-movie-rating").textContent = lastMovie.voteEl;
}
suggestMovieBtn.addEventListener("click", clickWatchButton);
saveMovie.addEventListener("click", saveMyMovie);
theSavedMovie.addEventListener("click", showMyMovie);
