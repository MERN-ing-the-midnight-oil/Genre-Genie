var lamp = document.querySelector("#lamp");
var pickGenre = document.querySelector(".pick-genre");
//  smoothly scroll to bring the 'pick-genre' section into view when user engages with pick-genre section.
pickGenre.addEventListener("click", function () {
	pickGenre.scrollIntoView({ behavior: "smooth" });
});
var suggestBtn = document.querySelector("#suggest-movie-btn");
var suggestedMovie = document.querySelector("#your-movie");
var buttonContainerEl = document.querySelector("#all-buttons");
var genreButtons = document.querySelectorAll(".genre-button");
var posterSection = document.querySelector("#poster-section");
var saveMovieButton = document.createElement("button"); // Create a 'save this movie for later' button

function displaySavedMovies() {
	console.log("displaySavedMovies has been called");
	var savedMoviesList = document.getElementById("saved-movies-list");
	savedMoviesList.innerHTML = ""; // Clear the list so already displayed movies are not pushed again.
	var savedMovies = JSON.parse(localStorage.getItem("savedMovies")) || []; // Get the saved movies from local storage
	console.log(
		"the number of saved movies in the savedMovies array locally is: ",
		savedMovies.length
	);

	savedMovies.forEach((movie, index) => {
		// Create the movie link
		var movieLink = document.createElement("a");
		movieLink.textContent = movie.title;
		movieLink.href = "#";
		movieLink.className = "saved-movie-link"; // Assign the class to the movie link
		movieLink.addEventListener("click", function (event) {
			console.log(
				`Clicked movie link for: ${movie.title} with index: ${index}`
			);
			event.preventDefault();
			displayMovieDetails(index);
		});
		// Create the delete button
		var deleteButton = document.createElement("button");
		deleteButton.innerHTML = '<i class="fa fa-trash"></i>'; // Add an icon (assuming you're using Font Awesome)
		deleteButton.className = "delete-btn";
		deleteButton.addEventListener("click", function (event) {
			event.preventDefault();
			// Remove movie from savedMovies array
			savedMovies.splice(index, 1);
			// Update local storage
			localStorage.setItem("savedMovies", JSON.stringify(savedMovies));
			// Call displaySavedMovies again to refresh the list
			displaySavedMovies();
		});

		// Create a container div for movie link and delete button
		var movieDiv = document.createElement("div");
		movieDiv.className = "movie-container";
		movieDiv.appendChild(movieLink);
		movieDiv.appendChild(deleteButton);

		// Append the container div to the list
		savedMoviesList.appendChild(movieDiv);
	});
}

displaySavedMovies(); //call displaySavedMovies- populate the list on page load if there is one

function displayMovieDetails(index) {
	var savedMovies = JSON.parse(localStorage.getItem("savedMovies")) || []; // Get the saved movies from local storage
	var movie = savedMovies[index]; // Get the selected movie
	console.log(
		`Displaying details for movie: ${movie.title} at index: ${index}`
	);
	// Get the movie details section elements
	var detailsTitle = document.getElementById("details-title");
	var detailsImage = document.getElementById("details-image");
	var detailsRating = document.getElementById("details-rating");
	var detailsSynopsis = document.getElementById("details-synopsis");
	var trailerLink = document.querySelector("#streaming-content"); // New line to get the trailer link element

	// Set the movie details
	detailsTitle.textContent = movie.title;
	detailsImage.src = movie.image;
	detailsRating.textContent = movie.rating;
	detailsSynopsis.textContent = movie.synopsis;

	// Set the trailer URL (only if it exists for the movie)
	if (trailerLink && movie.trailer) {
		trailerLink.href = movie.trailer;
		trailerLink.textContent = "Click to Watch Movie Trailer";
	} else if (trailerLink) {
		// Handle case where there's no trailer for the movie
		trailerLink.href = "#";
		trailerLink.textContent = "Trailer not available";
	}

	// Show the movie details section and hide the saved movies list
	document.getElementById("movie-details").style.display = "block";
	document.getElementById("saved-movies-list").style.display = "none";
}

// Add event listeners to the "back" buttons
document
	.getElementById("back-btn")
	.addEventListener("click", handleBackButtonClick);
document
	.getElementById("back-btn-bottom")
	.addEventListener("click", handleBackButtonClick);

