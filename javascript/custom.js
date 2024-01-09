


  $(document).ready(function() {
    // Generate a random HSL color
    var randomHSLColor = "hsla(" + Math.floor(Math.random() * 360) + ", 75%, 65%, 5)";
    
  
    // Set the custom CSS property '--primary-bg-light' on the root element
    document.documentElement.style.setProperty('--primary-bg-light', randomHSLColor);
  });