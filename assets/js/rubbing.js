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

// Function to start the timer and animation when the mouse enters the lamp image
function startTimer() {
	console.log("Mouse entered the lamp image.");
	isMouseMoving = true; // Set the flag to indicate mouse movement
	timerId = setInterval(updateTimer, 500); // Start the timer and update every 500 milliseconds (0.5 seconds)
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

// Function to handle mouse movement on the document
function handleMouseMove(event) {
	if (isMouseMoving && event.target === lampImage) {
		// Reset the timer count on each mouse movement within the lamp image
		timerCount = 0;
	}
	if (isMouseMoving) {
		console.log("Mouse is moving within the lamp image.");
	}
}

// Add the event listener for mousemove only when the mouse is within the lamp image
lampImage.addEventListener("mousemove", handleMouseMove);

// Function to change the cloud image in the lamp image
function changeCloudImage() {
	currentCloudIndex =
		currentCloudIndex === cloudFrames.length ? 1 : currentCloudIndex + 1; // Update the current cloud index, looping from 1 to the total number of frames
	lampImage.src = `./clouds/${cloudFrames[currentCloudIndex - 1]}`; // Set the lamp image source to the current cloud image
	lampImage.style.width = "613px"; // Set the width of the lamp image
	lampImage.style.height = "391px"; // Set the height of the lamp image
}

// Function to update the timer count and trigger suggestMovieEvent when the timer reaches 3000 milliseconds
function updateTimer() {
	timerCount += 500; // Increment the timer count by 500 milliseconds (0.5 seconds)
	if (timerCount === 2000) {
		console.log("Timer reached 2000 milliseconds.");
	} else if (timerCount === 3000) {
		console.log("Timer reached 3000 milliseconds.");
		clearInterval(timerId); // Clear the timer when it reaches 3000 milliseconds
		triggerSuggestMovieEvent(); // Trigger the suggestMovieEvent
	}
	changeCloudImage(); // Change the cloud image during the timer
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
];