function handleBackButtonClick() {
	// Hide the movie details section and show the saved movies list
	document.getElementById("movie-details").style.display = "none";
	document.getElementById("saved-movies-list").style.display = "block";
}

// Function to handle the page load event to load saved movies
function handlePageLoad() {
	// Call the function to display the saved movies
	console.log("running handlePageLoad and therefore displaySavedMovies");
	displaySavedMovies();
}
// Event listener for the page load event
window.addEventListener("DOMContentLoaded", handlePageLoad);

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

//Updating the genre
function updateGenresInStorage(event) {
	var localGenreIds = JSON.parse(localStorage.getItem("genreIds")); // Array list of genre ids already in local storage
	var genreID = event.target.dataset.genreid; // Get the genreID from the clicked button. DO NOT CHANGE "genreid" to "genreID" in a logical attempt to match the HTML data attribute.

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
		updateGenresInStorage(event);
	}
});

// Event listener for suggest movie button click
//suggestBtn.addEventListener("click", suggestMovie);
document.addEventListener("suggestMovieEvent", suggestMovie);

// Function to suggest a movie
function suggestMovie() {
	const activeGenres = getActiveGenres(); // Get the current active genre IDs
	const genreString = activeGenres.toString(); // Convert the genre IDs to a string
	// Check if there are at least two genre IDs selected
	if (activeGenres.length < 2) {
		alert("Select at least two genres");
		return;
	}
	// Call the function to get movie titles from the API
	getTitleByGenre(genreString);

	// Hide the suggest movie button
	suggestBtn.classList.add("hidden");

	// Reveal the poster section
	posterSection.style.display = "block";
}

//Gets movie titles from the API

