// rubbing.js

// Get the lamp image element
const lampImage = document.querySelector(".suggest-movie-btn");

// Declare variables
let timerId;
let isMouseMoving = false;
let currentCloudIndex = 1;
let timerCount = 0;

// Start the timer when the mouse enters the lamp image
lampImage.addEventListener("mouseenter", startTimer);

// Reset the timer and animation when the mouse leaves the lamp image
lampImage.addEventListener("mouseleave", resetTimer);

// Add the event listener for mousemove only when the mouse is within the lamp image
lampImage.addEventListener("mousemove", handleMouseMove);

// Function to start the timer and animation when the mouse enters the lamp image
function startTimer() {
	console.log("Mouse entered the lamp image.");
	isMouseMoving = true; // Set the flag to indicate mouse movement
	timerId = setInterval(updateTimer, 100); // Start the timer and update every 100 milliseconds (0.5 seconds)
}
// Function to pause the timer
function pauseTimerFunc() {
	if (timerId) {
		// Only clear the timer if it's currently running
		console.log("Timer paused at", timerCount, "milliseconds.");
		clearInterval(timerId); // Clear the timer
		timerId = null; // Set timerId to null to indicate the timer is not currently running
	}
}

// Function to resume the timer
function resumeTimer() {
	if (!timerId) {
		// Only resume the timer if it's currently not running
		console.log("Timer resumed at", timerCount, "milliseconds.");
		timerId = setInterval(updateTimer, 50); // Start the timer and update every 50 milliseconds (0.05 seconds)
	}
}
// Function to reset the timer and animation when the mouse leaves the lamp image
function resetTimer() {
	console.log("Mouse left the lamp image.");
	clearInterval(timerId); // Clear the timer
	isMouseMoving = false; // Reset the flag for mouse movement
	currentCloudIndex = 1; // Reset the cloud image index
	lampImage.src = "./lamp.png"; // Reset the lamp image source
	timerCount = 0; // Reset the timer count
}

// Handling mouse movement.
// variable to keep track of when mouse was last moved
let lastMouseMove = null;
let pauseTimer = null;
// Function to handle mouse movement on the document
function handleMouseMove(event) {
	// If the mouse was not moving before but is moving now, resume the timer.
	if (!isMouseMoving) {
		isMouseMoving = true;
		resumeTimer();
	}

	// Whenever mouse is moved, reset lastMouseMove time.
	lastMouseMove = Date.now();

	// If pauseTimer already exists, clear it so it can be reset
	if (pauseTimer) {
		clearTimeout(pauseTimer);
	}

	// Set a timer to pause the main timer if no further mousemove event is received in the next 100ms
	pauseTimer = setTimeout(function () {
		if (Date.now() - lastMouseMove > 100) {
			isMouseMoving = false;
			pauseTimerFunc();
		}
	}, 100);
}

// Function to change the cloud image in the lamp image
function changeCloudImage() {
	currentCloudIndex =
		currentCloudIndex === cloudFrames.length ? 1 : currentCloudIndex + 1; // Update the current cloud index, looping from 1 to the total number of frames
	lampImage.src = `./clouds/${cloudFrames[currentCloudIndex - 1]}`; // Set the lamp image source to the current cloud image
}

let frameCounter = 0; //this is a way to slow down my cloud image animation frame rate
// Function to update the timer count and trigger suggestMovieEvent when the timer reaches 4000 milliseconds
function updateTimer() {
	if (isMouseMoving) {
		timerCount += 50; // Increment the timer count by 50 milliseconds (0.05 seconds)
		frameCounter++; // Increment the frame counter

		// Change the cloud image every x updates (roughly every half a second)
		if (frameCounter % 10 === 0) {
			changeCloudImage();
		}

		if (timerCount === 2000) {
			console.log("Timer reached 2000 milliseconds.");
		} else if (timerCount >= 4000) {
			console.log("Timer reached 4000 milliseconds.");
			clearInterval(timerId); // Clear the timer when it reaches 4000 milliseconds
			triggerSuggestMovieEvent(); // Trigger the suggestMovieEvent
			timerCount = 0; // Reset the timer count
		}
	}
}

// Function to trigger the suggestMovieEvent
function triggerSuggestMovieEvent() {
	console.log("Suggesting movie event triggered.");
	const suggestMovieEvent = new Event("suggestMovieEvent"); // Create a new custom event
	document.dispatchEvent(suggestMovieEvent); // Dispatch the custom event on the document
}

// Define the cloud frames for the animation
const cloudFrames = [
	"cloud1.png",
	"cloud2.png",
	"cloud3.png",
	"cloud4.png",
	"cloud5.png",
	"cloud6.png",
	"cloud7.png",
	"cloud6.png",
	"cloud5.png",
	"cloud4.png",
	"cloud3.png",
	"cloud2.png",
	"cloud1.png",
];
