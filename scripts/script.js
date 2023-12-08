//---------------------------------
// Your own functions here
//---------------------------------

//------------------------------------------------
// Call this function when the "logout" button is clicked
//-------------------------------------------------
function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("logging out user");
      }).catch((error) => {
        // An error happened.
      });
}

var scrollToTopButton = document.getElementById("scrollToTopButton");

window.onscroll = function () {
    scrollFunction();
};

// Function to display 'scroll to top' element
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopButton.style.display = "flex";
    } else {
        scrollToTopButton.style.display = "none";
    }
}

// Function to instantly scroll to top of page
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'instant'
    });
}