//---------------------------------
// Your own functions here
//---------------------------------

//------------------------------------------------
// Call this function when the "logout" button is clicked
//-------------------------------------------------
/**
 * Logs out the currently authenticated user.
 * @returns {void}
 */
function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("logging out user");
    }).catch((error) => {
        // An error happened.
    });
}



// Event listener for scroll
window.onscroll = function () {
    scrollFunction();
};

var scrollToTopButton = document.getElementById("scrollToTopButton");

/**
 * Function to display the 'scroll to top' button based on the scroll position.
 * @returns {void}
 */
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopButton.style.display = "flex";
    } else {
        scrollToTopButton.style.display = "none";
    }
}

/**
 * Function to instantly scroll to the top of the page.
 * @returns {void}
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'instant'
    });
}