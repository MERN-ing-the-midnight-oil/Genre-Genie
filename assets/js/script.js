var buttonContainerEl = document.querySelector("#all-buttons");
var posterPath = null; //posterPath gets used during getTitleByGenre but needs to be global, so its up here.



///Proposed expansion of genre buttons////////////////////////////////////////////////// Rhys thinks it would be cool to recommend movies based on multiple preferred genres. the following is a possible expanded version of grabData. instead of just running our program on one genre button, it will allow the user to select multiple genre buttons before submitting them. It could use buttons that toggle colors when pressed and unpressed. maybe it should use local storage to store the genre values.
//localStorage.clear(); //start with a clean slate is optional in case buttons are not toggles. 
function createEmptyStorage() {
localStorage.setItem("genreIds","[]")
}
createEmptyStorage();


buttonContainerEl.addEventListener("click", grabData);
function grabData(event) 
{ 
var localGenreIds= JSON.parse(localStorage.getItem("genreIds"));//this an array made from the string in local storage
		var genreID = event.target.dataset.genreid;
		localGenreIds.push(genreID)//this will push genreID onto the end of the array. 
		console.log("genreID after a click:  "+ genreID);
			localStorage.setItem("genreIds", JSON.stringify(localGenreIds));//localGenreIds is an array data typ
}

//build a string from whats in local storage


function getTitleByGenre(genreID) {
	//gets a movie title given a genreCodeString
	var genreCodeString = genreID; //for now genreCodeStriing just gets genreID, a single genre ID, but can already take a series of genre codes separated by commas. genreCodeString could be reset to assemble a string from local storage
	var genreURL = //This is the url needed for our first API call for movies by genre.
		"https://advanced-movie-search.p.rapidapi.com/discover/movie?with_genres=" +
		genreCodeString +
		"&page=1";

	const options = {
		//This is information the API needs for the call
		method: "GET",
		headers: {
			"X-RapidAPI-Key": "ab5fb0b08dmsh801b30df51c049dp15ea7ejsn09d021675790",
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
			//the parsed object is full of information like titles, overviews, and movie posters.
			var randomIndex = Math.floor(Math.random() * genreObject.results.length);
			//the randomIndex is like a bookmark that lets us pick a movie at random from a long list of movies and repeatedly come back to it to collect different pieces of information pertaining to that particular movie- specifically the title, original title, overview (movie summary), and vote average.
			var title = genreObject.results[randomIndex].title;
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
			//getWatchModeId(title); //calls the next API call function. "title" is the only var from here that it will need.
		});
}
getTitleByGenre(); //calling the function

function getWatchModeId(title) {
	var watchIdURL = //this is the url that we need for the next API call
		"https://watchmode.p.rapidapi.com/search/?search_field=name&search_value=" +
		title;
	const options2 = {
		method: "GET",
		headers: {
			"X-RapidAPI-Key": "ab5fb0b08dmsh801b30df51c049dp15ea7ejsn09d021675790",
			"X-RapidAPI-Host": "watchmode.p.rapidapi.com",
		},
	};
	fetch(watchIdURL, options2)
		.then(function (response) {
			if (!response.ok) {
				throw response.json();
			}
			return response.json();
		})
		.then(function (watchIdObject) {
			console.log(watchIdObject);
			var watchModeId = watchIdObject.title_results[0].id; //keeping the array index at zero seems to get us the most relevant title, i.e. "shrek" not "shrek 2"
			getStreamSources(JSON.stringify(watchModeId));
		});
}

//getStreamSources takes a seven digit Watchmode ID and give where to watch, buy or rent, and price. It also uses the watchmode API.
function getStreamSources(watchModeId) {
	console.log(
		"this is getStreamSources (our third and last call function) receiving a single watchModeId from getWatchModeId:   " +
			watchModeId
	);
	var getStreamURL =
		"https://watchmode.p.rapidapi.com/title/" + watchModeId + "/sources/";

	const options = {
		method: "GET",
		headers: {
			regions: "US",
			//"X-RapidAPI-Key": "ab5fb0b08dmsh801b30df51c049dp15ea7ejsn09d021675790",
			"X-RapidAPI-Key": "ab5fb0b08dmsh801b30df51c049dp15ea7ejsn09d021675790",
			"X-RapidAPI-Host": "watchmode.p.rapidapi.com",
		},
	};
	fetch(getStreamURL, options)
		.then(function (response) {
			if (!response.ok) {
				throw response.json();
			}
			return response.json();
		})
		.then(function (sourcesObject) {
			console.log(sourcesObject);
			// var streamSource = "Zamazon"; //sourcesObject[0].name;
			// var streamPrice = "three hundred pennies"; //sourcesObject[0].price;
			// var ownership = "Rent-to-own"; //sourcesObject[0].type;
			// // document.querySelector("#streamSource").textContent = streamSource;
			// // document.querySelector("#streamPrice").textContent = streamSource;
			//document.querySelector("#ownership").textContent = ownership;

			for (let i = 0; i < sourcesObject.length; i++) {
				var streamSource = sourcesObject[i].name;
				var streamPrice = sourcesObject[i].price;
				var ownership = sourcesObject[i].type;
				var streamSentence =
					ownership +
					" this movie on " +
					streamSource +
					" for " +
					streamPrice +
					"------";
				console.log(streamSentence);
				document.querySelector("#streamSentence").textContent = streamSentence;
			}
		});
}

//expand for list of genre codes
// {
// 	"genres": [
// 	  {
// 		"id": 28,
// 		"name": "Action"
// 	  },
// 	  {
// 		"id": 12,
// 		"name": "Adventure"
// 	  },
// 	  {
// 		"id": 16,
// 		"name": "Animation"
// 	  },
// 	  {
// 		"id": 35,
// 		"name": "Comedy"
// 	  },
// 	  {
// 		"id": 80,
// 		"name": "Crime"
// 	  },
// 	  {
// 		"id": 99,
// 		"name": "Documentary"
// 	  },
// 	  {
// 		"id": 18,
// 		"name": "Drama"
// 	  },
// 	  {
// 		"id": 10751,
// 		"name": "Family"
// 	  },
// 	  {
// 		"id": 14,
// 		"name": "Fantasy"
// 	  },
// 	  {
// 		"id": 36,
// 		"name": "History"
// 	  },
// 	  {
// 		"id": 27,
// 		"name": "Horror"
// 	  },
// 	  {
// 		"id": 10402,
// 		"name": "Music"
// 	  },
// 	  {
// 		"id": 9648,
// 		"name": "Mystery"
// 	  },
// 	  {
// 		"id": 10749,
// 		"name": "Romance"
// 	  },
// 	  {
// 		"id": 878,
// 		"name": "Science Fiction"
// 	  },
// 	  {
// 		"id": 10770,
// 		"name": "TV Movie"
// 	  },
// 	  {
// 		"id": 53,
// 		"name": "Thriller"
// 	  },
// 	  {
// 		"id": 10752,
// 		"name": "War"
// 	  },
// 	  {
// 		"id": 37,
// 		"name": "Western"
// 	  }
// 	]
//   }
