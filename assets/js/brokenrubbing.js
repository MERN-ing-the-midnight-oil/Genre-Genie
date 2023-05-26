// Get references to the necessary elements
var suggestMovieBtn = document.getElementById("suggest-movie-btn");
var lampImage = document.querySelector("#suggest-movie-btn img");

var cursorOverLamp = false; // Flag to track if the cursor is over the lamp image
var cursorInMotion = false; // Flag to track if the cursor is in motion
var movementStartTime = null; // Timestamp to store the start time of cursor movement
var cumulativeMovementTime = 0; // Total accumulated movement time
var threshold = 3000; // Three seconds threshold for accumulated movement time

// Event listeners for mouse enter and leave events on the lamp image
lampImage.addEventListener("mouseenter", handleMouseEnter);
lampImage.addEventListener("mouseleave", handleMouseLeave);

// Event listeners for mousemove and mouseout events on the lamp image
lampImage.addEventListener("mousemove", handleMouseMove);
lampImage.addEventListener("mouseout", handleMouseOut);

// Function to handle the mouseenter event on the lamp image
function handleMouseEnter() {
	cursorOverLamp = true;
}

// Function to handle the mouseleave event on the lamp image
function handleMouseLeave() {
	cursorOverLamp = false;
	resetMovementTracking();
}

// Function to handle the mousemove event on the lamp image
function handleMouseMove() {
	if (cursorOverLamp) {
		if (!cursorInMotion) {
			// Start tracking movement
			cursorInMotion = true;
			movementStartTime = performance.now();
			requestAnimationFrame(trackMovement);
		} else {
			// Calculate time difference between frames and accumulate movement time
			var currentTime = performance.now();
			var deltaTime = currentTime - movementStartTime;
			cumulativeMovementTime += deltaTime;
			movementStartTime = currentTime;

			if (cumulativeMovementTime >= threshold) {
				// Trigger suggestMovie event and reset movement tracking
				console.log("yo the suggestMovie event has been triggered");
				suggestMovie();
				resetMovementTracking();
			}
		}
	}
}

// Function to handle the mouseout event on the lamp image
function handleMouseOut() {
	if (cursorInMotion) {
		// Add time difference since the last frame to cumulative movement time
		var currentTime = performance.now();
		var deltaTime = currentTime - movementStartTime;
		cumulativeMovementTime += deltaTime;
	}
}

// Function to reset the movement tracking
function resetMovementTracking() {
	cursorInMotion = false;
	movementStartTime = null;
	cumulativeMovementTime = 0;
}
