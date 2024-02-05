

// -------------------------- Background Refrash
document.addEventListener("DOMContentLoaded", function() {
    // Array of possible colors
    const colors = ["#B4D700", "#3498db", "#e74c3c", "#2ecc71", "#f39c12", "#9b59b6", "#ffb400","#f08f74","#ff4a54","#55e6a5","#5b78f6"];
    // Get the element to change its color
    const colorChangeElement = document.getElementById("colorChangeElement");
  
    // Generate a random index to pick a color from the array
    const randomIndex = Math.floor(Math.random() * colors.length);
  
    // Set the --primary-bg-light variable to the selected color
    document.documentElement.style.setProperty('--primary-bg-light', colors[randomIndex]);
  });


// -------------------------- ASCII Effects
