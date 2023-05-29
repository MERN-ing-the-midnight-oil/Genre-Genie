var lamp = document.querySelector("#lamp");
var pickGenre = document.querySelector(".pick-genre");
var suggestBtn = document.querySelector("#suggest-movie-btn");
var suggestedMovie = document.querySelector("#your-movie");
var buttonContainerEl = document.querySelector("#all-buttons");
var genreButtons = document.querySelectorAll(".genre-button");
var posterSection = document.querySelector("#poster-section");
var saveMovieButton = document.createElement("button"); // Create a 'save this movie for later' button

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
//suggestBtn.addEventListener("click", suggestMovie);
document.addEventListener("suggestMovieEvent", suggestMovie);

// Function to suggest a movie
function suggestMovie() {
	console.log(
		"the function suggestMovie has been called, probably by rubbing.js"
	);
	const activeGenres = getActiveGenres(); // Get the current active genre IDs
	const genreString = activeGenres.toString(); // Convert the genre IDs to a string
	// Call the function to get movie titles from the API
	getTitleByGenre(genreString);

	// Hide the suggest movie button
	suggestBtn.classList.add("hidden");

	// Reveal the poster section
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
			//stretch goal for getting the poster path from getDetailedResponse query to stream a preview for the suggested movie
			// console.log(
			// 	"About to give the suggested movie_id to Advanced Movie Search getDetailedResponse"
			// );
			// getDetailedResponse(movie_id);
		});
}
var resetButton = document.createElement("button"); // Create a reset button
resetButton.textContent = "Rub the lamp again for a new suggestion";
resetButton.id = "reset-btn";

// Function to handle the click event on the "rub-again-btn" button
function handleRubAgainClick() {
	// Empty the genreIds array in local storage
	localStorage.setItem("genreIds", "[]");

	// Reset the genre buttons
	const genreButtons = document.querySelectorAll(".genre-button");
	genreButtons.forEach((button) => button.classList.remove("active"));

	// Hide the movie suggestion section
	const posterSection = document.getElementById("poster-section");
	const hideForNowSection = document.getElementById("hideForNow");
	posterSection.classList.add("hidden");
	hideForNowSection.classList.add("hidden");

	// Show the genre selection section
	const pickGenreSection = document.querySelector(".pick-genre");
	pickGenreSection.classList.remove("hidden");

	// Reload the page
	location.reload();
}

// Add event listener to the "rub-again-btn" button
const rubAgainBtn = document.querySelector("#rub-again-btn");
rubAgainBtn.addEventListener("click", handleRubAgainClick);

//Add event listener to the "save movie" button
document.getElementById("save-movie-btn").addEventListener("click", saveMovie);

function saveMovie() {
	var savedMovies = JSON.parse(localStorage.getItem("savedMovies")) || []; // Array list of saved movies already in local storage
	var currentMovie = {
		title: document.querySelector("#original_title").textContent, // Get the current movie title from the DOM
		image: document.querySelector(".poster").children[0].children[0].src, // Get the current movie poster image path from the DOM
	};

	var movieExists = savedMovies.find(
		(movie) => movie.title === currentMovie.title
	);
	if (!movieExists) {
		savedMovies.push(currentMovie); // Add the current movie to the array if it is not already there
	}

	localStorage.setItem("savedMovies", JSON.stringify(savedMovies)); // Update the savedMovies in local storage with the new movie
	console.log("Saved movies: " + JSON.stringify(savedMovies));
}

function displaySavedMovies() {
	var savedMovies = JSON.parse(localStorage.getItem("savedMovies")) || []; // Get the saved movies from local storage

	var carousel = document.querySelector("#saved-movies-carousel"); // Get the carousel element from the DOM. Replace '#saved-movies-carousel' with the actual selector for your carousel.

	savedMovies.forEach((movie) => {
		// For each movie, create an img element for the poster and a p element for the title, and append them to the carousel.
		var poster = document.createElement("img");
		poster.src = movie.image;
		poster.alt = movie.title;
		poster.className = "carousel-poster"; // Add a class for styling the poster image. You can replace 'carousel-poster' with whatever class name you want.

		var title = document.createElement("p");
		title.textContent = movie.title;
		title.className = "carousel-title"; // Add a class for styling the movie title. You can replace 'carousel-title' with whatever class name you want.

		var movieContainer = document.createElement("div");
		movieContainer.className = "carousel-movie"; // Add a class for styling the movie container. You can replace 'carousel-movie' with whatever class name you want.

		movieContainer.appendChild(poster);
		movieContainer.appendChild(title);
		carousel.appendChild(movieContainer);
	});
}