function getTitleByGenre(genreString) {
	var genreURL = //This is the url needed for our first API call for movies by genre.
		"https://advanced-movie-search.p.rapidapi.com/discover/movie?with_genres=" +
		genreString +
		"&page=1";

	const options = {
		method: "GET",
		headers: {
			//normally I would use a backend to interact with an API, but I don't care about this API key, I can't think of how a bad actor could abuse it.
			"X-RapidAPI-Key": "ab5fb0b08dmsh801b30df51c049dp15ea7ejsn09d021675790", //Rhys' key, limited to 500 per month
			//"X-RapidAPI-Key": "5cec1b6fafmsh96cbe5417d10614p139e32jsn36f6496e92fe", //Jayden's key, maxed out on june 2nd 2023
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
			if (genreObject.results.length === 0) {
				alert(
					"I have a confession. I couldn't find a movie fitting all those genres because... I can't actually work miracles. Please pick fewer genres and rub again."
				);
				return;
			}

			//the genre object should have many titles, overviews, and movie posters.
			var randomIndex = Math.floor(Math.random() * genreObject.results.length);
			//the randomIndex is like a bookmark that lets us pick a movie at random from a long list of movies and repeatedly come back to it to collect different pieces of information pertaining to that particular movie- specifically the title, original title, overview (movie summary), and vote average.
			//future goal: sort by movie rating instead of choosing one movie at random from the genre object
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
			console.log(
				"About to give the suggested movie_id to Advanced Movie Search getDetailedResponse"
			);
			getDetailedResponse(movie_id);
		});
}
//getDetailedResponse will take the regular movie id and give a IMDB movie ID that we need for getStreamsbyIMDBId
function getDetailedResponse(movie_id) {
	var detailedURL =
		"https://advanced-movie-search.p.rapidapi.com/movies/getdetails?movie_id=" +
		movie_id;
	const options3 = {
		method: "GET",
		headers: {
			"X-RapidAPI-Key": "5cec1b6fafmsh96cbe5417d10614p139e32jsn36f6496e92fe", //Jayden's limited API key
			"X-RapidAPI-Host": "advanced-movie-search.p.rapidapi.com",
		},
	};
	fetch(detailedURL, options3)
		.then(function (response) {
			if (!response.ok) {
				throw response.json();
			}
			return response.json();
		})
		.then(function (detailedObject) {
			//find the data we need in the object
			console.log(detailedObject);
			var IMDBID = detailedObject.imdb_id;

			//if the IMDBID is null, then start over!
			console.log("The IMDBID IS :" + IMDBID);
			console.log(
				"ABOUT TO START THE FETCH FUNCTION THAT GETS STREAM SOURCES FROM MBDLIST USING MBDID"
			);
			getStreamsByIMDBID(IMDBID); //call the final function that gets streaming data given an IMDBID.
		});
}
function getStreamsByIMDBID(IMDBID) {
	var getByIMDBidURL = "https://mdblist.p.rapidapi.com/?i=" + IMDBID;

	const options = {
		method: "GET",
		headers: {
			"X-RapidAPI-Key": "5cec1b6fafmsh96cbe5417d10614p139e32jsn36f6496e92fe", //Jayden's limited API key
			"X-RapidAPI-Host": "mdblist.p.rapidapi.com",
		},
	};

	console.log("Fetching data from: ", getByIMDBidURL);

	fetch(getByIMDBidURL, options)
		.then(function (response) {
			console.log("Response received from fetch: ", response);
			if (!response.ok) {
				console.log("Response is not OK. Throwing error...");
				throw response.json();
			}
			console.log("Response is OK. Converting to JSON...");
			return response.json();
		})
		.then(function (imdbObject) {
			console.log("Received JSON data: ", imdbObject);

			if (imdbObject && imdbObject.trailer) {
				var movieDetailsSection = document.querySelector("#movie-details");
				var streamingContent = document.createElement("a"); // Create new 'a' element
				streamingContent.id = "streaming-content"; // Assign id
				streamingContent.textContent = "Click to Watch Movie Trailer"; // Set link text
				streamingContent.href = imdbObject.trailer; // Set the href to the trailer URL

				streamingContent.addEventListener("click", function (event) {
					console.log(
						`Clicked streaming content for movie with IMDBID: ${imdbObject.trailer}`
					);
					event.preventDefault();
					window.open(imdbObject.trailer); // Open the trailer URL
				});

				movieDetailsSection.appendChild(streamingContent); // Append the link to the movie details section

				// Add the trailer link to the poster section:
				const trailerPlaceholder = document.getElementById(
					"trailer-placeholder"
				);
				const clonedStreamingContent = streamingContent.cloneNode(true);
				trailerPlaceholder.innerHTML = ""; // Clear any previous content
				trailerPlaceholder.appendChild(clonedStreamingContent); // Append the cloned link to the trailer-placeholder
			} else {
				console.log("No trailer available for this movie");

				// Create a text element with the error message
				var errorMessage = document.createElement("p");
				errorMessage.textContent =
					"Sorry, I couldn't conjure a trailer for this title.";

				// Append the error message to the movie details section
				movieDetailsSection.appendChild(errorMessage);

				// Add the error message to the poster section
				const trailerPlaceholder = document.getElementById(
					"trailer-placeholder"
				);
				const clonedErrorMessage = errorMessage.cloneNode(true);
				trailerPlaceholder.innerHTML = ""; // Clear any previous content
				trailerPlaceholder.appendChild(clonedErrorMessage);
			}
		})
		.catch(function (error) {
			console.log("An error occurred during fetch: ", error);
		});
}

var resetButton = document.createElement("button"); // Create a reset button
resetButton.textContent = "Rub the lamp again for a new suggestion";
resetButton.id = "rub-again-btn";

// Function to handle the click event on the "rub-again-btn" button
function handleRubAgainClick() {
	// Empty the genreIds array in local storage
	localStorage.setItem("genreIds", "[]");

	// Reset the genre buttons
	const genreButtons = document.querySelectorAll(".genre-button");
	genreButtons.forEach((button) => button.classList.remove("active"));

	// Hide the movie suggestion section
	const posterSection = document.getElementById("poster-section");
	posterSection.classList.add("hidden");

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
	var trailerElement = document.querySelector("#streaming-content");
	var trailerUrl = trailerElement ? trailerElement.href : null;

	var savedMovies = JSON.parse(localStorage.getItem("savedMovies")) || [];
	var currentMovie = {
		title: document.querySelector("#original_title").textContent,
		image: document.querySelector(".poster").children[0].children[0].src,
		rating: document.querySelector("#vote_average").textContent,
		synopsis: document.querySelector("#overview").textContent,
		trailer: trailerUrl,
	};

	var movieExists = savedMovies.find(
		(movie) => movie.title === currentMovie.title
	);
	if (!movieExists) {
		savedMovies.push(currentMovie);
	}

	localStorage.setItem("savedMovies", JSON.stringify(savedMovies));
	console.log("Saved movies: " + JSON.stringify(savedMovies));

	displaySavedMovies();
}
